# -*- coding: utf-8 -*-
from django.shortcuts import render_to_response

from spots.forms import AccessPointForm


def index(request):
    return render_to_response('index.html', {})


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
