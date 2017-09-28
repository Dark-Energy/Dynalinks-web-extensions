//message is a JSON like object
//sender don't send message automatically, 
//message send by means method 'send'
//which create callback for taking response
//var s = new Sender({address: 'nowhere'})
//s.send();
function Sender(message)
{
    this.message = message;
    this.response = '';
    this.action = null;
    this.count = 0;
}

Sender.prototype.reject = function (e)
{
    console.error("this is error on message sending!", this.message, e);
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
