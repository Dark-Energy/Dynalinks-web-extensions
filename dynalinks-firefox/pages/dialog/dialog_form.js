
//create component
var my_select_form = new My_Select_Form();
//mounted component
my_select_form.create("select-category", "select-category-containter");

//select tag craete and mounted
var select_tag = new My_Select_Form();
select_tag.create("select-tag-element", "select-tag"); 
//input for new tag
var new_tag_text = document.getElementById("new_tag_input");


var url_input = document.getElementById("url-input");
var title_input = document.getElementById("title-input");

var new_tag_input = document.getElementById("new_tag_text");
var new_tag_button = document.getElementById("new_tag_button");


var ok_button = document.getElementById("ok_button");



var message_div = document.getElementById("message-div");

function print_message_div(text)
{
    message_div.innerHTML = text;
}
