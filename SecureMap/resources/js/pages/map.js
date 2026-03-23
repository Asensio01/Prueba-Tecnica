const initMapPage = () => {
    const statusEl = document.getElementById('status');
    const statusIconEl = document.getElementById('status-icon');

    const setStatus = (text, type = 'ok') => {
        if (statusEl) statusEl.textContent = text;
        if (statusIconEl) {
            statusIconEl.className = 'status-icon' +
                (type === 'error' ? ' error' : type === 'warn' ? ' warn' : '');
        }
    };

    const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
    const csrfToken = csrfTokenMeta?.getAttribute('content') ?? '';

    const initialMarkersEl = document.getElementById('initial-markers-data');
    let initialMarkers = [];
    try {
        initialMarkers = JSON.parse(initialMarkersEl?.textContent ?? '[]');
    } catch {
        initialMarkers = [];
    }

    const L = window.L;
    if (!L) {
        setStatus('Leaflet no se cargó (revisa el script CDN).', 'error');
        return;
    }

    const escapeHtml = (value) => {
        const s = String(value ?? '');
        return s.replace(/[&<>"']/g, (c) => {
            switch (c) {
                case '&':
                    return '&amp;';
                case '<':
                    return '&lt;';
                case '>':
                    return '&gt;';
                case '"':
                    return '&quot;';
                case "'":
                    return '&#039;';
                default:
                    return c;
            }
        });
    };

    /* ── MAP INIT ── */
    const map = L.map('map', {
        zoomControl: true,
        minZoom: 3,
        zoomSnap: 0.5,
    }).setView([40.4168, -3.7038], 6);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
    }).addTo(map);

    map.on('mousemove', (e) => {
        const { lat, lng } = e.latlng;
        const coordsOverlay = document.getElementById('coords-overlay');
        if (!coordsOverlay) return;
        coordsOverlay.textContent = `${lat.toFixed(5)}  ${lng.toFixed(5)}`;
    });

    /* ── STATE ── */
    const markers = new Map();
    const markerCountEl = document.getElementById('marker-count');
    const lastSyncEl = document.getElementById('last-sync');
    const distanceEl = document.getElementById('distance-total');
    const markerListEl = document.getElementById('marker-list');
    const syncDotEl = document.getElementById('sync-dot');

    /* ── PRIORITY META ── */
    const priorityMeta = {
        baja: { label: 'Baja', color: '#3b82f6' },
        media: { label: 'Media', color: '#f59e0b' },
        alta: { label: 'Alta', color: '#ef4444' },
    };

    const resolveColor = (data) => data.color || priorityMeta[data.priority]?.color || '#3b82f6';

    /* ── ICON ── */
    const markerIcon = (hex) => {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 28 40" fill="none">
            <path d="M14 1C7.373 1 2 6.373 2 13c0 9.5 10.5 20.5 11.53 21.57a.65.65 0 0 0 .94 0C15.5 33.5 26 22.5 26 13 26 6.373 20.627 1 14 1Z" fill="${hex}" stroke="rgba(0,0,0,0.35)" stroke-width="1.5"/>
            <circle cx="14" cy="13" r="4" fill="rgba(255,255,255,0.9)"/>
        </svg>`;
        return L.icon({
            iconUrl: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
            iconSize: [28, 40],
            iconAnchor: [14, 39],
            popupAnchor: [0, -34],
        });
    };

    /* ── UTILS ── */
    const throttle = (fn, wait) => {
        let last = 0;
        let timeout;
        return (...args) => {
            const now = Date.now();
            const rem = wait - (now - last);
            if (rem <= 0) {
                clearTimeout(timeout);
                last = now;
                fn(...args);
            } else {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    last = Date.now();
                    fn(...args);
                }, rem);
            }
        };
    };

    const touchSync = () => {
        if (!syncDotEl || !lastSyncEl) return;
        syncDotEl.classList.remove('live');
        setTimeout(() => {
            syncDotEl.classList.add('live');
            lastSyncEl.textContent = new Date().toLocaleTimeString('es-ES', { hour12: false });
        }, 200);
    };

    /* ── STATS ── */
    const updateStats = () => {
        if (markerCountEl) markerCountEl.textContent = String(markers.size);

        const pts = [...markers.values()].map(({ marker }) => marker.getLatLng());
        let dist = 0;
        for (let i = 1; i < pts.length; i++) dist += pts[i - 1].distanceTo(pts[i]);
        if (distanceEl) distanceEl.textContent = (dist / 1000).toFixed(2);
    };

    /* ── MARKER LIST ── */
    const renderMarkerList = () => {
        if (!markerListEl) return;

        const order = { alta: 0, media: 1, baja: 2 };
        const items = [...markers.values()].sort(
            (a, b) => (order[a.data.priority] ?? 9) - (order[b.data.priority] ?? 9)
        );

        markerListEl.innerHTML = '';

        if (!items.length) {
            markerListEl.innerHTML = '<li class="marker-list-empty">Sin marcadores activos.</li>';
            return;
        }

        items.forEach(({ id, data, marker }) => {
            const ll = marker.getLatLng();
            const color = resolveColor(data);
            const li = document.createElement('li');
            li.className = 'marker-item';
            li.dataset.markerId = id;
            li.innerHTML = `
                <div class="marker-dot" style="background:${color}"></div>
                <div class="marker-info">
                    <div class="marker-name">${escapeHtml(data.label)}</div>
                    <div class="marker-coords">${ll.lat.toFixed(4)}, ${ll.lng.toFixed(4)}</div>
                </div>
                <span class="priority-chip priority-${data.priority}">${escapeHtml(priorityMeta[data.priority]?.label ?? data.priority)}</span>
            `;
            li.addEventListener('click', () => {
                document.querySelectorAll('.marker-item').forEach(i => i.style.borderLeftColor = '');
                li.style.borderLeftColor = color;
                map.flyTo([ll.lat, ll.lng], 15, { duration: 0.6 });
                marker.openPopup();
                setStatus(`Navegando a "${data.label}".`);
            });
            markerListEl.appendChild(li);
        });
    };

    /* ── API ── */
    const patchMarker = async (id, payload) => {
        const res = await fetch(`/markers/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('No fue posible guardar el marcador.');
        return res.json();
    };

    /* ── POPUP ── */
    const markerPopupContent = (data) => {
        const safeLabel = escapeHtml(data.label);
        const safeLabelAttr = safeLabel.replaceAll('"', '&quot;');

        return `
        <div class="popup-editor" data-marker-editor="${data.id}">
            <strong>${safeLabel}</strong>
            <div class="popup-row">
                <label>Nombre</label>
                <input type="text" data-field="label" value="${safeLabelAttr}">
            </div>
            <div class="popup-row">
                <label>Prioridad</label>
                <select data-field="priority">
                    <option value="baja"  ${data.priority === 'baja' ? 'selected' : ''}>Baja</option>
                    <option value="media" ${data.priority === 'media' ? 'selected' : ''}>Media</option>
                    <option value="alta"  ${data.priority === 'alta' ? 'selected' : ''}>Alta</option>
                </select>
            </div>
            <div class="popup-row">
                <label>Color</label>
                <input type="color" data-field="color" value="${resolveColor(data)}">
            </div>
            <button type="button" class="popup-save-btn" data-save="${data.id}">Guardar cambios</button>
        </div>
    `;
    };

    const attachPopupSave = (entity) => {
        const { id, marker, data } = entity;

        marker.on('popupopen', () => {
            const editor = document.querySelector(`[data-marker-editor="${id}"]`);
            const btn = document.querySelector(`[data-save="${id}"]`);
            if (!editor || !btn) return;

            const collect = () => ({
                label: editor.querySelector('[data-field="label"]').value.trim() || 'Sin nombre',
                priority: editor.querySelector('[data-field="priority"]').value,
                color: editor.querySelector('[data-field="color"]').value,
            });

            const setSaving = (s) => {
                btn.disabled = s;
                btn.classList.toggle('is-saving', s);
                btn.textContent = s ? 'Guardando...' : 'Guardar cambios';
            };

            const applyUpdate = async (silent = false) => {
                const payload = collect();
                if (
                    payload.label === data.label &&
                    payload.priority === data.priority &&
                    payload.color.toLowerCase() === resolveColor(data).toLowerCase()
                ) return;

                try {
                    setSaving(true);
                    const updated = await patchMarker(id, payload);
                    data.label = updated.label;
                    data.priority = updated.priority;
                    data.color = updated.color;
                    marker.setIcon(markerIcon(resolveColor(data)));
                    marker.setPopupContent(markerPopupContent(data));
                    renderMarkerList();
                    touchSync();
                    if (!silent) setStatus('Cambios guardados correctamente.');
                    marker.openPopup();
                } catch (err) {
                    setStatus(err.message, 'error');
                } finally {
                    setSaving(false);
                }
            };

            const labelEl = editor.querySelector('[data-field="label"]');
            const priorityEl = editor.querySelector('[data-field="priority"]');
            const colorEl = editor.querySelector('[data-field="color"]');

            priorityEl.addEventListener('change', () => {
                if (!colorEl.dataset.manual) colorEl.value = priorityMeta[priorityEl.value]?.color || '#3b82f6';
                applyUpdate(true);
            });
            colorEl.addEventListener('input', () => {
                colorEl.dataset.manual = '1';
            });
            labelEl.addEventListener('blur', () => applyUpdate(true));
            colorEl.addEventListener('blur', () => applyUpdate(true));
            btn.addEventListener('click', () => applyUpdate(false), { once: true });
        });
    };

    /* ── MARKER EVENTS ── */
    const attachMarkerEvents = (entity) => {
        const { id, marker, data } = entity;

        const pushCoords = throttle(async () => {
            const ll = marker.getLatLng();
            try {
                await patchMarker(id, { latitude: ll.lat, longitude: ll.lng });
                touchSync();
                setStatus('Coordenadas actualizadas.');
                renderMarkerList();
            } catch (err) {
                setStatus(err.message, 'error');
            }
        }, 600);

        marker.on('drag', pushCoords);
        marker.on('dragend', pushCoords);
        marker.on('click', () => {
            const ll = marker.getLatLng();
            map.flyTo([ll.lat, ll.lng], 16, { duration: 0.45 });
            setStatus(`Marcador "${data.label}" enfocado.`);
        });
        marker.on('contextmenu', async () => {
            try {
                const res = await fetch(`/markers/${id}`, {
                    method: 'DELETE',
                    headers: { Accept: 'application/json', 'X-CSRF-TOKEN': csrfToken },
                });
                if (!res.ok) throw new Error('No se pudo eliminar el marcador.');
                map.removeLayer(marker);
                markers.delete(id);
                updateStats();
                renderMarkerList();
                touchSync();
                setStatus('Marcador eliminado.');
            } catch (err) {
                setStatus(err.message, 'error');
            }
        });

        attachPopupSave(entity);
    };

    /* ── BUILD MARKER ── */
    const buildMarker = (data, center = false) => {
        if (!data.priority) data.priority = 'media';

        const marker = L.marker([data.latitude, data.longitude], {
            draggable: true,
            icon: markerIcon(resolveColor(data)),
        }).addTo(map);

        marker.bindPopup(markerPopupContent(data), { maxWidth: 260 });
        const entity = { id: data.id, marker, data };
        markers.set(data.id, entity);
        attachMarkerEvents(entity);

        if (center) map.panTo([data.latitude, data.longitude], { animate: true, duration: 0.4 });

        updateStats();
        renderMarkerList();
    };

    /* ── CREATE MARKER ── */
    const createMarker = async (latitude, longitude) => {
        setStatus('Guardando nuevo marcador...', 'warn');
        const res = await fetch('/markers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify({
                latitude,
                longitude,
                label: `Punto ${markers.size + 1}`,
                priority: 'media',
            }),
        });
        if (!res.ok) throw new Error('No se pudo crear el marcador.');
        return res.json();
    };

    /* ── BOOT ── */
    initialMarkers.forEach((m) => buildMarker(m));

    if (initialMarkers.length > 0) {
        const f = initialMarkers[0];
        map.setView([f.latitude, f.longitude], 12);
    }

    map.on('click', async (e) => {
        try {
            const m = await createMarker(e.latlng.lat, e.latlng.lng);
            buildMarker(m, true);
            touchSync();
            setStatus('Marcador creado.');
        } catch (err) {
            setStatus(err.message, 'error');
        }
    });

    const addCenterBtn = document.getElementById('add-center-marker');
    addCenterBtn?.addEventListener('click', async () => {
        const c = map.getCenter();
        try {
            const m = await createMarker(c.lat, c.lng);
            buildMarker(m, true);
            touchSync();
            setStatus('Marcador creado en el centro del mapa.');
        } catch (err) {
            setStatus(err.message, 'error');
        }
    });

    setStatus('Mapa inicializado correctamente.');
    updateStats();
    renderMarkerList();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMapPage, { once: true });
} else {
    initMapPage();
}
