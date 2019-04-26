let Utilities;

Utilities = (function() {
  const PIXI = require('../../../../Library/pixi/pixi');
  Object.assign(
    PIXI.filters,
    require('../../../../Library/pixi/pixi-extra-filters.min.js')
  );
  return {
    PIXI,
    ELECTRON: require('electron').remote,
    IPC: require('electron').ipcRenderer,
    // MENU: require('electron').remote.Menu,
    FS: require('fs-extra'),
    PATH: require('path'),
    PROMPT: require('electron-prompt'),
    ID: require('./ID'),
    Debug: require('./Debug'),
    Event: require('./Event')
  };
})();

module.exports = Utilities;
