var Tab_Manager = {}

//event handler
/*
Tab_Manager has
1) portObjListener, opened for listening connection
2) event $job_done, which can use like stack
3) find active tab function
*/
Tab_Manager.$job_done = undefined;
Tab_Manager.$query_done = undefined;

Tab_Manager.port = new PortObjListener("tab-manager");
Tab_Manager.port.run();

//console.log("tab-manager - " + JSON.stringify(Tab_Manager.port));

Tab_Manager.port.process_conntection = function (p)
{
   //console.log("connect with tab-manager from " + p.name);
}


Tab_Manager.switcher = new PortSwitcher(Tab_Manager.port);

Tab_Manager.call_job_done = function ()
{
   if (this.$job_done) {
       this.$job_done.call(this, this.tab);
   }
}

//just stack
Tab_Manager.push_handler = function (handler)
{
    this.$old_job_done = this.$job_done;
    this.$job_done = handler;
}

Tab_Manager.pop_handler = function ()
{
    if (this.$old_job_done !== undefined)
    {
        this.$job_done = this.$old_job_done;
        this.$old_job_done = undefined;
    }
}

Tab_Manager.call_query_done = function (tabs)
{
    if (this.$query_done) {
        this.$query_done(tabs);
    }
}


Tab_Manager.open_active_tab = function (url)
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
        self.call_job_done();
    }
}

Tab_Manager.find_active_tab = function ()
{
    var self = this;
    function success(tabs)
    {
        self.tab = tabs[0];
        self.call_job_done();
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
}

Tab_Manager.get_all_tabs = function ()
{
    this.query({});
}

Tab_Manager.query = function (params)
{
    var self = this;
    function success(tabs)
    {
        self.tablist = tabs;
        self.call_query_done(tabs);        
        self.call_job_done();
    }
    
    if (is_chrome) {
        chrome.tabs.query(params, success);
    } else {
        browser.tabs.query(params).then( success );
    }     
    //console.log("query " + this.port +"  "+ this.port.port);
}


Tab_Manager.tab_by_my_id = {};

Tab_Manager.generate_my_info = function ()
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
}

Tab_Manager.collect_info = function(tabs)
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
    
}


Tab_Manager.change_tab_id = function (newid, oldid)
{
    
    if (oldid == newid) {
        return;
    }
    var record = this.tab_changer[oldid];
    delete this.tab_changer[oldid];
    this.tab_changer[newid] = record;
    record.id = newid;
    
}


Tab_Manager.add_new_tab = function (id, url, title)
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
}

Tab_Manager._private_update_listener = function(newId, changerInfo, tab)
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
    
}

Tab_Manager.set_update_listener = function ()
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


Tab_Manager.get_all_tabs_info = function ()
{
    this.$job_done = function (tabs) {
        this.tablist = tabs;
        Tab_Manager.collect_info(tabs);
    }
    this.get_all_tabs();
}


Tab_Manager.remove = function (my_id)
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
}

Tab_Manager.get_all_tabs_info = function ()
{
    var self = this;
    
    //console.log("command execute - get all tabs info");
    Tab_Manager.$job_done = function (tabs)
    {
        Tab_Manager.collect_info();
        var message = {tabinfo: Tab_Manager.tablist_info};
        self.port.post(message);
    }
    Tab_Manager.get_all_tabs();    
    
}


Tab_Manager.switcher.add_command("get", "alltabinfo", function (p)
{
    Tab_Manager.get_all_tabs_info();
});

/*
sender post message, where tab identifies by my uuid, 
but names this key just 'id'
this may become reason for errors
*/
Tab_Manager.switcher.add_command("tab", "remove", function (message) 
{
    //console.log("command: request for removing" + JSON.stringify(message));
    Tab_Manager.remove(message.id);
});


/*
var active = new Portman("tab-manager",true);

//test code
function test_my()
{
    console.log("command execute - get all tabs info");
    Tab_Manager.$job_done = function (tabs)
    {
        Tab_Manager.collect_info();
        var message = {tabinfo: Tab_Manager.tablist_info};
        Tab_Manager.port.post(message);
    }
    Tab_Manager.get_all_tabs();
}

test_my();
*/
