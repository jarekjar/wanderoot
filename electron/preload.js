const { contextBridge } = require('electron');
const path = require('path');
const fs = require('fs');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    getAssetPath: (assetPath) => {
      // Remove leading slash if present
      const cleanPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
      
      if (process.env.NODE_ENV === 'development') {
        return path.join(process.cwd(), 'public', cleanPath);
      }
      
      // In production, assets are in the resources directory
      const prodPath = path.join(process.resourcesPath, cleanPath);
      console.log('Attempting to load asset from:', prodPath);
      return prodPath;
    }
  }
); 