var it = require('underscore');
var normalizedPath = require("path").join(__dirname, "./schemes");
var schemes = {}

require("fs").readdirSync(normalizedPath).forEach(function(file) {
  it.extend(schemes,require("./schemes/" + file));
});

module.exports = schemes;