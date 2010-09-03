# -*- coding: utf-8 -*-
from django.utils import simplejson

import urllib
import re
from xml.dom import minidom

def get_text(nodelist):
    rc = []
    for node in nodelist:
        if node.nodeType == node.TEXT_NODE:
            rc.append(node.data)
    return ''.join(rc)

def point_by_ip(ip):
    url_source = 'http://ipinfodb.com/ip_query.php?ip=%s'
    response = minidom.parse(urllib.urlopen(url_source % ip))

    country = get_text(response.getElementsByTagName("CountryName")[0].childNodes)
    city = get_text(response.getElementsByTagName("City")[0].childNodes)
    
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

