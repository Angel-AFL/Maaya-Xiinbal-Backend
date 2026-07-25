---
tags:
  - api
  - api/endpoint
  - backend
  - atractivos
---

### [Listar Atractivos Turísticos]

**Descripción:** Devuelve todos los atractivos turísticos disponibles en la base de datos (cenotes, zonas arqueológicas, playas, etc.) con su información detallada.  
**URL:** `/api/atractivos`  
**Método HTTP:** `GET`

---
#### Autenticación
*   **Requerida:** Sí
*   **Tipo:** Bearer Token (JWT)
*   **Permisos necesarios:** Estar autenticado.

#### Headers (Cabeceras)

| Nombre | Requerido | Tipo | Descripción |
| :--- | :---: | :--- | :--- |
| `Authorization` | Sí | string | Token de acceso (ej. `Bearer eyJhbG...`). |

---
#### Parámetros

**Parámetros de Ruta (Path)**  
*(No aplica)*

**Parámetros de Consulta (Query)**  
*(No aplica — Actualmente devuelve todos los atractivos sin filtros)*

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
  "success": true,
  "cantidad": 2,
  "data": [
    {
      "id": 1,
      "nombre": "Chichén Itzá",
      "descripcion": "Antigua ciudad maya con la pirámide de Kukulkán.",
      "categoria": "Zona Arqueológica",
      "municipio": "Tinum",
      "estado": "Yucatán",
      "direccion": "Carretera Mérida-Cancún km 120",
      "precio": "614.00",
      "hora_apertura": "08:00:00",
      "hora_cierre": "17:00:00",
      "lat": "20.68430000",
      "long": "-88.56770000"
    }
  ]
}
```

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `success` | boolean | `true` si la consulta fue exitosa. |
| `cantidad` | integer | Número total de atractivos devueltos. |
| `data` | array | Lista de atractivos turísticos. |
| `data[].id` | integer | ID único del atractivo. |
| `data[].nombre` | string | Nombre del atractivo. |
| `data[].descripcion` | string \| null | Descripción del atractivo. |
| `data[].categoria` | string \| null | Categoría (ej. Zona Arqueológica, Cenote, Playa). |
| `data[].municipio` | string \| null | Municipio donde se ubica. |
| `data[].estado` | string \| null | Estado donde se ubica (Yucatán, Quintana Roo, Campeche). |
| `data[].direccion` | string \| null | Dirección física del lugar. |
| `data[].precio` | string \| null | Precio de entrada en MXN. |
| `data[].hora_apertura` | string \| null | Hora de apertura (formato HH:MM:SS). |
| `data[].hora_cierre` | string \| null | Hora de cierre (formato HH:MM:SS). |
| `data[].lat` | string \| null | Coordenada de latitud. |
| `data[].long` | string \| null | Coordenada de longitud. |

**Respuestas de Error**
*(Casos de fallo y códigos de estado)*
*   **Código HTTP:** `401 Unauthorized` — Token no proporcionado, inválido o expirado.
*   **Código HTTP:** `500 Internal Server Error` — Error inesperado del servidor.
*   **Cuerpo (Ejemplo para 500 Internal Server Error):**

```json
{
  "success": false,
  "message": "Error interno del servidor al obtener los atractivos"
}
```
