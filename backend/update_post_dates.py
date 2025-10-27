#!/usr/bin/env python
"""
Update post dates to show different relative times
"""
import os
import sys
import django

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from config.firebase import initialize_firebase
from datetime import datetime, timedelta

def update_post_dates():
    """Update post dates to have different timestamps"""
    try:
        initialize_firebase()
        from config.firestore import get_firestore_client
        db = get_firestore_client()
        
        # Get all posts
        posts_query = db.collection('posts')
        posts = posts_query.stream()
        
        # Define relative times for each post
        time_deltas = [
            timedelta(hours=0.5),      # 30 minutes ago
            timedelta(hours=2),        # 2 hours ago
            timedelta(hours=5),        # 5 hours ago
            timedelta(days=1),         # Yesterday
            timedelta(days=2),        # 2 days ago
        ]
        
        now = datetime.now()
        updated_count = 0
        
        for i, post in enumerate(posts):
            post_data = post.to_dict()
            post_id = post.id
            
            # Update created_at with relative time
            if i < len(time_deltas):
                new_created_at = now - time_deltas[i]
                
                # Update the post
                db.collection('posts').document(post_id).update({
                    'created_at': new_created_at,
                    'updated_at': new_created_at
                })
                
                print(f"✅ Updated: {post_data.get('title', 'Unknown')[:40]}...")
                print(f"   New date: {new_created_at.strftime('%Y-%m-%d %H:%M:%S')}")
                updated_count += 1
        
        print(f"\n✅ Updated {updated_count} posts with different dates!")
        print("\nNow posts will show:")
        print("  - 'Just now' (30 minutes ago)")
        print("  - '2h ago'")
        print("  - '5h ago'")
        print("  - 'Yesterday'")
        print("  - Date from 2 days ago")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    update_post_dates()

