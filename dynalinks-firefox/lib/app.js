function Application() {}

function Vue_Application(dlink) {
    console.log("create vue application"), this.create_database(dlink);
}

function create_vue_app(dynalinks) {
    var category_list = dynalinks.category_list, categories = dynalinks.categories;
    return category_list[0] && categories[category_list[0].href], new Vue({
        el: "#app",
        data: {
            current_category: {},
            category_url: "",
            tags: {},
            pages: {},
            current_page: {},
            current_category_name: "",
            base_url: "view/",
            category_list: category_list,
            categories: categories,
            page_content_view: "page-content-grid",
            error_message: {},
            page_content: {},
            main_page_view: "page-content-grid",
            features: {}
        },
        methods: {
            show_error: function(error) {
                this.error_message.message = error, this.page_content_view = "error-message", this.page_content = this.error_message, 
                this.current_category = {};
            },
            restore_page_view: function() {
                this.page_content_view !== this.main_page_view && (this.page_content_view = this.main_page_view);
            },
            show_update_form: function(item, category, callback, cancel) {
                this.show_category(category), this.page_content_view = "form-update", this.page_content = {
                    item: item,
                    callback: callback,
                    tags: this.tags,
                    cancel_callback: cancel
                };
            },
            check_error: function() {
                this.error_message.message && (this.error_message.message = "", this.page_content_view = "page-content-grid");
            },
            select_category: function(category) {
                this.current_category_name = category, this.current_category = this.categories[category], 
                this.tags = this.current_category.tags, this.category_url = this.base_url + category + "/", 
                this.active_page_name = "", this.features = this.current_category.favorites;
            },
            show_category: function(category) {
                this.categories[category] && category !== this.current_category_name && this.select_category(category);
            },
            show_page: function(page) {
                this.current_category_name && (this.active_page_name === page && this.page_content_view === this.main_page_view || (this.main_page_view = this.page_content_view = "page-content-grid", 
                this.restore_page_view(), this.active_page_name = page, this.current_page = this.categories[this.current_category_name].pages[page], 
                this.page_content = {
                    data: this.current_page,
                    category: this.current_category_name
                }));
            },
            show_search_result: function(results) {
                this.change_page_view("page-table-view"), this.page_content_view = "page-table-view", 
                this.page_content = {
                    results: results
                };
            },
            change_page_view: function(new_view) {
                this.main_page_view = new_view, this.show_page(this.active_page_name);
            }
        }
    });
}

function PopupForm(params) {
    this.dict = params.dict, this.selected = params.selected, this.type = params.type, 
    this.template = params.template, this.handler = params.handler, this.change_text = params.change_text, 
    this.title = params.title, this.not_escape = params.not_escape, this.text = "", 
    this.result = -1;
    var empty = !0;
    this.initialize = function() {
        if (empty) {
            Form_Fabric.not_escape = !!params.not_escape, params.form ? this.form = params.form : params.fields ? this.form = Form_Fabric.create_fields(params.fields) : this.form = Form_Fabric.create(params.type, params.value, params.dict), 
            this.create_template(params);
            var t = this.template.querySelector(".mt-input-container");
            t ? t.innerHTML = "" : ((t = document.createElement("div")).className = "mt-input-container", 
            console.log("not found mt-input-container, need create it"), this.template.appendChild(t)), 
            t.appendChild(this.form);
            var self = this;
            (t = this.template.querySelector(".edit-form-ok-btn")).onclick = function(e) {
                self._ok();
            }, (t = this.template.querySelector(".edit-form-cancel-btn")).onclick = function(e) {
                self.cancel();
            }, this.init(), empty = !1;
        }
    };
}

function ModalForm() {
    PopupForm.apply(this, arguments);
}

function register_main_menu(application) {
    var Application_Main_Menu = {
        data: function() {
            return {
                search_text: ""
            };
        },
        template: '<div class="top-line top-buttons line-menu">\t<ul>\t<li><a href="javascript:void(0);" id="button-add" v-on:click="add_item">Добавить ссылку</a></li>\t<li><a href="javascript:void(0);" id="button-create-category" v-on:click="create_category">Создать категорию</a></li>\t<li><a href="javascript:void(0);" id="button-move" v-on:click="move_page">Перенести</a></li>\t<li><a href="javascript:void(0);"> Удалить</a>\t\t<ul>\t\t\t<li><a href="javascript:void(0);" id="button-remove-tag" v-on:click="remove_page"> страницу</a></li>\t\t\t<li><a href="javascript:void(0);" id="button-remove-category" v-on:click="remove_category"> категорию</a></li>\t\t</ul>\t</li>\t<li><A href="javascript:void(0);">Экспортировать</a>\t\t<ul>\t\t<li><a href="javascript:void(0);" id="button-export-tag" v-on:click="export_page"> страницу</a></li>\t\t<li><a href="javascript:void(0);" id="button-export-category" v-on:click="export_category"> категорию </a>\t</li>\t\t</ul>\t</li>\t\x3c!--li><a href="javascript:void(0);" id="button-edit-page" v-on:click="edit_mode">Правка</a></li--\x3e\t<li><a href="javascript:void(0);" id="button-save" v-on:click="save_to_ls"> Сохранить локально</a></li>\t<li><a href="javascript:void(0);" id="button-save" v-on:click="save_all"> Сохранить в файл</a></li>\t<li><a href="javascript:void(0);" id="button-save" v-on:click="clear_ls"> Очистить хранилище</a></li>\t<li><input type="text" id="search-box" v-model="search_text" placeholder="искать..."><button type="button" id="search-button" v-on:click="search_record">искать</button></li>\t</ul></div>',
        methods: {
            clear_ls: function() {
                application.clear_ls();
            },
            save_to_ls: function() {
                application.save_to_ls();
            },
            save_all: function() {
                application.save_to_file();
            },
            add_item: function() {
                application.add_item();
            },
            create_category: function() {
                application.create_category();
            },
            remove_page: function() {
                application.remove_tag();
            },
            remove_category: function() {
                application.remove_category();
            },
            move_page: function() {
                application.move_tag();
            },
            export_category: function() {
                application.export_category();
            },
            export_page: function() {
                application.export_tag();
            },
            search_record: function() {
                application.search(this.search_text);
            }
        }
    };
    new Vue({
        el: "#main-menu-app",
        components: {
            "application-main-menu": Application_Main_Menu
        }
    });
}

function My_Router() {
    this.routes = new Array();
}

var saveAs = saveAs || function(view) {
    "use strict";
    if (!(void 0 === view || "undefined" != typeof navigator && /MSIE [1-9]\./.test(navigator.userAgent))) {
        var get_URL = function() {
            return view.URL || view.webkitURL || view;
        }, save_link = view.document.createElementNS("http://www.w3.org/1999/xhtml", "a"), can_use_save_link = "download" in save_link, click = function(node) {
            var event = new MouseEvent("click");
            node.dispatchEvent(event);
        }, is_safari = /constructor/i.test(view.HTMLElement) || view.safari, is_chrome_ios = /CriOS\/[\d]+/.test(navigator.userAgent), throw_outside = function(ex) {
            (view.setImmediate || view.setTimeout)(function() {
                throw ex;
            }, 0);
        }, revoke = function(file) {
            setTimeout(function() {
                "string" == typeof file ? get_URL().revokeObjectURL(file) : file.remove();
            }, 4e4);
        }, dispatch = function(filesaver, event_types, event) {
            for (var i = (event_types = [].concat(event_types)).length; i--; ) {
                var listener = filesaver["on" + event_types[i]];
                if ("function" == typeof listener) try {
                    listener.call(filesaver, event || filesaver);
                } catch (ex) {
                    throw_outside(ex);
                }
            }
        }, auto_bom = function(blob) {
            return /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type) ? new Blob([ String.fromCharCode(65279), blob ], {
                type: blob.type
            }) : blob;
        }, FileSaver = function(blob, name, no_auto_bom) {
            no_auto_bom || (blob = auto_bom(blob));
            var object_url, filesaver = this, force = "application/octet-stream" === blob.type, dispatch_all = function() {
                dispatch(filesaver, "writestart progress write writeend".split(" "));
            };
            if (filesaver.readyState = filesaver.INIT, can_use_save_link) return object_url = get_URL().createObjectURL(blob), 
            void setTimeout(function() {
                save_link.href = object_url, save_link.download = name, click(save_link), dispatch_all(), 
                revoke(object_url), filesaver.readyState = filesaver.DONE;
            });
            !function() {
                if ((is_chrome_ios || force && is_safari) && view.FileReader) {
                    var reader = new FileReader();
                    return reader.onloadend = function() {
                        var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, "data:attachment/file;");
                        view.open(url, "_blank") || (view.location.href = url), url = void 0, filesaver.readyState = filesaver.DONE, 
                        dispatch_all();
                    }, reader.readAsDataURL(blob), void (filesaver.readyState = filesaver.INIT);
                }
                object_url || (object_url = get_URL().createObjectURL(blob)), force ? view.location.href = object_url : view.open(object_url, "_blank") || (view.location.href = object_url), 
                filesaver.readyState = filesaver.DONE, dispatch_all(), revoke(object_url);
            }();
        }, FS_proto = FileSaver.prototype;
        return "undefined" != typeof navigator && navigator.msSaveOrOpenBlob ? function(blob, name, no_auto_bom) {
            return name = name || blob.name || "download", no_auto_bom || (blob = auto_bom(blob)), 
            navigator.msSaveOrOpenBlob(blob, name);
        } : (FS_proto.abort = function() {}, FS_proto.readyState = FS_proto.INIT = 0, FS_proto.WRITING = 1, 
        FS_proto.DONE = 2, FS_proto.error = FS_proto.onwritestart = FS_proto.onprogress = FS_proto.onwrite = FS_proto.onabort = FS_proto.onerror = FS_proto.onwriteend = null, 
        function(blob, name, no_auto_bom) {
            return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
        });
    }
}("undefined" != typeof self && self || "undefined" != typeof window && window || this.content);

"undefined" != typeof module && module.exports ? module.exports.saveAs = saveAs : "undefined" != typeof define && null !== define && null !== define.amd && define("FileSaver.js", function() {
    return saveAs;
});

var mr;

Application.prototype.create_database = function(dinalinks) {
    console.log("Application create database..."), this.database = dynalinks.database, 
    this.dynalinks = dynalinks, this.get_database_name();
    this.initialize() && this.initialize();
}, Application.prototype.remove_item = function(id) {
    var self = this;
    new PopupForm({
        type: "label",
        value: "Правда удалить?",
        handler: function(value) {
            self.dynalinks.remove_by_id(id);
        }
    }).show();
}, Application.prototype.move_tag = function() {
    var params = {};
    params.title = "Перенести страницу в другую категорию", params.type = "custom", 
    params.dict = this.dynalinks.names, params.fields = [ {
        type: "select",
        dict: this.dynalinks.names,
        "data-value": "category"
    }, {
        type: "text",
        "data-value": "new_category"
    } ];
    var self = this;
    params.handler = function(value) {
        var tag = self.dynalinks.context.current_tag, source_category = self.dynalinks.context.category_name, new_category = value.new_category || value.category;
        self.dynalinks.move_tag(tag, source_category, new_category), mr.navigate(self.dynalinks.create_url(new_category, tag), !0);
    }, new PopupForm(params).show();
}, Application.prototype.add_item = function() {}, Application.prototype.edit_item = function(id) {
    var item = this.dynalinks.get_from_active_context(id), params = {
        type: "custom"
    }, foo = document.createElement("div"), context = {};
    context.tags = this.dynalinks.context.tags, context.item = item, ko.renderTemplate("edit-item-template", context, {}, foo), 
    params.form = foo;
    var self = this;
    params.handler = function(value) {
        var result = self.dynalinks.update_item(item, value);
        mr.navigate(self.dynalinks.create_url(result.category, result.tag), !0);
    }, new PopupForm(params).show();
}, Application.prototype.turn_edit = function() {
    "page_view" === this.dynalinks.display.mode ? this.dynalinks.display.mode = "page_edit" : this.dynalinks.display.mode = "page_view", 
    this.dynalinks.show_page(this.dynalinks.context.current_tag);
}, Application.prototype.export_category = function() {
    this.dynalinks.export_category(this.dynalinks.context.category_name);
}, Application.prototype.export_tag = function() {
    this.dynalinks.export_tag(this.dynalinks.context.category_name, this.dynalinks.context.current_tag);
}, Application.prototype.remove_category = function() {
    var params = {
        type: "label",
        value: "Правда удалить эту категорию?"
    }, self = this;
    params.handler = function(value) {
        self.dynalinks.remove_category(self.dynalinks.context.category_name);
        var key = get_first_key(self.dynalinks.names);
        mr.navigate(self.dynalinks.create_url(key), !0);
    }, new PopupForm(params).show();
}, Application.prototype.remove_tag = function() {
    var params = {
        type: "label",
        value: "Правда удалить эту страницу?"
    }, self = this;
    params.handler = function(value) {
        self.dynalinks.remove_tag(self.dynalinks.context.category_name, self.dynalinks.context.current_tag), 
        mr.navigate(self.dynalinks.create_url(self.dynalinks.context.category_name), !0);
    }, new PopupForm(params).show();
}, Application.prototype.create_category = function() {
    var params = {};
    params.type = "text", params.title = "Название новой папки";
    var self = this;
    params.handler = function(value) {
        self.dynalinks.add_category(value), mr.navigate(self.dynalinks.create_url(value), !0);
    }, new PopupForm(params).show();
}, Application.prototype.move_item = function() {}, Application.prototype.search = function(text) {
    var value = text.trim();
    value && mr.navigate(create_url("search", value), !0);
}, Application.prototype.show_search_results = function(value) {
    var context = {
        results: this.dynalinks.search([ "text", "href" ], value)
    }, view = document.getElementById("page-content");
    ko.cleanNode(view), view.innerHTML = "", ko.renderTemplate("template-search-result", context, {}, view);
}, Application.prototype.init_router = function() {}, Application.prototype.get_database_name = function() {
    return "dynalinks_" + new Date().dateString + "_.txt";
}, Application.prototype.save_to_file = function(filename) {
    this.dynalinks.save_to_file(filename || this.Save_Filename);
}, Application.prototype.initialize = function() {
    this.init_router(), this._child_init && this._child_init();
}, console.log("run run.js!");

var event_bus;

Vue_Application.prototype = Object.create(Application.prototype), Vue_Application.prototype.constructor = Vue_Application, 
Vue_Application.prototype.initialize = function() {
    event_bus = new Vue(), console.log("create vue app"), register_main_menu(this), 
    console.log("create main application"), console.log("dynalinks is true?", void 0 !== this.dynalinks.categories.English), 
    this.vue = create_vue_app(this.dynalinks), this.init_router();
    var self = this;
    event_bus.$on("delete-record", function(id) {
        self.remove_item(id);
    }), event_bus.$on("create_category", function(name) {
        self.dynalinks.add_category(name);
    });
}, Vue_Application.prototype.clear_ls = function() {
    delete localStorage.Dynalinks;
}, Vue_Application.prototype.save_to_ls = function() {
    var text = this.dynalinks.toJSON();
    localStorage.setItem("Dynalinks", text);
}, Vue_Application.prototype.add_item = function() {
    var context = this.dynalinks.get_active_context();
    if (context) {
        var category = context.category_name;
        mr.navigate("add/" + category, !0);
    } else console.log("Error add record! Category not found!", this.dynalinks.category_name);
}, Vue_Application.prototype.turn_edit_mode = function() {
    "grid-edit" === this.vue.main_page_view ? this.vue.change_page_view("page-content-grid") : this.vue.change_page_view("grid-edit");
}, Vue_Application.prototype.show_category_page = function(category, page) {
    if (category && this.vue.categories[category]) if (this.vue.current_category && this.vue.current_category !== category && (this.dynalinks.set_category(category), 
    this.vue.show_category(category)), page) this.dynalinks.set_page(page), this.vue.show_page(page); else {
        var name = this.dynalinks.get_first_page_from_category(category);
        this.dynalinks.set_page(name), this.vue.show_page(name);
    } else console.log("Error! Category " + category + " not found!"), console.log("Either: 1) category " + category + " is wrong"), 
    console.log("2) vue.categories not containt this category", this.vue.categories[category]), 
    this.vue.show_error("Error! Category " + category + " not found!");
}, Vue_Application.prototype.show_search_result = function(value) {
    var results = this.dynalinks.search([ "text", "href" ], value);
    this.search_results = results, this.vue.show_search_result(results);
}, Vue_Application.prototype.add_record_to_category = function(category) {
    if (this.dynalinks.categories[category]) {
        var self = this, item = {
            tag: this.vue.active_page_name,
            text: "",
            href: "",
            favorite: !1,
            favorite_text: ""
        };
        this.vue.show_update_form(item, category, function(value) {
            var item = clone_fields(value, [ "href", "text", "tag", "favorite", "favorite_text" ]);
            self.dynalinks.add_link_to_category(item, category);
            var tag = item.tag;
            mr.navigate(self.dynalinks.create_url(category, tag), !0);
        }, function() {
            mr.navigate(self.dynalinks.create_url(category), !0);
        });
    } else this.vue.show_error("Category " + category + " not found!");
}, Vue_Application.prototype.update_record = function(category, id) {
    var self = this, context = self.dynalinks.categories[category];
    if (context) {
        var record = context.hash[id];
        if (record) {
            var tag = record.tag, item = (record.favorite, create_clone_object(record));
            self.vue.show_update_form(item, category, function(value) {
                self.dynalinks.update_item(record, item), mr.navigate(self.dynalinks.create_url(category, value.tag), !0);
            }, function() {
                mr.navigate(self.dynalinks.create_url(category, tag), !0);
            });
        } else console.log("Error update record!");
    } else console.log("Error update record!");
}, Vue_Application.prototype.init_router = function() {
    var self = this;
    (mr = new My_Router()).add_route("view/:category", this.show_category_page, this), 
    mr.add_route("view/:category/:page", this.show_category_page, this), mr.add_route("update/:category/:id", this.update_record, this), 
    mr.add_route("add/:category", this.add_record_to_category, this), mr.add_default(function(url) {
        name = self.vue.category_list[0] && self.vue.category_list[0].href, this.show_category_page(name);
    }, this), mr.add_route("search/:value", function(value) {
        self.show_search_result(decodeURIComponent(value));
    }, this), mr.start(!0);
}, Vue_Application.prototype.create_empty_database = function() {
    return {
        database: {
            unknown: []
        },
        names: {
            unknown: "unknown"
        },
        features: {}
    };
}, Vue_Application.prototype.get_database_normal = function() {
    var container, database = void 0;
    if ("object" == typeof window ? container = window : "object" == typeof global && (container = global), 
    container && container.my_links && (console.log("trying load my_links from global"), 
    void 0 !== (database = container.my_links) && console.log("This is done! Data readed from global!", database)), 
    void 0 === database && console.error("global not contains my_links. Sorry. One attempt leaves."), 
    localStorage.Dynalinks) {
        console.log("trying read database from localStorage"), container.old_my_links = database;
        var text = localStorage.Dynalinks;
        (database = JSON.parse(text)) || (console.error("Sorry, localStorage not contains data"), 
        database = void 0);
    }
    return void 0 === database && (console.log("Error! database is undefined! Created empty database!"), 
    database = this.create_empty_database()), database;
}, Vue_Application.prototype.write_test_data_to_storage = function(data) {
    this.ITS_EXTENSION && (data.key_name = this.key_name, (data = {})[this.key_name] = this.database, 
    browser.storage.local.set(data));
}, Vue_Application.prototype.find_database = function(callback, error) {
    function fail(err) {
        console.log("failed to read database from browser.storage.local", err), error();
    }
    var self = this;
    this.ITS_EXTENSION && "undefined" != typeof browser ? (console.log("trying load from browser.local.storage" + this.key_name), 
    browser.storage.local.get(this.key_name).then(function(data) {
        console.log("database opened");
        var key_name = data.key_name;
        key_name === self.key_name ? (console.log("this is true database", data), callback(data.db)) : fail("is not true database \n Name 'key_name' must be " + self.key_name + "\n However found " + key_name + "\nDump database down \n " + JSON.stringify(data));
    }, fail)) : fail("this is not extension!");
}, console.log("app create"), console.log(JSON.stringify(My_Extension));

var App = new Vue_Application(My_Extension.Dynalinks);

console.log("end run.js!"), Vue.component("page-item", {
    props: [ "link_item" ],
    template: '<a v-bind:href="link_item.href"> {{link_item.text}} </a>'
}), Vue.component("page-content-grid", {
    props: [ "page_content" ],
    template: '<div class="tab-content" id="page-content">\t<div class="control-panel">\t\t<a href="javascript:void(0);" class="edit-button link-button" v-on:click="turn_edit">Правка</button>\t</div>    <div class="data-grid">\t<div class="editable-link" v-for="item in page_content.data">\t\t<div class="button-panel" v-if="edit_mode">\t\t\t<a class="edit-btn" v-bind:href="\'#update/\'+page_content.category + \'/\'+item._id" v-bind:key="item._id">\tПравка\t</a>\t\t\t<button type="button" class="delete-btn"  v-on:click="delete_record(item._id)" v-bind:key="item._id"> Удалить </button>\t\t</div>\t\t<a v-bind:href="item.href" v-bind:key="item._id"> {{item.text}}</a>\t</div>    </div></div>',
    data: function() {
        return {
            edit_mode: !1
        };
    },
    methods: {
        turn_edit: function(event) {
            this.edit_mode = !this.edit_mode;
        },
        delete_record: function(event) {
            event_bus.$emit("delete-record", event);
        }
    }
}), Vue.component("page-content-text", {
    props: [ "page_content" ],
    template: '<div id="page-content"> <p v-for="item in page_content"> <page-item v-bind:link_item="item" v-bind:key="item._id"> </page-item></p> </div>'
}), Vue.component("dynamic-link", {
    props: [ "base_url", "url", "fragments", "text", "params" ],
    render: function(createElement) {
        var url = this.params && this.params.href || this.url, href = "";
        return href = this.fragments && this.fragments.length > 0 ? this.fragments.join("/") : url, 
        this.base_url && (href = this.base_url + "/" + href), createElement("a", {
            attrs: {
                href: href
            }
        }, this.params && this.params.text || this.url || this.text || href);
    }
}), Vue.component("page-table-view", {
    props: [ "page_content" ],
    template: '<div><p>результаты поиска</p>\t\t<h3>Найдено <span> {{page_content.results.length}} </span> записей </h3>\t\t<table class="search-result">\t\t\t<thead>\t\t\t\t<tr>\t\t\t\t\t<td>Ссылка</td>\t\t\t\t\t<td>Страница</td>\t\t\t\t\t<td>Категория</td>\t\t\t\t\t<td>Показать на странице</td>\t\t\t\t</tr>\t\t\t</thead>\t\t\t<tbody >\t\t\t\t<tr v-for="item in page_content.results">\t\t\t\t\t<td><a v-bind:href="item.item.href"> {{item.item.text}} </a></td>\t\t\t\t\t<td >{{item.item.text}}</td>\t\t\t\t\t<td >{{item.category}}</td>\t\t\t\t\t<td> <dynamic-link v-bind:fragments="[item.category,item.item.tag]" v-bind:text="item.item.text" v-bind:base_url="\'#view\'"></dynamic-link> </td>\t\t\t\t</tr>\t\t\t</tbody>\t\t</table>\t</div>'
}), Vue.component("error-message", {
    props: [ "page_content" ],
    template: '<div id="message-block" class="error-message"><h1>Error</h1> <p>{{page_content.message}}</p></div>'
});

var event_bus = new Vue();

Vue.component("routed-link", {
    props: [ "base_url", "url" ],
    render: function(createElement) {
        var href = "#" + this.base_url, text = this.url.text || this.url;
        return this.url.href ? href += this.url.href : href += this.url, createElement("a", {
            attrs: {
                href: href
            }
        }, text);
    }
}), Vue.component("category-menu", {
    props: [ "category_list", "base_url" ],
    template: '<div class="top-line top-buttons">\t\t<routed-link v-for="item in category_list" v-bind:url="item" v-bind:base_url="base_url"> </routed-link>\t\t</div>'
}), Vue.component("dropdown-category-menu", {
    props: [ "category_list", "base_url", "categories" ],
    template: '<div class="line-menu">        <ul class="top-line top-buttons">        <li v-for="item in category_list">            <routed-link  v-bind:url="item" v-bind:base_url="base_url"> </routed-link>            <ul v-if="categories[item.href]" class="submenu">                <li v-for="link in categories[item.href].favorites">                    <a :href="link.href">{{link.favorite_text || link.text}}</a>                </li>            </ul>        </li>\t\t</ul></div>'
}), Vue.component("features-line", {
    props: [ "features" ],
    template: '<div ><div class="features-line" id="favorites-menu">\t<a class="features-button" v-for="item in features" v-bind:href="item.href">{{item.favorite_text}}</a></div></div>'
}), Vue.component("page-menu", {
    props: [ "base_url", "tags" ],
    template: '<div class="buttons-headers" id="page-menu"> <routed-link v-for="item in tags" v-bind:url="item" v-bind:base_url="base_url"> </routed-link> </div>'
}), Vue.component("form-update", {
    props: [ "page_content" ],
    methods: {
        cancel: function() {
            this.page_content.cancel_callback ? this.page_content.cancel_callback() : console.log("Error cancel add new record! Not given cancel callback!");
        },
        save: function() {
            this.message && (this.message = ""), (this.page_content.item.tag || this.new_tag) && this.page_content.item.href && this.page_content.item.text ? (this.page_content.item.tag = this.new_tag || this.page_content.item.tag, 
            this.page_content.callback && this.page_content.callback(this.page_content.item)) : this.message = "Одно или несколько обязательных полей не заполнены!";
        },
        is_favorite: function() {
            return this.page_content.item.favorite = !!this.page_content.item.favorite, !!this.page_content.item.favorite;
        },
        change_favorite: function() {
            this.my_features = this.page_content.item.favorite = !this.page_content.item.favorite, 
            this.my_features && !this.page_content.item.favorite_text ? this.page_content.item.favorite_text = this.page_content.item.text : this.my_features || (this.page_content.item.favorite_text = "");
        }
    },
    activated: function() {
        this.my_features = this.is_favorite(), this.new_tag = void 0;
    },
    data: function() {
        var data = {};
        return data.message = "", data.new_tag = void 0, data.my_features = !1, data.page_content = {}, 
        data;
    },
    template: '\t<div class="update-form" id="update-form">\t<h3>Создание новой записи</h3>\t<div v-if="message" class="warning-message">{{message}}</div>\t<div class="required-fields fields"> <h3>Обязательно заполните эти поля</h3>\tАдрес <br><input type="text" v-model="page_content.item.href" size=60>\t<p> Текст <br> <input type="text" v-model="page_content.item.text" size=60>\t<p> Выберите тег <select class="select-tag" v-model="page_content.item.tag"> <option v-for="tag in page_content.tags" v-bind:value="tag"> {{tag}} </otion> </select>\tили создайте новый <input type="text" v-model="new_tag">\t</div>    <div class="button-panel">\t<button class="save-button" type="button" v-on:click="save" id="update-form-save-button">Save</button>\t<button class="cancel-button" type="button" v-on:click="cancel">Отмена</button>    </div>\t<div class="other-fields fields">\t<p>Избранное <button type="button" v-on:click="change_favorite">{{is_favorite()?"Remove":"Add"}}</button>\tТекст для избранного <input v-model="page_content.item.favorite_text" v-bind:disabled="!my_features">\t</div>\t</div>'
});

var Form_Fabric = {};

Form_Fabric.escape_text = function(text) {
    return this.not_escape ? text : text.replace(/'|"/g, "&quot;").replace(/</g, "$lt;").replace(/>/g, "$gt;");
}, Form_Fabric.select = function(dict, selected) {
    var selected_is_defined = !(void 0 === selected), html = "";
    if (Array.isArray(dict)) for (var key = 0, len = dict.length; key < len; key++) html += '<option value="' + key + '"', 
    selected_is_defined && selected == key && (html += " selected "), html += ">" + dict[key] + "</option>"; else for (var key in dict) Object.prototype.hasOwnProperty.call(dict, key) && (html += '<option value="' + key + '"', 
    selected_is_defined && selected === key && (html += " selected "), html += ">" + dict[key] + "</option>");
    var form = document.createElement("select");
    return form.innerHTML = html, form;
}, Form_Fabric.text = function(value) {
    var input = document.createElement("input");
    return input.type = "text", value && (input.value = Form_Fabric.escape_text(value || "")), 
    input;
}, Form_Fabric.label = function(value) {
    var form = document.createElement("div");
    return form.className = "popup-form-static-text", form.style["text-align"] = "center", 
    form.innerHTML = "<h3>" + Form_Fabric.escape_text(value || " ") + "</h3>", form;
}, Form_Fabric.textarea = function(value) {
    var form = document.createElement("textarea");
    return value && (form.value = Form_Fabric.escape_text(value || "")), form;
}, Form_Fabric.create = function(type, value, dict) {
    var f = this[type];
    if (!f) throw type;
    return "select" === type ? f(dict, value) : f(value);
}, Form_Fabric.create_fields = function(fields) {
    for (var item, input, div, form = document.createElement("div"), i = 0; i < fields.length; i++) item = fields[i], 
    input = this.create(item.type, item.value, item.dict), "data-value" in item && input.setAttribute("data-value", item["data-value"]), 
    (div = document.createElement("div")).className = "dummy", div.appendChild(input), 
    form.appendChild(div);
    return form;
}, PopupForm.prototype.make_unique = function() {
    this.constructor.prototype.onshow && this.constructor.prototype.onshow.cancel(), 
    this.constructor.prototype.onshow = this;
}, PopupForm.prototype.close_unique = function() {
    this.constructor.prototype.onshow = null;
}, PopupForm.prototype.onshow = null, PopupForm.prototype.create_template = function(params) {
    if (!this.template) {
        this.template = document.createElement("div"), this.template.className = "edit-form-container", 
        this.template.style["background-color"] = "#FFFFFF";
        var html = this.title ? '<h3 class="edit-form-title">' + this.escape_text(this.title) + "</h3>" : "";
        html += '<div class="mt-input-container"></div><button class="edit-form-ok-btn">ОК</button><button class="edit-form-cancel-btn">Отмена</button>', 
        this.template.innerHTML = html, this.template.style.background_color = "#FFFFFF", 
        this.template.style.padding = "5px", this.template.style["box-shadow"] = "0 0 10px rgba(0,0,0,0.5)";
    }
    this.template.style.position = "fixed";
}, PopupForm.prototype.escape_text = function(text) {
    return text.replace(/'|"/g, "&quot;").replace(/</, "$lt;").replace(/>/, "$gt;");
}, PopupForm.prototype.init = function() {
    var self = this;
    self.template.onkeydown = function(e) {
        switch (e.keyCode) {
          case 27:
            self.cancel();
            break;

          case 13:
            self._ok();
        }
    };
}, PopupForm.prototype.attach_focus = function() {
    var self = this;
    self.template.on("blur", function(e) {
        self.cancel();
    });
}, PopupForm.prototype.insert = function() {
    this.template.style.display = "block", document.body.appendChild(this.template);
    var w = window.innerWidth / 2 - this.template.offsetWidth / 2, h = window.innerHeight / 2 - this.template.offsetHeight / 2;
    this.template.style.left = w + "px", this.template.style.top = h + "px";
}, PopupForm.prototype.detach = function() {
    this.template.parentNode.removeChild(this.template);
}, PopupForm.prototype.save_text = function(jquery_obj) {}, PopupForm.prototype.show = function(jquery_obj) {
    this.initialize(), this.make_unique(), this.jquery_obj = jquery_obj, this.change_text && jquery_obj && this.save_text(jquery_obj), 
    this.insert(), this.result = -1, this.form.focus();
}, PopupForm.prototype.hide = function() {
    this.close_unique(), this.detach(), this.change_text && this.jquery_obj;
}, PopupForm.prototype.cancel = function() {
    this.hide();
}, PopupForm.prototype._get_values_from_inputs = function(data, inputs) {
    if (inputs) for (var key, i = 0; i < inputs.length; i++) inputs[i].hasAttribute("data-value") && (key = inputs[i].getAttribute("data-value"), 
    "checkbox" === inputs[i].type ? data[key] = !!inputs[i].checked : "text" == inputs[i].type ? this.not_escape ? data[key] = inputs[i].value : data[key] = this.escape_text(inputs[i].value) : data[key] = inputs[i].value);
}, PopupForm.prototype._get_value = function() {
    var value;
    return "custom" === this.type ? (value = {}, this._get_values_from_inputs(value, this.form.querySelectorAll("input")), 
    this._get_values_from_inputs(value, this.form.querySelectorAll("select")), this._get_values_from_inputs(value, this.form.querySelectorAll("textarea"))) : "select" === this.type ? value = this.form.options[this.form.selectedIndex].value : "text" === this.type ? (value = this.form.value, 
    this.not_escape || (value = this.escape_text(value))) : "textarea" === this.type && (value = this.form.value, 
    this.not_escape || (value = this.escape_text(value))), value;
}, PopupForm.prototype._ok = function() {
    value = this._get_value(), this.hide(), this.handler && this.handler(value) && (this.result = value, 
    this.text = this.dict ? this.dict[value] : value);
}, ModalForm.prototype = Object.create(PopupForm.prototype), ModalForm.prototype.constructor = ModalForm, 
ModalForm.prototype.onShow = null, ModalForm.prototype.create_template = function(params) {
    if (!this.template) {
        this.template = $('<form class="modal-edit-form-container">');
        var html = "";
        params.title && (html = '<div class="mt-edit-title"><i><h3>' + params.title + "</h3></i></div>"), 
        html += '<div class="modal-edit-form mt-input-container"></div><div><button class="inplace-edit-ok">ОК</button><button class="inplace-edit-cancel">Отмена</button></div>', 
        this.template.html(html), this.template.css({
            "background-color": "#FFFFFF"
        }), this.template.css({
            padding: "5px"
        }), this.template.css({
            "box-shadow": "0 0 10px rgba(0,0,0,0.5)"
        });
    }
    this.template.css({
        position: "absolute"
    });
}, ModalForm.prototype.insert = function() {
    $(document.body).append(this.template), this.template.css({
        display: "block"
    }), this.template.css({
        position: "fixed",
        left: "50%",
        top: "50%"
    }), this.template.css({
        "margin-left": -this.template.outerWidth() / 2 + "px",
        "margin-top": -this.template.outerHeight() / 2 + "px"
    });
}, My_Router.prototype.decode_params = function(arr) {
    for (var i = 0; i < arr.length; i++) arr[i] = decodeURIComponent(arr[i]);
}, My_Router.prototype.apply_route = function(params, route) {
    params.length > 1 && params.splice(0, 1), this.decode_params(params), route.callback.apply(route.obj, params);
}, My_Router.prototype.test_hash = function(url) {
    for (var item, groups, i = 0; i < this.routes.length; i++) if (item = this.routes[i], 
    item.re.lastIndex = 0, groups = item.re.exec(url)) return this.apply_route(groups, item), 
    !0;
    this.default_route && this.default_route.callback.apply(this.default_route.obj, [ url ]);
}, My_Router.prototype.add_default = function(callback, obj) {
    this.default_route = {
        callback: callback,
        obj: obj
    };
}, My_Router.prototype._add = function(re, callback, obj) {
    return this.routes.push({
        re: re,
        callback: callback,
        obj: obj
    });
}, My_Router.prototype.add_route = function(route, callback, obj) {
    for (var str, key, frag = route.split("/"), t = "^", keys = {}, index = 0, i = 0; i < frag.length; i++) (!(str = frag[i]) || i > 0) && (t += "/"), 
    str && (":" === str[0] ? (key = {
        index: index
    }, keys[str.slice(1)] = key, index++, t += "([^/]+?)") : t += str);
    t += "$", this._add(new RegExp(t), callback, obj);
}, My_Router.prototype.hash_change = function(e) {
    var hash = window.location.hash;
    hash && ((hash = hash.split("#")).length > 1 && (hash = hash[1]), hash && "/" == hash[0] && (hash = hash.slice(1))), 
    this.test_hash(hash);
}, My_Router.prototype.refresh = function() {
    this.hash_change();
}, My_Router.prototype.navigate = function(hash, change_location) {
    if (change_location) {
        var new_hash = "#" + hash;
        window.location.hash == new_hash ? this.test_hash(hash) : window.location.hash = new_hash;
    } else this.test_hash(hash);
}, My_Router.prototype.start = function(force_hash_change) {
    var self = this;
    window.addEventListener("hashchange", function(e) {
        self.hash_change(e);
    }, !1), force_hash_change && this.hash_change();
};