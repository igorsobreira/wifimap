var SpotManager = { 
    init: function () {
        this.listSpots();
        $('#add-spot').unbind('click').click(function(){
            SpotManager.showForm();
            return false;
        });
    },
    bindFormSubmit: function() {
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
    },
    addSpotsToMap: function(points) {
         $.each(points, function(index, point){
            Map.addPoint(point); 
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