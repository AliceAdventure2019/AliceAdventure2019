const ELECTRON = require('electron').remote;
const IPC = require('electron').ipcRenderer;
// const AliceEngine = require('../../Engine/AliceEngine');

const AliceEditor = require('../Scripts/AliceEditor');

IPC.on('load-file', (event, data) => {
  AliceEditor.File.OpenFromPath(data);
});

// utilities
function isNumberOr(_value, _default) {
  return (typeof _value === 'number' ? _value : _default);
}

function isBooleanOr(_value, _default) {
  return (typeof _value === 'boolean' ? _value : _default);
}

function isStringOr(_value, _default) {
  return (typeof _value === 'string' ? _value : _default);
}

// tutorial page
let transit;
let util; // temp
function InitTutorialPage() {
  const views = {
    tutorialView: AliceEditor.TutorialView.NewView('step_1'),
    sceneView: AliceEditor.SceneView.NewView('scene-editor'),
    propertyView: AliceEditor.PropertyView.NewView('design-property'),
    galleryView: AliceEditor.GalleryView.NewView('gallery-modal'),
    objectListView: AliceEditor.ObjectListView.NewView('object-list'),
    interactionView: AliceEditor.InteractionView.NewView('interaction-editor'),
    iLibraryView: AliceEditor.ILibraryView.NewView('interaction-library'),
  };
  transit = {
    back: () => { views.tutorialView.vModel.back(); },
    next: () => { views.tutorialView.vModel.next(); },
    skip: () => { views.tutorialView.vModel.skip(); },
    finish: () => { views.tutorialView.vModel.finish(); },
    exit: () => { views.tutorialView.vModel.exit(); },
  };
  util = {
    selectBackdrop: () => {
      views.galleryView.vModel.showCategory = {
        backdrop: true,
        character: false,
        item: false,
        others: false,
        sound: false,
        myImage: true,
        mySound: false,
      };
    },
    selectCharacter: () => {
      views.galleryView.vModel.showCategory = {
        backdrop: false,
        character: true,
        item: false,
        others: false,
        sound: false,
        myImage: true,
        mySound: false,
      };
    },
    selectItem: () => {
      views.galleryView.vModel.showCategory = {
        backdrop: false,
        character: false,
        item: true,
        others: false,
        sound: false,
        myImage: true,
        mySound: false,
      };
    },
  };

  return views;
}

// variables
let sceneView;


var propertyView;


var objectListView;


var galleryView;


var runView;


var interactionView;


var iLibraryView;


var gameSettingView;

function InitAllViews() {
  // AliceEditor.Menu.Init();
  // AliceEditor.Menu.Update();
  InitSceneView();
  InitPropertyView();
  InitObjectListView();
  InitGalleryView();
  InitRunView();
  InitInteractionView();
  InitILibraryView();
  InitGameSettingView();
  window.addEventListener('beforeunload', (event) => handleClose(event));
}

function handleClose(event) {
  if (AliceEditor.File.instance == null) return;
  const choice = ELECTRON.dialog.showMessageBox(ELECTRON.getCurrentWindow(), {
    type: 'question',
    buttons: ['Save', 'Don\'t save'],
    title: 'Close',
    message: 'Save the project before close it?',
  });
  if (choice == 0) {
    AliceEditor.File.SaveProject();
  }
}

function InitSceneView() {
  sceneView = AliceEditor.SceneView.NewView('design-editor');
}

function InitPropertyView() {
  propertyView = AliceEditor.PropertyView.NewView('design-property');
}

function InitObjectListView() {
  objectListView = AliceEditor.ObjectListView.NewView('object-list');
}

function InitGalleryView() {
  galleryView = AliceEditor.GalleryView.NewView('gallery');
}

function InitRunView() {
  runView = AliceEditor.RunView.NewView('run-view');
}

function InitInteractionView() {
  interactionView = AliceEditor.InteractionView.NewView('second-column');
}

function InitILibraryView() {
  iLibraryView = AliceEditor.ILibraryView.NewView('interaction-library');
}

function InitGameSettingView() {
  gameSettingView = AliceEditor.GameSettingView.NewView('game-setting');
}
