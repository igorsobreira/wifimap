var SpotManager = { 
    init: function () {
                
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
    /*
    setCenter: function(data) {
        
        var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

        if (is_chrome) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position){
                    var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    Map.map.setCenter(initialLocation);
                    SpotManager.afterCentralize(data);
                }, function() {
                    Map.map.setCenter(new google.maps.LatLng(data.center_point[1][0], data.center_point[1][1]));
                    SpotManager.afterCentralize(data);
                });
            } else {
                Map.map.setCenter(new google.maps.LatLng(data.center_point[1][0], data.center_point[1][1]));                        
                SpotManager.afterCentralize(data);
            }
        } else {
            Map.map.setCenter(new google.maps.LatLng(data.center_point[1][0], data.center_point[1][1]));
            SpotManager.afterCentralize(data);
        }
        
    },*/
    
    getPointByIp: function(callback) {
        $.ajax({
            url: '/spots/point_by_ip/',
            method: 'GET',
            dataType: 'json',
            success: function(data){   
                Map.map.setCenter(new google.maps.LatLng(data[1][0], data[1][1]));
                $('#search-form input[type=text]').val(data[0]);
                if (callback != null) { callback(); }
            }
        });
    },
    
    setCenter: function(callback) {

        var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

        if (is_chrome) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position){
                    point = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    Map.map.setCenter(point);    
                    Map.getAddressFromLatLng(point, function(address){
                        $('#search-form input[type=text]').val(address);
                        
                        if (callback != null) {callback();}
                    });   
                }, function() {
                    SpotManager.getPointByIp(callback);
            });
            } else {
                SpotManager.getPointByIp(callback);
            }
        } else {
            SpotManager.getPointByIp(callback);
        }        
    },

    listSpots: function() {
        $.ajax({
            url: '/spots/search/',
            method: 'GET',
            dataType: 'json',
            success: function(data){   
                SpotManager.setCenter(data);                
            }
        });   
    },
    
    afterCentralize: function(data) {
        
        $('#search-form input[type=text]').val(data.center_point[0]);
        
        SpotManager.addSpotsToMap(data.points);
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
            Message.success(json.message);
        } else {
            $('#content').html(json.content);
            Message.error(json.message);
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
