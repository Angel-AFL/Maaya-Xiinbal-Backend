---
tags:
  - api
  - api/endpoint
  - backend
---

### [Health Check]

**Descripción:** Endpoint de verificación de estado del servidor. Útil para monitoreo y para confirmar que la API está en línea.  
**URL:** `/`  
**Método HTTP:** `GET`

---
#### Autenticación
*   **Requerida:** No

#### Headers (Cabeceras)

| Nombre | Requerido | Tipo | Descripción |
| :--- | :---: | :--- | :--- |
| *(Ninguno)* | — | — | Este endpoint no requiere headers especiales. |

---
#### Parámetros

**Parámetros de Ruta (Path)**  
*(No aplica)*

**Parámetros de Consulta (Query)**  
*(No aplica)*

---
#### Cuerpo de la Petición (Body)
*(No aplica — El cuerpo debe estar vacío)*

---
#### Respuesta (Response)
*(Lo que el servidor devuelve al cliente tras procesar la petición)*

**Respuesta Exitosa**
*   **Código HTTP:** `200 OK`
*   **Cuerpo:**

```json
{
  "status": "success",
  "message": "Api estática"
}
```

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `status` | string | Estado de la API (`"success"` si está operativa). |
| `message` | string | Mensaje descriptivo del estado. |

**Respuestas de Error**
*(Este endpoint no genera errores en condiciones normales de operación.)*
