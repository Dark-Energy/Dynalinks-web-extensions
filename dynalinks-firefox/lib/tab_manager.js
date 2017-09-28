console.log("load tab manager");

var Tab_Manager = {}




/*

PUBLIC METHODS
find_active_tab
open_active_tab
query
get_all_tabs
get_all_tabs_info
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

*/

Object.assign(Tab_Manager, Event_Mixin);

var public_methods = {

    open_active_tab : function (url)
    {
        var fullurl = browser.runtime.getURL(url);
        var params = 
        {
            active: true,
            url: fullurl
        };
        
        if (is_chrome) {
            chrome.tabs.create(params, created);
        } else {
            browser.tabs.create(params).then(created, null);
        }
        
        var self = this;
        function created (tab)
        {
            self.tab = tab;
            self.$emit("open_active_tab", tab);
        }
    },

    find_active_tab : function ()
    {
        var self = this;

        function success(tabs)
        {
            self.tab = tabs[0];
            self.$emit("find_active_tab", self.tab);
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
    
    get_all_tabs_info : function ()
    {
        var self = this;

        function callback(tabs)
        {
            self.collect_info();
            var message = {tabinfo: self.tablist_info};
            //console.error("send tabinfo");
            self.$emit("get_all_tabs_info", message);
        }            
        
        this.$on("query", function (tabs)
        {
            callback(tabs);
        });
        
        this.query({});
        
    },
    
    remove : function (my_id)
    {
        //console.log("remove by my id " + my_id);
        
        var record = this.tab_by_my_id[my_id];
        if (!record) {
            return;
        }

        //FIX IT! First error, cause by fact what truth tab id is uuid, 
        //but attribute named 'id'
        remove_by_field_value(this.tablist_info, "my_id", my_id);        
        delete this.tab_by_my_id[my_id];    
        
        var tab_id = record.id;
        delete this.tab_changer[tab_id];
        //console.log("my id " + my_id + "record id " + id;
        
        function error(e)
        {
            //console.log("tab <"+id+">removed ;;;" + typeof id);
        }
        id = parseInt(tab_id);
        if (is_chrome) {
            chrome.tabs.remove(tab_id, error);
        } else {
            browser.tabs.remove(tab_id).then(error);
        }
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
        
        function success(tab)
        {
            Tab_Manager.$emit("update", tab);
        }
        
        if (!is_chrome) {
            browser.tabs.update(tab_id, params).then(success, null);
        } else {
            chrome.tabs.update(tab_id, params, success);
        }
    },
    
    
    make_active: function (tab_id)
    {
        function success(tab)
        {
            Tab_Manager.$emit("make_active", tab);
        }

        if (!is_chrome) {
            browser.tabs.update(tab_id, {active: true}).then(success, null);
        } else {
            chrome.tabs.update(tab_id, {active: true}, success);
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
    

Object.assign(Tab_Manager, public_methods);
    


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
                id : parseInt(t.id)
             }
             this.tablist_info.push(record);
        }

        this.set_update_listener();

        this.generate_my_info();

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
        this.tab_changer[newId] = record;
        this.tab_by_my_id[record.my_id] = record;
        
        this.switcher.send_command("tab", "create", record);
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
            //console.error("Incorrect tab " + JSON.stringify(tab) + " newId " + newId + " changerInfo " + JSON.stringify(changerInfo));
            return;
        }
            //new tab
        var create_new = (tab === undefined || newId === undefined);
        if (tab && (tab.id === newId && this.tab_changer[tab.id] === undefined)) 
        
        if (create_new)
        {
            this.add_new_tab(newId, changerInfo.url, changerInfo.title);
        } else  {
            this.change_tab_id(newId, tab.id);
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
    }
};


Object.assign(Tab_Manager, private_methods);


/*

LEGACY

*/

Tab_Manager.port = new PortObjListener("tab-manager");
Tab_Manager.port.run();
Tab_Manager.port.process_conntection = function (p)
{
   //console.log("connect with tab-manager from " + p.name);
}
Tab_Manager.switcher = new PortSwitcher(Tab_Manager.port);

Tab_Manager.call_job_done = function ()
{
    console.error("who call job done?");
}




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


