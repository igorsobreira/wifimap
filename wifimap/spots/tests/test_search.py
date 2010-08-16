from django.test import TestCase
from django.core.urlresolvers import reverse
from django.utils import simplejson
from django.conf import settings

from spots.models import AccessPoint

class SearchViewTest(TestCase):
    
    def setUp(self):
        self.url = reverse('spots_search')
        self.add_some_points()
        self.access_points = AccessPoint.objects.all()
        self.response = self.client.get(self.url, {'place':'Rio de Janeiro, Brazil'}) 
        settings.DEBUG = True
        
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
                {'id':1, 'point':[-22.9963233069, -43.3637237549]},
                {'id':2, 'point':[24.0, 24.0]},
            ],
        }

        assert expected['points'][0] == simplejson.loads(self.response.content)['points'][0]

    def test_search_returns_expected_point(self):        
        expected = {
            'center_point': ["Rio de Janeiro, Brazil", [-22.903539299999998, -43.209586899999998]]
        }
                                
        assert expected['center_point'] == simplejson.loads(self.response.content)['center_point']
            
    def test_search_returns_mock_ip_based_list_when_debug_true(self):
        response = self.client.get(self.url) 
        expected = {
            'center_point': [u'Sao Paulo - S\xe3o Paulo, Brazil', [-23.548943300000001, -46.638818200000003]]
        }
                    
        assert expected['center_point'] == simplejson.loads(response.content)['center_point']
    
    def test_search_for_unexpected_location_not_raise(self):
        response = self.client.get(self.url, {'place':'blablabla'}) 
        assert True
    
    def test_search_for_none_place_not_raise(self):
        response = self.client.get(self.url, {'place':''}) 
        assert True        