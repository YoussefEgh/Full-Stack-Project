from django.urls import path, include
from communities import views as community_views

from config.views import (
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
    # Authentication endpoints
    path('api/auth/', include('authentication.urls')),
    
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

    path("api/social/clusters/", community_views.social_clusters_view, name="social-clusters"),
    path("api/social/clusters/expanded/", community_views.social_clusters_expanded_view),
    path("api/social/my-cluster/", community_views.my_cluster_view),
    path("api/social/suggested-friends/", community_views.suggested_friends_view),
]

