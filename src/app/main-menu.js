function register_main_menu(application)
{


var main_menu_template = '<div class="top-line line-menu top-buttons">\
	<ul>\
        <li><a href="javascript:void(0);"> Edit</a>\
            <ul>\
                <li><a href="javascript:void(0);" id="button-add" v-on:click="add_item">Create record</a></li>\
                <li><a href="javascript:void(0);" id="button-create-category" v-on:click="create_category"> Create  category </a></li>\
                <li><a href="javascript:void(0);" id="button-move" v-on:click="move_page">Move page to other category</a></li>\
                <li><a href="javascript:void(0);" id="button-remove-tag" v-on:click="remove_page"> Remove page</a></li>\
                <li><a href="javascript:void(0);" id="button-remove-category" v-on:click="remove_category"> Remove category</a></li>\
            </ul>\
        </li>\
        <li><a href="javascript:void(0);"> Files </a>\
            <ul>\
                <li><a href="javascript:void(0);" id="button-save" v-on:click="save_all"> Save to file </a></li>\
                <li><a href="javascript:void(0);" id="button-export-tag" v-on:click="export_page"> Save page </a> </li>\
                <li><a href="javascript:void(0);" id="button-export-category" v-on:click="export_category"> Save Category</a></li>\
            </ul>\
        </li>\
        <li><a href="javascript:void(0);" id="button-save" v-on:click="look_tabs">Look tabs</a></li>\
        <li><a href="javascript:void(0);" id="button-save" v-on:click="save_to_ls"> Сохранить локально</a></li>\
        <li><a href="javascript:void(0);" id="button-save" v-on:click="clear_ls"> Очистить хранилище</a></li>\
        <li><input type="text" id="search-box" v-model="search_text" placeholder="search..."><button type="button" id="search-button" v-on:click="search_record">Search</button></li>\
	</ul>\
</div>';



var Application_Main_Menu = {
	data: function () {
		return {'search_text': ''};
	},
	template: main_menu_template,
	methods: {
        clear_ls: function ()
        {
            application.clear_ls();
        },
        save_to_ls: function ()
        {
            application.save_to_ls();
        },
		save_all: function ()
		{
			application.save_to_file();
		},
		add_item: function ()
		{
			application.add_item();
		},
		create_category: function ()
		{
			application.create_category();
		},
		remove_page: function ()
		{
			application.remove_tag();
		},
		remove_category: function ()
		{
			application.remove_category();
		},
		move_page: function ()
		{
			application.move_tag();
		},
		export_category: function ()
		{
			application.export_category();
		},
		export_page: function ()
		{
			application.export_tag();
		},
		search_record: function ()
		{
			application.search(this.search_text);
		},
        look_tabs: function ()
        {
            application.look_tabs();
        }
	}
};

var main_menu_app = new Vue( {
	el: "#main-menu-app",
	components: {
		"application-main-menu": Application_Main_Menu
	},
	});

}

