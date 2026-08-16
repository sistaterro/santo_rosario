/* ─────────────────────────────────────────────────────────────── */
/* SECTION: NAV scroll state                                      */
/* ─────────────────────────────────────────────────────────────── */

(function(){
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
})();


/* ─────────────────────────────────────────────────────────────── */
/* SECTION: SMOOTH SCROLL                                         */
/* ─────────────────────────────────────────────────────────────── */

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const id = this.getAttribute('href');
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    const off = document.getElementById('nav').offsetHeight + 12;
    window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - off, behavior: 'smooth' });
  });
});


/* ─────────────────────────────────────────────────────────────── */
/* SECTION: REVEAL OBSERVER                                       */
/* ─────────────────────────────────────────────────────────────── */

(function(){
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } });
  }, { threshold: .12 });
  document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
})();


/* ─────────────────────────────────────────────────────────────── */
/* SECTION: TABS — misterios y oraciones                          */
/* ─────────────────────────────────────────────────────────────── */

function switchMisterio(btn, panelId) {
  document.querySelectorAll('.m-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.m-tab').forEach(b => b.setAttribute('aria-selected', 'false'));
  document.querySelectorAll('.misterio-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add('active');
  seleccionarMisteriosPorPanel(panelId, true);
}

function switchOracion(btn, panelId) {
  document.querySelectorAll('.o-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.o-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(panelId).classList.add('active');
}


/* ─────────────────────────────────────────────────────────────── */
/* SECTION: ROSARIO INTERACTIVO — lógica principal                */
/* ─────────────────────────────────────────────────────────────── */

/*
  Estructura de una vuelta completa del Rosario:
  0  — Señal de la Cruz
  1  — Credo
  2  — Padre Nuestro (inicial)
  3,4,5 — 3 Ave Marías (Fe, Esperanza, Caridad)
  6  — Gloria
  ──── Misterio 1 (decena) ────
  7  — Anuncio del misterio
  8  — Padre Nuestro
  9..18 — 10 Ave Marías
  19 — Gloria + Oración de Fátima
  ──── Misterio 2..5 (repiten la estructura) ────
  ... (pasos 20–59 — 4 misterios más)
  Final — Salve Regina
*/

const ORACIONES = {
  signo:       { rubrica: 'Apertura', titulo: 'Señal de la Santa Cruz', texto: 'Por la señal de la Santa Cruz, de nuestros enemigos, líbranos, Señor, Dios nuestro.\n\nEn el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.' },
  credo:       { rubrica: 'Acto de fe', titulo: 'El Credo Apostólico', texto: 'Creo en Dios, Padre Todopoderoso, Creador del Cielo y de la tierra. Creo en Jesucristo, su único Hijo, Nuestro Señor...\n\nAmén.' },
  padre:       { rubrica: 'Oración dominical', titulo: 'Padre Nuestro', texto: 'Padre nuestro que estás en el Cielo, santificado sea tu Nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el Cielo.\n\nDanos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en la tentación, y líbranos del mal. Amén.' },
  ave:         { rubrica: 'Salutación angélica', titulo: 'Ave María', texto: 'Dios te salve, María, llena eres de gracia; el Señor es contigo; bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús.\n\nSanta María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén.' },
  gloria:      { rubrica: 'Doxología', titulo: 'Gloria al Padre', texto: 'Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, y por los siglos de los siglos. Amén.' },
  fatima:      { rubrica: 'Visión de Fátima · 1917', titulo: 'Oración de Fátima', texto: 'Oh Jesús mío, perdona nuestros pecados, líbranos del fuego del infierno. Lleva al cielo a todas las almas, especialmente a las más necesitadas de tu misericordia. Amén.' },
  salve:       { rubrica: 'Oración final', titulo: 'Salve Regina', texto: 'Dios te salve, Reina y Madre de misericordia; vida, dulzura y esperanza nuestra, Dios te salve.\n\nA Ti llamamos los desterrados hijos de Eva; a Ti suspiramos gimiendo y llorando en este valle de lágrimas. Ea, pues, Señora, abogada nuestra, vuelve a nosotros esos tus ojos misericordiosos; y después de este destierro, muéstranos a Jesús, fruto bendito de tu vientre.\n\n¡Oh clementísima, oh piadosa, oh dulce Virgen María! Amén.' },
};

const MISTERIOS_POR_TIPO = {
  gozosos: {
    panelId: 'm-gozosos',
    titulo: 'Misterios Gozosos',
    nombres: [
      'La Anunciación del Ángel a María',
      'La Visitación de María a su prima Isabel',
      'El Nacimiento de Nuestro Señor Jesucristo',
      'La Presentación del Niño Jesús en el templo',
      'El Niño Jesús perdido y hallado en el templo',
    ],
  },
  luminosos: {
    panelId: 'm-luminosos',
    titulo: 'Misterios Luminosos',
    nombres: [
      'El Bautismo de Jesús en el Jordán',
      'Las Bodas de Caná',
      'El anuncio del Reino de Dios',
      'La Transfiguración del Señor',
      'La institución de la Eucaristía',
    ],
  },
  dolorosos: {
    panelId: 'm-dolorosos',
    titulo: 'Misterios Dolorosos',
    nombres: [
      'La Oración de Jesús en el huerto',
      'La Flagelación del Señor',
      'La Coronación de espinas',
      'Jesús con la cruz a cuestas',
      'La Crucifixión y muerte de Jesús',
    ],
  },
  gloriosos: {
    panelId: 'm-gloriosos',
    titulo: 'Misterios Gloriosos',
    nombres: [
      'La Resurrección de Nuestro Señor',
      'La Ascensión del Señor a los cielos',
      'La venida del Espíritu Santo',
      'La Asunción de María a los cielos',
      'La Coronación de María Santísima',
    ],
  },
};

const DIA_SEMANA = [
  { nombre: 'Domingo', tipo: 'gloriosos' },
  { nombre: 'Lunes', tipo: 'gozosos' },
  { nombre: 'Martes', tipo: 'dolorosos' },
  { nombre: 'Miércoles', tipo: 'gloriosos' },
  { nombre: 'Jueves', tipo: 'luminosos' },
  { nombre: 'Viernes', tipo: 'dolorosos' },
  { nombre: 'Sábado', tipo: 'gozosos' },
];

let misterioActualTipo = DIA_SEMANA[new Date().getDay()].tipo;
let MISTERIOS_NOMBRES = MISTERIOS_POR_TIPO[misterioActualTipo].nombres;

function getTipoPorPanel(panelId) {
  return Object.keys(MISTERIOS_POR_TIPO).find(tipo => MISTERIOS_POR_TIPO[tipo].panelId === panelId);
}

function seleccionarMisteriosPorPanel(panelId, reiniciarRosario) {
  const tipo = getTipoPorPanel(panelId);
  if (!tipo || tipo === misterioActualTipo) return;
  misterioActualTipo = tipo;
  MISTERIOS_NOMBRES = MISTERIOS_POR_TIPO[tipo].nombres;
  SECUENCIA = buildSecuencia();
  if (reiniciarRosario) reiniciar();
}

function aplicarMisteriosDelDia() {
  const hoy = DIA_SEMANA[new Date().getDay()];
  const misterio = MISTERIOS_POR_TIPO[hoy.tipo];
  misterioActualTipo = hoy.tipo;
  MISTERIOS_NOMBRES = misterio.nombres;

  document.querySelectorAll('.m-tab').forEach(btn => {
    const activo = btn.dataset.panel === misterio.panelId;
    btn.classList.toggle('active', activo);
    btn.setAttribute('aria-selected', activo ? 'true' : 'false');
  });

  document.querySelectorAll('.misterio-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === misterio.panelId);
  });

  const resumen = document.getElementById('misterios-hoy');
  if (resumen) {
    resumen.textContent = `Rosario de hoy: ${hoy.nombre} · ${misterio.titulo}`;
  }
}

// Secuencia de pasos:
// Cada entrada: { tipo, misterioIdx (-1 = ninguno), esAve, textoPersonalizado }
function buildSecuencia() {
  const seq = [];
  // Apertura
  seq.push({ o: ORACIONES.signo,  m: -1, ave: false });
  seq.push({ o: ORACIONES.credo,  m: -1, ave: false });
  seq.push({ o: ORACIONES.padre,  m: -1, ave: false });
  seq.push({ o: ORACIONES.ave,    m: -1, ave: true,  label: 'Fe' });
  seq.push({ o: ORACIONES.ave,    m: -1, ave: true,  label: 'Esperanza' });
  seq.push({ o: ORACIONES.ave,    m: -1, ave: true,  label: 'Caridad' });
  seq.push({ o: ORACIONES.gloria, m: -1, ave: false });

  // 5 decenas
  for (let i = 0; i < 5; i++) {
    // Anuncio del misterio (Padre Nuestro)
    seq.push({
      o: { rubrica: `${MISTERIOS_NOMBRES[i]}`, titulo: 'Padre Nuestro', texto: ORACIONES.padre.texto },
      m: i, ave: false, anuncio: true
    });
    // 10 Ave Marías
    for (let j = 1; j <= 10; j++) {
      seq.push({ o: ORACIONES.ave, m: i, ave: true, label: `${j} de 10` });
    }
    // Gloria + Fátima
    seq.push({ o: ORACIONES.gloria, m: i, ave: false });
    seq.push({ o: ORACIONES.fatima, m: i, ave: false });
  }

  // Salve final
  seq.push({ o: ORACIONES.salve, m: -1, ave: false });
  return seq;
}

let SECUENCIA = buildSecuencia();
// Contar sólo las Ave Marías para el contador visible
// (3 iniciales + 5×10 = 53 total, pero mostramos cuenta corrida)

let pasoActual = 0;
let aveCount   = 0;

// ── Renderizar cuentas SVG ────────────────────────────────────
function renderCuentas() {
  const g = document.getElementById('cuentas-group');
  if (!g) return;
  g.innerHTML = '';

  // Distribuir 59 cuentas en círculo (radio 110, centro 100,150)
  // + 1 cuenta de inicio
  const TOTAL = 59;
  const cx = 100, cy = 150, r = 110;

  for (let i = 0; i < TOTAL; i++) {
    const angle = (i / TOTAL) * 2 * Math.PI - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);

    // Determinar tipo de cuenta: cada 11 pasos = Padre Nuestro (grande)
    // Las cuentas del padre nuestro van en posiciones 0,11,22,33,44,55 (aprox)
    const esPadre = [0, 11, 22, 33, 44, 55].includes(i);
    const radio   = esPadre ? 8 : 5;

    // Estado: rezada, actual, pendiente
    let fill, stroke;
    if (i < pasoActual && pasoActual > 0) {
      fill = 'rgba(184,144,26,.8)'; stroke = 'rgba(212,168,32,.9)';
    } else if (i === pasoActual) {
      fill = 'rgba(245,237,214,.9)'; stroke = 'rgba(245,237,214,1)';
    } else {
      fill = 'rgba(245,237,214,.1)'; stroke = 'rgba(245,237,214,.25)';
    }

    const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
    circle.setAttribute('cx', x.toFixed(1));
    circle.setAttribute('cy', y.toFixed(1));
    circle.setAttribute('r',  radio);
    circle.setAttribute('fill', fill);
    circle.setAttribute('stroke', stroke);
    circle.setAttribute('stroke-width', esPadre ? '1.5' : '1');
    if (i === pasoActual && esPadre) {
      circle.style.filter = 'drop-shadow(0 0 6px rgba(245,237,214,.8))';
    } else if (i === pasoActual) {
      circle.style.filter = 'drop-shadow(0 0 4px rgba(245,237,214,.6))';
    }

    g.appendChild(circle);
  }
}

// ── Actualizar UI de oración ──────────────────────────────────
function actualizarUI() {
  const paso = SECUENCIA[pasoActual];
  if (!paso) return;

  // Fade out → cambiar → fade in
  const textoEl = document.getElementById('texto-oracion');
  if (!textoEl) return;
  textoEl.style.opacity = '0';

  setTimeout(() => {
    document.getElementById('rubrica-oracion').textContent = paso.o.rubrica + (paso.label ? ` · ${paso.label}` : '');
    document.getElementById('titulo-oracion').textContent  = paso.o.titulo;
    textoEl.innerHTML = paso.o.texto.replace(/\n/g, '<br>');
    textoEl.style.opacity = '1';
  }, 200);

  // Misterio label
  const mLabel = document.getElementById('label-misterio');
  if (mLabel) mLabel.textContent = paso.m >= 0 ? MISTERIOS_NOMBRES[paso.m] : '—';

  // Cuenta label
  const cuentaLabel = document.getElementById('cuenta-label');
  if (cuentaLabel) cuentaLabel.textContent = `Cuenta ${pasoActual} / ${SECUENCIA.length - 1}`;

  // Contador Ave Marías
  const numCuenta = document.getElementById('num-cuenta');
  if (numCuenta) numCuenta.textContent = aveCount;

  // Barra de progreso
  const pct = Math.round((pasoActual / (SECUENCIA.length - 1)) * 100);
  const progFill = document.getElementById('prog-fill');
  const progPct = document.getElementById('prog-pct');
  const progLabel = document.getElementById('prog-label');
  if (progFill) progFill.style.width = pct + '%';
  if (progPct) progPct.textContent = pct + '%';
  if (progLabel) {
    progLabel.textContent = paso.m >= 0 ? MISTERIOS_NOMBRES[paso.m] : (pasoActual === 0 ? 'Preparación' : 'Cierre');
  }

  // Cuentas SVG
  renderCuentas();

  // Completado
  const esUltimo = pasoActual >= SECUENCIA.length - 1;
  const completo = document.getElementById('rosario-completo');
  const avanzarBtn = document.getElementById('btn-avanzar');
  if (completo) completo.classList.toggle('visible', esUltimo);
  if (avanzarBtn) {
    avanzarBtn.disabled = esUltimo;
    avanzarBtn.style.opacity = esUltimo ? '.4' : '1';
  }
}

// ── Avanzar un paso ───────────────────────────────────────────
function avanzar() {
  if (pasoActual >= SECUENCIA.length - 1) return;
  pasoActual++;
  if (SECUENCIA[pasoActual].ave) aveCount++;
  actualizarUI();
}

// ── Reiniciar ─────────────────────────────────────────────────
function reiniciar() {
  pasoActual = 0;
  aveCount   = 0;
  document.getElementById('rosario-completo').classList.remove('visible');
  actualizarUI();
}

// Inicializar al cargar
aplicarMisteriosDelDia();
SECUENCIA = buildSecuencia();
if (document.getElementById('cuentas-group')) {
  renderCuentas();
  actualizarUI();
}


/* ─────────────────────────────────────────────────────────────── */
/* SECTION: MANTENER PANTALLA ACTIVA                               */
/* ─────────────────────────────────────────────────────────────── */

function getKeepAwakePlugin() {
  return window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.KeepAwake;
}

async function mantenerPantallaActiva() {
  const KeepAwake = getKeepAwakePlugin();
  if (!KeepAwake) return;

  try {
    const soporte = await KeepAwake.isSupported();
    if (soporte.isSupported) {
      await KeepAwake.keepAwake();
    }
  } catch (err) {
    console.warn('No se pudo mantener la pantalla activa.', err);
  }
}

async function permitirBloqueoPantalla() {
  const KeepAwake = getKeepAwakePlugin();
  if (!KeepAwake) return;

  try {
    await KeepAwake.allowSleep();
  } catch (err) {
    console.warn('No se pudo restaurar el bloqueo de pantalla.', err);
  }
}

if (document.getElementById('cuentas-group')) {
  mantenerPantallaActiva();
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    mantenerPantallaActiva();
  } else {
    permitirBloqueoPantalla();
  }
});

window.addEventListener('pagehide', () => {
  permitirBloqueoPantalla();
});
