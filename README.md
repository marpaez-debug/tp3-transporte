# Gestión de vehículos, conductores y viajes

Aplicación full stack para registrar los vehículos de una empresa de transporte, sus
conductores y los viajes realizados, con historial por vehículo o conductor y total de
kilómetros recorridos.

## Tecnologías

- **Backend:** Node.js, Express, MySQL (`mysql2`), `express-validator`, JWT, Passport y bcrypt.
- **Frontend:** Vite + React (JavaScript), React Router, `fetch` y CSS puro.

## Estructura

```
tp3-transporte/
├── backend/
│   ├── http/          Archivos .http para probar la API
│   ├── sql/           schema.sql con la definición de las tablas
│   └── src/
│       ├── config/        Conexión a MySQL y estrategia de Passport
│       ├── controllers/
│       ├── middlewares/   Autenticación y validación
│       ├── routes/
│       ├── validators/    Reglas de express-validator
│       └── app.js
└── frontend/
    └── src/
        ├── api/           Llamadas a la API
        ├── components/
        ├── context/       Sesión del usuario
        ├── pages/
        └── utils/         Validaciones y formatos
```

## Requisitos

- Node.js 20 o superior
- MySQL en ejecución

## Puesta en marcha

### 1. Base de datos

Ejecutar el script `backend/sql/schema.sql` en MySQL. Crea la base `transporte_db` y sus
cuatro tablas (`usuarios`, `vehiculos`, `conductores` y `viajes`).

### 2. Backend

```bash
cd backend
npm install
```

Copiar `.env.example` como `.env` y completar la contraseña de MySQL y un `JWT_SECRET`.

```bash
npm run dev
```

La API queda en `http://localhost:3000`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicación queda en `http://localhost:5173`. Para usarla hay que registrar un usuario
desde la pantalla de registro.

## API

Todas las rutas, salvo `/api/auth/register` y `/api/auth/login`, exigen el encabezado
`Authorization: Bearer <token>`. El token vence a las 4 horas.

| Recurso | Rutas |
|---|---|
| Autenticación | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Vehículos | `GET`, `POST /api/vehiculos` y `GET`, `PUT`, `DELETE /api/vehiculos/:id` |
| Conductores | `GET`, `POST /api/conductores` y `GET`, `PUT`, `DELETE /api/conductores/:id` |
| Viajes | `GET`, `POST /api/viajes` y `GET`, `PUT`, `DELETE /api/viajes/:id` |
| Historial | `GET /api/viajes/vehiculo/:id` y `GET /api/viajes/conductor/:id` (con total de kilómetros) |

Códigos de error: `400` datos inválidos, `401` sin sesión o token vencido, `403` conductor con
la licencia no vigente en la fecha de salida, `404` recurso inexistente y `500` error interno.

Los archivos de `backend/http` sirven para probar cada ruta con la extensión REST Client de VS Code.

## Seguridad

- Las contraseñas se guardan con hash de bcrypt y nunca viajan ni se devuelven en texto plano.
- La autenticación usa JWT y las rutas protegidas se verifican con el middleware de Passport.
- Las credenciales y el secreto del token están en el archivo `.env`, que no se sube al repositorio.