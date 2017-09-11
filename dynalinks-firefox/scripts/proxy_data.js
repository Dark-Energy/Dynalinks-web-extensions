console.log("NAME proxy");

//attempt to make connect with init.js and say "prepare is done, go!" 
//it's fucking fail
/*
function handleMessage(request, sender, sendResponse)
{   
    console.log("Message from the content script: " + request.init);    
    if (request.init) {
        creating_dynalinks();
    }
   //sendResponse({response: "Response from background script"});
}

browser.runtime.onMessage.addListener(handleMessage);
*/

//other attempt to known, what yet go run
console.log("dynalinks waiting to conditions for starting");
var p = browser.runtime.connect("ready");
p.onMessage.addListener( function (m) {
    if (m.start === '!'){
        creating_dynalinks();
    }
    
});


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

/*
//sending dynalinks data to view_links
browser.runtime.onConnect.addListener(view_listener);
function view_listener(p)
{
    if (p.name !== 'view_links') {
        return;
    }
    p.postMessage({dlink: My_Extension.Dynalinks});
}
*/

function Create_Dynalinks(callback)
{
   var key_name = "Dynalinks_Data"
   console.log("creating dynalinks");
   
   if (My_Extension.Dynalinks) {
    return;
   }
    var real_data;

    browser.storage.local.get(My_Extension.key_name).then(success, fail);
    //
    function success(data)
    {
        //console.log("what we get", JSON.stringify(data,null,' '));
        /*data = {dynalinks_data: object}*/
        /*My_Extension.key_name = 'dynalinks_data' */
        /*real data = object*/        
        var real_data = data[My_Extension.key_name];
        //console.log("what we get", JSON.stringify(real_data,null,' '));        
        if (real_data) {
            console.log("real data is loaded");
            My_Extension.Dynalinks=new Dynalinks(real_data);
            My_Extension.created = true;
            if (callback) {
                callback(My_Extension.Dynalinks);
            }
        } else {
            console.error("data may be corrupted", JSON.stringify(data));
        }
    }
    function fail(e)
    {
        console.error("Oh, my extension is fail!!!!");
    }
}


function add_listener_to_database_changes()
{
    //console.log("created listener of changes in database ", My_Extension.Dynalinks, My_Extension.Dynalinks);
    console.log("created listener of changes in database "); 
    //dynalinks change own structur, have to write this changes into storage
    function listener(m)
    {
        console.log("listen to change");
        var json = My_Extension.Dynalinks.toJSON();
        json.key_name = My_Extension.key_name;
        var shit =  My_Extension.key_name;
        
        //inside listener my are doing another yet async call, fuck it
        browser.storage.local.set({shit: json}).then (success, fail);
        function fail()
        {
            console.log("failed to save database in callback");
        }
        
        function success()
        {
            console.log("!success to save database in callback!")
        }
        
    }
    My_Extension.Dynalinks.$on("change", listener);
}


var proxy;

function creating_dynalinks()
{
  
   proxy = new Dynalinks_Proxy();
   proxy.onloaded = listener;
   proxy.Create_Dynalinks();

   //Create_Dynalinks(listener);   
   function listener(dynalinks)
   {
        My_Extension.Dynalinks = proxy.Dynalinks;
        My_Extension.created = true;
   
      //add_listener_to_database_changes();    
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
function dispatch(port)
{
    console.log("proxy get connecting from ", port.name);
    if (port.name !== "request_to_proxy")
        return;
    console.log("proxy admrire call with " + port.name);
    //port.postMessage({"admire": true});
    console.log("proxy wait new requstess");
    
    //get message
    port.onMessage.addListener(function (m) {
      //console.log("Proxy_data get message from " + port.name + " with message " + JSON.stringify(m));
      //command - create category
      //get - tag list
      if (m.command === "create_category")
      {
            console.log("getting command create_ category with name "+ m.category_name);
            var f = My_Extension.Dynalinks.add_category(m.category_name);
            console.log("create cat = ", m.category_name, "createing is accepted ", f);
      } else if (m.command === "get") {
            if (m.info === "category_list") {
                console.log("dialog require category list");
                var response = {};
                response.givin_data =  values_to_array(My_Extension.Dynalinks.names);
                response.type_data = "array";
                response.info = m.info;
                response.command = m.command;
                port.postMessage(response);
                //proxy_port.postMessage({"categories":
            } else if (m.info === "tag_list") {
                var category = m.category;
                if (category && My_Extension.Dynalinks.categories[category]) {
                    var result = {};
                    result.command = "get";
                    result.info = "tag_list";
                    result.category = category;
                    result.givin = My_Extension.Dynalinks.categories[category].tags;
                    port.postMessage(result);
                }
            }
      }
  });
}

//set main dispatch listener
browser.runtime.onConnect.addListener(dispatch);