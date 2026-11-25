import { isOfflineAssetReset, localAssetUrl } from './offline-assets.js'

const apiUrl = String(import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '')
const apiKey = String(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '')
const bucket = 'project-assets'
const stateTable = 'project_state'

const assetFiles = {
  'julian-mate-story': 'julian_mate_story.jpg',
  'julian-profile-instagram': 'julian_profile_instagram.jpg',
  'julian-profile-whatsapp': 'julian_profile_whatsapp.jpg',
  'julian-post-profile': 'julian_profile_post.jpg',
  'julian-post-dog': 'julian_dog_post.jpg',
  'julian-post-eiffel': 'julian_eiffel_post.jpg',
  'party-halloween': 'party_halloween.jpg',
  'agustina-julian-party': 'agustina_julian_party.jpg',
  'martina-wallpaper-desktop': 'martina_wallpaper_desktop.jpg',
  'martina-wallpaper-mobile': 'martina_wallpaper_mobile.jpg',
  'martina-mirror-selfie': 'martina_mirror_selfie.jpg',
  'mail-video': 'video_01.mp4',
  'crown-photo': 'crown_photo.jpg',
  'emily-costume': 'emily_costume.jpg',
}
const assetIdByStem = Object.fromEntries(Object.entries(assetFiles).map(([id, filename]) => [filename.replace(/\.[^.]+$/, ''), id]))
let cloudAssets = {}

export const cloudConfigured = Boolean(apiUrl && apiKey)

async function api(path, options = {}) {
  if (!cloudConfigured) throw new Error('Falta configurar el almacenamiento en la nube')
  const headers = new Headers(options.headers || {})
  headers.set('apikey', apiKey)
  headers.set('Authorization', `Bearer ${apiKey}`)
  const response = await fetch(`${apiUrl}${path}`, { ...options, headers })
  if (!response.ok) {
    const detail = await response.text()
    throw new Error(detail || `Error de almacenamiento (${response.status})`)
  }
  if (response.status === 204) return null
  const responseText = await response.text()
  if (!responseText.trim()) return null
  try { return JSON.parse(responseText) } catch { return responseText }
}

export function setCloudAssetManifest(assets) { cloudAssets = assets || {} }

export function cloudAssetUrl(src) {
  if (!src || !src.startsWith('/assets/')) return src
  const localUrl = localAssetUrl(src)
  if (localUrl) return localUrl
  const filename = src.split('/').pop().split('?')[0]
  const id = assetIdByStem[filename.replace(/\.[^.]+$/, '')]
  if (id && isOfflineAssetReset(id)) return src
  const record = id && cloudAssets[id]
  return record?.objectPath ? `${apiUrl}/storage/v1/object/public/${bucket}/${record.objectPath}?v=${encodeURIComponent(record.updatedAt || '')}` : src
}

export async function getCloudState() {
  const rows = await api(`/rest/v1/${stateTable}?id=eq.main&select=data`)
  const data = rows?.[0]?.data || { settings: {} }
  const assetRows = await api('/rest/v1/project_assets?select=id,object_path,extension,size,updated_at')
  setCloudAssetManifest(Object.fromEntries((assetRows || []).map((asset) => [asset.id, {
    objectPath: asset.object_path,
    extension: asset.extension,
    size: asset.size,
    updatedAt: asset.updated_at,
  }])))
  return data
}

async function writeCloudState(update) {
  const current = await getCloudState()
  const data = update(current)
  const rows = await api(`/rest/v1/${stateTable}?id=eq.main`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({ data }),
  })
  return rows
}

export async function saveCloudSettings(settings) {
  await writeCloudState((current) => ({ ...current, settings: { ...(current.settings || {}), ...settings } }))
}

function objectPathFor(id, extension) { return `${id}.${extension}` }

function fileExtension(file, id) {
  if (id === 'mail-video') return 'mp4'
  const mimeExtension = ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif', 'image/gif': 'gif', 'image/bmp': 'bmp', 'image/svg+xml': 'svg', 'image/heic': 'heic', 'image/heif': 'heif' })[file.type]
  if (mimeExtension) return mimeExtension
  const extension = file.name.split('.').pop().toLowerCase()
  return ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'bmp', 'svg', 'heic', 'heif', 'mp4'].includes(extension) ? extension : 'jpg'
}

async function uploadObject(objectPath, file) {
  const response = await fetch(`${apiUrl}/storage/v1/object/${bucket}/${encodeURIComponent(objectPath)}`, {
    method: 'POST', headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}`, 'Content-Type': file.type || 'application/octet-stream', 'x-upsert': 'true' }, body: file,
  })
  if (!response.ok) throw new Error(await response.text() || `No se pudo subir el archivo (${response.status})`)
}

async function deleteObjects(objectPaths) {
  const paths = [...new Set(objectPaths.filter(Boolean))]
  if (!paths.length) return
  await api(`/storage/v1/object/${bucket}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prefixes: paths }) }, true)
}

export async function uploadCloudAsset(id, file) {
  await getCloudState()
  const previous = cloudAssets[id]?.objectPath
  const extension = fileExtension(file, id)
  const objectPath = objectPathFor(id, extension)
  await uploadObject(objectPath, file)
  const updatedAt = new Date().toISOString()
  const record = { objectPath, extension, size: file.size, updatedAt }
  await api('/rest/v1/project_assets?on_conflict=id', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ id, object_path: objectPath, extension, size: file.size, updated_at: updatedAt }),
  })
  const assets = { ...cloudAssets, [id]: record }
  if (previous && previous !== objectPath) await deleteObjects([previous])
  setCloudAssetManifest(assets)
  return { size: file.size, extension }
}

export async function resetCloudAsset(id, hasOriginal) {
  await getCloudState()
  const previous = cloudAssets[id]?.objectPath
  await api(`/rest/v1/project_assets?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' })
  if (previous) await deleteObjects([previous])
  const assets = { ...cloudAssets }
  delete assets[id]
  setCloudAssetManifest(assets)
  return { size: 0, hasOriginal }
}

export async function copyCloudProfilePhoto(targetId, sourceId) {
  await getCloudState()
  const sourceRecord = cloudAssets[sourceId]
  const sourceUrl = sourceRecord?.objectPath
    ? `${apiUrl}/storage/v1/object/public/${bucket}/${sourceRecord.objectPath}?v=${encodeURIComponent(sourceRecord.updatedAt || '')}`
    : `/assets/${assetFiles[sourceId]}`
  const response = await fetch(sourceUrl)
  if (!response.ok) throw new Error('La foto de origen todavía no está cargada')
  const blob = await response.blob()
  const extension = sourceRecord?.extension || fileExtension(new File([blob], assetFiles[sourceId], { type: blob.type }), sourceId)
  const file = new File([blob], `${targetId}.${extension}`, { type: blob.type })
  return uploadCloudAsset(targetId, file)
}

export async function cloudAssetSizes() {
  await getCloudState()
  return Object.fromEntries(Object.keys(assetFiles).map((id) => [id, Number(cloudAssets[id]?.size) || 0]))
}

