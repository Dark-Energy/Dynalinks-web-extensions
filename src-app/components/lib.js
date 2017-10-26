import ApplicationMainMenu from './main-menu.vue'



function create_main_menu(application, element_id) {
    if (element_id === undefined) {
        console.error("undefined element_id in create_main_menu!");
        element_id = '#main-menu-app';
    }
	var app_main_menu = new Vue( {
			el: element_id,
            data : {
                application: application
            },
            template: 
                '<ApplicationMainMenu  :application="application"/>'
            ,
			components: {
				"ApplicationMainMenu": ApplicationMainMenu
			},
		});
		return app_main_menu;
}

import vueTableGrid from './vue_table_grid.vue';
import MainComponent from './component_lister.vue';

function create_vue_app(dynalinks, element_id)
{

    if (element_id === undefined) {
        element_id = '#app';
        console.error("undefined element id in create vue app!");
    }
	var app = new Vue({
		el: element_id,
        data: {
            dynalinks : dynalinks,
        },
        template: '<MainComponent :dynalinks="dynalinks" />',
        components : {
            'vueTableGrid': vueTableGrid,
            'MainComponent': MainComponent,
		},
    });
	return app;
}

export {create_vue_app, create_main_menu};
export {vueTableGrid};
export {MainComponent};
export {event_hub, create_event_hub} from './event_hub.js';
import GlueLink from './glue_link.vue';
export {GlueLink};

import CategoryTagSelect from './category_tag_select.vue';
export {CategoryTagSelect}

import CategoryView from './category_view.vue';
export {CategoryView}