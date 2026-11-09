# Utilería Digital — Invisible

Aplicación React para mostrar en rodaje las pantallas y dispositivos del cortometraje *Invisible*.

## Requisitos

- Node.js 18 o superior
- npm (incluido con Node.js)

## Ejecutar localmente

Desde la raíz del proyecto:

```bash
npm install
npm run dev
```

`npm install` se necesita la primera vez para descargar React, Vite y el plugin de React. Después, iniciá el servidor de desarrollo con `npm run dev` y abrí en el navegador la URL que Vite muestra en la terminal (normalmente `http://localhost:5173`).

## Otros comandos

```bash
npm run build    # Genera la versión de producción en dist/
npm run preview  # Sirve localmente la versión generada
```

Para `npm run preview`, primero ejecutá `npm run build`.

## Estructura

- `src/main.jsx`: dashboard, catálogo de escenas y navegación.
- `src/styles.css`: estilos adaptables a escritorio y móvil.
- `public/assets/`: imágenes y otros recursos locales de rodaje.
- `especificaci_n_y_prompt_guide_para_utiler_a_digital.md`: especificación funcional y lista de tareas.

Las tareas 1.1, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10 y 3.11 están implementadas: el panel muestra las escenas del documento y permite filtrarlas por dispositivo; ESC 1.A, Plano 2 abre una simulación de escritorio 16:9 con un reproductor interactivo de play/pausa; ESC 1.G, Plano 2 abre el correo entrante de Julián y permite abrir una vista previa del video adjunto; ESC 3, Plano 2 muestra el terminal autónomo en modo incógnito con texto progresivo; ESC 1.B, Plano 3 muestra historias verticales con avance automático, controles táctiles, pausa y zoom; ESC 1.C, Planos 1 y 5 muestran la pantalla bloqueada, con dos notificaciones de WhatsApp en Plano 5; ESC 1.C, Planos 7 y 11 muestran los chats de Julián con la identificación y foto de la corona; ESC 1.E, Planos 5 y 8 muestran los chats con la foto del disfraz de Emily y la secuencia de escritura, identificación de Julián y mensaje personal; ESC 1.F, Planos 6 y 9 muestran la conversación sobre la lámpara y la respuesta «sii! me pasa con vos :)»; ESC 1.G, Plano 6 muestra el mensaje nocturno de Julián y Plano 10 la llamada entrante. Las demás rutas de producción todavía abren placeholders. La interfaz usa fuentes del sistema para no depender de fuentes remotas.

## Assets de rodaje

`public/assets/` contiene placeholders vacíos con estos nombres. Reemplazá cada archivo por el asset real conservando exactamente el nombre y la extensión:

- `julian_profile.jpg`
- `party_halloween.jpg`
- `agustina_julian_party.jpg`
- `emily_costume.jpg`
- `crown_photo.jpg`
- `martina_wallpaper_desktop.jpg`
- `martina_wallpaper_mobile.jpg`

Las pantallas ya implementadas apuntan a los wallpapers y fotos de perfil/historias correspondientes. Si un placeholder todavía está vacío, se muestra una ilustración CSS de respaldo. Los archivos de disfraz de Emily y la corona quedan listos para las escenas de chat que se implementarán después.

## Trabajo sin conexión

Una vez instaladas las dependencias, Vite y la aplicación se ejecutan localmente. La app sirve los archivos de `public/assets/` con rutas locales como `/assets/nombre-del-archivo.jpg`, sin depender de una conexión externa.
