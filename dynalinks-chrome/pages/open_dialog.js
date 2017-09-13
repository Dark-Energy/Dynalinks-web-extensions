

//await while tab awaike and start connect
//1) this function get connection with port
//2) wait message with require
//3) post message
function connected(port) {
    //set port
    console.log("background get connect from "+port.name);
    if (port.name !== 'request_tabinfo') {
        console.log("reject this");
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
        }
    }
}

function give_signal()
{
        chrome.runtime.onConnect.addListener(connected);
}
give_signal();


var Dialog_Tab = 
{
    url: '',
    title: '',
    open: function(url, title)
    {
        this.url = url;
        this.title = title;
        //get fucking url
        var fullurl = chrome.runtime.getURL("/pages/dialog.html");
        //create new tab and get fucking promise
        var creating = chrome.tabs.create({
            active: true,
            url: fullurl
        });
        
        chrome.extension.getBackgroundPage().console.log("find active tab and create new dialog");
        creating.then(function (tab) {
        
            //await while tab awaike and start connect
            console.log("awaiting when tab awaike, what for need this connect");
       
        }, function error(e) 
        {
            console.error("fucking error with open dialog creating link!",e);
        });
    }
};

function open_dialog()
{
    //first query active tab, then load in, then load to she info
    var tab = tabs[0];
    chrome.extension.getBackgroundPage().console.log("get active tab", tab.url, tab.title);
    browser.tabs.query({active: true, currentWindow: true}).then( function (tabs) {
        Dialog_Tab.open(tabs[0].url, tabs[0].title);
    });
    
}
