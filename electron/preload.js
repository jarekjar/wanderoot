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
      
      // In production, audio files are unpacked (due to asar limitations)
      if (cleanPath.includes('.mp3') || cleanPath.includes('.wav')) {
        return path.join(process.resourcesPath, cleanPath);
      }
      
      // Other assets are in the asar archive
      return path.join(process.resourcesPath, 'assets', cleanPath.replace('assets/', ''));
    }
  }
); 