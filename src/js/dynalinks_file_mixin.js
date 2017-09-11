var Dynalinks_File_Mixin = 
{
    save_to_file : function (filename, varname)
    {
        var db = {
            'database': this.database, 
            'names': this.names,
            'features': this.features,
        };
        this.save_data_to_file(filename || this.Database_Name, db, this.Database_Var);
    },
    
    save_data_to_file : function(filename, data, varname)
    {
        var text = JSON.stringify(data, null, " ");
        text = "var " + varname + " = " + text + ";\n";
        var blob = new Blob([text], {type: "text/plain;charset=utf-8"});	
        saveAs(blob, filename); 
    },
    
    Database_Name : "database.txt",
    
   Database_Var : "my_links",
   
    export_tag : function (category, tag)
    {
        var context = this.get_category_context(category);
        var data = context.pages[tag];
        this.save_data_to_file(tag + ".txt", data, "my_page");
    },
    
    export_category : function (name)
    {
        this.save_data_to_file(name + ".txt", this.database[name], "my_cat");
    }
}    

