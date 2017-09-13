console.log("dialog connection loading");

/*
//await while tab awaike and start connect
//1) this function get connection with port
//2) wait message with require
//3) post message
function connected(port) {
    if (port.name !== 'request_tabinfo') {
        console.log("background get connect from "+port.name + " reject this");
        return;
    }
    port.postMessage({"ready":true});
    port.onMessage.addListener(send_tab_info);
    
    function send_tab_info(m)
    {  
        //send fucking data
       console.log("background get message from " + port.name+" with " + JSON.stringify(m));
        if (m.command === 'get' && m.info === 'tab_info') {
            var response = {
                url: Dialog_Tab.url,
                title: Dialog_Tab.title
            };
            port.postMessage(response);
        } else {
        }
    }
}
browser.runtime.onConnect.addListener(connected);
*/

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
        browser.runtime.onMessage.addListener(function (message, sender, callback) {
            console.log("get message from nowhere", message);
            //if (message.command === "get_tabinfo") {
                 callback(record);
            //}
        });
      
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



console.log("dialog connection loaded");


