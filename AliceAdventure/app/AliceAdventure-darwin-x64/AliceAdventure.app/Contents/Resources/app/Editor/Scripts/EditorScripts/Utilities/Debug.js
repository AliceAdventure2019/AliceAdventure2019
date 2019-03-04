'use strict';

// class
var Debug;

// variables
Debug = function(){};

// functions
Debug.Log = function(something){
	console.log("LOG: " + something);
	alert(something);
	// TODO: Reserved for later output functionality
}

Debug.LogError = function(something){
	console.log("ERROR: " + something);
	alert(something);
	// TODO: Reserved for later output functionality
}

Debug.LogWarning = function(something){
	console.log("WARNING: " + something);
	// TODO: Reserved for later output functionality
}

module.exports = Debug;