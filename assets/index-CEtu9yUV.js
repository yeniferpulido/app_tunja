(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))l(e);new MutationObserver(e=>{for(const i of e)if(i.type==="childList")for(const f of i.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&l(f)}).observe(document,{childList:!0,subtree:!0});function p(e){const i={};return e.integrity&&(i.integrity=e.integrity),e.referrerPolicy&&(i.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?i.credentials="include":e.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function l(e){if(e.ep)return;e.ep=!0;const i=p(e);fetch(e.href,i)}})();const g=document.querySelector("#app"),$=n=>String(n).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),P=[{id:"centro",name:"Centro Histórico",status:"Ruta segura",detail:"Carriles con menos tránsito y mejor iluminación.",x:24,y:52,isVisible:!0},{id:"universidad",name:"Universidad Pedagógica",status:"Punto crítico",detail:"Tráfico mixto en horas pico.",x:62,y:43,isVisible:!0},{id:"floresta",name:"La Floresta",status:"Ruta recomendada",detail:"Mejor flujo para ciclistas y peatones.",x:76,y:70,isVisible:!0}],E=()=>P.filter(n=>n.isVisible!==!1),I=["Usa casco y prendas visibles en horas de baja luz.","Respeta las señales de tránsito y evita maniobras bruscas.","Mantén distancia de buses y vehículos en intersecciones.","Haz uso del faro y revisa frenos antes de cada recorrido."],j=["Recorre por rutas con menos tráfico en horas pico.","Usa los parqueaderos seguros y evita bloquear aceras.","Planifica rutas por avenidas con ciclovía o separación física.","Comparte tu recorrido con la comunidad para mejorar seguridad."],q=[{name:"Centro Histórico",danger:"Baja",description:"Ruta con mejor señalización y menos conflicto con tráfico pesado.",lat:5.5337,lon:-73.3671},{name:"Universidad Pedagógica",danger:"Media",description:"Punto con mayor flujo vehicular en horas pico.",lat:5.5513,lon:-73.3624},{name:"La Floresta",danger:"Baja",description:"Recorrido recomendado para desplazamientos tranquilos y seguros.",lat:5.5723,lon:-73.3552}],T="tunja-reportes",L=()=>{try{return JSON.parse(localStorage.getItem(T)||"[]")}catch{return[]}},R=n=>{localStorage.setItem(T,JSON.stringify(n.slice(0,8)))},A=n=>{const s=new Date(n);return Number.isNaN(s.getTime())?"Sin fecha":s.toLocaleString("es-CO",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"})},w=(n,s,p,l)=>{const e=r=>r*Math.PI/180,f=e(p-n),b=e(l-s),t=Math.sin(f/2)*Math.sin(f/2)+Math.cos(e(n))*Math.cos(e(p))*Math.sin(b/2)*Math.sin(b/2);return 6371*2*Math.atan2(Math.sqrt(t),Math.sqrt(1-t))},O=()=>L().filter(s=>s.location&&s.status!=="removed").map((s,p)=>{const l=[...s.location].reduce((f,b)=>f+b.charCodeAt(0),0)+p*91,e=14+l%68,i=18+l*7%62;return{id:`report-${s.id}`,name:s.location,status:"Punto crítico",detail:`${s.type}: ${s.details}`,x:e,y:i,reportId:s.id}}),D=(n,s)=>{let p=q[0],l=Number.POSITIVE_INFINITY;return q.forEach(e=>{const i=w(n,s,e.lat,e.lon);i<l&&(p=e,l=i)}),{nearest:p,bestDistance:l}},M=(n="")=>String(n).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9\s]/g," ").replace(/\s+/g," ").trim(),N=n=>{const s=L(),p=M(n);if(!p||!s.length)return{active:!1,message:"No hay reportes activos cerca de esa ubicación."};const l=s.filter(e=>{const i=M(e.location||"");return i&&(i.includes(p)||p.includes(i))});return l.length?{active:!0,message:`Sí, sigue activo: ${l[0].type} en ${l[0].location}.`}:{active:!1,message:"No se encontró un reporte activo en esa zona."}},S=()=>{const n=[...E(),...O()];g.innerHTML=`
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
              ${n.map(t=>`
                    <button class="map-point ${t.status==="Punto crítico"?"critical":"safe"}" style="left:${t.x}%; top:${t.y}%" data-point="${t.id}" data-status="${t.status==="Punto crítico"?"critical":"safe"}" type="button" aria-label="${t.name}">
                      <span>${t.status==="Punto crítico"?"⚠":"✓"}</span>
                    </button>
                  `).join("")}
            </div>
          </div>

          <div class="map-list" id="route-points">
            ${n.map(t=>`
                  <article class="route-item ${t.status==="Punto crítico"?"critical":"safe"}" data-point-card="${t.id}" data-status="${t.status==="Punto crítico"?"critical":"safe"}">
                    <div class="route-badge">${t.status}</div>
                    <h3>${t.name}</h3>
                    <p>${t.detail}</p>
                    ${t.reportId?"":`
                      <div class="report-actions">
                        <button class="mini-btn success" type="button" data-route-action="keep" data-route-id="${t.id}">Sí, sigue ahí</button>
                        <button class="mini-btn danger" type="button" data-route-action="remove" data-route-id="${t.id}">No, ya no está</button>
                      </div>
                    `}
                  </article>
                `).join("")}
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
              ${I.map(t=>`<li>${t}</li>`).join("")}
            </ul>
          </article>

          <article class="card info-card">
            <div class="icon">💡</div>
            <h3>Tips de movilidad</h3>
            <ul class="check-list">
              ${j.map(t=>`<li>${t}</li>`).join("")}
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
  `;const s=()=>{const t=[...g.querySelectorAll("[data-point]")],r=[...g.querySelectorAll("[data-point-card]")],o=[...g.querySelectorAll("[data-filter]")],v=[...g.querySelectorAll(".route-item")];let c="all";const u=()=>{t.forEach(a=>{const d=c==="all"||a.dataset.status===c;a.style.display=d?"":"none"}),v.forEach(a=>{const d=c==="all"||a.dataset.status===c;a.style.display=d?"":"none"}),o.forEach(a=>{a.classList.toggle("selected",a.dataset.filter===c)})},m=a=>{t.forEach(d=>{const y=d.dataset.point===a;d.classList.toggle("selected",y)}),r.forEach(d=>{const y=d.dataset.pointCard===a;d.classList.toggle("selected",y)})};t.forEach(a=>{a.addEventListener("click",()=>m(a.dataset.point))}),o.forEach(a=>{a.addEventListener("click",()=>{c=a.dataset.filter,u()})}),u()},p=()=>{const t=L(),r=g.querySelector("#reports-list");if(r){if(!t.length){r.innerHTML='<p class="empty-state">Aún no hay reportes ciudadanos. Sé el primero en alertar sobre un punto crítico.</p>';return}r.innerHTML=t.slice(0,4).map(o=>`
          <article class="report-item">
            <div class="report-topline">
              <strong>${$(o.name)}</strong>
              <span>${$(o.type)}</span>
            </div>
            <p>${$(o.location)}</p>
            <small>${$(o.details)}</small>
            <div class="report-meta">${A(o.createdAt)}</div>
            <div class="report-actions">
              <button class="mini-btn success" type="button" data-report-action="keep" data-report-id="${o.id}">Sí, sigue ahí</button>
              <button class="mini-btn danger" type="button" data-report-action="remove" data-report-id="${o.id}">No, ya no está</button>
            </div>
          </article>
        `).join("")}},l=()=>{g.querySelectorAll("[data-route-action]").forEach(r=>{r.addEventListener("click",()=>{const o=r.dataset.routeId,v=r.dataset.routeAction,c=P.find(u=>u.id===o);c&&(c.isVisible=v==="keep",S())})})},e=()=>{g.querySelectorAll("[data-report-action]").forEach(r=>{r.addEventListener("click",()=>{const o=Number(r.dataset.reportId),v=r.dataset.reportAction,c=L(),u=c.find(h=>Number(h.id)===o);if(!u)return;const m=g.querySelector("#location-status"),a=g.querySelector("#location-info");if(v==="remove"){const h=c.filter(C=>Number(C.id)!==o);R(h),m&&(m.textContent="Reporte retirado"),a&&(a.innerHTML=`<p><strong>Reporte eliminado:</strong> ${$(u.location)}</p><p>Se quitó del listado porque ya no sigue activo.</p>`),S();return}const d=c.map(h=>Number(h.id)===o?{...h,status:"active"}:h);R(d);const y=N(u.location);m&&(m.textContent=y.active?"Reporte activo":"Sin reporte activo"),a&&(a.innerHTML=`<p>${y.message}</p><p><strong>Ubicación revisada:</strong> ${$(u.location)}</p>`),S()})})},i=()=>{const t=g.querySelector("#get-location"),r=g.querySelector("#location-status"),o=g.querySelector("#location-info");!t||!r||!o||t.addEventListener("click",()=>{if(!navigator.geolocation){r.textContent="No disponible",o.innerHTML="<p>Tu navegador no soporta geolocalización.</p>";return}r.textContent="Buscando...",navigator.geolocation.getCurrentPosition(v=>{const c=v.coords.latitude,u=v.coords.longitude,{nearest:m,bestDistance:a}=D(c,u),d=N(m.name);r.textContent=`${m.name} • ${m.danger}`,o.innerHTML=`
            <p><strong>Lat:</strong> ${c.toFixed(5)} | <strong>Lon:</strong> ${u.toFixed(5)}</p>
            <p><strong>Ruta más cercana:</strong> ${m.name}</p>
            <p><strong>Distancia:</strong> ${a.toFixed(2)} km</p>
            <p>${m.description}</p>
            <p><strong>Estado de reportes:</strong> ${d.message}</p>
          `},()=>{r.textContent="Ubicación no autorizada",o.innerHTML="<p>Permite el acceso a tu ubicación para conocer la ruta más cercana y el nivel de riesgo.</p>"},{enableHighAccuracy:!0,timeout:1e4})})},f=t=>{var c,u,m,a;t.preventDefault();const r=t.currentTarget,o=new FormData(r),v={id:Date.now(),name:((c=o.get("name"))==null?void 0:c.toString().trim())||"Usuario",location:((u=o.get("location"))==null?void 0:u.toString().trim())||"",type:((m=o.get("type"))==null?void 0:m.toString())||"Otro",details:((a=o.get("details"))==null?void 0:a.toString().trim())||"",createdAt:new Date().toISOString(),status:"active"};if(!(!v.location||!v.details))try{const d=L();R([v,...d]),r.reset(),S()}catch{alert("No se pudo guardar el reporte. Intenta con menos texto o limpia el historial del navegador.")}};s(),i(),p(),e(),l();const b=g.querySelector("#report-form");b&&b.addEventListener("submit",f)},x=()=>{S()};window.addEventListener("hashchange",x);x();
