
/*
Utils functions

*/




var Event_Mixin = {
    _get_event: function (name) {
        if (!this.events[name]) {
            this.events[name] = [];
        }
        return this.events[name];
    },
    "$on" : function (name, func)
    {
        var arr = this._get_event(name);
        arr.push({listener: func});
    },
    
    "$once": function (name, func) 
    {
        var arr = this._get_event(name);
        arr.push({listener: func, once: true});
        
    },

    "$emit" : function (name)
    {
        var arr = this._get_event(name);
        if (arr.length === 0) {
            return;
        }
        var args = Array.prototype.slice.call(arguments, 1);
        for(var i =0; i < arr.length; i++) {
            arr[i].listener.apply(this, args);
            if (arr[i].once) {
                arr.splice(i, 1);
            }
        }
    },

    "events" : {},
};

//Event_Mixin.$on("test", () => console.log("test") );
//Event_Mixin.$emit("test");
