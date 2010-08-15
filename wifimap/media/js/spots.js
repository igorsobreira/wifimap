var SpotManager = { 
    init: function () {
        this.listSpots();
        this.bindSearchSubmit();
        $('#add-spot').unbind('click').click(function(){
            SpotForm.show();
            return false;
        });
    },
    addSpotsToMap: function(points) {
         $.each(points, function(index, item){
            Map.addAccessPoint(item.id, item.point); 
         });
    },
    getPointInformation: function(id, marker) {
        $.ajax({
            url: '/spots/' + id + '.json',
            method: 'GET',
            dataType: 'json',
            success: function(data){
                var content = '<div id="info-window">' + data.name + '<br/>';
                content += data.address + '<br/>';
                content += '<a href="/spots/' + data.id + '/">see more</a></div>';

                $('#info-window a').live('click', function() {
                    $('#content').load($(this).attr('href'));
                    return false;
                });
                
                Map.infoWindow.content = content;
                Map.infoWindow.open(Map.map, marker);
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
                self.bindPointLink();
                Map.map.setCenter(new google.maps.LatLng(data.center_point[1][0], data.center_point[1][1]));
                self.addSpotsToMap(data.points);
            }
        });   
    },
    bindPointLink: function(){
        $.each($('#spot-list .spot .info a'), function(index, element){
            $(element).click(function(){
                $('#content').load($(this).attr('href'));
                return false;
            });
        });
    },
    bindSearchSubmit: function() {
        var self = this;
        $('#search-button').click(function() {
                self.sendSearchSubmit();
            return false;
        });        
    },
    sendSearchSubmit: function() {
        $('#search-form').ajaxSubmit({
           success: function(response) {
                //console.log('submited', response);
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
    },
    updateAddress: function(address) {
        $('#id_address').val(address);
    }
};
