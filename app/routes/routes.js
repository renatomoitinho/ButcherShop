var repository = require('../db/repository.js')()

function Routes(app) {

	app.get('/', function(req, res) {
		res.send('Hello World!');
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

	//other routes..
}

module.exports = Routes;