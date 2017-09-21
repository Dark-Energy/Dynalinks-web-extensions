<template>
<div class="buttons-headers" id="page-menu"> 
	<GlueLink v-for="item in tags" :url="item" :base_url="base_url" />

</div>
</template>
 
<script>
import GlueLink from './glue_link.vue'
export default {
	name : 'page-menu',
	props: ["base_url",	"tags"],
	components: {
		'GlueLink': GlueLink
	}
	}
</script>
