from rest_framework import serializers
from .models import Post, Reply

class ReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        fields = ['id', 'user', 'text', 'created_at']

class PostSerializer(serializers.ModelSerializer):
    replies = ReplySerializer(many=True, read_only=True)
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author', 'category', 'likes', 'created_at', 'updated_at', 'replies']
