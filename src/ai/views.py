import json
import random

from django.shortcuts import render
from django.http import HttpResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
# Create your views here.
from .utils import print2dList
from .chess import isLegal, getRandomMove


@method_decorator(csrf_exempt, name='dispatch')
class BaseView(View):
	def getData(self, request):
		data_unicode = request.body.decode('utf-8')
		return json.loads(data_unicode)



class AiView(BaseView):
	def get(self, request, *args, **kwargs):
		return HttpResponse('NA')

	def post(self, request, *args, **kwargs):
		data = self.getData(request)
		color = random.choice(['dark', 'light'])
		newBoard = getRandomMove(data, color)
		return HttpResponse(json.dumps(newBoard))


class LegalView(BaseView):
	def get(self, request, *args, **kwargs):
		return HttpResponse(json.dumps({}))

	def post(self, request, *args, **kwargs):
		data = self.getData(request)

		board = data.get('board')
		piece = data.get('piece')
		coors = data.get('coors')
		newCoors = data.get('newCoors')
		legal = isLegal(board, coors, newCoors)
		result = {'legal': legal}

		# print2dList(board)
		return HttpResponse(json.dumps(result))