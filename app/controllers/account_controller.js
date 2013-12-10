var locomotive = require('locomotive');
var passport = require('passport');
var Controller = locomotive.Controller;

var Parse = require('parse').Parse;

var Account = require('../models/account');

var AccountController = new Controller();

AccountController.show = function() {
  if (!this.req.isAuthenticated())
    return this.res.redirect(this.urlFor({ action: 'login' }));

  this.user = this.req.user;
  this.render();
};

AccountController.new = function() {
  //console.log("Is parse here? " + parseApp);
    var query = new Parse.Query(Parse.User);
    query.find({
        success: function(users) {
            for (var i = 0; i < users.length; ++i) {
                console.log(users[i].get('username'));
            }
        }
    });
  this.render();
};

AccountController.registrationForm = function() {
    this.render();
};

AccountController.loginForm = function() {
  console.log("login form - authenticated - " + this.req.isAuthenticated());
  this.render();
};

AccountController.create = function() {
  var account = new Account();
  console.log("shit");

  account.email = this.param('email');
  account.password = this.param('password');
  account.name.first = this.param('name.first');
  account.name.last = this.param('name.last');

  var self = this;
  account.save(function (err) {
    if (err)
      return self.redirect(self.urlFor({ action: 'new' }));

    return self.redirect(self.urlFor({ action: 'login' }));
  });
};

AccountController.signup = function() {
    var user = new Parse.User();
    user.set("lastname", this.param('lastname'));
    user.set("firstname", this.param('firstname'));
    user.set("username", this.param('email'));
    user.set("password", this.param('password'));
    user.set("email", this.param('email'));

    var self = this;
    user.signUp(null, {
        success: function(user) {
            // Hooray! Let them use the app now.
            console.log("Sign up - success");
            self.redirect('/');
        },
        error: function(user, error) {
            // Show the error message somewhere and let the user try again.
            // alert("Error: " + error.code + " " + error.message);
        }
    });
}

AccountController.login = function() {
  var self = this;
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: this.urlFor({ action: 'login' }) }
  )(this.__req, this.__res, this.__next);
};

AccountController.logout = function() {

  this.req.logout();
  Parse.User.logOut();

  this.redirect('/');
};

AccountController.importContacts = function() {
    this.redirect('/');
};

AccountController.lookup = function() {
    var externalId = this.param('externalId');
    console.log(externalId);
    var query = new Parse.Query(Parse.User);
    var self = this;
    query.equalTo("email", externalId);
    query.find({
        success: function(users) {
            console.log("user - " + JSON.stringify(users[0]));
            self.res.json({ callee :  users[0] });
        }
    });
}

module.exports = AccountController;
