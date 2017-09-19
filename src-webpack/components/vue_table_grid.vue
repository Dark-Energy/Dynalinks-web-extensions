<template>
<div><table cellpadding="10" border="1" class="vueTableGrid">
        <thead>
        <tr>
            <th>
            <span v-on:click="sort_address"> Address </span>
            </th>
            <th>
            <span v-on:click="sort_title"> Title </span>
            </th>
            <th>Close tab</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in tab_info_list">
            <td><a v-bind:href="item.url">{{item.url}}</a></td>
            <td>{{item.title}}</td>
            <td v-on:click="close_tab" :key="item.id" style="grid-tab"><button type="button" :data-id="item.my_id">X</button></td>
        </tr>
        </tbody>
    </table></div>
</template>


<script>

var vueTableGrid = {};

   vueTableGrid.name = "vueTableGrid";
   vueTableGrid.props = ["event_hub"];

 
    vueTableGrid.methods =
    {
        
        creating_remove_method: function (self)
        {
            if (this.port === undefined) {
                this.port = new Portman("tab-manager");                        
            } else {
                return;
            }
            
            this._inner_close_tab = function (id) 
            {
                this.port.post({
                    "command": "tab", 
                    "info" : "remove", 
                    "id": id});
                //console.log("require remove tab by id " + id);
                //FIX IT! First error, cause by fact what truth tab id is uuid, 
                //but attribute named 'id'
                remove_by_field_value(this.tab_info_list, "my_id", id);
            }
            
        },
        
        close_tab: function (event)
        {
            var id = event.target.getAttribute('data-id');
            this._inner_close_tab(id);
        },
        
        move_to: function (e) {
        },
        
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
            
        }
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
        /*
        //test code
        event_hub.$on("start", function () {
            console.log("get started");
            event_hub.$emit("get", function (d) {
                self.tab_info_list= d;
                console.log("callback bring info", JSON.stringify(d));
            });      
        });*/
       
        event_hub.$on("set->tabinfo", function (tabinfo) {
            //console.log("get event set->tabinfo" + JSON.stringify(tabinfo));
            self.tab_info_list = tabinfo;
            self.creating_remove_method();            
            
        });
    }

export default  vueTableGrid;
</script>    
    
    
