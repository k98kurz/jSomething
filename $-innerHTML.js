/*!
 * jSomething Lightweight JavaScript Framework
 * InnerHTML Management plugin
 *
 * Copyright 2012, Jonathan Voss
 * Date: 12/27/2012
 * Last Revision: 7/5/2013
 * Version: 1.0.1
*/

(function(w) {
	if (!w||!w.$||!w.j$) { return; }
	var j$ = (typeof w.$=="function") ? w.$ : w.j$,
	
	plugins = [ {
			// WARNING: breaks recursivity
			name		:	"getHTML",
			func		:	function () {
				return this.getElement().innerHTML;
			}
		},
		{
			// WARNING: breaks recursivity
			name		:	"hasHTML",
			func		:	function () {
				return (this.getElement().innerHTML.length > 0) ? true : false;
			}
		},
		{
			// runs callback function if innerHTML is present
			// preserves recursivity
			name		:	"ifHTML",
			func		:	function (callback) {
				if (typeof callback !== "function") { returnValue.call(this, null); return this; }
				if (this.getElement().innerHTML.length) {
					callback.call(this);
					returnValue.call(this, [true, elem.innerHTML]);
					return this;
				}
			}
		},
		{
			// mode values: 0 = append (default), 1 = overwrite
			name		:	"innerHTML",
			func		:	function (html, mode) {
				if (typeof html!=="string" || html.length<1) { this.returnValue.call(this, null); return this; }
				if (mode) {
					this.getElement().innerHTML = html;
				} else {
					this.getElement().innerHTML += html;
				}
				this.returnValue.call(this, [html, mode, this.getElement().innerHTML]);
				return this;
			}
		},
		{
			name		:	"noHTML",
			func		:	function () {
				this.getElement().innerHTML = "";
				returnValue.call(this, true);
				return this;
			}
		}
	];
	
	while (plugins.length) { $.addPlugin ( plugins.pop(), true ); }
})(window);
