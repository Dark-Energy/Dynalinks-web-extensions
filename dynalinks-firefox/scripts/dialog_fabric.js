console.log("dialog fabric loading");


var Dialog_Tab = 
{
    url: '',
    title: '',
   
   creating: function ()
   {
        var self = this;
        var record = 
        {
            url: this.url,
            title: this.title
        }

        var p = new Postal({command: "get_tabinfo"});
        p.max_times = 1;
        p.response = record;
        p.wait();
      
    },
   
    open: function (url,title)
    {
        this.url = url;
        this.title = title;

        var self =this;
        var fullurl = browser.runtime.getURL("/pages/dialog/dialog.html");
        var creating = browser.tabs.create({
            active: true,
            url: fullurl
        });
        
        creating.then( function (tab) {
            //await while tab awaike and start connect
            console.log("tab create, open and active, but not rendered yet");
            self.creating();
        },
        null);

    },
};


function open_append_record_dialog()
{
    //first query active tab, then load in, then load to she info
    console.log("open append_record_dialog");
    browser.tabs.query({active: true, currentWindow: true}).then( function (tabs) {
        var tab = tabs[0];
        Dialog_Tab.open(tab.url, tab.title);
    });
    
}



console.log("dialog fabric loaded");


