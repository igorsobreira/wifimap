from django.test import TestCase
from django.core.urlresolvers import reverse

from spots.models import AccessPoint
from spots.views import list_spots

class ListViewTest(TestCase):
    
    def setUp(self):
        self.add_some_points()
        self.access_points = AccessPoint.objects.all()
        self.url = reverse('spots_list')
        self.response = self.client.get(self.url, {'north':25, 'south':23, 'east':25, 'west':23})
        
    def tearDown(self):
        AccessPoint.objects.all().delete()
        
    def add_some_points(self):
        self.point1 = AccessPoint.objects.create(name='point 1', address='Rio de Janeiro, Brazil', lat=-22.9963233069, lng=-43.3637237549)
        self.point2 = AccessPoint.objects.create(name='point 2', address='Porto Alegre, Brazil', lat=24, lng=24)
        
    def test_list_spots(self):
        assert 'point 2' in self.response.content
        
    def test_name_in_spots_list(self):
        assert 'point 2' in self.response.content
        
    def test_address_in_spots_list(self):
        assert 'Porto Alegre, Brazil' in self.response.content
        
    def test_see_more_in_spots_list(self):
        assert 'see more' in self.response.content