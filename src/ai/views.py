from django.shortcuts import render
from django.http import HttpResponse
import json
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
# Create your views here.

@method_decorator(csrf_exempt, name='dispatch')
class AiView(View):
	def get(self, request, *args, **kwargs):
		return HttpResponse('result')

	def post(self, request, *args, **kwargs):
		board = request.POST.getlist('board')
		print(board)
		data = {
			'ai': ['board here']
		}
		return HttpResponse(json.dumps(data))