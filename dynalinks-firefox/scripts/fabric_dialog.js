function give_info_and_open_app(title, url)
{
    var ms = new MyStorage();
    ms.$on_write = function ()
    {
        Tab_Manager.open_active_tab("/pages/links_view/links_view.html");
    }
    var data = {"dlink-temp": {"command": "create->record", "title":title, "url": url}};
    ms.write(data);
    console.log("write dlink-temp" + JSON.stringify(data));
}

function find_active_tab()
{
    Tab_Manager.$job_done = function (tab)
    {
        url = tab.url;
        title = tab.title;
        this.$job_done = undefined;
        give_info_and_open_app(title, url);
    }
    Tab_Manager.find_active_tab();
}

function open_dialog()
{
   find_active_tab();
}
