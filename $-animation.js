/*!
 * jSomething Lightweight JavaScript Framework
 * Animation plugin
 *
 * Copyright 2012, Jonathan Voss
 * Date: 7/12/2012
 * Last Revision: 7/5/2013
 * Version: 1.1.0
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
		}
	];
	
	for (i=0; i<plugins.length; i++) {
		$.addPlugin(plugins[i]);
	}
	
})(window);
