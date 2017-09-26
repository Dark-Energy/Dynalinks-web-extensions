// http://www.broofa.com/Tools/Math.uuid.htm
var uuid_utils ={};
uuid_utils.chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split( '' );
uuid_utils.uuid = new Array( 36 );
uuid_utils.rnd = 0;


function generateUUID ()  
{
    var r;
    for ( var i = 0; i < 36; i ++ ) {
        if ( i === 8 || i === 13 || i === 18 || i === 23 ) {
            uuid_utils.uuid[ i ] = '-';
        } else if ( i === 14 ) {
            uuid_utils.uuid[ i ] = '4';
        } else {
            if ( uuid_utils.rnd <= 0x02 ) {
                uuid_utils.rnd = 0x2000000 + ( Math.random() * 0x1000000 ) | 0;
            }
            r = uuid_utils.rnd & 0xf;
            uuid_utils.rnd = uuid_utils.rnd >> 4;
            uuid_utils.uuid[ i ] = uuid_utils.chars[ ( i === 19 ) ? ( r & 0x3 ) | 0x8 : r ];
        }
    }
    return uuid_utils.uuid.join( '' );
} 
