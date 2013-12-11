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
    var user = Parse.User.current();
    var self = this;

    user.importContactByEmail(newContact, function() {
    
        var query = new Parse.Query(Parse.User);
        query.equalTo( "email", newContact.email);  // find all the same user
        query.first({
            success: function(results) {
                //console.log("Results" + JSON.stringify(results));
                if ( results == undefined )  {
                    sendInviteEmail(user, newContact);
                }
                else {
                    sendContactNotification(user,newContact);
                }
            }
        }); //End Query.first
    }); //End User.importContactByEmail
};  //End ContactsController.Add

  
var sendInviteEmail = function(user, newContact) {
        var subject = user.get("firstname") + " has just invited you to chat with Colabeo";
        var text = "Hi " + newContact.firstname + ",\n\n" + user.get("firstname") + " has just invited you to use Colabeo. Please click on this link to add Colabeo extension to your chrome browser: www.colabeo.com/install.html Talk to you soon!";
        var to = newContact.email;
        var from = user.get("email");
        sendEmail(to,from,subject,text); 
};

var sendContactNotification = function(user,newContact) {
        var subject = user.get("firstname") + " has just added you their contact list. Start calling today!"
        var text = "Hi " + newContact.firstname + ",\n\n" + user.get("firstname") + " has just added you to their Colabeo contact list. Open your browser and call them back."
        var to = newContact.email;
        var from = user.get("email");
        sendEmail(to,from,subject,text);
};

var sendEmail = function(to,from,subject,text) {
        var API_USERNAME = "chapman";
        var API_PASSWORD = "qwerty23";

        var sendgrid  = require('sendgrid')(API_USERNAME, API_PASSWORD);

        var smtpapiHeaders = new sendgrid.SmtpapiHeaders();
        smtpapiHeaders.addFilterSetting('subscriptiontrack', 'enable', '0');
        sendgrid.send({
            smtpapi: smtpapiHeaders,
            to:       to,
            from:     from,
            subject:  subject,
            text : text 
        }, function(err, json) {
            if (err) {
                console.error(err);
            }
            else
                console.log(json);
            //self.res.json(json);
        }); 
};
  



module.exports = ContactsController;