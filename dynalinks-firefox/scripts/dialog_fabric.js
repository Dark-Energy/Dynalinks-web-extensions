
var Dialog_Tab = 
{
    url: '',
    title: '',
   
   prepare_postal: function ()
   {
        var self = this;
        var record = 
        {
            url: this.url,
            title: this.title
        }

        var p = new Postal({command: "get_tabinfo"});
        p.response = record;
        p.wait();        
    },
   
    open: function (url,title)
    {
        this.url = url;
        this.title = title;

        var self =this;
        

        
        var fullurl = browser.runtime.getURL("/pages/dialog/dialog.html");
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

        function created (tab)
        {
            console.log("created tab");
            //self.prepare_postal();
            give_info();
        }

        
        function give_info()
        {
            var ms = new MyStorage();
            
            ms.$on_write = function (key) {
            }
            console.log("write storage", {url: url, title:title});
            ms.write("dlink-temp-tabinfo", {url: url, title:title});
        }

            
        var self = this;
        
    }
};





function find_active_tab()
{
    function success(tabs)
    {
        var tab = tabs[0];
        Dialog_Tab.open(tab.url, tab.title);
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


function open_dialog()
{
   find_active_tab();
}

