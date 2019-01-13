'use strict';

const {Event} = require('./Utilities/Utilities');

// class
var View;

// variables
View = function(_tag = "Untagged", _height = -1, _width = -1, _bindElementID = null){
	this.tag = _tag;
	this.height = _height;
	this.width = _width;
	this.bindElementID = _bindElementID;
};

// static
var dragData = {}; // private

View.DragInfo = {
	IEvent: 0, 
	State: 1, 
	ListedState: 2,
	IReaction: 3, 
	ListedIReaction: 4, 
	GalleryImage: 5,
	GallerySound: 6,
	ListedObject: 7, 
	ListedScene: 8,
};

View.HandleDragstart = function(ev, infoType, data){
	dragData = {type: infoType, data: data};
	//ev.dataTransfer.setData("text/plain", JSON.stringify({type: infoType, data: data}));
 	ev.dropEffect = "all";
};

View.HandleDragover = function(ev, infoType, operation){
	if (infoType == null || infoType == dragData.type){
		ev.preventDefault();
		if (typeof operation == "function"){
			operation(dragData.data);
		}
	}
};

View.HandleDragEnter = function(ev, infoType, operation){
	if (infoType == dragData.type){
		ev.preventDefault();
		if (typeof operation == "function"){
			operation(dragData.data);
		}
	}
};

View.HandleDrop = function(ev, infoType, operation){
	//var info = JSON.parse(ev.dataTransfer.getData("text"));
	if (infoType == dragData.type){
		ev.preventDefault();
		if (typeof operation == "function"){
			operation(dragData.data);
		}
		dragData = {};
	}
}

View.Selection = (function(){ // WORKING ON: MOVE TO GLOBAL
	var _obj = null, _scn = null;
	var _objOff = function(){
		if (_obj != null) {
			_obj.SelectOff();
			_obj = null;
		}
	};
	var _scnOff = function(){
		if (_scn != null) {
			_scn.SelectOff();
			_scn = null;
		}
	};
	var _objOn = function(obj){
		_objOff();
		if (obj != null){
			_obj = obj;
			obj.SelectOn();
		}
	};
	var _scnOn = function(scn){
		_scnOff();
		if (scn != null){
			_scn = scn;
			scn.SelectOn();
		}
	};
	Event.AddListener("delete-scene", (_id)=>{
		if (_scn && _scn.id == _id){
			_objOff();
			_scnOff();
			Event.Broadcast("update-selection");
		}
	});
	Event.AddListener("delete-object", (_id)=>{
		if (_obj && _obj.id == _id){
			_objOff();
			Event.Broadcast("update-selection");
		}
	});
	return {
		get object() {return _obj},
		get scene() {return _scn},
		deSelect: function(){
			_objOff(); 
			_scnOff();
			Event.Broadcast("update-selection");
		},
		deSelectObject: function(){
			_objOff();
			Event.Broadcast("update-selection");
		},
		selectObject: function(obj){
			_objOn(obj);
			if (obj.bindScene != null) _scnOn(obj.bindScene);
			Event.Broadcast("update-selection");
		},
		selectScene: function(scn){
			_scnOn(scn);
			_objOff();
			Event.Broadcast("update-selection");
		},
	};
})();

// functions
View.prototype.InitView = function(){
	// TODO
	//console.log('Init view: ' + this.tag);
	return;
};

View.prototype.ReloadView = function(){
	// TODO
	//console.log('Reload view: ' + this.tag);
	return;
};

module.exports = View;