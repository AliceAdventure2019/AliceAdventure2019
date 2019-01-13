'use strict';

var AliceEditor;

AliceEditor = (function(){
	var getModule = function(name) {return require('./EditorScripts/' + name);}
	var utilities = getModule('Utilities/Utilities');
	return {
		get Debug() {return utilities.Debug;}, 
		get Event() {return utilities.Event;},

		get GameProperties() {return getModule('GameProperties');}, 
		get Scene() {return getModule('Scene');},
		get SceneObject() {return getModule('SceneObject');},
		get State() {return getModule('State');},
		get IEvent() {return getModule('IEvent');},
		get IReaction() {return getModule('IReaction');},
		get Interaction() {return getModule('Interaction');},
		get Sound() {return getModule('Sound');},

		get File() {return getModule('File');}, 
		//get Menu() {return getModule('Menu');},
		
		get View() {return getModule('View');},
		get WelcomeView() {return getModule('WelcomeView');},
		get TutorialView() {return getModule('TutorialView');},
		get RunView() {return getModule('RunView');},
		get GalleryView() {return getModule('GalleryView');}, 
		get SceneView (){return getModule('SceneView');},
		get PropertyView() {return getModule('PropertyView');},
		get ObjectListView() {return getModule('ObjectListView');},
		get ILibraryView() {return getModule('ILibraryView');},
		get InteractionView() {return getModule('InteractionView');}, 
		get GameSettingView() {return getModule('GameSettingView');},
	};
})();

module.exports = AliceEditor;