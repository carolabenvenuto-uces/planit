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

### 1. Prompt utilizado

- **Herramienta:** Claude (Anthropic), en la misma sesión de coordinación de la AO4 (no GitHub Copilot: ver justificación de herramientas en `spec-devops.md`, sección 3, que documenta por qué este equipo usa Claude en vez de Copilot Agent Mode desde el cierre de la AO3).
- **Contexto provisto:** este `spec-dev-storage.md` (MOMENTO 1, con el contrato ya relevado de la PR #104) y el repositorio completo.
- **Prompt:**
  > Implementá `js/utils/storage.js` siguiendo el MOMENTO 1 de `spec-dev-storage.md`: un objeto global `Almacenamiento` (IIFE) con `guardar(clave, valor)` y `cargar(clave)` compatibles con el contrato que ya usa `js/script.js` de la PR #104 (nunca lanzan: `guardar` devuelve `boolean`, `cargar` devuelve el valor o `null`), más el resto del CRUD pedido por la consigna: `obtener`, `actualizar`, `eliminar`, `listar(prefijo)`, `limpiar(prefijo)`. Serializá con `JSON.stringify`/`JSON.parse`. Ruteá cada clave a `localStorage` o `sessionStorage` según una tabla interna (no expuesta), de forma que el resto del código nunca llame directamente a la Web Storage API. Agregá el script a `index.html` y a `js/test/test-runner.html`, después de `js/models/*.js` y antes de `js/script.js`. Documentá todo en `docs/06-storage/storage-doc.md`.

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
