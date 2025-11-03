"""
Firebase Authentication helper functions
"""
from firebase_admin import auth as firebase_auth
from datetime import datetime, timedelta
import secrets
import hashlib

def verify_firebase_token(token):
    """
    Verify Firebase ID token
    Returns the decoded token if valid, None otherwise
    """
    try:
        decoded_token = firebase_auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        print(f"Token verification error: {e}")
        return None

def create_custom_token(uid, additional_claims=None):
    """
    Create a custom Firebase token
    """
    try:
        custom_token = firebase_auth.create_custom_token(uid, additional_claims)
        return custom_token
    except Exception as e:
        print(f"Error creating custom token: {e}")
        return None

def get_user_by_uid(uid):
    """
    Get user data by UID
    """
    try:
        user = firebase_auth.get_user(uid)
        return user
    except Exception as e:
        print(f"Error getting user: {e}")
        return None

def create_user(email, password, display_name=None, **kwargs):
    """
    Create a new Firebase user
    """
    try:
        user_record = firebase_auth.create_user(
            email=email,
            password=password,
            display_name=display_name,
            **kwargs
        )
        return user_record
    except Exception as e:
        print(f"Error creating user: {e}")
        return None

def update_user(uid, **kwargs):
    """
    Update Firebase user
    """
    try:
        user = firebase_auth.update_user(uid, **kwargs)
        return user
    except Exception as e:
        print(f"Error updating user: {e}")
        return None

def delete_user(uid):
    """
    Delete Firebase user
    """
    try:
        firebase_auth.delete_user(uid)
        return True
    except Exception as e:
        print(f"Error deleting user: {e}")
        return False

def verify_password_reset_code(code):
    """
    Verify password reset code
    """
    # This would need to be implemented with your own code verification logic
    # or use Firebase's built-in password reset feature
    pass

