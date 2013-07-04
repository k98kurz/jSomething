/*!
 * jSomething Lightweight JavaScript Framework
 * Better Events plugin
 *
 * Copyright 2012, Jonathan Voss
 * Date: 7/12/2012
 * Last Revision: 1/16/2012
 * Version: 1.0.3
*/

(function(w) {
	if (!w.$ && !w.j$){ return; }
	var $ = (typeof w.$.c=="object" && typeof w.$.addPlugin=="function") w.$ : w.j$;
	
	var plugins = [ {
			name		:	"eventElementFind",
			persistent	:	{
				eventcache	:	[]
			},
			func		:	function () {
				if (!j$.c.eventcache.length) { return false; }
				for (i=0; i<j$.c.eventcache.length; i++) {
					if (j$.c.eventcache[i].e == elem) { return [i];}
				}
				return false;
			}
		},
		{
			name		:	"addEvent",
			func		:	function (events) {
				if (!events||!events.length) { this.returnValue.call(this, null); return this; }
				var ret = [], ind;
				for (i=0; i<events.length; i++) {
					if (validateEvent(events[i])) {
						if (elem.addEventListener) {
							elem.addEventListener(events[i].type, events[i].func, events[i].useC ? true : false);
						} else if (elem.attachEvent) {
							elem.attachEvent("on"+events[i].type, events[i].func);
						} else {
							elem["on"+events[i].type] = events[i].func;
						}
						if (!this.eventElementFind()) {
							j$.c.eventcache.push( {
								e : elem,
								v : [events[i]]
							} );
							ind = 0;
						} else {
							j$.c.eventcache[this.eventElementFind()[0]].v.push(events[i]);
							ind = j$.c.eventcache[this.eventElementFind()[0]].v.length-1;
						}
						ret.push([ind]);
					} else {
						ret.push(false);
					}
				}
				this.returnValue.call(this, ret);
				return this;
			}
		},
		{
			name		:	"removeEvent",
			func		:	function (events) {
				if (!c) {var c;}
				if (!events||!events.length) { this.returnValue.call(this, null); return this; }
					var ret = [], eve;
					for (i=0; i<events.length; i++) {
						if (validateEvent(events[i])) {
							if (elem.removeEventListener) {
								elem.removeEventListener(events[i].type, events[i].func, events[i].useC ? true : false);
							} else if (elem.detachEvent) {
								elem.detachEvent("on"+events[i].type, events[i].func);
							} else {
								elem["on"+events[i].type] = "";
							}
							if (this.eventElementFind() && j$.c.eventcache[this.eventElementFind()[0]].v.length){
								var tempindex = this.eventElementFind()[0];
								for (c=0; c<j$.c.eventcache[tempindex].v.length; c++) {
									if (j$.c.eventcache[tempindex].v[c] == events[i]) {
										j$.c.eventcache[tempindex].v.splice(c,1);
									}
								}
							}
							ret.push(true);
						} else if (typeof(events[i].type)=="string" && typeof(events[i].index)==typeof 1) {
							if (this.eventElementFind()&&j$.c.eventcache[this.eventElementFind()[0]].v[events[i].index]) {
								eve = j$.c.eventcache[this.eventElementFind()[0]].v.splice(events[i].index,1);
								if (elem.removeEventListener) {
									elem.removeEventListener(eve.type, eve.func, eve.useC ? true : false);
								} else if (elem.detachEvent) {
									elem.detachEvent("on"+eve.type, eve.func);
								} else {
									elem["on"+eve.type] = "";
								}
								ret.push(true);
							} else { ret.push(false); }
						} else {
							ret.push(false);
						}
					}
					this.returnValue.call(this, ret);
					return this;
			}
		},
		{
			name		:	"removeAllEvents",
			func		:	function () {
				var t = this.eventElementFind();
				if (t&&j$.c.eventcache[t[0]].v.length) {
					while (j$.c.eventcache[t[0]].v.length) {
						var eve = j$.c.eventcache[t[0]].v.pop();
						if (elem.removeEventListener) {
							elem.removeEventListener(eve.type, eve[i].func, eve[i].useC ? true : false);
						} else if (elem.detachEvent) {
							elem.detachEvent("on"+eve[i].type, eve[i].func);
						} else {
							elem["on"+eve[i].type] = "";
						}
					}
				}
				if (t) { j$.c.eventcache.splice(t[0], 1); }
				this.returnValue.call(this, true);
				return this;
			}
		},
		{
			name		:	"resetEvents",
			func		:	function (ssType) {
				if (!ssType||typeof ssType!="string"||!this.eventElementFind()) { this.returnValue.call(this, false); return this; }
				var g = this.eventElementFind()[0], vArray = [], remArray = [], n, obEvent;
				while(j$.c.eventcache[g].v.length) {
					if (j$.c.eventcache[g].v[i].type == ssType) {
						remArray.push(j$.c.eventcache[g].v.pop());
					} else {
						vArray.push(j$.c.eventcache[g].v.pop());
					}
				} j$.c.eventcache[g].v = vArray; n = remArray.length;
				while (remArray.length) {
					obEvent = remArray.pop();
					if (validateEvent(obEvent)) {
						if (elem.removeEventListener) {
							elem.removeEventListener(obEvent.type, obEvent.func, obEvent.useC ? true : false);
						} else if (elem.detachEvent) {
							elem.detachEvent("on" + obEvent.type, obEvent.func);
						} else {
							elem["on" + obEvent.type] = "";
						}
					}
				}
				this.returnValue.call(this, n);
				return this;
			}
		}
	];
	
	while (plugins.length) { $.addPlugin ( plugins.pop(), true ); }
})(window);
