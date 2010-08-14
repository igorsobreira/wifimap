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
    url(r'^spots/search/$', 'spots.views.search_spots', name='spots_search'),
)

if settings.DEBUG:
    urlpatterns += patterns('',
        (r'^media/(?P<path>.*)$', 'django.views.static.serve',
         {'document_root': settings.MEDIA_ROOT})
    )
