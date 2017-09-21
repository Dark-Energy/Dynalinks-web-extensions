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
