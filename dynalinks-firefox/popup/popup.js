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


