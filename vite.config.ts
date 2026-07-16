import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

function normalizeBasePath(value: string | undefined) {
  if (!value || value === '/') return '/'
  return `/${value.replace(/^\/+|\/+$/g, '')}/`
}

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, '.', 'VITE_')
  const basePath = normalizeBasePath(environment.VITE_BASE_PATH)

  return {
    base: basePath,
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.png', 'icon-192.png', 'icon-512.png', 'maskable-icon-512.png'],
        manifest: {
          id: basePath,
          name: 'Física en Código',
          short_name: 'Física',
          description: 'Aprende física conectando fórmulas, simulaciones y código.',
          lang: 'es',
          start_url: basePath,
          scope: basePath,
          display: 'standalone',
          orientation: 'any',
          background_color: '#f3f5f2',
          theme_color: '#101814',
          categories: ['education', 'utilities'],
          icons: [
            {
              src: `${basePath}icon-192.png`,
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: `${basePath}icon-512.png`,
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: `${basePath}maskable-icon-512.png`,
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          navigateFallback: `${basePath}index.html`,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,ttf}'],
        },
      }),
    ],
  }
})
