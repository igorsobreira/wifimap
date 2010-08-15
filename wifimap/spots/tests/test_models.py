from django.test import TestCase
from spots.models import AccessPoint

class AddViewTest(TestCase):
    
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
