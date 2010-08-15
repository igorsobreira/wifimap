
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
        this._callCallbacksFor(url, this.loadCallbacks);
        this.unload( window.location.hash.substring(1) );
        window.location.hash = "#" + url;
    },
    unload: function(url) {
        console.log("unload " + url);
        this._callCallbacksFor(url, this.unloadCallbacks);
    },
    _callCallbacksFor: function(url, collection) {
        for (u in collection) {
            
            var regex = new RegExp(u);
            if ( !url.match(regex) )
                continue;
            
            for (var i=0; i<collection[u].length; i++)
                collection[u][i]();
        };
    }
    
};


/*
 * Objects to manage load and unload stages of specific pages
 */

var AddSpotPage = {
    load: function() {
        
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
        Map.removeMarkerToAdd();
        Map.removeCenterMarkerButton();
    }
};