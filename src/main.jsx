import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Apple, FolderOpen, StickyNote, Music2, Wifi, Search, BatteryFull, ShieldCheck, SkipBack, SkipForward, Pause, Play, Mail, Images, Settings, Minus, X, Maximize2, Minimize2, Send, Mic, Square } from 'lucide-react'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/inter/latin-700.css'
import './styles.css'
import './desktop.css'
import './mail.css'
import './terminal.css'
import './story.css'
import './lock.css'
import './chat.css'
import './ai-chat.css'
import './asset-placeholders.css'
import './call.css'
import './aspect-ratio-fixes.css'

const scenes = [
  { path: '/mobile/esc1a-p1', device: 'Celular', code: 'ESC 1.A', shot: 'Plano 1', title: 'Chat con asistente', phase: 'Celular' },
    { path: '/notebook/esc1a-p2', device: 'Notebook', code: 'ESC 1.A', shot: 'Plano 2', title: 'Escritorio & reproductor', phase: 'Computadora' },
  { path: '/notebook/esc1g-p2', device: 'Notebook', code: 'ESC 1.G', shot: 'Plano 2', title: 'Email con video adjunto', phase: 'Computadora' },
  { path: '/notebook/esc3-p2', device: 'Notebook', code: 'ESC 3', shot: 'Plano 2', title: 'Terminal incógnita', phase: 'Computadora' },
  { path: '/mobile/esc1b-p3', device: 'Celular', code: 'ESC 1.B', shot: 'Plano 3', title: 'Bristagram Stories', phase: 'Celular' },
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
  { id: 'full-who', sender: 'me', text: 'quién sos?' },
  { id: 'full-name', sender: 'contact', text: 'Julián.' },
  { id: 'full-number-request', sender: 'contact', text: 'Vi que te fuiste y le pedí el número a tu amiga.' },
  { id: 'full-agustina-question', sender: 'me', audioDuration: '0:05' },
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
  julianAvatar: '/assets/julian_profile.jpg',
  julianProfilePosts: '/assets/julian_profile_posts.png',
  halloweenStory: '/assets/party_halloween.jpg',
  agustinaStory: '/assets/agustina_julian_party.jpg',
  desktopWallpaper: '/assets/martina_wallpaper_desktop.jpg',
  mobileWallpaper: '/assets/martina_wallpaper_mobile.jpg',
}
const storyData = [
  { id: 'halloween', mediaUrl: assets.halloweenStory, caption: 'noche de halloween 🎃' },
  { id: 'friends', mediaUrl: assets.agustinaStory, caption: '🖤' },
]
const julianPosts = [
  { id: 'julian-profile-post', mediaUrl: assets.julianProfilePosts, position: '0%', caption: 'Julián' },
  { id: 'julian-dog-post', mediaUrl: assets.julianProfilePosts, position: '50%', caption: 'El perro de Julián' },
  { id: 'julian-eiffel-post', mediaUrl: assets.julianProfilePosts, position: '100%', caption: 'Julián en París' },
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
  { id: 'julian-profile', filename: 'julian_profile.jpg', label: 'Foto de perfil de Julián', accept: 'image/*' },
  { id: 'party-halloween', filename: 'party_halloween.jpg', label: 'Historia de Halloween', accept: 'image/*' },
  { id: 'agustina-julian-party', filename: 'agustina_julian_party.jpg', label: 'Historia con Agustina y Julián', accept: 'image/*' },
  { id: 'martina-wallpaper-desktop', filename: 'martina_wallpaper_desktop.jpg', label: 'Fondo de pantalla de computadora', accept: 'image/*' },
  { id: 'martina-wallpaper-mobile', filename: 'martina_wallpaper_mobile.jpg', label: 'Fondo de pantalla del celular', accept: 'image/*' },
  { id: 'martina-mirror-selfie', filename: 'martina_mirror_selfie.jpg', label: 'Selfie de Martina en el espejo · WhatsApp', accept: 'image/*' },
  { id: 'mail-video', filename: 'video_01.mp4', label: 'Video de Martina durmiendo · adjunto del mail', accept: 'video/mp4,video/*' },
  { id: 'crown-photo', filename: 'crown_photo.jpg', label: 'Foto de la corona en WhatsApp', accept: 'image/*' },
  { id: 'emily-costume', filename: 'emily_costume.jpg', label: 'Foto del disfraz en WhatsApp', accept: 'image/*' },
]

function AssetUploadSection() {
  const [fileSizes, setFileSizes] = useState({})
  const [uploading, setUploading] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/__asset-manager/status').then((response) => response.ok ? response.json() : {}).then(setFileSizes).catch(() => {})
  }, [])

  async function uploadFile(asset, file) {
    setUploading(asset.id)
    setMessage('')
    try {
      const response = await fetch(`/__asset-manager/upload/${asset.id}`, { method: 'POST', body: file })
      if (!response.ok) throw new Error(await response.text())
      const result = await response.json()
      setFileSizes((current) => ({ ...current, [asset.id]: result.size }))
      setMessage(`${asset.filename} quedó guardado con el nombre correcto`)
    } catch (error) {
      setMessage(`No se pudo guardar ${asset.filename}: ${error.message}. Abrí el proyecto con npm run dev.`)
    } finally {
      setUploading('')
    }
  }

  async function resetFile(asset) {
    setUploading(asset.id)
    setMessage('')
    try {
      const response = await fetch(`/__asset-manager/reset/${asset.id}`, { method: 'POST' })
      if (!response.ok) throw new Error(await response.text())
      setFileSizes((current) => ({ ...current, [asset.id]: 0 }))
      setMessage(`${asset.filename} volvió al placeholder vacío`)
    } catch (error) {
      setMessage(`No se pudo restaurar ${asset.filename}: ${error.message}. Abrí el proyecto con npm run dev.`)
    } finally {
      setUploading('')
    }
  }

  const changed = Object.values(fileSizes).some((size) => size > 0)
  return <section className="asset-upload-section" aria-label="Carga de archivos">
    <div className="asset-upload-heading"><div><p className="eyebrow">ARCHIVOS DEL PROYECTO</p><h2>Carga de archivos</h2><p>Elegí el archivo y se guardará en <code>public/</code> con el nombre que usa la utilería.</p></div>{changed && <button type="button" className="asset-reload-button" onClick={() => window.location.reload()}>Actualizar vistas</button>}</div>
    <div className="asset-upload-list">{managedFiles.map((asset) => {
      const size = fileSizes[asset.id] || 0
      return <article className="asset-upload-row" key={asset.id}>
        <div className="asset-upload-info"><strong>{asset.label}</strong><code>{asset.filename}</code><small>{size ? `${(size / 1024 / 1024).toFixed(size < 1024 * 1024 ? 0 : 1)} MB · archivo cargado` : 'Placeholder vacío'}</small></div>
        <label className="asset-file-picker">{uploading === asset.id ? 'Guardando…' : 'Elegir archivo'}<input type="file" accept={asset.accept} disabled={Boolean(uploading)} onChange={(event) => { const file = event.target.files?.[0]; if (file) uploadFile(asset, file); event.target.value = '' }} /></label>
        <button type="button" className="asset-reset-button" disabled={!size || Boolean(uploading)} onClick={() => resetFile(asset)}>Restaurar vacío</button>
      </article>
    })}</div>
    {message && <p className="asset-upload-message" role="status">{message}</p>}
  </section>
}
function App() {
  const [path, setPath] = useState(window.location.pathname)
  const [filter, setFilter] = useState('Todo')
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

  function updateClockTime(value) {
    setClockTime(value)
    try { window.localStorage.setItem('production-clock-time', value) } catch {}
  }

  function updateProductionDate(value) {
    setProductionDate(value)
    try { window.localStorage.setItem('production-date', value) } catch {}
  }

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  function navigate(nextPath) {
    window.history.pushState({}, '', nextPath)
    setPath(nextPath)
    window.scrollTo(0, 0)
  }

  if (path === '/mobile/esc3-p2') return <MobileAIChat onHome={() => navigate('/')} clockTime={clockTime} />
  const selected = scenes.find((scene) => scene.path === path)
  if (julianChatScenePaths.includes(path)) return <WhatsAppChat onHome={() => navigate('/')} contactPhone="+54 9 11 1103-1976" contactAvatar={assets.julianAvatar} />
  if (selected) {
    if (selected.path === '/notebook/esc1a-p2') return <DesktopView onHome={() => navigate('/')} wallpaperUrl={assets.desktopWallpaper} clockTime={clockTime} />
    if (selected.path === '/notebook/esc1g-p2') return <MailDesktopScene onHome={() => navigate('/')} clockTime={clockTime} />
    if (selected.path === '/notebook/esc3-p2') return <DesktopView onHome={() => navigate('/')} showMusic={false} autoOpenAssistant clockTime={clockTime} />
    if (selected.path === '/mobile/esc1b-p3') return <InstagramStory onHome={() => navigate('/')} avatarUrl={assets.julianAvatar} clockTime={clockTime} />
    if (selected.path === '/mobile/esc1c-p1') return <LockScreen onHome={() => navigate('/')} wallpaperUrl={assets.mobileWallpaper} clockTime={clockTime} productionDate={productionDate} />
    if (selected.path === '/mobile/esc1c-p5') return <LockScreen onHome={() => navigate('/')} clockTime={clockTime} productionDate={productionDate} notificationDelayMs={5000} notificationStaggerMs={900} notifications={[
      { id: 'unknown-1', title: '+54 9 11 1103-1976', message: 'Hola, estas?', time: 'ahora', kind: 'whatsapp' },
      { id: 'unknown-2', title: '+54 9 11 1103-1976', message: 'estas bien?', time: 'ahora', kind: 'whatsapp' },
    ]} wallpaperUrl={assets.mobileWallpaper} />
    if (selected.path === '/mobile/esc1a-p1') return <MobileAIChat onHome={() => navigate('/')} clockTime={clockTime} />
    if (selected.path === '/mobile/esc1g-p11') return <WhatsAppChat onHome={() => navigate('/')} contactPhone="+54 9 11 1103-1976" contactAvatar={assets.julianAvatar} initialMessages={fullJulianConversation} interactive={false} showComposer />
    if (selected.path === '/mobile/esc1g-p12') return <WhatsAppChat onHome={() => navigate('/')} contactPhone="+54 9 11 1103-1976" contactAvatar={assets.julianAvatar} initialMessages={fullJulianConversation} interactive={false} showComposer dynamicReplay />
    if (selected.path === '/mobile/esc1g-p10') return <IncomingCall onHome={() => navigate('/')} callerName="JULIÁN" callerSubtext="llamada de voz entrante" avatarUrl={assets.julianAvatar} />
    return <ScenePlaceholder scene={selected} onHome={() => navigate('/')} />
  }

  const visibleScenes = filter === 'Todo' ? scenes : scenes.filter((scene) => scene.device === filter)
  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="/" onClick={(event) => { event.preventDefault(); navigate('/') }}>
          <span className="brand-mark">ID</span><span>UTILERÍA DIGITAL <i>/</i> INVISIBLE</span>
        </a>
        <span className="offline"><span /> LISTO PARA SET</span>
      </header>

      <section className="scene-section">
        <div className="section-heading">
          <div><p className="eyebrow">ACCESO RÁPIDO</p><h2>Escenas y planos</h2></div>
          <div className="filters" aria-label="Filtrar por dispositivo">
            {['Todo', 'Notebook', 'Celular'].map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}
          </div>
        </div>
        <div className="scene-grid">
          {visibleScenes.map((scene, index) => (
            <button className="scene-card" key={scene.path} onClick={() => navigate(scene.path)}>
              <span className="card-top"><span className={`device-icon ${scene.device === 'Celular' ? 'phone' : ''}`}>{scene.device === 'Celular' ? '▯' : '▱'}</span><span className="card-index">{String(index + 1).padStart(2, '0')}</span></span>
              <span className="scene-code">{scene.code}<span>, </span>{scene.shot}</span>
              <span className="scene-title">{scene.title}</span>
              <span className="card-bottom"><span>{scene.device.toUpperCase()}</span><span className="arrow">↗</span></span>
            </button>
          ))}
        </div>
      </section>
      <section className="clock-tool" aria-label="Personalizar horario">
        <div><p className="eyebrow">CONFIGURACIÓN</p><h2>Fecha y hora de las pantallas</h2><p>Se aplican a los relojes y la fecha del celular. Las marcas dentro de los mensajes no cambian.</p></div>
        <div className="clock-tool-fields"><label>Fecha<input type="date" value={productionDate} onChange={(event) => updateProductionDate(event.target.value)} /></label><label>Hora<input type="time" value={clockTime} onChange={(event) => updateClockTime(event.target.value)} /></label></div>
      </section>
      <AssetUploadSection />
      <footer><span>INVISIBLE <i>·</i> UTILERÍA DIGITAL</span><span>HERRAMIENTAS DE RODAJE <b>01 / 01</b></span></footer>
    </main>
  )
}

function DesktopView({ onHome, wallpaperUrl = '', showMusic = true, autoOpenAssistant = false, onOpenMail = null, mailBadgeDelayMs = 1500, clockTime = '09:41' }) {
  const [playing, setPlaying] = useState(true)
  const [selectedDesktopIcon, setSelectedDesktopIcon] = useState('')
  const [isMusicMinimized, setIsMusicMinimized] = useState(false)
  const [isMusicClosed, setIsMusicClosed] = useState(false)
  const [isMusicZoomed, setIsMusicZoomed] = useState(false)
  const [assistantWindowOpen, setAssistantWindowOpen] = useState(false)
  const [assistantWindowZoomed, setAssistantWindowZoomed] = useState(false)
  const [assistantWindowPosition, setAssistantWindowPosition] = useState(null)
  const [mailBadgeVisible, setMailBadgeVisible] = useState(false)
  const [autoCursorVisible, setAutoCursorVisible] = useState(false)
  const [autoCursorPosition, setAutoCursorPosition] = useState({ x: 0, y: 0 })
  const [autoCursorClicking, setAutoCursorClicking] = useState(false)
  const desktopRef = useRef(null)
  const assistantDockRef = useRef(null)
  const autoCursorRef = useRef(null)
  const [widgetPosition, setWidgetPosition] = useState(null)
  const [isDraggingWidget, setIsDraggingWidget] = useState(false)
  const widgetDragRef = useRef(null)
  const assistantDragRef = useRef(null)

  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === 'Escape') { if (assistantWindowOpen) setAssistantWindowOpen(false); else onHome() } }
    window.addEventListener('keydown', onKeyDown)
    return () => { window.removeEventListener('keydown', onKeyDown) }
  }, [onHome, assistantWindowOpen])

  useEffect(() => {
    if (!onOpenMail) return undefined
    const timer = window.setTimeout(() => setMailBadgeVisible(true), mailBadgeDelayMs)
    return () => window.clearTimeout(timer)
  }, [onOpenMail, mailBadgeDelayMs])

  useEffect(() => {
    if (!autoOpenAssistant) return undefined
    let frameId
    let startTimer
    let clickTimer
    const desktop = desktopRef.current
    const dockIcon = assistantDockRef.current
    if (!desktop || !dockIcon) return undefined

    const desktopRect = desktop.getBoundingClientRect()
    const targetRect = dockIcon.getBoundingClientRect()
    const start = { x: desktopRect.width * 0.2, y: desktopRect.height * 0.48 }
    const target = { x: targetRect.left - desktopRect.left + targetRect.width / 2, y: targetRect.top - desktopRect.top + targetRect.height / 2 }
    setAutoCursorPosition(start)
    setAutoCursorVisible(true)

    startTimer = window.setTimeout(() => {
      const cursor = autoCursorRef.current
      if (!cursor) return
      const startedAt = performance.now()
      const duration = 1350
      const control = { x: desktopRect.width * 0.62, y: desktopRect.height * 0.32 }
      const move = (now) => {
        const rawProgress = Math.min((now - startedAt) / duration, 1)
        const progress = rawProgress * rawProgress * (3 - 2 * rawProgress)
        const inverse = 1 - progress
        const x = inverse * inverse * start.x + 2 * inverse * progress * control.x + progress * progress * target.x
        const y = inverse * inverse * start.y + 2 * inverse * progress * control.y + progress * progress * target.y
        cursor.style.left = `${x}px`
        cursor.style.top = `${y}px`
        if (rawProgress < 1) frameId = window.requestAnimationFrame(move)
        else {
          setAutoCursorPosition(target)
          setAutoCursorClicking(true)
          clickTimer = window.setTimeout(() => {
            setAssistantWindowOpen(true)
            setAutoCursorVisible(false)
          }, 260)
        }
      }
      frameId = window.requestAnimationFrame(move)
    }, 5000)

    return () => {
      window.clearTimeout(startTimer)
      window.clearTimeout(clickTimer)
      window.cancelAnimationFrame(frameId)
    }
  }, [autoOpenAssistant])

  function startWidgetDrag(event) {
    if (isMusicZoomed) return
    if (event.target.closest('button')) return
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

  return <main className="desktop-screen" ref={desktopRef}>
    <div className="desktop-wallpaper">{wallpaperUrl && <img className="desktop-wallpaper-photo" src={wallpaperUrl} alt="" onError={(event) => { event.currentTarget.style.display = 'none' }} />}</div>
    <div className="desktop-menu"><span className="apple-mark"><Apple size={15} fill="currentColor" strokeWidth={1.5} /></span><strong>Finder</strong><span>Archivo</span><span>Edición</span><span>Visualización</span><span>Ir</span><span>Ventana</span><span>Ayuda</span><div className="menu-spacer" /><div className="menu-status-icons"><span title="Buscar" aria-label="Buscar"><Search /></span><span title="Protección activa" aria-label="Protección activa"><ShieldCheck /></span><span title="Batería" aria-label="Batería"><BatteryFull /></span><span title="Wi-Fi" aria-label="Wi-Fi"><Wifi /></span></div><span>{clockTime}</span></div>
    <div className="desktop-icons"><button className={`desktop-icon${selectedDesktopIcon === 'Proyectos' ? ' selected' : ''}`} onClick={() => setSelectedDesktopIcon('Proyectos')} aria-label="Proyectos"><span><FolderOpen size={35} strokeWidth={1.4} /></span><small>Proyectos</small></button><button className={`desktop-icon${selectedDesktopIcon === 'Notas' ? ' selected' : ''}`} onClick={() => setSelectedDesktopIcon('Notas')} aria-label="Notas"><span><StickyNote size={34} strokeWidth={1.4} /></span><small>Notas</small></button><button className={`desktop-icon${selectedDesktopIcon === 'Música' ? ' selected' : ''}`} onClick={() => setSelectedDesktopIcon('Música')} onDoubleClick={openMusic} onKeyDown={(event) => { if (event.key === 'Enter') openMusic() }} aria-label="Música"><span><Music2 size={34} strokeWidth={1.5} /></span><small>Música</small></button></div>
    {showMusic && !isMusicClosed && !isMusicMinimized && <section className={`music-widget${isDraggingWidget ? ' is-dragging' : ''}${isMusicZoomed ? ' is-zoomed' : ''}`} aria-label="Reproductor de música" style={widgetPosition && !isMusicZoomed ? { left: `${widgetPosition.x}px`, top: `${widgetPosition.y}px`, right: 'auto' } : undefined} onPointerDown={startWidgetDrag} onPointerMove={moveWidget} onPointerUp={endWidgetDrag} onPointerCancel={endWidgetDrag}>
      <div className="music-window-controls"><button className="mac-window-control close" aria-label="Cerrar Música" title="Cerrar" onClick={() => { setIsMusicClosed(true); setIsMusicMinimized(false); setIsMusicZoomed(false) }}><X /></button><button className="mac-window-control minimize" aria-label="Minimizar Música" title="Minimizar" onClick={() => setIsMusicMinimized(true)}><Minus /></button><button className="mac-window-control zoom" aria-label={isMusicZoomed ? 'Restaurar ventana de Música' : 'Ampliar ventana de Música'} title={isMusicZoomed ? 'Restaurar' : 'Ampliar'} onClick={() => setIsMusicZoomed((value) => !value)}>{isMusicZoomed ? <Minimize2 /> : <Maximize2 />}</button></div>
      <div className="music-art" aria-label="Carátula abstracta de álbum"><span className="album-sun"/><span className="album-horizon"/><span className="album-title">MAZZY STAR</span></div>
      <div className="music-info"><span className="music-label">{playing ? 'REPRODUCIENDO' : 'EN PAUSA'}</span><strong>Fade Into You</strong><span>Mazzy Star</span>
        <div className="track-progress"><i className={playing ? 'is-playing' : ''} /></div>
        <div className="track-controls"><button aria-label="Anterior"><SkipBack /></button><button className="play-button" aria-label={playing ? 'Pausar' : 'Reproducir'} onClick={() => setPlaying(!playing)}>{playing ? <Pause /> : <Play />}</button><button aria-label="Siguiente"><SkipForward /></button></div>
      </div>
      <span className="widget-menu">•••</span>
    </section>}
    <div className="dock" aria-label="Dock"><span className="dock-icon dock-finder" title="Finder"><FolderOpen aria-label="Finder" /></span>{onOpenMail ? <button type="button" className="dock-icon dock-mail" title="Correo" aria-label="Abrir Correo" onClick={() => onOpenMail(true)}><Mail aria-hidden="true" />{mailBadgeVisible && <span className="dock-notification-badge">1</span>}</button> : <span className="dock-icon dock-mail" title="Correo"><Mail aria-label="Correo" /></span>}<button type="button" className="dock-icon dock-assistant" ref={assistantDockRef} title="Asistente IA" aria-label="Abrir Asistente IA" onClick={openAssistant}>◈</button><span className="dock-icon dock-photos" title="Fotos"><Images aria-label="Fotos" /></span><span className="dock-icon dock-settings" title="Configuración"><Settings aria-label="Configuración" /></span></div>
    {autoCursorVisible && <div ref={autoCursorRef} className={`auto-mouse-pointer${autoCursorClicking ? ' clicking' : ''}`} style={{ left: `${autoCursorPosition.x}px`, top: `${autoCursorPosition.y}px` }} aria-hidden="true"><svg viewBox="0 0 24 32"><path d="M3 2.5v23l5.8-5.8 4.1 9.1 4.2-1.9-4.2-9.1h8.2L3 2.5z" /></svg></div>}
    {assistantWindowOpen && <TypewriterTerminal onHome={() => setAssistantWindowOpen(false)} onWindowMinimize={() => setAssistantWindowOpen(false)} onWindowClose={() => { setAssistantWindowOpen(false); setAssistantWindowPosition(null); setAssistantWindowZoomed(false) }} onWindowZoom={() => setAssistantWindowZoomed((value) => !value)} isWindow isWindowZoomed={assistantWindowZoomed} windowPosition={assistantWindowPosition} onWindowPointerDown={startAssistantDrag} onWindowPointerMove={moveAssistantWindow} onWindowPointerUp={endAssistantDrag} />}
    <button className="desktop-back" onClick={onHome}>← Panel</button>
  </main>
}

function WebmailView({ onHome, senderName = 'JULIÁN', senderEmail = 'julian.v@mail.com', subject = 'Video', attachmentVideoUrl = '/assets/video_01.mp4', isAttachmentLoading: startsLoading = false, clockTime = '09:41' }) {
  const [attachmentOpen, setAttachmentOpen] = useState(false)
  const [isAttachmentLoading, setIsAttachmentLoading] = useState(startsLoading)
  const [videoUnavailable, setVideoUnavailable] = useState(false)
  const [isJulianRead, setIsJulianRead] = useState(false)

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
    window.setTimeout(() => setIsAttachmentLoading(false), 1600)
  }

  return <main className="mail-screen">
    <div className="mail-menu"><span className="mail-logo">m</span><strong>Correo</strong><span>Archivo</span><span>Editar</span><span>Ver</span><span>Ventana</span><div className="menu-spacer" /><span>◔</span><span>{clockTime}</span></div>
    <div className="mail-toolbar"><span className="mail-wordmark">buzón<span>.</span></span><label className="mail-search">⌕ <span>Buscar en el correo</span></label><span className="mail-user">M</span></div>
    <div className="mail-layout">
      <aside className="mail-sidebar"><button className="compose-button">＋ <span>Redactar</span></button><div className="mail-folder selected">▣ <span>Recibidos</span>{!isJulianRead && <b>1</b>}</div><div className="mail-folder">☆ <span>Destacados</span></div><div className="mail-folder">◷ <span>Pospuestos</span></div><div className="mail-folder">▤ <span>Enviados</span></div><div className="mail-folder">▱ <span>Borradores</span></div><div className="mail-label-title">ETIQUETAS</div><div className="mail-folder">▰ <span>Personal</span></div></aside>
      <section className={`mail-inbox${attachmentOpen ? ' is-video-open' : ''}`}><div className="inbox-heading"><div><strong>Recibidos</strong><span>{isJulianRead ? 'Todo al día' : '1 mensaje sin leer'}</span></div><span>‹　›</span></div><div className={`mail-row selected${isJulianRead ? ' read' : ' unread'}`} role="button" tabIndex={0} onClick={() => setIsJulianRead(true)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setIsJulianRead(true) } }} aria-label={`${subject}, ${isJulianRead ? 'leído' : 'no leído'}`}>
        {!isJulianRead && <span className="unread-dot" />}<span className="sender-avatar">J</span><div className="mail-row-content"><div className="mail-row-top"><strong>{senderName}</strong><time>09:38</time></div><strong>{subject}</strong><span>Te quería mostrar esto.</span><small>▣ Video adjunto</small></div></div>{promoEmails.map((email, index) => <div className="mail-row read" key={`${email.sender}-${email.subject}-${index}`} role="button" tabIndex={0} onClick={() => {}} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') event.preventDefault() }} aria-label={`${email.subject}, leído`}><span className="sender-avatar" style={{ background: email.color }}>{email.avatar}</span><div className="mail-row-content"><div className="mail-row-top"><strong>{email.sender}</strong><time>{email.time}</time></div><strong>{email.subject}</strong><span>{email.preview}</span></div></div>)}</section>
      <article className="mail-reading"><div className="reading-actions"><button aria-label="Volver a recibidos">←</button><span>▱　☆　⌫　⋮</span></div><div className="mail-subject">{subject} <span>Recibidos ×</span></div><div className="sender-details"><span className="sender-avatar large">J</span><div><strong>{senderName} <span>&lt;{senderEmail}&gt;</span></strong><small>para Martina <span>⌄</span></small></div><time>09:38 <span>☆　⋮</span></time></div><div className="mail-body">Te quería mostrar esto.</div><button className="attachment-card" onClick={openAttachment}><span className="video-thumb"><i>▶</i><small>VIDEO</small></span><span className="attachment-meta"><strong>video_01.mp4</strong><small>Video adjunto · 24 MB</small></span><span className="attachment-action">↗</span></button><div className="mail-reply"><button>↶　Responder</button><button>⋯　Más</button></div></article>
    </div>
    <button className="mail-back" onClick={onHome}>← Panel</button>
    {attachmentOpen && <div className="video-overlay" role="dialog" aria-modal="true" aria-label="Video adjunto"><div className="video-window"><div className="video-window-bar"><span>video_01.mp4</span><button onClick={() => setAttachmentOpen(false)} aria-label="Cerrar">×</button></div><div className="video-stage">{isAttachmentLoading ? <><span className="loading-spinner" /><p>Cargando video adjunto…</p></> : attachmentVideoUrl && !videoUnavailable ? <video className="attached-video" src={attachmentVideoUrl} controls autoPlay onError={() => setVideoUnavailable(true)} /> : <><div className="video-placeholder-mark">▶</div><p>Vista previa del video</p><small>El archivo de video todavía no está disponible.</small></>}</div><div className="video-controls"><button aria-label="Reproducir video">▶</button><span>0:00 / —:—</span><div className="video-track" /><span>◖　⛶</span></div></div></div>}
  </main>
}

function MailDesktopScene({ onHome, clockTime = '09:41' }) {
  const [isMailOpen, setIsMailOpen] = useState(false)
  if (isMailOpen) return <WebmailView onHome={onHome} clockTime={clockTime} />
  return <DesktopView onHome={onHome} wallpaperUrl={assets.desktopWallpaper} showMusic={false} onOpenMail={setIsMailOpen} mailBadgeDelayMs={1800} clockTime={clockTime} />
}

function TypewriterTerminal({ onHome, lines = terminalLines, typingSpeed = 20, isIncognito = true, isWindow = false, isWindowZoomed = false, windowPosition = null, onWindowMinimize, onWindowClose, onWindowZoom, onWindowPointerDown, onWindowPointerMove, onWindowPointerUp }) {
  const [currentText, setCurrentText] = useState('')
  const [sequenceIndex, setSequenceIndex] = useState(0)
  const [isThinking, setIsThinking] = useState(true)
  const [isErasing, setIsErasing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

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
          const pauseBeforeNextLine = lineIndex >= lines.length - 2 ? 1800 : 850
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

  return <main className={`terminal-screen${isWindow ? ' terminal-window-mode' : ''}${isWindowZoomed ? ' is-window-zoomed' : ''}`} style={isWindow && windowPosition && !isWindowZoomed ? { left: `${windowPosition.x}px`, top: `${windowPosition.y}px`, transform: 'none' } : undefined}>
    <div className={isWindow ? 'assistant-app-titlebar' : 'browser-chrome'} onPointerDown={isWindow ? onWindowPointerDown : undefined} onPointerMove={isWindow ? onWindowPointerMove : undefined} onPointerUp={isWindow ? onWindowPointerUp : undefined} onPointerCancel={isWindow ? onWindowPointerUp : undefined}><div className="browser-window-controls">{isWindow ? <><button type="button" className="mac-window-control close" aria-label="Cerrar asistente" title="Cerrar" onClick={onWindowClose}><X /></button><button type="button" className="mac-window-control minimize" aria-label="Minimizar asistente" title="Minimizar" onClick={onWindowMinimize}><Minus /></button><button type="button" className="mac-window-control zoom" aria-label={isWindowZoomed ? 'Restaurar asistente' : 'Ampliar asistente'} title={isWindowZoomed ? 'Restaurar' : 'Ampliar'} onClick={onWindowZoom}>{isWindowZoomed ? <Minimize2 /> : <Maximize2 />}</button></> : <><i /><i /><i /></>}</div>{isWindow ? <strong className="assistant-app-title">asistente<span>.</span></strong> : <><div className="browser-tab"><span className="incognito-symbol">◉</span> Nueva pestaña — Incógnito <b>×</b></div><div className="browser-new-tab">＋</div><div className="browser-address"><span>◉</span><span>{isIncognito ? 'Incógnito' : 'Protocolo privado'}</span><span className="address-divider">|</span><span className="address-muted">La actividad de esta ventana no aparecerá...</span><span className="address-menu">⋮</span></div></>}</div>
    <section className="terminal-content"><div className="terminal-brand"><span className="terminal-emblem">◈</span><div><strong>asistente<span>.</span></strong><small>PROCESO AUTÓNOMO <i>●</i></small></div></div><div className="terminal-rule" />
      <div className="terminal-output assistant-sequence" aria-live="polite"><div className={`assistant-thinking-visual is-thinking${isComplete ? ' is-complete' : ''}`}><span className="assistant-orbit orbit-one"/><span className="assistant-orbit orbit-two"/><span className="assistant-thinking-core">◈</span></div><div className={`assistant-sequence-text${isErasing ? ' is-erasing' : ''}`} aria-live="polite">{currentText}{isThinking && !isErasing && <i className="type-cursor" />}</div><small className="assistant-sequence-counter">{String(Math.min(sequenceIndex + 1, lines.length)).padStart(2, '0')} / {String(lines.length).padStart(2, '0')}</small></div>
      <div className="terminal-footer"><span><i /> CONEXIÓN SEGURA</span><span>IA v.03.17 <b>·</b> LOCAL</span></div></section>
    <button className="terminal-back" onClick={onHome}>← Volver al panel</button>
  </main>
}

function AssistantOrb({ compact = false }) {
  return <div className={`assistant-thinking-visual is-thinking mobile-ai-logo${compact ? ' compact' : ''}`} aria-hidden="true"><span className="assistant-orbit orbit-one"/><span className="assistant-orbit orbit-two"/><span className="assistant-thinking-core">◈</span></div>
}

function MobileAIChat({ onHome, clockTime = '09:41' }) {
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
      <div className="mobile-ai-status"><span>{clockTime}</span><span>●●●　◖　▰</span></div>
      <header className="mobile-ai-header"><button className="mobile-ai-back" onClick={onHome} aria-label="Volver al panel">‹</button><AssistantOrb compact /><div><strong>asistente<span>.</span></strong><small><i /> Disponible</small></div><button className="mobile-ai-menu" aria-label="Opciones">•••</button></header>
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

function WhatsAppMessageBubble({ message, broken = false, onImageError, showTimestamp = true }) {
  const messageText = message.text || message.transcript
  return <article className="chat-bubble">
    {message.audioDuration && !messageText && <div className="chat-audio-note" aria-label={message.sender === 'me' ? 'Nota de voz enviada' : `Nota de voz, ${message.audioDuration}`}><span className="chat-audio-play">▶</span><span className="chat-audio-waveform">{Array.from({ length: 22 }, (_, index) => <i key={index} style={{ height: `${7 + ((index * 7) % 14)}px` }} />)}</span>{message.sender !== 'me' && <small>{message.audioDuration}</small>}</div>}
    {message.photoLabel && <div className="chat-image-fallback"><span>▧</span><small>{message.photoLabel}</small></div>}
    {message.image && (broken ? <div className="chat-image-fallback"><span>▧</span><small>{message.imageAlt || 'Imagen compartida'}</small></div> : <img className="chat-image" src={message.image} alt={message.imageAlt || 'Imagen compartida'} onError={onImageError} />)}
    {messageText && <span className="chat-message-text">{formatWhatsAppChatText(messageText, message.sender)}</span>}
    <footer>{showTimestamp && <time>{message.timestamp || '09:43'}</time>}{message.sender === 'me' && <span className={`message-status ${message.status === 'read' ? 'read' : ''}`}>✓✓</span>}</footer>
  </article>
}

function ChatHistoryPreview({ messages, followingMessages = [], contactName, contactAvatar, onClose }) {
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
    <section className="chat-preview-window" aria-label="Chat">
      <div className="chat-status"><span>09:43</span><span>●●●　◖　▰</span></div>
      <header className="chat-header"><button className="chat-back-arrow" aria-label="Volver al chat completo" onClick={onClose}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg></button><ChatAvatar contactAvatar={contactAvatar} /><div className="chat-contact"><strong>{contactName || 'Número desconocido'}</strong><small>{contactName ? '+54 9 11 1103-1976' : 'últ. vez hoy a las 09:39'}</small></div><button aria-label="Videollamada"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3z"/></svg></button><button aria-label="Llamada"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h3l2 5-2 2a15 15 0 0 0 4 4l2-2 5 2v3c0 1.1-.9 2-2 2C10 19 5 14 5 5c0-1.1.9-2 2-2z"/></svg></button></header>
      <div className="chat-preview-messages">{isTyping && <div className="chat-message-row incoming"><article className="chat-bubble typing-bubble"><span className="typing-dots"><i /><i /><i /></span><span>Escribiendo...</span></article></div>}{[...visibleMessages].reverse().map((message) => <div className={`chat-message-row ${message.sender === 'me' ? 'outgoing' : 'incoming'}`} key={`preview-${message.id}`}><WhatsAppMessageBubble message={message} showTimestamp={Boolean(message.timestamp)} /></div>)}<div className="chat-date-divider">HOY</div></div>
      <div className="chat-composer chat-preview-composer"><button className="composer-add" aria-label="Agregar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button><div className="composer-input"><input className="chat-message-input" aria-label="Mensaje" placeholder="Mensaje" value={draft} disabled={isTyping} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); sendText() } }} /></div><button className="composer-audio" aria-label={draft.trim() ? 'Enviar mensaje' : 'Enviar audio'} disabled={isTyping} onClick={draft.trim() ? sendText : sendAudio}>{draft.trim() ? <Send /> : <Mic />}</button></div>
      <div className="chat-home-indicator" />
    </section>
  </div>
}

function ChatAvatar({ contactAvatar }) {
  const [isOpen, setIsOpen] = useState(false)
  if (!contactAvatar) return <div className="chat-avatar"><span>J</span></div>
  return <>
    <button type="button" className="chat-avatar chat-avatar-button" onClick={() => setIsOpen(true)} aria-label="Ver foto de perfil de Julián"><img src={contactAvatar} alt="" /></button>
    {isOpen && <div className="chat-avatar-lightbox" role="dialog" aria-modal="true" aria-label="Foto de perfil de Julián" onClick={() => setIsOpen(false)}><button type="button" aria-label="Cerrar foto" onClick={() => setIsOpen(false)}>×</button><img src={contactAvatar} alt="Foto de perfil de Julián" onClick={(event) => event.stopPropagation()} /></div>}
  </>
}

function InstagramStory({ onHome, username = 'julian.v', avatarUrl = '', stories = storyData, durationPerStory = 15, clockTime = '09:41' }) {
  const [storyIndex, setStoryIndex] = useState(0)
  const [isStoryOpen, setIsStoryOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const [zoomed, setZoomed] = useState(false)
  const [brokenImages, setBrokenImages] = useState({})
  const progressRef = useRef(0)
  const pointerDownAtRef = useRef(0)
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
            setZoomed(false)
          } else setStoryIndex(storyIndex + 1)
        }
        setProgress(progressRef.current)
      } else previousTime = undefined
      animationFrame = window.requestAnimationFrame(advance)
    }
    animationFrame = window.requestAnimationFrame(advance)
    return () => window.cancelAnimationFrame(animationFrame)
  }, [isStoryOpen, paused, durationPerStory, stories.length, storyIndex, story])

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
      setZoomed(false)
    } else if (direction < 0 && storyIndex === 0) {
      progressRef.current = 0
      setProgress(0)
      return
    } else setStoryIndex(storyIndex + direction)
    progressRef.current = 0
    setProgress(0)
  }

  function startStoryPress(event) {
    event.currentTarget.setPointerCapture?.(event.pointerId)
    pointerDownAtRef.current = performance.now()
    setPaused(true)
  }

  function endStoryPress(direction) {
    const wasHold = performance.now() - pointerDownAtRef.current >= 250
    pointerDownAtRef.current = 0
    setPaused(false)
    if (!wasHold) changeStory(direction)
  }

  function cancelStoryPress() {
    pointerDownAtRef.current = 0
    setPaused(false)
  }

  if (!isStoryOpen) return <InstagramProfile username={username} avatarUrl={avatarUrl} clockTime={clockTime} onOpenStories={() => { setStoryIndex(0); progressRef.current = 0; setProgress(0); setIsStoryOpen(true) }} onHome={onHome} />
  if (!story) return null
  return <main className="story-screen">
    <div className="story-frame">
      <div className={`story-media story-art-${storyIndex % 2} ${zoomed ? 'zoomed' : ''}`}>
        {story.mediaUrl && !brokenImages[story.id] && <img className="story-photo" src={story.mediaUrl} alt={story.caption} onError={() => setBrokenImages((current) => ({ ...current, [story.id]: true }))} />}
        {(!story.mediaUrl || brokenImages[story.id]) && <div className="story-placeholder-art"><span className="moon" /><span className="party-light light-one" /><span className="party-light light-two" /><span className="story-silhouette silhouette-one" /><span className="story-silhouette silhouette-two" />{storyIndex % 2 === 1 && <div className="couple-caption">J<span>&</span>A</div>}</div>}
        <div className="story-scrim" />
        <div className="story-progress-bars">{stories.map((item, index) => <div className="story-progress-track" key={item.id}><i style={{ width: `${index < storyIndex ? 100 : index === storyIndex ? progress * 100 : 0}%` }} /></div>)}</div>
        <div className="story-account"><div className="story-avatar"><span>J</span>{avatarUrl && <img src={avatarUrl} alt="" onError={(event) => { event.currentTarget.style.display = 'none' }} />}</div><strong>{username}</strong><span>1 h</span><button className="story-menu" aria-label="Más opciones">•••</button></div>
        <div className="story-hit-zones"><button aria-label="Historia anterior" onPointerDown={startStoryPress} onPointerUp={() => endStoryPress(-1)} onPointerCancel={cancelStoryPress} onClick={(event) => { if (event.detail === 0) changeStory(-1) }} /><button aria-label="Siguiente historia" onPointerDown={startStoryPress} onPointerUp={() => endStoryPress(1)} onPointerCancel={cancelStoryPress} onClick={(event) => { if (event.detail === 0) changeStory(1) }} /></div>
        <button className="story-zoom" onClick={() => setZoomed((value) => !value)} aria-label={zoomed ? 'Alejar imagen' : 'Ampliar imagen'}>{zoomed ? '⊖' : '⌕'}</button>
        <div className="story-caption">{story.caption}</div>
        <div className="story-reply"><span>Enviar mensaje</span><button aria-label="Me gusta">♡</button><button aria-label="Compartir">➤</button></div>
        {paused && <div className="story-paused-mark">Ⅱ</div>}
      </div>
      <div className="story-notch" />
    </div>
    <button className="story-back" onClick={onHome}>← Panel</button>
  </main>
}

function InstagramProfile({ username, avatarUrl, posts = julianPosts, clockTime = '09:41', onOpenStories, onHome }) {
  return <main className="story-screen">
    <section className="instagram-profile-frame">
      <div className="instagram-profile-status"><span>{clockTime}</span><span>●●●　◖　▰</span></div>
      <header className="instagram-profile-toolbar"><button onClick={onHome} aria-label="Volver al panel">‹</button><strong>{username}</strong><button aria-label="Opciones">•••</button></header>
      <div className="instagram-profile-content">
        <div className="instagram-profile-summary"><button className="instagram-profile-avatar" onClick={onOpenStories} aria-label="Ver historias de Julián"><span>{avatarUrl && <img src={avatarUrl} alt="" />}</span><i>▶</i></button><div className="instagram-profile-stats"><strong>Julián</strong><div><span><b>18</b> publicaciones</span><span><b>246</b> seguidores</span><span><b>318</b> seguidos</span></div></div></div>
        <p className="instagram-profile-bio">Música, cine y alguna foto de madrugada.</p>
        <div className="instagram-profile-actions"><button>Seguir</button><button>Mensaje</button><button aria-label="Compartir perfil">⌄</button></div>
        <button className="instagram-story-highlight" onClick={onOpenStories} aria-label="Abrir historias de Julián"><span>{avatarUrl && <img src={avatarUrl} alt="" />}</span><small>Historia</small></button>
        <div className="instagram-profile-tabs"><span>▦</span><span>▣</span><span>♙</span></div>
        <div className="instagram-profile-grid">{posts.map((post) => <button key={post.id} aria-label={post.caption}><span className="instagram-profile-grid-photo" role="img" aria-label={post.caption} style={{ backgroundImage: `url(${post.mediaUrl})`, backgroundPosition: `${post.position} center` }} /></button>)}</div>
      </div>
      <div className="instagram-profile-bottom"><span>⌂</span><span>⌕</span><button onClick={onOpenStories} aria-label="Abrir historias"><span>{avatarUrl && <img src={avatarUrl} alt="" />}</span></button></div>
      <div className="instagram-profile-home-indicator" />
    </section>
    <button className="story-back" onClick={onHome}>← Panel</button>
  </main>
}

function LockScreen({ onHome, wallpaperUrl = '', notifications = [], notificationDelayMs = 0, notificationStaggerMs = 0, clockTime = '', productionDate = '' }) {
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
  return <main className="lock-screen">
    {wallpaperUrl && !wallpaperFailed && <img className="lock-wallpaper-image" src={wallpaperUrl} alt="" onError={() => setWallpaperFailed(true)} />}
    {(!wallpaperUrl || wallpaperFailed) && <div className="lock-wallpaper-art"><div className="lock-horizon" /><div className="lock-orb" /><div className="lock-shadow lock-shadow-one" /><div className="lock-shadow lock-shadow-two" /></div>}
    <button className="lock-return-hotspot" aria-label="Volver al panel" onClick={() => setCornerTaps((count) => count + 1)} />
    <div className="lock-status"><span>{clock}</span><span>●●●　◖　▰</span></div>
    <div className="lock-date"><span className="lock-symbol">⌑</span><span>{date}</span></div>
    <time className="lock-clock">{clock}</time>
    <div className="lock-notifications">{notifications.map((notification, index) => {
      const notificationKey = notification.id ?? `${notification.title}-${index}`
      if (index >= visibleNotificationCount || dismissedNotifications.has(notificationKey)) return null
      return <article className="lock-notification" key={notificationKey} onPointerDown={(event) => startNotificationSwipe(event, notificationKey)} onPointerUp={(event) => endNotificationSwipe(event, notificationKey)} onPointerCancel={() => { notificationSwipeStart.current = null }}><span className={`notification-app-icon ${notification.kind === 'whatsapp' ? 'whatsapp' : ''}`}>{notification.kind === 'whatsapp' ? '◉' : '◈'}</span><div className="notification-copy"><div><strong>{notification.title}</strong><time>{notification.time ?? 'ahora'}</time></div><p>{notification.message}</p></div></article>
    })}</div>
    <div className="lock-bottom"><span className="lock-shortcut">◉</span><span className="lock-hint"><i /> Deslizá hacia arriba para desbloquear</span><span className="lock-shortcut">◖</span></div>
  </main>
}

function WhatsAppChat({ onHome, contactName = '', contactPhone = '', contactAvatar = '', statusTime = '09:43', initialMessages = julianOpeningMessages, interactive = true, showComposer = interactive, dynamicReplay = false }) {
  const [headerTaps, setHeaderTaps] = useState(0)
  const [brokenImages, setBrokenImages] = useState({})
  const [displayName, setDisplayName] = useState(() => {
    try { return window.localStorage.getItem('julian-contact-name') || contactName } catch { return contactName }
  })
  const [isContactSheetOpen, setIsContactSheetOpen] = useState(false)
  const [contactDraft, setContactDraft] = useState(() => {
    try { return window.localStorage.getItem('julian-contact-name') || contactName || '' } catch { return contactName || '' }
  })
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')
  const [isTyping, setIsTyping] = useState(interactive)
  const [openingReplyPending, setOpeningReplyPending] = useState(interactive)
  const [audioReplyIndex, setAudioReplyIndex] = useState(0)
  const [canSendAudio, setCanSendAudio] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [awaitingInterruptedRecording, setAwaitingInterruptedRecording] = useState(false)
  const [isScrollingMessages, setIsScrollingMessages] = useState(false)
  const scrollEndTimer = useRef(null)
  const checkpointTimers = useRef([])
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

  function setCheckpoint(messageIndex) {
    const checkpoint = messages[messageIndex]
    if (!checkpoint) return
    const sourceIndex = initialMessages.findIndex((message) => message.id === checkpoint.id)
    const following = dynamicReplay && sourceIndex >= 0
      ? initialMessages.slice(sourceIndex + 1)
      : checkpoint.id === 'full-pickup-audio' ? messages.slice(messageIndex + 1, messageIndex + 3) : []
    checkpointTimers.current.forEach(window.clearTimeout)
    checkpointTimers.current = []
    setMessages((current) => current.slice(0, messageIndex + 1))
    setIsTyping(false)
    if (!following.length) return

    const schedule = (delay, callback) => checkpointTimers.current.push(window.setTimeout(callback, delay))
    if (!dynamicReplay) {
      setIsTyping(true)
      schedule(900, () => setIsTyping(false))
      schedule(1450, () => setIsTyping(true))
      schedule(2550, () => {
        setMessages((current) => [...current, following[0]])
        setIsTyping(false)
      })
      schedule(3100, () => setIsTyping(true))
      schedule(4200, () => {
        setMessages((current) => [...current, following[1]])
        setIsTyping(false)
      })
      return
    }

    function playNext(index) {
      if (index >= following.length) {
        setIsTyping(false)
        return
      }
      const message = following[index]
      const appendMessage = () => {
        setMessages((current) => [...current, message])
        setIsTyping(false)
        schedule(message.sender === 'contact' ? 650 : 350, () => playNext(index + 1))
      }

      if (message.id === 'full-personally-1') {
        setIsTyping(true)
        schedule(950, () => setIsTyping(false))
        schedule(1550, () => setIsTyping(true))
        schedule(2800, appendMessage)
      } else {
        if (message.sender === 'contact') setIsTyping(true)
        schedule(message.sender === 'contact' ? 1150 : 650, appendMessage)
      }
    }
    playNext(0)
  }

  function openContactSheet() {
    setContactDraft(displayName || '')
    setIsContactSheetOpen(true)
  }

  function saveContact() {
    const name = contactDraft.trim()
    if (!name) return
    try { window.localStorage.setItem('julian-contact-name', name) } catch { /* Keep the contact saved for this view. */ }
    setDisplayName(name)
    setIsContactSheetOpen(false)
  }

  function deleteContact() {
    try { window.localStorage.removeItem('julian-contact-name') } catch { /* The visible name still resets for this view. */ }
    setDisplayName('')
    setContactDraft('')
    setIsContactSheetOpen(false)
  }

  function sendMessage() {
    const text = draft.trim()
    if (!text || isTyping) return
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

  return <main className="chat-screen">
    <div className="chat-phone">
      <div className="chat-status"><span>{statusTime}</span><span>●●●　◖　▰</span></div>
      <header className="chat-header"><button className="chat-back-arrow" aria-label="Volver" onClick={() => setHeaderTaps((count) => count + 1)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg></button><ChatAvatar contactAvatar={contactAvatar} /><button type="button" className="chat-contact chat-contact-trigger" onClick={openContactSheet} aria-label={displayName ? `Editar contacto ${displayName}` : `Agendar ${contactPhone}`}><strong>{displayName || contactPhone}</strong><small>{displayName ? contactPhone : 'últ. vez hoy a las 09:39'}</small></button><button aria-label="Videollamada"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10-5-3v10l5-3z"/></svg></button><button aria-label="Llamada"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h3l2 5-2 2a15 15 0 0 0 4 4l2-2 5 2v3c0 1.1-.9 2-2 2C10 19 5 14 5 5c0-1.1.9-2 2-2z"/></svg></button><button aria-label="Opciones"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg></button></header>
      <div className={`chat-messages-area${isScrollingMessages ? ' is-scrolling' : ''}`} onScroll={handleMessagesScroll}>{isTyping && <div className="chat-message-row incoming"><article className="chat-bubble typing-bubble"><span className="typing-dots"><i /><i /><i /></span><span>Escribiendo...</span></article></div>}{[...visibleMessages].reverse().map((message, reversedIndex) => { const messageIndex = visibleMessages.length - 1 - reversedIndex; return <div className={`chat-message-row ${message.sender === 'me' ? 'outgoing' : 'incoming'}${interactive ? '' : ' is-previewable'}`} key={message.id} onClick={!interactive ? () => setCheckpoint(messageIndex) : undefined}><WhatsAppMessageBubble message={message} broken={brokenImages[message.id]} onImageError={() => setBrokenImages((current) => ({ ...current, [message.id]: true }))} showTimestamp={interactive || Boolean(message.timestamp)} /></div>})}{interactive && <div className="chat-date-divider">HOY</div>}</div>
      {showComposer && <div className="chat-composer"><button className="composer-add" aria-label="Agregar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button><div className="composer-input">{isRecording ? <div className="chat-recording-active"><i /> Grabando audio... <span>soltá para cancelar</span></div> : <><input className="chat-message-input" aria-label="Mensaje" placeholder="Mensaje" value={draft} disabled={isTyping} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); sendMessage() } }} /><button className="composer-sticker" aria-label="Stickers"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14a1 1 0 0 1 1 1v9l-6 6H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/><path d="M14 20v-5a2 2 0 0 1 2-2h4"/></svg></button></>}</div><button className="composer-camera" aria-label="Cámara"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v11H3V8a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/></svg></button><button className={`composer-audio${isRecording ? ' is-recording' : ''}`} aria-label={awaitingInterruptedRecording ? 'Mantener para grabar audio' : draft.trim() ? 'Enviar mensaje' : 'Enviar audio'} disabled={isTyping || (interactive && !draft.trim() && !canSendAudio && !awaitingInterruptedRecording)} onPointerDown={beginInterruptedRecording} onPointerUp={endInterruptedRecording} onPointerCancel={endInterruptedRecording} onClick={handleMicClick}>{draft.trim() && !awaitingInterruptedRecording ? <Send /> : <Mic />}</button></div>}
      {isContactSheetOpen && <div className="contact-sheet-overlay" onClick={() => setIsContactSheetOpen(false)}><section className="contact-sheet" role="dialog" aria-modal="true" aria-labelledby="contact-sheet-title" onClick={(event) => event.stopPropagation()}><div className="contact-sheet-grabber"/><header><button type="button" onClick={() => setIsContactSheetOpen(false)}>Cancelar</button><strong id="contact-sheet-title">{displayName ? 'Editar contacto' : 'Nuevo contacto'}</strong><button type="button" className="contact-save" disabled={!contactDraft.trim()} onClick={saveContact}>Guardar</button></header><label>Nombre<input value={contactDraft} placeholder="Escribí el nombre" autoFocus onChange={(event) => setContactDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') saveContact() }} /></label><label>Teléfono<input value={contactPhone} readOnly /></label>{displayName && <button type="button" className="contact-delete" onClick={deleteContact}>Eliminar contacto</button>}</section></div>}
      <div className="chat-home-indicator" />
    </div>
  </main>
}

function IncomingCall({ onHome, callerName = 'JULIÁN', callerSubtext = 'llamada entrante', avatarUrl = '', onReject, onAccept }) {
  const [callState, setCallState] = useState('ringing')
  const [seconds, setSeconds] = useState(0)
  const [returnTaps, setReturnTaps] = useState(0)
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
  useEffect(() => { if (returnTaps >= 3) onHome() }, [returnTaps, onHome])

  function rejectCall() {
    setCallState('ended')
    onReject?.()
  }
  function acceptCall() {
    setCallState('connected')
    onAccept?.()
  }
  const duration = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

  if (callState === 'ended') return <main className="call-cut-screen" aria-label="Llamada finalizada"><button onClick={() => setReturnTaps((count) => count + 1)} aria-label="Volver al panel" /></main>
  return <main className="incoming-call-screen">
    <div className="call-wallpaper" />
    <div className="call-status"><span>02:14</span><span>●●●　◖　▰</span></div>
    <div className="call-identity"><div className="call-avatar">{avatarUrl && <img src={avatarUrl} alt="" onError={(event) => { event.currentTarget.style.display = 'none' }} />}<span>J</span></div><h1>{callerName}</h1><p>{callState === 'connected' ? duration : callerSubtext}</p></div>
    <div className="call-actions">{callState === 'ringing' ? <><div className="call-action-group"><button className="call-action reject" onClick={rejectCall} aria-label="Rechazar llamada"><svg className="call-handset decline" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.2c1.1.4 2.3.6 3.6.6a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A18 18 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.3.2 2.5.6 3.6a1 1 0 0 1-.2 1z"/></svg></button><small>Rechazar</small></div><div className="call-action-group"><button className="call-action accept" onClick={acceptCall} aria-label="Aceptar llamada"><svg className="call-handset answer" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.2c1.1.4 2.3.6 3.6.6a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A18 18 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.3.2 2.5.6 3.6a1 1 0 0 1-.2 1z"/></svg></button><small>Aceptar</small></div></> : <><div className="call-action-group"><button className="call-action connected-control" aria-label="Silenciar"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 18v3m-4 0h8"/></svg></button><small>Silenciar</small></div><div className="call-action-group"><button className="call-action connected-control" aria-label="Altavoz"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4zM17 9a5 5 0 0 1 0 6m2.5-9a9 9 0 0 1 0 12"/></svg></button><small>Altavoz</small></div><div className="call-action-group"><button className="call-action reject" onClick={rejectCall} aria-label="Finalizar llamada"><svg className="call-handset decline" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.2c1.1.4 2.3.6 3.6.6a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A18 18 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.3.2 2.5.6 3.6a1 1 0 0 1-.2 1z"/></svg></button><small>Finalizar</small></div></>}</div>
    <button className="call-return-hotspot" onClick={() => setReturnTaps((count) => count + 1)} aria-label="Volver al panel" />
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
