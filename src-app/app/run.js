

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

/*

COMMANDS

*/



Vue_Application.prototype.show_category_view = function ()
{
    
    //mr.hash_change();

    var category = this.dynalinks.category_list[0].href;
    var url = this.dynalinks.create_url(category);
    mr.navigate(url, true);        
    //console.log("show category view", url);

}

Vue_Application.prototype.show_category_page = 	function (category, page)
{
	if (!category) {
		console.log("Error! Category " + category + " not found!");
        console.log("Either: 1) category " + category + " is wrong");
		this.vue.$emit("my_command", "show_error", "Error! Category " + category + " not found!");
	} else {
        //console.log("routing", category,page);
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




Vue_Application.prototype.add_record_from_browser = function (title, url)
{
	var self = this;

    console.log("add record from browser", title, url);
    
	var message = 
	{
        _id: '',
        text:title,
        href: url,
        tag: '',
        from_browser: true,
	};
    
    this.vue.$on("record->create", function (response, record, category) {
        console.log("record->create from browser", response);
        if (response === "accept") {
			var tag = record.tag;
			mr.navigate(self.dynalinks.create_url(category, tag), true);            
        } else { //if (response === 'reject') 
            console.log("reject ", self.dynalinks.create_url(category));
            mr.navigate(self.dynalinks.create_url(category), true);
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
            console.log("reject to ", self.dynalinks.create_url(category));
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

Vue_Application.prototype.default_category_view = function()
{
    this.vue.$emit("my_command", "show_category", null, this.dynalinks);
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
	
		
	mr.add_default( function (url) {
            this.default_category_view();
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




