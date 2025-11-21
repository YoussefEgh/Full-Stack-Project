"""
Firebase service layer for Communities
"""
from config.firestore import get_firestore_client
from config.data_structures.priority_queue import PriorityQueue
from datetime import datetime
import uuid

def create_post(title, content, author_uid, category='General'):
    """
    Create a new post in Firestore
    """
    db = get_firestore_client()
    post_id = str(uuid.uuid4())
    
    # Get user info
    user_ref = db.collection('users').document(author_uid)
    user = user_ref.get()
    username = user.to_dict().get('username', 'Unknown') if user.exists else 'Unknown'
    
    post_data = {
        'id': post_id,
        'title': title,
        'content': content,
        'author': username,
        'author_uid': author_uid,
        'category': category,
        'likes': 0,
        'liked_by': [],  # List of user UIDs who liked this post
        'created_at': datetime.now(),
        'updated_at': datetime.now()
    }
    
    db.collection('posts').document(post_id).set(post_data)
    return post_data

def get_all_posts(sort_by='date', user_uid=None):
    """
    Get all posts from Firestore, sorted by date or likes using custom PriorityQueue
    If user_uid is provided, also includes whether the user has liked each post
    """
    db = get_firestore_client()
    
    # Fetch all posts without ordering (Firestore provides them in arbitrary order)
    posts_query = db.collection('posts')
    posts = posts_query.stream()
    
    # Create priority queue
    pq = PriorityQueue()
    
    # Process each post
    for post in posts:
        post_data = post.to_dict()
        
        # Store original datetime for priority calculation
        created_at_dt = post_data.get('created_at')
        
        # Convert to ISO format for frontend
        post_data['created_at'] = created_at_dt.isoformat() if created_at_dt else None
        post_data['updated_at'] = post_data['updated_at'].isoformat() if post_data.get('updated_at') else None
        
        # Check if current user has liked this post
        liked_by = post_data.get('liked_by', [])
        post_data['liked'] = user_uid in liked_by if user_uid else False
        
        # Get replies for this post
        replies_query = db.collection('replies').where('post_id', '==', post_data['id'])
        replies = replies_query.stream()
        
        post_data['replies'] = []
        for reply in replies:
            reply_data = reply.to_dict()
            reply_data['created_at'] = reply_data['created_at'].isoformat() if reply_data.get('created_at') else None
            post_data['replies'].append(reply_data)
        
        # Sort replies by created_at in Python
        post_data['replies'].sort(key=lambda x: x.get('created_at', ''))
        
        # Calculate priority based on sort_by parameter
        if sort_by == 'likes':
            # For "most liked": use likes count as priority (higher likes = higher priority)
            priority = post_data.get('likes', 0)
        else:
            # For "latest": use timestamp as priority (more recent = higher priority)
            if created_at_dt:
                # Convert datetime to seconds since epoch
                priority = int(created_at_dt.timestamp())
            else:
                priority = 0
        
        # Push post into priority queue with calculated priority
        pq.push(post_data, priority)
    
    # Pop all posts from priority queue (highest priority first)
    posts_list = []
    while not pq.is_empty():
        priority, post_data = pq.pop()
        posts_list.append(post_data)
    
    return posts_list

def get_post(post_id, user_uid=None):
    """
    Get a specific post by ID
    If user_uid is provided, also includes whether the user has liked this post
    """
    db = get_firestore_client()
    post_ref = db.collection('posts').document(post_id)
    post = post_ref.get()
    
    if not post.exists:
        return None
    
    post_data = post.to_dict()
    post_data['created_at'] = post_data['created_at'].isoformat() if post_data.get('created_at') else None
    post_data['updated_at'] = post_data['updated_at'].isoformat() if post_data.get('updated_at') else None
    
    # Check if current user has liked this post
    liked_by = post_data.get('liked_by', [])
    post_data['liked'] = user_uid in liked_by if user_uid else False
    
    # Get replies for this post (without ordering to avoid index requirement)
    replies_query = db.collection('replies').where('post_id', '==', post_id)
    replies = replies_query.stream()
    
    post_data['replies'] = []
    for reply in replies:
        reply_data = reply.to_dict()
        reply_data['created_at'] = reply_data['created_at'].isoformat() if reply_data.get('created_at') else None
        post_data['replies'].append(reply_data)
    
    # Sort replies by created_at in Python (not requiring index)
    post_data['replies'].sort(key=lambda x: x.get('created_at', ''))
    
    return post_data

def update_post(post_id, title=None, content=None):
    """
    Update a post in Firestore
    """
    db = get_firestore_client()
    post_ref = db.collection('posts').document(post_id)
    
    updates = {
        'updated_at': datetime.now()
    }
    
    if title is not None:
        updates['title'] = title
    if content is not None:
        updates['content'] = content
    
    post_ref.update(updates)
    return get_post(post_id)

def delete_post(post_id):
    """
    Delete a post and all its replies from Firestore
    """
    db = get_firestore_client()
    
    # Delete all replies for this post
    replies_query = db.collection('replies').where('post_id', '==', post_id)
    replies = replies_query.stream()
    for reply in replies:
        db.collection('replies').document(reply.id).delete()
    
    # Delete the post
    db.collection('posts').document(post_id).delete()
    return True

def like_post(post_id, user_uid):
    """
    Toggle like for a post - if user already liked, unlike it; otherwise like it
    Returns: (new_like_count, is_liked)
    """
    db = get_firestore_client()
    post_ref = db.collection('posts').document(post_id)
    post = post_ref.get()
    
    if not post.exists:
        return None, False
    
    post_data = post.to_dict()
    liked_by = post_data.get('liked_by', [])  # List of user UIDs who liked this post
    
    # Check if user already liked
    if user_uid in liked_by:
        # Unlike: remove user from liked_by and decrement likes
        liked_by.remove(user_uid)
        current_likes = post_data.get('likes', 0)
        new_likes = max(0, current_likes - 1)  # Don't go below 0
        is_liked = False
    else:
        # Like: add user to liked_by and increment likes
        if user_uid not in liked_by:
            liked_by.append(user_uid)
        current_likes = post_data.get('likes', 0)
        new_likes = current_likes + 1
        is_liked = True
    
    # Update the post
    post_ref.update({
        'likes': new_likes,
        'liked_by': liked_by
    })
    
    return new_likes, is_liked

def create_reply(post_id, user_uid, text):
    """
    Create a reply to a post
    """
    db = get_firestore_client()
    reply_id = str(uuid.uuid4())
    
    # Get user info
    user_ref = db.collection('users').document(user_uid)
    user = user_ref.get()
    username = user.to_dict().get('username', 'Unknown') if user.exists else 'Unknown'
    
    reply_data = {
        'id': reply_id,
        'post_id': post_id,
        'user': username,
        'user_uid': user_uid,
        'text': text,
        'created_at': datetime.now()
    }
    
    db.collection('replies').document(reply_id).set(reply_data)
    
    return {
        'id': reply_id,
        'user': username,
        'user_uid': user_uid,
        'text': text,
        'created_at': reply_data['created_at'].isoformat()
    }

def delete_reply(reply_id):
    """
    Delete a reply from Firestore
    """
    db = get_firestore_client()
    reply_ref = db.collection('replies').document(reply_id)
    reply_ref.delete()
    return True

