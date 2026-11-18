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

*(Pendiente — se completa al cerrar la coordinación de la AO4, con los prompts exactos de cada code review, qué se validó en cada uno, y los obstáculos encontrados.)*
