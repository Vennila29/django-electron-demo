const { app, BrowserWindow } = require('electron')
const { autoUpdater } = require("electron-updater")
const log = require('electron-log');
autoUpdater.logger = log;
log.transports.file.level = 'info';
log.info('App starting...');
let win

const dispatch = (data) => {
  log.info(data);
  win.webContents.send('message', data)
}

const createDefaultWindow = () => {
  win = new BrowserWindow({ width: 1200, height: 600,webPreferences: {
    nodeIntegration: true
  } })
  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null
  })

  win.loadFile('index.html')

  return win
}

app.on('ready', () => {
  
  createDefaultWindow()

  win.webContents.on('did-finish-load', () => {
    dispatch(app.getVersion())
    console.log(app.getVersion())
  })
  autoUpdater.checkForUpdatesAndNotify()
})

app.on('window-all-closed', () => {
  app.quit()
})


autoUpdater.on('checking-for-update', () => {
  dispatch('Checking for update...')
})

autoUpdater.on('update-available', (info) => {
  dispatch('Update available.')
})

autoUpdater.on('update-not-available', (info) => {
  dispatch('Update not available.')
})

autoUpdater.on('error', (err) => {
  dispatch('Error in auto-updater. ' + err)
})

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')'
  dispatch(log_message)

    // win.webContents.send('download-progress', progressObj.percent)

})

autoUpdater.on('update-downloaded', (info) => {
  dispatch('Update downloaded')
})