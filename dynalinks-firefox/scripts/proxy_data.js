

//other attempt to known, what yet go run
console.log("dynalinks waiting to conditions for starting");
var start_port = browser.runtime.connect("ready");
start_port.onMessage.addListener( start_running);
function start_running (m) 
{
    if (m.start === '!') {
        creating_dynalinks();
        start_port.onMessage.removeListener(start_running);
        start_port.disconnect();
        start_port = undefined;
    }
}


/*
My Extension proto
*/

var My_Extension = {};
My_Extension.Dynalinks = undefined;
My_Extension.key_name = "Dynalinks_Data";
My_Extension.created = false;

function get_my_extension()
{
    return My_Extension;
}



var proxy;

function creating_dynalinks()
{
  
   proxy = new Dynalinks_Proxy();
   proxy.onloaded = listener;
   proxy.Create_Dynalinks();
   
   function listener(dynalinks)
   {
        My_Extension.Dynalinks = proxy.dynalinks;
        My_Extension.created = true;
   }
}


/*

initialization done

Proxy object which control, read and write to storage and manipulate Dynalinks through port-messaging system


COMMUNICATION
*/


/*
this function process all communication
send all commands and require all info's
Its a listener onConnect and get port from function-caller
*/
      /*
        request {
            command: create category
            name: category name
        }
        response {
            result:"yes", "no", "exists"
            "y","n","e"
            "yes"/'y'/true, false/null/etc
        }
        */




var proxy_mixin = 
{
    "get-category_list": function (m)
    {
        console.log("get category list");
                    console.log("dialog require category list");
                    var response = {};
                    response.givin_data =  values_to_array(My_Extension.Dynalinks.names);
                    response.type_data = "array";
                    response.info = m.info;
                    response.command = "set"
        this.post_response(response);
    },
    
    "get-tag_list": function (m) {
        var category = m.category;
        if (category && My_Extension.Dynalinks.categories[category]) {
            var result = {};
            result.command = "set";
            result.info = "tag_list";
            result.category = category;
            result.givin = My_Extension.Dynalinks.categories[category].tags;
            console.log("tag list get ", JSON.stringify(result));
            this.post_response(result);
        }
    },
    
    "create-category": function (m) 
    {
        var f = My_Extension.Dynalinks.add_category(m.category_name);
        response = 
        {
            command: "create",
            info: "category",
            result: f,
            name: m.category_name
        };
        this.post_response(response);
    },


    "create-record": function (m)
    {      
        /*
        Format of record in database
        var record = 
        {
            id : (generated)
            "tag": m.tag,
            "href": m.url,
            "text": m.title,
        };
        */

        var record = 
        {
            "tag": m.record.tag,
            "href": m.record.url,
            "text": m.record.title,
        };
        //console.log("create record", JSON.stringify(record, null, ' '));            
        var result = My_Extension.Dynalinks.add_record_to_category(record, m.record.category);
        var response =
        {
            command: m.command,
            info: m.info,
            record: record,
            result: result
        }
        this.post_response(response);
    },
    
};
var port = new PortObjListener("request_to_proxy");
var switcher = new PortSwitcher(port);
switcher.add_mixin(proxy_mixin, '-');
port.run();

