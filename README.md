# Utilería Digital — Invisible

Panel web de utilería para preparar y mostrar las pantallas de *Invisible* en rodaje.

**Versión publicada:** [utileria-digital.vercel.app](https://utileria-digital.vercel.app)

## Ejecutar en local

Requiere Node.js 18 o superior y npm.

```bash
npm install
npm run dev
```

Abrí la dirección que muestra Vite. Para probar desde un celular en la misma red Wi-Fi, usá la dirección de red de la computadora, no `localhost`.

Otros comandos:

```bash
npm run build    # Genera dist/
npm run preview  # Previsualiza la versión compilada
```

La carga de archivos en el servidor local está disponible con `npm run dev`; para compartir subidas entre dispositivos, configurá Supabase.

## Desde la página principal

- Filtrar escenas por dispositivo y abrir sus simulaciones de celular o computadora.
- Ajustar fecha, hora, tiempos de correo y video, y los datos del reproductor de música.
- Editar la bio y las cantidades del perfil de Brinstagram.
- Cargar imágenes y videos para las escenas. Las fotos de perfil y publicaciones de Julián empiezan vacías.

## Guardado y sincronización

Sin Supabase, la app conserva los ajustes en el navegador. Al ejecutarla con Vite, también puede guardar los ajustes y archivos en `data/` y `public/assets/`. Si el guardado del servidor no está disponible, los ajustes y archivos se conservan localmente en ese navegador; esas copias no se sincronizan entre dispositivos.

Para compartir ajustes y archivos con Supabase:

1. Ejecutá [`supabase/setup.sql`](supabase/setup.sql) en el SQL Editor del proyecto Supabase.
2. Copiá `.env.example` a `.env.local` y completá `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`.
3. Para el deploy, cargá esas mismas variables en la configuración de entorno de Vercel y volvé a desplegar.

El acceso configurado en `supabase/setup.sql` permite que visitantes sin iniciar sesión cambien los ajustes compartidos y reemplacen los archivos administrados.
