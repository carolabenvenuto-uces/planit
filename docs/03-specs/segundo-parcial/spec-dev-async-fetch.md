# Especificación Técnica (Spec) - Desarrolladora JS Asíncrono (Fetch & APIs)

- **Proyecto:** PlanIT - Plataforma All-in-One de Organización & Experiencias
- **Entrega:** Segundo Parcial
- **Rol:** Desarrolladora JS Asíncrono - Fetch & APIs
- **Responsable:** Carola Benvenuto (@carolabenvenuto-uces)
- **Rama:** `feature/dev-async-fetch-api`
- **Issue principal:** [#138](https://github.com/carolabenvenuto-uces/planit/issues/138)
- **Fecha:** 25 de noviembre de 2026

---

## MOMENTO 1: Planificación Previa (ANTES de escribir código)

### 1. Qué se va a hacer
Incorporar consumo asíncrono de datos a PlanIT: el catálogo de proveedores, que hoy está escrito a mano en `js/script.js` (`DATOS_SEMILLA.catalogo` y `PRESENTACION_PROVEEDORES`), pasa a cargarse desde un archivo JSON estático mediante `fetch` y promesas. Los datos recibidos se validan y sanitizan, se procesan con funciones de orden superior y se convierten en instancias de las clases POO existentes (`Proveedor` y `CatalogoProveedores`). La sección Catálogo muestra estados de carga, éxito y error, con mensajes amigables y un fallback para que la app siga funcionando si la carga falla.

El acceso a datos queda en un módulo dedicado, `js/api/apiService.js`, separado del controlador (`js/script.js`), que solo se encarga de pedir los datos y de reflejar cada estado en el DOM.

> **Ubicación del spec:** el árbol de carpetas de la consigna muestra este archivo dentro de `actividad-obligatoria-3/`, pero corresponde a la carpeta nueva `docs/03-specs/segundo-parcial/`, junto con los demás specs del parcial.

### 2. Selección y justificación de la API
Se usa un **archivo JSON estático propio en `api/proveedores.json`**, opción que la consigna admite (*"o archivo JSON estático en carpeta /api"*).

| Alternativa | Por qué no se eligió |
| --- | --- |
| APIs públicas genéricas (JSONPlaceholder, TheCocktailDB, etc.) | Sus datos no pertenecen al dominio de PlanIT (eventos, proveedores, presupuestos): habría que forzar una equivalencia artificial. |
| MockAPI u otro servicio externo | Agrega una dependencia de un tercero (disponibilidad, límites de uso, cuentas) para una entrega de 3 días. |

Ventajas del JSON estático:
- Contiene **datos reales del dominio**: los mismos proveedores que hoy están hardcodeados, que pasan a tener una única fuente de verdad.
- Hace el **catálogo extensible**: agregar un proveedor solo requiere sumarlo al JSON, sin tocar el código.
- Se sirve desde el **mismo origen** que el sitio en GitHub Pages: no hay problemas de CORS ni claves de API.
- Permite que el Tester pruebe los casos de error de forma reproducible (simulando respuestas en `api.spec.js`).

**Limitación conocida:** `fetch` no puede leer archivos locales si se abre `index.html` con `file://`. En ese caso se usa el fallback de la sección 5, y el flujo completo se verifica con un servidor local o en GitHub Pages.

### 3. Estructura de los datos
`api/proveedores.json` tendrá un objeto con versión y la lista de proveedores, con los campos del modelo (`nombre`, `categoria`, `precio`, `unidad`) y los de presentación que hoy viven en `PRESENTACION_PROVEEDORES`:

```json
{
  "version": 1,
  "proveedores": [
    {
      "nombre": "Gourmet Finger Food",
      "categoria": "Catering",
      "precio": 3500,
      "unidad": "pax",
      "imagen": "catalogo-gourmet-finger-food.jpg",
      "alt": "Mesa de catering con bandejas de mini sándwiches y bocados en varios niveles",
      "descripcion": "Selección premium fría y caliente para recepción.",
      "capacidad": "Hasta 200 pax",
      "zona": "Zona Norte GBA",
      "duracion": "4 horas",
      "incluye": "Finger food frío y caliente, montaje y reposición"
    }
  ]
}
```

### 4. Diseño del servicio (`js/api/apiService.js`)
Objeto global `ApiService`, cargado como script clásico en `index.html` y en `js/test/test-runner.html`, igual que el resto de los módulos del proyecto. El ejemplo de la consigna usa `export default`, pero el proyecto carga todos sus archivos como scripts clásicos; usar módulos ES6 solo en este archivo rompería la carga del test runner.

| Función | Responsabilidad |
| --- | --- |
| `async fetchData(url, opciones)` | `fetch` genérico: verifica `response.ok` (lanza `Error("HTTP error! status: …")`), parsea el JSON y distingue errores HTTP, de red y de formato. Incluye un reintento ante errores de red. |
| `async obtenerProveedores()` | Pide `api/proveedores.json`, valida la estructura y devuelve los proveedores ya sanitizados. |
| `validarProveedor(dato)` / `sanitizarTexto(texto)` | Descartan registros sin nombre, categoría o precio válido y limpian textos (espacios, tipos, valores fuera de rango) antes de usarlos. |
| `aCatalogo(datos)` | **`map`**: convierte cada registro válido en una instancia de `Proveedor` y arma un `CatalogoProveedores`. |
| `filtrarPorCategoria(proveedores, categoria)` / `filtrarPorPrecioMaximo(...)` | **`filter`**: filtros reutilizables sobre la colección. |
| `resumirCatalogo(proveedores)` | **`reduce`**: cantidad de proveedores por categoría y rango de precios (mínimo y máximo), para mostrar un resumen en la sección Catálogo. |

El servicio **no manipula el DOM**: devuelve datos o lanza un `Error`. El controlador (`js/script.js`) decide qué estado mostrar.

### 5. Estados de carga y manejo de errores
| Estado | Qué ve la usuaria (sección Catálogo) |
| --- | --- |
| `loading` | Spinner de Bootstrap con el texto "Cargando proveedores…" en `#contenedor-catalogo`, anunciado con `aria-live="polite"`; búsqueda y filtro deshabilitados mientras tanto. |
| `success` | Tarjetas del catálogo renderizadas con los datos del JSON y el resumen calculado con `reduce`. |
| `error` | Aviso amigable ("No pudimos cargar el catálogo actualizado. Te mostramos la versión guardada.") con un botón **Reintentar**. |

- Todas las operaciones asíncronas usan `try/catch`.
- **Fallback:** si la carga falla después del reintento, se muestran los datos de `DATOS_SEMILLA`, para que el catálogo nunca quede vacío.
- Los mensajes de error técnicos (status HTTP, detalle de red) quedan en la consola para depuración, nunca en la UI.

### 6. Integración con la arquitectura existente
- **Clases POO:** los datos se transforman en `Proveedor` y `CatalogoProveedores` (`js/models/`), que mantienen sus validaciones internas. Un registro que no supere esas validaciones se descarta y se informa en la consola, sin romper la carga del resto.
- **Controlador (`js/script.js`):** reemplaza el catálogo hardcodeado por la llamada a `ApiService.obtenerProveedores()`, manteniendo la búsqueda y el filtro por categoría actuales.
- **Storage:** el catálogo no forma parte del estado persistido del evento. Si se decide guardar la última versión cargada como caché, se hará **extendiendo la fachada `ServicioPersistenciaEvento`**, que es el único punto del sistema que conoce las claves del storage, y se coordinará con el Desarrollador JS Storage.
- **Librería externa:** si la librería elegida usa datos del catálogo (por ejemplo, un gráfico), consume la salida de `resumirCatalogo()`.

### 7. Coordinación con el Tester QA/JS
Casos propuestos para `js/test/api.spec.js`, simulando `fetch` con `spyOn(window, "fetch")`:
1. Respuesta exitosa: `obtenerProveedores()` devuelve los proveedores del JSON.
2. Error HTTP (404/500): se lanza un `Error` con el status.
3. Error de red (`fetch` rechazado): se reintenta una vez y luego se lanza el error.
4. JSON con estructura inválida o registros incompletos: se descartan los inválidos.
5. Procesamiento: `aCatalogo()` (`map`), filtros (`filter`) y `resumirCatalogo()` (`reduce`) con datos conocidos.
6. Integración con el DOM: estados de carga, éxito, error y fallback en la sección Catálogo.

Además, el **Lighthouse baseline** se corre sobre `develop` antes del merge de esta PR.

### 8. Herramientas a utilizar
- **GitHub Copilot en modo Agente**, con `js/script.js`, `js/models/Proveedor.js`, `js/models/CatalogoProveedores.js`, `index.html` y este spec como contexto, para generar `js/api/apiService.js` y la integración con el controlador. Se eligió para mantener el mismo flujo de trabajo de la Actividad Obligatoria N° 4.
- **Servidor local** (por ejemplo, la extensión Live Server de VS Code) para probar `fetch` fuera de `file://`, y **GitHub Pages** para la verificación final.

### 9. Criterios de Aceptación (Checklist)
- [ ] `spec-dev-async-fetch.md` commiteado antes que cualquier código.
- [ ] API seleccionada (JSON estático en `api/proveedores.json`) y decisión técnica documentada.
- [ ] Funciones asíncronas con `fetch` y promesas en `js/api/apiService.js`, con JSDoc.
- [ ] Estados de carga, éxito y error con feedback visual en la sección Catálogo.
- [ ] Datos integrados dinámicamente al DOM.
- [ ] `map`, `filter` y `reduce` aplicados al procesamiento del catálogo.
- [ ] Validación y sanitización de los datos recibidos.
- [ ] `try/catch` en las operaciones asíncronas, mensajes amigables y fallback a los datos semilla.
- [ ] Datos convertidos en instancias de `Proveedor` y `CatalogoProveedores`.
- [ ] Servicio separado del controlador, sin manipulación del DOM.
- [ ] Casos de test coordinados con el Tester QA/JS.
- [ ] Contribución registrada en `changelog.md` con links a la PR y a la issue.

---

## MOMENTO 2: Evidencia de Cierre (AL FINALIZAR)

### 1. Prompt utilizado y ajustes manuales
*(A completar al cierre.)*

### 2. Integración con clases POO y con Storage
*(A completar al cierre.)*

### 3. Issues respondidas y su resolución
*(A completar al cierre.)*

### 4. Criterios de Aceptación al cierre
*(A completar al cierre.)*
