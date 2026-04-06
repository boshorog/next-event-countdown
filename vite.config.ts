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
    const isPro = process.env.VITE_BUILD_VARIANT === 'pro';
    const markerPath = path.resolve(__dirname, 'dist/.pro-build');
    const phpPath = path.resolve(__dirname, 'kindpixels-next-event-countdown.php');
    
    if (isPro) {
      // Create marker file for Pro build
      fs.writeFileSync(markerPath, 'pro');
      console.log('✓ Created .pro-build marker for Pro version');
      
      // Update PHP header to show "KindPixels Next Event Countdown Pro" for Pro builds
      if (fs.existsSync(phpPath)) {
        let phpContent = fs.readFileSync(phpPath, 'utf8');
        phpContent = phpContent.replace(
          /Plugin Name:\s*KindPixels Next Event Countdown\s*$/m,
          'Plugin Name: KindPixels Next Event Countdown Pro'
        );
        fs.writeFileSync(phpPath, phpContent, 'utf8');
        console.log('✓ Updated plugin header to "KindPixels Next Event Countdown Pro"');
      }
    } else {
      // Ensure no marker exists for Free build
      if (fs.existsSync(markerPath)) {
        fs.unlinkSync(markerPath);
      }
      
      // Restore original plugin name for Free builds
      if (fs.existsSync(phpPath)) {
        let phpContent = fs.readFileSync(phpPath, 'utf8');
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
  base: mode === 'production' ? '/wp-content/plugins/next-event-countdown/dist/' : '/',
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
