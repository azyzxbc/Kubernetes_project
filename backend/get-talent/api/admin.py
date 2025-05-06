from django.contrib import admin
# from .models import Client, User
from .models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import HttpResponse
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django import forms
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.template.loader import render_to_string
from .utils import send_email
import logging
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_bytes


# logger = logging.getLogger(__name__)

# # # Custom action to generate JWT tokens
# # def generate_jwt_token(modeladmin, request, queryset):
# #     for user in queryset:
# #         # Generate JWT token
# #         refresh = RefreshToken.for_user(user)
# #         token_data = {
# #             'refresh': str(refresh),
# #             'access': str(refresh.access_token),
# #         }
# #         # Optionally display or log the token
# #         return HttpResponse(f"Access Token: {token_data['access']}\nRefresh Token: {token_data['refresh']}")

# # generate_jwt_token.short_description = "Generate JWT Token for selected users"

class CustomUserCreationForm(UserCreationForm):
    password1 = forms.CharField(
        label=_("Password"),
        widget=forms.PasswordInput,
        required=False  # Make password1 optional
    )
    password2 = forms.CharField(
        label=_("Password confirmation"),
        widget=forms.PasswordInput,
        required=False  # Make password2 optional
    )

    class Meta:
        model = User
        fields = ('email',)
        #fields = ('email', 'client')  # Only email and client fields
    # def send_password_set_email(self, user):
    #     """Sends an email to the user with a link to set their password."""
    #     uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
    #     token = PasswordResetTokenGenerator().make_token(user)
    #     # current_site = get_current_site(request=request).domain
    #     current_site = "localhost:4200"
    #     # relativeLink = reverse('password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})
    #     relativeLink = f"/register/{uidb64}/{token}"
    #     absurl = 'http://' + current_site + relativeLink
    #     print(absurl)
    #     email_body = f'Hello, \n Use the link below to reset your password \n{absurl}'
    #     subject = 'Set your password'
    #     # Send email
    #     send_email(user.email, subject, email_body)

    # def save(self, commit=True):
    #     user = super().save(commit=False)
    #     password = self.cleaned_data.get("password1")

    #     if password:
    #         user.set_password(password)  # If a password is provided, set it
    #     else:
    #         user.set_unusable_password()  # If no password is provided, make it unusable

    #     user.save() 
    #     self.send_password_set_email(user)
    #     return user


    


# Custom form for updating users in admin
class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = ('email', 'username',)

class UserAdmin(BaseUserAdmin):
    model = User
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )

    # Fields to display when viewing/editing a user in the admin
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('username',)}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    # Use email for identification instead of username
    list_display = ('email', 'is_staff', 'is_active')
    search_fields = ('email',)
    ordering = ('email',)


# Register your models here.
admin.site.register(User, UserAdmin)
# admin.site.register(Client)
