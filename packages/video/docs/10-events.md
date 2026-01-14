# Events

The `@designcombo/video` SDK provides a robust event system across the `Studio`, `Compositor`, and individual `Clip` instances. This allows you to build responsive UIs that react to playback, selection, and composition changes.

## Studio Events

The `Studio` class manages the main preview environment and emits events for high-level state changes.

### Playback Events

#### `currentTime`
Emitted during playback or when seeking. The payload contains the current time in microseconds.

```ts
studio.on("currentTime", ({ currentTime }) => {
  console.log("Current time (μs):", currentTime);
});
```

#### `play` / `pause`
Emitted when the playback state changes.

```ts
studio.on("play", ({ isPlaying }) => {
  console.log("Playback started");
});

studio.on("pause", ({ isPlaying }) => {
  console.log("Playback paused");
});
```

### Selection Events

#### `selection:created`
Emitted when one or more clips are selected.

```ts
studio.on("selection:created", ({ selected }) => {
  console.log("Selected clips:", selected);
});
```

#### `selection:updated`
Emitted when the current selection changes (e.g., adding a clip to an existing selection).

```ts
studio.on("selection:updated", ({ selected }) => {
  console.log("Updated selection:", selected);
});
```

#### `selection:cleared`
Emitted when all clips are deselected.

```ts
studio.on("selection:cleared", ({ deselected }) => {
  console.log("Deselected clips:", deselected);
});
```

### Composition Events

#### `clip:added` / `clip:removed`
Emitted when clips are added to or removed from the studio.

```ts
studio.on("clip:added", ({ clip, trackId }) => {
  console.log(`Clip ${clip.id} added to track ${trackId}`);
});

studio.on("clip:removed", ({ clipId }) => {
  console.log("Clip removed:", clipId);
});
```

#### `clip:updated`
Emitted when a clip's metadata or timeline position is updated via the studio.

```ts
studio.on("clip:updated", ({ clip }) => {
  console.log("Clip updated:", clip.id);
});
```

#### `track:added` / `track:removed`
Emitted when tracks are modified.

```ts
studio.on("track:added", ({ track }) => {
  console.log("New track added:", track.id);
});
```

#### `reset`
Emitted when the studio state is completely reset.

```ts
studio.on("reset", () => {
  console.log("Studio reset");
});
```

## Clip Events

Individual clips emit events for property changes. This is particularly useful for syncing properties panels or other reactive UI elements.

### `propsChange`
Emitted when any property of the clip (like `left`, `top`, `width`, `height`, `angle`, `opacity`, etc.) is changed.

```ts
clip.on("propsChange", (changes) => {
  console.log("Modified properties:", changes);
  // Example: { left: 100, top: 200 }
});
```

## Compositor Events

The `Compositor` is used for high-performance rendering and exports. It emits progress events during the rendering process.

### `OutputProgress`
Emitted during the rendering/export process.

```ts
compositor.on("OutputProgress", (progress) => {
  console.log(`Render progress: ${Math.round(progress * 100)}%`);
});
```

## Best Practices

### Cleanup
Always remove event listeners when they are no longer needed (e.g., when a component unmounts) to avoid memory leaks.

```ts
const handleTime = ({ currentTime }) => {
  // ...
};

studio.on("currentTime", handleTime);

// Later...
studio.off("currentTime", handleTime);
```

### Lightweight Handlers
Keep your event handlers lightweight. For expensive operations (like complex UI updates on every `currentTime` tick), consider throttling or using `requestAnimationFrame`.
