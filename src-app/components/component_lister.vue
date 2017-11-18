<template>
<div id="app">
    <DropdownCategoryMenu :base_url="base_url" :category_list="category_list" :categories="categories" />

    <div class="clear-block">&nbsp;</div>

    <keep-alive>
        <component :is="page_content_view" 
        :updated_record="updated_record"
        :reshow = "reshow"
        :message="message" 
        :page_name="active_page_name"        
        :category="current_category_name"

        :base_url="base_url">
        </component>
    </keep-alive>
</div>
</template>


<script>

import {event_hub} from './event_hub.js';
import DropdownCategoryMenu from './dropdown-category-menu.vue';
import vueTableGrid from './vue_table_grid.vue';
import page_view_table from './page-view-table.vue';
import CategoryLineMenu from './category-menu.vue';
import ErrorMessage from './error-message.vue';
import UpdateForm from './vue_update_form.vue';
import CategoryView from './category_view.vue';

export default {
        name: "MainComponent",
        components: {
            'form-update': UpdateForm,
            'vueTableGrid': vueTableGrid,
            'CategoryView': CategoryView,

			'page-view-table': page_view_table,

			'CategoryLineMenu': CategoryLineMenu,
            'DropdownCategoryMenu': DropdownCategoryMenu,

            'ErrorMessage': ErrorMessage,
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

                "category_list": [],
                "categories": [],

                "current_category_name" : "",

                "page_content_view": CategoryView,
                "error_message": {},
                "update_info": {},
                "active_page_name" : '',
                
                
                "reshow": true,
            }



            return data;
		},

        
        created: function (){

            this.category_list = this.$dynalinks.category_list;
            this.categories = this.$dynalinks.categories;
            
            //console.log("catlist", this.category_list, this.dynalinks);
        
            var self = this;
            this.$root.$on("my_command", function (name) {
               var args = Array.prototype.slice.call(arguments, 1);
               //console.log("execute function " + name);
               //console.log(" with arguments " + JSON.stringify(args));
               if (name === "show_error") {
                    self.show_error.apply(self, args);
               } else if (name === "show_category") {
                    self.show_category.apply(self, args);
               } else if (name === "show_page") {
                    self.show_page.apply(self, args);
               } else if (name === "update_record") {
                    self.show_update_form.apply(self, args);
               } else if (name === "tab_manager") {
                    self.show_component.apply(self, args);
               } else if (name === "show_update_form") {
                    self.show_update_form.apply(self, args);
               }
               

               /*
                //var func = self.methods[name];
                if (self !== undefined) {
                    self.apply(this, args);
                }
               */
            });
        },

		methods: {

			"show_error": function (error)
			{
				this.message = error;
                this.page_content_view = ErrorMessage;
			},
			"show_update_form": function (message)
			{
                console.log("Show update form", message);
                
                if (!message.from_browser) {
                    message.current_category = this.current_category_name;
                    message.current_page = this.active_page_name;
                }
                this.updated_record = undefined;
                this.page_content_view = UpdateForm;
                this.updated_record = message;                
                this.reshow = !this.reshow;
               
                //console.log("show message go to dialog ", message);

			},
			"check_error": function ()
			{
				if (this.error_message.message) {
					this.error_message.message = '';
					this.page_content_view = "page-content-grid";
				}
			},

			"show_category": function (category_name)
			{
                //console.log("function show category", category_name);
                if (!category_name) {
                    category_name = this.$dynalinks.category_list[0].href;
                }
                
                this.current_category_name = category_name;                
                var category = this.$dynalinks.categories[category_name];
                this.active_page_name = category.tags[0];

                this.page_content_view = CategoryView;                
            },


			"show_page": function (category_name, page_name, dlink)
			{
                //console.log("function show page", category_name, page_name);
                this.show_category(category_name, dlink);
            
                //console.log("change active page name", page_name);
                this.active_page_name = page_name || '';
                this.page_content_view = CategoryView;
			},

			"show_search_result": function (results)
			{
				this.change_page_view("page-table-view");
				this.page_content_view = "page-table-view";
				this.link_array = results;
			},

            "show_component": function (view_name)
            {
                this.page_content_view = view_name;
            },

			"change_page_view": function (new_view)
			{
				this.show_page(this.active_page_name);
			},

		}
	}
</script>