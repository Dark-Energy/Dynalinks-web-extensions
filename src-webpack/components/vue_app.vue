<template>
<div id="app">
    <dropdown-category-menu v-bind:base_url="base_url" v-bind:category_list="category_list" :categories="categories"> </dropdown-category-menu>
    <div class="clear-block"><br/></div>
    <features-line v-bind:features="features"></features-line>
    <page-menu v-bind:tags="current_category.tags" v-bind:base_url="category_url"> </page-menu>
        
    <keep-alive>
        <component :is="page_content_view" :page_content="page_content" >
        </component>
    </keep-alive>
</div>
</template>


<script>

import FeaturesLine from './features-line.vue';
import DropdownCategoryMenu from './dropdown-category-menu.vue';
import PageMenu from './page-menu.vue';

 
export default {
        name: "MainComponent",
        props: ["dynalinks"],
        components: {
            'form-update': create_update_form(),
            'vueTableGrid': vueTableGrid,
            'features-line': FeaturesLine,
        },
		data: function () 
        {
            var data = {
                "current_category": {},
                "category_url": "",
                "tags": {},
                "pages": {},
                "current_page": {},
		
                "base_url": "view/",
            
                "category_list": this.dynalinks.category_list,
                "categories": this.dynalinks.categories,
            
                "current_category_name" : "",
            
                "page_content_view": "page-content-grid",
                "error_message": {},
                "page_content": {},
                "main_page_view": "page-content-grid",
                "features": {},
            }

            
            if (data.category_list[0]) {
                data.current_category_name = data.category_list[0].href;
                data.current_category = data.categories[current_category_name];
            }

            return data;
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
	}
</script>