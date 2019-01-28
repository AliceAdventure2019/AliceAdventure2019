const Alice = {
  Application: PIXI.Application,
  Object: PIXI.Sprite,
  Container: PIXI.Container,
  Texture: PIXI.Texture,
  Scene: PIXI.Container,
  Ticker: PIXI.ticker.Ticker,
  Text: PIXI.Text,
  AnimatedObject: PIXI.extras.AnimatedSprite,
  Sound: PIXI.sound
};

const baseURL = {
  requireAssets: './Resources/Assets/require/',
  nomalAssets: './Resources/Assets/'
};

class DebugSystem {
  constructor(_open) {
    this.open = _open;
  }

  log(info) {
    if (this.open) {
      window.console.log(info);
    }
  }
}

const debug = new DebugSystem(true);

class StateManager {
  constructor(_states, _eventSys) {
    this.states = _states;
    this.eventSystem = _eventSys;
  }

  setState(stateName, _value) {
    if (this.states[stateName] !== _value) {
      this.states[stateName] = _value;
      this.eventSystem.callEvent(
        `${stateName}${this.eventSystem.template.state}${_value}`
      );
    }
  }
}

class AliceReactionSystem {
  constructor(_game) {
    this.game = _game;
  }

  setState(_stateName, _value) {
    this.game.stateManager.setState(_stateName, _value);
  }

  transitToScene(_sceneIndex) {
    this.game.sceneManager.jumpToScene(_sceneIndex);
  }

  addToInventory(_obj) {
    this.game.inventory.add(_obj);
  }

  removeObject(obj) {
    if (!obj.parent) return;
    obj.prevParent = obj.parent;
    obj.prevParent.removeChild(obj);
    // _obj.inInventory = false;
  }

  removeFromInventory(_obj) {
    this.game.inventory.remove(_obj);
  }

  setObjVisibility(obj, visibility) {
    obj.visible = visibility;
    if (obj.inInventory) {
      this.game.inventory.update();
    }
  }

  makeObjVisible(_obj) {
    this.setObjVisibility(_obj, true);
  }

  makeObjInvisible(_obj) {
    this.setObjVisibility(_obj, false);
  }

  setObjInteractivity(obj, interactivity) {
    obj.interactive = interactivity;
    obj.buttonMode = interactivity;
  }

  makeInteractive(obj) {
    if (obj.interactive) return;
    this.setObjInteractivity(obj, true);
    obj
      .on('pointerdown', this.game.utilities.onMouseDown)
      .on('pointerup', this.game.utilities.onMouseUp)
      .on('pointermove', this.game.utilities.onMouseMove);
  }

  makeNonInteractive(obj) {
    if (!obj.interactive) return;
    this.setObjInteractivity(obj, false);
    obj
      .off('pointerdown', this.game.utilities.onMouseDown)
      .off('pointerup', this.game.utilities.onMouseUp)
      .off('pointermove', this.game.utilities.onMouseMove);
  }

  updateObjInteractivity(obj) {
    if (obj.dragable || obj.clickable) {
      this.makeInteractive(obj);
    } else {
      this.makeNonInteractive(obj);
    }
  }

  makeClickable(obj) {
    obj.clickable = true;
    this.updateObjInteractivity(obj);
  }

  makeUnClickable(obj) {
    obj.clickable = false;
    this.updateObjInteractivity(obj);
  }

  makeDraggable(obj) {
    obj.dragable = true;
    this.updateObjInteractivity(obj);
  }

  makeUnDraggable(obj) {
    obj.dragable = false;
    this.updateObjInteractivity(obj);
  }

  playAudio(audio, loop = false) {
    this.game.soundManager.play(audio, loop);
  }

  stopAudio(audio) {
    this.game.soundManager.stop(audio);
  }

  showInventory() {
    this.game.showInventory();
  }

  hideInventory() {
    this.game.hideInventory();
  }

  moveObjectToScene(obj, sceneIndex, x = null, y = null) {
    this.game.moveObjectToScene(obj, sceneIndex, x, y);
  }

  setObjectLocation(obj, x, y) {
    obj.x = x;
    obj.y = y;
  }
}

class AliceEventSystem {
  constructor() {
    this.template = {
      use: ' is used on ',
      combine: ' is combined with ',
      observe: ' is observed ',
      state: ' is changed to ',
      transit: ' transit to '
    };

    this.emptySprite = new Alice.Object();
    this.eventMessageList = {};
  }

  addEvent(msg, fn) {
    debug.log(`msg: ${msg}`);
    this.eventMessageList[msg] = true;
    this.emptySprite.on(msg, fn);
  }

  addUsedEvent(objA, objB, fn) {
    const eventMessage = `${objA.name}${this.template.use}${objB.name}`;
    this.addEvent(eventMessage, fn);
  }

  addCombineEvent(objA, objB, fn) {
    const eventMessageA = `${objA.name}${this.template.combine}${objB.name}`;
    this.addEvent(eventMessageA, fn);
    const eventMessageB = `${objB.name}${this.template.combine}${objA.name}`;
    this.addEvent(eventMessageB, fn);
  }

  addObserveEvent(obj, fn) {
    const eventMessage = `${obj.name}${this.template.observe}`;
    this.addEvent(eventMessage, fn);
  }

  addStateEvent(fromState, toState, fn) {
    const eventMessage = `${fromState}${this.template.state}${toState}`;
    this.addEvent(eventMessage, fn);
  }

  addSceneTransitEvent(scene, fn) {
    const eventMessage = `${this.template.transit}${scene}`;
    this.addEvent(eventMessage, fn);
  }

  checkEventExist(msg) {
    if (
      this.eventMessageList[msg] === undefined ||
      this.eventMessageList[msg] === false
    ) {
      return false;
    }
    return true;
  }

  callEvent(msg) {
    this.emptySprite.emit(msg);
  }
}

class Inventory {
  constructor(game) {
    this.game = game;
    this.inventory_area = {
      x1: game.screenWidth,
      x2: game.screenWidth + game.inventoryWidth,
      y1: 0,
      y2: game.screenHeight
    };

    // Size numbers
    this.inventory_w = game.inventoryWidth;
    this.inventory_size = game.inventorySize;
    this.gridStartY = game.inventoryWidth / 2;
    this.baseX = game.screenWidth + this.inventory_w / 2;
    this.baseY =
      game.screenHeight / (this.inventory_size + 1) / 2 + this.gridStartY;

    // What is this?
    this.magic_scale = 0.8;

    // Pixi elements
    this.inventoryContainer = new PIXI.Container();
    this.inventoryBackgroundGrp = new PIXI.Container();
    const backgroundScale = this.inventory_w / 144;

    this.inventUp = Alice.Object.fromImage(`${baseURL.requireAssets}up.png`);
    this.inventUp.scale.set(backgroundScale);
    this.inventUp.x = game.screenWidth;
    this.inventUp.y = 0;
    this.inventUp.interactive = true;
    this.inventUp.buttonMode = true;
    this.inventUp.on('click', () => {
      game.inventory.prevPage();
    });
    this.inventoryBackgroundGrp.addChild(this.inventUp);

    for (let i = 0; i < this.inventory_size; i += 1) {
      const inventBack = Alice.Object.fromImage(
        `${baseURL.requireAssets}inventory.png`
      );
      inventBack.scale.set(backgroundScale);
      inventBack.x = game.screenWidth;
      inventBack.y = this.gridStartY + i * this.inventory_w;
      this.inventoryBackgroundGrp.addChild(inventBack);
    }

    this.inventDown = Alice.Object.fromImage(
      `${baseURL.requireAssets}down.png`
    );
    this.inventDown.scale.set(backgroundScale);
    this.inventDown.x = game.screenWidth;
    this.inventDown.y =
      this.gridStartY + this.inventory_size * this.inventory_w;
    this.inventDown.interactive = true;
    this.inventDown.buttonMode = true;
    this.inventDown.on('click', () => {
      game.inventory.nextPage();
    });
    this.inventoryBackgroundGrp.addChild(this.inventDown);

    this.page = 0;

    this.update();
  }

  init() {
    // TODO
  }

  scaleDown(tool) {
    // When scene object is added to the inventory, scale it.
    tool.scale.set(1);
    const scale = Math.min(
      this.inventory_w / tool.width,
      this.inventory_w / tool.height
    );
    tool.scale.set(scale * this.magic_scale);
  }

  isInsideInventory(tool) {
    if (
      this.inventoryContainer.children.findIndex(
        element => element.name === tool.name
      ) < 0
    ) {
      return false;
    }
    return true;
  }

  add(tool) {
    if (this.isInsideInventory(tool)) {
      return;
    }
    // remove tool from the original scene and add to inventory container
    this.inventoryContainer.addChild(tool); // [INTERESTING: remove it from the original container]
    this.scaleDown(tool);
    this.game.reactionSystem.makeDraggable(tool);

    tool.inInventory = true;
    this.page = Math.floor((this.countValidObj() - 1) / 5);
    this.update();
  }

  remove(tool) {
    this.inventoryContainer.removeChild(tool);
    tool.inInventory = false;
    this.page = Math.floor((this.countValidObj() - 1) / 5);
    this.update();
  }

  update() {
    // Weird
    let count = 0;
    this.inventoryContainer.children.forEach(element => {
      if (!element.visible) return;

      element.x = this.baseX;
      const offset = count % 5;
      const inPage = Math.floor(count / 5);
      element.y =
        this.baseY +
        offset * this.inventory_w -
        (this.page - inPage) * this.game.screenHeight;
      element.inventPos = { x: element.x, y: element.y };
      count += 1;
    });
    this.updateArrow();
  }

  countValidObj() {
    return this.inventoryContainer.children.filter(element => element.visible)
      .length;
  }

  hasNextPage() {
    return this.countValidObj() > (this.page + 1) * this.inventory_size;
  }

  hasPrevPage() {
    return this.page > 0;
  }

  nextPage() {
    if (this.hasNextPage) {
      this.page += 1;
      this.update();
    }
  }

  prevPage() {
    if (this.hasPrevPage) {
      this.page -= 1;
      this.update();
    }
  }

  updateArrow() {
    // this.inventUp.visible = this.hasPrevPage();
    this.inventUp.interactive = this.hasPrevPage();
    // this.inventDown.visible = this.hasNextPage();
    this.inventDown.interactive = this.hasNextPage();
  }

  inventoryObserved(tool) {
    const message = `${tool.name} is observed`;
    if (this.interactionSystem.checkEventExist(message)) {
      this.interactionSystem.callEvent(message);
    }
  }

  inventoryUse(tool) {
    const collisionMap = this.getCollisionMap(tool);
    const sceneCollider = collisionMap.scene;
    const inventoryCollider = collisionMap.inventory;

    if (inventoryCollider.length > 0) {
      const message = `${tool.name}${this.game.eventSystem.template.combine}${
        inventoryCollider.pop().name
      }`;
      if (this.game.eventSystem.checkEventExist(message)) {
        this.game.eventSystem.callEvent(message);
        return;
      }
    }

    if (sceneCollider.length > 0) {
      const message = `${tool.name}${this.game.eventSystem.template.use}${
        sceneCollider.pop().name
      }`;
      if (this.game.eventSystem.checkEventExist(message)) {
        this.game.eventSystem.callEvent(message);
        return;
      }
    }

    this.game.soundManager.play('bad');
    tool.x = tool.inventPos.x;
    tool.y = tool.inventPos.y;
  }

  clearUp() {
    this.inventoryContainer.removeChildren();
  }

  popUp(tool) {
    this.inventoryContainer.removeChild(tool);
    this.inventoryContainer.addChild(tool);
  }
}

class SoundManager {
  constructor() {
    this.sound = PIXI.sound;
    this.baseURL = './Resources/Assets/require/sound/';
    this.initSystemSound();
  }

  initSystemSound() {
    this.sound.add('add', `${this.baseURL}add.wav`);
    this.sound.add('good', `${this.baseURL}use_good.wav`);
    this.sound.add('bad', `${this.baseURL}use_bad.wav`);
  }

  play(name, loop) {
    this.sound.play(name, { loop });
  }

  stop(name) {
    this.sound.stop(name);
  }

  load(name, url) {
    this.sound.add(name, url);
  }
}

class SceneManager {
  constructor(game) {
    this.currentScene = {};
    this.game = game;
    this.sceneContainer = new PIXI.Container();
  }

  getCurrentScene() {
    return this.currentScene;
  }

  getSceneByIndex(index) {
    return this.sceneContainer.getChildAt(index);
  }

  createScenes(num) {
    for (let i = 0; i < num; i += 1) {
      this.addScene(new Alice.Scene());
    }
  }

  addScene(scene) {
    this.sceneContainer.addChild(scene);
    scene.visible = false;
  }

  nextScene() {
    let currSceneIndex = this.sceneContainer.getChildIndex(this.currentScene);
    if (currSceneIndex + 1 >= this.sceneContainer.children.length) return;
    this.currentScene.visible = false;
    currSceneIndex += 1;
    this.currentScene = this.sceneContainer.getChildAt(currSceneIndex);
    this.currentScene.visible = true;
  }

  previousScene() {
    let currSceneIndex = this.sceneContainer.getChildIndex(this.currentScene);
    if (currSceneIndex <= 0) return;
    this.currentScene.visible = false;
    currSceneIndex -= 1;
    this.currentScene = this.sceneContainer.getChildAt(currSceneIndex);
    this.currentScene.visible = true;
  }

  jumpToScene(sceneIndex) {
    this.game.messageBox.stopConversation();
    const message = `${this.game.eventSystem.template.transit}${sceneIndex}`;
    this.game.eventSystem.callEvent(message);

    const toScene = this.sceneContainer.getChildAt(sceneIndex);
    if (this.currentScene) {
      this.currentScene.visible = false;
    }
    toScene.visible = true;
    this.currentScene = toScene;
  }

  start(index) {
    this.jumpToScene(index);
  }
}

class Utilities {
  constructor(game) {
    this.game = game;

    /*
              click and drag mouse events
          */
    this.onMouseDown = event => {
      if (this.mouseIsDown) return;
      this.data = event.data;

      this.mouseIsDown = true;
      this.original = [this.x, this.y];
      this.offset = {
        x: this.data.getLocalPosition(this.parent).x - this.x,
        y: this.data.getLocalPosition(this.parent).y - this.y
      };
      this.dragStart = false;
    };

    this.onMouseMove = () => {
      if (this.mouseIsDown && this.dragable) {
        this.newPosition = this.data.getLocalPosition(this.parent);
        const toX = this.newPosition.x - this.offset.x;
        const toY = this.newPosition.y - this.offset.y;

        if (
          game.utilities.distance(
            toX,
            toY,
            this.original[0],
            this.original[1]
          ) > 5
        ) {
          this.alpha = 0.5;
          this.x = this.newPosition.x - this.offset.x;
          this.y = this.newPosition.y - this.offset.y;
          if (!this.dragStart) {
            this.dragStart = true;
            game.utilities.toFrontLayer(this);
            if (this.DIY_DRAG !== undefined) this.DIY_DRAG();
          }
        }
      }
    };

    this.onMouseUp = e => {
      if (!this.mouseIsDown) return;

      if (this.dragStart) game.utilities.toOriginalLayer(this);

      this.alpha = 1;
      this.mouseIsDown = false;
      this.data = null;

      // debug.log("mouseUp")

      if (!this.dragStart) {
        [this.x, this.y] = this.original;
        debug.log(`click: ${this.name}`);
        if (this.clickable) {
          if (this.DIY_CLICK !== undefined) this.DIY_CLICK();
        }
      } else {
        game.emitDropEventOfObj(this);

        [this.x, this.y] = this.original;
        this.game.inventory.update();
      }
    };

    this.registerBasicEvents();
  }

  checkObjInsideWindow(obj) {
    return (
      obj.x > 0 &&
      obj.x < this.game.size[0] &&
      obj.y > 0 &&
      obj.y < this.game.size[1]
    );
  }

  distance(x1, y1, x2, y2) {
    return ((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)) ** 0.5;
  }

  hitTestRectangle(r1, r2) {
    // Define the variables we'll need to calculate
    let hit;
    // hit will determine whether there's a collision
    hit = false;

    // Find the center points of each sprite
    r1.centerX = r1.x; // + r1.width / 2;
    r1.centerY = r1.y; // + r1.height / 2;
    r2.centerX = r2.x; // + r2.width / 2;
    r2.centerY = r2.y; // + r2.height / 2;

    // Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;

    // Calculate the distance vector between the sprites
    const vx = r1.centerX - r2.centerX;
    const vy = r1.centerY - r2.centerY;

    // Figure out the combined half-widths and half-heights
    const combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    const combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    // Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {
      // A collision might be occuring. Check for a collision on the y axis
      if (Math.abs(vy) < combinedHalfHeights) {
        // There's definitely a collision happening
        hit = true;
      } else {
        // There's no collision on the y axis
        hit = false;
      }
    } else {
      // There's no collision on the x axis
      hit = false;
    }

    // `hit` will be either `true` or `false`
    return hit;
  }

  toFrontLayer(obj) {
    obj.temp = new Alice.Object();
    obj.originalParent = obj.parent;
    obj.originalParent.addChild(obj.temp);
    obj.originalParent.swapChildren(obj, obj.temp);
    this.game.topContainer.addChild(obj);
  }

  toOriginalLayer(obj) {
    obj.originalParent.addChild(obj);
    obj.originalParent = null;
    obj.parent.swapChildren(obj, obj.temp);
    obj.parent.removeChild(obj.temp);
    obj.temp = null;
  }

  pointInArea(p, area) {
    return p.x > area.x1 && p.x < area.x2 && p.y > area.y1 && p.y < area.y2;
  }

  registerBasicEvents() {
    document.addEventListener('mousewheel', ev => {
      if (ev.wheelDelta > 0) {
        this.game.inventory.prevPage();
      } else if (ev.wheelDelta < 0) {
        this.game.inventory.nextPage();
      }
    });

    // 2.window resize
    window.onresize = event => {
      this.game.resize();
    };
  }
}

class MessageBox {
  constructor(background, avatarEnable, game) {
    this.game = game;

    // the original background asset is built for 1280*720 screen
    this.backgronud = Alice.Object.fromImage(background.url);
    this.backgronud.anchor.set(0.5);

    // horizontal center
    this.backgronud.x = background.w / 2;
    this.backgronud.alpha = 0.8;

    const scale = (this.game.screenWidth / 1280) * 0.7;

    this.backgronud.scale.set(scale);
    this.backgronud.y = background.h - (220 * scale) / 2 - 10 * scale;

    this.pointArea = new PIXI.Sprite();
    this.pointArea.hitArea = new PIXI.Rectangle(
      0,
      0,
      this.game.screenWidth,
      this.game.screenHeight
    );
    this.pointArea.interactive = true;
    this.pointArea.buttonMode = true;
    this.pointArea.on('pointerdown', () => {
      if (game.messageBox) {
        game.messageBox.nextConversation();
      }
    });

    this.defaltStyle = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 46 * scale,
      fontWeight: 'bold',
      wordWrap: true,
      wordWrapWidth: 1051 * scale * 0.8
    });

    this.currentMsg = new PIXI.Text('', this.defaltStyle);
    this.currentMsg.anchor.set(0.5);
    this.currentMsg.x = this.backgronud.x;
    this.currentMsg.y = this.backgronud.y;
    this.currentMsg.text = '';

    this.holder = new Alice.Container();
    this.holder.addChild(this.pointArea);
    this.holder.addChild(this.backgronud);
    this.holder.addChild(this.currentMsg);
    this.holder.visible = false;

    this.messageBuffer = [];
    this.currentMsgIndex = 0;

    this.callBack = () => {};
  }

  nextConversation() {
    this.currentMsgIndex += 1;
    if (this.currentMsgIndex < this.messageBuffer.length) {
      this.currentMsg.text = this.messageBuffer[this.currentMsgIndex];
    } else {
      this.stopConversation();
    }
  }

  addMessage(msg) {
    this.messageBuffer.push(msg);
  }

  addMessages(msgs) {
    this.messageBuffer = this.messageBuffer.concat(msgs);
  }

  // Rename required
  startConversation(msgs, fn = null) {
    // this.startConversation();
    if (msgs.length === 0) {
      return;
    }
    if (this.messageBuffer.length > 0) {
      this.addMessages(msgs);
      return;
    }
    if (fn) this.callBack = fn;
    this.messageBuffer = msgs;
    this.currentMsgIndex = 0;
    this.currentMsg.text = this.messageBuffer[this.currentMsgIndex];
    this.holder.visible = true;
  }

  stopConversation() {
    this.messageBuffer = [];
    this.currentMsg.text = '';
    this.currentMsgIndex = 0;
    this.holder.visible = false;
    this.callBack = () => {};
  }
}

class GameManager {
  constructor() {
    this.screenWidth = 0;
    this.screenHeight = 0;
    this.inventorySize = 0;
    this.inventoryWidth = 0;

    this.inventory = {};
    this.sceneManager = {};
    this.topContainer = {};
    this.messageBox = {};
    this.stateManager = {};
    this.eventSystem = {};
    this.reactionSystem = {};
    this.soundManager = {};
    this.utilities = {};

    this.size = [0, 0];
    this.ratio = 0;
    this.stage = new PIXI.Stage(0x333333, true);
    this.renderer = PIXI.autoDetectRenderer(this.size[0], this.size[1], null);
  }

  init(width, height, inventorySize) {
    if (inventorySize < 5) {
      inventorySize = 5;
    }
    this.screenWidth = width;
    this.screenHeight = height;
    this.inventorySize = inventorySize;
    this.inventoryWidth = height / (inventorySize + 1);

    this.size = [this.screenWidth + this.inventoryWidth, this.screenHeight];
    this.ratio = this.size[0] / this.size[1];
    this.stage = new PIXI.Stage(0x333333, true);
    this.renderer = PIXI.autoDetectRenderer(this.size[0], this.size[1], null);
    document.body.appendChild(this.renderer.view);

    this.sceneManager = new SceneManager(this);
    this.inventory = new Inventory(this);
    this.topContainer = new Alice.Container();

    this.messageBox = new MessageBox(
      {
        w: width,
        h: height,
        scale: 1,
        url: `${baseURL.requireAssets}textbox.png`,
        a: 1
      },
      false,
      this
    );

    this.eventSystem = new AliceEventSystem();
    this.reactionSystem = new AliceReactionSystem(this);
    this.soundManager = new SoundManager();
    this.utilities = new Utilities(this);

    this.stage.addChild(this.sceneManager.sceneContainer);
    this.stage.addChild(this.inventory.inventoryBackgroundGrp);
    this.stage.addChild(this.inventory.inventoryContainer);
    this.stage.addChild(this.messageBox.holder);
    this.stage.addChild(this.topContainer);
  }

  initStateManager(states) {
    this.stateManager = new StateManager(states, this.eventSystem);
  }

  moveObjectToScene(obj, sceneIndex, x = null, y = null) {
    this.scene(sceneIndex).addChild(obj);
    if (x) {
      obj.x = x;
    }
    if (y) {
      obj.y = y;
    }
  }

  showInventory() {
    this.renderer.resize(
      this.screenWidth + this.inventoryWidth,
      this.screenHeight
    );
    this.ratio = this.size[0] / this.size[1];
    this.resize();
  }

  hideInventory() {
    this.renderer.resize(this.screenWidth, this.screenHeight);
    this.ratio = (this.size[0] - this.inventoryWidth) / this.size[1];
    this.resize();
  }

  scene(index) {
    return this.sceneManager.getSceneByIndex(index);
  }

  awake() {}

  start(index) {
    this.resize();
    this.sceneManager.start(index);
  }

  resize() {
    let w = 0;
    let h = 0;
    if (window.innerWidth / window.innerHeight >= this.ratio) {
      w = window.innerHeight * this.ratio;
      h = window.innerHeight;
    } else {
      w = window.innerWidth;
      h = window.innerWidth / this.ratio;
    }
    this.renderer.view.style.width = `${w}px`;
    this.renderer.view.style.height = `${h}px`;
  }

  emitDropEventOfObj(obj) {
    const collisionMap = this.getCollisionMap(obj);
    const sceneColliders = collisionMap.scene;
    const inventoryColliders = collisionMap.inventory;
    inventoryColliders.forEach(element => {
      let message = `${obj.name}${this.eventSystem.template.use}${
        element.name
      }`;
      if (this.eventSystem.checkEventExist(message)) {
        this.eventSystem.callEvent(message);
      }
      message = `${obj.name}${this.eventSystem.template.combine}${
        element.name
      }`;
      if (this.eventSystem.checkEventExist(message)) {
        this.eventSystem.callEvent(message);
      }
    });
    sceneColliders.forEach(element => {
      let message = `${obj.name}${this.eventSystem.template.use}${
        element.name
      }`;
      if (this.eventSystem.checkEventExist(message)) {
        this.soundManager.play('good');
        this.eventSystem.callEvent(message);
      }
      message = `${obj.name}${this.eventSystem.template.combine}${
        element.name
      }`;
      if (this.eventSystem.checkEventExist(message)) {
        this.soundManager.play('good');
        this.eventSystem.callEvent(message);
      }
    });
  }

  getCollisionMap(tool) {
    const objsInCurrScene = this.sceneManager.getCurrentScene().children;
    const sceneCollideList = objsInCurrScene.filter(
      element =>
        element.visible &&
        tool.name !== element.name &&
        this.utilities.hitTestRectangle(tool, element)
    );
    const objsInInventory = this.inventory.inventoryContainer.children;
    const inventoryCollideList = objsInInventory.filter(
      element =>
        element.name !== tool.name &&
        element.visible &&
        this.utilities.hitTestRectangle(tool, element)
    );

    return { scene: sceneCollideList, inventory: inventoryCollideList };
  }
}

class Message {
  constructor(text, style, avatar, narrator = '') {
    this.text = text;
    this.style = style;
    this.avatar = {};
    this.narrator = narrator;
  }
}

const myGame = new GameManager();

const animate = function() {
  requestAnimationFrame(animate);
  myGame.renderer.render(myGame.stage);
};

requestAnimationFrame(animate);
