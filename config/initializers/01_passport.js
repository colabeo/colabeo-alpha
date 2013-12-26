var passport = require('passport')
    , FacebookStrategy = require('passport-facebook').Strategy
var LocalStrategy = require('passport-local').Strategy;
var Account = require('../../app/models/account');

var Parse = require('parse').Parse;

module.exports = function () {
    /**
     * Facebook local authentication process, add credentials Parse.User.current()
     */
    passport.use(new FacebookStrategy({
            clientID: FACEBOOK_APP_ID,
            clientSecret: FACEBOOK_APP_SECRET,
            callbackURL: HOST_SERVER_URL + "/callback/facebook",
            passReqToCallback: true
        },
        function (req, facebookAccessToken, refreshToken, profile, done) {
            console.log('Facebook local authentication...');
            profile.access_token=facebookAccessToken;
            profile.expiresIn=1000000;
            delete profile._raw;
            delete profile._json;
            if (!req.user) { req.user={}; }
            if (!req.user.authData) {req.user.authData={}; }
            req.user.authData.facebook=profile;
            console.log(req.user);
            done(null, req.user);
        }
    ));

    // Use the LocalStrategy within Passport.
    passport.use(new LocalStrategy({
            //usernameField: 'email'
            passReqToCallback: true
        },
        function (req, email, password, done) {
            console.log("email - " + email);
            console.log("password - " + password);
            Parse.User.logIn(email, password, {
                success: function (user) {
                    if (req.body.RememberMe)
                        req.session.remember_me = req.body.RememberMe;

                    if (user.get("emailVerified"))
                        return done(null, user);
                    else {
                        var message = "email is not verified.";
                        return done(null, false, message);
                    }

                },
                error: function (user, error) {
                    console.log("login - error" + JSON.stringify(error));
                    return done(null, false, error.message);
                }
            });
        }
    ));

    // Passport session setup.
    passport.serializeUser(function (user, done) {
        console.log(user);
        console.log("user - ", user.id);
        done(null, user.id); // TODO: pass facebook id as well
    });

    passport.deserializeUser(function (id, done) {
        var query = new Parse.Query(Parse.User);
        query.get(id, {
            success: function (user) {
                console.log("deserializerUser - user id - " + id);
                console.log("deserializerUser - parse user - " + JSON.stringify(user));
                done(null, user);
            },
            error: function(err) {
                console.log(err);   // TODO: occurs when trying to query an non-existing user id, need some time to fix that
            }
        });
    });
}