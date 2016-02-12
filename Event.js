(function (){
"use strict";

var Event = {

	on: function (event, callback) {

		var events, name;
		if (!Owl.isString(event) || !Owl.isFunction(callback)) {
			return this;
		}
		this._callbacks = this._callbacks || {};
		events = event.split(" ");
		for (var i = 0; i < events.length; i++) {
			name = events[i];
			if (name in this._callbacks) {
			} else {
				this._callbacks[name] = [];
			}
			this._callbacks[name].push(callback);

		}

		return this;
	},

	bind: function () {
		return this.on.apply(this, arguments);
	},

	off: function (event, callback) {

		var events, name, cbList, newCbList, cb, i, j, k;
		if (!Owl.isString(event)) {
			return this;
		}
		if (!this._callbacks) return;

		events = event.split(" ");
		for (i = 0; i < events.length; i++) {
			name = events[i];
			if (name in this._callbacks) {
				cbList = this._callbacks[name];
				if (!callback) {
					delete this._callbacks[name];
					continue;
				}

				// check if the callback in the event callback array in a loop
				for (j = k = 0; k < cbList.length; k = ++j) {
					cb = cbList[j];
					if (cb !== callback) {
						continue;
					}
					newCbList = cbList.slice();
					newCbList.splice(j, 1);
					this._callbacks[name] = newCbList;
					break;
				}
			}
		}

		return this;
	},

	unbind: function () {
		return this.off.apply(this, arguments);
	},

	once: function (event, callback) {
		var handler = function () {
			this.off(event, handler);
			return callback.apply(this, arguments);
		}.bind(this);
		return this.on(event, handler);
	},

	listenTo: function (obj, event, callback) {
		obj.bind(event, callback);
		this._listenTo = this._listenTo || [];
		this._listenTo.push({
			obj: obj,
			event: event,
			callback: callback
		});
		return this;
	},

	stopListening: function (obj, event, callback) {
		var listenTo, newListenTo, events, item, res, i, j;
		if (!this._listenTo) { return this; }
		listenTo = this._listenTo;
		// If there is no argument, remove all listener
		if (arguments.length === 0) {
			listenTo.forEach(function (item) {
				item.obj.unbind(item.event, item.callback);
			});
			this._listenTo = void 0;
		} else if (obj) {
			events = event.split(' ');
			for (i = j = 0; j < listenTo.length; i = ++j) {
				item = listenTo[i];
				if (item.obj === obj) {
					item.obj.unbind(item.event, item.callback);
				}
				newListenTo = listenTo.slice();
				newListenTo.splice(i, 1);
				this._listenTo = newListenTo;
				break;
			}
			this._listenTo = res;
		}

		return this;
	},

	trigger: function (event) {
		var events, name, callback;
		if (!Owl.isString(event)) {
			return this;
		}
		events = event.split(" ");
		for (var i = 0; i < events.length; i++) {
			name = events[i];
			if (name in this._callbacks) {
				for (var j = 0; j < this._callbacks[name].length; j++) {
					callback = this._callbacks[name][j];
					callback();
				}
			}
		}

		return this;
	},

	removeAll: function () {
		this._callbacks = void 0;
		this._listenTo = void 0;
		return this;
	}
};


})();
