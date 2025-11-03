"""
Firebase initialization and configuration
"""
import firebase_admin
from firebase_admin import credentials, firestore, auth
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Firebase Admin SDK
def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    # Check if Firebase has already been initialized
    if not firebase_admin._apps:
        # Get Firebase credentials from environment variable
        firebase_credentials_path = os.getenv('FIREBASE_CREDENTIALS_PATH')
        
        if firebase_credentials_path and os.path.exists(firebase_credentials_path):
            # Initialize with service account file
            cred = credentials.Certificate(firebase_credentials_path)
            firebase_admin.initialize_app(cred)
        else:
            raise Exception(f"Firebase credentials not found at: {firebase_credentials_path}. Please check your .env file.")
    
    return True

# Get Firestore client
def get_firestore_client():
    """Get Firestore client instance"""
    # Ensure Firebase is initialized first
    if not firebase_admin._apps:
        initialize_firebase()
    return firestore.client()

# Get Firebase Auth instance
def get_auth():
    """Get Firebase Auth instance"""
    return auth

