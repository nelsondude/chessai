from .views import AiView
from django.urls import path

urlpatterns = [
	path('', AiView.as_view())
]