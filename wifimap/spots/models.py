from django.db import models
from django.db.models import F
from django.utils.translation import ugettext as _

class AccessPointManager(models.Manager):
    
    def vote_up(self, ap_id):
        self.filter(pk=ap_id).update(votes_up=F('votes_up') + 1)

    def vote_down(self, ap_id):
        self.filter(pk=ap_id).update(votes_down=F('votes_down') + 1)
    
class AccessPoint(models.Model):
    name = models.CharField(_('name'), max_length=255)
    is_protected = models.BooleanField(_('is protected'), default=False)
    description = models.TextField(_('description'), blank=True)
    
    address = models.CharField(_('address'), max_length=255)
    
    lat = models.FloatField()
    lng = models.FloatField()
    
    votes_up = models.PositiveIntegerField(default=0)
    votes_down = models.PositiveIntegerField(default=0)
    
    objects = AccessPointManager()
    
    def __unicode__(self):
        return self.name
    
    @property
    def votes(self):
        return self.votes_up - self.votes_down
    
