
var proxy;

function create_table_view(dlink) {
    //console.log("My Extension is ", JSON.stringify(My_Extension));
    var App = new Vue_Application(dlink);    

    var ms = new MyStorage();
    ms.$on_read = function (data)
    {
        //console.log("message to application from storage " + JSON.stringify(data));        
        var dlink = data['dlink-temp'];
        if (dlink === undefined) return;
        
        var command = dlink.command;
        if (command === 'activate-manager') {
            App.look_tabs();
            
        } else if (command == "create->record") {
            var url = dlink.url;
            var title = dlink.title;
            App.add_record_from_browser(title, url);
        }
        ms.remove('dlink-temp');
    }
    ms.read('dlink-temp');

}

function creating_dynalinks_for_app()
{
  //console.log("create dynalinks from proxy");
   proxy = new Dynalinks_Proxy();
   function listener(dlink)
   {
        create_table_view(dlink);
   }
   proxy.onloaded = listener;
   proxy.Create_Dynalinks();
   
}

//create dynalinks, dynalinks proxy, get created dynalinks and create app;
creating_dynalinks_for_app()


function open_table_to_append_record()
{
  console.log("create dynalinks from proxy");
   proxy = new Dynalinks_Proxy();
   proxy.onloaded = listener;
   proxy.Create_Dynalinks();
   
   function listener(dlink)
   {
        //console.log("listener creating dynalinks", JSON.stringify(dlink));
        
        var ms = new MyStorage();
        ms.$on_read = function (data)
        {
            var obj = data['dlink-temp-tabinfo'];
            var params = 
            {
                command: "create->record",
                url: obj.url,
                title: obj.title
            };
            create_table_view(dlink, params);
        }
        ms.read('dlink-temp-tabinfo');
   }
    
}


