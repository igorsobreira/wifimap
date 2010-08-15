
from django.test import TestCase
from django.core.urlresolvers import reverse
from django.utils import simplejson

from spots.models import AccessPoint


class AddViewTest(TestCase):
    
    def setUp(self):
        self.url = reverse('spots_add')
    
    def test_view_exists(self):
        response = self.client.get(self.url)    
        assert 200 == response.status_code
    
    def test_lat_lng_fields_are_hidden(self):
        response = self.client.get(self.url)
        json = simplejson.loads(response.content)
                
        assert u'<input type="hidden" name="lat" id="id_lat" />' in json['content']
        assert u'<input type="hidden" name="lng" id="id_lng" />' in json['content']
    
    def test_address_field_is_readonly(self):
        response = self.client.get(self.url)
        json = simplejson.loads(response.content)
        
        assert u'<input id="id_address" readonly="readonly" type="text" name="address" maxlength="255" />' in json['content']
    
    def test_submit_valid_form(self):
        post = {
            'name': 'test point',
            'address': 'Rio de Janeiro, RJ',
            'lat': '12.3234',
            'lng': '-21.235',
        }
        response = self.client.post(self.url, post)
        
        assert 200 == response.status_code
        assert 1 == AccessPoint.objects.count()
        
        json = simplejson.loads(response.content)
        
        redirect_to = reverse('spot_detail', args=(AccessPoint.objects.all()[0].id,))
        
        assert json['success']
        assert redirect_to == json['redirect_to']
        assert u'id="add-spot-form"' in json['content']
        assert u"Your point has been saved" == json['message']
    
    def test_submit_invalid_form_show_errors(self):
        post = {'foo': 'all empty'}
        response = self.client.post(self.url, post)
        
        assert 200 == response.status_code
        assert 0 == AccessPoint.objects.count()
        
        json = simplejson.loads(response.content)
        
        assert not json['success']
        assert u'id="add-spot-form"' in json['content']
        assert u"Please correct the errors below" == json['message']
    
    
