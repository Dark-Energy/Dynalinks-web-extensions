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
      },
      
      remove: function (key)
      {
          browser.storage.local.remove(key);
      }
     
}); 
     
  
  
  function Portman(name, bipolar)    
{
    this.name = name;
    this.port = browser.runtime.connect({"name":this.name});
    this.last_message = '';
    this.process_message = undefined;
    this.bipolar = bipolar;
    if (bipolar) {
        this.create_message_listener();   
        this.port.onMessage.addListener(this.message_listener);
    }
}


Object.assign(Portman.prototype, 
{
    constructor: Portman,
    post : function(message)
    {
        this.port.postMessage(message);
    },


    _private_message_listener : function (message)
    {
        this.last_message = message;
        //this.messages.push(message);
        if (this.process_message) {
            this.process_message(this.last_message);
        }
        
    },

    create_message_listener: function ()
    {
       if (this.message_listener) {
            return;
       }
       var self = this;
       function listener(message) 
       {
            self._private_message_listener(message);       
       }
        this.message_listener = listener;
    }
}); 



function PortObjListener (name, immediatly)
{
    this.name = name;
    this.messages = [];
    this.last_message = {}
    this.connect_events = [];
    this.process_message = undefined;
    this.process_connection = undefined;
    
    this._inner_connect_listener = undefined;
    
    if (immediatly) {
        this.run();
    }
}


Object.assign(PortObjListener.prototype, {
        constructor: PortObjListener,
        dispose_message_listener: function ()
        {
            if (port !== undefined && this.message_listener !== undefined) {
                this.port.onMessage.removeListener(this.message_listener);
                this.message_listener = undefined;
            }
        },
        
        dispose : function ()
        {
           this.dispose_message_listener();
           if (this.port !== undefined) {
                if (this._inner_connect_listener !== undefined) {
                    this.port.onConnect.removeListener(this._inner_connect_listener);
                    this._inner_connect_listener = undefined;
                }
           }
        },

        $on_connect_event : function (callback)
        {
            var index = this.connect_events.indexOf(callback);
            if (index < 0) {
                 this.connect_events.push(callback);
            }
        },

        $emit_connect_event : function (port)
        {
            if (this.process_connection) {
                this.process_connection();    
            }
            for(var i = 0; i <  this.connect_events.length; i++) {
                var event = this.connect_events[i];
                event(port);
                //Function.prototype.call(event, port);
            }
        },
        
        _private_message_listener: function (message)
        {
            //console.log("port "+this.port.name+"get message", message);
            this.last_message = message;
            this.messages.push(message);
            if (this.process_message) {
                this.process_message(this.last_message);
            }
        },
        
        create_message_listener : function ()
        {
           if (this.message_listener !== undefined){
                return;
           }
           var self = this;
           function listener(message) 
           {
                self._private_message_listener(message);
           }
            this.message_listener = listener;
        },
        

        _private_connect_listener : function (port)
        {
            this.$emit_connect_event(port);
            
            if (port.name === this.name) {
               //console.log("name of ports identity<"+port.name+ ">, connect!");
               this.port = port;
               this.create_message_listener();
               this.port.onMessage.addListener(this.message_listener);               
               /*this.port.onMessage.addListener(function (m) {console.log("objlistener: get message ",m);});*/
               
            }
        },

        create_connect_listener : function ()
        {
            var self = this;
            function listener(port) 
            {
                //console.log("connect offer", this.name, port.name);
                //console.log("connect offer<"+port.name+ "> to <"+self.name+"> ");
                self._private_connect_listener(port);
            }
            this._inner_connect_listener = listener;
        },
        
        run : function ()
        {
            if (this._inner_connect_listener === undefined) {
                this.create_connect_listener();
                browser.runtime.onConnect.addListener(this._inner_connect_listener);
            }
        },

        post: function (message) 
        {
            this.port.postMessage(message);
        },
        
}); 



   /*
    array of commands of info
    or 2nd array [][]
    */

function PortSwitcher(port)
{
 
    this.port = port;
    this.commands = {};
    this.port.old_process_message = port.process_message;
    var self = this;
    
    this.port.process_message = function (m) { 
        self._private_process_message(m);
    }
}

Object.assign(PortSwitcher.prototype, {
    constructor: PortSwitcher,
    _private_process_message : function(m)
    {
        this.process_command(m);
    },

    process_command  : function (m)
    {
         //console.log("process command", JSON.stringify(m));
        //commands = dict[][]
        if (m.command) {
            var layer = this.commands[m.command];
            if (layer && m.info) {
                var command = layer[m.info];
                if (command) {
                   //typeof command === 'function'
                   //command.prototype.call is not a function
                   command.call(this, m);
                   return;
                }
            }
        }
        
        if (this.port.old_process_message) {
            this.port.old_process_message(m);
        }
    },

    add_command_layer : function(key)
    {
       this.commands[key] = {};
    },

    add_command : function (layer, key, func)
    {
        if (!this.commands[layer]) {
           this.add_command_layer(layer);
        }
        this.commands[layer][key] = func;
    },


    post_response : function (response)
    {
       this.port.post(response);
    },

    add_mixin : function (mixin, splitter)
    {
        var separator = '-';
        if (typeof splitter === 'string') {
            separator = splitter;
        }
        for(var key in mixin){
            if (Object.prototype.hasOwnProperty.call(mixin, key)){
                var arr = key.split(separator)
                //console.log("key is ", JSON.stringify(arr));
                if (arr.length < 2) {
                        console.error("PortSwitcher.add_mixin: Invalid property <"+ key +"> in mixin!");
                }
                this.add_command(arr[0], arr[1], mixin[key]);
            }
        }
        //console.log("commands - > ", JSON.stringify(this.commands, null, ' '));
    },
    
    send_command: function (command, info, data)
    {
        var message = {
            command: command,
            info: info,
        };
        Object.assign(message, data);
        this.port.post(message);
    }
});

/*
params
address:
    check {address: "underword"} === {greeting: "Hi, oh, you amazing object!"}
    default: {}
max_times:
    0 - infinity, n - n times 
    default: 0
response:
    message sending response
    default: {}
    
*/
function Postal(address)
{
    this.address = address || {};
    this.max_times = 0; //infinte
    this.message = {};
    this.times = 0;
    this.response = {};
    this.action = null;
}

//
Postal.prototype.check_address = function (m)
{
    for(var key in this.address) {
        if (Object.prototype.hasOwnProperty.call(this.address, key)) {
            if (this.address[key] !== m[key]) {
                console.log("address message is false", m, this.address);
                return false;
            }
        }
    }
    return true;
}

Postal.prototype.check_times_limit = function()
{
    if (this.max_times > 0 && this.max_times <= this.times) {
        browser.runtime.onMessage.removeListener(this.listener);
        this.listener=undefined;
    }
}

Postal.prototype._private_listener = function (message, sender, sendResponse)
{
    if (this.check_address(message)) {
        sendResponse(this.response);   
        if (this.action) {
            this.action();
        }
        this.times += 1;
        this.check_times_limit();
    }
    
}

Postal.prototype.create_listener = function ()
{
    var self = this;
    function listener(message, sender, sendResponse) 
    {
        self._private_listener;
    }
    this.listener = listener;
}

Postal.prototype.wait = function ()
{
    this.create_listener();
    if (is_chrome) {
        chrome.runtime.onMessage.addListener(this.listener);
    } else {
        browser.runtime.onMessage.addListener(this.listener);
    }
}

/*
function test_postal()
{
    var true_address = {"address": "home"};
    var false_address = {"freak":"ugly"}

    var p = new Postal();
    p.response = {"home": "hello!"};
    p.address = true_address;

    
    var result = p.check_address(true_address);
    result = result && !p.check_address(false_address);
    if (!result) {
        console.log("test postal check adress is failed");
    }
    

    console.log("test listener response");
    p.create_listener();

      
    p.listener(true_address, {}, function (response) {
        console.log("listener must response and response must be " + JSON.stringify(p.response) + " but taken " + JSON.stringify(response));
    });
    
    
    
    var listener_pass = true;
    try{
        //listener dont have to response
        p.listener(false_address, {}, null)
    }
    catch (e) {
        console.log("listener fail", e);
        listener_pass = false;
    }
    console.log("listener dont have to response, and did it on...", listener_pass);
    
    

    p.times = 0;
    p.max_time = 1;
    p.listener(true_address, {}, function (response) {
        console.log("message get, listener must be removed");

        setInterval(0, function () {
            p.listener(true_address, {}, function (response) {
            console.log("removed failed", p.listener); })
        });

    });
    
}

test_postal();

*/






function Sender(message)
{
    this.message = message;
    this.response = '';
    this.action = null;
    this.count = 0;
}

Sender.prototype.reject = function ()
{
    //console.error("this is error!");
}



Sender.prototype.send = function ()
{
    this.create_listener();
    if (is_chrome) {
        chrome.runtime.sendMessage(this.message, null, this.listener)
    }  else {
        var shit = browser.runtime.sendMessage(this.message);
        shit.then(this.listener, this.reject);        
    }
}

Sender.prototype._private_listener = function (message)
{
    console.log("sender get a message", message);
    if (message === undefined && is_chrome) {
        console.log(chrome.runtime.lastError)
        return;
    }
    this.response = message;
    this.count += 1;
    if (this.action) {
       this.action(this.response);
    }
 }

Sender.prototype.create_listener = function ()
{
    var self = this;
    function listener(response) 
    {
        self._private_listener(response);
    }
    this.listener = listener;
}
