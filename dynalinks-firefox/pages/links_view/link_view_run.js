
var proxy;

var App;

var the_dlink;


function create_table_view(dlink) {

    App = new Vue_Application(dlink);

    console.log("Create application and read message from storage");
    read_message(dlink, "create_table_view");
}

function read_message(dlink, _from)
{
    var ms = new MyStorage();
    ms.$on_read = function (data)
    {
        console.log("message to application from storage " + JSON.stringify(data));
        console.log("call from " + _from);
        
        var dlink = data['dlink-temp'];
        if (dlink === undefined) {
            App.show_category_view();
            //App.default_category_view();
            return;
        }
        
        var command = dlink.command;
        if (command === 'activate-manager') {
            App.look_tabs();
            
        } else if (command == "create->record") {
            var url = dlink.url;
            var title = dlink.title;
            console.log("active create record", url, title);
            App.add_record_from_browser(title, url);
        } else {
            App.show_category_view();
            //App.default_category_view();
        }
        ms.remove('dlink-temp');
    }
    ms.read('dlink-temp');
    
}

function creating_dynalinks_for_app()
{
   proxy = new Dynalinks_Proxy();
   function listener(dlink)
   {
        the_dlink = dlink;
        create_table_view(dlink);
   }
   proxy.onloaded = listener;
   proxy.Create_Dynalinks();
   
}

//create dynalinks proxy, after create application and pass him command
creating_dynalinks_for_app()


/*
var relation_to_popup = new PortObjListener("popup");
relation_to_popup.process_message = function (message)
{
    read_message();
}
relation_to_popup.run();
*/

var relation_to_fabric = new Postal({address:"view"});
relation_to_fabric.response = {answer: "forever ready!"}
//relation_to_fabric.$onresponse = function (r) {console.log("my answer ", r); }
relation_to_fabric.$onmessage = function (m) 
{
    console.log("we have a message " + JSON.stringify(m));
    if (App) {
        read_message(the_dlink, "postal");
    }
}
relation_to_fabric.wait();