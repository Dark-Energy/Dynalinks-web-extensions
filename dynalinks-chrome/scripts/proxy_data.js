console.log("NAME proxy");


var count = 0;

var My_Extension = {};
My_Extension.Dynalinks= undefined;
My_Extension.key_name = "Dynalinks_Data";

function Create_Dynalinks(callback)
{
   var key_name = "Dynalinks_Data"
   console.log("creating dynalinks", My_Extension.Dynalinks);
   
   if (My_Extension.Dynalinks) {
    return;
   }

    chrome.storage.local.get(this.key_name).then(success, fail);
    var self = this;
    var real_data;
    function success(data)
    {
        if (data && data.key_name === this.key_name) {
            real_data = data;
            console.log("real data is loaded");
            var database = real_data.Dynalinks_Data;
            My_Extension.Dynalinks=new Dynalinks(database);
            if (callback) {
                callback(My_Extension.Dynalinks);
            }
        } else {
            console.log("found data, but else", JSON.stringify(data));
        }
    }
    function fail(e)
    {
        console.log("Oh, my extension is fail!!!!");
    }
   
    chrome.storage.local.get("Dynalinks_Data").then ( success, fail);    
}

chrome.runtime.onConnect.addListener(connected);


function add_listener_to_database_changes()
{
    console.log("created listener of changes in database ", d.names, d.database);

    function listener(m)
    {
        consoloe.log("listen to change");
        var json = My_Extension.Dynalinks.toJSON();
        json.key_name = My_Extension.key_name;
        var shit =  My_Extension.key_name;
        
        function fail()
        {
            console.log("failed to save database in callback");
        }
        
        function success()
        {
            console.log("!success to save database in callback!")
        }
        
        chrome.storage.local.set({shit: json}).then (success, fail);
    }
    d.$on("change", listener);
}


function creating_dynalinks()
{
   Create_Dynalinks(listener);
   
   function listener(dynalinks)
   {
      add_listener_to_database_changes();    
   }
}




function dispatch(m)
{
    console.log("connecting ", m.name);
    proxy_port  = m;
    proxy_port.onMessage.addListener(function (m) {
      //proxy_port.postMessage({name: name});
      if (m.command === "create_category")
      {
            console.log("create_ category");
            var f = My_Extension.Dynalinks.add_category(m.category_name);
            console.log("create cat = ", m.category_name, "createing is accepted ", f);
      }
  });
}


chrome.runtime.onConnect.addListener(dispatch);