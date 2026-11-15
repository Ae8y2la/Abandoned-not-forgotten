import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Raise the warning threshold — Three.js is unavoidably large in a 3D experience
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manual chunks: split Three.js / R3F ecosystem away from app code
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('node_modules/@react-three')) {
            return 'vendor-three';
          }
          if (id.includes('node_modules/gsap')) {
            return 'vendor-gsap';
          }
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/lenis') || id.includes('node_modules/lucide-react')) {
            return 'vendor-misc';
          }
        },
      },
    },
  },
})
