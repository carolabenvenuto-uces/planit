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

El checklist de MOMENTO 1 se conserva tal como se escribió el 18/11 (commit `b102a5d`), como registro del plan inicial. El cumplimiento real de cada ítem, con su evidencia, se registra en el **Checklist de cierre** de esta sección — mismo criterio que se usó en `spec-devops.md` de la AO3. Sobre la herramienta de IA (MOMENTO 1, sección 3): el cambio de GitHub Copilot Agent Mode (obligatorio según la consigna de la AO4) a Claude ya se había consultado con el docente durante la AO3 (documentado en `docs/03-specs/actividad-obligatoria-3/spec-devops.md`, sección de obstáculos, y validado en la review de la PR #81 de esa entrega) y se mantiene el mismo criterio para la AO4.

*(Al momento de este commit solo quedan pendientes los ítems posteriores al merge de esta PR: GitHub Pages, release y limpieza de ramas, que dependen de cortar `release/cuarta-entrega` desde `develop` una vez integrada.)*

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

> **Atención de la observación docente RC1 (AO4).** Esta sección se reestructuró para que la evidencia de cierre permita acreditar las reviews exigidas sin ambigüedad. Se separan dos categorías que en la versión anterior aparecían mezcladas:
>
> - **Review formal de GitHub:** acción *Submit review* publicada por @FacundoGuiraldes (Coordinador/DevOps) sobre la PR de **otro integrante**, con veredicto estructurado (`APPROVE` o `REQUEST_CHANGES`), asociada a un commit concreto y con un identificador público `pullrequestreview-<id>`. **Solo estas acciones cuentan para el mínimo de la consigna.**
> - **Intercambio conversacional de soporte:** sesiones de trabajo con el asistente de IA, comentarios en hilos de PR, coordinación de contratos entre módulos y respuestas a reviews recibidas. Se documentan como contexto, pero **no se cuentan** como reviews.
>
> El criterio completo y el detalle de lo que se excluye están en "Diferenciación metodológica", más abajo.

#### Resumen de acreditación

| # | PR auditada (autora) | Rama auditada | Veredicto formal | Fecha | Commit analizado | Review en GitHub | Resolución |
|---|---|---|---|---|---|---|---|
| RF-1 | [#102](https://github.com/carolabenvenuto-uces/planit/pull/102) Dev JS POO (@carolabenvenuto-uces) | `feature/dev-poo-logica-negocio` | `APPROVE` | 18/11/2026 | `c993784` | [5950493441](https://github.com/carolabenvenuto-uces/planit/pull/102#pullrequestreview-5950493441) | Sin cambios bloqueantes. Merge `b65cd94` |
| RF-2 | [#104](https://github.com/carolabenvenuto-uces/planit/pull/104) Dev JS Eventos + DOM (@ValeriaMSilva), ronda 1 | `feature/dev-eventos-dom` | `REQUEST_CHANGES` | 18/11/2026 | `6a70cb4` | [5963829744](https://github.com/carolabenvenuto-uces/planit/pull/104#pullrequestreview-5963829744) | Fix `fb04e75` |
| RF-3 | #104, ronda 2 | `feature/dev-eventos-dom` | `REQUEST_CHANGES` | 19/11/2026 | `fb04e75` | [5967498077](https://github.com/carolabenvenuto-uces/planit/pull/104#pullrequestreview-5967498077) | Fix `5479820` |
| RF-4 | #104, ronda 3 | `feature/dev-eventos-dom` | `REQUEST_CHANGES` | 21/11/2026 | `5479820` | [6007620609](https://github.com/carolabenvenuto-uces/planit/pull/104#pullrequestreview-6007620609) | Fix `64f3ccc` |
| RF-5 | #104, ronda final | `feature/dev-eventos-dom` | `APPROVE` | 22/11/2026 | `64f3ccc` | [6009356946](https://github.com/carolabenvenuto-uces/planit/pull/104#pullrequestreview-6009356946) | Merge `aea6dc8` |

**Resultado:** el Coordinador/DevOps publicó **5 reviews formales** sobre PRs de otros integrantes (mínimo exigido: 4). De ellas, **3 son `REQUEST_CHANGES`** con un defecto real, reproducido y resuelto en un commit identificado (RF-2, RF-3 y RF-4). Las otras 2 son `APPROVE`. RF-1 cierra la PR de POO y RF-5 cierra el ciclo de la PR de Eventos + DOM.

Además existe una sexta acción formal: el `APPROVE` [5963759488](https://github.com/carolabenvenuto-uces/planit/pull/104#pullrequestreview-5963759488) del 18/11 sobre `6a70cb4`. RF-2 lo reemplazó 5 minutos después, así que **no se computa**. Se deja registrado por transparencia (ver "Obstáculos").

**Por qué las PRs #108 y #110 no figuran como reviews de este rol.** La PR [#108](https://github.com/carolabenvenuto-uces/planit/pull/108) (Dev JS Storage, `feature/dev-storage`) y la PR [#110](https://github.com/carolabenvenuto-uces/planit/pull/110) (Tester QA, `feature/tester-qa-specs`, que cierra la issue [#106](https://github.com/carolabenvenuto-uces/planit/issues/106)) son de autoría de este mismo responsable, porque en un grupo de 3 integrantes el rol absorbe esas tareas. GitHub no permite aprobar ni pedir cambios sobre una PR propia. Por eso las reviews formales de esas PRs las hicieron otras integrantes: @ValeriaMSilva en la #108 y @carolabenvenuto-uces en la #110. Se documentan en "Reviews recibidas sobre PRs de este responsable" y no se cuentan para el mínimo de este rol.

**Sobre los prompts.** Un prompt se considera **verificable** cuando su texto exacto quedó registrado en este spec al ejecutar la review. Eso se cumple para RF-3 y RF-4. RF-1, RF-2 y RF-5 se condujeron en sesiones conversacionales con Claude, sin un prompt único redactado de antemano. No se reconstruye un texto a posteriori para presentarlo como prompt original. En esos casos se documenta la instrucción efectivamente dada y se remite al cuerpo de la review publicada, que es la evidencia verificable del análisis. Herramienta: Claude (Anthropic), con lectura del repositorio y la consigna de la AO4 como contexto (ver MOMENTO 1, sección 3).

#### RF-1 — PR #102 (Desarrolladora JS POO: modelos y clases de negocio)

- **Pull Request y rama auditada:** [#102](https://github.com/carolabenvenuto-uces/planit/pull/102), "[DEV POO] Clases del dominio en js/models/ y diagrama de clases - AO4". Rama `feature/dev-poo-logica-negocio` → `develop`.
- **Veredicto formal en GitHub:** `APPROVE`, 18/11/2026, única ronda, sobre el commit `c993784` ([review 5950493441](https://github.com/carolabenvenuto-uces/planit/pull/102#pullrequestreview-5950493441)).
- **Prompt utilizado:** sesión conversacional, sin prompt único por escrito (registro textual no disponible). La instrucción dada al asistente fue auditar las 8 clases de `js/models/` contra el diagrama de clases y la consigna de la AO4, y correr la suite existente antes de emitir veredicto.
- **Criterio validado / resultado técnico:**
  - Las 8 clases de `js/models/` coinciden con el diagrama de clases aprobado (`diagrama-clases-doc.md`).
  - Encapsulamiento del estado en cada clase.
  - Búsqueda de opciones centralizada en `Validador` (commit `47a592e`).
  - Cada clase expone `toJSON()` y `static fromJSON()`, requisito para la serialización de `feature/dev-storage`.
  - Se revisaron los diffs de `script.js`, `index.html`, `test-runner.html` y `changelog.md`.
  - `node js/test/run-jasmine.js` se ejecutó 3 veces: 82 specs, 0 fallas.
  - Resultado registrado en la review: "Cambios bloqueantes: ninguno".
- **Estado final:** aprobada sin cambios bloqueantes. Mergeada a `develop` el 18/11/2026 (merge commit `b65cd94`).

#### RF-2 — PR #104 (Desarrolladora JS Eventos + DOM), ronda 1

- **Pull Request y rama auditada:** [#104](https://github.com/carolabenvenuto-uces/planit/pull/104), "[Dev Eventos + DOM] Refactorización de script.js como controlador, eventos y DOM para PlanIT". Rama `feature/dev-eventos-dom` → `develop`.
- **Veredicto formal en GitHub:** `REQUEST_CHANGES`, 18/11/2026 19:45, ronda 1, sobre el commit `6a70cb4` ([review 5963829744](https://github.com/carolabenvenuto-uces/planit/pull/104#pullrequestreview-5963829744)). Reemplaza al `APPROVE` erróneo publicado 5 minutos antes sobre el mismo commit ([5963759488](https://github.com/carolabenvenuto-uces/planit/pull/104#pullrequestreview-5963759488), no computado).
- **Prompt utilizado:** sesión conversacional, sin prompt único por escrito (registro textual no disponible). La instrucción dada fue verificar de punta a punta, con Playwright, los 4 flujos del controlador contra las clases reales de `js/models/` y contra `storage.js`.
- **Hallazgo principal:** `js/script.js`, función `escribirEnAlmacenamiento()`: línea ~210 en ese estado de la PR, `js/script.js:214` en el estado final de `develop`.
  - La función asumía que `Almacenamiento.guardar()` lanza una excepción cuando falla.
  - El contrato real de `storage.js` es defensivo: nunca lanza y devuelve `boolean`.
  - Consecuencia: un fallo real de guardado pasaba inadvertido y la UI mostraba "Evento guardado" igual.
  - Se pidió verificar el valor de retorno booleano.
- **Estado final y commit de resolución:** resuelto en `fb04e75`, "fix(events): alinear escribirEnAlmacenamiento con retorno booleano de Almacenamiento.guardar", validado en RF-3. Registrado como issue cerrada [#111](https://github.com/carolabenvenuto-uces/planit/issues/111).

#### RF-3 — PR #104 (Desarrolladora JS Eventos + DOM), ronda 2

- **Pull Request y rama auditada:** [#104](https://github.com/carolabenvenuto-uces/planit/pull/104), rama `feature/dev-eventos-dom` → `develop`.
- **Veredicto formal en GitHub:** `REQUEST_CHANGES`, 19/11/2026, ronda 2, sobre el commit `fb04e75` ([review 5967498077](https://github.com/carolabenvenuto-uces/planit/pull/104#pullrequestreview-5967498077)).
- **Prompt verificable utilizado:**
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
- **Validación del fix anterior:** `fb04e75` es correcto. Se comprobó con Playwright sobre el `index.html` real, integrado con `feature/dev-storage`:
  - Con `Almacenamiento.guardar` forzado a devolver `false`, se muestra el aviso global.
  - En el caso normal no aparecen avisos espurios.
- **Hallazgo principal (invitados duplicados):** `js/script.js`, funciones `manejarAccionInvitado()` (línea ~872) y `buscarInvitado()` (línea ~917 en el estado final).
  - Ambas resolvían al invitado por `data-nombre` en lugar de usar un identificador estable de fila.
  - `ListaInvitados.eliminar()` (PR #102) afecta siempre a la primera coincidencia por nombre.
  - Reproducción con Playwright: se agregan dos invitados "Juan Perez", uno Pendiente y otro Confirmado. Al eliminar la fila del Confirmado, se elimina el otro.
- **Estado final y commit de resolución:** resuelto en `5479820`, "fix(events): usar indice de fila para acciones deterministas en invitados duplicados". Las acciones ahora se resuelven por `data-indice`. Validado en RF-4. Reportado como una de las issues cerradas de los bugs de la PR #104 ([#112](https://github.com/carolabenvenuto-uces/planit/issues/112) / [#113](https://github.com/carolabenvenuto-uces/planit/issues/113)).

#### RF-4 — PR #104 (Desarrolladora JS Eventos + DOM), ronda 3

- **Pull Request y rama auditada:** [#104](https://github.com/carolabenvenuto-uces/planit/pull/104), rama `feature/dev-eventos-dom` → `develop`.
- **Veredicto formal en GitHub:** `REQUEST_CHANGES`, 21/11/2026, ronda 3, sobre el commit `5479820` ([review 6007620609](https://github.com/carolabenvenuto-uces/planit/pull/104#pullrequestreview-6007620609)).
- **Prompt verificable utilizado:**
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
- **Validación del fix anterior:** `5479820` es correcto. Se verificó con Playwright con tres invitados, dos de ellos "Juan Perez" en distintas posiciones:
  - Marcar pendiente una posición no afecta a la otra del mismo nombre.
  - Al eliminar una posición, el resto se reindexa correctamente.
  - La suite existente no muestra regresiones nuevas.
- **Hallazgo principal (filtro de catálogo):** `js/script.js`, función `obtenerResultadosCatalogo()` (línea ~746 en el estado final).
  - El filtro por categoría reutilizaba `Proveedor.coincideCon()`. Ese método está pensado para la búsqueda libre y también compara contra el nombre, en lugar de comparar `categoria` por igualdad exacta.
  - El defecto no aparece con los 3 proveedores fijos del mockup, pero se reproduce en un catálogo extensible, que la consigna exige.
  - Reproducción: se agrega el proveedor "Catering Beats Sonido Movil", de categoría "Sonido". Al filtrar por "Catering", aparece en los resultados.
- **Estado final y commit de resolución:** resuelto en `64f3ccc`, "fix(events): usar igualdad exacta en filtro de categoria del catalogo". Validado en RF-5. Reportado como una de las issues cerradas de los bugs de la PR #104 ([#112](https://github.com/carolabenvenuto-uces/planit/issues/112) / [#113](https://github.com/carolabenvenuto-uces/planit/issues/113)).

#### RF-5 — PR #104 (Desarrolladora JS Eventos + DOM), ronda final

- **Pull Request y rama auditada:** [#104](https://github.com/carolabenvenuto-uces/planit/pull/104), rama `feature/dev-eventos-dom` → `develop`.
- **Veredicto formal en GitHub:** `APPROVE`, 22/11/2026, ronda final, sobre el commit `64f3ccc` ([review 6009356946](https://github.com/carolabenvenuto-uces/planit/pull/104#pullrequestreview-6009356946), titulada "Revisión 4/4 de PR #104 — APPROVE").
- **Prompt utilizado:** sesión conversacional, sin prompt único por escrito (registro textual no disponible). La instrucción dada fue validar el fix `64f3ccc` y repasar el resto del controlador (flujo de evento, presupuesto, persistencia), buscando algún defecto adicional de severidad comparable a los ya corregidos, sin acotarse a una función en particular.
- **Criterio validado / resultado técnico:**
  - El filtro de categoría compara `proveedor.categoria` por igualdad exacta normalizada. "Catering Beats Sonido Movil" ya no aparece bajo "Catering".
  - El filtro por "Decoración" y la búsqueda libre por texto ("DJ") siguen funcionando.
  - La suite existente mantiene las mismas 73 fallas legacy ya conocidas, sin fallas nuevas. Esas fallas son las pendientes del refactor de `script.spec.js`, que se resolvió después en la PR #110.
  - En el resto del controlador no se encontraron defectos comparables. No se forzó un cuarto `REQUEST_CHANGES` artificial.
- **Estado final:** aprobada. Mergeada a `develop` el 22/11/2026 (merge commit `aea6dc8`).

#### Diferenciación metodológica: reviews formales vs. intercambios conversacionales

| Criterio | Review formal de GitHub (computa) | Intercambio conversacional de soporte (no computa) |
|---|---|---|
| Acción en GitHub | *Submit review* con veredicto `APPROVE` o `REQUEST_CHANGES` | Comentario de hilo (`issuecomment-…`), descripción de PR, mensaje de coordinación, o ninguna acción pública |
| Identificador verificable | `pullrequestreview-<id>`, más el commit analizado | Ninguno, o un `issuecomment-<id>` sin veredicto |
| Autoría de la PR | PR de otro integrante | Cualquiera, incluidas las PRs propias |
| Efecto sobre el merge | Bloquea (`REQUEST_CHANGES`) o habilita (`APPROVE`) el merge | Ninguno |
| Registros en esta entrega | RF-1 a RF-5 | Ver lista siguiente |

**Intercambios conversacionales y de soporte (documentados, no computados):**

- **Sesiones conversacionales con el asistente de IA** que precedieron a RF-1, RF-2 y RF-5. El análisis se acredita por la review publicada, no por la sesión.
- **Coordinación de contratos entre módulos:**
  - El contrato `Almacenamiento.guardar(clave, valor)` / `Almacenamiento.cargar(clave)` y las claves `planit:evento` / `planit:detalles-evento`, relevados en MOMENTO 1 a partir de la PR #104.
  - El pedido a @ValeriaMSilva de integrar `develop` en `feature/dev-eventos-dom` después del merge de la #102 (commit `c3fa07e`).
- **Respuestas a reviews recibidas sobre PRs propias**, sin veredicto: [#108 issuecomment-7072705317](https://github.com/carolabenvenuto-uces/planit/pull/108#issuecomment-7072705317), [#110 issuecomment-7087398307](https://github.com/carolabenvenuto-uces/planit/pull/110#issuecomment-7087398307) y los comentarios de respuesta en la PR #114.
- **El `APPROVE` reemplazado** ([5963759488](https://github.com/carolabenvenuto-uces/planit/pull/104#pullrequestreview-5963759488)). Es formal por su tipo, pero fue sustituido por RF-2 sobre el mismo commit, así que no se cuenta dos veces.
- **El hallazgo autodetectado en `feature/dev-storage`** (detalle a continuación). Es QA sobre trabajo propio, no una review de otro integrante.

#### Hallazgo adicional (autodetectado, fuera del conteo)
Durante la revisión de la ronda 3 se encontró un bug real en **`feature/dev-storage`**, la PR #108 de este mismo responsable (no de Valeria). `storage.js` ruteaba `planit:detalles-evento` (fecha y ubicación reales del evento) a `sessionStorage`, bajo el supuesto erróneo de que era estado efímero de UI. Se verificó con Playwright: tras simular un reinicio de navegador, fecha y ubicación volvían al valor del mockup mientras el resto del evento persistía correctamente. Se corrigió en el commit `92d5e1a` de `feature/dev-storage`: se vació `CLAVES_SESSION`, ruteando esa clave a `localStorage` como el resto, y se actualizó `storage-doc.md`. No se cuenta como review porque el defecto es de autoría propia, no de "otro integrante". Se documenta aquí como evidencia de QA sobre el propio trabajo.

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
  - Se aplicaron las mejoras no bloqueantes de la primera ronda: sección "Obstáculos" agregada (más abajo), README corregido, issue #105 asignada a @FacundoGuiraldes.
  - **Segunda ronda:** `CHANGES_REQUESTED` — 2 bloqueantes: el MOMENTO 1 seguía sin coincidir byte a byte con `b102a5d` (el párrafo de herramientas de IA tenía la aclaración sobre el docente agregada, y quedaba una nota al final del checklist); y el spec afirmaba que la descripción de la PR usaba el template de feature, cuando en realidad mantenía su formato propio. Más 2 mejoras no bloqueantes: la nota inicial de MOMENTO 2 estaba desactualizada, y el ítem de "4 code reviews" del checklist de cierre estaba tildado pese a decir "cumplido parcialmente".
    - Se restauró el párrafo de herramientas de IA tal como está en `b102a5d` y se movió la aclaración sobre el docente al inicio de esta sección (ver arriba); se sacó la nota del final del checklist de MOMENTO 1. Se corrigió la afirmación sobre el template de feature (la descripción de la PR mantiene su formato propio, igual que #108/#109/#110, y se aclara por qué). Se actualizó la nota inicial de MOMENTO 2 y se destildó el ítem de "4 code reviews" en el checklist de cierre.
  - **Tercera ronda:** `APPROVE` (23/11/2026, sobre el commit `bf9b728`, [review 6015478484](https://github.com/carolabenvenuto-uces/planit/pull/114#pullrequestreview-6015478484)). Mergeada a `develop` (merge commit `473b959`).

Con esto, las 3 PRs de dominio de la AO4 (POO, Eventos+DOM, Storage), el fix de Issue #68 y la suite de Tester QA están mergeadas a `develop` con revisión cruzada completa entre los 3 integrantes.

### Tablero Kanban (GitHub Projects)

[PlanIT - Actividad Obligatoria N° 4](https://github.com/users/FacundoGuiraldes/projects/3) (público), con las 15 issues/PRs de la AO4 (#68, #101 a #114). Se creó con la API de GraphQL de Projects v2, a diferencia del tablero de la AO3 ([PlanIT - Actividad Obligatoria N° 3](https://github.com/users/carolabenvenuto-uces/projects/2)), que se armó manualmente desde la interfaz. Por la misma restricción de GitHub que impide vincular un proyecto a un repositorio de otro dueño (ya aplicada también al tablero de la AO3, que tampoco quedó enlazado al repo), este tablero no aparece en la pestaña "Projects" de `planit`, pero cada ítem apunta al issue/PR real del repositorio. Estado: `Done` en todo lo ya mergeado/cerrado; `In Progress` en #105 y #114 mientras se resuelve esta ronda de review.

### Obstáculos

- **Orden real del spec respecto de la primera tarea de coordinación.** El ítem del checklist dice que `spec-devops.md` se commiteó "antes de cualquier otra tarea de coordinación de la AO4", y es cierto respecto de las tareas propias de la AO4 (reviews de PR #102/#104, integración, Kanban, README), pero el commit `b102a5d` es del 18/11, posterior a las 17 correcciones de la revisión docente de la AO3 (#83-#99, 10/11) y al backport #100 (11/11) — tareas que, cronológicamente, son anteriores. No se reescribió el historial para "corregir" esto: se documenta acá como está, y el ítem del checklist se entiende acotado a la coordinación específica de la AO4 (ver tabla de correcciones más arriba).
- **Conteo de code reviews (observación docente RC1).** La versión anterior de este spec mezclaba reviews formales con sesiones conversacionales y no permitía acreditar el mínimo. Tras la reestructuración (ver "Code reviews realizados"), quedan acreditadas **5 reviews formales de GitHub** sobre PRs de otros integrantes (RF-1 a RF-5, mínimo exigido: 4), cada una con su `pullrequestreview-<id>` y su commit analizado. De esas 5, **3 son `REQUEST_CHANGES`** (RF-2 a RF-4, sobre la PR #104). No se forzó un cuarto hallazgo artificial en la ronda final: la consigna califica ese mínimo con "si corresponde". En ese punto el cumplimiento es parcial y está justificado.
- **Prompts no registrados textualmente.** RF-1, RF-2 y RF-5 se condujeron en sesiones conversacionales con el asistente, sin un prompt único por escrito. Los prompts exactos se registraron a partir de RF-3. Para las tres primeras no se reconstruye un prompt a posteriori. Se documenta la instrucción efectivamente dada y la evidencia verificable es la review publicada en GitHub.
- **`APPROVE` erróneo en la ronda 1 de PR #104.** La primera review publicada aprobó la PR tratando el desacople de contrato de `escribirEnAlmacenamiento()` como "no bloqueante"; 5 minutos después se corrigió el criterio a `CHANGES_REQUESTED` al reconocer que el resultado mostrado al usuario era incorrecto, no solo un detalle de estilo. Mismo tipo de situación que el approve erróneo de Copilot documentado en el cierre de la AO3: se deja registrado en vez de omitir la primera review.
- **Tablero Kanban en una cuenta personal, sin vínculo al repositorio.** GitHub Projects v2 solo permite `linkProjectV2ToRepository` cuando el proyecto pertenece al mismo dueño que el repositorio (`carolabenvenuto-uces`); este token opera como `@FacundoGuiraldes`, así que el tablero quedó creado en `github.com/users/FacundoGuiraldes/projects/3`, público pero no enlazado a la pestaña "Projects" de `planit`. Mismo límite que ya existía en el tablero de la AO3 (propiedad de `@carolabenvenuto-uces`, tampoco enlazado).
- **Capturas de testing sin Playwright MCP.** Documentado en detalle en `spec-tester-qa.md` y `js/test/testing-doc.md`: las capturas de la AO4 se generaron con la librería `playwright` (`js/test/take-screenshots.js`), no con el servidor MCP interactivo, que no estaba conectado en la sesión donde se escribió esa suite.

### Checklist de cierre (MOMENTO 2)

- [x] `spec-devops.md` creado y commiteado antes de la coordinación propia de la AO4 (ver "Obstáculos" sobre el orden real respecto de las correcciones de la AO3).
- [x] PR #102 (Dev POO) revisada y mergeada.
- [x] PR #104 (Eventos + DOM) revisada y mergeada, tras actualizarse con `develop`.
- [x] PR #108 (`feature/dev-storage`) integrada.
- [x] PR #110 (`feature/tester-qa-specs`) integrada.
- [x] Al menos 4 code reviews formales de GitHub sobre PRs de otros integrantes: 5 acreditadas (RF-1 en PR #102, RF-2 a RF-5 en PR #104), con veredicto, commit analizado e identificador de review (ver "Resumen de acreditación").
- [ ] Al menos 4 code reviews con `CHANGES_REQUESTED` documentados (si corresponde): cumplido parcialmente, 3/4 (RF-2 a RF-4 sobre PR #104, ver "Obstáculos"). Las reviews de @ValeriaMSilva sobre la PR #108 y de @carolabenvenuto-uces sobre la PR #110 son reviews recibidas y no computan para este rol.
- [x] Tablero Kanban en GitHub Projects administrado con las issues de la AO4: [PlanIT - Actividad Obligatoria N° 4](https://github.com/users/FacundoGuiraldes/projects/3) (15 ítems: #68, #101-#114).
- [x] Seguimiento del Issue [#68](https://github.com/carolabenvenuto-uces/planit/issues/68) (deuda técnica de `js/componentes-bootstrap.js`) — resuelto en PR #109, issue cerrada.
- [x] `README.md` actualizado con información de la cuarta entrega.
- [ ] GitHub Pages activo y verificado en `release/cuarta-entrega`.
- [ ] Limpieza de ramas al cierre (solo `master`, `develop`, `release/cuarta-entrega`).
- [ ] Tag `v1.2-cuarta-entrega` y GitHub Release publicados tras la aprobación del docente.
- [x] `changelog.md` actualizado con la contribución de cada integrante.

*(GitHub Pages, tag/release y limpieza de ramas: pendientes de documentar una vez mergeada esta PR, al cortar `release/cuarta-entrega`.)*
