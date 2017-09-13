'use strict';

console.log("NAME back");


function PortObjListener (name, run)
{
    this.name = name;
    this.messages = [];
    this.last_message = {}
    this.connect_events = [];
    this.process_message = undefined;
    this.process_connect = undefined;
    
    if (run) {
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
            if (this.process_connect) {
                this.process_connect();    
            }
            for(var i = 0; i <  this.connect_events.length; i++) {
                var event = this.connect_events[i];
                event(port);
                //Function.prototype.call(event, port);
            }
        },

        _inner_connect_listener : function (port)
        {
            this.$emit_connect_event(port);
            if (this.port !== undefined) {
                console.log("this obj already yet have connection with other port", port, '\n', this.port);
                return;
            }
            
            if (port.name === this.name) {
               console.log("name of ports identity, connect!");                
               this.port = port;
               if (this.message_listener === undefined) {
                    this.create_message_listener;
               }
            }else {
                //port.disconnect();
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

        
        _private_message_listener: function (m)
        {
            this.last_message = message;
            this.messages.push(message);
            if (this.process_message) {
                this.process_message(this.last_message);
            }
        },
        
        create_message_listener : function ()
        {
           if (this.message_listener) {
                return;
           }
           
           var self = this;
           function listener(message) 
           {
                self._private_message_listener;
           }
            this.message_listener = listener;
        },

        post: function (message) 
        {
            this.port.postMessage(message);
        },
        
        run : function ()
        {
            this.create_connect_listener();
            browser.runtime.onConnect.addListener(this.connect_listener);
        }
});

    
    
function Portman(name, bipolar)    
{
    this.name = name;
    this.port = browser.runtime.connect({"name":this.name});
    this.last_message = '';
    this.process_message = undefined;
    this.bipolar = bipolar;
    if (bipolar) {
        this.create_message_listener();   
        this.port.onMessage.addListener(this.message_listener);
    }
}


Object.assign(Portman.prototype, 
{
    constructor: Portman,
    post : function(message)
    {
        this.port.postMessage(message);
    },


    _private_message_listener : function (message)
    {
        this.last_message = message;
        //this.messages.push(message);
        if (this.process_message) {
            this.process_message(this.last_message);
        }
        
    },

    create_message_listener: function ()
    {
       if (this.message_listener) {
            return;
       }
       var self = this;
       function listener(message) 
       {
            self._private_message_listener(message);       
       }
        this.message_listener = listener;
    }
});




function PortSwitcher(port)
{
    /*
    array of commands of info
    or 2nd array [][]
    */
    this.port = port;
    this.commands = {};
    this.port.old_process_message = port.process_message = 
    this.port.process_message = process_command;
}

PortSwitcher.prototype.process_command  = function (m)
{
    //commands = dict[][]
    if (m.command && m.info) {
        var dict = this.commands[m.command];
        if (dict && m.info) {
            var f = dict[m.info];
            if (f) {
               f(m);
               return;
            }
        }
    }
    this.port.old_process_message(m);
}

PortSwitcher.prototype.add_command_layer = function(key)
{
   this.commands[key] = {};
}

PortSwitcher.prototype.add_command = function (layer, key, function)
{
    if (!this.commands[layer]) {
       this.add_command_layer(layer);
       this.commands[layer][key] = key;
    }
}


PortSwitcher.prototype.send_response = function (response)
{
   this.port.postMessage(response);
}