
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
    },
    followCenter: function(callback) {
        google.maps.event.addListener(this.map, 'center_changed', function() {
            var center = Map.map.getCenter();
            callback(center.lat(), center.lng());
        });
    },
    submitForm: function () {
        $('#add-spot-form').ajaxSubmit({
            success: function(response) { SpotManager.formSubmitted(response) }
        });
    },
    formSubmitted: function(response) {
        $('#content').html(response);
    },
    addPoint: function(point) {
        var marker = new google.maps.Marker({
             position: new google.maps.LatLng(point[0], point[1]),
         });
         marker.setMap(this.map);
    }
};
