
function set_click_listener()
{

    function click_listener(e)
    {
        var id = e.target.id;
        
        var command = Popup_Controller.commands[id];
        
        if (command) {
            Popup_Controller.sender.message.command = command;
            //console.log("we send a message", JSON.stringify(Popup_Controller.sender.message));
            Popup_Controller.sender.send();
        }else  {
            window.close();
        }
        
    }
    
    
    document.addEventListener("click", click_listener);
}

set_click_listener();

var Popup_Controller;

if (Popup_Controller === undefined) 
{
    Popup_Controller = {};
    Popup_Controller.sender = new Sender({address:'view-controller'});
    Popup_Controller.commands = {
        "add-record": "open_dialog",
        "show-links": "open_table",
        "manage-tabs": "open_manager"
    };
}


/*
var post = new Postal({command:"init"});
post.max_times = 1;
post.response = {response: "Response from background script"};
post.wait();
*/
