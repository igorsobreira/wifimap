
/*
 * This object abstracts all the logic of loading and unloading a Page
 */
var Page = {
    
    loadCallbacks: {},
    unloadCallbacks: {},
    
    clear: function() {
        this.loadCallbacks = {};
        this.unloadCallbacks = {};
    },
    
    registerLoadUrl: function(url, callback) {
        this._registerUrl(this.loadCallbacks, url, callback);
    },
    registerUnloadUrl: function(url, callback) {
        this._registerUrl(this.unloadCallbacks, url, callback);
    },
    _registerUrl: function(collection, url, callback) {
        if (url in collection)
            collection[url].push(callback);
        else
            collection[url] = [callback];
    },
    
    load: function(url) {
        var load = this._callCallbacksFor(url, this.loadCallbacks);
        
        if (load) {
            window.location.hash = "#" + url;
            this.unload( window.location.hash.substring(1) );
        };
    },
    unload: function(url) {
        this._callCallbacksFor(url, this.unloadCallbacks);
    },
    _callCallbacksFor: function(url, collection) {
        var called = false;
        for (u in collection) {
            
            var regex = new RegExp(u);
            if ( !url.match(regex) )
                continue;
            
            for (var i=0; i<collection[u].length; i++) {
                collection[u][i]();
                called = true;
            };
        };
        return called;
    }
    
};


/*
 * Objects to manage load and unload stages of specific pages
 */

var AddSpotPage = {
    load: function() {
        
        console.log('loading page');
        
        SpotForm.bindSubmit();
        
        Map.followCenter( function(lat, lng) {
            SpotForm.updateLatLng( new google.maps.LatLng(lat, lng) );
        });
    
        // update form fields with initial values
        SpotForm.updateLatLng( Map.map.getCenter() );
        Map.getAddressFromLatLng( 
            Map.map.getCenter(), 
            SpotForm.updateAddress 
        );
        
        Map.addCenterMarkerButton();
        
        Map.addMarkerToAdd({
            position: Map.map.getCenter(),
        });
        
    },
    unload: function() {
        console.log('unloading page');
    }
};