<template>
<div><table cellpadding="10" border="1" class="vueTableGrid">
        <thead>
        <tr>
            <th>
            <button type="button" v-on:click="sort_address"> Sort by Address </button>
            </th>
            <th>
            <button type="button" v-on:click="sort_title"> Sort by Title </button>
            </th>
            <th>Close tab</th>
            <th>Go</ht>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in tab_info_list">
            <td><a v-bind:href="item.url">{{item.url}}</a></td>
            <td>{{item.title}}</td>
            <td @click="close_tab" :key="item.id" style="grid-tab"><button type="button" :data-id="item.my_id">X</button></td>
            <td :key="item.id" style="grid-tab"><button type="button" @click="go":data-id="item.my_id">Go</button></td>
        </tr>
        </tbody>
    </table></div>
</template>


<script>

var Proxy_Object =
{
};

//page manager
var vueTableGrid = {};

   vueTableGrid.name = "vueTableGrid";
   vueTableGrid.props = ["event_hub"];

 
    vueTableGrid.methods =
    {
        
        sort_address: function ()
        {
            this.tab_info_list.sort(function (a,b) {
                if (a.url > b.url) 
                  return 1;
                if (a.url < b.url)
                  return -1;
                return 0;
            });
        },
        sort_title: function () 
        {
            this.tab_info_list.sort(function (a,b) {
                a = a.title.toLowerCase();
                b = b.title.toLowerCase();
                if (a > b) 
                  return 1;
                if (a < b)
                  return -1;
                return 0;
            });
            
        },

        go: function (event) {
            var uuid = event.target.getAttribute('data-id');
            Tab_Manager.go(uuid);
        },

        
        close_tab: function (event)
        {
            var uuid = event.target.getAttribute('data-id');
            //console.log("remove tab " + uuid);            
            this.remove_tab(uuid);
            remove_by_field_value(this.tab_info_list, "my_id", uuid);
        },
        
        remove_tab: function (uuid) {
            Tab_Manager.remove(uuid);
        },
        create_connection_and_get_info: function ()
        {
            //console.log(JSON.stringify(Tab_Manager), "tab manager");
            Tab_Manager.$on("get_all_tabs_info", (m) => 
            {
                this.tab_info_list = m.tabinfo;
                //console.log("tabinfo " + JSON.stringify(m, null, ' '));
            });
            Tab_Manager.get_all_tabs_info();
            //console.log(JSON.stringify(Tab_Manager), "tab manager");            
        },
        
        /*
        remove_tab: function (uuid)
        {
            //CAVEAT! First error, cause by fact what truth tab id is uuid, 
            //but attribute named 'id'
            var command = {               
                "command": "tab", 
                "info" : "remove", 
                "id": uuid
            };
            //console.log("command : tab->remove", uuid);
            if (Proxy_Object.port.port === undefined ) console.log("WTF?");
            console.log(Proxy_Object.port);
            Proxy_Object.port.post(command);
            
        },


        create_connection_and_get_info: function ()
        {
            var self = this;
            console.log("request tabinfo");
            //get info from tab-manager and give it tab-list    
            if (Proxy_Object.port === undefined) {
                Proxy_Object.port = new Portman("tab-manager", true);
                Proxy_Object.port.process_message = function (m) {
                   console.log("get tabinfo");// + JSON.stringify(m));
                   self.tab_info_list = m.tabinfo;
                Proxy_Object.port.process_message = undefined;   
                }
            }
            Proxy_Object.port.post({command:"get", info:"alltabinfo"});
        },
        */
        
    }

    
    vueTableGrid.data = function ()
    {
        var data = 
        {
            tab_info_list: [],
        }
        return data;
    }
    
    vueTableGrid.created = function ()
    {
        var self=this;
       
        this.create_connection_and_get_info();
    }

export default  vueTableGrid;
</script>    
    
    
