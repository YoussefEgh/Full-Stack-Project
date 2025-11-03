from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import (
    UserRegistrationSerializer, 
    UserLoginSerializer, 
    UserProfileSerializer,
    ChangePasswordSerializer
)
from .firebase_service import (
    create_firebase_user,
    get_firebase_user,
    update_firebase_user,
    verify_firebase_token
)
from config.firebase import initialize_firebase

# Initialize Firebase on app startup
initialize_firebase()

User = get_user_model()

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_view(request):
    """
    Register a new user with Firebase
    Frontend creates Firebase Auth user, then sends token here to create Firestore user
    """
    # Verify Firebase token
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return Response({
            'success': False,
            'errors': {'token': ['Firebase ID token required']}
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    token = auth_header.split('Bearer ')[1]
    decoded_token = verify_firebase_token(token)
    
    if not decoded_token:
        return Response({
            'success': False,
            'errors': {'token': ['Invalid Firebase token']}
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    uid = decoded_token['uid']
    
    # Get user data from request
    username = request.data.get('username')
    email = request.data.get('email')
    first_name = request.data.get('first_name', '')
    last_name = request.data.get('last_name', '')
    
    if not username or not email:
        return Response({
            'success': False,
            'errors': {'fields': ['Username and email are required']}
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Create user in Firestore
    try:
        from config.firestore import get_firestore_client
        from datetime import datetime
        
        db = get_firestore_client()
        user_data = {
            'uid': uid,
            'username': username,
            'email': email,
            'first_name': first_name,
            'last_name': last_name,
            'created_at': datetime.now(),
            'updated_at': datetime.now()
        }
        
        db.collection('users').document(uid).set(user_data)
        
        return Response({
            'success': True,
            'message': 'User registered successfully',
            'user': user_data
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({
            'success': False,
            'errors': {'error': [str(e)]}
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    """
    Login user - Firebase Auth handles authentication on client side
    Client sends Firebase ID token after successful Firebase authentication
    """
    # Verify Firebase token
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return Response({
            'success': False,
            'errors': {'token': ['Firebase ID token required']}
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    token = auth_header.split('Bearer ')[1]
    decoded_token = verify_firebase_token(token)
    
    if not decoded_token:
        return Response({
            'success': False,
            'errors': {'token': ['Invalid Firebase token']}
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    uid = decoded_token['uid']
    
    # Get user from Firestore
    user_data = get_firebase_user(uid)
    
    if user_data:
        return Response({
            'success': True,
            'message': 'Login successful',
            'user': user_data
        }, status=status.HTTP_200_OK)
    else:
        # User authenticated with Firebase but doesn't exist in Firestore
        # This shouldn't happen if registration worked properly
        return Response({
            'success': False,
            'errors': {'user': ['User profile not found. Please register first.']}
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def logout_view(request):
    """
    Logout user - Firebase handles logout on client side
    """
    # Firebase handles logout on the client side
    # Just return success
    return Response({
        'success': True,
        'message': 'Logout successful'
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def user_profile_view(request):
    """
    Get current user's profile
    """
    # Verify Firebase token
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return Response({
            'success': False,
            'error': 'Authorization token required'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    token = auth_header.split('Bearer ')[1]
    decoded_token = verify_firebase_token(token)
    
    if decoded_token:
        uid = decoded_token['uid']
        user_data = get_firebase_user(uid)
        
        if user_data:
            return Response({
                'success': True,
                'user': user_data
            })
    
    return Response({
        'success': False,
        'error': 'Invalid token'
    }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['PUT', 'PATCH'])
@permission_classes([permissions.AllowAny])
def update_profile_view(request):
    """
    Update current user's profile
    """
    # Verify Firebase token
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return Response({
            'success': False,
            'error': 'Authorization token required'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    token = auth_header.split('Bearer ')[1]
    decoded_token = verify_firebase_token(token)
    
    if not decoded_token:
        return Response({
            'success': False,
            'error': 'Invalid token'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    uid = decoded_token['uid']
    
    # Update user in Firestore
    user_data = update_firebase_user(uid, **request.data)
    
    if user_data:
        return Response({
            'success': True,
            'message': 'Profile updated successfully',
            'user': user_data
        })
    
    return Response({
        'success': False,
        'error': 'Failed to update profile'
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def change_password_view(request):
    """
    Change user password
    """
    # Verify Firebase token
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return Response({
            'success': False,
            'error': 'Authorization token required'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    token = auth_header.split('Bearer ')[1]
    decoded_token = verify_firebase_token(token)
    
    if not decoded_token:
        return Response({
            'success': False,
            'error': 'Invalid token'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    uid = decoded_token['uid']
    
    # Update password in Firebase Auth
    new_password = request.data.get('new_password')
    if new_password:
        # Note: This requires admin SDK privileges
        # For production, use Firebase SDK on client side
        from firebase_admin import auth
        auth.update_user(uid, password=new_password)
        
        return Response({
            'success': True,
            'message': 'Password changed successfully'
        })
    
    return Response({
        'success': False,
        'error': 'New password required'
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def refresh_token_view(request):
    """
    Refresh Firebase token - Firebase handles token refresh on client side
    """
    # Firebase handles token refresh on the client side
    # Just return success with message to refresh on client
    return Response({
        'success': True,
        'message': 'Token refresh handled by Firebase SDK on client side'
    })