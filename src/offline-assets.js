const databaseName = 'utileria-digital-invisible-offline'
const storeName = 'assets'
const assetFileNames = {
  'julian-profile-instagram': 'julian_profile_instagram',
  'julian-profile-whatsapp': 'julian_profile_whatsapp',
  'julian-post-profile': 'julian_profile_generated',
  'julian-post-dog': 'julian_dog_post',
  'julian-post-eiffel': 'julian_eiffel_post',
  'party-halloween': 'party_halloween',
  'agustina-julian-party': 'agustina_julian_party',
  'martina-wallpaper-desktop': 'martina_wallpaper_desktop',
  'martina-wallpaper-mobile': 'martina_wallpaper_mobile',
  'martina-mirror-selfie': 'martina_mirror_selfie',
  'mail-video': 'video_01',
  'crown-photo': 'crown_photo',
  'emily-costume': 'emily_costume',
}
const localUrls = new Map()
const resetAssets = new Set()
let databasePromise

function openDatabase() {
  if (!globalThis.indexedDB) return Promise.reject(new Error('El almacenamiento local no está disponible'))
  if (!databasePromise) databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1)
    request.onupgradeneeded = () => request.result.createObjectStore(storeName, { keyPath: 'id' })
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
  return databasePromise
}

function notifyAssetsChanged() {
  window.dispatchEvent(new Event('offline-assets-changed'))
}

function withStore(mode, action) {
  return openDatabase().then((database) => new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, mode)
    const store = transaction.objectStore(storeName)
    let result
    try { result = action(store) } catch (error) { reject(error); return }
    transaction.oncomplete = () => resolve(result?.result)
    transaction.onerror = () => reject(transaction.error)
    transaction.onabort = () => reject(transaction.error || new Error('No se pudo guardar el archivo en este navegador'))
  }))
}

function setLocalUrl(id, file) {
  const previous = localUrls.get(id)
  if (previous) URL.revokeObjectURL(previous)
  localUrls.set(id, URL.createObjectURL(file))
  resetAssets.delete(id)
}

export function localAssetUrl(src) {
  if (!src || !src.startsWith('/assets/')) return ''
  const stem = src.split('/').pop().split('?')[0].replace(/\.[^.]+$/, '')
  const id = Object.keys(assetFileNames).find((assetId) => assetFileNames[assetId] === stem)
  if (id && resetAssets.has(id)) return src
  return id ? localUrls.get(id) || '' : ''
}

export function isOfflineAssetReset(id) { return resetAssets.has(id) }

export async function loadOfflineAssets() {
  const database = await openDatabase()
  const records = await new Promise((resolve, reject) => {
    const request = database.transaction(storeName, 'readonly').objectStore(storeName).getAll()
    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error)
  })
  const sizes = {}
  records.forEach((record) => {
    if (record.reset) resetAssets.add(record.id)
    else if (record.file) {
      setLocalUrl(record.id, record.file)
      sizes[record.id] = record.file.size
    }
  })
  notifyAssetsChanged()
  return sizes
}

export async function saveOfflineAsset(id, file) {
  await withStore('readwrite', (store) => store.put({ id, file }))
  setLocalUrl(id, file)
  notifyAssetsChanged()
  return { size: file.size }
}

export async function resetOfflineAsset(id) {
  await withStore('readwrite', (store) => store.put({ id, reset: true }))
  const previous = localUrls.get(id)
  if (previous) URL.revokeObjectURL(previous)
  localUrls.delete(id)
  resetAssets.add(id)
  notifyAssetsChanged()
}

export async function copyOfflineAsset(targetId, sourceId, fallbackUrl) {
  let sourceFile = await withStore('readonly', (store) => store.get(sourceId))
  sourceFile = sourceFile?.file
  if (!sourceFile) {
    const candidates = [localAssetUrl(fallbackUrl) || fallbackUrl, ...['jpg', 'png', 'webp', 'jpeg'].map((extension) => `/assets/${assetFileNames[sourceId]}.${extension}`)]
    for (const candidate of [...new Set(candidates)]) {
      try {
        const response = await fetch(candidate)
        if (!response.ok) continue
        const blob = await response.blob()
        if (!blob.size) continue
        sourceFile = new File([blob], `${sourceId}.${blob.type === 'image/png' ? 'png' : 'jpg'}`, { type: blob.type || 'image/jpeg' })
        break
      } catch {}
    }
    if (!sourceFile) throw new Error('No se pudo leer la imagen de origen')
  }
  return saveOfflineAsset(targetId, sourceFile)
}
