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
    
</div>
</template>



<script>


import {event_hub} from './event_hub.js';



export default {
    name: "UpdateForm",
	props: ["updated_record"],
	data: function () {
		var data = {};
		data.message = '';
		data.new_tag = '';
        data.record = {};
        data.record.href = '';
        data.record.text = '';
        data.record.tag = '';
        data.category = '';
        data.tag_list = [];
        data.choosed_tag = '';
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
        this.change_category();
        this.prepare_updated_record(this.updated_record);
        console.log("created");
        //this send empty
    },
    
    watch: {
        updated_record : function (value)
        {
            this.prepare_updated_record(value);
            console.log("watch ", value);
            //this not work
        }
    },
	methods: {
        prepare_updated_record: function (value)
        {
            console.log("prepare ", value);
            if (value === undefined)
            {
                this.record = 
                {
                    href: '',
                    text: '',
                    tag: '',
                };
                return;
            }
            //create new 
            if (value._id === '') {
                this.record = 
                {
                    href: value.href === undefined ? '' : value.href,
                    text: value.text === undefined ? '' : value.text,
                    tag: value.current_page,
                }
                this.choosed_tag = value.current_page;
            }
            this.category = value.current_category;
            console.log("updated record", value);
        
        },
        
        change_category() {
            var context = this.$dynalinks.categories[this.category];
            this.tag_list = context.tags;
            this.choosed_tag = context.tags[0];
            //console.log("change category ", this.category, context);
        },
        create_category :function (e) {
            var input = this.$refs["new_category_input"];
            var name = input.value.trim();
            //console.log("create category " + name);
            if (name) {
                var response = this.$dynalinks.add_category(name);
                //console.log("create category " + name, response);
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
            var tag = this.tag.trim() !== '' || this.new_tag.trim();
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

            var tag = this.new_tag.trim();
            if (!tag){
                tag = this.choosed_tag;
            }
            this.record.tag = tag;
            var r = this.$dynalinks.add_record_to_category(this.record, this.category) 
            if (r.valid)
            {
                this.$root.$emit("record->update", "accept", this.record);
            } else {
                this.$root.$emit("record->update", "reject");
                console.log("new record rejected becaouse of " + r.reason);
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
	},
    activated: function () {
        this.new_tag = undefined;
    },

}
</script>    

