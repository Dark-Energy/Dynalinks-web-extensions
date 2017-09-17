
var proxy;

///console.log("app create");


function create_table_view(dlink) {
    //console.log("My Extension is ", JSON.stringify(My_Extension));
    var App = new Vue_Application(dlink);    
}


///console.log("end run.js!");

/*
var test_object =
{
    test : function()
    {
        
            if (this.port === undefined) {
            this.port = new Portman("tab-manager", true);
            this.port.process_message = function (m)
            {
                console.log("test_Ojbect: get message from tab-manager =>" + JSON.stringify(m));
            }
        console.log("port created");            
        }
        this.port.post({command:"get", info:"alltabinfo"});
        console.log("request sended");
    }
};

console.log("!!!!!! test tab-manager");
test_object.test();
*/


function creating_dynalinks_for_app()
{
  console.log("create dynalinks from proxy");
   proxy = new Dynalinks_Proxy();
   proxy.onloaded = listener;
   proxy.Create_Dynalinks();
   
   function listener(dlink)
   {
        create_table_view(dlink);
   }
}

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


