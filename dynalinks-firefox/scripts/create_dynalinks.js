function Dynalinks_Proxy()
{
    this.dynalinks = undefined;
    this.created = false;
    this.key_name = "Dynalinks_Data";
    this.onloaded = undefined;
}


Object.assign( Dynalinks_Proxy.prototype, {
    constructor: Dynalinks_Proxy,
    
    Create_Dynalinks : function()
    {
        if (this.dynalinks) {
            console.log("already created");
            return;
        }
        var self = this;

        //read data from storage
        //console.log("get item with name <", this.key_name+">");
        /* get(key_name) (data) => {key_name: Object} */
        
        var ms = new MyStorage();
        ms.$on_read  = success;
        ms.read(this.key_name);

        function success(data)
        {
            self.read_data(data);
        }
        function fail(e)
        {
            console.log("Oh, my extension is fail!!!!");
        }
        
        /*
        browser.storage.local.get(this.key_name).then(success, fail);
        */
    },

    read_data : function (data)
    {

        //console.log("what we get", JSON.stringify(data,null,' '));
        /* 
        Data Scheme
        data = {dynalinks_data: object} 
        My_Extension.key_name = 'dynalinks_data' 
        real data = object 
        */        
        var real_data = data[this.key_name];
        //var real_data = data.Dynalinks_Data
        if (real_data) {
            console.log("real data is loaded"); 
            this.dynalinks = new Dynalinks(real_data);
            this.created = true;
            this.after_loaded();
        } else {
            console.error("found data, but key_name error", JSON.stringify(real_data, null, ' '));
        }
    },


    write_to_storage : function()
    {
        console.log("listen to change");
        var json = this.dynalinks.toJSON();
        json.key_name = this.key_name;        
        var ms = new MyStorage();
        ms.$on_write = success;
        ms.write(this.key_name, json);
        
        

        /*
        //inside listener my are doing another yet async call, fuck it
        //i very haite javascript and brandon ick personally indeed
        var shit = {};
        var key_name = this.key_name;
        var shit = {};
        shit[key_name] = json;
        browser.storage.local.set(shit).then (success, fail);
        */
        
        /*
        console.log("where we write", JSON.stringify(json, null, ' '));
        browser.storage.local.get(this.key_name).then (function (data) {
            console.log("testing ", JSON.stringify(data, null, ' '));
        });
        */
        function fail()
        {
            console.log("failed to save database in callback");
        }
        
        function success()
        {
            console.log("!success to save database in callback!")
        }
    },


    after_loaded : function ()
    {
        //add listener to change event to database
        console.log("created listener of changes in database "); 
        //when dynalinks change own structur, we have to write this changes into storage
        var self= this;
        this.dynalinks.$on("change", function () {
            self.write_to_storage();
        });

        if (this.onloaded) {
           this.onloaded(this.dynalinks);
        }
    }

});


