var passport = require('passport');
var locomotive = require('locomotive');
var Controller = locomotive.Controller;
var Parse = require('parse').Parse;
var Utils = require('../models/lib/utils.js');
var YammerConnector = require('../models/lib/social-connectors/yammer-social-connector.js');

var MainPanelController = new Controller();

MainPanelController.fail = function() {
    console.log('fail!');
}

MainPanelController.show = function() {
    var self=this;
    if (!this.req.isAuthenticated()) {
        if (this.req.cookies['parse.token']) {
            var token=this.req.cookies['parse.token'];
            console.log("token from cookie: " + token);
            Parse.User.become(token, function(user) {
                if (user) {
                    // set session cookie & render page
                    self.req.user=user;
                    self.req.session.passport.user=user.id; // make-up passport session
                    Utils.setSessionCookie(self.res, 'user', self.req.user);
                    self.render();
                }
                else {
                    console.log('Error occur when trying to retrive parse user from token!');
                    self.res.redirect('/login');
                }
            });
            return;
        }
        else
            return this.res.redirect("/login");
    }


    console.log("user = " + this.req.user.id + this.req.user.get("email"));
    if (this.req.session.remember_me=='on') {
        console.log('Remember Me is checked, setting up cookies...')
        this.res.cookie('parse.token', this.req.user._sessionToken, {expires: new Date(Date.now() + COOKIE_LIFECYCLE), httpOnly: true});
        delete this.req.session.remember_me;
    }
    Utils.setSessionCookie(this.res, 'user', this.req.user);
    console.log(self.req.session.passport.user);
    this.render();
}

MainPanelController.famous = function() {
    Utils.print();
    if (!this.req.isAuthenticated())
        return this.res.redirect("/login");
    //this.user = this.req.user;
    this.render('famous');
}

module.exports = MainPanelController;