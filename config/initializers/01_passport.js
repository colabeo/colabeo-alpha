var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Account = require('../../app/models/account');

var Parse = require('parse').Parse;

// Use the LocalStrategy within Passport.

passport.use(new LocalStrategy({
        //usernameField: 'email'

    },
    function(email, password, done) {
        console.log("email - " + email);
        console.log("password - " + password);
        Parse.User.logIn(email, password, {
            success: function(user) {

//              var parseUser=Parse.User.current(user._sessionToken); //this.req.user is just a reference of Parse.User.current()
//              //    console.log(parseUser);
//              parseUser.initFirebaseRef(parseUser.id, serverRootRef);
//              console.log("has import contact by email function ", parseUser.importContactByEmail);
//              return done(null, parseUser);

                return done(null, user);
            },
            error: function(user, error) {
                //self.$(".login-form .error").html("Invalid username or password. Please try again.").show();
                //this.$(".login-form button").removeAttr("disabled");
                console.log("login - error" + JSON.stringify(error));
                return done(null, false, error.message);
            }
        });
    }
));

// Passport session setup.

passport.serializeUser(function(user, done) {
//  console.log("serializeUser - ", user._sessionToken);
//  done(null, user._sessionToken);

    console.log("user - ", user.id);
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
//  Account.findById(id, function (err, user) {
//    done(err, user);
//  });
//
//    console.log("sessionToken: " + _sessionToken);
//    Parse.User.become(_sessionToken);
//    var user = Parse.User.current();
//    done(null, user);

    var query = new Parse.Query(Parse.User);
    query.get(id, {
        success: function(user) {
            console.log("deserializerUser - user id - " + id);
            console.log("deserializerUser - parse user - " + JSON.stringify(user));
            done(null, user);
        }
    });

//    console.log("deserializeUser - ", sessionToken);
//    //var user = Parse.User.current(id);
//    Parse.User.become(sessionToken);
//    var user = Parse.User.current();
//
//    //console.log("deserializeUser - after Parse.User.become - ", user);
//
//    done(null, user);
});