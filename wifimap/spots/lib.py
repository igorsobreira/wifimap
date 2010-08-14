# -*- coding: utf-8 -*-
from django.utils import simplejson

import urllib
import re

def point_by_ip(ip):
    response = urllib.urlopen('http://api.hostip.info/get_html.php?ip=%s' % ip).read()
    response = unicode(response, 'latin-1')
    
    country = re.search(u'Country: (.*)', response).group(1)
    city = re.search(u'City: (.*)', response).group(1)
    
    if u'Unknown' in city:
        geo_data =  geocode(country)
    else:
        geo_data = geocode(city)
        
    address = geo_data['Placemark'][0]['address']
    lng, lat = geo_data['Placemark'][0]['Point']['coordinates'][:2]
    
    return [address, [lat, lng]]


def geocode(query):
    querystring = urllib.urlencode({
        'q': query.encode('utf-8'),
        'output': 'json',
        'oe': 'utf8',
        'sensor': 'false',
    })
    
    response = urllib.urlopen(
            'http://maps.google.com/maps/geo?' + querystring
    )
    
    json = simplejson.load(response)
    
    return json