var passport = require('passport');
var Parse = require('parse').Parse;
var Utils = require('../../app/models/lib/utils.js');

module.exports = function () {
    /**
     * Facebook Provider, use Passport to authenticate
     */
    var initOptions;
    var provider = {
        authenticate: function(sender, options) {
            var self = this;
            var promise=new Parse.Promise();
            var key=Utils.generateUniqueKey();
            sender.req.session.key=key;
            Utils.storeObjectWithKey(promise, key);
            passport.authenticate('facebook')(sender.__req, sender.__res, sender.__next);
            promise.done(function(result) {
                if (result.id) {
                    if (options.success) {
                        options.success(self, {
                            id: result.id,
                            access_token:result.access_token,
                            expiration_date: new Date(result.expiresIn*1000 + (new Date()).getTime()).toJSON()
                        });
                    }
                } else {
                    if (options.error) {
                        options.error(self, result);
                    }
                }
            });
        },
        /**
         * Restore authentication from Facebook, do nothing ,just a placeholder
         */
        restoreAuthentication: function(authData) {
            console.log(authData);
            return true;
        },
        getAuthType: function() {
            return "facebook";
        },
        deauthenticate: function() {
            this.restoreAuthentication(null);
        }
    };

    Parse.FacebookConnector = {
        /**
         * Facebook connector initialize, call this function after you have login onto facebook
         * @param options - social network credentials
         */
        init: function (options) {
            // check validity of options(facebook credentials from passport)
            Parse.User._registerAuthenticationProvider(provider);
            //console.log(Parse.User._authProviders); // TODO: for debugging only
        },

        /**
         * Gets whether the user has their account linked to Facebook.
         * @param user  - Parser.User
         */
        isLinked: function(user) {
            return user._isLinked("facebook");
        },

        /**
         * Pops up a window and let user login to social networks, creates entry to Parse.
         * @param sender - locomotive controller
         */
        logIn: function(sender, callback) {
            // TODO: login to facebook and link credentials with parse user
            var promise=new Parse.Promise();
            var key=Utils.generateUniqueKey();
            sender.req.session.key=key;
            Utils.storeObjectWithKey(promise, key);
            passport.authenticate('facebook')(sender.__req, sender.__res, sender.__next);
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

    /**
     * Init FacebookConnector
     */
    Parse.FacebookConnector.init();
}


//console.log(Parse);