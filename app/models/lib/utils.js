/**
 *  Contains Random Utils Function Used by Controllers.
 */
btoa = require('btoa');
var ObjectPool={};
var Utils = function() {
}

/**
 * Generates a unique key for global object storage
 */
Utils.generateUniqueKey = function() {
    // TODO: add key generate logic
    return "1234";
}

/**
 * Stores an object globally, for future use.
 * @param object - the one you wanna store
 * @param key - unique key for accessing object that stored globally
 */
Utils.storeObjectWithKey = function(object, key) {
    ObjectPool[key]=object;
}

/**
 * Retrieve an object that stored globally.
 * @param key - unique key for accessing object that stored globally
 * @returns {*} - stored object
 */
Utils.findObjectWithKey = function(key) {
    return ObjectPool[key];
}

/**
 * Remove stored object, free memory.
 * @param key
 */
Utils.removeObjectWithKey = function(key) {
    delete ObjectPool[key];
}

/**
 * Set-up session cookie
 * @param res - http.respond
 * @param name - cookie's name
 * @param value - cookie's value
 */
Utils.setSessionCookie = function(res, name, value) {
    var val_base64=btoa(JSON.stringify(value)); // not real base64 but will do..
    res.cookie(name, val_base64);
}

module.exports = Utils;

