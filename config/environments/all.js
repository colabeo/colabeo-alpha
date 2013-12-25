var express = require('express');
var passport = require('passport');
var flash = require('connect-flash');

function aa(req, res, next) {
    //req.session.passport={};
//    console.log(req.session);
    next();
}

module.exports = function() {
  // Configure application settings.  Consult the Express API Reference for a
  // list of the available [settings](http://expressjs.com/api.html#app-settings).
  this.set('views', __dirname + '/../../app/views');
  this.set('view engine', 'ejs');

  // Register EJS as a template engine.
  this.engine('ejs', require('ejs').__express);


  this.use(express.logger({ format: '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m :response-time ms' }));
  this.use(express.logger());
  this.use(express.cookieParser());
  this.use(express.bodyParser());
  this.use(express.methodOverride());
  this.use(express.session({ secret: 'keyboard cat' }));
  this.use(flash());

  this.use(passport.initialize());
  this.use(aa);
  this.use(passport.session());


  this.use(this.router);
  this.use(express.static(require('path').resolve(__dirname + "/../../public")));

  //this.datastore(require('locomotive-mongoose'));
};