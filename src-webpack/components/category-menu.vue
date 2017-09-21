<template>
    <div class="top-line top-buttons">
        <GlueLink v-for="item in category_list" :url="item" :base_url="base_url" />
    </div>
</template>

<script>
import GlueLink from './glue_link.vue';

export default 
  {
		props: ['category_list', 'base_url'],
		name: 'category-menu',
		components: {
			'GlueLink': GlueLink
		},
	}
</script>

