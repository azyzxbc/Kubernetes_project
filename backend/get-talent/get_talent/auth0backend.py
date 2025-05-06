import jwt
from api.models import User
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
import requests 
import json
class Auth0Authentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        
        if not auth_header.startswith('Bearer '):
            return None
            
        token = auth_header.split(' ')[1]
        header = jwt.get_unverified_header(token)
        issuer = f'https://{settings.AUTH0_DOMAIN}/'
        jwks = requests.get(f'https://{settings.AUTH0_DOMAIN}/.well-known/jwks.json').json()
        public_key = None
        for jwk in jwks['keys']:
            if jwk['kid'] == header['kid']:
                public_key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(jwk))

        if public_key is None:
            raise Exception('Public key not found.')
        
        try:
            # Validate the token
            payload = jwt.decode(
                token,
                public_key,
                algorithms=['RS256'],
                audience=settings.API_IDENTIFIER,
                issuer= issuer
            )
        except jwt.PyJWTError:
            raise AuthenticationFailed('Invalid token')
            
        # Get or create user
        user_id = payload.get('sub')
        user_email = payload.get('email')
        client_id = payload.get('user_metadata')["id_client"]
        if not user_id:
            raise AuthenticationFailed('No user identifier in token')
            
        username = user_id.replace('|', '.')
        #username = user_id
        try:
            user = User.objects.get(id_user=username)
        except User.DoesNotExist:
            # Create a new user
            user = User(id_user=username,email=user_email,client_id=client_id)
            user.save()
            
        return (user, token)









# import json
# import requests
# from jose import jwt
# from django.conf import settings
# from rest_framework.authentication import BaseAuthentication
# from rest_framework.exceptions import AuthenticationFailed
# from django.contrib.auth.models import AnonymousUser

# class Auth0JSONWebTokenAuthentication(BaseAuthentication):
#     _jwks_cache = None
#     _jwks_last_updated = None
    
#     def get_jwks(self):
#         """Fetch JSON Web Key Set (JWKS) from Auth0 with caching."""
#         # Check if we have a cached version that's less than 24 hours old
#         now = datetime.datetime.now()
#         if self._jwks_cache and self._jwks_last_updated and \
#            (now - self._jwks_last_updated).total_seconds() < 86400:  # 24 hours
#             return self._jwks_cache
            
#         jwks_url = f"https://{settings.AUTH0_DOMAIN}/.well-known/jwks.json"
#         try:
#             response = requests.get(jwks_url)
#             response.raise_for_status()  # Raise exception for non-200 responses
#             self._jwks_cache = response.json()
#             self._jwks_last_updated = now
#             return self._jwks_cache
#         except requests.exceptions.RequestException as e:
#             raise AuthenticationFailed(f"Unable to fetch JWKS: {str(e)}")
    
#     def decode_jwt(self, token):
#         """Decode and validate the JWT token using Auth0 public keys."""
#         try:
#             header = jwt.get_unverified_header(token)
#             jwks = requests.get(f'https://{settings.AUTH0_DOMAIN}/.well-known/jwks.json').json()
#             public_key = None
#             for jwk in jwks['keys']:
#                 if jwk['kid'] == header['kid']:
#                     public_key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(jwk))

#             if public_key is None:
#                 raise Exception('Public key not found.')

#             issuer = f'https://{settings.AUTH0_DOMAIN}/'

#             payload=jwt.decode(token, public_key, audience=settings.API_IDENTIFIER, issuer=issuer, algorithms=['RS256'])
#             return payload
            
#         except jwt.ExpiredSignatureError:
#             raise AuthenticationFailed("Token has expired")
#         except Exception as e:
#             # Log the specific exception for debugging
#             print(f"Unexpected error decoding token: {str(e)}")
#             raise AuthenticationFailed("Invalid token")
    
#     def authenticate(self, request):
#         """Authenticate request using Auth0 JWT."""
#         auth_header = request.headers.get("Authorization")
#         if not auth_header or not auth_header.startswith("Bearer "):
#             return None
            
#         token = auth_header.split(" ")[1]
#         try:
#             payload = self.decode_jwt(token)
            
#             # Here you would typically look up or create a Django user
#             # For now, we'll use AnonymousUser as in your example
#             user = AnonymousUser()
#             user.auth0_payload = payload
            
#             return (user, token)
#         except AuthenticationFailed:
#             raise  # Re-raise authentication failures