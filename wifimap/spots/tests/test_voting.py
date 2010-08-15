# -*- coding: utf-8 -*-

from django.test import TestCase
from django.core.urlresolvers import reverse

from spots.models import AccessPoint

class VoteViewTest(TestCase):

    def setUp(self):
        self.point = AccessPoint.objects.create(
            name='point 1',
            address='Rio de Janeiro, Brazil',
            lat=-22.9963233069,
            lng=-43.3637237549
        )
        self.url = reverse('spot_vote', kwargs={'id': self.point.id})

    def tearDown(self):
        self.point.delete()

    def test_view_exists(self):
        response = self.client.post(self.url, {'vote': 'up'})
        assert 200 == response.status_code

