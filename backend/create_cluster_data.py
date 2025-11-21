#!/usr/bin/env python
"""
Create fake user interaction data for clusters using Union-Find algorithm.
This script:
1. Gets existing users from posts/replies
2. Creates additional fake users if needed
3. Creates posts and replies that form clusters
4. The union-find algorithm will automatically group users who interact
"""
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from config.firebase import initialize_firebase
from config.firestore import get_firestore_client
from datetime import datetime, timedelta
import uuid
import random

# Initialize Firebase
initialize_firebase()
db = get_firestore_client()

# Fake user data - will create users in Firestore
FAKE_USERS = [
    {'uid': 'fake-user-1', 'username': 'FitnessGuru', 'email': 'fitnessguru@example.com', 'first_name': 'Alex', 'last_name': 'Johnson'},
    {'uid': 'fake-user-2', 'username': 'GymRat99', 'email': 'gymrat99@example.com', 'first_name': 'Mike', 'last_name': 'Smith'},
    {'uid': 'fake-user-3', 'username': 'ProteinKing', 'email': 'proteinking@example.com', 'first_name': 'Chris', 'last_name': 'Davis'},
    {'uid': 'fake-user-4', 'username': 'CardioQueen', 'email': 'cardioqueen@example.com', 'first_name': 'Sarah', 'last_name': 'Williams'},
    {'uid': 'fake-user-5', 'username': 'LiftMaster', 'email': 'liftmaster@example.com', 'first_name': 'David', 'last_name': 'Brown'},
    {'uid': 'fake-user-6', 'username': 'YogaZen', 'email': 'yogazen@example.com', 'first_name': 'Emma', 'last_name': 'Taylor'},
    {'uid': 'fake-user-7', 'username': 'CrossFitPro', 'email': 'crossfitpro@example.com', 'first_name': 'James', 'last_name': 'Wilson'},
    {'uid': 'fake-user-8', 'username': 'NutritionNerd', 'email': 'nutritionnerd@example.com', 'first_name': 'Lisa', 'last_name': 'Anderson'},
    {'uid': 'fake-user-9', 'username': 'BeastMode', 'email': 'beastmode@example.com', 'first_name': 'Tom', 'last_name': 'Martinez'},
    {'uid': 'fake-user-10', 'username': 'FlexFlex', 'email': 'flexflex@example.com', 'first_name': 'Jessica', 'last_name': 'Garcia'},
    {'uid': 'fake-user-11', 'username': 'IronWill', 'email': 'ironwill@example.com', 'first_name': 'Ryan', 'last_name': 'Lee'},
    {'uid': 'fake-user-12', 'username': 'MuscleBuilder', 'email': 'musclebuilder@example.com', 'first_name': 'Amanda', 'last_name': 'White'},
    {'uid': 'fake-user-13', 'username': 'FitLife', 'email': 'fitlife@example.com', 'first_name': 'Kevin', 'last_name': 'Harris'},
    {'uid': 'fake-user-14', 'username': 'PowerLifter', 'email': 'powerlifter@example.com', 'first_name': 'Nicole', 'last_name': 'Clark'},
    {'uid': 'fake-user-15', 'username': 'EnduranceElite', 'email': 'enduranceelite@example.com', 'first_name': 'Brian', 'last_name': 'Lewis'},
]

# Post templates for different clusters
POST_TEMPLATES = [
    # Cluster 1: Supplements discussion
    {'title': 'Best Protein Powder in 2025?', 'content': 'Looking for recommendations on the best protein powder. What are your favorites?', 'category': 'Supplements'},
    {'title': 'Pre-Workout Recommendations', 'content': 'Need a good pre-workout that gives energy without the crash. Any suggestions?', 'category': 'Supplements'},
    {'title': 'Creatine Timing Question', 'content': 'When do you take creatine? Before or after workout? Does timing matter?', 'category': 'Supplements'},
    
    # Cluster 2: Exercise discussion
    {'title': 'Best Bicep Exercises?', 'content': 'What are your go-to bicep exercises for building size?', 'category': 'Exercises'},
    {'title': 'Squat Form Check', 'content': 'Trying to improve my squat form. Any tips for going deeper safely?', 'category': 'Exercises'},
    {'title': 'Deadlift PR Today!', 'content': 'Just hit a new deadlift PR! What helped you break through plateaus?', 'category': 'Exercises'},
    
    # Cluster 3: Nutrition discussion
    {'title': 'High Protein Meal Prep Ideas', 'content': 'Need meal prep ideas that are high in protein. What do you make?', 'category': 'Nutrition'},
    {'title': 'Cutting Diet Tips', 'content': 'Starting a cut next week. What are your favorite low-calorie, high-protein foods?', 'category': 'Nutrition'},
    {'title': 'Post-Workout Nutrition', 'content': 'What do you eat after a workout? Is the anabolic window real?', 'category': 'Nutrition'},
    
    # Cluster 4: General fitness
    {'title': 'How to Stay Motivated?', 'content': 'Struggling with motivation lately. How do you stay consistent?', 'category': 'General'},
    {'title': 'Rest Day Activities', 'content': 'What do you do on rest days? Active recovery or complete rest?', 'category': 'General'},
    {'title': 'Home Gym Setup', 'content': 'Building a home gym. What equipment should I prioritize?', 'category': 'General'},
]

# Reply templates
REPLY_TEMPLATES = [
    'Great question! I\'ve been using {product} and it works really well.',
    'I agree with the previous comment. {additional_thought}',
    'Have you tried {suggestion}? It might help with that.',
    'That\'s exactly what I was thinking! {elaboration}',
    'I\'ve had similar experiences. {personal_insight}',
    'Thanks for sharing! {appreciation}',
    'This is really helpful. {follow_up}',
    'I\'ll have to try that. {enthusiasm}',
]

def ensure_users_exist():
    """Create fake users in Firestore if they don't exist"""
    print("📝 Ensuring fake users exist in Firestore...")
    users_created = 0
    
    for user_data in FAKE_USERS:
        user_ref = db.collection('users').document(user_data['uid'])
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            user_doc_data = {
                'uid': user_data['uid'],
                'username': user_data['username'],
                'email': user_data['email'],
                'first_name': user_data['first_name'],
                'last_name': user_data['last_name'],
                'following': [],  # Initialize empty following list
                'created_at': datetime.now(),
                'updated_at': datetime.now()
            }
            user_ref.set(user_doc_data)
            users_created += 1
            print(f"  ✓ Created user: {user_data['username']}")
        else:
            # Ensure existing users have a following field
            existing_data = user_doc.to_dict()
            if 'following' not in existing_data:
                user_ref.update({'following': []})
            print(f"  - User already exists: {user_data['username']}")
    
    print(f"\n✅ {users_created} new users created, {len(FAKE_USERS) - users_created} already existed\n")
    return [u['uid'] for u in FAKE_USERS]

def get_existing_users_from_posts():
    """Get all unique user UIDs from existing posts and replies"""
    existing_uids = set()
    
    # Get from posts
    posts = db.collection('posts').stream()
    for post in posts:
        data = post.to_dict() or {}
        author_uid = data.get('author_uid')
        if author_uid:
            existing_uids.add(author_uid)
    
    # Get from replies
    replies = db.collection('replies').stream()
    for reply in replies:
        data = reply.to_dict() or {}
        user_uid = data.get('user_uid')
        if user_uid:
            existing_uids.add(user_uid)
    
    # Also get all users from users collection
    users = db.collection('users').stream()
    for user in users:
        data = user.to_dict() or {}
        uid = data.get('uid') or user.id
        if uid:
            existing_uids.add(uid)
    
    return list(existing_uids)

def create_cluster_interactions():
    """Create posts and replies that will form clusters using union-find"""
    print("🔗 Creating cluster interactions...")
    
    # Get all available users (fake + existing)
    fake_user_uids = ensure_users_exist()
    existing_uids = get_existing_users_from_posts()
    all_user_uids = list(set(fake_user_uids + existing_uids))
    
    if len(all_user_uids) < 2:
        print("❌ Need at least 2 users to create clusters")
        return
    
    print(f"📊 Using {len(all_user_uids)} users for cluster creation\n")
    
    # Create 3-4 clusters by grouping users
    # Cluster 1: Users 0-4 (Supplements)
    # Cluster 2: Users 5-9 (Exercises)
    # Cluster 3: Users 10-14 (Nutrition)
    # Cluster 4: Mix of users (General)
    
    clusters_config = [
        {
            'name': 'Supplements Cluster',
            'user_indices': list(range(min(5, len(all_user_uids)))),
            'post_templates': [p for p in POST_TEMPLATES if p['category'] == 'Supplements'],
        },
        {
            'name': 'Exercises Cluster',
            'user_indices': list(range(5, min(10, len(all_user_uids)))),
            'post_templates': [p for p in POST_TEMPLATES if p['category'] == 'Exercises'],
        },
        {
            'name': 'Nutrition Cluster',
            'user_indices': list(range(10, min(15, len(all_user_uids)))),
            'post_templates': [p for p in POST_TEMPLATES if p['category'] == 'Nutrition'],
        },
        {
            'name': 'General Fitness Cluster',
            'user_indices': list(range(min(15, len(all_user_uids)))),
            'post_templates': [p for p in POST_TEMPLATES if p['category'] == 'General'],
        },
    ]
    
    posts_created = 0
    replies_created = 0
    
    for cluster_config in clusters_config:
        if not cluster_config['user_indices']:
            continue
            
        cluster_users = [all_user_uids[i] for i in cluster_config['user_indices'] if i < len(all_user_uids)]
        if len(cluster_users) < 2:
            continue
        
        print(f"🌐 Creating {cluster_config['name']} with {len(cluster_users)} users...")
        
        # Create 2-3 posts per cluster
        num_posts = min(3, len(cluster_config['post_templates']))
        selected_templates = random.sample(cluster_config['post_templates'], num_posts) if len(cluster_config['post_templates']) >= num_posts else cluster_config['post_templates']
        
        for template in selected_templates:
            # Pick a random author from cluster
            author_uid = random.choice(cluster_users)
            
            # Get user info for author name
            user_ref = db.collection('users').document(author_uid)
            user_doc = user_ref.get()
            author_name = user_doc.to_dict().get('username', 'Unknown') if user_doc.exists else 'Unknown'
            
            # Create post
            post_id = str(uuid.uuid4())
            post_data = {
                'id': post_id,
                'title': template['title'],
                'content': template['content'],
                'author': author_name,
                'author_uid': author_uid,
                'category': template['category'],
                'likes': random.randint(0, 20),
                'created_at': datetime.now() - timedelta(days=random.randint(0, 7)),
                'updated_at': datetime.now() - timedelta(days=random.randint(0, 7)),
            }
            
            db.collection('posts').document(post_id).set(post_data)
            posts_created += 1
            print(f"  ✓ Created post: {template['title']}")
            
            # Create 2-4 replies from other users in the cluster
            other_users = [u for u in cluster_users if u != author_uid]
            num_replies = min(random.randint(2, 4), len(other_users))
            reply_users = random.sample(other_users, num_replies) if len(other_users) >= num_replies else other_users
            
            for reply_user_uid in reply_users:
                # Get user info for reply
                reply_user_ref = db.collection('users').document(reply_user_uid)
                reply_user_doc = reply_user_ref.get()
                if reply_user_doc.exists:
                    reply_username = reply_user_doc.to_dict().get('username', f'User-{reply_user_uid[:8]}')
                else:
                    # If user doesn't exist, create a minimal user doc
                    reply_username = f'User-{reply_user_uid[:8]}'
                    reply_user_ref.set({
                        'uid': reply_user_uid,
                        'username': reply_username,
                        'email': f'{reply_username.lower()}@example.com',
                        'first_name': reply_username.split('-')[0],
                        'last_name': 'User',
                        'following': [],  # Initialize empty following list
                        'created_at': datetime.now(),
                        'updated_at': datetime.now()
                    })
                
                # Create reply
                reply_id = str(uuid.uuid4())
                reply_text = random.choice(REPLY_TEMPLATES).format(
                    product='Optimum Nutrition',
                    additional_thought='I\'ve had great results with this approach.',
                    suggestion='adding more volume',
                    elaboration='It really makes a difference.',
                    personal_insight='I found that consistency is key.',
                    appreciation='This helped me a lot!',
                    follow_up='I\'ll definitely try this.',
                    enthusiasm='Sounds like a great plan!'
                )
                
                reply_data = {
                    'id': reply_id,
                    'post_id': post_id,
                    'user': reply_username,
                    'user_uid': reply_user_uid,
                    'text': reply_text,
                    'created_at': datetime.now() - timedelta(days=random.randint(0, 6)),
                }
                
                db.collection('replies').document(reply_id).set(reply_data)
                replies_created += 1
                print(f"    → Reply from {reply_username}")
        
        print()
    
        print(f"✅ Created {posts_created} posts and {replies_created} replies")
    print(f"📊 These interactions will form clusters via Union-Find algorithm\n")
    
    # Add some following relationships to make suggested friends more interesting
    print("👥 Adding some following relationships...")
    following_added = add_following_relationships(all_user_uids)
    print(f"✅ Added {following_added} following relationships\n")

def add_following_relationships(all_user_uids):
    """Add some following relationships between users to make suggested friends more interesting"""
    following_count = 0
    
    # Create some following relationships within clusters
    # This simulates users who are already following some people in their cluster
    # but not everyone, so there are still suggestions available
    
    if len(all_user_uids) < 3:
        return 0
    
    # Randomly add some following relationships
    # Each user follows 1-3 other users (but not all in their cluster)
    for user_uid in all_user_uids[:10]:  # Only for first 10 users to keep it simple
        user_ref = db.collection('users').document(user_uid)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            continue
        
        user_data = user_doc.to_dict()
        current_following = user_data.get('following', [])
        
        # Pick 1-3 random users to follow (excluding self)
        other_users = [uid for uid in all_user_uids if uid != user_uid]
        num_to_follow = random.randint(1, min(3, len(other_users)))
        users_to_follow = random.sample(other_users, num_to_follow)
        
        # Add new follows (avoid duplicates)
        new_follows = [uid for uid in users_to_follow if uid not in current_following]
        if new_follows:
            updated_following = current_following + new_follows
            user_ref.update({'following': updated_following})
            following_count += len(new_follows)
    
    return following_count

def test_cluster_retrieval():
    """Test that clusters can be retrieved"""
    print("🧪 Testing cluster retrieval...")
    try:
        from communities.social_graph_expanded import build_social_clusters_expanded
        clusters = build_social_clusters_expanded()
        
        print(f"✅ Successfully retrieved {len(clusters)} clusters")
        for i, cluster in enumerate(clusters, 1):
            if len(cluster) == 0:
                continue
            print(f"  Cluster {i}: {len(cluster)} users")
            for user in cluster[:3]:  # Show first 3 users
                username = user.get('username', 'Unknown')
                uid = user.get('uid', 'N/A')
                following_count = len(user.get('following', []))
                print(f"    - {username} ({uid}) - following {following_count} users")
            if len(cluster) > 3:
                print(f"    ... and {len(cluster) - 3} more")
        
        # Test suggested friends for a sample user
        print("\n🧪 Testing suggested friends...")
        if clusters and len(clusters[0]) > 0:
            sample_user_uid = clusters[0][0].get('uid')
            if sample_user_uid:
                db = get_firestore_client()
                user_doc = db.collection("users").document(sample_user_uid).get()
                if user_doc.exists:
                    user_data = user_doc.to_dict()
                    following = user_data.get('following', [])
                    cluster_members = [m.get('uid') for m in clusters[0]]
                    suggested = [uid for uid in cluster_members if uid != sample_user_uid and uid not in following]
                    print(f"  Sample user: {user_data.get('username', 'Unknown')}")
                    print(f"  Following: {len(following)} users")
                    print(f"  Suggested friends in cluster: {len(suggested)} users")
        
        return True
    except Exception as e:
        print(f"❌ Error retrieving clusters: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    print("=" * 60)
    print("🚀 Creating Cluster Data with Union-Find Algorithm")
    print("=" * 60)
    print()
    
    try:
        # Step 1: Create users
        ensure_users_exist()
        
        # Step 2: Create interactions (posts + replies)
        create_cluster_interactions()
        
        # Step 3: Test cluster retrieval
        print("=" * 60)
        test_cluster_retrieval()
        print("=" * 60)
        
        print("\n✅ Cluster data creation complete!")
        print("💡 The clusters are computed dynamically when you call the API endpoints:")
        print("   - GET /api/social/clusters/expanded/")
        print("   - GET /api/social/my-cluster/")
        print("   - GET /api/social/suggested-friends/")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

