/* global require */
// sychronous fs+JSON.parser version

const fs = require('fs-extra');
const FileSys = require('./FileSys.js');

const Parser = function(jsonPath, buildPath) {
  this.build = buildPath;
  this.game = fs.readJsonSync(jsonPath);
  this.assetPath = FileSys.merge(this.build, 'Resources/Assets');
  this.sceneList = this.game.sceneList;
  this.objectList = this.game.objectList;
  this.settings = this.game.settings;
  this.interactionList = this.game.interactionList;
  this.puzzleList = this.game.puzzleList;
  this.stateList = this.game.stateList;
  this.soundList = this.game.soundList;
  this.scalarX = this.settings.resWidth / this.game.projectData.viewWidth;
  this.scalarY = this.settings.resHeight / this.game.projectData.viewHeight;
};

// public:
//= ===================================================================================
Parser.prototype.translate = function(callback) {
  if (
    this.settings.startScene < 0 ||
    this.settings.resWidth < 100 ||
    this.settings.resHeight < 100
  ) {
    callback('Settings ERROR: start scene must be larger or equal to 0');
    return false;
  }

  if (this.settings.inventoryGridNum < 5) {
    callback('the number of grim in inventory must be larger or equal to 5');
    return false;
  }

  let toReturn = '\n';
  const sound = createSoundList.call(this, callback);

  if (sound === false) return false;

  toReturn +=
    "document.addEventListener('contextmenu', e => e.preventDefault());\n";
  toReturn += `//===============create Game==================\n${createGame.call(
    this
  )}`;
  toReturn += `\n//===============add Sound==================\n${sound}`;
  toReturn += `\n//===============create Scene================\n${createScene.call(
    this
  )}`;
  toReturn += showSceneNarrative.call(this);
  toReturn += 'const reaction = myGame.reactionSystem;\n';
  toReturn += 'const puzzle = myGame.puzzleSystem;\n';

  toReturn += '\n//===============create Objects==================\n';
  const mustHave = translateObjects.call(this, callback);
  if (mustHave === false) {
    return false;
  }
  toReturn += mustHave;

  // Set containers' contents here
  toReturn += setContainer.call(this);

  toReturn += '\n//================puzzle=====================\n';
  const puzzle = puzzleListParser.call(this, this.puzzleList, 0, callback);
  if (puzzle === false) return false;
  toReturn += puzzle;

  const startScene = findSceneByID.call(this, this.settings.startScene);
  if (startScene === false) {
    toReturn += `myGame.start(${0});`;
  } else {
    toReturn += `myGame.start(${startScene});`;
  }
  return toReturn;
};

Parser.prototype.writeHTML = function() {
  const dest = FileSys.merge(this.build, 'index.html');
  const string =
    `${'<!doctype html>\n<head>\n <meta charset="utf-8">\n<title>'}${
      this.settings.projectName
    }</title> \n</head>\n` +
    ` <body style="margin: 0px"><script src="Resources/pixi/pixi.js"></script>\n<script src="Resources/pixi/PIXI.TextInput.js"></script>\n<script src="Resources/pixi/pixi-extra-filters.js"></script>\n<script src="Resources/pixi/pixi-multistyle-text.js"></script>\n<script src="Resources/pixi/pixi-sound.js"></script>\n<script src="Resources/aliceAPI.js"></script>\n<script src="game.js">\n</script>\n</body>`;
  FileSys.writeFile(dest, string);
};

// private:
//= ================setting up the basic game properties==============================
function createGame() {
  return `myGame.init(${this.settings.resWidth},${this.settings.resHeight},${
    this.settings.inventoryGridNum
  });\n`;
}

function createScene() {
  return `myGame.sceneManager.createScenes(${this.sceneList.length});\n`;
}

function createSoundList(callback) {
  let toReturn = '';

  if (this.soundList.length === 0) return toReturn;

  for (let i = 0; i < this.soundList.length; i += 1) {
    const sound = this.soundList[i];

    if (
      Object.prototype.hasOwnProperty.call(sound, 'id') &&
      Object.prototype.hasOwnProperty.call(sound, 'name') &&
      Object.prototype.hasOwnProperty.call(sound, 'src')
    ) {
      if (
        fs.pathExistsSync(sound.src) &&
        FileSys.filename(sound.src).match(/\.(wav|mp3)$/)
      ) {
        let dest = FileSys.merge(this.assetPath, FileSys.filename(sound.src));
        dest = dest.replace(/\\/g, '/');
        FileSys.copyFileOrFolder(sound.src, dest);

        toReturn += addSound(
          sound.name,
          sound.id,
          `./Resources/Assets/${FileSys.filename(sound.src)}`
        );
      } else {
        callback(
          `Compiler ERROR: sound {id = ${sound.id}, name = ${
            sound.name
          }} has INVALID source: \n${
            sound.src
          }\nEither the path is not correct or the file format is not WAV/MP4.`
        );
        return false;
      }
    } else {
      callback(
        'ERROR: The soundList structure is not complete. It needs id, name , and a valid src path.'
      );
      return false;
    }
  }

  return toReturn;
}

function addSound(name, id, src) {
  return `myGame.soundManager.load('${name}_${id}', '${src}');\n`;
}

// if the scene is found, return the SCENE INDEX!!!!.
// Otherwise, return false;
function findSceneByID(id) {
  for (let i = 0; i < this.sceneList.length; i += 1) {
    if (this.sceneList[i].id === id) {
      return i;
    }
  }

  return false;
}

function showSceneNarrative() {
  let toReturn = '';
  for (let i = 0; i < this.sceneList.length; i += 1) {
    let { narrative } = this.sceneList[i];
    if (narrative !== '' && narrative !== null) {
      narrative = narrative.replace(/\\/g, '/').replace(/"|'/g, '"');
      toReturn += `\nnarrative${i}showed = false;\n`;
      toReturn += `myGame.eventSystem.addSceneTransitEvent(${i}, function(){\n`;
      toReturn += `  if (!narrative${i}showed) {\n`;
      toReturn += `    myGame.messageBox.startConversation(['${narrative}'], null);\n`;
      toReturn += `    narrative${i}showed = true;\n`;
      toReturn += `  }\n`;
      toReturn += `});`;
    }
  }

  return toReturn;
}

//* *************************Object Properties************************************
// Must Have:
// src, anchor, scale, interactive, buttonMode, pos, name, sceneParent, ID

//* ********obj is the (name + id) of the object in the json file********
// src must be a valid path to a image file.

function addObjectToScene(objName, sceneIndex) {
  return `myGame.scene(${sceneIndex}).addChild(${objName});\n`;
}

function goToScene(objName, sceneIndex) {
  return `${objName}.toScene = ${sceneIndex};\n`;
}

function createPIXIObject(obj, src) {
  return `var ${obj}= Alice.Object.fromImage('${src}');\n`;
}

function setName(obj, nameID) {
  return `${obj}.name = '${nameID}';\n`;
}

function setAnchor(obj, anchor) {
  return `${obj}.anchor.set(${anchor.x}, ${anchor.y});\n`;
}

function setScale(obj, scale) {
  return `${obj}.scale.set(${scale.x * this.scalarX}, ${scale.y *
    this.scalarY});\n`;
}

// interactive or buttonMode should be boolean
function setClickable(obj, clickable) {
  if (clickable) return `reaction.makeClickable( ${obj} );\n`;
  return `reaction.makeUnClickable( ${obj} );\n`;
}

function setDraggable(obj, draggable) {
  if (draggable) return `reaction.makeDraggable( ${obj} );\n`;
  return `reaction.makeUnDraggable( ${obj} );\n`;
}

function setShowObjectDescription(obj, description) {
  if (description === '' || description === null) return '';

  let i = 0;
  while (i !== description.length) {
    if (description.charAt(i) === "'") {
      description = `${description.slice(0, i)}\\${description.slice(
        i,
        description.length
      )}`;
      i += 1;
    }
    i += 1;
  }
  description = description.replace(/(\r\n|\n|\r)/gm, '');
  return `${obj}.description = '${description}';\nreaction.showObjectDescription(${obj});\n`;
}

function setShowObjectConversation(obj, conversation) {
  if (conversation === '' || conversation === null) return '';

  let i = 0;
  while (i !== conversation.length) {
    if (conversation.charAt(i) === "'") {
      conversation = `${conversation.slice(0, i)}\\${conversation.slice(
        i,
        conversation.length
      )}`;
      i += 1;
    }
    i += 1;
  }
  conversation = conversation.replace(/(\r\n|\n|\r)/gm, '');
  return `${obj}.conversation = '${conversation}';\nreaction.showObjectConversation(${obj});\n`;
}

function setContent(obj, content) {
  if (content === null || content.length === 0) return false;

  let contentStr = '';
  content.forEach(i => {
    const { id } = i;
    const { name } = i;
    const item = getNameWithID(name, id);
    contentStr += `${item}, `;
  });
  contentStr = contentStr.slice(0, contentStr.length - 2);
  return `${obj}.content = [${contentStr}]\n`;
}

function getNameWithID(obj, id) {
  const name = obj.replace(/\W/g, '');
  return `_${name}_${id}`;
}

function setPos(obj, pos) {
  return `${obj}.x = ${pos.x * this.scalarX};\n${obj}.y = ${pos.y *
    this.scalarY};\n`;
}

function translateObjProperties(object, callback) {
  let ERROR;
  let toReturn = '';

  // src, anchor, scale, interactive, buttonMode, pos, name, sceneParent, ID
  if (
    Object.prototype.hasOwnProperty.call(object, 'name') &&
    Object.prototype.hasOwnProperty.call(object, 'id')
  ) {
    const name = getNameWithID(object.name, object.id);
    // src
    // check if the path is valid, then copy the picture to the build folder
    if (Object.prototype.hasOwnProperty.call(object, 'src')) {
      let { src } = object;
      if (src.charAt(0) === '.') {
        src = object.src.slice(4);
      }

      if (
        fs.pathExistsSync(src) &&
        FileSys.filename(src).match(/\.(jpg|jpeg|png)$/)
      ) {
        let dest = FileSys.merge(this.assetPath, FileSys.filename(src));
        dest = dest.replace(/\\/g, '/');
        FileSys.copyFileOrFolder(src, dest);
        toReturn += createPIXIObject(
          name,
          `./Resources/Assets/${FileSys.filename(src)}`
        );
        toReturn += setName(name, object.name);
      } else {
        ERROR = `ERROR: Object: ${
          object.name
        } File path does not exist or the file extention does not match jpg/jpeg/png.\n **********Invalid Path: ${FileSys.getAbs(
          object.src
        )}\n`;
        callback(ERROR);
        return false;
      }
    } else {
      ERROR = `ERROR: Object ${object.name} does not have a sprite.`;
      callback(ERROR);
      return false;
    } // end src

    // anchor
    if (Object.prototype.hasOwnProperty.call(object, 'anchor')) {
      if (
        Object.prototype.hasOwnProperty.call(object.anchor, 'x') &&
        !isNaN(object.anchor.x) &&
        typeof object.anchor.x === 'number' &&
        Object.prototype.hasOwnProperty.call(object.anchor, 'y') &&
        !isNaN(object.anchor.y) &&
        typeof object.anchor.y === 'number'
      ) {
        toReturn += setAnchor(name, object.anchor);
      } else {
        ERROR = `Object ${
          object.name
        }: x and y of anchor must be defined as numbers.`;
        callback(ERROR);
        return false;
      }
    } else {
      ERROR = `Object ${object.name} has not set the anchor.`;
      callback(ERROR);
      return false;
    } // end anchor

    // pos
    if (Object.prototype.hasOwnProperty.call(object, 'pos')) {
      if (
        Object.prototype.hasOwnProperty.call(object.pos, 'x') &&
        !isNaN(object.pos.x) &&
        typeof object.pos.x === 'number' &&
        Object.prototype.hasOwnProperty.call(object.pos, 'y') &&
        !isNaN(object.pos.y) &&
        typeof object.pos.y === 'number'
      ) {
        toReturn += setPos.call(this, name, object.pos);
      } else {
        ERROR = 'ERROR: x and y of the position must be defined as numbers.';
        callback(ERROR);
        return false;
      }
    } else {
      ERROR = 'ERROR: Object has not set the position.';
      callback(ERROR);
      return false;
    } // end pos

    // scale
    if (Object.prototype.hasOwnProperty.call(object, 'scale')) {
      if (
        Object.prototype.hasOwnProperty.call(object.scale, 'x') &&
        !isNaN(object.scale.x) &&
        typeof object.scale.x === 'number' &&
        Object.prototype.hasOwnProperty.call(object.scale, 'y') &&
        !isNaN(object.scale.y) &&
        typeof object.scale.y === 'number'
      ) {
        toReturn += setScale.call(this, name, object.scale);
      } else {
        ERROR = 'ERROR: x and y of the scale must be defined as numbers.';
        callback(ERROR);
        return false;
      }
    } else {
      ERROR = 'ERROR: Object has not set the scale.';
      callback(ERROR);
      return false;
    }

    // clickable
    if (Object.prototype.hasOwnProperty.call(object, 'clickable')) {
      if (typeof object.clickable === 'boolean') {
        toReturn += setClickable(name, object.clickable);
      } else {
        ERROR = 'ERROR: The clickable value of the object must be a boolean.';
        callback(ERROR);
        return false;
      }
    } else {
      ERROR = 'ERROR: Object has not set the interativity.';
      callback(ERROR);
      return false;
    } // end clickable

    // draggable
    if (Object.prototype.hasOwnProperty.call(object, 'draggable')) {
      if (typeof object.draggable === 'boolean') {
        toReturn += setDraggable(name, object.draggable);
      } else {
        ERROR = 'ERROR: The draggable value of the object must be a boolean.';
        callback(ERROR);
        return false;
      }
    } else {
      ERROR = 'ERROR: Object has not set the [draggable] .';
      callback(ERROR);
      return false;
    } // end clickable

    // bindscene
    if (Object.prototype.hasOwnProperty.call(object, 'bindScene')) {
      if (object.bindScene === -1) {
        // Doesn't belong to any scene, like product, something in container, etc.
      } else {
        const sceneIndex = findSceneByID.call(this, object.bindScene);
        toReturn += addObjectToScene(name, sceneIndex);
      }
    } else {
      ERROR = 'ERROR: Object must be added to a scene.';
      callback(ERROR);
      return false;
    }

    // description
    if (Object.prototype.hasOwnProperty.call(object, 'description')) {
      toReturn += setShowObjectDescription(name, object.description);
    }

    // conversation
    if (Object.prototype.hasOwnProperty.call(object, 'conversation')) {
      toReturn += setShowObjectConversation(name, object.conversation);
    }

    // content for container
    // if (Object.prototype.hasOwnProperty.call(object, "content")){
    // 	toReturn += setContent(name, object.content);
    // }

    // }//end name
  } else {
    ERROR = 'ERROR: Object must have a name !!';
    callback(ERROR);
    return false;
  }

  return toReturn;
}

// iterate through the objectList
function translateObjects(callback) {
  let toReturn = '\n';
  const arrayLength = this.objectList.length;

  for (let i = 0; i < arrayLength; i += 1) {
    const result = translateObjProperties.call(
      this,
      this.objectList[i],
      callback
    );

    if (result === false) {
      return false;
    }
    toReturn += `${result}\n`;
  }
  return toReturn;
}

function setContainer() {
  let toReturn = '';
  for (let i = 0; i < this.objectList.length; i += 1) {
    const objName = getNameWithID(
      this.objectList[i].name,
      this.objectList[i].id
    );
    const result = setContent(objName, this.objectList[i].content);
    if (result) {
      toReturn += `${result}\n`;
    }
  }
  return toReturn;
}

// ----------------------INTERACTION-------------------------------
// interaction json format:
// @param id:               the global counter
// @param event:        	{type specifier, args[]}
// @param conditionList:    a list of {stateID, val}
// @param reactionList:     a list of reaction which is defineMiao Rend below

// ----------------------EVENT----------------------------------------
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

// --------------------CONDITION-------------------------------
// @param id: 		stateID
// @param value: 	right-handside of the equation

// ----------------------REACTION-------------------------------
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

// -------------------------PUZZLE------------------------------------------

function puzzleListParser(puzzleList, ind, callback) {
  console.log('enter puzzle list parser');
  console.log(puzzleList);
  let toReturn = '';
  const indentCounter = 1 + ind;

  if (puzzleList.length === 0) return toReturn;

  for (let i = 0; i < puzzleList.length; i += 1) {
    const result = puzzleParser.call(this, puzzleList[i], callback);
    console.log(`result = ${result}`);
    if (result === false) return false;
    toReturn += result;
  }

  return toReturn;
}
function puzzleParser(puzzle, callback) {
  const { type } = puzzle;
  let toReturn = '';
  const goal = type[0];
  const how = type[1];
  const challenge = type[2];
  const challengeType = type[3];
  switch (goal) {
    case 0: // Go to a new location
      switch (how) {
        case 0: // By entering through an entrance
          switch (challenge) {
            case 4: // Is locked
              switch (challengeType) {
                case 0: // key lock
                  toReturn = translateKeyLockDoorPuzzle.call(
                    this,
                    puzzle.args,
                    callback
                  );
                  break;
                case 1: // password lock
                  toReturn = translatePasswordLockDoorPuzzle.call(
                    this,
                    puzzle.args,
                    callback
                  );
                  break;
                case 3: // bribe guard
                  toReturn = translateBribeGuardDoorPuzzle.call(
                    this,
                    puzzle.args,
                    callback
                  );
                  break;
                case 4: // trigger
                  toReturn = translateSwitchDoorPuzzle.call(
                    this,
                    puzzle.args,
                    callback
                  );
                  break;
                default:
                  callback('Invalid Challenge Type');
              }
              break;
            case 5: // Not locked
              toReturn = translateDoorPuzzle.call(this, puzzle.args, callback);
              break;
            default:
              callback('Invalid Challenge');
              break;
          }
          break;
        default:
          callback('Invalid How');
          break;
      }
      break;
    case 1: // Get an item
      switch (how) {
        case 1: // Click to collect
          toReturn = translateGetItemPuzzle.call(this, puzzle.args, callback);
          break;
        case 2: // Collect from container
          switch (challenge) {
            case 4: // Is locked
              switch (challengeType) {
                case 0: // key locked
                  toReturn = translateKeyLockContainerPuzzle.call(
                    this,
                    puzzle.args,
                    callback
                  );
                  break;
                case 1: // password lock
                  toReturn = translatePasswordLockContainerPuzzle.call(
                    this,
                    puzzle.args,
                    callback
                  );
                  break;
                case 3: // bribe guard
                  toReturn = translateBribeGuardContainerPuzzle.call(
                    this,
                    puzzle.args,
                    callback
                  );
                  break;
                case 4: // trigger
                  toReturn = translateSwitchContainerPuzzle.call(
                    this,
                    puzzle.args,
                    callback
                  );
                  break;
                default:
                  callback('Invalid Challenge Type');
              }
              break;
            case 5: // not locked
              toReturn = translateContainerPuzzle.call(
                this,
                puzzle.args,
                callback
              );
              break;
            default:
              callback('Invalid Challenge');
              break;
          }
          break;
        case 3: // Get from a character
          toReturn = translateTradePuzzle.call(this, puzzle.args, callback);
          break;
        default:
          callback('Invalid How');
          break;
      }
      break;
    default:
      callback('Invalid Goal');
  }
  return toReturn;
}

// ------------------------------- PUZZLE TRANSLATION -------------------------------

function translateDoorPuzzle(args, callback) {
  if (args[0] === -1 || args[1] === -1) {
    callback(
      "ERROR: for puzzle [Go to a location], you must reference destination scene id and the door object before run it. If you don't need this puzzle module, please delete it. "
    );
    return false;
  }
  const sceneIndex = findSceneByID.call(this, args[0]);
  const doorObj = findObjectByID.call(this, args[1]);
  let sound = null;
  let isWinning;
  if (args[6]) isWinning = args[6];
  if (args[5] !== -1) {
    sound = findSoundByID.call(this, args[5]);
    return `puzzle.doorPuzzle(${sceneIndex}, ${doorObj}, ${isWinning}, '${sound}');\n`;
  }
  return `puzzle.doorPuzzle(${sceneIndex}, ${doorObj}, ${isWinning}, ${sound});\n`;
}

function translateKeyLockDoorPuzzle(args, callback) {
  if (args[0] === -1 || args[1] === -1 || args[3] === -1) {
    callback(
      "ERROR: for puzzle [Unlock door with switch], you must reference destination scene id, the door object, and the key object before run it. If you don't need this puzzle module, please delete it. "
    );
    return false;
  }
  const sceneIndex = findSceneByID.call(this, args[0]);
  const doorObj = findObjectByID.call(this, args[1]);
  const keyObj = findObjectByID.call(this, args[3]);
  let sound = null;
  let isWinning;
  if (args[6]) isWinning = args[6];
  if (args[5] !== -1) {
    sound = findSoundByID.call(this, args[5]);
    return `puzzle.keyLockDoorPuzzle(${sceneIndex}, ${doorObj}, ${keyObj}, ${isWinning}, '${sound}');\n`;
  }
  return `puzzle.keyLockDoorPuzzle(${sceneIndex}, ${doorObj}, ${keyObj}, ${isWinning}, ${sound});\n`;
}

function translatePasswordLockDoorPuzzle(args, callback) {
  if (args[0] === -1 || args[1] === -1 || args[3] === -1) {
    callback(
      "ERROR: for puzzle [Unlock door with a password], you must reference destination scene id, the door object, and the password before run it. If you don't need this puzzle module, please delete it. "
    );
    return false;
  }
  const sceneIndex = findSceneByID.call(this, args[0]);
  const doorObj = findObjectByID.call(this, args[1]);
  const password = args[3];
  let sound = null;
  let isWinning;
  if (args[6]) isWinning = args[6];
  if (args[5] !== -1) {
    sound = findSoundByID.call(this, args[5]);
    return `puzzle.passwordLockDoorPuzzle(${sceneIndex}, ${doorObj}, '${password}', ${isWinning}, '${sound}');\n`;
  }
  return `puzzle.passwordLockDoorPuzzle(${sceneIndex}, ${doorObj}, '${password}', ${isWinning}, ${sound});\n`;
}

function translateBribeGuardDoorPuzzle(args, callback) {
  if (args[0] === -1 || args[1] === -1 || args[3] === -1 || args[4] === -1) {
    callback(
      "ERROR: for puzzle [Go to a new location by bribing the guard], you must reference destination scene id, the door object, the guard object, and the item for bribing before run it. If you don't need this puzzle module, please delete it. "
    );
    return false;
  }
  const sceneIndex = findSceneByID.call(this, args[0]);
  const doorObj = findObjectByID.call(this, args[1]);
  const guard = findObjectByID.call(this, args[3]);
  const bribing = findObjectByID.call(this, args[4]);
  let sound = null;
  let isWinning;
  if (args[6]) isWinning = args[6];
  if (args[5] !== -1) {
    sound = findSoundByID.call(this, args[5]);
    return `puzzle.bribeGuardDoorPuzzle(${sceneIndex}, ${doorObj}, ${guard}, ${bribing}, ${isWinning}, '${sound}');\n`;
  }
  return `puzzle.bribeGuardDoorPuzzle(${sceneIndex}, ${doorObj}, ${guard}, ${bribing}, ${isWinning}, ${sound});\n`;
}

function translateSwitchDoorPuzzle(args, callback) {
  if (args[0] === -1 || args[1] === -1 || args[3] === -1) {
    callback(
      "ERROR: for puzzle [Unlock door with switch], you must reference destination scene id, the door object and the switch object before run it. If you don't need this puzzle module, please delete it. "
    );
    return false;
  }
  const sceneIndex = findSceneByID.call(this, args[0]);
  const doorObj = findObjectByID.call(this, args[1]);
  const switchObj = findObjectByID.call(this, args[3]);
  let sound = null;
  let isWinning;
  if (args[6]) isWinning = args[6];
  if (args[5] !== -1) {
    sound = findSoundByID.call(this, args[5]);
    return `puzzle.switchDoorPuzzle(${sceneIndex}, ${doorObj}, ${switchObj}, ${isWinning}, '${sound}');\n`;
  }
  return `puzzle.switchDoorPuzzle(${sceneIndex}, ${doorObj}, ${switchObj}, ${isWinning}, ${sound});\n`;
}

function translateGetItemPuzzle(args, callback) {
  if (args[0] === -1) {
    callback(
      "ERROR: for puzzle [Get an item by clicking], you must reference object to get before run it. If you don't need this puzzle module, please delete it. "
    );
    return false;
  }
  const obj = findObjectByID.call(this, args[0]);
  let sound = null;
  let isWinning;
  if (args[6]) isWinning = args[6];
  if (args[5] !== -1) {
    sound = findSoundByID.call(this, args[5]);
    return `puzzle.getItemPuzzle(${obj}, ${isWinning}, '${sound}');\n`;
  }
  return `puzzle.getItemPuzzle(${obj}, ${isWinning}, ${sound});\n`;
}

function translateContainerPuzzle(args, callback) {
  if (args[0] === -1 || args[1] === -1) {
    callback(
      "ERROR: for puzzle [Get an item from a container], you must reference object to get and the container object before run it. If you don't need this puzzle module, please delete it. "
    );
    return false;
  }
  const obj = findObjectByID.call(this, args[0]);
  const container = findObjectByID.call(this, args[1]);
  let sound = null;
  let isWinning;
  if (args[6]) isWinning = args[6];
  if (args[5] !== -1) {
    sound = findSoundByID.call(this, args[5]);
    return `puzzle.getItemFromContainerPuzzle(${obj}, ${container}, ${isWinning}, '${sound}');\n`;
  }
  return `puzzle.getItemFromContainerPuzzle(${obj}, ${container}, ${isWinning}, ${sound});\n`;
}

function translateKeyLockContainerPuzzle(args, callback) {
  if (args[0] === -1 || args[1] === -1 || args[3] === -1) {
    callback(
      "ERROR: for puzzle [Get an item from a key locked container], you must reference object to get, the container object and the key object before run it. If you don't need this puzzle module, please delete it. "
    );
    return false;
  }
  const obj = findObjectByID.call(this, args[0]);
  const container = findObjectByID.call(this, args[1]);
  const keyObj = findObjectByID.call(this, args[3]);
  let sound = null;
  let isWinning;
  if (args[6]) isWinning = args[6];
  if (args[5] !== -1) {
    sound = findSoundByID.call(this, args[5]);
    return `puzzle.getItemFromKeyLockContainerPuzzle(${obj}, ${container}, ${keyObj}, ${isWinning}, '${sound}');\n`;
  }
  return `puzzle.getItemFromKeyLockContainerPuzzle(${obj}, ${container}, ${keyObj}, ${isWinning}, ${sound});\n`;
}

function translatePasswordLockContainerPuzzle(args, callback) {
  if (args[0] === -1 || args[1] === -1 || args[3] === -1) {
    callback(
      "ERROR: for puzzle [Get an item from a key locked container], you must reference object to get, the container object and the key object before run it. If you don't need this puzzle module, please delete it. "
    );
    return false;
  }
  const obj = findObjectByID.call(this, args[0]);
  const container = findObjectByID.call(this, args[1]);
  const password = args[3];
  let sound = null;
  let isWinning;
  if (args[6]) isWinning = args[6];
  if (args[5] !== -1) {
    sound = findSoundByID.call(this, args[5]);
    return `puzzle.getItemFromPasswordLockContainerPuzzle(${obj}, ${container}, '${password}', ${isWinning}, '${sound}');\n`;
  }
  return `puzzle.getItemFromPasswordLockContainerPuzzle(${obj}, ${container}, '${password}', ${isWinning}, ${sound});\n`;
}

function translateBribeGuardContainerPuzzle(args, callback) {
  if (args[0] === -1 || args[1] === -1 || args[3] === -1 || args[4] === -1) {
    callback(
      "ERROR: for puzzle [Get ab item from a container by bribing the guard], you must reference object to get, the container object, the guard object, and the item for bribing before run it. If you don't need this puzzle module, please delete it. "
    );
    return false;
  }
  const obj = findObjectByID.call(this, args[0]);
  const container = findObjectByID.call(this, args[1]);
  const guard = findObjectByID.call(this, args[3]);
  const bribing = findObjectByID.call(this, args[4]);
  let sound = null;
  let isWinning;
  if (args[6]) isWinning = args[6];
  if (args[5] !== -1) {
    sound = findSoundByID.call(this, args[5]);
    return `puzzle.getItemFromBribeGuardContainerPuzzle(${obj}, ${container}, ${guard}, ${bribing}, ${isWinning}, '${sound}');\n`;
  }
  return `puzzle.getItemFromBribeGuardContainerPuzzle(${obj}, ${container}, ${guard}, ${bribing}, ${isWinning}, ${sound});\n`;
}

function translateSwitchContainerPuzzle(args, callback) {
  if (args[0] === -1 || args[1] === -1 || args[3] === -1) {
    callback(
      "ERROR: for puzzle [Get an item from a switch container], you must reference object to get, the container object and the switch object before run it. If you don't need this puzzle module, please delete it. "
    );
    return false;
  }
  const obj = findObjectByID.call(this, args[0]);
  const container = findObjectByID.call(this, args[1]);
  const switchObj = findObjectByID.call(this, args[3]);
  let sound = null;
  let isWinning;
  if (args[6]) isWinning = args[6];
  if (args[5] !== -1) {
    sound = findSoundByID.call(this, args[5]);
    return `puzzle.getItemFromSwitchContainerPuzzle(${obj}, ${container}, ${switchObj}, ${isWinning}, '${sound}');\n`;
  }
  return `puzzle.getItemFromSwitchContainerPuzzle(${obj}, ${container}, ${switchObj}, ${isWinning}, ${sound});\n`;
}

function translateCombineItemPuzzle(args, callback) {
  // TO DO: has not been updated for a long time. Use other working puzzle parser as reference.
  if (args[0] === -1 || args[1] === -1 || args[2] === -1) {
    callback(
      "ERROR: for puzzle [Get an item by combining], you must reference product object, and two ingredient objects before run it. If you don't need this puzzle module, please delete it. "
    );
    return false;
  }
  const product = findObjectByID.call(this, args[0]);
  const ingredient1 = findObjectByID.call(this, args[1]);
  const ingredient2 = findObjectByID.call(this, args[2]);
  let sound;
  let isWinning;
  if (args[6]) isWinning = args[6];
  if (args[5] !== -1) {
    sound = findSoundByID.call(this, args[5]);
    return `puzzle.combineItemPuzzle(${product}, ${ingredient1}, ${ingredient2}, ${isWinning}, '${sound}');\n`;
  }
  return `puzzle.combineItemPuzzle(${product}, ${ingredient1}, ${ingredient2}, ${isWinning}, ${sound});\n`;
}

function translateDestroyObjectPuzzle(args, callback) {
  // TO DO: has not been updated for a long time. Use other working puzzle parser as reference.
  if (args[0] === -1 || args[1] === -1) {
    callback(
      "ERROR: for puzzle [Remove an object], you must reference the object to be removed and the destroyer object before run it. If you don't need this puzzle module, please delete it. "
    );
    return false;
  }
  const objToRemove = findObjectByID.call(this, args[0]);
  const destroyer = findObjectByID.call(this, args[1]);
  let sound;
  let isWinning;
  if (args[6]) isWinning = args[6];
  if (args[5] !== -1) {
    sound = findSoundByID.call(this, args[5]);
    return `puzzle.destroyObjectPuzzle(${objToRemove}, ${destroyer}, ${isWinning}, '${sound}');\n`;
  }
  return `puzzle.destroyObjectPuzzle(${objToRemove}, ${destroyer}, ${isWinning}, ${sound});\n`;
}

function translateLetCharacterSayPuzzle(args, callback) {
  // TO DO: has not been updated for a long time. Use other working puzzle parser as reference.
  if (args[0] === -1 || args[1] === -1 || args[3] === -1) {
    callback(
      "ERROR: for puzzle [Let character say something], you must reference the character, the object you give, and the dialogue to say before run it. If you don't need this puzzle module, please delete it. "
    );
    return false;
  }
  const character = findObjectByID.call(this, args[0]);
  const itemToGive = findObjectByID.call(this, args[1]);
  const dialogue = args[3];
  let sound;
  let isWinning;
  if (args[6]) isWinning = args[6];
  if (args[5] !== -1) {
    sound = findSoundByID.call(this, args[5]);
    return `puzzle.letCharacterSayPuzzle(${character}, ${itemToGive}, '${dialogue}', ${isWinning}, '${sound}');\n`;
  }
  return `puzzle.letCharacterSayPuzzle(${character}, ${itemToGive}, '${dialogue}', ${isWinning}, ${sound});\n`;
}

function translateTradePuzzle(args, callback) {
  if (args[0] === -1 || args[1] === -1 || args[2] === -1) {
    callback(
      "ERROR: for puzzle [Trade an item], you must reference object to get, trader object and the object to give before run it. If you don't need this puzzle module, please delete it. "
    );
    return false;
  }
  const obj = findObjectByID.call(this, args[0]);
  const trader = findObjectByID.call(this, args[1]);
  const objToGive = findObjectByID.call(this, args[2]);
  let sound;
  let isWinning;
  if (args[6]) isWinning = args[6];
  if (args[5] !== -1) {
    sound = findSoundByID.call(this, args[5]);
    return `puzzle.getItemFromTradeCharacterPuzzle(${obj}, ${trader}, ${objToGive}, ${isWinning}, '${sound}');\n`;
  }
  return `puzzle.getItemFromTradeCharacterPuzzle(${obj}, ${trader}, ${objToGive}, ${isWinning}, ${sound});\n`;
}

// return false if not found
// return name_id if found
function findObjectByID(ID) {
  for (let i = 0; i < this.objectList.length; i += 1) {
    if (this.objectList[i].id === ID) {
      return getNameWithID(this.objectList[i].name, this.objectList[i].id);
    }
  }
  return false;
}

// return false if not found
// return sound_id if found
function findSoundByID(ID) {
  for (let i = 0; i < this.soundList.length; i += 1) {
    if (this.soundList[i].id === ID) {
      return `${this.soundList[i].name}_${this.soundList[i].id}`;
    }
  }
  return false;
}

module.exports = Parser;
