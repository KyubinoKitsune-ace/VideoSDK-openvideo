# Audio

DesignCombo provides audio support for video clips and standalone audio tracks.

## Standalone Audio

You can use `Audio` clips for background music, sound effects, and voiceovers.

```ts
import { Audio } from "@designcombo/video";

// Load audio track asynchronously
const audioTrack = await Audio.fromUrl("music.mp3");

// Position on timeline (in microseconds)
audioTrack.display = {
  from: 0,
  to: 30e6, // 30 seconds
};

// Control volume (0.0 to 1.0)
audioTrack.volume = 0.5;

studio.addClip(audioTrack);
```

## Audio in Video Clips

Video clips also expose a `volume` property:

```ts
const videoClip = await Video.fromUrl("video.mp4");
videoClip.volume = 0.8;
```

## Management

Like all clips, you can trim audio using the `trim` property:

```ts
audioTrack.trim = {
  from: 5e6, // start 5 seconds in
  to: 15e6,  // end at 15 seconds
};
```
