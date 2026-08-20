# AGENTS.md

Notas para futuras IAs/agentes que continuen este proyecto.

Este archivo es un cuaderno de traspaso tecnico, no documentacion para el usuario final. Mantenerlo honesto, breve y util: estado real, decisiones tomadas, riesgos, deudas y proximos pasos.

## Proyecto

Aplicacion simple para rezar el Santo Rosario, pensada principalmente para personas mayores. La prioridad del usuario es claridad, botones grandes, flujo simple, funcionamiento offline y APK Android instalable mediante Capacitor, sin migrar a frameworks pesados.

El archivo `prompt.md` contiene la intencion completa del usuario. Leerlo si se necesita contexto de producto.

## Estado Actual

- App web en `www/`, usada como `webDir` de Capacitor.
- Proyecto Android generado en `android/`.
- `npm.cmd run sync`, `npm.cmd run run:android` y `npm.cmd run build:android` funcionan.
- APK debug generado en `android/app/build/outputs/apk/debug/app-debug.apk`.
- Iconos y splash configurados.
- `@capacitor-community/keep-awake` mantiene la pantalla activa mientras la app esta visible.
- `www/index.html` muestra inicio informativo, misterios del dia, versiculo diario, frase latina diaria y seccion "Sobre nosotros".
- `www/cuentas.html` contiene la funcionalidad principal del rezo: rosario SVG interactivo, cruz central como avance, estado persistente diario y reset al cambiar de fecha.
- `www/data/versiculos.js` y `www/data/latin.js` cargan contenido diario sin `fetch`, apto para offline/Capacitor.
- `www/i18n/` contiene estructura de 12 idiomas; la app detecta `navigator.language`, guarda preferencia en `localStorage` y usa fallback a espanol si hace falta.

## Idiomas

Catalogos actuales:

```text
es, pt, en, it, fr, pl, de, fil, vi
```

Catalogos objetivo preparados pero deshabilitados por ahora:

```text
ro, hr, hu
```

Solo `es`, `pt`, `en`, `it`, `fr`, `pl`, `de`, `fil` y `vi` estan marcados como `available`. El resto queda `pending` para no mostrar oraciones en un idioma equivocado. La etiqueta del selector debe mantenerse siempre como `Language`, incluso cuando la app este traducida.

Importante: las traducciones son una primera version funcional. Antes de lanzar mercados no hispanos, revisar con hablantes nativos y fuentes liturgicas adecuadas, sobre todo las oraciones largas. La frase biblica diaria y la frase latina siguen fuera del sistema i18n y tienen su propio tratamiento.

`tools/generate_i18n.py` regenera `www/i18n/languages.js` y todos los `www/i18n/*.js`. Si se corrige una traduccion generada, actualizar el generador tambien o el cambio se perdera al regenerar.

## Estructura Relevante

```text
www/index.html          Inicio informativo
www/cuentas.html        Funcionalidad del rezo con cuentas
www/css/styles.css      Estilos
www/js/app.js           Logica de UI, rosario, estado diario e i18n
www/i18n/               Registry, catalogos y motor i18n
www/data/versiculos.js  Versiculos diarios y calendario anual
www/data/latin.js       Frases latinas diarias y calendario anual
www/citas-rvr1909.txt   Seleccion editorial de 366 citas RVR1909
tools/generate_i18n.py  Generador de catalogos i18n
android/                Proyecto Android Capacitor
assets/                 Recursos fuente para iconos/splash
```

## Decisiones Tomadas

- Se mantuvo vanilla HTML/CSS/JS. No React, no Kotlin, no Flutter.
- Se separo `index.html` como informacion/introduccion y `cuentas.html` como rezo funcional.
- Se elimino la dependencia a Google Fonts para favorecer funcionamiento offline.
- Se usa `capacitor.config.json` en vez de `capacitor.config.ts`.
- Los misterios diarios se asignan asi:
  - Domingo/Miercoles: Gloriosos
  - Lunes/Sabado: Gozosos
  - Martes/Viernes: Dolorosos
  - Jueves: Luminosos
- El modo automatico fue retirado del MVP porque el usuario lo reserva para una version paga futura.
- `www/data/versiculos.json` fue eliminado para evitar duplicacion; la app consume `www/data/versiculos.js`.
- `www/data/latin.js` contiene frase latina diaria y traduccion.
- Se retiro el texto "COMENZA ACA" del rosario; queda el pulso inicial sobre la cruz central para sugerir interaccion.
- La seccion "Sobre nosotros" enlaza a `https://dazjuancarlos.com.ar/` con el texto "Conocer al desarrollador".

## Entorno Local Observado

- Windows / PowerShell.
- `npm.ps1` esta bloqueado por ExecutionPolicy; usar `npm.cmd`.
- Node observado: `v25.8.2`.
- npm observado: `11.11.1`.
- Capacitor 7 requiere Java compatible con source 21; el build usa el JBR de Android Studio.
- Android SDK local observado en `C:/Users/dazju/AppData/Local/Android/Sdk`.
- `android/local.properties` es local y esta ignorado por git.

## Cuidado con Capacitor

Despues de cambios en `www/`, correr:

```bash
npm.cmd run sync
```

Antes de prometer APK actualizado, correr:

```bash
npm.cmd run build:android
```

## Deudas Tecnicas

- `www/js/app.js` todavia mezcla datos, estado del rosario y actualizacion de UI.
- `www/data/versiculos.js`, `www/data/latin.js` y `www/i18n/*.js` tienen estructuras grandes; conviene mantener generadores o extraer utilidades si crecen.
- Revisar UX en telefono fisico: tamano de letra, contraste, zonas tactiles, barra de estado y barra de navegacion Android.
- Falta revision liturgica/nativa de traducciones no espanolas.
- Falta revisar manifest/nombre visual de Android.

## Riesgos / Cosas a No Romper

- No reescribir la app desde cero sin razon fuerte.
- No agregar backend, cuentas, autenticacion ni APIs remotas.
- Mantener funcionamiento offline.
- Si se agregan imagenes/audio, deben vivir dentro de `www/`.
- Personas mayores son el usuario primario: preferir textos claros, botones grandes y navegacion obvia.

## Proximos Pasos Sugeridos

1. Probar el APK en telefono fisico.
2. Revisar las traducciones con hablantes nativos y fuentes liturgicas.
3. Ajustar detalles visuales en pantalla real.
4. Agregar boton claro de retroceso si el usuario avanza por error.
5. Separar datos de oraciones/misterios cuando se vuelva a tocar ese flujo.

## Apreciacion Personal

El proyecto ya tiene un tono visual devocional bonito, tipo libro antiguo/pergamino. Para Android y personas mayores, la direccion correcta no es hacerlo mas moderno, sino mas sereno, legible y seguro al tacto.
