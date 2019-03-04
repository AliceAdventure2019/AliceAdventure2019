'use strict';

const {Event} = require('./Utilities/Utilities');
const GameProperties = require('./GameProperties');
const SceneObject = require('./SceneObject');
const View = require('./View');

// class
var GalleryView;

// variables
GalleryView = function(_bindElementID, _height = -1, _width = -1){
	View.call(this, "GalleryView", _height, _width, _bindElementID);	
	this.vModel = null;
	this.objSelected = null;
};
GalleryView.prototype = new View();

GalleryView.ImageLibrary = {
	backdrop:[
		{name:'Day', src:'../../Assets/backdrop/backdrop.png'},
		{name:'Night', src:'../../Assets/backdrop/night.png'},
		{name:'Room', src:'../../Assets/backdrop/room_basic.png'},
		{name:'Classroom', src:'../../Assets/backdrop/classroom.png'},
		{name:'Library', src:'../../Assets/backdrop/library.png'},
		{name:'Kitchen', src:'../../Assets/backdrop/kitchen.png'},
		{name:'Bathroom', src:'../../Assets/backdrop/bathroom.png'},
		{name:'Win', src:'../../Assets/backdrop/win.png'},
		{name:'Mountain view', src:'../../Assets/backdrop/mountainView.png'},
		{name:'Beach', src:'../../Assets/backdrop/beach_org.png'},
		
	],
	character:[
		{name:'Alice brave', src:'../../Assets/character/alice_brave.png'},
		{name:'Alice standing', src:'../../Assets/character/alice_standing.png'},
		{name:'Hero1', src:'../../Assets/character/hero1.png'},
		{name:'Hero2', src:'../../Assets/character/hero2.png'},
		{name:'Hero3', src:'../../Assets/character/hero3.png'},
		{name:'Hero4', src:'../../Assets/character/hero4.png'},
		{name:'Cat', src:'../../Assets/character/cat.png'},
		{name:'Cat sad', src:'../../Assets/character/cat_sad.png'},
		{name:'Dog happy', src:'../../Assets/character/dog_happy.png'},
		{name:'Wizard1', src:'../../Assets/character/wizard_student.png'},
		{name:'Wizard2', src:'../../Assets/character/wizard_student2.png'},
		{name:'Wizard3', src:'../../Assets/character/wizard_student3.png'},
		{name:'Boy', src:'../../Assets/character/boy.png'},
		{name:'Shopper', src:'../../Assets/character/shopper.png'},
		{name:'BusinessMan', src:'../../Assets/character/businessman.png'},
		{name:'Mad hat', src:'../../Assets/character/mad_hat.png'},
		{name:'Monster1', src:'../../Assets/character/monster1.png'},
		{name:'Monster2', src:'../../Assets/character/monster2.png'},
		{name:'Orange cat', src:'../../Assets/character/orange_cat.png'},
		{name:'Robot', src:'../../Assets/character/robot.png'},
		{name:'Tweedle dee', src:'../../Assets/character/tweedle_dee.png'},
		{name:'Girl unhappy', src:'../../Assets/character/girl_unhappy.png'},
		// {...}
	],
	item:[
		{name:'Calendar', src:'../../Assets/item/calendar.png'},
		{name:'Old photo', src:'../../Assets/item/old_photo.png'},
		{name:'Clock', src:'../../Assets/item/clock.png'},
		{name:'Eraser', src:'../../Assets/item/eraser.png'},
		{name:'Pencil', src:'../../Assets/item/pencil.png'},
		{name:'Bag', src:'../../Assets/item/bag.png'},
		{name:'Magnifier', src:'../../Assets/item/magnifier.png'},
		{name:'Window1', src:'../../Assets/item/window_day.png'},
		{name:'Window2', src:'../../Assets/item/window_night.png'},
		{name:'Blackboard', src:'../../Assets/item/blackboard.png'},
		{name:'Money', src:'../../Assets/item/money.png'},
		{name:'Wallet', src:'../../Assets/item/wallet.png'},
		{name:'Magic wand', src:'../../Assets/item/magicwand.png'},
		{name:'Blender', src:'../../Assets/item/blender.png'},
		{name:'Bluepaint', src:'../../Assets/item/bluepaint.png'},
		{name:'Book', src:'../../Assets/item/book.png'},
		{name:'Bookshelf', src:'../../Assets/item/bookshelf.png'},
		{name:'Box1', src:'../../Assets/item/box1.png'},
		{name:'Box2', src:'../../Assets/item/box2.png'},
		{name:'Bread', src:'../../Assets/item/bread.png'},
		{name:'Breadwithjam', src:'../../Assets/item/breadwithjam.png'},
		{name:'Car blue', src:'../../Assets/item/car_blue.png'},
		{name:'Car green', src:'../../Assets/item/car_green.png'},
		{name:'Car grey', src:'../../Assets/item/car_grey.png'},
		{name:'Computer', src:'../../Assets/item/computer.png'},
		{name:'Couch', src:'../../Assets/item/couch.png'},
		{name:'Cup', src:'../../Assets/item/cup.png'},
		{name:'Door', src:'../../Assets/item/door.png'},
		{name:'Door open', src:'../../Assets/item/door_open.png'},
		{name:'Envelope', src:'../../Assets/item/envelope.png'},
		{name:'Flashlight', src:'../../Assets/item/flashlight.png'},
		{name:'Greenpaint', src:'../../Assets/item/greenpaint.png'},
		{name:'Jam', src:'../../Assets/item/jam.png'},
		{name:'Key', src:'../../Assets/item/key.png'},
		{name:'Knife', src:'../../Assets/item/knife.png'},
		{name:'Knifewithjam', src:'../../Assets/item/knifewithjam.png'},
		{name:'Laptop', src:'../../Assets/item/laptop.png'},
		{name:'Lock1', src:'../../Assets/item/lock1.png'},
		{name:'Lock2', src:'../../Assets/item/lock2.png'},
		{name:'Milk', src:'../../Assets/item/milk.png'},
		{name:'Newspaper', src:'../../Assets/item/newspaper.png'},
		{name:'Phone', src:'../../Assets/item/phone.png'},
		{name:'Post-it', src:'../../Assets/item/post-it.png'},
		{name:'Radio', src:'../../Assets/item/radio.png'},
		{name:'Redcone', src:'../../Assets/item/redcone.png'},
		{name:'Refrigerator', src:'../../Assets/item/refrigerator.png'},
		{name:'Smartphone', src:'../../Assets/item/smartphone.png'},
		{name:'Soda', src:'../../Assets/item/soda.png'},
		{name:'Stool', src:'../../Assets/item/stool.png'},
		{name:'Sword', src:'../../Assets/item/sword.png'},
		{name:'Table', src:'../../Assets/item/table.png'},
		{name:'Whitecone', src:'../../Assets/item/whitecone.png'},
		{name:'Whitepaint', src:'../../Assets/item/whitepaint.png'},
		// {...}
	],
	other:[
		{name:'Arrow', src:'../../Assets/other/arrow_plain.png'},
		// {...}
	],
};

GalleryView.SoundLibrary = [
	/*{
		index: 0, 
		src: "../../Assets/door.wav", 
		name: "Door"
	}, */
];

GalleryView.NewView = function(_elementID){
	let view = new GalleryView(_elementID);
	view.InitView();
	return view;
}

// functions
GalleryView.prototype.InitView = function(){
	View.prototype.InitView.apply(this); // call super method
	// init data binding
	this.vModel = new Vue({
		el: '#' + this.bindElementID,
		data: {
			images: GalleryView.ImageLibrary,
			sounds: GalleryView.SoundLibrary,
			importedImages: null,
			importedSounds: null,
			showCategory: {
				backdrop: true, 
				character: true, 
				item: true,
				others: true,
				sound: false, // TODO
				myImage: true,
				mySound: true,
			},
		}, 
		methods: {
			imageDragstart: (ev, d)=>{View.HandleDragstart(ev, View.DragInfo.GalleryImage, d);},
			soundDragstart: (ev, d)=>{View.HandleDragstart(ev, View.DragInfo.GallerySound, d);},
			chooseObj: (_obj)=>{this.ChooseObj(_obj)},
			setImage: (img)=>{this.SetImage(img)},
			previewSound: (sound)=>{(new Audio(sound.src)).play();}, // TODO: compatible path with both imported and default
		}
	});

	// events
	Event.AddListener("reload-project", ()=>{this.ReloadView();});
};

GalleryView.prototype.ReloadView = function(){
	View.prototype.ReloadView.apply(this); // call super method

	if (GameProperties.instance == null){
		this.vModel.importedImages = null;
		this.vModel.importedSounds = null;
	} else {
		this.vModel.importedImages = GameProperties.instance.imageList;
		this.vModel.importedSounds = GameProperties.instance.soundList;
	}
};

GalleryView.prototype.ChooseObj = function(_obj){
	this.objSelected = _obj;
	Event.Broadcast('add-gallery-object', this.objSelected);
};

GalleryView.prototype.SetImage = function(img){
	let obj = View.Selection.object;
	if (obj == null) return;
	obj.SetSprite(img.src);
	View.Selection.selectObject(obj);
}

module.exports = GalleryView;