const {app,window, BrowserWindow, ipcMain} = require('electron')
const path = require('path') 
const { autoUpdater } = require('electron-updater');

let mainWindow



function createWindow () {
  // Create the browser window.
// var subpy = require('child_process').spawn('dist/proyecto_ejemplo/proyecto_ejemplo.exe', ['runserver']);
  // var subpy = require('child_process').spawn( 'python', [__dirname+'/mysite/'+'manage.py', 'runserver']);

    // var rq = require('request-promise');
    var mainAddr = 'http://localhost:8000/home/';
    var openWindow = function() {
        mainWindow = new BrowserWindow({ width: 1200, height: 600 })
        mainWindow.setMenu(null)
        mainWindow.loadURL('http://localhost:8000/polls/');

        mainWindow.on('closed', function() {
            mainWindow = null;
            console.log("closing")
            // subpy.kill('SIGINT');
        })
    }
    openWindow();
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  //check for auto update
  mainWindow.once('ready-to-show', () => {
      autoUpdater.checkForUpdatesAndNotify();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

app.on('window-all-closed', () => {

  if (process.platform !== 'darwin') {
    app.quit();
  }
});
  
app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})


autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});
  