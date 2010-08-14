var SpotManager = { 
    init: function () {
        $('#add-spot').click(function(){
            SpotManager.showAddForm();
            return false;
        });
    },
    showAddForm: function () {
        $.ajax({
            url: '/spots/add/',
            method: 'GET',
            dataType: 'html',
            success: function(response){
                $('#content').html(response);
            }
        });
    }
};

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

    // Installs spot manager
    SpotManager.init();
});

