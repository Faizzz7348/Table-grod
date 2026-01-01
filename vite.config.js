import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
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
            // Cache API routes with Network First strategy
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
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024 // 5 MB
      },
      devOptions: {
        enabled: false // Disable in dev to avoid conflicts
      }
    })
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'primereact': ['primereact/datatable', 'primereact/column', 'primereact/button', 'primereact/dialog'],
          'leaflet': ['leaflet', 'react-leaflet'],
          'utils': ['lightgallery', 'qr-scanner']
        }
      }
    },
    // Minification and optimization
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
      }
    },
    // Generate source maps for debugging (optional)
    sourcemap: false,
    // Increase chunk size warning limit
    cssCodeSplit: true
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'primereact', 'leaflet']
  }
})
