<template>
<div class="update-form" id="update-form">
	<h3>Create new record</h3>
	<div class="required-fields fields"> 
        <h3>Required fields</h3>
        <p>Address  <input type="text" v-model="record.href" size=60></p>
        <p>Title  <input type="text" v-model="record.text" size=60></p>
    </div>
    <div class="category-panel">
        <label> Select category</label>
        <select v-model="category" @change="change_category">
            <option v-for="item in category_list" :value="item.href"> {{item.text}}</option>
        </select>
        <label>or create new </label><input type="text" id="new_category_input" ref="new_category_input" />
        <button type="button" @click="create_category">Create</button>
        <p>select tag
        <select v-model="choosed_tag">
            <option v-for="tag in tag_list" :value="tag">{{tag}}</option>
        </select>
        or add new <input type="text" id="tag_input" ref="tag_input" v-model="new_tag"/>
        </p>
    </div>
    <div class="button-panel">
        <button class="save-button" type="button" v-on:click="save" id="update-form-save-button">Save</button>
        <button class="cancel-button" type="button" v-on:click="cancel">Cancel</button>
    </div>
	<div class="features-buttons other-fields fields">
        <p>
            Features
            <button type="button" @click="change_features">{{is_features()}}</button>
            Text for features <input v-model="features_title">
        </p>
	</div>    
    
</div>
</template>



<script>


import {event_hub} from './event_hub.js';



export default {
    name: "UpdateForm",
	props: ["updated_record"],
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
    
    created: function ()
    {
        this.category_list = this.$dynalinks.category_list;
        this.category = this.$dynalinks.category_list[0].href;
        //this.change_category();
        this.prepare_updated_record(this.updated_record);
        //this send empty
    },
    
    watch: {
        updated_record : function (value)
        {
            this.prepare_updated_record(value);
            //this not work
        },
        
        category: function (value)
        {
            var context = this.$dynalinks.categories[this.category];
            this.tag_list = context.tags;
            this.choosed_tag = context.tags[0];
        }
    },
	methods: {
        prepare_updated_record: function (value)
        {
            if (value === undefined  )
            {
                this.record = 
                {
                    _id : '',
                    href: '',
                    text: '',
                    tag: '',
                };
                return;
            }

            if (value.edit)  {
                this.record = {
                    _id: value.record._id,
                    href: value.record.href,
                    text: value.record.text,
                    tag: value.record.tag,
                };
            }
            else {
                this.record = 
                {
                    _id: value._id,
                    href: value.href === undefined ? '' : value.href,
                    text: value.text === undefined ? '' : value.text,
                    tag: value.current_page === undefined ? '': value.current_page,
                }
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
        
        },
        /*
        change_category() {
            var context = this.$dynalinks.categories[this.category];
            this.tag_list = context.tags;
            this.choosed_tag = context.tags[0];
        },*/
        create_category :function (e) {
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
        validate: function ()
        {
            if (this.new_tag === undefined) {
                this.new_tag = '';
            }
            var tag = this.tag === undefined || this.tag.trim() !== '' || this.new_tag.trim();
            var valid =(tag !== '' && href.trim() !== '' && title !== '');
            if (!valid) {
				this.message = "Some of required fields is not filled!";
                return false;
			} 
            this.record = 
            {
                tag : tag,
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
            if (!tag){
                tag = this.choosed_tag;
            }
            this.record.tag = tag;
            
            if (this.updated_record.edit) {
                this.$dynalinks.update_record(this.record, this.updated_record.current_category);
                this.$root.$emit("record->update", "accecpt", this.record);
            }
            else {
                var r = this.$dynalinks.add_record_to_category(this.record, this.category) 
                if (r.valid)
                {
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
        
        change_features: function (e)
        {
            this.features = !this.features;
        },
        is_features: function ()
        {
            if (this.features) 
                return 'Remove';
            return 'Add';
        }
	},
    activated: function () {
        this.new_tag = undefined;
    },

}
</script>    

