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
        $.ajax({
            url: '/spots/search/',
            method: 'GET',
            dataType: 'json',
            success: function(data){   
                /* 
                console.log('foo')            
                if (navigator.geolocation) {
                    console.log('navigator')
                    navigator.geolocation.getCurrentPosition(function(){
                        var initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                        Map.map.setCenter(initialLocation);
                    }, function() {
                        console.log('unnavigator')
                        Map.map.setCenter(new google.maps.LatLng(data.center_point[1][0], data.center_point[1][1]));
                    });
                } else {
                    console.log('=(')
                    Map.map.setCenter(new google.maps.LatLng(data.center_point[1][0], data.center_point[1][1]));                        
                }
                */
                
                ///////////////////


                
                ///////////////
                
                
                //Map.map.setCenter(new google.maps.LatLng(data.center_point[1][0], data.center_point[1][1]));
                
                //console.log(navigator.geolocation);
                
                //SpotManager.getAccessPointsListByBounds();
                //SpotManager.addSpotsToMap(data.points);
            }
        });   
    },
    bindSearchSubmit: function() {
        $('#search-button').click(function() {
            SpotManager.sendSearchSubmit();
            return false;
        });        
    },
    sendSearchSubmit: function() {
        $('#search-form').ajaxSubmit({
            success: function(data) {
                if (!(data.center_point == null)) {
                   Map.map.setCenter(new google.maps.LatLng(data.center_point[1][0], data.center_point[1][1]));
                   SpotManager.getAccessPointsListByBounds();
                }
            } 
        });
    },
    getAccessPointsListByBounds: function() {
        var north = Map.map.getBounds().getNorthEast().lat();
        var east = Map.map.getBounds().getNorthEast().lng();
        var south = Map.map.getBounds().getSouthWest().lat();
        var west = Map.map.getBounds().getSouthWest().lng();
        
        $('#content').load('/spots/list/?south=' + south + '&north=' + north + '&east=' + east + '&west=' + west);
    }
};

var SpotForm = {
    
    bindSubmit: function() {
        $('#submit-spot').unbind('click').click(function() {
            SpotForm.submit();
            return false;
        });
    },
    
    show: function (callback) {
        $.ajax({
            url: '/spots/add/',
            method: 'GET',
            dataType: 'json',
            success: function(json){
                $('#content').html(json.content);
                callback();
            }
        });
    },
    submit: function () {
        $('#add-spot-form').ajaxSubmit({
            dataType: 'json',
            success: function(json) { SpotForm.submitted(json); }
        });
    },
    submitted: function(json) {
        if ( json.success ) {
            location.hash = "#" + json.redirect_to;
        } else {
            $('#content').html(json.content);
            SpotForm.bindSubmit();
        };
    },
    updateLatLng: function(latLng) {
        $('#id_lat').val( latLng.lat() );
        $('#id_lng').val( latLng.lng() );
    },
    updateAddress: function(address) {
        $('#id_address').val(address);
    }
};
