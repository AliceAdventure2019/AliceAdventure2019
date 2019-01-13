'use strict';

// class
var GameProperties;
GameProperties = function(){
	this.sceneList = [];
	this.objectList = [];
	this.interactionList = [];
	this.stateList = [];
    this.soundList = [];
    this.imageList = [];
	this.settings = {
		resWidth: 1280, 
		resHeight: 960, 
		inventoryGridNum: 5,
		startScene: -1,
		projectName: "untitled"
	};
	this.projectData = {
		idCounter: 0,
		viewWidth: 480, 
		viewHeight: 360
	};

	GameProperties.instance = this;
};

// singleton
GameProperties.instance = null;

// static functions

//function printID(array) {
//    var toPrint = [];
//    for(var i in array) {
//        toPrint.push(array[i].id)
//    }
//    console.log(toPrint)
//}
//
//function printName(array) {
//    var toPrint = [];
//    for(var i in array) {
//        toPrint.push(array[i].name)
//    }
//    console.log(toPrint)
//}


GameProperties.popSceneToTop = function(_scene) {
    var index = -1;
    for(var i = 0; i < GameProperties.instance.sceneList.length; i++) {
        var scene = GameProperties.instance.sceneList[i];
        if(scene.id == _scene.id) {
            index = i;
            break;
        }
    }
    
    GameProperties.instance.sceneList.splice(index, 1);
    GameProperties.instance.sceneList.splice(0, 0, _scene);
    
}

GameProperties.moveSceneAfterScene = function(_sceneA, _sceneB) {
    if(_sceneA.id == _sceneB.id) return;
    
    var indexA = -1;
    var indexB = -1;
    
    for(var i  = 0; i < GameProperties.instance.sceneList.length; i++) {
        var scene = GameProperties.instance.sceneList[i];
        if(scene.id == _sceneA.id) {
            indexA = i;
        }
        if(scene.id == _sceneB.id) {
            indexB = i;
        }
        if(indexA!=-1 && indexB!=-1)
            break;
    }

    if(indexA == indexB + 1) return;
    
    if(indexA < indexB) {
        GameProperties.instance.sceneList.splice(indexB + 1, 0, _sceneA);
        GameProperties.instance.sceneList.splice(indexA, 1);
    } else {
        GameProperties.instance.sceneList.splice(indexA, 1);
        GameProperties.instance.sceneList.splice(indexB + 1, 0, _sceneA);
    }

}

GameProperties.showObjNames = function(){
	if (GameProperties.instance == null) return;
	GameProperties.instance.objectList.forEach((obj)=>{
		console.log(obj.name);
	});
}

GameProperties.updateOrderByScene = function(_scene) {   
	if (!GameProperties.ProjectLoaded()) return;
	/*let origGood = true;
	let origTable = "";
    GameProperties.instance.objectList.forEach((obj, i)=>{
    	if (obj == null){
    		origGood = false;
    	} else {
    		origTable += "{" + i + ": " + obj.name + ", " + obj.bindScene.name + "}\n";
    	}
    });*/
    var objInScene = _scene.container.children;
    
    var original = [];
    var organized = [];
    for(var i in GameProperties.instance.objectList) {
        var objInList = GameProperties.instance.objectList[i];
        if(objInList.bindScene.id == _scene.id) { 
            for(var j in objInScene) {
                if(objInScene[j].id == objInList.id) {
                    organized[j] = objInList;
                }
            }
            original.push(objInList);
        }
    }

    var index = 0;
    for(var i in GameProperties.instance.objectList) {
        var objInList = GameProperties.instance.objectList[i];
        if(objInList.bindScene.id == _scene.id) {
            GameProperties.instance.objectList.splice(i,1,organized[index]);
            index++;
        }
    }
    /*let outputProblem = false;
    let problemTable = "";
    GameProperties.instance.objectList.forEach((obj, i)=>{
    	if (obj == null && origGood){
    		outputProblem = true;
    		problemTable += "{" + i + ": null}\n"
    	} else {
    		problemTable += "{" + i + ": " + obj.name + ", " + obj.bindScene.name + "}\n";
    	}
    });
    if (outputProblem){
    	console.log("before: \n" + origTable);
    	console.log(objInScene);
    	console.log(original);
    	console.log(organized);
    	console.log("after: \n" + problemTable);
    }*/    
}


GameProperties.ProjectLoaded = function(){
	return (GameProperties.instance != null);
};

GameProperties.SetViewSize = function(w, h){
	if (!GameProperties.ProjectLoaded()) return null;
	GameProperties.instance.projectData.viewWidth = w;
	GameProperties.instance.projectData.viewHeight = h;
};

GameProperties.GetSceneById = function(_id){
	if (!GameProperties.ProjectLoaded()) return null;
	if (_id == 0) return {id: 0, name: 'Inventory'};
	for (let i in GameProperties.instance.sceneList){
		if (GameProperties.instance.sceneList[i].id == _id){
			return GameProperties.instance.sceneList[i];
		}
	}
	return null;
};
GameProperties.GetSceneLength = function(){
	if (!GameProperties.ProjectLoaded()) return -1;
	return GameProperties.instance.sceneList.length;
};
GameProperties.GetObjectById = function(_id){
	if (!GameProperties.ProjectLoaded()) return null;
	for (let i in GameProperties.instance.objectList){
		if (GameProperties.instance.objectList[i].id == _id){
			return GameProperties.instance.objectList[i];
		}
	}
	return null;
};
GameProperties.GetInteractionById = function(_id){
	if (!GameProperties.ProjectLoaded()) return null;
	for (let i in GameProperties.instance.interactionList){
		if (GameProperties.instance.interactionList[i].id == _id){
			return GameProperties.instance.interactionList[i];
		}
	}
	return null;
};
GameProperties.GetStateById = function(_id){
	if (!GameProperties.ProjectLoaded()) return null;
	for (let i in GameProperties.instance.stateList){
		if (GameProperties.instance.stateList[i].id == _id){
			return GameProperties.instance.stateList[i];
		}
	}
	return null;
};
GameProperties.GetSoundById = function(_id){
	if (!GameProperties.ProjectLoaded()) return null;
	for (let i in GameProperties.instance.soundList){
		if (GameProperties.instance.soundList[i].id == _id){
			return GameProperties.instance.soundList[i];
		}
	}
	return null;
};
GameProperties.GetImageById = function(_id){
	if (!GameProperties.ProjectLoaded()) return null;
	for (let i in GameProperties.instance.imageList){
		if (GameProperties.instance.imageList[i].id == _id){
			return GameProperties.instance.imageList[i];
		}
	}
	return null;
};

GameProperties.AddScene = function(_scene){
	if (!GameProperties.ProjectLoaded()) return false;
	GameProperties.instance.sceneList.push(_scene);
	return true;
};
GameProperties.DeleteScene = function(_scene){
	if (!GameProperties.ProjectLoaded()) return false; 
	var i = GameProperties.instance.sceneList.indexOf(_scene);
	if (i >= 0){
		GameProperties.instance.sceneList.splice(i, 1);
		return true;
	}
	return false;
};

GameProperties.AddObject = function(_obj){
	if (!GameProperties.ProjectLoaded()) return false;
	GameProperties.instance.objectList.push(_obj);
	return true;
};
GameProperties.DeleteObject = function(_obj){
	if (!GameProperties.ProjectLoaded()) return false; 
	var i = GameProperties.instance.objectList.indexOf(_obj);
	if (i >= 0){
		GameProperties.instance.objectList.splice(i, 1);
		return true;
	}
	return false;
};

GameProperties.AddInteraction = function(_ntra){
	if (!GameProperties.ProjectLoaded()) return false;
	GameProperties.instance.interactionList.push(_ntra);
	return true;
};
GameProperties.DeleteInteraction = function(_ntra){
	if (!GameProperties.ProjectLoaded()) return false; 
	var i = GameProperties.instance.interactionList.indexOf(_ntra);
	if (i >= 0){
		GameProperties.instance.interactionList.splice(i, 1);
		return true;
	}
	return false;
};

GameProperties.AddState = function(_state){
	if (!GameProperties.ProjectLoaded()) return false;
	GameProperties.instance.stateList.push(_state);
	return true;
};
GameProperties.DeleteState = function(_state){
	if (!GameProperties.ProjectLoaded()) return false; 
	var i = GameProperties.instance.stateList.indexOf(_state);
	if (i >= 0){
		GameProperties.instance.stateList.splice(i, 1);
		return true;
	}
	return false;
};

GameProperties.AddSound = function(_sound){
	if (!GameProperties.ProjectLoaded()) return false;
	GameProperties.instance.soundList.push(_sound);
	return true;
};
GameProperties.DeleteSound = function(_sound){
	if (!GameProperties.ProjectLoaded()) return false; 
	var i = GameProperties.instance.soundList.indexOf(_sound);
	if (i >= 0){
		GameProperties.instance.soundList.splice(i, 1);
		return true;
	}
	return false;
};

GameProperties.AddImage = function(_image){
	if (!GameProperties.ProjectLoaded()) return false;
	// TODO detect repetitive path
	GameProperties.instance.imageList.push(_image);
	return true;
};
GameProperties.DeleteImage = function(_image){
	if (!GameProperties.ProjectLoaded()) return false; 
	var i = GameProperties.instance.imageList.indexOf(_image);
	if (i >= 0){
		GameProperties.instance.imageList.splice(i, 1);
		return true;
	}
	return false;
};

module.exports = GameProperties;