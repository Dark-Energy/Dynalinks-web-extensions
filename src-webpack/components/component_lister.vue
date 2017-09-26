<template>
<div id="app">
    <DropdownCategoryMenu :base_url="base_url" :category_list="category_list" :categories="categories" />

    <div class="clear-block"><br/></div>

    <FeaturesLine v-bind:features="features" />
    <PageMenu v-bind:tags="tags" v-bind:base_url="category_url" />

    <keep-alive>
        <component :is="page_content_view" 
        :updated_record="updated_record"
        :message="message"
        :links_array="current_page"
        :category="this.current_category_name">
        </component>
    </keep-alive>
</div>
</template>


<script>

import {event_hub} from './event_hub.js';
import FeaturesLine from './features-line.vue';
import DropdownCategoryMenu from './dropdown-category-menu.vue';
import PageMenu from './page-menu.vue';
import vueTableGrid from './vue_table_grid.vue';
import page_view_grid from './page-view-grid.vue';
import page_view_table from './page-view-table.vue';
import CategoryLineMenu from './category-menu.vue';
import ErrorMessage from './error-message.vue';
import UpdateForm from './vue_update_form.vue';

export default {
        name: "MainComponent",
        props: ["dynalinks"],
        components: {
            'form-update': UpdateForm,
            'vueTableGrid': vueTableGrid,
            'FeaturesLine': FeaturesLine,
			'PageMenu': PageMenu,

			'page-view-grid': page_view_grid,
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

                "page_content_view": "page-content-grid",
                "error_message": {},
                "main_page_view": "page-content-grid",
                "features": {},
                "update_info": {},
            }



            return data;
		},

        
        created: function (){

            if (this.dynalinks) {
                this.category_list = this.dynalinks.category_list;
                this.categories = this.dynalinks.categories;
            }
            
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

        watch: {
            dynalinks: function (value)
            {
            	this.category_list = value.category_list;
                this.categories = value.dynalinks.categories;

            }
        },

		methods: {

			"show_error": function (error)
			{
				this.message = error;
                this.page_content_view = ErrorMessage;
			},
			"show_update_form": function (message)
			{
                //console.log("Show update form", message);
                
                if (!message.from_browser) {
                    message.current_category = this.current_category_name;
                    message.current_page = this.active_page_name;
                }
                this.updated_record = message;
                this.page_content_view = UpdateForm;                
               
                //console.log("show message go to dialog ", message);

			},
			"check_error": function ()
			{
				if (this.error_message.message) {
					this.error_message.message = '';
					this.page_content_view = "page-content-grid";
				}
			},

			"show_category": function (category_name, dlink)
			{
                if (!category_name) {
                    category_name = dlink.category_list[0].href;
                }
				var current_category = dlink.categories[category_name];
                this.tags = current_category.tags;
                this.features = current_category.features;
				this.category_url = this.base_url + category_name + "/";
				this.active_page_name = '';
				this.current_category_name = category_name;
			},


			"show_page": function (category_name, page_name, dlink)
			{

                //console.log("show page category <<" + category_name+">>" +"page<<"+page_name+">>");
                
                //need change category
                if (category_name && category_name !== this.current_category_name) {
                    this.show_category(category_name, dlink);
                }
            
                //show category only
                if (!page_name) {
                    //this.show_category(category_name, dlink);
                    //return;
                }

                var category = dlink.categories[this.current_category_name];
                if (!category) {
                    console.error("Terrify error! Category " + category_name + "was requsted, but undefined got");
                }

                var page = category.pages[page_name];

				this.current_page = page;
                this.active_page_name = page_name;

                this.page_content_view = page_view_grid;


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
				this.main_page_view = new_view;
				//this.page_content_view = new_view;
				this.show_page(this.active_page_name);
			},

		}
	}
</script>