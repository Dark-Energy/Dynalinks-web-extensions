console.log("fabric dialog");

/*   prepare_postal: function ()
   {
        var self = this;
        var record = 
        {
            url: this.url,
            title: this.title
        }

        var p = new Postal({command: "get_tabinfo"});
        p.response = record;
        p.wait();        
    },
*/


var count = 0;
function find_active_tab()
{
    var url, title;
    
    function give_info()
    {
        count += 1;
        console.log("give info ", count);
        var ms = new MyStorage();
        ms.$on_write = function (key) {
              Tab_Manager.open_active_tab("/pages/dialog/dialog.html");
              ms.$on_write = undefined;
        }
        ms.write("dlink-temp-tabinfo", {url: url, title:title});
    }

    
    Tab_Manager.$job_done = function (tab)
    {
        url = tab.url;
        title = tab.title;
        this.$job_done = undefined;
        give_info();
    }
    Tab_Manager.find_active_tab();
    
}



function open_dialog()
{
   find_active_tab();
}

