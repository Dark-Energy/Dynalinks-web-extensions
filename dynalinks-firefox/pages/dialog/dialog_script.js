﻿'use strict';


console.log("dialog script opened");


/*
    1. create port
    2. post message anybody who are awaiting
    3. wait message
*/


var we_got_info = false;

var sender = new Sender({command: "get_tabinfo"});
sender.action = function (m) 
{
    console.log("get response from sender");
    url_input.value = m.url;
    title_input.value = m.title;
    we_got_info=true;
}
sender.send();





//get category list
//this port using for connection with dynalinks_proxy only

var category_port;

function trying_get_category_list()
{
    console.log("dialog create connect with name 'request to proxy'");    
    var port = new Portman("request_to_proxy", true);
    //console.log("post message <get catetory list>", );
    port.post({command: "get", info: "category_list"});
    port.process_message = function (m) {
        //console.log("get response");        
       //get cat list
       if (m.command === 'set' && m.info === 'category_list')
       {
            var catlist= m.givin_data;
            my_select_form.set_options(catlist, catlist[0]);
           
            //get tag list
            port.post({command: "get", info: "tag_list", "category": catlist[0]});
            port.process_message = function (m) {
                if (m.command === 'set' && m.info === 'tag_list')
                {
                    console.log("tag list givin!");
                    select_tag.set_options(m.givin, m.givin[0]);
                }
            }
       }
        
    }
}


/*
function trying_get_category_list()
{
    category_port = browser.runtime.connect({name:"request_to_proxy"});
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
*/

trying_get_category_list();

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
    console.log("request to creating new category" );
    category_port.postMessage({"command" : "create_category", "category_name" : name});
    category_port.onMessage.addListener(function (m) {
        console.log("response on request category create", JSON.stringify(m));
        if (m.command === "create_category" && m.name ===  name && m.result)
        {
            //console.log("admiration creating new category");
            my_select_form.add_option(name);
            select_tag.clear();
            print_message_div("create new category  <b>"+name+"</b> is granted!");
        } else 
        {
            print_message_div("create new category  <b>"+name+"</b> is rejected!");
        }
    })
}




var message_div = document.getElementById("message-div");

function print_message_div(text)
{
    message_div.innerHTML = text;
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
 
    //console.log("my record ", JSON.stringify(record));
    category_port = browser.runtime.connect({name:"request_to_proxy"});
    category_port.postMessage({"command" : "create_record", "record" : record});
    category_port.onMessage.addListener(function (m) {
        console.log("add message on append record");
        if (m.command === "create_record" && m.result){
           console.log("record accepted");
           print_message_div("record accepted");
        }
        });
}


ok_button.addEventListener("click", function (event) {
    go_record();
}, false);


