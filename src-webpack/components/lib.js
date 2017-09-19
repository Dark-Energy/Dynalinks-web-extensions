import main_menu from './main-menu.vue'
import Vue from 'vue'


function create_main_menu(application) {
	var app_main_menu = new Vue( {
			el: "#main-menu-app",
			data: {
				"application": application,
			},
			components: {
				"application-main-menu": main_menu
			},
		});
		return app_main_menu;
}

import page_item from './page-item.vue'
import page_view_grid from './page-view-grid.vue'
import dynamic_link from './dynamic-link.vue'
import page_view_table from './page-view-table.vue'
import page_menu from './page-menu.vue'
import form_update from "./vue_update_form.vue"
import category_menu from "./category-menu.vue"
import features_line from "./features-line.vue"
import vueTableGrid from './vue_table_grid.vue';


export {vueTableGrid};


function create_vue_app(dynalinks, element_id)
{

	var app = new Vue({
		el: element_id,
        dynalinks : dynalinks,
		components: {'page-item': page_item,
			'page-view-grid': page_view_grid,
			'dynamic-link': dynamic_link,
			'page-view-table': page_view_table,
			'page-menu': page_menu,
			'form-update': form_update,
			'category-menu': category_menu,
			'features-line': features_line,
            'vueTableGrid': vueTableGrid,
		},
    });
	return app;
}


export {create_vue_app, create_main_menu};