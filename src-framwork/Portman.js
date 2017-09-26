  function Portman(name, bipolar, try_reconnect)
{
    this.name = name;
    this.bipolar = !!bipolar;
    this.try_reconnect = !!try_reconnect;
    this.process_message = undefined;
    this.last_message = '';


    this.private_create_port();


}


Object.assign(Portman.prototype,
{
    constructor: Portman,

    private_create_port: function ()
    {
        //console.log("Create port " + this.name);
        if (this.port !== undefined) return;

        this.port = browser.runtime.connect({"name":this.name});
        if (this.bipolar) {
            this.create_message_listener();
            this.port.onMessage.addListener(this.message_listener);
        }

        var self = this;
        this.disconnect_listener = function (port)
        {
            console.error("active port with name {{ " + port.name +" }}get message about disconnect");
            console.error("port.error is "+port.error);
            console.error("port object is ", port);
            if (self.try_reconnect) {
                self.restart_on_disconnect();
            }
        }

        this.port.onDisconnect.addListener(this.disconnect_listener);

    },

    restart_on_disconnect: function ()
    {
        this.dispose();
        console.log("trying create new port");
        this.private_create_port();
    },

    dispose: function ()
    {
        if (this.port === undefined) return;
        this.port.onDisconnect.removeListener( this.disconnect_listener);
        this.port.onMessage.removeListener( this.message_listener);
        this.port.disconnect();
        this.port = undefined;
    },

    post : function(message)
    {
        this.port.postMessage(message);
    },


    _private_message_listener : function (message)
    {
        if (message.hands && message.hands === "?") {
            this.hands = true;
            console.log("get message about connection set between {{"+message.my+"}} and {{"+message.your+"}}");
            return;
        }
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
    },
});