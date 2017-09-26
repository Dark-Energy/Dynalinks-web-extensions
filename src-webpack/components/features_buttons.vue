<template>
	<div class="features other-fields fields">
        <h4>Features</h4>
        <p>            
            <button type="button" @click="click_button">{{is_feature()?"Remove":"Add"}}</button>
            Text for features <input v-model="title" disabled="false">
        </p>
	</div>    
</template>

<script>
export default {
    name: "FeaturesButtons",
    props: ["category", "id", "title", "url"]
    methods: {
        is_feature: function (e)
        {
            
        },
        click_button: function (e)
        {
            this.added = !this.added;
            if (!this.id) {
                not_created_yet = true;
            }
        }
    }
}
</script>