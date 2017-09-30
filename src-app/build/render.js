var DAE =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// this module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate
    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export event_bus */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return event_hub; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return create_event_hub; });
//import Vue from 'vue'

var event_bus = {};
var event_hub = event_bus;

function create_event_hub() {
    event_bus = new Vue();
    event_hub = event_bus;
    return event_hub;
}



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_glue_link_vue__ = __webpack_require__(13);
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */
var __vue_template__ = null
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_glue_link_vue__["a" /* default */],
  __vue_template__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_vue_table_grid_vue__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4bac0c54_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_vue_table_grid_vue__ = __webpack_require__(35);
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_vue_table_grid_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4bac0c54_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_vue_table_grid_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_component_lister_vue__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1487f69e_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_component_lister_vue__ = __webpack_require__(32);
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_component_lister_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1487f69e_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_component_lister_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_main_menu_vue__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0583823f_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_main_menu_vue__ = __webpack_require__(29);
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_main_menu_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0583823f_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_main_menu_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create_vue_app", function() { return create_vue_app; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create_main_menu", function() { return create_main_menu; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__main_menu_vue__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vue_table_grid_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__component_lister_vue__ = __webpack_require__(4);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "vueTableGrid", function() { return __WEBPACK_IMPORTED_MODULE_1__vue_table_grid_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MainComponent", function() { return __WEBPACK_IMPORTED_MODULE_2__component_lister_vue__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__event_hub_js__ = __webpack_require__(1);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "event_hub", function() { return __WEBPACK_IMPORTED_MODULE_3__event_hub_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "create_event_hub", function() { return __WEBPACK_IMPORTED_MODULE_3__event_hub_js__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__glue_link_vue__ = __webpack_require__(2);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "GlueLink", function() { return __WEBPACK_IMPORTED_MODULE_4__glue_link_vue__["a"]; });


function create_main_menu(application, element_id) {
    console.log(application, "appl");
    if (element_id === undefined) {
        console.error("undefined element_id in create_main_menu!");
        element_id = '#main-menu-app';
    }
    var app_main_menu = new Vue({
        el: element_id,
        data: {
            application: application
        },
        template: '<ApplicationMainMenu  :application="application"/>',

        components: {
            "ApplicationMainMenu": __WEBPACK_IMPORTED_MODULE_0__main_menu_vue__["a" /* default */]
        }
    });
    return app_main_menu;
}




function create_vue_app(dynalinks, element_id) {

    if (element_id === undefined) {
        element_id = '#app';
        console.error("undefined element id in create vue app!");
    }
    var app = new Vue({
        el: element_id,
        data: {
            dynalinks: dynalinks
        },
        template: '<MainComponent :dynalinks="dynalinks" />',
        components: {
            'vueTableGrid': __WEBPACK_IMPORTED_MODULE_1__vue_table_grid_vue__["a" /* default */],
            'MainComponent': __WEBPACK_IMPORTED_MODULE_2__component_lister_vue__["a" /* default */]
        }
    });
    return app;
}








//import CategoryTagSelect from './category_tag_select.vue';
//export {CategoryTagSelect}

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__glue_link_vue__ = __webpack_require__(2);
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
	props: ['category_list', 'base_url'],
	name: 'category-menu',
	components: {
		'GlueLink': __WEBPACK_IMPORTED_MODULE_0__glue_link_vue__["a" /* default */]
	}
});

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__event_hub_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__features_line_vue__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dropdown_category_menu_vue__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__page_menu_vue__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__vue_table_grid_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__page_view_grid_vue__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__page_view_table_vue__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__category_menu_vue__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__error_message_vue__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__vue_update_form_vue__ = __webpack_require__(28);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//













/* harmony default export */ __webpack_exports__["a"] = ({
    name: "MainComponent",
    props: ["dynalinks"],
    components: {
        'form-update': __WEBPACK_IMPORTED_MODULE_9__vue_update_form_vue__["a" /* default */],
        'vueTableGrid': __WEBPACK_IMPORTED_MODULE_4__vue_table_grid_vue__["a" /* default */],
        'FeaturesLine': __WEBPACK_IMPORTED_MODULE_1__features_line_vue__["a" /* default */],
        'PageMenu': __WEBPACK_IMPORTED_MODULE_3__page_menu_vue__["a" /* default */],

        'page-view-grid': __WEBPACK_IMPORTED_MODULE_5__page_view_grid_vue__["a" /* default */],
        'page-view-table': __WEBPACK_IMPORTED_MODULE_6__page_view_table_vue__["a" /* default */],

        'CategoryLineMenu': __WEBPACK_IMPORTED_MODULE_7__category_menu_vue__["a" /* default */],
        'DropdownCategoryMenu': __WEBPACK_IMPORTED_MODULE_2__dropdown_category_menu_vue__["a" /* default */],

        'ErrorMessage': __WEBPACK_IMPORTED_MODULE_8__error_message_vue__["a" /* default */]
    },

    data: function () {
        var data = {
            "current_category": {},
            "category_url": "",
            "tags": {},
            "pages": {},
            "current_page": {},

            "base_url": "view/",

            "category_list": [],
            "categories": [],

            "current_category_name": "",

            "page_content_view": "page-content-grid",
            "error_message": {},
            "main_page_view": "page-content-grid",
            "features": {},
            "update_info": {},

            "reshow": true
        };

        return data;
    },

    created: function () {

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
        dynalinks: function (value) {
            this.category_list = value.category_list;
            this.categories = value.dynalinks.categories;
        }
    },

    methods: {

        "show_error": function (error) {
            this.message = error;
            this.page_content_view = __WEBPACK_IMPORTED_MODULE_8__error_message_vue__["a" /* default */];
        },
        "show_update_form": function (message) {
            console.log("Show update form", message);

            if (!message.from_browser) {
                message.current_category = this.current_category_name;
                message.current_page = this.active_page_name;
            }
            this.updated_record = undefined;
            this.page_content_view = __WEBPACK_IMPORTED_MODULE_9__vue_update_form_vue__["a" /* default */];
            this.updated_record = message;
            this.reshow = !this.reshow;

            //console.log("show message go to dialog ", message);
        },
        "check_error": function () {
            if (this.error_message.message) {
                this.error_message.message = '';
                this.page_content_view = "page-content-grid";
            }
        },

        "show_category": function (category_name, dlink) {
            if (!category_name) {
                category_name = dlink.category_list[0].href;
            }
            var current_category = dlink.categories[category_name];
            this.tags = current_category.tags;
            this.features = current_category.features;
            this.category_url = this.base_url + category_name + "/";
            this.active_page_name = '';
            this.current_category_name = category_name;

            //show first page        
            this.page_content_view = __WEBPACK_IMPORTED_MODULE_5__page_view_grid_vue__["a" /* default */];
            this.active_page_name = current_category.tags[0];
            this.current_page = current_category.pages[this.active_page_name];
        },

        "show_page": function (category_name, page_name, dlink) {

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

            this.page_content_view = __WEBPACK_IMPORTED_MODULE_5__page_view_grid_vue__["a" /* default */];
            this.active_page_name = page_name;
            this.current_page = category.pages[this.active_page_name];
        },

        "show_search_result": function (results) {
            this.change_page_view("page-table-view");
            this.page_content_view = "page-table-view";
            this.link_array = results;
        },

        "show_component": function (view_name) {
            this.page_content_view = view_name;
        },

        "change_page_view": function (new_view) {
            this.main_page_view = new_view;
            //this.page_content_view = new_view;
            this.show_page(this.active_page_name);
        }

    }
});

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__glue_link_vue__ = __webpack_require__(2);
//



//its glue base url + item.url
//category_list = array of string (name and hash simulationesly);
/* harmony default export */ __webpack_exports__["a"] = ({ name: 'dropdown-category-menu',
    props: ['category_list', 'base_url', 'categories'],
    /*
    data: function ()
    {
        return {
            private_category_list: [],
        };
    },
    
    watch: {
        category_list: function (value)
        {
            this.private_category_list = value;
        }
    },
    created:function()
    {
        var self= this;
        this.$root.$emit("get_database", function (data) {
            self.private_category_list = data.category_list;
            console.log("private ", data.category_list);
        });
    },*/
    created: function () {
        console.log("dropdown menu created", this.categorires);
    },
    components: {
        'GlueLink': __WEBPACK_IMPORTED_MODULE_0__glue_link_vue__["a" /* default */]
    }

    /*
                <ul v-if="categories[item.href]" class="submenu">
                    <li v-for="elem in categories[elem.href].features">
                        <a :href="elem.href">{{elem.text}}</a>
                    </li>
                </ul>
    */

});

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

//url, params and fragments is mutual exludes
/* harmony default export */ __webpack_exports__["a"] = ({
	name: 'dynamic-link',
	props: ['base_url', 'url', 'fragments', 'text', 'params'],
	render: function (createElement) {
		var url = this.params && this.params.href || this.url;

		var href = '';
		if (this.fragments && this.fragments.length > 0) {
			href = this.fragments.join('/');
		} else {
			href = url;
		}

		if (this.base_url) {
			href = this.base_url + '/' + href;
		}

		var text = this.params && this.params.text || this.url || this.text || href;
		var elem = createElement('a', { attrs: {
				"href": href
			} }, text);
		return elem;
	}
});

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
	props: ['message'],
	name: 'ErrorMessage'
});

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
	name: 'features-line',
	props: ["features"]
});

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

//rough hack!
/* harmony default export */ __webpack_exports__["a"] = ({
	name: 'GlueLink',
	props: ['base_url', 'url'],
	render: function (createElement) {
		//console.log("Glue", this.base_url, this.url);
		var href = '#' + this.base_url;
		var text = this.url.text || this.url;
		if (this.url.href) {
			href += this.url.href;
		} else {
			href += this.url;
		}
		var elem = createElement('a', { attrs: {
				"href": href
			} }, text);
		return elem;
	}
});

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


var table = {};
table.action_list = ["Edit", "Tabs", "Files", "Search"];
table.actions = {};
table.actions["Edit"] = [{
    title: "Create record",
    id: "create_record",
    action: function () {
        this.application.add_item();
    }
}, {
    title: "Create category",
    id: "create_category",
    action: function () {
        this.application.create_category();
    }
}, {
    title: "Move page to other category",
    id: "move_page",
    action: function () {
        this.application.move_tag();
    }
}, {
    title: "Remove page",
    id: "remove_page",
    action: function () {
        this.application.remove_tag();
    }
}, {
    title: "Remove category",
    id: "remove_category",
    action: function () {
        this.application.remove_category();
    }
}];

table.actions["Files"] = [{
    title: "Save to file",
    id: "save_to_file",
    action: function () {
        this.application.save_to_file();
    }
}, {
    title: "Save page",
    id: "save_page",
    action: function () {
        this.application.export_tag();
    }
}, {
    title: "Save category",
    id: "save_category",
    action: function () {
        this.application.export_category();
    }
}, {
    title: "Import database",
    id: "import_database",
    action: function () {
        this.application.import_database();
    }
}];
table.actions["Tabs"] = [{
    title: "Tab list",
    id: "tab_list",
    action: function () {
        this.application.look_tabs();
    }
}, {
    title: "Tab Groups",
    id: "tab_groups"
}, {
    title: "Mass operations",
    id: "mass_operations"
}];

table.actions["Search"] = [{
    title: "Search",
    id: "search"
}, {
    title: "Advanced Search",
    id: "advanced_search"
}];

/* harmony default export */ __webpack_exports__["a"] = ({
    name: "ApplicationMainMenu",
    props: ["application"],
    data: function () {

        var actions = {};
        every_property(table.actions, key => {
            var funcs = table.actions[key];
            //console.log("key in table", key, funcs);
            if (funcs) {
                for (var i = 0; i < funcs.length; i++) {
                    actions[funcs[i].id] = funcs[i].action;
                }
            }
        });

        //console.log("actions get", JSON.stringify(actions), table);

        return {
            "table": table,
            "actions": actions,
            'search_text': ''
        };
    },
    methods: {
        onclick: function (event) {
            var id = event.target.getAttribute('data-id');
            console.log("id", id);
            if (id) {
                var func = this.actions[id];
                console.log("func ", func);
                if (func) {
                    console.log("call");
                    func.call(this);
                }
            }
        },
        search_record: function () {
            //this.application.search(this.search_text);
        }
    }
});

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__glue_link_vue__ = __webpack_require__(2);
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({
	name: 'page-menu',
	props: ["base_url", "tags"],
	components: {
		'GlueLink': __WEBPACK_IMPORTED_MODULE_0__glue_link_vue__["a" /* default */]
	}
});

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__event_hub_js__ = __webpack_require__(1);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
	props: ['links_array', 'category'],
	name: 'page-view-grid',
	data: function () {
		return {
			"edit_mode": false
		};
	},

	methods: {
		build_update_link: function (record) {
			return '#update/' + this.category + '/' + record._id;
		},

		turn_edit: function (event) {
			this.edit_mode = !this.edit_mode;
		},
		delete_record: function (event) {
			if (typeof __WEBPACK_IMPORTED_MODULE_0__event_hub_js__["a" /* event_hub */] === 'object') {
				__WEBPACK_IMPORTED_MODULE_0__event_hub_js__["a" /* event_hub */].$emit("delete-record", event);
			}
		}
	}
});

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dynamic_link_vue__ = __webpack_require__(22);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
	props: ['page_content'],
	name: 'page-view-table',
	components: {
		'dynamic-link': __WEBPACK_IMPORTED_MODULE_0__dynamic_link_vue__["a" /* default */]
	}
});

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


var Proxy_Object = {};

//page manager
var vueTableGrid = {};

vueTableGrid.name = "vueTableGrid";
vueTableGrid.props = ["event_hub"];

vueTableGrid.methods = {

    sort_address: function () {
        this.tab_info_list.sort(function (a, b) {
            if (a.url > b.url) return 1;
            if (a.url < b.url) return -1;
            return 0;
        });
    },
    sort_title: function () {
        this.tab_info_list.sort(function (a, b) {
            a = a.title.toLowerCase();
            b = b.title.toLowerCase();
            if (a > b) return 1;
            if (a < b) return -1;
            return 0;
        });
    },

    go: function (event) {
        var uuid = event.target.getAttribute('data-id');
        Tab_Manager.go(uuid);
    },

    close_tab: function (event) {
        var uuid = event.target.getAttribute('data-id');
        //console.log("remove tab " + uuid);            
        this.remove_tab(uuid);
        remove_by_field_value(this.tab_info_list, "my_id", uuid);
    },

    remove_tab: function (uuid) {
        Tab_Manager.remove(uuid);
    },
    create_connection_and_get_info: function () {
        //console.log(JSON.stringify(Tab_Manager), "tab manager");
        Tab_Manager.$on("get_all_tabs_info", m => {
            this.tab_info_list = m.tabinfo;
            //console.log("tabinfo " + JSON.stringify(m, null, ' '));
        });
        Tab_Manager.get_all_tabs_info();
        //console.log(JSON.stringify(Tab_Manager), "tab manager");            
    }

    /*
    remove_tab: function (uuid)
    {
        //CAVEAT! First error, cause by fact what truth tab id is uuid, 
        //but attribute named 'id'
        var command = {               
            "command": "tab", 
            "info" : "remove", 
            "id": uuid
        };
        //console.log("command : tab->remove", uuid);
        if (Proxy_Object.port.port === undefined ) console.log("WTF?");
        console.log(Proxy_Object.port);
        Proxy_Object.port.post(command);
        
    },
      create_connection_and_get_info: function ()
    {
        var self = this;
        console.log("request tabinfo");
        //get info from tab-manager and give it tab-list    
        if (Proxy_Object.port === undefined) {
            Proxy_Object.port = new Portman("tab-manager", true);
            Proxy_Object.port.process_message = function (m) {
               console.log("get tabinfo");// + JSON.stringify(m));
               self.tab_info_list = m.tabinfo;
            Proxy_Object.port.process_message = undefined;   
            }
        }
        Proxy_Object.port.post({command:"get", info:"alltabinfo"});
    },
    */

};

vueTableGrid.data = function () {
    var data = {
        tab_info_list: []
    };
    return data;
};

vueTableGrid.created = function () {
    var self = this;

    this.create_connection_and_get_info();
};

/* harmony default export */ __webpack_exports__["a"] = (vueTableGrid);

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__event_hub_js__ = __webpack_require__(1);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
    name: "UpdateForm",
    props: ["updated_record", "reshow"],
    data: function () {
        var data = {};
        data.features = false;
        data.features_title = '';
        data.message = '';
        data.new_tag = '';
        data.record = {};
        data.record.href = '';
        data.record.text = '';
        data.record.tag = '';
        data.category = '';
        data.tag_list = [];
        data.choosed_tag = '';
        data._id = '';
        if (this.$dynalinks) {
            data.category_list = this.$dynalinks.category_list;
        } else {
            data.category_list = [];
        }
        return data;
    },

    created: function () {
        this.category_list = this.$dynalinks.category_list;
        this.category = this.$dynalinks.category_list[0].href;
        //this.change_category();
        this.prepare_updated_record(this.updated_record);
        //this send empty
    },

    watch: {
        reshow: function (value) {
            this.prepare_updated_record(this.updated_record);
        },

        updated_record: function (value) {
            this.prepare_updated_record(value);
            //this not work
        },

        category: function (value) {
            var context = this.$dynalinks.categories[this.category];
            this.tag_list = context.tags;
            this.choosed_tag = context.tags[0];
        }
    },
    methods: {
        prepare_updated_record: function (value) {
            //console.log("prepare update form", value);
            if (value === undefined) {
                this.record = {
                    _id: '',
                    href: '',
                    text: '',
                    tag: ''
                };
                return;
            }

            if (value.edit) {
                this.record = {
                    _id: value.record._id,
                    href: value.record.href,
                    text: value.record.text,
                    tag: value.record.tag
                };
                this.features = this.$dynalinks.is_features(value.current_category, value.record._id);
                //console.log("is feature?", this.features)
            } else {
                this.record = {
                    _id: value._id,
                    href: value.href === undefined ? '' : value.href,
                    text: value.text === undefined ? '' : value.text,
                    tag: value.current_page === undefined ? '' : value.current_page
                };
            }

            //first set category, then tag            
            if (value.from_browser) {
                if (this.$dynalinks.categories.length > 0) {
                    this.category = this.$dynalinks.categories[0].href;
                    var tag_list = this.$dynalinks.categories[href].tags;
                    if (tag_list && tag_list.length > 0) {
                        this.choosed_tag = tag_list[0];
                    }
                }
            } else if (value.empty) {
                this.category = value.current_category;
                this.choosed_tag = value.current_page;
            } else if (value.edit) {
                this.category = value.current_category;
                this.choosed_tag = value.current_page;
            }
            this.new_tag = '';
        },
        /*
        change_category() {
            var context = this.$dynalinks.categories[this.category];
            this.tag_list = context.tags;
            this.choosed_tag = context.tags[0];
        },*/
        create_category: function (e) {
            var input = this.$refs["new_category_input"];
            var name = input.value.trim();
            if (name) {
                var response = this.$dynalinks.add_category(name);
                if (response.valid) {
                    this.category = name;
                    this.change_category(); //why ia must do it by hands? where mere reactivity?
                } else {
                    console.error(response.reason);
                }
            }
        },
        cancel: function () {
            this.$root.$emit("record->update", "reject");
        },
        validate: function () {
            if (this.new_tag === undefined) {
                this.new_tag = '';
            }
            var tag = this.tag === undefined || this.tag.trim() !== '' || this.new_tag.trim();
            var valid = tag !== '' && href.trim() !== '' && title !== '';
            if (!valid) {
                this.message = "Some of required fields is not filled!";
                return false;
            }
            this.record = {
                tag: tag,
                href: href,
                text: title
            };
            return true;
        },

        save: function () {

            if (this.message) {
                this.message = '';
            }

            var tag = this.new_tag && this.new_tag.trim();
            if (!tag) {
                tag = this.choosed_tag;
            }
            this.record.tag = tag;

            if (this.updated_record.edit) {
                this.$dynalinks.update_record(this.record, this.updated_record.current_category);
                this.$root.$emit("record->update", "accecpt", this.record);
            } else {
                var r = this.$dynalinks.add_record_to_category(this.record, this.category);
                if (r.valid) {
                    this.$root.$emit("record->create", "accept", this.record, this.category);
                    if (this.features) {
                        this.$dynalinks.add_features(this.category, this.record, this.features_title);
                    }
                } else {
                    this.$root.$emit("record->create", "reject");
                }
            }
            /*
            var dlink;
            event_hub.$emit("get_database", function (db) {
                dlink = db;
                if (dlink.add_link_to_category(self.record, category))
                {
                    this.$root.$emit("record->update", "accept");
                } else {
                    this.$root.$emit("record->update", "reject");
                }
            });
            */
        },

        change_features: function (e) {
            this.features = !this.features;

            if (this.updated_record.edit) {
                if (this.features) {
                    this.$dynalinks.add_features(this.category, this.record, this.features_title);
                } else {
                    this.$dynalinks.remove_features_by_link(this.category, this.record._id);
                }
            }
        },
        is_features: function () {
            if (this.features) return 'Remove';
            return 'Add';
        }
    },
    activated: function () {
        this.prepare_updated_record(this.updated_record);
    }

});

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_category_menu_vue__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_19b022cc_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_category_menu_vue__ = __webpack_require__(33);
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_category_menu_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_19b022cc_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_category_menu_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_dropdown_category_menu_vue__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_f3925414_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_dropdown_category_menu_vue__ = __webpack_require__(39);
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_dropdown_category_menu_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_f3925414_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_dropdown_category_menu_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_dynamic_link_vue__ = __webpack_require__(10);
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */
var __vue_template__ = null
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_dynamic_link_vue__["a" /* default */],
  __vue_template__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_error_message_vue__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0d4fd90e_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_error_message_vue__ = __webpack_require__(30);
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_error_message_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0d4fd90e_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_error_message_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_features_line_vue__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3fe2c650_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_features_line_vue__ = __webpack_require__(34);
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_features_line_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3fe2c650_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_features_line_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_page_menu_vue__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_10ae3629_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_page_menu_vue__ = __webpack_require__(31);
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_page_menu_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_10ae3629_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_page_menu_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_page_view_grid_vue__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_ee31b2d8_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_page_view_grid_vue__ = __webpack_require__(38);
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_page_view_grid_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_ee31b2d8_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_page_view_grid_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_page_view_table_vue__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_58765b20_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_page_view_table_vue__ = __webpack_require__(36);
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_page_view_table_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_58765b20_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_page_view_table_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_vue_update_form_vue__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_d9bceee6_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_vue_update_form_vue__ = __webpack_require__(37);
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_vue_update_form_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_d9bceee6_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_vue_update_form_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"top-line line-menu top-buttons"},[_c('ul',_vm._l((_vm.table.action_list),function(name){return _c('li',[_c('a',{attrs:{"href":"#"},on:{"click":function($event){$event.preventDefault();_vm.onclick($event)}}},[_vm._v(" "+_vm._s(name)+" ")]),_vm._v(" "),(_vm.table.actions[name])?_c('ul',_vm._l((_vm.table.actions[name]),function(action){return _c('li',[_c('a',{attrs:{"href":"#","data-id":action.id},on:{"click":function($event){$event.preventDefault();_vm.onclick($event)}}},[_vm._v(_vm._s(action.title))])])})):_vm._e()])}))])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"error-message",attrs:{"id":"message-block"}},[_c('h1',[_vm._v("Error")]),_vm._v(" "),_c('p',[_vm._v(_vm._s(_vm.message))])])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"buttons-headers",attrs:{"id":"page-menu"}},_vm._l((_vm.tags),function(item){return _c('GlueLink',{attrs:{"url":item,"base_url":_vm.base_url}})}))}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"app"}},[_c('DropdownCategoryMenu',{attrs:{"base_url":_vm.base_url,"category_list":_vm.category_list,"categories":_vm.categories}}),_vm._v(" "),_c('div',{staticClass:"clear-block"},[_vm._v(" ")]),_vm._v(" "),_c('FeaturesLine',{attrs:{"features":_vm.features}}),_vm._v(" "),_c('PageMenu',{attrs:{"tags":_vm.tags,"base_url":_vm.category_url}}),_vm._v(" "),_c('keep-alive',[_c(_vm.page_content_view,{tag:"component",attrs:{"updated_record":_vm.updated_record,"reshow":_vm.reshow,"message":_vm.message,"links_array":_vm.current_page,"category":this.current_category_name}})],1)],1)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"top-line top-buttons"},_vm._l((_vm.category_list),function(item){return _c('GlueLink',{attrs:{"url":item,"base_url":_vm.base_url}})}))}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('div',{staticClass:"features-line",attrs:{"id":"favorites-menu"}},_vm._l((_vm.features),function(item){return _c('a',{staticClass:"features-button",attrs:{"href":item.href}},[_vm._v(_vm._s(item.text)+"\n\t\t")])}))])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('table',{staticClass:"vueTableGrid",attrs:{"cellpadding":"10","border":"1"}},[_c('thead',[_c('tr',[_c('th',[_c('span',{on:{"click":_vm.sort_address}},[_vm._v(" Address ")])]),_vm._v(" "),_c('th',[_c('span',{on:{"click":_vm.sort_title}},[_vm._v(" Title ")])]),_vm._v(" "),_c('th',[_vm._v("Close tab")]),_vm._v(" "),_c('th',[_vm._v("Go")])])]),_vm._v(" "),_c('tbody',_vm._l((_vm.tab_info_list),function(item){return _c('tr',[_c('td',[_c('a',{attrs:{"href":item.url}},[_vm._v(_vm._s(item.url))])]),_vm._v(" "),_c('td',[_vm._v(_vm._s(item.title))]),_vm._v(" "),_c('td',{key:item.id,staticStyle:{},on:{"click":_vm.close_tab}},[_c('button',{attrs:{"type":"button","data-id":item.my_id}},[_vm._v("X")])]),_vm._v(" "),_c('td',{key:item.id,staticStyle:{}},[_c('button',{attrs:{"type":"button","data-id":item.my_id},on:{"click":_vm.go}},[_vm._v("Go")])])])}))])])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('p',[_vm._v("результаты поиска")]),_vm._v(" "),_c('h3',[_vm._v("Найдено "),_c('span',[_vm._v(" "+_vm._s(_vm.page_content.results.length)+" ")]),_vm._v(" записей ")]),_vm._v(" "),_c('table',{staticClass:"search-result"},[_vm._m(0),_vm._v(" "),_c('tbody',_vm._l((_vm.page_content.results),function(item){return _c('tr',[_c('td',[_c('a',{attrs:{"href":item.item.href}},[_vm._v(" "+_vm._s(item.item.text)+" ")])]),_vm._v(" "),_c('td',[_vm._v(_vm._s(item.item.tag))]),_vm._v(" "),_c('td',[_vm._v(_vm._s(item.category))]),_vm._v(" "),_c('td',[_c('dynamic-link',{attrs:{"fragments":[item.category,item.item.tag],"text":item.item.text,"base_url":'#view'}})],1)])}))])])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('thead',[_c('tr',[_c('td',[_vm._v("Ссылка")]),_vm._v(" "),_c('td',[_vm._v("Страница")]),_vm._v(" "),_c('td',[_vm._v("Категория")]),_vm._v(" "),_c('td',[_vm._v("Показать на странице")])])])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"update-form",attrs:{"id":"update-form"}},[_c('h3',[_vm._v("Create new record")]),_vm._v(" "),_c('div',{staticClass:"required-fields fields"},[_c('h3',[_vm._v("Required fields")]),_vm._v(" "),_c('p',[_vm._v("Address  "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.record.href),expression:"record.href"}],attrs:{"type":"text","size":"60"},domProps:{"value":(_vm.record.href)},on:{"input":function($event){if($event.target.composing){ return; }_vm.record.href=$event.target.value}}})]),_vm._v(" "),_c('p',[_vm._v("Title  "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.record.text),expression:"record.text"}],attrs:{"type":"text","size":"60"},domProps:{"value":(_vm.record.text)},on:{"input":function($event){if($event.target.composing){ return; }_vm.record.text=$event.target.value}}})])]),_vm._v(" "),_c('div',{staticClass:"category-panel"},[_c('label',[_vm._v(" Select category")]),_vm._v(" "),_c('select',{directives:[{name:"model",rawName:"v-model",value:(_vm.category),expression:"category"}],on:{"change":[function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); _vm.category=$event.target.multiple ? $$selectedVal : $$selectedVal[0]},_vm.change_category]}},_vm._l((_vm.category_list),function(item){return _c('option',{domProps:{"value":item.href}},[_vm._v(" "+_vm._s(item.text))])})),_vm._v(" "),_c('label',[_vm._v("or create new ")]),_c('input',{ref:"new_category_input",attrs:{"type":"text","id":"new_category_input"}}),_vm._v(" "),_c('button',{attrs:{"type":"button"},on:{"click":_vm.create_category}},[_vm._v("Create")]),_vm._v(" "),_c('p',[_vm._v("select tag\n        "),_c('select',{directives:[{name:"model",rawName:"v-model",value:(_vm.choosed_tag),expression:"choosed_tag"}],on:{"change":function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); _vm.choosed_tag=$event.target.multiple ? $$selectedVal : $$selectedVal[0]}}},_vm._l((_vm.tag_list),function(tag){return _c('option',{domProps:{"value":tag}},[_vm._v(_vm._s(tag))])})),_vm._v("\n        or add new "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.new_tag),expression:"new_tag"}],ref:"tag_input",attrs:{"type":"text","id":"tag_input"},domProps:{"value":(_vm.new_tag)},on:{"input":function($event){if($event.target.composing){ return; }_vm.new_tag=$event.target.value}}})])]),_vm._v(" "),_c('div',{staticClass:"button-panel"},[_c('button',{staticClass:"save-button",attrs:{"type":"button","id":"update-form-save-button"},on:{"click":_vm.save}},[_vm._v("Save")]),_vm._v(" "),_c('button',{staticClass:"cancel-button",attrs:{"type":"button"},on:{"click":_vm.cancel}},[_vm._v("Cancel")])]),_vm._v(" "),_c('div',{staticClass:"features-buttons other-fields fields"},[_c('p',[_vm._v("\n            Features\n            "),_c('button',{attrs:{"type":"button"},on:{"click":_vm.change_features}},[_vm._v(_vm._s(_vm.is_features()))]),_vm._v("\n            Text for features "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.features_title),expression:"features_title"}],domProps:{"value":(_vm.features_title)},on:{"input":function($event){if($event.target.composing){ return; }_vm.features_title=$event.target.value}}})])])])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"tab-content",attrs:{"id":"page-content"}},[_c('div',{staticClass:"control-panel"},[_c('a',{staticClass:"edit-button link-button",attrs:{"href":""},on:{"click":function($event){$event.stopPropagation();$event.preventDefault();_vm.turn_edit($event)}}},[_vm._v(" Правка ")])]),_vm._v(" "),_c('div',{staticClass:"data-grid"},_vm._l((_vm.links_array),function(item){return _c('div',{staticClass:"editable-link"},[(_vm.edit_mode)?_c('div',{staticClass:"button-panel"},[_c('a',{key:item._id,staticClass:"edit-btn",attrs:{"href":_vm.build_update_link(item)}},[_vm._v(" Правка ")]),_vm._v(" "),_c('button',{key:item._id,staticClass:"delete-btn",attrs:{"type":"button"},on:{"click":function($event){_vm.delete_record(item._id)}}},[_vm._v(" Удалить ")])]):_vm._e(),_vm._v(" "),_c('a',{key:item._id,attrs:{"href":item.href}},[_vm._v(" "+_vm._s(item.text)+" ")])])}))])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"line-menu"},[_c('ul',{staticClass:"top-line top-buttons"},_vm._l((_vm.category_list),function(item){return _c('li',[_c('GlueLink',{attrs:{"url":item,"base_url":_vm.base_url}})],1)}))])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ })
/******/ ]);
//# sourceMappingURL=render.js.map