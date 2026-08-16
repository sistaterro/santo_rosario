Quiero que trabajes sobre una aplicación existente para rezar el rosario.

## Contexto general

La aplicación originalmente está hecha como una web simple en:

* HTML
* CSS
* JavaScript

Ya existe un HTML funcional y quiero conservar esa base. No quiero reescribir la aplicación en Kotlin, Flutter, React Native ni otro framework móvil salvo que exista una razón técnica realmente necesaria.

El objetivo es convertir esta aplicación web en una aplicación Android instalable como APK utilizando **Capacitor**.

La idea arquitectónica general es:

```text
HTML / CSS / JavaScript
        ↓
     Capacitor
        ↓
 Proyecto Android nativo
        ↓
      Gradle
        ↓
       APK
```

Android Studio estará instalado y podrá utilizarse para abrir, ejecutar y compilar el proyecto Android generado por Capacitor.

## Filosofía del proyecto

La aplicación debe ser deliberadamente simple.

Está pensada principalmente para personas mayores que quieren rezar el rosario sin enfrentarse a una interfaz complicada.

Principios:

* interfaz extremadamente clara
* botones grandes
* tipografía legible
* navegación mínima
* evitar menús innecesarios
* evitar registros, cuentas y contraseñas
* evitar backend mientras no sea necesario
* funcionar offline siempre que sea posible
* mantener toda la lógica inicial del lado cliente
* no agregar dependencias innecesarias
* priorizar simplicidad y mantenibilidad
* mantener HTML, CSS y JavaScript comprensibles

La tecnología debe desaparecer detrás de la experiencia de uso.

## Estructura deseada

Quiero una estructura similar a esta:

```text
rosario/
│
├── package.json
├── capacitor.config.ts
│
├── www/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── app.js
│   ├── images/
│   ├── audio/
│   └── assets/
│
└── android/
```

La carpeta:

```text
www/
```

debe ser el `webDir` de Capacitor.

Ejemplo conceptual de configuración:

```ts
const config = {
  appId: 'com.rosario.app',
  appName: 'Rosario',
  webDir: 'www'
};
```

Podés ajustar nombres si encontrás una organización mejor, pero mantené la arquitectura simple.

## Capacitor

Si todavía no está configurado, preparar el proyecto usando Capacitor.

Dependencias esperadas:

```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
```

Inicialización conceptual:

```bash
npx cap init
npx cap add android
```

Sincronización después de modificar el contenido web:

```bash
npx cap sync android
```

O, cuando corresponda:

```bash
npx cap copy android
```

El proyecto Android generado debe mantenerse dentro de:

```text
android/
```

y debe poder abrirse mediante:

```bash
npx cap open android
```

## Compilación

Quiero poder compilar tanto desde Android Studio como eventualmente desde consola.

Desde Gradle debería poder utilizarse algo equivalente a:

```bash
cd android
gradlew.bat assembleDebug
```

en Windows.

El APK debug debería quedar aproximadamente en:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

No dependas exclusivamente de Android Studio para tareas que Gradle pueda realizar automáticamente.

## Pruebas

Preferimos probar sobre un teléfono Android físico mediante USB debugging.

No dependemos del emulador Android porque consume demasiados recursos.

La prioridad es:

```text
Codex / editor
    ↓
web
    ↓
Capacitor
    ↓
Android
    ↓
teléfono físico
```

## Funcionamiento offline

En la primera versión quiero evitar servidor y backend.

HTML, CSS, JavaScript, imágenes y eventualmente audio deben poder empaquetarse dentro de la APK.

La aplicación debería poder funcionar completamente sin Internet si todos sus recursos son locales.

No introduzcas llamadas a APIs remotas salvo que yo lo solicite explícitamente.

## Diseño funcional inicial

La aplicación es un asistente para rezar el rosario.

Conceptualmente, al abrirla debería ser posible mostrar algo extremadamente simple, por ejemplo:

```text
¿Rezamos el Rosario?

[ Comenzar ]
```

Después puede determinar los misterios correspondientes al día.

Ejemplo:

```text
Rosario de hoy

Sábado

Misterios Gozosos
```

El flujo podría incluir:

```text
Señal de la Cruz
Credo
Padre Nuestro
3 Ave Marías
Gloria
```

y posteriormente los cinco misterios.

Cada misterio puede contener:

* nombre
* imagen opcional
* breve texto o meditación
* Padre Nuestro
* diez Ave Marías
* Gloria

Quiero un contador visual sencillo para las cuentas.

Ejemplo:

```text
● ● ● ● ● ○ ○ ○ ○ ○
```

La persona puede tocar un botón grande o una zona de la pantalla para avanzar.

La interfaz debe dejar siempre muy claro:

* dónde está dentro del rosario
* qué oración corresponde ahora
* cuántas cuentas lleva
* cómo avanzar
* cómo volver si avanzó accidentalmente

## Posibles funciones futuras

No es necesario implementar todo ahora.

La arquitectura debería permitir agregar más adelante:

* audio de las oraciones
* voz guiando el rosario
* vibración suave al completar una decena
* intenciones personales
* tamaño de fuente configurable
* modo oscuro
* mantener pantalla encendida durante el rezo
* historial local de rosarios completados
* recordatorios mediante notificaciones Android
* calendario litúrgico
* opción para compartir
* almacenamiento local

Si alguna función necesita un plugin de Capacitor, proponelo cuando corresponda.

No instales plugins preventivamente si todavía no los necesitamos.

## PWA

Aunque el objetivo actual es APK Android mediante Capacitor, sería deseable conservar una arquitectura compatible con web/PWA.

Por eso:

* no acoples innecesariamente la lógica a Android
* encapsulá llamadas nativas cuando aparezcan
* mantené la mayor parte del código en la capa web

## Restricciones de desarrollo

No hagas una reescritura completa sin necesidad.

Antes de modificar estructura o código:

1. inspeccioná el proyecto existente
2. identificá qué HTML, CSS y JS ya funcionan
3. conservá lo que pueda reutilizarse
4. mové o reorganizá archivos solamente cuando aporte claridad
5. evitá abstracciones prematuras

No quiero arquitectura empresarial para una aplicación pequeña.

Evitar:

* Redux
* microservicios
* backend innecesario
* autenticación innecesaria
* bases de datos remotas sin razón
* frameworks pesados sólo por moda
* capas y patrones que no aporten valor real

Preferir:

* vanilla JavaScript si alcanza
* módulos JS simples
* datos estructurados en objetos o JSON
* funciones pequeñas
* componentes visuales sencillos
* estado local claro

## Organización sugerida del JavaScript

Si `app.js` empieza a crecer, se puede evolucionar gradualmente hacia:

```text
www/js/
├── app.js
├── rosary.js
├── mysteries.js
├── prayers.js
├── storage.js
└── ui.js
```

Responsabilidades aproximadas:

```text
app.js
```

Inicialización y coordinación.

```text
rosary.js
```

Estado y flujo del rosario.

```text
mysteries.js
```

Selección de misterios según día u otras reglas.

```text
prayers.js
```

Contenido estructurado de las oraciones.

```text
storage.js
```

Persistencia local.

```text
ui.js
```

Actualización del DOM y eventos visuales.

No crees estos módulos si la aplicación actual todavía es suficientemente pequeña. Son una guía para crecer, no una obligación.

## Datos separados de la interfaz

Siempre que sea razonable, quiero separar contenido de presentación.

Por ejemplo:

```js
const prayers = {
  padreNuestro: {
    title: 'Padre Nuestro',
    text: '...'
  }
};
```

Y para misterios:

```js
const mysteries = {
  joyful: [
    {
      title: 'La Anunciación',
      meditation: '...'
    }
  ]
};
```

La UI debería consumir esos datos en lugar de tener grandes cantidades de contenido duplicado directamente dentro del código de navegación.

## Experiencia de usuario

La aplicación está hecha inicialmente para dos usuarios reales, personas mayores.

Por eso quiero que cualquier decisión de UI privilegie:

* claridad
* botones grandes
* alto contraste
* poco texto simultáneo
* feedback inmediato
* tolerancia a errores
* posibilidad de retroceder
* evitar gestos ocultos
* evitar elementos pequeños
* evitar navegación confusa

Si para una función existen dos diseños posibles, preferí el que requiera menos explicación.

## Forma de trabajar

Quiero que actúes como desarrollador del proyecto.

Cuando inspecciones el repositorio:

* explicá brevemente qué encontraste
* detectá problemas estructurales reales
* proponé cambios pequeños y justificados
* implementá directamente cuando el cambio sea claro
* evitá reescribir archivos que ya funcionan
* mantené compatibilidad con Capacitor

Después de cada cambio importante, verificá que:

```bash
npx cap sync android
```

pueda ejecutarse correctamente.

Cuando corresponda, verificá también el build Android con Gradle.

Si aparece un error de build, investigá primero:

* versión de Java
* versión de Gradle
* Android Gradle Plugin
* compileSdk
* targetSdk
* dependencias de Capacitor

antes de modificar arbitrariamente el código de la aplicación.

## Objetivo inmediato

Primero quiero conseguir el camino mínimo funcional:

```text
HTML existente
      ↓
Capacitor configurado
      ↓
Proyecto Android generado
      ↓
Build exitoso
      ↓
APK instalable
      ↓
Aplicación funcionando en teléfono físico
```

Una vez logrado eso, recién después mejoraremos diseño, audio, funciones nativas y otras características.

Priorizá obtener primero una APK funcional sin romper la aplicación web existente.
