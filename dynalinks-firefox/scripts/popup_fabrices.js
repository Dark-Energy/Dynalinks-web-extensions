

var extension_scheme="moz-extension";
var page_url = "/pages/links_view/links_view.html";


var view_tab;
var target_index = undefined;


function move_dialog_beside_tab(tab, index)
{
    if (target_index !== undefined ) {
        Tab_Manager.move(tab.id, target_index+1);
    }
    taget_index = undefined;
}


function command_view()
{
    console.log("command view");
    var snd = new Sender({address:"view"});
    snd.send();
}

Tab_Manager.$on("make_active", function ()
{
    command_view();
});

function activate_view (tab, index)
{

    if (!tab.active) {
        Tab_Manager.make_active(tab.id);
    } else {
        command_view();
    }
    

}

function find_dynalinks_open()
{
    var view_tab;
    Tab_Manager.$on("query", function (tabs) {
        if (tabs.length === 0) {
            Tab_Manager.$once("open_active_tab", function (tab) {
                //move_dialog_beside_tab(tab, target_index);
            });
            Tab_Manager.open_active_tab(page_url);
        } else {
            for(var i =0; i < tabs.length; i++) {
                var url = tabs[i].url;
                var tab  = tabs[i];
                if (url.search(extension_scheme) !== -1 && url.search(page_url) !== -1 ) {
                    activate_view(tab);
                    move_dialog_beside_tab(tab, target_index);
                }
            }
        }
        
    });

    var params =
    {
        title: "Dynalinks",
    };
    Tab_Manager.query(params);
    return false;
}

function open_links_view()
{
    find_dynalinks_open();
}

function give_info_and_open_app(tab)
{
    var url = tab.url;
    var index = tab.index;
    var title = tab.title;
    target_index = index;
    var ms = new MyStorage();
    ms.$on_write = function ()
    {
        open_links_view()
        ms.$on_write = undefined;
    }
    var data = {"dlink-temp": {"command": "create->record", "title":title, "url": url, "index":index}};
    ms.write(data);
}



Tab_Manager.$on("find_active_tab", function (tab)
{
    give_info_and_open_app(tab);
});


function open_dialog()
{
   Tab_Manager.find_active_tab();
}


function open_table()
{
    open_links_view();
}


function open_manager()
{
    var ms = new MyStorage();
    ms.$on_write = function ()
    {
        open_links_view();
    }
    ms.write({"dlink-temp": {"command": "activate-manager"}});
}

