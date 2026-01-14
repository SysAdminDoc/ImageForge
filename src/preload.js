const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // File operations
    openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
    openFolderDialog: () => ipcRenderer.invoke('open-folder-dialog'),
    saveFile: (data) => ipcRenderer.invoke('save-file', data),
    saveFilesToFolder: (files) => ipcRenderer.invoke('save-files-to-folder', files),
    saveAsZip: (files) => ipcRenderer.invoke('save-as-zip', files),
    showItemInFolder: (path) => ipcRenderer.invoke('show-item-in-folder', path),

    // Menu events
    onFilesSelected: (callback) => ipcRenderer.on('files-selected', (event, files) => callback(files)),
    onOutputFolderSet: (callback) => ipcRenderer.on('output-folder-set', (event, folder) => callback(folder)),
    onMenuSelectAll: (callback) => ipcRenderer.on('menu-select-all', () => callback()),
    onMenuDeselect: (callback) => ipcRenderer.on('menu-deselect', () => callback()),
    onMenuRemoveSelected: (callback) => ipcRenderer.on('menu-remove-selected', () => callback()),
    onMenuClearAll: (callback) => ipcRenderer.on('menu-clear-all', () => callback()),
    onMenuConvert: (callback) => ipcRenderer.on('menu-convert', () => callback()),
    onMenuConvertSelected: (callback) => ipcRenderer.on('menu-convert-selected', () => callback()),
    onMenuSaveAll: (callback) => ipcRenderer.on('menu-save-all', () => callback()),
    onMenuSaveZip: (callback) => ipcRenderer.on('menu-save-zip', () => callback()),
    onMenuShortcuts: (callback) => ipcRenderer.on('menu-shortcuts', () => callback()),

    // Platform info
    platform: process.platform
});
