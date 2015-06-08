var repository = require('../db/repository/repository.js')()
var it = require('underscore');
var ProfileController = require('./profile.routes');
var APIBaseName = "/meat"
var safe = global.safe = function(routeName) {
    return APIBaseName.concat(routeName);
}

function Routes(app) {


    app.get('/', function(req, res) {
        res.render('login');
    });

    app.get('/login', function(req, res) {
        res.render('login', {
            title: 'Express Login'
        });
    });

    app.get('/data', function(req, res) {
        repository.getCount().then(function(data) {
            res.send(data);
        });
    });

    app.get('/data/set', function(req, res) {
        repository.updateCount().then(function() {
            res.send('sucess update!!!');
        });
    });


    //
    // PROFILES ROUTES
    //
    var profileController = new ProfileController();
    app.all(safe('/*'), profileController.requiredAuthenticate.bind(repository));
    app.get(safe('/dashboard'), function(req, res) {
        res.render('dashboard', {
            authenticated: req.session.authenticated
        });
    });
    app.post('/profile/authenticate', profileController.authenticate.bind(repository));
    app.get(safe('/profile/logout'), profileController.logout.bind(repository));
    app.get(safe('/profiles'), profileController.getAllProfiles.bind(repository));
    app.get(safe('/profile/:id/edit'), profileController.editProfile.bind(repository));
    app.post(safe('/profile/new'),profileController.insertProfile.bind(repository));
    app.post(safe('/profile/:id/remove'), profileController.removeProfile.bind(repository));
    app.post(safe('/profile/:id/update'), profileController.updateProfile.bind(repository));

    //
    // COOKIES ROUTES
    //
    app.get('/cookies/insert', profileController.insertCookie.bind(repository));
    app.get('/cookies', profileController.getAllCookies.bind(repository));
}

module.exports = Routes;