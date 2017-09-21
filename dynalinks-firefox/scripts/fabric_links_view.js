console.log("fabric links view");

function open_table()
{
    Tab_Manager.open_active_tab("/pages/links_view/links_view.html");
}


function open_manager()
{
    var ms = new MyStorage();
    ms.$on_write = function ()
    {
        Tab_Manager.open_active_tab("/pages/links_view/links_view.html");        
    }
    ms.write({"dlink-temp": {"command": "activate-manager"}});
}



