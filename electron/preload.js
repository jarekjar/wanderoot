const { contextBridge } = require('electron');
const path = require('path');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    getAssetPath: (assetPath) => {
      if (process.env.NODE_ENV === 'development') {
        return path.join(process.cwd(), 'public', 'assets', assetPath);
      }
      return path.join(process.resourcesPath, 'assets', assetPath);
    }
  }
); 