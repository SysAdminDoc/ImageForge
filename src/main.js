const { app, BrowserWindow, ipcMain, dialog, Menu, shell, nativeTheme } = require('electron');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

// Force dark mode
nativeTheme.themeSource = 'dark';

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1100,
        minHeight: 700,
        backgroundColor: '#020617',
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#0f172a',
            symbolColor: '#f8fafc',
            height: 40
        },
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, '..', 'assets', 'icon.png'),
        show: false
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // Show window when ready
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Create application menu
    createMenu();
}

function createMenu() {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open Images...',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => openFiles()
                },
                {
                    label: 'Open Folder...',
                    accelerator: 'CmdOrCtrl+Shift+O',
                    click: () => openFolder()
                },
                { type: 'separator' },
                {
                    label: 'Save All',
                    accelerator: 'CmdOrCtrl+S',
                    click: () => mainWindow.webContents.send('menu-save-all')
                },
                {
                    label: 'Save As ZIP...',
                    accelerator: 'CmdOrCtrl+Shift+S',
                    click: () => mainWindow.webContents.send('menu-save-zip')
                },
                { type: 'separator' },
                {
                    label: 'Set Output Folder...',
                    click: () => setOutputFolder()
                },
                { type: 'separator' },
                { role: 'quit' }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                {
                    label: 'Select All',
                    accelerator: 'CmdOrCtrl+A',
                    click: () => mainWindow.webContents.send('menu-select-all')
                },
                {
                    label: 'Deselect All',
                    accelerator: 'CmdOrCtrl+D',
                    click: () => mainWindow.webContents.send('menu-deselect')
                },
                { type: 'separator' },
                {
                    label: 'Remove Selected',
                    accelerator: 'Delete',
                    click: () => mainWindow.webContents.send('menu-remove-selected')
                },
                {
                    label: 'Clear All',
                    accelerator: 'CmdOrCtrl+Shift+Delete',
                    click: () => mainWindow.webContents.send('menu-clear-all')
                }
            ]
        },
        {
            label: 'Convert',
            submenu: [
                {
                    label: 'Convert All',
                    accelerator: 'CmdOrCtrl+Enter',
                    click: () => mainWindow.webContents.send('menu-convert')
                },
                {
                    label: 'Convert Selected',
                    accelerator: 'CmdOrCtrl+Shift+Enter',
                    click: () => mainWindow.webContents.send('menu-convert-selected')
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
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
                    label: 'Keyboard Shortcuts',
                    accelerator: 'F1',
                    click: () => mainWindow.webContents.send('menu-shortcuts')
                },
                { type: 'separator' },
                {
                    label: 'About ImageForge Pro',
                    click: () => showAbout()
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

async function openFiles() {
    const result = await dialog.showOpenDialog(mainWindow, {
        title: 'Select Images',
        properties: ['openFile', 'multiSelections'],
        filters: [
            { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'ico', 'tiff', 'tif', 'heic', 'heif', 'avif'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    });

    if (!result.canceled && result.filePaths.length > 0) {
        const files = await Promise.all(result.filePaths.map(async (filePath) => {
            const buffer = await fs.promises.readFile(filePath);
            const base64 = buffer.toString('base64');
            const ext = path.extname(filePath).toLowerCase().slice(1);
            const mimeType = getMimeType(ext);
            return {
                name: path.basename(filePath),
                path: filePath,
                dataUrl: `data:${mimeType};base64,${base64}`,
                size: buffer.length
            };
        }));
        mainWindow.webContents.send('files-selected', files);
    }
}

async function openFolder() {
    const result = await dialog.showOpenDialog(mainWindow, {
        title: 'Select Folder',
        properties: ['openDirectory']
    });

    if (!result.canceled && result.filePaths.length > 0) {
        const folderPath = result.filePaths[0];
        const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg', '.ico', '.tiff', '.tif', '.heic', '.heif', '.avif'];
        
        const allFiles = await fs.promises.readdir(folderPath);
        const imageFiles = allFiles.filter(file => 
            extensions.includes(path.extname(file).toLowerCase())
        );

        const files = await Promise.all(imageFiles.map(async (file) => {
            const filePath = path.join(folderPath, file);
            const buffer = await fs.promises.readFile(filePath);
            const base64 = buffer.toString('base64');
            const ext = path.extname(file).toLowerCase().slice(1);
            const mimeType = getMimeType(ext);
            return {
                name: file,
                path: filePath,
                dataUrl: `data:${mimeType};base64,${base64}`,
                size: buffer.length
            };
        }));

        mainWindow.webContents.send('files-selected', files);
    }
}

async function setOutputFolder() {
    const result = await dialog.showOpenDialog(mainWindow, {
        title: 'Select Output Folder',
        properties: ['openDirectory', 'createDirectory']
    });

    if (!result.canceled && result.filePaths.length > 0) {
        mainWindow.webContents.send('output-folder-set', result.filePaths[0]);
    }
}

function showAbout() {
    dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'About ImageForge Pro',
        message: 'ImageForge Pro',
        detail: `Version 2.0.0\n\nProfessional offline image converter with batch processing, watermarks, resize, and format conversion.\n\nAll processing happens locally - your images never leave your computer.`
    });
}

function getMimeType(ext) {
    const types = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        webp: 'image/webp',
        bmp: 'image/bmp',
        svg: 'image/svg+xml',
        ico: 'image/x-icon',
        tiff: 'image/tiff',
        tif: 'image/tiff',
        heic: 'image/heic',
        heif: 'image/heif',
        avif: 'image/avif'
    };
    return types[ext] || 'application/octet-stream';
}

// IPC Handlers
ipcMain.handle('open-file-dialog', openFiles);
ipcMain.handle('open-folder-dialog', openFolder);

ipcMain.handle('save-file', async (event, { buffer, fileName, defaultPath }) => {
    const result = await dialog.showSaveDialog(mainWindow, {
        title: 'Save Image',
        defaultPath: defaultPath || fileName,
        filters: [
            { name: 'Images', extensions: [path.extname(fileName).slice(1)] }
        ]
    });

    if (!result.canceled && result.filePath) {
        await fs.promises.writeFile(result.filePath, Buffer.from(buffer));
        return { success: true, path: result.filePath };
    }
    return { success: false };
});

ipcMain.handle('save-files-to-folder', async (event, files) => {
    const result = await dialog.showOpenDialog(mainWindow, {
        title: 'Select Output Folder',
        properties: ['openDirectory', 'createDirectory']
    });

    if (!result.canceled && result.filePaths.length > 0) {
        const outputDir = result.filePaths[0];
        const saved = [];

        for (const file of files) {
            const outputPath = path.join(outputDir, file.name);
            await fs.promises.writeFile(outputPath, Buffer.from(file.buffer));
            saved.push(outputPath);
        }

        return { success: true, count: saved.length, folder: outputDir };
    }
    return { success: false };
});

ipcMain.handle('save-as-zip', async (event, files) => {
    const result = await dialog.showSaveDialog(mainWindow, {
        title: 'Save as ZIP',
        defaultPath: `converted-images-${Date.now()}.zip`,
        filters: [
            { name: 'ZIP Archive', extensions: ['zip'] }
        ]
    });

    if (!result.canceled && result.filePath) {
        return new Promise((resolve, reject) => {
            const output = fs.createWriteStream(result.filePath);
            const archive = archiver('zip', { zlib: { level: 9 } });

            output.on('close', () => {
                resolve({ success: true, path: result.filePath, size: archive.pointer() });
            });

            archive.on('error', (err) => {
                reject(err);
            });

            archive.pipe(output);

            for (const file of files) {
                archive.append(Buffer.from(file.buffer), { name: file.name });
            }

            archive.finalize();
        });
    }
    return { success: false };
});

ipcMain.handle('show-item-in-folder', async (event, filePath) => {
    shell.showItemInFolder(filePath);
});

// App lifecycle
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
