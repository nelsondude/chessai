from django.shortcuts import render
from django.http import HttpResponse
import json
# Create your views here.

def aiView(request):
	data = {'name': 'Alex Nelson'}
	return HttpResponse(json.dumps(data))