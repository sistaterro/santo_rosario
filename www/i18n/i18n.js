(function(){
  const STORAGE_KEY = 'santoRosario.idioma.v1';
  const defaultLanguage = window.SANTO_ROSARIO_DEFAULT_LANGUAGE || 'es';

  function languages() {
    return window.SANTO_ROSARIO_LANGUAGES || [];
  }

  function catalogs() {
    return window.SANTO_ROSARIO_I18N_MESSAGES || {};
  }

  function baseCode(code) {
    return String(code || '').toLowerCase().split('-')[0];
  }

  function isKnown(code) {
    const normalized = baseCode(code);
    return languages().some(language => language.code === normalized);
  }

  function hasLoadedCatalog(code) {
    return Boolean(catalogs()[baseCode(code)]);
  }

  function hasAvailableCatalog(code) {
    const catalog = catalogs()[baseCode(code)];
    return Boolean(catalog && catalog.meta && catalog.meta.status === 'available');
  }

  function storedLanguage() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return isKnown(value) ? baseCode(value) : null;
    } catch {
      return null;
    }
  }

  function deviceLanguage() {
    const candidates = [navigator.language, ...(navigator.languages || [])];
    const found = candidates.map(baseCode).find(isKnown);
    return found || defaultLanguage;
  }

  function resolveLanguage() {
    const chosen = storedLanguage() || deviceLanguage();
    return hasAvailableCatalog(chosen) ? chosen : defaultLanguage;
  }

  function deepMerge(base, override) {
    if (Array.isArray(base)) return Array.isArray(override) && override.length ? override : base;
    if (!base || typeof base !== 'object') return override === undefined ? base : override;

    const result = { ...base };
    Object.keys(override || {}).forEach(key => {
      result[key] = deepMerge(base[key], override[key]);
    });
    return result;
  }

  function getMessages(code = activeLanguage) {
    const normalized = baseCode(code);
    const base = catalogs()[defaultLanguage] || {};
    if (normalized === defaultLanguage) return base;
    return deepMerge(base, catalogs()[normalized] || {});
  }

  function byPath(source, path) {
    return String(path).split('.').reduce((value, key) => value && value[key], source);
  }

  function t(path, fallback = '') {
    const value = byPath(getMessages(), path);
    return value === undefined || value === null ? fallback : value;
  }

  function setLanguage(code) {
    const normalized = baseCode(code);
    if (!isKnown(normalized)) return;
    try {
      localStorage.setItem(STORAGE_KEY, normalized);
    } catch {
      // La app puede seguir con el idioma detectado si localStorage no está disponible.
    }
    window.location.reload();
  }

  function applyTranslations() {
    const messages = getMessages();
    document.documentElement.lang = activeLanguage;
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const value = byPath(messages, element.dataset.i18n);
      if (value !== undefined && value !== null) element.textContent = value;
    });
  }

  function setupLanguageSelect() {
    const select = document.getElementById('idioma-app');
    if (!select) return;

    select.innerHTML = '';
    languages().forEach(language => {
      const option = document.createElement('option');
      option.value = language.code;
      option.textContent = language.status === 'available'
        ? (language.nativeName || language.name)
        : `${language.nativeName || language.name} · pendiente`;
      option.disabled = language.status !== 'available' || !hasAvailableCatalog(language.code);
      select.appendChild(option);
    });
    select.value = activeLanguage;
    select.addEventListener('change', () => setLanguage(select.value));
  }

  const activeLanguage = resolveLanguage();
  window.SantoRosarioI18n = {
    languages,
    getLanguage: () => activeLanguage,
    getMessages,
    t,
    setLanguage,
    applyTranslations,
    setupLanguageSelect,
  };
})();
