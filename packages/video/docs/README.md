# DesignCombo Documentation

Welcome to the DesignCombo documentation! DesignCombo is a framework-agnostic video editor SDK built on the WebCodecs API.

## Table of Contents

1. [Installation](./01-installation.md) - Get started with DesignCombo
2. [Basic Usage](./02-basic-usage.md) - Learn the fundamentals
3. [Studio API](./03-studio.md) - Master studio management
4. [Clips](./04-clips.md) - Work with video, image, and text clips
5. [Animations](./05-animations.md) - Add motion and effects
6. [Transitions](./06-transitions.md) - Create smooth transitions
7. [Effects](./07-effects.md) - Apply filters and visual effects
8. [Audio](./08-audio.md) - Handle audio tracks and mixing
9. [Tracks](./09-tracks.md) - Organize and layer your composition
10. [Events](./10-events.md) - Listen to studio events and user interactions
11. [Rendering & Export](./11-rendering-and-export.md) - Export your videos
12. [API Reference](./12-api-reference.md) - Complete API documentation
13. [Advanced Topics](./13-advanced.md) - PixiJS integration, WebCodecs, custom rendering
14. [Serialization](./14-serialization.md) - Save and restore studio state

## Quick Start

```ts
import { Studio, Video } from "@designcombo/video";

const studio = new Studio({
  width: 1920,
  height: 1080,
  fps: 30,
});

await studio.ready;

const video = await Video.fromUrl("video.mp4");
await studio.addClip(video);

studio.play();
```

## Core Concepts

### Studio

The Studio is the main container for your video composition. It manages all clips, transitions, timeline, playback, and rendering.

### Clips

Clips are the building blocks - video, image, text, and audio elements positioned on the timeline.

### Timeline

Microsecond-based timeline where all clips are positioned.

### Animations

Property-based animations using keyframes and easing.

### Transitions

Visual effects applied between consecutive clips on the timeline.

## Browser Support

Built on **PixiJS (WebGL)** for rendering and **WebCodecs** for video export.

| Browser | Version | WebGL | WebCodecs | Status         |
| ------- | ------- | ----- | --------- | -------------- |
| Chrome  | 94+     | ✅    | ✅        | Full support   |
| Edge    | 94+     | ✅    | ✅        | Full support   |
| Safari  | 16.4+   | ✅    | ✅        | Full support   |
| Firefox | 100+    | ✅    | ⚠️        | Preview only\* |

\*Firefox has limited WebCodecs support. Preview works via WebGL, but video export may be limited.
