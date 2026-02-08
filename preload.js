const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    saveFile: (options) => ipcRenderer.invoke('save-file', options),
    previewHtml: (html) => ipcRenderer.invoke('preview-html', html)
});
