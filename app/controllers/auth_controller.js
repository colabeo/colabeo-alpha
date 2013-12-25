var passport = require('passport');
var locomotive = require('locomotive');
var Controller = locomotive.Controller;
var AuthController = new Controller();

/**
 * When user done login at facebook.com, pass the credentials to a custom callback route,
 * then passport authenticate those credentials locally to determine whether it is a success.
 */
AuthController.before('callbackFacebook', passport.authenticate('facebook', { failureRedirect: '/fail' }));
AuthController.callbackFacebook = function() {
    console.log('facebook callback');
}

module.exports = AuthController;