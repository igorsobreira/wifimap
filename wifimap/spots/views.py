# -*- coding: utf-8 -*-
from django.shortcuts import render_to_response, get_object_or_404
from django.views.generic.simple import direct_to_template
from django.template.loader import render_to_string
from django.utils.translation import ugettext as _
from django.http import HttpResponse
from django.utils import simplejson

from spots.forms import AccessPointForm
from spots.models import AccessPoint
from spots.lib import geocode

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
        geo_data = geocode(request.GET['place'])
        
        address = geo_data['Placemark'][0]['address']
        lng, lat = geo_data['Placemark'][0]['Point']['coordinates'][:2]
        json['center_point'] = [
            address, 
            [lat, lng]
        ]
    else:
        json['center_point'] = point_by_ip(request.META['REMOTE_ADDR'])
        
    json['template'] = list_spots(points)

    for point in points:
        json['points'].append(
            (point.lat, point.lng,)
        )
    
    return HttpResponse(simplejson.dumps(json), mimetype="application/json")
    
def list_spots(spots):
    return render_to_string('spots/list.html', {'spots':spots})
    
def spot(request, id):
    access_point = get_object_or_404(AccessPoint, id=id)
    return render_to_response('spots/detail.html', {'spot':access_point})
    
