
/*
function create_obj(keys, funcs)
{
    var result = {};
    for(var i =0; i < keys; i++) {
        result[keys] = funcs[i];
    }
    return result;
}




var Funcs = {
    "add-record": open_dialog,
    "show-links": open_table,
    "manage-tabs": open_manager,
};


    var Funcs = create_obj(
    ["add-record", "show-links", "manage-tabs"],
    [open_dialog, open_table, open_manager]
    );
    console.log("click listener " + JSON.stringify(funcs));
    */

    
var Funcs = {};
Funcs["add-record"] = open_dialog;
Funcs["show-links"] = open_table;
Funcs["manage-tabs"] = open_manager;
//Funcs["extract-file"] = extract_file;//test_script;







function set_click_listener()
{
    function click_listener(e)
    {
        var id = e.target.id;
        
        var fabric = Funcs[id];
        
        if (fabric) {
            fabric();
        }else  {
            browser.tabs.reload();
            window.close();
        }
        
    }

    document.addEventListener("click", click_listener);
}

set_click_listener();

/*
var post = new Postal({command:"init"});
post.max_times = 1;
post.response = {response: "Response from background script"};
post.wait();
*/
