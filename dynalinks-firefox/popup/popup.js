
function click_listener(e)
{
    var id = e.target.id;
    if (id === 'add-record') {
       open_dialog();
    } else if (id === 'show-links') {
        console.log("open-view");
        open_table();
    } else {
            console.log("clicking in empty place");
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