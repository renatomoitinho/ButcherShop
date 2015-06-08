function ProfileRepository() {
    var db = this.db,
        getQuery = this.getQuery,
        it = this.it;

    function keysToLowerCase(obj) {
        var newObj = {};
        for (var key in obj) {
            newObj[key.toLowerCase()] = obj[key];
        }
        return newObj;
    }

    return {
        all: function() {
            return db.get(getQuery('profile.all'));
        },

        getById: function(ref) {
            return db.get(getQuery('profile.byId'), ref);
        },

        update: function(merge, obj) {
            obj = it.omit(obj, function(value, key, object) {
                return it.isEmpty(value);
            });
            var data = it.extend(keysToLowerCase(merge), obj);
            return db.update(getQuery('profile.update'), [data.name, data.email, data.password, data.id]);
        },

        remove: function(id) {
            return db.delete(getQuery('profile.delete'), id);
        },

        insert: function(obj) {
            return db.insert(getQuery('profile.insert'), [obj.name, obj.email, obj.password]);
        },

        auth: function(obj) {
            return db.get(getQuery('profile.auth'), [obj.email, obj.password]);
        }
    }
}

module.exports = ProfileRepository;