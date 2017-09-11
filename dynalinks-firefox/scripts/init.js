/*
This file not contain nothing but installation event listener and verification database. He write testing data, if think it need. He not need used no one page. He must run first of all. Prevent i think what this module must create application, but this is was wrong.
*/
console.log("NAME init");

var My_Dynalinks_Extension = {};
My_Dynalinks_Extension.App = null;
My_Dynalinks_Extension.key_name = "Dynalinks_Data";
My_Dynalinks_Extension.ready = undefined;
My_Dynalinks_Extension.installed = false;

My_Dynalinks_Extension.create_testing_data = function()  
{
var my_links = {
 "database": {
  "English": [
   {
    "href": "http://envoc.ru/",
    "text": "Словарь и справочник envoc",
    "tag": "Словари",
    "favorite": true,
    "favorite_text": "envoc",
    "_id": "ozr5zqchs1471073372661"
   },
   {
    "href": "http://www.lingvo-online.ru/ru",
    "text": "Словарь Abby lingvo",
    "tag": "Словари",
    "favorite": false,
    "favorite_text": "",
    "_id": "ikqt2nb631471073372661"
   },
   {
    "href": "http://dictionary.cambridge.org/ru",
    "text": "Словарь Cambrige Dictionary",
    "tag": "Словари",
    "favorite": true,
    "favorite_text": "Cambrige Dictionary",
    "_id": "044bn2hri1471073372661"
   },
   {
    "href": "http://www.oxforddictionaries.com/",
    "text": "Словарь Oxford Dictionary",
    "tag": "Словари",
    "favorite": true,
    "favorite_text": "Oxford Dictionary",
    "_id": "qjr4kwd2u1471073372661"
   },
   {
    "href": "http://www.macmillandictionary.com/",
    "text": "McMillian Dictionary",
    "tag": "Словари",
    "favorite": true,
    "favorite_text": "McMillian Dictionary",
    "_id": "bfr11yk0c1471073372661"
   },
   {
    "href": "http://www.merriam-webster.com",
    "text": "merriam webster",
    "tag": "Словари",
    "favorite": true,
    "favorite_text": "merriam webster",
    "_id": "r318iuhsv1471073372661"
   },
   {
    "href": "http://www.thefreedictionary.com/",
    "text": " The Free Dictionary by Farlex - англо-английские словари идиом и терминов",
    "tag": "Словари",
    "favorite": true,
    "favorite_text": " The Free Dictionary",
    "_id": "awt80jtk71471073372661"
   },
   {
    "href": "http://www.homophone.com/",
    "text": "гомофоны",
    "tag": "Словари",
    "favorite": false,
    "favorite_text": "",
    "_id": "zs0clen5c1471073372661"
   },
   {
    "href": "http://www.thesaurus.com/",
    "text": "thesaurus.com",
    "tag": "Словари",
    "favorite": false,
    "favorite_text": "",
    "_id": "jfrghw9jq1471073372661"
   },
   {
    "href": "http://www.englishpage.com/index.html",
    "text": "englishpage - грамматический справочник на английском",
    "tag": "Справочники",
    "favorite": false,
    "favorite_text": "",
    "_id": "6edhi3axc1471073372661"
   },
   {
    "href": "http://conjugator.reverso.net/conjugation-english.html",
    "text": "Спряжалка глаголов",
    "tag": "Справочники",
    "favorite": false,
    "favorite_text": "",
    "_id": "fqou80hoj1471073372661"
   }
  ]
 },
 "names": {
  "English": "English"
 },
 "features": {
  "English": [
   {
    "_id": "ozr5zqchs1471073372661",
    "text": "envoc"
   },
   {
    "_id": "37qbp3bg91471073372661",
    "text": "engblog"
   },
   {
    "_id": "044bn2hri1471073372661",
    "text": "Cambrige Dictionary"
   },
   {
    "_id": "qjr4kwd2u1471073372661",
    "text": "Oxford Dictionary"
   },
   {
    "_id": "bfr11yk0c1471073372661",
    "text": "McMillian Dictionary"
   },
   {
    "_id": "r318iuhsv1471073372661",
    "text": "merriam webster"
   },
   {
    "_id": "awt80jtk71471073372661",
    "text": " The Free Dictionary"
   }
  ]
 }
};

return my_links;
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

My_Dynalinks_Extension.empty_data = My_Dynalinks_Extension.create_empty_data();
My_Dynalinks_Extension.testing_data = My_Dynalinks_Extension.create_testing_data();

My_Dynalinks_Extension.start_application = function () 
{
    if (this.installed) {
        return;
    }
    //console.log("CREATE application!", this.real_data, this.testing_data, this.empty_data);    
    console.log("CREATE application!");
    var params =
    {
        ITS_EXTENSION: true,
        key_name: My_Dynalinks_Extension.key_name,
    };
    
    if (this.real_data) {
        params.database= this.real_data;
    } else if (this.testing_data) {
        params.database= this.testing_data;
    } else {
        params.database = empty_data;
    }

    My_Dynalinks_Extension.App = new Vue_Application(params);
    //this.installed = true;
}


My_Dynalinks_Extension.write_testing_data = function()
{
    console.log("write testing data");
    this.testing_data.key_name = this.key_name;
    var self = this;
    
    function success(data) 
    {
        console.log("managed to add testing data!");
        //self.work_is_done("write testing data");
    }
    
    function fail(e) 
    {
        console.log("oh, shit, failed to add testing data");
    }
        
    console.log("Writing test data", this.testing_data.database, this.testing_data.names, this.testing_data.features);
    //console.log("Writing test data", JSON.stringify(shit));
    browser.storage.local.set( {"Dynalinks_Data": this.testing_data} ).then( success, fail);

}
    

My_Dynalinks_Extension.load_real_data = function ()
{
    browser.storage.local.get(this.key_name).then(success, fail);
    var self = this;
    function success(data)
    {
        if (data && data.key_name === this.key_name && data.installed !== true) {
            self.real_data = data;
            self.real_data = JSON.parse(JSON.stringify(data));
            console.log("real data is loaded");
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


My_Dynalinks_Extension.check_data = function(data)
{
    if (!data) {
        console.error("data first getting from storage is empty")
        console.log("Dump : ", JSON.stringify(data, null, ' '));
        return false;
    }
    
    var dynalinks = data["Dynalinks_Data"];
    if (!dynalinks) {
        console.error("Dynalinks is empty or corrupted")
        console.log("Dump getting data:", JSON.stringify(data, null, ' '));
        console.log("Dump :", JSON.stringify(dynalinks, null, ' '));
        return false; 
    }
    if (dynalinks.key_name !== this.key_name) {
        console.error("Dynalinks probably corrupted, not same key_name");
        console.error("this.key_name", this.key_name);
        console.error("dump : ", JSON.stringify(dynalinks, null, ' '));
        return false;
    }
    return true;
}



My_Dynalinks_Extension.check_read_write = function ()
{
   var self = this;
   
    function success(data) {
        if (!self.check_data(data)) {
            console.error("data is wrong, write testing data");
           self.write_testing_data();
        }  else {
            console.log("its real data");
            //console.log("dump real data", JSON.stringify(data, null, ' '));
        }
        self.work_is_done("check read write");
    }
    
    function fail() 
    {
        console.log("this is fail of starting my extension");
    }
    browser.storage.local.get("Dynalinks_Data").then ( success, fail);
 
}


My_Dynalinks_Extension.mock_test_read_write = function ()
{
   var self = this;
   /*
    function success(data) {
        if (!self.check_data(data)) {
            console.error("data is wrong, write testing data");
        }  else {
            console.log("its real data");
            console.log("dump real data", JSON.stringify(data, null, ' '));
        }
    }*/

    function success(data) {
        console.log("mock read");
        var result = !!data && !!data.Dynalinks_Data 
            && data.Dynalinks_Data.key_name === 'Dynalinks_Data';
        console.log("mock is done", result);
        //console.log(JSON.stringify(data, null, ' '));
    }
        
    
    function fail() 
    {
        console.log("this is fail of starting my extension");
    }
    browser.storage.local.get("Dynalinks_Data").then ( success, fail);
 
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



My_Dynalinks_Extension.ready =   function () {
    console.log("...installation ends. Need messages send");
    creating_dynalinks();
/*
//dynalinks wait conditions to start
var ready_port;
browser.runtime.onConnect.addListener(function (p) {
    console.log("get connection from " + p.name);
        if (p.name === "ready"){
            console.log("ready_port was " + ready_port + " now become " + p);        
            ready_port = p;
       }
   });

    
   //browser.runtime.sendMessage({init: true}).then(null, null);
   if (ready_port !== undefined){
    ready_port.postMessage({"start":"!"});
    ready_port=undefined;
   }
*/   
}



browser.runtime.onInstalled.addListener(test_install);