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
    Parse.FacebookUtility.logIn(this, {
        success: function(result) {
            console.log("facebook auth done!");
            if (!Parse.User.current()) {
                console.log('You haven\'t logged in to Parse yet!');
                return;
            }
            Parse.FacebookUtility.link(result);
            console.log('Is Linked: ' +Parse.FacebookUtility.isLinked());
            console.log('Query for ' + result.id + ' : ');
            Parse.FacebookUtility.query(result.id, function(result_array) {
                console.log(result_array);
            });
        },
        error: function(err) {
            console.log(err);
        }
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
    promise.resolve(this.req.user.accounts.facebook);
    closeWindow(this.res);
}

module.exports = AuthController;