function My_Select_Form()
{
    this.selected = '';
    this.options = [];
}

Object.assign(My_Select_Form.prototype, {
    constructor: My_Select_Form,
    get_element: function (id)
    {
        this.form = document.getElementById(id);
        this.after_create();
    },
    create: function (id, parent_id) {
        //crete input element and assign their id
        var form = document.createElement('select');
        form.id = id;
        //append to parent item
        var parent = document.getElementById(parent_id);
        parent.appendChild(form);
        
        this.form = form;
        this.after_create();
    },
    after_create: function ()
    {
        this.set_change_listener();
    },
    set_change_listener :function ()
    {
        var self = this;
        function onchange_callback() {
            self.selected = self.form.value;                
            if (self.onchange) {
                self.onchange(self.selected);
            }
        }
        this.form.addEventListener("change", onchange_callback);
    },
    set_options : function (list, selected)
    {
        this.options = list;
        this.selected = selected;
        
        var html = ''
        for(var i =0; i < list.length;i++) {
            var text = list[i];
            html += '<option';
            if (selected === text) {
                html += " selected ";
            }
            html += ">" + text + '</option>';
        }
        this.form.innerHTML = html;
    },
    add_option: function (item)
    {
        var index = this.options.indexOf(item);
        if (index < 0) {
            this.options.push(item)
            this.set_options(this.options, item);
        }
    },
    set_selected: function (selected) 
    {
        this.set_options(this.options, selected);
    },
    get_value : function ()
    {
        return this.selected;
    },
    clear: function ()
    {
        this.selected = '';
        this.options = [];
        
        this.form.innerHTML = '';
        /*while (this.form.firstChild) {
            this.form.removeChild(myNode.firstChild);
        }*/
        
    }
}); 
