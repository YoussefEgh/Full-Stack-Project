from django.urls import path
from . import views

urlpatterns = [
    path('posts/', views.post_list, name='post-list'),
    path('posts/<str:pk>/', views.post_detail, name='post-detail'),
    path('posts/<str:pk>/like/', views.post_like, name='post-like'),
    path('posts/<str:post_id>/replies/', views.reply_create, name='reply-create'),
]
