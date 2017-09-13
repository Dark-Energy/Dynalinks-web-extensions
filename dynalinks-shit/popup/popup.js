


function click_listener(e)
{
    var id = e.target.id;
    if (id === 'add-record') {
        console.log("open dialog");
       open_append_record_dialog();
    } else if (id === 'show-links') {
        console.log("open-view");
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

function handleMessage(request, sender, sendResponse) {
  console.log("Message from init", JSON.stringify(request));
  sendResponse({response: "Response from background script"});
}

browser.runtime.onMessage.addListener(handleMessage);