---
tags:
  - api
  - api/endpoint
  - backend
  - ia
---

### [Chat con Mayita (Asistente IA)]

**Descripción:** Envía un mensaje al asistente virtual "Mayita", una guía turística potenciada por inteligencia artificial (Google Gemini). Mayita responde con recomendaciones de lugares basándose exclusivamente en los atractivos registrados en la base de datos.  
**URL:** `/api/chat`  
**Método HTTP:** `POST`

---
#### Autenticación
*   **Requerida:** Sí
*   **Tipo:** Bearer Token (JWT)
*   **Permisos necesarios:** Estar autenticado.

#### Headers (Cabeceras)

| Nombre | Requerido | Tipo | Descripción |
| :--- | :---: | :--- | :--- |
| `Authorization` | Sí | string | Token de acceso (ej. `Bearer eyJhbG...`). |
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
  "message": "Recomiéndame un cenote cerca de Mérida",
  "history": []
}
```

| Campo | Requerido | Tipo | Descripción |
| :--- | :---: | :--- | :--- |
| `message` | Sí | string | Mensaje del usuario para el asistente. |
| `history` | No | array | Historial de mensajes previos de la conversación (formato Gemini). Por defecto: `[]`. |

---
#### Respuesta (Response)
*(Lo que el servidor devuelve al cliente tras procesar la petición)*

**Respuesta Exitosa**
*   **Código HTTP:** `200 OK`
*   **Cuerpo:**

```json
{
  "success": true,
  "response": "Te recomiendo el Cenote Xlacah en Dzibilchaltún, a solo 20 minutos de Mérida. Es un cenote abierto ideal para nadar, rodeado de ruinas mayas. ¡Una joya imperdible!"
}
```

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `success` | boolean | `true` si el asistente respondió correctamente. |
| `response` | string | Respuesta generada por Mayita (máx. ~50 palabras). |

**Respuestas de Error**
*(Casos de fallo y códigos de estado)*
*   **Código HTTP:** `401 Unauthorized` — Token no proporcionado, inválido o expirado.
*   **Código HTTP:** `500 Internal Server Error` — Error al generar la respuesta de la IA.
*   **Cuerpo (Ejemplo para 500 Internal Server Error):**

```json
{
  "success": false,
  "error": "El asistente no pudo responder."
}
```

---
#### Notas
*   Mayita solo recomienda lugares que existen en la base de datos `cat_atractivos`. Si se le pregunta por un lugar no registrado, redirige amablemente a uno similar.
*   La personalidad de Mayita está configurada como "experta guía turística de la Península de Yucatán, concisa y aventurera".
*   Las respuestas están limitadas a un máximo de ~50 palabras sin usar numerales (#) ni asteriscos.
*   El modelo de IA utilizado es `gemini-3.5-flash` de Google.
