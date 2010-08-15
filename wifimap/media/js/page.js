
/*
 * This object abstracts all the logic of loading and unloading a Page
 */
var Page = {
    
    loadCallbacks: {},
    unloadCallbacks: {},
    
    init: function() {
        this.lastUrl = Page.getCurrent();
    },
    
    clear: function() {
        this.loadCallbacks = {};
        this.unloadCallbacks = {};
    },
    
    initialLoad: function() {
        var url = this.getCurrent();
        if (!url) url = "/";
        this.load(url);
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
        this.unload( this.lastUrl );
        console.log(' [page] loading ' + url );
        this._callCallbacksFor(url, this.loadCallbacks);
        this.lastUrl = url;
    },
    unload: function(url) {
        console.log(' [page] unloading ' + url );
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
    },
    
    getCurrent: function() {
        return location.hash.replace('#','');
    }
    
};


/*
 * Objects to manage load and unload stages of specific pages
 */

var AddSpotPage = {
    load: function() {
        console.log('loading add');
        
        SpotForm.show(function() {
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
        });
        
        Map.addCenterMarkerButton();
    
        Map.addMarkerToAdd({
            position: Map.map.getCenter(),
        });
             
    },
    unload: function() {
        console.log('unloading add');
        Map.removeMarkerToAdd();
        Map.removeCenterMarkerButton();
    }
};

var SpotListPage = {
    load: function() {
        console.log('loading list');
        SpotManager.listSpots();
    },
    unload: function() {
        console.log('unloading list');
        Map.removeAllMarkers();
    }
};

var SpotDetailPage = {
    load: function() {
        $('#content').load(Page.getCurrent());
    },
    unload: function() {
        Map.removeAllMarkers();        
    }
};
