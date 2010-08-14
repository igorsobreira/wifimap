from django.utils import simplejson

import urllib
import re

def point_by_ip(ip):
    response = urllib.urlopen('http://api.hostip.info/get_html.php?ip=%s' % ip).read()

    country = re.search('Country: (.*)', response).group(1)
    city = re.search('City: (.*)', response).group(1)
    
    if 'Unknown' in city:
        geo_data =  geocode(country)
    else:
        geo_data = geocode(city)
        
    address = geo_data['Placemark'][0]['address']
    lng, lat = geo_data['Placemark'][0]['Point']['coordinates'][:2]
    
    return [address, [lat, lng]]


def geocode(q):
    json = simplejson.load(urllib.urlopen(
        'http://maps.google.com/maps/geo?' + urllib.urlencode({
            'q': q,
            'output': 'json',
            'oe': 'utf8',
            'sensor': 'false',
        })
    ))
    
    return json