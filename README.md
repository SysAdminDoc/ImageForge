# ImageForge

![Version](https://img.shields.io/badge/version-3.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Browser%20%7C%20Electron-0078D4)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2020+-F7DF1E?logo=javascript&logoColor=black)
![Status](https://img.shields.io/badge/status-active-success)

> Professional batch image converter, editor, and optimizer that runs entirely in your browser — no uploads, no servers, no installs.

**[Live Demo](https://sysadmindoc.github.io/ImageForge/)**


## Quick Start

**Browser** — open `index.html` in any modern browser, or visit the live demo above.

**Electron** (optional desktop build):
```bash
git clone https://github.com/SysAdminDoc/ImageForge.git
cd ImageForge
npm install
npm start
```

No build step, no dependencies for browser mode. Single `index.html` file — drop it anywhere and it works.

## Features

### Format Conversion

| Feature | Description | Formats |
|---------|-------------|---------|
| Batch Convert | Convert hundreds of images simultaneously | JPEG, PNG, WebP, GIF, BMP, ICO, AVIF |
| Multi-format Export | Output each image to multiple formats in one pass | Any combination |
| Auto-optimize | Binary search finds lowest quality that fits your target KB | JPEG, WebP, AVIF |
| Quality Control | Granular quality slider with live size estimation | 1-100% |
| Favicon Bundle | Generate multi-size favicon PNGs (16-256px) as ZIP | PNG |
| PDF Export | Combine all converted images into a multi-page A4 PDF | PDF |

### Image Adjustments

| Adjustment | Range | Default |
|------------|-------|---------|
| Brightness | -100 to +100 | 0 |
| Contrast | -100 to +100 | 0 |
| Saturation | -100 to +100 | 0 |
| Blur | 0-20px | 0 |
| Sharpness | 0-100 (unsharp mask) | 0 |
| Hue Rotation | 0-360° | 0° |
| Grayscale | Toggle | Off |
| Sepia | Toggle | Off |
| Invert | Toggle | Off |

**Presets:** Reset All, Vivid, Muted, B&W, Vintage, Cold

### Effects

| Effect | Description | Range |
|--------|-------------|-------|
| Vignette | Radial edge darkening | 0-100 |
| Film Grain | Per-pixel noise overlay | 0-100 |
| Color Tint | Multiply blend color overlay with picker | 0-100 + color |

### Visual Crop Tool

Full-screen interactive crop overlay with:
- Click-and-drag region drawing
- Corner drag handles for precise adjustment
- Aspect ratio constraints: Free, 1:1, 16:9, 4:3, 3:2, 9:16
- Real-pixel dimension display
- Darkened outside area
- Values sync to sidebar numeric inputs

### Border & Padding

| Setting | Range | Default |
|---------|-------|---------|
| Border Width | 1-100px | 10 |
| Padding | 0-100px | 0 |
| Color | Any hex color | #ffffff |

### Background Fill

Replace transparency with a solid color — essential for PNG/WebP to JPEG conversion.

### Resize

| Mode | Description |
|------|-------------|
| By Dimensions | Set exact width/height in pixels |
| By Percentage | Scale by percentage (1-500%) |
| Max Width | Constrain width, scale height proportionally |
| Max Height | Constrain height, scale width proportionally |

Aspect ratio lock toggle for all modes.

### Social Media Presets

One-click resize to exact platform dimensions:

| Platform | Dimensions |
|----------|------------|
| Instagram Post | 1080 x 1080 |
| Instagram Story | 1080 x 1920 |
| Facebook Cover | 1200 x 630 |
| X (Twitter) Header | 1500 x 500 |
| YouTube Thumbnail | 1280 x 720 |
| LinkedIn Banner | 1584 x 396 |
| OG Image | 1200 x 628 |
| Facebook Header | 820 x 312 |

### Transform

Rotation (0°, 90°, 180°, 270°) and horizontal/vertical flip.

### Watermark

| Type | Options |
|------|---------|
| Text | Custom text, font size (8-200), color picker, opacity (1-100%) |
| Image | Upload watermark image, size control (5-50%) |

**Positions:** Top Left, Top Right, Bottom Left, Bottom Right, Center, Tile (Repeat)

### Canvas Annotations

Full-screen annotation editor with:
- **Freehand** drawing
- **Line** and **Arrow** tools
- **Rectangle** and **Circle** shapes
- **Text** placement
- Color picker and brush size (1-20px)
- Undo support
- Applies at full resolution back to source image

### Contact Sheet / Collage

Arrange all loaded images into a single grid image:
- Adjustable columns (1-8)
- Configurable spacing (0-40px)
- Background color picker
- Cover-fit per cell
- Download as PNG

### Metadata & Info

- **Image metadata viewer** — filename, format, dimensions, megapixels, aspect ratio, file size, color depth, estimated DPI
- **Copy as Data URI** — clipboard copy of full base64 data URI
- **Base64 copy** on each converted output
- **EXIF stripping** — enabled by default on conversion

### Batch Workflow

| Feature | Description |
|---------|-------------|
| Drag & Drop | Drop files or folders onto the grid |
| Clipboard Paste | Ctrl+V to paste images directly |
| Select All / Deselect | Toolbar buttons for batch selection |
| Convert Selected | Process only checked images |
| Sort | By name, size (asc/desc), dimensions, added order |
| Filter | All, JPG, PNG, WebP, GIF, Other |
| Drag to Reorder | Rearrange images by dragging cards |
| Checkerboard BG | Transparent PNGs show alpha on a checkerboard pattern |

### Output & Export

| Export Method | Description |
|---------------|-------------|
| Individual Download | Per-file download button |
| Download All | Batch download all converted files |
| ZIP Export | All files bundled into a single ZIP (JSZip) |
| PDF Export | Multi-page A4 PDF (jsPDF) |
| Favicon Bundle | Multi-size PNG set as ZIP |
| Base64 Copy | Clipboard copy per output file |

### Before/After Comparison

Click any converted file to open a Squoosh-style comparison overlay:
- Draggable slider divider
- ORIGINAL / CONVERTED labels
- Size stats and format info
- Touch support

### Settings Profiles

Save and load entire conversion configurations by name. Stored in `localStorage`. Captures all settings: format, quality, adjustments, effects, crop, resize, border, transform, watermark, and naming options.

### Output Naming

| Pattern | Example |
|---------|---------|
| Keep Original | `photo.jpg` |
| Add Suffix | `photo_converted.jpg` |
| Add Prefix | `converted_photo.jpg` |
| Counter | `photo_001.jpg`, `photo_002.jpg` |
| Custom | `{name}_web.jpg` |

### Stats Bar

Persistent footer showing: image count, total input size, total output size, and space saved (absolute + percentage).

## How It Works

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Input          │     │   Processing     │     │   Output         │
│                  │────>│                  │────>│                  │
│  Drop / Paste    │     │  Crop            │     │  Format Convert  │
│  File picker     │     │  Resize          │     │  ZIP Bundle      │
│  Folder import   │     │  CSS Filters     │     │  PDF Export      │
│  Clipboard       │     │  Sharpness USM   │     │  Favicon Bundle  │
│                  │     │  Effects          │     │  Base64 Copy     │
│                  │     │  Border/Padding   │     │  Individual DL   │
│                  │     │  Transform        │     │  Compare View    │
│                  │     │  Annotations      │     │                  │
│                  │     │  Watermark        │     │                  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        │              Canvas API (2D)                  │
        │              100% Client-side                 │
        └───────────────── No Server ───────────────────┘
```

All processing runs locally via Canvas API. No images leave your device. CDN scripts (JSZip, jsPDF) are lazy-loaded only when needed for ZIP/PDF export.

## Dual-Mode Architecture

ImageForge runs in two modes from the same codebase:

| Mode | How | File I/O |
|------|-----|----------|
| **Browser** | Open `index.html` directly or via GitHub Pages | `<a download>` triggers, Blob URLs |
| **Electron** | `npm start` for desktop app | Native file dialogs, direct filesystem writes |

All `window.electronAPI` calls are guarded — the app gracefully falls back to browser APIs when Electron is unavailable.

## Prerequisites

- Any modern browser (Chrome, Firefox, Edge, Safari)
- JavaScript enabled
- No server, no Node.js, no build tools required for browser mode
- Node.js 18+ for optional Electron desktop build

## FAQ

**Does it upload my images anywhere?**
No. Everything runs locally in your browser. No server communication occurs.

**What's the maximum image size?**
Limited by browser memory. Typically handles images up to ~50MP without issues.

**Can I use it offline?**
Yes. The core app is a single HTML file. ZIP and PDF export require a one-time CDN load for JSZip/jsPDF (cached after first use).

**Does auto-optimize actually find the optimal quality?**
It performs 8 binary search iterations, narrowing from quality 1-100. This finds a quality level within ~1% of the theoretical optimum for your target file size.

**Where are settings profiles stored?**
In your browser's `localStorage` under the key `if_profiles`. Clearing browser data will remove them.

## License

MIT License — see [LICENSE](LICENSE) for details.

Issues and PRs welcome.
