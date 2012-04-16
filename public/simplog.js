var startSlog = function() {

	(function($) {
		$.fn.hasScrollBar = function() {
			return this.get(0).scrollHeight > this.height();
		}
	})(jQuery);

	function parse(html,start) {
		var lines 	= html.split(/\n/g);
		var txt		= '';
		lines.forEach(function(line) {
			var l	= line.split('|');
			if(line.indexOf('|')>-1) {
				if(l.length>3) {
					var lclass	= ''; var mark	= 'D';
					switch(parseInt(l[0])) {
						case 3: // errors
							lclass = "error"; mark = "E"; break;
						case 2: // info
							lclass = "info"; mark = "I"; break;
						default: // debug
							lclass = "debug"; break;
					}
					txt += '<li class="'+lclass+'"><span class="mark">'+mark+'</span><span class="time">'+l[1]+'</span><span class="ns">'+l[2]+'</span><span class="msg">'+l[3]+'</span></li>';
				}
			} else {
				if(line.length>3)
					txt += '<li class="'+lclass+'">'+line+'</li>';
			}
		});
		if(start) 	return '<ul>'+txt+'</ul>';
		else		return txt;
	}

	var log = $('#container').html();
	$('#container').html(parse(log,true));
	$('#container').height(($(window).height()-$('#bar').height()));
	if($('#container').hasScrollBar())
		$('#container').scrollTop($('#container')[0].scrollHeight);
	
	var socket = io.connect('http://'+location.host+'/simplog');
	socket.on('connect', function(data) {
		socket.on('logged', function(ldata) {
			if(ldata.lines.length>0 && ldata.file==active) {
				$('#container ul').append(parse(ldata.lines));
				if($('#container').hasScrollBar())
					$('#container').scrollTop($('#container')[0].scrollHeight);
			}
		});
	});
	
	$('#bar ul li').click(function(e) {
		if(e.target.id!=active)
			$.get('http://'+window.location.host+window.location.pathname+'?log='+e.target.id+'&rawlog=1', function(log) {
				$('#container').html(parse(log,true));
				if($('#container').hasScrollBar())
					$('#container').scrollTop($('#container')[0].scrollHeight);
				$('#bar ul li.active').removeClass('active');
				$('#'+e.target.id).addClass('active');
				active=e.target.id;
			});
	});

};