const { Event } = require('./Utilities/Utilities');
const GameProperties = require('./GameProperties');
const View = require('./View');

// class
let PropertyView;

// variables
PropertyView = function(_bindElementID, _height = -1, _width = -1) {
  View.call(this, 'PropertyView', _height, _width, _bindElementID);

  // this.bindObject = null;
  this.vModel = null;
};
PropertyView.prototype = new View();

// static
PropertyView.NewView = function(_elementID) {
  const view = new PropertyView(_elementID);
  view.InitView();
  return view;
};

// functions
PropertyView.prototype.InitView = function() {
  View.prototype.InitView.apply(this); // call super method
  // init data binding
  this.vModel = new Vue({
    el: `#${this.bindElementID}`,
    data: {
      projectLoaded: false,
      showObject: false,
      object: null,
      showScene: false,
      scene: null
    },
    methods: {
      toggleLock: () => {
        this.vModel.object.ToggleLock();
      },
      deleteObject: () => {
        this.DeleteObject();
      },
      deleteScene: () => {
        this.DeleteScene();
      },
      getObjectContent: obj =>
        obj.content.map(elemId => GameProperties.GetObjectById(elemId)),
      deleteContent: obj => {
        for (let i = 0; i < this.vModel.object.content.length; i += 1) {
          if (this.vModel.object.content[i] === obj.id) {
            this.vModel.object.content.splice(i, 1);
            i -= 1;
          }
        }
        obj.id = -1;
        obj.name = 'null';
        obj.DeleteThis();
        console.log(GameProperties.instance.objectList);
      }
    }
  });

  // events
  Event.AddListener('reload-project', () => {
    this.ReloadView();
  });
  Event.AddListener('update-selection', () => {
    console.log('Update');
    this.UpdateSelection();
  });
};

PropertyView.prototype.ReloadView = function() {
  View.prototype.ReloadView.apply(this); // call super method

  if (GameProperties.instance == null) {
    this.vModel.projectLoaded = false;
  } else {
    this.vModel.projectLoaded = true;
    this.UpdateSelection();
  }
};

PropertyView.prototype.UpdateSelection = function() {
  console.log(View.Selection.object);
  console.log(View.Selection.scene);
  this.vModel.showObject =
    View.Selection.object !== null && !View.Selection.object.isBackdrop;
  this.vModel.object = View.Selection.object;

  this.vModel.showScene =
    (View.Selection.object == null && View.Selection.scene != null) ||
    View.Selection.object.isBackdrop;
  this.vModel.scene = View.Selection.scene || View.Selection.object.bindScene;
  this.vModel.$forceUpdate();
};

PropertyView.prototype.DeleteObject = function() {
  if (confirm('Are you sure you want to delete the object?')) {
    this.vModel.object.id = -1;
    this.vModel.object.name = 'null';
    this.vModel.object.DeleteThis();
  }
};

PropertyView.prototype.DeleteScene = function() {
  if (
    confirm(
      'Are you sure you want to delete the scene?\n\nDeleting the scene will also delete every object in it.'
    )
  ) {
    this.vModel.scene.DeleteThis();
  }
};

module.exports = PropertyView;
