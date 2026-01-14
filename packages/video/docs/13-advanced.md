# Advanced Topics

Explore advanced features and integrations of DesignCombo.

## custom rendering with PixiJS

Since DesignCombo is built on top of PixiJS, you can easily integrate custom PixiJS logic.

### Accessing the PixiJS Application

You can access the underlying PixiJS `Application` instance from the `Studio`:

```ts
import { Studio } from "@designcombo/video";

const studio = new Studio({
  width: 1920,
  height: 1080,
});

await studio.ready;

const pixiApp = studio.pixiApp;
if (pixiApp) {
  // Use PixiJS API
  console.log(pixiApp.renderer.width);
}
```

## Custom Clips

You can create custom clips by extending `BaseClip`:

```ts
import { BaseClip, type IClipMeta } from "@designcombo/video";

class MyCustomClip extends BaseClip {
  readonly type = 'custom-clip';
  readonly meta: IClipMeta = { width: 1920, height: 1080, duration: 10e6 };
  readonly ready = Promise.resolve(this.meta);

  async tick(time: number) {
    // Generate frame here
    return { state: 'success' };
  }

  async clone() {
    const c = new MyCustomClip();
    this.copyStateTo(c);
    return c;
  }
}
```
