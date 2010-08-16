
var Map = {
    
    init: function() {
        this.container = $('#map');
        this.defaultOptions = {
            zoom: 15,
            //center: new google.maps.LatLng(-22.9963233069, -43.3637237549),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false
        };
        this.map = new google.maps.Map(this.container.get(0), this.defaultOptions);
        
        // this is the Marker instance used in /spots/add to choose the position
        this.markerToAdd = null;
        
        this.infoWindow = new google.maps.InfoWindow({
            content: 'content'
        });
        
        this.markers = [];
        
        
        google.maps.event.addListener(Map.map, 'dragend', function() {
           SpotManager.getAccessPointsListByBounds();
         });
         
    },
    
    followCenter: function(callback) {
        google.maps.event.addListener(this.map, 'center_changed', function() {
            var center = Map.map.getCenter();
            callback(center.lat(), center.lng());
        });
    },
    
    addMarkerToAdd: function(position) {
        var options = {
            draggable: true,
            position: position
        };
        if ( !this.markerToAdd ) {
            this.markerToAdd = new google.maps.Marker(options);
            google.maps.event.addListener(this.markerToAdd, 'dragend', this.markerToAddDropped);
        } else {
            this.markerToAdd.setPosition(position);
        };
        this.markerToAdd.setMap(this.map);
    },
    removeMarkerToAdd: function() {
        if ( !this.markerToAdd ) return;
        this.markerToAdd.setMap(null);
    },
    markerToAddDropped: function(obj) {
        SpotForm.updateLatLng( obj.latLng );
        Map.getAddressFromLatLng( obj.latLng, SpotForm.updateAddress );
    },
    centralizeMarkerToAdd: function() {
        Map.addMarkerToAdd( Map.map.getCenter() );
    },
    
    addCenterMarkerButton: function() {
        var button = $('<a id="center-marker-button" href="#/spots/add">Center Marker</div>');
        var self = this;
        button.click(function() {
            self.centralizeMarkerToAdd();
            return false;
        });
        this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(button[0]);
    },
    removeCenterMarkerButton: function() {
        $('#center-marker-button').remove();
    },
    
    getAddressFromLatLng: function(latLng, callback) {
        var geocoder = new google.maps.Geocoder()
        geocoder.geocode( 
            { 'latLng': latLng }, 
            function(result, status) {
                if (status != google.maps.GeocoderStatus.OK)
                    var address = "Ops... Address couldn't be found :(";
                else
                    var address = result[0].formatted_address;
                callback( address );
            }
        );
    },
    
    addAccessPoint: function(id, point) {
        var marker = new google.maps.Marker({
             position: new google.maps.LatLng(point[0], point[1]),
             id: id
         });
         
         google.maps.event.addListener(marker, 'click', function() {
            SpotManager.getPointInformation(marker.id, marker);
         });
         
         this.markers.push(marker);
         marker.setMap(this.map);
    },
    
    removeAllMarkers: function() {
        $.each(this.markers, function(index, marker){
            marker.setMap(null);
        });
        
        this.markers = [];
    }
};
