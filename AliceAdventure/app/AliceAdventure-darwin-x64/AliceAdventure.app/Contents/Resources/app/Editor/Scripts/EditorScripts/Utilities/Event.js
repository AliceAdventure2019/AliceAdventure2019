'use strict';

const Debug = require('./Debug');

var Event;

Event = (function(){
	var events = {}; // private
	return {
		Broadcast: function(_event, _parameters){
			if (events[_event] == undefined){
				//Debug.LogWarning("Event \"" + _event + "\" is not defined. ");
			}
			else {
				for (var i in events[_event]){
					events[_event][i](_parameters);
				}
			}
		}, 
		AddListener: function(_event, _function){
			if (events[_event] == undefined){
				events[_event] = [];
			}

			if (typeof _function == 'function')
				events[_event].push(_function);
			else
				Debug.LogError("Parameter added to event \"" + _event + "\" is not a function. ");
		},
	}
})();

module.exports = Event;