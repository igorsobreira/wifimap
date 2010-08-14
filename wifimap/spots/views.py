# -*- coding: utf-8 -*-
from django.shortcuts import render_to_response
from django.views.generic.simple import direct_to_template

from spots.forms import AccessPointForm


def index(request):
    return direct_to_template(request, 'index.html', extra_context={})


def add_spot(request):
    if request.method == 'POST':
        form = AccessPointForm(data=request.POST)
        if form.is_valid():
            ap = form.save(commit=False)
            ap.lat = request.POST['lat']
            ap.lng = request.POST['lng']
            ap.save()
    else:
        form = AccessPointForm()
    
    return render_to_response('spots/add.html', {'form': form})
    
def search_spots(request):
    return render_to_response('spots/search.html', {})