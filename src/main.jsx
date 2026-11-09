import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './desktop.css'
import './mail.css'
import './terminal.css'
import './story.css'
import './lock.css'
import './chat.css'
import './asset-placeholders.css'
import './call.css'
import './aspect-ratio-fixes.css'

const scenes = [
  { path: '/notebook/esc1a-p2', device: 'Notebook', code: 'ESC 1.A', shot: 'Plano 2', title: 'Escritorio & reproductor', phase: 'Computadora' },
  { path: '/notebook/esc1g-p2', device: 'Notebook', code: 'ESC 1.G', shot: 'Plano 2', title: 'Email con video adjunto', phase: 'Computadora' },
  { path: '/notebook/esc3-p2', device: 'Notebook', code: 'ESC 3', shot: 'Plano 2', title: 'Terminal incógnita', phase: 'Computadora' },
  { path: '/mobile/esc1b-p3', device: 'Celular', code: 'ESC 1.B', shot: 'Plano 3', title: 'Bristagram Stories', phase: 'Celular' },
  { path: '/mobile/esc1c-p1', device: 'Celular', code: 'ESC 1.C', shot: 'Plano 1', title: 'Pantalla de bloqueo', phase: 'Celular' },
  { path: '/mobile/esc1c-p5', device: 'Celular', code: 'ESC 1.C', shot: 'Plano 5', title: 'Notificaciones de WhatsApp', phase: 'Celular' },
  { path: '/mobile/esc1c-p7', device: 'Celular', code: 'ESC 1.C', shot: 'Plano 7', title: 'Chat · identificación de Julián', phase: 'Celular' },
  { path: '/mobile/esc1c-p11', device: 'Celular', code: 'ESC 1.C', shot: 'Plano 11', title: 'Chat · foto de la corona', phase: 'Celular' },
  { path: '/mobile/esc1e-p5', device: 'Celular', code: 'ESC 1.E', shot: 'Plano 5', title: 'Chat · disfraz de Emily', phase: 'Celular' },
  { path: '/mobile/esc1e-p8', device: 'Celular', code: 'ESC 1.E', shot: 'Plano 8', title: 'Chat · escribiendo', phase: 'Celular' },
  { path: '/mobile/esc1f-p6', device: 'Celular', code: 'ESC 1.F', shot: 'Plano 6', title: 'Chat · la lámpara', phase: 'Celular' },
  { path: '/mobile/esc1f-p9', device: 'Celular', code: 'ESC 1.F', shot: 'Plano 9', title: 'Chat · respuesta coqueta', phase: 'Celular' },
  { path: '/mobile/esc1g-p6', device: 'Celular', code: 'ESC 1.G', shot: 'Plano 6', title: 'Chat · mensaje nocturno', phase: 'Celular' },
  { path: '/mobile/esc1g-p10', device: 'Celular', code: 'ESC 1.G', shot: 'Plano 10', title: 'Llamada entrante', phase: 'Celular' },
]
const terminalLines = [
  'Replicando interacciones afectivas...',
  'Cargando datos visuales de Martina...',
  'Procesando métricas biométricas...',
  'Enviando a Martina',
  'Cruzando historial de ubicación...',
  'No sos horrible.',
  'No sos invisible.',
]
const assets = {
  julianAvatar: '/assets/julian_profile.jpg',
  halloweenStory: '/assets/party_halloween.jpg',
  agustinaStory: '/assets/agustina_julian_party.jpg',
  emilyCostume: '/assets/emily_costume.jpg',
  crownPhoto: '/assets/crown_photo.jpg',
  desktopWallpaper: '/assets/martina_wallpaper_desktop.jpg',
  mobileWallpaper: '/assets/martina_wallpaper_mobile.jpg',
}
const storyData = [
  { id: 'halloween', mediaUrl: assets.halloweenStory, caption: 'noche de halloween 🎃' },
  { id: 'friends', mediaUrl: assets.agustinaStory, caption: '🖤' },
]
const personalMessage = {
  id: 'julian-long-message',
  sender: 'contact',
  text: 'y... muchas cosas pero bueno debería contártelas personalmente',
  timestamp: '23:06',
}

function App() {
  const [path, setPath] = useState(window.location.pathname)
  const [filter, setFilter] = useState('Todo')

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

  const selected = scenes.find((scene) => scene.path === path)
  if (selected) {
    if (selected.path === '/notebook/esc1a-p2') return <DesktopView onHome={() => navigate('/')} wallpaperUrl={assets.desktopWallpaper} />
    if (selected.path === '/notebook/esc1g-p2') return <WebmailView onHome={() => navigate('/')} />
    if (selected.path === '/notebook/esc3-p2') return <TypewriterTerminal onHome={() => navigate('/')} />
    if (selected.path === '/mobile/esc1b-p3') return <InstagramStory onHome={() => navigate('/')} avatarUrl={assets.julianAvatar} />
    if (selected.path === '/mobile/esc1c-p1') return <LockScreen onHome={() => navigate('/')} wallpaperUrl={assets.mobileWallpaper} />
    if (selected.path === '/mobile/esc1c-p5') return <LockScreen onHome={() => navigate('/')} shotLabel="ESC 1.C · PLANO 5" notifications={[
      { id: 'unknown-1', title: '+54 9 11 1103-1976', message: 'Hola, estas?', time: 'ahora', kind: 'whatsapp' },
      { id: 'unknown-2', title: '+54 9 11 1103-1976', message: 'estas bien?', time: 'ahora', kind: 'whatsapp' },
    ]} wallpaperUrl={assets.mobileWallpaper} />
    if (selected.path === '/mobile/esc1c-p7') return <WhatsAppChat onHome={() => navigate('/')} statusTime="09:43" contactPhone="+54 9 11 1103-1976" messages={[
      { id: 'who', sender: 'me', text: 'quien sos?', timestamp: '09:42', status: 'read' },
      { id: 'julian', sender: 'contact', text: 'Julian', timestamp: '09:43' },
    ]} contactAvatar={assets.julianAvatar} />
    if (selected.path === '/mobile/esc1c-p11') return <WhatsAppChat onHome={() => navigate('/')} statusTime="22:16" contactName="JULIÁN" contactPhone="+54 9 11 1103-1976" contactAvatar={assets.julianAvatar} shotLabel="ESC 1.C · PLANO 11" messages={[
      { id: 'crown', sender: 'contact', text: 'te la olvidaste', image: assets.crownPhoto, imageAlt: 'Foto de una corona', timestamp: '22:16' },
    ]} />
    if (selected.path === '/mobile/esc1e-p5') return <WhatsAppChat onHome={() => navigate('/')} statusTime="20:17" contactName="JULIÁN" contactPhone="+54 9 11 1103-1976" contactAvatar={assets.julianAvatar} shotLabel="ESC 1.E · PLANO 5" messages={[
      { id: 'emily', sender: 'contact', text: 'compite con el del año pasado', image: assets.emilyCostume, imageAlt: 'Foto de Martina disfrazada de Emily', timestamp: '20:17' },
    ]} />
    if (selected.path === '/mobile/esc1e-p8') return <WhatsAppChat onHome={() => navigate('/')} statusTime="23:06" contactPhone="+54 9 11 1103-1976" contactAvatar={assets.julianAvatar} shotLabel="ESC 1.E · PLANO 8" revealContactName="JULIÁN" typingMessage={personalMessage} />
    if (selected.path === '/mobile/esc1f-p6') return <WhatsAppChat onHome={() => navigate('/')} statusTime="18:25" contactName="JULIÁN" contactPhone="+54 9 11 1103-1976" contactAvatar={assets.julianAvatar} shotLabel="ESC 1.F · PLANO 6" messages={[
      { id: 'lamp-question', sender: 'contact', text: 'de la lampara, la compraste el lunes no?', timestamp: '18:24' },
      { id: 'lamp-followup', sender: 'contact', text: 'lo dijiste en clase', timestamp: '18:25' },
    ]} />
    if (selected.path === '/mobile/esc1f-p9') return <WhatsAppChat onHome={() => navigate('/')} statusTime="18:32" contactName="JULIÁN" contactPhone="+54 9 11 1103-1976" contactAvatar={assets.julianAvatar} shotLabel="ESC 1.F · PLANO 9" messages={[
      { id: 'flirty-reply', sender: 'me', text: 'sii! me pasa con vos :)', timestamp: '18:32', status: 'read' },
    ]} />
    if (selected.path === '/mobile/esc1g-p6') return <WhatsAppChat onHome={() => navigate('/')} statusTime="02:14" contactName="JULIÁN" contactPhone="+54 9 11 1103-1976" contactAvatar={assets.julianAvatar} shotLabel="ESC 1.G · PLANO 6" messages={[
      { id: 'night-message', sender: 'contact', text: 'Hasta durmiendo sos hermosa <3', timestamp: '02:14' },
    ]} />
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

      <section className="intro">
        <p className="eyebrow">PANEL DE RODAJE <span>·</span> CORTOMETRAJE</p>
        <h1>Todo a punto<br /><em>para rodar.</em></h1>
        <p className="intro-copy">Elegí una escena y abrí la pantalla que necesitás en cámara.</p>
        <div className="summary"><strong>{String(scenes.length).padStart(2, '0')}</strong><span>VISTAS<br />PREPARADAS</span><b /> <span>INVISIBLE<br />UTILERÍA DIGITAL</span></div>
      </section>

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
      <footer><span>INVISIBLE <i>·</i> UTILERÍA DIGITAL</span><span>HERRAMIENTAS DE RODAJE <b>01 / 01</b></span></footer>
    </main>
  )
}

function DesktopView({ onHome, wallpaperUrl = '' }) {
  const [playing, setPlaying] = useState(true)
  const [time, setTime] = useState('09:41')

  useEffect(() => {
    const updateTime = () => setTime(new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit' }).format(new Date()))
    updateTime()
    const timer = window.setInterval(updateTime, 30_000)
    const onKeyDown = (event) => { if (event.key === 'Escape') onHome() }
    window.addEventListener('keydown', onKeyDown)
    return () => { window.clearInterval(timer); window.removeEventListener('keydown', onKeyDown) }
  }, [onHome])

  return <main className="desktop-screen">
    <div className="desktop-wallpaper">{wallpaperUrl && <img className="desktop-wallpaper-photo" src={wallpaperUrl} alt="" onError={(event) => { event.currentTarget.style.display = 'none' }} />}</div>
    <div className="desktop-menu"><span className="apple-mark">●</span><strong>Finder</strong><span>Archivo</span><span>Edición</span><span>Visualización</span><span>Ir</span><span>Ventana</span><span>Ayuda</span><div className="menu-spacer" /><span className="wifi-mark">◔</span><span>{time}</span></div>
    <div className="desktop-icons" aria-hidden="true"><div className="desktop-icon"><span>▧</span><small>Proyectos</small></div><div className="desktop-icon"><span>▱</span><small>Notas</small></div><div className="desktop-icon"><span>♫</span><small>Música</small></div></div>
    <section className="music-widget" aria-label="Reproductor de música">
      <div className="music-art"><span>♫</span><i /></div>
      <div className="music-info"><span className="music-label">{playing ? 'REPRODUCIENDO' : 'EN PAUSA'}</span><strong>Fade Into You</strong><span>Mazzy Star</span>
        <div className="track-progress"><i className={playing ? 'is-playing' : ''} /></div>
        <div className="track-controls"><button aria-label="Anterior">|◀</button><button className="play-button" aria-label={playing ? 'Pausar' : 'Reproducir'} onClick={() => setPlaying(!playing)}>{playing ? 'Ⅱ' : '▶'}</button><button aria-label="Siguiente">▶|</button></div>
      </div>
      <span className="widget-menu">•••</span>
    </section>
    <div className="dock"><span>◉</span><span>✉</span><span>◈</span><span>♫</span><span>⚙</span></div>
    <button className="desktop-back" onClick={onHome}>← Panel</button>
    <div className="desktop-shot-label">ESC 1.A <i>·</i> PLANO 2</div>
  </main>
}

function WebmailView({ onHome, senderName = 'JULIÁN', senderEmail = 'julian.v@mail.com', subject = 'Video', attachmentVideoUrl = '', isAttachmentLoading: startsLoading = false }) {
  const [attachmentOpen, setAttachmentOpen] = useState(false)
  const [isAttachmentLoading, setIsAttachmentLoading] = useState(startsLoading)

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
    setAttachmentOpen(true)
    setIsAttachmentLoading(true)
    window.setTimeout(() => setIsAttachmentLoading(false), 1600)
  }

  return <main className="mail-screen">
    <div className="mail-menu"><span className="mail-logo">m</span><strong>Correo</strong><span>Archivo</span><span>Editar</span><span>Ver</span><span>Ventana</span><div className="menu-spacer" /><span>◔</span><span>09:41</span></div>
    <div className="mail-toolbar"><span className="mail-wordmark">buzón<span>.</span></span><label className="mail-search">⌕ <span>Buscar en el correo</span></label><span className="mail-user">M</span></div>
    <div className="mail-layout">
      <aside className="mail-sidebar"><button className="compose-button">＋ <span>Redactar</span></button><div className="mail-folder selected">▣ <span>Recibidos</span><b>1</b></div><div className="mail-folder">☆ <span>Destacados</span></div><div className="mail-folder">◷ <span>Pospuestos</span></div><div className="mail-folder">▤ <span>Enviados</span></div><div className="mail-folder">▱ <span>Borradores</span></div><div className="mail-label-title">ETIQUETAS</div><div className="mail-folder">▰ <span>Personal</span></div></aside>
      <section className="mail-inbox"><div className="inbox-heading"><div><strong>Recibidos</strong><span>1 mensaje sin leer</span></div><span>‹　›</span></div><div className="mail-row selected"><span className="unread-dot" /><span className="sender-avatar">J</span><div className="mail-row-content"><div className="mail-row-top"><strong>{senderName}</strong><time>09:38</time></div><strong>{subject}</strong><span>Te quería mostrar esto.</span><small>▣ Video adjunto</small></div></div><div className="mail-row muted"><span className="unread-dot" /><span className="sender-avatar soft">A</span><div className="mail-row-content"><div className="mail-row-top"><strong>Archivo</strong><time>AYER</time></div><strong>Material de rodaje</strong><span>Adjuntos de la semana...</span></div></div></section>
      <article className="mail-reading"><div className="reading-actions"><button aria-label="Volver a recibidos">←</button><span>▱　☆　⌫　⋮</span></div><div className="mail-subject">{subject} <span>Recibidos ×</span></div><div className="sender-details"><span className="sender-avatar large">J</span><div><strong>{senderName} <span>&lt;{senderEmail}&gt;</span></strong><small>para Martina <span>⌄</span></small></div><time>09:38 <span>☆　⋮</span></time></div><div className="mail-body">Te quería mostrar esto.</div><button className="attachment-card" onClick={openAttachment}><span className="video-thumb"><i>▶</i><small>VIDEO</small></span><span className="attachment-meta"><strong>video_01.mp4</strong><small>Video adjunto · 24 MB</small></span><span className="attachment-action">↗</span></button><div className="mail-reply"><button>↶　Responder</button><button>⋯　Más</button></div></article>
    </div>
    <button className="mail-back" onClick={onHome}>← Panel</button><span className="mail-shot-label">ESC 1.G <i>·</i> PLANO 2</span>
    {attachmentOpen && <div className="video-overlay" role="dialog" aria-modal="true" aria-label="Video adjunto"><div className="video-window"><div className="video-window-bar"><span>video_01.mp4</span><button onClick={() => setAttachmentOpen(false)} aria-label="Cerrar">×</button></div><div className="video-stage">{isAttachmentLoading ? <><span className="loading-spinner" /><p>Cargando video adjunto…</p></> : attachmentVideoUrl ? <video className="attached-video" src={attachmentVideoUrl} controls autoPlay /> : <><div className="video-placeholder-mark">▶</div><p>Vista previa del video</p><small>El archivo de video no está disponible localmente.</small></>}</div><div className="video-controls"><button aria-label="Reproducir video">▶</button><span>0:00 / —:—</span><div className="video-track" /><span>◖　⛶</span></div></div></div>}
  </main>
}

function TypewriterTerminal({ onHome, lines = terminalLines, typingSpeed = 42, isIncognito = true }) {
  const [visibleLines, setVisibleLines] = useState([])
  const [currentText, setCurrentText] = useState('')

  useEffect(() => {
    let lineIndex = 0
    let charIndex = 0
    let pause = 0
    let timer
    const tick = () => {
      if (lineIndex >= lines.length) return
      const line = lines[lineIndex]
      if (charIndex < line.length) {
        charIndex += 1
        setCurrentText(line.slice(0, charIndex))
        timer = window.setTimeout(tick, typingSpeed)
      } else {
        setVisibleLines((current) => [...current, line])
        setCurrentText('')
        lineIndex += 1
        charIndex = 0
        pause += 1
        timer = window.setTimeout(tick, pause > 4 ? 950 : 500)
      }
    }
    timer = window.setTimeout(tick, 800)
    return () => window.clearTimeout(timer)
  }, [lines, typingSpeed])

  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === 'Escape') onHome() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onHome])

  const currentIndex = visibleLines.length
  return <main className="terminal-screen">
    <div className="browser-chrome"><div className="browser-window-controls"><i /><i /><i /></div><div className="browser-tab"><span className="incognito-symbol">◉</span> Nueva pestaña — Incógnito <b>×</b></div><div className="browser-new-tab">＋</div><div className="browser-address"><span>◉</span><span>{isIncognito ? 'Incógnito' : 'Protocolo privado'}</span><span className="address-divider">|</span><span className="address-muted">La actividad de esta ventana no aparecerá...</span><span className="address-menu">⋮</span></div></div>
    <section className="terminal-content"><div className="terminal-brand"><span className="terminal-emblem">◈</span><div><strong>asistente<span>.</span></strong><small>PROCESO AUTÓNOMO <i>●</i></small></div></div><div className="terminal-rule" />
      <div className="terminal-output" aria-live="polite">{visibleLines.map((line, index) => <div key={`${index}-${line}`} className={`terminal-line ${index >= 5 ? 'terminal-emphasis' : ''}`}><span className="line-marker">{index >= 5 ? '›' : '✓'}</span><span>{line}</span><small>{index < 5 ? 'COMPLETADO' : 'MENSAJE'}</small></div>)}{currentIndex < lines.length && <div className={`terminal-line typing ${currentIndex >= 5 ? 'terminal-emphasis' : ''}`}><span className="line-marker">{currentIndex >= 5 ? '›' : '›'}</span><span>{currentText}<i className="type-cursor" /></span></div>}{currentIndex >= lines.length && <div className="terminal-complete"><span /> SESIÓN COMPLETADA</div>}</div>
      <div className="terminal-footer"><span><i /> CONEXIÓN SEGURA</span><span>IA v.03.17 <b>·</b> LOCAL</span></div></section>
    <button className="terminal-back" onClick={onHome}>← Volver al panel</button><span className="terminal-shot-label">ESC 3 <i>·</i> PLANO 2</span>
  </main>
}

function InstagramStory({ onHome, username = 'julian.v', avatarUrl = '', stories = storyData, durationPerStory = 15 }) {
  const [storyIndex, setStoryIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const [zoomed, setZoomed] = useState(false)
  const [brokenImages, setBrokenImages] = useState({})
  const progressRef = useRef(0)
  const story = stories[storyIndex]

  useEffect(() => {
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
          setStoryIndex((index) => (index + 1) % stories.length)
        }
        setProgress(progressRef.current)
      } else previousTime = undefined
      animationFrame = window.requestAnimationFrame(advance)
    }
    animationFrame = window.requestAnimationFrame(advance)
    return () => window.cancelAnimationFrame(animationFrame)
  }, [paused, durationPerStory, stories.length])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onHome()
      if (event.key === 'ArrowRight') changeStory(1)
      if (event.key === 'ArrowLeft') changeStory(-1)
      if (event.key === ' ') setPaused((value) => !value)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onHome, stories.length])

  function changeStory(direction) {
    setStoryIndex((index) => (index + direction + stories.length) % stories.length)
    progressRef.current = 0
    setProgress(0)
  }

  if (!story) return null
  return <main className="story-screen">
    <div className="story-frame">
      <div className={`story-media story-art-${storyIndex % 2} ${zoomed ? 'zoomed' : ''}`}>
        {story.mediaUrl && !brokenImages[story.id] && <img className="story-photo" src={story.mediaUrl} alt={story.caption} onError={() => setBrokenImages((current) => ({ ...current, [story.id]: true }))} />}
        {(!story.mediaUrl || brokenImages[story.id]) && <div className="story-placeholder-art"><span className="moon" /><span className="party-light light-one" /><span className="party-light light-two" /><span className="story-silhouette silhouette-one" /><span className="story-silhouette silhouette-two" />{storyIndex % 2 === 1 && <div className="couple-caption">J<span>&</span>A</div>}</div>}
        <div className="story-scrim" />
        <div className="story-progress-bars">{stories.map((item, index) => <div className="story-progress-track" key={item.id}><i style={{ width: `${index < storyIndex ? 100 : index === storyIndex ? progress * 100 : 0}%` }} /></div>)}</div>
        <div className="story-account"><div className="story-avatar"><span>J</span>{avatarUrl && <img src={avatarUrl} alt="" onError={(event) => { event.currentTarget.style.display = 'none' }} />}</div><strong>{username}</strong><span>12 h</span><button className="story-menu" aria-label="Más opciones">•••</button></div>
        <div className="story-hit-zones"><button aria-label="Historia anterior" onPointerDown={() => setPaused(true)} onPointerUp={() => { setPaused(false); changeStory(-1) }} /><button aria-label="Siguiente historia" onPointerDown={() => setPaused(true)} onPointerUp={() => { setPaused(false); changeStory(1) }} /></div>
        <button className="story-zoom" onClick={() => setZoomed((value) => !value)} aria-label={zoomed ? 'Alejar imagen' : 'Ampliar imagen'}>{zoomed ? '⊖' : '⌕'}</button>
        <div className="story-caption">{story.caption}</div>
        <div className="story-reply"><span>Enviar mensaje</span><button aria-label="Me gusta">♡</button><button aria-label="Compartir">➤</button></div>
        {paused && <div className="story-paused-mark">Ⅱ</div>}
      </div>
      <div className="story-notch" />
    </div>
    <button className="story-back" onClick={onHome}>← Panel</button><span className="story-shot-label">ESC 1.B <i>·</i> PLANO 3</span>
  </main>
}

function LockScreen({ onHome, wallpaperUrl = '', notifications = [], shotLabel = 'ESC 1.C · PLANO 1' }) {
  const [now, setNow] = useState(new Date())
  const [cornerTaps, setCornerTaps] = useState(0)
  const [wallpaperFailed, setWallpaperFailed] = useState(false)

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

  const clock = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false }).format(now)
  const date = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }).format(now)
  return <main className="lock-screen">
    {wallpaperUrl && !wallpaperFailed && <img className="lock-wallpaper-image" src={wallpaperUrl} alt="" onError={() => setWallpaperFailed(true)} />}
    {(!wallpaperUrl || wallpaperFailed) && <div className="lock-wallpaper-art"><div className="lock-horizon" /><div className="lock-orb" /><div className="lock-shadow lock-shadow-one" /><div className="lock-shadow lock-shadow-two" /></div>}
    <button className="lock-return-hotspot" aria-label="Volver al panel" onClick={() => setCornerTaps((count) => count + 1)} />
    <div className="lock-status"><span>{clock}</span><span>●●●　◖　▰</span></div>
    <div className="lock-date"><span className="lock-symbol">⌑</span><span>{date}</span></div>
    <time className="lock-clock">{clock}</time>
    <div className="lock-notifications">{notifications.map((notification, index) => <article className="lock-notification" key={notification.id ?? `${notification.title}-${index}`}><span className={`notification-app-icon ${notification.kind === 'whatsapp' ? 'whatsapp' : ''}`}>{notification.kind === 'whatsapp' ? '◉' : '◈'}</span><div className="notification-copy"><div><strong>{notification.title}</strong><time>{notification.time ?? 'ahora'}</time></div><p>{notification.message}</p></div></article>)}</div>
    <div className="lock-bottom"><span className="lock-shortcut">◉</span><span className="lock-hint"><i /> Deslizá hacia arriba para desbloquear</span><span className="lock-shortcut">◖</span></div>
    <span className="lock-shot-label">{shotLabel}</span>
  </main>
}

function WhatsAppChat({ onHome, contactName = '', contactPhone = '', contactAvatar = '', messages = [], isTyping = false, shotLabel = 'ESC 1.C · PLANO 7', revealContactName = '', typingMessage = null, statusTime = '09:43' }) {
  const [headerTaps, setHeaderTaps] = useState(0)
  const [brokenImages, setBrokenImages] = useState({})
  const [displayName, setDisplayName] = useState(contactName)
  const [sequenceMessage, setSequenceMessage] = useState(null)
  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === 'Escape') onHome() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onHome])
  useEffect(() => { if (headerTaps >= 3) onHome() }, [headerTaps, onHome])
  useEffect(() => {
    if (!typingMessage) return undefined
    const nameTimer = window.setTimeout(() => setDisplayName(revealContactName), 1600)
    const messageTimer = window.setTimeout(() => setSequenceMessage(typingMessage), 4200)
    return () => { window.clearTimeout(nameTimer); window.clearTimeout(messageTimer) }
  }, [revealContactName, typingMessage])

  const visibleMessages = sequenceMessage ? [...messages, sequenceMessage] : messages
  const typingVisible = isTyping || (Boolean(typingMessage) && !sequenceMessage)

  return <main className="chat-screen">
    <div className="chat-phone">
      <div className="chat-status"><span>{statusTime}</span><span>●●●　◖　▰</span></div>
      <header className="chat-header"><button className="chat-back-arrow" aria-label="Volver" onClick={() => setHeaderTaps((count) => count + 1)}>‹</button><div className="chat-avatar"><span>J</span>{contactAvatar && <img src={contactAvatar} alt="" onError={(event) => { event.currentTarget.style.display = 'none' }} />}</div><div className="chat-contact"><strong>{displayName || contactPhone}</strong><small>{displayName ? contactPhone : 'últ. vez hoy a las 09:39'}</small></div><button aria-label="Videollamada">▣</button><button aria-label="Llamada">☎</button><button aria-label="Opciones">⋮</button></header>
      <div className="chat-messages-area"><div className="chat-date-divider">HOY</div>{visibleMessages.map((message) => <div className={`chat-message-row ${message.sender === 'me' ? 'outgoing' : 'incoming'}`} key={message.id}><article className="chat-bubble">{message.image && (brokenImages[message.id] ? <div className="chat-image-fallback"><span>▧</span><small>{message.imageAlt || 'Imagen compartida'}</small></div> : <img className="chat-image" src={message.image} alt={message.imageAlt || 'Imagen compartida'} onError={() => setBrokenImages((current) => ({ ...current, [message.id]: true }))} />)}{message.text && <span className="chat-message-text">{message.text}</span>}<footer><time>{message.timestamp || '09:43'}</time>{message.sender === 'me' && <span className={`message-status ${message.status === 'read' ? 'read' : ''}`}>✓✓</span>}</footer></article></div>)}{typingVisible && <div className="chat-message-row incoming"><article className="chat-bubble typing-bubble"><span className="typing-dots"><i /><i /><i /></span><span>Escribiendo...</span></article></div>}</div>
      <div className="chat-composer"><button aria-label="Agregar">＋</button><div className="composer-input">Mensaje</div><button aria-label="Stickers">▧</button><button aria-label="Cámara">▣</button><button aria-label="Audio">●</button></div>
      <div className="chat-home-indicator" />
    </div>
    <span className="chat-shot-label">{shotLabel}</span>
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
    <div className="call-actions">{callState === 'ringing' ? <><button className="call-action reject" onClick={rejectCall} aria-label="Rechazar llamada"><span>☎</span></button><button className="call-action accept" onClick={acceptCall} aria-label="Aceptar llamada"><span>☎</span></button><div><small>Rechazar</small><small>Aceptar</small></div></> : <><button className="call-action connected-control" aria-label="Silenciar">◖</button><button className="call-action connected-control" aria-label="Altavoz">◉</button><button className="call-action reject" onClick={rejectCall} aria-label="Finalizar llamada"><span>☎</span></button><div><small>Silenciar</small><small>Altavoz</small><small>Finalizar</small></div></>}</div>
    <button className="call-return-hotspot" onClick={() => setReturnTaps((count) => count + 1)} aria-label="Volver al panel" />
    <span className="call-shot-label">ESC 1.G <i>·</i> PLANO 10</span>
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
