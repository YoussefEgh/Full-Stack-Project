from django.urls import path, include
from config.views import (
    login_view,
    queue_enqueue,
    queue_dequeue,
    queue_peek,
    queue_list,
    exercises_list,
    exercise_detail,
    exercise_body_parts,
    exercise_targets,
)

urlpatterns = [
    path('api/login/', login_view),
    
    # Progress app with edit/delete endpoints
    path('api/', include('progress.urls')),
    
    # Communities app endpoints
    path('api/communities/', include('communities.urls')),

    # Priority queue endpoints
    path('api/queue/enqueue/', queue_enqueue),
    path('api/queue/dequeue/', queue_dequeue),
    path('api/queue/peek/', queue_peek),
    path('api/queue/list/', queue_list),
    
    # ExerciseDB API endpoints
    path('api/exercises/', exercises_list),
    path('api/exercises/<str:exercise_id>/', exercise_detail),
    path('api/exercises/body-parts/', exercise_body_parts),
    path('api/exercises/targets/', exercise_targets),
]

