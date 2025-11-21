from django.urls import path
from . import views

urlpatterns = [
    # Workout days endpoints
    path('progress/days/', views.workout_days_list, name='workout_days_list'),
    path('progress/days/<str:day_id>/', views.workout_day_detail, name='workout_day_detail'),
    
    # Exercise endpoints
    path('progress/days/<str:day_id>/exercises/', views.add_exercise, name='add_exercise'),
    path('progress/days/<str:day_id>/exercises/<str:exercise_id>/', views.exercise_detail, name='exercise_detail'),
    
    # Exercise autocomplete endpoint
    path('progress/exercises/autocomplete/', views.exercise_autocomplete, name='exercise_autocomplete'),
    path('progress/exercises/rebuild-trie/', views.rebuild_exercise_trie, name='rebuild_exercise_trie'),
]
