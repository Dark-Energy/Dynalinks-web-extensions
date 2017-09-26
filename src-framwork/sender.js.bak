function Sender(message)
{
    this.message = message;
    this.response = '';
    this.action = null;
}

Sender.prototype.reject = function ()
{
    //console.error("this is error!");
}

Sender.prototype.send = function ()
{
    this.create_listener();
    if (typeof browser === 'undefined') {
        chrome.runtime.sendMessage(this.message, null, this.listener)
    }  else {
        var shit = browser.runtime.sendMessage(this.message);
    }

    shit.then(this.listener, this.reject);
}

Sender.prototype.create_listener = function ()
{
    var self = this;
    function listener(response) 
    {
        self.response = response;
        if (self.action) {
           self.action();
        }
    }
    this.listener = listener;
    return listener;
}
