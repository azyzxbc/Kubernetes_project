from rest_framework import status
from rest_framework.views import APIView
import mimetypes
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import *

from rest_framework.response import Response
from rest_framework import status

from .models import *
import json
from .utils import *
from pathlib import Path
import requests
from dotenv import load_dotenv
import os
from rest_framework.exceptions import ValidationError
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode,urlsafe_base64_encode
import jwt
from django.conf import settings 
import requests 
from get_talent.auth0backend import Auth0Authentication
#from authlib.integrations.django_client import OAuth

API_IDENTIFIER = settings.API_IDENTIFIER
class ProtectedAPIView(APIView):
    authentication_classes = [Auth0Authentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, format=None):
        return Response({
            "message": "You're authenticated!",
            "id_user": request.user.id_user,
            "client_id":request.user.client_id
        })
    
    def post(self, request, format=None):
        # Handle POST requests
        return Response({
            "message": "POST request received",
            "user_data": request.data
        })
    
dotenv_path = '.env.api'
load_dotenv(dotenv_path)
front_url=os.environ.get('front_url')

class TestAuth0View(ProtectedAPIView):

    def post(self, request):
        token=request.data["token"]
        header = jwt.get_unverified_header(token)
        jwks = requests.get(f'https://{settings.AUTH0_DOMAIN}/.well-known/jwks.json').json()
        public_key = None
        for jwk in jwks['keys']:
            if jwk['kid'] == header['kid']:
                public_key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(jwk))

        if public_key is None:
            raise Exception('Public key not found.')

        issuer = f'https://{settings.AUTH0_DOMAIN}/'

        decoded=jwt.decode(token, public_key, audience=API_IDENTIFIER, issuer=issuer, algorithms=['RS256'])
        return Response({"message": decoded}, status=status.HTTP_200_OK)
            
class ChangePasswordView(ProtectedAPIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            user = request.user
            new_password = serializer.validated_data['new_password']

            # Set the new password and save
            user.set_password(new_password)
            user.save()

            return Response({"detail": "Password has been successfully updated."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class PasswordResetRequestView(ProtectedAPIView):
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        user = User.objects.get(email=email)
        token = default_token_generator.make_token(user)
        uidb64=urlsafe_base64_encode(force_bytes(user.pk))
        
        # Generate a password reset link (customize URL to your front-end or API endpoint)
        reset_url = f'{front_url}/reset-password/{uidb64}/{token}'
        
        # Send the email
        send_email(email,"Password Reset Request",f"Use this link to reset your password: {reset_url}")
        
        return Response({"message": "Password reset link sent."}, status=status.HTTP_200_OK)
class PasswordResetConfirmView(ProtectedAPIView):
    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"error": "Invalid token or user ID"}, status=status.HTTP_400_BAD_REQUEST)
       
        if not default_token_generator.check_token(user, token):
            return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Set the new password
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response({"message": "Password has been reset successfully."}, status=status.HTTP_200_OK)
class CustomPagination(PageNumberPagination):
    page_size = 10  # Default items per page
    page_size_query_param = 'page_size'  # Allows the client to specify a custom page size
    max_page_size = 50  # Limit to prevent too much data on one page# Load a specific .env file




METHOD = os.environ.get('MATCHING_METHOD')
seuil = float(os.environ.get('SEUIL'))




class SetUserPasswordAPIView(ProtectedAPIView):
    def post(self, request):
        serializer = SetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'message': True, 'message': 'Password set successfully, Welcome to MatchNhire'}, status=status.HTTP_200_OK)
    

class TargetClientView(ProtectedAPIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination
    def get(self, request, id=None):
        if id is not None:
            return self.get_by_id(request, id)
        else:
            return self.get_all(request)

    def get_all(self, request):
        client_id=request.user.client_id
        target_clients = TargetClient.objects.all()
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(target_clients, request)
        if page is not None:
            serializer = TargetClientSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

    def get_by_id(self, request, id):
        target_client = self.get_object(id)
        if target_client:
            serializer = TargetClientSerializer(target_client)
            return Response(serializer.data)
        return Response(status=status.HTTP_404_NOT_FOUND)
class JobView(ProtectedAPIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination
    def post(self, request):
        client_id=request.user.client_id
        create_client_directories(client_id)

        des = request.data.get("destination").lower()
        note = request.data.get("note")
        start_date = request.data.get("start_date")
        target_client_id=request.data.get("target_client_id")
        jobDescription=request.data.get("description")
        if des not in ["post vacant", "placement"]:
            return Response({"error": "Invalid destination. Must be 'post vacant' or 'placement'."}, 
                            status=status.HTTP_400_BAD_REQUEST) 

        file = request.FILES.get('file')
        if (not file) and (not jobDescription):
            return Response({"error": "no file or description provided"}, status=status.HTTP_400_BAD_REQUEST)
        if file:
            file_type = mimetypes.guess_type(file.name)[0]
            if file_type not in ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']:
                return Response({"error": "Invalid file type. Only PDF, DOCX, and TXT files are allowed."}, status=status.HTTP_400_BAD_REQUEST)

        
        jobName=request.data.get("job_name")
        location=request.data.get("location")
        salaire_minimum=request.data.get("salaire_minimum")
        salaire_maximum=request.data.get("salaire_maximum")
        jobDestination=request.data.get("destination")
        note=request.data.get("note")
        job_status=request.data.get("job_status")
        start_date=request.data.get("start_date")
        target_client_id=request.data.get("target_client")
  
        job_id,jobexist=save_job(f"{jobName}.pdf",jobDestination,note,start_date,target_client_id,client_id)
        if not(jobexist):
            if(file):
                succeded,file_path=convert_file(file,job_id)
                if not succeded:
                        return Response(file_path,status=status.HTTP_400_BAD_REQUEST)
                link=upload_job_to_owncloud(f"{job_id}.pdf",file_path,client_id)
                text = extract(Path(file_path))
            else:
                joblocation = f"/code/{jobName}.pdf"
                create_pdf(jobDescription,joblocation)
                link=upload_job_to_owncloud(f"{job_id}.pdf",joblocation,client_id)
                text = jobDescription
            data = {
            'job_d': json.dumps(text),
            'client_id': client_id
            }
            succed,numpy_job_embedding=embed_job(data)
            if not succed:
                return Response(numpy_job_embedding,status=status.HTTP_400_BAD_REQUEST)


            instance = Job.objects.get(pk=job_id)
            
            serializer = JobSerializer(instance, data={"job_Link":link,"description":text,"embedding":numpy_job_embedding,"job_status":job_status,"location":location,"salaire_minimum":salaire_minimum,"salaire_maximum":salaire_maximum}, partial=True)
            if serializer.is_valid():
                serializer.save()
            else: 
                return Response({"message":serializer.errors},status=status.HTTP_400_BAD_REQUEST)
            msg="job saved"
            if(file):
                os.remove(file_path)
            else:
                if os.path.exists(joblocation):
                    os.remove(joblocation)

            return Response({"Job_id":job_id,"msg :":msg,"data":serializer.data},status=status.HTTP_200_OK)
        else:
            msg="job name already exists, please change its name"
            return Response({"Job_id":job_id,"msg :":msg},status=status.HTTP_400_BAD_REQUEST)
    def put(self, request, pk):
        file = request.FILES.get('file')
        jobDescription=request.data.get("description")
        client_id=request.user.client_id
        try:
            job = Job.objects.get(pk=pk,client_id=client_id)  # Retrieve the job by ID
        except Job.DoesNotExist:
            return Response({"message": "Job not found."}, status=status.HTTP_404_NOT_FOUND)

        # Data Validation
        new_statuses = request.data.get("job_status")

        if new_statuses:
            if new_statuses.lower() not in ['open', 'on hold', 'completed', 'canceled']:
                raise ValidationError({"error": "Invalid job status values."})
        serializer = JobSerializerModified(job, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
        if(file or jobDescription):
            if file:
                file_type = mimetypes.guess_type(file.name)[0]
                if file_type not in ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']:
                    return Response({"error": "Invalid file type. Only PDF, DOCX, and TXT files are allowed."}, status=status.HTTP_400_BAD_REQUEST)
                succeded,file_path=convert_file(file,pk)
                if not succeded:
                        return Response(file_path,status=status.HTTP_400_BAD_REQUEST)
                link=upload_job_to_owncloud(f"{pk}.pdf",file_path,client_id)
                text = extract(Path(file_path))
                
            else:
                joblocation = f"/code/{pk}.pdf"
                create_pdf(jobDescription,joblocation)
                link=upload_job_to_owncloud(f"{pk}.pdf",joblocation,client_id)
                text = jobDescription
            data = {
            'job_d': json.dumps(text),
            'client_id': client_id
            }
            succed,numpy_job_embedding=embed_job(data)
            if not succed:
                return Response(numpy_job_embedding,status=status.HTTP_400_BAD_REQUEST)
            instance = Job.objects.get(pk=pk)
                
            serializer = JobSerializer(instance, data={"job_Link":link,"description":text,"embedding":numpy_job_embedding}, partial=True)
            if serializer.is_valid():
                serializer.save()
            else: 
                return Response({"message":serializer.errors},status=status.HTTP_400_BAD_REQUEST)
            msg="job edited"
            if(file):
                os.remove(file_path)
            else:
                if os.path.exists(joblocation):
                    os.remove(joblocation)
            
        return Response(serializer.data,status=status.HTTP_200_OK)
    def get(self, request, pk=None):
        client_id=request.user.client_id

        if pk:  # Get a specific job
            try:
                job = Job.objects.get(pk=pk)
            except Job.DoesNotExist:
                return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

            serializer = JobSerializerModified(instance=job)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:  # Get a list of jobs
            
            jobs = Job.objects.all()

            paginator = self.pagination_class()
            page = paginator.paginate_queryset(jobs, request)
            if page is not None:
                serializer = JobSerializerModified(page, many=True)
                return paginator.get_paginated_response(serializer.data)
            return Response({"message": "No results found"}, status=status.HTTP_404_NOT_FOUND)
    def delete(self, request,pk):
        ##Extract Client ID
        client_id=request.user.client_id

        try:
            job = Job.objects.get(pk=pk)
        except Job.DoesNotExist:
            return Response({"message": "job not found"}, status=status.HTTP_404_NOT_FOUND)

        job.delete()
        return Response({"message": "job has been deleted successfully"},status=status.HTTP_200_OK)
                

class GetCandidateforJobs(ProtectedAPIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination

    def post(self, request):
        client_id=request.user.client_id
        data= request.data
        if "id_job" not in data:
            return Response({"message":"id_job is required"},status=status.HTTP_400_BAD_REQUEST)
        job_id=data["id_job"]
        candidates = get_candidates_for_job(job_id, client_id)       
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(candidates, request)
        if page is not None:
            return paginator.get_paginated_response(page)
        
        # Handle case when page is None
        return Response({"message": "No results found"}, status=status.HTTP_404_NOT_FOUND)




class Auth0SetRole(ProtectedAPIView):
    def get(self, request):
        token = get_auth0_management_token()
        
        payload = {}
        USER_ID=request.GET.get('user_id')
        
        headers = {
            'authorization': f"Bearer {token}",
            'content-type': "application/json",
            'cache-control': "no-cache"
            }
        response = requests.get(f"https://{settings.AUTH0_DOMAIN}/api/v2/users/{USER_ID}/roles", json=payload, headers=headers)
        return Response({"message": response.json()}, status=status.HTTP_200_OK)
    def post(self, request):
        token = get_auth0_management_token()
        
        payload = request.data["payload"]
        USER_ID=request.data["user_id"]
        
        headers = {
            'authorization': f"Bearer {token}",
            'content-type': "application/json",
            'cache-control': "no-cache"
            }
        response = requests.post(f"https://{settings.AUTH0_DOMAIN}/api/v2/users/{USER_ID}/roles", json=payload, headers=headers)
        return Response({"message": response.json()}, status=status.HTTP_200_OK) 
    def delete(self, request):
        token = get_auth0_management_token()
        
        payload = request.data["payload"]
        USER_ID=request.data["user_id"]
        
        headers = {
            'authorization': f"Bearer {token}",
            'content-type': "application/json",
            'cache-control': "no-cache"
            }
        response = requests.delete(f"https://{settings.AUTH0_DOMAIN}/api/v2/users/{USER_ID}/roles", json=payload, headers=headers)
        if response.status_code == 204:
            return Response({"message": "Role removed successfully."}, status=status.HTTP_200_OK) 
        else:
            return Response({"message": f"Failed to remove role: {response.status_code}, {response.text}"}, status=status.HTTP_404_NOT_FOUND)

        

class Auth0Roles(ProtectedAPIView):
    def get(self, request):
        token = get_auth0_management_token()
        headers = {
            'authorization': f"Bearer {token}",
            'content-type': "application/json"
            }
        headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        response = requests.get(f"https://{settings.AUTH0_DOMAIN}/api/v2/roles", headers=headers)
        return Response({"message": response.json()}, status=status.HTTP_200_OK) 
class AssignAuth0Role(ProtectedAPIView):
    def post(self, request):
        token = get_auth0_management_token()
        headers = {
            'authorization': f"Bearer {token}",
            'content-type': "application/json"
            }
        headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        
        payload = request.data["payload"]
        USER_ID=request.data["user_id"]
        response= requests.post(f"https://{settings.AUTH0_DOMAIN}/api/v2/users/{USER_ID}/roles", json=payload, headers=headers)

        return Response({"message": response}, status=status.HTTP_200_OK)
class UpdateAuth0User(ProtectedAPIView):
    def get(self, request, id=None):
        token = get_auth0_management_token()
        if id is not None:
            return self.get_by_id(request, id,token)
        else:
            return self.get_all(request,token)

    def get_all(self, request,token):
        user_id = request.user.id_user.replace('.', '|')
        url = f"https://{settings.AUTH0_DOMAIN}/api/v2/users/{user_id}"
        headers = {"Authorization": f"Bearer {token}"}

        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        user_data = response.json()
        client_id=user_data.get("user_metadata", {})["id_client"]
        query = f'user_metadata.id_client:"{client_id}"'
        url = f"https://{settings.AUTH0_DOMAIN}/api/v2/users?q={query}&search_engine=v3"

        response = requests.get(url, headers=headers)
        return Response({"message": response.json()}, status=status.HTTP_200_OK)

    def get_by_id(self, request, id,token):
        
        return None
    def post(self, request):
        token = get_auth0_management_token()
        payload_user_creation = request.data["payload_user_creation"]
        response={}
        headers = {
            'authorization': f"Bearer {token}",
            'content-type': "application/json"
            }
        headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        generated_password=generate_password(16)
        payload_user_creation["password"]=generated_password
        response["user_creation"]=requests.post(f"https://{settings.AUTH0_DOMAIN}/api/v2/users?", json=payload_user_creation, headers=headers).json()
        #print("response uset creation : ",response["user_creation"].content)
        payload_role_assignement = request.data["payload_role_assignement"]
        USER_ID=response["user_creation"].get("user_id")
        response["role assignment"] = requests.post(f"https://{settings.AUTH0_DOMAIN}/api/v2/users/{USER_ID}/roles", json=payload_role_assignement, headers=headers)
        email= request.data["payload_user_creation"].get("email")
        send_email(email,"account created",f"here is you password: {generated_password}")
        return Response({"message": response}, status=status.HTTP_200_OK)
        
    def put(self, request):
        auth0_id=request.data["user_id"]
        token = get_auth0_management_token()
        url = f"https://{settings.AUTH0_DOMAIN}/api/v2/users/{auth0_id}"
        headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        payload = request.data["payload"]
        response = requests.patch(url, json=payload, headers=headers)
        return Response({"message": response.json()}, status=status.HTTP_200_OK) 
    def delete(self, request):
        token = get_auth0_management_token()
        USER_ID=request.GET.get('user_id')
        url = f"https://{settings.AUTH0_DOMAIN}/api/v2/users/{USER_ID}"
        headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        payload = {}
        response = requests.delete(url, json=payload, headers=headers)
        return Response({"message": response.text}, status=status.HTTP_200_OK) 




#Save shortlisted candidates
class SaveShortlistedCandidatesAPI(ProtectedAPIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    def put(self, request):
        data = request.data
        rh = request.data.get("rh")
        technique=request.data.get("technique")
        test_technique=request.data.get("test_technique")
        dg=request.data.get("dg")
        valid_status=['not started', 'in progress', 'rejected', 'accepted']

        if rh:
            if rh.lower() not in valid_status:
                raise ValidationError({"error": f"Invalid rh status values, must be in {valid_status}"})
        if technique:
            if technique.lower() not in valid_status:
                raise ValidationError({"error": f"Invalid technique status values, must be in {valid_status}"})
        if test_technique:
            if test_technique.lower() not in valid_status:
                raise ValidationError({"error": f"Invalid test_technique status values, must be in {valid_status}"})
        if dg:
            if dg.lower() not in valid_status:
                raise ValidationError({"error": f"Invalid dg status values, must be in {valid_status}"})
        try:
            instance = Matching.objects.get(pk=data.get("id"))
        except Matching.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        if 'favori' in request.data:
            instance.favori = request.data['favori']
            

        serializer = MatchingSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            


class getselectedcandidate(ProtectedAPIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination  # Use the custom pagination
    def post(self,request):   
        data=request.data
        if "id_job" not in data:
            return Response({"message","id_job is required"},status=status.HTTP_400_BAD_REQUEST)
        id=data.get("id_job")
        candidates=Matching.objects.filter(favori=True,id_job=id).order_by('-similarity_score').values('id','id_candidat',"dg","note_dg","note_rh","note_technique","note_test_technique","rh","technique","test_technique","favori" ,'similarity_score','id_candidat__nom', 'id_candidat__phone', 'id_candidat__email', 'id_candidat__CV_Link')
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(candidates, request)
        if page is not None:
            return paginator.get_paginated_response(page)
        return Response({"message": "No results found"}, status=status.HTTP_404_NOT_FOUND)
        

class updateshortlisted(ProtectedAPIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    def put(self, request):
        ##Extract Client ID
        client_id=request.user.client_id

        data = request.data
        if "id" not in data:
            return Response({"message":"id is required"},status=status.HTTP_400_BAD_REQUEST)
        try:
            instance = Matching.objects.get(pk=data.get("id"))
        except Matching.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = MatchingSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data , status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


     
class LogoutView(ProtectedAPIView):
    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()  # Blacklist the token
            return Response({"message":"logged out"},status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
class LoginView(ProtectedAPIView):
    def post(self, request, *args, **kwargs):
        serializer = CustomTokenObtainPairSerializer(data=request.data)
        
        if serializer.is_valid():
            # If the serializer is valid, return the token and user info
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        else:
            # If the data is invalid, return a bad request response
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
