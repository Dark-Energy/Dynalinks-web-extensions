//here was check if database real exists and correct

var my_select_form = 
{
    selected: '',
    
    get_element: function (id)
    {
        this.form = document.getElementById(id);
        this.after_create();
    },
    
    create: function (id, parent_id) {
        //crete input element and assign their id
        var form = document.createElement('select');
        form.id = id;
        //append to parent item
        var parent = document.getElementById(parent_id);
        parent.appendChild(form);
        
        this.form = form;
        this.after_create();
    },
    
    after_create: function ()
    {
        this.set_change_listener();
    },
    
    set_change_listener :function ()
    {
        var self = this;
        function onchange_callback() {
            self.selected = self.form.value;                
            if (self.onchange) {
                self.onchange(self.selected);
            }
        }
        this.form.addEventListener("change", onchange_callback);
    },
    
    
    set_options : function (list, selected)
    {
        this.options = list;
        this.selected = selected;
        
        var html = ''
        for(var i =0; i < list.length;i++) {
            var text = list[i];
            html += '<option';
            if (selected === text) {
                html += " selected ";
            }
            html += ">" + text + '</option>';
        }
        this.form.innerHTML = html;
    },
    
    add_option: function (item)
    {
        var index = this.options.indexOf(item);
        if (index < 0) {
            this.options.push(item)
            this.set_options(this.options, item);
        }
    },
    
    set_selected: function (selected) 
    {
        this.set_options(this.options, selected);
    },
    
    get_value : function ()
    {
        return this.selected;
    },
    
    try_load:function ()
    {
        var self = this;
        function fail() { console.log("fail get category list from dialog append record");} 
        
        function success (data) 
        {
            data = data.Dynalinks_Data;        
            if (!data) {
                console.log("Failed read data. Getting undefined object");
            }
            
            if (data.key_name !== "Dynalinks_Data") {
              fail();
            } else {
                var category_list = keys_to_array(data.names);
                self.set_options(category_list, '');
            }
        }
        
        chrome.storage.local.get("Dynalinks_Data").then (success, fail);
    },

}; 
           
//creating DOM element
my_select_form.create("select-category", "select-category-containter");
//attempt fill his with items from storage
my_select_form.try_load();

//set event listenter for onchange
my_select_form.onchange = function (value) {
    //console.log("new select value choosed", value);
    document.getElementById("category-input").value = value;
}
           

function error(e)
{
    console.log("error write to storage", e);
}

/* connection */


var port_from_dialog;


url_input = document.getElementById("url-input");
title_input =document.getElementById("title-input");

//open port and wait parent send url and title
var dialog_port = chrome.runtime.connect({name:"append_dialog"});

dialog_port.onMessage.addListener(function(m) {
    url_input.value = m.url;
    title_input.value = m.title;
    
});


category_port = chrome.runtime.connect({name:"append_dialog"});
category_port.onMessage.addListener(function (m) {
    console.log("getting category_list");
    category_port.postMessage("get", "category_list");
    category_port.onMessage.addListener( function (m) {
        console.log("catlist", JSON.stringify(m));
    });
});

//добавление новой категориии
document.getElementById("new_cat_button").onclick = function (event) 
{
    var name = document.getElementById("new_cat_text").value;
    my_select_form.add_option(name);
    
    set_connection(name);
}

function set_connection(name)
{
    console.log("trying communicate");
    dialog_port = chrome.runtime.connect({name:"proxy-data"});
    console.log(dialog_port);
    dialog_port.postMessage({"command" : "create_category", "category_name" : name});
}

