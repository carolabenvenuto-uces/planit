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
| Detalles de UI del evento (`planit:detalles-evento`: por ejemplo, última sección activa o filtros del catálogo) | `sessionStorage` | Es información de la sesión de navegación actual, no tiene sentido persistirla entre visitas. |
| Catálogo de proveedores (`CatalogoProveedores`) | No se persiste | Es un dato fijo del mockup, se reconstruye en cada carga desde `index.html` (atributos `data-proveedor`). |

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

*(Pendiente — se completa con el prompt exacto de Copilot Agent, el fragmento de código generado, los ajustes manuales y la coordinación final con Dev POO para la serialización.)*
