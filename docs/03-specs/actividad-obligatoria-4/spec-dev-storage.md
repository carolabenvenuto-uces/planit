# Especificación Técnica (Spec) - Desarrollador JS Local y Session Storage

- **Proyecto:** PlanIT - Plataforma All-in-One de Organización & Experiencias
- **Entrega:** Actividad Obligatoria N° 4
- **Rol:** Desarrollador JS Local y Session Storage
- **Responsable:** Facundo Guiraldes (@FacundoGuiraldes)
- **Rama:** `feature/dev-storage`
- **Issue principal:** [#107](https://github.com/carolabenvenuto-uces/planit/issues/107)
- **Fecha:** 18 de noviembre de 2026

---

## MOMENTO 1: Planificación Previa (ANTES de abrir Copilot o escribir código)

### 1. Contrato ya asumido por el resto del equipo

Antes de diseñar la estrategia desde cero, se relevó el código ya escrito por la Desarrolladora JS Eventos + DOM (PR [#104](https://github.com/carolabenvenuto-uces/planit/pull/104), todavía no mergeada), porque su `js/script.js` ya depende de este módulo:

- `index.html` ya carga `<script src="js/utils/storage.js" defer>`.
- `js/script.js` ya llama a un objeto global **`Almacenamiento`** con dos métodos: `Almacenamiento.guardar(clave, valor)` y `Almacenamiento.cargar(clave)`.
- Las claves ya usadas son `planit:evento` y `planit:detalles-evento` (constante `CLAVES_STORAGE` en `js/script.js`).
- El propio controlador ya contempla que el módulo puede no estar disponible ("si el almacenamiento no está disponible, la app funciona en memoria y lo avisa"), por lo que `Almacenamiento.cargar()` debe devolver `null` ante cualquier error en vez de lanzar una excepción hacia el controlador.

Esta spec respeta ese contrato como base y lo amplía con el resto de las operaciones CRUD pedidas por la consigna.

### 2. Estrategia de Almacenamiento

| Dato | Storage | Justificación |
|---|---|---|
| Evento actual (`planit:evento`), con su `Presupuesto` y `ListaInvitados` serializados vía `toJSON()` | `localStorage` | Debe sobrevivir entre sesiones: es el estado principal de la app (consistente con lo ya asumido en `js/script.js`). |
| Fecha y ubicación del evento (`planit:detalles-evento`) | `localStorage` | Son datos reales del evento (Flujo 1), no estado efímero de la UI: deben sobrevivir entre sesiones igual que `planit:evento`. Ver nota de corrección en MOMENTO 2. |
| Catálogo de proveedores (`CatalogoProveedores`) | No se persiste | Es un dato fijo del mockup, se reconstruye en cada carga desde `index.html` (atributos `data-proveedor`). |

**Nota sobre `sessionStorage`:** `CLAVES_SESSION` (el `Set` que rutea a `sessionStorage` en `storage.js`) está vacío hoy: ninguno de los datos actuales de PlanIT es efímero de una sola sesión de navegación. El mecanismo queda disponible para cuando exista un dato de ese tipo (por ejemplo, un filtro de catálogo que no deba sobrevivir a un reinicio del navegador): se agregaría su clave a `CLAVES_SESSION` sin tocar el resto de `Almacenamiento`. No se fuerza un caso de uso artificial solo para ejercitar `sessionStorage`.

### 3. Convención de Nombres de Claves

Se mantiene el prefijo `planit:` ya usado por el controlador, con el patrón `planit:<entidad>` o `planit:<entidad>-<detalle>`:

```
planit:evento
planit:detalles-evento
```

Toda clave nueva que se agregue en el futuro debe seguir este mismo patrón.

### 4. Diseño Preliminar del Schema JSON

El valor de `planit:evento` es el resultado de `Evento.toJSON()` (PR #102), con esta forma:

```json
{
  "nombre": "Casamiento de Sofi & Mateo",
  "tipo": "boda",
  "presupuestoEstimado": 700000,
  "presupuesto": { "items": [ { "categoria": "Catering", "descripcion": "...", "cantidad": 120, "precioUnitario": 3500 } ] },
  "invitados": { "invitados": [ { "nombre": "Sofía Rodríguez", "estado": "Confirmado" } ] }
}
```

### 5. Criterios de Aceptación (Checklist)

- [ ] `js/utils/storage.js` expone el objeto global `Almacenamiento` con `guardar(clave, valor)` y `cargar(clave)` compatibles con `js/script.js` tal cual está escrito hoy.
- [ ] CRUD completo además de los alias anteriores: `obtener(clave)`, `actualizar(clave, valor)`, `eliminar(clave)`, `listar(prefijo)`, `limpiar()`.
- [ ] `try/catch` en todas las operaciones; `cargar()`/`obtener()` devuelven `null` ante error, nunca lanzan.
- [ ] Serialización/deserialización automática de JSON (`JSON.stringify`/`JSON.parse`).
- [ ] Documentación completa en `docs/06-storage/storage-doc.md`.
- [ ] Verificación manual de que `index.html` carga `js/utils/storage.js` sin errores de consola una vez integrado.

---

## MOMENTO 2: Evidencia de Cierre (AL CERRAR la tarea)

### 1. Prompt utilizado y ejecución en Modo Agente (RC13)

- **Herramienta:** Claude Code (Anthropic) en **Modo Agente**, integrado en VS Code (extensión nativa de Claude Code), operando directamente sobre el workspace local del repositorio `planit`. No se usó GitHub Copilot: la justificación del cambio de herramienta está en `spec-devops.md`, sección 3 (criterio validado con el docente desde el cierre de la AO3).
- **Modo de trabajo:** el agente no recibe código pegado ni devuelve texto para copiar: lee los archivos del workspace con sus propias herramientas (lectura de archivos, búsqueda por contenido, terminal), propone y aplica ediciones sobre los archivos reales, y cada edición queda visible como diff en VS Code para su aprobación por el desarrollador antes de guardarse.
- **Contexto provisto:** este `spec-dev-storage.md` (MOMENTO 1, con el contrato ya relevado de la PR #104) y el workspace completo, que el agente inspecciona por sí mismo (ver bitácora en la sección 1.1).
- **Prompt de implementación:**
  > Implementá `js/utils/storage.js` siguiendo el MOMENTO 1 de `spec-dev-storage.md`: un objeto global `Almacenamiento` (IIFE) con `guardar(clave, valor)` y `cargar(clave)` compatibles con el contrato que ya usa `js/script.js` de la PR #104 (nunca lanzan: `guardar` devuelve `boolean`, `cargar` devuelve el valor o `null`), más el resto del CRUD pedido por la consigna: `obtener`, `actualizar`, `eliminar`, `listar(prefijo)`, `limpiar(prefijo)`. Serializá con `JSON.stringify`/`JSON.parse`. Ruteá cada clave a `localStorage` o `sessionStorage` según una tabla interna (no expuesta), de forma que el resto del código nunca llame directamente a la Web Storage API. Agregá el script a `index.html` y a `js/test/test-runner.html`, después de `js/models/*.js` y antes de `js/script.js`. Documentá todo en `docs/06-storage/storage-doc.md`.

#### 1.1. Bitácora de ejecución del agente en el workspace

**Entorno de ejecución:** VS Code (Windows 11) + extensión Claude Code en Modo Agente, con el repositorio `planit` abierto como workspace (rama `fix/docs-rc13-agent-mode-evidence-storage`, base `develop`). Herramientas del agente: lectura de archivos, búsqueda por contenido (`grep`), terminal integrada (Git Bash / PowerShell) y edición de archivos con diff previo. Sesión de verificación y documentación: 23/11/2026.

| # | Fase | Archivos leídos / editados | Herramienta del agente | Resultado verificable |
|---|---|---|---|---|
| 1 | Inspección del contrato del controlador | `js/script.js` (sección 3, `almacenamientoDisponible`, `leerDelAlmacenamiento`, `escribirEnAlmacenamiento`, `persistirEvento`) | Lectura + `grep "Almacenamiento"` | El controlador solo usa `guardar` y `cargar`; trata `guardar() === false` como fallo (muestra "No se pudieron guardar los cambios.") y envuelve `cargar()` en `try/catch` devolviendo `null`. |
| 2 | Inspección del orden de carga | `index.html` (líneas 555–566), `js/test/test-runner.html` (líneas 116–130) | `grep "script.*src"` | En ambos archivos `js/utils/storage.js` se carga después de los 8 modelos de `js/models/` y antes de `js/script.js`, como pedía el prompt. |
| 3 | Inspección de los modelos de dominio | `js/models/` (`Evento.js`, `Presupuesto.js`, `ListaInvitados.js`, `ItemContratado.js`, `Invitado.js`, `Validador.js`, `Proveedor.js`, `CatalogoProveedores.js`) | Listado del directorio + lectura | `storage.js` no referencia ninguna clase de `js/models/`: solo mueve el objeto plano de `Evento.toJSON()` / `Evento.fromJSON()` (desacople confirmado, ver sección 3). |
| 4 | Revisión del módulo de almacenamiento | `js/utils/storage.js` (99 líneas) | Lectura completa | Ver "Verificación técnica" más abajo. |
| 5 | Revisión de la suite de testing | `js/test/storage.spec.js` (19 casos en 6 bloques `describe`), `js/test/run-jasmine.js` | Lectura + `grep "describe(\|it("` | Cobertura de los 7 métodos públicos, incluidos `QuotaExceededError` simulado, JSON corrupto, `undefined`, clave sembrada en ambos storages e integración `toJSON`/`fromJSON` con un `Evento` real. |
| 6 | Intento de ejecución de la suite | `js/test/run-jasmine.js` | Terminal (`node --version`) | **No ejecutable en esta sesión:** el equipo donde corrió el agente no tiene Node.js instalado, por lo que no se pudo lanzar Playwright. La evidencia de ejecución de la suite es la registrada en `spec-tester-qa.md` y las verificaciones con Playwright de la sección 2 (commit `92d5e1a` y PR #108). Se deja constancia en vez de declarar una ejecución que no ocurrió. |
| 7 | Edición de la documentación | `docs/03-specs/actividad-obligatoria-4/spec-dev-storage.md` (este archivo) | Edición con diff revisado en VS Code | MOMENTO 2 reescrito con esta bitácora y el ítem RC13 del checklist de cierre. Sin comandos de Git ejecutados por el agente: el commit y el push los hace el desarrollador. |

**Alcance multi-archivo del módulo de almacenamiento** (lo que el prompt de implementación pidió y hoy está en el repositorio): `js/utils/storage.js` (módulo), `index.html` y `js/test/test-runner.html` (integración del `<script>`), `js/test/storage.spec.js` (suite) y `docs/06-storage/storage-doc.md` (documentación). Las capacidades implementadas son:

- **Encapsulamiento de la Web Storage API:** IIFE que expone solo `{ guardar, cargar, obtener, actualizar, eliminar, listar, limpiar }`; `PREFIJO`, `CLAVES_SESSION` y `resolverStorage()` quedan privados. El resto del código nunca llama a `localStorage`/`sessionStorage` directamente.
- **Gestión de prefijos:** prefijo `planit:` por defecto en `listar()` y `limpiar()`; ambos aceptan un prefijo propio (la suite usa `planit:test-` para no tocar datos reales).
- **Serialización/deserialización JSON segura:** `guardar()` rechaza `undefined` (devolvería el string `"undefined"`, irrecuperable con `JSON.parse`); `cargar()` devuelve `null` ante clave inexistente o JSON corrupto.
- **Ruteo y operación sobre ambos storages:** `resolverStorage()` decide `localStorage`/`sessionStorage` por clave; `eliminar()` y `listar()` recorren los dos storages con un `try/catch` independiente por storage, de modo que uno bloqueado no impide operar sobre el otro. **Aclaración:** no existe un reintento automático de escritura en el otro storage cuando uno falla; la degradación ante un storage no disponible la hace el controlador, que sigue funcionando en memoria y avisa al usuario.
- **Manejo defensivo de cuota y `SecurityError`:** todo acceso a la API está dentro de `try/catch`, que captura cualquier `DOMException` (`QuotaExceededError` al escribir, `SecurityError` al acceder a `window.localStorage` con almacenamiento bloqueado o en modo privado restringido); el error se registra con `console.error` y la función devuelve `false`/`null`/`[]` según corresponda.

**Verificación técnica realizada por el agente (estática, sobre el código actual):**

| Contrato | Comportamiento verificado en `storage.js` | Caso de la suite que lo cubre |
|---|---|---|
| `guardar(clave, valor) → boolean` | `true` si escribe; `false` con `undefined` o si `setItem` lanza. Nunca propaga. | "guardar y recuperar…", "con undefined…", "si el storage está lleno…" |
| `cargar(clave) → valor \| null` | `null` si no existe o si `JSON.parse`/`getItem` lanzan. Nunca propaga. | "clave inexistente…", "JSON corrupto…" |
| `eliminar(clave) → boolean` | Borra de ambos storages; `false` solo si alguno lanzó. Clave inexistente no es error. | Bloque `eliminar` (3 casos) |
| `limpiar(prefijo) → boolean` | `listar(prefijo).map(eliminar).every(Boolean)`: refleja el resultado real; `true` sin coincidencias. | Bloque `limpiar` (3 casos) |
| `listar(prefijo) → string[]` | Recorre ambos storages; ante error en uno, sigue con el otro y nunca lanza. | Bloque `listar` (3 casos) |
| Ausencia de excepciones hacia el invocador | Los 7 métodos públicos tienen su acceso a la API dentro de `try/catch` (`obtener`/`actualizar` delegan en `cargar`/`guardar`). | "no debería lanzar" en `QuotaExceededError` y JSON corrupto |
| Compatibilidad cruzada | Con `js/script.js` (contrato `guardar`/`cargar`, paso 1), con `js/models/` (`Evento.toJSON`/`fromJSON`, paso 3) y con el orden de carga de `index.html` y `test-runner.html` (paso 2). | "Integración con js/models/…" |

**Hallazgo del agente, no corregido en esta tarea (fuera del alcance de RC13):** el comentario de cabecera de `js/script.js` (línea 24) dice que `Almacenamiento.guardar` "lanza Error si falla", pero el contrato real, y el propio `escribirEnAlmacenamiento()`, trabajan con el `boolean` de retorno. Es solo un comentario desactualizado; se reporta al responsable de `script.js` en vez de editar un archivo de otro rol.

**Control humano y supervisión:**

- Cada edición del agente se presenta como diff en VS Code y requiere aprobación explícita del desarrollador antes de escribirse en disco; los comandos de terminal también pasan por el modo de permisos de Claude Code.
- El agente no ejecuta `git add`, `git commit` ni `git push`: el versionado lo hace el desarrollador después de revisar el diff completo, y todo cambio entra a `develop` por PR con code review de otro integrante (como la PR #108, que pidió los 4 ajustes de la sección 2).
- Las afirmaciones del agente se contrastan contra el repositorio y contra ejecución real en navegador (Playwright, sección 2) antes de darse por válidas; el paso 6 deja registrado lo que **no** se pudo ejecutar en esta sesión.
- El responsable del rol (Facundo Guiraldes) mantiene la decisión final sobre el diseño del módulo: el ajuste de `planit:detalles-evento` (commit `92d5e1a`) corrigió una suposición errónea del prompt original que el código generado había heredado.

### 2. Fragmento generado y ajustes manuales

**Fragmento generado** (`js/utils/storage.js`, commit `3446f96`):

```javascript
const Almacenamiento = (function () {
    const PREFIJO = "planit:";
    const CLAVES_SESSION = new Set(["planit:detalles-evento"]);

    function resolverStorage(clave) {
        return CLAVES_SESSION.has(clave) ? window.sessionStorage : window.localStorage;
    }

    function guardar(clave, valor) {
        try {
            const storage = resolverStorage(clave);
            storage.setItem(clave, JSON.stringify(valor));
            return true;
        } catch (error) {
            console.error(`Almacenamiento: no se pudo guardar la clave "${clave}".`, error);
            return false;
        }
    }
    // cargar/obtener/actualizar/eliminar/listar/limpiar con la misma estructura try/catch.
})();
```

**Ajustes manuales:**

| Commit | Ajuste | Justificación |
| --- | --- | --- |
| `92d5e1a` | `planit:detalles-evento` se sacó de `CLAVES_SESSION` (pasa de `sessionStorage` a `localStorage`). | El prompt original asumió, sin verificarlo contra `js/script.js`, que esa clave era estado efímero de UI. En los hechos guarda fecha y ubicación reales del evento. Verificado con Playwright: simulando un reinicio de navegador (`sessionStorage.clear()`), fecha y ubicación volvían al valor del mockup mientras el resto del evento persistía. Corregido durante la revisión de la PR #104 (ronda 3), antes de que el código generado se diera por cerrado. |
| Revisión de Dev Eventos + DOM (PR #108, @ValeriaMSilva) | `guardar(clave, undefined)` ahora devuelve `false` en vez de guardar el string `"undefined"` (irrecuperable con `JSON.parse`). `eliminar(clave)` ahora borra de **ambos** storages, no solo del que le asigna `resolverStorage`, para no dejar claves huérfanas si una clave cambió de storage (como pasó con `planit:detalles-evento`). `listar()` usa un `try/catch` por storage en vez de uno solo para los dos, así un storage bloqueado no impide listar el otro. `limpiar()` ahora devuelve `listar(prefijo).map(eliminar).every(Boolean)` en vez de `true` fijo, reflejando si `eliminar()` realmente tuvo éxito. | Los 4 puntos surgieron de la code review de PR #108 (`CHANGES_REQUESTED`, 22/11). Se verificaron con Playwright sobre el `index.html` real: `guardar` con `undefined` devuelve `false` sin dejar rastro, `limpiar` refleja el resultado real de `eliminar`, y una clave sembrada a propósito en ambos storages se borra completa con un solo `eliminar()`. |

### 3. Coordinación final con Dev POO

El esquema JSON de `planit:evento` (sección 4 del MOMENTO 1) se confirmó contra el `toJSON()` real de `Evento` una vez mergeada la PR #102: la forma declarada en el preliminar coincidió exactamente con la implementación final (incluye `presupuesto.items[]` e `invitados.invitados[]` anidados), sin necesidad de ajustes. `storage.js` no importa ni conoce las clases de `js/models/`: solo mueve el objeto plano que devuelve `Evento.toJSON()` / que espera `Evento.fromJSON()`, tal como estaba previsto.

### 4. Checklist de cierre

- [x] `js/utils/storage.js` expone `Almacenamiento` con el contrato acordado.
- [x] CRUD completo: `obtener`, `actualizar`, `eliminar`, `listar`, `limpiar`.
- [x] `try/catch` en todas las operaciones, sin excepciones hacia el controlador.
- [x] Serialización/deserialización automática con `JSON.stringify`/`JSON.parse`.
- [x] `docs/06-storage/storage-doc.md` actualizado y consistente con el código.
- [x] Integración verificada con Playwright sobre `index.html` real, con `feature/dev-eventos-dom` ya mergeada.
- [x] Code review de otro integrante (PR #108): `CHANGES_REQUESTED` → correcciones aplicadas → pendiente de re-aprobación.

### 5. Actualización posterior: RC22 (fachada de persistencia)

Por la observación RC22 del docente ("el controlador conoce directamente Almacenamiento y sus operaciones"), `js/script.js` dejó de llamar a `Almacenamiento` y ya no tiene la constante `CLAVES_STORAGE`. Entre los dos se agregó la fachada `js/services/ServicioPersistenciaEvento.js`, que ahora es el único consumidor de este módulo y la única dueña de las claves y del ciclo `toJSON()` / `fromJSON()`. `js/utils/storage.js` no cambió: mismo contrato, mismas claves, mismo formato JSON y mismo ruteo a `localStorage`. Lo que se dice arriba sobre "el contrato que ya usa `js/script.js`" (MOMENTO 1, sección 1) describe el estado previo a RC22. Detalle completo en `spec-dev-eventos-dom.md`, sección 6 del cierre.
