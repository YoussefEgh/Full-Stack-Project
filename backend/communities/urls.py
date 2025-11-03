from django.urls import path
from . import views

urlpatterns = [
    path('posts/', views.post_list, name='post-list'),
    path('posts/<str:pk>/', views.post_detail, name='post-detail'),
    path('posts/<str:pk>/like/', views.post_like, name='post-like'),
    path('posts/<str:pk>/delete/', views.delete_post_view, name='post-delete'),
    path('posts/<str:post_id>/replies/', views.reply_create, name='reply-create'),
    path('replies/<str:reply_id>/delete/', views.delete_reply_view, name='reply-delete'),
]
