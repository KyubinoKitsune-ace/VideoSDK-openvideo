# Installation

## Package Manager

Install DesignCombo using your preferred package manager:

```bash
# pnpm (recommended)
pnpm add @designcombo/video

# npm
npm install @designcombo/video

# yarn
yarn add @designcombo/video
```

**Note:** DesignCombo includes PixiJS as a dependency - no need to install it separately.

## Browser Support

DesignCombo requires modern browsers with support for:

- **WebCodecs API** - For video encoding/decoding (required)
- **WebGL** - For hardware-accelerated rendering (required)
- **Web Workers** - For background processing
- **ES2020+** - Modern JavaScript features

### Supported Browsers

| Browser | Version | WebCodecs | Notes                          |
| ------- | ------- | --------- | ------------------------------ |
| Chrome  | 94+     | ✅        | Full support, best performance |
| Edge    | 94+     | ✅        | Full support                   |
| Safari  | 16.4+   | ✅        | Full support (macOS/iOS)       |
| Firefox | 100+    | ⚠️        | Limited WebCodecs support      |

**Note:** WebCodecs support is required for video export. Preview rendering works in all browsers with WebGL support.

## Quick Start

```ts
import { Studio, Video } from "@designcombo/video";

const studio = new Studio({
  width: 1920,
  height: 1080,
  fps: 30,
  bgColor: "#000000",
  canvas: document.getElementById("canvas") as HTMLCanvasElement, // Optional
});

// Load a video clip
const videoClip = await Video.fromUrl("video.mp4");

// Set display range (in microseconds)
// 0 to 5 seconds
videoClip.set({ display: { from: 0, to: 5e6 } });

// Add to studio
studio.addClip(videoClip);

// Play preview
studio.play();
```

## TypeScript

DesignCombo includes full type definitions:

```ts
import { Studio, type IStudioOpts } from "@designcombo/video";

const opts: IStudioOpts = {
  width: 1920,
  height: 1080,
  fps: 30
};

const studio = new Studio(opts);
```

## CDN (Browser)

For quick prototyping, use the CDN version:

```html
<script type="module">
  import { Studio } from "https://cdn.jsdelivr.net/npm/@designcombo/video/+esm";

  const studio = new Studio({
    width: 1920,
    height: 1080,
    fps: 30,
    canvas: document.getElementById('my-canvas')
  });
</script>
```

## Verifying Installation

```ts
import { Compositor } from "@designcombo/video";

// Check environment capabilities
const result = await Compositor.isSupported();

if (result) {
  console.log("Environment is supported");
} else {
  console.error("Video processing not supported in this environment");
}
```

## System Requirements

### For Preview (Rendering)

- **WebGL 2.0** support (all modern browsers)
- Minimum 2GB RAM
- Dedicated GPU recommended for smooth playback

### For Export (Video Encoding)

- **WebCodecs API** support (Chrome 94+, Safari 16.4+, Edge 94+)
- Minimum 4GB RAM
- Dedicated GPU highly recommended
- Fast CPU for encoding performance

## Next Steps

- [Basic Usage](./02-basic-usage.md) - Learn the fundamentals
- [Studio API](./03-studio.md) - Master studio management
- [Working with Clips](./04-clips.md) - Load and configure media
- [Animations](./05-animations.md) - Add motion to your videos
- [Transitions](./06-transitions.md) - Create smooth transitions
