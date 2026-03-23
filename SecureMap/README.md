# Prueba-Tecnica

Este repositorio contiene el proyecto **SecureMap**, una aplicación web desarrollada con el framework Laravel.

## Descripción del Proyecto

SecureMap es una aplicación diseñada para **gestionar y visualizar ubicaciones (marcadores) de forma segura**, permitiendo crear, editar, mover (drag) y eliminar puntos en un mapa. Los cambios se persisten en base de datos y se reflejan en la UI con sincronización asíncrona.

El proyecto está estructurado como una aplicación Laravel estándar y utiliza las siguientes tecnologías:

- **Backend:** PHP / Laravel 12
- **Frontend:** Blade, CSS, JavaScript (Vite)
- **Mapa:** Leaflet
- **DB (local):** SQLite (por defecto)
- **Gestor de dependencias:** Composer y NPM

### Seguridad / Buenas prácticas incluidas

- Autenticación web con sesión y rutas protegidas (`auth`) para el panel del mapa.
- API protegida con tokens Bearer usando Laravel Sanctum (`auth:sanctum`).
- Cifrado de datos sensibles:
	- Contraseñas con hash seguro de Laravel.
	- Etiqueta del marcador cifrada en base de datos (cast `encrypted`).
	- Sesión cifrada (`SESSION_ENCRYPT=true`).

## Estructura del Repositorio

El código fuente de la aplicación se encuentra dentro del directorio `SecureMap/`.

- `app/`: Código principal (modelos, controladores, etc.).
- `bootstrap/`: Scripts de arranque de la aplicación.
- `config/`: Archivos de configuración.
- `database/`: Migraciones y seeders.
- `public/`: Punto de entrada y assets compilados.
- `resources/`: Vistas Blade y assets sin compilar.
- `routes/`: Definición de rutas web y API.
- `storage/`: Cache, logs, sesiones, etc.
- `tests/`: Pruebas automatizadas.
- `composer.json`: Dependencias PHP.
- `package.json`: Dependencias JS/CSS.

## Requisitos Previos

- PHP (versión compatible con `composer.json`)
- Composer
- Node.js y npm
- SQLite

## Instalación

1. **Clona el repositorio:**
	 ```bash
	 git clone https://github.com/Asensio01/Prueba-Tecnica.git
	 cd Prueba-Tecnica/SecureMap
	 ```

2. **Instala dependencias de PHP:**
	 ```bash
	 composer install
	 ```

3. **Instala dependencias de JavaScript:**
	 ```bash
	 npm install
	 ```

4. **Configura el entorno:**
	 - Copia el archivo de ejemplo:
		 ```bash
		 cp .env.example .env
		 ```
	 - Genera la clave de la app:
		 ```bash
		 php artisan key:generate
		 ```

5. **Configura base de datos (SQLite recomendado):**
	 - En `.env`:
		 ```env
		 DB_CONNECTION=sqlite
		 ```
	 - Asegura la existencia del archivo:
		 ```bash
		 # Windows: crea el archivo si no existe
		 type nul > database/database.sqlite
		 ```

6. **Ejecuta migraciones:**
	 ```bash
	 php artisan migrate
	 ```

7. **Compila assets y levanta el entorno:**
	 - En una terminal:
		 ```bash
		 npm run dev
		 ```
	 - En otra terminal:
		 ```bash
		 php artisan serve
		 ```

Accede a la app en `http://127.0.0.1:8000`.

## Uso

1. Regístrate o inicia sesión.
2. Entra al panel del mapa (`/map`).
3. Crea marcadores:
	 - Click en el mapa, o
	 - Botón para crear marcador en el centro.
4. Edita un marcador desde su popup:
	 - Nombre (label)
	 - Prioridad (baja / media / alta)
	 - Color
5. Mueve un marcador arrastrándolo: al soltar se actualizan coordenadas.
6. Elimina un marcador con clic derecho.

### Métricas en vivo

- Cantidad de marcadores.
- Distancia total aproximada entre puntos.
- Hora en vivo: muestra la **hora según la ubicación del marcador seleccionado** (zona horaria calculada por lat/lng).

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
- Ver rutas:
	- `php artisan route:list`

## Contribuciones

1. Haz un fork del repositorio.
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -am "Añade nueva funcionalidad"`).
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.
