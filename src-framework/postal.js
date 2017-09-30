/*
params
this object give message only with right filled field 'address'
process waiting don't run automatically, his run by means method 'wait'
which create listener and add to browser.runtime
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
    this.$onresponse = undefined;
    this.$onmessage = undefined;
}

//
Postal.prototype.check_address = function (m)
{
    var self = this;
    every_property(this.address, function (key) {
        if (self.address[key] !== m[key]) {
            console.log("address message is false", m, this.address);
            return false;
        }
    });
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
    if (this.$onmessage) {
        this.$onmessage(message);
    }
    if (this.check_address(message)) {
        sendResponse(this.response);
        if (this.$onresponse) {
            this.$onresponse(this.response)
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
        self._private_listener(message, sender, sendResponse);        
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