var _MultiChoice = function(emt, args) {
	var widget = function() {
		this.option = function(n, v, args) {
			if (typeof v == 'undefined') {
				var opt = this._mca[n];
				if (typeof opt == 'undefined') {
					opt = this.defaults[n];
				}
				if (typeof opt == 'function') {
					return opt.apply(this, args || []);
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
			this._invalidate();
			var va = [];
			var opts = this.option("options");
			for (var i = 0; i < opts.length && i < this.option("atATime"); i++) {
				if (i == this.option("chosenIndex")) {
					continue;
				} else {
					va.push(this._render(opts[i]));
					if (this.option('full-x') && this.option('full-y')) {
						this._render('...');
						break;
					}
				}
			}
			va._this = this;
			for (var i = 0; i < va.length; i++) {
				var li = va[i];
				li.style.left = va._this._mc.offsetLeft + 'px';
				li.style.top = va._this._mc.offsetTop + 'px';
				li.style.transition = 'all 0.5s ease-out';
			}
			setTimeout(function() {
				for (var i = 0; i < va.length; i++) {
					var li = va[i];
					li.style.left = li.left;
					li.style.top = li.top;
					//console.log(li.style.top);
					li.style.opacity = '1';
				}
			}, 0);
			return this;
		};
		this._onMouseOver = function(e) {
			/*
			 * this._mc.style.top = (this._mc.offsetTop - this._mc._t - 1) +
			 * 'px'; this._mc.style.left = (this._mc._mc.offsetLeft -
			 * this._mc._l - 1) + 'px';
			 */
			/* this.style.zIndex = this._mc.option("Mz"); */
			this._expand();
		};
		this._onMouseOut = function(e) {
			this._invalidate();
		};
		this._choose = function(i) {
			this.option("chosenIndex", i);
			var ci = this.option("chosenIndex");
			this.option("chosen", this.option("options")[ci]);
			this._mc.value = this.option("value", undefined, [ this
					.option("chosen") ]);
			this._invalidate();
		};
		this._invalidate = function() {
			this.innerHTML = '';
			this.option('full-x', false);
			this.option('full-y', false);
			this._render(this.option("chosen"));
		};
		this._render = function(opt) {
			var li = document.createElement('li');
			li._multichoice = this;
			li._option = opt;
			li.addEventListener("click", function (e) {
//				this._multichoice._choose(this.)
			});
			li.innerHTML = this._label(opt);
			li.style.opacity = '0';
			this._position(li);
			return li;
		};
		this._position = function(li) {
			this._styleEngine.addClass('multichoice', li);
			li.style.height = (this._mc.scrollHeight) + "px";
			this.option("lastItem", li);
			if (this.childNodes.length == 0) {
				this.appendChild(li);
				this.option("chosenElement", li);
				for (s in this._mc.style) {
					li.style[s] = this._mc.style[s];
				}
				li.style.opacity = '1';
				li.style.width = this._mc.scrollWidth + "px";
				li.style.left = this.option("left") + 'px';
				li.style.top = this.option("top") + 'px';
				li.innerHTML += '<span class="indicator">'
						+ this.option("options").length + "</span>";
				li.title = this.option("options").length
						+ ' options available.\nClick to EXPAND.';
				li.style.zIndex = 2;
				this._edge = {
					'0' : {
						left : li,
						right : li
					}
				};
				this._point = 0;
				this._direction = 1;
				delete this._switch;
			} else {

				/*
				 * li.style.maxWidth = this._mc.scrollWidth + 'px';
				 * li.style.minWidth = this._mc.scrollWidth + 'px';
				 */
				li.style.zIndex = 1;
				this.insertBefore(li, this.option("lastItem").nextSibling);
				this._leftTop(li);
			}
			// TODO: start here after debugging
		};
		this._leftTop = function(li) {
			var ep = this._point;
			li.top = li.style.top = (this.option("chosenElement").offsetTop + (this._point * li.offsetHeight))
					+ 'px';
			switch (this._switch ? -this._direction : this._direction) {
			case 1:
				if (this._edge[this._point].right) {
					li.left = li.style.left = (this._edge[this._point].right.offsetLeft + this._edge[this._point].right.offsetWidth)
							+ 'px';
					this._edge[this._point].right = li;
				} else {
					this._edge[this._point].left = this._edge[this._point].right = li;
					li.left = li.style.left = (this._edge[this._point - 1].left.offsetLeft + this
							._shift())
							+ 'px';
				}
				if (this._switch) {
					this._point -= ((this._edge[this._point + 1].right.offsetLeft + this._edge[this._point + 1].right.offsetWidth) < (li.offsetLeft
							+ li.offsetWidth + this._shift())) ? 1 : 0;
					if (!this._edge[this._point]) {
						delete this._switch;
						this._edge[this._point] = this._edge[this._point] || {};
					}
				} else if (!this._edge[this._point - 1]) {
					delete this._switch;
					this._point--;
					this._edge[this._point] = this._edge[this._point] || {};
					this._direction = -1;
				} else if ((this._edge[this._point - 1].right.offsetLeft + this._edge[this._point - 1].right.offsetWidth) < (li.offsetLeft + li.offsetWidth)) {
					this._switch = true;
					this._point--;
					this._edge[this._point] = this._edge[this._point] || {};
					this._direction = -1;
				}
				break;
			case -1:
				if (this._edge[this._point].left) {
					li.left = li.style.left = (this._edge[this._point].left.offsetLeft - li.offsetWidth)
							+ 'px';
					this._edge[this._point].left = li;
				} else {
					var ref = this._edge[this._point
							+ (this._point < 0 ? 1 : -1)].right;
					li.left = li.style.left = (ref.offsetLeft + ref.offsetWidth
							- this._shift() - li.offsetWidth)
							+ 'px';
					this._edge[this._point].left = this._edge[this._point].right = li;
				}
				if (this._switch) {
					this._point += (this._shift()
							+ this._edge[this._point - 1].left.offsetLeft > li.offsetLeft) ? 1
							: 0;
					if (!this._edge[this._point]) {
						delete this._switch;
						this._edge[this._point] = this._edge[this._point] || {};
					}
				} else if (this._edge[this._point + 1].left.offsetLeft > (this._edge[this._point].left.offsetLeft)) {
					this._point += 1;
					this._edge[this._point] = this._edge[this._point] || {};
					this._switch = true;
					this._direction = 1;
					break;
				}
				break;
			}
			if (this._edge[ep].right.offsetLeft
					+ this._edge[ep].right.offsetWidth
					- this._edge[ep].left.offsetLeft > this.option("maxWidth")) {
				this.option("full-x", true);
			}
			if ((Object.keys(this._edge).length * this._mc.offsetHeight) > this
					.option("maxHeight")) {
				this.option("full-y", true);
			}
		};
		this._shift = function() {
			var cos = this.option("chosenElement").offsetHeight
					/ this.option("radius"), sin = Math.sqrt(1 - cos * cos);
			return this.option("radius") - (this.option("radius") * sin);
		};
		this._label = function(opt) {
			return this.option("label", undefined, [ opt ]);
		};
		this._mca = args || {};
		for (v in _MultiChoice.prototype) {
			this[v] = _MultiChoice.prototype[v];
		}
		this._styleEngine.addClass('default multichoice-wrapper', this);
		this.option("top", this._mc.offsetTop);
		this.option("left", this._mc.offsetLeft);
		/*
		 * this.style.left = (this._l = (this._mc.offsetLeft)) + 'px';
		 * this.style.top = (this._t = this._mc.offsetTop) + 'px';
		 */
		this._mc.parentNode.insertBefore(this, this._mc);

		// this._mc.style.opacity = '0';
		this.style.zIndex = this.option("Mz");
		this.style.maxHeight = this.option("maxHeight");
		this.style.maxWidth = this.option("maxWidth");
		this._styleEngine.addClass('multichoice', this._mc);
		this.addEventListener('click', this._onMouseOver);
		// this.addEventListener('mouseout', this._onMouseOut);
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
	maxHeight : 100,
	maxWidth : 500,
	label : function(opt) {
		return opt + '';
	},
	atATime : 100,
	value : function() {
		return this.option("label", undefined, arguments);
	},
	radius : 40
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