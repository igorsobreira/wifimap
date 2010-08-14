$(function(){
    // Map Initialization
    var mapContainer = $('#map');
    var spot = new google.maps.LatLng(-22.9963233069, -43.3637237549);
    var mapOptions = {
        zoom: 8,
        center: spot,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(mapContainer[0], mapOptions);
});
