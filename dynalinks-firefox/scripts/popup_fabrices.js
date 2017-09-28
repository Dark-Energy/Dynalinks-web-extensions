

var extension_scheme="moz-extension";
var page_url = "/pages/links_view/links_view.html";



function command_view()
{
    var snd = new Sender({address:"view"});
    snd.send();
}

Tab_Manager.$on("make_active", function ()
{
    command_view();
});

function activate_view (tab)
{

    if (!tab.active) {
        Tab_Manager.make_active(tab.id);
    } else {
        command_view();
    }
    

}

function find_dynalinks_open()
{
    
    Tab_Manager.$on("query", function (tabs) {
        if (tabs.length === 0) {
            console.log("need open");
            Tab_Manager.open_active_tab("/pages/links_view/links_view.html");    
        } else {
            for(var i =0; i < tabs.length; i++) {
                var url = tabs[i].url;
                //console.log("tab check", tabs[i]);                
                if (url.search(extension_scheme) !== -1 && url.search(page_url) !== -1 ) {
                    activate_view(tabs[i]);
                }
            }
            
        }
    });

    var params =
    {
        title: "Dynalinks",
        //url:"moz-extension://*", FORBIDDEN!
        //<all_url>,
    };
    Tab_Manager.query(params);
    return false;
}

function open_links_view(m)
{
    find_dynalinks_open();
    
}

function give_info_and_open_app(title, url)
{
    var ms = new MyStorage();
    ms.$on_write = function ()
    {
        open_links_view("dialog");
        ms.$on_write = undefined;
    }
    var data = {"dlink-temp": {"command": "create->record", "title":title, "url": url}};
    ms.write(data);
}



Tab_Manager.$on("find_active_tab", function (tab)
{
    url = tab.url;
    title = tab.title;
    give_info_and_open_app(title, url);
});


function open_dialog()
{
   Tab_Manager.find_active_tab();
}


function open_table()
{
    open_links_view("table");
}


function open_manager()
{
    var ms = new MyStorage();
    ms.$on_write = function ()
    {
        open_links_view("manager");
    }
    ms.write({"dlink-temp": {"command": "activate-manager"}});
}

function test_script()
{
    
   
    function framework_injected()
    {
        //console.log("framwork injected");

    }
    
    Tab_Manager.$once("script injected", function (d) {
        Tab_Manager.inject_script(null, "extract_file()");
    });
    Tab_Manager.inject_script(null, undefined, "/lib/extract_file.js");    
}