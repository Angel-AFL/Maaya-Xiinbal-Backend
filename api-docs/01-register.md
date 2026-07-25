---
tags:
  - api
  - api/endpoint
  - backend
  - auth
---

### [Registrar Usuario]

**Descripción:** Crea una nueva cuenta de usuario en la plataforma. La contraseña se almacena encriptada con bcrypt.  
**URL:** `/api/auth/register`  
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
  "nombre": "Juan",
  "apellido": "Perez",
  "correo": "juan@email.com",
  "contrasena": "123456"
}
```

| Campo | Requerido | Tipo | Descripción |
| :--- | :---: | :--- | :--- |
| `nombre` | Sí | string | Nombre del usuario (máx. 100 caracteres). |
| `apellido` | Sí | string | Apellido del usuario (máx. 100 caracteres). |
| `correo` | Sí | string | Correo electrónico único (máx. 255 caracteres). |
| `contrasena` | Sí | string | Contraseña en texto plano (se hashea antes de guardar). |

---
#### Respuesta (Response)
*(Lo que el servidor devuelve al cliente tras procesar la petición)*

**Respuesta Exitosa**
*   **Código HTTP:** `201 Created`
*   **Cuerpo:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Perez",
    "correo": "juan@email.com"
  }
}
```

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `success` | boolean | `true` si la operación fue exitosa. |
| `token` | string | Token JWT para autenticar peticiones posteriores. Expira en 7 días. |
| `user.id` | integer | ID único del usuario creado. |
| `user.nombre` | string | Nombre del usuario. |
| `user.apellido` | string | Apellido del usuario. |
| `user.correo` | string | Correo electrónico del usuario. |

**Respuestas de Error**
*(Casos de fallo y códigos de estado)*
*   **Código HTTP:** `400 Bad Request` — Faltan campos obligatorios.
*   **Código HTTP:** `409 Conflict` — El correo ya está registrado.
*   **Código HTTP:** `500 Internal Server Error` — Error inesperado del servidor.
*   **Cuerpo (Ejemplo para 400 Bad Request):**

```json
{
  "success": false,
  "message": "Todos los campos son obligatorios: nombre, apellido, correo, contrasena"
}
```
