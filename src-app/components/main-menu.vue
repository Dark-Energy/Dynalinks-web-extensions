<template>

 <div class="top-line line-menu top-buttons">
 <ul>
    <li v-for="name in table.action_list"> 
    <a href="#" @click.prevent="onclick"> {{name}} </a>
        <ul v-if="table.actions[name]">
            <li v-for="action in table.actions[name]">
            <a href="#" @click.prevent="onclick" :data-id="action.id">{{action.title}}</a>
            </li>
        </ul>
    </li>
 </div>


</template>


<script>


var table = {};
table.action_list = ["Edit", "Tabs", "Files", "Search"];
table.actions = {};
table.actions["Edit"] = [
    {
        title: "Create record",
        id: "create_record",
        action: function () { this.application.add_item();}
    },
    {
        title: "Create category",
        id: "create_category",
        action: function () { this.application.create_category();}
    },
    {
        title: "Move page to other category",
        id: "move_page",
        action: function () { this.application.move_tag(); }
    },
    {
        title: "Remove page",
        id: "remove_page",
        action: function () { this.application.remove_tag(); }
    },
    {
        title: "Remove category",
        id: "remove_category",
        action: function () { this.application.remove_category(); }
    }
];

table.actions["Files"] = [
    {
        title: "Save to file",
        id: "save_to_file",
        action: function () {this.application.save_to_file();}
    },
    {
        title: "Save page",
        id: "save_page",
        action: function () { this.application.export_tag();}
    },
    {
        title: "Save category",
        id: "save_category",
        action: function () {this.application.export_category();}
    },
    {
        title: "Import database",
        id: "import_database",
        action: function () {this.application.import_database();}
    }
    
];
table.actions["Tabs"] = [
    {
        title: "Tab list",
        id: "tab_list",
        action: function () {this.application.look_tabs();}
    },
    {
        title: "Tab Groups",
        id: "tab_groups",
    },
    {
        title: "Mass operations",
        id: "mass_operations",
    }
];

table.actions["Search"] = [
    {
        title: "Search",
        id: "search",
    },
    {
        title: "Advanced Search",
        id: "advanced_search",
    },
]

export default {
    name: "ApplicationMainMenu",
    props: ["application"],
	data: function () {
    
        var actions = {};
        every_property(table.actions, (key) => {
            var funcs = (table.actions[key]);
            //console.log("key in table", key, funcs);
            if (funcs) {
                for(var i =0;i < funcs.length; i++) {
                    actions[funcs[i].id] = funcs[i].action;
                }
            }
        });
        
        //console.log("actions get", JSON.stringify(actions), table);

		return {
            "table": table,
            "actions": actions,
            'search_text': ''
        };
	},
	methods: {
        onclick: function (event) {
            var id = event.target.getAttribute('data-id');
            console.log("id", id);
            if (id) {
                var func = this.actions[id];
                console.log("func ", func);
                if (func) {
                    console.log("call");
                    func.call(this);
                }
            }
        },
		search_record: function ()
		{
			//this.application.search(this.search_text);
		},
	}
};
</script>

