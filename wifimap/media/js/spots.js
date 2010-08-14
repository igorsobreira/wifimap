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
    listSpots: function() {
        $.ajax({
            url: '/spots/search/',
            method: 'GET',
            dataType: 'json',
            success: function(data){
                this.centerPoint = data.center_point;
                $('#content').html(data.template);
                Map.map.setCenter(new google.maps.LatLng(this.centerPoint[1][0], this.centerPoint[1][1]));
            }
        });   
    }
    
};