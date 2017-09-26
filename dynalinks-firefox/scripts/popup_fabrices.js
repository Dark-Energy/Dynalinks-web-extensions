function give_info_and_open_app(title, url)
{
    var ms = new MyStorage();
    ms.$on_write = function ()
    {
        Tab_Manager.open_active_tab("/pages/links_view/links_view.html");
    }
    var data = {"dlink-temp": {"command": "create->record", "title":title, "url": url}};
    ms.write(data);
    console.log("write dlink-temp" + JSON.stringify(data));
}

function find_active_tab()
{
    Tab_Manager.$on("find_active_tab", function (tab)
    {
        url = tab.url;
        title = tab.title;
        console.log("open tab url" + tab);
        give_info_and_open_app(title, url);
    });
    Tab_Manager.find_active_tab();
}

function open_dialog()
{
   find_active_tab();
}


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

function test_script()
{
    
   
    function framework_injected()
    {
        console.log("framwork injected");

    }
    
    Tab_Manager.$once("script injected", function (d) {
        Tab_Manager.inject_script(null, "extract_file()");
    });
    Tab_Manager.inject_script(null, undefined, "/lib/extract_file.js");    
}