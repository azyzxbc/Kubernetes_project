from rest_framework import serializers
from .models import Domaine , Job, Candidat, Matching ,Archived_candidat,User,TargetClient
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils.encoding import force_str
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_decode
from rest_framework.exceptions import AuthenticationFailed
from django.core.exceptions import ValidationError

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_old_password(self, value):
        user = self.context.get('request').user
        if not user.check_password(value):
            raise ValidationError("Old password is incorrect")
        return value

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No user with this email found.")
        return value
class PasswordResetConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data.update({
            'client_id': self.user.client.id_client,
            'user':{'username':self.user.username,
                    'fullname':self.user.fullname,
                    'email':self.user.email,
                    'location':self.user.location,
                    'phone':self.user.phone
                    }
        })
        return data

class DomaineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Domaine
        fields = "__all__"
class TargetClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = TargetClient
        fields = '__all__'
class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'
class JobSerializerModified(serializers.ModelSerializer):
    class Meta:
        model = Job
        exclude=['insertion_date','client_id','job_Link']

class CandidatSerializer(serializers.ModelSerializer):
    certificat = serializers.ListField(allow_empty=True)
    formation = serializers.ListField(allow_null=True, required=False)
    domain = serializers.ListField(allow_null=True, required=False)
    langues = serializers.ListField(allow_empty=True)
    class Meta:
        model = Candidat
        exclude = ['skills_jointure', 'formation_jointure', 'langues_jointure', 'certificat_jointure', 'domain_jointure', 'education_jointure','embedding','embedding_cohere']


class MatchingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Matching
        fields = "__all__"

class MatchingJobSerializer(serializers.Serializer):
    id_job = serializers.IntegerField()
    similarity_score = serializers.FloatField()
    id_job__file_name = serializers.CharField()
    id_job__destination = serializers.CharField()
    id_job__insertion_date = serializers.DateField()
    id_job__job_Link = serializers.CharField()

    class Meta:
        fields = ['id_job', 'similarity_score', 'id_job__file_name', 'id_job__destination', 'id_job__insertion_date', 'id_job__job_Link']

class ArchivedSerializer(serializers.ModelSerializer):
    class Meta:
        model=Archived_candidat
        fields='__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['fullname','username','location','phone', 'email']

class ResetPasswordRequest(serializers.Serializer):
    email=serializers.EmailField()
    redirect_url = serializers.CharField(max_length=500, required=False)

    class Meta():
        fields=['email']  

class SetPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(
        min_length=6, max_length=68, write_only=True)
    token = serializers.CharField(
        min_length=1, write_only=True)
    uidb64 = serializers.CharField(
        min_length=1, write_only=True)

    class Meta:
        fields = ['password', 'token', 'uidb64']

    def validate(self, attrs):
        try:
            password = attrs.get('password')
            token = attrs.get('token')
            uidb64 = attrs.get('uidb64')

            id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed('The reset link is invalid', 401)

            user.set_password(password)
            user.save()

            return (user)
        except Exception as e:
            raise AuthenticationFailed('The reset link is invalid', 401)
        return super().validate(attrs)