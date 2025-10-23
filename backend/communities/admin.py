from django.contrib import admin
from .models import Post, Reply

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category', 'likes', 'created_at']
    list_filter = ['category', 'created_at']
    search_fields = ['title', 'content', 'author']
    ordering = ['-created_at']

@admin.register(Reply)
class ReplyAdmin(admin.ModelAdmin):
    list_display = ['user', 'post', 'created_at']
    list_filter = ['created_at', 'post__category']
    search_fields = ['user', 'text', 'post__title']
    ordering = ['-created_at']
