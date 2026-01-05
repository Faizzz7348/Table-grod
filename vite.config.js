import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { VitePWA } from 'vite-plugin-pwa' // PWA DISABLED

export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh untuk development yang lebih cepat
      fastRefresh: true
    })
  ],
  base: '/',
  build: {
    chunkSizeWarningLimit: 1000,
    // Enable code splitting dengan chunks yang lebih optimal
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-primereact-core': ['primereact/datatable', 'primereact/column', 'primereact/button'],
          'vendor-primereact-forms': ['primereact/dialog', 'primereact/inputtext', 'primereact/dropdown', 'primereact/calendar'],
          'vendor-primereact-utils': ['primereact/toast', 'primereact/speeddial', 'primereact/password'],
          'vendor-map': ['leaflet', 'react-leaflet'],
          'vendor-media': ['lightgallery', 'lg-thumbnail', 'lg-zoom'],
          'vendor-qr': ['qr-scanner'],
          'vendor-motion': ['framer-motion']
        },
        // Optimize chunk names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    // Minification and optimization
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep logs visible for debugging
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'],
        passes: 2
      },
      mangle: {
        safari10: true
      }
    },
    // Generate source maps for debugging (disabled for better performance)
    sourcemap: false,
    // CSS code splitting
    cssCodeSplit: true,
    // Increase performance
    reportCompressedSize: false, // Faster builds
    // Set target untuk browser modern
    target: 'es2015',
    // Optimize assets
    assetsInlineLimit: 4096 // 4kb - inline smaller assets as base64
  },
  // Optimize dependencies - Pre-bundle dependencies
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'primereact/datatable',
      'primereact/column',
      'primereact/button',
      'primereact/dialog',
      'leaflet',
      'react-leaflet'
    ],
    exclude: ['@vercel/blob'] // Don't pre-bundle server-side only packages
  },
  // Server configuration untuk development yang lebih cepat
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    open: false,
    // Enable HMR (Hot Module Replacement)
    hmr: {
      overlay: true
    },
    // Speed up server start
    fs: {
      strict: false
    }
  },
  // Preview server config
  preview: {
    port: 4173,
    strictPort: false,
    host: true
  },
  // Performance hints
  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
})
