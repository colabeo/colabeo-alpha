var passport = require('passport');
var Parse = require('parse').Parse;

module.exports = function () {
    /**
     * Facebook Provider, use Passport to authenticate
     */
    var provider = {
        authenticate: function(options) {
            var self = this;
            FB.login(function(response) {
                if (response.authResponse) {
                    if (options.success) {
                        options.success(self, {
                            id: response.authResponse.userID,
                            access_token: response.authResponse.accessToken,
                            expiration_date: new Date(response.authResponse.expiresIn * 1000 +
                                (new Date()).getTime()).toJSON()
                        });
                    }
                } else {
                    if (options.error) {
                        options.error(self, response);
                    }
                }
            }, {
                scope: requestedPermissions
            });
        },
        /**
         * Restore authentication from Facebook token
         */
        restoreAuthentication: function(authData) {
            if (authData) {
                var authResponse = {
                    userID: authData.id,
                    accessToken: authData.access_token,
                    expiresIn: (Parse._parseDate(authData.expiration_date).getTime() -
                        (new Date()).getTime()) / 1000
                };
                var newOptions = _.clone(initOptions);
                newOptions.authResponse = authResponse;

                // Suppress checks for login status from the browser.
                newOptions.status = false;

                // If the user doesn't match the one known by the FB SDK, log out.
                // Most of the time, the users will match -- it's only in cases where
                // the FB SDK knows of a different user than the one being restored
                // from a Parse User that logged in with username/password.
                var existingResponse = FB.getAuthResponse();
                if (existingResponse &&
                    existingResponse.userID !== authResponse.userID) {
                    FB.logout();
                }

                FB.init(newOptions);
            }
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
        logIn: function(sender) {
            // TODO: Make it open a a window, so won't jam the main_panel's req&res
            passport.authenticate('facebook')(sender.__req, sender.__res, sender.__next);
            //            passport.authenticate('facebook')(sender.__req, sender.__res, sender.__next);
        },
        link: function() {
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