console.log("NAME back");




function onError(e)
{
    console.error("error", e);
}


var Dialog_Tab = 
{
    info: 
    {
        url: '',
        title: '',
    },
    
    set_tab_info: function (url, title) 
    {
        this.info.url = url;
        this.info.title = title;
    },
    open: function(url, title)
    {
        this.set_tab_info(url, title);
        
        //get fucking url
        var fullurl = browser.runtime.getURL("/pages/dialog.html");
        //create new tab and get fucking promise
        var creating = browser.tabs.create({
            active: true,
            url: fullurl
        });
        
        creating.then(function (tab) 
        {
            //don't wait when dialog open, wait message
        }, function error(e) 
        {
            console.error("fucking error with open dialog creating link!",e);
        });
    }
};


var port_from_dialog;

//this function get a port
function connected(p) {
    //set port
    port_from_dialog = p;
    console.log("background get connect from "+p.name);
    port_from_dialog.onMessage.addListener( listener );
    
    function listener(m) 
    {  
        //send fucking data
       console.log("background get message from " + p.name+" with " + JSON.stringify(m));
        if (m.command === 'get' && m.info === 'tab_info') {
            port_from_dialog.postMessage(Dialog_Tab.info);
        } else {
        }
    }
    
    //after data given, may disconnect
    browser.runtime.onConnect.removeListener(connected);
}




function open_dialog()
{
    //first query active tab, then load in, then load to she info
    var promise = browser.tabs.query({active: true, currentWindow: true}); 
    promise.then( function (tabs) {
        Dialog_Tab.open(tabs[0].url, tabs[0].title);
    });
    
    //add listener to fucking onConnect and wait when created tab request data
    browser.runtime.onConnect.addListener(connected);
    

}


function open_table()
{
    //get fucking url
    var fullurl = browser.runtime.getURL("/pages/links_view.html");
    //create new tab and get fucking promise
    var creating = browser.tabs.create({
        active: true,
        url: fullurl
    });
    
    console.log("open url with links table");
   //if promise done, do nothing
    creating.then(function (tab) {
        console.log("tab with links created");
       //browser.tabs.sendMessage(tab.id, {"message": "Hello!"});
    });
}

