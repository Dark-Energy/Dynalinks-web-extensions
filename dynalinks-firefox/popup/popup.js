'use strict';


function click_listener(e)
{
    var id = e.target.id;
    if (id === 'add-record') {
       open_append_record_dialog();
    } else if (id === 'show-links') {
        open_table();
    } else {
        browser.tabs.reload();
        window.close();
    }
}


function Init_Popup_Listener()
{
    document.addEventListener("click", click_listener);
}

Init_Popup_Listener();

var post = new Postal({command:"init"});
post.max_times = 1;
post.response = {response: "Response from background script"};
post.wait();



/*
function handleMessage(command, sender, sendResponse) {
    //console.log("Message from nowhere", JSON.stringify(request));
    if (command.command !== 'init') {
        console.log("message from sender", sender);
    } else 
    {
        sendResponse({response: "Response from background script"});
        browser.runtime.onMessage.removeListener(handleMessage);
        console.log("this removed listener response to message", request);
    }
}

browser.runtime.onMessage.addListener(handleMessage);

*/