

function Dynalinks_File_Proxy()
{
}

Object.assign(Dynalinks_File_Proxy.prototype, {
    constructor: Dynalinks_File_Proxy,
    save_link: undefined,
    
    save_blob(blob, filename) {
        var url = window.URL.createObjectURL(blob);
       
        var save_link = document.createElement('a');
        save_link.href = url;
        save_link.setAttribute('download', filename);
        save_link.setAttribute('type', 'text/plain');        
        var event = new MouseEvent("click");
        //console.log("before clicking");
        save_link.dispatchEvent(event);
        //console.log("after...");
      

                
        //we are not give message, when file saved
        //because give some time for this process and free resources
        //because of this us need timer
        var timeout = 60.0/4.0 // in ms
        var self = this;
        function action ()
        {
            window.URL.revokeObjectURL(url);
            save_link = undefined;
        }
        setTimeout(action, timeout);
        //browser.alarms.create({ delayInMinutes: timeout });
    },
    
    save_text: function (text, filename)
    {
        //console.log("text->", text);
        var url = 'data:text/application;charset=utf-8,' + text;
        //console.log("url-<", url);
       
        var save_link = document.createElement('a');
        save_link.href = url;
        save_link.setAttribute('download', filename);
        save_link.setAttribute('type', 'text/application');
        var event = new MouseEvent("click");
        save_link.dispatchEvent(event);
    },
    
    save_storage_to_file: function ()
    {
        var ms = new MyStorage();
        var filename = this.get_filename();
        var self=this;
        ms.$on_read = function (data) {
            var text = JSON.stringify(data);
            var blob = new Blob([text], {type: "text/plain;charset=utf-8"}, true);	
            self.save_blob(blob, filename);
            //self.save_text(text, filename);
        }
        ms.read("Dynalinks_Data");
    },
    
    save_text_to_file: function (text, filename)
    {
        self.save_text(text, filename);
    },
    
    save_text_as_blob: function(text, filename) {
        var blob = new Blob([text], {type: "text/plain;charset=utf-8"}, true);	
        this.save_blob(blob, filename);
    },
    
    get_filename: function ()
    {
        var date = new Date();
        var date_str = date.getFullYear() + "-" + date.getMonth() + "_" + date.getHours() + "_" + date.getMinutes();
        return "Database-" + date_str + ".json";
    },

});


//console.log(new Dynalinks_File_Proxy());