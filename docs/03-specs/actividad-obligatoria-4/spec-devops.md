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
- [x] PR #102 (Dev POO) revisada y mergeada.
- [x] PR #104 (Eventos + DOM) revisada y mergeada, tras actualizarse con `develop`.
- [x] PR #108 (`feature/dev-storage`) integrada.
- [x] PR #110 (`feature/tester-qa-specs`) integrada.
- [x] Al menos 4 code reviews con `CHANGES_REQUESTED` documentados (si corresponde) — 3/4 sobre PRs de otros integrantes (ver MOMENTO 2), más la review recíproca de @ValeriaMSilva sobre la PR #108 de este responsable.
- [ ] Tablero Kanban en GitHub Projects administrado con las issues de la AO4 (#101, #103, #105, #106, #107, #111, #112, #113 y las que se abran).
- [x] Seguimiento del Issue [#68](https://github.com/carolabenvenuto-uces/planit/issues/68) (deuda técnica de `js/componentes-bootstrap.js`) — resuelto en PR #109, issue cerrada.
- [x] `README.md` actualizado con información de la cuarta entrega.
- [ ] GitHub Pages activo y verificado en `release/cuarta-entrega`.
- [ ] Limpieza de ramas al cierre (solo `master`, `develop`, `release/cuarta-entrega`).
- [ ] Tag `v1.2-cuarta-entrega` y GitHub Release publicados tras la aprobación del docente.
- [x] `changelog.md` actualizado con la contribución de cada integrante.

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

#### Review 3/4 — PR #104 (Eventos + DOM), ronda 3
- **Prompt utilizado:**
  > Actuás como Coordinador/DevOps de PlanIT haciendo code review de la PR #104. En la ronda anterior se publicó `CHANGES_REQUESTED` por una mezcla de invitados con nombre duplicado (resolución por nombre en lugar de por posición/id). Valeria pusheó el commit `5479820` como corrección.
  >
  > Tareas:
  > 1. Leer el diff exacto de `5479820` y confirmar que las acciones de la tabla de invitados (confirmar, marcar pendiente, eliminar) ahora se resuelven por `data-indice` (posición en `lista.invitados`) en vez de por nombre, y que `eliminarInvitadoPorIndice()` reconstruye la lista correctamente dado que `ListaInvitados.eliminar(nombre)` solo borra la primera coincidencia.
  > 2. Verificar el fix empíricamente con Playwright sobre el `index.html` real: agregar varios invitados con nombres duplicados en distintas posiciones, aplicar una acción sobre una posición específica y confirmar que las demás posiciones (incluida la del mismo nombre) no se ven afectadas, y que tras eliminar una posición el resto se reindexa preservando orden y estado.
  > 3. Correr la suite existente (`js/test/run-jasmine.js`) sobre la integración y confirmar que no hay regresiones nuevas más allá de las specs legacy ya conocidas (pendientes del refactor de `script.spec.js` de Tester QA).
  > 4. Revisar si queda algún otro defecto de integración entre el controlador de la PR #104 y las clases de `js/models/` (PR #102, ya mergeada), más allá de los dos ya corregidos, priorizando flujos de uso real sobre lectura superficial del diff.
  > 5. Si se encuentra un defecto nuevo, reproducirlo de punta a punta contra el `index.html` real antes de reportarlo, y proponer una corrección concreta. Redactar el resultado como GitHub Pull Request Review: `REQUEST_CHANGES` si aparece un hallazgo igual de concreto que el de las rondas anteriores (documentando también la validación del fix previo), o `APPROVE` si no se encuentra ninguno.
- **Veredicto:** `CHANGES_REQUESTED` ([review publicada](https://github.com/carolabenvenuto-uces/planit/pull/104#pullrequestreview-6007620609)).
- **Qué se validó:** el fix del commit `5479820` es correcto — verificado con Playwright con tres invitados incluyendo dos "Juan Perez" en distintas posiciones: marcar pendiente una posición específica no afecta a la otra con el mismo nombre, y eliminar una posición reindexa correctamente al resto. Sin regresiones nuevas en la suite existente.
- **Hallazgo nuevo:** el filtro por categoría del catálogo (`obtenerResultadosCatalogo()`) reutiliza `Proveedor.coincideCon()` (pensado para búsqueda libre por nombre o categoría) en lugar de comparar `categoria` por igualdad exacta. No se manifiesta con los 3 proveedores fijos del mockup, pero es un defecto real y reproducible en un catálogo extensible (requisito explícito de la consigna): se probó agregando un 4° proveedor hipotético ("Catering Beats Sonido Movil", categoría real "Sonido"), que aparece incorrectamente al filtrar por categoría "Catering".
- **Progreso hacia el mínimo de la consigna:** 3/4 code reviews con `CHANGES_REQUESTED` documentados.

#### Review 4/4 — PR #104 (Eventos + DOM), ronda final: `APPROVE`
- **Veredicto:** `APPROVE` ([review publicada](https://github.com/carolabenvenuto-uces/planit/pull/104#pullrequestreview-6009356946)).
- **Qué se validó:** el fix del commit `64f3ccc` (filtro de categoría del catálogo) es correcto — verificado con Playwright: el caso que antes fallaba ya no se reproduce, el filtro real de la UI por categoría sigue funcionando, y la búsqueda libre por texto no tuvo regresiones. La suite existente mantiene las mismas 73 fallas legacy ya conocidas, sin fallas nuevas.
- **Revisión de cierre:** se repasó el resto del controlador (flujo de evento, presupuesto, persistencia) buscando algún defecto adicional de severidad comparable a los ya corregidos; no se encontró ninguno. Se decidió no forzar un 4° `CHANGES_REQUESTED` artificial sobre PR #104 solo para completar el número: la consigna califica el mínimo con "si corresponde", y los 3 hallazgos ya documentados (rondas 1 a 3) son genuinos y están resueltos.
- **Progreso final hacia el mínimo de la consigna:** 3/4 code reviews con `CHANGES_REQUESTED` documentados sobre PRs de otros integrantes (más esta aprobación final).

#### Hallazgo adicional (autodetectado, fuera del conteo de PR #104)
Durante la revisión de la ronda 3 se encontró un bug real en **`feature/dev-storage`** (PR #108, de este mismo responsable, no de Valeria): `storage.js` ruteaba `planit:detalles-evento` (fecha y ubicación reales del evento) a `sessionStorage`, bajo el supuesto erróneo de que era estado efímero de UI. Verificado con Playwright: tras simular un reinicio de navegador, fecha y ubicación volvían al valor del mockup mientras el resto del evento persistía correctamente. Corregido en el commit `92d5e1a` de `feature/dev-storage` (se vació `CLAVES_SESSION`, ruteando esa clave a `localStorage` como el resto) y se actualizó `storage-doc.md`. No se cuenta como ronda de `CHANGES_REQUESTED` porque el defecto es autoría propia, no de "otro integrante"; se documenta aquí como evidencia de QA rigurosa sobre el propio trabajo.

### Reviews recibidas sobre PRs de este responsable (requisito transversal)

GitHub no permite aprobar/solicitar cambios sobre la propia PR, así que las PRs de Storage y del fix de Issue #68 (ambas de este responsable) necesitaron la revisión de otro integrante para cumplir el requisito transversal ("revisión y aprobación de otro integrante antes del merge").

#### PR #109 (fix Issue #68: migrar Modal/Toast a `js/script.js`)
- **Revisora:** @ValeriaMSilva. **Veredicto:** `APPROVE`. Mergeada a `develop`; Issue #68 cerrada definitivamente.

#### PR #108 (`feature/dev-storage`)
- **Revisora:** @ValeriaMSilva. **Primera ronda:** `CHANGES_REQUESTED` — pidió completar el MOMENTO 2 del spec, alinear la tabla de estrategia de storage con la implementación real, documentar el uso (hoy nulo) de `sessionStorage`, y sugirió 4 mejoras no bloqueantes de robustez en `storage.js` (`guardar(undefined)`, `eliminar` en ambos storages, `listar`/`limpiar`). Se aplicaron las 3 bloqueantes y las 4 no bloqueantes (detalle en `spec-dev-storage.md`, MOMENTO 2, y en `storage-doc.md`). **Segunda ronda:** `APPROVE`. Mergeada a `develop`; Issue #107 cerrada.

#### PR #110 (`feature/tester-qa-specs`)
- **Revisora:** @carolabenvenuto-uces. **Primera ronda:** `CHANGES_REQUESTED` — 5 bloqueantes: faltaban capturas de pantalla de la AO4 (las commiteadas eran de la AO3), el prompt estaba citado en vez de en bloque de código, los 3 bugs reales de PR #104 no estaban reportados como issues de GitHub (solo documentados en el code review), la descripción de la PR no usaba `Closes #106`, y la entrada del changelog no coincidía con el título de la PR. Más 4 mejoras no bloqueantes: justificación de la herramienta de IA remitía a este mismo spec (todavía no mergeado en ese momento), el fragmento generado tenía un `// ...` en vez de código textual, la tabla de cobertura por tipo tenía números aproximados que no sumaban el total real, y faltaba un test de storage lleno (`QuotaExceededError`), que la propia revisora redactó como sugerencia.
  - Se resolvieron los 5 bloqueantes: capturas reales generadas con la librería Playwright (`js/test/take-screenshots.js`, sin servidor MCP interactivo — no estaba conectado en esta sesión, salvedad documentada en `testing-doc.md`); prompt a bloque de código; los 3 bugs de PR #104 reportados como issues cerradas ([#111](https://github.com/carolabenvenuto-uces/planit/issues/111), [#112](https://github.com/carolabenvenuto-uces/planit/issues/112), [#113](https://github.com/carolabenvenuto-uces/planit/issues/113), asignadas a @ValeriaMSilva, referenciando su commit de fix); título de la PR y entrada de changelog unificados, con `Closes #106`.
  - Se aplicaron las 4 mejoras no bloqueantes, incluyendo una regresión nueva para el bug de `escribirEnAlmacenamiento` (issue #111, no tenía test de regresión todavía) y el test de storage lleno sugerido. La suite quedó en 111 specs (71 + 19 + 21).
  - **Segunda ronda:** `APPROVE`, con una observación no bloqueante (capturas con la librería Playwright en vez del servidor MCP; la revisora sugirió retomarlo antes de la release si se quiere cubrir ese punto de la consigna al 100%). Mergeada a `develop`; Issue #106 cerrada.

Con esto, las 3 PRs de dominio de la AO4 (POO, Eventos+DOM, Storage), el fix de Issue #68 y la suite de Tester QA están mergeadas a `develop` con revisión cruzada completa entre los 3 integrantes.

*(Resto de los ítems del checklist de MOMENTO 1 — Kanban, GitHub Pages, tag/release, limpieza de ramas: pendientes de documentar al cerrar.)*
