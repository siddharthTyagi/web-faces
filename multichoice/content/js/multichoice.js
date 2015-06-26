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
			var opts = this.parentNode.querySelectorAll('span.multichoice-option, br');
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
			this._styleEngine.addClass('multichoice-option multichoice', opt);
			opt.style.opacity = '0';
			this.parentNode.insertBefore(opt, (this._post = !this._post) ? this : this.nextSibling);
			if (this.parentNode.clientWidth > this.option("maxWidth")) {
				this.parentNode.insertBefore(document.createElement('br'), opt);
				this.option("maxWidth", this.parentNode.clientWidth);
			}
			opt.style.opacity = 1;
		};
		this._expand = function () {
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
		this._onMouseOver = function (e) {
			this._mc.style.top = (this._mc._clone.offsetTop - this._mc._t - 1) + 'px';
			this._mc.style.left = (this._mc._clone.offsetLeft - this._mc._l - 1) + 'px';
			this.style.zIndex = this._mc.option("Mz");
			this._mc._expand();
		};
		this._onMouseOut = function (e) {
			this._mc._collapse();
			this.style.zIndex = this._mc.option("mz");
			this._mc.style.top = (this._mc._clone.offsetTop - this._mc._t) + 'px';
			this._mc.style.left = (this._mc._clone.offsetLeft - this._mc._l) + 'px';
		};
		this._init = function (args) {
			this._clone = this.cloneNode(true);
			this.parentNode.insertBefore(this._clone, this);
			this.parentNode.removeChild(this);
			this._mca = args || {};
			for (v in _MultiChoice.prototype) {
				this[v] = _MultiChoice.prototype[v];
			}
			this._styleEngine.addClass('multichoice', this._clone);
			this._styleEngine.addClass('multichoice', this);
			var wrapper = document.createElement('div');
			wrapper.addEventListener('mouseover', this._onMouseOver);
			wrapper.addEventListener('mouseout', this._onMouseOut);
			/*wrapper.addEventListener('mouseover', function (e) {
			});*/
			this._styleEngine.addClass('default multichoice-wrapper', wrapper);
			/*wrapper.style.width = (3 * (this._clone.clientWidth)) + 'px';
			wrapper.style.height = (5 * (this._clone.clientHeight)) + 'px';*/
			this._mca.top = this._clone.offsetTop - 2;
			this._mca.left = this._clone.offsetLeft - 2;
			wrapper.style.left = (this._l = (this._clone.offsetLeft)) + 'px';
			wrapper.style.top = (this._t = this._clone.offsetTop) + 'px';
			/*this.style.top = (this._clone.offsetTop - this._t) + 'px';
			this.style.left = (this._clone.offsetLeft - this._l) + 'px';*/
			this._clone.style.opacity = '0';
			wrapper.style.zIndex = this.option("mz");
			this._clone.parentNode.appendChild(wrapper);
			wrapper._mc = this;
			wrapper.appendChild(this);
			this.style.zIndex = this.option("Mz");
			return this._collapse();
		};
		return this._init(args);
	};
	return mcc.apply(emt, [ args ]);
};
_MultiChoice.prototype.defaults = _MultiChoice.defaults = {
	options: function () {
		return Object.keys(this);
	},
	mz: 1,
	Mz: 999,
	maxHeight: 400,
	maxWidth: 400
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