from django.db import models
from django.utils.translation import ugettext as _

class AccessPoint(models.Model):
    name = models.CharField(_('name'), max_length=255)
    address = models.CharField(_('address'), max_length=255)
    description = models.TextField(_('description'), blank=True)
    
    lat = models.FloatField()
    lng = models.FloatField()
    
    def __unicode__(self):
        return self.name
