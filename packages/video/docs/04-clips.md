# Clips

Clips are the building blocks of your video composition. DesignCombo supports several types of clips: Video, Image, Text, Audio, and Captions.

## Video Clips

### Loading Video Clips

```ts
import { Video } from "@designcombo/video";

// Load from URL
const videoClip = await Video.fromUrl("video.mp4");

// For Compositor (Worker/Server), you can also pass a ReadableStream
// const videoClip = new Video(stream);
```

### Video Properties

```ts
videoClip.left = 100;    // X position
videoClip.top = 200;     // Y position
videoClip.width = 800;
videoClip.height = 600;
videoClip.angle = 45;    // Rotation in degrees
videoClip.opacity = 0.8;
videoClip.volume = 0.5;  // 0.0 to 1.0

// Timeline range (in microseconds)
videoClip.display = {
  from: 0,
  to: 5e6, // 5 seconds
};

// Trim source media (in microseconds)
videoClip.trim = {
  from: 1e6, // Start 1 second in
  to: 4e6,   // End at 4 seconds
};
```

### Video Methods

```ts
// Get video metadata
console.log(videoClip.duration); // Total duration in ms
console.log(videoClip.width); // Original width
console.log(videoClip.height); // Original height
console.log(videoClip.fps); // Frame rate

// Control playback
videoClip.play();
videoClip.pause();
videoClip.seek(1500); // Seek to 1.5 seconds

// Get current state
console.log(videoClip.currentTime); // Current position
console.log(videoClip.isPlaying); // Playing state
```

## Image Clips

### Loading Image Clips

```ts
import { Image } from "@designcombo/video";

// Load from URL
const imageClip = await Image.fromUrl("photo.jpg");
```

### Image Transformations

Instead of a `fit` property, DesignCombo provides helper methods to size images:

```ts
// Scale to fit within dimensions
await imageClip.scaleToFit(1920, 1080);

// Scale to fill dimensions (may crop)
await imageClip.scaleToFill(1920, 1080);

// Center in scene
imageClip.centerInScene(1920, 1080);
```

## Text Clips

### Creating Text Clips

```ts
import { Text } from "@designcombo/video";

const textClip = new Text("Hello World", {
  fontSize: 48,
  fontFamily: "Arial",
  fill: "#ffffff",
});
```

### Text Properties

```ts
textClip.set({
  // Content (via style or direct property in construction)

  // Font
  style: {
    fontSize: 64,
    fontFamily: "Ubuntu",
    fontWeight: "bold",
    fontStyle: "italic",
    fill: "#ff0000",
    stroke: "#000000",
    strokeWidth: 2,
  }
});

textClip.left = 100;
textClip.top = 200;
```

### Text Styling

```ts
// Multi-line text
const textClip = new Text("Line 1\nLine 2\nLine 3", {
  fontSize: 48,
  textAlign: "center",
  lineHeight: 1.5,
});

// Text with shadow
textClip.set({
  shadowColor: "rgba(0, 0, 0, 0.5)",
  shadowBlur: 10,
  shadowOffsetX: 2,
  shadowOffsetY: 2,
});

// Text with gradient (if supported)
textClip.set({
  gradient: {
    type: "linear",
    x0: 0,
    y0: 0,
    x1: 100,
    y1: 0,
    stops: [
      { offset: 0, color: "#ff0000" },
      { offset: 1, color: "#0000ff" },
    ],
  },
});
```

## Common Clip Operations

### Positioning

```ts
// Absolute positioning
clip.left = 100;
clip.top = 200;

// Center on canvas/scene
clip.centerInScene(1920, 1080);
```

### Sizing

```ts
// Set explicit size
clip.width = 800;
clip.height = 600;

// Propagate changes via helper methods
await clip.scaleToFit(1920, 1080);
```

### Rotation

```ts
// Set rotation in degrees
clip.angle = 45;
```

### Opacity

```ts
// Set opacity (0-1)
clip.opacity = 0.5;

// Animations (microseconds)
clip.setAnimation(
  {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
  { duration: 1e6 } // 1 second
);
```

### Layering (Z-Index)

```ts
// Set layer order
clip.zIndex = 10;
```

### Visibility

```ts
// Show/hide clip
clip.show();
clip.hide();
clip.set({ visible: true });

// Check visibility
if (clip.isVisible) {
  // Clip is visible
}
```

## Clip Events

Listen to clip events:

```ts
// Property changes
clip.on("propsChange", (props) => {
  console.log('Properties changed:', props);
});
```

## Cloning Clips

```ts
// Create a copy of a clip
const clone = clip.clone();

// Clone with modifications
const clone = clip.clone({
  x: 200,
  y: 300,
  opacity: 0.5,
});
```

## Removing Clips

```ts
// Remove from studio
studio.remove(clip);

// Destroy clip and free resources
clip.destroy();
```

## Advanced: Custom Clips with PixiJS

DesignCombo is built on PixiJS, so you can create custom clips using PixiJS containers and sprites.

### Custom Clip

```ts
import { BaseClip, type IClipMeta } from "@designcombo/video";

class CustomClip extends BaseClip {
  readonly type = 'custom';
  readonly meta: IClipMeta = { width: 100, height: 100, duration: 10e6 };
  readonly ready = Promise.resolve(this.meta);

  async tick(time: number) {
    // Return video frame or audio data here
    return {
      state: 'success'
    };
  }

  async clone() {
    const c = new CustomClip();
    this.copyStateTo(c);
    return c;
  }
}
```

### Custom Sprite Clip

```ts
class SpriteClip extends BaseClip {
  constructor(texture, options) {
    super(options);

    this.sprite = new PIXI.Sprite(texture);
    this.sprite.anchor.set(0.5);
  }

  render(frame) {
    this.sprite.x = this.x;
    this.sprite.y = this.y;
    this.sprite.scale.set(this.scale);
    this.sprite.rotation = this.rotation * (Math.PI / 180);
    this.sprite.alpha = this.opacity;

    return this.sprite;
  }
}

// Use sprite clip
const texture = await PIXI.Texture.from("sprite.png");
const spriteClip = new SpriteClip(texture, { x: 500, y: 500 });
studio.add(spriteClip);
```

**Advanced Example:** See [Advanced Topics](./13-advanced.md#custom-rendering-with-pixijs) for more PixiJS integration examples.

## Best Practices

1. **Load clips asynchronously** - Use `await` or `.then()` for loading
2. **Dispose unused clips** - Call `clip.destroy()` to free memory
3. **Optimize sizes** - Don't load 4K videos if you only need 1080p
4. **Preload assets** - Load all clips before starting playback
5. **Use appropriate formats** - MP4 (H.264) for video, JPG/PNG for images
6. **Cache loaded clips** - Reuse clips instead of loading multiple times
7. **Set explicit dimensions** - Specify width/height for consistent results
