var extension_scheme="moz-extension";

if (typeof browser === 'undefined') {
    var is_chrome = true;
    var browser = chrome;
    extension_scheme = "chrome://"
}


