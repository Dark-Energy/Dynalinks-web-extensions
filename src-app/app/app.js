
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
    if (this.initialize) {
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


Application.prototype.export_category = function ()
{
    
    var name = this.dynalinks.context.category_name;
    var data = this.dynalinks.database[name];
    var text = JSON.stringify(data);
    
    var saver = new Dynalinks_File_Proxy();
    saver.save_text_as_blob(text, "category_"+name+".json");

}

Application.prototype.export_tag = function ()
{
	var category = this.dynalinks.context.category_name;
    var tag = this.dynalinks.context.current_tag;
    
    var context = this.dynalinks.get_category_context(category);
    var data = context.pages[tag];
    var text = JSON.stringify(data);
    
    var saver = new Dynalinks_File_Proxy();
    saver.save_text_as_blob(text, tag+".json");
}


Application.prototype.import_database = function ()
{
	var self = this;


    function import_data(text)
    {
        if (!text || text === '') {
            throw ("Error importing database! Data is empty!");
        }
        var json = JSON.parse(text);
        self.dynalinks.import_database(json);
        var category = self.dynalinks.category_list[0].href;
        //console.log("Import done!", category);
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

//navigate to page with form creating new record
Application.prototype.add_item = function ()
{
	var context = this.dynalinks.get_active_context();
	if (context) {
		var category = context.category_name;
		mr.navigate('add/'+category, true);
	} else {
		console.log("Error add record! Category not found!", this.dynalinks.category_name);
	}
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
}


//hack, get database name for 'save' function
Application.prototype.get_database_name = function ()
{
    return "dynalinks_" + new Date().dateString + "_.txt";
}

Application.prototype.save_to_file = function (filename)
{
    var proxy = new Dynalinks_File_Proxy();
    proxy.save_storage_to_file();
}

