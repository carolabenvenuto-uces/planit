# Especificación Técnica (Spec) - Coordinador / DevOps

- **Proyecto:** PlanIT - Plataforma All-in-One de Organización & Experiencias
- **Entrega:** Actividad Obligatoria N° 4
- **Rol:** Coordinador / DevOps (+ Tester QA, + Desarrollador JS Storage, por ser un grupo de 3 integrantes)
- **Responsable:** Facundo Guiraldes (@FacundoGuiraldes)
- **Rama:** `feature/coord-devops-cuarta-entrega`
- **Issue principal:** [#105](https://github.com/carolabenvenuto-uces/planit/issues/105)
- **Fecha:** 18 de noviembre de 2026

---

## MOMENTO 1: Planificación Previa (ANTES de comenzar)

### 1. Qué se va a hacer

Coordinación integral de la Actividad Obligatoria N° 4 (AO4). A diferencia de la AO3, el equipo quedó conformado por 3 integrantes, por lo que este rol absorbe también las tareas de Tester QA y de Desarrollador JS Storage (ver nota de la consigna para grupos de 3), documentadas cada una en su propio spec (`spec-tester-qa.md`, `spec-dev-storage.md`) y su propia rama (`feature/tester-qa-specs`, `feature/dev-storage`) para mantener trazabilidad.

Al momento de este commit, la Desarrolladora JS POO (@carolabenvenuto-uces) ya tiene abierta la PR [#102](https://github.com/carolabenvenuto-uces/planit/pull/102) con las 8 clases del dominio en `js/models/` y el diagrama de clases, y la Desarrolladora JS Eventos + DOM (@ValeriaMSilva) ya tiene abierta la PR [#104](https://github.com/carolabenvenuto-uces/planit/pull/104) con el controlador refactorizado.

### 2. Plan de Coordinación, Orden de Integración y Criterios de Aprobación

Se relevó el contenido real de ambas PRs antes de planificar el orden, porque tienen una dependencia estricta entre sí:

- La PR #104 (`js/script.js`) ya instancia `new Evento(...)`, `new ItemContratado(...)`, `new Proveedor(...)` y `new CatalogoProveedores(...)`, pero su rama se creó desde `develop` **antes** de que la PR #102 existiera, por lo que no contiene los archivos de `js/models/`. Mergear la #104 antes que la #102 dejaría la aplicación rota (clases indefinidas).
- `index.html` en la PR #104 ya referencia `<script src="js/utils/storage.js">` y `js/script.js` ya llama a un objeto global `Almacenamiento` con `Almacenamiento.guardar(clave, valor)` y `Almacenamiento.cargar(clave)`, usando las claves `planit:evento` y `planit:detalles-evento`. Ese archivo todavía no existe: es el contrato que debe respetar la implementación de `js/utils/storage.js` (spec-dev-storage.md).

Orden de integración definido:

1. **PR #102 (Dev POO)** → revisar y mergear primero a `develop`. No depende de nada más.
2. **Actualización de la PR #104 (Eventos + DOM):** pedirle a @ValeriaMSilva que mergee `develop` en `feature/dev-eventos-dom` una vez integrada la #102, para que su rama tenga las clases de `js/models/` y pueda ejecutarse/testearse en forma aislada.
3. **`feature/dev-storage` (este responsable):** implementar `js/utils/storage.js` apenas esté mergeada la #102 (no depende de que la #104 esté actualizada, solo de las clases de POO para la serialización).
4. **Merge de la PR #104 (ya actualizada) y de la PR de Storage.**
5. **`feature/tester-qa-specs` (este responsable):** recién con `js/models/`, `js/utils/storage.js` y el `js/script.js` final ya en `develop`, generar `models.spec.js`, `storage.spec.js` y refactorizar `script.spec.js`.
6. **`release/cuarta-entrega`** desde `develop`, GitHub Pages, PR final hacia `master`.

Criterio de aprobación para cada PR: el diff se revisa completo (no solo el resumen), se verifica el orden de commits (spec antes que el código correspondiente), se corren los tests existentes con `js/test/run-jasmine.js` antes de aprobar, y se contrasta contra la consigna y el diagrama de clases.

### 3. Herramientas a Utilizar: Justificación

Se utilizará **Claude (Anthropic)** para los code reviews, con acceso de lectura al repositorio (diffs, commits, archivos completos) y la consigna de la AO4 como contexto. Este criterio es consistente con el adoptado en el cierre de la AO3 (ver `docs/03-specs/actividad-obligatoria-3/spec-devops.md`, sección de obstáculos): las revisiones con GitHub Copilot Agent Mode resultaron incompletas en esa entrega (no analizaba todos los archivos del diff ni detectaba discrepancias con la consigna), mientras que las revisiones con Claude sí detectaron los bloqueantes reales. Cada resultado se contrasta manualmente contra el repositorio antes de publicarse como review en GitHub.

### 4. Criterios de Aceptación (Checklist)

- [x] `spec-devops.md` creado y commiteado en `docs/03-specs/actividad-obligatoria-4/` antes de cualquier otra tarea de coordinación de la AO4.
- [ ] PR #102 (Dev POO) revisada y mergeada.
- [ ] PR #104 (Eventos + DOM) revisada y mergeada, tras actualizarse con `develop`.
- [ ] PR de `feature/dev-storage` integrada.
- [ ] PR de `feature/tester-qa-specs` integrada.
- [ ] Al menos 4 code reviews con `CHANGES_REQUESTED` documentados (si corresponde).
- [ ] Tablero Kanban en GitHub Projects administrado con las issues de la AO4 (#101, #103, #105, #106, #107 y las que se abran).
- [ ] Seguimiento del Issue [#68](https://github.com/carolabenvenuto-uces/planit/issues/68) (deuda técnica de `js/componentes-bootstrap.js`), todavía sin resolver en esta entrega.
- [ ] `README.md` actualizado con información de la cuarta entrega.
- [ ] GitHub Pages activo y verificado en `release/cuarta-entrega`.
- [ ] Limpieza de ramas al cierre (solo `master`, `develop`, `release/cuarta-entrega`).
- [ ] Tag `v1.2-cuarta-entrega` y GitHub Release publicados tras la aprobación del docente.
- [ ] `changelog.md` actualizado con la contribución de cada integrante.

---

## MOMENTO 2: Evidencia de Cierre (AL FINALIZAR)

*(Sección en construcción: se completa íntegramente al cerrar la coordinación de la AO4. Los code reviews se documentan a medida que se publican, con el prompt utilizado cuando corresponde, qué se validó y los hallazgos. El resto — Kanban, limpieza de ramas, GitHub Pages, tag/release, obstáculos generales — se completa al final.)*

### Code reviews realizados

#### Review — PR #102 (Dev POO)
- **Veredicto:** `APPROVE`.
- **Qué se validó:** las 8 clases de `js/models/` contra el diagrama de clases aprobado, presencia de `toJSON()`/`static fromJSON()` en cada una (requisito para la serialización de `feature/dev-storage`), y corrida de los tests existentes antes de aprobar.

#### Review 1/3 — PR #104 (Eventos + DOM), ronda 1
- **Veredicto:** `CHANGES_REQUESTED`.
- **Hallazgo:** desacople de contrato entre `escribirEnAlmacenamiento()` (asumía que `Almacenamiento.guardar()` lanza una excepción en caso de fallo) y la implementación real de `Almacenamiento.guardar()` en `feature/dev-storage` (nunca lanza; devuelve `boolean`). Un fallo de guardado real pasaría inadvertido para la usuaria.
- **Nota:** esta ronda se ejecutó de forma conversacional con el asistente, sin un prompt único redactado por escrito de antemano; a partir de la ronda 2 se documenta el prompt exacto antes de ejecutar la revisión.

#### Review 2/3 — PR #104 (Eventos + DOM), ronda 2
- **Prompt utilizado:**
  > Actuás como Coordinador/DevOps de PlanIT haciendo code review de la PR #104 (`feature/dev-eventos-dom` → `develop`, autora: Valeria Silva). En la ronda anterior se publicó `CHANGES_REQUESTED` por un desacople de contrato entre `escribirEnAlmacenamiento()` y `Almacenamiento.guardar()` (ronda 1). Valeria pusheó el commit `fb04e75` como corrección.
  >
  > Tareas:
  > 1. Leer el diff exacto de `fb04e75` sobre `js/script.js` y confirmar que `escribirEnAlmacenamiento()` ahora respeta el contrato real de `Almacenamiento.guardar()` (devuelve `boolean`, nunca lanza), en lugar de asumir que lanza una excepción.
  > 2. Verificar el fix empíricamente, no solo por lectura de código: integrar `feature/dev-storage` sobre `feature/dev-eventos-dom` actualizado, cargar el `index.html` real en un navegador headless, y forzar el caso de fallo (`Almacenamiento.guardar` devolviendo `false`) para confirmar que el aviso global se muestra correctamente, y el caso normal para confirmar que no aparecen avisos espurios.
  > 3. Dado que ya están integradas las clases de `js/models/` (PR #102, mergeada), revisar si el controlador de la PR #104 tiene algún otro defecto de integración con esas clases, más allá del ya corregido. Priorizar flujos de uso real (alta/baja/edición de invitados, búsqueda de catálogo) sobre lectura superficial del diff.
  > 4. Si se encuentra un defecto nuevo, reproducirlo de punta a punta contra el `index.html` real (no mockear `ListaInvitados` ni el DOM) antes de reportarlo, y proponer una corrección concreta.
  > 5. Redactar el resultado como un GitHub Pull Request Review: si el fix de la ronda 1 es correcto pero aparece un defecto nuevo igual de concreto, el veredicto es `REQUEST_CHANGES` (no `APPROVE` todavía), documentando ambas cosas: qué se validó del fix anterior y el detalle completo del nuevo hallazgo (ubicación, causa raíz, reproducción, impacto, sugerencia de fix).
- **Veredicto:** `CHANGES_REQUESTED` ([review publicada](https://github.com/carolabenvenuto-uces/planit/pull/104#pullrequestreview-5967498077)).
- **Qué se validó:** el fix del commit `fb04e75` es correcto — se comprobó con Playwright sobre el `index.html` real (integrado con `feature/dev-storage`), forzando `Almacenamiento.guardar` a devolver `false` y confirmando que el aviso global se muestra, y que el caso normal no genera avisos espurios.
- **Hallazgo nuevo:** mezcla de invitados con nombre duplicado. `manejarAccionInvitado()`/`buscarInvitado()` resuelven el invitado por nombre en lugar de por un identificador estable, y `ListaInvitados.eliminar()` (PR #102) siempre afecta a la primera coincidencia por nombre. Reproducido con Playwright: al agregar dos invitados "Juan Perez" (uno Pendiente, otro Confirmado) y eliminar la fila "Confirmado", se elimina el invitado equivocado.
- **Progreso hacia el mínimo de la consigna:** 2/4 code reviews con `CHANGES_REQUESTED` documentados.

*(Rondas siguientes de PR #104, reviews de `feature/dev-storage` y de `feature/tester-qa-specs`, y el resto de los ítems del checklist de MOMENTO 1: pendientes de documentar al cerrar.)*
