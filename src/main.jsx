import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import config from './config.js'
import { Power, FolderOpen, StickyNote, Music2, Wifi, Search, BatteryFull, Signal, ShieldCheck, SkipBack, SkipForward, Pause, Play, Mail, Images, Settings, Minus, X, Maximize2, Minimize2, Send, Mic, Square, ArrowLeft, Menu, Grid3X3, Clapperboard, UserRound, House, Share2, Video } from 'lucide-react'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/inter/latin-700.css'
import './styles.css'
import './profile-settings.css'
import './computer-data.css'
import './phone-status.css'
import './scene-groups.css'
import './desktop.css'
import './music.css'
import './ios-install.css'
import './mail.css'
import './terminal.css'
import './story.css'
import './instagram-follow.css'
import './lock.css'
import './chat.css'
import './ai-chat.css'
import './asset-placeholders.css'
import './upload-toast.css'
import { cloudAssetSizes, cloudAssetUrl, cloudConfigured, copyCloudProfilePhoto, getCloudState, resetCloudAsset, saveCloudSettings, setCloudAssetManifest, uploadCloudAsset } from './cloud-sync.js'
import { copyOfflineAsset, loadOfflineAssets, resetOfflineAsset, saveOfflineAsset } from './offline-assets.js'
import './call.css'
import './aspect-ratio-fixes.css'

const scenes = [
  { path: '/mobile/esc1a-p1', device: 'Celular', code: 'ESC 1.A', shot: 'Plano 1', title: 'Chat con asistente', phase: 'Celular' },
    { path: '/notebook/esc1a-p2', device: 'Notebook', code: 'ESC 1.A', shot: 'Plano 2', title: 'Escritorio & reproductor', phase: 'Computadora' },
  { path: '/notebook/esc1g-p2', device: 'Notebook', code: 'ESC 1.G', shot: 'Plano 2', title: 'Email con video adjunto', phase: 'Computadora' },
  { path: '/notebook/esc3-p2', device: 'Notebook', code: 'ESC 3', shot: 'Plano 2', title: 'Terminal incógnita', phase: 'Computadora' },
  { path: '/mobile/esc1b-p3', device: 'Celular', code: 'ESC 1.B', shot: 'Plano 3', title: 'Instagram de Julián', phase: 'Celular' },
  { path: '/mobile/esc1c-p5', device: 'Celular', code: 'ESC 1.C', shot: 'Plano 5', title: 'Notificaciones de WhatsApp', phase: 'Celular' },
  { path: '/mobile/esc1g-p10', device: 'Celular', code: 'ESC 1.G', shot: 'Plano 10', title: 'Llamada entrante', phase: 'Celular' },
  { path: '/mobile/esc1g-p11', device: 'Celular', code: 'ESC 1.G', shot: 'Plano 11', title: 'Chat completo con Julián', phase: 'Celular' },
  { path: '/mobile/esc1g-p12', device: 'Celular', code: 'ESC 1.G', shot: 'Plano 12', title: 'Chat dinámico con Julián', phase: 'Celular' },
]
const terminalLines = [
  'Replicando interacciones afectivas...',
  'Cargando datos visuales de Martina...',
  'Procesando datos biométricos...',
  'Enviando a Martina',
  'Cruzando historial de ubicación...',
  'No sos horrible.',
  'No sos invisible.',
]
const julianChatScenePaths = ['/mobile/esc1c-p11', '/mobile/esc1e-p5', '/mobile/esc1e-p8', '/mobile/esc1f-p6', '/mobile/esc1f-p9', '/mobile/esc1g-p6']
const julianOpeningMessages = [
  { id: 'martina-who', sender: 'me', text: 'quién sos?', timestamp: '09:42', status: 'read' },
  { id: 'julian-name', sender: 'contact', text: 'Julián.', timestamp: '09:43' },
]
const julianFollowUpMessage = { id: 'julian-number-request', sender: 'contact', text: 'Vi que te fuiste y le pedí el número a tu amiga.', timestamp: '09:43' }
const martinaAgustinaMessage = { id: 'martina-agustina', sender: 'me', text: 'agustina? pensé que estabas con ella. como no nos vimos en toda la noche...', timestamp: '09:44', status: 'read' }
const julianCostumeMessage = { id: 'julian-costume', sender: 'contact', text: '¿Cómo que no? Tenías un vestido blanco, una corona y un ramo de flores.', timestamp: '09:45' }
const julianCrownMessage = { id: 'julian-crown', sender: 'contact', text: 'Te la olvidaste', image: '/assets/crown_photo.jpg', imageAlt: 'Foto de una corona', timestamp: '09:46' }
const julianAudioResponseSequences = [
  [{ id: 'julian-worried', sender: 'contact', text: 'Perdón, te vi muy mal y me re preocupé.', timestamp: '09:48' }],
  [{ id: 'julian-shy', sender: 'contact', text: 'Vergüenza. Me hubiese gustado que te quedaras.', timestamp: '09:50' }],
  [
    { id: 'julian-agustina-1', sender: 'contact', text: 'Agustina no para de hablar de ella.', timestamp: '09:52' },
    { id: 'julian-agustina-2', sender: 'contact', text: 'Se hace la interesante, pero es un embole.', timestamp: '09:53' },
    { id: 'julian-agustina-3', sender: 'contact', text: 'En cambio vos… buen disfraz, Carrie, ¿no?', timestamp: '09:54' },
  ],
  [{ id: 'julian-unbearable', sender: 'contact', text: 'Insoportable', timestamp: '09:54' }],
  [],
  [
    { id: 'julian-costume-compare', sender: 'contact', text: 'Compite con el del año pasado', timestamp: '09:57' },
    { id: 'julian-costume-photo', sender: 'contact', image: '/assets/emily_costume.jpg', imageAlt: 'Foto del disfraz de Carrie', timestamp: '09:58' },
  ],
  [
    { id: 'julian-likes-it', sender: 'contact', text: 'A mí me gusta.', timestamp: '10:00' },
    { id: 'julian-not-here', sender: 'contact', text: 'Horrible es que no estés acá.', timestamp: '10:01' },
  ],
  [
    { id: 'julian-personally-1', sender: 'contact', text: 'Y… muchas cosas.', timestamp: '10:03' },
    { id: 'julian-personally-2', sender: 'contact', text: 'Pero bueno, tendría que contártelas personalmente.', timestamp: '10:04' },
  ],
  [{ id: 'julian-audio', sender: 'contact', audioDuration: '0:04', timestamp: '10:05' }],
  [
    { id: 'julian-same-taste', sender: 'contact', text: 'Nos gusta la misma música, las mismas pelis.', timestamp: '10:07' },
    { id: 'julian-common-ground', sender: 'contact', text: 'Me gusta que tengamos tanto en común...', timestamp: '10:08' },
    { id: 'julian-right', sender: 'contact', text: '¿no?', timestamp: '10:09' },
  ],
  [
    { id: 'julian-beautiful', sender: 'contact', text: 'Wow sos hermosa.', timestamp: '10:11' },
    { id: 'julian-adoring', sender: 'contact', text: 'Me encantás <3', timestamp: '10:12' },
  ],
  [{ id: 'julian-lamp-compliment', sender: 'contact', text: 'Buena compra hiciste, te queda muy linda esa luz', timestamp: '10:14' }],
  [
    { id: 'julian-lamp-intro', sender: 'contact', text: 'De la lámpara :)', timestamp: '10:16' },
    { id: 'julian-lamp-question', sender: 'contact', text: 'La compraste el lunes ¿no?', timestamp: '10:17' },
    { id: 'julian-class', sender: 'contact', text: 'Lo dijiste en clase', timestamp: '10:18' },
  ],
  [{ id: 'julian-same-feeling', sender: 'contact', text: 'Sii! me pasa con vos :)', timestamp: '10:19' }],
  [{ id: 'julian-night-beautiful', sender: 'contact', text: 'Hasta durmiendo sos hermosa <3', timestamp: '02:14' }],
]
const fullJulianConversation = [
  { id: 'full-julian-hello', sender: 'contact', text: 'Hola, estas?' },
  { id: 'full-julian-well', sender: 'contact', text: 'estas bien?' },
  { id: 'full-who', sender: 'me', text: 'quién sos?' },
  { id: 'full-name', sender: 'contact', text: 'Julián.' },
  { id: 'full-number-request', sender: 'contact', text: 'Vi que te fuiste y le pedí el número a tu amiga.' },
  { id: 'full-agustina-question', sender: 'me', text: 'agustina? pense que estabas con ella... como no nos vimos en toda la noche' },
  { id: 'full-costume-question', sender: 'contact', text: '¿Cómo que no? Tenías un vestido blanco, una corona y un ramo de flores.' },
  { id: 'full-crown', sender: 'contact', text: 'Te la olvidaste', image: '/assets/crown_photo.jpg', imageAlt: 'Foto de una corona' },
  { id: 'full-sister', sender: 'me', audioDuration: '0:04' },
  { id: 'full-worried', sender: 'contact', text: 'Perdón, te vi muy mal y me re preocupé.' },
  { id: 'full-why-not', sender: 'me', audioDuration: '0:04' },
  { id: 'full-shy', sender: 'contact', text: 'Vergüenza. Me hubiese gustado que te quedaras.' },
  { id: 'full-agustina-audio', sender: 'me', text: 'sí? y agustina?' },
  { id: 'full-agustina-1', sender: 'contact', text: 'Agustina no para de hablar de ella.' },
  { id: 'full-agustina-2', sender: 'contact', text: 'Se hace la interesante, pero es un embole.' },
  { id: 'full-agustina-3', sender: 'contact', text: 'En cambio vos… buen disfraz, Carrie, ¿no?' },
  { id: 'full-agustina-voice', sender: 'me', text: 'ay! viste cómo es? la quiero, pero a veces es… no sé' },
  { id: 'full-unbearable', sender: 'contact', text: 'Insoportable' },
  { id: 'full-said-you', sender: 'me', text: 'lo dijiste vos, no yo' },
  { id: 'full-liked-it', sender: 'me', audioDuration: '0:04' },
  { id: 'full-costume-compare', sender: 'contact', text: 'Compite con el del año pasado' },
  { id: 'full-costume-photo', sender: 'contact', image: '/assets/emily_costume.jpg', imageAlt: 'Foto del disfraz de Carrie' },
  { id: 'full-costume-embarrassed', sender: 'me', audioDuration: '0:04' },
  { id: 'full-horrible-here', sender: 'contact', text: 'A mí me gusta.' },
  { id: 'full-not-here', sender: 'contact', text: 'Horrible es que no estés acá.' },
  { id: 'full-pickup-audio', sender: 'me', text: 'sí? qué más te gusta? cómo es eso de pasarme a buscar?' },
  { id: 'full-personally-1', sender: 'contact', text: 'Y… muchas cosas.' },
  { id: 'full-personally-2', sender: 'contact', text: 'Pero bueno, tendría que contártelas personalmente.' },
  { id: 'full-advance', sender: 'me', text: 'y no podés adelantarme algo?' },
  { id: 'full-julian-audio', sender: 'contact', audioDuration: '0:04' },
  { id: 'full-music-audio', sender: 'me', text: 'qué? los amo! te juro que recién los estaba escuchando' },
  { id: 'full-same-music-1', sender: 'contact', text: 'Nos gusta la misma música, las mismas pelis.' },
  { id: 'full-same-music-2', sender: 'contact', text: 'Me gusta que tengamos tanto en común...' },
  { id: 'full-same-music-3', sender: 'contact', text: '¿no?' },
  { id: 'full-photo-audio', sender: 'me', text: 'sí? y… así te gustaría verme?' },
  { id: 'full-selfie', sender: 'me', image: '/assets/martina_mirror_selfie.jpg', imageAlt: 'Selfie de Martina frente al espejo' },
  { id: 'full-beautiful', sender: 'contact', text: 'Wow sos hermosa.' },
  { id: 'full-adore', sender: 'contact', text: 'Me encantás <3' },
  { id: 'full-lamp-compliment', sender: 'contact', text: 'Buena compra hiciste, te queda muy linda esa luz.' },
  { id: 'full-lamp-what', sender: 'me', text: 'de qué hablas?' },
  { id: 'full-lamp-intro', sender: 'contact', text: 'De la lámpara :)' },
  { id: 'full-lamp-question', sender: 'contact', text: 'La compraste el lunes ¿no?' },
  { id: 'full-lamp-class', sender: 'contact', text: 'Lo dijiste en clase.' },
  { id: 'full-lamp-answer', sender: 'me', text: 'en serio? perdón, ando con la cabeza a mil. es... extraña, pero tiene algo, como si no pudiera dejar de verla. nunca te pasó algo así?' },
  { id: 'full-same-feeling', sender: 'contact', text: 'Sii! me pasa con vos :)' },
  { id: 'full-chamuyo', sender: 'me', audioDuration: '0:04' },
  { id: 'full-night-beautiful', sender: 'contact', text: 'Hasta durmiendo sos hermosa <3' },
]
const assets = {
  julianInstagramAvatar: '/assets/julian_profile_instagram.jpg',
  julianWhatsappAvatar: '/assets/julian_profile_whatsapp.jpg',
  halloweenStory: '/assets/party_halloween.jpg',
  agustinaStory: '/assets/agustina_julian_party.jpg',
  desktopWallpaper: '/assets/martina_wallpaper_desktop.jpg',
  mobileWallpaper: '/assets/martina_wallpaper_mobile.jpg',
}
const storyData = [
  { id: 'mate', mediaUrl: '/assets/julian_mate_story.jpg', caption: 'un mate antes de salir 🧉' },
  { id: 'halloween', mediaUrl: assets.halloweenStory, caption: 'noche de halloween 🎃' },
  { id: 'friends', mediaUrl: assets.agustinaStory, caption: '🖤' },
]
const julianPosts = [
  { id: 'julian-profile-post', mediaUrl: '/assets/julian_profile_post.jpg', caption: 'Julián' },
  { id: 'julian-dog-post', mediaUrl: '/assets/julian_dog_post.jpg', caption: 'El perro de Julián' },
  { id: 'julian-eiffel-post', mediaUrl: '/assets/julian_eiffel_post.jpg', caption: 'Julián en París' },
]
const promoEmails = [
  { sender: 'LavaLab', avatar: 'L', color: '#6c718f', time: 'AYER', subject: '¿Te gustó tu lámpara de lava?', preview: 'Contanos en una encuesta de 5 minutos.' },
  { sender: 'Nube Social', avatar: 'N', color: '#a36e91', time: '09:12', subject: 'Mirá lo que te perdiste', preview: 'Nuevas historias de las cuentas que seguís.' },
  { sender: 'Pieluna', avatar: 'P', color: '#997c91', time: '08:46', subject: 'Un mimo para tu rutina', preview: 'Descubrí los favoritos de cuidado facial.' },
  { sender: 'Sur Textil', avatar: 'S', color: '#777777', time: 'AYER', subject: 'Nuevos básicos de temporada', preview: 'Prendas livianas para todos los días.' },
  { sender: 'Tablería', avatar: 'T', color: '#bd4250', time: 'AYER', subject: 'Ideas que guardaste, juntas', preview: 'Una dosis de inspiración para vos.' },
  { sender: 'Vistaria', avatar: 'V', color: '#526b8c', time: 'MAR', subject: 'Un look nuevo te está esperando', preview: 'Hasta 30% en prendas seleccionadas.' },
  { sender: 'Ritual de Casa', avatar: 'R', color: '#63805c', time: 'MAR', subject: 'Tu momento de spa en casa', preview: 'Aromas y baños para relajarte.' },
  { sender: 'Color de Boca', avatar: 'C', color: '#b77e77', time: 'LUN', subject: 'Labios protagonistas', preview: 'Conocé los tonos de la nueva colección.' },
  { sender: 'Modo Lino', avatar: 'M', color: '#bd4f54', time: 'LUN', subject: 'La selección de esta semana', preview: 'Inspiración cómoda para renovar tu placard.' },
  { sender: 'Nube Social', avatar: 'N', color: '#a36e91', time: 'SÁB', subject: 'Tu resumen de la semana', preview: 'Así fue tu actividad en Nube Social.' },
]
const managedFiles = [
  { id: 'julian-profile-instagram', group: 'celular', subgroup: 'Instagram', filename: 'julian_profile_instagram.jpg', label: 'Foto de perfil de Julián', accept: 'image/*' },
  { id: 'julian-post-profile', group: 'celular', subgroup: 'Instagram', filename: 'julian_profile_post.jpg', label: 'Publicación de Julián 1', accept: 'image/*' },
  { id: 'julian-post-dog', group: 'celular', subgroup: 'Instagram', filename: 'julian_dog_post.jpg', label: 'Publicación de Julián 2', accept: 'image/*' },
  { id: 'julian-post-eiffel', group: 'celular', subgroup: 'Instagram', filename: 'julian_eiffel_post.jpg', label: 'Publicación de Julián 3', accept: 'image/*' },
  { id: 'julian-profile-whatsapp', group: 'celular', subgroup: 'WhatsApp', filename: 'julian_profile_whatsapp.jpg', label: 'Foto de perfil de Julián', accept: 'image/*' },
  { id: 'julian-mate-story', group: 'celular', subgroup: 'Instagram', filename: 'julian_mate_story.jpg', label: 'Historia de Julián 1', accept: 'image/*' },
  { id: 'party-halloween', group: 'celular', subgroup: 'Instagram', filename: 'party_halloween.jpg', label: 'Historia de Julián 2', accept: 'image/*' },
  { id: 'agustina-julian-party', group: 'celular', subgroup: 'Instagram', filename: 'agustina_julian_party.jpg', label: 'Historia de Julián 3', accept: 'image/*' },
  { id: 'martina-wallpaper-desktop', group: 'computadora', filename: 'martina_wallpaper_desktop.jpg', label: 'Fondo de pantalla', accept: 'image/*' },
  { id: 'martina-wallpaper-mobile', group: 'celular', filename: 'martina_wallpaper_mobile.jpg', label: 'Fondo de pantalla', accept: 'image/*' },
  { id: 'martina-mirror-selfie', group: 'celular', subgroup: 'WhatsApp', filename: 'martina_mirror_selfie.jpg', label: 'Selfie en el espejo', accept: 'image/*' },
  { id: 'mail-video', group: 'computadora', filename: 'video_01.mp4', label: 'Video de Martina durmiendo', accept: 'video/mp4,video/*' },
  { id: 'crown-photo', group: 'celular', subgroup: 'WhatsApp', filename: 'crown_photo.jpg', label: 'Foto de la corona', accept: 'image/*' },
  { id: 'emily-costume', group: 'celular', subgroup: 'WhatsApp', filename: 'emily_costume.jpg', label: 'Foto del disfraz', accept: 'image/*' },
]
const assetGroups = [
  { id: 'computadora', label: 'Computadora' },
  { id: 'celular', label: 'Celular' },
]

const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'bmp', 'svg', 'heic', 'heif']

function FlexibleAssetImage({ src, onError, ...imageProps }) {
  const candidates = (() => {
    if (!src || !src.startsWith('/assets/')) return [src]
    const resolved = cloudAssetUrl(src)
    if (resolved !== src) return [resolved]
    const base = src.replace(/\.[^/.?]+(?=\?|$)/, '')
    return [...new Set([src, ...imageExtensions.map((extension) => `${base}.${extension}`)])]
  })()
  const [candidateIndex, setCandidateIndex] = useState(0)
  useEffect(() => setCandidateIndex(0), [src])
  return <img {...imageProps} src={candidates[candidateIndex] || src} onError={(event) => {
    if (candidateIndex + 1 < candidates.length) setCandidateIndex(candidateIndex + 1)
    else onError?.(event)
  }} />
}

function AssetUploadSection() {
  const [fileSizes, setFileSizes] = useState({})
  const [uploading, setUploading] = useState('')
  const [notice, setNotice] = useState(null)
  const noticeTimer = useRef(null)
  const displayFilename = (asset) => asset.filename.replace(/\.[^.]+$/, '')

  function showNotice(type, title, detail) {
    window.clearTimeout(noticeTimer.current)
    setNotice({ type, title, detail })
    noticeTimer.current = window.setTimeout(() => setNotice(null), 7000)
  }

  useEffect(() => () => window.clearTimeout(noticeTimer.current), [])

  useEffect(() => {
    loadOfflineAssets().then(setFileSizes).catch(() => {})
    const status = cloudConfigured ? cloudAssetSizes() : fetch('/__asset-manager/status').then((response) => {
      if (!response.ok) throw new Error('El servidor de archivos no respondió')
      return response.json()
    })
    status.then((sizes) => setFileSizes((offlineSizes) => ({ ...sizes, ...offlineSizes }))).catch(() => {})
  }, [])

  function explainUploadError(error, asset) {
    const detail = String(error.message || '')
    if (error.status === 413 || /supera el límite de 100 MB/i.test(detail)) return 'El archivo supera el límite de 100 MB. Elegí una versión más liviana.'
    if (/foto de origen está vacía/i.test(detail)) return 'La otra foto de perfil todavía no está cargada.'
    if (error.status === 415 || /imagen JPEG válida|video MP4 válido/i.test(detail)) {
      return asset.id === 'mail-video'
        ? 'El video no tiene un formato MP4 compatible o está dañado. Exportalo como MP4 y volvé a intentar.'
        : 'No se pudo reconocer el formato de la imagen. Probá con un archivo de imagen válido, como JPG, PNG, WebP o HEIC.'
    }
    if (error.status === 400 || /archivo está vacío/i.test(detail)) return 'El archivo llegó vacío o la transferencia se interrumpió. Seleccionalo otra vez.'
    if (error.status === 404) return 'No se encontró el destino de este archivo en el proyecto. Recargá la página y volvé a intentar.'
    if (/ENOSPC/i.test(detail)) return 'La computadora no tiene espacio libre suficiente para guardar el archivo.'
    if (/EACCES|EPERM/i.test(detail)) return 'El proyecto no tiene permiso para escribir en public/assets. Revisá los permisos de esa carpeta.'
    if (error.status >= 500) return 'El servidor no pudo guardar el archivo. Revisá que el proyecto tenga espacio y permisos de escritura.'
    if (error instanceof TypeError || /Failed to fetch|NetworkError|Load failed/i.test(detail)) return cloudConfigured ? 'Se perdió la conexión con el almacenamiento en la nube. Revisá la conexión a internet e intentá otra vez.' : 'Se perdió la conexión con la computadora. Mantené npm run dev abierto y conectá el teléfono a la misma red.'
    if (/no pudo abrir esta foto|no pudo leer las dimensiones/i.test(detail)) return 'El teléfono no puede leer este formato. Exportá la imagen como JPG o PNG y probá de nuevo.'
    if (/no se pudo convertir|preparar la foto|contexto 2d/i.test(detail)) return 'El teléfono no pudo preparar la imagen. Probá con una foto de menor tamaño o guardada como JPG.'
    if (/video|MP4/i.test(detail)) return 'No se pudo leer el video. Confirmá que sea un MP4 válido y volvé a seleccionarlo.'
    return detail || 'Ocurrió un error inesperado. Volvé a seleccionar el archivo.'
  }

  async function prepareAssetFile(asset, file) {
    if (!file.size) throw new Error('El archivo está vacío')
    if (file.size > 100 * 1024 * 1024) throw new Error('El archivo supera el límite de 100 MB')
    if (asset.id === 'mail-video') {
      const url = URL.createObjectURL(file)
      try {
        await new Promise((resolve, reject) => {
          const video = document.createElement('video')
          video.preload = 'metadata'
          video.onloadedmetadata = () => video.videoWidth && video.videoHeight ? resolve() : reject(new Error('El video no tiene una imagen válida'))
          video.onerror = () => reject(new Error('No se pudo procesar el video; elegí un MP4 válido'))
          video.src = url
        })
      } finally { URL.revokeObjectURL(url) }
      return file
    }
    let image
    if (typeof createImageBitmap === 'function') {
      try { image = await createImageBitmap(file, { imageOrientation: 'from-image' }) } catch { /* Try the browser image decoder as a fallback. */ }
    }
    if (!image) {
      const url = URL.createObjectURL(file)
      try {
        image = await new Promise((resolve, reject) => {
          const loadedImage = new Image()
          loadedImage.onload = () => resolve(loadedImage)
          loadedImage.onerror = () => reject(new Error('El teléfono no pudo abrir esta foto'))
          loadedImage.src = url
        })
      } catch {
        // Some mobile browsers cannot decode HEIC/HEIF locally. Keep the original;
        // the server validates the actual image bytes and stores the matching extension.
        return file
      } finally { URL.revokeObjectURL(url) }
    }
    const imageWidth = image.width || image.naturalWidth
    const imageHeight = image.height || image.naturalHeight
    if (!imageWidth || !imageHeight) {
      image.close?.()
      throw new Error('El teléfono no pudo leer las dimensiones de esta foto')
    }
    const scale = Math.min(1, 2400 / Math.max(imageWidth, imageHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(imageWidth * scale))
    canvas.height = Math.max(1, Math.round(imageHeight * scale))
    const context = canvas.getContext('2d', { alpha: false })
    if (!context) {
      image.close?.()
      throw new Error('No se pudo preparar la foto en este teléfono')
    }
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    image.close?.()
    const jpegBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.88))
    if (!jpegBlob) throw new Error('No se pudo convertir la foto a JPEG')
    const jpegName = `${file.name.replace(/\.[^.]+$/, '') || 'foto'}.jpg`
    return new File([jpegBlob], jpegName, { type: 'image/jpeg', lastModified: Date.now() })
  }

  async function uploadFile(asset, file) {
    setUploading(asset.id)
    setNotice(null)
    try {
      const uploadFileData = await prepareAssetFile(asset, file)
      let offlineResult = null
      try {
        offlineResult = await saveOfflineAsset(asset.id, uploadFileData)
        setFileSizes((current) => ({ ...current, [asset.id]: offlineResult.size }))
      } catch { /* Continue with server storage when browser storage is unavailable. */ }
      let result
      try {
        if (cloudConfigured) result = await uploadCloudAsset(asset.id, uploadFileData)
        else {
          const response = await fetch(`/__asset-manager/upload/${asset.id}`, { method: 'POST', headers: { 'Content-Type': uploadFileData.type || 'application/octet-stream' }, body: uploadFileData })
          if (!response.ok) { const error = new Error(await response.text()); error.status = response.status; throw error }
          result = await response.json()
        }
      } catch (error) {
        if (!offlineResult) throw error
        showNotice('success', 'Guardado en este navegador', `${displayFilename(asset)} está disponible en la app. No se pudo sincronizar con la base o el servidor.`)
        return
      }
      setFileSizes((current) => ({ ...current, [asset.id]: result.size }))
      showNotice('success', 'Archivo subido', `${displayFilename(asset)} se guardó correctamente.`)
    } catch (error) {
      showNotice('error', `No se pudo subir ${displayFilename(asset)}`, explainUploadError(error, asset))
    } finally {
      setUploading('')
    }
  }

  async function resetFile(asset) {
    setUploading(asset.id)
    setNotice(null)
    try {
      let offlineReset = false
      try {
        await resetOfflineAsset(asset.id)
        offlineReset = true
        setFileSizes((current) => ({ ...current, [asset.id]: 0 }))
      } catch { /* Continue with server storage when browser storage is unavailable. */ }
      let result
      try {
        if (cloudConfigured) result = await resetCloudAsset(asset.id, asset.original)
        else {
          const response = await fetch(`/__asset-manager/reset/${asset.id}`, { method: 'POST' })
          if (!response.ok) { const error = new Error(await response.text()); error.status = response.status; throw error }
          result = await response.json()
        }
      } catch (error) {
        if (!offlineReset) throw error
        showNotice('success', 'Restaurado en este navegador', `${displayFilename(asset)} usa ahora su archivo local. No se pudo sincronizar con la base o el servidor.`)
        return
      }
      setFileSizes((current) => ({ ...current, [asset.id]: result.size || 0 }))
      showNotice('success', asset.original ? 'Imagen original restaurada' : 'Placeholder restaurado', `${displayFilename(asset)} ${asset.original ? 'volvió a su imagen original' : 'volvió a quedar vacío'}.`)
    } catch (error) {
      showNotice('error', `No se pudo restaurar ${displayFilename(asset)}`, explainUploadError(error, asset))
    } finally {
      setUploading('')
    }
  }

  async function useOtherProfilePhoto(target, source) {
    setUploading(target.id)
    setNotice(null)
    try {
      let offlineResult = null
      try {
        offlineResult = await copyOfflineAsset(target.id, source.id, cloudAssetUrl(`/assets/${source.filename}`))
        setFileSizes((current) => ({ ...current, [target.id]: offlineResult.size }))
      } catch { /* Continue with server storage when browser storage is unavailable. */ }
      let result
      try {
        if (cloudConfigured) result = await copyCloudProfilePhoto(target.id, source.id)
        else {
          const response = await fetch(`/__asset-manager/copy-profile/${target.id}/${source.id}`, { method: 'POST' })
          if (!response.ok) { const error = new Error(await response.text()); error.status = response.status; throw error }
          result = await response.json()
        }
      } catch (error) {
        if (!offlineResult) throw error
        showNotice('success', 'Foto guardada en este navegador', `La foto también se usará en ${target.id.endsWith('whatsapp') ? 'WhatsApp' : 'Instagram'}. No se pudo sincronizar con la base o el servidor.`)
        return
      }
      setFileSizes((current) => ({ ...current, [target.id]: result.size }))
      showNotice('success', 'Foto de perfil reutilizada', `La foto de ${source.id.endsWith('whatsapp') ? 'WhatsApp' : 'Instagram'} también se usará en ${target.id.endsWith('whatsapp') ? 'WhatsApp' : 'Instagram'}.`)
    } catch (error) {
      showNotice('error', 'No se pudo reutilizar la foto', explainUploadError(error, target))
    } finally {
      setUploading('')
    }
  }

  function renderAssetRows(files) {
    return <div className="asset-upload-list">{files.map((asset) => {
      const size = fileSizes[asset.id] || 0
      const counterpartId = asset.id === 'julian-profile-instagram' ? 'julian-profile-whatsapp' : asset.id === 'julian-profile-whatsapp' ? 'julian-profile-instagram' : ''
      const counterpart = managedFiles.find((candidate) => candidate.id === counterpartId)
      const canUseCounterpart = counterpart && !size && fileSizes[counterpart.id] > 0
      return <article className="asset-upload-row" key={asset.id}>
        <div className="asset-upload-info"><strong>{asset.label}</strong><code>{displayFilename(asset)}</code><small>{size ? `${(size / 1024 / 1024).toFixed(size < 1024 * 1024 ? 0 : 1)} MB · archivo cargado` : 'Placeholder vacío'}</small></div>
        <div className="asset-upload-actions">
          <label className="asset-file-picker">{uploading === asset.id ? 'Guardando…' : 'Elegir archivo'}<input type="file" accept={asset.id === 'mail-video' ? 'video/mp4' : 'image/*'} disabled={Boolean(uploading)} onChange={(event) => { const file = event.target.files?.[0]; if (file) uploadFile(asset, file); event.target.value = '' }} /></label>
          {canUseCounterpart && <button type="button" className="asset-copy-profile-button" disabled={Boolean(uploading)} onClick={() => useOtherProfilePhoto(asset, counterpart)}>Usar foto de {counterpart.id.endsWith('whatsapp') ? 'WhatsApp' : 'Instagram'}</button>}
          <button type="button" className="asset-reset-button" disabled={!size || Boolean(uploading)} onClick={() => resetFile(asset)}>{asset.original ? 'Restaurar original' : 'Restaurar vacío'}</button>
        </div>
      </article>
    })}</div>
  }

  return <section className="asset-upload-section" aria-label="Archivos">
    <div className="asset-upload-heading"><h2>Carga de archivos</h2></div>
    <div className="asset-upload-groups">{assetGroups.map((group) => {
      const groupFiles = managedFiles.filter((asset) => asset.group === group.id)
      const generalFiles = groupFiles.filter((asset) => !asset.subgroup)
      const subgroups = [...new Set(groupFiles.map((asset) => asset.subgroup).filter(Boolean))]
      return <section className="asset-upload-group" key={group.id} aria-labelledby={`asset-group-${group.id}`}>
        <h3 id={`asset-group-${group.id}`}>{group.label}</h3>
        {generalFiles.length > 0 && renderAssetRows(generalFiles)}
        {subgroups.map((subgroup) => <section className="asset-upload-subgroup" key={subgroup} aria-label={subgroup}>
          <h4>{subgroup}</h4>
          {renderAssetRows(groupFiles.filter((asset) => asset.subgroup === subgroup))}
        </section>)}
      </section>
    })}</div>
    {notice && <div className={`asset-upload-toast ${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'}><span className="asset-upload-toast-icon" aria-hidden="true">{notice.type === 'success' ? '✓' : '!'}</span><div><strong>{notice.title}</strong><p>{notice.detail}</p></div><button type="button" aria-label="Cerrar aviso" onClick={() => { window.clearTimeout(noticeTimer.current); setNotice(null) }}>×</button></div>}
  </section>
}

function App() {
  const [path, setPath] = useState(window.location.pathname)
  const [, setOfflineAssetRevision] = useState(0)
  const defaultProductionDate = '2026-10-31'
  const [productionDate, setProductionDate] = useState(() => {
    try { return window.localStorage.getItem('production-date') || defaultProductionDate } catch { return defaultProductionDate }
  })
  const [clockTime, setClockTime] = useState(() => {
    try {
      const saved = window.localStorage.getItem('production-clock-time')
      if (saved) return saved
    } catch {}
    return '01:32'
  })
  const [showPhoneStatusBar, setShowPhoneStatusBar] = useState(() => {
    try { return window.localStorage.getItem('show-phone-status-bar') ?? 'false' } catch { return 'false' }
  })
  const [phoneStatusBarConfigured, setPhoneStatusBarConfigured] = useState(() => {
    try { return window.localStorage.getItem('phone-status-bar-configured') ?? 'false' } catch { return 'false' }
  })
  const [julianPhone, setJulianPhone] = useState(() => {
    try { return window.localStorage.getItem('julian-phone') ?? '+54 9 11 1103-1976' } catch { return '+54 9 11 1103-1976' }
  })
  const defaultInstagramBio = 'Música, cine y alguna foto de madrugada.'
  const [instagramDisplayName, setInstagramDisplayName] = useState(() => { try { return window.localStorage.getItem('instagram-display-name') ?? 'Julián' } catch { return 'Julián' } })
  const [instagramUsername, setInstagramUsername] = useState(() => { try { return window.localStorage.getItem('instagram-username') ?? 'julian.v' } catch { return 'julian.v' } })
  const [instagramBio, setInstagramBio] = useState(() => {
    try { return window.localStorage.getItem('instagram-bio') ?? defaultInstagramBio } catch { return defaultInstagramBio }
  })
  const [instagramFollowers, setInstagramFollowers] = useState(() => { try { return String(Math.max(0, Math.floor(Number(window.localStorage.getItem('instagram-followers') ?? 246) || 0))) } catch { return '246' } })
  const [instagramFollowing, setInstagramFollowing] = useState(() => { try { return String(Math.max(0, Math.floor(Number(window.localStorage.getItem('instagram-following') ?? 318) || 0))) } catch { return '318' } })
  const [mateStoryCaption, setMateStoryCaption] = useState(() => { try { return window.localStorage.getItem('mate-story-caption') ?? 'un mate antes de salir 🧉' } catch { return 'un mate antes de salir 🧉' } })
  const [halloweenStoryCaption, setHalloweenStoryCaption] = useState(() => { try { return window.localStorage.getItem('halloween-story-caption') ?? 'noche de halloween 🎃' } catch { return 'noche de halloween 🎃' } })
  const [friendsStoryCaption, setFriendsStoryCaption] = useState(() => { try { return window.localStorage.getItem('friends-story-caption') ?? '🖤' } catch { return '🖤' } })
  const [instagramStoryHighlightText, setInstagramStoryHighlightText] = useState(() => { try { return window.localStorage.getItem('instagram-story-highlight-text') ?? 'Historia' } catch { return 'Historia' } })
  const [musicTitle, setMusicTitle] = useState(() => { try { return window.localStorage.getItem('music-title') ?? 'Fade Into You' } catch { return 'Fade Into You' } })
  const [musicArtist, setMusicArtist] = useState(() => { try { return window.localStorage.getItem('music-artist') ?? 'Mazzy Star' } catch { return 'Mazzy Star' } })
  const [musicDuration, setMusicDuration] = useState(() => { try { return window.localStorage.getItem('music-duration') ?? '4:55' } catch { return '4:55' } })
  const [mailDurationSeconds, setMailDurationSeconds] = useState(() => {
    try {
      const saved = Number(window.localStorage.getItem('assistant-mail-duration-seconds'))
      return Number.isFinite(saved) && saved >= 1 ? String(Math.min(saved, 60)) : '7'
    } catch { return '7' }
  })
  const [mailNotificationDelaySeconds, setMailNotificationDelaySeconds] = useState(() => {
    try {
      const stored = window.localStorage.getItem('mail-notification-delay-seconds')
      const saved = stored === null ? NaN : Number(stored)
      return Number.isFinite(saved) && saved >= 0 ? String(Math.min(saved, 60)) : '1.8'
    } catch { return '1.8' }
  })
  const [attachmentLoadingSeconds, setAttachmentLoadingSeconds] = useState(() => {
    try {
      const stored = window.localStorage.getItem('attachment-loading-seconds')
      const saved = stored === null ? NaN : Number(stored)
      return Number.isFinite(saved) && saved >= 0 ? String(Math.min(saved, 60)) : '1.6'
    } catch { return '1.6' }
  })
  const [projectDatabaseReady, setProjectDatabaseReady] = useState(false)

  useEffect(() => {
    const refreshOfflineAssets = () => setOfflineAssetRevision((revision) => revision + 1)
    window.addEventListener('offline-assets-changed', refreshOfflineAssets)
    loadOfflineAssets().catch(() => {})
    return () => window.removeEventListener('offline-assets-changed', refreshOfflineAssets)
  }, [])

  useEffect(() => {
    let cancelled = false
    const fallbackSettings = {
      productionDate,
      clockTime,
      showPhoneStatusBar,
      phoneStatusBarConfigured,
      julianPhone,
      instagramDisplayName,
      instagramUsername,
      instagramBio,
      instagramFollowers: Number(instagramFollowers) || 0,
      instagramFollowing: Number(instagramFollowing) || 0,
      mateStoryCaption,
      halloweenStoryCaption,
      friendsStoryCaption,
      instagramStoryHighlightText,
      musicTitle,
      musicArtist,
      musicDuration,
      mailDurationSeconds: Number(mailDurationSeconds) || 7,
      mailNotificationDelaySeconds: Number.isFinite(Number(mailNotificationDelaySeconds)) ? Number(mailNotificationDelaySeconds) : 1.8,
      attachmentLoadingSeconds: Number.isFinite(Number(attachmentLoadingSeconds)) ? Number(attachmentLoadingSeconds) : 1.6,
      julianContactName: (() => { try { return window.localStorage.getItem('julian-contact-name') || '' } catch { return '' } })(),
    }
    const databaseRequest = cloudConfigured ? getCloudState() : fetch('/__asset-manager/db').then((response) => {
      if (!response.ok) throw new Error('Database unavailable')
      return response.json()
    })
    databaseRequest.then((database) => {
      if (cancelled) return
      const saved = database.settings || {}
      const missingSettings = {}
      const apply = (key, value, setValue, localKey = key) => {
        if (Object.prototype.hasOwnProperty.call(saved, key)) {
          setValue(String(saved[key]))
          try { window.localStorage.setItem(localKey, String(saved[key])) } catch {}
        } else missingSettings[key] = fallbackSettings[key]
      }
      apply('productionDate', saved.productionDate ?? fallbackSettings.productionDate, setProductionDate, 'production-date')
      apply('clockTime', saved.clockTime ?? fallbackSettings.clockTime, setClockTime, 'production-clock-time')
      if (saved.phoneStatusBarConfigured === 'true') {
        apply('showPhoneStatusBar', saved.showPhoneStatusBar ?? 'false', setShowPhoneStatusBar, 'show-phone-status-bar')
        apply('phoneStatusBarConfigured', 'true', setPhoneStatusBarConfigured, 'phone-status-bar-configured')
      } else {
        setShowPhoneStatusBar('false')
        setPhoneStatusBarConfigured('false')
        try {
          window.localStorage.setItem('show-phone-status-bar', 'false')
          window.localStorage.setItem('phone-status-bar-configured', 'false')
        } catch {}
        missingSettings.showPhoneStatusBar = 'false'
        missingSettings.phoneStatusBarConfigured = 'false'
      }
      apply('julianPhone', saved.julianPhone ?? fallbackSettings.julianPhone, setJulianPhone, 'julian-phone')
      apply('instagramDisplayName', saved.instagramDisplayName ?? fallbackSettings.instagramDisplayName, setInstagramDisplayName, 'instagram-display-name')
      apply('instagramUsername', saved.instagramUsername ?? fallbackSettings.instagramUsername, setInstagramUsername, 'instagram-username')
      apply('instagramBio', saved.instagramBio ?? fallbackSettings.instagramBio, setInstagramBio, 'instagram-bio')
      apply('instagramFollowers', saved.instagramFollowers ?? fallbackSettings.instagramFollowers, setInstagramFollowers, 'instagram-followers')
      apply('instagramFollowing', saved.instagramFollowing ?? fallbackSettings.instagramFollowing, setInstagramFollowing, 'instagram-following')
      apply('mateStoryCaption', saved.mateStoryCaption ?? fallbackSettings.mateStoryCaption, setMateStoryCaption, 'mate-story-caption')
      apply('halloweenStoryCaption', saved.halloweenStoryCaption ?? fallbackSettings.halloweenStoryCaption, setHalloweenStoryCaption, 'halloween-story-caption')
      apply('friendsStoryCaption', saved.friendsStoryCaption ?? fallbackSettings.friendsStoryCaption, setFriendsStoryCaption, 'friends-story-caption')
      apply('instagramStoryHighlightText', saved.instagramStoryHighlightText ?? fallbackSettings.instagramStoryHighlightText, setInstagramStoryHighlightText, 'instagram-story-highlight-text')
      apply('musicTitle', saved.musicTitle ?? fallbackSettings.musicTitle, setMusicTitle, 'music-title')
      apply('musicArtist', saved.musicArtist ?? fallbackSettings.musicArtist, setMusicArtist, 'music-artist')
      apply('musicDuration', saved.musicDuration ?? fallbackSettings.musicDuration, setMusicDuration, 'music-duration')
      if (Object.prototype.hasOwnProperty.call(saved, 'mailDurationSeconds')) {
        const value = String(Math.min(60, Math.max(1, Number(saved.mailDurationSeconds) || 7)))
        setMailDurationSeconds(value)
        try { window.localStorage.setItem('assistant-mail-duration-seconds', value) } catch {}
      } else missingSettings.mailDurationSeconds = fallbackSettings.mailDurationSeconds
      if (Object.prototype.hasOwnProperty.call(saved, 'mailNotificationDelaySeconds')) {
        const value = String(Math.min(60, Math.max(0, Number(saved.mailNotificationDelaySeconds) || 0)))
        setMailNotificationDelaySeconds(value)
        try { window.localStorage.setItem('mail-notification-delay-seconds', value) } catch {}
      } else missingSettings.mailNotificationDelaySeconds = fallbackSettings.mailNotificationDelaySeconds
      if (Object.prototype.hasOwnProperty.call(saved, 'attachmentLoadingSeconds')) {
        const value = String(Math.min(60, Math.max(0, Number(saved.attachmentLoadingSeconds) || 0)))
        setAttachmentLoadingSeconds(value)
        try { window.localStorage.setItem('attachment-loading-seconds', value) } catch {}
      } else missingSettings.attachmentLoadingSeconds = fallbackSettings.attachmentLoadingSeconds
      if (Object.prototype.hasOwnProperty.call(saved, 'julianContactName')) {
        try {
          if (saved.julianContactName) window.localStorage.setItem('julian-contact-name', String(saved.julianContactName))
          else window.localStorage.removeItem('julian-contact-name')
        } catch {}
      } else missingSettings.julianContactName = fallbackSettings.julianContactName
      if (Object.keys(missingSettings).length) {
        if (cloudConfigured) saveCloudSettings(missingSettings).catch(() => {})
        else fetch('/__asset-manager/db/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(missingSettings) }).catch(() => {})
      }
      setProjectDatabaseReady(true)
    }).catch(() => { if (!cancelled) setProjectDatabaseReady(true) })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!projectDatabaseReady) return undefined
    const settings = { productionDate, clockTime, showPhoneStatusBar, phoneStatusBarConfigured, julianPhone, instagramDisplayName, instagramUsername, instagramBio, instagramFollowers: Number(instagramFollowers) || 0, instagramFollowing: Number(instagramFollowing) || 0, mateStoryCaption, halloweenStoryCaption, friendsStoryCaption, instagramStoryHighlightText, musicTitle, musicArtist, musicDuration, mailDurationSeconds: Number(mailDurationSeconds) || 7, mailNotificationDelaySeconds: Number.isFinite(Number(mailNotificationDelaySeconds)) ? Number(mailNotificationDelaySeconds) : 1.8, attachmentLoadingSeconds: Number.isFinite(Number(attachmentLoadingSeconds)) ? Number(attachmentLoadingSeconds) : 1.6 }
    const timer = window.setTimeout(() => {
      if (cloudConfigured) saveCloudSettings(settings).catch(() => {})
      else fetch('/__asset-manager/db/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) }).catch(() => {})
    }, 300)
    return () => window.clearTimeout(timer)
  }, [projectDatabaseReady, productionDate, clockTime, showPhoneStatusBar, phoneStatusBarConfigured, julianPhone, instagramDisplayName, instagramUsername, instagramBio, instagramFollowers, instagramFollowing, mateStoryCaption, halloweenStoryCaption, friendsStoryCaption, instagramStoryHighlightText, musicTitle, musicArtist, musicDuration, mailDurationSeconds, mailNotificationDelaySeconds, attachmentLoadingSeconds])

  function updateStoredTextSetting(setter, key, value) {
    setter(value)
    try { window.localStorage.setItem(key, value) } catch {}
  }

  function updateClockTime(value) {
    setClockTime(value)
    try { window.localStorage.setItem('production-clock-time', value) } catch {}
  }

  function updateProductionDate(value) {
    setProductionDate(value)
    try { window.localStorage.setItem('production-date', value) } catch {}
  }

  function updateJulianPhone(value) {
    setJulianPhone(value)
    try { window.localStorage.setItem('julian-phone', value) } catch {}
  }

  function updateInstagramBio(value) {
    setInstagramBio(value)
    try { window.localStorage.setItem('instagram-bio', value) } catch {}
  }

  function updateInstagramProfileText(setter, key, value) {
    setter(value)
    try { window.localStorage.setItem(key, value) } catch {}
  }

  function updateInstagramCount(setter, key, value) {
    const count = value === '' ? '' : String(Math.max(0, Math.floor(Number(value) || 0)))
    setter(count)
    try { window.localStorage.setItem(key, count) } catch {}
  }

  function updateMailDurationSeconds(value) {
    setMailDurationSeconds(value)
    const seconds = Number(value)
    if (value === '' || !Number.isFinite(seconds) || seconds < 1) return
    const boundedSeconds = Math.min(Math.round(seconds), 60)
    setMailDurationSeconds(String(boundedSeconds))
    try { window.localStorage.setItem('assistant-mail-duration-seconds', String(boundedSeconds)) } catch {}
  }

  function updateMailNotificationDelaySeconds(value) {
    setMailNotificationDelaySeconds(value)
    const seconds = Number(value)
    if (value === '' || !Number.isFinite(seconds) || seconds < 0) return
    const boundedSeconds = Math.min(seconds, 60)
    setMailNotificationDelaySeconds(String(boundedSeconds))
    try { window.localStorage.setItem('mail-notification-delay-seconds', String(boundedSeconds)) } catch {}
  }

  function updateAttachmentLoadingSeconds(value) {
    setAttachmentLoadingSeconds(value)
    const seconds = Number(value)
    if (value === '' || !Number.isFinite(seconds) || seconds < 0) return
    const boundedSeconds = Math.min(seconds, 60)
    setAttachmentLoadingSeconds(String(boundedSeconds))
    try { window.localStorage.setItem('attachment-loading-seconds', String(boundedSeconds)) } catch {}
  }

  useEffect(() => {
    const onPopState = () => {
      const nextPath = window.location.pathname
      setPath(nextPath)
      if (!nextPath.startsWith('/mobile/') && document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {})
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  function navigate(nextPath) {
    const isMobileView = nextPath.startsWith('/mobile/')
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.matchMedia('(display-mode: fullscreen)').matches || navigator.standalone === true
    if (isMobileView && config.autoFullscreen && window.matchMedia('(pointer: coarse)').matches && !isIOSDevice && !isStandalone && !document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen({ navigationUI: 'hide' }).catch(() => {})
    } else if (!isMobileView && document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {})
    }
    window.history.pushState({}, '', nextPath)
    setPath(nextPath)
    window.scrollTo(0, 0)
  }

  const storyCaptionById = { mate: mateStoryCaption, halloween: halloweenStoryCaption, friends: friendsStoryCaption }
  const instagramStories = storyData.map((story) => ({ ...story, caption: storyCaptionById[story.id] ?? story.caption }))
  if (path === '/mobile/esc3-p2') return <MobileAIChat onHome={() => navigate('/')} clockTime={clockTime} showPhoneStatusBar={showPhoneStatusBar === 'true'} />
  const selected = scenes.find((scene) => scene.path === path)
  if (julianChatScenePaths.includes(path)) return <WhatsAppChat onHome={() => navigate('/')} contactPhone={julianPhone} contactAvatar={assets.julianWhatsappAvatar} showPhoneStatusBar={showPhoneStatusBar === 'true'} />
  if (selected) {
    if (selected.path === '/notebook/esc1a-p2') return <DesktopView onHome={() => navigate('/')} wallpaperUrl={assets.desktopWallpaper} clockTime={clockTime} musicTitle={musicTitle} musicArtist={musicArtist} musicDuration={musicDuration} />
    if (selected.path === '/notebook/esc1g-p2') return <MailDesktopScene onHome={() => navigate('/')} clockTime={clockTime} mailBadgeDelayMs={(Number(mailNotificationDelaySeconds) || 0) * 1000} attachmentLoadingMs={(Number(attachmentLoadingSeconds) || 0) * 1000} />
    if (selected.path === '/notebook/esc3-p2') return <MailToAssistantScene onHome={() => navigate('/')} wallpaperUrl={assets.desktopWallpaper} mailDurationMs={(Number(mailDurationSeconds) || 7) * 1000} attachmentLoadingMs={(Number(attachmentLoadingSeconds) || 0) * 1000} clockTime={clockTime} />
    if (selected.path === '/mobile/esc1b-p3') return <InstagramStory onHome={() => navigate('/')} username={instagramUsername} displayName={instagramDisplayName} avatarUrl={assets.julianInstagramAvatar} stories={instagramStories} highlightText={instagramStoryHighlightText} clockTime={clockTime} bio={instagramBio} followers={instagramFollowers} following={instagramFollowing} showPhoneStatusBar={showPhoneStatusBar === 'true'} />
    if (selected.path === '/mobile/esc1c-p1') return <LockScreen onHome={() => navigate('/')} wallpaperUrl={assets.mobileWallpaper} clockTime={clockTime} productionDate={productionDate} showPhoneStatusBar={showPhoneStatusBar === 'true'} />
    if (selected.path === '/mobile/esc1c-p5') return <LockScreen onHome={() => navigate('/')} clockTime={clockTime} productionDate={productionDate} showPhoneStatusBar={showPhoneStatusBar === 'true'} notificationDelayMs={5000} notificationStaggerMs={900} notifications={[
      { id: 'unknown-1', title: julianPhone, message: 'Hola, estas?', time: 'ahora', kind: 'whatsapp' },
      { id: 'unknown-2', title: julianPhone, message: 'estas bien?', time: 'ahora', kind: 'whatsapp' },
    ]} wallpaperUrl={assets.mobileWallpaper} />
    if (selected.path === '/mobile/esc1a-p1') return <MobileAIChat onHome={() => navigate('/')} clockTime={clockTime} showPhoneStatusBar={showPhoneStatusBar === 'true'} />
    if (selected.path === '/mobile/esc1g-p11') return <WhatsAppChat onHome={() => navigate('/')} contactPhone={julianPhone} contactAvatar={assets.julianWhatsappAvatar} showPhoneStatusBar={showPhoneStatusBar === 'true'} initialMessages={fullJulianConversation} interactive={false} showComposer />
    if (selected.path === '/mobile/esc1g-p12') return <WhatsAppChat onHome={() => navigate('/')} contactPhone={julianPhone} contactAvatar={assets.julianWhatsappAvatar} showPhoneStatusBar={showPhoneStatusBar === 'true'} initialMessages={fullJulianConversation} interactive={false} showComposer dynamicReplay />
    if (selected.path === '/mobile/esc1g-p10') {
      let callerName = julianPhone
      try { callerName = window.localStorage.getItem('julian-contact-name')?.trim() || julianPhone } catch {}
      return <IncomingCall onHome={() => navigate('/')} callerName={callerName} callerSubtext="Llamada entrante" avatarUrl={assets.julianWhatsappAvatar} clockTime={clockTime} showPhoneStatusBar={showPhoneStatusBar === 'true'} />
    }
    return <ScenePlaceholder scene={selected} onHome={() => navigate('/')} />
  }

  const isIOSDeviceForInstallHint = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const isStandaloneForInstallHint = window.matchMedia('(display-mode: standalone)').matches || window.matchMedia('(display-mode: fullscreen)').matches || navigator.standalone === true

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="/" onClick={(event) => { event.preventDefault(); navigate('/') }}>
          <span className="brand-mark">ID</span><span>UTILERÍA DIGITAL <i>/</i> INVISIBLE</span>
        </a>
        <span className="offline"><span /> LISTO PARA SET</span>
      </header>
      {isIOSDeviceForInstallHint && !isStandaloneForInstallHint && <aside className="ios-install-hint"><strong>¿Querés abrirla sin la barra de Safari?</strong><span>En Safari, tocá Compartir → Añadir a pantalla de inicio y activá “Abrir como app”. Después abrila desde el nuevo ícono.</span></aside>}

      <section className="scene-section">
        <div className="section-heading">
          <div><p className="eyebrow">ACCESO RÁPIDO</p><h2>Escenas y planos</h2></div>
        </div>
        <div className="scene-groups">{['Notebook', 'Celular'].map((device) => {
          const deviceScenes = scenes.filter((scene) => scene.device === device)
          return <section className="scene-group" key={device} aria-labelledby={`scene-group-${device.toLowerCase()}`}>
            <div className="scene-group-heading"><h3 id={`scene-group-${device.toLowerCase()}`}>{device}</h3><span>{deviceScenes.length} {deviceScenes.length === 1 ? 'vista' : 'vistas'}</span></div>
            <div className="scene-grid">{deviceScenes.map((scene, index) => (
              <button className="scene-card" key={scene.path} onClick={() => navigate(scene.path)}>
                <span className="card-top"><span className={`device-icon ${scene.device === 'Celular' ? 'phone' : ''}`}>{scene.device === 'Celular' ? '▯' : '▱'}</span><span className="card-index">{String(index + 1).padStart(2, '0')}</span></span>
                <span className="scene-code">{scene.code}<span>, </span>{scene.shot}</span>
                <span className="scene-title">{scene.title}</span>
                <span className="card-bottom"><span>ABRIR</span><span className="arrow">↗</span></span>
              </button>
            ))}</div>
          </section>
        })}</div>
      </section>
      <section className="clock-tool" aria-label="Personalizar horario">
        <div className="clock-tool-heading"><p className="eyebrow">CONFIGURACIÓN</p><h2>Fecha y hora de las pantallas</h2><p>Se aplican a los relojes y la fecha del celular. Las marcas dentro de los mensajes no cambian.</p></div>
        <div className="clock-tool-fields"><label><span>Fecha</span><input type="date" value={productionDate} onChange={(event) => updateProductionDate(event.target.value)} /></label><label><span>Hora</span><input type="time" value={clockTime} onChange={(event) => updateClockTime(event.target.value)} /></label></div>
        <label className="phone-status-toggle"><input type="checkbox" checked={showPhoneStatusBar === 'true'} onChange={(event) => { const value = event.target.checked ? 'true' : 'false'; updateStoredTextSetting(setShowPhoneStatusBar, 'show-phone-status-bar', value); updateStoredTextSetting(setPhoneStatusBarConfigured, 'phone-status-bar-configured', 'true') }} /><span>Mostrar barra superior en las pantallas de celular</span></label>
      </section>
      <section className="project-text-tool computer-data-tool" aria-label="Datos de la computadora">
        <div><p className="eyebrow">COMPUTADORA</p><h2>Datos de la computadora</h2></div>
        <div className="computer-data-groups">
          <section className="computer-data-group" aria-label="Tiempos de correo y video">
            <h3>Tiempos de correo y video</h3>
            <p>Ajustá cuánto tarda en aparecer el aviso del correo, cuánto queda abierto antes de pasar a la IA y cuánto dura el mensaje «Cargando video adjunto…».</p>
            <div className="clock-tool-fields"><label><span>Segundos antes de mostrar la IA</span><input type="number" min="1" max="60" step="1" value={mailDurationSeconds} onChange={(event) => updateMailDurationSeconds(event.target.value)} /></label><label><span>Demora de notificación del correo (segundos)</span><input type="number" min="0" max="60" step="0.1" value={mailNotificationDelaySeconds} onChange={(event) => updateMailNotificationDelaySeconds(event.target.value)} /></label><label><span>Carga del video adjunto (segundos)</span><input type="number" min="0" max="60" step="0.1" value={attachmentLoadingSeconds} onChange={(event) => updateAttachmentLoadingSeconds(event.target.value)} /></label></div>
          </section>
          <section className="computer-data-group" aria-label="Información de la canción">
            <h3>Reproductor de música</h3>
            <div className="project-text-tool-fields">
              <label><span>Nombre de la canción</span><input type="text" value={musicTitle} onChange={(event) => updateStoredTextSetting(setMusicTitle, 'music-title', event.target.value)} /></label>
              <label><span>Intérprete</span><input type="text" value={musicArtist} onChange={(event) => updateStoredTextSetting(setMusicArtist, 'music-artist', event.target.value)} /></label>
              <label><span>Duración (m:ss)</span><input type="text" inputMode="numeric" placeholder="4:55" value={musicDuration} onChange={(event) => updateStoredTextSetting(setMusicDuration, 'music-duration', event.target.value)} /></label>
            </div>
          </section>
        </div>
      </section>
      <section className="project-text-tool" aria-label="Datos de Julián">
        <div><p className="eyebrow">CELULAR</p><h2>Datos de Julián</h2></div>
        <div className="profile-settings-groups">
          <div className="profile-settings-group">
            <h3>Instagram</h3>
            <div className="project-text-tool-fields">
              <label><span>Nombre</span><input type="text" value={instagramDisplayName} onChange={(event) => updateInstagramProfileText(setInstagramDisplayName, 'instagram-display-name', event.target.value)} /></label>
              <label><span>Usuario</span><input type="text" value={instagramUsername} placeholder="julian.v" onChange={(event) => updateInstagramProfileText(setInstagramUsername, 'instagram-username', event.target.value)} /></label>
              <label><span>Biografía</span><input type="text" value={instagramBio} onChange={(event) => updateInstagramBio(event.target.value)} /></label>
              <label><span>Seguidores</span><input type="number" min="0" step="1" value={instagramFollowers} onChange={(event) => updateInstagramCount(setInstagramFollowers, 'instagram-followers', event.target.value)} /></label>
              <label><span>Usuarios que sigue</span><input type="number" min="0" step="1" value={instagramFollowing} onChange={(event) => updateInstagramCount(setInstagramFollowing, 'instagram-following', event.target.value)} /></label>
              <label><span>Historia 1 · texto opcional</span><input type="text" value={mateStoryCaption} placeholder="Vacío para ocultar" onChange={(event) => updateStoredTextSetting(setMateStoryCaption, 'mate-story-caption', event.target.value)} /></label>
              <label><span>Historia 2 · texto opcional</span><input type="text" value={halloweenStoryCaption} placeholder="Vacío para ocultar" onChange={(event) => updateStoredTextSetting(setHalloweenStoryCaption, 'halloween-story-caption', event.target.value)} /></label>
              <label><span>Historia 3 · texto opcional</span><input type="text" value={friendsStoryCaption} placeholder="Vacío para ocultar" onChange={(event) => updateStoredTextSetting(setFriendsStoryCaption, 'friends-story-caption', event.target.value)} /></label>
              <label><span>Nombre de la destacada · opcional</span><input type="text" value={instagramStoryHighlightText} placeholder="Vacío para ocultar" onChange={(event) => updateStoredTextSetting(setInstagramStoryHighlightText, 'instagram-story-highlight-text', event.target.value)} /></label>
            </div>
          </div>
          <div className="profile-settings-group">
            <h3>WhatsApp</h3>
            <div className="project-text-tool-fields">
              <label><span>Número</span><input type="text" value={julianPhone} onChange={(event) => updateJulianPhone(event.target.value)} /></label>
            </div>
          </div>
        </div>
      </section>
      <AssetUploadSection />
      <footer><span>INVISIBLE <i>·</i> UTILERÍA DIGITAL</span><span>HERRAMIENTAS DE RODAJE <b>01 / 01</b></span></footer>
    </main>
  )
}

function DesktopView({ onHome, wallpaperUrl = '', showMusic = true, autoOpenAssistant = false, autoOpenAssistantDelayMs = 5000, onOpenMail = null, showMailBadge = true, mailBadgeDelayMs = 1500, clockTime = '09:41', musicTitle = 'Fade Into You', musicArtist = 'Mazzy Star', musicDuration = '4:55' }) {
  const [wallpaperFailed, setWallpaperFailed] = useState(false)
  const [playing, setPlaying] = useState(true)
  const [musicPosition, setMusicPosition] = useState(0)
  const [isSeekingMusic, setIsSeekingMusic] = useState(false)
  const [selectedDesktopIcon, setSelectedDesktopIcon] = useState('')
  const [isMusicMinimized, setIsMusicMinimized] = useState(false)
  const [isMusicClosed, setIsMusicClosed] = useState(false)
  const [isMusicZoomed, setIsMusicZoomed] = useState(false)
  const [assistantWindowOpen, setAssistantWindowOpen] = useState(false)
  const [assistantWindowZoomed, setAssistantWindowZoomed] = useState(false)
  const [assistantWindowPosition, setAssistantWindowPosition] = useState(null)
  const [mailBadgeVisible, setMailBadgeVisible] = useState(false)
  const [widgetPosition, setWidgetPosition] = useState(null)
  const [isDraggingWidget, setIsDraggingWidget] = useState(false)
  const widgetDragRef = useRef(null)
  const assistantDragRef = useRef(null)
  const musicDurationParts = /^\s*(\d+):([0-5]?\d)\s*$/.exec(musicDuration)
  const musicDurationSeconds = musicDurationParts ? Number(musicDurationParts[1]) * 60 + Number(musicDurationParts[2]) : 0
  const safeMusicDuration = Math.max(1, musicDurationSeconds)
  const formatMusicTime = (seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`

  useEffect(() => {
    if (!playing || isSeekingMusic) return undefined
    const timer = window.setInterval(() => setMusicPosition((position) => Math.min(position + 1, safeMusicDuration)), 1000)
    return () => window.clearInterval(timer)
  }, [playing, isSeekingMusic, safeMusicDuration])

  useEffect(() => {
    setMusicPosition((position) => Math.min(position, safeMusicDuration))
  }, [safeMusicDuration])

  useEffect(() => {
    if (musicPosition >= safeMusicDuration) setPlaying(false)
  }, [musicPosition, safeMusicDuration])

  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === 'Escape') { if (assistantWindowOpen) setAssistantWindowOpen(false); else onHome() } }
    window.addEventListener('keydown', onKeyDown)
    return () => { window.removeEventListener('keydown', onKeyDown) }
  }, [onHome, assistantWindowOpen])

  useEffect(() => {
    if (!onOpenMail || !showMailBadge) {
      setMailBadgeVisible(false)
      return undefined
    }
    const timer = window.setTimeout(() => setMailBadgeVisible(true), mailBadgeDelayMs)
    return () => window.clearTimeout(timer)
  }, [onOpenMail, showMailBadge, mailBadgeDelayMs])

  useEffect(() => {
    if (!autoOpenAssistant) return undefined
    const timer = window.setTimeout(() => setAssistantWindowOpen(true), autoOpenAssistantDelayMs)
    return () => window.clearTimeout(timer)
  }, [autoOpenAssistant, autoOpenAssistantDelayMs])

  function startWidgetDrag(event) {
    if (isMusicZoomed) return
    if (event.target.closest('button, input, .track-progress, .music-window-controls')) return
    const screen = event.currentTarget.closest('.desktop-screen')
    const screenRect = screen.getBoundingClientRect()
    const widgetRect = event.currentTarget.getBoundingClientRect()
    const x = widgetPosition?.x ?? widgetRect.left - screenRect.left
    const y = widgetPosition?.y ?? widgetRect.top - screenRect.top
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    widgetDragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, x, y, screenWidth: screenRect.width, screenHeight: screenRect.height, widgetWidth: widgetRect.width, widgetHeight: widgetRect.height }
    setWidgetPosition({ x, y })
    setIsDraggingWidget(true)
  }

  function moveWidget(event) {
    const drag = widgetDragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    const x = Math.max(8, Math.min(drag.screenWidth - drag.widgetWidth - 8, drag.x + event.clientX - drag.startX))
    const y = Math.max(35, Math.min(drag.screenHeight - drag.widgetHeight - 12, drag.y + event.clientY - drag.startY))
    setWidgetPosition({ x, y })
  }

  function endWidgetDrag(event) {
    if (widgetDragRef.current?.pointerId !== event.pointerId) return
    widgetDragRef.current = null
    setIsDraggingWidget(false)
  }

  function startAssistantDrag(event) {
    if (event.target.closest('button')) return
    const terminal = event.currentTarget.closest('.terminal-screen')
    const screen = event.currentTarget.closest('.desktop-screen')
    const screenRect = screen.getBoundingClientRect()
    const terminalRect = terminal.getBoundingClientRect()
    const x = assistantWindowPosition?.x ?? terminalRect.left - screenRect.left
    const y = assistantWindowPosition?.y ?? terminalRect.top - screenRect.top
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    assistantDragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, x, y, screenWidth: screenRect.width, screenHeight: screenRect.height, windowWidth: terminalRect.width, windowHeight: terminalRect.height }
    setAssistantWindowPosition({ x, y })
  }

  function moveAssistantWindow(event) {
    const drag = assistantDragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    const x = Math.max(8, Math.min(drag.screenWidth - drag.windowWidth - 8, drag.x + event.clientX - drag.startX))
    const y = Math.max(8, Math.min(drag.screenHeight - drag.windowHeight - 8, drag.y + event.clientY - drag.startY))
    setAssistantWindowPosition({ x, y })
  }

  function endAssistantDrag(event) {
    if (assistantDragRef.current?.pointerId !== event.pointerId) return
    assistantDragRef.current = null
  }

  function openMusic() {
    setSelectedDesktopIcon('Música')
    setIsMusicClosed(false)
    setIsMusicMinimized(false)
  }

  function openAssistant() {
    setAssistantWindowOpen(true)
  }

  return <main className="desktop-screen">
    <div className={`desktop-wallpaper${wallpaperUrl && !wallpaperFailed ? ' has-wallpaper-photo' : ''}`}>{wallpaperUrl && !wallpaperFailed && <FlexibleAssetImage className="desktop-wallpaper-photo" src={wallpaperUrl} alt="" onError={() => setWallpaperFailed(true)} />}</div>
    <div className="desktop-menu"><span className="power-mark"><Power size={11} strokeWidth={2.4} aria-hidden="true" /></span><strong>Finder</strong><span>Archivo</span><span>Edición</span><span>Visualización</span><span>Ir</span><span>Ventana</span><span>Ayuda</span><div className="menu-spacer" /><div className="menu-status-icons"><span title="Buscar" aria-label="Buscar"><Search /></span><span title="Protección activa" aria-label="Protección activa"><ShieldCheck /></span><span title="Batería" aria-label="Batería"><BatteryFull /></span><span title="Wi-Fi" aria-label="Wi-Fi"><Wifi /></span></div><span>{clockTime}</span></div>
    <div className="desktop-icons"><button className={`desktop-icon${selectedDesktopIcon === 'Proyectos' ? ' selected' : ''}`} onClick={() => setSelectedDesktopIcon('Proyectos')} aria-label="Proyectos"><span><FolderOpen size={35} strokeWidth={1.4} /></span><small>Proyectos</small></button><button className={`desktop-icon${selectedDesktopIcon === 'Notas' ? ' selected' : ''}`} onClick={() => setSelectedDesktopIcon('Notas')} aria-label="Notas"><span><StickyNote size={34} strokeWidth={1.4} /></span><small>Notas</small></button><button className={`desktop-icon${selectedDesktopIcon === 'Música' ? ' selected' : ''}`} onClick={() => setSelectedDesktopIcon('Música')} onDoubleClick={openMusic} onKeyDown={(event) => { if (event.key === 'Enter') openMusic() }} aria-label="Música"><span><Music2 size={34} strokeWidth={1.5} /></span><small>Música</small></button></div>
    {showMusic && !isMusicClosed && !isMusicMinimized && <section className={`music-widget${isDraggingWidget ? ' is-dragging' : ''}${isMusicZoomed ? ' is-zoomed' : ''}`} aria-label="Reproductor de música" style={widgetPosition && !isMusicZoomed ? { left: `${widgetPosition.x}px`, top: `${widgetPosition.y}px`, right: 'auto' } : undefined} onPointerDown={startWidgetDrag} onPointerMove={moveWidget} onPointerUp={endWidgetDrag} onPointerCancel={endWidgetDrag}>
      <div className="music-window-controls"><button className="mac-window-control close" aria-label="Cerrar Música" title="Cerrar" onClick={() => { setIsMusicClosed(true); setIsMusicMinimized(false); setIsMusicZoomed(false) }}><X /></button><button className="mac-window-control minimize" aria-label="Minimizar Música" title="Minimizar" onClick={() => setIsMusicMinimized(true)}><Minus /></button><button className="mac-window-control zoom" aria-label={isMusicZoomed ? 'Restaurar ventana de Música' : 'Ampliar ventana de Música'} title={isMusicZoomed ? 'Restaurar' : 'Ampliar'} onClick={() => setIsMusicZoomed((value) => !value)}>{isMusicZoomed ? <Minimize2 /> : <Maximize2 />}</button></div>
      <div className="music-art" aria-label="Símbolo de música"><Music2 aria-hidden="true" strokeWidth={1.8} /></div>
      <div className="music-info"><div className="music-track-heading"><span className="music-track-title">{musicTitle}</span><span className="music-track-separator" aria-hidden="true">•</span><span className="music-track-artist">{musicArtist}</span></div>
        <div className="track-progress"><input aria-label="Posición de la canción" type="range" min="0" max={safeMusicDuration} step="1" value={musicPosition} style={{ '--track-progress': `${(musicPosition / safeMusicDuration) * 100}%` }} onPointerDown={(event) => { event.stopPropagation(); setIsSeekingMusic(true) }} onPointerUp={(event) => { event.stopPropagation(); setIsSeekingMusic(false) }} onPointerCancel={(event) => { event.stopPropagation(); setIsSeekingMusic(false) }} onLostPointerCapture={() => setIsSeekingMusic(false)} onChange={(event) => setMusicPosition(Number(event.target.value))} /></div>
        <div className="track-duration"><span>{formatMusicTime(musicPosition)}</span><span>{musicDurationSeconds ? formatMusicTime(safeMusicDuration) : musicDuration}</span></div>
        <div className="track-controls"><button aria-label="Volver al inicio" title="Volver al inicio" onClick={() => setMusicPosition(0)}><SkipBack /></button><button className="play-button" aria-label={playing ? 'Pausar' : 'Reproducir'} onClick={() => { if (musicPosition >= safeMusicDuration) setMusicPosition(0); setPlaying((value) => !value) }}>{playing ? <Pause /> : <Play />}</button><button aria-label="Ir al final" title="Ir al final" onClick={() => { setMusicPosition(safeMusicDuration); setPlaying(false) }}><SkipForward /></button></div>
      </div>
      <span className="widget-menu">•••</span>
    </section>}
    <div className="dock" aria-label="Dock"><span className="dock-icon dock-finder" title="Finder"><FolderOpen aria-label="Finder" /></span>{onOpenMail ? <button type="button" className="dock-icon dock-mail" title="Correo" aria-label="Abrir Correo" onClick={() => onOpenMail(true)}><Mail aria-hidden="true" />{mailBadgeVisible && <span className="dock-notification-badge">1</span>}</button> : <span className="dock-icon dock-mail" title="Correo"><Mail aria-label="Correo" /></span>}<button type="button" className="dock-icon dock-assistant" title="Asistente IA" aria-label="Abrir Asistente IA" onClick={openAssistant}>◈</button><span className="dock-icon dock-photos" title="Fotos"><Images aria-label="Fotos" /></span><span className="dock-icon dock-settings" title="Configuración"><Settings aria-label="Configuración" /></span></div>
    {assistantWindowOpen && <TypewriterTerminal onHome={() => setAssistantWindowOpen(false)} onWindowMinimize={() => setAssistantWindowOpen(false)} onWindowClose={() => { setAssistantWindowOpen(false); setAssistantWindowPosition(null); setAssistantWindowZoomed(false) }} onWindowZoom={() => setAssistantWindowZoomed((value) => !value)} isWindow isWindowOpening isWindowZoomed={assistantWindowZoomed} windowPosition={assistantWindowPosition} onWindowPointerDown={startAssistantDrag} onWindowPointerMove={moveAssistantWindow} onWindowPointerUp={endAssistantDrag} />}
  </main>
}

function WebmailView({ onHome, onClose = onHome, onMinimize = onHome, onZoom = () => {}, isZoomed = false, autoMinimizeAfterMs = null, attachmentLoadingMs = 1600, initiallyRead = false, senderName = 'JULIÁN', senderEmail = 'julian.v@mail.com', subject = '', attachmentVideoUrl = cloudAssetUrl('/assets/video_01.mp4'), isAttachmentLoading: startsLoading = false, clockTime = '09:41' }) {
  const [attachmentOpen, setAttachmentOpen] = useState(false)
  const [isAttachmentLoading, setIsAttachmentLoading] = useState(startsLoading)
  const [videoUnavailable, setVideoUnavailable] = useState(false)
  const [isJulianRead, setIsJulianRead] = useState(initiallyRead)
  const [windowExit, setWindowExit] = useState('')
  const windowExitTimer = useRef(null)

  function exitWindow(kind) {
    if (windowExit) return
    setWindowExit(kind)
    windowExitTimer.current = window.setTimeout(() => {
      if (kind === 'close') onClose()
      else onMinimize()
    }, 420)
  }

  useEffect(() => () => window.clearTimeout(windowExitTimer.current), [])

  useEffect(() => {
    if (autoMinimizeAfterMs == null) return undefined
    const timer = window.setTimeout(() => exitWindow('minimize'), autoMinimizeAfterMs)
    return () => window.clearTimeout(timer)
  }, [autoMinimizeAfterMs])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (attachmentOpen) setAttachmentOpen(false)
        else onHome()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [attachmentOpen, onHome])

  function openAttachment() {
    setIsJulianRead(true)
    setAttachmentOpen(true)
    setIsAttachmentLoading(true)
    setVideoUnavailable(false)
    window.setTimeout(() => setIsAttachmentLoading(false), Math.max(0, attachmentLoadingMs))
  }

  return <main className={`mail-screen${isZoomed ? ' is-zoomed' : ''}${windowExit ? ` is-${windowExit === 'close' ? 'closing' : 'minimizing'}` : ''}`}>
    <div className="mail-menu"><div className="mail-window-controls"><button type="button" className="mac-window-control close" onClick={() => exitWindow('close')} aria-label="Cerrar Correo" title="Cerrar"><X /></button><button type="button" className="mac-window-control minimize" onClick={() => exitWindow('minimize')} aria-label="Minimizar Correo" title="Minimizar"><Minus /></button><button type="button" className="mac-window-control zoom" onClick={onZoom} aria-label={isZoomed ? 'Restaurar ventana de Correo' : 'Agrandar ventana de Correo'} title={isZoomed ? 'Restaurar' : 'Agrandar'}>{isZoomed ? <Minimize2 /> : <Maximize2 />}</button></div><span className="mail-logo">m</span><strong>Correo</strong><span>Archivo</span><span>Editar</span><span>Ver</span><span>Ventana</span><div className="menu-spacer" /><span>◔</span><span>{clockTime}</span></div>
    <div className="mail-toolbar"><span className="mail-wordmark">buzón<span>.</span></span><label className="mail-search">⌕ <span>Buscar en el correo</span></label><span className="mail-user">M</span></div>
    <div className="mail-layout">
      <aside className="mail-sidebar"><button className="compose-button">＋ <span>Redactar</span></button><div className="mail-folder selected">▣ <span>Recibidos</span>{!isJulianRead && <b>1</b>}</div><div className="mail-folder">☆ <span>Destacados</span></div><div className="mail-folder">◷ <span>Pospuestos</span></div><div className="mail-folder">▤ <span>Enviados</span></div><div className="mail-folder">▱ <span>Borradores</span></div><div className="mail-label-title">ETIQUETAS</div><div className="mail-folder">▰ <span>Personal</span></div></aside>
      <section className={`mail-inbox${attachmentOpen ? ' is-video-open' : ''}`}><div className="inbox-heading"><div><strong>Recibidos</strong><span>{isJulianRead ? 'Todo al día' : '1 mensaje sin leer'}</span></div><span>‹　›</span></div><div className={`mail-row selected${isJulianRead ? ' read' : ' unread'}`} role="button" tabIndex={0} onClick={() => setIsJulianRead(true)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setIsJulianRead(true) } }} aria-label={`${subject || 'sin asunto'}, ${isJulianRead ? 'leído' : 'no leído'}`}>
        {!isJulianRead && <span className="unread-dot" />}<span className="sender-avatar">J</span><div className="mail-row-content"><div className="mail-row-top"><strong>{senderName}</strong><time>09:38</time></div><strong>{subject || '(sin asunto)'}</strong><small>▣ Video adjunto</small></div></div>{promoEmails.map((email, index) => <div className="mail-row read" key={`${email.sender}-${email.subject}-${index}`} role="button" tabIndex={0} onClick={() => {}} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') event.preventDefault() }} aria-label={`${email.subject}, leído`}><span className="sender-avatar" style={{ background: email.color }}>{email.avatar}</span><div className="mail-row-content"><div className="mail-row-top"><strong>{email.sender}</strong><time>{email.time}</time></div><strong>{email.subject}</strong><span>{email.preview}</span></div></div>)}</section>
      <article className="mail-reading"><div className="mail-subject">{subject || '(sin asunto)'} <span>Recibidos ×</span></div><div className="sender-details"><span className="sender-avatar large">J</span><div><strong>{senderName} <span>&lt;{senderEmail}&gt;</span></strong></div><time>09:38</time><div className="mail-message-actions" aria-label="Acciones del correo">▱　⌫　☆　⋮</div></div><button className="attachment-card" onClick={openAttachment}><span className="video-thumb"><i>▶</i><small>VIDEO</small></span><span className="attachment-meta"><strong>video_01.mp4</strong><small>Video adjunto · 24 MB</small></span><span className="attachment-action">↗</span></button><div className="mail-reply"><button>↶　Responder</button><button>⋯　Más</button></div></article>
    </div>
    {attachmentOpen && <div className="video-overlay" role="dialog" aria-modal="true" aria-label="Video adjunto"><div className="video-window"><div className="video-window-bar"><span>video_01.mp4</span><button onClick={() => setAttachmentOpen(false)} aria-label="Cerrar">×</button></div><div className="video-stage">{isAttachmentLoading ? <><span className="loading-spinner" /><p>Cargando video adjunto…</p></> : attachmentVideoUrl && !videoUnavailable ? <video className="attached-video" src={attachmentVideoUrl} controls autoPlay onError={() => setVideoUnavailable(true)} /> : <><div className="video-placeholder-mark">▶</div><p>Vista previa del video</p><small>El archivo de video todavía no está disponible.</small></>}</div></div></div>}
  </main>
}

function MailDesktopScene({ onHome, clockTime = '09:41', mailBadgeDelayMs = 1800, attachmentLoadingMs = 1600 }) {
  const [isMailOpen, setIsMailOpen] = useState(false)
  const [mailNotificationDismissed, setMailNotificationDismissed] = useState(false)
  const [isMailZoomed, setIsMailZoomed] = useState(false)
  function openMail() {
    setMailNotificationDismissed(true)
    setIsMailOpen(true)
  }
  if (isMailOpen) return <WebmailView onHome={onHome} onClose={() => { setIsMailOpen(false); setIsMailZoomed(false) }} onMinimize={() => setIsMailOpen(false)} onZoom={() => setIsMailZoomed((value) => !value)} isZoomed={isMailZoomed} attachmentLoadingMs={attachmentLoadingMs} clockTime={clockTime} />
  return <DesktopView onHome={onHome} wallpaperUrl={assets.desktopWallpaper} showMusic={false} onOpenMail={openMail} showMailBadge={!mailNotificationDismissed} mailBadgeDelayMs={mailBadgeDelayMs} clockTime={clockTime} />
}

function MailToAssistantScene({ onHome, wallpaperUrl, mailDurationMs = 7000, attachmentLoadingMs = 1600, clockTime = '09:41' }) {
  const [mailVisible, setMailVisible] = useState(true)
  const [assistantReady, setAssistantReady] = useState(false)
  const assistantOpenTimer = useRef(null)

  useEffect(() => () => window.clearTimeout(assistantOpenTimer.current), [])

  function minimizeMail() {
    setMailVisible(false)
    assistantOpenTimer.current = window.setTimeout(() => setAssistantReady(true), 1000)
  }

  return <div className="mail-assistant-sequence">
    <div className="mail-assistant-desktop"><DesktopView onHome={onHome} wallpaperUrl={wallpaperUrl} showMusic={false} autoOpenAssistant={assistantReady} autoOpenAssistantDelayMs={0} clockTime={clockTime} /></div>
    {mailVisible && <div className="mail-assistant-cover"><WebmailView onHome={onHome} onClose={onHome} onMinimize={minimizeMail} autoMinimizeAfterMs={mailDurationMs} attachmentLoadingMs={attachmentLoadingMs} initiallyRead clockTime={clockTime} /></div>}
  </div>
}

function TypewriterTerminal({ onHome, lines = terminalLines, typingSpeed = 20, isIncognito = true, isWindow = false, isWindowOpening = false, isWindowZoomed = false, windowPosition = null, onWindowMinimize, onWindowClose, onWindowZoom, onWindowPointerDown, onWindowPointerMove, onWindowPointerUp }) {
  const [currentText, setCurrentText] = useState('')
  const [sequenceIndex, setSequenceIndex] = useState(0)
  const [isThinking, setIsThinking] = useState(true)
  const [isErasing, setIsErasing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [glitchPhase, setGlitchPhase] = useState(0)

  useEffect(() => {
    if (!isWindow) return undefined
    const timers = [
      window.setTimeout(() => setGlitchPhase(1), 180),
      window.setTimeout(() => setGlitchPhase(0), 340),
      window.setTimeout(() => setGlitchPhase(2), 470),
      window.setTimeout(() => setGlitchPhase(0), 700),
    ]
    return () => timers.forEach(window.clearTimeout)
  }, [isWindow])

  useEffect(() => {
    let lineIndex = 0
    let charIndex = 0
    let timer
    const beginLine = () => {
      const line = lines[lineIndex]
      if (!line) return
      charIndex = 0
      setCurrentText('')
      setSequenceIndex(lineIndex)
      setIsThinking(true)
      setIsErasing(false)
      const writeNextCharacter = () => {
        charIndex += 1
        setCurrentText(line.slice(0, charIndex))
        if (charIndex < line.length) timer = window.setTimeout(writeNextCharacter, typingSpeed)
        else if (lineIndex === lines.length - 1) {
          setIsThinking(false)
          setIsComplete(true)
        } else {
          setIsThinking(false)
          const pauseBeforeNextLine = lineIndex >= lines.length - 2 ? 1200 : 850
          timer = window.setTimeout(eraseLine, pauseBeforeNextLine)
        }
      }
      timer = window.setTimeout(writeNextCharacter, 90)
    }
    const eraseLine = () => {
      const line = lines[lineIndex]
      setIsErasing(true)
      const eraseNextCharacter = () => {
        charIndex = Math.max(0, charIndex - 2)
        setCurrentText(line.slice(0, charIndex))
        if (charIndex > 0) timer = window.setTimeout(eraseNextCharacter, 22)
        else {
          setIsErasing(false)
          lineIndex += 1
          timer = window.setTimeout(beginLine, 180)
        }
      }
      eraseNextCharacter()
    }
    timer = window.setTimeout(beginLine, 2000)
    return () => window.clearTimeout(timer)
  }, [lines, typingSpeed])

  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === 'Escape') onHome() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onHome])

  return <main className={`terminal-screen${isWindow ? ' terminal-window-mode' : ''}${isWindowOpening ? ' is-window-opening' : ''}${isWindowZoomed ? ' is-window-zoomed' : ''}`} style={isWindow && windowPosition && !isWindowZoomed ? { left: `${windowPosition.x}px`, top: `${windowPosition.y}px`, transform: 'none' } : undefined}>
    <div className={isWindow ? 'assistant-app-titlebar' : 'browser-chrome'} onPointerDown={isWindow ? onWindowPointerDown : undefined} onPointerMove={isWindow ? onWindowPointerMove : undefined} onPointerUp={isWindow ? onWindowPointerUp : undefined} onPointerCancel={isWindow ? onWindowPointerUp : undefined}><div className="browser-window-controls">{isWindow ? <><button type="button" className="mac-window-control close" aria-label="Cerrar asistente" title="Cerrar" onClick={onWindowClose}><X /></button><button type="button" className="mac-window-control minimize" aria-label="Minimizar asistente" title="Minimizar" onClick={onWindowMinimize}><Minus /></button><button type="button" className="mac-window-control zoom" aria-label={isWindowZoomed ? 'Restaurar asistente' : 'Ampliar asistente'} title={isWindowZoomed ? 'Restaurar' : 'Ampliar'} onClick={onWindowZoom}>{isWindowZoomed ? <Minimize2 /> : <Maximize2 />}</button></> : <><i /><i /><i /></>}</div>{!isWindow && <><div className="browser-tab"><span className="incognito-symbol">◉</span> Nueva pestaña — Incógnito <b>×</b></div><div className="browser-new-tab">＋</div><div className="browser-address"><span>◉</span><span>{isIncognito ? 'Incógnito' : 'Protocolo privado'}</span><span className="address-divider">|</span><span className="address-muted">La actividad de esta ventana no aparecerá...</span><span className="address-menu">⋮</span></div></>}</div>
    {glitchPhase > 0 && <div className={`assistant-glitch-overlay assistant-glitch-phase-${glitchPhase}`} aria-hidden="true"><span>{glitchPhase === 1 ? '0x7F 0xA9 0xF3 0x1C 0x00' : glitchPhase === 2 ? '0xA4 0x7D 0x09 0xC3 0xFF 0x21 0x8E' : '0x3A 0x0F 0xB2 0xE1 0x64'}</span></div>}
    <section className="terminal-content"><div className="terminal-brand"><span className="terminal-emblem">◈</span><div><strong>asistente<span>.</span></strong><small>PROCESO AUTÓNOMO <i>●</i></small></div></div><div className="terminal-rule" />
      <div className="terminal-output assistant-sequence" aria-live="polite"><div className={`assistant-thinking-visual is-thinking${isComplete ? ' is-complete' : ''}`}><span className="assistant-orbit orbit-one"/><span className="assistant-orbit orbit-two"/><span className="assistant-thinking-core">◈</span></div><div className={`assistant-sequence-text${isErasing ? ' is-erasing' : ''}`} aria-live="polite">{currentText}{isThinking && !isErasing && <i className="type-cursor" />}</div><small className="assistant-sequence-counter">{String(Math.min(sequenceIndex + 1, lines.length)).padStart(2, '0')} / {String(lines.length).padStart(2, '0')}</small></div>
      <div className="terminal-footer"><span><i /> CONEXIÓN SEGURA</span><span>IA v.03.17 <b>·</b> LOCAL</span></div></section>
  </main>
}

function AssistantOrb({ compact = false }) {
  return <div className={`assistant-thinking-visual is-thinking mobile-ai-logo${compact ? ' compact' : ''}`} aria-hidden="true"><span className="assistant-orbit orbit-one"/><span className="assistant-orbit orbit-two"/><span className="assistant-thinking-core">◈</span></div>
}

function MobileAIChat({ onHome, clockTime = '09:41', showPhoneStatusBar = true }) {
  const [messages, setMessages] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const [recordingError, setRecordingError] = useState('')
  const recorderRef = useRef(null)
  const streamRef = useRef(null)
  const chunksRef = useRef([])
  const recordTimerRef = useRef(null)
  const recordingStartedAtRef = useRef(0)
  const responseTimerRef = useRef(null)
  const recordedUrlsRef = useRef([])

  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === 'Escape') onHome() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onHome])

  useEffect(() => () => {
    window.clearInterval(recordTimerRef.current)
    window.clearTimeout(responseTimerRef.current)
    if (recorderRef.current) {
      recorderRef.current.ondataavailable = null
      recorderRef.current.onstop = null
      if (recorderRef.current.state !== 'inactive') recorderRef.current.stop()
    }
    streamRef.current?.getTracks().forEach((track) => track.stop())
    recordedUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
  }, [])

  async function startRecording() {
    if (isRecording || isThinking) return
    setRecordingError('')
    try {
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) throw new Error('Este navegador no permite grabar audio.')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = ['audio/mp4;codecs=mp4a.40.2', 'audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find((type) => MediaRecorder.isTypeSupported?.(type))
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      streamRef.current = stream
      recorderRef.current = recorder
      chunksRef.current = []
      recorder.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data) }
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop())
        streamRef.current = null
        window.clearInterval(recordTimerRef.current)
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        if (!blob.size) return
        const audioUrl = URL.createObjectURL(blob)
        recordedUrlsRef.current.push(audioUrl)
        const durationSeconds = Math.max(1, Math.round((Date.now() - recordingStartedAtRef.current) / 1000))
        const duration = `${Math.floor(durationSeconds / 60)}:${String(durationSeconds % 60).padStart(2, '0')}`
        setRecordingSeconds(durationSeconds)
        setMessages((current) => [...current, { id: `martina-voice-${Date.now()}`, sender: 'martina', audioUrl, duration }])
        setIsThinking(true)
        responseTimerRef.current = window.setTimeout(() => {
          setMessages((current) => [...current, { id: `assistant-voice-${Date.now()}`, sender: 'assistant', duration: '0:04', isVisualOnly: true }])
          setIsThinking(false)
        }, 1400)
      }
      recorder.start()
      recordingStartedAtRef.current = Date.now()
      setRecordingSeconds(0)
      setIsRecording(true)
      recordTimerRef.current = window.setInterval(() => setRecordingSeconds((value) => value + 1), 1000)
    } catch (error) {
      setRecordingError(error.message || 'No se pudo iniciar la grabación.')
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
      setIsRecording(false)
    }
  }

  function stopAndSendRecording() {
    if (!isRecording || !recorderRef.current || recorderRef.current.state === 'inactive') return
    setIsRecording(false)
    recorderRef.current.stop()
  }

  const recordingTime = `${String(Math.floor(recordingSeconds / 60)).padStart(2, '0')}:${String(recordingSeconds % 60).padStart(2, '0')}`

  return <main className="mobile-ai-screen">
    <section className="mobile-ai-phone">
      {showPhoneStatusBar && <div className="mobile-ai-status"><span>{clockTime}</span><PhoneStatusIcons /></div>}
      <header className="mobile-ai-header"><button className="mobile-ai-back" onClick={onHome} aria-label="Volver">‹</button><AssistantOrb compact /><div><strong>asistente<span>.</span></strong><small><i /> Disponible</small></div><button className="mobile-ai-menu" aria-label="Opciones">•••</button></header>
      <div className="mobile-ai-messages" aria-live="polite">
        {messages.length === 0 && <div className="mobile-ai-welcome"><AssistantOrb /><strong>asistente<span>.</span></strong><p>Mandá un audio para empezar</p></div>}
        {messages.map((message) => <article className={`mobile-ai-message ${message.sender === 'martina' ? 'from-martina' : 'from-assistant'}`} key={message.id}>
          {message.sender === 'assistant' && <span className="mobile-ai-message-mark">◈</span>}
          <div className="mobile-ai-audio-card"><div className="mobile-ai-audio-heading">{message.sender === 'martina' ? 'MARTINA' : 'ASISTENTE'}</div>{message.sender === 'martina' ? <audio controls preload="metadata" src={message.audioUrl}>Tu navegador no puede reproducir este audio.</audio> : <div className="mobile-ai-static-player" aria-label="Respuesta de audio"><span>▶</span><i>{Array.from({ length: 28 }, (_, index) => <b key={index} style={{ height: `${5 + ((index * 11) % 15)}px` }} />)}</i><small>{message.duration}</small></div>}</div>
        </article>)}
        {isThinking && <div className="mobile-ai-thinking"><AssistantOrb compact /><span>Preparando respuesta…</span></div>}
      </div>
      <div className="mobile-ai-composer">
        {recordingError && <p className="mobile-ai-recording-error" role="alert">{recordingError}</p>}
        <div className={`mobile-ai-recording-bar${isRecording ? ' is-recording' : ''}`}>
          <span>{isRecording ? `Grabando ${recordingTime} · tocá detener para enviar` : 'Tocá el micrófono para grabar'}</span>
          <button className={isRecording ? 'stop-recording' : 'start-recording'} onClick={isRecording ? stopAndSendRecording : startRecording} disabled={isThinking} aria-label={isRecording ? 'Enviar audio grabado' : 'Grabar audio'}>{isRecording ? <Square /> : <Mic />}</button>
        </div>
        <small>Tu audio se guarda en el chat y se puede reproducir desde su mensaje.</small>
      </div>
      <div className="mobile-ai-home-indicator" />
    </section>
  </main>
}

function formatWhatsAppChatText(text, sender) {
  let formatted = text.trim().replace(/\.+$/, '')
  if (sender === 'me') formatted = formatted.toLocaleLowerCase('es-AR')
  else formatted = formatted.replace(/^¿\s*/, '')
  return formatted
}

function WhatsAppMessageBubble({ message, broken = false, onImageError, showTimestamp = true, previewable = false, onClick }) {
  const messageText = message.text || message.transcript
  return <article className={`chat-bubble${previewable ? ' is-previewable' : ''}`} onClick={onClick}>
    {message.audioDuration && !messageText && <div className="chat-audio-note" aria-label={message.sender === 'me' ? 'Nota de voz enviada' : `Nota de voz, ${message.audioDuration}`}><span className="chat-audio-play" aria-hidden="true"><Play /></span><span className="chat-audio-waveform">{Array.from({ length: 22 }, (_, index) => <i key={index} style={{ height: `${7 + ((index * 7) % 14)}px` }} />)}</span>{message.sender !== 'me' && <small>{message.audioDuration}</small>}</div>}
    {message.photoLabel && <div className="chat-image-fallback"><span>▧</span><small>{message.photoLabel}</small></div>}
    {message.image && (broken ? <div className="chat-image-fallback"><span>▧</span><small>{message.imageAlt || 'Imagen compartida'}</small></div> : <FlexibleAssetImage className="chat-image" src={message.image} alt={message.imageAlt || 'Imagen compartida'} onError={onImageError} />)}
    {messageText && <span className="chat-message-text">{formatWhatsAppChatText(messageText, message.sender)}</span>}
    <footer>{showTimestamp && <time>{message.timestamp || '09:43'}</time>}{message.sender === 'me' && <span className={`message-status ${message.status === 'read' ? 'read' : ''}`}>✓✓</span>}</footer>
  </article>
}

function PhoneStatusIcons() {
  return <span className="phone-status-icons" aria-label="Señal, Wi-Fi y batería"><Signal /><Wifi /><BatteryFull /></span>
}

function ChatHistoryPreview({ messages, followingMessages = [], contactName, contactPhone = '+54 9 11 1103-1976', contactAvatar, onClose, showPhoneStatusBar = true }) {
  const [visibleMessages, setVisibleMessages] = useState(messages)
  const [isTyping, setIsTyping] = useState(followingMessages.length > 0)
  const [draft, setDraft] = useState('')

  useEffect(() => {
    if (!followingMessages.length) return undefined
    const timers = []
    let elapsed = 0
    const schedule = (delay, action) => {
      elapsed += delay
      timers.push(window.setTimeout(action, elapsed))
    }
    schedule(900, () => setIsTyping(false))
    schedule(550, () => setIsTyping(true))
    followingMessages.forEach((message, index) => {
      schedule(1100, () => {
        setVisibleMessages((current) => [...current, message])
        setIsTyping(false)
      })
      if (index < followingMessages.length - 1) schedule(550, () => setIsTyping(true))
    })
    return () => timers.forEach(window.clearTimeout)
  }, [followingMessages])

  function sendText() {
    const text = draft.trim()
    if (!text || isTyping) return
    setVisibleMessages((current) => [...current, { id: `preview-me-${Date.now()}`, sender: 'me', text, status: 'read' }])
    setDraft('')
  }

  function sendAudio() {
    if (isTyping) return
    setVisibleMessages((current) => [...current, { id: `preview-audio-${Date.now()}`, sender: 'me', audioDuration: '0:04', status: 'read' }])
  }

  return <div className="chat-preview-overlay">
    <section className={`chat-preview-window${showPhoneStatusBar ? '' : ' status-bar-hidden'}`} aria-label="Chat">
      {showPhoneStatusBar && <div className="chat-status"><span>09:43</span><PhoneStatusIcons /></div>}
      <header className="chat-header"><button className="chat-back-arrow" aria-label="Volver al chat completo" onClick={onClose}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg></button><ChatAvatar contactAvatar={contactAvatar} /><div className="chat-contact"><strong>{contactName || 'Número desconocido'}</strong><small>{contactName ? contactPhone : 'últ. vez hoy a las 09:39'}</small></div><button aria-label="Videollamada"><Video aria-hidden="true" /></button><button aria-label="Llamada"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h3l2 5-2 2a15 15 0 0 0 4 4l2-2 5 2v3c0 1.1-.9 2-2 2C10 19 5 14 5 5c0-1.1.9-2 2-2z"/></svg></button></header>
      <div className="chat-preview-messages">{isTyping && <div className="chat-message-row incoming"><article className="chat-bubble typing-bubble"><span className="typing-dots"><i /><i /><i /></span><span>Escribiendo...</span></article></div>}{[...visibleMessages].reverse().map((message) => <div className={`chat-message-row ${message.sender === 'me' ? 'outgoing' : 'incoming'}`} key={`preview-${message.id}`}><WhatsAppMessageBubble message={message} showTimestamp={Boolean(message.timestamp)} /></div>)}<div className="chat-date-divider">HOY</div></div>
      <div className="chat-composer chat-preview-composer"><button className="composer-add" aria-label="Agregar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button><div className="composer-input"><input className="chat-message-input" aria-label="Mensaje" placeholder="Mensaje" value={draft} disabled={isTyping} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); sendText() } }} /></div><button className="composer-audio" aria-label={draft.trim() ? 'Enviar mensaje' : 'Enviar audio'} disabled={isTyping} onClick={draft.trim() ? sendText : sendAudio}>{draft.trim() ? <Send /> : <Mic />}</button></div>
      <div className="chat-home-indicator" />
    </section>
  </div>
}

function ChatAvatar({ contactAvatar }) {
  const [isOpen, setIsOpen] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  if (!contactAvatar || imageFailed) return <div className="chat-avatar"><span>J</span></div>
  return <>
    <button type="button" className="chat-avatar chat-avatar-button" onClick={() => setIsOpen(true)} aria-label="Ver foto de perfil de Julián"><FlexibleAssetImage src={contactAvatar} alt="" onError={() => setImageFailed(true)} /></button>
    {isOpen && <div className="chat-avatar-lightbox" role="dialog" aria-modal="true" aria-label="Foto de perfil de Julián" onClick={() => setIsOpen(false)}><button type="button" aria-label="Cerrar foto" onClick={() => setIsOpen(false)}>×</button><FlexibleAssetImage src={contactAvatar} alt="Foto de perfil de Julián" onClick={(event) => event.stopPropagation()} /></div>}
  </>
}

function InstagramStory({ onHome, username = 'julian.v', displayName = 'Julián', avatarUrl = '', stories = storyData, durationPerStory = 15, clockTime = '09:41', bio = 'Música, cine y alguna foto de madrugada.', followers = 246, following = 318, highlightText = 'Historia', showPhoneStatusBar = true }) {
  const [storyIndex, setStoryIndex] = useState(0)
  const [isStoryOpen, setIsStoryOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const [zoomScale, setZoomScale] = useState(1)
  const [brokenImages, setBrokenImages] = useState({})
  const progressRef = useRef(0)
  const pointerDownAtRef = useRef(0)
  const activePointersRef = useRef(new Map())
  const pinchStartDistanceRef = useRef(0)
  const pinchStartScaleRef = useRef(1)
  const pinchOccurredRef = useRef(false)
  const gestureDirectionRef = useRef(1)
  const story = stories[storyIndex]

  useEffect(() => {
    if (!isStoryOpen) return undefined
    let animationFrame
    let previousTime
    const advance = (now) => {
      if (!paused && story) {
        if (previousTime == null) previousTime = now
        const delta = now - previousTime
        previousTime = now
        progressRef.current += delta / (durationPerStory * 1000)
        if (progressRef.current >= 1) {
          progressRef.current = 0
          setProgress(0)
          if (storyIndex >= stories.length - 1) {
            setIsStoryOpen(false)
            setStoryIndex(0)
            setZoomScale(1)
          } else setStoryIndex(storyIndex + 1)
        }
        setProgress(progressRef.current)
      } else previousTime = undefined
      animationFrame = window.requestAnimationFrame(advance)
    }
    animationFrame = window.requestAnimationFrame(advance)
    return () => window.cancelAnimationFrame(animationFrame)
  }, [isStoryOpen, paused, durationPerStory, stories.length, storyIndex, story])

  useEffect(() => { setZoomScale(1) }, [storyIndex])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (isStoryOpen) setIsStoryOpen(false)
        else onHome()
      }
      if (isStoryOpen && event.key === 'ArrowRight') changeStory(1)
      if (isStoryOpen && event.key === 'ArrowLeft') changeStory(-1)
      if (isStoryOpen && event.key === ' ') setPaused((value) => !value)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isStoryOpen, onHome, stories.length, storyIndex])

  function changeStory(direction) {
    if (direction > 0 && storyIndex >= stories.length - 1) {
      setIsStoryOpen(false)
      setStoryIndex(0)
      setZoomScale(1)
    } else if (direction < 0 && storyIndex === 0) {
      progressRef.current = 0
      setProgress(0)
      return
    } else setStoryIndex(storyIndex + direction)
    progressRef.current = 0
    setProgress(0)
    setZoomScale(1)
  }

  function storyPointerDown(event) {
    const button = event.target.closest('button')
    if ((button && !button.closest('.story-hit-zones')) || event.target.closest('.story-reply')) return
    event.currentTarget.setPointerCapture?.(event.pointerId)
    const pointers = activePointersRef.current
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
    if (pointers.size === 1) {
      pointerDownAtRef.current = performance.now()
      gestureDirectionRef.current = event.clientX >= event.currentTarget.getBoundingClientRect().left + event.currentTarget.clientWidth / 2 ? 1 : -1
      pinchOccurredRef.current = false
    }
    if (pointers.size >= 2) {
      const [first, second] = [...pointers.values()]
      pinchStartDistanceRef.current = Math.hypot(first.x - second.x, first.y - second.y)
      pinchStartScaleRef.current = zoomScale
      pinchOccurredRef.current = true
    }
    setPaused(true)
  }

  function storyPointerMove(event) {
    const pointers = activePointersRef.current
    if (!pointers.has(event.pointerId)) return
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
    if (pointers.size < 2) return
    const [first, second] = [...pointers.values()]
    const distance = Math.hypot(first.x - second.x, first.y - second.y)
    if (!pinchStartDistanceRef.current) return
    const scale = Math.min(3, Math.max(1, pinchStartScaleRef.current * distance / pinchStartDistanceRef.current))
    setZoomScale(scale)
  }

  function storyPointerUp(event, cancelled = false) {
    const pointers = activePointersRef.current
    if (!pointers.has(event.pointerId)) return
    const wasPinch = pinchOccurredRef.current
    pointers.delete(event.pointerId)
    if (pointers.size > 0) return
    const wasHold = performance.now() - pointerDownAtRef.current >= 250
    pointerDownAtRef.current = 0
    pinchStartDistanceRef.current = 0
    pinchOccurredRef.current = false
    setPaused(false)
    if (!cancelled && !wasPinch && !wasHold) changeStory(gestureDirectionRef.current)
  }

  function cancelStoryPress(event) {
    storyPointerUp(event, true)
  }

  if (!isStoryOpen) return <InstagramProfile username={username} displayName={displayName} avatarUrl={avatarUrl} clockTime={clockTime} bio={bio} followers={followers} following={following} highlightText={highlightText} showPhoneStatusBar={showPhoneStatusBar} onOpenStories={() => { setStoryIndex(0); progressRef.current = 0; setProgress(0); setIsStoryOpen(true) }} onHome={onHome} />
  if (!story) return null
  const isZoomed = zoomScale > 1.02
  const storyImageUrl = brokenImages[story.id] ? '' : story.mediaUrl
  return <main className={`story-screen${isZoomed ? ' story-is-zoomed' : ''}`}>
    <div className={`story-frame${isZoomed ? ' is-zoomed' : ''}`}>
      <div className={`story-media${isZoomed ? ' is-zoomed' : ''}`} style={{ touchAction: 'none' }} onPointerDown={storyPointerDown} onPointerMove={storyPointerMove} onPointerUp={storyPointerUp} onPointerCancel={cancelStoryPress}>
        {storyImageUrl && <img className="story-photo" style={{ transform: `scale(${zoomScale})`, transition: activePointersRef.current.size > 1 ? 'none' : 'transform .2s ease-out' }} src={storyImageUrl.startsWith('/assets/') ? cloudAssetUrl(storyImageUrl) : storyImageUrl} alt={story.caption} onError={() => setBrokenImages((current) => ({ ...current, [story.id]: true }))} />}
        <div className="story-scrim" />
        <div className="story-progress-bars">{stories.map((item, index) => <div className="story-progress-track" key={item.id}><i style={{ width: `${index < storyIndex ? 100 : index === storyIndex ? progress * 100 : 0}%` }} /></div>)}</div>
        <div className="story-account"><div className="story-avatar"><span>J</span>{avatarUrl && <FlexibleAssetImage src={avatarUrl} alt="" onError={(event) => { event.currentTarget.style.display = 'none' }} />}</div><strong>{username}</strong><span>1 h</span><button className="story-menu" aria-label="Más opciones">•••</button></div>
        <div className="story-hit-zones"><button aria-label="Historia anterior" onClick={(event) => { if (event.detail === 0) changeStory(-1) }} /><button aria-label="Siguiente historia" onClick={(event) => { if (event.detail === 0) changeStory(1) }} /></div>
        {story.caption && <div className="story-caption">{story.caption}</div>}
        <div className="story-reply"><span>Enviar mensaje</span><button aria-label="Me gusta">♡</button><button aria-label="Compartir">➤</button></div>
      </div>
      <div className="story-notch" />
    </div>
  </main>
}

function InstagramProfile({ username, displayName = 'Julián', avatarUrl, posts = julianPosts, clockTime = '09:41', bio = 'Música, cine y alguna foto de madrugada.', followers = 246, following = 318, highlightText = 'Historia', onOpenStories, onHome, showPhoneStatusBar = true }) {
  const [isFollowing, setIsFollowing] = useState(true)
  return <main className="story-screen">
    <section className="instagram-profile-frame">
      {showPhoneStatusBar && <div className="instagram-profile-status"><span>{clockTime}</span><PhoneStatusIcons /></div>}
      <header className="instagram-profile-toolbar"><button onClick={onHome} aria-label="Volver"><ArrowLeft /></button><strong>{username}</strong><button aria-label="Opciones"><Menu /></button></header>
      <div className="instagram-profile-content">
        <div className="instagram-profile-summary"><button className="instagram-profile-avatar" onClick={onOpenStories} aria-label="Ver historias de Julián"><span>J{avatarUrl && <FlexibleAssetImage src={avatarUrl} alt="" onError={(event) => { event.currentTarget.style.display = 'none' }} />}</span></button><div className="instagram-profile-stats"><div><span><b>{posts.length}</b> publicaciones</span><span><b>{followers}</b> seguidores</span><span><b>{following}</b> seguidos</span></div></div></div>
        <strong className="instagram-profile-name">{displayName}</strong>
        <p className="instagram-profile-bio">{bio}</p>
        <div className="instagram-profile-actions"><button type="button" className={isFollowing ? 'is-following' : 'is-not-following'} aria-pressed={isFollowing} onClick={() => setIsFollowing((following) => !following)}>{isFollowing ? 'Siguiendo' : 'Seguir'}</button><button>Mensaje</button><button aria-label="Compartir perfil"><Share2 /></button></div>
        <button className="instagram-story-highlight" onClick={onOpenStories} aria-label={highlightText ? `Abrir historia destacada: ${highlightText}` : 'Abrir historias destacadas'}><span aria-hidden="true" />{highlightText && <small>{highlightText}</small>}</button>
        <div className="instagram-profile-tabs"><span aria-label="Publicaciones"><Grid3X3 /></span><span aria-label="Videos"><Clapperboard /></span><span aria-label="Etiquetas"><UserRound /></span></div>
        <div className="instagram-profile-grid">{posts.map((post) => <button key={post.id} aria-label={post.caption}>{post.mediaUrl && <FlexibleAssetImage className="instagram-profile-grid-photo" src={post.mediaUrl} alt={post.caption} onError={(event) => { event.currentTarget.style.display = 'none' }} />}</button>)}</div>
      </div>
      <div className="instagram-profile-bottom"><span aria-label="Inicio"><House /></span><span aria-label="Buscar"><Search /></span><span aria-label="Reels"><Clapperboard /></span></div>
      <div className="instagram-profile-home-indicator" />
    </section>
  </main>
}

function LockScreen({ onHome, wallpaperUrl = '', notifications = [], notificationDelayMs = 0, notificationStaggerMs = 0, clockTime = '', productionDate = '', showPhoneStatusBar = true }) {
  const [now, setNow] = useState(new Date())
  const [cornerTaps, setCornerTaps] = useState(0)
  const [wallpaperFailed, setWallpaperFailed] = useState(false)
  const [visibleNotificationCount, setVisibleNotificationCount] = useState(notificationDelayMs === 0 ? notifications.length : 0)
  const [dismissedNotifications, setDismissedNotifications] = useState(() => new Set())
  const notificationSwipeStart = useRef(null)

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    const onKeyDown = (event) => { if (event.key === 'Escape') onHome() }
    window.addEventListener('keydown', onKeyDown)
    return () => { window.clearInterval(timer); window.removeEventListener('keydown', onKeyDown) }
  }, [onHome])

  useEffect(() => {
    if (cornerTaps < 3) return undefined
    onHome()
    return undefined
  }, [cornerTaps, onHome])

  useEffect(() => {
    if (!notificationDelayMs) return undefined
    const timers = notifications.map((_, index) => window.setTimeout(
      () => setVisibleNotificationCount((count) => Math.max(count, index + 1)),
      notificationDelayMs + notificationStaggerMs * index,
    ))
    return () => timers.forEach(window.clearTimeout)
  }, [notificationDelayMs, notificationStaggerMs, notifications.length])

  function startNotificationSwipe(event, notificationKey) {
    notificationSwipeStart.current = { key: notificationKey, x: event.clientX, y: event.clientY }
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  function endNotificationSwipe(event, notificationKey) {
    const start = notificationSwipeStart.current
    notificationSwipeStart.current = null
    if (!start || start.key !== notificationKey) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) < 65 || Math.abs(dx) < Math.abs(dy) * 1.2) return
    setDismissedNotifications((current) => new Set(current).add(notificationKey))
  }

  const clock = clockTime || new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false }).format(now)
  const displayedDate = productionDate ? new Date(`${productionDate}T12:00:00`) : now
  const date = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }).format(displayedDate)
  const hasWallpaperPhoto = Boolean(wallpaperUrl && !wallpaperFailed)
  return <main className={`lock-screen${hasWallpaperPhoto ? ' has-wallpaper-photo' : ''}`}>
    {wallpaperUrl && !wallpaperFailed && <FlexibleAssetImage className="lock-wallpaper-image" src={wallpaperUrl} alt="" onError={() => setWallpaperFailed(true)} />}
    {(!wallpaperUrl || wallpaperFailed) && <div className="lock-wallpaper-art"><div className="lock-horizon" /><div className="lock-orb" /><div className="lock-shadow lock-shadow-one" /><div className="lock-shadow lock-shadow-two" /></div>}
    <button className="lock-return-hotspot" aria-label="Volver" onClick={() => setCornerTaps((count) => count + 1)} />
    {showPhoneStatusBar && <div className="lock-status"><span>{clock}</span><PhoneStatusIcons /></div>}
    <div className="lock-date"><span className="lock-symbol">⌑</span><span>{date}</span></div>
    <time className="lock-clock">{clock}</time>
    <div className="lock-notifications">{notifications.map((notification, index) => {
      const notificationKey = notification.id ?? `${notification.title}-${index}`
      if (index >= visibleNotificationCount || dismissedNotifications.has(notificationKey)) return null
      return <article className={`lock-notification${notification.kind === 'whatsapp' ? ' whatsapp-notification' : ''}`} key={notificationKey} onPointerDown={(event) => startNotificationSwipe(event, notificationKey)} onPointerUp={(event) => endNotificationSwipe(event, notificationKey)} onPointerCancel={() => { notificationSwipeStart.current = null }}><span className={`notification-app-icon ${notification.kind === 'whatsapp' ? 'whatsapp' : ''}`}>{notification.kind === 'whatsapp' ? '◉' : '◈'}</span><div className="notification-copy"><div><strong>{notification.title}</strong><time>{notification.time ?? 'ahora'}</time></div><p>{notification.message}</p></div></article>
    })}</div>
    <div className="lock-bottom"><span className="lock-shortcut">◉</span><span className="lock-hint"><i /> Deslizá hacia arriba para desbloquear</span><span className="lock-shortcut">◖</span></div>
  </main>
}

function WhatsAppChat({ onHome, contactName = '', contactPhone = '', contactAvatar = '', statusTime = '09:43', initialMessages = julianOpeningMessages, interactive = true, showComposer = interactive, dynamicReplay = false, showPhoneStatusBar = true }) {
  const [headerTaps, setHeaderTaps] = useState(0)
  const [brokenImages, setBrokenImages] = useState({})
  const [displayName, setDisplayName] = useState(() => {
    try { return window.localStorage.getItem('julian-contact-name') || contactName } catch { return contactName }
  })
  const [isContactSheetOpen, setIsContactSheetOpen] = useState(false)
  const [contactDraft, setContactDraft] = useState(() => {
    try { return window.localStorage.getItem('julian-contact-name') || contactName || '' } catch { return contactName || '' }
  })
  const [contactKeyboardOpen, setContactKeyboardOpen] = useState(false)
  useEffect(() => {
    let cancelled = false
    const contactDatabase = cloudConfigured ? getCloudState() : fetch('/__asset-manager/db').then((response) => response.ok ? response.json() : null)
    contactDatabase.then((database) => {
      if (cancelled || !Object.prototype.hasOwnProperty.call(database?.settings || {}, 'julianContactName')) return
      const name = String(database.settings.julianContactName || '')
      setDisplayName(name)
      setContactDraft(name)
      try {
        if (name) window.localStorage.setItem('julian-contact-name', name)
        else window.localStorage.removeItem('julian-contact-name')
      } catch {}
    }).catch(() => {})
    return () => { cancelled = true }
  }, [])
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [keyboardSymbols, setKeyboardSymbols] = useState(false)
  const [keyboardShift, setKeyboardShift] = useState(false)
  const [isTyping, setIsTyping] = useState(interactive)
  const [openingReplyPending, setOpeningReplyPending] = useState(interactive)
  const [audioReplyIndex, setAudioReplyIndex] = useState(0)
  const [canSendAudio, setCanSendAudio] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [awaitingInterruptedRecording, setAwaitingInterruptedRecording] = useState(false)
  const [isScrollingMessages, setIsScrollingMessages] = useState(false)
  const [dynamicCheckpointActive, setDynamicCheckpointActive] = useState(false)
  const [dynamicWaitingForInput, setDynamicWaitingForInput] = useState(false)
  const scrollEndTimer = useRef(null)
  const checkpointTimers = useRef([])
  const dynamicCursorRef = useRef(null)
  const replyTimer = useRef(null)
  const micPointerDown = useRef(false)
  const ignoreMicClick = useRef(false)
  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === 'Escape') onHome() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onHome])
  useEffect(() => { if (headerTaps >= 3) onHome() }, [headerTaps, onHome])
  useEffect(() => {
    if (!interactive) return undefined
    replyTimer.current = window.setTimeout(() => {
      setMessages((current) => [...current, julianFollowUpMessage])
      setIsTyping(false)
    }, 1000)
    return () => window.clearTimeout(replyTimer.current)
  }, [interactive])
  useEffect(() => () => {
    window.clearTimeout(scrollEndTimer.current)
    checkpointTimers.current.forEach(window.clearTimeout)
  }, [])

  function scheduleCheckpoint(delay, callback) {
    checkpointTimers.current.push(window.setTimeout(callback, delay))
  }

  function playDynamicSequenceFrom(index) {
    if (index >= initialMessages.length) {
      dynamicCursorRef.current = index
      setIsTyping(false)
      setDynamicWaitingForInput(false)
      return
    }

    const message = initialMessages[index]
    dynamicCursorRef.current = index
    if (message.sender === 'me') {
      setIsTyping(false)
      setDynamicWaitingForInput(true)
      return
    }

    setDynamicWaitingForInput(false)
    setIsTyping(true)
    const deliverMessage = () => {
      setMessages((current) => [...current, message])
      setIsTyping(false)
      dynamicCursorRef.current = index + 1
      scheduleCheckpoint(650, () => playDynamicSequenceFrom(index + 1))
    }

    if (message.id === 'full-personally-1') {
      scheduleCheckpoint(2200, () => setIsTyping(false))
      scheduleCheckpoint(3800, () => setIsTyping(true))
      scheduleCheckpoint(5800, () => setIsTyping(false))
      scheduleCheckpoint(8000, () => setIsTyping(true))
      scheduleCheckpoint(10600, () => setIsTyping(false))
      scheduleCheckpoint(12000, () => setIsTyping(true))
      scheduleCheckpoint(14500, deliverMessage)
    } else scheduleCheckpoint(1150, deliverMessage)
  }

  function sendDynamicTurn() {
    const startIndex = dynamicCursorRef.current
    if (!dynamicWaitingForInput || startIndex == null) return

    const outgoingMessages = []
    let nextIndex = startIndex
    while (nextIndex < initialMessages.length && initialMessages[nextIndex].sender === 'me') {
      outgoingMessages.push(initialMessages[nextIndex])
      nextIndex += 1
    }
    if (!outgoingMessages.length) return

    setDraft('')
    setDynamicWaitingForInput(false)
    dynamicCursorRef.current = nextIndex
    const deliverNextOutgoing = (outgoingIndex = 0) => {
      const outgoingMessage = outgoingMessages[outgoingIndex]
      if (!outgoingMessage) return
      setMessages((current) => [...current, outgoingMessage])
      if (outgoingIndex + 1 < outgoingMessages.length) scheduleCheckpoint(450, () => deliverNextOutgoing(outgoingIndex + 1))
      else scheduleCheckpoint(650, () => playDynamicSequenceFrom(nextIndex))
    }
    deliverNextOutgoing()
  }

  function setCheckpoint(messageIndex) {
    const checkpoint = messages[messageIndex]
    if (!checkpoint) return
    const sourceIndex = initialMessages.findIndex((message) => message.id === checkpoint.id)
    checkpointTimers.current.forEach(window.clearTimeout)
    checkpointTimers.current = []
    setMessages((current) => current.slice(0, messageIndex + 1))
    setIsTyping(false)
    setDraft('')
    if (dynamicReplay && sourceIndex >= 0) {
      setDynamicCheckpointActive(true)
      setDynamicWaitingForInput(false)
      dynamicCursorRef.current = sourceIndex + 1
      playDynamicSequenceFrom(sourceIndex + 1)
      return
    }

    const following = checkpoint.id === 'full-pickup-audio' ? messages.slice(messageIndex + 1, messageIndex + 3) : []
    if (!following.length) return

    setIsTyping(true)
    scheduleCheckpoint(900, () => setIsTyping(false))
    scheduleCheckpoint(1450, () => setIsTyping(true))
    scheduleCheckpoint(2550, () => {
      setMessages((current) => [...current, following[0]])
      setIsTyping(false)
    })
    scheduleCheckpoint(3100, () => setIsTyping(true))
    scheduleCheckpoint(4200, () => {
      setMessages((current) => [...current, following[1]])
      setIsTyping(false)
    })
  }

  function openContactSheet() {
    setContactDraft(displayName || '')
    setContactKeyboardOpen(false)
    setIsContactSheetOpen(true)
  }

  function saveContact() {
    const name = contactDraft.trim()
    if (!name) return
    try { window.localStorage.setItem('julian-contact-name', name) } catch { /* Keep the contact saved for this view. */ }
    if (cloudConfigured) saveCloudSettings({ julianContactName: name }).catch(() => {})
    else fetch('/__asset-manager/db/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ julianContactName: name }) }).catch(() => {})
    setDisplayName(name)
    setContactKeyboardOpen(false)
    setIsContactSheetOpen(false)
  }

  function deleteContact() {
    try { window.localStorage.removeItem('julian-contact-name') } catch { /* The visible name still resets for this view. */ }
    if (cloudConfigured) saveCloudSettings({ julianContactName: '' }).catch(() => {})
    else fetch('/__asset-manager/db/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ julianContactName: '' }) }).catch(() => {})
    setDisplayName('')
    setContactDraft('')
    setContactKeyboardOpen(false)
    setIsContactSheetOpen(false)
  }

  function sendMessage() {
    const text = draft.trim()
    if (!text || isTyping) return
    if (dynamicReplay) {
      if (!dynamicCheckpointActive || !dynamicWaitingForInput) return
      sendDynamicTurn()
      return
    }
    setDraft('')
    if (!openingReplyPending) {
      setMessages((current) => [...current, { id: `martina-${Date.now()}`, sender: 'me', text, timestamp: '09:53', status: 'read' }])
      return
    }
    setMessages((current) => [...current, martinaAgustinaMessage])
    setOpeningReplyPending(false)
    setIsTyping(true)
    replyTimer.current = window.setTimeout(() => {
      setMessages((current) => [...current, julianCostumeMessage])
      replyTimer.current = window.setTimeout(() => {
        setMessages((current) => [...current, julianCrownMessage])
        setIsTyping(false)
        setCanSendAudio(true)
      }, 2000)
    }, 1000)
  }

  function sendAudio() {
    if (dynamicReplay) return
    if (!interactive) {
      if (isTyping) return
      setMessages((current) => [...current, { id: `martina-audio-${Date.now()}`, sender: 'me', audioDuration: '0:04', timestamp: 'ahora', status: 'read' }])
      return
    }
    if (!canSendAudio || isTyping) return
    const audioIndex = audioReplyIndex
    const durations = ['0:03', '0:04', '0:06', '0:02']
    const audioTimestamps = ['09:47', '09:49', '09:51', '09:53', '09:55', '09:56', '09:59', '10:02', '10:04', '10:06', '10:10', '10:12', '10:15', '10:18', '02:13']
    setMessages((current) => [...current, { id: `martina-audio-${audioIndex + 1}`, sender: 'me', audioDuration: durations[audioIndex % durations.length], timestamp: audioTimestamps[audioIndex] || '10:20', status: 'read' }])
    if (audioIndex === 10) setMessages((current) => [...current, { id: 'martina-photo', sender: 'me', image: '/assets/martina_mirror_selfie.jpg', imageAlt: 'Selfie de Martina frente al espejo', timestamp: '10:11', status: 'read' }])
    setAudioReplyIndex(audioIndex + 1)
    setCanSendAudio(false)
    const responseSequence = julianAudioResponseSequences[audioIndex] || []
    if (responseSequence.length === 0) {
      setCanSendAudio(true)
      return
    }
    setIsTyping(true)
    const showNextResponse = (responseIndex) => {
      replyTimer.current = window.setTimeout(() => {
        setMessages((current) => [...current, responseSequence[responseIndex]])
        if (responseIndex < responseSequence.length - 1) showNextResponse(responseIndex + 1)
        else if (audioIndex === 10) {
          setIsTyping(false)
          setCanSendAudio(false)
          setAwaitingInterruptedRecording(true)
        }
        else {
          setIsTyping(false)
          setCanSendAudio(true)
        }
      }, 1000)
    }
    showNextResponse(0)
  }

  function beginInterruptedRecording(event) {
    if (!awaitingInterruptedRecording) return
    event.preventDefault()
    micPointerDown.current = true
    ignoreMicClick.current = true
    event.currentTarget.setPointerCapture?.(event.pointerId)
    setIsRecording(true)
  }

  function endInterruptedRecording() {
    if (!awaitingInterruptedRecording || !micPointerDown.current) return
    micPointerDown.current = false
    window.setTimeout(() => { ignoreMicClick.current = false }, 0)
    setIsRecording(false)
    setAwaitingInterruptedRecording(false)
    setIsTyping(true)
    replyTimer.current = window.setTimeout(() => {
      setMessages((current) => [...current, julianAudioResponseSequences[11][0]])
      setAudioReplyIndex(12)
      setIsTyping(false)
      setCanSendAudio(true)
    }, 1000)
  }

  function handleMicClick() {
    if (ignoreMicClick.current) {
      ignoreMicClick.current = false
      return
    }
    if (awaitingInterruptedRecording) return
    if (draft.trim()) sendMessage()
    else sendAudio()
  }

  function handleMessagesScroll() {
    setIsScrollingMessages(true)
    window.clearTimeout(scrollEndTimer.current)
    scrollEndTimer.current = window.setTimeout(() => setIsScrollingMessages(false), 650)
  }

  const visibleMessages = messages
  const dynamicComposerDisabled = dynamicReplay && (!dynamicCheckpointActive || !dynamicWaitingForInput)
  const composerPlaceholder = 'Mensaje'

  return <main className="chat-screen">
    <div className={`chat-phone${showPhoneStatusBar ? '' : ' status-bar-hidden'}`}>
      {showPhoneStatusBar && <div className="chat-status"><span>{statusTime}</span><PhoneStatusIcons /></div>}
      <header className="chat-header"><button className="chat-back-arrow" aria-label="Volver" onClick={() => setHeaderTaps((count) => count + 1)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg></button><ChatAvatar contactAvatar={contactAvatar} /><button type="button" className="chat-contact chat-contact-trigger" onClick={openContactSheet} aria-label={displayName ? `Editar contacto ${displayName}` : `Agendar ${contactPhone}`}><strong>{displayName || contactPhone}</strong><small>{displayName ? contactPhone : 'últ. vez hoy a las 09:39'}</small></button><button aria-label="Videollamada"><Video aria-hidden="true" /></button><button aria-label="Llamada"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h3l2 5-2 2a15 15 0 0 0 4 4l2-2 5 2v3c0 1.1-.9 2-2 2C10 19 5 14 5 5c0-1.1.9-2 2-2z"/></svg></button><button aria-label="Opciones"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg></button></header>
      <div className={`chat-messages-area${isScrollingMessages ? ' is-scrolling' : ''}`} style={keyboardOpen ? { bottom: 286 } : undefined} onScroll={handleMessagesScroll}>{isTyping && <div className="chat-message-row incoming"><article className="chat-bubble typing-bubble"><span className="typing-dots"><i /><i /><i /></span><span>Escribiendo...</span></article></div>}{[...visibleMessages].reverse().map((message, reversedIndex) => { const messageIndex = visibleMessages.length - 1 - reversedIndex; return <div className={`chat-message-row ${message.sender === 'me' ? 'outgoing' : 'incoming'}`} key={message.id}><WhatsAppMessageBubble message={message} broken={brokenImages[message.id]} onImageError={() => setBrokenImages((current) => ({ ...current, [message.id]: true }))} showTimestamp={interactive || Boolean(message.timestamp)} previewable={!interactive} onClick={!interactive ? () => setCheckpoint(messageIndex) : undefined} /></div>})}{interactive && <div className="chat-date-divider">HOY</div>}</div>
      {showComposer && <div className="chat-composer" style={keyboardOpen ? { bottom: 243 } : undefined}><button className="composer-add" aria-label="Agregar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button><div className="composer-input">{isRecording ? <div className="chat-recording-active"><i /> Grabando audio... <span>soltá para cancelar</span></div> : <><input className="chat-message-input" aria-label="Mensaje" placeholder={composerPlaceholder} value={draft} disabled={isTyping || dynamicComposerDisabled} inputMode={!interactive ? 'none' : undefined} onFocus={() => { if (!interactive) setKeyboardOpen(true) }} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); sendMessage() } }} /><button className="composer-sticker" aria-label="Stickers"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14a1 1 0 0 1 1 1v9l-6 6H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/><path d="M14 20v-5a2 2 0 0 1 2-2h4"/></svg></button></>}</div><button className="composer-camera" aria-label="Cámara"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v11H3V8a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/></svg></button><button className={`composer-audio${isRecording ? ' is-recording' : ''}`} aria-label={awaitingInterruptedRecording ? 'Mantener para grabar audio' : draft.trim() ? 'Enviar mensaje' : 'Enviar audio'} disabled={isTyping || dynamicComposerDisabled || (dynamicReplay && !draft.trim()) || (interactive && !draft.trim() && !canSendAudio && !awaitingInterruptedRecording)} onPointerDown={beginInterruptedRecording} onPointerUp={endInterruptedRecording} onPointerCancel={endInterruptedRecording} onClick={handleMicClick}>{draft.trim() && !awaitingInterruptedRecording ? <Send /> : <Mic />}</button></div>}
      {keyboardOpen && <div className="chat-virtual-keyboard" aria-label="Teclado"><div className="virtual-keyboard-toolbar"><button type="button" onClick={() => setKeyboardOpen(false)}>⌄</button><span>　</span><button type="button" onClick={() => setKeyboardOpen(false)}>Listo</button></div>{(keyboardSymbols ? ['1234567890','@#$%&-*+()','⇧áéíóúñ?!⌫'] : ['qwertyuiop','asdfghjkl','⇧zxcvbnm⌫']).map((row) => <div className="virtual-keyboard-row" key={row}>{Array.from(row).map((key, index) => <button type="button" key={`${key}-${index}`} className={key === '⌫' || key === '⇧' ? 'wide' : ''} onMouseDown={(event) => event.preventDefault()} onClick={() => key === '⇧' ? setKeyboardShift((value) => !value) : key === '⌫' ? setDraft((value) => value.slice(0, -1)) : (setDraft((value) => value + (keyboardShift && /[a-záéíóúñ]/i.test(key) ? key.toLocaleUpperCase('es-AR') : key)), setKeyboardShift(false))}>{keyboardShift && /[a-záéíóúñ]/i.test(key) ? key.toLocaleUpperCase('es-AR') : key}</button>)}</div>)}<div className="virtual-keyboard-row virtual-keyboard-bottom"><button type="button" className="symbol-toggle" onMouseDown={(event) => event.preventDefault()} onClick={() => setKeyboardSymbols((value) => !value)}>{keyboardSymbols ? 'ABC' : '?123'}</button><button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => setDraft((value) => value + ',')}>,</button><button type="button" className="wide" onMouseDown={(event) => event.preventDefault()} onClick={() => setDraft((value) => value + ' ')}>espacio</button><button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => setDraft((value) => value + '.')}>.</button><button type="button" onMouseDown={(event) => event.preventDefault()} onClick={sendMessage}>↵</button></div></div>}
      {isContactSheetOpen && <div className={`contact-sheet-overlay${contactKeyboardOpen ? ' is-keyboard-open' : ''}`} onClick={() => setIsContactSheetOpen(false)}><section className={`contact-sheet${contactKeyboardOpen ? ' keyboard-open' : ''}`} role="dialog" aria-modal="true" aria-labelledby="contact-sheet-title" onClick={(event) => event.stopPropagation()}><div className="contact-sheet-grabber"/><header><button type="button" onClick={() => { setContactKeyboardOpen(false); setIsContactSheetOpen(false) }}>Cancelar</button><strong id="contact-sheet-title">{displayName ? 'Editar contacto' : 'Nuevo contacto'}</strong><button type="button" className="contact-save" disabled={!contactDraft.trim()} onClick={saveContact}>Guardar</button></header><label>Nombre<input value={contactDraft} placeholder="Escribí el nombre" autoFocus inputMode="none" onFocus={() => setContactKeyboardOpen(true)} onChange={(event) => setContactDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') saveContact() }} /></label><label>Teléfono<input value={contactPhone} readOnly /></label>{displayName && <button type="button" className="contact-delete" onClick={deleteContact}>Eliminar contacto</button>}</section>{contactKeyboardOpen && <div className="chat-virtual-keyboard contact-virtual-keyboard" aria-label="Teclado para nombre" onClick={(event) => event.stopPropagation()}><div className="virtual-keyboard-toolbar"><button type="button" onClick={() => setContactKeyboardOpen(false)}>⌄</button><span>　</span><button type="button" onClick={() => setContactKeyboardOpen(false)}>Listo</button></div>{(keyboardSymbols ? ['1234567890','@#$%&-*+()','⇧áéíóúñ?!⌫'] : ['qwertyuiop','asdfghjkl','⇧zxcvbnm⌫']).map((row) => <div className="virtual-keyboard-row" key={`contact-${row}`}>{Array.from(row).map((key, index) => <button type="button" key={`${key}-${index}`} className={key === '⌫' || key === '⇧' ? 'wide' : ''} onMouseDown={(event) => event.preventDefault()} onClick={() => key === '⇧' ? setKeyboardShift((value) => !value) : key === '⌫' ? setContactDraft((value) => value.slice(0, -1)) : (setContactDraft((value) => value + (keyboardShift && /[a-záéíóúñ]/i.test(key) ? key.toLocaleUpperCase('es-AR') : key)), setKeyboardShift(false))}>{keyboardShift && /[a-záéíóúñ]/i.test(key) ? key.toLocaleUpperCase('es-AR') : key}</button>)}</div>)}<div className="virtual-keyboard-row virtual-keyboard-bottom"><button type="button" className="symbol-toggle" onMouseDown={(event) => event.preventDefault()} onClick={() => setKeyboardSymbols((value) => !value)}>{keyboardSymbols ? 'ABC' : '?123'}</button><button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => setContactDraft((value) => value + ',')}>,</button><button type="button" className="wide" onMouseDown={(event) => event.preventDefault()} onClick={() => setContactDraft((value) => value + ' ')}>espacio</button><button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => setContactDraft((value) => value + '.')}>.</button><button type="button" onMouseDown={(event) => event.preventDefault()} onClick={saveContact}>↵</button></div></div>}</div>}
      <div className="chat-home-indicator" />
    </div>
  </main>
}

function CallSlideControl({ action, label, onAction, onTap }) {
  const [offsetY, setOffsetY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const gestureStart = useRef(null)
  const ignoreNextClick = useRef(false)
  const actionTimer = useRef(null)

  useEffect(() => () => window.clearTimeout(actionTimer.current), [])

  function handlePointerDown(event) {
    if (event.button !== 0) return
    gestureStart.current = { x: event.clientX, y: event.clientY }
    event.currentTarget.setPointerCapture?.(event.pointerId)
    setOffsetY(0)
    setIsDragging(true)
  }

  function handlePointerMove(event) {
    if (!gestureStart.current) return
    const deltaY = Math.min(0, event.clientY - gestureStart.current.y)
    setOffsetY(Math.max(-88, deltaY))
  }

  function handlePointerUp(event) {
    const start = gestureStart.current
    gestureStart.current = null
    setIsDragging(false)
    if (!start) return
    const deltaX = event.clientX - start.x
    const deltaY = event.clientY - start.y
    const isSwipe = Math.abs(deltaY) > 12 || Math.abs(deltaX) > 12
    ignoreNextClick.current = isSwipe
    if (deltaY <= -62 && Math.abs(deltaY) > Math.abs(deltaX) * 1.2) {
      setOffsetY(-88)
      actionTimer.current = window.setTimeout(onAction, 190)
    } else setOffsetY(0)
    if (isSwipe) window.setTimeout(() => { ignoreNextClick.current = false }, 0)
  }

  function handlePointerCancel() {
    gestureStart.current = null
    setIsDragging(false)
    setOffsetY(0)
    ignoreNextClick.current = false
  }

  function handleClick() {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false
      return
    }
    onTap()
  }

  return <div className={`call-action-group call-slide-group call-slide-${action}${isDragging ? ' is-dragging' : ''}`}>
    <span className="call-slide-cue" aria-hidden="true"><i>↑</i></span>
    <button className={`call-action ${action}`} onClick={handleClick} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerCancel} style={{ transform: `translateY(${offsetY}px)` }} aria-label={`${label}. Deslizá hacia arriba o tocá para ${label.toLowerCase()}`}><svg className={`call-handset ${action === 'reject' ? 'decline' : 'answer'}`} viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.2c1.1.4 2.3.6 3.6.6a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A18 18 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.3.2 2.5.6 3.6a1 1 0 0 1-.2 1z" /></svg></button>
    <small>{label}</small>
  </div>
}

function IncomingCall({ onHome, callerName = 'JULIÁN', callerSubtext = 'llamada entrante', avatarUrl = '', clockTime = '01:32', onReject, onAccept, showPhoneStatusBar = true }) {
  const [callState, setCallState] = useState('ringing')
  const [seconds, setSeconds] = useState(0)
  const [returnTaps, setReturnTaps] = useState(0)
  const [showEndedMessage, setShowEndedMessage] = useState(false)
  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === 'Escape') onHome() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onHome])
  useEffect(() => {
    if (callState !== 'connected') return undefined
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [callState])
  useEffect(() => {
    if (callState !== 'ended') return undefined
    const timer = window.setTimeout(() => setShowEndedMessage(false), 3000)
    return () => window.clearTimeout(timer)
  }, [callState])
  useEffect(() => { if (returnTaps >= 3) onHome() }, [returnTaps, onHome])

  function rejectCall() {
    setShowEndedMessage(true)
    setCallState('ended')
    onReject?.()
  }
  function acceptCall() {
    setCallState('connected')
    onAccept?.()
  }
  const duration = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

  if (callState === 'ended') return <main className="call-cut-screen" aria-label="Llamada finalizada">{showEndedMessage && <p className="call-ended-message" role="status">Llamada finalizada</p>}<button onClick={() => setReturnTaps((count) => count + 1)} aria-label="Volver" /></main>
  return <main className="incoming-call-screen">
    <div className="call-wallpaper" />
    {showPhoneStatusBar && <div className="call-status"><span>{clockTime}</span><PhoneStatusIcons /></div>}
    <div className="call-identity"><div className="call-avatar">{avatarUrl && <FlexibleAssetImage src={avatarUrl} alt="" onError={(event) => { event.currentTarget.style.display = 'none' }} />}<span>J</span></div><h1>{callerName}</h1><p>{callState === 'connected' ? duration : callerSubtext}</p></div>
    <div className="call-actions">{callState === 'ringing' ? <><CallSlideControl action="reject" label="Rechazar" onAction={rejectCall} onTap={rejectCall} /><CallSlideControl action="accept" label="Aceptar" onAction={acceptCall} onTap={acceptCall} /></> : <><div className="call-action-group"><button className="call-action connected-control" aria-label="Silenciar"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 18v3m-4 0h8"/></svg></button><small>Silenciar</small></div><div className="call-action-group"><button className="call-action connected-control" aria-label="Altavoz"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4zM17 9a5 5 0 0 1 0 6m2.5-9a9 9 0 0 1 0 12"/></svg></button><small>Altavoz</small></div><div className="call-action-group"><button className="call-action reject" onClick={rejectCall} aria-label="Finalizar llamada"><svg className="call-handset decline" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.2c1.1.4 2.3.6 3.6.6a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A18 18 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.3.2 2.5.6 3.6a1 1 0 0 1-.2 1z"/></svg></button><small>Finalizar</small></div></>}</div>
    <button className="call-return-hotspot" onClick={() => setReturnTaps((count) => count + 1)} aria-label="Volver" />
  </main>
}

function ScenePlaceholder({ scene, onHome }) {
  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === 'Escape') onHome() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onHome])
  return <main className="scene-placeholder">
    <button className="back-button" onClick={onHome}>← <span>Volver al panel</span></button>
    <div className="placeholder-frame">
      <span className="eyebrow">{scene.device.toUpperCase()} <span>·</span> {scene.code} / {scene.shot}</span>
      <h1>{scene.title}</h1>
      <p>Esta vista está en la lista de producción.<br />La pantalla de utilería se implementará en su siguiente tarea.</p>
      <span className="placeholder-tag">PANTALLA EN PREPARACIÓN</span>
    </div>
    <span className="escape-hint">PRESIONÁ ESC PARA VOLVER</span>
  </main>
}

createRoot(document.getElementById('root')).render(<App />)
