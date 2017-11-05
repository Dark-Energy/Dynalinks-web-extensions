function PortObjListener (name, immediatly)
{
    this.name = name;
    this.messages = [];
    this.last_message = {}
    this.connect_events = [];
    this.process_message = undefined;
    this.process_connection = undefined;

    this._inner_connect_listener = undefined;

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
                if (this._inner_connect_listener !== undefined) {
                    this.port.onConnect.removeListener(this._inner_connect_listener);
                    this._inner_connect_listener = undefined;
                }
           }
        },

        private_set_disconnect_listener: function ()
        {
            if (!this.disconnect_listener) {
                this.disconnect_listener = function (e)
                {
                    console.log("Disconnect port with name {{"+e.name+"}} with passive ends");
                    console.log(e);
                }
            }
            this.port.onDisconnect.addListener(this.disconnect_listener);
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


        _private_connect_listener : function (port)
        {
            this.$emit_connect_event(port);
            //console.log("connect offer", this.name, port.name);
            if (port.name === this.name) {
                //console.log("name of ports identity<"+port.name+ ">, connect!");
               this.port = port;
               this.create_message_listener();
               this.port.onMessage.addListener(this.message_listener);
               this.port.postMessage({"hands": "?", "my": this.name, "your": port.name});

            }
        },

        create_connect_listener : function ()
        {
            var self = this;
            function listener(port)
            {

                //console.log("connect offer<"+port.name+ "> to <"+self.name+"> ");
                self._private_connect_listener(port);
            }
            this._inner_connect_listener = listener;
        },

        run : function ()
        {
            if (this._inner_connect_listener === undefined) {
                this.create_connect_listener();
                browser.runtime.onConnect.addListener(this._inner_connect_listener);
            }
        },

        post: function (message)
        {
            if (this.port !== undefined) {
                this.port.postMessage(message);
            }
        },

});