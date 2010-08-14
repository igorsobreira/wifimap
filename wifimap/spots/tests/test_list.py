from django.test import TestCase

from spots.models import AccessPoint
from spots.views import list_spots

class ListViewTest(TestCase):
    
    def setUp(self):
        self.add_some_points()
        self.access_points = AccessPoint.objects.all()
        
    def tearDown(self):
        AccessPoint.objects.all().delete()
        
    def add_some_points(self):
        self.point1 = AccessPoint.objects.create(name='point 1', description='Point 1 description', address='Rio de Janeiro, Brazil', lat=-22.9963233069, lng=-43.3637237549)
        self.point2 = AccessPoint.objects.create(name='point 2', address='Porto Alegre, Brazil', lat=24, lng=24)
        
    def test_list_spots(self):
        response = list_spots(self.access_points)
        assert 'point 1' in response
        
    def test_name_in_spots_list(self):
        response = list_spots(self.access_points)
        assert 'point 1' in response
        
    def test_address_in_spots_list(self):
        response = list_spots(self.access_points)
        assert 'Rio de Janeiro, Brazil' in response
        
    def test_description_in_spots_list(self):
        response = list_spots(self.access_points)
        assert 'Point 1 description' in response
