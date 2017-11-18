import ApplicationMainMenu from './main-menu.vue'
//import Vue from 'vue'





function create_main_menu(application, element_id) {
    if (element_id === undefined) {
        console.error("undefined element_id in create_main_menu!");
        element_id = '#main-menu-app';
    }

    return new Vue(ApplicationMainMenu).$mount(element_id);
}

import vueTableGrid from './vue_table_grid.vue';
import MainComponent from './component_lister.vue';

function create_vue_app(dynalinks, element_id)
{

    if (element_id === undefined) {
        element_id = '#app';
        console.error("undefined element id in create vue app!");
    }
    
    return new Vue(MainComponent).$mount(element_id);    
    /*
	var app = new Vue({
		el: element_id,
        template: '<MainComponen"/>',
        components : {
            'vueTableGrid': vueTableGrid,
            'MainComponent': MainComponent,
		},
    });
	return app;
    -*/
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