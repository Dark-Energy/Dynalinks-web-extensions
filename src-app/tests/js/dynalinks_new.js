//console.log("Hello World, i am Dynalinks.js!");

Dynalinks.Utils = {};

Dynalinks.Utils.create_id = function ()
{
	return Math.random().toString(36).substr(2, 9) + Date.now().toString();
}

Dynalinks.Utils.check_item = function (item)
{
	if (! item._id) {
		item._id = Dynalinks.Utils.create_id();
	}
}

Dynalinks.Utils.check_database = function (data)
{
	for(var cat in data) {
		arr = data[cat];
		for(var i =0; i < arr.length; i++) {
			Dynalinks.Utils.check_item(arr[i]);
		}
	}
}



/*

database scheme:
{
    database: {
        //dictionary of Category
        //Category is array of record
        key: [
        {
            href: string,
            text: string,
            tag: string,
            _id: string
        },
        ], 
    }
}


Dynalinks data

ACTION METHOD:
add_record_to_category
remove_by_id
remove_tag
remove_category
move_tag
add_category


names = dictionary of {hash: name}
categories = dictionary of {hash: Context}
category_list = array of {href: hash, text: name}
context = name;
current_page = array of record
current_category = category hash
current_page = this.context.pages[name]


class Context
{
	category_name: string,
	pages : dictionary of Array of Record,
    features: array,
	tags: array of String,
}
	

*/
function Dynalinks(data, lazy_parse)
{
    this.events = {};        
    
	this.database = data.database;
    
	//Dynalinks.Utils.check_database(data.database);
    
	this.names = data.names;
    this.features = data.features;
	this.categories = {};
	if (!lazy_parse) {
		this.parse_database();	
        //this.features = Dynalinks.Utils.create_features_first(this)
        //console.log(tmp);
        //var f = new Dynalinks.Features(tmp);
        //f.remove_feature('r318iuhsv1471073372661');
        //console.log(f);        
	}
    
}

Dynalinks.prototype.parse_database = function ()
{
	for (var catname in this.names) {
		if (Object.prototype.hasOwnProperty.call(this.names, catname)) {
			this.get_category_context(catname);
            
		}
	}
	this.category_list = dictionary_to_array(this.names, "href", "text");
	if (this.category_list.length > 0) {
		catname = this.category_list[0].href;
		this.set_category(catname);
	}
    
    this.create_index();
}


Dynalinks.prototype.create_index = function ()
{
    //create index
    this.index = {};
    this.index_list = [];

    var self = this;
    
    every_property(this.database, function (key) {
        var cat = self.database[key];
        cat.forEach( function (record) {
            self.index[record.href] = record._id
        });
    });

    console.log("index is ", this.index);
    
    var methods = {
        "add record": function (record) 
        {
            this.index[record.href] = record._id;
        },
        "remove record": function (record)
        {
            /*var i = self.index.indexOf(record._id);
            if (i > -1) {
                self.index.splice(i, 1);
            }*/
            console.log("remove record", record.href);
            self.index[record.href] = undefined;
            delete self.index[record.href];
        },
        "remove_category": function (category)
        {
            if (!category) return;
            for(var i = 0; i < category.length; i++) {
                methods["remove record"](category[i]);
            }
        },
        "remove_tag": function (records)
        {
            console.log("remove tag");
            for(var i=0; i < records.length; i++)
            {
                methods["remove record"](records[i]);
            }
        }
    };


    this.$on("change", function (m, record) {
        var f = methods[m];
        var args = Array.prototype.slice.call(arguments, 1);
        console.log("change database, method is " + m);
        if (f) {
            f.apply(self, args);
        }
    });
    
}


Dynalinks.prototype.$on = function (name, func)
{
    if (!this.events[name]) {
        this.events[name] = [];
    }
    var arr = this.events[name];
    arr.push({listener: func});
}

Dynalinks.prototype.$emit = function (name, name2)
{
    var arr = this.events[name];
    if (arr === undefined)  {
        this.events[name] = [];
        return;
    }
    //remove name of events
    var args = Array.prototype.slice.call(arguments, 1);
    for(var i =0; i < arr.length; i++) {
        arr[i].listener.apply(this, args);
    }
}


Dynalinks.prototype.create_url = function(category, tag)
{
	var a = Array.prototype.slice.call(arguments, 0);
	a.unshift("view");
	return create_url.apply(this, a);
}

/*
features = dictionary of Array of Record
{
    '_id': record._id
    'text': text for features or record.text
}
*/
Dynalinks.Features = function (features)
{
    this.features = features;
    this.build_hash();
}

Dynalinks.Features.prototype.build_hash = function ()
{
    this.hash = {};
    var self = this;
    every_property(this.features, function (key) {
        var records = self.features[key];
        every_index(records, function (index) {
            var record = records[index];
            self.hash[record._id] = key;
        });
   });
}

Dynalinks.Features.prototype.remove_feature = function (id)
{
    var category = this.hash[id];
    if (category) {
        remove_by_field_value(this.features[category], '_id', id);
    }
    delete this.hash[id];
}

Dynalinks.Features.prototype.add_feature = function (id, category, text)
{
    this.hash[id] = category;
    if (!this.features[category]) {
        this.features[category] = [];
    }
    this.features[category].push( {'_id':_id, 'text':text});
}



/*
	CONTEXT
	
class Context
{
	category_name: string,
	pages : dictionary of Array of Record,
	features : array,
	tags: array oi String,
}
	
*/
Dynalinks.Context = function (data, category)
{
	this.category_name = category;
	this.pages = {};
	this.features = this.features[category];
	this.tags = new Array();
	this.hash = {};
	
	if (!data) {
		return;
	}
	
	var item, tag;
	for(var i = 0; i < data.length; i++)
	{
		item = data[i];
		//#check integrity
		//Dynalinks.Utils.check_item(item);
		this.hash[item._id] = item;
		
		tag = item["tag"];
		
		if (!this.pages[tag])
		{
			this.pages[tag] = new Array();
			this.tags.push(tag);
		}
		this.pages[tag].push(item);
	}
}


Dynalinks.Context.prototype.move_item = function (item, new_tag)
{
	var page = this.get_page(item.tag);
	var new_page = this.get_page(new_tag);
	new_page.push(item);
	item.tag = new_tag;
	remove_by_field_value(page, '_id', item._id);
}





//create new page if doen't exists
Dynalinks.Context.prototype.get_page = function (tag)
{
	var page = this.pages[tag];
	if (!page) {
		this.pages[tag] = page = new Array();
		this.tags.push(tag);
	}
	return page;
} 

Dynalinks.Context.prototype.remove_page = function (tag)
{
	//remove page from page list
	var page = this.pages[tag];
	delete this.pages[tag];
	if (!page) return;
	
	//remove items from hash
	for(var i = 0; i < page.length; i++) {
		delete this.hash[page._id];
	}
	
	//remove page tag from tag list
	remove_by_value(this.tags, tag);

}

//1) add to page; 2) add to favorites, if marked; 3) add to hash
Dynalinks.Context.prototype.add_item = function (item)
{
	Dynalinks.Utils.check_item(item);
	
	if (this.hash[item._id]) {
		return;
	}
	var page = this.get_page(item.tag);
	page.push(item);
	this.hash[item._id] = item;
}

Dynalinks.Context.prototype.remove_item = function (item)
{
	//remove from hash
	if (!this.hash[item._id]){
		return;
	}
	
	
	//remove from page 
	var page = this.get_page(item.tag);
	remove_by_field_value(page, '_id', item._id);
	
	//remove from hash
	delete this.hash[item._id];
}

/*
CONTEXT MANAGEMENT
*/
Dynalinks.prototype.create_context = function (category)
{
	var links = this.database[category];
	if (!links) {
		console.log("error create context! Not found category ", category);
		return null;
	}
	var context = new Dynalinks.Context(links, category);	
	
	return context;
}

Dynalinks.prototype.get_category_context = function(category, force)
{
	var context = this.categories[category];
	if (!context || force) {
		this.categories[category] = context = this.create_context(category);
	}
	return context;
}

Dynalinks.prototype.get_active_context = function ()
{
	return this.get_category_context(this.current_category);
}

function check_key(obj, key)
{
	for(var k in obj) {
		if (k === key) {
			return true;
		}
	}
	return false;
}

Dynalinks.prototype.get_page_template = function ()
{
	return this.templates[this.display_mode];
}



Dynalinks.prototype.get_first_page_from_category = function (category)
{
	var cat = this.get_category_context(category);
	return cat.tags[0];
}

Dynalinks.prototype.get_page_from_category = function (category, page)
{
	var cat = this.get_category_context(category);
	return cat.pages[page];
}

Dynalinks.prototype.set_category = function (name)
{
	var context = this.get_category_context(name);
	this.context = context;
	this.current_category = name;	
}

Dynalinks.prototype.set_page = function (name)
{
	this.context = this.get_active_context();
	//empty data
	if (!this.context) {
		return;
	}
	if (!name || !this.context.pages[name]) {
		var old_name = name;
		name = get_first_key_secure(this.context.pages);
		//console.log("page " + old_name + " not found, show page "+name);
		if (!name) {
			console.log("category is empty, there are not page for show they");
		}
	}
	this.context.current_tag = name;
	this.current_page = this.context.pages[name];
}


Dynalinks.prototype.add_features = function(category_name, record, title)
{
    if (record === undefined) 
        return;
    
    if (this.features[category_name] === undefined) {
        this.features[category_name] = [];
    }
    var category = this.features[category_name];
    category.push ( {
        _id: generateUUID(),
        link: record._id,
        href: record.href,
        text: title || record.text 
    });
}


Dynalinks.prototype.add_features.remove_features_by_link = function (category, id)
{
    var cat = this.features[cat];
    if (cat === undefined) return;
    remove_by_field_value(cat, 'link', id);
}


//category should exits
Dynalinks.prototype.valid_record = function(record, fields)
{
    if (record.href.trim() === '')
        return "field href is empty";
    if (record.text.trim() === '')
        return "field text is empty"
    if (record.tag.trim() === '')
        return "field tag is empty";
    return null;
}

Dynalinks.prototype.add_link_to_category = 
Dynalinks.prototype.add_record_to_category = function (item, category)
{
    var response = 
    {
        valid: false,
    };
	//first add to database
	if (!this.database[category]) {
		console.log("Error! This category doesn't exits!", category);
        var r = this.add_category(category);
        if (!r.valid) {
            response.reason = "Category "+category+" non exists. Trying create and fail, because of " + r.reason;
            return response;            
        }
	}
    
    var valid = this.valid_record(item)
    if (valid !== null) {
        response.reason = 'record is not valid, somewhat field is empty.' + valid;
        return response;
    }
	/*
	//we must push the item in context and database
	//first push it to the context
	//second push it to the database
	*/
	this.database[category].push(item);	
	var context = this.get_category_context(category);
	context.add_item(item);
    
    this.$emit("change", "add record", item);
    
    response.valid=true;
    return response;
}


Dynalinks.prototype.remove_by_id = function (id)
{
	var item = remove_by_field_value(this.database[this.context.category_name], '_id', id);
	this.context.remove_item(item);	
    this.$emit("change", "remove_item", item);
    
}

Dynalinks.prototype.add_category = function (name)
{
    var response = 
    {
        valid: false
    };
    name.trim();
	if (this.database[name]) {
		console.log("Категория с таким названием уже существует!");
        response.reason = "existed";
		return response;
	}
	if (!name)  {
		console.error("Имя новой категории не задано!");
        response.reason = "fail";
		return response;
	}
	this.database[name] = new Array();
	this.names[name] = name;
	this.get_category_context(name, true);
	
	this.category_list.push({href:name, text: name});
    
    this.$emit("change", "add_category");
    
    response.valid = true;
    return response;
}

Dynalinks.prototype.remove_tag = function (category, tag)
{
    if (category === undefined) {
        console.log("Uhhh! remove tag from category, which undefined!");
    }
	remove_all_by_field_value(this.database[category], "tag", tag);
	
	var context = this.get_category_context(category);
    var records = context.pages[tag];    
	context.remove_page(tag);
    
    this.$emit("change", "remove_tag", records);
}

Dynalinks.prototype.move_tag = function (tag, old_category, new_category)
{
	if (old_category === new_category) {
		return;
	}
	//1. update database
	if (!this.names[new_category]) {
		this.add_category(new_category);
	}
	var src = this.database[old_category];
	var dest = this.database[new_category];
	var i = 0;
	while( i < src.length) {
		if (src[i].tag === tag) {
			dest.push(src[i]);
			src.splice(i, 1);
		}
		else {
			i++;
		}
	}
	//2. update viewmodel, we just destroy existed contexts and create they again, too poor
	var old_context = this.get_category_context(old_category, true);	
	var new_context = this.get_category_context(new_category, true);
	//this.context = new_context;
	
	//if this tag exists, then need join it with moving tag
	//logic behind removing and inserting too complexity
	//new_context.insert_page(tag, old_context.pages[tag]);
	//old_context.remove_page(tag);
	
    this.$emit("change", "move_tag");
}

Dynalinks.prototype.toJSON = function ()
{
	var data = {
        'database': this.database, 
        'names': this.names,
        'features': this.features,
    };
    return data;
}


Dynalinks.prototype.get_from_active_context = function(_id)
{
	return find_by_field_value(this.database[this.context.category_name], '_id', _id);
}

//TODO: move special field to inner object 'special'
//or move user fields to suboject 'user_data'?
//or create 'favorites' struct for each category
//this need restruct database
Dynalinks.prototype.update_item = function(old, new_value)
{
    
	//check tag changes
	if (old.tag !== new_value.tag || new_value.new_tag) {
		this.context.move_item(old, new_value.new_tag || new_value.tag);
	}
    
    
	for(var key in new_value) {
		if (Object.prototype.hasOwnProperty.call(old, key) &&
			key !== 'new_tag' && key !== 'tag' )
		{
			old[key] = new_value[key];
		}
	}

    this.$emit("change", "update_record");
	return {"category": this.context.category_name, "tag": old.tag};
	
}
Dynalinks.prototype.remove_category = function (name)
{
    var category = this.database[name]
	if (category) {
        this.database[name] = undefined;
		delete this.database[name];
	}
	if (this.categories[name]) {
        this.categories[name] = undefined;
		delete this.categories[name];
	}
	if (this.names[name]) {
        this.names[name] = undefined;
		delete this.names[name];
	}
	remove_by_field_value(this.category_list, 'href', name);
    this.context = undefined;
    this.current_page = [];
    this.current_category = '';
    this.$emit("change", "remove_category", category);    
}

/*
return Array of {item: record, category: name of category}
*/
Dynalinks.prototype.search = function (fields, value)
{
	value = value.toUpperCase();
	var cat;
	var result = new Array;
	var name;
	for(var i=0; i < this.category_list.length; i++) {
		name = this.category_list[i].href;
		cat = this.database[name];
		cat.forEach( function (item) {
			fields.every( function (field) { 
				var tmp = item[field].toUpperCase();
				if (tmp.search(value) !== -1) {
					result.push( {"item": item, "category": name});
					return false;
				}
				return true;
			});
		});
	}
	return result;
}


