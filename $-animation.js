/*!
 * jSomething Lightweight JavaScript Framework
 * Animation plugin
 *
 * Copyright 2012, Jonathan Voss
 * Date: 7/12/2012
 * Last Revision: 7/5/2013
 * Version: 1.2.0
*/

(function(w) {
	if (!w.$ && !w.j$){ return; }
	var $ = (typeof w.$.c=="object" && typeof w.$.addPlugin=="function") ? w.$ : w.j$, i,
	
	plugins = [ {
			name		:	"fadeOut",
			persistent	:	{
				fade		:	{
					delayDefault	:	750,
					frameRate	:	20,
					elements	:	[]
				}
			},
			func		:	function(delay) {
				if (!delay) { delay = $.c.fade.delayDefault; }
				var isIE = navigator.appName.search("Microsoft")>-1?true:false,
				frameRate = $.c.fade.frameRate, i,
				steps = Math.ceil(delay / frameRate), moves = [], amount;

				if (!$.c.fade.elements.length||$.c.fade.elements[$.c.fade.elements.length-1]!=this.getElement()) {
					$.c.fade.elements.push(this.getElement());
				}

				amount = 1.0/steps;
				for (i=0;i<steps;i++) {
					moves.push(amount*i);
				}
				for (i=0;i<steps;i++) {
					if (isIE) {
						window.setTimeout("j$(j$.c.fade.elements["+($.c.fade.elements.length-1)+"])"+
								".setStyle({filter:alpha(opacity="+moves.pop()*100+"})", frameRate*i);
					} else {
						window.setTimeout("j$(j$.c.fade.elements["+($.c.fade.elements.length-1)+"])"+
								".setStyle({opacity:"+moves.pop()+"})", frameRate*i);
					}
				}
				return this;
			}
		},
		{
			name		:	"fadeIn",
			func		:	function(delay) {
				if (!delay) { delay = $.c.fade.delayDefault; }
				var isIE = navigator.appName.search("Microsoft")>-1?true:false,
				frameRate = $.c.fade.frameRate, i,
				steps = Math.ceil(delay / frameRate), moves = [], amount;

				if (!$.c.fade.elements.length||$.c.fade.elements[$.c.fade.elements.length-1]!=this.getElement()) {
					$.c.fade.elements.push(this.getElement());
				}

				amount = 1.0/steps;
				for (i=0;i<steps;i++) {
					moves.push(1.0-(amount*i));
				}
				for (i=0;i<steps;i++) {
					if (isIE) {
						window.setTimeout("j$(j$.c.fade.elements["+($.c.fade.elements.length-1)+"])"+
								".setStyle({filter:alpha(opacity="+(moves.pop()*100)+"})", frameRate*i);
					} else {
						window.setTimeout("j$(j$.c.fade.elements["+($.c.fade.elements.length-1)+"])"+
								".setStyle({opacity:"+moves.pop()+"})", frameRate*i);
					}
				}
				return this;
			}
		},
		{
			name		:	"fade",
			func		:	function(delay) {
				var isIE = navigator.appName.search("Microsoft")>-1?true:false,
				temp;
				if (!delay) { delay = $.c.fade.delayDefault; }
				if (isIE) {
					this.getStyle("filter");
					temp = this.lastReturnValue();
					if (temp&&temp=="alpha(opacity=0)") {
						return this.fadeIn(delay);
					}
				} else {
					this.getStyle("opacity");
					temp = this.lastReturnValue();
					if (temp&&temp==0) {
						return this.fadeIn(delay);
					}
				}
				return this.fadeOut(delay);
			}
		},
		{
			name		:	"fadeToColor",
			persistent	:	{
				colorFade	:	{
					elements	:	[],
					hextoint	:	function (hex) {
						if (typeof hex!="string") { return null; }
						hex = hex.replace("#", "");
						hexar = hex.split(""); hexar.reverse();
						var ret = [], tm = [];
						while ((tm[0] = hexar.pop())&&(tm[1] = hexar.pop())) {
							ret.push(parseInt(tm[0]+tm[1], 16));
						}
						return ret;
					},
					inttohex	:	function (ints) {
						if (typeof ints.push!="function") { return null; }
						var tm, ret = ""; ints.reverse();
						while (tm = ints.pop()) {
							ret += (tm.toString(16).length==1) ? "0"+tm.toString(16) : tm.toString(16);
						}
						return ret;
					},
					findElement	:	function (e) {
						var i;
						for (i=0; i<$.c.colorFade.elements.length; i++) {
							if ($.c.colorFade.elements[i].e == e) {
								return [i];
							}
						}
						return false;
					},
					between		:	function (c1, c2, p1, p2) {
						var d1 = $.c.colorFade.hextoint(c1),
						d2 = $.c.colorFade.hextoint(c2), i, d3 = [];
						for (i=0; i<3; i++) {
							d3[i] = Math.ceil(p1*d1[i] + p2*d2[i]);
						}
						return $.c.colorFade.inttohex(d3);
					}
				}
			},
			func		:	function (color, delay) {
				if (typeof color!="string") { this.returnValue(null); return this; }
				if (typeof delay!="number"||delay<100||delay>10000) { delay = 750; }
				var p, i, cc, cp, st, steps = [], between, ei;
				ei = $.c.colorFade.findElement(this.getElement());
				if (!ei) {
					this.getStyle("color");
					p = this.lastReturnValue();
					if (!p) { p = "000000"; }
					ei = $.c.colorFade.elements.push({'e':this.getElement(),"previousColor":color})-1;
				} else {
					ei = ei[0];
					p = $.c.colorFade.elements[ei].previousColor;
					if (!p) { p = "000000"; }
				}
				// scheduler
				if ($.c.colorFade.elements[ei].cwait) { this.returnValue(false); return this; }
				if ($.c.colorFade.elements[ei].cinit>0) {
					$.c.colorFade.elements[ei].cwait = true;
					for (i=0; i<$.c.colorFade.elements[ei].cinit/20; i++) {
						setTimeout("if(j$.c.colorFade.elements["+ei+"].cinit==0){j$(j$.c.colorFade.elements["+ei+"].e)" + ".fadeToColor('"+color+
							"',"+delay/2+");j$.c.colorFade.elements["+ei+"].cwait=false;};", $.c.colorFade.elements[ei].cinit*i/20);
					}
					return this;
				}
				$.c.colorFade.elements[ei].cinit = delay;
				between = $.c.colorFade.between;
				$.c.colorFade.elements[ei].previousColor = color;
				st = Math.ceil(60*(delay/1000));
				for (i=0;i<st;i++) {
					steps.push(between(p, color, (st-i)/st, i/st));
				}
				steps.push(color);
				while (steps.length) {
					m = steps.pop();
					window.setTimeout("j$(j$.c.colorFade.elements["+ei+"].e).setStyle({'color': '#" + m + "'});",
						delay*(steps.length/st)
					);
				}
				window.setTimeout("j$.c.colorFade.elements["+ei+"].cinit=0", delay);
				return this;
			}
		},
		{
			name		:	"fadeToBGColor",
			func		:	function (color, delay) {
				if (typeof color!="string") { this.returnValue(null); return this; }
				if (typeof delay!="number"||delay<100||delay>10000) { delay = 750; }
				var p, i, cc, cp, st, steps = [], between, ei;
				ei = $.c.colorFade.findElement(this.getElement());
				if (!ei) {
					this.getStyle("backgroundColor");
					p = this.lastReturnValue();
					if (!p) { p = "ffffff"; }
					ei = $.c.colorFade.elements.push({'e':this.getElement(),"previousBGColor":color})-1;
				} else {
					ei = ei[0];
					p = $.c.colorFade.elements[ei].previousBGColor;
					if (!p) { p = "ffffff"; }
				}
				// scheduler
				if ($.c.colorFade.elements[ei].bwait) { this.returnValue(false); return this; }
				if ($.c.colorFade.elements[ei].binit>0) {
					$.c.colorFade.elements[ei].bwait = true;
					for (i=0; i<$.c.colorFade.elements[ei].binit/20; i++) {
						setTimeout("if(j$.c.colorFade.elements["+ei+"].binit==0){j$(j$.c.colorFade.elements["+ei+"].e).fadeToBGColor('"+color+
							"',"+delay/2+");j$.c.colorFade.elements["+ei+"].bwait=false;};", $.c.colorFade.elements[ei].binit*i/20);
					}
					return this;
				}
				$.c.colorFade.elements[ei].binit = delay;
				between = $.c.colorFade.between;
				$.c.colorFade.elements[ei].previousBGColor = color;
				st = Math.ceil(60*(delay/1000));
				for (i=0;i<st;i++) {
					steps.push(between(p, color, (st-i)/st, i/st));
				}
				steps.push(color);
				while (steps.length) {
					m = steps.pop();
					window.setTimeout("j$(j$.c.colorFade.elements["+ei+"].e).setStyle({'backgroundColor': '#" + m + "'});",
						delay*(steps.length/st)
					);
				}
				window.setTimeout("j$.c.colorFade.elements["+ei+"].binit=0", delay);
				return this;
			}
		}
	];
	
	for (i=0; i<plugins.length; i++) {
		$.addPlugin(plugins[i]);
	}
	
})(window);
