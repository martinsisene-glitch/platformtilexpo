import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

/**
 * Exposes POST /api/feedback during `npm run dev`.
 * Appends each submission to UserData.JSON in the project root.
 */
function feedbackApiPlugin() {
  const DATA_FILE = path.resolve(__dirname, 'UserData.JSON')

  return {
    name: 'feedback-api',
    configureServer(server: import('vite').ViteDevServer) {
      server.middlewares.use('/api/feedback', (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405)
          res.end()
          return
        }

        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', () => {
          try {
            const entry = JSON.parse(body)
            // Read existing data (or start fresh)
            let rows: unknown[] = []
            if (fs.existsSync(DATA_FILE)) {
              rows = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
            }
            rows.push({ ...entry, timestamp: new Date().toISOString() })
            fs.writeFileSync(DATA_FILE, JSON.stringify(rows, null, 2), 'utf-8')

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ ok: true }))
          } catch {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ ok: false, error: 'Kunne ikke gemme feedback' }))
          }
        })
      })
    },
  }
}

export default defineConfig({
  // Sæt base til './' så assets loader korrekt på GitHub Pages
  base: './',
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    feedbackApiPlugin(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
