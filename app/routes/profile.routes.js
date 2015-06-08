var it = require('underscore');
var md5 = require('MD5');
var ProfileController = module.exports = function() {};
var proto = ProfileController.prototype;

function generateSecretCookie(payload) {
    return [md5(payload.header), payload.code, md5(payload.remote)].join('$').toUpperCase();
}

function prepareCookieToInsert(email, agent, remoteAddress, profile) {

    var code = md5(email);
    var payload = {
        header: agent,
        remote: remoteAddress,
        code: code
    };
    return {
        cookie_name: code,
        cookie_value: generateSecretCookie(payload),
        profileId: profile
    };
}

function setClientCookie(response, cookieValue) {
    var date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    response.cookie('meat_auth', cookieValue, {
        expires: date,
        httpOnly: true
    });
}

function validateOrigin(cookie, payload) {
    cookie = cookie.toLowerCase().split('$');

    return cookie.length === 3 &&
        cookie[0] === md5(payload.header) &&
        cookie[2] === md5(payload.remote);
}

function extractCookie(sig) {
    var i = sig.indexOf(".");
    var li = sig.indexOf(".", ++i);
    return (sig.substring(i, li));
}

proto.insertCookie = function(req, res, next) {
    var code = md5('<email>');
    var payload = {
        header: req.headers['user-agent'],
        remote: req.connection.remoteAddress,
        code: code
    }

    var obj = {
        cookie_name: code,
        cookie_value: generateSecretCookie(payload)
    }

    this.cookiesRepository.insert(obj);
    next();
}

proto.getAllCookies = function(req, res) {
    this.cookiesRepository.all().then(function(data) {
        res.send(data);
    });
}

proto.requiredAuthenticate = function(req, res, next) {
    var self = this;
    var meatAuth = req.cookies.meat_auth;

    //console.log("usuario logado? ", req.session.authenticated);
    if (!req.session.authenticated && !meatAuth) {
        res.redirect("/");
        return;
    }
    if (!req.session.authenticated && meatAuth) { // no session but cookie exists
        var payload = {
            header: req.headers['user-agent'],
            remote: req.connection.remoteAddress
        }
        if (!validateOrigin(meatAuth, payload)) {
            res.redirect("/");
            return;
        }
        self.cookiesRepository.findByName(meatAuth)
            .then(function(data) {
                if (it.isEmpty(data)) {
                    res.redirect("/");
                    return;
                }
                req.session.authenticated = it.first(data);
            })
            .catch(function() {
                res.redirect("/");
                return;
            });
    }
    next();
}

proto.logout = function(req, res) {
    req.session.destroy(function(err) {
        if (!err) {
            res.clearCookie('meat_auth');
            res.redirect("/");
        }
    });
}

proto.authenticate = function(req, res, next) {
    var $public = this;
    var header = req.headers['user-agent'],
        remoteAddress = req.connection.remoteAddress;

    if (it.isEmpty(req.body.email) || it.isEmpty(req.body.password)) {
        res.render('login', {
            error: "preencha os campos corretamente!"
        });
        return;
    }

    $public.profile.auth(req.body)
        .then(function(data) {
            if (it.isEmpty(data)) {
                res.render('login', {
                    error: "usuário ou senha estão incorretos!"
                });
                return;
            }
            data = it.first(data);

            if (!req.body.rememberme) {
                req.session.authenticated = data;
                res.redirect('/dashboard');
                return;
            }

            var cookie = prepareCookieToInsert(
                data.email,
                header,
                remoteAddress,
                data.id);

            $public.cookiesRepository.insert(cookie)
                .then(function() {
                    //set cookie
                    var date = new Date();
                    date.setFullYear(date.getFullYear() + 1);
                    res.cookie('meat_auth', cookie.cookie_value, {
                        expires: date,
                        httpOnly: true
                    });

                    console.log("cookie criado ");
                    req.session.authenticated = data;
                    res.redirect(global.safe('/dashboard'));
                })
                .catch(function(err) {
                    res.render('login', {
                        error: "Erro interno no sistema tente novamente!"
                    });
                });

        })
        .catch(function(err) {
            res.render('login', {
                error: "Erro interno no sistema tente novamente!"
            });
        });
};

proto.getAllProfiles = function(req, res) {
    this.profile.all().then(function(data) {
        res.render('users/index', {
            authenticated: req.session.authenticated,
            profiles: data,
            profile: {}
        });
    });
};

proto.insertProfile = function(req, res) {
    if (it.isEmpty(req.body)) {
        console.log("empty request " + req.body);
        return;
    }

    this.profile.insert(req.body).then(function(data) {
        res.redirect(global.safe('/profiles'));
    });
};

proto.removeProfile = function(req, res) {
    var ref;
    if (!(ref = req.params.id)) {
        return;
    }

    this.profile.remove(ref).then(function(data) {
        res.redirect(global.safe('/profiles'));
    })
};

proto.updateProfile = function(req, res) {
    var ref;
    if (!(ref = req.params.id)) {
        return;
    }
    var self = this;
    self.profile.getById(ref).then(function(data) {
        self.profile.update(data[0], req.body).then(function() {
            res.redirect(global.safe('/profiles'));
        })
    });
};

proto.editProfile = function(req, res) {
    this.profile.getById(req.params.id).then(function(data) {
        res.render('users/index', {
            edit: true,
            profile: it.first(data),
            authenticated: req.session.authenticated
        });
    });
}