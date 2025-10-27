#!/usr/bin/env python
"""
Create more sample posts for testing
"""
import os
import sys
import django

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from config.firebase import initialize_firebase
from datetime import datetime
import uuid

def create_more_posts():
    """Create more sample posts"""
    try:
        initialize_firebase()
        from config.firestore import get_firestore_client
        db = get_firestore_client()
        
        posts = [
            {
                'title': 'Home Workout Routine Recommendation',
                'content': 'I don\'t have access to a gym right now. Can someone recommend a good home workout routine? I have some dumbbells and resistance bands.',
                'author': 'HomeTrainer',
                'author_uid': 'user-home',
                'category': 'Exercises',
                'likes': 3
            },
            {
                'title': 'Meal Prep Ideas for Weight Loss',
                'content': 'Looking for meal prep ideas that are easy to make and good for weight loss. Any favorite recipes or tips?',
                'author': 'NutritionCoach',
                'author_uid': 'user-nutri',
                'category': 'Nutrition',
                'likes': 7
            },
            {
                'title': 'How to Track Progress Effectively?',
                'content': 'What\'s the best way to track fitness progress? Photos, measurements, or something else?',
                'author': 'NewbieFitness',
                'author_uid': 'user-new',
                'category': 'General',
                'likes': 4
            }
        ]
        
        for post_data in posts:
            post_id = str(uuid.uuid4())
            now = datetime.now()
            
            post_doc = {
                'id': post_id,
                'title': post_data['title'],
                'content': post_data['content'],
                'author': post_data['author'],
                'author_uid': post_data['author_uid'],
                'category': post_data['category'],
                'likes': post_data['likes'],
                'created_at': now,
                'updated_at': now
            }
            
            db.collection('posts').document(post_id).set(post_doc)
            print(f"✅ Created: {post_data['title']}")
        
        print(f"\n✅ Created {len(posts)} more posts!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    create_more_posts()

