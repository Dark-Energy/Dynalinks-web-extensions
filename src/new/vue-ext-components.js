 var CategoryCreate = {
    data : function () {
        return {new_category: ''};
    },
    template: '<div>FUCK FUCK FUCK </DIV>',
    /*
    template: '<div> create new category: <input type="text" v-model="new_category" />\
    <button type="button" @click="create_cat">Create</button>\
    </div>',
    */
    /*
    render: function (h) {
        return h('input', 
        {
            attrs : {
                "type": "text",
                "id" : "new_category_name",
                "placeholder": "input new category name",
            },            
            on: {
                "changed":this.change_name
           },
        }, 'created new category');   
    },
    */
    methods: {
        "change_name": function (e) {
            this.new_category = e.event.target.value;
        },
        "create_cat": function (e) {
            event_bus.$emit("create_category", this.new_category);
        }
    },
    mounted: function () {
        console.log("iam mounted!");
    }
};

var CategorySelect = {
    template: '<div><select class="select-category" v-model="selected_category"> <option v-for="cat in categories_list" v-bind:value="cat"> {{cat}} </otion> </select></div>',
    props: ["categories", "selected"],
    data: function () {
        return {
            selected_category : this.selected,
            categories_list: this.categories,
        }
    },
    mounted: function ()
    {
        this.selected_category = this.selected || '';
        this.categories_list = this.categories || [];
        event_bus.$on("create_category", function (name) {
            this.categories_list.push(name);
        });
    },
    components: {
        //'CategoryCreate': CategoryCreate
    }
}


var CreateRecordForm = 
{
    template: '<CategorySelect />',
    components: {'CategorySelect': CategorySelect},
}

