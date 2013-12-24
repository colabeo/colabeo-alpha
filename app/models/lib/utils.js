/**
 *  Contains Random Utils Function Used by Controllers.
 */
btoa = require('btoa');

var Utils = function() {
}

Utils.setSessionCookie = function(res, name, value) {
    var val_base64=btoa(JSON.stringify(value)); // not real base64 but will do..
    res.cookie(name, val_base64);
}

module.exports = Utils;

