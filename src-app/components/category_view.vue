<template>



<div class="category-view">

    <FeaturesLine :features="features" />
    
    <PageMenu :tags="tags" :base_url="category_url" @clicktag="click_tag" /> 
    
    <PageViewGrid :links_array="links_array" :category="category_name" />

</div>
</template>


<script>
import {event_hub} from './event_hub.js';
import FeaturesLine from './features-line.vue';
import PageMenu from './page-menu.vue';
import PageViewGrid from './page-view-grid.vue';
import page_view_table from './page-view-table.vue';

export default  {
    name: "CategoryView",
    components: {
        'FeaturesLine': FeaturesLine,
		'PageMenu': PageMenu,

		'PageViewGrid': PageViewGrid,
		'page-view-table': page_view_table,
    },
    
    props: {
        page_name: {
            type: String
        },
        category: {
            type: String
        },
        base_url: {
            type: String
        }
    },
    
    
    data: function ()
    {
        return {
            links_array: [],
            category_name: '',
            features: {},
            tags: [],
            category_url: '',
            active_page_name: '',
        }
    },
    
    
    watch: {
        category: function(value, old) {
            //console.log("category changed to ", value);
            this.show_category(value);
        },
        page_name: function (value, old) {
            //console.log("page changed to ", value);
            this.show_category(this.category_name, value);
        }
    },
    
    
    created: function ()
    {
        if (this.category) {
            this.show_category(this.category, this.page_name);
        }
    },
    
    activated: function ()
    {
        this.show_category(this.category, this.page_name);
    },
    
    methods: {
        click_tag: function (tag)
        {
            //console.log("on click tag", tag);
            //this.show_category(this.category_name, tag);
        },
        
        show_category: function (category_name, page_name) 
        {
            if (!category_name) {
                category_name = this.$dynalinks.category_list[0].href;
            }
            
            var category = this.$dynalinks.categories[category_name];
            
            if (this.category_name !== category_name) {
                this.category_name = category_name;
                
                var category = this.$dynalinks.categories[category_name];
                this.tags = category.tags;
                this.features = this.$dynalinks.categories[category_name].features;
                this.category_url = this.base_url + category_name + "/";
            }

            //show first page if page_name is empty            
            if (!page_name) {
                this.active_page_name = category.tags[0];
            } else if (page_name !== this.active_page_name) {
                this.active_page_name = page_name;                
            }
            this.links_array = category.pages[this.active_page_name];
             
        }
    },
}

</script>