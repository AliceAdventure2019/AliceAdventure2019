const { Event } = require('./Utilities/Utilities');
const GameProperties = require('./GameProperties');
const SceneObject = require('./SceneObject');
const View = require('./View');

// class
let GalleryModalView;

// variables
GalleryModalView = function(_bindElementID, _height = -1, _width = -1) {
  View.call(this, 'GalleryModalView', _height, _width, _bindElementID);
  this.vModel = null;
  this.objSelected = null;
  this.imgSelected = null;
};
GalleryModalView.prototype = new View();

GalleryModalView.ImageLibrary = {
  backdrop: [
    { name: 'Airplane', src: '../../Assets/backdrop/airplane.png' },
    { name: 'Airport', src: '../../Assets/backdrop/airport.png' },
    { name: 'Backdrop', src: '../../Assets/backdrop/backdrop.png' },
    { name: 'Bathroom', src: '../../Assets/backdrop/bathroom.png' },
    { name: 'Beach org', src: '../../Assets/backdrop/beach_org.png' },
    { name: 'Classroom', src: '../../Assets/backdrop/classroom.png' },
    { name: 'Kitchen', src: '../../Assets/backdrop/kitchen.png' },
    { name: 'Library', src: '../../Assets/backdrop/library.png' },
    { name: 'Mountainview', src: '../../Assets/backdrop/mountainView.png' },
    { name: 'Night', src: '../../Assets/backdrop/night.png' },
    {
      name: 'Pixel outdoor',
      src: '../../Assets/backdrop/pixel_outdoor_env.png'
    },
    { name: 'Pixel indoor', src: '../../Assets/backdrop/pixel_indoor_env.png' },

    { name: 'Room basic', src: '../../Assets/backdrop/room_basic.png' },
    { name: 'Room blue', src: '../../Assets/backdrop/room_blue.png' },
    { name: 'Win', src: '../../Assets/backdrop/win.png' }
  ],
  character: [
    { name: 'Alice brave', src: '../../Assets/character/alice_brave.png' },
    {
      name: 'Alice standing',
      src: '../../Assets/character/alice_standing.png'
    },
    { name: 'Boy', src: '../../Assets/character/boy.png' },
    { name: 'Businessman', src: '../../Assets/character/businessman.png' },
    { name: 'Cat', src: '../../Assets/character/cat.png' },
    { name: 'Cat sad', src: '../../Assets/character/cat_sad.png' },
    { name: 'Dog happy', src: '../../Assets/character/dog_happy.png' },
    { name: 'Girl unhappy', src: '../../Assets/character/girl_unhappy.png' },
    { name: 'Hero1', src: '../../Assets/character/hero1.png' },
    { name: 'Hero2', src: '../../Assets/character/hero2.png' },
    { name: 'Hero3', src: '../../Assets/character/hero3.png' },
    { name: 'Hero4', src: '../../Assets/character/hero4.png' },
    { name: 'Mad hat', src: '../../Assets/character/mad_hat.png' },
    { name: 'Monster1', src: '../../Assets/character/monster1.png' },
    { name: 'Monster2', src: '../../Assets/character/monster2.png' },
    { name: 'Orange cat', src: '../../Assets/character/orange_cat.png' },
    { name: 'Robot', src: '../../Assets/character/robot.png' },
    { name: 'Shopper', src: '../../Assets/character/shopper.png' },
    { name: 'Tweedle dee', src: '../../Assets/character/tweedle_dee.png' },
    {
      name: 'Wizard student',
      src: '../../Assets/character/wizard_student.png'
    },
    {
      name: 'Wizard student2',
      src: '../../Assets/character/wizard_student2.png'
    },
    {
      name: 'Wizard student3',
      src: '../../Assets/character/wizard_student3.png'
    }
    // {...}
  ],
  item: [
    { name: 'Bag', src: '../../Assets/item/bag.png' },
    { name: 'Blackboard', src: '../../Assets/item/blackboard.png' },
    { name: 'Blender', src: '../../Assets/item/blender.png' },
    { name: 'Bluepaint', src: '../../Assets/item/bluepaint.png' },
    { name: 'Book', src: '../../Assets/item/book.png' },
    { name: 'Bookshelf', src: '../../Assets/item/bookshelf.png' },
    { name: 'Box1', src: '../../Assets/item/box1.png' },
    { name: 'Box2', src: '../../Assets/item/box2.png' },
    { name: 'Bread', src: '../../Assets/item/bread.png' },
    { name: 'Breadwithjam', src: '../../Assets/item/breadwithjam.png' },
    { name: 'Briefcase', src: '../../Assets/item/briefcase.png' },
    { name: 'Calendar', src: '../../Assets/item/calendar.png' },
    { name: 'Call button', src: '../../Assets/item/call_button.png' },
    { name: 'Car', src: '../../Assets/item/car.png' },
    { name: 'Car blue', src: '../../Assets/item/car_blue.png' },
    { name: 'Car green', src: '../../Assets/item/car_green.png' },
    { name: 'Car grey', src: '../../Assets/item/car_grey.png' },
    { name: 'Car red', src: '../../Assets/item/car_red.png' },
    { name: 'Clock', src: '../../Assets/item/clock.png' },
    { name: 'Computer', src: '../../Assets/item/computer.png' },
    { name: 'Couch', src: '../../Assets/item/couch.png' },
    { name: 'Cup', src: '../../Assets/item/cup.png' },
    { name: 'Door', src: '../../Assets/item/door.png' },
    { name: 'Door open', src: '../../Assets/item/door_open.png' },
    { name: 'D cards', src: '../../Assets/item/D_cards.png' },
    { name: 'Envelope', src: '../../Assets/item/envelope.png' },
    { name: 'Eraser', src: '../../Assets/item/eraser.png' },
    { name: 'E cards', src: '../../Assets/item/E_cards.png' },
    { name: 'Flashlight', src: '../../Assets/item/flashlight.png' },
    { name: 'Greenpaint', src: '../../Assets/item/greenpaint.png' },
    { name: 'Jam', src: '../../Assets/item/jam.png' },
    { name: 'Key', src: '../../Assets/item/key.png' },
    { name: 'Knife', src: '../../Assets/item/knife.png' },
    { name: 'Knifewithjam', src: '../../Assets/item/knifewithjam.png' },
    { name: 'Laptop', src: '../../Assets/item/laptop.png' },
    { name: 'Lock1', src: '../../Assets/item/lock1.png' },
    { name: 'Lock2', src: '../../Assets/item/lock2.png' },
    { name: 'Locker', src: '../../Assets/item/locker.png' },
    { name: 'Locker open', src: '../../Assets/item/locker_open.png' },
    { name: 'Magicwand', src: '../../Assets/item/magicwand.png' },
    { name: 'Magnifier', src: '../../Assets/item/magnifier.png' },
    { name: 'Milk', src: '../../Assets/item/milk.png' },
    { name: 'Money', src: '../../Assets/item/money.png' },
    { name: 'M cards', src: '../../Assets/item/M_cards.png' },
    { name: 'Newspaper', src: '../../Assets/item/newspaper.png' },
    { name: 'Old photo', src: '../../Assets/item/old_photo.png' },
    { name: 'Pencil', src: '../../Assets/item/pencil.png' },
    { name: 'Phone', src: '../../Assets/item/phone.png' },
    { name: 'Pixel button', src: '../../Assets/item/pixel_button.png' },
    { name: 'Pixel character', src: '../../Assets/item/pixel_character.png' },
    { name: 'Pixel container', src: '../../Assets/item/pixel_container.png' },
    { name: 'Pixel door', src: '../../Assets/item/pixel_door.png' },
    { name: 'Pixel hole', src: '../../Assets/item/pixel_hole.png' },
    { name: 'Pixel key', src: '../../Assets/item/pixel_key.png' },
    { name: 'Pixel ladder', src: '../../Assets/item/pixel_ladder.png' },
    { name: 'Pixel lever', src: '../../Assets/item/pixel_lever.png' },
    {
      name: 'Pixel safe',
      src: '../../Assets/item/pixel_locked_container.png'
    },
    { name: 'Pixel money', src: '../../Assets/item/pixel_money.png' },
    { name: 'Pixel monster', src: '../../Assets/item/pixel_monster.png' },
    { name: 'Pixel other', src: '../../Assets/item/pixel_other.png' },
    { name: 'Pixel portal', src: '../../Assets/item/pixel_portal.png' },
    { name: 'Pixel safe', src: '../../Assets/item/pixel_safe.png' },
    { name: 'Pixel switch', src: '../../Assets/item/pixel_switch.png' },
    { name: 'Pixel tool', src: '../../Assets/item/pixel_tool.png' },
    { name: 'Pixel vent', src: '../../Assets/item/pixel_vent.png' },
    { name: 'Post-it', src: '../../Assets/item/post-it.png' },
    { name: 'Radio', src: '../../Assets/item/radio.png' },
    { name: 'Redcone', src: '../../Assets/item/redcone.png' },
    { name: 'Refrigerator', src: '../../Assets/item/refrigerator.png' },
    { name: 'R cards', src: '../../Assets/item/R_cards.png' },
    { name: 'Smartphone', src: '../../Assets/item/smartphone.png' },
    { name: 'Soda', src: '../../Assets/item/soda.png' },
    {
      name: 'Starrylight painting',
      src: '../../Assets/item/starrylight_painting.png'
    },
    { name: 'Stool', src: '../../Assets/item/stool.png' },
    { name: 'Sword', src: '../../Assets/item/sword.png' },
    { name: 'Table', src: '../../Assets/item/table.png' },
    { name: 'U cards', src: '../../Assets/item/U_cards.png' },
    { name: 'Wallet', src: '../../Assets/item/wallet.png' },
    { name: 'Whitecone', src: '../../Assets/item/whitecone.png' },
    { name: 'Whitepaint', src: '../../Assets/item/whitepaint.png' },
    { name: 'Window day', src: '../../Assets/item/window_day.png' },
    { name: 'Window night', src: '../../Assets/item/window_night.png' },
    { name: 'Wordlock', src: '../../Assets/item/wordlock.png' } // {...}
  ],
  other: [
    { name: 'Arrow down', src: '../../Assets/other/arrow_down.png' },
    { name: 'Arrow plain', src: '../../Assets/other/arrow_plain.png' }
    // {...}
  ]
};

GalleryModalView.SoundLibrary = [
  /* {
		index: 0, 
		src: "../../Assets/door.wav", 
		name: "Door"
	}, */
];

GalleryModalView.NewView = function(_elementID) {
  const view = new GalleryModalView(_elementID);
  view.InitView();
  return view;
};

// functions
GalleryModalView.prototype.InitView = function() {
  View.prototype.InitView.apply(this); // call super method
  // init data binding
  this.vModel = new Vue({
    el: `#${this.bindElementID}`,
    data: {
      images: GalleryModalView.ImageLibrary,
      sounds: GalleryModalView.SoundLibrary,
      importedImages: null,
      importedSounds: null,
      showCategory: {
        backdrop: true,
        character: true,
        item: true,
        others: true,
        myImage: true
      }
    },
    methods: {
      imageDragstart: (ev, d) => {
        View.HandleDragstart(ev, View.DragInfo.GalleryImage, d);
      },
      soundDragstart: (ev, d) => {
        View.HandleDragstart(ev, View.DragInfo.GallerySound, d);
      },
      chooseObj: _obj => {
        this.ChooseObj(_obj);
      },
      setImage: img => {
        this.imgSelected = img;
      },
      chooseImage: () => {
        this.ChooseImage();
      }
    }
  });

  // events
  Event.AddListener('reload-project', () => {
    this.ReloadView();
  });
};

GalleryModalView.prototype.ReloadView = function() {
  View.prototype.ReloadView.apply(this); // call super method

  if (GameProperties.instance == null) {
    this.vModel.importedImages = null;
  } else {
    this.vModel.importedImages = GameProperties.instance.imageList;
  }
};

GalleryModalView.prototype.ChooseObj = function(_obj) {
  this.objSelected = _obj;
  Event.Broadcast('add-gallery-object', this.objSelected);
};

GalleryModalView.prototype.ChooseImage = function() {
  const obj = View.Selection.object;
  if (obj == null) return;
  obj.SetSprite(this.imgSelected.src);
  View.Selection.selectObject(obj);
};

module.exports = GalleryModalView;
