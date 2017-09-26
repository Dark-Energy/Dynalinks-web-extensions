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