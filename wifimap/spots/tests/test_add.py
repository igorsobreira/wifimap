from django.test import TestCase
from django.core.urlresolvers import reverse

from spots.models import AccessPoint

class AddViewTest(TestCase):
    
    def setUp(self):
        self.url = reverse('spots_add')
    
    def test_view_exists(self):
        response = self.client.get(self.url)    
        assert 200 == response.status_code
    
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
    
    def test_submit_invalid_form_show_errors(self):
        post = {'foo': 'all empty'}
        response = self.client.post(self.url, post)
        
        assert 200 == response.status_code
        assert 0 == AccessPoint.objects.count()