var passport = require('passport');
var Parse = require('parse').Parse;
var Utils = require('../../app/models/lib/utils.js');

module.exports = function () {
    Parse.FacebookUtility = {
        /**
         * Gets whether the user has their account linked to Facebook.
         * @param user  - Parser.User
         */
        isLinked: function(user) {
            return user._isLinked("facebook");
        },

        /**
         * Pops up a window and let user login to social networks, creates entry to Parse.
         * @param callee - locomotive controller, something with a req/res...
         */
        logIn: function(callee, callback) {
            // TODO: login to facebook and link credentials with parse user
            var promise=new Parse.Promise();
            var key=Utils.generateUniqueKey();
            callee.req.session.key=key;
            Utils.storeObjectWithKey(promise, key);
            passport.authenticate('facebook')(callee.__req, callee.__res, callee.__next);
            promise.done(function(result) {
                callback(result);
            });
        },

        link: function(user) {
            // TODO: link parse user with
            passport.authenticate('facebook')(sender.__req, sender.__res, sender.__next);
        },

        /**
         * logout from this social network, delete entry from Parse.
         * @param sender - locomotive controller
         */
        unlink: function(sender) {
            sender.req.logout();
        }
    }
}


//console.log(Parse);