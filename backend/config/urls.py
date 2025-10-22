
from django.urls import path, include
from config.views import login_view

urlpatterns = [
    path('api/login/', login_view),
    path('api/', include('progress.urls')),
]
