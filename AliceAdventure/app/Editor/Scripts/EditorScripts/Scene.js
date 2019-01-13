'use strict';

const {PIXI, ID, Event, Debug} = require('./Utilities/Utilities');
const GameProperties = require('./GameProperties');

// class
var Scene;

// variables
Scene = function(_id, _name = "untitledScene"){
	if (_id == null) _id = ID.newID; // NEVER MODIFY THIS
	this.id = _id;
	this.name = _name;

	this.container = null;
	this.selected = false;
	this.bgSrc = "src/picture.png"; // TODO replace that
    
    this.objectList = [];

	GameProperties.AddScene(this);
};

// static
Scene.AddScene = function(_name){
	let scene = new Scene(null, _name);
	scene.InitContainer();
	return scene;
};

Scene.LoadScene = function(_data){
	let scene = new Scene(_data.id, _data.name);
	scene.InitContainer();
	return scene;
}

Scene.addObj = function(_obj) {
    this.objectList.push(_obj)
}

Scene.removeObj = function(_obj){
    for(var i in this.objectList) {
        if(this.objectList[i]._id == _obj.id) {
            this.objectList.splice(i,1);
            return;
        }
    }
}

// functions
Scene.prototype.InitContainer = function(){
	this.container = new PIXI.Container();
	this.container.visible = false;
};

Scene.prototype.SetAsStartScene = function(){
	if (!GameProperties.ProjectLoaded()) return;
	GameProperties.instance.settings.startScene = this.id;
}

Scene.prototype.DeleteThis = function(){
	if (!GameProperties.ProjectLoaded()) return;
	if (GameProperties.GetSceneLength() <= 1) {
		Debug.LogError("You have to keep at least one scene!");
		return false;
	}
	// Delete objects in scene
	let objToDelete = [];
	GameProperties.instance.objectList.forEach((obj)=>{
		if (obj.bindScene == this){
			objToDelete.push(obj);
		}
	});
	objToDelete.forEach((obj)=>{
		obj.DeleteThis();
	});
	// Delete scene
	if (this.container != null){
		if (this.container.parent != null) this.container.parent.removeChild(this.container);
		this.container.destroy();
	}
	GameProperties.DeleteScene(this);
	Event.Broadcast('delete-scene', this.id);
};

Scene.prototype.GetFirstObject = function(){ // TODO: replace this with BG sprite
	if (!GameProperties.ProjectLoaded()) return null;
	for (var i in GameProperties.instance.objectList){
		if (GameProperties.instance.objectList[i].bindScene.id == this.id){
			return GameProperties.instance.objectList[i]; 
		}
	};
	return null;
};

Scene.prototype.SelectOn = function(){
	this.selected = true;
	this.container.visible = true;
};

Scene.prototype.SelectOff = function(){
	this.selected = false;
	this.container.visible = false;
};

Scene.prototype.toJsonObject = function(){
	return {
		id: this.id, 
		name: this.name
	};
}

module.exports = Scene;