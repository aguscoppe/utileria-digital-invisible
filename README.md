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

Para cargar archivos desde un celular, conectá el celular y la computadora a la misma red Wi-Fi y abrí desde el celular la dirección de red que muestra Vite (por ejemplo, `http://192.168.1.20:5173`). No uses `localhost` en el celular: esa dirección apunta al propio teléfono.

Sin configurar una nube, la configuración y los archivos se guardan en la computadora que ejecuta el proyecto (`data/project-database.json` y `public/assets/`).

### Sincronizar subidas desde cualquier lugar

La app puede usar Supabase para compartir configuración y archivos entre dispositivos. Para activarlo:

1. Creá un proyecto Supabase y ejecutá [`supabase/setup.sql`](supabase/setup.sql) en su SQL Editor.
2. No hace falta crear usuarios de Authentication para usar esta app.
3. Copiá `.env.example` a `.env.local` y completá `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` con los datos del proyecto.
4. Reiniciá Vite o volvé a compilar y desplegar la app.
5. En **Carga de archivos**, cualquiera puede subir o reemplazar los 13 assets administrados. Los ajustes compartidos también se guardan sin iniciar sesión.

El bucket de archivos es público para que las escenas puedan mostrar imágenes y videos. Las reglas anónimas limitan la escritura a los nombres de archivo administrados por la app y a 100 MB por archivo, pero cualquier visitante puede reemplazarlos o borrarlos. Cualquier visitante también puede cambiar los ajustes compartidos (fecha, hora, número y bio). Los datos personalizados que hoy estén solo en `data/` o en `public/assets/` de una computadora no se migran solos: hay que volver a cargar esos archivos y configurar los ajustes una vez en la app conectada a Supabase.

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

Usá **Carga de archivos** en la pantalla principal para cargar wallpapers, fotos de perfil, publicaciones, historias, fotos del chat y video. Las imágenes pueden subirse en formatos comunes del teléfono; el servidor detecta la extensión y la app busca el archivo con su extensión real. Las fotos de perfil y publicaciones de Julián empiezan vacías hasta que se carguen imágenes del proyecto.

Con Supabase configurado, los ajustes y el índice de assets se guardan en `project_state`, y los archivos binarios en el bucket `project-assets`. Sin esa configuración, se usa el almacenamiento local descrito arriba. Si la base de datos o el servidor no están disponibles, la app sigue usando los ajustes del navegador y los archivos incluidos; las cargas hechas sin conexión se guardan en el navegador con IndexedDB y se aplican a las escenas de ese dispositivo. Esas cargas locales no se sincronizan automáticamente con Supabase.

## Trabajo sin conexión

Una vez instaladas las dependencias, Vite y la aplicación se ejecutan localmente. El modo local sirve archivos desde `public/assets/`; el modo Supabase necesita conexión a internet para cargar y actualizar archivos.
