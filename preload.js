const {
    contextBridge,
    ipcRenderer
} = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
            // whitelist channels
            let validChannels = ["update-available","update-downloaded","app_version","restart_app"];           
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        // receive: (channel, func) => {
        //     let validChannels = ["update-available","update-downloaded","app_version","restart_app"];
        //     if (validChannels.includes(channel)) {
        //         // Deliberately strip event as it includes `sender` 
        //         ipcRenderer.on(channel, (event, ...args) => func(...args));
        //     }
        // },
        on: (channel, func) => {
            let validChannels = ["update-available","update-downloaded","app_version","restart_app"];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        },
        removeListener: (channel, callback) => {
            if (validChannels.includes(channel)) {
              ipcRenderer.removeListener(channel, callback);
            }
          },
          removeAllListeners: (channel) => {
              let validChannels = ["update_downloaded", "update_available","app_version"]
            if (validChannels.includes(channel)) {
              ipcRenderer.removeAllListeners(channel)
            }
          },
    }
);