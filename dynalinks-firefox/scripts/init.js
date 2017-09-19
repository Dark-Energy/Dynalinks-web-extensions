
/*
This file not contain nothing but installation event listener and verification database. He write testing data, if think it need. He not need used no one page. He must run first of all. Prevent i think what this module must create application, but this is was wrong.
*/


var My_Dynalinks_Extension = {};
My_Dynalinks_Extension.App = null;
My_Dynalinks_Extension.key_name = "Dynalinks_Data";

My_Dynalinks_Extension.installed = false;

My_Dynalinks_Extension.ready = function () {
    console.log("...installation ends. Need messages send");
    creating_dynalinks();
}




My_Dynalinks_Extension.create_empty_data = create_empty_data = function()
{
        var database = {
            database: {
                'unknown': [],
            },
            names: {'unknown':'unknown'},
            features: {},
        };
    return database;
}


My_Dynalinks_Extension.create_testing_data = create_testing_data;

My_Dynalinks_Extension.empty_data = My_Dynalinks_Extension.create_empty_data();
My_Dynalinks_Extension.testing_data = My_Dynalinks_Extension.create_testing_data();
    

My_Dynalinks_Extension.load_real_data = function ()
{
    browser.storage.local.get(this.key_name).then(success, fail);
    var self = this;
    function success(data)
    {
        if (data && data.key_name === this.key_name && data.installed !== true) {
            self.real_data = data;
            self.work_is_done("read real data");            
        } else {
            console.log("found data, but else", JSON.stringify(data));
        }
    }
    function fail(e)
    {
        console.log("Oh, my extension is fail!!!!");
    }
    
}    



My_Dynalinks_Extension.work_is_done = function (message)
{
    console.log("Work will be done for "+ message)
    if (!this.installed) {
   
        console.log("Work is over. this.installed= true. Get Ready closed event");
        if (this.ready) {
            this.ready();
        }
    }
    this.installed = true;     
}


My_Dynalinks_Extension.check_read_write = function ()
{

    var self=this;

    var ms = new MyStorage();
    
    
    function write_testing_data () {
        ms.$on_write = function (key)
        {
            console.error("Test data had writed. Check it.")            
            ms.$on_read = function (data) {
                console.log("data must be right");
                console.log(JSON.stringify(data));
            }
            ms.read('Dynalinks_Data');                
            
            self.work_is_done("writing test data!");                    
        }
        var shit = {};
        shit['Dynalinks_Data'] = self.testing_data;
        ms.write(shit);
    }
    
        
    function read_first_time(data)
    {
        var valid = ms.check_data("Dynalinks_Data")        
        //console.log("Dump", JSON.stringify(data));
        if (valid.valid)
        {
            console.error("its real data!");
            self.work_is_done("loading real data!");
        } else {
            console.error("data is empty or corrupted \n" + valid.reason + "\n\n");            
            write_testing_data();
        }
    }
    ms.$on_read = read_first_time;
    ms.read('Dynalinks_Data');
    
}


My_Dynalinks_Extension.check_is_first = function ()
{
    if (this.installed) {
        return;
    }
    
    console.log("Check is first times");
    
    this.check_read_write();
}


 


function test_install()
{
    console.log("installation start...");    
    My_Dynalinks_Extension.check_is_first();
}



    
/*
//dynalinks wait conditions to start
var ready_port = new PortObjListener("ready");
ready_port.process_connecting = function () {
    ready_port.post({"start" : "!"});
   }
ready_port.run();

*/

browser.runtime.onInstalled.addListener(test_install);