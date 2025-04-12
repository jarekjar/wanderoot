const { contextBridge } = require('electron');
const path = require('path');
const fs = require('fs');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    getAssetPath: (assetPath) => {
      
      // Other assets are in the asar archive
      return path.join(process.resourcesPath, '/public/assets', assetPath);
    }
  }
); 