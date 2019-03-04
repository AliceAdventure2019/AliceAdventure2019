/*global require*/
//sychronous fs+JSON.parser version

'use strict';

const fs = require('fs-extra');
const FileSys = require('./FileSys.js');
var ITree = require('./BinaryTree.js');

var Parser;
Parser = function (jsonPath, buildPath){

	this.build = buildPath;
	this.game = fs.readJsonSync(jsonPath);



	this.assetPath = FileSys.merge(this.build, 'Resources/Assets');
	this.sceneList = this.game.sceneList;
	this.objectList = this.game.objectList;
	this.settings = this.game.settings;
	this.interactionList=this.game.interactionList;
	this.stateList = this.game.stateList;
	this.soundList = this.game.soundList;
	this.scalarX = this.settings.resWidth / this.game.projectData.viewWidth;
	this.scalarY = this.settings.resHeight / this.game.projectData.viewHeight;
	this.iTree = new ITree();

}

//public:
//====================================================================================
	Parser.prototype.translate = function (callback){


		if (this.settings.startScene < 0 ||this.settings.resWidth < 100 || this.settings.resHeight < 100){
			callback("Settings ERROR: start scene must be larger or equal to 0");
			return false;
		}

		if (this.settings.inventoryGridNum < 5 ){
			callback("the number of grim in inventory must be larger or equal to 5");
			return false;
		}

		var toReturn= '\n';
		var sound = createSoundList.call(this, callback);

		if (sound === false) return false;

		toReturn += "//===============create Game==================\n" + createGame.call(this);
		toReturn += "\n//===============add Sound==================\n" + sound;
		toReturn += "\n//===============create Scene================\n" + createScene.call(this);
		toReturn += "\n//===============create States================\n" + createStates.call(this) +"var reaction = myGame.reactionSystem;\n";;

		toReturn += "\n//===============create Objects==================\n";
		var mustHave = translateObjects.call(this,callback);
		if (mustHave=== false) {

			return false;
		}
		else toReturn += mustHave;

		toReturn += "\n//================interaction=====================\n";
		var interaction = interactionListParser.call(this, callback);
		if (interaction === false) return false;
		else toReturn += interaction;

		var startScene = findSceneByID.call(this, this.settings.startScene);
		if (startScene === false) {
			// callback("Compiler ERROR: cannot find the scene stated as the start scene.");
			// return false;
			toReturn += 'myGame.start(' +  0 + ');'
		}else {
			toReturn += 'myGame.start(' +  startScene + ');'
		}
		return toReturn;
	}

	Parser.prototype.writeHTML = function(){
		var dest = FileSys.merge(this.build, 'index.html');
		var string = '<!doctype html>\n<head>\n <meta charset="utf-8">\n' 
					+'<title>' + this.settings.projectName + '</title> \n</head>\n' + 
					' <body><script src="Resources/pixi/pixi.js"></script>\n<script src="Resources/pixi/pixi-sound.js"></script>\n<script src="Resources/aliceAPI.js"></script>\n<script src="game.js">\n</script>\n</body>'
		FileSys.writeFile(dest, string);
	}


//private:
//=================setting up the basic game properties==============================
	function createGame(){
		return 'myGame.init(' + this.settings.resWidth + ',' 
																+ this.settings.resHeight + ',' 
																+ this.settings.inventoryGridNum + ');\n';
	}

	function createScene(){
		return 'myGame.sceneManager.createScenes(' +this.sceneList.length + ');\n';
	}

	//the returned structure is {name_id : value} 
	function createStates() {
		var toReturn = 'myGame.initStateManager({'
		for (let i = 0; i <this.stateList.length; i++){
			toReturn += this.stateList[i].name.replace(/\W/g, "") + '_' + this.stateList[i].id + ' : ' + this.stateList[i].value;
			
			if (i < this.stateList.length - 1){
				toReturn += ", ";
			}
		}
		return toReturn + '});\n';
	}


	function createSoundList(callback){
		var toReturn = '';
		
		if (this.soundList.length == 0) return toReturn;

		for (let i = 0; i < this.soundList.length; i++){
			var sound = this.soundList[i];

			if (sound.hasOwnProperty("id") && sound.hasOwnProperty("name") && sound.hasOwnProperty("src")){

				if (fs.pathExistsSync(sound.src)&& FileSys.filename(sound.src).match(/\.(wav|mp3)$/)){

						var dest = FileSys.merge(this.assetPath, FileSys.filename(sound.src));
						dest= dest.replace(/\\/g, "/");
						FileSys.copyFileOrFolder(sound.src, dest);

					toReturn += addSound(sound.name, sound.id, "./Resources/Assets/" + FileSys.filename(sound.src));


				}else{
					callback("Compiler ERROR: sound {id = " +sound.id + ", name = " + sound.name + "} has INVALID source: \n" + sound.src + "\nEither the path is not correct or the file format is not WAV/MP4.");
					return false;
				}

			}else{
				callback("ERROR: The soundList structure is not complete. It needs id, name , and a valid src path.");
				return  false;
			}

		}

		return toReturn;
	}

	function addSound(name, id, src){
		return "myGame.soundManager.load('" + name+'_'+id +"', '" + src+"');\n";
	}
	
	//if the scene is found, return the SCENE INDEX!!!!.
	//Otherwise, return false;
	function findSceneByID (id){
		for (let i =0; i < this.sceneList.length; i++){
	
			if (this.sceneList[i].id == id){

				return i;
			}
		}

		return false;
	}

	//**************************Object Properties************************************
	//Must Have:
	// src, anchor, scale, interactive, buttonMode, pos, name, sceneParent, ID

	//*********obj is the (name + id) of the object in the json file********
	//src must be a valid path to a image file.

	function addObjectToScene(objName, sceneIndex){
		return 'myGame.scene(' + sceneIndex +  ').addChild(' + objName + ');\n';
	}

	function createPIXIObject(obj, src){
		return 'var '+ obj + '= Alice.Object.fromImage(\''+src + '\');\n';
	}

	function setName (obj, nameID){
		return obj + '.name = \'' + nameID+ '\';\n';
	}

	function setAnchor(obj, anchor){
		return obj + '.anchor.set('+anchor.x+', ' + anchor.y+');\n';
	}

	function setScale(obj, scale){
		return obj + '.scale.set(' + scale.x * this.scalarX + ', ' + scale.y * this.scalarY + ');\n';
	}

	//interactive or buttonMode should be boolean
	function setClickable(obj, clickable){
		if (clickable) return "reaction.makeClickable( " + obj + " );\n";
		else return "reaction.makeUnClickable( " +obj + " );\n";
	}
	function setDraggable(obj, draggable){
		if (draggable) return "reaction.makeDraggable( " + obj + " );\n";
		else return "reaction.makeUnDraggable( " +obj + " );\n";
	}

	function getNameWithID(obj, id){
		var name = obj.replace(/\W/g, "");
		return '_' + name + '_' +  id;
	}

	function setPos(obj, pos){
		return obj+'.x = ' + pos.x * this.scalarX + ';\n' + obj+'.y = ' + pos.y * this.scalarY+';\n';
	}

	function setActive(obj, active){
		return obj + '.visible = ' + active + ';\n';
	}

	//return true if the name of the self defined properties 
	// same as src, anchor, scale, interactive, buttonMode, pos, name, sceneParent, ID
	function sameNameAsMustHave(key){
		return key =='src' || key == 'anchor' || key == 'scale' || key=='interactive' ||key =='buttonMode'
			|| key =='pos' || key == 'name' || key =='sceneParent' || key == 'id'|| key =='active';
	}


	function translateObj_properties(object, callback){
		
		var ERROR;
		var toReturn = '';
		
		// src, anchor, scale, interactive, buttonMode, pos, name, sceneParent, ID
		if (object.hasOwnProperty("name")&& object.hasOwnProperty("id")){

			// if (typeof (object.name) === "number"){
			// 	ERROR = "ERROR: Name of the object:  " + object.name + " cannot be numbers. Must have letters.";
			// 	callback(ERROR);
			// 	return false;
			// }else{

				var name = getNameWithID(object.name, object.id);
				
				//src
				//check if the path is valid, then copy the picture to the build folder
				if (object.hasOwnProperty("src")){

					var src = object.src;
					if (src.charAt(0) == ".") {src = object.src.slice(4); }

					
					if (fs.pathExistsSync(src)&& FileSys.filename(src).match(/\.(jpg|jpeg|png)$/) )
					{	
						var dest = FileSys.merge(this.assetPath, FileSys.filename(src));
						dest= dest.replace(/\\/g, "/");
						FileSys.copyFileOrFolder(src, dest);
						toReturn += createPIXIObject(name,"./Resources/Assets/" + FileSys.filename(src));
						toReturn += setName(name,name);

					}else{
						ERROR = "ERROR: Object: " + object.name + " File path does not exist or the file extention does not match jpg/jpeg/png.\n **********Invalid Path: " + FileSys.getAbs(object.src) + '\n';
						callback(ERROR);	
						return false;				
					}
				}
				else{
					ERROR = "ERROR: Object " + object.name + " does not have a sprite.";
					callback(ERROR);
					return false;
				}//end src

				//anchor
				if(object.hasOwnProperty("anchor")){

					if (object.anchor.hasOwnProperty("x") && !isNaN(object.anchor.x) && typeof (object.anchor.x) === "number"
						&& object.anchor.hasOwnProperty('y') && !isNaN(object.anchor.y) && typeof (object.anchor.y) === "number"){

						toReturn += setAnchor(name, object.anchor);
					}else{
						ERROR =  "Object " + object.name + ": x and y of anchor must be defined as numbers.";
						callback(ERROR);
						return false;
					}
				}else{
					ERROR="Object " + object.name + " has not set the anchor.";
					callback(ERROR);
					return false;
				}//end anchor

				//pos
				if (object.hasOwnProperty("pos")){

					if (object.pos.hasOwnProperty('x') && !isNaN(object.pos.x) && typeof object.pos.x === "number"
						&& object.pos.hasOwnProperty('y') && !isNaN(object.pos.y) && typeof object.pos.y === "number"){

							toReturn += setPos.call(this, name, object.pos);
					}else{
						ERROR = "ERROR: x and y of the position must be defined as numbers.";
						callback(ERROR);
						return false;
					}
				}else{
					ERROR = "ERROR: Object has not set the position.";
					callback(ERROR);
					return false;
				}//end pos

				//scale
				if (object.hasOwnProperty("scale")){

					if (object.scale.hasOwnProperty('x') && !isNaN(object.scale.x) &&  typeof (object.scale.x) === "number"
						&& object.scale.hasOwnProperty('y') && !isNaN(object.scale.y) && typeof object.scale.y === "number"){

							toReturn += setScale.call(this,name, object.scale);
					}else{
						ERROR = "ERROR: x and y of the scale must be defined as numbers.";
						callback(ERROR);
						return false;
					}
				}else{
					ERROR = "ERROR: Object has not set the scale.";
					callback(ERROR);
					return false;
				}

				//clickable
				if (object.hasOwnProperty("clickable")){

					if (typeof object.clickable === 'boolean'){

						toReturn += setClickable(name, object.clickable);
					}else{
						ERROR = "ERROR: The clickable value of the object must be a boolean.";
						callback(ERROR);
						return false;
					}
				}else{
					ERROR = "ERROR: Object has not set the interativity.";
					callback(ERROR);
					return false;
				}//end clickable

				//draggable
				if (object.hasOwnProperty("draggable")){

					if (typeof object.draggable === 'boolean'){

						toReturn += setDraggable(name, object.draggable);
					}else{
						ERROR = "ERROR: The draggable value of the object must be a boolean.";
						callback(ERROR);
						return false;
					}
				}else{
					ERROR = "ERROR: Object has not set the [draggable] .";
					callback(ERROR);
					return false;
				}//end clickable


				//active
				if(object.hasOwnProperty("active")){
					if(typeof object.active === 'boolean'){
						toReturn+= setActive(name, object.active);
					}else{
						ERROR = "ERROR: The active value of the object must be a boolean.";
						callback(ERROR);
						return false;
					}
				}else{
					ERROR = "ERROR: object has not set the active value.";
					callback(ERROR);
					return false;
				}//end active

				//bindscene
				if (object.hasOwnProperty("bindScene")){

					var sceneIndex =findSceneByID.call(this,object.bindScene);
					
					if (sceneIndex === false){
						//callback("ERROR: cannot find scene id = " + object.bindScene  + ".");
						//return false;
					}else{
						toReturn+= addObjectToScene(name, sceneIndex);
					}
				}else{
					ERROR = "ERROR: Object must be added to a scene.";
					callback(ERROR);
					return false;
				}


			//}//end name

		}else{
			ERROR = "ERROR: Object must have a name !!"
			callback(ERROR);
			return false;
		}

		return toReturn;
	}

	//iterate through the objectList
	function translateObjects(callback){

		var toReturn = '\n';	
		var arrayLength = this.objectList.length;

		for (let i = 0; i < arrayLength; i++){
			
			var result = translateObj_properties.call(this, this.objectList[i], callback);
			
			if (result === false){
				return false;
			}else{
				toReturn += result  + '\n';
			}
			
		}
		return toReturn;
	}


//=====================Parse Interaction ===================================
	function translateInteractions(callback){
		var toReturn='\n';
		var arrayLength = this.interactionList.length;

		for(let i = 0; i< arrayLength;i++){
			var result = interactionParser.call(this, this.interactionList[i], callback)+ '\n';

			if (result === false){
				return false;
			}else{
				toReturn+= result;
			}
		}

		return toReturn;
	}

	//----------------------INTERACTION-------------------------------
	// interaction json format:
	// @param id:               the global counter
	// @param event:        	{type specifier, args[]}
	// @param conditionList:    a list of {stateID, val}
	// @param reactionList:     a list of reaction which is defineMiao Rend below

	//----------------------EVENT----------------------------------------
	// @param type：			type specifier
	// @param arg:  		different for each type

	// type     name          args_num        template
	//-----------------------------------------------------------
	// 0       Click on A        1           # is clicked on
	// 1       Use A on B        2           # is used on #
	// 2(preserved)Observe A     1           # is observed
	// 3     Combine A with B    2           # is combined with # 
	// 4     State A -> B        2           when state A is changed to B 
	// 5     Scene -> #          1           when scene transit to #
	//------------------------------------------------------------

	//--------------------CONDITION-------------------------------
	//@param id: 		stateID
	//@param value: 	right-handside of the equation

	//----------------------REACTION-------------------------------
	// @param type:         type specifier 
	// @param args:        different for each type

	// type      name             input                template
	//-----------------------------------------------------------------------------------
	//   0     set state        [stateID, bool]       change (state of this ID) to (bool)
	//   1   transit to scene   [sceneID]             transite to scene of this ID
	//   2   put into inventory [objID]               put object of this ID INTO inventory
	//   3   remove outof inv   [objID]               remove object of this ID OUT OF inventory
	//   4   make visible       [objID]               make object visible
	//   5   make invisible     [objID]               make object invisible
	//   6   make interactive   [objID]               make object of this ID interactive
	//   7   make UNinteractive [objID]               make object of this ID UNinteractive
	//   8   show message box   [string]              show message box 
	//   9   play music         [soundID, bool]       play music of this ID
	//  10   show inventory     []                    show inventory
	//  11   hide inventory     []                    show inventory
	//	12   moveObjToScene		[obj, sceneIndex, x, y] move object # to scene # at (x, y)
	//  13	 setObjLocation		[obj, x, y]			  move object # to (x, y)
	//  14   stop music         [soundID]
	function interactionListParser(callback){

		var toReturn = "";
		if (this.interactionList.length == 0) return toReturn;

		for (let i = 0; i < this.interactionList.length; i++){
			//add everyting to the tree
			var result = interactionParser.call(this, this.interactionList[i], callback);

			if (result === false) return false;
		}

		toReturn += this.iTree.getEverything();

		return toReturn + "\n";

	}

	function interactionParser(interaction, callback){
		var event= "";
		var conditions = "";
		var reactions = "";
		var indent = 0;
		var title = "";

		if (interaction.hasOwnProperty("title") && interaction.hasOwnProperty("event") && interaction.hasOwnProperty("conditionList") && interaction.hasOwnProperty("reactionList")){

			var hasCondition = (interaction.conditionList.length > 0);
			title = interaction.title;

			var eventList = eventParser.call(this, title, interaction.event, callback);
			if (eventList === false) return false;

			
			if (hasCondition){
				indent++;
				conditions  = conditionListParser.call(this, title, interaction.conditionList, callback);
				if (conditions === false ) return false;
			}



			reactions = reactionListParser.call(this, title, interaction.reactionList, indent, callback);
			if (reactions === false) return false;

			if (hasCondition) reactions += "		return;\n	}//if statement end\n"; //if statementend


			this.iTree.putNode(eventList, interaction.event.type, interaction.event.args, conditions + reactions);
			
			return true;

		}else{
			callback("JSON Format ERROR: interaction must have: event, conditionList, reactionList, and title");
			return false;
		}
		// if (interaction.hasOwnProperty("eventList") && interaction.hasOwnProperty("conditionList") && interaction.hasOwnProperty("reactionList")){

		// 	var hasCondition = (interaction.conditionList.length > 0);

		// 	var eventList = eventListParser.call(this, interaction.eventList, callback);
		// 	if (eventList === false) return false;

			
		// 	if (hasCondition){
		// 		indent++;
		// 		conditions  = conditionListParser.call(this, interaction.conditionList, callback);
		// 		if (conditions === false ) return false;
		// 	}


		// 	reactions = reactionListParser.call(this, interaction.reactionList, indent, callback);
		// 	if (reactions === false) return false;

		// 	if (hasCondition) reactions += "		return;\n	}//if statement end\n"; //if statementend


		// 	//this.iTree.putNode(event, interaction.event.type, interaction.event.args, conditions + reactions);
		// 	this.eventListAddNode.call(this, eventList, conditions + reactions);
		// 	return true;

		// }else{
		// 	callback("JSON Format ERROR: interaction must have: event, conditionList, reactionList");
		// 	return false;
		// }

	}

	//eventList[event, type, args]
	function eventListAddNode(eventList, conditionAndReactions){
		for(let i = 0; i < eventList.length; i += 3){
			this.iTree.putNode(eventList[i], eventList[i + 1], eventList[i + 2], conditionAndReactions);
		}
	}
//-------------------------CONDITION----------------------------------------

	function conditionListParser(title, conditionList, callback){
		var toReturn = "	if (";
		for (let i = 0; i < conditionList.length; i++){

			if (conditionList[i].id == null){
				callback("ERROR:  for condition of Interaction Box: " + title + ", you cannot add a condition without filling the pamameters")
				return false;
			}

			var state = findStateByID.call(this,conditionList[i].id);
			var value = conditionList[i].value;

			if (state === false){
				callback("ERROR: for condition of Interaction Box: " + title + ", cannot find state of id : " + conditionList[i].id);
				return false;
			}
			else if (value == null){
				callback("ERROR:  for condition of Interaction Box: " + title + ", you cannot add a condition without filling the pamameters")
				return false;

			}else{
				if (i == conditionList.length -1){
					toReturn += "(myGame.stateManager.states." + state + "==" + value + ")){\n";
				}
				else{
					toReturn += "(myGame.stateManager.states." + state + "==" + value + ") &&";
				}
			}
		}
		return toReturn;

	}


//-------------------------REACTION------------------------------------------
	function reactionListParser(title, reactionList, ind, callback){
		var toReturn = "";
		var indentCounter = 1 + ind;
		var messageBoxParenCounter = 0;
		for (let i = 0; i < reactionList.length; i++){
			var result = reactionParser.call(this, title, reactionList[i], callback);

			//if messageBox, all the following reaction is included in the call-back function.
			//console.log("reaction type is " + reactionList[i].type + "\n");
			if (reactionList[i].type == 8) {
				messageBoxParenCounter++;
				indentCounter++;
			}		

			if (result === false) return false;
			else if (reactionList[i].type == 8) toReturn += indent(indentCounter - 1, "") + result;
			else toReturn +=  indent(indentCounter, "") + result;
		}


		//message box back paren.
		//console.log("messageBoxParenCounter : " + messageBoxParenCounter + "\n");
		for (let j = 0; j < messageBoxParenCounter; j++){
			toReturn += indent( indentCounter,"") + "});//messageBox end\n";
			indentCounter--;
		}

		return toReturn;

	}

	function indent( indentCounter, string){
		if (indentCounter <= 0){
			return string;
		}else{
			return indent(indentCounter-1, string + "	");
		}

	}

	function reactionParser(title, reaction, callback){
		var type = reaction.type;
		var toReturn = "";

		switch(type){
			case 0:
				toReturn = translate_reactionType_0.call(this,title, reaction.args, callback);

				if (toReturn === false) return false;
				else return toReturn;
			case 1:
				toReturn = translate_reactionType_1.call(this,title, reaction.args, callback);

				if (toReturn === false) return false;
				else return toReturn;
			case 2:
				toReturn = translate_reactionType_2.call(this, title, reaction.args, callback);

				if (toReturn === false) return false;
				else return toReturn;
			case 3:
				toReturn = translate_reactionType_3.call(this, title, reaction.args, callback);

				if (toReturn === false) return false;
				else return toReturn;
			case 4:
				toReturn = translate_reactionType_4.call(this, title, reaction.args, callback);

				if (toReturn === false) return false;
				else return toReturn;
			case 5:
				toReturn = translate_reactionType_5.call(this, title, reaction.args, callback);

				if (toReturn === false) return false;
				else return toReturn;
			case 6:
				toReturn = translate_reactionType_6.call(this, title, reaction.args, callback);

				if (toReturn === false) return false;
				else return toReturn;
			case 7:
				toReturn = translate_reactionType_7.call(this, title, reaction.args, callback);

				if (toReturn === false) return false;
				else return toReturn;
			case 8:
				toReturn = translate_reactionType_8.call(this, title, reaction.args, callback);

				if (toReturn === false) return false;
				else return toReturn;

			case 9:
				toReturn = translate_reactionType_9.call(this, title, reaction.args, callback);

				if (toReturn === false) return false;
				else return toReturn;
			case 10:
				toReturn = translate_reactionType_10.call(this, title, reaction.args, callback);

				if (toReturn === false) return false;
				else return toReturn;
			case 11:
				toReturn = translate_reactionType_11.call(this, title, reaction.args, callback);

				if (toReturn === false) return false;
				else return toReturn;
			case 12:
				toReturn = translate_reactionType_12.call(this, title, reaction.args, callback);

				if (toReturn === false) return false;
				else return toReturn;
			case 13:
				toReturn = translate_reactionType_13.call(this, title, reaction.args, callback);

				if (toReturn === false) return false;
				else return toReturn;

			case 14:
				toReturn = translate_reactionType_14.call(this, title, reaction.args, callback);

				if (toReturn === false) return false;
				else return toReturn;			
			default:
				callback("WRONG REACTION TYPE");
				return false;
		}

	}
	//state changer
	function translate_reactionType_0( title, args, callback){
		if (args.length == 2){
			
			if (args[0] == null || args[1] == null){
				callback("ERROR: for reaction[Change state] of Interaction Box: " + title + ", you must fill the blank before run it. If you don't need this interaction box, please delete it.");
				return false;
			}
			var state = findStateByID.call(this, args[0]);

			if (state === false ){
				callback("ERROR: for reaction in Interaction Box: " + title + ", cannot find the specified state.");
				return false;

			}else if ( typeof (args[1]) !== "boolean"){

				callback("ERROR: for reaction in Interaction Box: " + title + ", the right-handside of the equation must be a boolean, not null.");
				return false;

			}else{
				return "reaction.setState('" + state + "', " + args[1] + ");\n";
			}

		}else{
			callback("JSON Format ERROR: reaction type 0 (set state [stateID, bool]) should have TWO arguments.");
			return false;
		}

	}

	//transit to scene
	function translate_reactionType_1( title, args, callback){
		if (args.length == 1){

			if (args[0] == null){
				callback("ERROR: for reaction[transit to scene] of Interaction Box: " + title + ", you must fill the blank before run it. If you don't need this interaction box, please delete it.");
				return false;
			}
			var sceneIndex = findSceneByID.call(this, args[0]);

			if (sceneIndex === false){
				callback("ERROR: for reaction in Interaction Box: " + title + ", cannot find scene of id for reaction type 1: " + args[0] + ".");
				return false;

			}else{
				return "reaction.transitToScene(" + sceneIndex +  ");\n";
			}

		}else{
			callback("JSON Format ERROR: reaction type 1 (scene transit) should have ONE argument.");
			return false;
		}
	}

	//put into Inventory
	function translate_reactionType_2(title, args, callback){
		if (args.length == 1){

			if (args[0] == null){
				callback("ERROR: for reaction[Put into inventory] of Interaction Box: " + title + ", you must fill the blank before run it. If you don't need this interaction box, please delete it.");
				return false;
			}
			var obj= findObjectByID.call(this, args[0]);

			if (obj === false){
				callback("ERROR: for reaction in Interaction Box: " + title + ", cannot find object of id: " + args[0] + ".");
				return false;

			}else{
				return "reaction.addToInventory(" + obj +  ");\n";
			}

		}else{
			callback("JSON Format ERROR: reaction type 2 (put into inventory) should have ONE argument.");
			return false;
		}
	}

	//remove out of inventory
	function translate_reactionType_3(title, args, callback){
		if (args.length == 1){
			if (args[0] == null){
				callback("ERROR: for reaction[Remove Object our of inventory] of Interaction Box: " + title + ", you must fill the blank before run it. If you don't need this interaction box, please delete it.");
				return false;
			}
			var obj= findObjectByID.call(this, args[0]);

			if (obj === false){
				callback("ERROR: for reaction in Interaction Box: " + title + ", cannot find object of id: " + args[0] + ".");
				return false;

			}else{
				return "reaction.removeObject(" + obj +  ");\n";
			}

		}else{
			callback("JSON Format ERROR: reaction type 3 (remvoe out of inventory) should have ONE argument.");
			return false;
		}

	}

	//make visible
	function translate_reactionType_4(title, args, callback){
		if (args.length == 1){

			if (args[0] == null){
				callback("ERROR: for reaction[Make visible] of Interaction Box: " + title + ", you must fill the blank before run it. If you don't need this interaction box, please delete it.");
				return false;
			}
			var obj= findObjectByID.call(this, args[0]);

			if (obj === false){
				callback("ERROR: for reaction in Interaction Box: " + title + ", cannot find object of id: " + args[0] + ".");
				return false;

			}else{
				return "reaction.makeObjVisible(" + obj + ");\n";
			}

		}else{

			callback("JSON Format ERROR: reaction type 4 (make A visible) should have ONE argument.");
			return false;
		}
	}

	//make invisible
	function translate_reactionType_5(title, args, callback){
		if (args.length == 1){

			if (args[0] == null){
				callback("ERROR: for reaction[Make invisible] of Interaction Box: " + title + ", you must fill the blank before run it. If you don't need this interaction box, please delete it.");
				return false;
			}
			var obj= findObjectByID.call(this, args[0]);

			if (obj === false){
				callback("ERROR: for reaction in Interaction Box: " + title + ", cannot find object of id: " + args[0] + ".");
				return false;

			}else{
				return "reaction.makeObjInvisible(" + obj + ");\n";
			}

		}else{
			callback("JSON Format ERROR: reaction type 5 (make A invisible) should have ONE argument.");
			return false;
		}
	}

	//make interactive
	function translate_reactionType_6(title,  args, callback){
		if (args.length == 1){
			if (args[0] == null){
				callback("ERROR: for reaction[Make Interactive] of Interaction Box: " + title + ", you must fill the blank before run it. If you don't need this interaction box, please delete it.");
				return false;
			}
			var obj= findObjectByID.call(this, args[0]);

			if (obj === false){
				callback("ERROR: for reaction in Interaction Box: " + title + ", cannot find object of id: " + args[0] + ".");
				return false;

			}else{
				return "reaction.makeInteractive(" + obj + ");\n";
			}

		}else{
			callback("JSON Format ERROR: reaction type 6 (make A interactive) should have ONE argument.");
			return false;
		}

	}
	//make UNinteractive
	function translate_reactionType_7( title, args, callback){
		if (args.length == 1){

			if (args[0] == null){
				callback("ERROR: for reaction[Make Uninteractive] of Interaction Box: " + title + ", you must fill the blank before run it. If you don't need this interaction box, please delete it.");
				return false;
			}
			var obj= findObjectByID.call(this, args[0]);

			if (obj === false){
				callback("ERROR: for reaction in Interaction Box: " + title + ", cannot find object of id: " + args[0] + ".");
				return false;

			}else{
				return "reaction.makeNonInteractive(" + obj + ");\n";
			}

		}else{
			callback("JSON Format ERROR: reaction type 7 (make A UNinteractive) should have ONE argument.");
			return false;
		}

	}

		//show message box
	function translate_reactionType_8(title,  args, callback){
		if (args.length == 1){
	
			return "myGame.messageBox.startConversation(['" + args[0].replace(/\\/g,"/").replace(/"|'/g, "\"") + "'], function(){\n";

		}else{
			callback("JSON Format ERROR: reaction type 9 (show messageBox) should have ONE argument.");
			return false;
		}
	}

	//play sound
	function translate_reactionType_9(title,  args, callback){
		if (args.length == 2){
			
			if (args[0] == null || args[1] == null){
				callback("ERROR: for reaction[Play Sound] of Interaction Box: " + title + ", you must fill the blank before run it. If you don't need this interaction box, please delete it.");
				return false;
			}

			var sound = findSoundByID.call(this, args[0]);

			if (sound === false){
				callback("ERROR: In interaction box: " + title + ", one REACTION cannot find sound requested: " + args[0] + ".");
				return false;

			}else{
				if (typeof (args[1]) == "boolean"){
					return "reaction.playAudio(\'" + sound + "\', " + args[1] + ");\n";
				}else{
					callback("ERROR: In reaction[Play Sound] of Interaction Box: " + title + ", you must set whether to loop over this audio: " + sound + ".");
					return false;
				}
			}

		}else{
			callback("JSON Format ERROR: reaction type 8 (play sound) should have ONE argument.");
			return false;
		}

	}

	function translate_reactionType_10(title, args, callback){
		if (args.length == 0){
	
			return "reaction.showInventory();\n";

		}else{
			callback("JSON Format ERROR: reaction type 10 (show inventory) should have ZERO argument.");
			return false;
		}
	}

	function translate_reactionType_11(title, args, callback){
		if (args.length == 0){
	
			return "reaction.hideInventory();\n";

		}else{
			callback("JSON Format ERROR: reaction type 11 (hide inventory) should have ZERO argument.");
			return false;
		}
	}

	//move obj to scene # at location (x, y)
	function translate_reactionType_12(title, args, callback){
		if (args.length == 2 ){

			if (args[0] == null || args[1] == null){
				callback("ERROR: for reaction[Move Object to Scene] of Interaction Box: " + title + ", you must fill the blank before run it. If you don't need this interaction box, please delete it.");
				return false;
			}

			var obj = findObjectByID.call(this, args[0]);
			if (obj === false){
				callback("ERROR: for reaction in Interaction Box: " + title + ", cannot find object of id: " + args[0]);
				return false;
			}

			var sceneIndex = findSceneByID.call(this, args[1]);
			if (sceneIndex === false) {
				callback("ERROR: for reaction in Interaction Box: " + title + ", cannot find scene of id: " + args[1]);
				return false;
			}

			return "reaction.moveObjectToScene(" +obj + ", " + sceneIndex + ");\n";
			

		}else{
			callback("JSON Format ERROR: reaction type 12(moveObjToScene) should have 2 arguments(obj, sceneIndex).");
			return false;
		}
	}

	function translate_reactionType_13(title, args, callback){
		if (args.length == 3){

			if (args[0] == null || args[1] == null || args[2] == null){
				callback("ERROR: for reaction[Set Location] of Interaction Box: " + title + ", you must fill the blank before run it. If you don't need this interaction box, please delete it.");
				return false;
			}

			var obj = findObjectByID.call(this, args[0]);
			if (obj === false){
				callback("ERROR: cannot find object specified in the reaction of Interaction Box: " + title + "." );
				return false;
			}

			var x = 0; var y = 0;
			if (!isNaN(args[1]) && typeof (args[1]) === "number"){
				x = args[1] * this.scalarX;
			}
			if (!isNaN(args[2]) && typeof (args[2]) === "number"){
				y =  args[2] * this.scalarY;
			}
			return "reaction.setObjectLocation(" + obj + ", " + x + ", " + y +");\n";

		}else{
			callback("JSON Format ERROR: reaction type 13(setObjLocation) must have 3 arguments(obj, x, y)");
		}
	}

	//stop audio
	function translate_reactionType_14(title,  args, callback){
		if (args.length == 1){

			if (args[0] == null){
				callback("ERROR: for reaction[Stop Audio] of Interaction Box: " + title + ", you must fill the blank before run it. If you don't need this interaction box, please delete it.");
				return false;
			}

			var sound = findSoundByID.call(this, args[0]);

			if (sound === false){
				callback("ERROR: In interaction box: " + title + ", one REACTION cannot find sound requested: " + args[0] + ".");
				return false;

			}else{
				
				return "reaction.stopAudio(\'" + sound + "\');\n";
				
			}

		}else{
			callback("JSON Format ERROR: reaction type 14 (stop sound) of (title: " + title + " ) should have ONE argument.");
			return false;
		}

	}


//-------------------------EVENT----------------------------------------------
	function eventListParser(eventList, callback){

		if(eventList.length == 0){
			callback("ERROR: for an interaction, it MUST have one or more events.");
			return false;
		}

		//[eventstring, type, args]
		var toReturn = [];
		for (let i = 0; i < eventList.length; i++){
			var event = eventParser.call(this, eventList[i], callback);

			if (event === false) return false;

			toReturn.push(event);
			toReturn.push(eventList[i].type);
			toReturn.push(eventList[i].args);
		}

		return toReturn; 
	}

	function eventParser(title, event, callback){

		if(event == null){
			callback("ERROR: Interaction Box: " + title + ", must have one event to compile. If you don't need this interaction box, please delete it.")
			return false;
		}

		if (event.hasOwnProperty("type") && event.hasOwnProperty("args")){
			var toReturn = "";
			var type = event.type;

			switch(type){
				case 0: 
					toReturn = translate_eventType_0.call(this, title, event.args, callback);

					if (toReturn === false) return false;
					else return toReturn;
				case 1:
					toReturn = translate_eventType_1.call(this, title, event.args, callback);

					if (toReturn === false) return false;
					else return toReturn;
				// case 2: 
				// 	toReturn = translate_eventType_2.call(this, event.args, callback);

				// 	if (toReturn === false) return false;
				//	else return toReturn;
				case 3:
					toReturn = translate_eventType_3.call(this, title, event.args, callback);

					if (toReturn === false) return false;
					else return toReturn;
				case 4:
					toReturn = translate_eventType_4.call(this, title, event.args, callback);

					if (toReturn === false) return false;
					else return toReturn;
				case 5:
					toReturn = translate_eventType_5.call(this, title, event.args, callback);

					if (toReturn === false) return false;
					else return toReturn;

				default:
					callback("Unsupported Event Type.");
					return false;

			}
		}else{
			callback("JSON Format ERROR: Event has includes two componets: type and args.");
			return false;
		}
	}

	//click on A
	function translate_eventType_0(title, args, callback){
		if (args.length == 1){
			if (args[0] == null){
				callback("ERROR: for event[Click on] of Interaction Box: " + title + ", you must fill the blank before run it. If you don't need this interaction box, please delete it.");
				return false;
			}
			var objName = findObjectByID.call(this, args[0]);

			if (objName === false){
				callback("ERROR: for event[Click on]  of Interaction Box: " + title + ", cannot find the object specified.") ;
				return false;
			}else{
				return "\n//--------------Click--------------\n" +  objName + ".DIY_CLICK = function(){\n";		
			}

		}else{
			callback("JSON Format ERROR: For event type 0 (click on A) must have ONLY one argument.");
			return false;
		}
	}

	//use A on B
	function translate_eventType_1(title, args, callback){
		if (args.length == 2){

			if (args[0] == null || args[1] == null){
				callback("ERROR: for event[Use A on B] of Interaction Box: " + title + ", you must fill the blank before run it. If you don't need this interaction box, please delete it.");
				return false;
			}

			var obj1 = findObjectByID.call(this, args[0]);
			var obj2 = findObjectByID.call(this, args[1]);

			if (obj1 != false && obj2 != false){
				return "\n//-------------USE--------------\nmyGame.eventSystem.addUsedEvent(" + obj1 + ", " + obj2 + ", function(){\n";

			}else{
				callback("ERROR: for event[Use A on B] of Interaction Box: " + title + ", cannot find object of id: " + obj1 + " or " + obj2 + ".");
				return false;
			}
		}else{
			callback("JSON Format ERROR: For event type 1 (Use A on B) must have TWO arguments.");
			return false;
		}
	}
		

	// function translate_eventType_2(args, callback){
	// 	if (args.length == 1){
	// 		var objID = args[0];
	// 		var objName = findObjectByID.call(this,objID);

	// 		if (objName === false){
	// 			callback("ERROR: Cannot find the object of ID: " + objID + ".") ;
	// 			return false;
	// 		}else{
	// 			return "\n//--------------Observe--------------\n" + objName + ".on('pointerdown', function(){\n";		
	// 		}

	// 	}else{
	// 		callback("JSON Format ERROR: For event type 2 (Observe A) must have ONLY one argument.");
	// 		return false;
	// 	}
	// }

	function translate_eventType_3(title, args, callback){
		if (args.length == 2){

			if (args[0] == null || args[1] == null){
				callback("ERROR: for event[Combine A and B] of Interaction Box: " + title + ", you must fill the blank before run it. If you don't need this interaction box, please delete it.");
				return false;
			}

			var obj1 = findObjectByID.call(this, args[0]);
			var obj2 = findObjectByID.call(this, args[1]);

			if (obj1 != false && obj2 != false){
				return "\n//-------------COMBINE--------------\nmyGame.eventSystem.addCombineEvent(" + obj1 + ", " + obj2 + ", function(){\n";

			}else{
				callback("ERROR: for event[Combine A and B] of Interaction Box: " + title + ", cannot find object of id: " + obj1 + " or " + obj2 + ".");
				return false;
			}

		}else{
			callback("JSON Format ERROR: For event type 3 (Combine A and B) must have TWO arguments.");
			return false;
		}
	}

	//when state A is changed to state B
	function translate_eventType_4(title, args, callback){
		if (args.length == 2){

			if (args[0] == null || args[1] == null){
				callback("ERROR: for event[When state A is changed to B] of Interaction Box: " + title + ", you must fill the blank before run it. If you don't need this interaction box, please delete it.");
				return false;
			}

			var state = findStateByID.call(this, args[0]);

			if (state === false ){
				callback("ERROR: for event[When state A is changed to B] of Interaction Box: " + title + ", cannot find state of id : " + args[0] + ".");
				return false;
			}else{
				return "\n//----------------When State A --> B----------------------\nmyGame.eventSystem.addStateEvent( '" + state + "', " + args[1] + ", function(){\n";
			}

		
		}else{
			callback("JSON Format ERROR: For event type 4 (when State A -> B) must have TWO arguments (id, bool).");
			return false;
		}
	}

	function translate_eventType_5(title, args, callback){
		if (args.length == 1){
			var sceneIndex = findSceneByID.call(this, args[0]);

			if (args[0] == null){
				callback("ERROR: for event[When scene transit to] of Interaction Box: " + title + ", you must fill the blank before run it. If you don't need this interaction box, please delete it.");
				return false;
			}

			if (sceneIndex === false){
				callback("ERROR: for event[When scene transit to] of Interaction Box: " + title + ",  cannot find scene id： " + args[0] +".");
				return false;
			}
			else{
				return "\n//-----------------When Scene transit to A------------------\nmyGame.eventSystem.addSceneTransitEvent( " + sceneIndex +", function(){\n";
			}
		}
		else{
			callback("JSON Format ERROR: For event type 5 (sceneTransitEvent) must have ONE argument.");
			return false;
		}
	}



	// return false if not found
	// return name_id if found
	function findObjectByID(ID){
		for (let i = 0; i < this.objectList.length; i++){
			if (this.objectList[i].id == ID){
				return getNameWithID(this.objectList[i].name, this.objectList[i].id);
			}
		}
		return false;
	}

	//return false if not found
	//return state_id if found
	function findStateByID(ID){
		for (let i = 0; i < this.stateList.length; i++){
			if (this.stateList[i].id == ID){
				return  this.stateList[i].name + '_' + this.stateList[i].id; 
			}
		}
		return false;
	}

	//return false if not found
	//return sound_id if found
	function findSoundByID(ID){
		for (let i = 0; i < this.soundList.length; i++){
			if (this.soundList[i].id == ID){
				return this.soundList[i].name + '_' + this.soundList[i].id; 
			}
		}
		return false;
	}


module.exports = Parser;