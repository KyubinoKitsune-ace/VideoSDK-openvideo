# Studio

The Studio is the interactive workspace for your video editing. It manages the visual canvas, selection, transformation, and real-time editing of clips and objects.

## Creating a Studio

```ts
import { Studio } from "@designcombo/video";

const studio = new Studio({
  width: 1920,
  height: 1080,
  fps: 30,
  bgColor: "#ffffff",
  canvas: document.getElementById("canvas") as HTMLCanvasElement,
});

// The studio initializes its PixiJS application automatically on construction (via initPixiApp).
// You can wait for it to be ready:
await studio.ready;
```

## Configuration Options

### IStudioOpts

```ts
interface IStudioOpts {
  width: number;
  height: number;
  fps?: number;
  bgColor?: string;
  canvas?: HTMLCanvasElement;
  interactivity?: boolean;
}
```

### Interactive Controls

The Studio supports interactive transformations (moving, scaling, rotating) by default. You can disable this via the `interactivity` option:

```ts
const studio = new Studio({
  width: 1920,
  height: 1080,
  interactivity: false, // Disable all interactive controls
});
```

## Adding and Removing Objects

### addClip()

Add clips to the studio:

```ts
import { Image } from "@designcombo/video";

const image = await Image.fromUrl("photo.jpg");
studio.addClip(image);
```

### removeClip()

Remove clips from the studio:

```ts
studio.removeClip(image.id);
```

## Selection Management

### selectedClips

Get the currently selected clips:

```ts
const selected = studio.selectedClips; // Set<IClip>
if (selected.size > 0) {
  console.log(`${selected.size} clips selected`);
}
```

## Transformation

The studio automatically shows transform controls when objects are selected. Users can:

- **Drag** to move objects
- **Drag corners** to resize
- **Drag rotation handle** to rotate
- **Selection box** for multi-select

## Studio Events

The studio implements an event emitter that notifies you about changes in the workspace.

```ts
studio.on('selection:created', ({ selected }) => {
  console.log('Selection created', selected);
});

studio.on('clip:added', ({ clip, trackId }) => {
  console.log('Clip added', clip.id);
});

studio.on('currentTime', ({ currentTime }) => {
  // currentTime is in microseconds
  console.log('Current time:', currentTime);
});
```

## Artboard

The studio includes an internal artboard (composition area) where clips are placed. The artboard:

- Clips child objects with a mask to match the studio dimensions
- Centers in the canvas viewport
- Can have a custom background color

```ts
const studio = new Studio({
  width: 1920,
  height: 1080,
  bgColor: "#ffffff",
});
```

## Coordinate Conversion

### screenToArtboard()

Convert screen coordinates to artboard coordinates:

```ts
const artboardPos = studio.screenToArtboard(mouseX, mouseY);
```

### artboardToScreen()

Convert artboard coordinates to screen coordinates:

```ts
const screenPos = studio.artboardToScreen(objectX, objectY);
```

## Cleanup

### destroy()

Clean up and destroy the studio:

```ts
studio.destroy();
```

This will:

- Remove all event listeners
- Destroy the PixiJS application
- Clean up all containers
- Free memory

## Complete Example

```ts
import { Studio, Image, Text } from "@designcombo/video";

// Create studio
const studio = new Studio({
  width: 1920,
  height: 1080,
  bgColor: "#222222",
  canvas: document.querySelector("canvas") as HTMLCanvasElement,
});

// Wait for studio to be ready
await studio.ready;

// Add clips
const image = await Image.fromUrl("photo.jpg");
image.set({
  left: 200,
  top: 200,
  width: 400,
  height: 300,
});

const text = new Text("Hello World", {
  fontSize: 100,
  fill: "#ffffff",
});
text.set({
  left: 800,
  top: 500,
});

studio.addClip(image);
studio.addClip(text);

// Listen for selection changes
studio.on('selection:created', ({ selected }) => {
  console.log(`${selected.length} clips selected`);
});

// Later: cleanup
// studio.destroy();
```

## Next Steps

- [Working with Clips](./04-clips.md) - Load and configure media
- [Animations](./05-animations.md) - Add motion to your videos
- [Transitions](./06-transitions.md) - Create smooth transitions
