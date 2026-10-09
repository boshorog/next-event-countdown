import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";

/**
 * Custom plugin to create .pro-build marker file for Pro builds
 * This marker is detected by PHP to configure Freemius with is_premium=true
 */
const proBuildMarker = () => ({
  name: 'pro-build-marker',
  closeBundle() {
    // Public-dir copying is disabled to avoid overwriting Vite's generated index.html.
    // Ship the external WordPress CSS and iframe listener explicitly for both variants.
    for (const asset of ['admin-page.css', 'demo-embed.js']) {
      fs.copyFileSync(path.resolve(__dirname, 'public', asset), path.resolve(__dirname, 'dist', asset));
    }
    const isPro = process.env.VITE_BUILD_VARIANT === 'pro';
    const markerPath = path.resolve(__dirname, 'dist/.pro-build');
    // Visible twin: some ZIP/deployment tools drop hidden dot-files.
    const visibleMarkerPath = path.resolve(__dirname, 'dist/pro-build.txt');
    const phpPath = path.resolve(__dirname, 'kindpixels-next-event-countdown.php');
    
    if (isPro) {
      // Create marker file for Pro build
      fs.writeFileSync(markerPath, 'pro');
      fs.writeFileSync(visibleMarkerPath, 'pro');
      console.log('✓ Created .pro-build marker for Pro version');
      
      if (fs.existsSync(phpPath)) {
        let phpContent = fs.readFileSync(phpPath, 'utf8');
        // Update plugin name for Pro
        phpContent = phpContent.replace(
          /Plugin Name:\s*KindPixels Next Event Countdown\s*$/m,
          'Plugin Name: KindPixels Next Event Countdown Pro'
        );
        fs.writeFileSync(phpPath, phpContent, 'utf8');
        console.log('✓ Updated plugin header for Pro version');
      }
    } else {
      // Ensure no marker exists for Free build
      for (const marker of [markerPath, visibleMarkerPath]) {
        if (fs.existsSync(marker)) fs.unlinkSync(marker);
      }
      
      if (fs.existsSync(phpPath)) {
        let phpContent = fs.readFileSync(phpPath, 'utf8');
        // Restore plugin name for Free
        phpContent = phpContent.replace(
          /Plugin Name:\s*KindPixels Next Event Countdown Pro\s*$/m,
          'Plugin Name: KindPixels Next Event Countdown'
        );
        fs.writeFileSync(phpPath, phpContent, 'utf8');
      }
      console.log('✓ Free version build (no .pro-build marker)');
    }
  }
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Relative base: Pro may be installed in a different folder (e.g. "-pro"), so lazy
  // chunks and assets must resolve next to the loaded bundle, never a hardcoded folder.
  base: mode === 'production' ? './' : '/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'production' && proBuildMarker(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/index.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/index.css';
          }
          return 'assets/[name].[ext]';
        }
      }
    },
    copyPublicDir: false
  }
}));
