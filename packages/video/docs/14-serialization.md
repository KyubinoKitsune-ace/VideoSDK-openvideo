# Serialization

DesignCombo provides built-in support for serializing the entire studio state into a JSON-serializable object. This is essential for:

- **Saving/Loading**: Store projects in `localStorage`, a database, or as local files.
- **Project Export**: Share project states across different environments.
- **Cloud Rendering**: Send project JSON to a server for high-performance rendering with the `Compositor`.

## Exporting State

To capture the current state of your project, use the `exportToJSON()` method on the `Studio` instance. This returns a `ProjectJSON` object.

```ts
import { Studio } from "@designcombo/video";

const studio = new Studio({
  width: 1920,
  height: 1080,
});

// Capture the project state
const projectData = studio.exportToJSON();

// You can now save this to a database or localStorage
localStorage.setItem("my-project-v1", JSON.stringify(projectData));
```

## Loading State

To restore a previously saved project, use the `loadFromJSON()` method. This is an asynchronous operation as it may need to fetch media resources (videos, images, fonts).

```ts
// Retrieve the data
const savedData = JSON.parse(localStorage.getItem("my-project-v1"));

if (savedData) {
  // Load into the studio
  await studio.loadFromJSON(savedData);
  console.log("Project restored!");
}
```

> [!NOTE]
> `loadFromJSON` will automatically clear the current studio state before restoring the saved project.

## Project Structure

The serialized `ProjectJSON` object has the following high-level structure:

```ts
interface ProjectJSON {
  settings: {
    width: number;
    height: number;
    fps: number;
    bgColor: string;
  };
  clips: ClipJSON[]; // Normalized list of all clips
  tracks: StudioTrackJSON[]; // Structural info for timeline layers
  transitions: GlobalTransitionJSON[];
}
```

### Clip Serialization

Each clip type (Video, Image, Text, etc.) serializes its core properties:

- `id`: Unique identifier.
- `type`: The clip type string.
- `display`: Timeline range `{ from, to }` in **microseconds**.
- `left`, `top`, `width`, `height`, `angle`: Spatial properties.
- `opacity`, `zIndex`, `playbackRate`: Rendering controls.
- `src`: Source URL for media clips.
- `style`: Type-specific styling (e.g., `fontSize`, `fontFamily` for Text).

## Best Practices

### Media Accessibility
Ensure that the `src` URLs in your serialized JSON remain accessible. If you move your media to a different CDN or local path, you may need to update the `src` properties in the JSON before loading.

### Microsecond Precision
The SDK uses microseconds for all time-based properties (`display`, `trim`, `duration`). When manipulating JSON data manually, ensure you maintain this precision.

### Cloud Rendering
The JSON produced by `studio.exportToJSON()` is directly compatible with the `Compositor`. You can send this JSON to a worker or server-side environment to render the final video.

```ts
import { Compositor } from "@designcombo/video";

const projectData = studio.exportToJSON();

// On the server/worker:
const compositor = new Compositor(projectData.settings);
await compositor.loadFromJSON(projectData);
const stream = await compositor.output();
```
