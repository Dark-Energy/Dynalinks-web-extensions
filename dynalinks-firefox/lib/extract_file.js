
function extract_file ()
{

var saveAs = saveAs || (function(view) {
	"use strict";
	// IE <10 is explicitly unsupported
	if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var
		  doc = view.document
		  // only get URL when necessary in case Blob.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = "download" in save_link
		, click = function(node) {
			var event = new MouseEvent("click");
			node.dispatchEvent(event);
		}
		, is_safari = /constructor/i.test(view.HTMLElement) || view.safari
		, is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		// the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
		, arbitrary_revoke_timeout = 1000 * 40 // in ms
		, revoke = function(file) {
			var revoker = function() {
				if (typeof file === "string") { // file is an object URL
					get_URL().revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			};
			setTimeout(revoker, arbitrary_revoke_timeout);
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, auto_bom = function(blob) {
			// prepend BOM for UTF-8 XML and text/* types (including HTML)
			// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
			if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
				return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
			}
			return blob;
		}
		, FileSaver = function(blob, name, no_auto_bom) {
			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, force = type === force_saveable_type
				, object_url
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
						// Safari doesn't allow downloading of blob urls
						var reader = new FileReader();
						reader.onloadend = function() {
							var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
							var popup = view.open(url, '_blank');
							if(!popup) view.location.href = url;
							url=undefined; // release reference before dispatching
							filesaver.readyState = filesaver.DONE;
							dispatch_all();
						};
						reader.readAsDataURL(blob);
						filesaver.readyState = filesaver.INIT;
						return;
					}
					// don't create more object URLs than needed
					if (!object_url) {
						object_url = get_URL().createObjectURL(blob);
					}
					if (force) {
						view.location.href = object_url;
					} else {
						var opened = view.open(object_url, "_blank");
						if (!opened) {
							// Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
							view.location.href = object_url;
						}
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
					revoke(object_url);
				}
			;
			filesaver.readyState = filesaver.INIT;

			if (can_use_save_link) {
				object_url = get_URL().createObjectURL(blob);
				setTimeout(function() {
					save_link.href = object_url;
					save_link.download = name;
					click(save_link);
					dispatch_all();
					revoke(object_url);
					filesaver.readyState = filesaver.DONE;
				});
				return;
			}

			fs_error();
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name, no_auto_bom) {
			return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
		}
	;
	// IE 10+ (native saveAs)
	if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
		return function(blob, name, no_auto_bom) {
			name = name || blob.name || "download";

			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			return navigator.msSaveOrOpenBlob(blob, name);
		};
	}

	FS_proto.abort = function(){};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	return saveAs;
}(
	   typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| this.content
));
 

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


function extract_file_within_popup()
{
    var ms = new MyStorage();
    ms.$on_read = function (data) {
        var text = JSON.stringify(data);
        var blob = new Blob([text], {type: "text/plain;charset=utf-8"}, false);	
        saveAs(blob, "Dynalinks Database.json"); 
    }
    ms.read("Dynalinks_Data");
}

}

extract_file();
