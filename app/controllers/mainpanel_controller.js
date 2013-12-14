var locomotive = require('locomotive');
var Controller = locomotive.Controller;
var Parse = require('parse').Parse;
var YammerConnector = require('../models/lib/social-connectors/yammer-social-connector.js');

var MainPanelController = new Controller();

MainPanelController.show = function() {
    if (!this.req.isAuthenticated())
        return this.res.redirect("/login");
    console.log("user = " + this.req.user.id + this.req.user.get("email"));

//    var parseUser=Parse.User.current(); //this.req.user is just a reference of Parse.User.current()
////    console.log(parseUser);
//    parseUser.initFirebaseRef(parseUser.id, serverRootRef);
//
//    // Add connector
//    var socialConnector=new YammerConnector();
//    socialConnector.init('1508830799', 'JELIFQKXZ7wlEZgBk3Kamw'); //hardcoded id and token(yammer).
//    parseUser.addSocialConnector('yammer', socialConnector);

    /*
    // Import contacts
    parseUser.importContacts('yammer', function (err) {
        if (err)
            return console.log('importContact Fail! Error: ' + e);
        console.log('importContact Success!');
    });
    console.log('importContact Finish..');
    */

    this.render({ user: this.req.user });
}

MainPanelController.famous = function() {
    if (!this.req.isAuthenticated())
        return this.res.redirect("/login");

    //this.user = this.req.user;
    this.render('famous');
}

module.exports = MainPanelController;