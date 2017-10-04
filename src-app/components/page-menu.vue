<template>
<div class="buttons-headers" id="page-menu"> 
	<GlueLink v-for="item in tags" :url="item" :base_url="base_url" v-on:click.native="onclick" :data-tag="item"/>

</div>
</template>
 
<script>


import GlueLink from './glue_link.vue'
export default {
	name : 'page-menu',
	props: ["base_url",	"tags"],
	components: {
		'GlueLink': GlueLink
	},
    
    methods: {
        onclick: function (event) {
            var tag = event.target.getAttribute('data-tag');
            //console.log("click on tag", tag);            
            this.$emit("clicktag", tag);
        }
    }
    
	}
</script>
