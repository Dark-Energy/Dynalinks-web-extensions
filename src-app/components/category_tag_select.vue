<template>
    <div class="category-panel">
        <label> Select category</label>
        <select v-model="choosed_category" @change="change_category">
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
</template>

<script>
export default 
{
    name: 'CategoryTagSelectPanel',
    props: ["category", "tag"],
    
    data : function () {
        return {
            choosed_tag: '',
            choosed_category: '',
            tag_list: [],
            category_list: [],
            new_tag: '',
        }
    },
    
    created: function ()
    {
        this.category_list = this.$dynalinks.category_list;
        this.choosed_category = this.category_list[0].href;
        this.change_category();
    },
    
    watch: {
        category: function (value) 
        {
            if (value) {
                this.choosed_category = value;
            }
        },
        tag: function (value) {
            if (value) {
                this.choosed_tag = value;
            }
        }
    },
    
    
    methods: {
        change_category() {
            var context = this.$dynalinks.categories[this.choosed_category];
            this.tag_list = context.tags;
            this.choosed_tag = context.tags[0];
        },
        create_category :function (e) {
            var input = this.$refs["new_category_input"];
            var name = input.value && input.value.trim();
            if (name) {
                var response = this.$dynalinks.add_category(name);
                if (response.valid) {
                    this.choosed_category = name;
                    this.change_category(); 
                } else {
                    console.error(response.reason);
                }
            }
        },
        get_tag: function ()
        {
            if (this.new_tag && this.new_tag.trim() !== '') 
                return this.new_tag;
            return this.choosed_tag;
        },
        get_category: function ()
        {
            return this.choosed_category;
        }
    }
}
</script>