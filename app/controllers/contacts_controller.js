var locomotive = require('locomotive');
var Controller = locomotive.Controller;

var Parse = require('parse').Parse;

var ContactsController = new Controller();

ContactsController.add = function() {

    var newContact = {
        email : this.param("email"),
        lastname : this.param("lastName"),
        firstname : this.param("firstName")
    };

    var user = this.req.user;

    user.initFirebaseRef = function(uid, serverRootRef) {
        var self=this;
        this.fireBaseRef = serverRootRef.child('users').child(uid);
        this.fireBaseIndexRef=serverRootRef.child('index');
        this.fireBaseContactRef=this.fireBaseRef.child('contacts');
        this.fireBaseRef.child('email').once('value', function(snapshot) {
            if (snapshot.val()==null || snapshot.val()=='unknown')
            {
                if (self.attributes.email)
                {
                    console.log('Init user FirebaseRef, email=' + self.attributes.email)
                    self.fireBaseRef.update({email: self.attributes.email});
                }
                else
                {
                    console.log('Init user FirebaseRef, email=unknown')
                    self.fireBaseRef.update({email: 'unknown'});
                }
            }
        });
    };
    user.importContactByEmail = function(newContact, done) {
        var self = this;
        this.fireBaseContactRef.once('value', function (snapshot) {
            var contactList = snapshot.val();
            var conflict = false;
            for (var id in contactList) {
                console.log("contact in contactList" + JSON.stringify(id));
                if (contactList[id].email == newContact.email) {
                    conflict = true;
                }
            }

            if (!conflict) {
                console.log("new Contact" + JSON.stringify(newContact));
                self.fireBaseContactRef.push(newContact, function () {
                    console.log('contact added!');
                    done();
                });
            } else {

            }
        });
    };

    console.log('/contact/add - this.res.user', this.req.user);
    console.log('/contact/add - Parse.User.current()', Parse.User.current());

    var self = this;

    user.initFirebaseRef(user.id, serverRootRef);
    user.importContactByEmail(newContact, function() {
        var API_USERNAME = "chapman";
        var API_PASSWORD = "qwerty23";

        var sendgrid  = require('sendgrid')(API_USERNAME, API_PASSWORD);

        var smtpapiHeaders = new sendgrid.SmtpapiHeaders();
        smtpapiHeaders.addFilterSetting('subscriptiontrack', 'enable', '0');

        sendgrid.send({
            smtpapi: smtpapiHeaders,
            to:       newContact.email,
            from:     user.get("email"),
            subject:  "Hello from Colabeo",
            text : "Please install Colabeo"
        }, function(err, json) {
            if (err) {
                console.error(err);
            }
            else
                console.log(json);
            self.res.json(json);
        });
    });
};

module.exports = ContactsController;