<template>
<div class="tab-content" id="page-content">
	<div class="control-panel">
		<a href="javascript:void(0);" class="edit-button link-button" v-on:click="turn_edit"> Правка </a>
	</div>
    <div class="data-grid">
        <div class="editable-link" v-for="item in links_array">
            <div class="button-panel" v-if="edit_mode">
                <a class="edit-btn" v-bind:href="build_update_link(item)" v-bind:key="item._id"> Правка </a>
                <button type="button" class="delete-btn"  v-on:click="delete_record(item._id)" v-bind:key="item._id"> Удалить </button>
            </div>
            <a v-bind:href="item.href" v-bind:key="item._id"> {{item.text}} </a>
        </div>
    </div>
</div>
</template>

<script>

import {event_hub} from './event_hub.js'

export default {
	props: ['links_array', 'catetory'],
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
