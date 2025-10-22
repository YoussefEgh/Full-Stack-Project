from django.urls import path
from . import views

urlpatterns = [
    path('progress/', views.workout_progress_list, name='workout_progress_list'),
    path('progress/<int:pk>/', views.workout_progress_detail, name='workout_progress_detail'),
]
