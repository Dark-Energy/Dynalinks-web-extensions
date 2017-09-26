
/*
Utils functions

*/




var Event_Mixin = {
    _get_event: function (name) {
        if (!this.events[name]) {
            this.events[name] = [];
        }
        return this.events[name];
    },
    "$on" : function (name, func)
    {
        var arr = this._get_event(name);
        arr.push({listener: func});
    },
    
    "$once": function (name, func) 
    {
        var arr = this._get_event(name);
        arr.push({listener: func, once: true});
        
    },

    "$emit" : function (name)
    {
        var arr = this._get_event(name);
        if (arr.length === 0) {
            return;
        }
        var args = Array.prototype.slice.call(arguments, 1);
        for(var i =0; i < arr.length; i++) {
            arr[i].listener.apply(this, args);
            if (arr[i].once) {
                arr.splice(i, 1);
            }
        }
    },

    "events" : {},
};

//Event_Mixin.$on("test", () => console.log("test") );
//Event_Mixin.$emit("test");




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


function dictionary_to_array(obj, key_field_name, value_field_name)
{
	key_field_name = key_field_name || "key";
    value_field_name = value_field_name || "value";

	var result = new Array();

    every_property(obj, function (key) {
        var elem = {};
        elem[key_field_name] = key;
        elem[value_field_name] = obj[key];
		result.push( elem );
    });

	return result;
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
    Object.prototype.assign = copy_object;
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


    // http://www.broofa.com/Tools/Math.uuid.htm
var uuid_utils ={};
uuid_utils.chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split( '' );
uuid_utils.uuid = new Array( 36 );
uuid_utils.rnd = 0;


function generateUUID ()  
{
    var r;
    for ( var i = 0; i < 36; i ++ ) {
        if ( i === 8 || i === 13 || i === 18 || i === 23 ) {
            uuid_utils.uuid[ i ] = '-';
        } else if ( i === 14 ) {
            uuid_utils.uuid[ i ] = '4';
        } else {
            if ( uuid_utils.rnd <= 0x02 ) {
                uuid_utils.rnd = 0x2000000 + ( Math.random() * 0x1000000 ) | 0;
            }
            r = uuid_utils.rnd & 0xf;
            uuid_utils.rnd = uuid_utils.rnd >> 4;
            uuid_utils.uuid[ i ] = uuid_utils.chars[ ( i === 19 ) ? ( r & 0x3 ) | 0x8 : r ];
        }
    }
    return uuid_utils.uuid.join( '' );
} 



function color_console(text, style)
{
    var style_table = 
    {
        "red": '{background-color: #FF0000, text-color: #FFFFFF}',
        "green": '{background-color: #00FF00, text-color: #FFFFFF}',
        "blue": '{background-color: #0000FF, text-color: #FFFF00}',
    };
    var color = style_table[style];
    console.log("%c"+text, color)
}



function add_unique_to_array(arr, subj, key)
{
    for(var i=0; i < arr.length; i++) {
        if (!find_by_field_value(arr, key, subj[key])) {
            arr.push(subj);
            return;
        }
    }
    
}