# AGENTS.md

Notas para futuras IAs/agentes que continuen este proyecto.

Este archivo es un cuaderno de traspaso tecnico, no documentacion para el usuario final. Mantenerlo honesto, breve y util: estado real, decisiones tomadas, riesgos, deudas y proximos pasos.

## Proyecto

Simple Santo Rosario app, primarily intended for older users. The user's priority is clarity, large controls, a simple flow, offline behavior, and an Android APK through Capacitor without migrating to a heavy framework.

Este archivo es la unica nota tecnica de handoff que queda en el repo despues de la limpieza de prompts, fuentes intermedias y scripts temporales.

## Estado Actual

- App web en `www/`, usada como `webDir` de Capacitor.
- Proyecto Android generado en `android/`.
- `npm.cmd run sync`, `npm.cmd run run:android` y `npm.cmd run build:android` funcionan.
- APK debug generado en `android/app/build/outputs/apk/debug/app-debug.apk` y copiado automaticamente a `app-download/santo_rosario.apk` con `npm.cmd run build:android`.
- Iconos y splash configurados.
- `@capacitor-community/keep-awake` mantiene la pantalla activa mientras la app esta visible.
- `www/index.html` muestra inicio informativo, misterios del dia, versiculo diario, frase latina diaria y seccion "Sobre nosotros".
- `www/rosary.html` contiene la funcionalidad principal del rezo: rosario SVG interactivo, cruz central como avance, estado persistente diario y reset al cambiar de fecha.
- `www/data/verses.js` y `www/data/latin.js` cargan contenido diario sin `fetch`, apto para offline/Capacitor.
- `www/data/verses.js` conserva RVR1909 en espanol y cuenta con traducciones completas para los 12 idiomas adicionales (`en`, `pt`, `pl`, `it`, `fr`, `fil`, `de`, `vi`, `ro`, `hr`, `hu`, `ko`) provenientes de fuentes de dominio publico. Si faltara una traduccion especifica, la app cae a ingles antes que a espanol.
- `www/data/latin.js` conserva la frase latina original, traduccion espanola base y cuenta con traducciones completas para los 12 idiomas adicionales (`en`, `pt`, `pl`, `it`, `fr`, `fil`, `de`, `vi`, `ro`, `hr`, `hu`, `ko`). Si faltara una traduccion especifica, la app cae a ingles antes que a espanol.
- `www/i18n/` contiene estructura de 13 idiomas, contando espanol. En primer arranque detecta `navigator.language`, guarda esa eleccion inicial en `localStorage` y luego respeta siempre la preferencia persistida del usuario. Usa ingles como fallback si no puede detectar un idioma compatible.

## Idiomas

Catalogos actuales:

```text
es, pt, en, it, fr, pl, de, fil, vi, ro, hr, hu, ko
```

Todos estan marcados como `available`. La etiqueta del selector debe mantenerse siempre como `Language`, incluso cuando la app este traducida.

La preferencia de idioma se guarda en `localStorage` con la clave `santoRosario.language.v1`; hay migracion desde `santoRosario.idioma.v1`. No volver a detectar el idioma del dispositivo en cada carga si esa clave ya existe.

Importante: las traducciones son una primera version funcional. Antes de lanzar mercados no hispanos, revisar con hablantes nativos y fuentes liturgicas adecuadas, sobre todo las oraciones largas. La frase biblica diaria y la frase latina siguen fuera del sistema i18n y tienen su propio tratamiento en `www/data/verses.js` y `www/data/latin.js`.

Coreano usa `ko` y funciona por UTF-8/Hangul sin tratamiento especial.

Los scripts temporales de generacion/validacion de traducciones fueron removidos en la limpieza. Desde ahora, `www/i18n/*.js`, `www/data/verses.js` y `www/data/latin.js` son las fuentes versionadas directas.

## Estructura Relevante

```text
www/index.html          Inicio informativo
www/rosary.html        Funcionalidad del rezo con cuentas
www/css/styles.css      Estilos
www/js/app.js           Logica de UI, rosario, estado diario e i18n
www/i18n/               Registry, catalogos y motor i18n
www/data/verses.js  Versiculos diarios y calendario anual
www/data/latin.js       Frases latinas diarias y calendario anual
android/                Proyecto Android Capacitor
assets/                 Recursos fuente para iconos/splash
```

## Decisiones Tomadas

- Se mantuvo vanilla HTML/CSS/JS. No React, no Kotlin, no Flutter.
- Se separo `index.html` como informacion/introduccion y `rosary.html` como rezo funcional.
- Se elimino la dependencia a Google Fonts para favorecer funcionamiento offline.
- Se usa `capacitor.config.json` en vez de `capacitor.config.ts`.
- Los misterios diarios se asignan asi:
  - Domingo/Miercoles: Gloriosos
  - Lunes/Sabado: Gozosos
  - Martes/Viernes: Dolorosos
  - Jueves: Luminosos
- El modo automatico fue retirado del MVP porque el usuario lo reserva para una version paga futura.
- `www/data/versiculos.json` was removed to avoid duplication; the app consumes `www/data/verses.js`.
- `www/data/latin.js` contiene frase latina diaria y traduccion.
- Se retiro el texto "COMENZA ACA" del rosario; queda el pulso inicial sobre la cruz central para sugerir interaccion.
- La seccion "Sobre nosotros" enlaza a `https://dazjuancarlos.com.ar/` con el texto "Conocer al desarrollador".
- Technical names were partially cleaned up in English so the repo is easier for reviewers/recruiters to read: the functional page became `rosary.html`, Bible data became `verses.js`, main selectors/IDs moved to English, and README is now English. User-facing content and catalog keys such as `titulo/texto/rubrica` were kept for compatibility with `www/i18n/*.js`.
- After that cleanup, rosary runtime code was fixed to read both English-style prayer fields (`title/rubric/body/text`) and the existing Spanish catalog fields (`titulo/rubrica/texto`). Bead rendering now uses explicit `bead: 'ourFather' | 'hailMary'` metadata instead of matching the visible title "Padre Nuestro", so translations do not break rosary functionality.

## Entorno Local Observado

- Windows / PowerShell.
- `npm.ps1` esta bloqueado por ExecutionPolicy; usar `npm.cmd`.
- Node observado: `v25.8.2`.
- npm observado: `11.11.1`.
- Capacitor 7 requiere Java compatible con source 21; `build-android.bat` detecta el JBR local de Android Studio via `%LOCALAPPDATA%` cuando existe. Evitar volver a meter rutas absolutas de usuario en `package.json`.
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

## Limpieza Realizada

- Se removieron `prompt.md`, `language-list.csv`, `www/rvr1909-quotes.txt` y la carpeta `tools/` porque eran materiales temporales de generacion, auditoria o handoff.
- Se conservaron `assets/` porque `npm.cmd run assets` los usa para regenerar icono/splash Android.
- Se conservaron `docs/readme-images/` porque el README los usa.
- No borrar `www/data/verses.js`, `www/data/latin.js`, `www/i18n/*.js` ni assets generados de Android sin confirmar primero: esos forman parte del funcionamiento actual o del empaquetado.

## Deudas Tecnicas

- `www/js/app.js` todavia mezcla datos, estado del rosario y actualizacion de UI.
- `www/data/verses.js`, `www/data/latin.js` y `www/i18n/*.js` tienen estructuras grandes; conviene mantener generadores o extraer utilidades si crecen.
- Revisar UX en telefono fisico: tamano de letra, contraste, zonas tactiles, barra de estado y barra de navegacion Android.
- Falta revision liturgica/nativa de traducciones no espanolas.
- Falta revisar manifest/nombre visual de Android.

### Preparacion para F-Droid

Auditoria inicial realizada el 2026-08-24 contra la politica y la guia de inclusion vigentes de F-Droid. No asumir que el proyecto ya esta listo para publicar: primero resolver los bloqueantes y luego probar una receta real en el entorno de `fdroidserver`.

Bloqueantes o de prioridad alta:

- **Licencia FLOSS ausente:** el repositorio no tiene `LICENSE`, `COPYING` ni avisos de copyright. Elegir una licencia reconocida por OSI/FSF (por ejemplo, GPL-3.0-or-later o Apache-2.0), agregar el archivo correspondiente y declarar su identificador SPDX en README y metadata. Confirmar tambien que el autor acepta licenciar con ella todo el codigo propio.
- **Licencias y procedencia del contenido:** documentar por separado la procedencia y licencia/dominio publico de RVR1909, frases latinas, traducciones, iconos, splash y capturas. F-Droid revisa tambien textos y assets, no solamente codigo. Las traducciones generadas o adaptadas necesitan una licencia compatible y una declaracion clara de autoria/procedencia.
- **Google Services residual:** `android/build.gradle` descarga `com.google.gms:google-services:4.4.2` y `android/app/build.gradle` conserva el bloque condicional de `google-services.json`, aunque la app no usa Firebase ni Play Services. Eliminar ambos antes de presentar la app; F-Droid rechaza dependencias/herramientas propietarias y sus scanners pueden marcar esta referencia.
- **Build desde fuente en Linux no validado:** los scripts de release actuales usan `build-android.bat`, `gradlew.bat` y `copy`, todos orientados a Windows. Crear/documentar un camino POSIX reproducible (`npm ci`, sincronizacion Capacitor y `./gradlew assembleRelease`) y validarlo en Linux o en el contenedor oficial de F-Droid. La build no debe depender de Android Studio ni de rutas locales.
- **APK precompilada dentro del arbol fuente:** `app-download/santo_rosario.apk` esta versionado. Mantener la descarga publica como un asset de GitHub Releases y sacar el APK del arbol fuente antes de enviar a F-Droid, o preparar la receta para eliminarlo durante el escaneo. F-Droid prefiere y verifica builds hechas desde fuente; un binario debug dentro del repositorio agrega ruido y puede disparar revision.
- **Versionado Android sin proceso de releases:** `android/app/build.gradle` sigue fijo en `versionCode 1` y `versionName "1.0"`, `package.json` dice `0.1.0` y no existen tags Git. Definir una unica fuente/procedimiento de versionado, incrementar siempre `versionCode` y etiquetar cada commit publicado (por ejemplo `v1.0.0`) para que F-Droid detecte actualizaciones.

Necesarias para una presentacion completa:

- **Metadata F-Droid/Fastlane ausente:** crear `fastlane/metadata/android/en-US/` y, idealmente, `es-AR/` con `short_description.txt`, `full_description.txt`, icono, capturas y `changelogs/<versionCode>.txt`. Las imagenes actuales de README no estan en una ruta que F-Droid importe automaticamente.
- **Receta F-Droid sin probar:** preparar y validar el YAML de `fdroiddata` para `com.santorosario.app`, incluyendo la instalacion reproducible de dependencias Node desde `package-lock.json`, el sync de Capacitor y la salida release. Confirmar que el scanner no detecte binarios o dependencias no libres.
- **Application ID por confirmar:** comprobar que `com.santorosario.app` sea globalmente unico y no este usado por otra aplicacion. F-Droid recomienda un ID derivado de un dominio controlado por el desarrollador; evaluar cambiarlo antes de la primera publicacion, porque hacerlo despues rompe la ruta de actualizacion.
- **Permiso de red posiblemente innecesario:** `AndroidManifest.xml` declara `android.permission.INTERNET`, aunque la app se presenta como offline y el unico enlace web visible apunta al sitio del desarrollador. Verificar si el enlace puede abrirse mediante una app externa sin ese permiso y retirarlo si no es necesario, siguiendo el principio de minimo privilegio.
- **FileProvider demasiado amplio y aparentemente sin uso:** el manifiesto incluye un `FileProvider` y `file_paths.xml` expone `external-path` con `path="."`. Confirmar si Capacitor realmente lo necesita; si no hay funciones de compartir/archivos, quitar provider y rutas para reducir superficie de seguridad.
- **Release reproducible y firma:** definir si F-Droid firmara sus builds o si se publicaran APK upstream firmadas y verificables. Si se quiere conservar la misma firma entre GitHub y F-Droid, configurar y probar builds reproducibles con `Binaries`/`AllowedAPKSigningKeys`; nunca versionar la clave privada.
- **Pruebas insuficientes:** solo quedan tests de ejemplo generados por Capacitor. Agregar al menos pruebas automatizadas de calendario diario, persistencia/reset, seleccion de idioma, fallback de traducciones y secuencia cuenta-oracion; despues ejecutar una prueba de instalacion y flujo completo sobre el APK release.
- **Privacidad y ficha de publicacion:** documentar que no hay tracking, publicidad, cuentas ni recoleccion de datos; revisar si el enlace externo o futuras funciones implican alguna Anti-Feature. Mantener la descripcion alineada con el comportamiento real offline.

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
