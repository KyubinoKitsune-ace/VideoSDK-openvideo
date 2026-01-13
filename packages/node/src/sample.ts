import { Renderer } from './index.js';
import { resolve, dirname } from 'path';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  // Load JSON configuration from file
  const jsonPath = resolve(__dirname, 'sample.json');
  const jsonContent = await readFile(jsonPath, 'utf-8');
  const videoConfig = JSON.parse(jsonContent);
  const renderer = new Renderer({
    json: videoConfig,
    outputPath: resolve('./output.mp4'),
    // No serverUrl needed - renderer will start its own local server
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
