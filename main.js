const { app, BrowserWindow, Menu, dialog, shell } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    icon: path.join(__dirname, 'favicon.ico'),
    title: 'WebBlocks',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadFile('index.html');

  // Build the application menu
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
          label: 'About WebBlocks',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About WebBlocks',
              message: 'WebBlocks',
              detail: 'A visual website builder powered by Blockly.\nVersion 1.0.0'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
