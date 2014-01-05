/*!
 * jSomething Lightweight JavaScript Framework
 * Better Events plugin
 *
 * Copyright 2012, Jonathan Voss
 * Date: 7/12/2012
 * Last Revision: 7/5/2013
 * Version: 1.1.0
*/

(function(w) {
	if (!w.$ && !w.j$){ return; }
	var j$ = (typeof w.$.c=="object" && typeof w.$.addPlugin=="function") ? w.$ : w.j$;
	
	var plugins = [ {
			name		:	"eventElementFind",
			persistent	:	{
				eventcache	:	[]
			},
			func		:	function () {
				if (!j$.c.eventcache.length) { return false; }
				for (i=0; i<j$.c.eventcache.length; i++) {
					if (j$.c.eventcache[i].e == this.getElement()) { return [i];}
				}
				return false;
			}
		},
		{
			name		:	"ValidEvent",
			func		:	function (e) {
				if (!e || !e.type || !e.func) { return false; }
				if (typeof e.type!="string" || typeof e.func!="function") { return false; }
				if (!e.useC) { e.useC = false; }
				return true;
			}
		},
		{
			name		:	"AddEvent",
			func		:	function (events) {
				if (!events||!events.length) { this.returnValue.call(this, null); return this; }
				var ret = [], ind;
				for (i=0; i<events.length; i++) {
					if (this.ValidEvent(events[i])) {
						if (this.getElement().addEventListener) {
							this.getElement().addEventListener(events[i].type, events[i].func, events[i].useC ? true : false);
						} else if (this.getElement().attachEvent) {
							this.getElement().attachEvent("on"+events[i].type, events[i].func);
						} else {
							this.getElement()["on"+events[i].type] = events[i].func;
						}
						if (!this.eventElementFind()) {
							j$.c.eventcache.push( {
								e : this.getElement(),
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
			name		:	"RemoveEvent",
			func		:	function (events) {
				if (!c) {var c;}
				if (!events||!events.length) { this.returnValue.call(this, null); return this; }
					var ret = [], eve;
					for (i=0; i<events.length; i++) {
						if (this.ValidEvent(events[i])) {
							if (this.getElement().removeEventListener) {
								this.getElement().removeEventListener(events[i].type, events[i].func, events[i].useC ? true : false);
							} else if (this.getElement().detachEvent) {
								this.getElement().detachEvent("on"+events[i].type, events[i].func);
							} else {
								this.getElement()["on"+events[i].type] = "";
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
								if (this.getElement().removeEventListener) {
									this.getElement().removeEventListener(eve.type, eve.func, eve.useC ? true : false);
								} else if (this.getElement().detachEvent) {
									this.getElement().detachEvent("on"+eve.type, eve.func);
								} else {
									this.getElement()["on"+eve.type] = "";
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
			name		:	"RemoveAllEvents",
			func		:	function () {
				var t = this.eventElementFind(), eve;;
				if (t&&j$.c.eventcache[t[0]].v.length) {
					while (j$.c.eventcache[t[0]].v.length) {
						eve = j$.c.eventcache[t[0]].v.pop();
						if (this.getElement().removeEventListener) {
							this.getElement().removeEventListener(eve.type, eve.func, eve.useC ? true : false);
						} else if (this.getElement().detachEvent) {
							this.getElement().detachEvent("on"+eve.type, eve.func);
						} else {
							this.getElement()["on"+eve.type] = "";
						}
					}
				}
				if (t) { j$.c.eventcache.splice(t[0], 1); }
				this.returnValue.call(this, true);
				return this;
			}
		},
		{
			name		:	"ResetEvents",
			func		:	function (ssType) {
				if (!ssType||typeof ssType!="string"||!this.eventElementFind()) { this.returnValue.call(this, false); return this; }
				var g = this.eventElementFind()[0], vArray = [], remArray = [], n, obEvent, tv;
				while(j$.c.eventcache[g].v.length) {
					tv = j$.c.eventcache[g].v.pop();
					if (tv.type == ssType) {
						remArray.push(tv);
					} else {
						vArray.push(tv);
					}
				} j$.c.eventcache[g].v = vArray; n = remArray.length;
				while (remArray.length) {
					obEvent = remArray.pop();
					if (this.ValidEvent(obEvent)) {
						if (this.getElement().removeEventListener) {
							this.getElement().removeEventListener(obEvent.type, obEvent.func, obEvent.useC ? true : false);
						} else if (this.getElement().detachEvent) {
							this.getElement().detachEvent("on" + obEvent.type, obEvent.func);
						} else {
							this.getElement()["on" + obEvent.type] = "";
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
