//import Vue from 'vue'

var event_bus = {};
var event_hub = event_bus;

function create_event_hub()
{
    event_bus = new Vue();
    event_hub = event_bus;
    return event_hub;
}

export {event_bus, event_hub, create_event_hub};

