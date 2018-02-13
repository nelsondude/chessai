from .views import AiView, LegalView
from django.urls import path

urlpatterns = [
	path('', AiView.as_view()),
	path('islegal', LegalView.as_view())
]