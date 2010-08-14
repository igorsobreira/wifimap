from django.test import TestCase

from spots.lib import point_by_ip

class PointByIpTest(TestCase):

    def test_point_by_ip(self):
        point = point_by_ip('201.7.176.59')
        assert point == ["Brazil", [-14.235004, -51.925280000000001]]

    def test_point_by_ip_with_city(self):
        point = point_by_ip('200.147.67.142')
        assert point == [u'Sao Paulo - S\xe3o Paulo, Brazil', [-23.548943300000001, -46.638818200000003]]
        