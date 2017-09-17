function PortObjListener (name, immediatly)
{
    this.name = name;
    this.messages = [];
    this.last_message = {}
    this.connect_events = [];
    this.process_message = undefined;
    this.process_connection = undefined;
    
    if (immediatly) {
        this.run();
    }
}


Object.assign(PortObjListener.prototype, {
        constructor: PortObjListener,
        dispose_message_listener: function ()
        {
            if (port !== undefined && this.message_listener !== undefined) {
                this.port.onMessage.removeListener(this.message_listener);
                this.message_listener = undefined;
            }
        },
        
        dispose : function ()
        {
           this.dispose_message_listener();
           if (this.port !== undefined) {
                if (this.connect_listener !== undefined) {
                    this.port.onConnect.removeListener(this.connect_listener);
                    this.connect_listener = undefined;
                }
           }
        },

        $on_connect_event : function (callback)
        {
            var index = this.connect_events.indexOf(callback);
            if (index < 0) {
                 this.connect_events.push(callback);
            }
        },

        $emit_connect_event : function (port)
        {
            if (this.process_connection) {
                this.process_connection();    
            }
            for(var i = 0; i <  this.connect_events.length; i++) {
                var event = this.connect_events[i];
                event(port);
                //Function.prototype.call(event, port);
            }
        },
        
        _private_message_listener: function (message)
        {
            //console.log("port "+this.port.name+"get message", message);
            this.last_message = message;
            this.messages.push(message);
            if (this.process_message) {
                this.process_message(this.last_message);
            }
        },
        
        create_message_listener : function ()
        {
           if (this.message_listener !== undefined){
                return;
           }
           var self = this;
           function listener(message) 
           {
                self._private_message_listener(message);
           }
            this.message_listener = listener;
        },
        

        _inner_connect_listener : function (port)
        {
            this.$emit_connect_event(port);
            
            if (port.name === this.name) {
               //console.log("name of ports identity<"+port.name+ ">, connect!");
               this.port = port;
               this.create_message_listener();
               this.port.onMessage.addListener(this.message_listener);               
               /*this.port.onMessage.addListener(function (m) {console.log("objlistener: get message ",m);});*/
               
            }
            if (this.process_connection) {
                   this.process_connection();
            }
        },

        create_connect_listener : function ()
        {
            var self = this;
            function listener(port) 
            {
                self._inner_connect_listener(port);
            }
            this.connect_listener = listener;
        },
        
        run : function ()
        {
            if (this.connect_listener === undefined) {
                this.create_connect_listener();
                browser.runtime.onConnect.addListener(this.connect_listener);
            }
        },

        post: function (message) 
        {
            this.port.postMessage(message);
        },
        
});
