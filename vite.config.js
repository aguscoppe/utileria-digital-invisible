import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { mkdir, readFile, rename, stat, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'

const managedAssets = {
  'julian-profile-instagram': 'public/assets/julian_profile_instagram.jpg',
  'julian-profile-whatsapp': 'public/assets/julian_profile_whatsapp.jpg',
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
const profileAssetIds = new Set(['julian-profile-instagram', 'julian-profile-whatsapp'])
const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'bmp', 'svg']

function isValidAsset(id, buffer) {
  if (id === 'mail-video') {
    return buffer.length >= 12 && buffer.subarray(4, 8).toString('ascii') === 'ftyp'
  }
  // Every managed image is mapped to a .jpg path, so reject other formats
  // instead of silently writing PNG/WebP bytes with a JPEG extension.
  return buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8 &&
    buffer[buffer.length - 2] === 0xff && buffer[buffer.length - 1] === 0xd9
}

function isSupportedImage(buffer) {
  if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) return true
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return true
  if (buffer.subarray(0, 3).toString('ascii') === 'GIF' || buffer.subarray(0, 2).toString('ascii') === 'BM') return true
  if (buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP') return true
  if (buffer.subarray(4, 8).toString('ascii') === 'ftyp' && /^(avif|avis)$/.test(buffer.subarray(8, 12).toString('ascii'))) return true
  return /^\s*(?:<\?xml[^>]*>\s*)?<svg\b/i.test(buffer.toString('utf8', 0, Math.min(buffer.length, 512)))
}

function imageVariantPaths(filePath) {
  const extension = path.extname(filePath)
  const basePath = filePath.slice(0, -extension.length)
  return [filePath, ...imageExtensions.map((candidate) => `${basePath}.${candidate}`).filter((candidate) => candidate !== filePath)]
}

async function findExistingAssetPath(filePath) {
  for (const candidate of imageVariantPaths(filePath)) {
    try {
      if ((await stat(candidate)).size > 0) return candidate
    } catch {}
  }
  return filePath
}

async function removeImageVariants(filePath, exceptPath = '') {
  await Promise.all(imageVariantPaths(filePath).filter((candidate) => candidate !== exceptPath).map((candidate) => unlink(candidate).catch((error) => {
    if (error.code !== 'ENOENT') throw error
  })))
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
        const [action, id, sourceId] = parts
        const filePath = targetPath(server.config.root, id)
        if (action === 'status' && request.method === 'GET') {
          const status = {}
          await Promise.all(Object.entries(managedAssets).map(async ([assetId, relativePath]) => {
            try { status[assetId] = (await stat(await findExistingAssetPath(path.join(server.config.root, relativePath)))).size }
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
        if (action === 'copy-profile' && request.method === 'POST') {
          const sourcePath = targetPath(server.config.root, sourceId)
          if (!profileAssetIds.has(id) || !profileAssetIds.has(sourceId) || id === sourceId || !sourcePath) {
            response.statusCode = 400
            response.end('Origen o destino de foto de perfil no válido')
            return
          }
          try {
            const existingSourcePath = await findExistingAssetPath(sourcePath)
            const contents = await readFile(existingSourcePath)
            if (!contents.length) {
              response.statusCode = 400
              response.end('La foto de origen está vacía')
              return
            }
            if (!isSupportedImage(contents)) {
              response.statusCode = 415
              response.end('La foto de origen no tiene un formato de imagen compatible')
              return
            }
            const destinationPath = `${filePath.slice(0, -path.extname(filePath).length)}${path.extname(existingSourcePath)}`
            await removeImageVariants(filePath, destinationPath)
            await atomicWrite(destinationPath, contents)
            response.setHeader('Content-Type', 'application/json')
            response.end(JSON.stringify({ size: contents.length }))
          } catch (error) {
            if (error.code === 'ENOENT') {
              response.statusCode = 404
              response.end('La foto de origen no existe')
            } else {
              console.error(`[asset-manager] No se pudo copiar ${sourceId} a ${id}:`, error)
              response.statusCode = 500
              response.end(`No se pudo copiar la foto (${error.code || 'error de escritura'})`)
            }
          }
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
              if (id !== 'mail-video') await removeImageVariants(filePath, filePath)
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
            if (id !== 'mail-video') await removeImageVariants(filePath)
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
