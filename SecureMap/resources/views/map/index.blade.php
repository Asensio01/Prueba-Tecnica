<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500&display=swap" rel="stylesheet">
    <title>SecureMap | Panel de Control</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="">
    @vite(['resources/css/app.css', 'resources/css/pages/map.css'])
</head>
<body class="map-shell">
<header class="topbar">
    <div class="topbar-brand">
        <div class="brand-mark">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="4" stroke="white" stroke-width="1.5" fill="none"/>
                <circle cx="6" cy="6" r="1.5" fill="white"/>
            </svg>
        </div>
        <span class="brand-name">SecureMap</span>
        <div class="brand-sep"></div>
        <span class="brand-subtitle">Panel de control</span>
    </div>

    <div class="topbar-actions">
        <button type="button" id="add-center-marker" class="btn btn-ghost">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                <line x1="5.5" y1="1" x2="5.5" y2="10"/>
                <line x1="1" y1="5.5" x2="10" y2="5.5"/>
            </svg>
            Agregar en centro
        </button>
        <form method="POST" action="{{ route('logout') }}" style="display:inline">
            @csrf
            <button type="submit" class="btn btn-danger">Cerrar sesion</button>
        </form>
    </div>
</header>
<main class="map-layout">
    <aside class="panel">
        <div class="panel-section">
            <div class="section-label">Resumen</div>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value blue" id="marker-count">0</div>
                    <div class="stat-label">Marcadores activos</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value green" id="distance-total">0.00</div>
                    <div class="stat-label">Km distancia total</div>
                </div>
                <div class="stat-card wide">
                    <div class="sync-indicator">
                        <div class="sync-dot" id="sync-dot"></div>
                        <span id="last-sync">Sin sincronizar</span>
                    </div>
                    <span id="tz-label" style="font-size:10px;color:var(--text-muted);font-family:var(--font-mono)">UTC</span>
                </div>
            </div>
        </div>
        <div class="panel-section">
            <div class="section-label">Guia rapida</div>
            <ul class="guide-list">
                <li class="guide-item">
                    <span class="guide-num">1</span>
                    <span>Haz clic en el mapa para crear un marcador en esa ubicacion.</span>
                </li>
                <li class="guide-item">
                    <span class="guide-num">2</span>
                    <span>Arrastra para reposicionar. Las coordenadas se guardan automaticamente.</span>
                </li>
                <li class="guide-item">
                    <span class="guide-num">3</span>
                    <span>Clic derecho sobre un marcador para eliminarlo del registro.</span>
                </li>
            </ul>
        </div>
        <div class="panel-section grow">
            <div class="marker-list-header">
                <div class="section-label" style="margin-bottom:0">
                    Marcadores
                    <span style="color:var(--text-muted);font-size:9px;margin-left:6px;">— POR PRIORIDAD</span>
                </div>
            </div>
            <ul id="marker-list" class="marker-list"></ul>
        </div>
        <div class="status-bar">
            <div class="status-icon" id="status-icon"></div>
            <span id="status">Listo para operar.</span>
        </div>

    </aside>
    <section class="map-wrapper">
        <div id="map"></div>
        <div class="coords-overlay" id="coords-overlay">— lat / lng</div>
    </section>

</main>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>

<script id="initial-markers-data" type="application/json">@json($markers)</script>

@vite('resources/js/pages/map.js')
</body>
</html>