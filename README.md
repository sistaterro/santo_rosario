Santo Rosario
=============

Aplicación web simple para rezar el Santo Rosario, empaquetada como APK Android con Capacitor.

La app está pensada como una guía práctica para acompañar el modo habitual de rezar el Rosario en Argentina: presenta los misterios correspondientes al día, acompaña el avance por las cuentas y muestra el estado del rezo sin depender de conexión a internet.

## Capturas

| Inicio | Misterios del día |
| --- | --- |
| ![Inicio de Santo Rosario](docs/readme-images/image_01.jpeg) | ![Misterios diarios](docs/readme-images/image_02.jpeg) |

| Rosario interactivo | Rosario completado |
| --- | --- |
| ![Rosario interactivo](docs/readme-images/image_03.jpeg) | ![Rosario completado](docs/readme-images/image_04.jpeg) |

## Funcionamiento

- Funciona offline: no necesita backend, cuenta de usuario ni conexión permanente.
- Detecta el día de la semana y selecciona automáticamente los misterios correspondientes:
  - Lunes y sábado: Gozosos
  - Martes y viernes: Dolorosos
  - Miércoles y domingo: Gloriosos
  - Jueves: Luminosos
- El inicio muestra información del Rosario, el grupo de misterios del día, un versículo bíblico diario y una frase latina diaria con traducción.
- La pantalla de cuentas funciona como guía de rezo: la cruz central permite avanzar y el rosario visual se va actualizando cuenta por cuenta.
- El estado del rezo se conserva durante el día y se reinicia automáticamente al cambiar de fecha.
- Al completar el Rosario, la app marca el cierre visualmente y permite comenzar de nuevo.
- La estructura de idiomas ya está preparada para 12 idiomas. La app intenta usar el idioma del dispositivo y cae a español cuando todavía no hay traducción cargada.

## Estructura principal

```text
www/
  index.html       # inicio informativo
  cuentas.html     # funcionalidad de rezo con cuentas
  css/styles.css
  js/app.js
  i18n/
    languages.js    # idiomas declarados desde listado_idiomas.csv
    es.js           # textos base en español
    i18n.js         # detección, fallback y aplicación de traducciones
  data/
    versiculos.js  # versículo diario y calendario anual
    latin.js       # frase latina diaria y calendario anual
  citas-rvr1909.txt
android/
docs/readme-images/
assets/
listado_idiomas.csv
```

## Comandos útiles

```bash
npm.cmd install
npm.cmd run sync
npm.cmd run build:android
```

El APK debug queda en:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## Notas técnicas

- `www/` es el `webDir` de Capacitor.
- Las imágenes para documentar el proyecto en este README van en `docs/readme-images/`.
- Se quitaron fuentes remotas para que la experiencia funcione offline con fuentes del sistema.
- Los datos diarios se cargan desde archivos JS en `www/data/`, no desde JSON, para funcionar bien offline, en Capacitor y en pruebas locales.
- Los textos traducibles se cargan desde archivos JS en `www/i18n/`. Por ahora español es el idioma completo; los otros idiomas están declarados como pendientes y usan fallback a español.
- Los versículos diarios usan una selección Reina-Valera 1909 guardada en `www/citas-rvr1909.txt` y procesada en `www/data/versiculos.js`.
- `cuentas.html` usa un rosario SVG interactivo: la cruz central es el botón de avance, con pulso inicial.
- En esta máquina el build usa el JBR incluido con Android Studio porque Capacitor 7 requiere Java compatible con source 21.
