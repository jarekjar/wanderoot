import sharp from 'sharp';
import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';

const sizes = [16, 32, 64, 128, 256, 512, 1024];
const outputDir = 'src/assets';
const inputIcon = 'src/assets/icon.png';

async function convertIcon() {
  try {
    // Ensure output directory exists
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Create Windows ICO
    const icoBuffers = await Promise.all(
      sizes.map(size => 
        sharp(inputIcon)
          .resize(size, size)
          .toBuffer()
      )
    );

    await sharp(icoBuffers[sizes.length - 1]) // Use largest size for Windows
      .toFile(join(outputDir, 'icon.ico'));

    // Create high-res PNG for macOS
    await sharp(inputIcon)
      .resize(1024, 1024)
      .toFile(join(outputDir, 'icon-mac.png'));

    console.log('Successfully created icon files!');
    console.log('Note: For macOS builds, you will need to convert to .icns format on a Mac.');
    console.log('Windows builds will use the .ico file automatically.');
  } catch (error) {
    console.error('Error creating icons:', error);
    process.exit(1);
  }
}

convertIcon(); 