//here was check if database real exists and correct



//creating DOM element           
var my_select_form = new My_Select_Form();
my_select_form.create("select-category", "select-category-containter");


//set event listenter for onchange
my_select_form.onchange = function (value) {
    //console.log("new select value choosed", value);
    document.getElementById("category-input").value = value;
}
           

var select_tag = new My_Select_Form();
select_tag.create("select-tag-element", "select-tag"); 
           

function error(e)
{
    console.log("error write to storage", e);
}

/* connection */

url_input = document.getElementById("url-input");
title_input =document.getElementById("title-input");

new_tag_input = document.getElementById("new_tag_text");
new_tag_button = document.getElementById("new_tag_button");

//get url, title from background
function trying_get_url_and_title()
{
    var dialog_port;
    
    //open port and wait parent send url and title
    dialog_port = browser.runtime.connect({name:"append_dialog"});
    dialog_port.postMessage({command: "get", info: "tab_info"});
    dialog_port.onMessage.addListener(function(m) {
        url_input.value = m.url;
        title_input.value = m.title;
        dialog_port = undefined;
    });
}

trying_get_url_and_title();

//get category list

var category_port;

function trying_get_category_list()
{
    //console.log("dialog create connect with name 'request to proxy'");
    category_port = browser.runtime.connect({name:"request_to_proxy"});
    console.log("dialog request categories list and wait response");
    category_port.postMessage({command: "get", info: "category_list"});
    category_port.onMessage.addListener( function (m) {
       if (m.command === 'get' && m.info === 'category_list')
       {
            var catlist= m.givin_data;
            my_select_form.set_options(catlist, catlist[0]);
            
            //console.log("On Message: me get catlist!", JSON.stringify(m));
            
            category_port.postMessage({command: "get", info: "tag_list", "category": catlist[0]});
            category_port.onMessage.addListener( function (m) {
                if (m.command === 'get' && m.info === 'tag_list')
                {
                    console.log("tag list givin!");
                    select_tag.set_options(m.givin, m.givin[0]);
                }
            });
       }
    });
}

trying_get_category_list();

//добавление новой категориии
document.getElementById("new_cat_button").onclick = function (event) 
{
    var name = document.getElementById("new_cat_text").value;
    if (!name.trim()) {
        return;
    }
    my_select_form.add_option(name);
    
    set_connection(name);
}

var message_div = document.getElementById("message-div");

function print_message_div(text)
{
    message_div.innerHTML = text;
}

function set_connection(name)
{
    console.log("request to creating new category" );
    category_port.postMessage({"command" : "create_category", "category_name" : name});
    category_port.onMessage.addListener(function (m) {
        if (m.command === "create_category" && m.name ===  name && m.response === true)
        {
            console.log("admiration creating new category");
            print_message_div("admiration creating new category")
        } else 
        {
            console.log("else other message");
        }
    })
}


function go_record()
{
    var url = url_input.value;
    var title = title_input.value;
    
    
    //validate
    var valid = 
        url.trim()  &&
        title.trim()  &&
        my_select_form.selected.trim()  &&
        select_tag.selected;
        
    if (!valid ) {
        message_div.innerHTML = "This is error in one of files! Cannot save!"
        return;
    }
    
    console.log("record seemed valid");
 
    var record = 
    {
        "url": url,
        "title": title,
        "category": my_select_form.selected,
        "tag": select_tag.selected,
    }
    //console.log("my record ", JSON.stringify(record));
    category_port = browser.runtime.connect({name:"request_to_proxy"});
    category_port.postMessage({"command" : "create_record", "record" : record});
    category_port.onMessage.addListener(function (m) {
        console.log("add message on append record");
        if (m.command === "create_record") {
            if (m.result === "yes"){
                console.log("record accepted");
                print_message_div("record accepted");
            }
        }
        
        });
}

button_ok = document.getElementById("ok_button");
button_ok.addEventListener("click", function (event) {
    go_record();
}, false);