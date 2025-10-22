from django.urls import path, include
from config.views import (
    login_view,
    queue_enqueue,
    queue_dequeue,
    queue_peek,
    queue_list,
)

urlpatterns = [
    path('api/login/', login_view),
    
    # Progress app with edit/delete endpoints
    path('api/', include('progress.urls')),

    # Priority queue endpoints
    path('api/queue/enqueue/', queue_enqueue),
    path('api/queue/dequeue/', queue_dequeue),
    path('api/queue/peek/', queue_peek),
    path('api/queue/list/', queue_list),
]

