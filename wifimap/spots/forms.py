
from django import forms
from spots.models import AccessPoint

class AccessPointForm(forms.ModelForm):
    
    lat = forms.FloatField(widget=forms.HiddenInput())
    lng = forms.FloatField(widget=forms.HiddenInput())
    
    def __init__(self, *args, **kwargs):
        super(AccessPointForm, self).__init__(*args, **kwargs)
        self.fields['address'].widget.attrs['readonly'] = 'readonly'
        self.fields.keyOrder = ('name', 'address', 'is_protected', 'description', 'lat', 'lng')
    
    class Meta:
        model = AccessPoint
        exclude = ('votes_up', 'votes_down')
