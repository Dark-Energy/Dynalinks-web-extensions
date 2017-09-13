function open_table()
{
    //get fucking url
    var fullurl = browser.runtime.getURL("/pages/links_view/links_view.html");
    //create new tab and get fucking promise
    var creating = browser.tabs.create({
        active: true,
        url: fullurl
    });
    
    console.log("open url with links table");
   //if promise done, do nothing
    creating.then(function (tab) {
        console.log("wait while tab awaike and send connect");
    });
}

