export interface RenderConfig {
  /**
   * JSON configuration for the video composition
   */
  json: any;

  /**
   * Output file path for the rendered video
   */
  outputPath: string;

  /**
   * Optional server URL if you're running your own server
   * If not provided, a local server will be started automatically
   * @advanced This is rarely needed - the renderer starts its own server by default
   */
  serverUrl?: string;

  /**
   * Port for the temporary server (default: 5173)
   * @deprecated No longer used - local server uses a random available port
   */
  serverPort?: number;

  /**
   * Path to the HTML template (optional)
   * @deprecated No longer used - HTML template is embedded in the renderer
   */
  templatePath?: string;

  /**
   * Playwright browser options
   */
  browserOptions?: {
    headless?: boolean;
    timeout?: number;
  };
}

export interface RenderProgress {
  /**
   * Progress value between 0 and 1
   */
  progress: number;

  /**
   * Current phase of rendering
   */
  phase: 'initializing' | 'loading' | 'rendering' | 'saving' | 'complete';

  /**
   * Optional message
   */
  message?: string;
}

export type RenderEventMap = {
  progress: [RenderProgress];
  error: [Error];
  complete: [string]; // output path
};
