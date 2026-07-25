---
tags:
  - api
  - api/endpoint
  - backend
  - auth
---

### [Iniciar Sesión]

**Descripción:** Autentica a un usuario con su correo y contraseña. Devuelve un token JWT para acceder a los endpoints protegidos.  
**URL:** `/api/auth/login`  
**Método HTTP:** `POST`

---
#### Autenticación
*   **Requerida:** No

#### Headers (Cabeceras)

| Nombre | Requerido | Tipo | Descripción |
| :--- | :---: | :--- | :--- |
| `Content-Type` | Sí | string | Formato del cuerpo de la petición (debe ser `application/json`). |

---
#### Parámetros

**Parámetros de Ruta (Path)**  
*(No aplica)*

**Parámetros de Consulta (Query)**  
*(No aplica)*

---
#### Cuerpo de la Petición (Body)
*(Datos enviados en formato JSON)*

```json
{
  "correo": "juan@email.com",
  "contrasena": "123456"
}
```

| Campo | Requerido | Tipo | Descripción |
| :--- | :---: | :--- | :--- |
| `correo` | Sí | string | Correo electrónico registrado. |
| `contrasena` | Sí | string | Contraseña en texto plano. |

---
#### Respuesta (Response)
*(Lo que el servidor devuelve al cliente tras procesar la petición)*

**Respuesta Exitosa**
*   **Código HTTP:** `200 OK`
*   **Cuerpo:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Perez",
    "correo": "juan@email.com",
    "telefono": null,
    "lat": null,
    "long": null
  }
}
```

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `success` | boolean | `true` si la autenticación fue exitosa. |
| `token` | string | Token JWT para autenticar peticiones posteriores. Expira en 7 días. |
| `user.id` | integer | ID único del usuario. |
| `user.nombre` | string | Nombre del usuario. |
| `user.apellido` | string | Apellido del usuario. |
| `user.correo` | string | Correo electrónico del usuario. |
| `user.telefono` | string \| null | Teléfono del usuario (si fue registrado). |
| `user.lat` | number \| null | Latitud de ubicación del usuario. |
| `user.long` | number \| null | Longitud de ubicación del usuario. |

**Respuestas de Error**
*(Casos de fallo y códigos de estado)*
*   **Código HTTP:** `400 Bad Request` — Faltan correo o contraseña.
*   **Código HTTP:** `401 Unauthorized` — Credenciales inválidas (correo no existe o contraseña incorrecta).
*   **Código HTTP:** `500 Internal Server Error` — Error inesperado del servidor.
*   **Cuerpo (Ejemplo para 401 Unauthorized):**

```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```
