# -*- coding: utf-8 -*-

from django.core.urlresolvers import reverse
from django.test import TestCase

class IndexViewTest(TestCase):
    
    def setUp(self):
        self.response = self.client.get(reverse('spots_index'))

    def test_index(self):
        assert self.response.status_code == 200

    def test_uses_index_template(self):
        self.assertTemplateUsed(self.response, 'index.html')

    def test_has_map_div(self):
        assert '<div id="map"' in self.response.content

    def test_uses_maps_api(self):
        assert '<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true"></script>' in self.response.content
    
    def test_index_has_search_form(self):
        assert '<form method="get" action="/spots/search/" id="search-form">' in self.response.content