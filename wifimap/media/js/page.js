
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
        for (u in this.loadCallbacks) {
            
            var regex = new RegExp(u);
            if ( !url.match(regex) )
                continue;
            
            for (var i=0; i<this.loadCallbacks[u].length; i++)
                this.loadCallbacks[u][i]();
        };
    }
    
}