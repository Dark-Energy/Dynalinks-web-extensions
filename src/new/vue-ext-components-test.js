var app = new Vue ({el:"app", 
    components : {
    "CreateRecordForm" : CreateRecordForm,
    "CategoryCreate": CategoryCreate,
    },
    template: "<div><CategoryCreate /></div>"
});