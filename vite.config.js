import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { mkdir, readFile, rename, stat, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'

const managedAssets = {
  'julian-mate-story': 'public/assets/julian_mate_story.jpg',
  'julian-profile-instagram': 'public/assets/julian_profile_instagram.jpg',
  'julian-profile-whatsapp': 'public/assets/julian_profile_whatsapp.jpg',
  'julian-post-profile': 'public/assets/julian_profile_post.jpg',
  'julian-post-dog': 'public/assets/julian_dog_post.jpg',
  'julian-post-eiffel': 'public/assets/julian_eiffel_post.jpg',
  'party-halloween': 'public/assets/party_halloween.jpg',
  'agustina-julian-party': 'public/assets/agustina_julian_party.jpg',
  'martina-wallpaper-desktop': 'public/assets/martina_wallpaper_desktop.jpg',
  'martina-wallpaper-mobile': 'public/assets/martina_wallpaper_mobile.jpg',
  'martina-mirror-selfie': 'public/assets/martina_mirror_selfie.jpg',
  'mail-video': 'public/assets/video_01.mp4',
  'crown-photo': 'public/assets/crown_photo.jpg',
  'emily-costume': 'public/assets/emily_costume.jpg',
}
const managedAssetDefaults = {}
const maxAssetSize = 100 * 1024 * 1024
const profileAssetIds = new Set(['julian-profile-instagram', 'julian-profile-whatsapp'])
const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'bmp', 'svg', 'heic', 'heif']
const databasePath = 'data/project-database.json'
const projectSettingKeys = new Set(['productionDate', 'clockTime', 'julianPhone', 'instagramDisplayName', 'instagramUsername', 'instagramBio', 'instagramFollowers', 'instagramFollowing', 'mateStoryCaption', 'halloweenStoryCaption', 'friendsStoryCaption', 'instagramStoryHighlightText', 'musicTitle', 'musicArtist', 'musicDuration', 'mailDurationSeconds', 'mailNotificationDelaySeconds', 'attachmentLoadingSeconds', 'julianContactName'])

function isValidAsset(id, buffer) {
  if (id === 'mail-video') {
    return buffer.length >= 12 && buffer.subarray(4, 8).toString('ascii') === 'ftyp'
  }
  // Image uploads are validated with isSupportedImage and stored with their detected extension.
  return buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8 &&
    buffer[buffer.length - 2] === 0xff && buffer[buffer.length - 1] === 0xd9
}

function isSupportedImage(buffer) {
  if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) return true
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return true
  if (buffer.subarray(0, 3).toString('ascii') === 'GIF' || buffer.subarray(0, 2).toString('ascii') === 'BM') return true
  if (buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP') return true
  if (buffer.subarray(4, 8).toString('ascii') === 'ftyp' && /^(avif|avis|heic|heix|hevc|hevx|heim|heis|heif|mif1|msf1)$/.test(buffer.subarray(8, 12).toString('ascii'))) return true
  return /^\s*(?:<\?xml[^>]*>\s*)?<svg\b/i.test(buffer.toString('utf8', 0, Math.min(buffer.length, 512)))
}

function imageExtensionFor(buffer, contentType = '') {
  if (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xd8) return 'jpg'
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png'
  if (buffer.subarray(0, 3).toString('ascii') === 'GIF') return 'gif'
  if (buffer.subarray(0, 2).toString('ascii') === 'BM') return 'bmp'
  if (buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP') return 'webp'
  if (buffer.subarray(4, 8).toString('ascii') === 'ftyp') {
    const brand = buffer.subarray(8, 12).toString('ascii')
    if (/^(avif|avis)$/.test(brand)) return 'avif'
    if (/^(heic|heix|hevc|hevx|heim|heis)$/.test(brand)) return 'heic'
    if (/^(heif|mif1|msf1)$/.test(brand)) return 'heif'
  }
  if (/^\s*(?:<\?xml[^>]*>\s*)?<svg\b/i.test(buffer.toString('utf8', 0, Math.min(buffer.length, 512)))) return 'svg'
  const mime = String(contentType).split(';')[0].trim().toLowerCase()
  return ({ 'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif', 'image/gif': 'gif', 'image/bmp': 'bmp', 'image/svg+xml': 'svg', 'image/heic': 'heic', 'image/heif': 'heif' })[mime] || ''
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

async function removeImageVariants(filePath, exceptPath = '', preservePath = '') {
  await Promise.all(imageVariantPaths(filePath).filter((candidate) => candidate !== exceptPath && candidate !== preservePath).map((candidate) => unlink(candidate).catch((error) => {
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

async function readProjectDatabase(root) {
  try {
    const database = JSON.parse(await readFile(path.join(root, databasePath), 'utf8'))
    return { ...database, version: 1, settings: database.settings || {}, assets: database.assets || {} }
  } catch (error) {
    if (error.code !== 'ENOENT' && !(error instanceof SyntaxError)) throw error
    return { version: 1, settings: {}, assets: {} }
  }
}

async function writeProjectDatabase(root, database) {
  await atomicWrite(path.join(root, databasePath), Buffer.from(JSON.stringify(database, null, 2)))
}

let projectDatabaseQueue = Promise.resolve()
function updateProjectDatabase(root, update) {
  const operation = projectDatabaseQueue.then(async () => {
    const database = await readProjectDatabase(root)
    const shouldWrite = await update(database)
    if (shouldWrite === false) return database
    await writeProjectDatabase(root, database)
    return database
  })
  projectDatabaseQueue = operation.catch(() => {})
  return operation
}

async function recordManagedAsset(root, id, filePath, size) {
  await updateProjectDatabase(root, (database) => {
    database.assets[id] = {
      path: path.relative(root, filePath),
      extension: path.extname(filePath).slice(1),
      size,
      updatedAt: new Date().toISOString(),
    }
  })
}

async function readRequestJson(request, maxBytes = 64 * 1024) {
  const chunks = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > maxBytes) throw new Error('El cuerpo de la solicitud supera el límite permitido')
    chunks.push(chunk)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
}

async function ensureDefaultAssetBackup(root, id) {
  const relativePath = managedAssetDefaults[id]
  if (!relativePath) return ''
  const sourcePath = path.join(root, relativePath)
  const backupPath = path.join(root, 'data', 'default-assets', path.basename(relativePath))
  try {
    await stat(backupPath)
    return backupPath
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  const contents = await readFile(sourcePath)
  await atomicWrite(backupPath, contents)
  return backupPath
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
        if (action === 'db' && request.method === 'GET') {
          try {
            response.setHeader('Content-Type', 'application/json')
            response.end(JSON.stringify(await readProjectDatabase(server.config.root)))
          } catch (error) {
            response.statusCode = 500
            response.end(`No se pudo leer la base local (${error.code || 'error'})`)
          }
          return
        }
        if (action === 'db' && id === 'settings' && request.method === 'POST') {
          try {
            const updates = await readRequestJson(request)
            const settings = Object.fromEntries(Object.entries(updates).filter(([key, value]) => projectSettingKeys.has(key) && ['string', 'number'].includes(typeof value)))
            const database = await updateProjectDatabase(server.config.root, (current) => { current.settings = { ...current.settings, ...settings } })
            response.setHeader('Content-Type', 'application/json')
            response.end(JSON.stringify({ settings: database.settings }))
          } catch (error) {
            response.statusCode = 400
            response.end(`No se pudo guardar la configuración (${error.code || error.message || 'error'})`)
          }
          return
        }
        if (action === 'status' && request.method === 'GET') {
          const status = {}
          const assetRecords = {}
          await Promise.all(Object.entries(managedAssets).map(async ([assetId, relativePath]) => {
            const basePath = path.join(server.config.root, relativePath)
            try {
              const existingPath = await findExistingAssetPath(basePath)
              const details = await stat(existingPath)
              status[assetId] = details.size
              const record = { path: path.relative(server.config.root, existingPath), extension: path.extname(existingPath).slice(1), size: details.size }
              assetRecords[assetId] = { ...record, updatedAt: details.mtime.toISOString() }
            } catch {
              status[assetId] = 0
            }
          }))
          await updateProjectDatabase(server.config.root, (database) => {
            let changed = false
            for (const [assetId, current] of Object.entries(assetRecords)) {
              const previous = database.assets[assetId]
              if (!previous || previous.path !== current.path || previous.extension !== current.extension || previous.size !== current.size) {
                database.assets[assetId] = current
                changed = true
              }
            }
            return changed
          })
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
            await recordManagedAsset(server.config.root, id, destinationPath, contents.length)
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
            if (id === 'mail-video' ? !isValidAsset(id, contents) : !isSupportedImage(contents)) {
              response.statusCode = 415
              response.end(id === 'mail-video' ? 'El archivo no parece ser un video MP4 válido' : 'El archivo no tiene un formato de imagen compatible')
              return
            }
            try {
              const extension = id === 'mail-video' ? '' : imageExtensionFor(contents, request.headers['content-type'])
              if (id !== 'mail-video' && !extension) {
                response.statusCode = 415
                response.end('No se pudo identificar el formato de la imagen')
                return
              }
              const destinationPath = id === 'mail-video' ? filePath : `${filePath.slice(0, -path.extname(filePath).length)}.${extension}`
              if (id !== 'mail-video') await ensureDefaultAssetBackup(server.config.root, id)
              await atomicWrite(destinationPath, contents)
              if (id !== 'mail-video') {
                await removeImageVariants(filePath, destinationPath)
              }
              await recordManagedAsset(server.config.root, id, destinationPath, contents.length)
              response.setHeader('Content-Type', 'application/json')
              response.end(JSON.stringify({ size, extension: extension || 'mp4' }))
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
            let restoredPath = ''
            let size = 0
            if (id !== 'mail-video' && managedAssetDefaults[id]) {
              const backupPath = await ensureDefaultAssetBackup(server.config.root, id)
              restoredPath = path.join(server.config.root, managedAssetDefaults[id])
              const originalContents = await readFile(backupPath)
              await removeImageVariants(filePath, restoredPath)
              await atomicWrite(restoredPath, originalContents)
              size = originalContents.length
            } else {
              if (id !== 'mail-video') await removeImageVariants(filePath)
              await atomicWrite(filePath, Buffer.alloc(0))
            }
            await recordManagedAsset(server.config.root, id, restoredPath || filePath, size)
            response.setHeader('Content-Type', 'application/json')
            response.end(JSON.stringify({ size }))
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
