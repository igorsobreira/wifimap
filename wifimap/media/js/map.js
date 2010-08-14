var SpotManager = { 
    init: function () {
        
        $('#add-spot').unbind('click').click(function(){
            SpotManager.showForm();
            return false;
        });
        $('#submit-spot').unbind('click').click(function() {
            SpotManager.submitForm();
            return false;
        });
    },
    showForm: function () {
        $.ajax({
            url: '/spots/add/',
            method: 'GET',
            dataType: 'html',
            success: function(response){
                $('#content').html(response);
            }
        });
    },
    submitForm: function () {
        $('#add-spot-form').ajaxSubmit({
            success: function(response) { SpotManager.formSubmitted(response) }
        });
    },
    formSubmitted: function(response) {
        $('#content').html(response);
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
