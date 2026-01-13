import { Renderer } from '@designcombo/node';
import { resolve } from 'path';

// Example JSON configuration
const videoConfig = {
  settings: {
    width: 1280,
    height: 720,
    fps: 30,
    bgColor: '#000000',
  },
  clips: [
    {
      type: 'Video',
      src: 'https://cdn.subgen.co/podcast-video.mp4',
      x: 0,
      y: 0,
      display: {
        from: 0,
        to: 5000000, // 5 seconds in microseconds
      },
    },
    {
      type: 'Text',
      text: 'Hello from Node.js!',
      fontSize: 64,
      fontFamily: 'Arial',
      fill: '#ffffff',
      x: 100,
      y: 100,
      display: {
        from: 0,
        to: 5000000,
      },
    },
  ],
};

async function main() {
  const renderer = new Renderer({
    json: videoConfig,
    outputPath: resolve('./output.mp4'),
    serverUrl: 'http://localhost:5173', // Your Vite dev server
    browserOptions: {
      headless: true,
      timeout: 300000, // 5 minutes
    },
  });

  // Listen to progress events
  renderer.on('progress', (progress) => {
    console.log(
      `[${progress.phase}] ${Math.round(progress.progress * 100)}% - ${progress.message}`
    );
  });

  // Listen to errors
  renderer.on('error', (error) => {
    console.error('Render error:', error);
  });

  // Listen to completion
  renderer.on('complete', (outputPath) => {
    console.log(`✅ Video rendered successfully: ${outputPath}`);
  });

  try {
    // Start rendering
    const outputPath = await renderer.render();
    console.log(`Video saved to: ${outputPath}`);
  } catch (error) {
    console.error('Failed to render video:', error);
    process.exit(1);
  }
}

main();
