
/*
//this doesn't work
//save work only inside inside html page scripts, don't background script
//init file proxy to save database to file
var file_proxy;
if (file_proxy === undefined)
{
    file_proxy = new Dynalinks_File_Proxy();
    file_proxy.port = new PortObjListener("file_proxy");
    file_proxy.port.process_message = function (message)
    {
        console.log("get message", message);
        if (message.command === "save_storage") {
            file_proxy.save_storage_to_file();
        }
    }
    file_proxy.port.run();
}

*/