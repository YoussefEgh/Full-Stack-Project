#!/usr/bin/env python
"""
Create a sample post with replies for testing
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

def create_sample_post_with_replies():
    """Create a sample post with multiple replies"""
    try:
        # Initialize Firebase
        initialize_firebase()
        
        from config.firestore import get_firestore_client
        db = get_firestore_client()
        
        # Create a sample post
        post_id = str(uuid.uuid4())
        now = datetime.now()
        
        post_data = {
            'id': post_id,
            'title': 'Best Protein Powder in 2025?',
            'content': 'I\'m looking to buy a new protein powder and wanted to get recommendations from the community. What are your favorite brands and why? Looking for something with good taste and mixability.',
            'author': 'FitnessEnthusiast',
            'author_uid': 'user-123',
            'category': 'Supplements',
            'likes': 5,
            'created_at': now,
            'updated_at': now
        }
        
        db.collection('posts').document(post_id).set(post_data)
        print(f"✅ Created post: {post_data['title']}")
        
        # Create sample replies
        replies = [
            {
                'text': 'I\'ve been using Optimum Nutrition Gold Standard for years. Great taste and 24g protein per scoop!',
                'user': 'GymRat99',
                'user_uid': 'user-456'
            },
            {
                'text': 'Dymatize ISO100 is my go-to. Zero carbs and mixes perfectly even with just water.',
                'user': 'CleanEater',
                'user_uid': 'user-789'
            },
            {
                'text': 'Try Vegan Smart Plant-Based Protein if you\'re dairy-free. It\'s surprisingly good!',
                'user': 'PlantPower',
                'user_uid': 'user-101'
            },
            {
                'text': 'I agree with GymRat99. ON Gold Standard is the best value for money. Been using it for 3 years now.',
                'user': 'ProGainer',
                'user_uid': 'user-202'
            }
        ]
        
        for i, reply_data in enumerate(replies):
            reply_id = str(uuid.uuid4())
            reply_doc = {
                'id': reply_id,
                'post_id': post_id,
                'user': reply_data['user'],
                'user_uid': reply_data['user_uid'],
                'text': reply_data['text'],
                'created_at': datetime.now()
            }
            
            db.collection('replies').document(reply_id).set(reply_doc)
            print(f"  ✓ Added reply from {reply_data['user']}")
        
        print(f"\n✅ Post created with {len(replies)} replies!")
        print(f"Post ID: {post_id}")
        print("\nYou can now view this post on the communities page!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    create_sample_post_with_replies()

