# SecureMap

Aplicación web con Laravel 12 + SQLite + Leaflet para gestión de marcadores arrastrables con guardado asíncrono en tiempo real.

## Funcionalidades entregadas

- Registro e inicio de sesión de usuarios.
- Rutas protegidas por sesión (`auth`) para el panel de mapa.
- API protegida por token Bearer con Laravel Sanctum (`auth:sanctum`).
- Mapa interactivo con Leaflet y marcadores `draggable`.
- Persistencia con Eloquent y migraciones sobre SQLite.
- Cifrado en datos sensibles:
  - Contraseñas con hash seguro de Laravel.
  - Etiqueta de marcador cifrada en base de datos (`encrypted cast`).
  - Sesión cifrada (`SESSION_ENCRYPT=true`).

## Agregados creativos

- Eliminación rápida por clic derecho sobre marcador.
- Botón para crear marcador en el centro del mapa.
- Métricas en vivo: cantidad de marcadores, hora de última sincronización y distancia total aproximada entre puntos.
- UI responsive con animaciones de entrada y panel operativo.

## Instalación

1. Instalar dependencias:
	- `composer install`
	- `npm install`
2. Configurar entorno:
	- Verifica `.env` con `DB_CONNECTION=sqlite`
	- Asegura la existencia de `database/database.sqlite`
3. Ejecutar migraciones:
	- `php artisan migrate`
4. Levantar aplicación:
	- `php artisan serve`
	- `npm run dev`

## Endpoints principales

### Web (sesión)

- `GET /login`
- `POST /login`
- `GET /register`
- `POST /register`
- `POST /logout`
- `GET /map`
- `POST /markers`
- `PATCH /markers/{marker}`
- `DELETE /markers/{marker}`

### API (Sanctum Token)

- `POST /api/auth/register`
- `POST /api/auth/login`
- `DELETE /api/auth/token`
- `GET /api/markers`
- `POST /api/markers`
- `PATCH /api/markers/{marker}`
- `DELETE /api/markers/{marker}`

> Para consumir endpoints protegidos: `Authorization: Bearer <token>`

## Validación rápida

- Pruebas base:
  - `php artisan test`
- Revisar rutas:
  - `php artisan route:list`
