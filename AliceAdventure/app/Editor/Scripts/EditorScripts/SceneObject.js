const { PIXI, FS, ID, Debug, Event } = require('./Utilities/Utilities');
const GameProperties = require('./GameProperties');
const Resizer = require('./Resizer');
const View = require('./View');

// class
let SceneObject;

let dragOn = null;

// variables
SceneObject = function(
  _id = null,
  _name = 'untitled',
  _src = '',
  _bindScene = { id: 0, name: 'inventory' },
  _collectable = true,
  _clickable = true,
  _draggable = false,
  _description = '',
  _conversation = '',
  _content = [],
  _parent = -1
) {
  if (_id == null) _id = ID.newID; // NEVER MODIFY THIS
  this.id = _id;
  this.name = _name;
  this.src = _src; // "Assets/xxx"
  // this.isDefault = true;
  this.bindScene = _bindScene;
  this.collectable = _collectable;
  this.clickable = _clickable;
  this.draggable = _draggable;

  this.selectAllowed = true;
  this.selected = false;
  this.dragAllowed = true;
  this.drag = { on: false, eventData: {}, offset: { x: 0, y: 0 } };

  // this.properties = [];
  this.isBackdrop = false;
  this.isCharacter = false; // TODO remove this
  this.sprite = null;
  this.filter = pixiFilters.outlineFilterGreen;
  this.description = _description;
  this.conversation = _conversation;

  this.content = _content;
  this.parent = _parent;
};

// static properties
SceneObject.AddEmptyObject = function(
  _name,
  _bindScene,
  _assignedPos = true,
  _description,
  _conversation
) {
  if (GameProperties.instance == null) return null; // no proj loaded
  const _defaultObj = {
    src: '../../Assets/picture.png',
    name: _name,
    description: _description,
    conversation: _conversation
  };
  const index = GameProperties.instance.objectList.length;
  let defaultPos = { x: 240, y: 180 }; // center
  if (_assignedPos) {
    const xStep = 80;

    const yStep = 72;

    const xNum = 5;

    const yNum = 4;
    defaultPos = {
      x: ((index % xNum) + 1) * xStep,
      y: ((Math.floor(index / xNum) % yNum) + 1) * yStep
    };
  }
  if (_bindScene == null) {
    _bindScene = GameProperties.instance.sceneList[0];
  }
  const _obj = new SceneObject(
    null,
    _defaultObj.name,
    _defaultObj.src,
    _bindScene
  );
  GameProperties.AddObject(_obj);
  _obj.InitSprite(_defaultObj.src);
  _obj.SetSprite(null, defaultPos);
  return _obj;
};

SceneObject.AddBackdrop = function(_objInfo, _bindScene) {
  if (GameProperties.instance == null) return null; // no proj loaded
  const _path = _objInfo.src;
  const _obj = new SceneObject(null, 'Backdrop', _path, _bindScene);
  _obj.dragAllowed = false;
  _obj.isBackdrop = true;
  _obj.clickable = false;
  _obj.draggable = false;
  _obj.SetSprite(_path, {
    x: GameProperties.instance.projectData.viewWidth / 2,
    y: GameProperties.instance.projectData.viewHeight / 2
  });
  GameProperties.AddObject(_obj);
  _obj.InitSprite(_path);
  _obj.sprite.x = GameProperties.instance.projectData.viewWidth / 2;
  _obj.sprite.y = GameProperties.instance.projectData.viewHeight / 2;
  _obj.sprite.width = GameProperties.instance.projectData.viewWidth;
  _obj.sprite.height = GameProperties.instance.projectData.viewHeight;
  _obj.sprite.texture.baseTexture.on('loaded', () => {
    _obj.sprite.width = GameProperties.instance.projectData.viewWidth;
    _obj.sprite.height = GameProperties.instance.projectData.viewHeight;
  });

  return _obj;
};

SceneObject.AddObject = function(_objInfo, _bindScene) {
  if (GameProperties.instance == null) return null; // no proj loaded
  const _path = _objInfo.src;
  const _obj = new SceneObject(null, _objInfo.name, _path, _bindScene);
  GameProperties.AddObject(_obj);
  _obj.InitSprite(_path);
  console.log(_obj.sprite);
  return _obj;
};

SceneObject.AddContent = function(_objInfo, _bindObject) {
  if (GameProperties.instance == null) return null; // no proj loaded
  const _path = _objInfo.src;
  const _obj = new SceneObject(null, _objInfo.name, _path, {
    id: -1,
    name: 'Container'
  });
  _obj.parent = _bindObject.id;
  _bindObject.content.push(_obj.id);
  GameProperties.AddObject(_obj);
  console.log(_bindObject);
  return _obj;
};

SceneObject.LoadObject = function(_data) {
  if (GameProperties.instance == null) return null; // no proj loaded
  const _obj = new SceneObject(
    _data.id,
    _data.name,
    _data.src,
    GameProperties.GetSceneById(_data.bindScene),
    _data.collectable,
    _data.clickable,
    _data.draggable,
    _data.description,
    _data.conversation,
    _data.content,
    _data.parent
  );
  GameProperties.AddObject(_obj);
  if (_data.bindScene >= 0) {
    _obj.InitSprite(_data.src);
    _obj.SetSprite(null, _data.pos, _data.scale, _data.anchor, _data.active);
    if (_obj.bindScene.GetFirstObject().id === _obj.id) {
      _obj.isBackdrop = true;
      _obj.collectable = false;
      _obj.clickable = false;
      _obj.draggable = false;
      _obj.dragAllowed = false;
      _obj.bindScene.bgSrc = _obj.src;
    }
  }
  _obj.content = _data.content.map(obj => obj.id);
  _obj.parent = _data.parent;

  return _obj;
};

SceneObject.SetViewSize = function(w, h) {
  viewW = w;
  viewH = h;
};

var pixiFilters = {
  // private
  outlineFilterGreen: new PIXI.filters.OutlineFilter(4, 0x99ff99),
  outlineFilterRed: new PIXI.filters.OutlineFilter(4, 0xff9999)
};

// functions
SceneObject.prototype.InitSprite = function(_url) {
  if (!(this instanceof SceneObject)) return;
  this.sprite = PIXI.Sprite.fromImage(_url);
  if (this.bindScene.container != null)
    this.bindScene.container.addChild(this.sprite);
  this.SpriteInfoDefault();
};

SceneObject.prototype.SetSprite = function(
  _url,
  _pos,
  _scale,
  _anchor,
  _active,
  _description,
  _conversation
) {
  if (this.sprite == null) {
    console.log('sprite not inited');
    return;
  } // must be initiated before
  if (_url != null) {
    this.src = _url;
    this.sprite.setTexture(PIXI.Texture.fromImage(_url));
  }
  // this.SpriteInfoDefault();
  if (_pos != null) {
    this.sprite.x = _pos.x;
    this.sprite.y = _pos.y;
  }
  if (_scale != null) this.sprite.scale.set(_scale.x, _scale.y);
  if (_anchor != null) this.sprite.anchor.set(_anchor.x, _anchor.y);
  if (_active != null) this.sprite.visible = _active;
  if (_description != null) {
    this.sprite.description = _description;
  }
  if (_conversation != null) {
    this.sprite.conversation = _conversation;
  }

  if (this.bindScene.GetFirstObject().id == this.id) {
    this.bindScene.bgSrc = _url;
  }
  if (this.isBackdrop) {
    this.sprite.width = GameProperties.instance.projectData.viewWidth;
    this.sprite.height = GameProperties.instance.projectData.viewHeight;
    this.sprite.texture.baseTexture.on('loaded', () => {
      this.sprite.width = GameProperties.instance.projectData.viewWidth;
      this.sprite.height = GameProperties.instance.projectData.viewHeight;
    });
  }
};

SceneObject.prototype.SpriteInfoDefault = function() {
  if (this.sprite == null) return;
  this.sprite.x = GameProperties.instance.projectData.viewWidth / 2;
  this.sprite.y = GameProperties.instance.projectData.viewHeight / 2;
  this.sprite.scale.set(0.5, 0.5);
  this.sprite.anchor.set(0.5, 0.5);
  this.sprite.visible = true;
  this.sprite.interactive = true;
  this.sprite.description = 'none';
  this.sprite.conversation = 'none';

  this.sprite
    .on('pointerdown', e => {
      this.OnPointerDown(e);
    })
    .on('pointermove', e => {
      this.OnPointerMove(e);
    })
    .on('pointerup', e => {
      this.OnPointerUp(e);
    })
    .on('pointerupoutside', e => {
      this.OnPointerUpOutside(e);
    })
    .on('pointerover', e => {
      this.OnPointerOver(e);
    })
    .on('pointerout', e => {
      this.OnPointerOut(e);
    });
  this.sprite.id = this.id;
};

SceneObject.prototype.SwitchScene = function(toScene, aboveObj) {
  if (toScene.id == 0) {
    // inventory
    console.log('to inv');
    if (this.sprite.parent != null) {
      this.sprite.parent.removeChild(this.sprite);
    }
    this.bindScene = toScene;
    return;
  }

  if (aboveObj == null) {
    toScene.container.addChildAt(this.sprite, 0);
  } else {
    if (this.id == aboveObj.id) return;
    let indexA = -1;
    let indexB = -1;
    for (let i = 0; i < toScene.container.children.length; i++) {
      if (toScene.container.children[i].id == aboveObj.id) {
        indexB = i;
        continue;
      }
      if (toScene.container.children[i].id == this.id) {
        indexA = i;
        continue;
      }

      if (indexA != -1 && indexB != -1) {
        break;
      }
    }

    if (indexA == indexB + 1) {
      return;
    }

    if (indexA == -1) {
      toScene.container.addChildAt(this.sprite, indexB + 1);
    } else if (indexA > indexB) {
      const index = indexB + 1;
      toScene.container.addChildAt(this.sprite, index);
    } else {
      toScene.container.addChildAt(this.sprite, indexB);
    }
  }

  this.bindScene = toScene;
  GameProperties.updateOrderByScene(toScene);
};

SceneObject.prototype.ToggleLock = function() {
  this.dragAllowed = !this.dragAllowed;
  if (this.dragAllowed) {
    this.filter = pixiFilters.outlineFilterGreen;
    if (this.selected) this.sprite.filters = [this.filter];
  } else {
    this.filter = pixiFilters.outlineFilterRed;
    if (this.selected) this.sprite.filters = [this.filter];
    Resizer.hideHelper();
  }
};

SceneObject.prototype.DeleteThis = function() {
  if (this.sprite != null) {
    if (this.sprite.parent != null) this.sprite.parent.removeChild(this.sprite);
    this.sprite.destroy();
  }
  this.content.forEach(element => {
    GameProperties.DeleteObject(GameProperties.GetObjectById(element));
  });
  GameProperties.DeleteObject(this);
  this.id = -1;
  this.name = 'null';
  Event.Broadcast('delete-object', this.id);
};

SceneObject.prototype.HideThis = function() {
  // this.visible = false;
  if (this.sprite != null) {
    if (this.sprite.parent != null) this.sprite.parent.removeChild(this.sprite);
    this.sprite.destroy();
  }
  Event.Broadcast('delete-object', this.id);
};

/* SceneObject.prototype.AddUserProperty = function(_key, _type, _value){
	this.properties.push({
		key: _key,
		type: _type, 
		value: _value
	});
};

SceneObject.prototype.GetUserProperty = function(_name){
	for (var i in this.properties){
		if (this.properties[i].name == _name){
			return this.properties[i].value;
		}
	}
	return undefined;
};

SceneObject.prototype.EditDefinedProperty = function(_name, _value){
	switch (_name){
	case 'name': 
		this[_name] = _value;
		break;
	case 'x':
	case 'y':
	case 'active':
		// TODO: set sprite attribute
		break;
	default:
		Debug.LogError("Invalid property name: " + _name + "for object " + this.name);
		return;
	}
};

SceneObject.prototype.EditUserProperty = function(_name, _value){
	if (this.properties[_name] == undefined) {
		Debug.LogError("Invalid property name: " + _name + "for object " + this.name);
		return;
	}
	if (this.properties[_name].type != typeof _value) {
		Debug.LogError("Invalid type of value: " + _value + "for object " + this.name);
		return;
	}

	this.properties[_name].value = _value;
}; */

SceneObject.prototype.SelectOn = function() {
  this.selected = true;
  this.sprite.filters = [this.filter];
  // Resizer.showHelper(this.sprite);
};

SceneObject.prototype.SelectOff = function() {
  this.selected = false;
  this.sprite.filters = [];
  Resizer.hideHelper(this.sprite);
};

SceneObject.prototype.OnPointerDown = function(_event) {
  // Select this object
  if (this.selectAllowed) {
    Event.Broadcast('object-sprite-click', this);
  }

  // Start dragging
  if (this.dragAllowed) {
    console.log('Drag start');
    dragOn = this;
    this.drag.on = true;
    this.drag.eventData = _event.data;
    this.drag.offset = this.drag.eventData.getLocalPosition(this.sprite.parent);
    this.drag.offset.x -= this.sprite.x;
    this.drag.offset.y -= this.sprite.y;
    this.sprite.alpha = 0.6;
    Resizer.showHelper(this.sprite);
    // this.sprite.interactive = false;
  }
};

SceneObject.prototype.OnPointerMove = function(_event) {
  // While dragging
  if (this.dragAllowed && this.drag.on) {
    const newPosition = this.drag.eventData.getLocalPosition(
      this.sprite.parent
    );
    this.sprite.x = Math.floor(newPosition.x) - this.drag.offset.x;
    this.sprite.y = Math.floor(newPosition.y) - this.drag.offset.y;
    Resizer.updateBox();
  }
};

SceneObject.prototype.OnPointerUp = function(_event) {
  console.log(this);
  console.log(_event);
  if (!dragOn) {
    // drag from outside
    console.log(View.HasDragData());
    console.log(View.HasDragData.data);
    if (!View.HasDragData()) return;
    // if (!this.dragAllowed && !View.HasDragData()) return;
    if (!this.isBackdrop) {
      if (
        confirm(`Do you want to put this object inside/behind ${this.name}?`)
      ) {
        Event.Broadcast('add-content', [_event, this]);
        // this.content.push()
      } else {
        Event.Broadcast('add-object', _event);
      }
    } else {
      // console.log(_event);
      Event.Broadcast('add-object', _event);
    }
  } else {
    // drag from inside
    console.log(dragOn.dragAllowed);
    if (!dragOn.dragAllowed) return;
    for (
      let i = GameProperties.instance.objectList.length - 1;
      i >= 0;
      i -= 1
    ) {
      const obj = GameProperties.instance.objectList[i];
      console.log(obj);
      if (
        obj.bindScene.id === dragOn.bindScene.id &&
        obj.id !== dragOn.id &&
        !obj.isBackdrop &&
        obj.sprite.containsPoint(
          _event.data.getLocalPosition(dragOn.sprite.parent)
        )
      ) {
        if (
          confirm(
            `Do you want to put ${dragOn.name} inside/behind ${obj.name}?`
          )
        ) {
          dragOn.bindScene = { id: -1, name: 'Container' };
          obj.content.push(dragOn.id);
          dragOn.parent = obj.id;
          // this.parent.content.foreach(el => {
          //   GameProperties.GetObjectById(el).parent = -1;
          // })
          dragOn.HideThis();
        }
        break;
      }
    }
    dragOn = null;
  }

  // Stop dragging
  if (this.dragAllowed) {
    this.drag.on = false;
    this.sprite.alpha = 1;
  }
  // console.log('OnPointerUp');
};

SceneObject.prototype.OnPointerUpOutside = function(_event) {
  // Stop dragging
  if (this.dragAllowed) {
    this.drag.on = false;
  }
  // console.log('OnPointerUp');
};

SceneObject.prototype.OnPointerOver = function(_event) {
  // Stop dragging
  if (this.dragAllowed && this.selected) {
    Resizer.showHelper(this.sprite);
  }
};

SceneObject.prototype.OnPointerOut = function(_event) {
  // Stop dragging
  if (this.dragAllowed && this.selected) {
    // Resizer.hideHelper();
  }
};

SceneObject.prototype.toJsonObject = function() {
  return {
    id: this.id,
    name: this.name,
    src: this.src,
    // isDefault: this.isDefault,
    pos: {
      x: this.bindScene.id >= 0 ? this.sprite.x : 0,
      y: this.bindScene.id >= 0 ? this.sprite.y : 0
    },
    anchor: {
      x: this.bindScene.id >= 0 ? this.sprite.anchor.x : 0.5,
      y: this.bindScene.id >= 0 ? this.sprite.anchor.y : 0.5
    },
    scale: {
      x: this.bindScene.id >= 0 ? this.sprite.scale.x : 1,
      y: this.bindScene.id >= 0 ? this.sprite.scale.y : 1
    },
    active: this.bindScene.id >= 0 ? this.sprite.visible : false,
    collectable: this.collectable,
    clickable: this.clickable,
    draggable: this.draggable,
    bindScene: this.bindScene.id,
    description: this.description,
    conversation: this.conversation,
    content: this.content.map(elemId => ({
      id: elemId,
      name: GameProperties.GetObjectById(elemId).name
    })),
    parent: this.parent
    // properties: _o.properties,
  };
};

module.exports = SceneObject;
