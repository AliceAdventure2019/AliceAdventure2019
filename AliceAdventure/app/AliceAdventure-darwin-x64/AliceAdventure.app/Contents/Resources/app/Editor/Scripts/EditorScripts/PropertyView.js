'use strict';

const {Event} = require('./Utilities/Utilities');
const GameProperties = require('./GameProperties');
const View = require('./View');

// class
var PropertyView;

// variables
PropertyView = function(_bindElementID, _height = -1, _width = -1){
	View.call(this, "PropertyView", _height, _width, _bindElementID);

	//this.bindObject = null;
	this.vModel = null;
	
};
PropertyView.prototype = new View();

// static
PropertyView.NewView = function(_elementID){
	var view = new PropertyView(_elementID);
	view.InitView();
	return view;
};

// functions
PropertyView.prototype.InitView = function(){
	View.prototype.InitView.apply(this); // call super method
	// init data binding
	this.vModel = new Vue({
	  el: '#' + this.bindElementID,
	  data: {
	  	projectLoaded: false,
	  	showObject: false,
	    object: null,
	    showScene: false,
	    scene: null
	  }, 
	  methods:{
	  	toggleLock: ()=>{this.vModel.object.ToggleLock()},
	  	deleteObject: ()=>{this.DeleteObject()},
	  	deleteScene: ()=>{this.DeleteScene()},
	  	//addProperty: ()=>{ this.bindObject.AddUserProperty(this.vModel.propertyKey, this.vModel.propertyType, this.vModel.propertyValue); }
	  }
	});

	// events
	Event.AddListener("reload-project", ()=>{this.ReloadView();});
	Event.AddListener("update-selection", ()=>{this.UpdateSelection();});
};

PropertyView.prototype.ReloadView = function(){
	View.prototype.ReloadView.apply(this); // call super method

	if (GameProperties.instance == null){
		this.vModel.projectLoaded = false;
	} else {
		this.vModel.projectLoaded = true;
	}
};

PropertyView.prototype.UpdateSelection = function(){
	this.vModel.showObject = (View.Selection.object != null);
	this.vModel.object = View.Selection.object;

	this.vModel.showScene = (View.Selection.object == null) && (View.Selection.scene != null);
	this.vModel.scene = View.Selection.scene;
};

PropertyView.prototype.DeleteObject = function(){
	if (confirm("Are you sure you want to delete the object?")){
		this.vModel.object.DeleteThis();
	}
}

PropertyView.prototype.DeleteScene = function(){
	if (confirm("Are you sure you want to delete the scene?\n\nDeleting the scene will also delete every object in it.")){
		this.vModel.scene.DeleteThis();
	}
}

module.exports = PropertyView;