/*!
 * jSomething Lightweight JavaScript Framework
 *
 * Copyright 2013, Jonathan Voss
 * Date: 12/14/2010
 * Revision Date: 7/5/2013
 * Version: 1.1.1
 * 
 * New (12/27/2012): updated returnValue to this.returnValue for plugins
 * New (1/3/2013): added lastReturnObject and this.lastReturnObject ()
 * New (1/3/2013): new no-conflict mode to not overwrite jQuery
 * New (1/3/2013): String.prototype.stripEndWS is now String.prototype.strip
 * New (1/3/2013): better String.strip function borrowed from css.js library
 * New (1/3/2013): $.hasUnique is now Object.prototype.hasUnique
 * New (1/3/2013): cut down on the pasta a little bit
 * New (7/5/2013): changed xhttpget (url, func) to xhttp (url, func, method, data)
 * 					also fixed xhttp callback function issues by making global variable $.xhttp.x
*/

var j$ = function (input) {
	// Returns a constructed object, ensuring that plugins will work
	return new j$.prototype.init(input);
};
j$.prototype.init = function(input) {
	// Initial validation of private elem object
	if (typeof input!="string" && typeof input!="object") { return null; }
	var elem = (typeof input=="string") ? (document.getElementById(input) || input) : input, css,
	i; // for all those loops
	if (input.tag) {
		elem = document.createElement(input.tag);
		if (input.attributes && typeof input.attributes=="object") {
			for (i in input.attributes) {
				if (input.attributes.hasUnique(i)) { elem[i] = input.attributes[i]; }
			}
		}
		if (input.events) { j$(elem).addEvent(input.events); }
		if (input.css && typeof input.css=="object") {
			for (i in input.css) {
				if (input.css.hasUnique(i)) { elem.style[i] = input.css[i]; }
			}
		}
		if (input.html) { elem.innerHTML = input.html; }
	}
	if (typeof input=="string" && /^<([a-z]+|!--)[\s\S]+>$/i.test(input)) {
		elem = document.createElement("div");
		elem.innerHTML = input;
		if (elem.childNodes.length<2) { elem = elem.childNodes[0]; }
	}
	if (!elem.attachEvent && !elem.addEventListener) { return null; }
	
	// Private properties and methods
	// Because methods are private, return values are not the main object wrapper
	css = (elem.style) ? elem.style : null;
	function validateEvent (e) {
		if (!e || !e.type || !e.func) { return false; }
		if (typeof e.type!="string" || typeof e.func!="function") { return false; }
		if (!e.useC) { e.useC = false; }
		return true;
	}
	function pushEvent (ev) {
		if (!eventArrays[ev.type]) { eventArrays[ev.type] = []; }
		eventArrays[ev.type].push(ev);
	}
	function popEvent (ev) {
		if (!eventArrays[ev.type]) { return; }
		var temp = [];
		while (eventArrays[ev.type].length) {
			if (eventArrays[ev.type][eventArrays[ev.type].length-1]!=ev) {
				temp.push(eventArrays[ev.type].pop());
			} else { eventArrays[ev.type].pop(); }
		}
		while (temp.length) { eventArrays[ev.type].push(temp.pop()); }
		return ev;
	}
	
	// Private return values
	lastReturnObject = {};
	lastReturnArray = [];
	lastReturnBool = true;
	lastReturnNumber = 0;
	lastReturnValue = null;
	
	// Private event arrays
	eventArrays = { click:[], mouseover:[], mouseout:[], mousedown:[], mouseup:[],
		keydown:[], keyup:[], keypress:[], reset:[], focus:[], blur:[] };
	
	// Priveledged methods
	this.lastReturnObject = function () { return lastReturnObject; };
	this.lastReturnArray = function () { return lastReturnArray; };
	this.lastReturnBool = function () { return lastReturnBool; };
	this.lastReturnNumber = function () { return lastReturnNumber; };
	this.lastReturnValue = function () { return lastReturnValue; };
	this.returnValue = function (value) {
		if (value!==null && typeof value=="object" && (!value.push || !value.length)) {
			lastReturnObject = value;
		} else if (value!==null && typeof value=="object" && value.push && value.length) {
			lastReturnArray = value;
		} else if (typeof value=="bool") {
			lastReturnBool = value;
		} else if (typeof value=="number") {
			lastReturnNumber = value;
		}
		lastReturnValue = (typeof value=="undefined") ? null : value;
	};
	
	/* Event management */
	this.addEvent = function (events) {
		if (!events || !events.length) { this.returnValue.call(this, null); return this; }
		var ret = [], i;
		for (i=0; i<events.length; i++) {
			if (validateEvent(events[i])) {
				pushEvent(events[i]);
				if (elem.addEventListener) {
					elem.addEventListener (events[i].type, events[i].func, !(!events[i].useC));
				} else if (elem.attachEvent) {
					elem.attachEvent ("on"+events[i].type, events[i].func);
				} else {
					elem["on"+events[i].type] = events[i].func;
				}
				ret.push(true);
			} else {
				ret.push(false);
			}
		}
		this.returnValue.call(this, ret);
		return this;
	};
	this.removeEvent = function (events) {
		if (!events) { this.returnValue.call(this, null); return this; }
		var ret = [];
		for (var i=0; i<events.length; i++) {
			if (events.hasUnique(i)) {
				if (validateEvent(events[i])) {
					events[i] = popEvent(events[i]);
					if (elem.removeEventListener) {
						elem.removeEventListener(events[i].type, events[i].func, !(!events[i].useC));
					} else if (elem.detachEvent) {
						elem.detachEvent("on"+events[i].type, events[i].func);
					} else {
						elem["on"+events[i].type] = "";
					}
					ret.push(true);
				} else {
					ret.push(false);
				}
			}
		}
		this.returnValue.call(this, ret);
		return this;
	};
	this.resetEvents = function (evtype) {
		if (!evtype || typeof evtype!="string") { this.returnValue.call(this, null); return this; }
		evtype = evtype.strip().split(" "); var ret = [];
		for (var i=0; i<evtype.length; i++) {
			if (eventArrays.hasUnique(evtype[i])) {
				this.removeEvent(eventArrays[evtype[i]]);
				ret.push(true);
			} else {
				ret.push(false);
			}
		}
		this.returnValue.call(this, ret);
		return this;
	};
	
	/* Class management */
	this.getClass = function () {
		this.returnValue.call(this, elem.className);
		return this;
	};
	this.addClass = function (newClass) {
		if (typeof newClass!="string") { this.returnValue.call(this, false); return this; }
		newClass = newClass.strip().split(" ");
		for (var i=0; i<newClass.length; i++) {
			if (elem.className==="" || !elem.className) {
				elem.className = newClass[i];
			} else if (elem.className.search(newClass[i])<0) {
				elem.className += " " + newClass[i];
			}
		}
		this.returnValue.call(this, true);
		return this;
	};
	this.removeClass = function (oldClass) {
		if (typeof oldClass!="string") { this.returnValue.call(this, false); return this; }
		oldClass = oldClass.strip();
		if (elem.className==="" || !elem.className) { this.returnValue.call(this, true); return this; }
		oldClass = oldClass.split(" ");
		for ( var i=0; i<oldClass.length; i++) {
			if (elem.className.search(oldClass)>-1) {
				elem.className = elem.className.replace(oldClass, "");
				elem.className = elem.className.strip();
			}
		}
		this.returnValue.call(this, true);
		return this;
	};
	this.noClass = function () {
		elem.removeAttribute("class");
		this.returnValue.call(this, true);
		return this;
	};
	this.clearClass = function () {
		elem.className = "";
		this.returnValue.call(this, true);
		return this;
	};
	
	/* Style management */
	this.getStyle = function (styles) {
		if (!styles || !css) { this.returnValue.call(this, false); return this; }
		var ret;
		if (styles.push) {
			ret = [];
			for (var i=0; i<styles.length; i++) {
				ret.push( css[styles[i]] ? css[styles[i]] : null );
			}
		} else if (styles.substr) {
			ret = css[styles] ? css[styles] : null;
		} else {
			ret = false;
		}
		this.returnValue.call(this, ret);
		return this;
	};
	this.setStyle = function (styles) {
		if (typeof styles!="object" || styles.push || !css) { this.returnValue.call(this, false); return this; }
		for (var i in styles) {
			if (styles.hasUnique(i)) {
				css[i] = styles[i];
			}
		}
		this.returnValue.call(this, true);
		return this;
	};
	this.resetStyle = function (styles) {
		if(!styles || !css) { this.returnValue.call(this, false); return this; }
		if (typeof styles=="string") {
			css[styles] = "";
		} else if (styles.push) {
			for (var i=0; i<styles.length; i++) {
				css[styles[i]] = "";
			}
		}
		this.returnValue.call(this, true);
		return this;
	};
	
	/* Make life easier */
	this.addChild = function (child) {
		this.returnValue.call(this, elem.appendChild(child));
		return this;
	};
	this.appendChild = this.addChild;
	this.removeChild = function (child) {
		this.returnValue.call(this, elem.removeChild(child));
		return this;
	};
	this.getElement = function () {
		return elem;
	};
	
	// Ensures object creation
	return this;
};

// Initialize the persistence cache
j$.c = {};

// Procedure to create a plugin
j$.addPlugin = function(plugin, overwrite) {
	if (!plugin||!plugin.name||!plugin.func) { return [false]; }
	if (typeof plugin!="object"||typeof plugin.name!="string"||typeof plugin.func!="function") { return [false]; }
	var ret = [true], i;
	if (!j$.prototype.init.prototype[plugin.name] || overwrite) {
		j$.prototype.init.prototype[plugin.name] = plugin.func;
		if (plugin.properties && typeof plugin.properties=="object") {
			for (i in plugin.properties) {
				if (plugin.properties.hasUnique(i)) {
					if(!j$.prototype.init.prototype[i]||overwrite) {
						j$.prototype.init.prototype[i] = plugin.properties[i];
					} else {
						ret.push(i);
					}
				}
			}
		}
		if (!plugin.persistent) { plugin.persistent = plugin.cache ? plugin.cache : null; }
		if (plugin.persistent&&typeof plugin.persistent=="object") {
			for (i in plugin.persistent) {
				if (plugin.persistent.hasUnique(i)) {
					if(!j$.c[i] || overwrite) {
						j$.c[i] = plugin.persistent[i];
					} else {
						ret.push(i);
					}
				}
			}
		}
		return ret;
	} else {
		return [false];
	}
};

// Useful extensions
j$.xhttp = function(url, func, method, data) {
	try {
		var useEvent = false;
		if (typeof url!="string") { throw "No URL"; }
		if (typeof func=="function") { useEvent = true; }
		if (typeof method!="string") { method = "GET"; }
		var x = (XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
		j$.xhttp.x = x;
		x.open(method, url, useEvent);
		if (method=="POST"&&typeof data=="string"&&data.length) {
			x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		}
		switch (useEvent) {
			case true:
				x.onreadystatechange = func;
				x.send((method=="POST"&&typeof data=="string")?data:"");
				return [true];
			case false:
				x.send((method=="POST"&&typeof data=="string")?data:"");
				return [true, [x.status, x.getAllResponseHeaders(), x.responseText, x.responseXML]];
		}
	} catch (e) {
		return [false, e];
	}
};
j$.include = function(resource) {
	if (typeof resource!="object") { return [false, "No resource object"]; }
	if (!resource.url||!resource.type) { return [false, "Bad resource object"]; }
	if (typeof(resource.url)!==typeof("string")||typeof(resource.type)!==typeof("string")) { return [false, "Bad resource object"]; }
	try {
		var elem, xdata;
		switch (resource.type) {
			case "css":
			case "stylesheet":
			case "style":
				elem = document.createElement("link");
				elem.href = resource.url;
				elem.type = "text/css";
				elem.rel = "stylesheet";
				document.getElementsByTagName("head")[0].appendChild(elem);
				break;
			case "js":
			case "javascript":
			case "script":
				elem = document.createElement("script");
				elem.src = resource.url;
				elem.type = "text/javascript";
				document.getElementsByTagName("head")[0].appendChild(elem);
				break;
			case "snippet":
			case "codesnippet":
				if (typeof resource.target!="object") { throw "No target for snippet"; }
				if (typeof resource.makediv!="boolean") { resource.makediv = true; }
				switch (resource.makediv) {
					case true:
						elem = document.createElement("div");
						elem.className = "snippet";
						resource.target.appendChild(elem);
						xdata = j$.xhttpget(resource.url);
						elem.innerHTML = (xdata[0])?xdata[1][2]:"Error fetching data.";
						break;
					case false:
						xdata = j$.xhttpget(resource.url);
						resource.target.innerHTML += (xdata[0])?xdata[1][2]:"Error fetching data.";
						break;
				}
				break;
			default:
				throw "Invalid resource type";
		}
		return [true];
	} catch (e) {
		return [false, e];
	}
};

// no-conflict

if (typeof $==="undefined") { $ = j$; }

// To filter for...in loops without using prototype
Object.prototype.hasUnique = function (item) {
	var t = {};
	if (typeof this[item]==="undefined" || typeof t[item]!=="undefined") { return false; }
	return true;
};
Array.prototype.hasUnique = function (item) {
	var a = [];
	if (typeof this[item]==="undefined" || typeof a[item]!=="undefined") { return false; }
	return true;
};

// String extension used in class management
String.prototype.strip = function (str) {
	var t = this.split("");
	while (t.length && /\s/.test(t[t.length-1])) {t.pop();}
	t = t.reverse();
	while (t.length && /\s/.test(t[t.length-1])) {t.pop();}
	t = t.reverse();
	return t.join("");
};
