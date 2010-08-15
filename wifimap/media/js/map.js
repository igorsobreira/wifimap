
var Map = {
    
    init: function() {
        this.container = $('#map');
        this.defaultOptions = {
            zoom: 8,
            center: new google.maps.LatLng(-22.9963233069, -43.3637237549),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false
        };
        this.map = new google.maps.Map(this.container.get(0), this.defaultOptions);
        
        // this is the Marker instance used in /spots/add to choose the position
        this.markerToAdd = null;
        
        this.infoWindow = new google.maps.InfoWindow({
            content: 'content'
        });
    },
    
    followCenter: function(callback) {
        google.maps.event.addListener(this.map, 'center_changed', function() {
            var center = Map.map.getCenter();
            callback(center.lat(), center.lng());
        });
    },
    
    addMarkerToAdd: function(options) {
        options['draggable'] = true;
        if ( !this.markerToAdd ) {
            this.markerToAdd = new google.maps.Marker(options);
            google.maps.event.addListener(this.markerToAdd, 'dragend', this.markerToAddDropped);
        };
        this.markerToAdd.setMap(this.map);
    },
    markerToAddDropped: function(obj) {
        SpotForm.updateLatLng( obj.latLng );
        Map.getAddressFromLatLng( obj.latLng, SpotForm.updateAddress );
    },
    centralizeMarkerToAdd: function() {
        Map.addMarkerToAdd({
            position: Map.map.getCenter()
        });
    },
    
    addCenterMarkerButton: function() {
        var button = $('<a id="center-marker-button" href="#">Center Marker</div>');
        button.click(Map.centralizeMarkerToAdd);
        this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(button[0]);
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
        var self = this;
        
        var marker = new google.maps.Marker({
             position: new google.maps.LatLng(point[0], point[1]),
             id: id
         });
         
         google.maps.event.addListener(marker, 'click', function() {
            SpotManager.getPointInformation(marker.id, marker);
         });
         
         marker.setMap(this.map);
    }
};
