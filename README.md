Simplog
=======

Simplog is a simple logger interface for your Node.js app, exposing a convenient browser log client for when ssh isn't available.

*Not meant for monitoring logs on distributed machines at this time.*

---

Requirements
------------

*   Socket.IO
*   Express
*   Jade

*These need to be installed alongside Simplog, and are not bundled with your install.*


Installation
------------

`sudo npm install Simplog`

*Note the capital S! NPM is case sensitive.*

...or direct from Git:

`sudo npm install https://github.com/sterlingwes/Simplog/tarball/master`

---

Usage
=====

Require()
---------

Take a look at `server_example.js` for the full example.

	var express = require('express'),
		app		= express.createServer(),
		io		= require('socket.io').listen(app),
		s		= require('Simplog');
		app.listen(80);

*Note* that on account of [this issue](https://github.com/senchalabs/connect/issues/500) with Connect/Express (specifically v3+) & Socket.IO, we should require `http` vs. `app.listen()`, per the following alternative:

	var express = require('express'),
		http	= require('http'),
		app		= express(),
		server	= http.createServer(app);
		server.listen(80);
		
	var	io		= require('socket.io').listen(server),
		s		= require('Simplog');

		
Configure Express
-----------------
		
Configure express to serve simplog browser client assets:

	app.configure(function() {
		app.use(express.static(__dirname + '/node_modules/Simplog/public'));
	});

	
Initialize
----------
	
Initialize Simplog, referencing your log files and socket.io.

	s.init({
		serverlog:	'server.log',
        errorlog:   'error.log'
	}, io);
	

Setup Browser Client
--------------------

Finally, setup the route to your browser client:

	app.get('/log', s.render);


Run!
----
	
Now, run your app and split your log output:

	sudo node server.js 1>>server.log 2>>error.log
	
Try using the Simplog logger in you application:

	s.log('Message'); 					// defaults to debug level 1, no label/namespace
	s.log('Message',2,'MainModule'); 	// info level 2, MainModule as label
	s.log('Message','MainModule'); 		// defaults to debug level
	s.log('Message',3);					// error level 3, no label
	console.log('Message');				// this and sys.log works fine (no formatting)
	
That's it! More thorough API documentation to follow.


Known Issues / To-do
---------------------

*   Browser client does not render exception traces gracefully
*   Does not support distributed logging
*	Does not detect exceptions / crashes (providing notifications)

---

License
-------
(The MIT License)

Copyright (c) 2012 Wes Johnson

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.