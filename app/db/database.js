var Promise = require('promise'),
	sqlite3 = require('sqlite3').verbose(),
	querys = require('./queries.js'),
	db = new sqlite3.Database('./taboomeat.db');

function getQuery(queryName) {
	var arry = querys[queryName];
	if (!arry)
		throw "not query found!"
	return querys[queryName].join("");
}

db.serialize(function() {
	db.run(getQuery('counts.create'));
	db.run(getQuery('counts.insert'),["counter", 0]);
	// db.each("SELECT VALUE FROM COUNTS", function(err,row){
	// 	console.log(row);
	// });
});

function DataSupport() {
	
	function query(select, params) {
		return new Promise(function(success, error) {
			db.all(select, params, function(err, rows) {
				if (err) {
					error(err);
					return;
				}
				success(rows);
			});
		});
	};

	function run(select, params) {
		return new Promise(function(success, error) {
			db.run(select, params, function(err, rows) {
				if (err) {
					error(err);
					return;
				}
				success(rows);
			});
		});
	}

	return {
		"get": query,
		"update": run,
		"delete": run,
		"insert": run
	}
}


module.exports = [DataSupport,getQuery];