#!/usr/bin/env python
"""
Test script to create a sample post in Firestore
"""
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from config.firebase import initialize_firebase
from datetime import datetime
import uuid

def create_test_post():
    """Create a test post in Firestore"""
    try:
        # Initialize Firebase
        initialize_firebase()
        
        from config.firestore import get_firestore_client
        db = get_firestore_client()
        
        # Create a test post
        post_id = str(uuid.uuid4())
        post_data = {
            'id': post_id,
            'title': 'Welcome to the Community!',
            'content': 'This is a test post to verify that posts are being displayed correctly. Feel free to reply!',
            'author': 'Admin',
            'author_uid': 'admin-uid',
            'category': 'General',
            'likes': 0,
            'created_at': datetime.now(),
            'updated_at': datetime.now()
        }
        
        db.collection('posts').document(post_id).set(post_data)
        
        print("✅ Test post created successfully!")
        print(f"Post ID: {post_id}")
        print(f"Title: {post_data['title']}")
        print("\nYou can now check the communities page to see this post.")
        
    except Exception as e:
        print(f"❌ Error creating test post: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    create_test_post()

