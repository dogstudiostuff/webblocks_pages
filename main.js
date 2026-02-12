// old electron main: kept around, I edit this sometimes
const { app, BrowserWindow, Menu, dialog, shell, ipcMain, session } = require('electron');
const path = require('path');
const fs = require('fs');

// ensure there's a small favicon available to reduce load warnings in dev
const _tinyPngBase64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII='; // 1x1 transparent PNG
const faviconPngPath = path.join(__dirname, 'favicon.png');
try {
  if (!fs.existsSync(faviconPngPath)) {
    fs.writeFileSync(faviconPngPath, Buffer.from(_tinyPngBase64, 'base64'));
  }
} catch (e) {
  console.warn('Could not write favicon.png:', e && e.message);
}

let mainWindow;

// try to set a local cache/userData path early to avoid disk cache permission issues
try {
  const _ud = path.join(__dirname, '.user_data');
  if (!fs.existsSync(_ud)) fs.mkdirSync(_ud, { recursive: true });
  app.commandLine.appendSwitch('disk-cache-dir', _ud);
  app.setPath('userData', _ud);
} catch (e) { console.warn('Could not initialize local userData/cache path:', e && e.message); }

function createWindow() {
  // ensure app has a writable userData directory inside the project
  try {
    const ud = path.join(__dirname, '.user_data');
    if (!fs.existsSync(ud)) fs.mkdirSync(ud, { recursive: true });
    app.setPath('userData', ud);
  } catch (e) {
    console.warn('Could not set userData path:', e && e.message);
  }

  // prefer a small PNG favicon (created above) or fall back to favicon.ico
  const iconPath = path.join(__dirname, 'favicon.ico');
  try {
    if (fs.existsSync(iconPath)) {
      const stats = fs.statSync(iconPath);
      if (stats.size < 2000) {
        try { fs.unlinkSync(iconPath); } catch (e) {}
      }
    }
  } catch (e) { }

  const winOpts = {
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'Poo IDE',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  };

  // On Windows skip setting an icon to avoid image load warnings from invalid files
  if (process.platform !== 'win32') {
    if (fs.existsSync(faviconPngPath)) {
      winOpts.icon = faviconPngPath;
    } else if (fs.existsSync(iconPath)) {
      winOpts.icon = iconPath;
    }
  }

  mainWindow = new BrowserWindow(winOpts);

  mainWindow.loadFile('index.html');

  mainWindow.webContents.once('did-finish-load', () => {
    console.log('Main window loaded');
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('blob:')) {
      return { action: 'allow' };
    }

    shell.openExternal(url);
    return { action: 'deny' };
  });

  ipcMain.handle('save-file', async (event, { defaultName, content, mimeType }) => {
    const filters = defaultName.endsWith('.zip')
      ? [{ name: 'ZIP Archive', extensions: ['zip'] }]
      : [{ name: 'HTML File', extensions: ['html'] }];
    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath: defaultName,
      filters: filters
    });
    if (!result.canceled && result.filePath) {
      const buf = Buffer.from(content, mimeType.includes('zip') ? 'base64' : 'utf-8');
      fs.writeFileSync(result.filePath, buf);
      return true;
    }
    return false;
  });

  ipcMain.handle('preview-html', async (event, html) => {
    const previewWin = new BrowserWindow({
      width: 1024,
      height: 768,
      title: 'Poo IDE — Preview',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });
    previewWin.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));
    return true;
  });

  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Project',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow.webContents.executeJavaScript(
            'if(workspace){workspace.clear();showToast("New project");}'
          )
        },
        { type: 'separator' },
        {
          label: 'Save (.wbk)',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow.webContents.executeJavaScript(
            'document.getElementById("btnSave").click();'
          )
        },
        {
          label: 'Load (.wbk)',
          accelerator: 'CmdOrCtrl+O',
          click: () => mainWindow.webContents.executeJavaScript(
            'document.getElementById("btnLoad").click();'
          )
        },
        { type: 'separator' },
        {
          label: 'Export HTML',
          click: () => mainWindow.webContents.executeJavaScript(
            'document.getElementById("btnExport").click();'
          )
        },
        {
          label: 'Export All (.zip)',
          click: () => mainWindow.webContents.executeJavaScript(
            'document.getElementById("btnZip").click();'
          )
        },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          click: () => mainWindow.webContents.executeJavaScript(
            'if(workspace) workspace.undo(false);'
          )
        },
        {
          label: 'Redo',
          accelerator: 'CmdOrCtrl+Y',
          click: () => mainWindow.webContents.executeJavaScript(
            'if(workspace) workspace.undo(true);'
          )
        },
        { type: 'separator' },
        {
          label: 'Search Blocks',
          accelerator: 'CmdOrCtrl+K',
          click: () => mainWindow.webContents.executeJavaScript(
            'document.getElementById("blockSearchOverlay").style.display="flex";document.getElementById("blockSearchInput").focus();'
          )
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About Poo IDE',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About Poo IDE',
              message: 'Poo IDE',
              detail: 'A visual website builder powered by Blockly.\nVersion 1.0.0'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  mainWindow.on('closed', () => {
    ipcMain.removeHandler('save-file');
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});