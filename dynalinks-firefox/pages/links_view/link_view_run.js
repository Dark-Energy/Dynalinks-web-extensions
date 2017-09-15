/*
//this shit dont work
create_table_view(My_Extension.Dynalinks);
*/


var proxy;

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


