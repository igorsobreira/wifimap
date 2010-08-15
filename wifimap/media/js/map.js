
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
            google.maps.event.addListener(this.markerToAdd, 'dragend', function(obj) {
                SpotForm.updateLatLng(obj.latLng);
            });
        };
        this.markerToAdd.setMap(this.map);
    },
    addAccessPoint: function(id, point) {
        var self = this;
        
        var marker = new google.maps.Marker({
             position: new google.maps.LatLng(point[0], point[1]),
             id: id
         });
         
         google.maps.event.addListener(marker, 'click', function() {
            SpotManager.getPointInformation(marker.id, marker, self.createAccessPointInfoWindow);
         });
         
         marker.setMap(this.map);
    },
    createAccessPointInfoWindow: function(data) {
        var self = this;
        
        var content = '<div id="content">' + data.name + '<br/>';
        content += data.address + '<br/>';
        content += '<a href="">see more</a></div>';
        
        var infoWindow = new google.maps.InfoWindow({
            content: content
        });
        return infoWindow;
    }    
};
