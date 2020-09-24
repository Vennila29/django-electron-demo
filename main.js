const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.webContents.openDevTools();
  mainWindow.loadFile('index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
  log.info("checkForAutoUpdatesAndNotify")
    autoUpdater.checkForUpdatesAndNotify();
    log.info("checkedForAutoUpdatesAndNotify")
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

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
  log.info("sending app version")
});

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
  log.info("update_available")
});
autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
  log.info("update_downloaded")
});
ipcMain.on('restart_app', () => {
  log.info("quitAndInstall")
  autoUpdater.quitAndInstall();
});