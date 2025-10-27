from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/', views.user_profile_view, name='user_profile'),
    path('profile/update/', views.update_profile_view, name='update_profile'),
    path('change-password/', views.change_password_view, name='change_password'),
    path('token/refresh/', views.refresh_token_view, name='refresh_token'),
]
