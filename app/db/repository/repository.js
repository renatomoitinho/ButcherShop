var it = require('underscore');
var database = require('../database.js');
var db = database[0](),
    getQuery = database[1];

var data = {
    'db': database[0](),
    'getQuery': database[1],
    'it': it
};

var profileRepository = require('./profile.repository').bind(data)();
var cookiesRepository = require('./cookie.repository').bind(data)();

function Repository() {

    return {

        getCount: function() {
            return db.get(getQuery('counts.all'));
        },

        updateCount: function() {
            return db.update(getQuery('counts.update'), ['counter']);
        },

        profile: profileRepository,
        cookiesRepository: cookiesRepository
    }
}

module.exports = Repository;