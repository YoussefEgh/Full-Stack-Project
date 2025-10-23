from django.db import models
from django.contrib.auth.models import User

class Post(models.Model):
    CATEGORY_CHOICES = [
        ('Supplements', 'Supplements'),
        ('Exercises', 'Exercises'),
        ('Nutrition', 'Nutrition'),
        ('General', 'General'),
    ]
    
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.CharField(max_length=100)  # For now, just store username as string
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='General')
    likes = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title

class Reply(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='replies')
    user = models.CharField(max_length=100)  # For now, just store username as string
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"Reply by {self.user} on {self.post.title}"
