var passport = require('passport');
var Parse = require('parse').Parse;
var locomotive = require('locomotive');
var Controller = locomotive.Controller;
var AuthController = new Controller();
var Utils = require('../models/lib/utils.js');

function closeWindow(res) {
    res.send("<script>window.close()</script>");
}


AuthController.authFacebook = function() {
    Parse.FacebookConnector.logIn(this, function(result) {
        console.log("facebook auth done!");
    });
}

/**
 * When user done login at facebook.com, pass the credentials to a custom callback route,
 * then passport authenticate those credentials locally to determine whether it is a success.
 *
 * When user complete login on facebook.com, the thread will go back to AuthController.authFacebook()
 * as a callback.
 */

AuthController.before('callbackFacebook', passport.authenticate('facebook', { failureRedirect: '/fail' }));
AuthController.callbackFacebook = function() {
    console.log('facebook callback');
    var key=this.req.session.key;
    var promise=Utils.findObjectWithKey(key);
    Utils.removeObjectWithKey(key);
    delete this.req.session.key;
    promise.resolve(this);
    closeWindow(this.res);
}

module.exports = AuthController;