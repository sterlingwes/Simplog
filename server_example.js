//
// requirements.. we use the http module to sidestep an issue
// with Socket.io and newer versions of Connect/Express
//
var express = require('express'),
	http	= require('http'),
	app		= express(),
	server	= http.createServer(app);
	
	server.listen(80);
	
var	io		= require('socket.io').listen(server),
	s		= require('Simplog');
	
io.set('log level', 1); // socket.io debug logs will spam you
	
//
// have express serve the static assets for the Simplog browser client
//
app.configure(function() {
	app.set('view options', { layout: false });
	app.use(express.static(__dirname + '/node_modules/Simplog/public'));
});
	
//
// initialize Simplog with our file references and Socket.IO
//
s.init({
	serverlog:	'server.log',
	errorlog:	'error.log'
}, io);

//
// A route for your browser client handles by Simplog.
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
s.log('Running server_example.js on port 80',2,'Startup');