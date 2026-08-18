# AGENTS.md

Notas para futuras IAs/agentes que continúen este proyecto.

Este archivo es un cuaderno de traspaso técnico, no documentación para el usuario final. Mantenerlo honesto, breve y útil: estado real, decisiones tomadas, riesgos, deudas y próximos pasos.

## Proyecto

Aplicación simple para rezar el Santo Rosario, pensada principalmente para personas mayores. La prioridad del usuario es claridad, botones grandes, flujo simple, funcionamiento offline y APK Android instalable mediante Capacitor, sin migrar a frameworks pesados.

El archivo `prompt.md` contiene la intención completa del usuario. Leerlo si se necesita contexto de producto.

## Estado Actual

Se logró el objetivo mínimo funcional:

- HTML/CSS/JS existente conservado.
- App web movida a `www/`, que es el `webDir` de Capacitor.
- Capacitor configurado con `capacitor.config.json`.
- Proyecto Android generado en `android/`.
- `npm.cmd run sync` funciona.
- `npm.cmd run run:android` sincroniza y lanza la app en el dispositivo.
- `npm.cmd run build:android` funciona.
- APK debug generado en `android/app/build/outputs/apk/debug/app-debug.apk`.
- Íconos y Splash Screen generados y configurados en el proyecto Android.
- Plugin `@capacitor/splash-screen` (v7) instalado y configurado en `capacitor.config.json` con color de fondo `#F5EDD6` (pergamino).
- Plugin `@capacitor-community/keep-awake` (v7.1.0) instalado para evitar que Android bloquee la pantalla mientras la app está visible.
- La app detecta el día de la semana con `new Date().getDay()` y marca automáticamente el grupo de misterios correspondiente.
- `www/index.html` muestra un versículo bíblico diario en el hero y una frase latina diaria con traducción en el footer.
- Los datos diarios viven como archivos JS cargables sin `fetch`: `www/data/versiculos.js` y `www/data/latin.js`.

Comandos verificados:

```bash
node --check www/js/app.js
npm.cmd run sync
npm.cmd run run:android
npm.cmd run build:android
```

## Configuración del IDE

Se han agregado "Run Configurations" en `.idea/runConfigurations/` para facilitar el uso desde el botón "Run" (flecha verde) de Android Studio:
1. **Run Android**: Ejecuta `npm run sync` y luego despliega al celular.
2. **Build Debug APK**: Compila el APK sin lanzarlo.

## Estructura Relevante

```text
www/index.html          Inicio informativo: hero, misterios y oraciones
www/cuentas.html        Funcionalidad del rezo con cuentas sobre fondo azul
www/css/styles.css      Estilos extraídos del HTML original
www/js/app.js           JS extraído del HTML original
www/data/versiculos.js  Versículos diarios y calendario anual
www/data/latin.js       Frases latinas diarias, traducción y calendario anual
android/                Proyecto Android generado por Capacitor
assets/                 Recursos fuente para íconos/splash (fuera de www/)
capacitor.config.json   Configuración Capacitor
package.json            Dependencias y scripts
README.md               Guía mínima para humano
index.original.html     Copia del HTML monolítico original
```

## Decisiones Tomadas

- Se mantuvo vanilla HTML/CSS/JS. No React, no Kotlin, no Flutter.
- Se separó la paja del trigo: `www/index.html` contiene información/introducción, y `www/cuentas.html` contiene la funcionalidad del rezo con cuentas. El usuario quiere navegar entre HTMLs, no entrar a la funcionalidad por scroll dentro del inicio.
- Se corrigió mojibake visible en textos españoles del HTML/JS (`MarÃ­a`, `EspÃ­ritu`, etc.).
- Se eliminó la dependencia a Google Fonts para favorecer funcionamiento offline. Ahora usa fuentes serif del sistema.
- Se usó `capacitor.config.json` en vez de `capacitor.config.ts` para evitar instalar TypeScript solo para configuración.
- Se dejó `package-lock.json` versionable para reproducibilidad.
- Se agregó `.gitignore` para ignorar `node_modules`, builds Android y archivos generados por Capacitor.
- Se configuraron los íconos de la app usando `@capacitor/assets` a partir de `www/assets/icon.png`.
- Se agregó selección automática de misterios por día:
  - Domingo/Miércoles: Gloriosos
  - Lunes/Sábado: Gozosos
  - Martes/Viernes: Dolorosos
  - Jueves: Luminosos
- Si el usuario cambia manualmente el grupo de misterios, se reconstruye la secuencia y se reinicia el rosario para evitar mezclar misterios.
- Se agregó `capacitor.js` en `www/index.html` y una capa defensiva en `www/js/app.js` para mantener la pantalla activa con `KeepAwake.keepAwake()` cuando la app está visible. Al ir al fondo, llama `KeepAwake.allowSleep()`.
- Se probó dividir la experiencia en modo con cuentas y modo automático. El usuario decidió sacar el modo automático del MVP porque será una función paga futura. No debe exponerse ni quedar enlazado en la versión actual.
- Se agregó calendario diario de versículos: el listado se repite desde el 1 de enero hasta completar 365 días; en bisiestos el 29 de febrero usa la misma lectura asignada al 31 de diciembre.
- Se eliminó `www/data/versiculos.json` para evitar duplicación. La app consume `www/data/versiculos.js` vía `window.SANTO_ROSARIO_VERSICULOS`.
- Se agregó calendario diario de frases latinas con traducción en `www/data/latin.js`, consumido vía `window.SANTO_ROSARIO_LATIN`.
- Los TXT fuente de datos diarios no son necesarios después de procesar la información; evitar versionarlos salvo que el usuario pida conservarlos como fuente editorial.

## Entorno Local Observado

- Windows / PowerShell.
- `npm.ps1` está bloqueado por ExecutionPolicy, usar `npm.cmd`.
- Node: `v25.8.2`.
- npm: `11.11.1`.
- Java global detectado: Adoptium JDK 17.
- Android Studio incluye JBR moderno en `C:\Program Files\Android\Android Studio\jbr`.
- Capacitor 7 requiere Java compatible con `source 21`; con Java 17 falla con `invalid source release: 21`.
- Por eso `package.json` define `build:android` seteando `JAVA_HOME` al JBR de Android Studio.
- Android SDK local observado en `C:/Users/dazju/AppData/Local/Android/Sdk`.
- `android/local.properties` fue creado localmente para apuntar a ese SDK, pero está ignorado por git como corresponde.

## Cuidado con Capacitor

Después de cambios en `www/`, correr:

```bash
npm.cmd run sync
```

o al menos:

```bash
npm.cmd run copy
```

Antes de prometer APK actualizado, correr:

```bash
npm.cmd run build:android
```

El APK debug queda en:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## Deudas Técnicas

La app funciona, pero todavía arrastra deuda del HTML original:

- Hay mucho contenido estático en `www/cuentas.html`.
- `www/js/app.js` todavía mezcla datos de oraciones, estado del rosario y actualización de UI.
- `www/data/versiculos.js` y `www/data/latin.js` duplican estructura de calendario; si crece, conviene extraer un generador/script versionado o una utilidad común.
- Conviene extraer gradualmente datos a módulos simples, por ejemplo:
  - `www/js/prayers.js`
  - `www/js/mysteries.js`
  - `www/js/rosary.js`
  - `www/js/ui.js`
- No hacer esa modularización por gusto: hacerlo cuando se vaya a tocar contenido o flujo.
- Revisar UX en teléfono físico: el diseño viene de web y puede requerir ajustes de tamaño/contraste/toques.
- Falta verificar instalación real por USB en un Android físico.
- Falta revisar manifest/nombre visual de Android. Capacitor generó valores por defecto.
- Falta decidir si conservar `index.original.html` a largo plazo. Por ahora sirve como respaldo histórico.

## Riesgos / Cosas a No Romper

- No reescribir la app desde cero sin una razón fuerte.
- No agregar backend, cuentas, autenticación ni APIs remotas.
- No introducir dependencias pesadas para problemas que vanilla JS resuelve.
- Mantener funcionamiento offline. Si se agregan imágenes/audio, deben vivir dentro de `www/`.
- Si se agregan plugins Capacitor, hacerlo solo por una necesidad concreta: vibración, keep awake, notificaciones, etc.
- Personas mayores son el usuario primario: preferir textos claros, botones grandes y navegación obvia.

## Próximos Pasos Sugeridos

1. **Pantalla de Carga Personalizada**: El usuario está diseñando un `assets/splash.png` (2732x2732px). Una vez listo, correr `npx.cmd @capacitor/assets generate --android` para actualizar el proyecto.
2. Probar el APK en teléfono físico.
3. Ajustar detalles visuales que aparezcan en pantalla real: tamaño de letra, botones, scroll, contraste.
3. Mejorar el flujo inicial hacia algo más simple: “¿Rezamos el Rosario?” y botón “Comenzar”.
5. Revisar en teléfono físico que “Rosario de hoy” sea suficientemente visible y comprensible.
6. Agregar botón claro de retroceso si el usuario avanza por error.
7. Separar datos de oraciones/misterios cuando se toque ese flujo.

## Apreciación Personal

El proyecto ya tiene un tono visual devocional bonito, tipo libro antiguo/pergamino. Para la versión Android orientada a personas mayores, probablemente convenga bajar un poco la ornamentación cuando compita con la claridad del rezo. La dirección correcta no es hacerlo más “moderno”, sino más sereno, legible y seguro al tacto.

La prioridad real ahora no es sumar funciones, sino cerrar el ciclo: instalar en teléfono, mirar con ojos de usuario mayor, y simplificar donde haga falta.
