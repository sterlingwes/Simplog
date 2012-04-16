// 
// Simplog
// =======
// * Lightweight real-time server log rendering for Node.JS using Socket.IO *  
//   
// Free to use, modify and distribute under the MIT license.  
// Developed by Wes Johnson (@SterlingWes / wesquire.ca)
//

var fs	= require('fs'),
	path= require('path'),
	f = {},	bytes = {}, io, names = [], watched = {};

exports.init = function(logfiles,sio,app) {
	f = logfiles;
	if(sio)	io = sio;
	else	io = require('socket.io').listen(app);
	Object.keys(f).forEach(function(key) {
		path.exists(f[key], function(exists) {
			if(exists) {
				names.push(key);
			}
		});
	});
	var slogio = io.of('/simplog').on('connection', function(socket) {
		names.forEach(function(key) {
			if(!(f[key] in watched))
				watchLog(f[key],function(lines) {
					slogio.emit('logged', {lines:lines,file:key});
				});
		});
		
		socket.on('disconnect', function() {
			if(Object.keys(slogio.manager.open).length==0) {
				Object.keys(watched).forEach(function(wkey) {
					watched[wkey].close();
					delete watched[wkey];
				});
			}
		});
	});
};
	
// log()
// -----
// Handles logging at a certain level. Also accepts a namespace for logging only certain types of logs at different levels. lvl & ns are optional. lvl will be assumed to be the lowest (1: debug).
//
var logger = function(msg,lvl,ns) {
	if(lvl && 'number' != typeof lvl) {
		ns = lvl; lvl = 1;
	}
	else if(!lvl)	lvl = 1;
		
	if(!ns)	ns = '| | ';
	else	ns = '| [' + ns + '] | ';
		
	var d = new Date();
	console.log(lvl+'|'+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()+' '+(d.getMonth()+1)+'/'+d.getDate()+ns+msg);
};
exports.log = logger;

exports.render = function(req,res) {
	var key = req.param('log');
	if(key) file = f[key];
	else {
		key = Object.keys(f)[0];
		file = f[key];
	}
	path.exists(file, function(exists) {
		if(exists)
			readLog(file,function(err,text) {
				if(text)
					if(req.param('rawlog'))
						res.send(text,{'Content-Type':'text/plain'});
					else
						res.render(__dirname+'/views/client.jade', {log:text,file:key,files:names});
				else		res.send('Error reading log. The log may be empty.');
			});
		else
			res.send('Error reading log. '+file+' does not exist!');
	});
};

function readLog(file,cb) {
	var input = fs.createReadStream(file);
	var text = '';

	input.on('data', function(data) {text += data;});
	input.on('end', function() {cb(null,text);});
	input.on('error', function(e) {cb(e);});
};

function watchLog(wF,cb) {
	fs.stat(wF, function(err, stats){
		if (err) throw err;
		bytes[wF] = stats.size;
	});

	var watcher = fs.watch(wF, function (event, filename) {
		fs.stat(wF, function(err, stats){
			if (err) throw err;
			if(bytes[wF]<=stats.size) {
				var stream = fs.createReadStream(wF, {
					start: bytes[wF],
					end: stats.size
				});
				stream.setEncoding('utf8');
				stream.on("data", function(lines) {
					bytes[wF] = stats.size;
					cb(lines);
				});
			}
			else
				logger('Failed to watch log. File stats unavailable. Are you on Windows?',3,'Simplog');
		});
	});
	
	watched[wF] = watcher;
}