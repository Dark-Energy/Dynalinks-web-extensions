
/*
APPLICATION
*/


var mr;

function Application()
{

}

Application.prototype.create_database = function(dynalinks)
{
    if (!dynalinks) {
        console.error("Happened something horroribie! Dyanlinks database, getting to application is empty!");
        return;
    }
    console.log("Application create database...");
	this.database = dynalinks.database;
	this.dynalinks = dynalinks;
	this.get_database_name();    
	
	var self = this;
    if (this.initialize()) {
        this.initialize();
	}
}

Application.prototype.remove_item = function(id)
{
	var self = this;
	var params = 
	{
		'type': 'label', 
		value: 'Правда удалить?', 
		handler: function (value) 
		{
			self.dynalinks.remove_by_id(id);
		}
	};
	var form = new PopupForm(params);
	form.show();
}

Application.prototype.move_tag = function ()
{
	var params = {}
	params.title = "Перенести страницу в другую категорию";
	params.type = "custom";
	params.dict = this.dynalinks.names;
	params.fields = [
		{"type": "select", 
		"dict":this.dynalinks.names,
		"data-value": "category"
		},
		{"type":"text",
		"data-value": "new_category"
		}
	];
	var self = this;
	params.handler = function (value) {
		var tag = self.dynalinks.context.current_tag;
		var source_category = self.dynalinks.context.category_name;
		var new_category = value.new_category || value.category;
		self.dynalinks.move_tag(
			tag, 
			source_category, 
			new_category);
		//3. reshow page
		mr.navigate( self.dynalinks.create_url(new_category,tag), true);

	}
	var form = new PopupForm(params);
	form.show();
}

//show form and add link to database
Application.prototype.add_item = function ()
{
}


Application.prototype.edit_item = function (id)
{
	var item = this.dynalinks.get_from_active_context(id);
	var params = {
		'type': 'custom'
	};
	
	//create edit form
	var foo = document.createElement("div");
	var context = {};
	context.tags = this.dynalinks.context.tags;
	context.item = item;
	ko.renderTemplate("edit-item-template", context, {}, foo);
	params.form = foo;	

	var self = this;
	params.handler = function (value) 
	{
		var result = self.dynalinks.update_item(item, value);
		mr.navigate(self.dynalinks.create_url(result.category, result.tag), true);			
	}
	var form = new PopupForm(params);
	form.show();
	
}

Application.prototype.turn_edit = function ()
{
	if (this.dynalinks.display.mode === "page_view") {
		this.dynalinks.display.mode = "page_edit";
	}
	else {
		this.dynalinks.display.mode = "page_view";
	}
	this.dynalinks.show_page(this.dynalinks.context.current_tag);
}

Application.prototype.export_category = function ()
{
    var saver = new Dynalinks_File_Proxy(this.dynalinks);
	saver.export_category(this.dynalinks.context.category_name);
}

Application.prototype.export_tag = function ()
{
    var saver = new Dynalinks_File_Proxy(this.dynalinks);
	saver.export_tag(this.dynalinks.context.category_name, 
		this.dynalinks.context.current_tag);
}

Application.prototype.remove_category = function ()
{
	var params = {
		"type": "label",
		"value": "Правда удалить эту категорию?"
	};
	var self = this;
	params.handler = function (value) {
		self.dynalinks.remove_category(self.dynalinks.context.category_name);
        var key = get_first_key(self.dynalinks.names);
		mr.navigate(self.dynalinks.create_url(key), true);
	}
	var form = new PopupForm(params);
	form.show();
}

Application.prototype.remove_tag = function ()
{
	var params = {
		"type": "label",
		"value": "Правда удалить эту страницу?"
	};
	var self = this;
	params.handler = function (value) {
		self.dynalinks.remove_tag(
			self.dynalinks.context.category_name, 
			self.dynalinks.context.current_tag
			);
		mr.navigate(self.dynalinks.create_url(self.dynalinks.context.category_name), true);
	}
	var form = new PopupForm(params);
	form.show();
}

Application.prototype.create_category = function ()
{
	var params = {};
	params.type = "text";
	params.title = "Название новой папки";
	var self  = this;
	params.handler = function (value) {
		self.dynalinks.add_category(value);
		mr.navigate(self.dynalinks.create_url(value), true);
	}
	var form = new PopupForm(params);
	form.show();
}

Application.prototype.move_item = function ()
{
	
}


Application.prototype.search = function (text)
{
	var value = text.trim();
	if (!value) {
		return;
	}
	mr.navigate(create_url("search", value), true);
}
	
Application.prototype.show_search_results = function (value)
{
	var results = this.dynalinks.search(["text", "href"], value);	

	var context = 
	{
		results:results
	};
	var view = document.getElementById("page-content");
	ko.cleanNode(view);
	view.innerHTML = '';
	
	ko.renderTemplate("template-search-result", context, {}, view);	
}

Application.prototype.init_router = function()
{
}


//hack, get database name for 'save' function
Application.prototype.get_database_name = function ()
{
    return "dynalinks_" + new Date().dateString + "_.txt";
}

Application.prototype.save_to_file = function (filename)
{
    var saver = new Dynalinks_File_Proxy(this.dynalinks);
	saver.save_to_file(filename || this.Save_Filename);
}

Application.prototype.initialize = function ()
{
	this.init_router();
	if (this._child_init) {
		this._child_init();
	}
	
}




;


function Dynalinks_File_Proxy(dlink)
{
    this.dlink = dlink;
    this.dynalinks = dlink;
}

copy_object(Dynalinks_File_Proxy.prototype, {
    constructor: Dynalinks_File_Proxy,
    save_to_file : function (filename, varname)
    {
        var json = this.dlink.toJSON();
        this.save_data_to_file(filename || this.Database_Name, json, this.Database_Var);
    },
    
    save_data_to_file : function(filename, data, varname)
    {
        var text = JSON.stringify(data, null, " ");
        text = "var " + varname + " = " + text + ";\n";
        var blob = new Blob([text], {type: "text/plain;charset=utf-8"});	
        console.log("blob created.... saving");
        saveAs(blob, filename); 
    },
    
    Database_Name : "database.txt",
    
   Database_Var : "my_links",
   
    export_tag : function (category, tag)
    {
        var context = this.dlink.get_category_context(category);
        var data = context.pages[tag];
        this.save_data_to_file(tag + ".txt", data, "my_page");
    },
    
    export_category : function (name)
    {
        this.save_data_to_file(name + ".txt", this.dlink.database[name], "my_cat");
    }
});

;
/*
Router
*/

function My_Router() 
{
	this.routes = new Array();
}


My_Router.prototype.decode_params = function (arr) 
{
	for(var i = 0; i < arr.length; i++) {
		arr[i] = decodeURIComponent(arr[i]);
	}
}

My_Router.prototype.apply_route = function (params, route)
{
	//remove whole match, left only parenthess groups
	if (params.length > 1) {
		params.splice(0,1);
	}
			
	this.decode_params(params);
		
	route.callback.apply(route.obj, params);
}

My_Router.prototype.test_hash = function (url)
{
	var item, groups;
	for(var i = 0; i < this.routes.length; i++) {
		item = this.routes[i];
		item.re.lastIndex = 0;		
		groups = item.re.exec(url);
		if (groups) {
			this.apply_route(groups, item);
			
			return true;
		}
	}
	
	//if nothing match
	if (this.default_route) {
		this.default_route.callback.apply(this.default_route.obj, [url]);
	}
}

My_Router.prototype.add_default = function (callback, obj) 
{
	this.default_route = {callback: callback, obj: obj};
}

My_Router.prototype._add = function (re, callback, obj)
{
	return this.routes.push({re: re, callback: callback, obj: obj});
}


/*
	lead/:category/:page transform to regexp lead/([^/]+?)/([^/])+?
	without leading '#'!!!
*/
My_Router.prototype.add_route = function (route, callback, obj) 
{
	var frag = route.split("/");
	
	var t = "^";
	var str;
	
	var keys = {};
	var key;
	var index = 0;
	for(var i = 0; i < frag.length; i++) {
		str = frag[i];
		//slash
		if (!str || i > 0) {
			t +="/";
		}
		if (str) {
			//named parameter
			if (str[0] === ":") {
				key = {index: index};
				keys[str.slice(1)] = key;
				index++;
				
				t += "([^/]+?)"
			}
			//literally text fragment
			else {
				t += str;
			}
		}
	}
	t += "$";
	this._add(new RegExp(t), callback, obj);
}

My_Router.prototype.hash_change = function (e)
{
	var hash = window.location.hash;
	if (hash) {
		hash = hash.split("#");
		if (hash.length > 1) {
			hash = hash[1];
		}
		if (hash && hash[0] == "/") {
			hash = hash.slice(1);
		}
	}
	this.test_hash(hash);
}

My_Router.prototype.refresh = function ()
{
	this.hash_change();
}

//by default call route callback without change location
My_Router.prototype.navigate = function (hash, change_location)
{
	if (change_location) {
		var new_hash = "#"+hash;
		if (window.location.hash == new_hash) {
			this.test_hash(hash);
		}
		else {
			window.location.hash = new_hash;
		}
	}
	else {
		this.test_hash(hash);
	}
}

My_Router.prototype.start = function (force_hash_change)
{
	var self = this;
	window.addEventListener("hashchange", function (e) 
	{
		self.hash_change(e);
	}, false);
	
	if (force_hash_change) {
		this.hash_change();
	}
}



;


var event_hub;

function Vue_Application(dlink)
{

    this.create_database(dlink);
}

Vue_Application.prototype = Object.create( Application.prototype );
Vue_Application.prototype.constructor = Vue_Application;

Vue_Application.prototype.initialize = function ()
{
    var self = this;
    
    this.mixin_vue();
    
	this.vue = DAE.create_vue_app(this.dynalinks);
    
    
    //create event hub
	event_hub = DAE.create_event_hub();
    DAE.create_main_menu(this);


	this.init_router();	
	var self = this;
	event_hub.$on("delete-record", function (id) {
		self.remove_item( id );		
	});
    
    
    event_hub.$on("create_category", function (name) {
        self.dynalinks.add_category(name);
    });
    
    event_hub.$on("get_database", function (callback) {
        color_console("get_databse", "blue");
        callback(self.dynalinks);
    });
    
}

Vue_Application.prototype.mixin_vue = function ()
{
    var self = this;
    Vue.mixin({
        created: function () {
            this.$dynalinks= self.dynalinks;
        }
    });
}


Vue_Application.prototype.clear_ls = function ()
{
    delete localStorage["Dynalinks"];
}

Vue_Application.prototype.save_to_ls = function ()
{
    var text = this.dynalinks.toJSON();
    localStorage.setItem("Dynalinks", text);
}

Vue_Application.prototype.add_item = function ()
{
	var context = this.dynalinks.get_active_context();
	if (context) {
		var category = context.category_name;
		mr.navigate('add/'+category, true);
	} else {
		console.log("Error add record! Category not found!", this.dynalinks.category_name);
	}
}



Vue_Application.prototype.show_category_page = 	function (category, page)
{
	if (!category) {
		console.log("Error! Category " + category + " not found!");
        console.log("Either: 1) category " + category + " is wrong");
		this.vue.$emit("my_command", "show_error", "Error! Category " + category + " not found!");
	} else {
        this.dynalinks.set_category(category);
		if (page) {
			this.dynalinks.set_page(page);	
			this.vue.$emit("my_command", "show_page", category, page, this.dynalinks);
		} else {
			var name = this.dynalinks.get_first_page_from_category(category);
			this.dynalinks.set_page(name);				
            this.vue.$emit("my_command", "show_page", category, page, this.dynalinks);
		}
	}
}

Vue_Application.prototype.show_search_result = function (value)
{
	var results = this.dynalinks.search(["text", "href"], value);
	this.search_results = results;
	this.vue.$emit("my_command", "show_search_result", results);
}





Vue_Application.prototype.import_database = function ()
{
	var self = this;


    function import_data(text)
    {
        var db = JSON.parse(text);
        self.dynalinks.import_database(db);
        var category = self.dynalinks.category_list[0].href;
        console.log("Import done!", category);
        mr.navigate(self.dynalinks.create_url(category), true);        
    }
    
    
	var params = 
	{
		'type': 'file', 
		handler: function (files) 
		{
            var file = files[0];
            var fr = new FileReader();
            
            
            fr.onloadend = function () { import_data(fr.result); }
            
            fr.readAsText(file); // "utf-8" by default
            
		}
	};
	var form = new PopupForm(params);
	form.show();
    
}


Vue_Application.prototype.add_record_from_browser = function (title, url)
{
	var self = this;

	var message = 
	{
        _id: '',
        text:title,
        href: url,
        tag: '',
        from_browser: true,
	};
    
    this.vue.$on("record->create", function (response, record, category) {
        console.log("record->create ", response);
        if (response === 'reject') {
            mr.navigate(self.dynalinks.create_url(category), true);
        }
        else if (response === "accept") {
            
			var tag = record.tag;
			mr.navigate(self.dynalinks.create_url(category, tag), true);            
        }
    });
    
	this.vue.$emit("my_command", "update_record", message);    
}


Vue_Application.prototype.add_record_to_category = function (category)
{
    if (category !== undefined) {
        var cat = this.dynalinks.categories[category];
        if (!cat) {
            this.vue.$emit("my_command", "show_error", "Category " + category + " not found!");
            return;
        }
    }
	var self = this;

	var message = 
	{
        _id: '',
        empty: true,
	};
    
    this.vue.$on("record->create", function (response, record) {
        if (response === 'reject') {
            mr.navigate(self.dynalinks.create_url(category), true);
        }
        else if (response === "accept") {
			var tag = record.tag;
            console.log("record getting ", record);
			mr.navigate(self.dynalinks.create_url(category, tag), true);            
        }
    });
    
	this.vue.$emit("my_command", "update_record", message);    
}


Vue_Application.prototype.update_record = function (category, id)
{
	var self = this;
	var context = self.dynalinks.categories[category];
    //console.log("update record =>" , JSON.stringify(context, null, ' '), category, id);
	if (!context) {
		console.log("Error update record!");
		return;
	}

	var record = context.hash[id];
	if (!record) {
		console.log("Error update record!");
		return;
	}
    
    //console.log("context is good, record is existed, go edit it");
    
    var message = {};
    message.current_page = record.tag;
    message.current_category = category;    
    message.edit = true;
    message.record = record;

    
    var tag = record.tag;    
    this.vue.$on("record->update", function (response, fresh) {
        console.log("record update event", response, fresh);
        if (response === 'reject') {
            mr.navigate(self.dynalinks.create_url(category, tag), true);
        } else {
            mr.navigate(self.dynalinks.create_url(category, fresh.tag), true);			
        } 
    });
    
	self.vue.$emit("my_command", "show_update_form", message);
    
}


Vue_Application.prototype.look_tabs = function ()
{
    
    //show tab list
    this.vue.$emit("my_command", "tab_manager", 'vueTableGrid');
    
}

Vue_Application.prototype.init_router = function ()
{
	var self = this;
	
	mr = new My_Router();	

	mr.add_route("view/:category", this.show_category_page, this);
	mr.add_route("view/:category/:page", this.show_category_page, this);
	
	mr.add_route("update/:category/:id", this.update_record, this);
	mr.add_route("add/:category", this.add_record_to_category, this);
    
    mr.add_route("tabs/all", this.look_tabs, this);
	
		
	mr.add_default( function (url) 
		{
            
            this.vue.$emit("my_command", "show_category", null, this.dynalinks);
		}, this);
		
		
	mr.add_route("search/:value", function (value) {
		self.show_search_result(decodeURIComponent(value));
	}, this);
		
	mr.start(true);	
}


Vue_Application.prototype.create_empty_database = function ()
{
    var database = {
        database: {
        'unknown': []
        },
        names: {'unknown': 'unknown'},
        features: {},
    };
    return database;
}

Vue_Application.prototype.get_database_normal = function ()
{
	var container;
    var database = undefined;
	if (typeof window === 'object') {
		container = window;
	} else if  (typeof global === 'object') {
		container = global;
	}
     
	if (container && container['my_links']) {
        console.log("trying load my_links from global");
		database = container['my_links'];
        if (database !== undefined) {
            console.log("This is done! Data readed from global!", database);
        }
	}
    
    if (database === undefined) {
        console.error("global not contains my_links. Sorry. One attempt leaves.");
    }
    
    if (localStorage["Dynalinks"]) {
        console.log("trying read database from localStorage");
        container.old_my_links = database;
        var text = localStorage["Dynalinks"];
        database = JSON.parse(text);
        if (!!!database) {
            console.error("Sorry, localStorage not contains data");
            database = undefined;
        }
    }

    if (database === undefined) {
        console.log('Error! database is undefined! Created empty database!');
        database = this.create_empty_database();
    }
	return database;
}



Vue_Application.prototype.find_database = function(callback, error)
{
    var self = this;
    if (!this.ITS_EXTENSION || typeof (browser) === 'undefined') {
        fail("this is not extension!");
        return;
    }

    console.log("trying load from browser.local.storage" + this.key_name);
    var request = browser.storage.local.get(this.key_name);
    
    function success(data) 
    {
        console.log("database opened");
        var key_name = data.key_name;
        if (key_name === self.key_name) {
            console.log("this is true database", data);
            callback(data.db);
        } else  {
            fail("is not true database \n Name 'key_name' must be "+self.key_name +"\n However found " + key_name + "\nDump database down \n " + JSON.stringify(data));
        }
    }
    
    function fail(err)
    {
        console.log("failed to read database from browser.storage.local", err);
        error();
    }
    
    request.then(success, fail)

}




