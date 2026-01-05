import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh untuk development yang lebih cepat
      fastRefresh: true
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', '*.png', '*.svg'],
      manifest: {
        name: 'FamilyMart Route Management',
        short_name: 'FM Routes',
        description: 'Route and location management system',
        theme_color: '#06b6d4',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,jpg,jpeg}'],
        // Avoid caching index.html to prevent stale cache on updates
        globIgnores: ['**/index.html', '**/registerSW.js'],
        // Cache static assets
        runtimeCaching: [
          {
            // Cache CDN resources (PrimeReact, fonts, etc.)
            urlPattern: /^https:\/\/(unpkg\.com|fonts\.googleapis\.com|fonts\.gstatic\.com).*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cdn-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Cache API routes with Network First strategy (always try fresh first)
            urlPattern: /^.*\/api\/(routes|locations).*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5 // 5 minutes
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
              networkTimeoutSeconds: 10
            }
          },
          {
            // Cache images with Cache First strategy
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Cache Vercel Blob Storage images
            urlPattern: /^https:.*\.vercel-storage\.com.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'blob-storage-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ],
        // Increase cache size limits
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
        // Skip waiting to apply updates immediately
        skipWaiting: true,
        clientsClaim: true
      },
      devOptions: {
        enabled: false // Disable in dev to avoid conflicts
      }
    })
  ],
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
