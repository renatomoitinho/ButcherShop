var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var session    = require('express-session');

var application = express();
var pub = __dirname + '/public';

//Configuration templates engine
application.set('view engine', 'jade');
application.set('views', __dirname + '/views');

//public files
application.use(express.static(pub));
application.use(cookieParser());
application.use(bodyParser.json());                         // for parsing application/json
application.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
application.use(multer());                                  // for parsing multipart/form-data
application.use(session({
  secret: 'keyboard meat',
  resave: false,
  saveUninitialized: true
}));

//
// ROUTES
//
require('./routes/routes')(application);

var server = application.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
