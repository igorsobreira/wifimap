# -*- coding: utf-8 -*-

from django.conf.urls.defaults import *
from django.conf import settings
from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    
    url(r'^$', 'spots.views.index', name='spots_index'),

    url(r'^spots/add/$', 'spots.views.add_spot', name='spots_add'),
    url(r'^spots/(?P<id>\d+)/$', 'spots.views.spot', name='spot_detail'),
    url(r'^spots/(?P<id>\d+).json$', 'spots.views.spot_json', name='spot_json_detail'),
    url(r'^spots/(?P<id>\d+)/vote/$', 'spots.views.vote', name='spot_vote'),
    url(r'^spots/search/$', 'spots.views.search_spots', name='spots_search'),
    url(r'^spots/list/$', 'spots.views.list_spots', name='spots_list'),

)

if settings.DEBUG:
    urlpatterns += patterns('',
        (r'^media/(?P<path>.*)$', 'django.views.static.serve',
         {'document_root': settings.MEDIA_ROOT})
    )
