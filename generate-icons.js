#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Brand colors from your project
const BRAND_COLOR = '#3B82F6'; // Blue instead of purple
const WHITE = '#FFFFFF';
const TRANSPARENT = 'transparent'; // For transparent backgrounds

// Icon sizes to generate
const ICON_SIZES = [
  { name: 'favicon', size: 32, filename: 'favicon.png' },
  { name: 'icon-192', size: 192, filename: 'icon-192.png' },
  { name: 'icon-512', size: 512, filename: 'icon-512.png' },
  { name: 'apple-touch', size: 180, filename: 'apple-touch-icon.png' },
  { name: 'og-image', size: 400, filename: 'og-image.png' },
  { name: 'splash', size: 300, filename: 'splash.png' }
];

// Output directory
const OUTPUT_DIR = './miniapp/public';

/**
 * Create SVG using the actual Stack logo
 */
function createStackIconSVG(size, backgroundColor = TRANSPARENT, iconColor = BRAND_COLOR) {
  const padding = size * 0.15; // Add some padding around the logo
  const logoSize = size - (padding * 2);
  const offset = padding;

  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <!-- Transparent background -->
      
      <!-- Your actual Stack logo -->
      <g transform="translate(${offset}, ${offset}) scale(${logoSize/24})">
        <circle cx="8" cy="8" r="6" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M18.09 10.37A6 6 0 1 1 10.34 18" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M7 6h1v4" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="m16.71 13.88.7.71-2.82 2.82" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    </svg>
  `;
}

/**
 * Create alternative layers icon
 */
function createLayersIconSVG(size, backgroundColor = TRANSPARENT, iconColor = BRAND_COLOR) {
  const center = size / 2;
  const layerWidth = size * 0.6;
  const layerHeight = size * 0.08;
  const layers = 4;

  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <!-- Transparent background (no background rect) -->
      
      <!-- Layers -->
      ${Array.from({ length: layers }, (_, i) => {
        const y = center - (layerHeight * (layers - 1) / 2) + (i * layerHeight * 1.2);
        const opacity = 1 - (i * 0.15);
        return `
          <!-- Shadow -->
          <rect x="${center - layerWidth/2 + 2}" y="${y + 2}" 
                width="${layerWidth}" height="${layerHeight}" 
                fill="rgba(0,0,0,0.15)" rx="${layerHeight * 0.3}"/>
          
          <!-- Layer -->
          <rect x="${center - layerWidth/2}" y="${y}" 
                width="${layerWidth}" height="${layerHeight}" 
                fill="${iconColor}" opacity="${opacity}" rx="${layerHeight * 0.3}"/>
          
          <!-- Highlight -->
          <rect x="${center - layerWidth/2}" y="${y}" 
                width="${layerWidth}" height="${layerHeight * 0.3}" 
                fill="rgba(255,255,255,0.3)" rx="${layerHeight * 0.3}"/>
        `;
      }).join('')}
    </svg>
  `;
}

/**
 * Generate all icon sizes
 */
async function generateIcons() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('🎨 Generating Stack icons...');

  for (const icon of ICON_SIZES) {
    try {
      // Create SVG (using coins stack design)
      const svgContent = createStackIconSVG(icon.size);
      
      // Convert SVG to PNG using Sharp
      await sharp(Buffer.from(svgContent))
        .png()
        .toFile(path.join(OUTPUT_DIR, icon.filename));

      console.log(`✅ Generated ${icon.filename} (${icon.size}x${icon.size})`);
    } catch (error) {
      console.error(`❌ Failed to generate ${icon.filename}:`, error.message);
    }
  }

  // Generate favicon.ico (convert from 32px PNG)
  try {
    await sharp(path.join(OUTPUT_DIR, 'favicon.png'))
      .resize(32, 32)
      .png()
      .toFile(path.join(OUTPUT_DIR, 'favicon.ico'));
    
    console.log('✅ Generated favicon.ico');
  } catch (error) {
    console.error('❌ Failed to generate favicon.ico:', error.message);
  }

  // Generate alternative layer-style icons (optional)
  try {
    const layersSvg = createLayersIconSVG(512);
    await sharp(Buffer.from(layersSvg))
      .png()
      .toFile(path.join(OUTPUT_DIR, 'icon-layers-512.png'));
    
    console.log('✅ Generated alternative layers icon');
  } catch (error) {
    console.error('❌ Failed to generate layers icon:', error.message);
  }

  console.log('\n🚀 All icons generated successfully!');
  console.log(`📁 Icons saved to: ${OUTPUT_DIR}`);
  console.log('\n📋 Generated files:');
  ICON_SIZES.forEach(icon => {
    console.log(`   - ${icon.filename} (${icon.size}x${icon.size})`);
  });
  console.log('   - favicon.ico (32x32)');
  console.log('   - icon-layers-512.png (alternative style)');
}

/**
 * Update HTML with proper icon links
 */
function updateHTMLMeta() {
  const htmlPath = path.join(OUTPUT_DIR, '../index.html');
  
  if (fs.existsSync(htmlPath)) {
    let html = fs.readFileSync(htmlPath, 'utf8');
    
    // Add/update favicon and icon meta tags
    const metaTags = `
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png">
    
    <!-- Apple Touch Icon -->
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    
    <!-- PWA Icons -->
    <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png">
    <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png">
    
    <!-- Open Graph -->
    <meta property="og:image" content="/og-image.png">
    <meta property="og:image:width" content="400">
    <meta property="og:image:height" content="400">
    `;
    
    // Insert before closing head tag
    html = html.replace('</head>', `${metaTags}\n</head>`);
    
    fs.writeFileSync(htmlPath, html);
    console.log('✅ Updated HTML meta tags');
  }
}

// Run the generator
if (require.main === module) {
  generateIcons()
    .then(() => {
      updateHTMLMeta();
      console.log('\n🎉 Icon generation complete!');
    })
    .catch(error => {
      console.error('💥 Icon generation failed:', error);
      process.exit(1);
    });
}

module.exports = { generateIcons, createStackIconSVG, createLayersIconSVG };