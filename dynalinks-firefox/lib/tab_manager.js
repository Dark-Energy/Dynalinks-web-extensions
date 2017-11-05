
var Tab_Manager;


function Tab_Manager_Class()
{
}


/*

PUBLIC METHODS
find_active_tab
open_active_tab
query
get_all_tabs
get_all_tabs_info
    is really key method, which not only collect data about tabs,
    but add listeners to events
    this need refactoring
    
script injected successed
go (uuid)
update
make_active (tab.id)

EVENTS

on query done
on get all tabs
on get all tabs info
on open active tab
on find active tab

PROPERTIES
tabinfo: array of Objects
{
    url:  tab.url,
    title : tab.title,
    id : parseInt(tab.id),
    index: tab.index,
}


*/


var public_methods = {

    open_active_tab : function (url, callback)
    {
        
        var self = this;
        function success (tab)
        {
            self.tab = tab;
            console.log("tab created" + JSON.stringify(tab));
            self.$emit("open_active_tab", tab);
            if (callback) {
                callback(tab);
            }
        }
        
        var fullurl = browser.runtime.getURL(url);
        var params = 
        {
            active: true,
            url: fullurl
        };
        
        if (is_chrome) {
            chrome.tabs.create(params, function (tab) {
                self.$emit("open_active_tab", tab);
                if (callback) {
                    callback(tab);
                }
            });
        } else {
            browser.tabs.create(params).then(success, null);
        }
        
    },
    
    
    move: function (tab_id, index)
    {
        var self=this;
        function success(tab) 
        {
            self.$emit("move_tab", tab, index);
        }
        function error(e) {
            console.error("error in moving tab", e);
        }
        if (!is_chrome) {
            browser.tabs.move(tab_id, {index: index}).then(success, error);
        } else {
            chrome.tabs.move(tab_id, {index: index}, success);
        }
        
    },

    find_active_tab : function (callback)
    {
        var self = this;

        function success(tabs)
        {
            self.tab = tabs[0];
            self.$emit("find_active_tab", self.tab);
            if (callback) {
                callback(self.tab);
            }
        }

        var query_params = 
        {
            active: true,
            currentWindow: true,
        };

        if (is_chrome) {
            chrome.tabs.query(query_params, success);
        } else {
            browser.tabs.query(query_params).then( success );
        } 
    },

    query : function (params)
    {
        var self = this;
        function success(tabs)
        {
            //console.log("query done");
            self.tablist = tabs;
            self.$emit("query", tabs);
        }
        //console.log("query with params", params);
        if (is_chrome) {
            chrome.tabs.query(params, success);
        } else {
            browser.tabs.query(params).then( success );
        }     

    },
    
    get_all_tabs : function ()
    {
        this.query({});
    },

    //FIX: is really key method, which not only collect data about tabs,
    //but add listeners to events
    //need fix this
    get_all_tabs_info : function ()
    {
        var self = this;

        function callback(tabs)
        {
            self.collect_info();
            var message = {tabinfo: self.tablist_info};
            self.$emit("get_all_tabs_info", message);
        }            
        
        this.$on("query", function (tabs)
        {
            callback(tabs);
        });
        
        this.query({});
        
    },
    
    is_myself: function (tabinfo)
    {
        var page_url = "/pages/links_view/links_view.html";
        if (tabinfo.url.search(extension_scheme) !== -1 && 
        tabinfo.url.search(page_url) !== -1)
            return true;
        //tabinfo.title.search('Dynalinks') !== -1
        return false;
            
    },
    
    remove : function (my_id)
    {
        //console.log("remove by my id " + my_id);
        
        var record = this.tab_by_my_id[my_id];
        if (!record) {
            return false;
        }
        
        //don't remove itself by itself
        if (this.is_myself(record)) {
            return false;
        }

        //remove tab from tab data
        //FIX IT! We used my_id which is uuid but attribute named 'id'
        //what may be confusion because of tab.id
        remove_by_field_value(this.tablist_info, "my_id", my_id);        
        delete this.tab_by_my_id[my_id];    
        
        var tab_id = record.id;
        delete this.tab_changer[tab_id];
        
        function error(e)
        {
            //console.log("tab <"+id+">removed ;;;" + typeof id);
        }
        //id = parseInt(tab_id);
        if (is_chrome) {
            chrome.tabs.remove(tab_id, error);
        } else {
            browser.tabs.remove(tab_id).then(error);
        }
        
        return true;
    },
    
    go: function (uuid)
    {
        var record = this.tab_by_my_id[uuid];
        if (!record) {
            return;
        }
        var tab_id = record.id;
        if (!is_chrome) {
            browser.tabs.update(tab_id, {active: true});
        } else {
            chrome.tabs.update(tab_id, {active: true}, function () {});
        }
    },
    
    
    update: function (tab_id, params)
    {
        var self = this;
        function success(tab)
        {
            self.$emit("update", tab);
        }
        
        if (!is_chrome) {
            browser.tabs.update(tab_id, params).then(success, null);
        } else {
            chrome.tabs.update(tab_id, params, success);
        }
    },
    
    
    make_active: function (tab_id, callback)
    {
        var self = this;
        function success(tab)
        {
            //console.log("tabs.update callback triggered");
            if (callback) {
                callback(tab);
            }
            self.$emit("make_active", tab);
        }

        if (is_chrome) {
            chrome.tabs.update(tab_id, {active: true}, success);
        } else {
            browser.tabs.update(tab_id, {active: true}).then(success, null);
        }
    },

    
    inject_script: function (id, code, file)
    {
        var params= 
        {
            code: code,
            file: file,
        };
        
        var self = this;
        function success(data)
        {
            //console.log("inject success");
            self.$emit("script injected", data);
        }
        if (id === undefined || id === null) {
            browser.tabs.executeScript(params).then (success);
        } else {
            browser.tabs.executeScript(id, params).then (success);
        }
    }
    
};
    

    


var private_methods =
{
    tab_by_my_id : {},
    tab_changer : {},
    
    generate_my_info : function ()
    {
       this.tab_by_my_id = {};    
       this.tab_changer = {};
       for(var i =0;i < this.tablist_info.length; i++) {
            var record = this.tablist_info[i];
            record.my_id = generateUUID();
            this.tab_by_my_id[record.my_id] = record;
            this.tab_changer[record.id] = record;
       }
       
       //console.log("tab by my id => \n " + JSON.stringify(this.tab_by_my_id));
       //console.log("tab changer => \n " + JSON.stringify(this.tab_changer));
    },

    collect_info : function(tabs)
    {
        //console.log("found " + this.tablist.length + " tabs");
        //console.log("all tabs => " + JSON.stringify(this.tablist));           
        this.tablist_info = [];

        var t;
        for(var i =0; i < this.tablist.length; i++) {
             t = this.tablist[i];
             var record = {
                url:  t.url,
                title : t.title,
                id : parseInt(t.id),
                index: t.index,
             }
             this.tablist_info.push(record);
        }
        
        this.generate_my_info();
        this.set_listeners();
    },
    
    set_listeners: function ()
    {

        this.set_update_listener();
        this.set_remove_listener();
        this.set_create_listener();
    },


    change_tab_id : function (newid, oldid)
    {
        
        if (oldid == newid) {
            return;
        }
        var record = this.tab_changer[oldid];
        delete this.tab_changer[oldid];
        this.tab_changer[newid] = record;
        record.id = newid;
        
    },
    
    change_tab_info: function (id, changer_info, tab)
    {
        var record = this.tab_changer[id];
        var keys = ['url', 'title', 'index'];
        if (changer_info.url || changer_info.title || changer_info.index !== undefined) {
            copy_keys_if_defined(changer_info, record, keys);
            //console.log("tab change url or title", changer_info.title, changer_info.url, changer_info.index, changer_info.status);
        }
        //HACK for vue 
        //dont need while Tab_Manager and Vue share one scope
        //will be need if Tab_Manager move to background and use port connection instead events
        
        if (record.index === undefined) {
            record.index = tab.index;
        }
        
        if (changer_info.status === "complete") {
            /*
            console.log("hack for framework watch");
            var i = find_index_by_field_value(this.tablist_info, "id", id);
            if (i === -1) {
                console.error("fail update info!");
            }
            var record = this.tablist_info[i];
            console.log("record is ", JSON.stringify(record));
            //this.tablist_info.splice(i, 1, record);
            */
            //this.$emit("record->update", id);
        }
        
    },


    add_new_tab : function (id, url, title)
    {
        var record = 
        {
            url: url,
            title: title,
            id: id,
            my_id : generateUUID(),
        };

        this.tablist_info.push(record);
        this.tab_changer[id] = record;
        this.tab_by_my_id[record.my_id] = record;
        
        this.switcher.send_command("tab", "create", record);
        return record;
    },

    _private_update_listener : function(newId, changerInfo, tab)
    {
        function get_id(newId, tab)
        {
            if (newId !== undefined) 
                return newId
            if (tab !== undefined) 
                return tab.id;
            return null;
        }
        
        var tab_id = get_id(newId, tab);
        if (tab_id === null) {
            console.error("Incorrect tab " + JSON.stringify(tab));
            // + " newId " + newId + " changerInfo " + JSON.stringify(changerInfo));
            return;
        }
            //new tab
        var create_new = (tab === undefined || newId === undefined) 
            || this.tab_changer[tab_id] === undefined;
        //if (tab && (tab.id === newId && this.tab_changer[tab.id] === undefined)) 
        //console.log("tab changed ", changerInfo);
        if (create_new)
        {
            //console.log("create new");
            this.add_new_tab(newId, changerInfo.url, changerInfo.title);
        } else  {
            this.change_tab_id(newId, tab.id);
            this.change_tab_info(newId, changerInfo, tab);
        }
    },

    set_update_listener:  function ()
    {
        var self = this;
        function callback(newId, changerInfo, tab)
        {
            self._private_update_listener(newId, changerInfo, tab);
        }
        
        if (is_chrome) {
            chrome.tabs.onUpdated.addListener(callback);
        } else {
            browser.tabs.onUpdated.addListener(callback)
        }
    },

    private_remove_callback: function(tab_id, remove_info)
    {
        var record = this.tab_changer[tab_id];
        //most perhaps this is event of tab, closed by Tab Manager
        if (record === undefined) {
            //console.error("removed undefined tab!");
            return;
        }
        var my_id = record.my_id;
        delete this.tab_changer[tab_id];
        delete this.tab_by_my_id[my_id];                
        remove_by_field_value(this.tablist_info, "my_id", my_id);                
    },
    
    set_remove_listener: function ()
    {
        var self = this;
        function callback(tab_id, remove_info)
        {
            self.private_remove_callback(tab_id, remove_info);
        }
        
        if (is_chrome) {
            chrome.tabs.onRemoved.addListener(callback);
        } else {
            browser.tabs.onRemoved.addListener(callback)
        }
        
    },

    private_oncreated_listener: function (tab)
    {
        var record = this.add_new_tab(tab.id, tab.url, tab.title);
        record.index = tab.index;
    },
    
    set_create_listener: function ()
    {
        var self= this;
        function callback(tab) {
            //console.log("on create event listener triggered");
            self.private_oncreated_listener(tab);
        }
        if (is_chrome) {
            chrome.tabs.onCreated.addListener(callback);
        } else {
            browser.tabs.onCreated.addListener(callback)
        }
    },
};



function create_tab_manager_communication()
{
    Tab_Manager.port = new PortObjListener("tab-manager");
    Tab_Manager.port.run();
    Tab_Manager.port.process_conntection = function (p)
    {
       //console.log("connect with tab-manager from " + p.name);
    }
    Tab_Manager.switcher = new PortSwitcher(Tab_Manager.port);


    Tab_Manager.switcher.add_command("get", "alltabinfo", function (p)
    {
        Tab_Manager.$on("get_all_tabs_info", function (m) {
            this.port.post(m); 
        });
        Tab_Manager.get_all_tabs_info();
    });

    /*
    sender post message, where tab identifies by my uuid, 
    but names this key just 'id'
    this may become reason for errors
    */
    Tab_Manager.switcher.add_command("tab", "remove", function (message) 
    {
        Tab_Manager.remove(message.id);
    });
}


function create_tab_manager_class()
{
    Object.assign(Tab_Manager_Class.prototype, Event_Mixin);
    Object.assign(Tab_Manager_Class.prototype, public_methods);
    Object.assign(Tab_Manager_Class.prototype, private_methods);
}

function create_tab_manager_singleton()
{
    Tab_Manager = new Tab_Manager_Class();
}

if (Tab_Manager === undefined)
{
    console.log("create tab manager");
    create_tab_manager_class();    
    create_tab_manager_singleton();
    //FIX: is really need?
    create_tab_manager_communication();
}


