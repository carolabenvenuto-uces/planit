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

Se utilizará **Claude (Anthropic)** para los code reviews, con acceso de lectura al repositorio (diffs, commits, archivos completos) y la consigna de la AO4 como contexto. La consigna de la AO4 pide GitHub Copilot Agent Mode como herramienta obligatoria; este cambio de herramienta ya se había consultado con el docente durante la AO3 (igual que se documentó en su momento en `docs/03-specs/actividad-obligatoria-3/spec-devops.md`, sección de obstáculos, y se validó en la review de la PR #81 de esa entrega) y se mantiene el mismo criterio para la AO4: las revisiones con GitHub Copilot Agent Mode resultaron incompletas en la AO3 (no analizaba todos los archivos del diff ni detectaba discrepancias con la consigna), mientras que las revisiones con Claude sí detectaron los bloqueantes reales. Cada resultado se contrasta manualmente contra el repositorio antes de publicarse como review en GitHub.

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

> Este checklist se conserva tal como se escribió el 18/11 (commit `b102a5d`), como registro del plan inicial. El cumplimiento real de cada ítem, con su evidencia, se registra en el **Checklist de cierre** de MOMENTO 2 — mismo criterio que se usó en `spec-devops.md` de la AO3.

---

## MOMENTO 2: Evidencia de Cierre (AL FINALIZAR)

*(Sección en construcción: se completa íntegramente al cerrar la coordinación de la AO4. Los code reviews se documentan a medida que se publican, con el prompt utilizado cuando corresponde, qué se validó y los hallazgos. El resto — Kanban, limpieza de ramas, GitHub Pages, tag/release, obstáculos generales — se completa al final.)*

### Correcciones de la revisión docente de la AO3 (RC1 a RC16) y backport

Antes de empezar la coordinación propia de la AO4, quedaban pendientes las correcciones (RC1 a RC16) que el docente marcó sobre la entrega de la AO3, aplicadas sobre `release/tercera-entrega` el 10/11, y el backport de esa release hacia `develop` el 11/11 — ambas tareas previas a la creación de este spec (ver "Obstáculos" más abajo, sobre el orden real de los commits).

| RC | Descripción | Rama | PR |
|---|---|---|---|
| RC1 | Documentar plan de eliminación de `componentes-bootstrap.js` (reapertura Issue #68) | `fix/rc1-issue-68-reapertura` | [#83](https://github.com/carolabenvenuto-uces/planit/pull/83) |
| RC2 | Documentar discrepancias de coherencia diagrama-JS por flujo | `fix/rc2-checklist-coherencia-diagramas` | [#84](https://github.com/carolabenvenuto-uces/planit/pull/84) |
| RC3 | Actualizar tabla de trazabilidad con nombres reales de suites/specs | `fix/rc3-trazabilidad-nombres-tests` | [#85](https://github.com/carolabenvenuto-uces/planit/pull/85) |
| RC4 | Alinear diagrama de presupuesto con `calcularSubtotalItem` | `fix/rc4-diagrama-subtotal-item` | [#86](https://github.com/carolabenvenuto-uces/planit/pull/86) |
| RC5 | Documentar fórmula y límites evaluados de `calcularSubtotalItem` | `fix/rc5-documentar-formula-subtotal` | [#87](https://github.com/carolabenvenuto-uces/planit/pull/87) |
| RC6 | Eliminar conteo manual duplicado en diagrama de invitados | `fix/rc6-diagrama-contar-asistencia` | [#88](https://github.com/carolabenvenuto-uces/planit/pull/88) |
| RC7 | Documentar `contarAsistencia` como fuente única de verdad del conteo | `fix/rc7-unificar-fuente-verdad-conteo` | [#89](https://github.com/carolabenvenuto-uces/planit/pull/89) |
| RC14 | Documentar diferimiento de fecha/ubicación/tipo Corporativo a la AO4 | `fix/rc14-alcance-fecha-ubicacion` | [#90](https://github.com/carolabenvenuto-uces/planit/pull/90) |
| RC15 | Documentar diferimiento de email/contacto y mesa a la AO4 | `fix/rc15-alcance-contacto-mesa` | [#91](https://github.com/carolabenvenuto-uces/planit/pull/91) |
| RC16 | Documentar exclusión/diferimiento del estado Declinado a la AO4 | `fix/rc16-alcance-estado-declinado` | [#92](https://github.com/carolabenvenuto-uces/planit/pull/92) |
| RC2 (cierre) | Marcar checklist de coherencia de diseño como completado | `fix/rc2-checkbox-coherencia-completado` | [#93](https://github.com/carolabenvenuto-uces/planit/pull/93) |
| RC8 | Tests de integración para `flujoCrearEvento` con `spyOn(prompt/alert)` | `fix/rc8-tests-flujo-crear-evento` | [#94](https://github.com/carolabenvenuto-uces/planit/pull/94) |
| RC9 | Tests de integración para `flujoCalcularPresupuesto` | `fix/rc9-tests-flujo-presupuesto` | [#95](https://github.com/carolabenvenuto-uces/planit/pull/95) |
| RC10 | Tests de integración para `flujoBuscarEnCatalogo` | `fix/rc10-tests-flujo-buscar-catalogo` | [#96](https://github.com/carolabenvenuto-uces/planit/pull/96) |
| RC11 | Tests de integración para `flujoGestionarInvitados` | `fix/rc11-tests-flujo-invitados` | [#97](https://github.com/carolabenvenuto-uces/planit/pull/97) |
| RC12 | Tests de `iniciarMenuPrincipal` despachando los 4 flujos | `fix/rc12-tests-menu-principal` | [#98](https://github.com/carolabenvenuto-uces/planit/pull/98) |
| RC13 | Tests de helpers y cobertura documentada con comando reproducible | `fix/rc13-tests-helpers-cobertura` | [#99](https://github.com/carolabenvenuto-uces/planit/pull/99) |

Las 17 PRs (#83 a #99) se mergearon contra `release/tercera-entrega` el 10/11. Con las RC resueltas, la release se integró a `master` mediante la PR [#82](https://github.com/carolabenvenuto-uces/planit/pull/82) (revisada y aprobada por el docente, @MVelasquez98, directamente en GitHub: una ronda de `CHANGES_REQUESTED`, una de `COMMENTED` y la `APPROVED` final) y se taggeó `v1.1-tercera-entrega`. El mismo día se hizo el backport de esas correcciones hacia `develop` con la PR [#100](https://github.com/carolabenvenuto-uces/planit/pull/100) (`backport/release-tercera-entrega` → `develop`, aprobada por @carolabenvenuto-uces), dejando a `develop` como base limpia para empezar la AO4.

### Code reviews realizados

#### Review — PR #102 (Dev POO)
- **Prompt utilizado:** esta review se ejecutó de forma conversacional con el asistente, sin un prompt único redactado por escrito de antemano (mismo caso que la ronda 1 de la PR #104, más abajo); a partir de la ronda 2 de la #104 se documenta el prompt exacto antes de ejecutar cada revisión.
- **Veredicto:** `APPROVE`.
- **Qué se validó:** las 8 clases de `js/models/` contra el diagrama de clases aprobado, presencia de `toJSON()`/`static fromJSON()` en cada una (requisito para la serialización de `feature/dev-storage`), y corrida de los tests existentes antes de aprobar.

#### Review 1/3 — PR #104 (Eventos + DOM), ronda 1
- **Prompt utilizado:** conversacional, sin prompt único por escrito (ver nota de la review de PR #102).
- **Primer veredicto publicado (erróneo):** `APPROVE` ([review](https://github.com/carolabenvenuto-uces/planit/pull/104#pullrequestreview-5963759488), 18/11 19:40). Se documentó el desacople de contrato de `escribirEnAlmacenamiento()` como "punto de coordinación, no bloqueante", criterio que se revisó 5 minutos después por ser incorrecto: un fallo real de guardado queda sin avisar y el resultado mostrado al usuario (`"Evento guardado"`) es incorrecto, no un detalle de estilo.
- **Veredicto corregido:** `CHANGES_REQUESTED` ([review](https://github.com/carolabenvenuto-uces/planit/pull/104#pullrequestreview-5963829744), 18/11 19:45).
- **Hallazgo:** `js/script.js`, función `escribirEnAlmacenamiento()` (línea ~210 en el estado de la PR en ese momento; `js/script.js:214` en el estado final en `develop`) — asumía que `Almacenamiento.guardar()` lanza una excepción en caso de fallo, y la implementación real de `Almacenamiento.guardar()` en `feature/dev-storage` nunca lanza: devuelve `boolean`. Un fallo de guardado real pasaría inadvertido para la usuaria.

#### Review 2/3 — PR #104 (Eventos + DOM), ronda 2
- **Prompt utilizado:**
  ```text
  Actuás como Coordinador/DevOps de PlanIT haciendo code review de la PR #104 (feature/dev-eventos-dom →
  develop, autora: Valeria Silva). En la ronda anterior se publicó CHANGES_REQUESTED por un desacople de
  contrato entre escribirEnAlmacenamiento() y Almacenamiento.guardar() (ronda 1). Valeria pusheó el commit
  fb04e75 como corrección.

  Tareas:
  1. Leer el diff exacto de fb04e75 sobre js/script.js y confirmar que escribirEnAlmacenamiento() ahora
     respeta el contrato real de Almacenamiento.guardar() (devuelve boolean, nunca lanza), en lugar de asumir
     que lanza una excepción.
  2. Verificar el fix empíricamente, no solo por lectura de código: integrar feature/dev-storage sobre
     feature/dev-eventos-dom actualizado, cargar el index.html real en un navegador headless, y forzar el
     caso de fallo (Almacenamiento.guardar devolviendo false) para confirmar que el aviso global se muestra
     correctamente, y el caso normal para confirmar que no aparecen avisos espurios.
  3. Dado que ya están integradas las clases de js/models/ (PR #102, mergeada), revisar si el controlador de
     la PR #104 tiene algún otro defecto de integración con esas clases, más allá del ya corregido. Priorizar
     flujos de uso real (alta/baja/edición de invitados, búsqueda de catálogo) sobre lectura superficial del
     diff.
  4. Si se encuentra un defecto nuevo, reproducirlo de punta a punta contra el index.html real (no mockear
     ListaInvitados ni el DOM) antes de reportarlo, y proponer una corrección concreta.
  5. Redactar el resultado como un GitHub Pull Request Review: si el fix de la ronda 1 es correcto pero
     aparece un defecto nuevo igual de concreto, el veredicto es REQUEST_CHANGES (no APPROVE todavía),
     documentando ambas cosas: qué se validó del fix anterior y el detalle completo del nuevo hallazgo
     (ubicación, causa raíz, reproducción, impacto, sugerencia de fix).
  ```
- **Veredicto:** `CHANGES_REQUESTED` ([review publicada](https://github.com/carolabenvenuto-uces/planit/pull/104#pullrequestreview-5967498077)).
- **Qué se validó:** el fix del commit `fb04e75` es correcto — se comprobó con Playwright sobre el `index.html` real (integrado con `feature/dev-storage`), forzando `Almacenamiento.guardar` a devolver `false` y confirmando que el aviso global se muestra, y que el caso normal no genera avisos espurios.
- **Hallazgo nuevo:** `js/script.js`, funciones `manejarAccionInvitado()` (línea ~872) y `buscarInvitado()` (línea ~917 en el estado final) — resolvían al invitado por `data-nombre`/nombre en lugar de por un identificador estable, y `ListaInvitados.eliminar()` (PR #102) siempre afecta a la primera coincidencia por nombre. Reproducido con Playwright: al agregar dos invitados "Juan Perez" (uno Pendiente, otro Confirmado) y eliminar la fila "Confirmado", se elimina el invitado equivocado.
- **Progreso hacia el mínimo de la consigna:** 2/4 code reviews con `CHANGES_REQUESTED` documentados.

#### Review 3/4 — PR #104 (Eventos + DOM), ronda 3
- **Prompt utilizado:**
  ```text
  Actuás como Coordinador/DevOps de PlanIT haciendo code review de la PR #104. En la ronda anterior se
  publicó CHANGES_REQUESTED por una mezcla de invitados con nombre duplicado (resolución por nombre en lugar
  de por posición/id). Valeria pusheó el commit 5479820 como corrección.

  Tareas:
  1. Leer el diff exacto de 5479820 y confirmar que las acciones de la tabla de invitados (confirmar, marcar
     pendiente, eliminar) ahora se resuelven por data-indice (posición en lista.invitados) en vez de por
     nombre, y que eliminarInvitadoPorIndice() reconstruye la lista correctamente dado que
     ListaInvitados.eliminar(nombre) solo borra la primera coincidencia.
  2. Verificar el fix empíricamente con Playwright sobre el index.html real: agregar varios invitados con
     nombres duplicados en distintas posiciones, aplicar una acción sobre una posición específica y confirmar
     que las demás posiciones (incluida la del mismo nombre) no se ven afectadas, y que tras eliminar una
     posición el resto se reindexa preservando orden y estado.
  3. Correr la suite existente (js/test/run-jasmine.js) sobre la integración y confirmar que no hay
     regresiones nuevas más allá de las specs legacy ya conocidas (pendientes del refactor de script.spec.js
     de Tester QA).
  4. Revisar si queda algún otro defecto de integración entre el controlador de la PR #104 y las clases de
     js/models/ (PR #102, ya mergeada), más allá de los dos ya corregidos, priorizando flujos de uso real
     sobre lectura superficial del diff.
  5. Si se encuentra un defecto nuevo, reproducirlo de punta a punta contra el index.html real antes de
     reportarlo, y proponer una corrección concreta. Redactar el resultado como GitHub Pull Request Review:
     REQUEST_CHANGES si aparece un hallazgo igual de concreto que el de las rondas anteriores (documentando
     también la validación del fix previo), o APPROVE si no se encuentra ninguno.
  ```
- **Veredicto:** `CHANGES_REQUESTED` ([review publicada](https://github.com/carolabenvenuto-uces/planit/pull/104#pullrequestreview-6007620609)).
- **Qué se validó:** el fix del commit `5479820` es correcto — verificado con Playwright con tres invitados incluyendo dos "Juan Perez" en distintas posiciones: marcar pendiente una posición específica no afecta a la otra con el mismo nombre, y eliminar una posición reindexa correctamente al resto. Sin regresiones nuevas en la suite existente.
- **Hallazgo nuevo:** `js/script.js`, función `obtenerResultadosCatalogo()` (línea ~746 en el estado final) — el filtro por categoría del catálogo reutiliza `Proveedor.coincideCon()` (pensado para búsqueda libre por nombre o categoría) en lugar de comparar `categoria` por igualdad exacta. No se manifiesta con los 3 proveedores fijos del mockup, pero es un defecto real y reproducible en un catálogo extensible (requisito explícito de la consigna): se probó agregando un 4° proveedor hipotético ("Catering Beats Sonido Movil", categoría real "Sonido"), que aparece incorrectamente al filtrar por categoría "Catering".
- **Progreso hacia el mínimo de la consigna:** 3/4 code reviews con `CHANGES_REQUESTED` documentados.

#### Review 4/4 — PR #104 (Eventos + DOM), ronda final: `APPROVE`
- **Prompt utilizado:** conversacional, sin prompt único por escrito (misma situación que la review de PR #102 y la ronda 1): se le pidió al asistente repasar el resto del controlador buscando algún defecto adicional de severidad comparable a los ya corregidos, sin acotar a una función en particular.
- **Veredicto:** `APPROVE` ([review publicada](https://github.com/carolabenvenuto-uces/planit/pull/104#pullrequestreview-6009356946)).
- **Qué se validó:** el fix del commit `64f3ccc` (filtro de categoría del catálogo) es correcto — verificado con Playwright: el caso que antes fallaba ya no se reproduce, el filtro real de la UI por categoría sigue funcionando, y la búsqueda libre por texto no tuvo regresiones. La suite existente mantiene las mismas 73 fallas legacy ya conocidas, sin fallas nuevas.
- **Revisión de cierre:** se repasó el resto del controlador (flujo de evento, presupuesto, persistencia) buscando algún defecto adicional de severidad comparable a los ya corregidos; no se encontró ninguno. Se decidió no forzar un 4° `CHANGES_REQUESTED` artificial sobre PR #104 solo para completar el número: la consigna califica el mínimo con "si corresponde", y los 3 hallazgos ya documentados (rondas 1 a 3) son genuinos y están resueltos.
- **Progreso final hacia el mínimo de la consigna:** 3 de los 4 `CHANGES_REQUESTED` recomendados, sobre PRs de otros integrantes (más esta aprobación final). Cumplido parcialmente y justificado — ver "Checklist de cierre" más abajo.

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

#### PR #114 (`feature/coord-devops-cuarta-entrega`, esta misma PR)
- **Revisora:** @carolabenvenuto-uces. **Primera ronda:** `CHANGES_REQUESTED` — 6 bloqueantes: el checklist del MOMENTO 1 se modificó después de escrito en lugar de conservarse como plan original; el ítem de orden del spec no reflejaba que `b102a5d` (18/11) es posterior a las 17 correcciones de la AO3 (10/11) y al backport #100 (11/11); el MOMENTO 2 no documentaba esas correcciones ni el backport; los prompts de las rondas 2 y 3 estaban citados en vez de en bloque de código y faltaban los de la review de PR #102, la ronda 1 y la ronda final; los hallazgos no citaban archivo ni línea; el ítem de "al menos 4 code reviews" estaba tildado sin aclarar que son 3 de 4; no estaba documentado el primer `APPROVE` erróneo de la ronda 1 de PR #104 (corregido 5 minutos después); y el título de la PR no coincidía literalmente con la entrada del changelog. Más mejoras no bloqueantes: obstáculos a documentar antes del cierre, aclarar que el cambio de herramienta de IA se consultó con el docente, corregir la mención de Playwright MCP en el README, usar el template de PR y asignar la issue #105.
  - Se restauró el checklist del MOMENTO 1 a su versión original (`b102a5d`), se agregó esta misma sección de "Checklist de cierre" en MOMENTO 2 con el estado real de cada ítem, se documentaron las 17 correcciones de la AO3 (RC1-RC16) y el backport #100, se pasaron los prompts faltantes a bloque de código (agregando los de PR #102, ronda 1 y ronda final, todos conversacionales), se agregó archivo y línea a cada hallazgo, se documentó el `APPROVE` erróneo de la ronda 1, y se unificó el título de la PR con el changelog.
  - Se aplicaron las mejoras no bloqueantes: sección "Obstáculos" agregada (más abajo), justificación de la herramienta de IA aclarada, README corregido, PR pasada al template de feature, issue #105 asignada a @FacundoGuiraldes.
  - **Segunda ronda:** pendiente.

Con esto, las 3 PRs de dominio de la AO4 (POO, Eventos+DOM, Storage), el fix de Issue #68 y la suite de Tester QA están mergeadas a `develop` con revisión cruzada completa entre los 3 integrantes.

### Tablero Kanban (GitHub Projects)

[PlanIT - Actividad Obligatoria N° 4](https://github.com/users/FacundoGuiraldes/projects/3) (público), con las 15 issues/PRs de la AO4 (#68, #101 a #114). Se creó con la API de GraphQL de Projects v2, a diferencia del tablero de la AO3 ([PlanIT - Actividad Obligatoria N° 3](https://github.com/users/carolabenvenuto-uces/projects/2)), que se armó manualmente desde la interfaz. Por la misma restricción de GitHub que impide vincular un proyecto a un repositorio de otro dueño (ya aplicada también al tablero de la AO3, que tampoco quedó enlazado al repo), este tablero no aparece en la pestaña "Projects" de `planit`, pero cada ítem apunta al issue/PR real del repositorio. Estado: `Done` en todo lo ya mergeado/cerrado; `In Progress` en #105 y #114 mientras se resuelve esta ronda de review.

### Obstáculos

- **Orden real del spec respecto de la primera tarea de coordinación.** El ítem del checklist dice que `spec-devops.md` se commiteó "antes de cualquier otra tarea de coordinación de la AO4", y es cierto respecto de las tareas propias de la AO4 (reviews de PR #102/#104, integración, Kanban, README), pero el commit `b102a5d` es del 18/11, posterior a las 17 correcciones de la revisión docente de la AO3 (#83-#99, 10/11) y al backport #100 (11/11) — tareas que, cronológicamente, son anteriores. No se reescribió el historial para "corregir" esto: se documenta acá como está, y el ítem del checklist se entiende acotado a la coordinación específica de la AO4 (ver tabla de correcciones más arriba).
- **Conteo de code reviews con `CHANGES_REQUESTED`.** La consigna pide "al menos 4"; se documentaron 3 (rondas 1 a 3 sobre PR #104), con la decisión explícita de no forzar un 4° hallazgo artificial en la ronda final. Es un cumplimiento parcial y justificado, no total.
- **`APPROVE` erróneo en la ronda 1 de PR #104.** La primera review publicada aprobó la PR tratando el desacople de contrato de `escribirEnAlmacenamiento()` como "no bloqueante"; 5 minutos después se corrigió el criterio a `CHANGES_REQUESTED` al reconocer que el resultado mostrado al usuario era incorrecto, no solo un detalle de estilo. Mismo tipo de situación que el approve erróneo de Copilot documentado en el cierre de la AO3: se deja registrado en vez de omitir la primera review.
- **Tablero Kanban en una cuenta personal, sin vínculo al repositorio.** GitHub Projects v2 solo permite `linkProjectV2ToRepository` cuando el proyecto pertenece al mismo dueño que el repositorio (`carolabenvenuto-uces`); este token opera como `@FacundoGuiraldes`, así que el tablero quedó creado en `github.com/users/FacundoGuiraldes/projects/3`, público pero no enlazado a la pestaña "Projects" de `planit`. Mismo límite que ya existía en el tablero de la AO3 (propiedad de `@carolabenvenuto-uces`, tampoco enlazado).
- **Capturas de testing sin Playwright MCP.** Documentado en detalle en `spec-tester-qa.md` y `js/test/testing-doc.md`: las capturas de la AO4 se generaron con la librería `playwright` (`js/test/take-screenshots.js`), no con el servidor MCP interactivo, que no estaba conectado en la sesión donde se escribió esa suite.

### Checklist de cierre (MOMENTO 2)

- [x] `spec-devops.md` creado y commiteado antes de la coordinación propia de la AO4 (ver "Obstáculos" sobre el orden real respecto de las correcciones de la AO3).
- [x] PR #102 (Dev POO) revisada y mergeada.
- [x] PR #104 (Eventos + DOM) revisada y mergeada, tras actualizarse con `develop`.
- [x] PR #108 (`feature/dev-storage`) integrada.
- [x] PR #110 (`feature/tester-qa-specs`) integrada.
- [x] Al menos 4 code reviews con `CHANGES_REQUESTED` documentados (si corresponde) — cumplido parcialmente: 3/4 sobre PR #104 (ver "Obstáculos"), más la review recíproca de @ValeriaMSilva sobre la PR #108 de este responsable.
- [x] Tablero Kanban en GitHub Projects administrado con las issues de la AO4: [PlanIT - Actividad Obligatoria N° 4](https://github.com/users/FacundoGuiraldes/projects/3) (15 ítems: #68, #101-#114).
- [x] Seguimiento del Issue [#68](https://github.com/carolabenvenuto-uces/planit/issues/68) (deuda técnica de `js/componentes-bootstrap.js`) — resuelto en PR #109, issue cerrada.
- [x] `README.md` actualizado con información de la cuarta entrega.
- [ ] GitHub Pages activo y verificado en `release/cuarta-entrega`.
- [ ] Limpieza de ramas al cierre (solo `master`, `develop`, `release/cuarta-entrega`).
- [ ] Tag `v1.2-cuarta-entrega` y GitHub Release publicados tras la aprobación del docente.
- [x] `changelog.md` actualizado con la contribución de cada integrante.

*(GitHub Pages, tag/release y limpieza de ramas: pendientes de documentar una vez mergeada esta PR, al cortar `release/cuarta-entrega`.)*
