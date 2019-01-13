'use strict';

const {PIXI, PROMPT, Event} = require('./Utilities/Utilities');
const GameProperties = require('./GameProperties');
const Scene = require('./Scene');
const SceneObject = require('./SceneObject');
const View = require('./View');

// class
var SceneView;

// variables
SceneView = function(_bindElementID, _height = -1, _width = -1){
	View.call(this, "SceneView", _height, _width, _bindElementID);

	this.app = null;
	this.vModel = null;
};
SceneView.prototype = new View();

// static
SceneView.NewView = function(_elementID){
	var view = new SceneView(_elementID);
	view.InitView();
	return view;
};

// functions
SceneView.prototype.InitView = function(){
	View.prototype.InitView.apply(this); // call super method
	// Init data binding
	this.vModel = new Vue({
		el: '#' + this.bindElementID,
		data: {
			projectLoaded: false
		}, 
		methods: {
			addScene: ()=>{this.AddScene();},
			assetDragover: (ev)=>{View.HandleDragover(ev, View.DragInfo.GalleryImage);},
			assetDrop: (ev)=>{View.HandleDrop(ev, View.DragInfo.GalleryImage, (data)=>{this.AddObject(data);});},
			deleteSelected: ()=>{this.DeleteSelected()},
		}
	});
	// Init app
	this.app = new PIXI.Application({
		width: 480,
		height: 360, 
		antialiasing: true, 
		backgroundcolor: 0xFFFFFF
	});
	document.getElementById('canvas-container').appendChild(this.app.view);
	GameProperties.SetViewSize(480, 360);

	// events
	Event.AddListener('reload-project', ()=>{this.ReloadView();});
	Event.AddListener('add-gallery-object', (_obj)=>{this.AddObject(_obj);});
	Event.AddListener('object-sprite-click', (_obj)=>{this.SelectObject(_obj);});
};

SceneView.prototype.ReloadView = function(){
	View.prototype.ReloadView.apply(this); // call super method
	this.app.stage.removeChildren();
	if (GameProperties.instance == null){ // no project is loaded
		this.vModel.projectLoaded = false;
	} else { // load current project
		this.vModel.projectLoaded = true;
		GameProperties.instance.sceneList.forEach((scn)=>{
			this.app.stage.addChild(scn.container);
			if (scn.selected){
				View.Selection.selectScene(scn);
			}
		});
		GameProperties.instance.objectList.forEach((obj)=>{
			if (obj.bindScene == null || obj.bindScene.id == 0) return;
			obj.bindScene.container.addChild(obj.sprite);
			if (obj.selected){
				View.Selection.selectObject(obj);
			}
		});
	}
};

SceneView.prototype.AddObject = function(_objInfo){
	if (View.Selection.scene == null) return;
	var _bindScene = View.Selection.scene;
	var _obj = SceneObject.AddObject(_objInfo, _bindScene, this.app.screen.width / 2, this.app.screen.height / 2);
	//_bindScene.container.addChild(_obj.sprite);
	//window.setTimeout(()=>{this.SelectObject(_obj);}, 10);
	this.SelectObject(_obj);
	//this.app.stage.addChild(_obj.sprite);
};

SceneView.prototype.AddScene = function(_name = null){
	var _scene;
	if (_name == null){
		PROMPT({
			title: "New scene", 
			label: "Input scene name: ", 
			value: "new-scene"
		}).then((_name)=>{
			if (_name != null) {
				_scene = Scene.AddScene(_name);
				this.SelectScene(_scene);
				this.app.stage.addChild(_scene.container);
			}
		});
	} else {
		_scene = Scene.AddScene(_name);
		this.SelectScene(_scene);
		this.app.stage.addChild(_scene.container);
	}
};

SceneView.prototype.SelectObject = function(_obj){
	// Select this object
	if (_obj.selectAllowed){
		View.Selection.selectObject(_obj);
	}
};

SceneView.prototype.SelectScene = function(_scn){
	// Select this object
	View.Selection.selectScene(_scn);
};

SceneView.prototype.DeleteObject = function(obj){
    if(confirm("Are you sure you want to delete the object?")) 
        obj.DeleteThis();
};

SceneView.prototype.DeleteScene = function(scn){
    if(confirm("Are you sure you want to delete the scene?\n\nDeleting the scene will also delete every object in it.")) 
        scn.DeleteThis();
};

SceneView.prototype.DeleteSelected = function(){
    if (!GameProperties.ProjectLoaded()) return;
    if (View.Selection.object != null){
        this.DeleteObject(View.Selection.object);
    } else if (View.Selection.scene != null){
        this.DeleteScene(View.Selection.scene);
    }
};

module.exports = SceneView;