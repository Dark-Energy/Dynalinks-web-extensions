/*
Utils functions

*/


function keys_to_array(obj)
{
    var arr = new Array();
    for(var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            arr.push(key);
        }
    }
    return arr;
}

function values_to_array(obj)
{
    var arr = [];
    for(var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
                arr.push(obj[key]);
        }
    }
    return arr;
} 

function get_first_key(obj)
{
	for(var key in obj) {
		if (obj.hasOwnProperty(key)) {
			return key;
		}
	}
}

function get_first_key_secure(obj)
{
	for(var key in obj) {
		if (obj.hasOwnProperty(key)) {
			//delete operator doesnt delete key from object		
			if (typeof obj[key] !== 'undefined') {
				return key;
			}
		}
	}
}

function find_all_by_field_value(arr, field, value)
{
	var result = new Array();
	for(var i = 0; i < arr.length; i++){
		var tg = arr[i][field];
		if (value === tg){
			result.push(arr[i]);
		}
	}
	return result;
}


function remove_by_value(arr, value)
{
	var i = 0;
	while (i < arr.length) {
		if (arr[i] === value) {
			arr.splice(i, 1);
		} else {
			i++;
		}
	}
}

function find_by_field_value(arr, field, value)
{
	for(var i = 0; i < arr.length; i++)	{
		var tg = arr[i][field];
		if (value === tg){
			return arr[i];
		}
	}
	return null;
}


function find_index_by_field_value(arr, field, value)
{
	for(var i = 0; i < arr.length; i++)	{
		var tg = arr[i][field];
		if (value === tg){
			return i;
		}
	}
	return -1;
}


function remove_by_field_value(arr, field, value)
{
	for(var i = 0; i < arr.length; i++)	{
		var tg = arr[i][field];
		if (value === tg){
			var r = arr[i];
			arr.splice(i, 1);
			return r;
		}
	}
	return null;
}


function remove_all_by_field_value(arr, field, value)
{
	var i = 0; 
	while (i < arr.length) {
		var tg = arr[i][field];
		if (value === tg){
			arr.splice(i, 1);
		}
		else {
			i++;
		}
	}
	return null;
}


function dictionary_to_array(shit, key_field_name, value_field_name)
{
	if (!key_field_name) {
		key_field_name = "key";
	}
	if (!value_field_name) {
		value_field_name = "value";
	}
	var r = new Array();
	var item = {};
	for(var k in shit) {
		if (shit.hasOwnProperty(k)) {
			item = {};
			item[key_field_name] = k;
			item[value_field_name] = shit[k];
			r.push( item );
		}
	}
	return r;
}

function create_url()
{
	var r = "";
	for(var i= 0; i < arguments.length; i++) {
		if (typeof arguments[i] !== 'undefined') {
			if (i > 0) {
				r += "/";
			}
			r += encodeURIComponent(arguments[i]);
		}
	}
	return r;
}


function trim_space(s)
{
    return s.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}

if (!String.prototype.trim) {
  (function() {
    // remove BOM and spaces
    String.prototype.trim = function() {
      return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
  })();
}

function  copy_object (dest, source)
{
	for(var key in source) {
		if (Object.prototype.hasOwnProperty.call(source, key)) {
			dest[key] = source[key];
		}
	}
}


function create_clone_object  (source)
{
	var obj = {};
	copy_object(obj, source);
	return obj;
}


function clone_fields(src, fields)
{
	var obj = {};
	for(var i = 0; i < fields.length; i++) {
		var key = fields[i];
		obj[key] = src[key];
	}
	return obj;
}


function every_property(obj, callback) 
{
    if (!callback) {
        console.log("callback given every_property is undefined or null!")
        return;
    }
    for(var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            callback(key);
        }
    }
}

function every_index(arr, callback) 
{
    if (!callback) {
        return;
    }
    for(var i = 0; i < arr.length; i++) {
        callback(i);
    }
}

function html_clear(text)
{
    var re = /(\<\/?b\>|\<\/?i\>|\<\/?c\>|\<\/?u\>|\<\/?code\>|\<\/?pre\>|\<\/?br\>)/i
    
    var re2 = /<\/?[\s\S]+?>/iu
    
   
    return text.search(re2);
}

/*
console.log(html_clear("asdf") === -1);
console.log(html_clear("<script>") === -1);
console.log(html_clear("</script>") === -1);
console.log(html_clear("asdf <b> asdfsdf </b> asdfds"));

*/


if (!Object.assign) {
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(target, firstSource) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
      }

      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) {
          continue;
        }

        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    }
  });
} 



function My_Select_Form()
{
    this.selected = '';
    this.options = [];
}

Object.assign(My_Select_Form.prototype, {
    constructor: My_Select_Form,
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
    clear: function ()
    {
        this.selected = '';
        this.options = [];
        
        this.form.innerHTML = '';
        /*while (this.form.firstChild) {
            this.form.removeChild(myNode.firstChild);
        }*/
        
    }
}); 
