# -*- coding: utf-8 -*-

from django.conf.urls.defaults import *
from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    
    url(r'^$', 'spots.views.index', name='spots_index'),
    
    url(r'^spots/add/$', 'spots.views.add_spot', name='spots_add'),
)