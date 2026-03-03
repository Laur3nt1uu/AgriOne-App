import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (id.includes('react-router') || id.includes('@remix-run/router')) {
            return 'router';
          }
          if (id.includes('recharts') || id.includes('d3-')) {
            return 'charts';
          }
          if (id.includes('framer-motion')) {
            return 'motion';
          }
          if (id.includes('lucide-react')) {
            return 'icons';
          }
          if (id.includes('@radix-ui')) {
            return 'radix';
          }
          if (id.includes('@googlemaps/js-api-loader')) {
            return 'maps-google';
          }
          if (id.includes('/axios/')) {
            return 'http';
          }
          if (id.includes('leaflet') || id.includes('react-leaflet')) {
            return 'maps';
          }

          return 'vendor';
        },
      },
    },
  },
})
