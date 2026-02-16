
const { app, BrowserWindow, Menu, dialog, shell, ipcMain, session } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');
const pkg = require('./package.json');


const _tinyPngBase64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII='; 
const faviconPngPath = path.join(__dirname, 'favicon.png');
try {
  if (!fs.existsSync(faviconPngPath)) {
    fs.writeFileSync(faviconPngPath, Buffer.from(_tinyPngBase64, 'base64'));
  }
} catch (e) {
  console.warn('Could not write favicon.png:', e && e.message);
}

let mainWindow;
let updateCheckInFlight = false;

function getUpdateConfig() {
  const cfg = (pkg && pkg.update) ? pkg.update : {};
  const manifestUrl = process.env.POO_IDE_UPDATE_MANIFEST_URL || cfg.manifestUrl || '';
  const downloadUrl = process.env.POO_IDE_UPDATE_DOWNLOAD_URL || cfg.downloadUrl || '';
  return { manifestUrl, downloadUrl };
}

function toVersionParts(input) {
  const text = String(input || '').trim().replace(/^v/i, '');
  const parts = text.split('.').map((part) => {
    const m = part.match(/\d+/);
    return m ? parseInt(m[0], 10) : 0;
  });
  while (parts.length < 3) parts.push(0);
  return parts.slice(0, 3);
}

function isVersionNewer(latest, current) {
  const a = toVersionParts(latest);
  const b = toVersionParts(current);
  for (let i = 0; i < 3; i++) {
    if (a[i] > b[i]) return true;
    if (a[i] < b[i]) return false;
  }
  return false;
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Poo-IDE-Updater',
        'Accept': 'application/json'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return resolve(fetchJson(res.headers.location));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`Update server responded with ${res.statusCode}`));
      }
      let raw = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { raw += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(raw));
        } catch (e) {
          reject(new Error('Invalid JSON from update server'));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function normalizeUpdatePayload(payload, fallbackDownloadUrl) {
  if (!payload || typeof payload !== 'object') return null;
  const latestVersion =
    payload.latestVersion ||
    payload.version ||
    payload.tag_name ||
    '';
  const downloadUrl =
    payload.downloadUrl ||
    payload.url ||
    payload.html_url ||
    fallbackDownloadUrl ||
    '';
  const notes =
    payload.notes ||
    payload.body ||
    '';
  if (!latestVersion) return null;
  return { latestVersion: String(latestVersion), downloadUrl: String(downloadUrl || ''), notes: String(notes || '') };
}

async function checkForUpdates(options = {}) {
  if (updateCheckInFlight) return;
  updateCheckInFlight = true;
  try {
    const { silent = true } = options;
    const config = getUpdateConfig();
    if (!config.manifestUrl) {
      if (!silent) {
        await dialog.showMessageBox(mainWindow, {
          type: 'info',
          title: 'Check for Updates',
          message: 'Update URL not configured.',
          detail: 'Set update.manifestUrl in package.json or POO_IDE_UPDATE_MANIFEST_URL.'
        });
      }
      return;
    }

    const payload = await fetchJson(config.manifestUrl);
    const updateInfo = normalizeUpdatePayload(payload, config.downloadUrl);
    if (!updateInfo) {
      if (!silent) {
        await dialog.showMessageBox(mainWindow, {
          type: 'warning',
          title: 'Check for Updates',
          message: 'Could not parse update metadata.'
        });
      }
      return;
    }

    const currentVersion = app.getVersion();
    const hasUpdate = isVersionNewer(updateInfo.latestVersion, currentVersion);
    if (!hasUpdate) {
      if (!silent) {
        await dialog.showMessageBox(mainWindow, {
          type: 'info',
          title: 'Check for Updates',
          message: `You are up to date (v${currentVersion}).`
        });
      }
      return;
    }

    const detailLines = [
      `Current version: v${currentVersion}`,
      `Latest version: v${updateInfo.latestVersion}`,
      '',
      'Download the latest installer to update this app.'
    ];
    if (updateInfo.notes) {
      detailLines.push('', 'Release notes:', updateInfo.notes.slice(0, 1200));
    }
    const result = await dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Update Available',
      message: `A new version of Poo IDE is available.`,
      detail: detailLines.join('\n'),
      buttons: ['Download Update', 'Later'],
      defaultId: 0,
      cancelId: 1
    });
    if (result.response === 0) {
      const target = updateInfo.downloadUrl || config.manifestUrl;
      if (target) shell.openExternal(target);
    }
  } catch (e) {
    if (!options.silent) {
      await dialog.showMessageBox(mainWindow, {
        type: 'error',
        title: 'Check for Updates',
        message: 'Update check failed.',
        detail: e && e.message ? e.message : String(e)
      });
    }
  } finally {
    updateCheckInFlight = false;
  }
}


try {
  const _ud = path.join(__dirname, '.user_data');
  if (!fs.existsSync(_ud)) fs.mkdirSync(_ud, { recursive: true });
  app.commandLine.appendSwitch('disk-cache-dir', _ud);
  app.setPath('userData', _ud);
} catch (e) { console.warn('Could not initialize local userData/cache path:', e && e.message); }

function createWindow() {
  
  try {
    const ud = path.join(__dirname, '.user_data');
    if (!fs.existsSync(ud)) fs.mkdirSync(ud, { recursive: true });
    app.setPath('userData', ud);
  } catch (e) {
    console.warn('Could not set userData path:', e && e.message);
  }

  
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
    setTimeout(() => {
      checkForUpdates({ silent: true });
    }, 1800);
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
    const previewDir = path.join(app.getPath('temp'), 'poo-ide-preview');
    if (!fs.existsSync(previewDir)) fs.mkdirSync(previewDir, { recursive: true });
    const previewPath = path.join(previewDir, `preview-${Date.now()}-${Math.random().toString(36).slice(2)}.html`);
    fs.writeFileSync(previewPath, html, 'utf8');
    previewWin.loadFile(previewPath);
    previewWin.on('closed', () => {
      try {
        if (fs.existsSync(previewPath)) fs.unlinkSync(previewPath);
      } catch (e) {}
    });
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
              detail: `A visual website builder powered by Blockly.\nVersion ${app.getVersion()}`
            });
          }
        },
        {
          label: 'Check for Updates',
          click: () => {
            checkForUpdates({ silent: false });
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
