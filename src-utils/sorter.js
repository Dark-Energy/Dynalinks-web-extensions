function Sorter()
{
    this.directions = {};
}

Sorter.prototype.sort_by_key = function(list, key, prepare_func)
{
    if (this.directions[key] === undefined) {
        this.directions[key] = true;
    }
    
    var reverse = !this.directions[key];
    this.last_sort_key = key;    
    
    function cmp_func(a,b)
    {
        var x = a[key];
        var y = b[key];
        if (prepare_func) {
            x = prepare_func(x);
            y = prepare_func(y);
        }
        
        var r = 0;
        if (x > y) {
          r = 1;
        } else if (x < y) {
          r = -1;
        }
        if (reverse) {
            r = 0 - r;
        }
        return r;
    }

    list.sort(cmp_func);
}

Sorter.prototype.toggle_direction = function(key)
{
    if (this.directions[key] === undefined){
        this.directions[key] = true;
    } else {
        this.directions[key] = !this.directions[key];
    }
}
