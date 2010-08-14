# -*- coding: utf-8 -*-

from django.core.urlresolvers import reverse
from django.test import TestCase

class IndexViewTest(TestCase):

    def test_index(self):
        response = self.client.get(reverse('spots_index'))
        assert response.status_code == 200

    def test_uses_index_template(self):
        response = self.client.get(reverse('spots_index'))
        self.assertTemplateUsed(response, 'index.html')

    def test_has_map_div(self):
        response = self.client.get(reverse('spots_index'))
        assert '<div id="map"' in response.content

    def test_uses_maps_api(self):
        response = self.client.get(reverse('spots_index'))
        assert '<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>' in response.content

