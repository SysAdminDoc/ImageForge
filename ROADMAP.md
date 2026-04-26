# ImageForge Roadmap

Browser-based batch image converter, editor, and optimizer — 100% client-side, runs from a single HTML file or as an Electron desktop app. Roadmap targets quality-per-byte optimization, pro-grade editing, and batch automation.

## Planned Features

### Codec & Quality
- **WASM AVIF/JPEG XL encoders** — switch from Canvas-native to `libavif`/`libjxl` WASM for real encoder control (speed, effort, tiling, tuning)
- **MozJPEG WASM** — replace Canvas JPEG path with MozJPEG for 10-20% smaller files at same visual quality
- **Perceptual target mode** — binary-search quality to hit a target SSIM/butteraugli score (not just target KB)
- **Two-pass AVIF** — first pass analyzes content, second pass applies optimal encoder settings per image
- **Chroma subsampling toggle** — 4:4:4 / 4:2:2 / 4:2:0 per format, with tooltip explaining tradeoffs

### Editing
- **Curves tool** — RGB + per-channel tone curves with bezier control points
- **Levels tool** — histogram with black-point/white-point/gamma sliders, per-channel
- **Color replace / match** — pick a color, shift all similar pixels to a target hue (eyedropper + tolerance)
- **Spot healing brush** — MediaPipe-like content-aware fill for small blemishes
- **Perspective crop** — 4-corner warp for document/photo deskew
- **Smart object resize** — seam carving for non-uniform scale

### Batch & Automation
- **Action recording** — record a sequence of edits on one image, replay on all loaded images
- **Watch folder (Electron)** — monitor an input dir, auto-convert new files to a preset, write to output dir
- **CLI wrapper (Electron)** — `imageforge --preset web --in photos/ --out out/` headless mode
- **Smart rename** — EXIF-based `{date:%Y-%m-%d}_{camera}_{counter}.jpg` template
- **Conditional processing** — "if image >5MB → compress to 2MB, else passthrough" rules

### Inspection
- **EXIF/XMP viewer + editor** — inspect and selectively strip (keep date, drop GPS)
- **Histogram overlay** — live RGB/luma histogram in the sidebar
- **Artifact view** — toggle 4x zoom of changed regions between before/after to spot compression artifacts
- **Color space preview** — simulate sRGB / Display P3 / Rec.2020 rendering, out-of-gamut warnings

### Formats
- **RAW read (libraw WASM)** — CR2/NEF/ARW/DNG in-browser
- **HEIC/HEIF read** — `libheif.js` for Apple photos
- **JPEG XL everywhere** — read + write; Chromium will re-ship it eventually, be ready

## Competitive Research
- **Squoosh (Google)** — gold standard for per-image format comparison with WASM encoders. Beat on batch (Squoosh is one-image).
- **TinyPNG / TinyJPG** — server-side, pay-to-play batch. Win on offline + no upload.
- **RIOT / FileOptimizer** — Windows-only optimizers, excellent at squeezing bytes. Borrow the optimizer-chain concept (jpegtran → mozjpeg → jpegoptim).
- **Photopea** — full Photoshop-in-browser; far more ambitious. ImageForge should stay batch-first, not try to out-Photoshop Photopea.

## Nice-to-Haves
- AI upscaler via `upscayl-wasm` / Real-ESRGAN WASM (2x/4x)
- Background removal via `@imgly/background-removal` WASM
- Text-to-image generate or img2img via transformers.js (SD Turbo) as an optional module
- Git-style "save diff" so settings snapshots are tiny diffs, not full profile dumps
- Multi-layer non-destructive editing with layer panel (would need a `.ifproj` file format)
- WebTransport / WebSocket remote processing option for offloading AVIF encodes to a LAN workstation

## Open-Source Research (Round 2)

### Related OSS Projects
- Priyansh6747/image_editor — https://github.com/Priyansh6747/image_editor — Rust + WASM + React in-browser editor; 5-10x faster than JS for heavy ops
- jayantrohila57/image-editor — https://github.com/jayantrohila57/image-editor — Next.js + WASM + Web Worker; 10 filters, non-blocking UI
- cunzaizhuyi/bat-sharp — https://github.com/cunzaizhuyi/bat-sharp — Node batch compress/convert; reference for format matrix (PNG/JPEG/WebP/AVIF)
- lovell/sharp — https://github.com/lovell/sharp — the libvips binding everyone uses server-side; for WASM there's wasm-vips
- jvm-image-scaling/squoosh — https://github.com/GoogleChromeLabs/squoosh — the reference browser-side image compressor; WebWorker + WASM per-codec
- Filerobot Image Editor — https://github.com/scaleflex/filerobot-image-editor — full-featured client-side editor (crop, rotate, filters, text, shapes)
- Cropper.js / CropperJS v2 — https://github.com/fengyuanchen/cropperjs — canonical cropping library
- tinify-corp / image-compressor — https://github.com/fengyuanchen/compressorjs — client-side JPEG/PNG compression via canvas
- jhildenbiddle/canvas-size — https://github.com/jhildenbiddle/canvas-size — runtime browser canvas size limit detection (critical for large-image handling)

### Features to Borrow
- **Per-codec WASM workers** (Squoosh) — mozjpeg, oxipng, webp, avif loaded on demand, each in its own worker; user picks encoder explicitly
- **Side-by-side comparison slider** (Squoosh) — live before/after drag slider with kB/SSIM readouts
- **Batch pipeline + ZIP download** (bat-sharp pattern, ported to browser) — drop N files → pipeline of (resize → format convert → strip metadata) → download ZIP
- **Drag-drop + clipboard paste ingest** (Filerobot) — paste image from clipboard straight into the editor
- **CropperJS 2 for crop/rotate/skew** — don't roll our own; battle-tested, aspect-ratio presets, touch support
- **Rust/WASM for CPU-bound filters** (Priyansh6747) — blur, sharpen, unsharp mask, perspective correct — WASM beats Canvas2D significantly
- **EXIF strip toggle, default ON for uploads** — privacy-default (inherit pattern from ImageXpert sibling)
- **Format-aware quality slider** — different perceptual-quality tradeoffs for JPEG vs. WebP vs. AVIF; show per-format size estimate live

### Patterns & Architectures Worth Studying
- Squoosh's **codec worker protocol** — each encoder is a worker + JSON options schema; the UI is generic and renders any encoder's options dynamically
- wasm-vips **streaming decode** — decode tiles instead of whole images → avoids browser canvas size limits for 100MP+ photos
- jayantrohila57's **Web Worker for filter application** — keeps slider drag at 60fps even on low-end devices
- `canvas.toBlob({type:'image/webp', quality: q})` **browser-native re-encode path** — sometimes faster than WASM for simple ops, useful fast path before loading WASM
- **OPFS (Origin Private File System)** scratch space — let users queue 100+ files without blowing browser memory; flush to OPFS between pipeline stages
