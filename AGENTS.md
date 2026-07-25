# Maaya-Xiinbal Backend

## Descripción
Plataforma de turismo para la Península de Yucatán. Backend para app de guía turística con asistente IA ("Mayita").

## Stack
- **Runtime:** Node.js + TypeScript
- **Framework:** Express v5
- **ORM:** Drizzle ORM
- **DB:** PostgreSQL
- **IA:** Google Gemini (`gemini-3.5-flash`)
- **Auth:** JWT + bcryptjs

## Estructura
```
src/
├── index.ts                  # Entry point (puerto 3000)
├── routes/
│   ├── auth.routes.ts        # POST /register, /login, GET /me
│   ├── atractivos.routes.ts  # GET / (protegido)
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
```

## Scripts
```bash
npm run dev          # tsx watch
npm run db:generate  # Generar migraciones Drizzle
npm run db:push      # Aplicar migraciones
npm run db:studio    # Drizzle Studio
```

## API Endpoints
| Método | Ruta | Auth | Controlador |
|--------|------|------|-------------|
| GET | `/` | No | Health check |
| POST | `/api/auth/register` | No | `auth.controller.ts:10` |
| POST | `/api/auth/login` | No | `auth.controller.ts:77` |
| GET | `/api/auth/me` | Sí | `auth.controller.ts:137` |
| GET | `/api/atractivos` | Sí | `atractivos.controller.ts:5` |
| POST | `/api/chat` | Sí | `chat.controller.ts:8` |

## Auth
- Registro: hashea contraseña con bcryptjs (10 rounds)
- Login: compara hash, genera JWT con payload `{id, correo}`, expira 7d
- Middleware: extrae `Authorization: Bearer <token>`, verifica, adjunta `req.user`

## Documentación
- `api-docs/` — 6 archivos markdown documentando cada endpoint

## Configuración
- `.env` — PORT, DATABASE_URL, GEMINI_API_KEY, JWT_SECRET
- `drizzle.config.ts` — Configuración de Drizzle Kit
