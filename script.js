var on = addEventListener,
	$ = function (q) {
		return document.querySelector(q)
	},
	$$ = function (q) {
		return document.querySelectorAll(q)
	},
	$body = document.body,
	$inner = $('.inner'),
	client = (function () {
		var o = {
				browser: 'other',
				browserVersion: 0,
				os: 'other',
				osVersion: 0,
				canUse: null
			},
			ua = navigator.userAgent,
			a, i;
		a = [
			['firefox', /Firefox\/([0-9\.]+)/],
			['edge', /Edge\/([0-9\.]+)/],
			['safari', /Version\/([0-9\.]+).+Safari/],
			['chrome', /Chrome\/([0-9\.]+)/],
			['ie', /Trident\/.+rv:([0-9]+)/]
		];
		for (i = 0; i < a.length; i++) {
			if (ua.match(a[i][1])) {
				o.browser = a[i][0];
				o.browserVersion = parseFloat(RegExp.$1);
				break;
			}
		}
		a = [
			['ios', /([0-9_]+) like Mac OS X/,
				function (v) {
					return v.replace('_', '.').replace('_', '');
				}
			],
			['ios', /CPU like Mac OS X/,
				function (v) {
					return 0
				}
			],
			['android', /Android ([0-9\.]+)/, null],
			['mac', /Macintosh.+Mac OS X ([0-9_]+)/,
				function (v) {
					return v.replace('_', '.').replace('_', '');
				}
			],
			['windows', /Windows NT ([0-9\.]+)/, null]
		];
		for (i = 0; i < a.length; i++) {
			if (ua.match(a[i][1])) {
				o.os = a[i][0];
				o.osVersion = parseFloat(a[i][2] ? (a[i][2])(RegExp.$1) : RegExp.$1);
				break;
			}
		}
		var _canUse = document.createElement('div');
		o.canUse = function (p) {
			var e = _canUse.style,
				up = p.charAt(0).toUpperCase() + p.slice(1);
			return (p in e || ('Moz' + up) in e || ('Webkit' + up) in e || ('O' + up) in e || ('ms' + up) in e);
		};
		return o;
	}()),
	trigger = function (t) {
		if (client.browser == 'ie') {
			var e = document.createEvent('Event');
			e.initEvent(t, false, true);
			dispatchEvent(e);
		} else dispatchEvent(new Event(t));
	};
var style, sheet, rule;
style = document.createElement('style');
style.appendChild(document.createTextNode(''));
document.head.appendChild(style);
sheet = style.sheet;
if (client.os == 'android') {
	(function () {
		sheet.insertRule('body::after { }', 0);
		rule = sheet.cssRules[0];
		var f = function () {
			rule.style.cssText = 'height: ' + (Math.max(screen.width, screen.height)) + 'px';
		};
		on('load', f);
		on('orientationchange', f);
		on('touchmove', f);
	})();
} else if (client.os == 'ios') {
	(function () {
		sheet.insertRule('body::after { }', 0);
		rule = sheet.cssRules[0];
		rule.style.cssText = '-webkit-transform: scale(1.0)';
	})();
	(function () {
		sheet.insertRule('body.ios-focus-fix::before { }', 0);
		rule = sheet.cssRules[0];
		rule.style.cssText = 'height: calc(100% + 60px)';
		on('focus', function (event) {
			$body.classList.add('ios-focus-fix');
		}, true);
		on('blur', function (event) {
			$body.classList.remove('ios-focus-fix');
		}, true);
	})();
} else if (client.browser == 'ie') {
	(function () {
		var t, f;
		f = function () {
			var mh, h, s, xx, x, i;
			x = $('#wrapper');
			x.style.height = 'auto';
			if (x.scrollHeight <= innerHeight) x.style.height = '100vh';
			xx = $$('.container.full');
			for (i = 0; i < xx.length; i++) {
				x = xx[i];
				s = getComputedStyle(x);
				x.style.minHeight = '';
				x.style.height = '';
				mh = s.minHeight;
				x.style.minHeight = 0;
				x.style.height = '';
				h = s.height;
				if (mh == 0) continue;
				x.style.height = (h > mh ? 'auto' : mh);
			}
		};
		(f)();
		on('resize', function () {
			clearTimeout(t);
			t = setTimeout(f, 250);
		});
		on('load', f);
	})();
}
if (!client.canUse('object-fit')) {
	var xx = $$('.image[data-position]'),
		x, c, i, src;
	for (i = 0; i < xx.length; i++) {
		x = xx[i];
		c = x.firstChild;
		if (c.tagName != 'IMG') c = c.firstChild;
		if (c.parentNode.classList.contains('deferred')) {
			c.parentNode.classList.remove('deferred');
			src = c.getAttribute('data-src');
			c.removeAttribute('data-src');
		} else src = c.getAttribute('src');
		c.style['backgroundImage'] = 'url(\'' + src + '\')';
		c.style['backgroundSize'] = 'cover';
		c.style['backgroundPosition'] = x.dataset.position;
		c.style['backgroundRepeat'] = 'no-repeat';
		c.src = 'data:image/svg+xml;charset=utf8,' + escape('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1" viewBox="0 0 1 1"></svg>');
	}
}

function form(id, settings) {
	var _this = this;
	this.id = id;
	this.mode = settings.mode;
	this.method = settings.method;
	this.success = settings.success;
	this.preHandler = ('preHandler' in settings ? settings.preHandler : null);
	this.failure = ('failure' in settings ? settings.failure : null);
	this.optional = ('optional' in settings ? settings.optional : []);
	this.events = ('events' in settings ? settings.events : {});
	this.$form = $('#' + this.id);
	this.$form.addEventListener('submit', function (event) {
		_this.submit(event);
	});
	this.$form.addEventListener('keydown', function (event) {
		if (event.keyCode == 13 && event.ctrlKey) {
			event.preventDefault();
			event.stopPropagation();
			_this.submit(event);
		}
	});
	var x = $('#' + this.id + ' input[name="' + settings.hid + '"]');
	if (x) {
		x.disabled = true;
		x.parentNode.style.display = 'none';
	}
	this.$submit = $('#' + this.id + ' button[type="submit"]');
	this.$submit.disabled = false;
};
form.prototype.notify = function (type, message) {
	if (message.match(/^(#[a-zA-Z0-9\_\-]+|[a-z0-9\-\.]+:[a-zA-Z0-9\~\!\@\#$\%\&\-\_\+\=\;\,\.\?\/\:]+)$/)) location.href = message;
	else alert((type == 'failure' ? 'Error: ' : '') + message);
};
form.prototype.getEmail = function () {
	var k, $f, $ff;
	$ff = this.$form.elements;
	for (k in $ff) {
		$f = $ff[k];
		if ($f.type == 'email' && $f.name == 'email' && $f.value !== '' && $f.value !== null) return $f.value;
	}
	return null;
};
form.prototype.submit = function (event) {
	var _this = this,
		result, handler, fd, k, x, $f, $ff;
	event.preventDefault();
	if (this.$submit.disabled) return;
	result = true;
	$ff = this.$form.elements;
	for (k in $ff) {
		$f = $ff[k];
		if ($f.type != 'text' && $f.type != 'email' && $f.type != 'textarea' && $f.type != 'select-one' && $f.type != 'checkbox') continue;
		if ($f.disabled) continue;
		if ($f.value === '' || $f.value === null || ($f.type == 'checkbox' && !$f.checked)) {
			if (this.optional.indexOf($f.name) !== -1) continue;
			result = false;
		} else {
			switch ($f.type) {
			case 'email':
				result = result && $f.value.match(new RegExp("^([a-zA-Z0-9\\_\\-\\.\\+]+)@([a-zA-Z0-9\\-\\.]+)\\.([a-zA-Z]+)$"));
				break;
			case 'select':
				result = result && $f.value.match(new RegExp("^[a-zA-Z0-9\\-]$"));
				break;
			case 'checkbox':
				result = result && $f.checked && ($f.value == 'checked');
				break;
			default:
			case 'text':
			case 'textarea':
				result = result && $f.value.match(new RegExp("^[^\\<\\>]+$"));
				break;
			}
		} if (!result) break;
	}
	if (!result) {
		this.notify('failure', 'Missing and/or invalid fields. Please try again.');
		return;
	}
	if ('onsubmit' in _this.events) _this.events.onsubmit.apply(this.$form);
	if (_this.method != 'ajax') {
		_this.$form.submit();
		return;
	}
	if (x = $(':focus')) x.blur();
	this.$submit.disabled = true;
	this.$submit.classList.add('waiting');
	handler = function (values) {
		var x, k, data;
		data = new FormData(_this.$form);
		if (values)
			for (k in values) data.append(k, values[k]);
		x = new XMLHttpRequest();
		x.open('POST', ['', 'post', _this.mode].join('/'));
		x.send(data);
		x.onreadystatechange = function () {
			var result = false,
				message = 'Sorry, something went wrong. Please try again later.',
				alert = true,
				o;
			if (x.readyState != 4) return;
			if (x.status == 200) {
				o = JSON.parse(x.responseText);
				if (o) {
					if ('result' in o) result = (o.result === true);
					if (('message' in o) && o.message) message = o.message;
					if ('alert' in o) alert = (o.alert === true);
				}
			}
			_this.$submit.classList.remove('waiting');
			if (result) {
				if ('onsuccess' in _this.events) _this.events.onsuccess.apply(this.$form);
				_this.$form.reset();
				if (alert) window.alert(message);
				else _this.notify('success', (_this.success ? _this.success : message));
			} else {
				if ('onfailure' in _this.events) _this.events.onfailure.apply(this.$form);
				if (alert) window.alert(message);
				else _this.notify('failure', (_this.failure ? _this.failure : message));
			}
			_this.$submit.disabled = false;
		};
	};
	if (_this.preHandler)(_this.preHandler)(_this, handler);
	else(handler)();
};
new form('sub', {
	mode: 'custom',
	method: 'post',
	hid: 'post',
	success: 'Thanks for subscribing 🙌',
	failure: 'Sorry, something went wrong. Please try again later.',
	optional: [],
});
