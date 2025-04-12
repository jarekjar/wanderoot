const { app, BrowserWindow, session } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

// Get the absolute path to the project root directory
const rootDir = path.resolve(__dirname, '..');
console.log('Root directory:', rootDir);
console.log('Current directory:', __dirname);
console.log('NODE_ENV:', process.env.NODE_ENV);

function createWindow() {
  // Set appropriate CSP headers for development
  if (isDev) {
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
            "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: http://localhost:* ws://localhost:*",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:*",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https:",
          ].join('; ')
        }
      });
    });
  }

  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(rootDir, '/electron/preload.js'),
      webSecurity: isDev ? false : true,
      sandbox: false
    }
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173/#/');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Log any console messages from the renderer process
  mainWindow.webContents.on('console-message', (event, level, message) => {
    console.log('Renderer Console:', message);
  });
}

// Set the NODE_ENV if it's not set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
}); 