
<script>
import GlueLink from './glue_link.vue';

//its glue base url + item.url
//category_list = array of string (name and hash simulationesly);
export default {name: 'dropdown-category-menu',
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
        components: {
            'GlueLink': GlueLink
        },
        
}
</script>

<template>
<div class="line-menu">
   <ul class="top-line top-buttons">
        <li v-for="item in category_list">
            <GlueLink  :url="item" :base_url="base_url" />
        </li>
    </ul>
</div>
</template>

    
