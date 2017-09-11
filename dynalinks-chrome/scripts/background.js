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
        var fullurl = chrome.runtime.getURL("/pages/dialog.html");
        //create new tab and get fucking promise
        var creating = chrome.tabs.create({
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
  console.log(p.name, p.name === 'append_dialog');
  port_from_dialog = p;
  //send fucking data
  port_from_dialog.postMessage(Dialog_Tab.info);
}




function open_dialog()
{
    //first query active tab, then load in, then load to she info
    var promise = chrome.tabs.query({active: true, currentWindow: true}); 
    promise.then( function (tabs) {
        Dialog_Tab.open(tabs[0].url, tabs[0].title);
    });
    
    //add listener to fucking onConnect and wait when created tab request data
    chrome.runtime.onConnect.addListener(connected);
    

}


function open_table()
{
    //get fucking url
    var fullurl = chrome.runtime.getURL("/pages/links_view.html");
    //create new tab and get fucking promise
    var creating = chrome.tabs.create({
        active: true,
        url: fullurl
    });
    
   //if promise done, do nothing
    creating.then(function (tab) {
        //console.log("iam createing, my id is ", tab.id);
       //chrome.tabs.sendMessage(tab.id, {"message": "Hello!"});
    });
}

