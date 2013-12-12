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
              console.log("login - success" + JSON.stringify(user));
              console.log(done);
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
  console.log("serializeUser - ", user.id);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
//  Account.findById(id, function (err, user) {
//    done(err, user);
//  });

    var query = new Parse.Query(Parse.User);
    query.get(id, {
        success: function(user) {
            console.log("deserializerUser - user id - " + id);
            console.log("deserializerUser - parse user - " + JSON.stringify(user));
            done(null, user);
        }
    });
});