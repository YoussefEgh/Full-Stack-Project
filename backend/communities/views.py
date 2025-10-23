from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Q
import json
from .models import Post, Reply

@csrf_exempt
@require_http_methods(["GET", "POST"])
def post_list(request):
    if request.method == 'GET':
        sort_by = request.GET.get('sort_by', 'date')
        
        if sort_by == 'likes':
            posts = Post.objects.all().order_by('-likes', '-created_at')
        else:  # default to date
            posts = Post.objects.all().order_by('-created_at')
        
        posts_data = []
        for post in posts:
            replies_data = []
            for reply in post.replies.all():
                replies_data.append({
                    'id': reply.id,
                    'user': reply.user,
                    'text': reply.text,
                    'created_at': reply.created_at.isoformat()
                })
            
            posts_data.append({
                'id': post.id,
                'title': post.title,
                'content': post.content,
                'author': post.author,
                'category': post.category,
                'likes': post.likes,
                'created_at': post.created_at.isoformat(),
                'updated_at': post.updated_at.isoformat(),
                'replies': replies_data
            })
        
        return JsonResponse(posts_data, safe=False)
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            post = Post.objects.create(
                title=data['title'],
                content=data['content'],
                author=data['author'],
                category=data.get('category', 'General')
            )
            return JsonResponse({'id': post.id, 'message': 'Post created successfully'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["GET", "PUT", "DELETE"])
def post_detail(request, pk):
    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return JsonResponse({'error': 'Post not found'}, status=404)
    
    if request.method == 'GET':
        replies_data = []
        for reply in post.replies.all():
            replies_data.append({
                'id': reply.id,
                'user': reply.user,
                'text': reply.text,
                'created_at': reply.created_at.isoformat()
            })
        
        post_data = {
            'id': post.id,
            'title': post.title,
            'content': post.content,
            'author': post.author,
            'category': post.category,
            'likes': post.likes,
            'created_at': post.created_at.isoformat(),
            'updated_at': post.updated_at.isoformat(),
            'replies': replies_data
        }
        return JsonResponse(post_data)
    
    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
            post.title = data.get('title', post.title)
            post.content = data.get('content', post.content)
            post.save()
            return JsonResponse({'message': 'Post updated successfully'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    elif request.method == 'DELETE':
        post.delete()
        return JsonResponse({'message': 'Post deleted successfully'})

@csrf_exempt
@require_http_methods(["POST"])
def post_like(request, pk):
    try:
        post = Post.objects.get(pk=pk)
        post.likes += 1
        post.save()
        return JsonResponse({'likes': post.likes})
    except Post.DoesNotExist:
        return JsonResponse({'error': 'Post not found'}, status=404)

@csrf_exempt
@require_http_methods(["POST"])
def reply_create(request, post_id):
    try:
        post = Post.objects.get(pk=post_id)
        data = json.loads(request.body)
        reply = Reply.objects.create(
            post=post,
            user=data['user'],
            text=data['text']
        )
        return JsonResponse({
            'id': reply.id,
            'user': reply.user,
            'text': reply.text,
            'created_at': reply.created_at.isoformat()
        }, status=201)
    except Post.DoesNotExist:
        return JsonResponse({'error': 'Post not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
