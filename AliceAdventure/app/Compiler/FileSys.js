const fs = require('fs-extra');
const path = require('path');
const pixi = 'Libraries/pixi/pixi.js';
const pixi_sound = 'Libraries/pixi/pixi-sound.js';
const aliceAPI = 'Libraries/aliceAPI.js';
const bat = 'Libraries/bat/chrome.bat'	
const pixi_sound_map_src = 'Libraries/pixi/pixi-sound.js.map';

//1) create a build folder. If it already exists, delete all the files within
//2) copy assets folder to build folder
//3) copy pixi folder to it
//4) copy aliceAPI.js
//7) write the parsed js file
//6) create an index which should include: 
//			--aliceAPI.js
//          --../pixi/pixi.min.js"
//          --game.js

//All are sync

var FileSys;
FileSys = function(){};

//asset folder should be unde the current working folder 'asset'
//The dest folder should be 'build/asset'
FileSys.copyFileOrFolder= function(src, dest){
	fs.copySync(src, dest);
}

FileSys.getAbs = function(src){
	return path.resolve(src);
}
//Ensures that a directory is empty. Deletes directory contents 
//if the directory is not empty. If the directory does not exist, it is created.
// The directory itself is not deleted.
FileSys.createBuildFolder = function(buildPath){
	fs.emptyDirSync(buildPath);
}

FileSys.writeFile = function(dest, string){
	fs.outputFileSync(dest, string);
}


FileSys.merge = function(p1,p2){
	return path.join(p1, p2);
}

FileSys.filename = function(absPath){
	return path.basename(absPath);
}

FileSys.folder = function(p){
	return path.dirname(p);
}

//return path to the resources folder under build path
FileSys.ensureAndCreate = function(jsonPath, callback){

	if (!fs.pathExistsSync(jsonPath)) {
		callback("Filesys : json path : "+ path.resolve(jsonPath) + ' is not valid\n');
		return false;
	}
	if (!fs.pathExistsSync(pixi)) {
		callback("Filesys : pixi path : "+ path.resolve(pixi) + ' is not valid\n');
		return false;
	}
	if (!fs.pathExistsSync(pixi_sound)) {
		callback("Filesys : pixi_sound : "+ path.resolve(pixi_sound) + ' is not valid\n');
		return false;
	}
	if (!fs.pathExistsSync(aliceAPI)) {
		callback("Filesys : aliceAPI : "+ path.resolve(aliceAPI) + ' is not valid\n');
		return false;
	}
	if (!fs.pathExistsSync(pixi_sound_map_src)) {
		callback("Filesys : pixi_sound_map_src : "+ path.resolve(pixi_sound_map_src) + ' is not valid\n');
		return false;
	}
	if (!fs.pathExistsSync(bat)) {
		callback("Filesys : bat: "+ path.resolve(bat) + ' is not valid\n');
		return false;
	}

	var rootP = path.dirname(jsonPath);
	//console.log(jsonPath + ": \n" + path.basename(jsonPath));
	var buildPath = path.join(rootP, path.basename(jsonPath).slice(0,-4) + '-Build');
	var resourcesDest = path.join(buildPath, 'Resources');

	var assetSrc = 'Assets';
	var assetDest = path.join(resourcesDest, 'Assets');
	

	var pixiFolder = path.join(resourcesDest, 'pixi');

	var aliceAPIDest = path.join(resourcesDest, 'aliceAPI.js');

	var pixiDest = path.join(pixiFolder, 'pixi.js');
	var soundDest = path.join(pixiFolder,'pixi-sound.js');
	var pixi_sound_map_dest = path.join(pixiFolder, 'pixi-sound.js.map');

	var requireSrc = path.join(assetSrc, 'require');
	var requireDest = path.join(assetDest, 'require');

	var batDest = path.join(buildPath, 'chrome.bat');
	FileSys.createBuildFolder(buildPath);
	FileSys.createBuildFolder(resourcesDest);
	FileSys.createBuildFolder(assetDest);
	FileSys.createBuildFolder(pixiFolder);

	//copy:
	//AliceAPI, pixi,pixi-sound, pixi-sound.map, require folder
	FileSys.copyFileOrFolder(aliceAPI, aliceAPIDest);
	FileSys.copyFileOrFolder(pixi, pixiDest);
	FileSys.copyFileOrFolder(pixi_sound, soundDest);
	FileSys.copyFileOrFolder(pixi_sound_map_src, pixi_sound_map_dest),
	FileSys.copyFileOrFolder(requireSrc,requireDest);
	FileSys.copyFileOrFolder(bat, batDest);

	//copy inventory and textbox.
	FileSys.copyFileOrFolder(FileSys.merge(assetSrc, 'inventory.png'), FileSys.merge(assetDest, 'inventory.png'));
	FileSys.copyFileOrFolder(FileSys.merge(assetSrc, 'textbox.png'), FileSys.merge(assetDest, 'textbox.png'));

	return buildPath;
}

module.exports = FileSys;


