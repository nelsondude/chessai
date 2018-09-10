import logging
import os

from django.views.generic import View
from django.http import HttpResponse
from django.conf import settings


class FrontendView(View):
    def get(self, request):
        try:
            with open(os.path.join(settings.ANGULAR_APP_DIR, 'dist',
                                   'index.html')) as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            logging.exception('Production build of app not found')
            return HttpResponse("""
                    This URL is only used when you have built the production
                    version of the app. Visit http://localhost:3000/ 
                    instead, or
                    run `yarn run build` to test the production version.
                    """, status=501, )


from django.contrib import admin
from django.urls import path, include, re_path

urlpatterns = [
    path('ai/', include('ai.urls')),
    path('admin/', admin.site.urls),
    re_path('.*', FrontendView.as_view()),
]
