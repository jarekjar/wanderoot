const { contextBridge } = require('electron');
const path = require('path');

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
      
      // In production, all assets are in the resources directory
      return path.join(process.resourcesPath, cleanPath);
    }
  }
); 