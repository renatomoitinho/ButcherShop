var Promise = require('promise');
var CookieRepository = module.exports = function() {
    var db = this.db,
        getQuery = this.getQuery,
        it = this.it;

    return {
        insert: function(obj) {
            return new Promise(function(success, error) {
                db.get(getQuery('cookie.find.name'), obj.cookie_value).then(function(data){
                    if(it.isEmpty(data)){
                        db.get(getQuery('cookie.index')).then(function(data) {
                            var index = it.first(data);
                            db.insert(getQuery('cookie.insert'), [index.next, obj.cookie_name, obj.cookie_value])
                            .then(function(){
                                 db.insert(getQuery('profile.cookies.insert'), [index.next, obj.profileId]).then(success)
                                 .catch(error);
                            })
                            .catch(error);
                        });
                        return;
                    }
                    success();
                }).catch(error);
            });
        },

        all: function() {
            return db.get(getQuery('cookie.all'));
        },

        findByName: function(name) {
            return db.get(getQuery('cookie.findBy.value'), name);
        }
    }
}