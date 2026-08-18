Santo Rosario
=============

Aplicacion web simple para rezar el Santo Rosario, empaquetada como APK Android con Capacitor.

Estructura principal:

```text
www/
  index.html       # inicio informativo
  cuentas.html     # funcionalidad de rezo con cuentas
  css/styles.css
  js/app.js
  data/
    versiculos.js  # versículo diario y calendario anual
    latin.js       # frase latina diaria y calendario anual
android/
```

Comandos utiles:

```bash
npm.cmd install
npm.cmd run sync
npm.cmd run build:android
```

El APK debug queda en:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

Notas:

- `www/` es el `webDir` de Capacitor.
- La app no depende de backend.
- Se quitaron fuentes remotas para que la experiencia funcione offline con fuentes del sistema.
- Los datos diarios se cargan desde archivos JS en `www/data/`, no desde JSON, para funcionar bien offline, en Capacitor y en pruebas locales.
- `index.html` muestra un versículo bíblico diario en el hero y una frase latina diaria con traducción en el footer.
- `cuentas.html` usa un rosario SVG interactivo: la cruz central es el botón de avance, con pulso inicial pero sin texto “Comenzá acá”.
- En esta maquina el build usa el JBR incluido con Android Studio porque Capacitor 7 requiere Java compatible con source 21.
