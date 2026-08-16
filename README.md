Santo Rosario
=============

Aplicacion web simple para rezar el Santo Rosario, empaquetada como APK Android con Capacitor.

Estructura principal:

```text
www/
  index.html
  cuentas.html
  css/styles.css
  js/app.js
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
- En esta maquina el build usa el JBR incluido con Android Studio porque Capacitor 7 requiere Java compatible con source 21.
