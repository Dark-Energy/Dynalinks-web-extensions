function Dynalinks_File_Proxy(dlink)
{
    this.dlink = dlink;
    this.dynalinks = dlink;
}

copy_object(Dynalinks_File_Proxy.prototype, {
    constructor: Dynalinks_File_Proxy,
    save_to_file : function (filename, varname)
    {
        var json = this.dlink.toJSON();
        this.save_data_to_file(filename || this.Database_Name, json, this.Database_Var);
    },
    
    save_data_to_file : function(filename, data, varname)
    {
        var text = JSON.stringify(data, null, " ");
        text = "var " + varname + " = " + text + ";\n";
        var blob = new Blob([text], {type: "text/plain;charset=utf-8"});	
        console.log("blob created.... saving");
        saveAs(blob, filename); 
    },
    
    Database_Name : "database.txt",
    
   Database_Var : "my_links",
   
    export_tag : function (category, tag)
    {
        var context = this.dlink.get_category_context(category);
        var data = context.pages[tag];
        this.save_data_to_file(tag + ".txt", data, "my_page");
    },
    
    export_category : function (name)
    {
        this.save_data_to_file(name + ".txt", this.dlink.database[name], "my_cat");
    }
});

