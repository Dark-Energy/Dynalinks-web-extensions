function filter_list(list, filter)
{
    var result = [];
    for(var i = 0; i < list.length; i++) {
        var elem = list[i];
        if (filter(elem)) {
            result.push(elem);
        }
    }
    return result;
}


//return these elements from list, which value is in object 
function filter_list_by_dict(list, dict, key)
{
    var r = filter_list(list, function (elem) {
        var value = elem[key];
        return (dict[value] !== undefined);
    });
    return r;
}

function gen_list()
{
    var list = [];
    for(var i = 0; i < 10; i++) {
        list.push({"id": "id"+i, "text": "test text " + i});
    }
    return list;
}

function gen_object()
{
    var result = {};
    
    var i = 0;
    while (i < 5){
        result["id" + i*2] = "some value";
        i++;
    }
    return result;
}

var list = gen_list();
var dict = gen_object();

var filtered_list = filter_list(list, function (elem) {
    return (dict[elem.id] !== undefined);
});

filtered_list = filter_list_by_dict(list, dict, 'id');

console.log("filter is ", dict);
console.log("filtered list", filtered_list);