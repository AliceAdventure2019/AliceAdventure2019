const { app, BrowserWindow, ipcMain } = require('electron');

const PATH = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let welWin;
let tutWin;
let mainWin;

function createWelWin() {
  //  Create the browser window.
  welWin = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: true,
    show: false,
    resizable: false
  });
  // welWin.webContents.openDevTools();
  welWin.loadURL(
    url.format({
      pathname: PATH.join(__dirname, 'Editor/Pages/welcome.html'),
      protocol: 'file:',
      slashes: true
    })
  );
  welWin.once('ready-to-show', () => {
    welWin.show();
  });
  welWin.on('closed', () => {
    welWin = null;
  });
}

function createTutWin(path) {
  tutWin = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: true,
    show: false,
    resizable: false
  });
  tutWin.loadURL(
    url.format({
      pathname: PATH.join(__dirname, 'Editor/Pages/tutorial.html'),
      protocol: 'file:',
      slashes: true
    })
  );
  tutWin.once('ready-to-show', () => {
    tutWin.show();
    tutWin.webContents.send('load-file', path);
  });
  tutWin.on('closed', () => {
    tutWin = null;
  });
}

function createMainWin(path) {
  // Get the screen size
  // Depending on width, create different size of main window
  // The minimum size of main window is 1280 * 720
  let size = require('electron').screen.getPrimaryDisplay().workAreaSize;
  let width = parseInt(size.width);
  if (width > 1900) {
    mainWin = new BrowserWindow({
      width: 1920,
      height: 1080,
      minWidth: 1280,
      minHeight: 720,
      frame: true,
      show: false,
      resizable: true
    });
  } else if (width < 1400) {
    mainWin = new BrowserWindow({
      width: 1280,
      height: 720,
      minWidth: 1280,
      minHeight: 720,
      frame: true,
      show: false,
      resizable: true
    });
  } else {
    mainWin = new BrowserWindow({
      width: 1440,
      height: 810,
      minWidth: 1280,
      minHeight: 720,
      frame: true,
      show: false,
      resizable: true
    });
  }
  mainWin.loadURL(
    url.format({
      pathname: PATH.join(__dirname, 'Editor/Pages/index.html'),
      protocol: 'file:',
      slashes: true
    })
  );
  mainWin.once('ready-to-show', () => {
    mainWin.show();
    if (path === null) {
      mainWin.webContents.send('new-empty-project');
    } else {
      mainWin.webContents.send('load-file', path);
    }
  });
  mainWin.on('closed', () => {
    mainWin = null;
  });
}

ipcMain.on('new-wiz', (event, data) => {
  if (tutWin == null) createTutWin(data);
  // if (welWin != null) welWin.close();
});

ipcMain.on('new-proj', event => {
  if (mainWin == null) createMainWin(null);
  if (welWin != null) welWin.close();
});

ipcMain.on('open-proj', (event, data) => {
  if (mainWin == null) createMainWin(data);
  if (welWin != null) welWin.close();
});

ipcMain.on('complete-tut', (event, data) => {
  if (mainWin == null) createMainWin(data);
  if (tutWin != null) tutWin.close();
});

ipcMain.on('exit', (event, data) => {
  if (welWin != null) welWin.close();
  if (tutWin != null) tutWin.close();
  if (mainWin != null) mainWin.close();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWelWin);
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (welWin === null) {
    createWelWin();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
