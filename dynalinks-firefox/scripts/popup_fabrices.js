

function Application_Proxy()
{
    this.extension_scheme=extension_scheme;
    
    this.page_url = "/pages/links_view/links_view.html";
    
    this.commands["add-record"] = this.open_dialog;
    this.commands["show-links"] = this.open_table;
    this.commands["manage-tabs"] = this.open_manager;

    this.create_reciver();
}

Object.assign(Application_Proxy.prototype, {
    constructor: Application_Proxy,
    open_page: function (command) {
        var func = this.commands[command];
        if (func) {
            func.call(this);
        }
    },
    open_tablist: function ()
    {
    },
    open_directory: function ()
    {
    },
    open_dialog: function ()
    {
    },
    create_main_view: function ()
    {
        var self = this;
        Tab_Manager.open_active_tab(page_url, function (tab) {
            self.move_view_beside_active_tab(tab);
        });
    },
    move_view_beside_tab : function (tab) {
        //dont move view beside itself
        if (this.target_index !== undefined && tab.index != this.target_index) {
            Tab_Manager.move(tab.id, target_index+1);
        }
        this.taget_index = undefined;
    },
    create_reciver: function ()
    {
        this.reciver = new Postal("view-controller");
        var self = this;
        this.reciver.$onmessage = function (m) {
            //console.log("we have a message", JSON.stringify(m));
            switch(m.command) {
                case "open_manager": self.open_manager(); break;
                case "open_dialog": self.open_dialog(); break;
                case "open_table": self.open_table(); break;
                default: //do nothing
                break;
            }
        }
        this.reciver.wait();
    }
    
});


var page_url = "/pages/links_view/links_view.html";


var view_tab;
var target_index = undefined;


function move_dialog_beside_tab(tab, index)
{
    if (target_index !== undefined && tab.index != target_index) {
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


function activate_view (tab)
{
    //console.log("activate view " + JSON.stringify(tab));
    if (!tab.active) {
        Tab_Manager.make_active(tab.id);
    }
    command_view();
}


var dynalinks_tab;

function find_opened_dynalinks(callback)
{
    var view_tab;
    dynalinks_tab = undefined;    
    Tab_Manager.$once("query", function (tabs) {
        for(var i =0; i < tabs.length; i++) {
            var url = tabs[i].url;
            var tab  = tabs[i];
            if (url.search(extension_scheme) !== -1 && url.search(page_url) !== -1 )
            {
                dynalinks_tab = tabs[i];
                break;
            }
        }
        callback(dynalinks_tab);
    });
    
    var params =
    {
        title: "Dynalinks",
    };
    Tab_Manager.query(params);
    return false;
}


function open_links_view(target)
{
    console.log("open links view from " + target);
    find_opened_dynalinks(function (tab) {
        if (tab === undefined) {
            console.log("dynalinks not found, create new");            
            Tab_Manager.open_active_tab(page_url, function (tab) {
                move_dialog_beside_tab(tab, target_index);
            });            
        } else {
            console.log("activate");
            activate_view(tab);
            move_dialog_beside_tab(tab, target_index);
        }
    });
    
}

function give_info_and_open_app(tab)
{
    target_index = tab.index;
    var ms = new MyStorage();
    ms.$on_write = function ()
    {
        open_links_view();
        ms.$on_write = undefined;
    }
    var data = {"dlink-temp": {
        "command": "create->record", 
        "title": tab.title, 
        "url": tab.url, 
        "index": tab.index
        }};
    ms.write(data);
}



Tab_Manager.$on("find_active_tab", function (tab)
{
    target_index = tab.index;
});





function open_dialog()
{
    Tab_Manager.find_active_tab(
        function (tab) {
            give_info_and_open_app(tab);
        }
    );
}


function open_table()
{
    Tab_Manager.find_active_tab();
    
    console.log("open links");
    open_links_view();
}


function open_manager()
{
    console.log("open manager");
    Tab_Manager.find_active_tab();    
    
    var ms = new MyStorage();
    ms.$on_write = function ()
    {
        open_links_view("manager");
    }
    ms.write({"dlink-temp": {"command": "activate-manager"}});
}



var fabric_connector;

if (fabric_connector === undefined)
{
    fabric_connector = new Postal("view-controller");
    fabric_connector.$onmessage = function (m) {
        //console.log("we have a message", JSON.stringify(m));
        switch(m.command) {
            case "open_manager": open_manager(); break;
            case "open_dialog": open_dialog(); break;
            case "open_table": open_table(); break;
            default: //do nothing
            break;
        }
    }
    fabric_connector.wait();
}