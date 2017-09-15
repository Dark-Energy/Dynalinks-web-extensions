'use strict';

//console.log("NAME back");


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


   /*
    array of commands of info
    or 2nd array [][]
    */

function PortSwitcher(port)
{
 
    this.port = port;
    this.commands = {};
    this.port.old_process_message = port.process_message;
    var self = this;
    
    this.port.process_message = function (m) { 
        self._private_process_message(m);
    }
}

PortSwitcher.prototype._private_process_message = function(m)
{
    this.process_command(m);
}

PortSwitcher.prototype.process_command  = function (m)
{
     console.log("process command", JSON.stringify(m));
    //commands = dict[][]
    if (m.command) {
        var layer = this.commands[m.command];
        if (layer && m.info) {
            var command = layer[m.info];
            if (command) {
               //typeof command === 'function'
               //command.prototype.call is not a function
               command.call(this, m);
               return;
            }
        }
    }
    
    if (this.port.old_process_message) {
        this.port.old_process_message(m);
    }
}

PortSwitcher.prototype.add_command_layer = function(key)
{
   this.commands[key] = {};
}

PortSwitcher.prototype.add_command = function (layer, key, func)
{
    if (!this.commands[layer]) {
       this.add_command_layer(layer);
    }
    this.commands[layer][key] = func;
}


PortSwitcher.prototype.post_response = function (response)
{
   this.port.post(response);
}

PortSwitcher.prototype.add_mixin = function (mixin, splitter)
{
    var separator = '-';
    if (typeof splitter === 'string') {
        separator = splitter;
    }
    for(var key in mixin){
        if (Object.prototype.hasOwnProperty.call(mixin, key)){
            var arr = key.split(separator)
            //console.log("key is ", JSON.stringify(arr));
            if (arr.length < 2) {
                    console.error("PortSwitcher.add_mixin: Invalid property <"+ key +"> in mixin!");
            }
            this.add_command(arr[0], arr[1], mixin[key]);
        }
    }
    //console.log("commands - > ", JSON.stringify(this.commands, null, ' '));
}


function FollowedSwitch(port)
{
    PortSwitcher.call(this, port);
    //array of objects
    this.orders = {}; 
}