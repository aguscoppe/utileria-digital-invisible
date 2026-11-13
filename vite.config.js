import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { mkdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

const managedAssets = {
  'julian-profile': 'public/assets/julian_profile.jpg',
  'party-halloween': 'public/assets/party_halloween.jpg',
  'agustina-julian-party': 'public/assets/agustina_julian_party.jpg',
  'martina-wallpaper-desktop': 'public/assets/martina_wallpaper_desktop.jpg',
  'martina-wallpaper-mobile': 'public/assets/martina_wallpaper_mobile.jpg',
  'martina-mirror-selfie': 'public/assets/martina_mirror_selfie.jpg',
  'mail-video': 'public/assets/video_01.mp4',
  'crown-photo': 'public/assets/crown_photo.jpg',
  'emily-costume': 'public/assets/emily_costume.jpg',
}

function assetUploadPlugin() {
  const targetPath = (root, id) => {
    const relativePath = managedAssets[id]
    return relativePath ? path.join(root, relativePath) : null
  }

  return {
    name: 'local-placeholder-asset-manager',
    configureServer(server) {
      server.middlewares.use('/__asset-manager', async (request, response) => {
        const parts = new URL(request.url, 'http://localhost').pathname.split('/').filter(Boolean)
        const [action, id] = parts
        const filePath = targetPath(server.config.root, id)
        if (action === 'status' && request.method === 'GET') {
          const status = {}
          await Promise.all(Object.entries(managedAssets).map(async ([assetId, relativePath]) => {
            try { status[assetId] = (await stat(path.join(server.config.root, relativePath))).size }
            catch { status[assetId] = 0 }
          }))
          response.setHeader('Content-Type', 'application/json')
          response.end(JSON.stringify(status))
          return
        }
        if (!filePath) {
          response.statusCode = 404
          response.end('Archivo no reconocido')
          return
        }
        if (action === 'upload' && request.method === 'POST') {
          const chunks = []
          let size = 0
          request.on('data', (chunk) => {
            size += chunk.length
            if (size > 100 * 1024 * 1024) {
              response.statusCode = 413
              response.end('El archivo supera el límite de 100 MB')
              request.destroy()
              return
            }
            chunks.push(chunk)
          })
          request.on('end', async () => {
            if (response.writableEnded) return
            if (!size) {
              response.statusCode = 400
              response.end('El archivo está vacío')
              return
            }
            await mkdir(path.dirname(filePath), { recursive: true })
            await writeFile(filePath, Buffer.concat(chunks))
            response.setHeader('Content-Type', 'application/json')
            response.end(JSON.stringify({ size }))
          })
          return
        }
        if (action === 'reset' && request.method === 'POST') {
          await writeFile(filePath, Buffer.alloc(0))
          response.end('ok')
          return
        }
        response.statusCode = 405
        response.end('Método no permitido')
      })
    },
  }
}

export default defineConfig({ plugins: [react(), assetUploadPlugin()] })
