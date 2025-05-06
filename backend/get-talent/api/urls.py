"""file of urls """
from django.urls import path 
from django.conf import settings
from django.conf.urls.static import static
from .views import *


urlpatterns = [ 
    path("Auth0/", TestAuth0View.as_view(), name='api_auth0'),
    path("Auth0UserRole/", Auth0SetRole.as_view(), name='api_auth0_set_role'),
    path("Auth0AssignUserRole/", AssignAuth0Role.as_view(), name='api_auth0_assign_role'),
    path("Auth0User/", UpdateAuth0User.as_view(), name='api_auth0_user'),
    path("Auth0User/<str:pk>/", UpdateAuth0User.as_view(), name='api_auth0_user_details'),
    path("Auth0Role/", Auth0Roles.as_view(), name='api_auth0_role'),
    path("Job/", JobView.as_view(), name='api_savejob'),
    path('Job/<int:pk>/', JobView.as_view(), name='job-update'),
    path("getcandidatesforjob/", GetCandidateforJobs.as_view(), name='api_getcandidateforjobs'),
    path("saveshortlisted/", SaveShortlistedCandidatesAPI.as_view(), name='api_save_shorlisted'),
    path("getselectedcandidate/", getselectedcandidate.as_view(), name='api_getselectedcandidate'),
    path("updateshortlisted/", updateshortlisted.as_view(), name='api_updateshortlisted'),
    path('target-client/', TargetClientView.as_view(), name='target-client'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
if not settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)