/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'node:path'
import pkg from './package.json'

// GitHub Pages serves the app from /recompos/. Keep this in sync with the
// manifest scope/start_url and with the router basename.
const BASE = '/recompos/'

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
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: `${BASE}index.html`,
        cleanupOutdatedCaches: true,
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
        background_color: '#0a0a0b',
        theme_color: '#0a0a0b',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/icon-maskable-512.png',
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
