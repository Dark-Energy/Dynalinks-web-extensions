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

PortSwitcher.prototype._private_process_message = function(m)
{
    this.process_command(m);
}

PortSwitcher.prototype.process_command  = function (m)
{
     console.log("process command", JSON.stringify(m));
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
}

PortSwitcher.prototype.add_command_layer = function(key)
{
   this.commands[key] = {};
}

PortSwitcher.prototype.add_command = function (layer, key, func)
{
    if (!this.commands[layer]) {
       this.add_command_layer(layer);
    }
    this.commands[layer][key] = func;
}


PortSwitcher.prototype.post_response = function (response)
{
   this.port.post(response);
}

PortSwitcher.prototype.add_mixin = function (mixin, splitter)
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
}
