const { PIXI, FS, ID, Debug, Event } = require('./Utilities/Utilities');
const GameProperties = require('./GameProperties');
const Resizer = require('./Resizer');

// class
let SceneObject;

// variables
SceneObject = function (
  _id = null,
  _name = 'untitled',
  _src = '',
  _bindScene = { id: 0, name: 'inventory' },
  _collectable = false,
  _draggable = false,
  _description = '',
  _content = []
) {
  if (_id == null) _id = ID.newID; // NEVER MODIFY THIS
  this.id = _id;
  this.name = _name;
  this.src = _src; // "Assets/xxx"
  // this.isDefault = true;
  this.bindScene = _bindScene;
  this.collectable = _collectable;
  this.draggable = _draggable;

  this.selectAllowed = true;
  this.selected = false;
  this.dragAllowed = true;
  this.drag = { on: false, eventData: {}, offset: { x: 0, y: 0 } };

  // this.properties = [];
  this.isBackdrop = false; // TODO remove this
  this.isCharacter = false; // TODO remove this
  this.sprite = null;
  this.filter = pixiFilters.outlineFilterGreen;
  this.description = _description;

  this.content = _content;
};

// static properties
SceneObject.AddEmptyObject = function (
  _name,
  _bindScene,
  _assignedPos = true,
  _description
) {
  if (GameProperties.instance == null) return null; // no proj loaded
  const _defaultObj = {
    src: '../../Assets/picture.png',
    name: _name,
    description: _description
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

SceneObject.AddObject = function (_objInfo, _bindScene) {
  if (GameProperties.instance == null) return null; // no proj loaded
  const _path = _objInfo.src;
  const _obj = new SceneObject(null, _objInfo.name, _path, _bindScene);
  GameProperties.AddObject(_obj);
  _obj.InitSprite(_path);
  return _obj;
};

SceneObject.LoadObject = function (_data) {
  if (GameProperties.instance == null) return null; // no proj loaded
  const _obj = new SceneObject(
    _data.id,
    _data.name,
    _data.src,
    GameProperties.GetSceneById(_data.bindScene),
    _data.collectable,
    _data.draggable,
    _data.description
  );
  GameProperties.AddObject(_obj);
  _obj.InitSprite(_data.src);
  _obj.SetSprite(null, _data.pos, _data.scale, _data.anchor, _data.active);

  if (_obj.bindScene.GetFirstObject().id == _obj.id) {
    // TODO get rid of this shit
    _obj.isBackdrop = true;
    _obj.collectable = false;
    _obj.draggable = false;
    _obj.bindScene.bgSrc = _obj.src;
  }
  return _obj;
};

SceneObject.SetViewSize = function (w, h) {
  viewW = w;
  viewH = h;
};

var pixiFilters = {
  // private
  outlineFilterGreen: new PIXI.filters.OutlineFilter(4, 0x99ff99),
  outlineFilterRed: new PIXI.filters.OutlineFilter(4, 0xff9999)
};

// functions
SceneObject.prototype.InitSprite = function (_url) {
  if (!(this instanceof SceneObject)) return;
  this.sprite = PIXI.Sprite.fromImage(_url);
  if (this.bindScene.container != null)
    this.bindScene.container.addChild(this.sprite);
  this.SpriteInfoDefault();
};

SceneObject.prototype.SetSprite = function (
  _url,
  _pos,
  _scale,
  _anchor,
  _active,
  _description
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

  if (this.bindScene.GetFirstObject().id == this.id) {
    // TODO get rid of this shit
    this.bindScene.bgSrc = _url;
  }
};

SceneObject.prototype.SpriteInfoDefault = function () {
  if (this.sprite == null) return;
  this.sprite.x = 240;
  this.sprite.y = 180;
  this.sprite.scale.set(0.5, 0.5);
  this.sprite.anchor.set(0.5, 0.5);
  this.sprite.visible = true;
  this.sprite.interactive = true;
  this.sprite.description = 'none';
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

SceneObject.prototype.SwitchScene = function (toScene, aboveObj) {
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

SceneObject.prototype.ToggleLock = function () {
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

SceneObject.prototype.DeleteThis = function () {
  if (this.sprite != null) {
    if (this.sprite.parent != null) this.sprite.parent.removeChild(this.sprite);
    this.sprite.destroy();
  }
  GameProperties.DeleteObject(this);
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

SceneObject.prototype.SelectOn = function () {
  this.selected = true;
  this.sprite.filters = [this.filter];
  // Resizer.showHelper(this.sprite);
};

SceneObject.prototype.SelectOff = function () {
  this.selected = false;
  this.sprite.filters = [];
  Resizer.hideHelper(this.sprite);
};

SceneObject.prototype.OnPointerDown = function (_event) {
  // Select this object
  if (this.selectAllowed) {
    Event.Broadcast('object-sprite-click', this);
  }

  // Start dragging
  if (this.dragAllowed) {
    console.log('Drag start');
    this.drag.on = true;
    this.drag.eventData = _event.data;
    this.drag.offset = this.drag.eventData.getLocalPosition(this.sprite.parent);
    this.drag.offset.x -= this.sprite.x;
    this.drag.offset.y -= this.sprite.y;
    this.sprite.alpha = 0.5;
    Resizer.showHelper(this.sprite);
    // this.sprite.interactive = false;
  }
};

SceneObject.prototype.OnPointerMove = function (_event) {
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

SceneObject.prototype.OnPointerUp = function (_event) {
  console.log(_event);
  if (!this.drag.on) {
    if (!this.isBackdrop) {
      if (
        confirm(`Do you want to put this object inside/behind ${this.name}?`)
      ) {
        // this.content.pu;
      } else {
        Event.Broadcast('add-object', _event);
      }
    } else {
      // console.log(_event);
      Event.Broadcast('add-object', _event);
    }
  } else {
    for (
      let i = GameProperties.instance.objectList.length - 1;
      i >= 0;
      i -= 1
    ) {
      const obj = GameProperties.instance.objectList[i];
      if (
        obj.bindScene.id === this.bindScene.id &&
        obj.id !== this.id &&
        !obj.isBackdrop &&
        obj.sprite.containsPoint(
          _event.data.getLocalPosition(this.sprite.parent)
        )
      ) {
        if (
          confirm(`Do you want to put this object inside/behind ${obj.name}?`)
        ) {
          // this.content.pu;
        }
        break;
      }
    }
  }

  // Stop dragging
  if (this.dragAllowed) {
    this.drag.on = false;
    this.sprite.alpha = 1;
  }
  // console.log('OnPointerUp');
};

SceneObject.prototype.OnPointerUpOutside = function (_event) {
  // Stop dragging
  if (this.dragAllowed) {
    this.drag.on = false;
  }
  // console.log('OnPointerUp');
};

SceneObject.prototype.OnPointerOver = function (_event) {
  // Stop dragging
  if (this.dragAllowed && this.selected) {
    Resizer.showHelper(this.sprite);
  }
};

SceneObject.prototype.OnPointerOut = function (_event) {
  // Stop dragging
  if (this.dragAllowed && this.selected) {
    // Resizer.hideHelper();
  }
};

SceneObject.prototype.toJsonObject = function () {
  return {
    id: this.id,
    name: this.name,
    src: this.src,
    // isDefault: this.isDefault,
    pos: { x: this.sprite.x, y: this.sprite.y },
    anchor: { x: this.sprite.anchor.x, y: this.sprite.anchor.y },
    scale: { x: this.sprite.scale.x, y: this.sprite.scale.y },
    active: this.sprite.visible,
    collectable: this.collectable,
    draggable: this.draggable,
    bindScene: this.bindScene.id,
    description: this.description,
    content: this.content
    // properties: _o.properties,
  };
};

module.exports = SceneObject;
