!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(require("vue")):"function"==typeof define&&define.amd?define(["vue"],e):"object"==typeof exports?exports.DAE=e(require("vue")):t.DAE=e(t.vue)}(this,function(t){return function(t){function e(a){if(n[a])return n[a].exports;var r=n[a]={i:a,l:!1,exports:{}};return t[a].call(r.exports,r,r.exports,e),r.l=!0,r.exports}var n={};return e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,a){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:a})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=13)}([function(t,e){t.exports=function(t,e,n,a,r){var i,o=t=t||{},s=typeof t.default;"object"!==s&&"function"!==s||(i=t,o=t.default);var c="function"==typeof o?o.options:o;e&&(c.render=e.render,c.staticRenderFns=e.staticRenderFns),a&&(c._scopeId=a);var u;if(r?(u=function(t){t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,t||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),n&&n.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(r)},c._ssrRegister=u):n&&(u=n),u){var l=c.functional,_=l?c.render:c.beforeCreate;l?c.render=function(t,e){return u.call(e),_(t,e)}:c.beforeCreate=_?[].concat(_,u):[u]}return{esModule:i,exports:o,options:c}}},function(t,e,n){var a=n(0)(n(15),null,null,null,null);t.exports=a.exports},function(t,e,n){var a=n(0)(n(22),null,null,null,null);t.exports=a.exports},function(t,e,n){var a=n(0)(n(14),n(27),null,null,null);t.exports=a.exports},function(t,e,n){var a=n(0)(n(16),n(34),null,null,null);t.exports=a.exports},function(t,e,n){var a=n(0)(n(17),n(31),null,null,null);t.exports=a.exports},function(t,e,n){var a=n(0)(n(18),n(28),null,null,null);t.exports=a.exports},function(t,e,n){var a=n(0)(n(19),n(32),null,null,null);t.exports=a.exports},function(t,e,n){var a=n(0)(n(20),n(26),null,null,null);t.exports=a.exports},function(t,e,n){var a=n(0)(n(21),n(29),null,null,null);t.exports=a.exports},function(t,e,n){var a=n(0)(n(23),n(30),null,null,null);t.exports=a.exports},function(t,e,n){var a=n(0)(n(24),n(33),null,null,null);t.exports=a.exports},function(e,n){e.exports=t},function(t,e,n){"use strict";function a(t){return new c.a({el:"#main-menu-app",data:{application:t},components:{"application-main-menu":o.a}})}function r(t,e){return new c.a({el:e,dynalinks:t,components:{"page-item":l.a,"page-view-grid":v.a,"dynamic-link":p.a,"page-view-table":m.a,"page-menu":h.a,"form-update":x.a,"category-menu":k.a,"features-line":j.a,vueTableGrid:P.a}})}Object.defineProperty(e,"__esModule",{value:!0}),n.d(e,"create_vue_app",function(){return r}),n.d(e,"create_main_menu",function(){return a});var i=n(5),o=n.n(i),s=n(12),c=n.n(s),u=n(6),l=n.n(u),_=n(8),v=n.n(_),d=n(1),p=n.n(d),f=n(9),m=n.n(f),g=n(7),h=n.n(g),b=n(11),x=n.n(b),y=n(3),k=n.n(y),C=n(4),j=n.n(C),w=n(10),P=n.n(w);n.d(e,"vueTableGrid",function(){return P.a})},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=n(2),r=n.n(a);e.default={props:["category_list","base_url"],name:"category-menu",components:{"my-routed-link":r.a}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"dynamic-link",props:["base_url","url","fragments","text","params"],render:function(t){var e=this.params&&this.params.href||this.url,n="";return n=this.fragments&&this.fragments.length>0?this.fragments.join("/"):e,this.base_url&&(n=this.base_url+"/"+n),t("a",{attrs:{href:n}},this.params&&this.params.text||this.url||this.text||n)}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"features-line",props:["features"]}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"main-menu-app",data:function(){return{search_text:""}},methods:{clear_ls:function(){application.clear_ls()},save_to_ls:function(){application.save_to_ls()},save_all:function(){application.save_to_file()},add_item:function(){application.add_item()},create_category:function(){application.create_category()},remove_page:function(){application.remove_tag()},remove_category:function(){application.remove_category()},move_page:function(){application.move_tag()},export_category:function(){application.export_category()},export_page:function(){application.export_tag()},search_record:function(){application.search(this.search_text)},look_tabs:function(){application.look_tabs()}}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"page-item",props:["link_item"]}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=n(2),r=n.n(a);e.default={name:"page-menu",props:["base_url","tags"],components:{"my-routed-link":r.a}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=n(25);e.default={props:["page_content"],name:"page-view-grid",data:function(){return{edit_mode:!1}},methods:{build_update_link:function(t){return"#update/"+this.page_content.category+"/"+t._id},turn_edit:function(t){this.edit_mode=!this.edit_mode},delete_record:function(t){"object"==typeof a.a&&a.a.$emit("delete-record",t)}}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=n(1),r=n.n(a);e.default={props:["page_content"],name:"page-view-table",components:{"dynamic-link":r.a}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"my-routed-link",props:["base_url","url"],render:function(t){var e="#"+this.base_url,n=this.url.text||this.url;return this.url.href?e+=this.url.href:e+=this.url,t("a",{attrs:{href:e}},n)}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a={};a.name="vueTableGrid",a.props=["event_hub"],a.methods={creating_remove_method:function(t){void 0===this.port&&(this.port=new Portman("tab-manager"),this._inner_close_tab=function(t){this.port.post({command:"tab",info:"remove",id:t}),remove_by_field_value(this.tab_info_list,"my_id",t)})},close_tab:function(t){var e=t.target.getAttribute("data-id");this._inner_close_tab(e)},move_to:function(t){},sort_address:function(){this.tab_info_list.sort(function(t,e){return t.url>e.url?1:t.url<e.url?-1:0})},sort_title:function(){this.tab_info_list.sort(function(t,e){return t=t.title.toLowerCase(),e=e.title.toLowerCase(),t>e?1:t<e?-1:0})}},a.data=function(){return{tab_info_list:[]}},a.created=function(){var t=this;event_hub.$on("start",function(){console.log("get started"),event_hub.$emit("get",function(e){t.tab_info_list=e,console.log("callback bring info",JSON.stringify(e))})}),event_hub.$on("set->tabinfo",function(e){t.tab_info_list=e,t.creating_remove_method()})},e.default=a},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"UpdateForm",props:["page_content"],methods:{cancel:function(){this.page_content.cancel_callback?this.page_content.cancel_callback():console.log("Error cancel add new record! Not given cancel callback!")},save:function(){this.message&&(this.message=""),(this.page_content.item.tag||this.new_tag)&&this.page_content.item.href&&this.page_content.item.text?(this.page_content.item.tag=this.new_tag||this.page_content.item.tag,this.page_content.callback&&this.page_content.callback(this.page_content.item)):this.message="Одно или несколько обязательных полей не заполнены!"},is_favorite:function(){return this.page_content.item.favorite=!!this.page_content.item.favorite,!!this.page_content.item.favorite},change_favorite:function(){this.my_features=this.page_content.item.favorite=!this.page_content.item.favorite,this.my_features&&!this.page_content.item.favorite_text?this.page_content.item.favorite_text=this.page_content.item.text:this.my_features||(this.page_content.item.favorite_text="")}},activated:function(){this.my_features=this.is_favorite(),this.new_tag=void 0},data:function(){var t={};return t.message="",t.new_tag=void 0,t.my_features=!1,t.page_content={},t}}},function(t,e,n){"use strict";n.d(e,"a",function(){return a});var a={}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"tab-content",attrs:{id:"page-content"}},[n("div",{staticClass:"control-panel"},[n("a",{staticClass:"edit-button link-button",attrs:{href:"javascript:void(0);"},on:{click:t.turn_edit}},[t._v(" Правка ")])]),t._v(" "),n("div",{staticClass:"data-grid"},t._l(t.page_content.data,function(e){return n("div",{staticClass:"editable-link"},[t.edit_mode?n("div",{staticClass:"button-panel"},[n("a",{key:e._id,staticClass:"edit-btn",attrs:{href:t.build_update_link(e)}},[t._v(" Правка ")]),t._v(" "),n("button",{key:e._id,staticClass:"delete-btn",attrs:{type:"button"},on:{click:function(n){t.delete_record(e._id)}}},[t._v(" Удалить ")])]):t._e(),t._v(" "),n("a",{key:e._id,attrs:{href:e.href}},[t._v(" "+t._s(e.text)+" ")])])}))])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"top-line top-buttons"},t._l(t.category_list,function(e){return n("my-routed-link",{attrs:{url:e,base_url:t.base_url}})}))},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("a",{attrs:{href:t.link_item.href}},[t._v(" "+t._s(t.link_item.text)+" ")])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("p",[t._v("результаты поиска")]),t._v(" "),n("h3",[t._v("Найдено "),n("span",[t._v(" "+t._s(t.page_content.results.length)+" ")]),t._v(" записей ")]),t._v(" "),n("table",{staticClass:"search-result"},[t._m(0),t._v(" "),n("tbody",t._l(t.page_content.results,function(e){return n("tr",[n("td",[n("a",{attrs:{href:e.item.href}},[t._v(" "+t._s(e.item.text)+" ")])]),t._v(" "),n("td",[t._v(t._s(e.item.tag))]),t._v(" "),n("td",[t._v(t._s(e.category))]),t._v(" "),n("td",[n("dynamic-link",{attrs:{fragments:[e.category,e.item.tag],text:e.item.text,base_url:"#view"}})],1)])}))])])},staticRenderFns:[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("thead",[n("tr",[n("td",[t._v("Ссылка")]),t._v(" "),n("td",[t._v("Страница")]),t._v(" "),n("td",[t._v("Категория")]),t._v(" "),n("td",[t._v("Показать на странице")])])])}]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("table",{staticClass:"vueTableGrid",attrs:{cellpadding:"10",border:"1"}},[n("thead",[n("tr",[n("th",[n("span",{on:{click:t.sort_address}},[t._v(" Address ")])]),t._v(" "),n("th",[n("span",{on:{click:t.sort_title}},[t._v(" Title ")])]),t._v(" "),n("th",[t._v("Close tab")])])]),t._v(" "),n("tbody",t._l(t.tab_info_list,function(e){return n("tr",[n("td",[n("a",{attrs:{href:e.url}},[t._v(t._s(e.url))])]),t._v(" "),n("td",[t._v(t._s(e.title))]),t._v(" "),n("td",{key:e.id,staticStyle:{},on:{click:t.close_tab}},[n("button",{attrs:{type:"button","data-id":e.my_id}},[t._v("X")])])])}))])])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"top-line line-menu top-buttons"},[n("ul",[n("li",[n("a",{attrs:{href:"javascript:void(0);"}},[t._v(" Edit")]),t._v(" "),n("ul",[n("li",[n("a",{attrs:{href:"javascript:void(0);",id:"button-add"},on:{click:t.add_item}},[t._v("Create record")])]),t._v(" "),n("li",[n("a",{attrs:{href:"javascript:void(0);",id:"button-create-category"},on:{click:t.create_category}},[t._v(" Create  category ")])]),t._v(" "),n("li",[n("a",{attrs:{href:"javascript:void(0);",id:"button-move"},on:{click:t.move_page}},[t._v("Move page to other category")])]),t._v(" "),n("li",[n("a",{attrs:{href:"javascript:void(0);",id:"button-remove-tag"},on:{click:t.remove_page}},[t._v(" Remove page")])]),t._v(" "),n("li",[n("a",{attrs:{href:"javascript:void(0);",id:"button-remove-category"},on:{click:t.remove_category}},[t._v(" Remove category")])])])]),t._v(" "),n("li",[n("a",{attrs:{href:"javascript:void(0);"}},[t._v(" Files ")]),t._v(" "),n("ul",[n("li",[n("a",{attrs:{href:"javascript:void(0);",id:"button-save"},on:{click:t.save_all}},[t._v(" Save to file ")])]),t._v(" "),n("li",[n("a",{attrs:{href:"javascript:void(0);",id:"button-export-tag"},on:{click:t.export_page}},[t._v(" Save page ")])]),t._v(" "),n("li",[n("a",{attrs:{href:"javascript:void(0);",id:"button-export-category"},on:{click:t.export_category}},[t._v(" Save Category")])])])]),t._v(" "),n("li",[n("a",{attrs:{href:"javascript:void(0);",id:"button-save"},on:{click:t.look_tabs}},[t._v("Look tabs")])]),t._v(" "),n("li",[n("input",{directives:[{name:"model",rawName:"v-model",value:t.search_text,expression:"search_text"}],attrs:{type:"text",id:"search-box",placeholder:"search..."},domProps:{value:t.search_text},on:{input:function(e){e.target.composing||(t.search_text=e.target.value)}}}),n("button",{attrs:{type:"button",id:"search-button"},on:{click:t.search_record}},[t._v("Search")])])])])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"buttons-headers",attrs:{id:"page-menu"}},t._l(t.tags,function(e){return n("my-routed-link",{attrs:{url:e,base_url:t.base_url}})}))},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"update-form",attrs:{id:"update-form"}},[n("h3",[t._v("Создание новой записи")]),t._v(" "),t.message?n("div",{staticClass:"warning-message"},[t._v(t._s(t.message))]):t._e(),t._v(" "),n("div",{staticClass:"required-fields fields"},[n("h3",[t._v("Обязательно заполните эти поля")]),t._v("\n        Адрес "),n("br"),t._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.page_content.item.href,expression:"page_content.item.href"}],attrs:{type:"text",size:"60"},domProps:{value:t.page_content.item.href},on:{input:function(e){e.target.composing||(t.page_content.item.href=e.target.value)}}}),t._v("\n        Текст "),n("br"),t._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.page_content.item.text,expression:"page_content.item.text"}],attrs:{type:"text",size:"60"},domProps:{value:t.page_content.item.text},on:{input:function(e){e.target.composing||(t.page_content.item.text=e.target.value)}}})]),t._v(" "),n("div",{staticClass:"category-fields"},[n("p",[t._v(" Выберите тег \n            "),n("select",{directives:[{name:"model",rawName:"v-model",value:t.page_content.item.tag,expression:"page_content.item.tag"}],staticClass:"select-tag",on:{change:function(e){var n=Array.prototype.filter.call(e.target.options,function(t){return t.selected}).map(function(t){return"_value"in t?t._value:t.value});t.page_content.item.tag=e.target.multiple?n:n[0]}}},t._l(t.page_content.tags,function(e){return n("option",{domProps:{value:e}},[t._v(" "+t._s(e)+" ")])})),t._v(" \n            или создайте новый "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.new_tag,expression:"new_tag"}],attrs:{type:"text"},domProps:{value:t.new_tag},on:{input:function(e){e.target.composing||(t.new_tag=e.target.value)}}})])]),t._v(" "),n("div",{staticClass:"button-panel"},[n("button",{staticClass:"save-button",attrs:{type:"button",id:"update-form-save-button"},on:{click:t.save}},[t._v("Save")]),t._v(" "),n("button",{staticClass:"cancel-button",attrs:{type:"button"},on:{click:t.cancel}},[t._v("Отмена")])]),t._v(" "),n("div",{staticClass:"other-fields fields"},[n("p",[t._v("\n            Избранное \n            "),n("button",{attrs:{type:"button"},on:{click:t.change_favorite}},[t._v(t._s(t.is_favorite()?"Remove":"Add"))]),t._v("\n            Текст для избранного "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.page_content.item.favorite_text,expression:"page_content.item.favorite_text"}],attrs:{disabled:!t.my_features},domProps:{value:t.page_content.item.favorite_text},on:{input:function(e){e.target.composing||(t.page_content.item.favorite_text=e.target.value)}}})])])])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("div",{staticClass:"features-line",attrs:{id:"favorites-menu"}},t._l(t.features,function(e){return n("a",{staticClass:"features-button",attrs:{href:e.href}},[t._v(t._s(e.favorite_text)+"\n\t\t")])}))])},staticRenderFns:[]}}])});
//# sourceMappingURL=build.js.map