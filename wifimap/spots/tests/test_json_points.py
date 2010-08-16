from django.test import TestCase
from django.core.urlresolvers import reverse
from django.utils import simplejson
from django.conf import settings

from spots.models import AccessPoint

class JsonPointsViewTest(TestCase):
    
    def setUp(self):
        self.url = reverse('spots_json_list')
        self.add_some_points()
        self.access_points = AccessPoint.objects.all()
        self.response = self.client.get(self.url) 
        
    def tearDown(self):
        AccessPoint.objects.all().delete()
        
    def add_some_points(self):
        self.point1 = AccessPoint.objects.create(name='point 1', address='Rio de Janeiro, Brazil', lat=-22.9963233069, lng=-43.3637237549)
        self.point2 = AccessPoint.objects.create(name='point 2', address='Porto Alegre, Brazil', lat=24, lng=24)
        
    def test_view_exists(self):
        assert 200 == self.response.status_code
        
    def test_returns_a_json(self):
        assert self.response.items()[0][1] == 'application/json'
    
    def test_returns_all_points(self):        
        expected = {
            'points': [
                {'id':1, 'point':[-22.9963233069, -43.3637237549]},
                {'id':2, 'point':[24.0, 24.0]},
            ],
        }

        assert expected['points'][0] == simplejson.loads(self.response.content)[0]