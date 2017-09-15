function MyStorage()
{
    this.$on_read = undefined;
    this.$on_write = undefined;
    this.debug = false;
}


Object.assign(MyStorage.prototype, {
     constructor: MyStorage,
     
     /*
     set anonimouse object {key: object}
     argument 'object' may be optional
     then set (object)
     you cannot write with no key and anonimouse object, sad, guy
     truly, you can write entire object, but how can you get his return?
     */
     write: function (key, obj) {
        
        var self = this;
        //console.log("write ", key);
        function write_success()
        {
           self._private_write(key);
        }

        this.last_written_data = {};
        if (obj === undefined) {
            this.last_written_data = key;
        } else {
            this.last_written_data[key] = obj;
        }
        
        if (is_chrome) {
            chrome.storage.local.set(this.last_written_data, write_success);
        } else {
            browser.storage.local.set( this.last_written_data ).then( write_success, function fail(error) {
                console.error("Error write to storage.local", error);
            });
        }
     },
     _private_write(key)
     {
        if (this.$on_write !== undefined) {
            this.$on_write(key);
        }
     },
     read: function (key) {
        //get return anonimous object {key: object}         
         var self= this;
         function success(data)
         {
            self._private_read(data);
         }
         
         function read_fail(e)
         {
            self._private_read_fail(e);
         }
         
         //console.log("read <<"+key+">> data from storage");
         if (is_chrome) {
             chrome.storage.local.get(key, success);
         } else {
            browser.storage.local.get(key).then(success, function (e) {
                console.error("Oh vey, storage get failed ", e);
            });
         }
     },
     _private_read_fail: function (e) {
         console.error("Error in reading storage :::", e);
         this._private_read(undefined);
         /*
         if (this.$on_read_fail) {
             this.$on_read_fail);
         }*/
     },
     _private_read : function (data) {
         this.last_data = data;
         if (this.$on_read !== undefined) {
                this.$on_read(this.last_data);
         }
      },
      /*
      storage.get(name) return anonimouse object, inside which contains object_name
      {
          object_name: object
          this function check if
          anonimouse object is not empty
          object_name exists and is not empty
          additionly: 
          object_name is object, containing key_name (for paranoics);
      }
      */
      check_data: function (object_name, key_name)
      {
          var result =
          {
              valid: true,
              reason: '',
          };
          
          if (!this.last_data) {
              result.reason = "data is undefined or null\n";
              result.valid = false;
              return result;
          } 
          
        var object_data = this.last_data[object_name];
        if (!object_data) {
            result.reason = "Object with name <<"+object_name+">> is undefined or null.\n";
            result.reason += "Dump all getting data:\n ";
            result.reason += JSON.stringify(this.last_data, null, ' ');
            result.valid = false;
            return result;
        }
        result.valid = true;
        
        if (key_name !== undefined) {
            result.valid = object_data.key_name === key_name;
            result.reason = "Key_names is not or not identity.\n Data probably corrupted"
            result.reason += "key name is " + key_name + ", but data contains " + object_data[key_name];
            result.reason += "\n dump of all data: \n" + JSON.stringify(this.last_data, null, ' ');
        }
        return result;  
      }
     
}); 
     
  
/*  
function test_mystorage()
{
    var ms = new MyStorage();
    
    var result;
    
    var failed_count = 0;


    var tested_object = 
    {
        'Dynalinks_Data': {
            shit: "shit",
            key_name: "Cthulhu_Fhtahgn"
        }
    }
    
    
    ms.last_data = {}
    result = ms.check_data("Dynalinks_Data");
    if (result.valid) {
        console.log("check data is failed on empty object");
        console.log(result.reason);
        failed_count+=1;
    }
    
    ms.last_data = tested_object;
    result = ms.check_data("Dynalinks_Data");
    if (!result.valid) {
        console.log("check data is failed on filled and valid object");
        console.log(result.reason);
        failed_count+=1;
    }
    
    
    ms.last_data = {kitten: "names"};
    result = ms.check_data("Dynalinks_Data")
    if (result.valid) {
       console.log("check data is failed on data name object");
       console.log(result.reason);
       failed_count+=1;
    }


    
    ms.last_data = tested_object;
    
    var true_key_name = "Cthulhu_Fhtahgn";
    var false_key_name = "mary and rosy";
    result = ms.check_data("Dynalinks_Data", true_key_name);
    if (!result.valid) {
        console.log("check data is failed on testing key_name, he not recognize she");
        console.log(result.reason);
        failed_count+=1;
    }
    
    result = ms.check_data("Dynalinks_Data", false_key_name); 
    if (result.valid)  {
        console.log("check data is recognize false key_name as true, failed");
        failed_count+=1;
    }    
    console.log("check_data failed " + failed_count + " times");
}    


test_mystorage();
*/

/*
function test_mystorage_read_write()
{
    var ms = new MyStorage();
    ms.debug = true;
    var test_object = {key_name: "chtulhu_fhtahgn"};
    
    var key ="my obj";
    var shit = {};
    shit[key]= test_object;
    //ms.write(shit);
    //ms.write(key, test_object)
    ms.write("two", test_object);

    
    ms.$on_write = function (key) {
        console.log("data <<" + key + ">> " + JSON.stringify(ms.last_written_data, null, ' ')+ "writted. Need read them.");

        ms.$on_read = function (data)
        {
           console.log("We read " + JSON.stringify(data, null, ' '));
        }
        ms.read(key);
    }
}


test_mystorage_read_write();
*/