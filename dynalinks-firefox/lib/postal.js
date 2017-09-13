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
    this.address = address;
    this.max_times = 0; //infinte
    this.message = {};
    this.times = 0;
}

//
Postal.prototype.check_address = function (m)
{
    for(var key in this.address) {
        if (Object.prototype.hasOwnProperty.call(this.address, key)) {
            if (this.address[key] !== m[key]) {
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
    }
}

Postal.prototype.create_listener = function ()
{
    var self = this;
    function listener(message, sender, sendResponse) 
    {
        if (self.check_address(message)) {
            sendResponse(response);   
            times += 1;
        }
    }
    this.listener = listener;
    return listener;
}

Postal.prototype.wait = function ()
{
    var listener = this.create_listener();
    browser.runtime.onMessage.addListener(listener);
}

/*
function test_postal()
{
    var p = new Postal({"address": "home"});
    var result = p.check_address({"address": "home"});
    result = result && !p.check_address({"fuck":"shit"});
    console.log("test postal", result)
}

test_postal();
*/