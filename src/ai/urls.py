from .views import aiView
from django.urls import path

urlpatterns = [
	path('', aiView)
]