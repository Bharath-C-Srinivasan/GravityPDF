import sharp from 'sharp';

// The regular icon with background. Box is 24x24, but lets give it a viewBox of -2 -2 28 28 so it has some padding
const svgIcon = `
<svg width="1024" height="1024" viewBox="-2 -2 28 28" fill="none" stroke="#22d3ee" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="m12 2-10 5 10 5 10-5z"/>
  <path d="m2 12 10 5 10-5"/>
  <path d="m2 17 10 5 10-5"/>
</svg>
`;

// Android Adaptive Icon foreground. Needs HUGE padding so it doesn't get cut off by circular mask.
// We make the viewBox much larger (-6 -6 36 36) compared to the 24x24 svg
const svgForeground = `
<svg width="1024" height="1024" viewBox="-6 -6 36 36" fill="none" stroke="#22d3ee" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="m12 2-10 5 10 5 10-5z"/>
  <path d="m2 12 10 5 10-5"/>
  <path d="m2 17 10 5 10-5"/>
</svg>
`;

const splashSvg = `
<svg width="600" height="600" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="m12 2-10 5 10 5 10-5z"/>
  <path d="m2 12 10 5 10-5"/>
  <path d="m2 17 10 5 10-5"/>
</svg>
`;

async function generate() {
    try {
        // App icon (standard) with background
        await sharp({
            create: {
                width: 1024,
                height: 1024,
                channels: 4,
                background: '#050714'
            }
        })
            .composite([{ input: Buffer.from(svgIcon) }])
            .png()
            .toFile('assets/icon.png');
        console.log('Created assets/icon.png');

        // Android Adaptive Icon Foreground (transparent bg)
        await sharp({
            create: {
                width: 1024,
                height: 1024,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 } // transparent
            }
        })
            .composite([{ input: Buffer.from(svgForeground) }])
            .png()
            .toFile('assets/icon-foreground.png');
        console.log('Created assets/icon-foreground.png');

        // Android Adaptive Icon Background (solid bg)
        await sharp({
            create: {
                width: 1024,
                height: 1024,
                channels: 4,
                background: '#050714'
            }
        })
            .png()
            .toFile('assets/icon-background.png');
        console.log('Created assets/icon-background.png');

        // App icon only (transparent bg)
        await sharp({
            create: {
                width: 1024,
                height: 1024,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            }
        })
            .composite([{ input: Buffer.from(svgIcon) }])
            .png()
            .toFile('assets/icon-only.png');
        console.log('Created assets/icon-only.png');

        // Splash screen
        await sharp({
            create: {
                width: 2732,
                height: 2732,
                channels: 4,
                background: '#050714'
            }
        })
            .composite([{ input: Buffer.from(splashSvg) }])
            .png()
            .toFile('assets/splash.png');
        console.log('Created assets/splash.png');

        // Splash screen dark
        await sharp({
            create: {
                width: 2732,
                height: 2732,
                channels: 4,
                background: '#050714' // Same for both for GravityPDF
            }
        })
            .composite([{ input: Buffer.from(splashSvg) }])
            .png()
            .toFile('assets/splash-dark.png');
        console.log('Created assets/splash-dark.png');

    } catch (error) {
        console.error('Error generating images:', error);
    }
}

generate();
