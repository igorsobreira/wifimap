
from django import forms
from spots.models import AccessPoint

class AccessPointForm(forms.ModelForm):
    
    lat = forms.FloatField(widget=forms.HiddenInput())
    lng = forms.FloatField(widget=forms.HiddenInput())
    
    class Meta:
        model = AccessPoint
        exclude = ('votes_up', 'votes_down')