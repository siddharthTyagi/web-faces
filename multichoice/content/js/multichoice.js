var _MultiChoice = function (emt, args) {
	var mcc = function (args) {
		this.option = function (n, v) {
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
		this._clearOptions = function () {
			var opts = this.parentNode.querySelectorAll('span.multichoice-option');
			for (var i = 0; i < opts.length; i++) {
				this.parentNode.removeChild(opts[i]);
			}
		};
		this._collapse = function () {
			this._clearOptions();
			this._styleEngine.addClass('collapsed', this);
			return this;
		};
		this._addOption = function (v) {
			var opt = document.createElement('span');
			opt.innerHTML = v;
			this._styleEngine.addClass('multichoice-option', opt);
			this.parentNode.insertBefore(opt, (this._post = !this._post) ? this : this.nextSibling);
		};
		this._expand = function () {
			var opts = this.option("options");
			for (var i = 0; i < opts.length; i++) {
				var opt = opts[i];
				this._addOption();
			}
			return this;
		};
		this._onMouseOver = function (e) {
			this._expand();
		};
		this._onMouseOut = function (e) {
			this._mc._collapse();
		};
		this._init = function (args) {
			this._clone = this.cloneNode(true);
			this.parentNode.insertBefore(this._clone, this);
			this.parentNode.removeChild(this);
			this._mca = args || {};
			for (v in _MultiChoice.prototype) {
				this[v] = _MultiChoice.prototype[v];
			}
			this.addEventListener('mouseover', this._onMouseOver);
			this._styleEngine.addClass('multichoice', this);
			var wrapper = document.createElement('div');
			wrapper.addEventListener('mouseout', this._onMouseOut);
			this._styleEngine.addClass('default multichoice-wrapper', wrapper);
			wrapper.style.width = (3 * (this._clone.clientWidth)) + 'px';
			wrapper.style.height = (5 * (this._clone.clientHeight)) + 'px';
			this._mca.top = this._clone.offsetTop - 2;
			this._mca.left = this._clone.offsetLeft - 2;
			var l = 0, t = 0;
			wrapper.style.left = (l = (this._clone.offsetLeft - this._clone.clientWidth + 10)) + 'px';
			wrapper.style.top = (t = this._clone.offsetTop - this._clone.clientHeight) + 'px';
			this.style.top = (this._clone.offsetTop - t) + 'px';
			this.style.left = (this._clone.offsetLeft - l) + 'px';
			this._clone.style.opacity = '0';
			this._clone.parentNode.appendChild(wrapper);
			wrapper._mc = this;
			wrapper.appendChild(this);
			return this._collapse();
		};
		return this._init(args);
	};
	return mcc.apply(emt, [ args ]);
};
_MultiChoice.prototype.defaults = _MultiChoice.defaults = {
	options: function () {
		return Object.keys(this);
	}
};
//	Create a css rule engine
_MultiChoice.prototype._styleEngine = new function () {
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
    	var b = window.navigator.userAgent.indexOf("Chrome") >=0;
    	for (style in styles) try {
    		rule.style.setProperty(style, styles[style]);
    		rule.style.setProperty("-moz-" + style,  styles[style]);
    		rule.style.setProperty("-webkit-" + style, styles[style]);
    		if((b &&  styles[style].indexOf("!important") >= 0)){
    			throw null;
    		}
    	} catch (e) {
    		try {
    			rule.style.cssText += style +":" + styles[style] + ";" ;
    			rule.style.cssText += "-moz-" +style +":" + styles[style] + ";" ;
    			rule.style.cssText += "-webkit-" +style +":" + styles[style] + ";" ;
    			rule.style[style] = styles[style];
    			rule.style["-moz-" + style] = styles[style];
    			rule.style["-webkit-" + style] = styles[style];
    		} catch (e1) {
    			continue;
    		}
    	}
    }
	re.addClass = function (clz, emt) {
		emt.className += ' ' + clz;
	};
	return re;
};