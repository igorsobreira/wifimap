
from django import forms
from spots.models import AccessPoint

class AccessPointForm(forms.ModelForm):
    class Meta:
        model = AccessPoint
        exclude = ('lat', 'lng')