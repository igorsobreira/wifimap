# -*- coding: utf-8 -*-
from django.shortcuts import render_to_response
from django.views.generic.simple import direct_to_template
from django.utils.translation import ugettext as _
from django.http import HttpResponse
from django.utils import simplejson
from geocoders.google import geocoder

from spots.forms import AccessPointForm
from spots.models import AccessPoint


def index(request):
    return direct_to_template(request, 'index.html', extra_context={})


def add_spot(request):
    success_message = None
    error_message = None
    
    if request.method == 'POST':
        form = AccessPointForm(data=request.POST)
        if form.is_valid():
            ap = form.save(commit=False)
            ap.lat = request.POST['lat']
            ap.lng = request.POST['lng']
            ap.save()
            success_message = _(u"Your point has been saved")
        else:
            error_message = _(u"Please correct the errors below")
    
    if request.method == 'GET' or success_message:
        form = AccessPointForm()
    
    return direct_to_template(request, 'spots/add.html', {
            'form': form,
            'success_message': success_message,
            'error_message': error_message,
        })

def search_spots(request):
    json = {'points':[]}
        
    points = AccessPoint.objects.all()
    
    if request.GET:
        geocode = geocoder()
        json['center_point'] = geocode(request.GET['place'])
    
    for point in points:
        json['points'].append(
            (point.lat, point.lng,)
        )
    
    return HttpResponse(simplejson.dumps(json), mimetype="application/json")

