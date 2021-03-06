const fs = require('fs-extra');
const path = require('path');

const pixi = path.resolve(__dirname, '../Library/pixi/pixi.js');
const pixiTextInput = path.resolve(__dirname, '../Library/pixi/PIXI.TextInput.js');
const pixi_sound = path.resolve(__dirname, '../Library/pixi/pixi-sound.js');
const aliceAPI = path.resolve(__dirname, '../Engine/aliceAPI.js');
const bat = path.resolve(__dirname, '../Engine/bat/chrome.bat');
const pixi_sound_map_src = path.resolve(__dirname,  '../Library/pixi/pixi-sound.js.map');
const pixiExtraFilters = path.resolve(__dirname, '../Library/pixi/pixi-extra-filters.min.js');
const pixiExtraFiltersMap = path.resolve(__dirname, '../Library/pixi/pixi-extra-filters.min.js.map');
const pixiMultiStyle = path.resolve(__dirname, '../Library/pixi/pixi-multistyle-text.js');
const pixiMultiStyleMap = path.resolve(__dirname, '../Library/pixi/pixi-multistyle-text.js.map');

let FileSys;
FileSys = function() {};

// asset folder should be unde the current working folder 'asset'
// The dest folder should be 'build/asset'
FileSys.copyFileOrFolder = function(src, dest) {
  fs.copySync(src, dest);
};

FileSys.getAbs = function(src) {
  return path.resolve(src);
};
// Ensures that a directory is empty. Deletes directory contents
// if the directory is not empty. If the directory does not exist, it is created.
// The directory itself is not deleted.
FileSys.createBuildFolder = function(buildPath) {
  fs.emptyDirSync(buildPath);
};

FileSys.writeFile = function(dest, string) {
  fs.outputFileSync(dest, string);
};

FileSys.merge = function(p1, p2) {
  return path.join(p1, p2);
};

FileSys.filename = function(absPath) {
  return path.basename(absPath);
};

FileSys.folder = function(p) {
  return path.dirname(p);
};

// return path to the resources folder under build path
FileSys.ensureAndCreate = function(jsonPath, callback) {
  if (!fs.pathExistsSync(jsonPath)) {
    callback(`Filesys : json path : ${path.resolve(jsonPath)} is not valid\n`);
    return false;
  }
  if (!fs.pathExistsSync(pixi)) {
    callback(`Filesys : pixi path : ${path.resolve(pixi)} is not valid\n`);
    return false;
  }
  if (!fs.pathExistsSync(pixi_sound)) {
    callback(
      `Filesys : pixi_sound : ${path.resolve(pixi_sound)} is not valid\n`
    );
    return false;
  }
  if (!fs.pathExistsSync(aliceAPI)) {
    callback(`Filesys : aliceAPI : ${path.resolve(aliceAPI)} is not valid\n`);
    return false;
  }
  if (!fs.pathExistsSync(pixi_sound_map_src)) {
    callback(
      `Filesys : pixi_sound_map_src : ${path.resolve(
        pixi_sound_map_src
      )} is not valid\n`
    );
    return false;
  }
  if (!fs.pathExistsSync(bat)) {
    callback(`Filesys : bat: ${path.resolve(bat)} is not valid\n`);
    return false;
  }

  const rootP = path.dirname(jsonPath);
  // console.log(jsonPath + ": \n" + path.basename(jsonPath));
  const buildPath = path.join(
    rootP,
    `${path.basename(jsonPath).slice(0, -4)}-Build`
  );
  const resourcesDest = path.join(buildPath, 'Resources');

  const assetSrc = path.resolve(__dirname, '../Assets');
  const assetDest = path.join(resourcesDest, 'Assets');

  const pixiFolder = path.join(resourcesDest, 'pixi');

  const aliceAPIDest = path.join(resourcesDest, 'aliceAPI.js');

  const pixiDest = path.join(pixiFolder, 'pixi.js');
  const textInputDest = path.join(pixiFolder, 'PIXI.TextInput.js');
  const soundDest = path.join(pixiFolder, 'pixi-sound.js');
  const pixi_sound_map_dest = path.join(pixiFolder, 'pixi-sound.js.map');
  const filtersDest = path.join(pixiFolder, 'pixi-extra-filters.js');
  const filtersMapDest = path.join(pixiFolder, 'pixi-extra-filters.js.map');
  const multiStyleDest = path.join(pixiFolder, 'pixi-multistyle-text.js');
  const multiStyleMapDest = path.join(
    pixiFolder,
    'pixi-multistyle-text.js.map'
  );

  const requireSrc = path.join(assetSrc, 'require');
  const requireDest = path.join(assetDest, 'require');
  console.log(requireSrc);
  console.log(requireDest);

  const batDest = path.join(buildPath, 'chrome.bat');
  FileSys.createBuildFolder(buildPath);
  FileSys.createBuildFolder(resourcesDest);
  FileSys.createBuildFolder(assetDest);
  FileSys.createBuildFolder(pixiFolder);

  // copy:
  // AliceAPI, pixi,pixi-sound, pixi-sound.map, require folder
  FileSys.copyFileOrFolder(aliceAPI, aliceAPIDest);
  FileSys.copyFileOrFolder(pixi, pixiDest);
  FileSys.copyFileOrFolder(pixiTextInput, textInputDest);
  FileSys.copyFileOrFolder(pixi_sound, soundDest);
  FileSys.copyFileOrFolder(pixi_sound_map_src, pixi_sound_map_dest);
  FileSys.copyFileOrFolder(requireSrc, requireDest);
  FileSys.copyFileOrFolder(bat, batDest);
  fs.appendFile(batDest, 'index.html"');
  FileSys.copyFileOrFolder(pixiExtraFilters, filtersDest);
  FileSys.copyFileOrFolder(pixiExtraFiltersMap, filtersMapDest);
  FileSys.copyFileOrFolder(pixiMultiStyle, multiStyleDest);
  FileSys.copyFileOrFolder(pixiMultiStyleMap, multiStyleMapDest);

  // copy inventory and textbox.
  FileSys.copyFileOrFolder(
    FileSys.merge(assetSrc, 'inventory.png'),
    FileSys.merge(assetDest, 'inventory.png')
  );
  FileSys.copyFileOrFolder(
    FileSys.merge(assetSrc, 'textbox.png'),
    FileSys.merge(assetDest, 'textbox.png')
  );

  return buildPath;
};

module.exports = FileSys;
