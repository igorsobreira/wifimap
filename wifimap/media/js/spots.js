var SpotManager = { 
    init: function () {
        this.listSpots();
        $('#add-spot').unbind('click').click(function(){
            SpotForm.show();
            return false;
        });
    },
    addSpotsToMap: function(points) {
         $.each(points, function(index, point){
            Map.addAccessPoint(point); 
         });
    },
    getPointInformation: function(id, marker, callback) {
        $.ajax({
            url: '/spots/' + id + '.json',
            method: 'GET',
            dataType: 'json',
            success: function(data){
                var infoWindow = callback(data);
                infoWindow.open(Map.map, marker);
            }
        });           
    },
    listSpots: function() {
        var self = this;
        $.ajax({
            url: '/spots/search/',
            method: 'GET',
            dataType: 'json',
            success: function(data){
                $('#content').html(data.template);
                Map.map.setCenter(new google.maps.LatLng(data.center_point[1][0], data.center_point[1][1]));
                self.addSpotsToMap(data.points);
            }
        });   
    }
    
};

var SpotForm = {
    bindSubmit: function() {
        $('#submit-spot').unbind('click').click(function() {
            SpotForm.doSubmit();
            return false;
        });
    },
    show: function () {
        $.ajax({
            url: '/spots/add/',
            method: 'GET',
            dataType: 'html',
            success: function(response){
                $('#content').html(response);
            }
        });
    },
    doSubmit: function () {
        $('#add-spot-form').ajaxSubmit({
            success: function(response) { SpotForm.submitted(response); }
        });
    },
    submitted: function(response) {
        $('#content').html(response);
    },
    updateLatLng: function(latLng) {
        $('#id_lat').val( latLng.lat() );
        $('#id_lng').val( latLng.lng() );
    }
};
