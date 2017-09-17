'use strict';


if (chrome.extension && chrome.extension.getBackgroundPage)
{
    chrome.extension.getBackgroundPage().console.log('init dialog script');
}

//console.log("dialog script opened");


/*
    1. create port
    2. post message anybody who are awaiting
    3. wait message
*/


var we_got_info = false;

function set_data(url, title)
{
    url_input.value = url;
    title_input.value = title;
    we_got_info=true;
}


var sender = new Sender({command: "get_tabinfo"});
sender.action = function (m) 
{
    if (m === undefined) {
        console.log("Sender Message is failed because of human stupidity");
        return;
    }
    set_data(m.url, m.title);
}
sender.send();


var ms = new MyStorage();
ms.$on_read = function (data)
{
    var obj = data['dlink-temp-tabinfo'];
    set_data(obj.url, obj.title);
    console.log("read storage", JSON.stringify(data));
}
ms.read('dlink-temp-tabinfo');





//get category list
//this port using for connection with dynalinks_proxy only
var category_port = new Portman("request_to_proxy", true);

var dialog_switcher;

function trying_get_category_list(port) {
    
    //set event listenter for onchange
    my_select_form.onchange = function (value) {
        print_message_div("you choose new category <b>"+value+"</b>");
        switcher.port.post({command: "get", info: "tag_list", "category": value});
    }
    
    
    
    var switcher = new PortSwitcher(port);
    switcher.add_command('set', 'tag_list', function (m) {
        select_tag.set_options(m.givin, m.givin[0]);
        console.log("tag list", JSON.stringify(m));
    });
    switcher.add_command("set", 'category_list', function (m) {
        var catlist= m.givin_data;
        my_select_form.set_options(catlist, catlist[0]);
       
        //get tag list
        this.port.post({command: "get", info: "tag_list", "category": catlist[0]});
            
    });
    port.post({command: "get", info: "category_list"});
    
    dialog_switcher = switcher;
}


trying_get_category_list(category_port);



function add_new_category(event)
{
    var name = document.getElementById("new_cat_text").value;
    //validate
    if (!name.trim()) {
        console.log("category name is empty!");

        return;
    }
   
    give_request_to_create_category(name);
}

//добавление новой категориии
document.getElementById("new_cat_button").addEventListener("click", add_new_category, false);


function give_request_to_create_category(name)
{
    //console.log("request to creating new category" );
    category_port.post({"command" : "create", "info": "category", "category_name" : name});
    category_port.process_message = function (m) {
        //console.log("response on request category create", JSON.stringify(m));
        if (m.result)
        {
            //console.log("admiration creating new category", JSON.stringify(m));
            my_select_form.add_option(name);
            select_tag.clear();
            print_message_div("create new category  <b>"+name+"</b> is granted!");
        } else 
        {
            print_message_div("create new category  <b>"+name+"</b> is rejected!");
        }
    }
}






function validate_record(record)
{
    
    var valid = record.url.trim() !== '' 
    && record.title.trim() !== ''
    && record.category.trim() !== ''
    && record.tag !== '';
    
    if (!valid ) {
        message_div.innerHTML = "This is error in one of files! Cannot save!"
        return false;
    }
    //console.log("valid record", JSON.stringify(record));
    return true;
}


function go_record()
{
    var record = 
    {
        "url": url_input.value,
        "title": title_input.value,
        "category": my_select_form.selected,
        "tag": select_tag.selected || new_tag_input.value,
    }

    if (!validate_record(record)) {
        return;
    }
    console.log("record seemed valid");
 
    category_port = new Portman("request_to_proxy", true);
    category_port.process_message = function (m) {
        print_message_div("adding message on append record...");
        if (m.command === "create" && m.info === "record" && m.result){
           print_message_div("record accepted");
        }
    }
    category_port.post({"command" : "create", "info": "record", "record" : record});
}


ok_button.addEventListener("click", function (event) {
    go_record();
}, false);



