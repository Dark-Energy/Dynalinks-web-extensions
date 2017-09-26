/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 1.3.2
 * 2016-06-16 18:25:19
 *
 * By Eli Grey, http://eligrey.com
 * License: MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */


/*
URL.createObjectURL()
Basic support: 
Chrome >= 23, With URL prefixed as webkitURL >= 8
Edge
Firefox 4.0(2)
IE 10
Opera 15
Safari 6, 7

*/

if (typeof saveAs === undefined)
{
    // `self` is undefined in Firefox for Android content script context
    // while `this` is nsIContentFrameMessageManager
    // with an attribute `content` that corresponds to the window

    var view = typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| this.content;
    
    var saveAs = create_saveAs(view);
}

 function create_saveAs(view) {
    
	var doc = view.document;
    
    // only get URL when necessary in case Blob.js hasn't overridden it yet
    var save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
	var can_use_save_link = "download" in save_link;
    
    var force_saveable_type = "application/octet-stream";
    
	// the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
    // // in ms
	var arbitrary_revoke_timeout = 1000 * 40;
    
    function revoke (file) {
        var revoker = function() {
            if (typeof file === "string") { // file is an object URL
                get_URL().revokeObjectURL(file);
            } else { // file is a File
                file.remove();
            }
        };
        setTimeout(revoker, arbitrary_revoke_timeout);
    }
    
    
    
    function throw_outside(ex) {
		(view.setImmediate || view.setTimeout)(function() {
            throw ex;
		}, 0);
	}
	

    function click (node) {
        var event = new MouseEvent("click");
        node.dispatchEvent(event);
    }

        
    function get_URL() {
        return view.URL || view.webkitURL || view;
    }


        
		function  dispatch (filesaver, event_types, event) {
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
        
		function auto_bom  (blob) {
			// prepend BOM for UTF-8 XML and text/* types (including HTML)
			// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
			if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
				return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
			}
			return blob;
		}
        
		function FileSaver (blob, name, no_auto_bom) 
        {
			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, force = blob.type === force_saveable_type
				, object_url;
                
                
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
                
                
				function dispatch_all() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
                

                var is safari = false, is_chrome_ios = false;
                //this platform have not createObjectUrl and have to use FileReader
                function check_bad_platform()
                {
                    is_safari = /constructor/i.test(view.HTMLElement) || view.safari;
                    is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
                    
                    return (is_chrome_ios || (force && is_safari)) && view.FileReader);
                }


                
                function save_data_from_reader()
                {
                    // Safari doesn't allow downloading of blob urls
					var reader = new FileReader();
                    function after_readed()
                    {
                        var url;
                        if (is_chrome_ios) {
                            url = reader.result;
                        } else {
                            reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
                        }
                        var popup = view.open(url, '_blank');
                        if(!popup) {
                            view.location.href = url;
                        }
                        // release reference before dispatching
                        url=undefined; 
                        filesaver.readyState = filesaver.DONE;
                        dispatch_all();
                    }
					reader.onloadend = after_readed;
                    reader.readAsDataURL(blob);
                }
                
                
                
				// on any filesys errors revert to saving with object URLs
				function fs_error() {
                    
					if (check_bad_platform) {
                        read_data_from_reader();
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


			fs_error();
		}
        
        
	var FS_proto = FileSaver.prototype;
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
	FS_proto.onwriteend = null;
        
	

    function saveAs (blob, name, no_auto_bom) {
        var filename = name || blob.name || "download";
        return new FileSaver(blob, filename, no_auto_bom);
    };

	return saveAs;
}