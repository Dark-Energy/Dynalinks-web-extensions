*Library for working with ports, connects and messages*

5 reasons was to creating this library.

1) conviency
2) reusability, once written code may be used multiply times
3) 
4)
5) Especially one. There is a opportunity of isolation all code parts, related to different between Firefox and Chrome. And resolve this difference.



Especially for work with message and connection and port and other ugly matter i created this library.

Ojbect PortObjListener (name, run)

Parameters:
name - give 'name', what will become Port.name 
run -  what meant port running immediatly. By default false;

Object self carry out assign onConnect and onMmessage listeners.
last_message - contain last arrived message

process_message - optional handler message arraving
process_connection = optional handler connecting

$on_connect_event - is a function, which append another function, which process connecting
i don't know' what i am this doing. This event fired before rest code process connection.

Obvisioly, need 2 events "before connected" and "connected".

And have no event for message arriving, only function "process message"


    for(var i=0;i<10; i++) {
        ports[i] = new PortObjListener("test-ports-"+i, true);
        ports[i].$on_connect_event(generator(ports[i]));
    }

    create 10 pors-listeners
    
    
*PORTMAN*

function (name, bipolar)

name - will be port.name
bipolar - if true mean what port have a onMessage listener and can process arrived messsages. if False meant what port is only post message.
    
    
Portman is a active port, who created 

browser.connect calling

His almost like to ObjListener.

This code create 10 objects Portman
    for(var i=0;i<10; i++) {
        ports[i] = new Portman("test-ports-"+i, true);
        ports[i].post({"oh":"shit"});
    }

    
    
Example of working code


function trying_get_category_list()
{
    var port = new Portman("request_to_proxy", true);
    port.post({command: "get", info: "category_list"});
    port.process_message = function (m) {
       if (m.command === 'set' && m.info === 'category_list')
       {
            var catlist= m.givin_data;
            my_select_form.set_options(catlist, catlist[0]);
           
            //get tag list
            port.post({command: "get", info: "tag_list", "category": catlist[0]});
            port.process_message = function (m) {
                if (m.command === 'set' && m.info === 'tag_list')
                {
                    console.log("tag list givin!");
                    select_tag.set_options(m.givin, m.givin[0]);
                }
            }
       }
        
    }
}
    
    
Unfortunatly, we again see many levels of inner functions. Though without ugly ); at end. Now functions are put in functions, not in call of call of call. Promises are ugly.



*PortSwitcher*

This is simple inteface, allowing execute command, tranported through port connection



var port = new PortObjListener("request_to_proxy");
port.run();


var switcher = new PortSwitcher(port);
switcher.add_command("get", "category_list", function (m)
{
    console.log("get category list");
                console.log("dialog require category list");
                var response = {};
                response.givin_data =  values_to_array(My_Extension.Dynalinks.names);
                response.type_data = "array";
                response.info = m.info;
                response.command = "set"
    this.post_response(response);
});    




But this is too much. Because of i have invent mixin mixing.

add_mixin(object, separator);

First argument is a object contains key, who names separated by "command" and "info" especially symbol. This symbol pass as second argument. I mean, this keys must be functions. My method automcatically collect all this functions and append to command table. 