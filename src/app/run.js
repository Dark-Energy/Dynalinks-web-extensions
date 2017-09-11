console.log("run run.js!");

var event_bus;


function Vue_Application(dlink)
{
    console.log("create vue application");        
 
    this.create_database(dlink);
}

Vue_Application.prototype = Object.create( Application.prototype );
Vue_Application.prototype.constructor = Vue_Application;

Vue_Application.prototype.initialize = function ()
{
	event_bus = new Vue();
    console.log("create vue app");
    //console.log("create vue menu");
    register_main_menu(this);
    console.log("create main application");
    console.log("dynalinks is true?", this.dynalinks.categories["English"] !== undefined);
	this.vue = create_vue_app(this.dynalinks);

	this.init_router();	
	var self = this;
	event_bus.$on("delete-record", function (id) {
		self.remove_item( id );		
	});
    
    
    event_bus.$on("create_category", function (name) {
        self.dynalinks.add_category(name);
    });
}

Vue_Application.prototype.clear_ls = function ()
{
    delete localStorage["Dynalinks"];
}

Vue_Application.prototype.save_to_ls = function ()
{
    var text = this.dynalinks.toJSON();
    //console.log("save to ls", text);
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

Vue_Application.prototype.turn_edit_mode = function ()
{
	if (this.vue.main_page_view === "grid-edit") {
		this.vue.change_page_view("page-content-grid");
	} else {
		this.vue.change_page_view("grid-edit");
	}
}


Vue_Application.prototype.show_category_page = 	function (category, page)
{
	if (!category || !this.vue.categories[category]) {
		console.log("Error! Category " + category + " not found!");
        console.log("Either: 1) category " + category + " is wrong");
        console.log("2) vue.categories not containt this category", this.vue.categories[category]);
		this.vue.show_error("Error! Category " + category + " not found!");
	} else {
		if (this.vue.current_category 
		&& this.vue.current_category !== category) {
			this.dynalinks.set_category(category);
			this.vue.show_category(category);				
		}
		
		if (page) {
			this.dynalinks.set_page(page);	
			this.vue.show_page(page);
		} else {
			var name = this.dynalinks.get_first_page_from_category(category);
			this.dynalinks.set_page(name);				
			this.vue.show_page(name);
		}
	}
}

Vue_Application.prototype.show_search_result = function (value)
{
	var results = this.dynalinks.search(["text", "href"], value);
	this.search_results = results;
	this.vue.show_search_result(results);
}




Vue_Application.prototype.add_record_to_category = function (category)
{
	var cat = this.dynalinks.categories[category];
	if (!cat) {
		this.vue.show_error("Category " + category + " not found!");
		return;
	}
	var self = this;
	var item = 
	{
		tag: this.vue.active_page_name,
		text: '',
		href: '',
		favorite: false,
		favorite_text: '',
	}
	this.vue.show_update_form(item, category,
		function (value) {
			var item = clone_fields(value, ["href", "text", "tag", "favorite", "favorite_text"]);
			//var item = create_clone_object(value);
			//item.tag = value.item.new_tag || item.tag;
			//var item = value;
			self.dynalinks.add_link_to_category(item, category);
			var tag = item.tag;
			mr.navigate(self.dynalinks.create_url(category, tag), true);
	},
    function () {
        mr.navigate(self.dynalinks.create_url(category), true);
    }
    );
}

Vue_Application.prototype.update_record = function (category, id)
{
	var self = this;
	var context = self.dynalinks.categories[category];
	if (!context) {
		console.log("Error update record!");
		return;
	}
	var record = context.hash[id];
	if (!record) {
		console.log("Error update record!");
		return;
	}
    //fucking 2 way data bindings
    //we need create copy of record that is given to user for editing
    //if user approve editing, then we need update record in database
    //if user reject editing, then we do nothing
    var tag = record.tag;
    var old_favorite = record.favorite;
    var item = create_clone_object(record);    
	self.vue.show_update_form(item, category, function (value ) {
        //context.check_favorite(record, old_favorite);
        self.dynalinks.update_item(record, item);
		mr.navigate(self.dynalinks.create_url(category, value.tag), true);			
	}, 
    //cancel
    function () {			
        mr.navigate(self.dynalinks.create_url(category, tag), true);
    }
    );
}

Vue_Application.prototype.init_router = function ()
{
	var self = this;
	
	mr = new My_Router();	

	mr.add_route("view/:category", this.show_category_page, this);
	mr.add_route("view/:category/:page", this.show_category_page, this);
	
	mr.add_route("update/:category/:id", this.update_record, this);
	mr.add_route("add/:category", this.add_record_to_category, this);
	
		
	mr.add_default( function (url) 
		{
            
			name = self.vue.category_list[0] && self.vue.category_list[0].href;
			this.show_category_page(name);
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


Vue_Application.prototype.write_test_data_to_storage = function(data)
{
    if (this.ITS_EXTENSION) {
        data.key_name = this.key_name;
        var data = {};
        data[this.key_name] = this.database;
        browser.storage.local.set( data );
    }
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




console.log("app create");


function create_table_view(dlink) {
    //console.log("My Extension is ", JSON.stringify(My_Extension));
    var App = new Vue_Application(dlink);    
}


console.log("end run.js!");

