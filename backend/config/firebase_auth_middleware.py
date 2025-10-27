"""
Firebase Authentication Middleware for Django REST Framework
"""
from rest_framework import authentication, exceptions
from authentication.firebase_service import verify_firebase_token


class FirebaseAuthentication(authentication.BaseAuthentication):
    """
    Custom authentication class to verify Firebase ID tokens
    """
    
    def authenticate(self, request):
        """
        Authenticate the request using Firebase ID token
        """
        auth_header = request.headers.get('Authorization', '')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return None
        
        token = auth_header.split('Bearer ')[1]
        
        if not token:
            return None
        
        # Verify Firebase token
        decoded_token = verify_firebase_token(token)
        
        if not decoded_token:
            raise exceptions.AuthenticationFailed('Invalid Firebase token')
        
        # Get user UID from decoded token
        uid = decoded_token.get('uid')
        
        if not uid:
            raise exceptions.AuthenticationFailed('Invalid token payload')
        
        # Return user as a tuple (user, token)
        # We'll create a simple user object with the uid
        return (User(uid=uid), token)


class User:
    """
    Simple user object for Firebase authentication
    """
    def __init__(self, uid):
        self.uid = uid
        self.is_authenticated = True
        self.is_active = True
    
    def __str__(self):
        return self.uid

