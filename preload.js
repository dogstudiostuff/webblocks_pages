// tiny preload shim — I sometimes add debug logs here
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    saveFile: (options) => ipcRenderer.invoke('save-file', options),
    previewHtml: (html) => ipcRenderer.invoke('preview-html', html)
});

// small dev hint
var _preloadNote = 'preload ok';