var Promise = require('promise'),
    sqlite3 = require('sqlite3').verbose(),
    querys = require('./queries.js'),
    db = new sqlite3.Database('./taboomeat.db');

function getQuery(queryName) {
    var arry = querys[queryName];
    if (!arry) {
        throw "not query found! " + queryName
    }
    return querys[queryName].join("");
}


function keysToLowerCase(arry) {
    var newArry = [];
    for(var arr in arry) {
        var newObj = {};
        for(var key in arry[arr]) {
            newObj[key.toLowerCase()] = arry[arr][key];
        }
        newArry.push(newObj);
    }
    return newArry;
}

db.serialize(function() {
    db.run(getQuery('counts.create'));
    db.run(getQuery('profile.create'));
    db.run(getQuery('cookies.create'));
    db.run(getQuery('profile_cookies.create'));
});

function DataSupport() {

    function query(select, params) {
        return new Promise(function(success, error) {
            db.all(select, params, function(err, rows) {
                if (err) {
                    error(err);
                    return;
                }
                success(keysToLowerCase(rows));
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
                success(keysToLowerCase(rows));
            });
        });
    }

    return {
        "get": query,
        "update": run,
        "delete": run,
        "insert": run,
        "getdb": function() {
            return db;
        }
    }
}


module.exports = [DataSupport, getQuery];