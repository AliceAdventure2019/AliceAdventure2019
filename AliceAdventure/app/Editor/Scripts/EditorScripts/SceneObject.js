'use strict';

const {PIXI, FS, ID, Debug, Event} = require('./Utilities/Utilities');
const GameProperties = require('./GameProperties');
const Resizer = require('./Resizer');

// class
var SceneObject;

// variables
SceneObject = function(_id = null, _name = "untitled", _src = "", _bindScene = {id:0, name:'inventory'}, _clickable = true, _draggable = false){
	if (_id == null) _id = ID.newID; // NEVER MODIFY THIS
	this.id = _id;
	this.name = _name;
	this.src = _src; // "Assets/xxx"
	//this.isDefault = true;
	this.bindScene = _bindScene;
	this.clickable = _clickable;
	this.draggable = _draggable;

	this.selectAllowed = true;
	this.selected = false;
	this.dragAllowed = true;
	this.drag = { on: false, eventData: {}, offset: {x: 0, y: 0} };

	//this.properties = [];
	this.isBackdrop = false; // TODO remove this
	this.isCharacter = false; // TODO remove this
	this.sprite = null;
	this.filter = pixiFilters.outlineFilterGreen;
};

// static properties
SceneObject.AddEmptyObject = function(_name, _bindScene, _assignedPos = true){
	if (GameProperties.instance == null) return null; // no proj loaded
	let _defaultObj = {
		src: '../../Assets/picture.png',
		name: _name
	};
	let index = GameProperties.instance.objectList.length;
	let defaultPos = {x: 240, y: 180}; // center
	if (_assignedPos){
		let xStep = 80, yStep = 72, xNum = 5, yNum = 4;
		defaultPos = {
			x: (index % xNum + 1) * xStep,
			y: (Math.floor(index / xNum) % yNum + 1) * yStep
		}
	}
	if (_bindScene == null){
		_bindScene = GameProperties.instance.sceneList[0];
	}
	let _obj = new SceneObject(null, _defaultObj.name, _defaultObj.src, _bindScene);
	GameProperties.AddObject(_obj);
	_obj.InitSprite(_defaultObj.src);
	_obj.SetSprite(null, defaultPos);
	return _obj;
}

SceneObject.AddObject = function(_objInfo, _bindScene){
	if (GameProperties.instance == null) return null; // no proj loaded
	let _path = _objInfo.src;
	let _obj = new SceneObject(null, _objInfo.name, _path, _bindScene);
	GameProperties.AddObject(_obj);
	_obj.InitSprite(_path);
	return _obj;
};

SceneObject.LoadObject = function(_data){
	if (GameProperties.instance == null) return null; // no proj loaded
	let _obj = new SceneObject(_data.id, _data.name, _data.src, GameProperties.GetSceneById(_data.bindScene), _data.clickable, _data.draggable);
	GameProperties.AddObject(_obj);
	_obj.InitSprite(_data.src);
	_obj.SetSprite(null, _data.pos, _data.scale, _data.anchor, _data.active);

	if (_obj.bindScene.GetFirstObject().id == _obj.id) { // TODO get rid of this shit
		_obj.isBackdrop = true; 
		_obj.bindScene.bgSrc = _obj.src;
	}
	return _obj;
};

SceneObject.SetViewSize = function(w, h){
	viewW = w; viewH = h;
};

var pixiFilters = { // private
	outlineFilterGreen: new PIXI.filters.OutlineFilter(4, 0x99ff99), 
	outlineFilterRed: new PIXI.filters.OutlineFilter(4, 0xff9999), 
}; 

// functions
SceneObject.prototype.InitSprite = function(_url){
	if (!(this instanceof SceneObject)) return;
	this.sprite = PIXI.Sprite.fromImage(_url);
	if (this.bindScene.container != null) this.bindScene.container.addChild(this.sprite);
	this.SpriteInfoDefault();
};

SceneObject.prototype.SetSprite = function(_url, _pos, _scale, _anchor, _active){
	if (this.sprite == null) {console.log('sprite not inited');return}; // must be initiated before
	if (_url != null){
		this.src = _url;
		this.sprite.setTexture(PIXI.Texture.fromImage(_url));
	}
	//this.SpriteInfoDefault();
	if (_pos != null){
		this.sprite.x = _pos.x;
		this.sprite.y = _pos.y;		
	}
	if (_scale != null)
		this.sprite.scale.set(_scale.x, _scale.y);
	if (_anchor != null)
		this.sprite.anchor.set(_anchor.x, _anchor.y);
	if (_active != null)
		this.sprite.visible = _active;

	if (this.bindScene.GetFirstObject().id == this.id){ // TODO get rid of this shit
		this.bindScene.bgSrc = _url;
	}
};

SceneObject.prototype.SpriteInfoDefault = function(){
	if (this.sprite == null) return;
	this.sprite.x = 240;
	this.sprite.y = 180;
	this.sprite.scale.set(0.5, 0.5);
	this.sprite.anchor.set(0.5, 0.5);
	this.sprite.visible = true;
	this.sprite.interactive = true;
	this.sprite
		.on("pointerdown", (e)=>{this.OnPointerDown(e);})
		.on("pointermove", (e)=>{this.OnPointerMove(e);})
		.on("pointerup", (e)=>{this.OnPointerUp(e);})
		.on("pointerupoutside", (e)=>{this.OnPointerUp(e);})
		.on("pointerover", (e)=>{this.OnPointerOver(e);})
		.on("pointerout", (e)=>{this.OnPointerOut(e);});
    this.sprite.id = this.id;	
}

SceneObject.prototype.SwitchScene = function(toScene, aboveObj) {
	if (toScene.id == 0){ // inventory
		console.log('to inv');
		if (this.sprite.parent != null){
			this.sprite.parent.removeChild(this.sprite);
		}
    	this.bindScene = toScene;
    	return;
	} 

	if(aboveObj == null) {
        toScene.container.addChildAt(this.sprite, 0);
    } else {
        if(this.id == aboveObj.id) return;
        let indexA = -1;
        let indexB = -1;
        for(var i = 0; i<toScene.container.children.length; i++) {
            if(toScene.container.children[i].id == aboveObj.id) {
                indexB = i;
                continue;
            }
            if(toScene.container.children[i].id == this.id) {
                indexA = i;
                continue;
            }

            if(indexA != -1 && indexB!=-1) {
                break;
            }
        }

        if(indexA == indexB + 1) {
            return;
        }

        if(indexA == -1) {
            toScene.container.addChildAt(this.sprite,indexB+1);
        } else if(indexA > indexB) {
            var index = indexB+1
            toScene.container.addChildAt(this.sprite,index);
        } else {
            toScene.container.addChildAt(this.sprite,indexB);
        }
    }
    
    this.bindScene = toScene;
    GameProperties.updateOrderByScene(toScene);
};

SceneObject.prototype.ToggleLock = function(){
	this.dragAllowed = !this.dragAllowed;
	if (this.dragAllowed){
		this.filter = pixiFilters.outlineFilterGreen;
		if (this.selected) this.sprite.filters = [this.filter];
	} else {
		this.filter = pixiFilters.outlineFilterRed;
		if (this.selected) this.sprite.filters = [this.filter];
		Resizer.hideHelper();
	}
}

SceneObject.prototype.DeleteThis = function(){
	if (this.sprite != null){
		if (this.sprite.parent != null) this.sprite.parent.removeChild(this.sprite);
		this.sprite.destroy();
	}
	GameProperties.DeleteObject(this);
	Event.Broadcast('delete-object', this.id);
};

/*SceneObject.prototype.AddUserProperty = function(_key, _type, _value){
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
};*/

SceneObject.prototype.SelectOn = function(){
	this.selected = true;
	this.sprite.filters = [this.filter];
	//Resizer.showHelper(this.sprite);	
};

SceneObject.prototype.SelectOff = function(){
	this.selected = false;
	this.sprite.filters = [];
	Resizer.hideHelper(this.sprite);
};

SceneObject.prototype.OnPointerDown = function(_event){
	// Select this object
	if (this.selectAllowed){
		Event.Broadcast('object-sprite-click', this);
	}

	// Start dragging
	if (this.dragAllowed){
		this.drag.on = true;
		this.drag.eventData = _event.data;
		this.drag.offset = this.drag.eventData.getLocalPosition(this.sprite.parent);
		this.drag.offset.x -= this.sprite.x;
		this.drag.offset.y -= this.sprite.y;
		Resizer.showHelper(this.sprite);
	}
};

SceneObject.prototype.OnPointerMove = function(_event){
	// While dragging
	if (this.dragAllowed && this.drag.on){
		var newPosition = this.drag.eventData.getLocalPosition(this.sprite.parent);
		this.sprite.x = Math.floor(newPosition.x) - this.drag.offset.x;
		this.sprite.y = Math.floor(newPosition.y) - this.drag.offset.y;
		Resizer.updateBox();
	}
};

SceneObject.prototype.OnPointerUp = function(_event){
	// Stop dragging
	if (this.dragAllowed){
		this.drag.on = false;
	}
};

SceneObject.prototype.OnPointerOver = function(_event){
	// Stop dragging
	if (this.dragAllowed && this.selected){
		Resizer.showHelper(this.sprite);
	}
};

SceneObject.prototype.OnPointerOut = function(_event){
	// Stop dragging
	if (this.dragAllowed && this.selected){
		//Resizer.hideHelper();
	}
};

SceneObject.prototype.toJsonObject = function(){
	return {
		id: this.id, 
		name: this.name, 
		src: this.src, 
		//isDefault: this.isDefault, 
		pos: {x: this.sprite.x, y: this.sprite.y}, 
		anchor: {x: this.sprite.anchor.x, y: this.sprite.anchor.y}, 
		scale: {x: this.sprite.scale.x, y: this.sprite.scale.y}, 
		active: this.sprite.visible, 
		clickable: this.clickable, 
		draggable: this.draggable, 
		bindScene: this.bindScene.id, 
		//properties: _o.properties, 
	};
};

module.exports = SceneObject;