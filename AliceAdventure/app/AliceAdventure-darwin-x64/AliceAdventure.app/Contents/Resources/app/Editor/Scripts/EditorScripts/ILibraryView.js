'use strict';

const {PROMPT, Event} = require('./Utilities/Utilities');
const GameProperties = require('./GameProperties');
const SceneObject = require('./SceneObject');
const State = require('./State');
const IEvent = require('./IEvent');
const IReaction = require('./IReaction');
const View = require('./View');

// class
var ILibraryView;

// variables
ILibraryView = function(_bindElementID, _height = -1, _width = -1){
	View.call(this, "ILibraryView", _height, _width, _bindElementID);

	this.vModel = null;
};
ILibraryView.prototype = new View();

// static
ILibraryView.NewView = function(_elementID){
	var view = new ILibraryView(_elementID);
	view.InitView();
	return view;
};

// functions
ILibraryView.prototype.InitView = function(){
	View.prototype.InitView.apply(this); // call super method
	// Init data binding
	this.vModel = new Vue({
		el: '#' + this.bindElementID,
		data: {
			viewEnabled: false, 
			events: IEvent.Library, 
			states: null, 
			reactions: IReaction.Library
		}, 
		methods: {
			eventDragstart: (ev, d)=>{View.HandleDragstart(ev, View.DragInfo.IEvent, d);},
			stateDragstart: (ev, d)=>{View.HandleDragstart(ev, View.DragInfo.State, d);},
			reactionDragstart: (ev, d)=>{View.HandleDragstart(ev, View.DragInfo.IReaction, d);},
			addCondition: (state, ntra)=>{ntra.AddCondition(state);},
			newState: ()=>{this.AddNewState();}, 
			deleteState: (state)=>{state.DeleteThis();}, 
			addIReaction: (iReact, ntra, index)=>{ntra.AddIReaction(iReact, index);}
		}
	});

	// events
	Event.AddListener("reload-project", ()=>{this.ReloadView();});
};

ILibraryView.prototype.ReloadView = function(){
	View.prototype.ReloadView.apply(this); // call super method

	if (GameProperties.ProjectLoaded()){
		this.vModel.viewEnabled = true;
		this.vModel.states = GameProperties.instance.stateList;
	} else {
		this.vModel.viewEnabled = false;
		this.vModel.states = null;
	}
};

ILibraryView.prototype.AddNewState = function(){
	PROMPT({
		title: "New state", 
		label: "State name: ", 
		value: "state_1"
	}).then((_name)=>{
		if (_name != null) {
			//State.NewState(_name, false);
            GameProperties.instance.stateList.push(new State(null,_name,false));
		}
	});
}

module.exports = ILibraryView;