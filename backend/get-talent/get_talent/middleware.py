from threading import local
import logging
# Thread-local storage for user information
log_context = local()

def get_current_request():
    return getattr(log_context, 'request', None)

def get_current_user_id():
    return getattr(log_context, 'user_id', None)

class RequestMiddleware:
    def __init__(self, get_response): 
        self.get_response = get_response

    def __call__(self, request):
        from rest_framework_simplejwt.authentication import JWTAuthentication
        log_context.request = request
        log_context.user_id = 'anonymous'

        jwt_auth = JWTAuthentication()
        try:
            user, _ = jwt_auth.authenticate(request)
            if user:
                log_context.user_id = user.id
        except Exception:
            pass  # Keep 'anonymous' as user_id

        response = self.get_response(request)

        

        return response
    


class UserIDFilter(logging.Filter):
    def filter(self, record):
        user_id = get_current_user_id()
        if user_id:
            record.user_id = f"user: {user_id}"
        else:
            request = get_current_request()
            if request:
                user = getattr(request, 'user', None)
                if user and user.is_authenticated:
                    record.user_id = f"user: {user.id}"
                else:
                    record.user_id = 'Anonymous'
            else:
                record.user_id = 'N/A'
        # log_context.request = None
        # log_context.user_id = None
        
        return True