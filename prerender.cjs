/**
 * Simple Static Site Generation (SSG) script for Vite
 * Pre-renders React app to static HTML for perfect SEO/crawlability
 */
const fs = require('fs');
const path = require('path');

async function prerender() {
  try {
    console.log('🔄 Starting SSR pre-rendering...');
    
    // Import the built app (after vite build)
    const { render } = await import('./dist/server/entry-server.js');
    
    // Get the base HTML template
    const template = fs.readFileSync(
      path.resolve(__dirname, 'dist/index.html'),
      'utf-8'
    );
    
    // Render the app to HTML string
    const appHtml = render();
    
    // Inject the rendered HTML into the template
    const html = template.replace(
      `<div id="root"></div>`,
      `<div id="root">${appHtml}</div>`
    );
    
    // Write the pre-rendered HTML
    fs.writeFileSync(
      path.resolve(__dirname, 'dist/index.html'),
      html
    );
    
    console.log('✅ SSR pre-rendering complete!');
    console.log('📦 Static HTML generated in dist/index.html');
  } catch (error) {
    console.error('❌ Error during pre-rendering:', error);
    process.exit(1);
  }
}

prerender();
