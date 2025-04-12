import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputPath = join(__dirname, '../src/assets/icon.svg');
const outputPath = join(__dirname, '../src/assets/icon.png');

async function convertIcon() {
  try {
    await sharp(inputPath)
      .resize(512, 512) // Making it 512x512 for better quality
      .png()
      .toFile(outputPath);
    console.log('Icon converted successfully!');
  } catch (error) {
    console.error('Error converting icon:', error);
  }
}

convertIcon(); 