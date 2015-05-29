var express = require('express');
var application = express();

require('./routes/routes')(application);

var server = application.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
