//var Vue = require('../lib/vue.min.js');


Vue.component('page-item', 
	{
		props: ['link_item'],
		template: '<a v-bind:href="link_item.href"> {{link_item.text}} </a>',
	});
	
Vue.component('page-content-grid', {
		props: ['page_content'],
		template: '<div class="tab-content" id="page-content">\
	<div class="control-panel">\
		<a href="javascript:void(0);" class="edit-button link-button" v-on:click="turn_edit">Правка</button>\
	</div>\
    <div class="data-grid">\
	<div class="editable-link" v-for="item in page_content.data">\
		<div class="button-panel" v-if="edit_mode">\
			<a class="edit-btn" v-bind:href="\'#update/\'+page_content.category + \'/\'+item._id" v-bind:key="item._id">	Правка	</a>\
			<button type="button" class="delete-btn"  v-on:click="delete_record(item._id)" v-bind:key="item._id"> Удалить </button>\
		</div>\
		<a v-bind:href="item.href" v-bind:key="item._id"> {{item.text}}</a>\
	</div>\
    </div>\
</div>',
	data: function () {
		return {"edit_mode": false}
	},

	methods: {
		turn_edit: function (event) {
			this.edit_mode = !this.edit_mode;
		},
			delete_record: function (event) {
				event_bus.$emit("delete-record", event);
			}
     },

	});


Vue.component('page-content-text', {
	props: ['page_content'],
		template: '<div id="page-content"> <p v-for="item in page_content"> <page-item v-bind:link_item="item" v-bind:key="item._id"> </page-item></p> </div>'
	});

//url, params and fragments is mutual exludes
Vue.component('dynamic-link', 
		{
			props: ['base_url','url','fragments', 'text', 'params'],
			render: function (createElement) {
				var url = this.params && this.params.href || this.url;				
				
				var href = '';
				if (this.fragments && this.fragments.length > 0) {
					href = this.fragments.join('/');
				} else {
					href = url;
				}
				
				if (this.base_url) {
					href = this.base_url + '/'+href;
				}
				
				var text = this.params && this.params.text || this.url || this.text || href;								
				var elem = createElement('a', 
					{attrs: {
						"href":  href
					}},
					text);
				return elem;
			}
		});
		


	
Vue.component('page-table-view', {
	props: ['page_content'],
	template:
	'<div><p>результаты поиска</p>\
		<h3>Найдено <span> {{page_content.results.length}} </span> записей </h3>\
		<table class="search-result">\
			<thead>\
				<tr>\
					<td>Ссылка</td>\
					<td>Страница</td>\
					<td>Категория</td>\
					<td>Показать на странице</td>\
				</tr>\
			</thead>\
			<tbody >\
				<tr v-for="item in page_content.results">\
					<td><a v-bind:href="item.item.href"> {{item.item.text}} </a></td>\
					<td >{{item.item.text}}</td>\
					<td >{{item.category}}</td>\
					<td> <dynamic-link v-bind:fragments="[item.category,item.item.tag]" v-bind:text="item.item.text" v-bind:base_url="\'#view\'"></dynamic-link> </td>\
				</tr>\
			</tbody>\
		</table>\
	</div>'
	});




Vue.component('error-message', {
	props: ['page_content'],
	template: '<div id="message-block" class="error-message"><h1>Error</h1> <p>{{page_content.message}}</p></div>'
});
	

var event_bus = new Vue();
	


	
	//rough hack!
Vue.component('routed-link', 
		{
			props: ['base_url','url'],
			render: function (createElement) {
				var href = '#' + this.base_url;
				var text = this.url.text || this.url;
				if (this.url.href) {
					href += this.url.href;
				} else {
					href += this.url;
				}
				var elem = createElement('a', 
					{attrs: {
						"href":  href
					}},
					text);
				return elem;
			}
		});
		

Vue.component('category-menu',
	{
		props: ['category_list', 'base_url'],
		template: '<div class="top-line top-buttons">\
		<routed-link v-for="item in category_list" v-bind:url="item" v-bind:base_url="base_url"> </routed-link>\
		</div>'
	});
    
Vue.component('dropdown-category-menu',
	{
		props: ['category_list', 'base_url', 'categories'],
		template: '<div class="line-menu">\
        <ul class="top-line top-buttons">\
        <li v-for="item in category_list">\
            <routed-link  v-bind:url="item" v-bind:base_url="base_url"> </routed-link>\
            <ul v-if="categories[item.href]" class="submenu">\
                <li v-for="link in categories[item.href].favorites">\
                    <a :href="link.href">{{link.favorite_text || link.text}}</a>\
                </li>\
            </ul>\
        </li>\
		</ul></div>'
	});
    

Vue.component('features-line', {
	props:["features"],
	template: 
	'<div >\
<div class="features-line" id="favorites-menu">\
	<a class="features-button" v-for="item in features" v-bind:href="item.href">{{item.favorite_text}}</a>\
</div>\
</div>',

});


 
Vue.component('page-menu', {
	props: ["base_url",	"tags"],
	template:'<div class="buttons-headers" id="page-menu"> <routed-link v-for="item in tags" v-bind:url="item" v-bind:base_url="base_url"> </routed-link> </div>'
	});


function create_vue_app(dynalinks)
{
	var category_list = dynalinks.category_list;
	var categories = dynalinks.categories;
	
	var current_category_name ='';
	var current_category = {} ;	
	if (category_list[0]) {
		 current_category_name = category_list[0].href;
		 current_category = categories[current_category_name];
	}


    var app_template = '<div id="app">\
        <dropdown-category-menu v-bind:base_url="base_url" v-bind:category_list="category_list" :categories="categories"> </dropdown-category-menu>\
        <div class="clear-block"><br/></div>\
        <features-line v-bind:features="features"></features-line>\
        <page-menu v-bind:tags="current_category.tags" v-bind:base_url="category_url"> </page-menu>\
        \
	<keep-alive>\
		<component :is="page_content_view" :page_content="page_content" >\
		</component>\
	</keep-alive>\
    </div>';

    
    
	var app = new Vue({
		el: '#app',
        template: app_template,
        components: {
            'form-update': create_update_form(),
            'vueTableGrid': vueTableGrid,
        },
		data: {
			"current_category": {},
			"category_url": "",
			"tags": {},
			"pages": {},
			"current_page": {},
			"current_category_name" : "",
			
			"base_url": "view/",
			"category_list": category_list,
			"categories": categories,
			"page_content_view": "page-content-grid",
			"error_message": {},
			"page_content": {},
			"main_page_view": "page-content-grid",
			"features": {},

		},
		methods: {
			"show_error": function (error)
			{
				this.error_message.message = error;
				this.page_content_view = 'error-message';
				this.page_content = this.error_message;
				this.current_category = {};
			},
			"restore_page_view": function ()
			{
				if (this.page_content_view !== this.main_page_view){
					this.page_content_view = this.main_page_view;
				}
			},
			"show_update_form": function (item, category, callback, cancel) 
			{
				this.show_category(category);
				this.page_content_view = "form-update";
				this.page_content = {
					item: item,
					callback: callback,
					tags: this.tags,
                    cancel_callback: cancel,
				};
			},
			"check_error": function () 
			{
				if (this.error_message.message) {
					this.error_message.message = '';
					this.page_content_view = "page-content-grid";
				}
			},
			"select_category": function (category)
			{
				this.current_category_name = category;
				this.current_category = this.categories[category];
				this.tags = this.current_category.tags;
				this.category_url = this.base_url + category + "/";
				this.active_page_name = '';	
				this.features = this.current_category.favorites;
			},
			//show category frame only
			"show_category": function (category)
			{
				//this.restore_page_view();
				
				if (!this.categories[category] || category === this.current_category_name) {
					return;
				}
			
				this.select_category(category)
			},
			"show_page": function (page) 
			{
				if (!this.current_category_name) {
					return;
				}

				
				if (this.active_page_name !== page || this.page_content_view !== this.main_page_view) {
					this.main_page_view = this.page_content_view = "page-content-grid";
					this.restore_page_view();
				
					this.active_page_name = page;
					this.current_page = this.categories[this.current_category_name].pages[page];
					this.page_content = {
						"data": this.current_page,
						"category": this.current_category_name
					};
				}
			},
			
			"show_search_result": function (results)
			{
				this.change_page_view("page-table-view");
				this.page_content_view = "page-table-view";
				this.page_content = {results:results};
			},
            
            "show_component": function (view_name)
            {
                this.page_content_view = view_name;
                this.page_content = {};
            },
			
			"change_page_view": function (new_view)
			{
				this.main_page_view = new_view;
				//this.page_content_view = new_view;
				this.show_page(this.active_page_name);
			},
			
		}
	});
	return app;
}


