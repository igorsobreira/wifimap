from django.test import TestCase
from django.core.urlresolvers import reverse

from spots.models import AccessPoint

class SearchViewTest(TestCase):
    
    def setUp(self):
        self.url = reverse('spots_search')
        
    def test_view_exists(self):
        response = self.client.get(self.url)    
        assert 200 == response.status_code