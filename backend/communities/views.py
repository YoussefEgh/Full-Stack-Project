from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import json
from .firebase_service import (
    create_post,
    get_all_posts,
    get_post,
    update_post,
    delete_post,
    like_post,
    create_reply,
    delete_reply
)
from authentication.firebase_service import verify_firebase_token
from config.firebase import initialize_firebase

# Initialize Firebase on app startup
initialize_firebase()

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def post_list(request):
    if request.method == 'GET':
        sort_by = request.GET.get('sort_by', 'date')
        
        posts_data = get_all_posts(sort_by=sort_by)
        
        return JsonResponse(posts_data, safe=False)
    
    elif request.method == 'POST':
        try:
            # Verify Firebase token to get user UID
            auth_header = request.headers.get('Authorization', '')
            if not auth_header.startswith('Bearer '):
                return JsonResponse({'error': 'Authorization token required'}, status=401)
            
            token = auth_header.split('Bearer ')[1]
            decoded_token = verify_firebase_token(token)
            
            if not decoded_token:
                return JsonResponse({'error': 'Invalid token'}, status=401)
            
            user_uid = decoded_token['uid']
            
            data = json.loads(request.body)
            post = create_post(
                title=data['title'],
                content=data['content'],
                author_uid=user_uid,
                category=data.get('category', 'General')
            )
            return JsonResponse({'id': post['id'], 'message': 'Post created successfully'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def post_detail(request, pk):
    post = get_post(pk)
    
    if not post:
        return JsonResponse({'error': 'Post not found'}, status=404)
    
    if request.method == 'GET':
        return JsonResponse(post)
    
    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
            updated_post = update_post(
                post_id=pk,
                title=data.get('title'),
                content=data.get('content')
            )
            return JsonResponse({'message': 'Post updated successfully'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    elif request.method == 'DELETE':
        delete_post(pk)
        return JsonResponse({'message': 'Post deleted successfully'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def post_like(request, pk):
    likes = like_post(pk)
    
    if likes is None:
        return JsonResponse({'error': 'Post not found'}, status=404)
    
    return JsonResponse({'likes': likes})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reply_create(request, post_id):
    try:
        # Verify Firebase token to get user UID
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return JsonResponse({'error': 'Authorization token required'}, status=401)
        
        token = auth_header.split('Bearer ')[1]
        decoded_token = verify_firebase_token(token)
        
        if not decoded_token:
            return JsonResponse({'error': 'Invalid token'}, status=401)
        
        user_uid = decoded_token['uid']
        
        data = json.loads(request.body)
        reply = create_reply(
            post_id=post_id,
            user_uid=user_uid,
            text=data['text']
        )
        return JsonResponse(reply, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_post_view(request, pk):
    try:
        # Verify Firebase token to get user UID
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return JsonResponse({'error': 'Authorization token required'}, status=401)
        
        token = auth_header.split('Bearer ')[1]
        decoded_token = verify_firebase_token(token)
        
        if not decoded_token:
            return JsonResponse({'error': 'Invalid token'}, status=401)
        
        user_uid = decoded_token['uid']
        
        # Get post to verify ownership
        post = get_post(pk)
        if not post:
            return JsonResponse({'error': 'Post not found'}, status=404)
        
        if post.get('author_uid') != user_uid:
            return JsonResponse({'error': 'Not authorized to delete this post'}, status=403)
        
        delete_post(pk)
        return JsonResponse({'message': 'Post deleted successfully'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_reply_view(request, reply_id):
    try:
        # Verify Firebase token to get user UID
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return JsonResponse({'error': 'Authorization token required'}, status=401)
        
        token = auth_header.split('Bearer ')[1]
        decoded_token = verify_firebase_token(token)
        
        if not decoded_token:
            return JsonResponse({'error': 'Invalid token'}, status=401)
        
        user_uid = decoded_token['uid']
        
        # Get reply to verify ownership
        from config.firestore import get_firestore_client
        db = get_firestore_client()
        reply_ref = db.collection('replies').document(reply_id)
        reply = reply_ref.get()
        
        if not reply.exists:
            return JsonResponse({'error': 'Reply not found'}, status=404)
        
        reply_data = reply.to_dict()
        if reply_data.get('user_uid') != user_uid:
            return JsonResponse({'error': 'Not authorized to delete this reply'}, status=403)
        
        delete_reply(reply_id)
        return JsonResponse({'message': 'Reply deleted successfully'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
