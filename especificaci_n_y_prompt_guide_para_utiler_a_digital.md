# 🎬 Especificación Técnica de Utilería Digital (React App): Cortometraje "Invisible"

Este documento sirve como especificación de requisitos y guía de implementación para construir la aplicación en React/Vite utilizada en set durante el rodaje del cortometraje **"Invisible"**.

## 🎯 Objetivo del Proyecto

Desarrollar una SPA (Single Page Application) interactiva en **React** que contenga pantallas simuladas (Mockups / UIs en vivo) de los dispositivos (Notebook y Celular) del guion.

La pantalla principal (**Home**) funciona como un panel de control con botones organizados por **Escena y Plano**. Al hacer clic en un botón, la app navega a la vista correspondiente lista para ser grabada en cámara.

## 🛠️ Requerimientos Generales para el Asistente de IA (Dev Prompt Guide)

1. **Stack Recomendado:** React + Vite + Tailwind CSS + Lucide Icons (o React Icons) + Framer Motion (para transiciones fluidas de UI).
2. **Arquitectura de Navegación:**
   * **Home (`/`):** Dashboard central con una cuadrícula de botones categorizados por Dispositivo y Escena.
   * **Vistas de Producción (`/scene/:id`):** Cada vista simula la pantalla real a ser filmada. Incluye un botón o gesto discreto para **regresar al Home** (ej. toque triple en la esquina superior izquierda o tecla `Esc`).
3. **Diseño Visual & Aspect Ratios:**
   * **Notebook:** Layout horizontal `16:9` (1920x1080).
   * **Smartphone:** Layout vertical `9:16` (con soporte para simulador de marcos de smartphone y notch/isla dinámica).
4. **Reutilización Obligatoria de Componentes (DRY Principal):**
   * **NO duplicar código de pantallas.** Construir componentes de UI genéricos y configurables mediante `props` o datos cargados desde JSON.
5. **Modo No Molestar / Offline:**
   * No depender de conexiones de red externas durante el rodaje.
   * Cargar todos los assets (imágenes, audios, fotos de perfil) localmente en `/public/assets/`.

---

## 🧩 Arquitectura de Componentes Reutilizables

El asistente de IA debe implementar la siguiente biblioteca de componentes base:

1. **`<WhatsAppChat />`**
   * **Props:** `contactName`, `contactPhone`, `contactAvatar`, `messages` (Array con `{ id, sender, text, image, timestamp, status }`), `isTyping` (boolean).
   * **Uso:** ESC 1.C, ESC 1.E, ESC 1.F, ESC 1.G.

2. **`<LockScreen />`**
   * **Props:** `wallpaperUrl` (Mobile), `notifications` (Array de notificaciones emergentes).
   * **Uso:** ESC 1.C Plano 1 y ESC 1.C Plano 5.

3. **`<InstagramStory />`**
   * **Props:** `username`, `avatarUrl`, `stories` (Array con `{ id, mediaUrl, caption }`), `durationPerStory` (por defecto `15` segundos).
   * **Comportamientos obligatorios:**
     * Avance automático tras 15s con barra de progreso superior animada por historia.
     * Toque/Click derecho para avanzar, toque/click izquierdo para retroceder.
     * Mantenimiento de toque/click (*Press & Hold*) para **pausar** la historia.
     * Soporte para gesto de pellizcar/hacer zoom o botón de zoom interactivo en la imagen.
   * **Uso:** ESC 1.B Plano 3.

4. **`<IncomingCall />`**
   * **Props:** `callerName`, `callerSubtext`, `avatarUrl`, `onReject`, `onAccept`.
   * **Uso:** ESC 1.G Plano 10.

5. **`<WebmailView />`**
   * **Props:** `senderName`, `senderEmail`, `subject`, `attachmentVideoUrl`, `isAttachmentLoading`.
   * **Uso:** ESC 1.G Plano 2.

6. **`<TypewriterTerminal />`**
   * **Props:** `lines` (Array de strings), `typingSpeed`, `isIncognito` (boolean).
   * **Uso:** ESC 3 Plano 2.

---

## 📋 Lista de Tareas e Implementación

### 🔴 FASE 1: Estructura Base, Dashboard Home y Enrutamiento

* [x] **Tarea 1.1: Configuración de Rutas y Dashboard Home**
  * **Requerimiento:** Crear un Dashboard organizado con tarjetas/botones interactivos.
  * **Formato del Botón:**
    * **Título:** `ESC [X], PLANO [Y]`
    * **Subtítulo:** `[Nombre del Dispositivo / Descripción del Asset]`
  * **Ejemplo:** Botón `Título: "ESC 1.C, Plano 1"` | `Subtítulo: "Pantalla de Bloqueo"`.
  * **Acción:** `onClick` -> Navegar a la vista de la escena.

### 💻 FASE 2: Pantallas de Computadora (Notebook) - `16:9`

* [x] **Tarea 2.1: ESC 1.A - Plano 2 | Desktop & Reproductor de Música**
  * **Ruta:** `/notebook/esc1a-p2`
  * **Componente:** `DesktopView`
  * **Assets:** `martina_wallpaper_desktop.jpg` (16:9)
  * **Requerimientos UI:** Fondo de pantalla de escritorio (notebook) + Widget de reproductor de música sonando/pausado.

* [x] **Tarea 2.2: ESC 1.G - Plano 2 | Email Entrante con Video Adjunto**
  * **Ruta:** `/notebook/esc1g-p2`
  * **Componente:** `<WebmailView />`
  * **Requerimientos UI:** Pop-up de mail de **JULIÁN** (`julian.v@mail.com`). Al abrir, reproduce el reproductor con el video adjunto (placeholder de video cargando).

* [x] **Tarea 2.3: ESC 3 - Plano 2 | Pantalla IA Incógnito Autónoma**
  * **Ruta:** `/notebook/esc3-p2`
  * **Componente:** `<TypewriterTerminal />`
  * **Requerimientos UI:** Navegador en modo incógnito con efecto *Typewriter* imprimiendo:
    1. `"Replicando interacciones afectivas..."`
    2. `"Cargando datos visuales de Martina..."`
    3. `"Procesando métricas biométricas..."`
    4. `"Enviando a Martina"`
    5. `"Cruzando historial de ubicación..."`
    6. `"No sos horrible."`
    7. `"No sos invisible."`

### 📱 FASE 3: Pantallas de Celular (Smartphone) - `9:16`

* [x] **Tarea 3.1: ESC 1.B - Plano 3 | Bristagram Stories (Interactivas)**
  * **Ruta:** `/mobile/esc1b-p3`
  * **Componente:** `<InstagramStory />`
  * **Requerimientos UI:**
    * `username`: `"julian.v"`
    * `stories`: 
      1. `party_halloween.jpg` (Ambiente general de la fiesta de Halloween).
      2. `agustina_julian_party.jpg` (Julián sonriendo junto a Agustina).
    * `durationPerStory`: 15 segundos con barra de progreso superior.
    * Funciones de avance/retroceso, pausa al mantener pulsado y capacidad de zoom.

* [x] **Tarea 3.2: ESC 1.C - Plano 1 | Pantalla de Bloqueo**
  * **Ruta:** `/mobile/esc1c-p1`
  * **Componente:** `<LockScreen />`
  * **Asset:** `martina_wallpaper_mobile.jpg` (9:16)
  * **Requerimientos UI:** Wallpaper mobile de Martina, reloj y fecha actual. Sin notificaciones.

* [x] **Tarea 3.3: ESC 1.C - Plano 5 | Notificaciones de WhatsApp de Desconocido**
  * **Ruta:** `/mobile/esc1c-p5`
  * **Componente:** `<LockScreen />`
  * **Asset:** `martina_wallpaper_mobile.jpg` (9:16)
  * **Requerimientos UI:** Notificaciones emergentes del número `+54 9 11 1103-1976`:
    * *"Hola, estas?"*
    * *"estas bien?"*

* [x] **Tarea 3.4: ESC 1.C - Plano 7 | Chat WhatsApp (Identificación de Julián)**
  * **Ruta:** `/mobile/esc1c-p7`
  * **Componente:** `<WhatsAppChat />`
  * **Requerimientos UI:** `contactPhone`: `"+54 9 11 1103-1976"`. Mensajes: *"quien sos?"* / *"Julian"*. Avatar coincide con Bristagram.

* [x] **Tarea 3.5: ESC 1.C - Plano 11 | Chat WhatsApp (Foto de Corona)**
  * **Ruta:** `/mobile/esc1c-p11`
  * **Componente:** `<WhatsAppChat />`
  * **Requerimientos UI:** Foto de la corona (`crown_photo.jpg`) + texto *"te la olvidaste"*.

* [x] **Tarea 3.6: ESC 1.E - Plano 5 | Chat WhatsApp (Foto Disfraz Emily)**
  * **Ruta:** `/mobile/esc1e-p5`
  * **Componente:** `<WhatsAppChat />`
  * **Requerimientos UI:** Texto *"compite con el del año pasado"* + Foto (`emily_costume.jpg`).

* [x] **Tarea 3.7: ESC 1.E - Plano 8 | Chat WhatsApp (Agendado & Animación "Escribiendo...")**
  * **Ruta:** `/mobile/esc1e-p8`
  * **Componente:** `<WhatsAppChat />`
  * **Requerimientos UI:** Estado *"Escribiendo..."*, cambio dinámico del nombre a **JULIÁN** y mensaje: *"y... muchas cosas pero bueno debería contártelas personalmente"*.

* [x] **Tarea 3.8: ESC 1.F - Plano 6 | Chat WhatsApp (Mensaje sobre Lámpara)**
  * **Ruta:** `/mobile/esc1f-p6`
  * **Componente:** `<WhatsAppChat />`
  * **Requerimientos UI:** Mensajes *"de la lampara, la compraste el lunes no?"* y *"lo dijiste en clase"*.

* [x] **Tarea 3.9: ESC 1.F - Plano 9 | Chat WhatsApp (Respuesta Coqueta)**
  * **Ruta:** `/mobile/esc1f-p9`
  * **Componente:** `<WhatsAppChat />`
  * **Requerimientos UI:** Mensaje *"sii! me pasa con vos :)"*.

* [x] **Tarea 3.10: ESC 1.G - Plano 6 | Chat WhatsApp (Mensaje Nocturno Inquietante)**
  * **Ruta:** `/mobile/esc1g-p6`
  * **Componente:** `<WhatsAppChat />`
  * **Requerimientos UI:** Mensaje *"Hasta durmiendo sos hermosa <3"*.

* [x] **Tarea 3.11: ESC 1.G - Plano 10 | Pantalla de Llamada Entrante**
  * **Ruta:** `/mobile/esc1g-p10`
  * **Componente:** `<IncomingCall />`
  * **Requerimientos UI:** Llamada entrante de **JULIÁN**. Al rechazar, simula corte y pantalla negra.

---

## 🎨 Asset Checklist & Requirements

1. **`julian_profile.jpg`**: Foto de cara de Julián (perfil de WhatsApp e historia).
2. **`party_halloween.jpg`**: Foto/Video de ambiente general de fiesta de Halloween (9:16).
3. **`agustina_julian_party.jpg`**: Foto/Video vertical de Julián posando junto a Agustina en la fiesta (9:16).
4. **`emily_costume.jpg`**: Foto de Martina disfrazada de Emily (*El cadáver de la novia*).
5. **`crown_photo.jpg`**: Foto de la corona de reina sobre una superficie.
6. **`martina_wallpaper_desktop.jpg`**: Fondo de pantalla para la laptop (16:9).
7. **`martina_wallpaper_mobile.jpg`**: Fondo de pantalla para el smartphone (9:16).