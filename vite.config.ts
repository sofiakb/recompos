/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import pkg from './package.json'

// GitHub Pages serves the app from /recompos/. Keep this in sync with the
// manifest scope/start_url and with the router basename.
const BASE = '/recompos/'

// An installed PWA keeps the icon it was installed with until the browser
// notices the manifest changed — and Chrome compares icon URLs, not pixels.
// The files keep their names, so the URL carries a hash of the content: a
// redrawn icon is a new URL, and Android swaps it on its next manifest check
// with no reinstall. (iOS never refreshes a home-screen icon; nothing here can.)
function versioned(file: string): string {
  const hash = createHash('sha256')
    .update(readFileSync(path.resolve(__dirname, 'public', file)))
    .digest('hex')
    .slice(0, 8)
  return `${file}?v=${hash}`
}

export default defineConfig({
  base: BASE,
  // The app version comes from package.json, and nowhere else. The screen used
  // to print SCHEMA_VERSION, which counts Dexie migrations: it moves when the
  // data shape changes and says nothing about what is shipped.
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Recharts is only used on the Trends tab: keep it out of the shell.
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3-')) {
            return 'charts'
          }
        },
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      workbox: {
        // `.wasm` is deliberately absent: the barcode decoder is 449 kB gzipped,
        // and precaching it would make every install pay for a screen most
        // openings never reach.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: `${BASE}index.html`,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // Cached on the way past instead: the first scan needs the network,
            // every scan after it works on the metro.
            urlPattern: ({ url }) => url.pathname.endsWith('.wasm'),
            handler: 'CacheFirst',
            options: { cacheName: 'barcode-reader', expiration: { maxEntries: 2 } },
          },
        ],
      },
      manifest: {
        name: 'RecompOS',
        short_name: 'RecompOS',
        description:
          'Plancher quotidien, protéines et surcharge progressive. Hors ligne, sans compte.',
        lang: 'fr',
        start_url: BASE,
        scope: BASE,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0b0d0c',
        theme_color: '#0b0d0c',
        icons: [
          { src: versioned('icons/icon-192.png'), sizes: '192x192', type: 'image/png' },
          { src: versioned('icons/icon-512.png'), sizes: '512x512', type: 'image/png' },
          {
            src: versioned('icons/icon-maskable-512.png'),
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
})
