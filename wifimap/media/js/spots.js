var SpotManager = { 
    init: function () {
        
        //default center location
        $('#search-form input[type=text]').val('Rio de Janeiro, Brazil');
        
        this.bindSearchSubmit();
        
        // this should go to #/spots/add load callback
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
                
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(){
                        var initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                        Map.map.setCenter(initialLocation);
                    }, function() {
                        Map.map.setCenter(new google.maps.LatLng(data.center_point[1][0], data.center_point[1][1]));
                    });
                } else {
                    Map.map.setCenter(new google.maps.LatLng(data.center_point[1][0], data.center_point[1][1]));                        
                }
                
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
        var self = this;
        
        $('#search-form input[name=bounds]').val(Map.map.getBounds());
        
        $('#search-form input[name=north]').val(Map.map.getBounds().getNorthEast().lat());
        $('#search-form input[name=east]').val(Map.map.getBounds().getNorthEast().lng());
        $('#search-form input[name=south]').val(Map.map.getBounds().getSouthWest().lat());
        $('#search-form input[name=west]').val(Map.map.getBounds().getSouthWest().lng());
        
        //console.log('northeast', Map.map.getBounds().getNorthEast())
        //console.log('northeast', Map.map.getBounds().getNorthEast().lat())
        //console.log('northeast', Map.map.getBounds().getNorthEast().lng())
        //console.log('southwest', Map.map.getBounds().getSouthWest())
        
        
        $('#search-form').ajaxSubmit({
            success: function(data) {
                $('#content').html(data.template);
                self.bindPointLink();
                if (!(data.center_point == null)) {
                   Map.map.setCenter(new google.maps.LatLng(data.center_point[1][0], data.center_point[1][1]));
                }
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
