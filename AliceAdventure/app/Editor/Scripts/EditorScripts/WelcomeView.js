'use strict';

const {IPC} = require('./Utilities/Utilities');
const File = require('./File');
const View = require('./View');

// class
var WelcomeView;

// variables
WelcomeView = function(_bindElementID, _height = -1, _width = -1){
	View.call(this, "WelcomeView", _height, _width, _bindElementID);
	this.vModel = null;
};
WelcomeView.prototype = new View();

// static
WelcomeView.NewView = function(_elementID){
	var view = new WelcomeView(_elementID);
	view.InitView();
	return view;
};

// functions
WelcomeView.prototype.InitView = function(){
	View.prototype.InitView.apply(this); // call super method
	// init data binding
	this.vModel = new Vue({
		el: '#' + this.bindElementID,
		data: {
		}, 
		methods: {
			newWiz: ()=>{
				File.NewEmptyProject(()=>{
					File.SaveAsNewProject((path)=>{
						IPC.send('new-wiz', path);
					});
				});
			}, 
			newProj: ()=>{
				File.NewEmptyProject(()=>{
					File.SaveAsNewProject((path)=>{
						IPC.send('open-proj', path);
					});
				});
			}, 
			openProj: ()=>{File.OpenProject((path)=>{IPC.send('open-proj', path);});}, 
			exit: ()=>{IPC.send('exit');}
		}
	});
};

WelcomeView.prototype.ReloadView = function(){
	View.prototype.ReloadView.apply(this); // call super method
};

module.exports = WelcomeView;