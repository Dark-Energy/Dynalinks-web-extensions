<template>



<div class="category-view">

    <FeaturesLine v-bind:features="features" />
    <PageMenu v-bind:tags="tags" v-bind:base_url="category_url" /> 

</div>
</template>


<script>
import FeaturesLine from './features-line.vue';
import PageMenu from './page-menu.vue';
import page_view_grid from './page-view-grid.vue';
import page_view_table from './page-view-table.vue';

</script>