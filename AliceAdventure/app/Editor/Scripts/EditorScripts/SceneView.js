const { PIXI, PROMPT, Event } = require('./Utilities/Utilities');
const GameProperties = require('./GameProperties');
const Scene = require('./Scene');
const SceneObject = require('./SceneObject');
const View = require('./View');

// class
let SceneView;

// variables
SceneView = function (_bindElementID, _height = -1, _width = -1) {
  View.call(this, 'SceneView', _height, _width, _bindElementID);

  this.app = null;
  this.vModel = null;
};
SceneView.prototype = new View();

// static
SceneView.NewView = function (_elementID) {
  const view = new SceneView(_elementID);
  view.InitView();
  return view;
};

// functions
SceneView.prototype.InitView = function () {
  View.prototype.InitView.apply(this); // call super method
  // Init data binding
  this.vModel = new Vue({
    el: `#${this.bindElementID}`,
    data: {
      projectLoaded: false
    },
    created: () => {
      Event.AddListener('addScene', msg => {
        window.console.log(msg);
        this.AddScene();
      });
    },
    methods: {
      // addScene: () => {
      //   this.AddScene();
      // },
      assetDragover: ev => {
        View.HandleDragover(ev, View.DragInfo.GalleryImage);
      },
      assetDrop: ev => {
        if (View.Selection.scene.container.children.length === 0) {
          if (confirm('Do you want to add it as a backdrop?')) {
            View.HandleDrop(event, View.DragInfo.GalleryImage, data => {
              SceneObject.AddBackdrop(data, View.Selection.scene);
            });
          }
        } else {
          const newEvent = new event.constructor('pointerup', ev);
          newEvent.clientX = ev.clientX;
          newEvent.clientY = ev.clientY;
          this.app.view.dispatchEvent(newEvent);
        }
        // console.log(this.app.view.getBoundingClientRect());
      },
      deleteSelected: () => {
        console.log('Delte Selected');
        this.DeleteSelected();
      }
    }
  });
  // Init app
  this.app = new PIXI.Application({
    width: 1024,
    height: 576,
    antialiasing: true,
    backgroundcolor: 0xffffff
  });
  document.getElementById('canvas-container').appendChild(this.app.view);
  // GameProperties.SetViewSize(480, 360);
  GameProperties.SetViewSize(1024, 576);

  window.onkeydown = function (_event) {
    if (_event.keyCode === 46) {
      if (View.Selection.object && !View.Selection.object.isBackdrop) {
        if (
          confirm(
            `Are you sure you want to delete ${View.Selection.object.name}?`
          )
        )
          View.Selection.object.DeleteThis();
      }
    }
  };

  // events
  Event.AddListener('reload-project', () => {
    this.ReloadView();
  });
  Event.AddListener('add-gallery-object', _obj => {
    this.AddObject(_obj);
  });
  Event.AddListener('object-sprite-click', _obj => {
    this.SelectObject(_obj);
  });

  Event.AddListener('add-object', event => {
    View.HandleDrop(event, View.DragInfo.GalleryImage, data => {
      this.AddObject(data);
    });
  });

  Event.AddListener('add-content', param => {
    View.HandleDrop(param[0], View.DragInfo.GalleryImage, data => {
      this.AddContent([data, param[1]]);
    });
  });
};

SceneView.prototype.ReloadView = function () {
  View.prototype.ReloadView.apply(this); // call super method
  this.app.stage.removeChildren();
  if (GameProperties.instance == null) {
    // no project is loaded
    this.vModel.projectLoaded = false;
  } else {
    // load current project
    this.vModel.projectLoaded = true;
    GameProperties.instance.sceneList.forEach(scn => {
      this.app.stage.addChild(scn.container);
      if (scn.selected) {
        View.Selection.selectScene(scn);
      }
    });
    GameProperties.instance.objectList.forEach(obj => {
      console.log(obj);
      if (obj.bindScene == null || obj.bindScene.id <= 0) return;
      obj.bindScene.container.addChild(obj.sprite);
      if (obj.selected) {
        View.Selection.selectObject(obj);
      }
    });
  }
};

SceneView.prototype.AddObject = function (_objInfo) {
  if (View.Selection.scene == null) return;
  const _bindScene = View.Selection.scene;
  const _obj = SceneObject.AddObject(
    _objInfo,
    _bindScene,
    this.app.screen.width / 2,
    this.app.screen.height / 2
  );
  this.SelectObject(_obj);
};

SceneView.prototype.AddContent = function (_objInfo) {
  if (View.Selection.scene == null) return;
  console.log(_objInfo);
  SceneObject.AddContent(_objInfo[0], _objInfo[1]);
};

SceneView.prototype.AddScene = function (_name = null) {
  let _scene;
  if (_name == null) {
    PROMPT({
      title: 'New scene',
      label: 'Input scene name: ',
      value: `Scene ${GameProperties.instance.sceneList.length + 1}`
    }).then(_name => {
      if (_name != null) {
        _scene = Scene.AddScene(_name);
        this.SelectScene(_scene);
        this.app.stage.addChild(_scene.container);
      }
    });
  } else {
    _scene = Scene.AddScene(_name);
    this.SelectScene(_scene);
    this.app.stage.addChild(_scene.container);
  }
};

SceneView.prototype.SelectObject = function (_obj) {
  // Select this object
  if (_obj.selectAllowed) {
    View.Selection.selectObject(_obj);
  }
};

SceneView.prototype.SelectScene = function (_scn) {
  // Select this object
  View.Selection.selectScene(_scn);
};

SceneView.prototype.DeleteObject = function (obj) {
  if (confirm('Are you sure you want to delete the object?')) obj.DeleteThis();
};

SceneView.prototype.DeleteScene = function (scn) {
  if (
    confirm(
      'Are you sure you want to delete the scene?\n\nDeleting the scene will also delete every object in it.'
    )
  )
    scn.DeleteThis();
};

SceneView.prototype.DeleteSelected = function () {
  if (!GameProperties.ProjectLoaded()) return;
  if (View.Selection.object != null) {
    this.DeleteObject(View.Selection.object);
  } else if (View.Selection.scene != null) {
    this.DeleteScene(View.Selection.scene);
  }
  console.log('Delete');
};

module.exports = SceneView;
