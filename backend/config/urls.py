from django.urls import path
from config.views import (
    login_view,
    progress_view,
    queue_enqueue,
    queue_dequeue,
    queue_peek,
    queue_list,
)

urlpatterns = [
    path('api/login/', login_view),
    path('api/progress/', progress_view),

    # Priority queue endpoints
    path('api/queue/enqueue/', queue_enqueue),
    path('api/queue/dequeue/', queue_dequeue),
    path('api/queue/peek/', queue_peek),
    path('api/queue/list/', queue_list),
]

