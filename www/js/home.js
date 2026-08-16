(function () {
  const dias = [
    { nombre: 'Domingo', misterio: 'Misterios Gloriosos' },
    { nombre: 'Lunes', misterio: 'Misterios Gozosos' },
    { nombre: 'Martes', misterio: 'Misterios Dolorosos' },
    { nombre: 'Miercoles', misterio: 'Misterios Gloriosos' },
    { nombre: 'Jueves', misterio: 'Misterios Luminosos' },
    { nombre: 'Viernes', misterio: 'Misterios Dolorosos' },
    { nombre: 'Sabado', misterio: 'Misterios Gozosos' },
  ];

  const hoy = dias[new Date().getDay()];
  const resumen = document.getElementById('home-misterio-hoy');
  if (resumen) {
    resumen.textContent = `Rosario de hoy: ${hoy.nombre} · ${hoy.misterio}`;
  }
})();
