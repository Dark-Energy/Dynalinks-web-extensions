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

//fucking stack
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


Tab_Manager.collect_info = function(tabs)
{
   //console.log("found " + this.tablist.length + " tabs");
   //console.log("all tabs => " + JSON.stringify(this.tablist));           
   var arr = [];
   var t;
   for(var i =0; i < this.tablist.length; i++) {
         t = this.tablist[i];
         var record = {
            url:  t.url,
            title : t.title,
            id : t.id
         }
         arr.push(record);
    }
    this.tablist_info = arr;
}


Tab_Manager.get_all_tabs_info = function ()
{
    this.$job_done = function (tabs) {
        this.tablist = tabs;
        Tab_Manager.collect_info(tabs);
    }
    this.get_all_tabs();
}


Tab_Manager.switcher.add_command("get", "alltabinfo", function (p)
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
