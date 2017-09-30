
function extract_file ()
{


function  copy_object (dest, source)
{
	for(var key in source) {
		if (Object.prototype.hasOwnProperty.call(source, key)) {
			dest[key] = source[key];
		}
	}
}


if (!Object.assign) {
    Object.prototype.assign = copy_object;
}

if (typeof browser === 'undefined') {
    var is_chrome = true;
    var browser = chrome;
} 


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
     _private_write : function(key)
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
      },

      remove: function (key)
      {
          browser.storage.local.remove(key);
      }

});



function    save_as(blob, filename) {
        var url = window.URL.createObjectURL(blob);
       
        var    save_link = document.createElement('a');
        console.log("blob url", url);
        save_link.href = url;
        save_link.download = filename;
        var event = new MouseEvent("click");
        save_link.dispatchEvent(event); 
                
        //we are not give message, when file saved
        //because give some time for this process and free resources
        //because of this us need timer
        var timeout = 60.0/4.0 // in ms
        function action ()
        {
            window.URL.revokeObjectURL(url);
            save_link = undefined;
            console.log("revoke this");
        }
        setTimeout(action, timeout);
        //browser.alarms.create({ delayInMinutes: timeout });
    }


function extract_file_within_popup()
{
    /*
    var ms = new MyStorage();
    ms.$on_read = function (data) {
        var text = JSON.stringify(data);
        var blob = new Blob([text], {type: "text/plain;charset=utf-8"}, true);	
        save_as(blob, "Dynalinks Database.json"); 
    }
    ms.read("Dynalinks_Data");
    */
    
    var proxy = new Dynalinks_File_Proxy();
    proxy.save_storage_to_file();
    
    /*
    var port = new Portman("file_proxy");
    port.post({command: "save_storage"});
    console.log("send command");
    */
}


extract_file_within_popup();
}

