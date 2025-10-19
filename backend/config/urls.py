from django.urls import path
from config.views import login_view

urlpatterns = [
    path('api/login/', login_view),
]
