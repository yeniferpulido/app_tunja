import './styles.css';

const app = document.querySelector('#app');

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const routeAlerts = [
  {
    id: 'centro',
    name: 'Centro Histórico',
    status: 'Ruta segura',
    detail: 'Carriles con menos tránsito y mejor iluminación.',
    x: 24,
    y: 52,
    isVisible: true,
  },
  {
    id: 'universidad',
    name: 'Universidad Pedagógica',
    status: 'Punto crítico',
    detail: 'Tráfico mixto en horas pico.',
    x: 62,
    y: 43,
    isVisible: true,
  },
  {
    id: 'floresta',
    name: 'La Floresta',
    status: 'Ruta recomendada',
    detail: 'Mejor flujo para ciclistas y peatones.',
    x: 76,
    y: 70,
    isVisible: true,
  },
];

const getVisibleRouteAlerts = () => routeAlerts.filter((point) => point.isVisible !== false);

const safetyTips = [
  'Usa casco y prendas visibles en horas de baja luz.',
  'Respeta las señales de tránsito y evita maniobras bruscas.',
  'Mantén distancia de buses y vehículos en intersecciones.',
  'Haz uso del faro y revisa frenos antes de cada recorrido.',
];

const mobilityTips = [
  'Recorre por rutas con menos tráfico en horas pico.',
  'Usa los parqueaderos seguros y evita bloquear aceras.',
  'Planifica rutas por avenidas con ciclovía o separación física.',
  'Comparte tu recorrido con la comunidad para mejorar seguridad.',
];

const nearbyRoutes = [
  {
    name: 'Centro Histórico',
    danger: 'Baja',
    description: 'Ruta con mejor señalización y menos conflicto con tráfico pesado.',
    lat: 5.5337,
    lon: -73.3671,
  },
  {
    name: 'Universidad Pedagógica',
    danger: 'Media',
    description: 'Punto con mayor flujo vehicular en horas pico.',
    lat: 5.5513,
    lon: -73.3624,
  },
  {
    name: 'La Floresta',
    danger: 'Baja',
    description: 'Recorrido recomendado para desplazamientos tranquilos y seguros.',
    lat: 5.5723,
    lon: -73.3552,
  },
];

const reportStorageKey = 'tunja-reportes';

const getStoredReports = () => {
  try {
    return JSON.parse(localStorage.getItem(reportStorageKey) || '[]');
  } catch (error) {
    return [];
  }
};

const setStoredReports = (reports) => {
  localStorage.setItem(reportStorageKey, JSON.stringify(reports.slice(0, 8)));
};

const formatReportDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Sin fecha';
  }

  return date.toLocaleString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getDistanceKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (n) => (n * Math.PI) / 180;
  const earthRadius = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const getReportMapPoints = () => {
  const reports = getStoredReports();

  return reports
    .filter((report) => report.location && report.status !== 'removed')
    .map((report, index) => {
      const baseSeed = [...report.location].reduce((total, char) => total + char.charCodeAt(0), 0) + index * 91;
      const x = 14 + (baseSeed % 68);
      const y = 18 + ((baseSeed * 7) % 62);

      return {
        id: `report-${report.id}`,
        name: report.location,
        status: 'Punto crítico',
        detail: `${report.type}: ${report.details}`,
        x,
        y,
        reportId: report.id,
      };
    });
};

const getNearestRoute = (lat, lon) => {
  let nearest = nearbyRoutes[0];
  let bestDistance = Number.POSITIVE_INFINITY;

  nearbyRoutes.forEach((route) => {
    const distance = getDistanceKm(lat, lon, route.lat, route.lon);
    if (distance < bestDistance) {
      nearest = route;
      bestDistance = distance;
    }
  });

  return { nearest, bestDistance };
};

const normalizeText = (value = '') =>
  String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const checkReportStillActive = (locationText) => {
  const reports = getStoredReports();
  const cleanedInput = normalizeText(locationText);

  if (!cleanedInput || !reports.length) {
    return {
      active: false,
      message: 'No hay reportes activos cerca de esa ubicación.',
    };
  }

  const matches = reports.filter((report) => {
    const cleanedLocation = normalizeText(report.location || '');
    return cleanedLocation && (cleanedLocation.includes(cleanedInput) || cleanedInput.includes(cleanedLocation));
  });

  if (!matches.length) {
    return {
      active: false,
      message: 'No se encontró un reporte activo en esa zona.',
    };
  }

  return {
    active: true,
    message: `Sí, sigue activo: ${matches[0].type} en ${matches[0].location}.`,
  };
};

const renderHomePage = () => {
  const mapPoints = [...getVisibleRouteAlerts(), ...getReportMapPoints()];

  app.innerHTML = `
    <header class="topbar">
      <div class="brand">
        <span class="brand-mark">🚲</span>
        <span>Tunja sobre Ruedas</span>
      </div>
      <nav class="nav">
        <a href="#inicio">Inicio</a>
        <a href="#mapa">Mapa</a>
        <a href="#reportar">Reportar</a>
      </nav>
    </header>

    <main class="page-shell">
      <section class="hero" id="inicio">
        <div class="hero-copy">
          <span class="eyebrow">Movilidad urbana • acceso abierto</span>
          <h1>Descubre cómo se mueve Tunja.</h1>
          <p>
            Una app móvil para identificar rutas seguras, detectar puntos críticos,
            conocer la problemática vial y reportar situaciones que afectan a ciclistas y peatones.
          </p>

          <div class="cta-row">
            <a class="primary-btn" href="#mapa">Ver rutas</a>
            <a class="secondary-btn" href="#reportar">Reportar</a>
          </div>

          <ul class="mini-stats">
            <li>
              <strong>10+</strong>
              <span>puntos de observación</span>
            </li>
            <li>
              <strong>4 rutas</strong>
              <span>recomendadas</span>
            </li>
            <li>
              <strong>24/7</strong>
              <span>información pública</span>
            </li>
          </ul>
        </div>
      </section>

      <section class="map-section" id="mapa">
        <div class="section-title">
          <span class="eyebrow">Mapa interactivo</span>
          <h2>Puntos críticos y rutas seguras</h2>
        </div>

        <div class="map-toolbar" aria-label="Filtros del mapa">
          <button type="button" class="filter-chip selected" data-filter="all">Todo</button>
          <button type="button" class="filter-chip" data-filter="safe">Seguras</button>
          <button type="button" class="filter-chip" data-filter="critical">Críticas</button>
        </div>

        <div class="map-layout">
          <div class="map-card">
            <div class="map-surface">
              <div class="map-road road-a"></div>
              <div class="map-road road-b"></div>
              <div class="map-road road-c"></div>
              ${mapPoints
                .map(
                  (point) => `
                    <button class="map-point ${point.status === 'Punto crítico' ? 'critical' : 'safe'}" style="left:${point.x}%; top:${point.y}%" data-point="${point.id}" data-status="${point.status === 'Punto crítico' ? 'critical' : 'safe'}" type="button" aria-label="${point.name}">
                      <span>${point.status === 'Punto crítico' ? '⚠' : '✓'}</span>
                    </button>
                  `,
                )
                .join('')}
            </div>
          </div>

          <div class="map-list" id="route-points">
            ${mapPoints
              .map(
                (point) => `
                  <article class="route-item ${point.status === 'Punto crítico' ? 'critical' : 'safe'}" data-point-card="${point.id}" data-status="${point.status === 'Punto crítico' ? 'critical' : 'safe'}">
                    <div class="route-badge">${point.status}</div>
                    <h3>${point.name}</h3>
                    <p>${point.detail}</p>
                    ${point.reportId ? '' : `
                      <div class="report-actions">
                        <button class="mini-btn success" type="button" data-route-action="keep" data-route-id="${point.id}">Sí, sigue ahí</button>
                        <button class="mini-btn danger" type="button" data-route-action="remove" data-route-id="${point.id}">No, ya no está</button>
                      </div>
                    `}
                  </article>
                `,
              )
              .join('')}
          </div>
        </div>
      </section>

      <section class="features" id="explora">
        <div class="section-title">
          <span class="eyebrow">La ciudad en movimiento</span>
          <h2>Información útil para usar la bicicleta con más seguridad</h2>
        </div>

        <div class="cards two-cols">
          <article class="card info-card">
            <div class="icon">🚴</div>
            <h3>Consejos de seguridad vial</h3>
            <ul class="check-list">
              ${safetyTips.map((tip) => `<li>${tip}</li>`).join('')}
            </ul>
          </article>

          <article class="card info-card">
            <div class="icon">💡</div>
            <h3>Tips de movilidad</h3>
            <ul class="check-list">
              ${mobilityTips.map((tip) => `<li>${tip}</li>`).join('')}
            </ul>
          </article>
        </div>
      </section>

      <section class="report-section" id="reportar">
        <div class="section-title">
          <span class="eyebrow">Reporte ciudadano</span>
          <h2>Reporta obstáculos y puntos críticos</h2>
        </div>

        <div class="report-layout">
          <form id="report-form" class="report-form">
            <label>
              <span>Nombre</span>
              <input type="text" name="name" placeholder="Tu nombre" required />
            </label>
            <label>
              <span>Ubicación</span>
              <input type="text" name="location" placeholder="Ej. Calle 10 con Carrera 4" required />
            </label>
            <label>
              <span>Tipo de problema</span>
              <select name="type">
                <option value="Bache">Bache</option>
                <option value="Vehículo peligroso">Vehículo peligroso</option>
                <option value="Falta de señalización">Falta de señalización</option>
                <option value="Obstáculo en vía">Obstáculo en vía</option>
                <option value="Otro">Otro</option>
              </select>
            </label>
            <label>
              <span>Descripción</span>
              <textarea name="details" rows="4" placeholder="Describe el punto crítico o la situación observada" required></textarea>
            </label>
            <button type="submit" class="primary-btn">Enviar reporte</button>
          </form>

          <div class="reports-panel">
            <h3>Reportes recientes</h3>
            <div id="reports-list" class="reports-list"></div>
          </div>
        </div>
      </section>

      <section class="cta-band">
        <div>
          <span class="eyebrow">Acceso público</span>
          <h2>Consulta rutas, reportes y puntos de riesgo.</h2>
        </div>
        <a class="primary-btn" href="#mapa">Ver mapa</a>
      </section>
    </main>
  `;

  const bindMapInteractions = () => {
    const points = [...app.querySelectorAll('[data-point]')];
    const cards = [...app.querySelectorAll('[data-point-card]')];
    const filterButtons = [...app.querySelectorAll('[data-filter]')];
    const routeItems = [...app.querySelectorAll('.route-item')];
    let currentFilter = 'all';

    const applyFilter = () => {
      points.forEach((button) => {
        const visible = currentFilter === 'all' || button.dataset.status === currentFilter;
        button.style.display = visible ? '' : 'none';
      });

      routeItems.forEach((item) => {
        const visible = currentFilter === 'all' || item.dataset.status === currentFilter;
        item.style.display = visible ? '' : 'none';
      });

      filterButtons.forEach((button) => {
        button.classList.toggle('selected', button.dataset.filter === currentFilter);
      });
    };

    const activatePoint = (id) => {
      points.forEach((button) => {
        const active = button.dataset.point === id;
        button.classList.toggle('selected', active);
      });
      cards.forEach((card) => {
        const active = card.dataset.pointCard === id;
        card.classList.toggle('selected', active);
      });
    };

    points.forEach((button) => {
      button.addEventListener('click', () => activatePoint(button.dataset.point));
    });

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        currentFilter = button.dataset.filter;
        applyFilter();
      });
    });

    applyFilter();
  };

  const renderReports = () => {
    const reports = getStoredReports();
    const list = app.querySelector('#reports-list');

    if (!list) return;

    if (!reports.length) {
      list.innerHTML = '<p class="empty-state">Aún no hay reportes ciudadanos. Sé el primero en alertar sobre un punto crítico.</p>';
      return;
    }

    list.innerHTML = reports
      .slice(0, 4)
      .map(
        (report) => `
          <article class="report-item">
            <div class="report-topline">
              <strong>${escapeHtml(report.name)}</strong>
              <span>${escapeHtml(report.type)}</span>
            </div>
            <p>${escapeHtml(report.location)}</p>
            <small>${escapeHtml(report.details)}</small>
            <div class="report-meta">${formatReportDate(report.createdAt)}</div>
            <div class="report-actions">
              <button class="mini-btn success" type="button" data-report-action="keep" data-report-id="${report.id}">Sí, sigue ahí</button>
              <button class="mini-btn danger" type="button" data-report-action="remove" data-report-id="${report.id}">No, ya no está</button>
            </div>
          </article>
        `,
      )
      .join('');
  };

  const attachRouteStatusButtons = () => {
    const buttons = app.querySelectorAll('[data-route-action]');
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const routeId = button.dataset.routeId;
        const action = button.dataset.routeAction;
        const point = routeAlerts.find((item) => item.id === routeId);

        if (!point) return;

        point.isVisible = action === 'keep';
        renderHomePage();
      });
    });
  };

  const attachReportCheckButtons = () => {
    const buttons = app.querySelectorAll('[data-report-action]');
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const reportId = Number(button.dataset.reportId);
        const action = button.dataset.reportAction;
        const reports = getStoredReports();
        const report = reports.find((item) => Number(item.id) === reportId);

        if (!report) return;

        const status = app.querySelector('#location-status');
        const info = app.querySelector('#location-info');

        if (action === 'remove') {
          const updatedReports = reports.filter((item) => Number(item.id) !== reportId);
          setStoredReports(updatedReports);
          if (status) status.textContent = 'Reporte retirado';
          if (info) {
            info.innerHTML = `<p><strong>Reporte eliminado:</strong> ${escapeHtml(report.location)}</p><p>Se quitó del listado porque ya no sigue activo.</p>`;
          }
          renderHomePage();
          return;
        }

        const updatedReports = reports.map((item) =>
          Number(item.id) === reportId ? { ...item, status: 'active' } : item,
        );
        setStoredReports(updatedReports);

        const result = checkReportStillActive(report.location);
        if (status) status.textContent = result.active ? 'Reporte activo' : 'Sin reporte activo';
        if (info) {
          info.innerHTML = `<p>${result.message}</p><p><strong>Ubicación revisada:</strong> ${escapeHtml(report.location)}</p>`;
        }
        renderHomePage();
      });
    });
  };

  const attachLocationLogic = () => {
    const button = app.querySelector('#get-location');
    const status = app.querySelector('#location-status');
    const info = app.querySelector('#location-info');

    if (!button || !status || !info) return;

    button.addEventListener('click', () => {
      if (!navigator.geolocation) {
        status.textContent = 'No disponible';
        info.innerHTML = '<p>Tu navegador no soporta geolocalización.</p>';
        return;
      }

      status.textContent = 'Buscando...';
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const { nearest, bestDistance } = getNearestRoute(lat, lon);
          const reportCheck = checkReportStillActive(nearest.name);

          status.textContent = `${nearest.name} • ${nearest.danger}`;
          info.innerHTML = `
            <p><strong>Lat:</strong> ${lat.toFixed(5)} | <strong>Lon:</strong> ${lon.toFixed(5)}</p>
            <p><strong>Ruta más cercana:</strong> ${nearest.name}</p>
            <p><strong>Distancia:</strong> ${bestDistance.toFixed(2)} km</p>
            <p>${nearest.description}</p>
            <p><strong>Estado de reportes:</strong> ${reportCheck.message}</p>
          `;
        },
        () => {
          status.textContent = 'Ubicación no autorizada';
          info.innerHTML = '<p>Permite el acceso a tu ubicación para conocer la ruta más cercana y el nivel de riesgo.</p>';
        },
        { enableHighAccuracy: true, timeout: 10000 },
      );
    });
  };

  const handleReportSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const report = {
      id: Date.now(),
      name: formData.get('name')?.toString().trim() || 'Usuario',
      location: formData.get('location')?.toString().trim() || '',
      type: formData.get('type')?.toString() || 'Otro',
      details: formData.get('details')?.toString().trim() || '',
      createdAt: new Date().toISOString(),
      status: 'active',
    };

    if (!report.location || !report.details) return;

    try {
      const currentReports = getStoredReports();
      setStoredReports([report, ...currentReports]);
      form.reset();
      renderHomePage();
    } catch (error) {
      alert('No se pudo guardar el reporte. Intenta con menos texto o limpia el historial del navegador.');
    }
  };

  bindMapInteractions();
  attachLocationLogic();
  renderReports();
  attachReportCheckButtons();
  attachRouteStatusButtons();

  const reportForm = app.querySelector('#report-form');
  if (reportForm) reportForm.addEventListener('submit', handleReportSubmit);
};

const renderRoute = () => {
  renderHomePage();
};

window.addEventListener('hashchange', renderRoute);
renderRoute();
