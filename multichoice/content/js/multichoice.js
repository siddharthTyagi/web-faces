var _MultiChoice = function(emt, args) {
	var widget = function() {
		this.option = function(n, v) {
			if (!v) {
				var opt = this._mca[n] || this.defaults[n];
				if (typeof opt == 'function') {
					return opt.apply(this, []);
				} else {
					return opt;
				}
			} else {
				this._mca[n] = v;
				return this;
			}
		};
		this._clearOptions = function() {
			var opts = this.parentNode
					.querySelectorAll('span.multichoice-option, br');
			for (var i = 0; i < opts.length; i++) {
				this.parentNode.removeChild(opts[i]);
			}
		};
		this._collapse = function() {
			this._clearOptions();
			this._styleEngine.addClass('collapsed', this);
			return this;
		};
		this._addOption = function(v) {
			var opt = document.createElement('span');
			opt.innerHTML = v;
			this._styleEngine.addClass('multichoice-option multichoice', opt);
			opt.style.opacity = '0';
			this.parentNode.insertBefore(opt, (this._post = !this._post) ? this
					: this.nextSibling);
			if (this.parentNode.clientWidth > this.option("maxWidth")) {
				this.parentNode.insertBefore(document.createElement('br'), opt);
				this.option("maxWidth", this.parentNode.clientWidth);
			}
			opt.style.opacity = 1;
		};
		this._expand = function() {
			var opts = this.option("options");
			for (var i = 0; i < opts.length; i++) {
				var opt = opts[i];
				this._addOption(opt);
				if (this.parentNode.clientHeight > this.option("maxHeight")) {
					this._addOption("...");
					break;
				}
			}
			return this;
		};
		this._onMouseOver = function(e) {
			this._mc.style.top = (this._mc._mc.offsetTop - this._mc._t - 1)
					+ 'px';
			this._mc.style.left = (this._mc._mc.offsetLeft - this._mc._l - 1)
					+ 'px';
			this.style.zIndex = this._mc.option("Mz");
			this._mc._expand();
		};
		this._onMouseOut = function(e) {
			this._mc._collapse();
			this.style.zIndex = this._mc.option("mz");
			this._mc.style.top = (this._mc._mc.offsetTop - this._mc._t) + 'px';
			this._mc.style.left = (this._mc._mc.offsetLeft - this._mc._l)
					+ 'px';
		};
		this._choose = function(i) {
			this.option("chosenIndex", i);
			this.option("chosen", this.option("options")[this
					.option("chosenIndex")]);
			this._invalidate();
		};
		this._invalidate = function() {
			this.innerHTML = '';
			this._render(this.option("chosen"));
		};
		this._render = function(opt) {
			var li = document.createElement('li');
			li.innerHTML = this._label(opt);
			this._position(li);
		};
		this._position = function(li) {
			// TODO: start here after debugging
		};
		this._label = function(opt) {
			return this.option("label")(opt);
		};
		this._mca = args || {};
		for (v in _MultiChoice.prototype) {
			this[v] = _MultiChoice.prototype[v];
		}
		this._styleEngine.addClass('default multichoice-wrapper', this);
		this._mca.top = this._mc.offsetTop - 2;
		this._mca.left = this._mc.offsetLeft - 2;
		this.style.left = (this._l = (this._mc.offsetLeft)) + 'px';
		this.style.top = (this._t = this._mc.offsetTop) + 'px';
		this._mc.parentNode.insertBefore(this, this._mc);

		this._mc.style.opacity = '0';
		this.style.zIndex = this.option("Mz");
		this._styleEngine.addClass('multichoice', this._mc);
		this.addEventListener('mouseover', this._onMouseOver);
		this.addEventListener('mouseout', this._onMouseOut);
		this._choose(0);
		return this;
	};
	var mcc = function(args) {
		this._init = function(args) {
			var wrapper = document.createElement('ul');
			wrapper._mc = this;
			return widget.apply(wrapper, [ args ]);
		};
		return this._init(args);
	};
	return mcc.apply(emt, [ args ]);
};
_MultiChoice.prototype.defaults = _MultiChoice.defaults = {
	options : function() {
		return Object.keys(this);
	},
	mz : 1,
	Mz : 999,
	maxHeight : 400,
	maxWidth : 400,
	label : function(opt) {
		return opt + '';
	}
};
// Create a css rule engine
_MultiChoice.prototype._styleEngine = new function() {
	var re = {}, dom = document.documentElement;
	dom.appendChild(re._sheet = document.createElement("style"));
	re.sheet = re._sheet.sheet;
	re._rules = {};
	re.createSelector = function(name, styles) {
		var rule = this._rules[name];
		if (!rule) {
			this.sheet.insertRule(name + "{}", 0);
			rule = this._rules[name] = this.sheet.cssRules[0];
		}
		var b = window.navigator.userAgent.indexOf("Chrome") >= 0;
		for (style in styles)
			try {
				rule.style.setProperty(style, styles[style]);
				rule.style.setProperty("-moz-" + style, styles[style]);
				rule.style.setProperty("-webkit-" + style, styles[style]);
				if ((b && styles[style].indexOf("!important") >= 0)) {
					throw null;
				}
			} catch (e) {
				try {
					rule.style.cssText += style + ":" + styles[style] + ";";
					rule.style.cssText += "-moz-" + style + ":" + styles[style]
							+ ";";
					rule.style.cssText += "-webkit-" + style + ":"
							+ styles[style] + ";";
					rule.style[style] = styles[style];
					rule.style["-moz-" + style] = styles[style];
					rule.style["-webkit-" + style] = styles[style];
				} catch (e1) {
					continue;
				}
			}
	}
	re.addClass = function(clz, emt) {
		emt.className += ' ' + clz;
	};
	return re;
};