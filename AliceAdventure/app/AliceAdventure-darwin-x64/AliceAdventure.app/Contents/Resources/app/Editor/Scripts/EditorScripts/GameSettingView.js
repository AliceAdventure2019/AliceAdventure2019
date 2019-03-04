'use strict';

const {Event} = require('./Utilities/Utilities');
const GameProperties = require('./GameProperties');
const View = require('./View');

// class
var GameSettingView;

// variables
GameSettingView = function(_bindElementID, _height = -1, _width = -1){
	View.call(this, "GameSettingView", _height, _width, _bindElementID);

	this.vModel = null;
	
};
GameSettingView.prototype = new View();

// static
GameSettingView.NewView = function(_elementID){
	var view = new GameSettingView(_elementID);
	view.InitView();
	return view;
};

// functions
GameSettingView.prototype.InitView = function(){
	View.prototype.InitView.apply(this); // call super method
	// init data binding
	this.vModel = new Vue({
		el: '#' + this.bindElementID,
		data: {
			projLoaded: false,
			sceneOptions: null,
			gridNumOptions: [0, 5, 6, 7, 8, 9, 10],
			resOptions: [{w: 1600, h: 1200}, {w: 1280, h: 960}, {w: 800, h: 600}, {w: 640, h: 480}], 
			res: {w: null, h:null},
			settings: null
		}, 
		methods:{
			changeRes: ()=>{
				this.vModel.settings.resWidth = this.vModel.res.w; 
				this.vModel.settings.resHeight = this.vModel.res.h;
			},
		}
	});

	// events
	Event.AddListener("reload-project", ()=>{this.ReloadView();});
	Event.AddListener("delete-scene", (id)=>{this.HandleDeleteScene(id);});
};

GameSettingView.prototype.ReloadView = function(){
	View.prototype.ReloadView.apply(this); // call super method
	if (GameProperties.instance == null){
		this.vModel.projLoaded = false;
		this.vModel.sceneOptions = null;
		this.vModel.settings = null;
	} else {
		this.vModel.projLoaded = true;
		this.vModel.sceneOptions = GameProperties.instance.sceneList;
		this.vModel.settings = GameProperties.instance.settings;
		this.vModel.res = {w: GameProperties.instance.settings.resWidth, h: GameProperties.instance.settings.resHeight}
	}
};

GameSettingView.prototype.HandleDeleteScene = function(_id){
	if (GameProperties.instance.settings.startScene == _id){
		GameProperties.instance.settings.startScene = GameProperties.instance.sceneList[0].id;
	}
};

module.exports = GameSettingView;