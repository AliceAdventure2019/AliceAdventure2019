'use strict';
const {PATH, ELECTRON, PROMPT, FS, Debug, ID, Event} = require('./Utilities/Utilities');
const Compiler = require('../../../Compiler/Compiler'); // TODO
const GameProperties = require('./GameProperties');
const Scene = require('./Scene');
const SceneObject = require('./SceneObject');
const State = require('./State');
const Interaction = require('./Interaction');
const Sound = require('./Sound');
const Image = require('./Image');
const View = require('./View');

// class
var File;

// variables
File = function(_path, _gameProperties){
	this.path = _path;
	this.gameProperties = _gameProperties;

	File.instance = this;
};

File.instance = null;

File.extension = "aap"; // the extension for our project

File.tempJsonObj = {
	sceneList: [],
	objectList: [], 
	interactionList: [],
	stateList: [],
    soundList: [],
    imageList: [],
	settings: {}, 
	projectData: {}, 
	reset: function(){
		this.sceneList = [];
		this.objectList = [];
		this.interactionList = [];
		this.stateList = [];
		this.soundList = [];
		this.imageList = [];
		this.settings = {};
		this.projectData = {};
	}
};

File.NewEmptyProject = function(callback){ // TUT
	let newEmpty = function(){
		PROMPT({
			title: "New project", 
			label: "Give it a name: ", 
			value: "my-project", 
		}).then((_name)=>{
			if (_name != null) {
				new File(null, new GameProperties());
				File.instance.gameProperties.settings.projectName = _name;
				// Default settings
				let firstScene = Scene.AddScene("new scene");
				let bg = SceneObject.AddEmptyObject("backdrop", firstScene, false);
				firstScene.SetAsStartScene();
				firstScene.SelectOn();
				Sound.NewSound("correct", "./Assets/sound/correct.mp3");
				Sound.NewSound("wrong", "./Assets/sound/wrong.wav");
				Sound.NewSound("lock", "./Assets/sound/lock.wav");
				Sound.NewSound("unlock", "./Assets/sound/unlock.wav");
				Sound.NewSound("put", "./Assets/sound/put.wav");
				Sound.NewSound("win", "./Assets/sound/win.wav");
				Sound.NewSound("door", "./Assets/sound/door.wav");
				Sound.NewSound("meow_1", "./Assets/sound/meow_happy.wav");
				Sound.NewSound("meow_2", "./Assets/sound/meow_unhappy.wav");
							
				Event.Broadcast("reload-project");
				if (typeof callback == "function"){
					callback(_name);
				}
			}
		});
	}
	if (File.instance != null){ // have opened proj
		File.CloseProject(()=>{newEmpty();});
	} else {
		newEmpty();
	}
};

File.NewProject = function(callback){ // TODO: load from template
	let func = function(){
		PROMPT({
			title: "New project", 
			label: "Give it a name: ", 
			value: "my-project", 
		}).then((_name)=>{
			if (_name != null) {
				new File(null, new GameProperties());
				File.instance.gameProperties.settings.projectName = _name;
				// Default settings
				let firstScene = Scene.AddScene("default scene");
				let bg = SceneObject.AddEmptyObject("backdrop", firstScene, false);
				firstScene.SetAsStartScene();
				firstScene.SelectOn();
				Sound.NewSound("correct", "./Assets/sound/correct.mp3");
				Sound.NewSound("wrong", "./Assets/sound/wrong.wav");
				Sound.NewSound("lock", "./Assets/sound/lock.wav");
				Sound.NewSound("unlock", "./Assets/sound/unlock.wav");
				Sound.NewSound("put", "./Assets/sound/put.wav");
				Sound.NewSound("win", "./Assets/sound/win.wav");
				Sound.NewSound("door", "./Assets/sound/door.wav");
				Sound.NewSound("meow_1", "./Assets/sound/meow_happy.wav");
				Sound.NewSound("meow_2", "./Assets/sound/meow_unhappy.wav");
				
				Event.Broadcast("reload-project");
				
				if (typeof callback == "function"){
					callback(_name);
				}
			}
		});
	}
	if (File.instance != null){ // have opened proj
		File.CloseProject(()=>{func();});
	} else{
		func();
	}
	
};

File.SaveProject = function(callback){
	if (File.instance == null){return;}
	if (File.instance.path == null){ // No path saved
		// Open file selector
		ELECTRON.dialog.showSaveDialog({
			title: 'Select folder',  
			defaultPath: File.instance.gameProperties.settings.projectName, 
			buttonLabel: 'Save', 
			filters: [{ name: 'AliceAdventureProject', extensions: [File.extension] }]
		}, (_path)=>{ // callback
			if (_path == null) return;
			File.SaveToPath(_path);
			if (typeof callback == "function"){
				callback(_path);
			}
		});
	} else { // Has path saved
		File.SaveToPath(File.instance.path);
		if (typeof callback == "function"){
			callback(File.instance.path);
		}
	}
};

File.SaveAsNewProject = function(callback){
	if (File.instance == null){return;}
	// open file selecter
	ELECTRON.dialog.showSaveDialog({
		title: 'Select folder',  
		defaultPath: File.instance.gameProperties.settings.projectName, 
		buttonLabel: 'Save', 
		filters: [{name: 'AliceAdventureProject', extensions: [File.extension]}], 
		properties: ['openFile', 'createDirectory']
	}, (_path)=>{ // callback
		if (_path == null) return;
		File.SaveToPath(_path);
		if (typeof callback == "function"){
			callback(_path);
		}
	});
}

File.OpenProject = function(callback){
	let func = function(){
		// Open file selector
		ELECTRON.dialog.showOpenDialog({
			title: 'Select project',  
			defaultPath: '', 
			buttonLabel: 'Select', 
			filters: [{name: 'AliceAdventureProject', extensions: [File.extension]}], 
			properties: ['openFile']
		}, (_paths)=>{ // callback
			if (_paths == null) return;
			File.OpenFromPath(_paths[0]);
			if (typeof callback == "function"){
				callback(_paths[0]);
			}
		});	
	}
	if (File.instance != null){ // have opened proj
		File.CloseProject(()=>{func();});
	} else {
		func();
	}
};

File.CloseProject = function(callback){
	if (File.instance == null){
		return; // No project loaded
	}
	if (confirm("Are you sure to close this project? \nUnsaved changes may be lost. ")){ // test
		File.instance = null;
		GameProperties.instance = null;
		Event.Broadcast("reload-project");
		if (typeof callback == "function"){
			callback();
		}
	}
}

File.BuildProject = function(){
	if (File.instance == null) return;
	// check if project saved
	if (File.instance.path == null){ // no existing file
		if (confirm('Your project is unsaved. \nSave it first?')){
			File.SaveAsNewProject(()=>{
				File.Build(()=>{
					File.OpenBuildFolder();
				});
			});
		} else {
			return;
		}
	} else {
		File.SaveToPath(File.instance.path);
		File.Build(()=>{
			File.OpenBuildFolder();
		});
	}	
}

File.RunProject = function(){
	if (File.instance == null) return;
	// check if project saved
	if (File.instance.path == null){ // no existing file
		if (confirm('Your project is unsaved. \nSave it first?')){
			File.SaveAsNewProject(()=>{
				File.Build(()=>{
					File.Run();					
				});
			});
		} else {
			return;
		}
	} else {
		File.SaveToPath(File.instance.path);
		File.Build(()=>{
			File.Run();
		});
	}	
}

File.OpenBuildFolder = function(){
	var commandLine = "start " + PATH.join(PATH.dirname(File.instance.path), PATH.basename(File.instance.path, PATH.extname(File.instance.path)) + '-Build').replace(/\\/g, "\\\\");
	require('child_process').exec(commandLine);
}

File.ImportAssets = function(){
	ELECTRON.dialog.showOpenDialog({
		title: 'Import assets',  
		defaultPath: '', 
		buttonLabel: 'Import', 
		filters: [{name: 'Audio', extensions: ['mp3', 'wav']}, {name: 'Image', extensions: ['png', 'jpg', 'jpeg']}], 
		properties: ['openFile', 'multiSelections']
	}, (_paths)=>{ // callback
		if (_paths == null) return;
		_paths.forEach((path)=>{ 
			switch (path){
				case 'mp3':
				case 'wav':
					Sound.NewSound(PATH.basename(path, PATH.extname(path)), path);
					break;
				case 'png':
				case 'jpg':
				case 'jpeg':
					Image.ImportImage(path);
					break;
				default:
					break;
			}
		});
	});	
}

File.ImportSound = function(){ // test
	ELECTRON.dialog.showOpenDialog({
		title: 'Import sound',  
		defaultPath: '', 
		buttonLabel: 'Import', 
		filters: [{name: 'Audio', extensions: ['mp3', 'wav']}], 
		properties: ['openFile', 'multiSelections']
	}, (_paths)=>{ // callback
		if (_paths == null) return;
		_paths.forEach((path)=>{ 
			Sound.NewSound(PATH.basename(path, PATH.extname(path)), path);
		});
	});	
}

File.ImportImage = function(){ // test
	ELECTRON.dialog.showOpenDialog({
		title: 'Import image',  
		defaultPath: '', 
		buttonLabel: 'Import', 
		filters: [{name: 'Image', extensions: ['png', 'jpg', 'jpeg']}], 
		properties: ['openFile', 'multiSelections']
	}, (_paths)=>{ // callback
		if (_paths == null) return;
		_paths.forEach((path)=>{ 
			Image.ImportImage(path);
		});
	});	
}

File.SaveToPath = function(_path){
	console.log("Save to " + _path);
	File.instance.path = _path;
	File.tempJsonObj.reset();

	// sceneList
	GameProperties.instance.sceneList.forEach((scene)=>{
		File.tempJsonObj.sceneList.push(scene.toJsonObject());
	});

	// objectList
	GameProperties.instance.objectList.forEach((obj)=>{
		File.tempJsonObj.objectList.push(obj.toJsonObject());
	});

    // interationList
    GameProperties.instance.interactionList.forEach(function(interaction) {
        File.tempJsonObj.interactionList.push(interaction.toJsonObject());
    });
    
    // stateList
    GameProperties.instance.stateList.forEach(function(state) {
        File.tempJsonObj.stateList.push(state.toJsonObject());
    });
    
    // soundList
    GameProperties.instance.soundList.forEach(function(sound){
    	File.tempJsonObj.soundList.push(sound.toJsonObject());
    });

    // imageList
    GameProperties.instance.imageList.forEach(function(image){
    	File.tempJsonObj.imageList.push(image.toJsonObject());
    });
    
	// settings
	File.tempJsonObj.settings = GameProperties.instance.settings;

	// projData
	File.tempJsonObj.projectData.idCounter = ID._counter;
	File.tempJsonObj.projectData.viewWidth = GameProperties.instance.projectData.viewWidth;
	File.tempJsonObj.projectData.viewHeight = GameProperties.instance.projectData.viewHeight;
    
	// Write JSON file
	FS.writeJsonSync(File.instance.path, File.tempJsonObj, {spaces:'\t', EOL:'\n'});

	// Ensure has Assets folder
	//FS.ensureDir(PATH.dirname(File.instance.path) + '/Assets/');
}

File.OpenFromPath = function(_path){

	// Load JSON file
	if (typeof _path != "string") {
		Debug.LogError("Path is not string: ");
		Debug.Log(_path);
		return;
	}
	new File(_path, new GameProperties());
	let data = FS.readJsonSync(_path); 

	if (data == null){
		Debug.LogError("File doesn't exist");
		return;
	}

	// SceneList
	if (data.sceneList != null){
	    data.sceneList.forEach((scene)=>{
	        Scene.LoadScene(scene);
	    });
	}

	// ObjectList
	if (data.objectList != null){
	    data.objectList.forEach((object)=>{
	        SceneObject.LoadObject(object);
	    });
	}
    
    //stateList
    if (data.stateList != null){
	    data.stateList.forEach((state)=>{
	        State.LoadState(state);
	    });
	}
	    
    // Sound
    if (data.soundList != null){
	    data.soundList.forEach((sound)=>{
	    	Sound.LoadSound(sound);
	    });   
	} 
	    
    // Image
    if (data.imageList != null){
	    data.imageList.forEach((image)=>{
	    	Image.LoadImage(image);
	    });   
	} 
    
    //Interaction
    if (data.interactionList != null){
	    data.interactionList.forEach((interaction)=>{
	        Interaction.LoadInteraction(interaction);
	    });
    }

	// Settings
	File.instance.gameProperties.settings.resWidth = data.settings.resWidth; 
	File.instance.gameProperties.settings.resHeight = data.settings.resHeight; 
	File.instance.gameProperties.settings.inventoryGridNum = data.settings.inventoryGridNum;
	File.instance.gameProperties.settings.startScene = data.settings.startScene; 
	File.instance.gameProperties.settings.projectName = data.settings.projectName;

	// ProjData
	ID.setCounter(data.projectData.idCounter);

	// Init operation
	GameProperties.GetSceneById(GameProperties.instance.settings.startScene).SelectOn();

	Event.Broadcast("reload-project");
}

File.Build = function(successCallback){
	var compiler = new Compiler(File.instance.path, (_err)=>{Debug.LogError(_err);});
	if (compiler.build((_err)=>{Debug.LogError(_err);})){ // success
		Debug.Log("Build succeeded");
		if (typeof successCallback == "function") successCallback();
	} else { // fail
		Debug.Log("Build failed with error");
	}
}

File.Run = function(){
	Event.Broadcast('run-in-editor', PATH.join(PATH.dirname(File.instance.path), PATH.basename(File.instance.path, PATH.extname(File.instance.path)) + '-Build/index.html'));
}
module.exports = File;