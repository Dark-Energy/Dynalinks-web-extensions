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
        //console.log("listener creating dynalinks", JSON.stringify(dlink));
        create_table_view(dlink);
   }
}

creating_dynalinks_for_app()
