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
/* SECTION: DAILY CONTENT                                      */
/* ─────────────────────────────────────────────────────────────── */

const I18N_API = window.SantoRosarioI18n;
const I18N_TEXT = I18N_API?.getMessages?.() || {};
const UI_TEXT = I18N_TEXT.ui || {};

function i18nSection(key, fallback) {
  return I18N_TEXT[key] || fallback;
}

function i18nText(path, fallback) {
  return I18N_API?.t?.(path, fallback) ?? fallback;
}

function prayerTitle(prayer) {
  return prayer?.title ?? prayer?.titulo ?? '';
}

function prayerRubric(prayer) {
  return prayer?.rubric ?? prayer?.rubrica ?? '';
}

function prayerBody(prayer) {
  return prayer?.body ?? prayer?.text ?? prayer?.texto ?? '';
}

I18N_API?.applyTranslations?.();
I18N_API?.setupLanguageSelect?.();

function applyGlobalTexts() {
  document.title = document.body.classList.contains('rosary-screen')
    ? i18nText('ui.rosaryPageTitle', 'Rezar el Santo Rosario')
    : i18nText('ui.appTitle', 'El Santo Rosario');

  const languageSelect = document.getElementById('app-language');
  if (languageSelect) languageSelect.setAttribute('aria-label', i18nText('ui.languageSelectLabel', 'Language'));

  const rosaryOptions = document.querySelector('.rosary-actions');
  if (rosaryOptions) rosaryOptions.setAttribute('aria-label', i18nText('ui.rosaryOptionsLabel', 'Opciones del rosario'));

  const rosarySvg = document.getElementById('rosary-svg');
  if (rosarySvg) rosarySvg.setAttribute('aria-label', i18nText('ui.rosaryImageLabel', 'Cuentas del rosario'));

  const centerAdvance = document.getElementById('center-advance-button');
  if (centerAdvance) centerAdvance.setAttribute('aria-label', i18nText('ui.nextPrayer', 'Siguiente oración'));
}

applyGlobalTexts();

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function calendarForYear(data, year) {
  return isLeapYear(year) ? data.calendario?.bisiesto : data.calendario?.normal;
}

function currentDateKey(date) {
  return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

async function loadDailyVerse() {
  const textElement = document.getElementById('daily-verse-text');
  const referenceElement = document.getElementById('daily-verse-reference');
  if (!textElement || !referenceElement) return;

  try {
    const data = window.SANTO_ROSARIO_VERSES;
    if (!data) throw new Error('No se encontró window.SANTO_ROSARIO_VERSES.');

    const today = new Date();
    const calendar = calendarForYear(data, today.getFullYear());
    const dateKey = currentDateKey(today);
    const assignment = calendar?.find(day => day.fecha === dateKey);
    const verse = data.versiculos?.find(item => item.id === assignment?.versiculoId);
    if (!verse) throw new Error(`No hay versículo asignado para ${dateKey}.`);

    textElement.textContent = `"${verse.texto}"`;
    referenceElement.textContent = verse.traduccion
      ? `${verse.referencia} · ${verse.traduccion}`
      : verse.referencia;
  } catch (error) {
    textElement.textContent = i18nText('ui.verseError', 'No se pudo cargar el versículo del día.');
    referenceElement.textContent = i18nText('ui.dailyReading', 'Lectura diaria');
    console.warn('No se pudo cargar el versículo diario.', error);
  }
}

function loadDailyLatinPhrase() {
  const latinEl = document.getElementById('daily-latin-text');
  const translationElement = document.getElementById('daily-latin-translation');
  if (!latinEl || !translationElement) return;

  try {
    const data = window.SANTO_ROSARIO_LATIN;
    if (!data) throw new Error('No se encontró window.SANTO_ROSARIO_LATIN.');

    const today = new Date();
    const calendar = calendarForYear(data, today.getFullYear());
    const dateKey = currentDateKey(today);
    const assignment = calendar?.find(day => day.fecha === dateKey);
    const phrase = data.frases?.find(item => item.id === assignment?.fraseId);
    if (!phrase) throw new Error(`No hay frase latina asignada para ${dateKey}.`);

    latinEl.textContent = phrase.latin;
    translationElement.textContent = phrase.traduccion;
  } catch (error) {
    latinEl.textContent = 'Sub tuum praesidium.';
    translationElement.textContent = 'Bajo tu amparo.';
    console.warn('No se pudo cargar la frase latina diaria.', error);
  }
}

loadDailyVerse();
loadDailyLatinPhrase();


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
/* SECTION: TABS AND INDEX CONTENT                          */
/* ─────────────────────────────────────────────────────────────── */

function switchMystery(btn, panelId) {
  document.querySelectorAll('.m-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.m-tab').forEach(b => b.setAttribute('aria-selected', 'false'));
  document.querySelectorAll('.mystery-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add('active');
  selectMysteriesByPanel(panelId, true);
}

function switchPrayer(btn, panelId) {
  document.querySelectorAll('.o-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.o-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add('active');
}

function appendTextWithBreaks(element, text) {
  String(text || '').split('\n').forEach((line, index) => {
    if (index > 0) element.appendChild(document.createElement('br'));
    element.appendChild(document.createTextNode(line));
  });
}

function renderMysteriesIndex() {
  const tabs = document.getElementById('mysteries-tabs');
  const panels = document.getElementById('mysteries-panels');
  if (!tabs || !panels) return;

  tabs.innerHTML = '';
  panels.innerHTML = '';

  Object.values(MYSTERIES_BY_TYPE).forEach((mystery) => {
    const tab = document.createElement('button');
    tab.className = 'm-tab';
    tab.type = 'button';
    tab.role = 'tab';
    tab.dataset.panel = mystery.panelId;
    tab.appendChild(document.createTextNode(mystery.titulo.replace(/^Misterios\s+/i, '')));

    const day = document.createElement('span');
    day.className = 'm-tab__day';
    day.textContent = mystery.dia || '';
    tab.appendChild(day);
    tab.addEventListener('click', () => switchMystery(tab, mystery.panelId));
    tabs.appendChild(tab);

    const panel = document.createElement('div');
    panel.id = mystery.panelId;
    panel.className = 'mystery-panel';

    const grid = document.createElement('div');
    grid.className = 'mysteries-grid';
    mystery.nombres.forEach((name, index) => {
      const card = document.createElement('div');
      card.className = 'mystery-card';

      const number = document.createElement('span');
      number.className = 'mystery-card__num';
      number.textContent = ['I', 'II', 'III', 'IV', 'V'][index] || String(index + 1);

      const title = document.createElement('span');
      title.className = 'mystery-card__title';
      title.textContent = name;

      card.append(number, title);
      grid.appendChild(card);
    });

    panel.appendChild(grid);
    panels.appendChild(panel);
  });
}

function renderPrayersIndex() {
  const tabs = document.getElementById('prayer-tabs');
  const panels = document.getElementById('prayer-panels');
  if (!tabs || !panels) return;

  tabs.innerHTML = '';
  panels.innerHTML = '';

  const prayerTabs = i18nSection('prayerTabs', []);
  const prayerPanels = i18nSection('prayerPanels', {});

  prayerTabs.forEach((item, index) => {
    const tab = document.createElement('button');
    tab.className = `o-tab${index === 0 ? ' active' : ''}`;
    tab.type = 'button';
    tab.role = 'tab';
    tab.textContent = item.label;
    tab.addEventListener('click', () => switchPrayer(tab, item.id));
    tabs.appendChild(tab);

    const panel = document.createElement('div');
    panel.id = item.id;
    panel.className = `o-panel${index === 0 ? ' active' : ''}`;

    const key = item.id.replace(/^o-/, '');
    (prayerPanels[key] || []).forEach((block, blockIndex) => {
      const article = document.createElement('div');
      article.className = 'prayer-block shell--narrow';

      const rubric = document.createElement('span');
      rubric.className = 't-rubric prayer-block__rubric';
      rubric.textContent = block.rubrica;
      article.appendChild(rubric);

      if (block.titulo) {
        const title = document.createElement('h3');
        title.className = 't-heading prayer-block__title';
        title.style.fontSize = '1.05rem';
        title.textContent = block.titulo;
        article.appendChild(title);
      }

      const text = document.createElement('p');
      text.className = `prayer-block__text${blockIndex === 0 ? ' dropcap' : ''}`;
      appendTextWithBreaks(text, block.texto);
      article.appendChild(text);
      panel.appendChild(article);
    });

    panels.appendChild(panel);
  });
}


/* ─────────────────────────────────────────────────────────────── */
/* SECTION: INTERACTIVE ROSARY CORE                */
/* ─────────────────────────────────────────────────────────────── */

/*
  Full rosary sequence:
  0  — Señal de la Cruz
  1  — Credo
  2  — Padre Nuestro (inicial)
  3,4,5 — 3 Ave Marías (Fe, Esperanza, Caridad)
  6  — Gloria
  ──── Misterio 1 (decena) ────
  7  — Mystery announcement (no bead)
  8  — Padre Nuestro
  9..18 — 10 Ave Marías
  19 — Gloria
  20 — Oración de Fátima
  ──── Mysteries 2..5 repeat the same structure ────
  ... (steps 20-59, four more mysteries)
  Final — Salve Regina
*/

const PRAYERS = i18nSection('prayers', {
  signo:       { rubrica: 'Apertura', titulo: 'Señal de la Santa Cruz', texto: 'Por la señal de la Santa Cruz, de nuestros enemigos, líbranos, Señor, Dios nuestro.\n\nEn el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.' },
  credo:       { rubrica: 'Acto de fe', titulo: 'El Credo Apostólico', texto: 'Creo en Dios, Padre Todopoderoso, Creador del Cielo y de la tierra. Creo en Jesucristo, su único Hijo, Nuestro Señor...\n\nAmén.' },
  padre:       { rubrica: 'Oración dominical', titulo: 'Padre Nuestro', texto: 'Padre nuestro que estás en el Cielo, santificado sea tu Nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el Cielo.\n\nDanos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en la tentación, y líbranos del mal. Amén.' },
  ave:         { rubrica: 'Salutación angélica', titulo: 'Ave María', texto: 'Dios te salve, María, llena eres de gracia; el Señor es contigo; bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús.\n\nSanta María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén.' },
  aveFe:       { rubrica: 'Hija de Dios Padre', titulo: 'Ave María', texto: 'Dios te salve, María Santísima, Hija de Dios Padre, Virgen purísima antes del parto; en tus manos encomendamos nuestra Fe, para que la alumbres.\n\nLlena eres de gracia, el Señor es contigo; bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús.\n\nSanta María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén.' },
  aveEsperanza:{ rubrica: 'Madre de Dios Hijo', titulo: 'Ave María', texto: 'Dios te salve, María Santísima, Madre de Dios Hijo, Virgen purísima en el parto; en tus manos encomendamos nuestra Esperanza, para que la alientes.\n\nLlena eres de gracia, el Señor es contigo; bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús.\n\nSanta María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén.' },
  aveCaridad:  { rubrica: 'Esposa de Dios Espíritu Santo', titulo: 'Ave María', texto: 'Dios te salve, María Santísima, Esposa de Dios Espíritu Santo, Virgen purísima después del parto; en tus manos encomendamos nuestra Caridad, para que la inflames.\n\nLlena eres de gracia, el Señor es contigo; bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús.\n\nSanta María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén.' },
  gloria:      { rubrica: 'Doxología', titulo: 'Gloria al Padre', texto: 'Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, y por los siglos de los siglos. Amén.' },
  fatima:      { rubrica: 'Visión de Fátima · 1917', titulo: 'Oración de Fátima', texto: 'Oh Jesús mío, perdona nuestros pecados, líbranos del fuego del infierno. Lleva al cielo a todas las almas, especialmente a las más necesitadas de tu misericordia. Amén.' },
  salve:       { rubrica: 'Oración final', titulo: 'Salve Regina', texto: 'Dios te salve, Reina y Madre de misericordia; vida, dulzura y esperanza nuestra, Dios te salve.\n\nA Ti llamamos los desterrados hijos de Eva; a Ti suspiramos gimiendo y llorando en este valle de lágrimas. Ea, pues, Señora, abogada nuestra, vuelve a nosotros esos tus ojos misericordiosos; y después de este destierro, muéstranos a Jesús, fruto bendito de tu vientre.\n\n¡Oh clementísima, oh piadosa, oh dulce Virgen María! Amén.' },
});

const MYSTERIES_BY_TYPE = i18nSection('mysteries', {
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
});

const WEEKDAYS = i18nSection('weekdays', [
  { name: 'Domingo', tipo: 'gloriosos' },
  { name: 'Lunes', tipo: 'gozosos' },
  { name: 'Martes', tipo: 'dolorosos' },
  { name: 'Miércoles', tipo: 'gloriosos' },
  { name: 'Jueves', tipo: 'luminosos' },
  { name: 'Viernes', tipo: 'dolorosos' },
  { name: 'Sábado', tipo: 'gozosos' },
]);

let currentMysteryType = WEEKDAYS[new Date().getDay()].tipo;
let MYSTERY_NAMES = MYSTERIES_BY_TYPE[currentMysteryType].nombres;

function getTypeByPanel(panelId) {
  return Object.keys(MYSTERIES_BY_TYPE).find(type => MYSTERIES_BY_TYPE[type].panelId === panelId);
}

function selectMysteriesByPanel(panelId, shouldRestart) {
  const type = getTypeByPanel(panelId);
  if (!type || type === currentMysteryType) return;
  currentMysteryType = type;
  MYSTERY_NAMES = MYSTERIES_BY_TYPE[type].nombres;
  SEQUENCE = buildSequence();
  if (shouldRestart) restart();
}

function applyDailyMysteries() {
  const todayEntry = WEEKDAYS[new Date().getDay()];
  const mystery = MYSTERIES_BY_TYPE[todayEntry.tipo];
  currentMysteryType = todayEntry.tipo;
  MYSTERY_NAMES = mystery.nombres;

  document.querySelectorAll('.m-tab').forEach(btn => {
    const isActive = btn.dataset.panel === mystery.panelId;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  document.querySelectorAll('.mystery-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === mystery.panelId);
  });

  const summary = document.getElementById('today-mysteries');
  if (summary) {
    summary.textContent = `${i18nText('ui.mysteriesToday', 'Rosario de hoy')}: ${todayEntry.nombre || todayEntry.name} · ${mystery.titulo}`;
  }
}

// Step sequence:
// Each entry stores the prayer, mystery index, bead status, and optional label.
function buildSequence() {
  const seq = [];
  // Opening
  seq.push({ o: PRAYERS.signo,  m: -1, ave: false });
  seq.push({ o: PRAYERS.credo,  m: -1, ave: false });
  seq.push({ o: PRAYERS.padre,  m: -1, ave: false, bead: 'ourFather' });
  seq.push({ o: PRAYERS.aveFe,        m: -1, ave: true, bead: 'hailMary', label: i18nText('rosary.faith', 'Fe') });
  seq.push({ o: PRAYERS.aveEsperanza, m: -1, ave: true, bead: 'hailMary', label: i18nText('rosary.hope', 'Esperanza') });
  seq.push({ o: PRAYERS.aveCaridad,   m: -1, ave: true, bead: 'hailMary', label: i18nText('rosary.charity', 'Caridad') });
  seq.push({ o: PRAYERS.gloria, m: -1, ave: false });

  // Five decades
  for (let i = 0; i < 5; i++) {
    // Mystery announcement: pause for contemplation; it does not map to a bead.
    seq.push({
      o: {
        rubrica: i18nText('rosary.mysteryAnnouncement', 'Anuncio del misterio'),
        titulo: MYSTERY_NAMES[i],
        texto: i18nText('rosary.mysteryAnnouncementText', 'Anunciá el misterio y hacé una breve pausa para contemplarlo antes de rezar el Padre Nuestro.')
      },
      m: i, ave: false, espera: true, anuncio: true
    });
    seq.push({
      o: { rubrica: `${MYSTERY_NAMES[i]}`, titulo: prayerTitle(PRAYERS.padre), texto: prayerBody(PRAYERS.padre) },
      m: i, ave: false, bead: 'ourFather'
    });
    // Ten Hail Marys
    for (let j = 1; j <= 10; j++) {
      seq.push({ o: PRAYERS.ave, m: i, ave: true, bead: 'hailMary', label: `${j} ${i18nText('rosary.ofTen', 'de 10')}` });
    }
    // Glory Be + Fatima prayer
    seq.push({ o: PRAYERS.gloria, m: i, ave: false });
    seq.push({ o: PRAYERS.fatima, m: i, ave: false });
  }

  // Final Hail Holy Queen
  seq.push({ o: PRAYERS.salve, m: -1, ave: false });
  return seq;
}

let SEQUENCE = buildSequence();
// Count only Hail Mary prayers for the visible counter.
// The sequence has 3 intro Hail Marys plus five decades.

let currentStep = 0;
let aveCount   = 0;
let uiInitialized = false;
let celebrationTriggered = false;

const LEGACY_PROGRESS_KEY = 'santoRosario.progreso.v1';
const PROGRESS_KEY = 'santoRosario.progress.v1';
const LEGACY_PRAYER_GUIDE_KEY = 'santoRosario.guiaOracion.v1';
const PRAYER_GUIDE_KEY = 'santoRosario.prayerGuide.v1';

let prayerGuideEnabled = false;

function localISODate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function readStoredProgress() {
  try {
    const progress = localStorage.getItem(PROGRESS_KEY);
    if (progress) return JSON.parse(progress);

    const legacyProgress = localStorage.getItem(LEGACY_PROGRESS_KEY);
    if (!legacyProgress) return null;

    const parsedProgress = JSON.parse(legacyProgress);
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(parsedProgress));
    localStorage.removeItem(LEGACY_PROGRESS_KEY);
    return parsedProgress;
  } catch {
    return null;
  }
}

function saveProgress() {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({
      date: localISODate(),
      mysteryType: currentMysteryType,
      currentStep,
      aveCount,
    }));
  } catch {
    // If storage is unavailable, the app still works without persistence.
  }
}

function clearStoredProgress() {
  try {
    localStorage.removeItem(PROGRESS_KEY);
  } catch {
    // No action is needed if storage fails.
  }
}

function readPrayerGuidePreference() {
  try {
    const preference = localStorage.getItem(PRAYER_GUIDE_KEY);
    if (preference !== null) return preference === 'true';

    const legacyPreference = localStorage.getItem(LEGACY_PRAYER_GUIDE_KEY);
    if (legacyPreference === null) return false;

    localStorage.setItem(PRAYER_GUIDE_KEY, legacyPreference);
    localStorage.removeItem(LEGACY_PRAYER_GUIDE_KEY);
    return legacyPreference === 'true';
  } catch {
    return false;
  }
}

function savePrayerGuidePreference() {
  try {
    localStorage.setItem(PRAYER_GUIDE_KEY, prayerGuideEnabled ? 'true' : 'false');
  } catch {
    // The guide is optional; if saving fails, only the preference is lost.
  }
}

function restoreDailyProgress() {
  const storedProgress = readStoredProgress();
  const today = localISODate();

  if (!storedProgress) return;

  const storedDate = storedProgress.date || storedProgress.fecha;
  const storedMysteryType = storedProgress.mysteryType || storedProgress.tipo;

  if (storedDate !== today || storedMysteryType !== currentMysteryType) {
    clearStoredProgress();
    currentStep = 0;
    aveCount = 0;
    return;
  }

  currentStep = Math.max(0, Math.min(Number(storedProgress.currentStep) || 0, SEQUENCE.length - 1));
  aveCount = countHailMarysThrough(currentStep);
}

function msUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

function resetIfDateChanged() {
  const storedProgress = readStoredProgress();
  const storedDate = storedProgress?.date || storedProgress?.fecha;
  if (!storedProgress || storedDate === localISODate()) return;

  resetDailyRosary({ applyToday: true, shouldSave: false });
}

function scheduleMidnightReset() {
  window.setTimeout(() => {
    resetIfDateChanged();
    scheduleMidnightReset();
  }, msUntilMidnight() + 1000);
}

// Render SVG beads ────────────────────────────────────
function renderBeads() {
  const g = document.getElementById('beads-group');
  if (!g) return;
  g.innerHTML = '';

  const visibleBeads = SEQUENCE
    .map((step, index) => ({ step, index }))
    .filter(({ step }) => step.bead);
  const currentBeadIndex = visibleBeads.find(bead => bead.index === currentStep)?.index ?? null;
  const rosaryComplete = currentStep >= SEQUENCE.length - 1;
  const cx = 100, cy = 132, rx = 101, ry = 116;
  const crownGap = 0.12;
  const crownStart = -Math.PI / 2 + crownGap;
  const crownEnd = (Math.PI * 3) / 2 - crownGap;
  const crownArc = crownEnd - crownStart;
  const topJunction = { x: cx, y: 18 };
  const rightArm = {
    x: cx + rx * Math.cos(crownStart),
    y: cy + ry * Math.sin(crownStart),
  };
  const leftArm = {
    x: cx + rx * Math.cos(crownEnd),
    y: cy + ry * Math.sin(crownEnd),
  };

  const drawBead = ({ step, index }, x, y) => {
    const isOurFather = step.bead === 'ourFather';

    const isCurrent = !rosaryComplete && index === currentBeadIndex;
    const radius = isCurrent ? 6.9 : (isOurFather ? 5.35 : 3.65);

    // State: completed, current, pending
    let fill, stroke;
    if (index < currentStep && currentStep > 0) {
      fill = 'rgba(245,182,42,.82)'; stroke = 'rgba(255,218,96,.92)';
    } else if (isCurrent) {
      fill = 'rgba(255,248,225,.98)'; stroke = 'rgba(255,255,255,1)';
    } else {
      fill = 'rgba(255,248,225,.18)'; stroke = 'rgba(255,248,225,.48)';
    }

    const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
    circle.setAttribute('cx', x.toFixed(1));
    circle.setAttribute('cy', y.toFixed(1));
    circle.setAttribute('r',  radius);
    circle.setAttribute('fill', fill);
    circle.setAttribute('stroke', stroke);
    circle.setAttribute('stroke-width', isCurrent ? '1.75' : (isOurFather ? '1.25' : '.9'));
    if (isCurrent && isOurFather) {
      circle.style.filter = 'drop-shadow(0 0 6px rgba(255,248,225,.85))';
    } else if (isCurrent) {
      circle.style.filter = 'drop-shadow(0 0 5px rgba(255,248,225,.7))';
    }

    circle.setAttribute('role', 'button');
    circle.setAttribute('tabindex', '0');
    circle.setAttribute('aria-label', `${i18nText('ui.goTo', 'Ir a')} ${prayerTitle(step.o)}`);
    circle.addEventListener('click', () => goToStep(index));
    circle.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        goToStep(index);
      }
    });

    g.appendChild(circle);
  };

  const introBeads = visibleBeads.filter(({ step }) => step.m < 0);
  const decadeBeads = visibleBeads.filter(({ step }) => step.m >= 0);
  const introPositions = [
    { x: cx, y: 74 },
    { x: cx, y: 56 },
    { x: cx, y: 38 },
    topJunction,
  ];

  if (introBeads.length) {
    const cord = document.createElementNS('http://www.w3.org/2000/svg','path');
    cord.setAttribute('d', [
      `M ${leftArm.x.toFixed(1)} ${leftArm.y.toFixed(1)}`,
      `C ${(cx - 12).toFixed(1)} 16, ${(cx - 7).toFixed(1)} 18, ${topJunction.x} ${topJunction.y}`,
      `C ${(cx + 7).toFixed(1)} 18, ${(cx + 12).toFixed(1)} 16, ${rightArm.x.toFixed(1)} ${rightArm.y.toFixed(1)}`,
      `M ${topJunction.x} ${topJunction.y} L ${cx} 102`,
    ].join(' '));
    cord.setAttribute('fill', 'none');
    cord.setAttribute('stroke', 'rgba(255,211,91,.54)');
    cord.setAttribute('stroke-width', '1');
    cord.setAttribute('stroke-linecap', 'round');
    cord.setAttribute('stroke-linejoin', 'round');
    g.appendChild(cord);
  }

  const crownBeads = decadeBeads.slice(1);
  const totalCorona = crownBeads.length;
  for (let i = 0; i < totalCorona; i++) {
    const progress = totalCorona > 1 ? i / (totalCorona - 1) : 0;
    const angle = crownStart + progress * crownArc;
    const { step } = crownBeads[i];
    const isOurFather = !step.ave;
    const beadRx = isOurFather ? rx + 5 : rx;
    const beadRy = isOurFather ? ry + 5 : ry;
    const x = cx + beadRx * Math.cos(angle);
    const y = cy + beadRy * Math.sin(angle);

    drawBead(crownBeads[i], x, y);
  }

  introBeads.forEach((bead, i) => {
    const position = introPositions[i];
    if (position) drawBead(bead, position.x, position.y);
  });
}

function triggerFinalCelebration() {
  const burst = document.getElementById('rosary-burst');
  if (!burst) return;

  burst.classList.remove('active');
  void burst.offsetWidth;
  burst.classList.add('active');
}

function countHailMarysThrough(stepIndex) {
  return SEQUENCE.slice(0, stepIndex + 1).filter(step => step.ave).length;
}

function centerMysteryLines(text) {
  if (text === '') return [];
  if (!text) return [i18nText('ui.preparation', 'Preparaci?n').toUpperCase()];

  const cleanText = text.replace(/^La |^El |^Las |^Los /i, '').toUpperCase();
  const words = cleanText.split(/\s+/).filter(Boolean);
  const lines = [];
  const maxCharacters = 15;

  words.forEach((word) => {
    if (lines.length === 0) {
      lines.push(word);
      return;
    }

    const currentLine = lines[lines.length - 1] || '';
    const candidate = currentLine ? `${currentLine} ${word}` : word;

    if (candidate.length <= maxCharacters) {
      lines[lines.length - 1] = candidate;
    } else {
      lines.push(word);
    }
  });

  return lines.length ? lines : ['PREPARACION'];
}

function renderCenterMystery(element, text) {
  const svgNS = 'http://www.w3.org/2000/svg';
  const lines = centerMysteryLines(text);

  element.textContent = '';
  lines.forEach((line, index) => {
    const tspan = document.createElementNS(svgNS, 'tspan');
    tspan.setAttribute('x', '100');
    tspan.setAttribute('dy', index === 0 ? '0' : '9');
    tspan.textContent = line;
    element.appendChild(tspan);
  });
}

function updatePrayerGuide(step) {
  const panel = document.getElementById('prayer-guide');
  const rubric = document.getElementById('guide-rubric');
  const title = document.getElementById('guide-title');
  const text = document.getElementById('guide-text');
  const toggle = document.getElementById('toggle-prayer-guide');

  if (toggle) toggle.checked = prayerGuideEnabled;
  if (!panel) return;

  panel.hidden = !prayerGuideEnabled;
  if (!prayerGuideEnabled || !step) return;

  if (rubric) rubric.textContent = prayerRubric(step.o) + (step.label ? ` · ${step.label}` : '');
  if (title) title.textContent = prayerTitle(step.o);
  if (text) text.innerHTML = prayerBody(step.o).replace(/\n/g, '<br>');
  panel.scrollTop = 0;
}

// Update prayer UI ──────────────────────────────────
function updateUI() {
  const step = SEQUENCE[currentStep];
  if (!step) return;

  document.body.classList.toggle('rosary-at-start', currentStep === 0);

  updatePrayerGuide(step);

  // Fade out, update, fade in
  const textElement = document.getElementById('texto-oracion');
  if (textElement) {
    textElement.style.opacity = '0';

    setTimeout(() => {
      document.getElementById('rubrica-oracion').textContent = prayerRubric(step.o) + (step.label ? ` · ${step.label}` : '');
      document.getElementById('titulo-oracion').textContent  = prayerTitle(step.o);
      textElement.innerHTML = prayerBody(step.o).replace(/\n/g, '<br>');
      textElement.style.opacity = '1';
    }, 200);
  }

  // Mystery label
  const mLabel = document.getElementById('mystery-label');
  if (mLabel) mLabel.textContent = step.m >= 0 ? MYSTERY_NAMES[step.m] : '—';

  const centerMystery = document.getElementById('center-mystery');
  if (centerMystery) {
    const isLast = currentStep >= SEQUENCE.length - 1;
    renderCenterMystery(centerMystery, isLast ? '' : (step.m >= 0 ? MYSTERY_NAMES[step.m] : i18nText('ui.preparation', 'Preparaci?n').toUpperCase()));
  }

  // Bead label
  const beadLabel = document.getElementById('bead-label');
  if (beadLabel) beadLabel.textContent = `${i18nText('ui.count', 'Cuenta')} ${currentStep} / ${SEQUENCE.length - 1}`;

  const counterTitle = document.getElementById('counter-title');
  if (counterTitle) {
    counterTitle.textContent = prayerTitle(step.o) + (step.label ? ` · ${step.label}` : '');
  }

  // Progress bar
  const pct = Math.round((currentStep / (SEQUENCE.length - 1)) * 100);
  const progFill = document.getElementById('prog-fill');
  const progPct = document.getElementById('prog-pct');
  const progLabel = document.getElementById('prog-label');
  if (progFill) progFill.style.width = pct + '%';
  if (progPct) progPct.textContent = pct + '%';
  if (progLabel) {
    progLabel.textContent = step.m >= 0 ? MYSTERY_NAMES[step.m] : (currentStep === 0 ? i18nText('ui.preparation', 'Preparación') : i18nText('ui.closing', 'Cierre'));
  }

  // SVG beads
  renderBeads();

  // Completion state
  const isLast = currentStep >= SEQUENCE.length - 1;
  const completion = document.getElementById('rosary-completion');
  const advanceBtn = document.getElementById('advance-button');
  document.body.classList.toggle('rosary-complete', isLast);
  if (completion) completion.classList.toggle('visible', isLast);
  if (advanceBtn) {
    advanceBtn.disabled = isLast;
    advanceBtn.style.opacity = isLast ? '.4' : '1';
  }

  if (isLast && !uiInitialized) {
    celebrationTriggered = true;
  } else if (isLast && !celebrationTriggered) {
    triggerFinalCelebration();
    celebrationTriggered = true;
  } else if (!isLast) {
    celebrationTriggered = false;
  }

  uiInitialized = true;
}

// Advance one step ───────────────────────────────────────────
function advance() {
  if (currentStep >= SEQUENCE.length - 1) return;
  currentStep++;
  aveCount = countHailMarysThrough(currentStep);
  updateUI();
  saveProgress();
}

function goToStep(idx) {
  currentStep = Math.max(0, Math.min(idx, SEQUENCE.length - 1));
  aveCount = countHailMarysThrough(currentStep);
  updateUI();
  saveProgress();
}

function resetDailyRosary({ applyToday = false, shouldSave = true } = {}) {
  if (applyToday) {
    clearStoredProgress();
    applyDailyMysteries();
    SEQUENCE = buildSequence();
  }

  currentStep = 0;
  aveCount = 0;
  celebrationTriggered = false;

  const completion = document.getElementById('rosary-completion');
  if (completion) completion.classList.remove('visible');

  updateUI();

  if (shouldSave) {
    saveProgress();
  }
}

// Restart ─────────────────────────────────────────────────
function restart() {
  resetDailyRosary();
}

// Initialize on load
renderMysteriesIndex();
renderPrayersIndex();
applyDailyMysteries();
SEQUENCE = buildSequence();
restoreDailyProgress();
prayerGuideEnabled = readPrayerGuidePreference();
if (document.getElementById('beads-group')) {
  renderBeads();
  updateUI();
}
scheduleMidnightReset();

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) resetIfDateChanged();
});

const centerAdvance = document.getElementById('center-advance-button');
if (centerAdvance) {
  centerAdvance.addEventListener('click', advance);
  centerAdvance.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      advance();
    }
  });
}

const restartRosaryButton = document.getElementById('restart-rosary-button');
if (restartRosaryButton) {
  restartRosaryButton.addEventListener('click', restart);
}

const togglePrayerGuide = document.getElementById('toggle-prayer-guide');
if (togglePrayerGuide) {
  togglePrayerGuide.checked = prayerGuideEnabled;
  togglePrayerGuide.addEventListener('change', () => {
    prayerGuideEnabled = togglePrayerGuide.checked;
    savePrayerGuidePreference();
    updateUI();
  });
}


/* ─────────────────────────────────────────────────────────────── */
/* SECTION: KEEP SCREEN AWAKE                               */
/* ─────────────────────────────────────────────────────────────── */

function getKeepAwakePlugin() {
  return window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.KeepAwake;
}

async function keepScreenAwake() {
  const KeepAwake = getKeepAwakePlugin();
  if (!KeepAwake) return;

  try {
    const support = await KeepAwake.isSupported();
    if (support.isSupported) {
      await KeepAwake.keepAwake();
    }
  } catch (err) {
    console.warn('Could not keep the screen awake.', err);
  }
}

async function allowScreenLock() {
  const KeepAwake = getKeepAwakePlugin();
  if (!KeepAwake) return;

  try {
    await KeepAwake.allowSleep();
  } catch (err) {
    console.warn('Could not restore screen sleep.', err);
  }
}

if (document.getElementById('beads-group')) {
  keepScreenAwake();
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    keepScreenAwake();
  } else {
    allowScreenLock();
  }
});

window.addEventListener('pagehide', () => {
  allowScreenLock();
});
