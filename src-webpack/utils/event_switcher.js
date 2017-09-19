'use strict';

   /*
    array of commands of info
    or 2nd array [][]
    
    apply event message object 
    {
        command: name of command kind (create, get, set, etc)
        info : particular command
        addition information
    }
    */
    
    
function EventHub()
{
    this.events = [];
}

Object.assign(EventHub.prototype, {
    constructor: EventHub,
    $on: function (name, fn){
        if (this.events[name] === undefined) {
            this.events[name] = [];
        }
        var event = this.events[name];
        event.push(fn);
    },
    $emit : function (name)
    {
        var event = this.events[name] 
        if (event === undefined) {
            return;
        }
        for(var i =0;i < event.length; i++) {
            var f = event[i];
            f.apply(this, arguments);
        }
    }
});

function EventSwitcher(event_hub)
{
    this.event_hub = event_hub;
    this.commands = {};
    this.process_event = undefined;
    this.create_listener();    
}

Object.assign(EventSwitcher.prototype, {
    constructor: EventSwitcher,
    create_listener: function ()
    {
        var self =this;
        function listener(){
            self._private_listener.apply(self, arguments);
        }
        this.listener = listener;
        this.event_hub.$on("switch", this.listener);
    },
    _private_listener: function (message)
    {
        if (this.process_event) {
            this.process_event.apply(this, arguments);
        }
        if (!message) return;
        if (!message.command) return;
        this.execute(message);
    },
    execute: function (m)
    {
        var command = this.find_command(m);
        //typeof command === 'function'
        //command.prototype.call is not a function
        if (command) {
            command.call(this, m);
        }
    },
    find_command: function(m)
    {
        //commands = dict[][]
        if (m.command) {
            var layer = this.commands[m.command];
            if (layer && m.info) {
                var command = layer[m.info];
                if (command) {
                   return command;
                }
            }
        }
        return null;
    },
    add_command_layer : function(key)
    {
       this.commands[key] = {};
    },
    

    add_command : function (layer, key, func)
    {
        if (!this.commands[layer]) {
           this.add_command_layer(layer);
        }
        this.commands[layer][key] = func;
    },
    
    add_mixin : function (mixin, splitter)
    {
        var separator = '-';
        if (typeof splitter === 'string') {
            separator = splitter;
        }
        for(var key in mixin){
            if (Object.prototype.hasOwnProperty.call(mixin, key)){
                var arr = key.split(separator)
                if (arr.length < 2) {
                    console.error("PortSwitcher.add_mixin: Invalid property <"+ key +"> in mixin!");
                }
                this.add_command(arr[0], arr[1], mixin[key]);
            }
        }
    },

});



var Vue = require('../lib/vue.min.js');
function test_eventSwitcher()
{
    var hub = new Vue();        
    var es = new EventSwitcher(hub);
    es.add_command("get", "tag_list", function (m) {
        console.log("command executed", arguments);
    });
    
    es.process_event = function () {
        console.log("event is here", arguments);
    }
    
    hub.$emit("switch", {command: "get", info:"tag_list"});
}

test_eventSwitcher();