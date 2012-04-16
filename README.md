Simplog
=======

Simplog is a simple logger interface for your Node.js app, exposing a convenient browser log client for when ssh isn't available.

*Not meant for monitoring logs on distributed machines at this time.*

---

Requirements
------------

*   Socket.IO
*   Express (will remove this requirement soon)
*   Jade (will also remove soon)

---

Installation
------------

`sudo npm install simplog`

or from Git

`sudo npm install https://github.com/sterlingwes/Simplog/tarball/master`

---

Usage
-----

	var express = require('express'),
		app		= express.createServer(),
		io		= require('socket.io').listen(app),
		s		= require('simplog');

Configure express to serve simplog browser client assets:

	app.configure(function() {
		app.use(express.static(__dirname + '/node_modules/Simplog/public'));
	});

Initialize Simplog, referencing your log files and socket.io.

	s.init({
		serverlog:	'server.log',
                errorlog:       'error.log'
	}, io);

Or initialize with express and Simplog will require Socket.io.

	s.init({
		serverlog:	'server.log',
                errorlog:       'error.log'
	}, null, app);

Finally, setup the route to your browser client:

	app.get('/log', s.render);

That's it! More thorough documentation to follow.

---

License
-------
(The MIT License)

Copyright (c) 2012 Wes Johnson

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.