# Maaya-Xiinbal Backend

## Descripción
Plataforma de turismo para la Península de Yucatán. Backend para app de guía turística con asistente IA ("Mayita").

## Stack
- **Runtime:** Node.js + TypeScript
- **Framework:** Express v5
- **ORM:** Drizzle ORM
- **DB:** PostgreSQL
- **IA:** Google Gemini (`gemini-1.5-flash`)
- **Auth:** JWT + bcryptjs

## Estructura
```
src/
├── index.ts                  # Entry point (puerto 3000) + health check GET /
├── routes/
│   ├── auth.routes.ts        # POST /register, /login, GET /me
│   ├── atractivos.routes.ts  # GET /, GET /:id, POST /:id/imagenes (protegido)
│   └── chat.routes.ts        # POST / (protegido)
├── controllers/
│   ├── auth.controller.ts    # register, login, me (bcrypt + JWT)
│   ├── atractivos.controller.ts
│   └── chat.controller.ts    # Gemini chat con contexto de BD
├── middleware/
│   └── auth.middleware.ts    # Bearer token JWT, inyecta req.user
├── utils/
│   └── jwt.ts                # signToken (7d), verifyToken
└── database/
    ├── connection.ts         # Pool PostgreSQL + Drizzle
    └── schema/               # 9 tablas
        ├── index.ts          # barrel export
        ├── users.ts
        ├── cat_atractivos.ts
        ├── cat_servicios_locales.ts
        ├── cat_imagenes.ts
        ├── itinerario.ts
        ├── detalle_itinerario.ts
        ├── historial.ts
        ├── chat_ia.ts
        └── pagos.ts
```

## Scripts
| Comando | Descripción |
|---|---|
| `npm run dev` | Iniciar servidor con hot-reload (tsx watch) |
| `npm run db:generate` | Generar migraciones Drizzle |
| `npm run db:push` | Aplicar migraciones directamente |
| `npm run db:studio` | Drizzle Studio (UI visual) |

## API Endpoints
| Método | Ruta | Auth | Controlador |
|--------|------|------|-------------|
| GET | `/` | No | `index.ts` (health check) |
| POST | `/api/auth/register` | No | `auth.controller.ts:10` |
| POST | `/api/auth/login` | No | `auth.controller.ts:77` |
| GET | `/api/auth/me` | Sí | `auth.controller.ts:137` |
| GET | `/api/atractivos` | Sí | `atractivos.controller.ts:6` |
| GET | `/api/atractivos/:id` | Sí | `atractivos.controller.ts:41` |
| POST | `/api/atractivos/:id/imagenes` | Sí | `atractivos.controller.ts:73` |
| POST | `/api/chat` | Sí | `chat.controller.ts:8` |

## Auth
- **Registro:** `{ nombre, apellido, correo, contrasena }` → hashea contraseña con bcryptjs (10 rounds) → retorna `{ success, token, user }` con `user: { id, nombre, apellido, correo }`
- **Login:** `{ correo, contrasena }` → compara hash → genera JWT → retorna `{ success, token, user }` con `user: { id, nombre, apellido, correo, telefono, lat, long }`
- **GET /me:** Extrae `Authorization: Bearer <token>`, verifica, retorna `{ success, user }` con `user: { id, nombre, apellido, correo, telefono, lat, long }`
- **JWT Payload:** `{ id, correo }`, expira 7d
- **Middleware:** `auth.middleware.ts` — `authenticate` inyecta `req.user`

## Mayita (Chat IA)
- **Modelo:** `gemini-1.5-flash` via `@google/generative-ai`
- **systemInstruction:** Multilingüe — detecta idioma del usuario y responde en él. Nombres de lugares en español. Usa markdown para formato. Máximo 50 palabras. Solo recomienda atractivos de la BD.
- **Contexto:** Inyecta datos reales de `cat_atractivos` al systemInstruction en cada request
- **Historial:** El frontend envía `history: ChatMessage[]` en el body; se usa `model.startChat({ history })`
- **Respuesta:** `{ success, response: string }`
- **Nota:** La tabla `chat_ia` existe en el schema pero NO se usa en el controller (las conversaciones no se persisten)

## Base de Datos — 9 Tablas

| Tabla | Descripción |
|---|---|
| `users` | Usuarios registrados |
| `cat_atractivos` | Catálogo de lugares turísticos |
| `cat_servicios_locales` | Servicios locales (restaurantes, etc.) |
| `cat_imagenes` | Imágenes de atractivos (FK a cat_atractivos, ON DELETE CASCADE) |
| `itinerario` | Itinerarios de usuario (FK a users) |
| `detalle_itinerario` | Detalle de itinerario (FK a itinerario, cat_atractivos, cat_servicios_locales) |
| `historial` | Historial de itinerarios |
| `chat_ia` | Registro de conversaciones con IA (FK a users) — actualmente sin uso |
| `pagos` | Registro de pagos (FK a users) |

### Campos principales de `cat_atractivos`
`id, nombre, descripcion, categoria, municipio, estado, direccion, precio, hora_apertura, hora_cierre, lat, long`

### Campos principales de `users`
`id, nombre, apellido, correo, contrasena, telefono, lat, long`

## Documentación
- `api-docs/` — 6 archivos markdown documentando cada endpoint

## Configuración
- **`.env`** — `PORT`, `DATABASE_URL`, `GEMINI_API_KEY`, `JWT_SECRET`
- **`.env.example`** — `PORT`, `DATABASE_URL` (incompleto: faltan `GEMINI_API_KEY` y `JWT_SECRET` para nuevos desarrolladores)
- `drizzle.config.ts` — Schema en `./src/database/schema/*.ts`, salida a `./drizzle`, dialecto `postgresql`
