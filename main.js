const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const path = require('path');
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    backgroundcolor:"fff",
    width: 1600,
    minWidth : 800,
    height: 600,
    webPreferences:{
      nodeIntegration : false,
      enableRemoteModule : false,
      contextIsolation : true,
      worldSafeExecuteJavaScript: true,
      allowRunningInsecureContent: false,
      preload : path.join(__dirname,'preload.js'),
    }
  });
  // mainWindow.webContents.openDevTools();
  mainWindow.loadURL('http://127.0.0.1:8000/polls/');
  // mainWindow.loadFile('index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
  log.info("checkForAutoUpdatesAndNotify")
    autoUpdater.checkForUpdatesAndNotify();
    log.info("checkedForAutoUpdatesAndNotify")
    // mainWindow.webContents.on("did-finish-load",()=>{
      
    //   mainWindow.webContents.send('app_version', app.getVersion());
    //    log.info(app.getVersion()) 
    // })
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('app_version', (event,args) => {
  log.info(app.getVersion())
  event.sender.send('app_version',{version : app.getVersion() });
  log.info("sending app version")
});

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send("update_available",'update_available');
  log.info("update_available")
});
autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded','update_downloaded');
  log.info("update_downloaded")
});
ipcMain.on('restart_app', () => {
  log.info("quitAndInstall")
  autoUpdater.quitAndInstall();
});