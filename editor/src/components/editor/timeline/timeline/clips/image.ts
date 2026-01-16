import { BaseTimelineClip, BaseClipProps } from './base';
import { createResizeControls } from '../controls';
import { Control, util, Pattern } from 'fabric';

export class Image extends BaseTimelineClip {
  isSelected: boolean;
  public src: string;
  private _imgElement: HTMLImageElement | null = null;

  static createControls(): { controls: Record<string, Control> } {
    return { controls: createResizeControls() };
  }

  static ownDefaults = {
    rx: 10,
    ry: 10,
    objectCaching: false,
    borderColor: 'transparent',
    stroke: 'transparent',
    strokeWidth: 0,
    fill: '#164e63',
    borderOpacityWhenMoving: 1,
    hoverCursor: 'default',
  };

  constructor(options: BaseClipProps) {
    super(options);
    Object.assign(this, Image.ownDefaults);
    this.src = options.src || '';
    if (this.src) {
      this.loadImage();
    }
  }

  public _render(ctx: CanvasRenderingContext2D) {
    super._render(ctx);
    this.updateSelected(ctx);
  }

  private async loadImage() {
    if (!this.src) return;
    try {
      const img = await util.loadImage(this.src);
      this._imgElement = img;
      this.updatePattern();
    } catch (error) {
      console.error('Failed to load image for timeline clip:', error);
    }
  }

  private updatePattern() {
    if (!this._imgElement) return;

    const imgHeight = this._imgElement.height;
    const rectHeight = this.height;
    const scale = rectHeight / imgHeight;

    const pattern = new Pattern({
      source: this._imgElement,
      repeat: 'repeat-x',
      patternTransform: [scale, 0, 0, scale, 0, 0],
    });

    this.set('fill', pattern);
    this.canvas?.requestRenderAll();
  }

  public setSrc(src: string) {
    this.src = src;
    this.loadImage();
  }

  public setSelected(selected: boolean) {
    this.isSelected = selected;
    this.set({ dirty: true });
  }

  public updateSelected(ctx: CanvasRenderingContext2D) {
    const borderColor = this.isSelected
      ? 'rgba(255, 255, 255, 1.0)'
      : 'rgba(255, 255, 255, 0.1)';
    const borderWidth = 2;
    const radius = 10;

    ctx.save();
    ctx.fillStyle = borderColor;

    // Create a path for the outer rectangle
    ctx.beginPath();
    ctx.roundRect(
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height,
      radius
    );

    // Create a path for the inner rectangle (the hole)
    ctx.roundRect(
      -this.width / 2 + borderWidth,
      -this.height / 2 + borderWidth,
      this.width - borderWidth * 2,
      this.height - borderWidth * 2,
      radius - borderWidth
    );

    // Use even-odd fill rule to create the border effect
    ctx.fill('evenodd');
    ctx.restore();
  }
}
