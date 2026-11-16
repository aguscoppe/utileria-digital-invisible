import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { mkdir, rename, stat, unlink, writeFile } from 'node:fs/promises'
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
const maxAssetSize = 100 * 1024 * 1024

function isValidAsset(id, buffer) {
  if (id === 'mail-video') {
    return buffer.length >= 12 && buffer.subarray(4, 8).toString('ascii') === 'ftyp'
  }
  // Every managed image is mapped to a .jpg path, so reject other formats
  // instead of silently writing PNG/WebP bytes with a JPEG extension.
  return buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8 &&
    buffer[buffer.length - 2] === 0xff && buffer[buffer.length - 1] === 0xd9
}

async function atomicWrite(filePath, contents) {
  await mkdir(path.dirname(filePath), { recursive: true })
  const temporaryPath = `${filePath}.${process.pid}.${Date.now()}.tmp`
  try {
    await writeFile(temporaryPath, contents, { flag: 'wx' })
    await rename(temporaryPath, filePath)
  } catch (error) {
    await unlink(temporaryPath).catch(() => {})
    throw error
  }
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
          let tooLarge = false
          request.on('data', (chunk) => {
            size += chunk.length
            if (size > maxAssetSize) tooLarge = true
            else if (!tooLarge) chunks.push(chunk)
          })
          request.on('end', async () => {
            if (tooLarge) {
              response.statusCode = 413
              response.end('El archivo supera el límite de 100 MB')
              return
            }
            if (!size) {
              response.statusCode = 400
              response.end('El archivo está vacío')
              return
            }
            const contents = Buffer.concat(chunks)
            if (!isValidAsset(id, contents)) {
              response.statusCode = 415
              response.end(id === 'mail-video' ? 'El archivo no parece ser un video MP4 válido' : 'El archivo debe ser una imagen JPEG válida')
              return
            }
            try {
              await atomicWrite(filePath, contents)
              response.setHeader('Content-Type', 'application/json')
              response.end(JSON.stringify({ size }))
            } catch (error) {
              console.error(`[asset-manager] No se pudo guardar ${id}:`, error)
              response.statusCode = 500
              response.end(`No se pudo guardar el archivo (${error.code || 'error de escritura'}); se conservó la versión anterior`)
            }
          })
          request.on('error', () => {
            if (!response.writableEnded) {
              response.statusCode = 400
              response.end('No se pudo recibir el archivo completo')
            }
          })
          return
        }
        if (action === 'reset' && request.method === 'POST') {
          try {
            await atomicWrite(filePath, Buffer.alloc(0))
            response.end('ok')
          } catch {
            response.statusCode = 500
            response.end('No se pudo restaurar el placeholder; se conservó el archivo anterior')
          }
          return
        }
        response.statusCode = 405
        response.end('Método no permitido')
      })
    },
  }
}

export default defineConfig({ server: { host: '0.0.0.0' }, plugins: [react(), assetUploadPlugin()] })
