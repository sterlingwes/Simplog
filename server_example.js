var express = require('express'),
	app		= express.createServer(),
	io		= require('socket.io').listen(app),
	s		= require('Simplog');
	
app.configure(function() {
	app.set('view options', { layout: false });
	app.use(express.static(__dirname + '/node_modules/Simplog/public'));
});
	
s.init({
	serverlog:	'../server.log',
	errorlog:	'../error.log'
},io);

//
// A route for your browser client.
//

app.get('/log', s.render);

//
// Just some test routes, demonstrating logging
//

app.get('/', function(req,res) {
	s.log('Hello world! Someone just visited your site.','Root Request');
	res.send('Welcome to my site! I\'m logging this.');
});

app.get('/test', function(req,res) {
	console.log('Normal logging works fine as well, but there\'s no fun formatting :(');
	res.send('Just testing.');
});

app.get('/404', function(req,res) {
	s.log('404\'d! This would be an error.',3,'LostVisitors');
	s.log('Though we have some info to pass along...',2,'LostVisitors');
	res.send('You seem to be lost.');
});

app.listen(80);
s.log('Running server_example.js on port 80',2);