from django.test import TestCase
from django.core.urlresolvers import reverse
from django.utils import simplejson

from spots.models import AccessPoint
from spots.views import list_spots

class SearchViewTest(TestCase):
    
    def setUp(self):
        self.url = reverse('spots_search')
        self.add_some_points()
        self.access_points = AccessPoint.objects.all()
        self.response = self.client.get(self.url, {'place':'Rio de Janeiro, Brazil'}) 
        
    def tearDown(self):
        AccessPoint.objects.all().delete()
        
    def add_some_points(self):
        self.point1 = AccessPoint.objects.create(name='point 1', address='Rio de Janeiro, Brazil', lat=-22.9963233069, lng=-43.3637237549)
        self.point2 = AccessPoint.objects.create(name='point 2', address='Porto Alegre, Brazil', lat=24, lng=24)
        
    def test_view_exists(self):
        assert 200 == self.response.status_code
        
    def test_search_return_a_json(self):
        assert self.response.items()[0][1] == 'application/json'
    
    def test_search_returns_all_points(self):        
        expected = {
            'points': [
                [-22.9963233069, -43.3637237549],
                [24.0, 24.0],
            ],
        }

        assert expected['points'] == simplejson.loads(self.response.content)['points']

    def test_search_returns_expected_point(self):        
        expected = {
            'center_point': ["Rio de Janeiro - RJ, Brazil", [-22.903539299999998, -43.209586899999998]]
        }
                        
        assert expected['center_point'] == simplejson.loads(self.response.content)['center_point']
        
    def test_search_returns_template_with_access_point_list(self):        
        template = list_spots(self.access_points)
                        
        assert template == simplejson.loads(self.response.content)['template']