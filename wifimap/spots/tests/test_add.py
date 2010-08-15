from xml.etree import ElementTree

from django.test import TestCase
from django.core.urlresolvers import reverse

from spots.models import AccessPoint


class AddViewTest(TestCase):
    
    def setUp(self):
        self.url = reverse('spots_add')
    
    def test_view_exists(self):
        response = self.client.get(self.url)    
        assert 200 == response.status_code
    
    def test_lat_lng_fields_are_hidden(self):
        response = self.client.get(self.url)
        
        assert u'<input type="hidden" name="lat" id="id_lat" />' in response.content
        assert u'<input type="hidden" name="lng" id="id_lng" />' in response.content
    
    def test_address_field_is_readonly(self):
        response = self.client.get(self.url)
        
        assert u'<input id="id_address" readonly="readonly" type="text" name="address" maxlength="255" />' in response.content
    
    def test_submit_valid_form(self):
        post = {
            'name': 'test point',
            'address': 'Rio de Janeiro, RJ',
            'lat': '12.3234',
            'lng': '-21.235',
        }
        response = self.client.post(self.url, post)
        
        assert 200 == response.status_code
        assert 1 == AccessPoint.objects.count()
        assert u"Your point has been saved" in response.content
    
    
    def test_submit_invalid_form_show_errors(self):
        post = {'foo': 'all empty'}
        response = self.client.post(self.url, post)
        
        assert 200 == response.status_code
        assert 0 == AccessPoint.objects.count()
        assert u"Please correct the errors below"
    
    def test_vote_up_works_for_valid_spot(self):
        self.ap = AccessPoint.objects.create(name='Here', is_protected=True, address='foo', 
            lat=12, lng=23, votes_up=0, votes_down=0)
        assert AccessPoint.objects.vote_up(self.ap.id)

    def test_vote_down_works_for_valid_spot(self):
        self.ap = AccessPoint.objects.create(name='Here', is_protected=True, address='foo', 
            lat=12, lng=23, votes_up=0, votes_down=0)
        assert AccessPoint.objects.vote_down(self.ap.id)

    def test_vote_up_fails_for_invalid_spot(self):
        assert not AccessPoint.objects.vote_up(0)

    def test_vote_down_fails_for_invalid_spot(self):
        assert not AccessPoint.objects.vote_down(0)

    def test_vote_up_adds_votes_up(self):
        self.ap = AccessPoint.objects.create(name='Here', is_protected=True, address='foo', 
            lat=12, lng=23, votes_up=0, votes_down=0)
        AccessPoint.objects.vote_up(self.ap.id)
        AccessPoint.objects.vote_up(self.ap.id)
        
        assert AccessPoint.objects.get(pk=self.ap.id).votes_up == 2
    
    def test_vote_down_decreases_votes_down(self):
        self.ap = AccessPoint.objects.create(name='Here', is_protected=True, address='foo', 
            lat=12, lng=23, votes_up=0, votes_down=0)
        AccessPoint.objects.vote_down(self.ap.id)
        
        assert AccessPoint.objects.get(pk=self.ap.id).votes_down == 1
    
    def test_votes(self):
        self.ap = AccessPoint.objects.create(name='Here', is_protected=True, address='foo', 
            lat=12, lng=23, votes_up=0, votes_down=0)
        AccessPoint.objects.vote_up(self.ap.id)
        AccessPoint.objects.vote_up(self.ap.id)
        AccessPoint.objects.vote_down(self.ap.id)
        
        self.ap = AccessPoint.objects.get(pk=self.ap.id)
        
        assert 3 == self.ap.votes
    
    def test_score(self):
        self.ap = AccessPoint.objects.create(name='Here', is_protected=True, address='foo', 
            lat=12, lng=23, votes_up=0, votes_down=0)
        AccessPoint.objects.vote_up(self.ap.id)
        AccessPoint.objects.vote_up(self.ap.id)
        AccessPoint.objects.vote_down(self.ap.id)
        
        self.ap = AccessPoint.objects.get(pk=self.ap.id)
        
        assert 1 == self.ap.score
    
