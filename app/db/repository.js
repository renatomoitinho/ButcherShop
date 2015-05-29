var database = require('./database.js');
var db = database[0](),
	getQuery = database[1];

function Repository() {

	return {

		getCount: function() {
			return db.get(getQuery('counts.all'));
		},

		updateCount: function() {
			return db.update(getQuery('counts.update'), ['counter']);
		}
	}
}

module.exports = Repository;