function keys_to_array(obj)
{
    var arr = new Array();
    for(var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            arr.push(key);
        }
    }
    return arr;
}

function values_to_array(obj)
{
    var arr = [];
    for(var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
                arr.push(obj[key]);
        }
    }
    return arr;
}

