import json

from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
from .chess import is_legal, get_best_move, modify_legal_board


@method_decorator(csrf_exempt, name='dispatch')
class BaseView(View):
	def get_data(self, request):
		data_unicode = request.body.decode('utf-8')
		return json.loads(data_unicode)


class AiView(BaseView):
	def get(self, request, *args, **kwargs):
		return HttpResponse('NA')

	def post(self, request, *args, **kwargs):
		data = self.get_data(request)
		board = data.get('board')
		turn = data.get('turn')
		depth = 3
		new_board = get_best_move(board, turn, depth)
		return HttpResponse(json.dumps(new_board))


class LegalView(BaseView):
	def get(self, request, *args, **kwargs):
		return HttpResponse(json.dumps({}))

	def post(self, request, *args, **kwargs):
		data = self.get_data(request)

		board = data.get('board')
		coors1 = data.get('coors')
		coors2 = data.get('newCoors')
		turn = data.get('turn')

		legal = is_legal(board, coors1, coors2, turn)
		if legal['castle']:
			board1 = modify_legal_board(board, {'row': coors1['row'], 'col': 7}, {'row': coors1['row'], 'col': 5})
			new_board = modify_legal_board(board1, coors1, coors2)
		else:
			new_board = modify_legal_board(board, coors1, coors2) if legal['legal'] else board
		result = {'legal': legal, 'board': new_board}

		return HttpResponse(json.dumps(result))
