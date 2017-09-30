
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


