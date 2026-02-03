<h1 align="center">OpenVideo</h1>

<p align="center">
  <strong>High-performance video editing SDK for the web, powered by WebCodecs and PixiJS</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/openvideo?style=flat-square" alt="npm version" />
  <img src="https://img.shields.io/badge/license-dual-blue?style=flat-square" alt="license" />
  <img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen?style=flat-square" alt="node version" />
</p>

---

## Overview

OpenVideo is a framework-agnostic video editing SDK that enables browser-based video composition, editing, and rendering. Built on modern web APIs, it delivers professional-grade video editing capabilities without server-side processing.

This monorepo contains:

| Package | Description |
|---------|-------------|
| [`openvideo`](./packages/openvideo) | Core SDK for video composition and rendering |
| [`@designcombo/node`](./packages/node) | Server-side rendering via Playwright |
| [`editor`](./editor) | Full-featured AI video editor application |
| [`docs`](./docs) | Documentation site |

## Features

- **Browser-Native Rendering** — Hardware-accelerated video encoding/decoding via WebCodecs API
- **GPU-Powered Composition** — PixiJS-based rendering engine for complex multi-track layering
- **Universal Clip Support** — Video, Audio, Image, Text, and Caption clips with full control
- **60+ Transitions** — GLSL-powered transitions including cube, fade, wipe, zoom, and more
- **Visual Effects** — Built-in filters: blur, brightness, contrast, chromakey, sepia, etc.
- **Keyframe Animations** — Property-based animations with easing functions
- **JSON Serialization** — Full project state export/import for persistence and cloud rendering
- **Microsecond Precision** — Timeline with microsecond-level accuracy
- **Undo/Redo History** — Built-in history management with patch-based state tracking

## Quick Start

### Installation

```bash
npm install openvideo
```

### Basic Usage

```typescript
import { Studio, Video, Text } from 'openvideo';

// Initialize the studio
const studio = new Studio({
  width: 1920,
  height: 1080,
  fps: 30,
  canvas: document.getElementById('canvas') as HTMLCanvasElement,
});

await studio.ready;

// Add a video clip
const video = await Video.fromUrl('https://example.com/video.mp4');
video.display = { from: 0, to: 10e6 }; // 0-10 seconds (microseconds)
await studio.addClip(video);

// Add text overlay
const text = new Text('Hello World', {
  fontSize: 64,
  fontFamily: 'Arial',
  fill: '#ffffff',
});
text.display = { from: 0, to: 5e6 };
await studio.addClip(text);

// Play preview
studio.play();
```

### Export Video

```typescript
import { Compositor } from 'openvideo';

// Check browser support
const supported = await Compositor.isSupported();

if (supported) {
  const compositor = new Compositor({
    width: 1920,
    height: 1080,
    fps: 30,
    bitrate: 5e6,
  });

  // Load project from JSON
  await compositor.loadFromJSON(studio.exportToJSON());

  // Get video stream
  const stream = compositor.output();

  // Handle the stream (e.g., save to file)
  compositor.on('OutputProgress', (progress) => {
    console.log(`Rendering: ${Math.round(progress * 100)}%`);
  });
}
```

## Clip Types

| Type | Description | Example |
|------|-------------|---------|
| `Video` | Video files with audio | `await Video.fromUrl('video.mp4')` |
| `Audio` | Audio tracks | `await Audio.fromUrl('music.mp3')` |
| `Image` | Static images | `await Image.fromUrl('photo.jpg')` |
| `Text` | Styled text overlays | `new Text('Hello', { fontSize: 48 })` |
| `Caption` | Timed captions with word highlighting | `new Caption('Subtitle', { words: [...] })` |

## Transitions

Add smooth transitions between clips:

```typescript
// Add two video clips
const video1 = await Video.fromUrl('clip1.mp4');
const video2 = await Video.fromUrl('clip2.mp4');

video1.display = { from: 0, to: 5e6 };
video2.display = { from: 5e6, to: 10e6 };

await studio.addClip(video1);
await studio.addClip(video2);

// Add a cube transition (2 seconds)
await studio.addTransition('cube', 2e6, video1.id, video2.id);
```

Available transitions include: `fade`, `cube`, `wipeLeft`, `wipeRight`, `crossZoom`, `Dreamy`, `pixelize`, `ripple`, and 50+ more.

## Animations

Animate any clip property with keyframes:

```typescript
const image = await Image.fromUrl('photo.jpg');

image.setAnimation({
  '0%': { left: 0, opacity: 0 },
  '50%': { left: 500, opacity: 1 },
  '100%': { left: 1000, opacity: 0 },
}, {
  duration: 2e6, // 2 seconds
  easing: 'easeInOut',
});
```

## Server-Side Rendering

Render videos on the server using the Node.js package:

```typescript
import { Renderer } from '@designcombo/node';

const renderer = new Renderer({
  json: projectJSON,
  outputPath: './output.mp4',
});

renderer.on('progress', ({ phase, progress }) => {
  console.log(`[${phase}] ${Math.round(progress * 100)}%`);
});

await renderer.render();
```

## AI Video Editor

The [`editor`](./editor) package is a complete AI-powered video editor built with Next.js:

- **AI Copilot** — Chat-based editing assistant
- **Script Generation** — OpenAI/Gemini integration
- **Text-to-Speech** — ElevenLabs voiceover synthesis
- **Auto-Captions** — Deepgram transcription
- **Stock Media** — Pexels/Freepik integration
- **Multi-Track Timeline** — Professional editing interface

```bash
cd editor
cp .env.sample .env  # Configure API keys
pnpm dev
```

## Browser Support

| Browser | Version | WebCodecs | Status |
|---------|---------|-----------|--------|
| Chrome | 94+ | ✅ | Full support |
| Edge | 94+ | ✅ | Full support |
| Safari | 16.4+ | ✅ | Full support |
| Firefox | 100+ | ⚠️ | Preview only* |

*Firefox has limited WebCodecs support. Preview works via WebGL, but video export may be limited.

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run development servers
pnpm dev

# Run tests
pnpm --filter openvideo test

# Lint and format
pnpm check:fix
```

## License

OpenVideo is dual-licensed:

- **Personal Use**: Free for personal, non-commercial projects
- **Commercial Use**: Requires a commercial license

See [LICENSE](LICENSE) for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

