<template>
 <div class="top-line line-menu top-buttons">
	<ul>
        <li><a href="javascript:void(0);"> Edit</a>
            <ul>
                <li><a href="javascript:void(0);" id="button-add" v-on:click="add_item">Create record</a></li>
                <li><a href="javascript:void(0);" id="button-create-category" v-on:click="create_category"> Create  category </a></li>
                <li><a href="javascript:void(0);" id="button-move" v-on:click="move_page">Move page to other category</a></li>
                <li><a href="javascript:void(0);" id="button-remove-tag" v-on:click="remove_page"> Remove page</a></li>
                <li><a href="javascript:void(0);" id="button-remove-category" v-on:click="remove_category"> Remove category</a></li>
            </ul>
        </li>
        <li><a href="javascript:void(0);"> Files </a>
            <ul>
                <li><a href="javascript:void(0);" id="button-save" v-on:click="save_all"> Save to file </a></li>
                <li><a href="javascript:void(0);" id="button-export-tag" v-on:click="export_page"> Save page </a> </li>
                <li><a href="javascript:void(0);" id="button-export-category" v-on:click="export_category"> Save Category</a></li>
            </ul>
        </li>
        <li><a href="javascript:void(0);" id="button-save" v-on:click="look_tabs">Look tabs</a></li>
        <li><input type="text" id="search-box" v-model="search_text" placeholder="search..."><button type="button" id="search-button" v-on:click="search_record">Search</button></li>
	</ul>
</div>
</template>


<script>
export default {
    name: "ApplicationMainMenu",
    props: ["application"],
	data: function () {
		return {'search_text': ''};
	},
	methods: {
        clear_ls: function ()
        {
            this.application.clear_ls();
        },
        save_to_ls: function ()
        {
            this.application.save_to_ls();
        },
		save_all: function ()
		{
			this.application.save_to_file();
		},
		add_item: function ()
		{
			this.application.add_item();
		},
		create_category: function ()
		{
			this.application.create_category();
		},
		remove_page: function ()
		{
			this.application.remove_tag();
		},
		remove_category: function ()
		{
			this.application.remove_category();
		},
		move_page: function ()
		{
			this.application.move_tag();
		},
		export_category: function ()
		{
			this.application.export_category();
		},
		export_page: function ()
		{
			this.application.export_tag();
		},
		search_record: function ()
		{
			this.application.search(this.search_text);
		},
        look_tabs: function ()
        {
            this.application.look_tabs();
        }
	}
};
</script>

