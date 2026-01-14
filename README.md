# ImageForge Pro

A professional offline image converter with batch processing, watermarks, resize, and format conversion. All processing happens locally - your images never leave your computer.

## Features

- **Format Conversion**: Convert between JPEG, PNG, WebP, GIF, BMP, ICO, AVIF
- **Input Formats**: JPG, PNG, WebP, GIF, BMP, SVG, ICO, TIFF, HEIC, AVIF
- **Quality Control**: Adjustable quality for lossy formats
- **Batch Processing**: Convert hundreds of images at once
- **Resize Options**:
  - By dimensions (with aspect ratio lock)
  - By percentage
  - Max width/height constraints
- **Transformations**:
  - Rotation (90°, 180°, 270°)
  - Horizontal/Vertical flip
- **Watermarking**:
  - Text watermarks with custom font, color, opacity
  - Image watermarks with size control
  - 6 position options including tiled repeat
- **Output Options**:
  - Custom naming patterns (suffix, prefix, custom)
  - Save to folder
  - Export as ZIP archive
- **100% Offline**: No internet required, complete privacy

## Installation

### Pre-built Binaries

Download the latest release from the [Releases]([releases](https://github.com/SysAdminDoc/ImageForge/releases/tag/v.1.0)) page:
- **Windows**: `ImageForge-Pro-Setup-2.0.0.exe` (installer) or `ImageForge-Pro-2.0.0-portable.exe`
- **macOS**: `ImageForge-Pro-2.0.0.dmg`
- **Linux**: `ImageForge-Pro-2.0.0.AppImage` or `.deb`

### Build from Source

1. **Prerequisites**:
   - Node.js 18+ 
   - npm or yarn

2. **Clone and install**:
   ```bash
   git clone https://github.com/yourusername/imageforge-pro.git
   cd imageforge-pro
   npm install
   ```

3. **Run in development**:
   ```bash
   npm start
   ```

4. **Build for your platform**:
   ```bash
   # Windows
   npm run build:win

   # macOS
   npm run build:mac

   # Linux
   npm run build:linux

   # All platforms
   npm run build
   ```

   Built files will be in the `dist/` folder.

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open images | `Ctrl+O` |
| Open folder | `Ctrl+Shift+O` |
| Paste from clipboard | `Ctrl+V` |
| Select all | `Ctrl+A` |
| Deselect all | `Ctrl+D` |
| Convert all | `Ctrl+Enter` |
| Remove selected | `Delete` |
| Clear all | `Ctrl+Shift+Delete` |
| Save all | `Ctrl+S` |
| Save as ZIP | `Ctrl+Shift+S` |

## Usage

1. **Add Images**: Drag & drop, use File menu, or paste from clipboard
2. **Configure Settings**: Choose output format, resize, rotation, watermark
3. **Convert**: Click "Convert All" or press `Ctrl+Enter`
4. **Save**: Save individually, to folder, or as ZIP archive

## Tech Stack

- Electron 28
- Pure JavaScript (no frameworks)
- HTML5 Canvas for image processing
- Archiver for ZIP creation

## License

MIT License - feel free to use, modify, and distribute.

## Contributing

Pull requests welcome! Please open an issue first to discuss major changes.
