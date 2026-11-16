# Requisitos: Utilería Digital Invisible

Documento de requisitos funcionales basado en las notas de revisión. Los criterios describen el resultado observable esperado; los formatos de archivo admitidos y los controles existentes deben confirmarse al contrastarlos con el código del repositorio.

## R1. Adaptación a pantallas grandes

Las vistas diseñadas para celular deben ampliarse automáticamente al mostrarse en una pantalla grande. Deben conservar sus proporciones, quedar centradas y verse completas, sin recortes ni elementos superpuestos.

**Criterios de aceptación**
- En una pantalla grande, cada vista móvil se muestra ampliada sin que la persona tenga que hacer zoom manualmente.
- La vista conserva la proporción de su diseño y no presenta contenido cortado ni controles superpuestos.

## R2. Legibilidad de notificaciones de WhatsApp

Aumentar el tamaño del texto de las notificaciones de WhatsApp para que se lea con facilidad y se mantenga visible el contenido completo.

**Criterios de aceptación**
- El texto de la notificación se puede leer claramente en la vista correspondiente.
- El ajuste de tamaño no corta ni oculta el texto.

## R3. Perfil de Instagram de Julián

Eliminar el borde gris de las fotos del perfil y hacer que las publicaciones se vean uniformes en tamaño y alineación, sin deformar las imágenes. Quitar los símbolos decorativos que no correspondan a controles reconocibles de Instagram.

**Criterios de aceptación**
- Las fotos no muestran el borde gris.
- Las publicaciones se ven alineadas y uniformes, conservando la proporción de cada imagen.
- No aparecen símbolos extraños o decorativos que no aporten información ni parezcan parte de Instagram.

## R4. Historia de Instagram

Quitar la opción de lupa de la historia. Al pausar la historia, detener su reproducción para que pueda verse durante más tiempo, sin mostrar un símbolo de pausa.

**Criterios de aceptación**
- La vista de la historia no incluye una opción de lupa.
- Al pausarla, la historia queda detenida y no aparece ningún icono o texto de pausa.

## R5. Pantalla de llamada entrante

Eliminar los símbolos innecesarios o poco creíbles de la parte superior. Los controles de aceptar y rechazar deben permitir deslizar el botón hacia arriba y mostrar una animación que acompañe el gesto.

**Criterios de aceptación**
- La parte superior no muestra símbolos extraños o innecesarios.
- Se puede aceptar o rechazar la llamada deslizando hacia arriba el control correspondiente.
- La animación responde al gesto y deja claro el resultado de aceptar o rechazar.

## R6. Pantalla durante la llamada

Al aceptar la llamada, mostrar una pantalla de llamada activa con un contador, un control para cortar y un botón de altavoz visible. El botón de altavoz es visual y no necesita tener funcionalidad.

Al cortar la llamada, mostrar el texto “Llamada finalizada” durante aproximadamente 3 segundos y después cambiar a una pantalla negra.

**Criterios de aceptación**
- La pantalla activa aparece al aceptar la llamada.
- El contador comienza en 0:00 y avanza cada segundo.
- La pantalla incluye un botón para cortar la llamada y un botón de altavoz.
- Al cortar, aparece “Llamada finalizada” por aproximadamente 3 segundos y luego se muestra una pantalla negra.

## R7. Encabezado de chats de WhatsApp

Eliminar de la parte superior de los chats los símbolos extraños que no parezcan controles propios de WhatsApp o no aporten información.

**Criterios de aceptación**
- El encabezado del chat no muestra símbolos decorativos o poco creíbles.
- Se conservan únicamente los controles e indicadores que forman parte de la interfaz prevista.

## R8. Respuesta del chat dinámico

El mensaje previsto de Martina debe esperar hasta que la persona escriba y envíe un mensaje. Después del envío, debe mostrarse la respuesta estipulada. Martina no debe continuar enviando mensajes automáticamente mientras no haya un nuevo mensaje enviado.

**Criterios de aceptación**
- Abrir el chat y esperar no produce mensajes nuevos de Martina.
- Enviar un mensaje activa la respuesta estipulada.
- La secuencia no continúa automáticamente sin otro mensaje enviado por la persona.

## R9. Carga de archivos para actualizar las pantallas

Reparar la carga de archivos para que un archivo admitido actualice el contenido de las pantallas que correspondan. La aplicación debe indicar si la carga se completó o falló. Un archivo inválido no debe dejar el contenido en un estado parcial o inconsistente.

**Criterios de aceptación**
- Al cargar un archivo admitido, se actualizan las pantallas asociadas según el formato y el mapeo definidos por la aplicación.
- La aplicación informa cuando la carga se completa.
- Si el archivo no es válido o no puede procesarse, la aplicación informa el error y conserva el último contenido válido.
