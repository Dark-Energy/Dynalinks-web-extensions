



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



function copy_keys_if_defined(src, dest, keys)
{
    for(var i = 0;i < keys.length; i++) {
        var key = keys[i];
        if (src[key] !== undefined) {
            dest[key] = src[key];
        }
    }
}



function filter_list(list, filter)
{
    var result = [];
    for(var i = 0; i < list.length; i++) {
        var elem = list[i];
        if (filter(elem)) {
            result.push(elem);
        }
    }
    return result;
}



//return these elements from list, which value is in object 
function filter_list_by_dict(list, dict, key)
{
    var r = filter_list(list, function (elem) {
        var value = elem[key];
        return (dict[value] !== undefined);
    });
    return r;
}


function check_every_property(obj, func)
{
    if (!callback) {
        console.log("callback given every_property is undefined or null!")
        return;
    }
    for(var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (!callback(key)) {
                return false;
            }
        }
    }
    return true;
}