# -*- coding: utf-8 -*-
from django.shortcuts import render_to_response, get_object_or_404
from django.views.generic.simple import direct_to_template
from django.template.loader import render_to_string
from django.utils.translation import ugettext as _
from django.http import HttpResponse, HttpResponseNotAllowed,\
        HttpResponseBadRequest, Http404
from django.utils import simplejson
from django.conf import settings

from spots.forms import AccessPointForm
from spots.models import AccessPoint
from spots.lib import geocode, point_by_ip

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

    if request.GET.has_key('place'):
        
        # south = request.GET['south']
        # north = request.GET['north']
        # west = request.GET['west']
        # east = request.GET['east']
        # 
        # points = points.filter(lat__lte=north)
        # points = points.filter(lat__gte=south)
        # points = points.filter(lng__lte=east)
        # points = points.filter(lng__gte=west)
    
        geo_data = geocode(request.GET['place'])
        
        if geo_data['Status']['code'] == 200:
            address = geo_data['Placemark'][0]['address']
            lng, lat = geo_data['Placemark'][0]['Point']['coordinates'][:2]
            json['center_point'] = [
                address, 
                [lat, lng]
            ]
        else:
            json['center_point'] = None
    else:
        if settings.DEBUG:
            json['center_point'] = point_by_ip('200.147.67.142')
        else:
            json['center_point'] = point_by_ip(request.META['REMOTE_ADDR'])
        
    #json['template'] = list_spots(points)

    for point in points:
        json['points'].append(
            {'id':point.id, 'point':[point.lat, point.lng]}
        )
        
    return HttpResponse(simplejson.dumps(json), mimetype="application/json")
    
def list_spots(request):
    spots = AccessPoint.objects.all()
    
    if request.GET.has_key('south'):
    
        south = request.GET['south']
        north = request.GET['north']
        west = request.GET['west']
        east = request.GET['east']
    
        spots = spots.filter(lat__lte=north)
        spots = spots.filter(lat__gte=south)
        spots = spots.filter(lng__lte=east)
        spots = spots.filter(lng__gte=west)

    return render_to_response('spots/list.html', {'spots':spots})
    
def spot(request, id):
    access_point = get_object_or_404(AccessPoint, id=id)
    return render_to_response('spots/detail.html', {'spot':access_point})

def spot_json(request, id):
    access_point = get_object_or_404(AccessPoint, id=id)
    
    json = {
        'name': access_point.name,
        'id': access_point.id,
        'address': access_point.address
    }
    return HttpResponse(simplejson.dumps(json), mimetype="application/json")

def vote(request, id):
    if request.method != 'POST':
        return HttpResponseNotAllowed('Method not allowed')

    vote_type = request.POST.get('vote', None)
    vote_methods = {
        'up': AccessPoint.objects.vote_up,
        'down': AccessPoint.objects.vote_down,
    }

    if vote_type is None or vote_type not in vote_methods.keys():
        return HttpResponseBadRequest('')

    ok = vote_methods[vote_type](id)
    if not ok:
        raise Http404

    access_point = get_object_or_404(AccessPoint, id=id)
    json = {
        'score': access_point.score,
        'votes': access_point.votes,
    }

    return HttpResponse(simplejson.dumps(json), mimetype="application/json")

