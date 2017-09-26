<template>
<div class="tab-content" id="page-content">
	<div class="control-panel">
		<a href="" class="edit-button link-button" @click.stop.prevent="turn_edit"> Правка </a>
	</div>
    <div class="data-grid">
        <div class="editable-link" v-for="item in links_array">
            <div class="button-panel" v-if="edit_mode">
                <a class="edit-btn" :href="build_update_link(item)" :key="item._id"> Правка </a>
                <button type="button" class="delete-btn"  @click="delete_record(item._id)" v-bind:key="item._id"> Удалить </button>
            </div>
            <a :href="item.href" :key="item._id"> {{item.text}} </a>
        </div>
    </div>
</div>
</template>

<script>

import {event_hub} from './event_hub.js'

export default {
	props: ['links_array', 'category'],
	name: 'page-view-grid',
	data: function () {
		return {
            "edit_mode": false,
        }
	},

    
 	methods: {
        build_update_link: function(record)
        {
           return '#update/'+this.category + '/'+record._id;
        },
    
		turn_edit: function (event) {
			this.edit_mode = !this.edit_mode;
		},
		delete_record: function (event) {
			if (typeof event_hub === 'object') {
				event_hub.$emit("delete-record", event);
			}
		}
	}
}
</script>
