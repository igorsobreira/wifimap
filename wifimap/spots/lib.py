from django.utils import simplejson

import urllib

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