import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('firebase') || id.includes('@firebase')) return 'firebase-vendor'
          if (id.includes('react') || id.includes('scheduler')) return 'react-vendor'
          if (id.includes('/echarts/') || id.includes('\\echarts\\') || id.includes('/zrender/') || id.includes('\\zrender\\')) return 'travel-map-vendor'
          return undefined
        },
      },
    },
  },
})
