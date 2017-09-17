var vueTableGrid = {};

   vueTableGrid.props = ["event_hub"];


               
   vueTableGrid.template = '<div><table cellpadding="10" border="1" class="vueTableGrid">\
        <thead  >\
        <tr>\
            <th>\
            <span v-on:click="sort_address"> Address</span>\
            </th>\
            <th>\
            <span v-on:click="sort_title">Title</span>\
            </th>\
        </tr>\
        </thead>\
        <tbody>\
        <tr v-for="item in tab_info_list">\
            <td><a v-bind:href="item.url">{{item.url}}</a></td>\
            <td>{{item.title}}</td>\
        </tr>\
        </tbody>\
    </table></div>';
    
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
        /*event_hub.$on("start", function () {
            console.log("get started");
            event_hub.$emit("get", function (d) {
                self.tab_info_list= d;
                console.log("callback bring info", JSON.stringify(d));
            });      
        });*/
        event_hub.$on("set->tabinfo", function (tabinfo) {
            //console.log("get event set->tabinfo" + JSON.stringify(tabinfo));
            self.tab_info_list = tabinfo;
            //self.tab_info_list.splice(0, self.tab_info_list.length, tabinfo);
        });
        
        
    }
    
    
    
