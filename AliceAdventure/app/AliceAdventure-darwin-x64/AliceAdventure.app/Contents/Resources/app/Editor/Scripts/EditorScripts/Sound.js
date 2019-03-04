'use strict';

const {ID} = require('./Utilities/Utilities');
const GameProperties = require('./GameProperties');

// class
var Sound;

// variables
Sound = function(_id, _name, _src){
	if (_id == null) _id = ID.newID; // NEVER MODIFY THIS
	this.id = _id;
	this.name = _name;
	this.src = _src;
};

// static
Sound.NewSound = function(_name = "NewSound", _src = ""){
	let sound = new Sound(null, _name, _src);
	GameProperties.AddSound(sound);
	return sound;
};

Sound.LoadSound = function(_data){
	let sound = new Sound(_data.id, _data.name, _data.src);
	GameProperties.AddSound(sound);
	return sound;
};

// function
Sound.prototype.toJsonObject = function(){
	return {
		id: this.id,
		name: this.name,
		src: this.src
	};
};

module.exports = Sound;