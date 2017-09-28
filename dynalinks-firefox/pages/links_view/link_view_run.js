
var proxy;

var App;

var the_dlink;


function create_table_view(dlink) {

    App = new Vue_Application(dlink);

    read_message(dlink);
}

function read_message(dlink)
{
    var ms = new MyStorage();
    ms.$on_read = function (data)
    {
        //console.log("message to application from storage " + JSON.stringify(data));        
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

var relation_to_fabric = new Postal("view");
relation_to_fabric.response = {answer: "forever ready!"}
//relation_to_fabric.$onresponse = function (r) {console.log("my answer ", r); }
relation_to_fabric.$onmessage = function (m) 
{
    //console.log("message is ", m);
    console.log("read from storage");
    if (App) {
        read_message(the_dlink);
    }
}
relation_to_fabric.wait();