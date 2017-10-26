<template>
<div>
    <div>
        <div>
        <button type="button" @click="close_list" :disabled="is_checked<=0"> Close all </button>
        <button type="button" @click="show_sender_dialog" :disabled="is_checked<=0">Send to</button>
        </div>
        <div class="sender-dialog" v-if="sender_dialog_visible">
            <CategoryTagSelect ref="select_category" />
            <button type="button" @click="sender_dialog_ok" > OK </button> 
            <button type="button" @click="hide_sender_dialog">Cancel</button> 
            <p>
            <button type="button" @click="save_and_close_tab">Save and Close Tab</button> 
            </p>
        </div>
    </div>
    <table cellpadding="10" border="1" class="vueTableGrid" @click="click_on_table">
        <thead class="tab-list-header">
        <tr>
            <th>
            Select
            </th>
            <th>
            <button type="button" @click="sort_position"> Sort by Position </button>
            </th>
            <th>
            <button type="button" v-on:click="sort_address"> Sort by Address </button>
            </th>
            <th>
            <button type="button" v-on:click="sort_title"> Sort by Title </button>
            </th>
            <th>Close tab</th>
            <th>Go</th>
            <th>Save</th>
        </tr>
        </thead>
        <tbody class="tab-list-body">
        <tr v-for="item in tab_info_list" :key="item.my_id">
            <td><input type="checkbox" :data-id="item.my_id" /> </td>
            <td>{{item.index}}</td>
            <td>{{item.url}}</td>
            <td>{{item.title}}</td>
            <td @click="close_tab" :key="item.id" style="grid-tab">
                <button type="button" :data-id="item.my_id">X</button>
            </td>
            <td :key="item.id" style="grid-tab">
                <button type="button" @click="go" :data-id="item.my_id">Go</button>
            </td>
            <td>
                <button type="button" @click="save_tab" :data-id="item.my_id">
                    Add
                </button>
            </td>
        </tr>
        </tbody>
    </table></div>
</template>


<script>

import CategoryTagSelect from './category_tag_select.vue';

//page manager
var vueTableGrid = {};

   vueTableGrid.name = "vueTableGrid";
   vueTableGrid.props = ["event_hub"];
   
   vueTableGrid.components = {
        'CategoryTagSelect': CategoryTagSelect,
   };

    vueTableGrid.data = function ()
    {
        var data = 
        {
            tab_info_list: [],
            is_checked: 0,
            checked_list: [],
            checked_hash: {},
            display_list: [],
            sender_dialog_visible: false,
        }
        return data;
    }

   
 
    vueTableGrid.methods =
    {
        
        show_sender_dialog: function ()
        {
            this.sender_dialog_visible = true;
        },
        
        hide_sender_dialog: function ()
        {
            this.sender_dialog_visible = false;
        },
        
        sort_position: function ()
        {
            this.sorter.sort_by_key(this.tab_info_list, 'index');
        },
        
        sort_address: function ()
        {
            //remove protocol
            function prepare(x) {
                return x.replace(/^([a-z]+?\:\/\/)/, '');
            }
            this.sorter.sort_by_key(this.tab_info_list, 'url', prepare);
        },
        
        sort_title: function () 
        {
            function prepare(x) {
                return x.toLowerCase();
            }
            this.sorter.sort_by_key(this.tab_info_list, 'title', prepare);
        },

        click_on_table: function (event) 
        {
            var elem = event.target;
            if (elem.type === "checkbox") {
                var uuid = elem.getAttribute("data-id");
                if (uuid) {
                    if (!!elem.checked) {
                        if (!this.checked_hash[uuid]) {
                            this.checked_hash[uuid] = true;                            
                        }
                        this.is_checked += 1;
                    } else {
                        this.checked_hash[uuid] = undefined;
                        if (this.is_checked-1 >= 0) {
                            this.is_checked -= 1;                        
                        }
                    }
                }
            }
            
        },
        
        map_checked_hash_to_list: function ()
        {
            return filter_list_by_dict(this.tab_info_list, this.checked_hash, 'my_id');
        },
        
        save_checked_list: function (e)
        {
            var sel = this.$refs["select_category"];
            var cat = sel.get_category();
            var tag = sel.get_tag();

            var checked_list = this.map_checked_hash_to_list();
            
            var record_list = [];
            for(var i = 0; i < checked_list.length; i++) {
                var item = checked_list[i];
                var record = {
                    href: item.url,
                    text: item.title,
                    tag: tag
                };
                record_list.push(record);
            }
            if (record_list.length > 0) {
                this.$dynalinks.add_list_of_records_to_category(record_list, cat);
            }
        },
        
        private_save_tab: function (uuid)
        {
            var sel = this.$refs["select_category"];
            var cat = sel.get_category();
            var tag = sel.get_tag();
        
            var tab = find_by_field_value(this.tab_info_list, 'my_id', uuid);
            //console.log("private save tab", tab);
            if (tab !== undefined) {
                var record = {
                    href: tab.url,
                    text: tab.title,
                    tag: tag
                };
                var r = this.$dynalinks.add_record_to_category(record, cat);
                //console.log("result of adding record");
            }
        },
        
        close_list: function (e)
        {
            every_property(this.checked_hash, (uuid) => {
                if (this.checked_hash[uuid]) {
                    this.remove_tab(uuid);
                }
             });
             this.checked_hash = {};
             this.is_checked = 0;
        },
        
       
        sender_dialog_ok: function (e) {
            //console.log("this.saved_tab.uuid", this.saved_tab.uuid);
            if (this.saved_tab_uuid !== undefined) {
                this.private_save_tab(this.saved_tab_uuid);
                this.saved_tab_uuid = undefined;
            } else {
                this.save_checked_list(e);
            }
            this.sender_dialog_visible = false;            
        },
        
        save_tab: function (event) {
            var uuid = event.target.getAttribute('data-id');
            this.saved_tab_uuid = uuid;
            this.show_sender_dialog();
        },
        
        
        save_and_close_tab: function (e) {
            this.save_checked_list();
            this.close_list();
        },
        
        go: function (event) {
            var uuid = event.target.getAttribute('data-id');
            Tab_Manager.go(uuid);
        },
        

        
        close_tab: function (event)
        {
            var uuid = event.target.getAttribute('data-id');
            this.remove_tab(uuid);
        },
        
        remove_tab: function (uuid) {
            if (this.checked_hash[uuid]) {
                this.checked_hash[uuid] = undefined;
                this.is_checked -= 1;
            }

            if (Tab_Manager.remove(uuid)) {
                remove_by_field_value(this.tab_info_list, "my_id", uuid);            
            }
        },
        create_connection_and_get_info: function ()
        {
            //console.log(JSON.stringify(Tab_Manager), "tab manager");
            Tab_Manager.$on("get_all_tabs_info", (m) => 
            {
                //JUST ASSIGN! Dont copy yet. 
                //It Directly binds Vue to Tab_Manager data properties.
                this.tab_info_list = m.tabinfo;
            });
            Tab_Manager.get_all_tabs_info();
        },
        
    }

    
    
    vueTableGrid.created = function ()
    {
        var self=this;
       
        this.create_connection_and_get_info();
        Tab_Manager.$on("record->update", (id) => {
            var i = find_index_by_field_value(this.tab_info_list, "id", id);
            if (i === -1) {
                console.error("fail update info! tab id is " + id, JSON.stringify(this.tab_info_list[0]));
                return;
            }
            var record = this.tab_info_list[i];
            //this.tab_info_list.splice(i, 1, record);
            //console.log(JSON.stringify(this.tab_info_list[i]), JSON.stringify(record));
            Vue.set(this.tab_info_list, i, record);
        });
        
        this.sorter = new Sorter();
    }

export default  vueTableGrid;
</script>    
    
    
