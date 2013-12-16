var locomotive = require('locomotive');
var Controller = locomotive.Controller;
var Parse = require('parse').Parse;
var YammerConnector = require('../models/lib/social-connectors/yammer-social-connector.js');

var MainPanelController = new Controller();

MainPanelController.show = function() {
    var self=this;
    if (!this.req.isAuthenticated()) {
        if (this.req.cookies['parse.token']) {
            var token=this.req.cookies['parse.token'];
            console.log("token from cookie: " + token);
            Parse.User.become(token, function(user) {
                if (user) {
                    self.req.user=user;
                    self.req.session.passport.user=user.id; // make-up passport session
                    self.render({ user: self.req.user });
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

    this.render({ user: this.req.user });
}

MainPanelController.famous = function() {
    if (!this.req.isAuthenticated())
        return this.res.redirect("/login");

    //this.user = this.req.user;
    this.render('famous');
}

module.exports = MainPanelController;