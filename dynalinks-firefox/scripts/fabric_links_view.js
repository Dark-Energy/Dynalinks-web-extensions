function open_table()
{
    Tab_Manager.open_active_tab("/pages/links_view/links_view.html");
}


/*

var My_Fabric ={};

My_Fabric.find_active_tab = function ()
{
    
    function write_temp_data()
    {
        var fuck_chrome = new MyStorage();
        
        fuck_chrome.$on_write = function (key) {
           open_table();
        }
        fuck_chrome.write("dlink-temp-tabinfo", {url: url, title:title});
    }
        
    
    function success(tabs)
    {
        this.tab = tabs[0];
        this.params = {
            url: tab.url,
            title: tab.title,
        };
        write_temp_data();
    }
    
    if (is_chrome) {
        chrome.tabs.query({active: true, currentWindow: true}, success);
    } else {
        browser.tabs.query({active: true, currentWindow: true}).then( success );
    }
}
*/