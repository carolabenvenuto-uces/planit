# Documentación - Capa de Almacenamiento (`js/utils/storage.js`)

- **Rol:** Desarrollador JS Local y Session Storage
- **Responsable:** Facundo Guiraldes (@FacundoGuiraldes)
- **Rama:** `feature/dev-storage`
- **Issue:** [#107](https://github.com/carolabenvenuto-uces/planit/issues/107)
- **Spec relacionada:** `docs/03-specs/actividad-obligatoria-4/spec-dev-storage.md`

## 1. Qué resuelve

`js/utils/storage.js` expone un único objeto global, **`Almacenamiento`**, que encapsula el acceso a `localStorage` y `sessionStorage` del navegador. Ningún otro módulo del proyecto debe llamar directamente a `localStorage`/`sessionStorage`: todo pasa por este objeto, para poder cambiar la estrategia de persistencia sin tocar el resto del código.

## 2. API

| Método | Firma | Devuelve | Descripción |
|---|---|---|---|
| `guardar` | `guardar(clave, valor)` | `boolean` | Serializa `valor` con `JSON.stringify` y lo guarda. `true` si tuvo éxito, `false` si falló. |
| `cargar` | `cargar(clave)` | `objeto \| null` | Busca la clave, la deserializa con `JSON.parse`. Devuelve `null` si no existe o si falla (JSON corrupto, storage no disponible, etc.). **Nunca lanza una excepción.** |
| `obtener` | `obtener(clave)` | `objeto \| null` | Alias de `cargar`. |
| `actualizar` | `actualizar(clave, valor)` | `boolean` | Alias de `guardar` (sobrescribe el valor existente). |
| `eliminar` | `eliminar(clave)` | `boolean` | Borra la clave de **ambos** storages (no solo del que le asigna hoy `resolverStorage`), para no dejar claves huérfanas si una clave cambió de storage en una versión anterior. `true` si no hubo errores. |
| `listar` | `listar(prefijo = "planit:")` | `string[]` | Devuelve las claves (de `localStorage` + `sessionStorage`) que empiezan con `prefijo`. Cada storage se recorre en su propio `try/catch`: si uno falla, igual devuelve las claves del otro. |
| `limpiar` | `limpiar(prefijo = "planit:")` | `boolean` | Borra todas las claves que empiezan con `prefijo`. Devuelve `listar(prefijo).map(eliminar).every(Boolean)`: refleja si cada `eliminar()` tuvo éxito real, no un `true` fijo. |

Todas las operaciones están envueltas en `try/catch`. Las de lectura devuelven `null` ante error; las de escritura devuelven `false`. Esto es intencional: el controlador (`js/script.js`) debe poder seguir funcionando en memoria si el storage no está disponible (modo privado del navegador, cuota excedida, etc.), sin que una excepción corte la ejecución.

## 3. Claves usadas y su storage

| Clave | Storage | Por qué |
|---|---|---|
| `planit:evento` | `localStorage` | Es el estado principal del evento (resultado de `Evento.toJSON()`), debe sobrevivir entre sesiones. |
| `planit:detalles-evento` | `localStorage` | Fecha y ubicación reales del evento (Flujo 1), no estado efímero de la UI: debe sobrevivir entre sesiones igual que `planit:evento`. |

La asignación storage-por-clave es interna a `storage.js` (`CLAVES_SESSION`, un `Set` con las claves que van a `sessionStorage`; cualquier otra clave con prefijo `planit:` va a `localStorage` por defecto, incluida `planit:detalles-evento`). El resto del código no necesita saber en qué storage físico vive cada dato: solo llama a `Almacenamiento.guardar/cargar` con la clave correspondiente.

**Corrección (revisión del 21/11):** la primera versión de este documento asumía que `planit:detalles-evento` guardaba datos de UI efímeros (ej. última sección activa) y la ruteaba a `sessionStorage`. En los hechos, `js/script.js` la usa para la fecha y la ubicación reales del evento (ver `CLAVES_STORAGE` y `manejarSubmitEvento`), que deben persistir igual que el resto del evento. Se verificó con Playwright que, con la asignación anterior, cerrar y reabrir el navegador hacía que fecha y ubicación volvieran silenciosamente a los valores del mockup mientras el resto del evento sí persistía. Se corrigió vaciando `CLAVES_SESSION`, de modo que esa clave (como cualquier otra con prefijo `planit:` que no se agregue explícitamente a ese `Set`) vaya a `localStorage`.

Toda clave nueva debe seguir el patrón `planit:<entidad>` o `planit:<entidad>-<detalle>`.

## 4. Ejemplo de uso

```javascript
// Guardar el evento completo (usa las clases de js/models/, PR #102)
const evento = new Evento("Casamiento de Sofi & Mateo", "boda", 700000);
Almacenamiento.guardar("planit:evento", evento.toJSON());

// Cargar y reconstruir el objeto de dominio
const datosGuardados = Almacenamiento.cargar("planit:evento");
const eventoRecuperado = datosGuardados ? Evento.fromJSON(datosGuardados) : null;
```

## 5. Integración con el resto del equipo

- **Dev POO (`js/models/`):** los valores guardados son siempre el resultado de `toJSON()` de las clases de dominio; al cargar, se reconstruyen con `fromJSON()`. `storage.js` no conoce estas clases, solo mueve objetos planos.
- **Dev Eventos + DOM (`js/script.js`):** ya consume `Almacenamiento.guardar(clave, valor)` / `Almacenamiento.cargar(clave)` con las claves `planit:evento` y `planit:detalles-evento` (constante `CLAVES_STORAGE`). Este módulo respeta ese contrato tal cual estaba escrito.
- **Orden de carga en `index.html` / `js/test/test-runner.html`:** `js/utils/storage.js` se carga después de `js/models/*.js` y antes de `js/script.js`, porque el controlador lo usa apenas arranca.

## 6. Verificación manual realizada

**Primera versión (antes del ruteo a `localStorage` de `planit:detalles-evento`):** se agregó temporalmente una suite de verificación con Jasmine (no commiteada, descartada tras la prueba) que cubrió guardar/cargar en `localStorage`, ruteo a `sessionStorage` para `planit:detalles-evento`, `cargar()` de clave inexistente, alias `obtener`/`actualizar`, `eliminar`, `listar` con filtro de prefijo, `limpiar`, y tolerancia a JSON corrupto sin lanzar excepciones: **90/90 specs, 0 failures** (82 de la suite existente + 8 de esta verificación), corridos con `node js/test/run-jasmine.js`.

**Tras la corrección del ruteo (commit `92d5e1a`):** se verificó con Playwright, sobre el `index.html` real integrado con `feature/dev-eventos-dom`, que guardar un evento con fecha y ubicación nuevas y simular un reinicio del navegador (`sessionStorage.clear()` + reload, dejando `localStorage` intacto) ya no revierte esos dos campos al valor del mockup.

**Tras la code review de PR #108 (@ValeriaMSilva, puntos 5 a 8):** se verificó con Playwright, sobre `index.html`, que `guardar(clave, undefined)` devuelve `false` sin dejar rastro leíble, que `limpiar()` sobre varias claves recién creadas las borra y devuelve `true`, y que `eliminar()` sobre una clave sembrada a propósito en ambos storages (`localStorage` y `sessionStorage`) la borra de los dos con una sola llamada.

En los tres casos se corrió además la suite completa del proyecto (`node js/test/run-jasmine.js`) para descartar regresiones: **82 specs**, con las mismas fallas ya conocidas de `script.spec.js` (legacy, pendientes del refactor a cargo de Tester QA) y ninguna falla nueva.

La suite oficial y definitiva `js/test/storage.spec.js` es responsabilidad del rol Tester QA (Issue [#106](https://github.com/carolabenvenuto-uces/planit/issues/106)) y se integra en una etapa posterior.
