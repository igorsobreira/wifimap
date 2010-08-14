from django.test import TestCase
from django.core.urlresolvers import reverse

from spots.models import AccessPoint

class DetailViewTest(TestCase):
    
    def setUp(self):
        self.access_point = AccessPoint.objects.create(name='point 1', description='Point 1 description', address='Rio de Janeiro, Brazil', lat=-22.9963233069, lng=-43.3637237549)
        self.url = reverse('spot_detail', args=[self.access_point.id])
        
    def tearDown(self):
        AccessPoint.objects.all().delete()
        
    def test_view_exists(self):
        response = self.client.get(self.url)    
        assert 200 == response.status_code
        
    def test_name_in_spot_detail(self):
        response = self.client.get(self.url)
        assert 'point 1' in response.content
        
    def test_address_in_spot_detail(self):
        response = self.client.get(self.url)
        assert 'Rio de Janeiro, Brazil' in response.content
        
    def test_description_in_spot_detail(self):
        response = self.client.get(self.url)
        assert 'Point 1 description' in response.content

