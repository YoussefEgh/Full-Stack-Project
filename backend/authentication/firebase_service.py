"""
Firebase service layer for Authentication
"""
from firebase_admin import auth as firebase_auth
from config.firestore import get_firestore_client
from datetime import datetime

def create_user_in_firestore(uid, user_data):
    """
    Create user document in Firestore
    """
    db = get_firestore_client()
    user_ref = db.collection('users').document(uid)
    
    user_doc = {
        'uid': uid,
        'username': user_data.get('username'),
        'email': user_data.get('email'),
        'first_name': user_data.get('first_name', ''),
        'last_name': user_data.get('last_name', ''),
        'phone_number': user_data.get('phone_number', ''),
        'date_of_birth': user_data.get('date_of_birth'),
        'bio': user_data.get('bio', ''),
        'profile_picture': user_data.get('profile_picture', ''),
        'is_verified': user_data.get('is_verified', False),
        'created_at': datetime.now(),
        'updated_at': datetime.now()
    }
    
    user_ref.set(user_doc)
    return user_doc

def get_user_from_firestore(uid):
    """
    Get user document from Firestore
    """
    db = get_firestore_client()
    user_ref = db.collection('users').document(uid)
    user_doc = user_ref.get()
    
    if user_doc.exists:
        return user_doc.to_dict()
    return None

def update_user_in_firestore(uid, updates):
    """
    Update user document in Firestore
    """
    db = get_firestore_client()
    user_ref = db.collection('users').document(uid)
    
    updates['updated_at'] = datetime.now()
    user_ref.update(updates)
    
    # Return updated document
    updated_doc = user_ref.get()
    return updated_doc.to_dict() if updated_doc.exists else None

def verify_firebase_token(token):
    """
    Verify Firebase ID token
    """
    try:
        decoded_token = firebase_auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        print(f"Token verification error: {e}")
        return None

def create_firebase_user(email, password, username=None, first_name=None, last_name=None):
    """
    Create a new Firebase user with custom claims
    """
    try:
        user_record = firebase_auth.create_user(
            email=email,
            password=password,
            display_name=f"{first_name} {last_name}".strip() if first_name and last_name else username,
        )
        
        # Create user document in Firestore
        user_data = {
            'username': username,
            'email': email,
            'first_name': first_name or '',
            'last_name': last_name or '',
        }
        create_user_in_firestore(user_record.uid, user_data)
        
        return user_record
    except Exception as e:
        print(f"Error creating Firebase user: {e}")
        return None

def update_firebase_user(uid, password=None, **kwargs):
    """
    Update Firebase user
    """
    try:
        update_data = {}
        if password:
            update_data['password'] = password
        
        # Extract Firebase Auth fields
        firebase_fields = ['display_name', 'email', 'phone_number', 'photo_url', 'email_verified']
        for field in firebase_fields:
            if field in kwargs:
                update_data[field] = kwargs.pop(field)
        
        if update_data:
            firebase_auth.update_user(uid, **update_data)
        
        # Update remaining fields in Firestore
        if kwargs:
            update_user_in_firestore(uid, kwargs)
        
        return get_user_from_firestore(uid)
    except Exception as e:
        print(f"Error updating Firebase user: {e}")
        return None

def get_firebase_user(uid):
    """
    Get Firebase user by UID
    """
    try:
        user_record = firebase_auth.get_user(uid)
        user_data = get_user_from_firestore(uid)
        
        if user_data:
            # Merge Firebase Auth data with Firestore data
            return {
                'uid': user_record.uid,
                'email': user_record.email,
                'username': user_data.get('username'),
                'first_name': user_data.get('first_name'),
                'last_name': user_data.get('last_name'),
                'phone_number': user_data.get('phone_number'),
                'date_of_birth': user_data.get('date_of_birth'),
                'bio': user_data.get('bio'),
                'profile_picture': user_data.get('profile_picture'),
                'is_verified': user_data.get('is_verified', False),
                'created_at': user_data.get('created_at'),
                'updated_at': user_data.get('updated_at'),
            }
        return None
    except Exception as e:
        print(f"Error getting Firebase user: {e}")
        return None

