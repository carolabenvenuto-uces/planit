# Especificación Técnica (Spec) - Coordinadora / DevOps - Gestión y Resolución de Correcciones

- **Proyecto:** PlanIT - Plataforma All-in-One de Organización & Experiencias
- **Entrega:** Segundo Parcial
- **Rol:** Coordinadora / DevOps - Gestión y Resolución de Correcciones (en conjunto con Tester QA/JS, por ser un grupo de 3 integrantes)
- **Responsable:** Valeria Silva (@ValeriaMSilva)
- **Rama:** `feature/coord-devops-segundo-parcial`
- **Issue principal:** [#146](https://github.com/carolabenvenuto-uces/planit/issues/146)
- **Fecha:** 25 de noviembre de 2026

---

## MOMENTO 1: Planificación Previa (ANTES de comenzar)

### 1. Información general

#### 1.1. Qué se va a hacer

Coordinación integral del Segundo Parcial: seguimiento de las ramas `feature/` de cada rol, revisión de sus PRs, definición y ejecución del orden de integración a `develop`, mantenimiento de `changelog.md`, preparación de la rama de release y, en la Fase 2, gestión y resolución de las correcciones (Request Changes) que marque el docente sobre la entrega.

Este spec se commitea **antes** de comenzar cualquier tarea de coordinación, para que el plan quede registrado en el historial de git con el mismo criterio de las entregas anteriores (ver `docs/03-specs/actividad-obligatoria-4/spec-devops.md`).

#### 1.2. Integrantes y roles

El grupo del Segundo Parcial está conformado por **3 integrantes**:

| Integrante | Rol | Rama |
| --- | --- | --- |
| Carola Benvenuto (@carolabenvenuto-uces) | Desarrolladora JS Asíncrono - Fetch & APIs | `feature/dev-async-fetch-api` |
| Facundo Guiraldes (@FacundoGuiraldes) | Desarrollador JS Librerías Externas | `feature/dev-libreria-externa-[nombre]` |
| Valeria Silva (@ValeriaMSilva) | Coordinadora / DevOps **+** Tester QA/JS - Testing Avanzado | `feature/coord-devops-segundo-parcial` y `feature/tester-qa-js-testing-suite` |

**Doble rol.** Por ser un grupo de 3, quien suscribe asume en simultáneo los roles de Coordinadora/DevOps y de Tester QA/JS. Cada rol se documenta en su propio spec y su propia rama para mantener la trazabilidad:

- Coordinadora/DevOps: este documento, rama `feature/coord-devops-segundo-parcial`, Issue [#146](https://github.com/carolabenvenuto-uces/planit/issues/146).
- Tester QA/JS: `docs/03-specs/segundo-parcial/spec-tester-qa-segundo-parcial.md`, rama `feature/tester-qa-js-testing-suite`, Issue [#139](https://github.com/carolabenvenuto-uces/planit/issues/139).

Como la Coordinadora no puede aprobar su propio trabajo, las PRs de ambos roles las revisa y aprueba otro integrante del grupo (ver sección 2.3).

#### 1.3. Punto de partida

- `develop` es idéntica a `master` tras el backport de la AO4 (PR [#137](https://github.com/carolabenvenuto-uces/planit/pull/137), commit `fe2a056`). Ninguna feature del Segundo Parcial está mergeada todavía.
- La rama `feature/dev-async-fetch-api` ya existe en el remoto con su spec (`spec-dev-async-fetch.md`, Issue [#138](https://github.com/carolabenvenuto-uces/planit/issues/138)) y los primeros commits de implementación.
- La rama `feature/tester-qa-js-testing-suite` ya existe con su spec y el Test Case 11 (Lighthouse baseline).
- La rama de la librería externa todavía no fue creada; su nombre definitivo depende de la librería que elija el Desarrollador JS Librerías Externas.

---

### 2. Plan de coordinación

#### 2.1. PRs esperadas por rol

| # | Rol | Rama | Spec | Destino |
| --- | --- | --- | --- | --- |
| 1 | Desarrolladora JS Asíncrono | `feature/dev-async-fetch-api` | `spec-dev-async-fetch.md` | `develop` |
| 2 | Desarrollador JS Librerías Externas | `feature/dev-libreria-externa-[nombre]` | spec del rol en `docs/03-specs/segundo-parcial/` | `develop` |
| 3 | Tester QA/JS | `feature/tester-qa-js-testing-suite` | `spec-tester-qa-segundo-parcial.md` | `develop` |
| 4 | Coordinadora / DevOps | `feature/coord-devops-segundo-parcial` | `spec-coord-devops-segundo-parcial.md` (este documento) | `develop` |

Cada PR debe tener su issue asociada y cerrarla con `Closes #N` en la descripción.

#### 2.2. Orden de integración a `develop`

1. **Fetch** (`feature/dev-async-fetch-api`): no depende de ninguna otra rama del parcial. Introduce `js/api/apiService.js`, `api/proveedores.json` y la carga asíncrona del catálogo.
2. **Librería externa** (`feature/dev-libreria-externa-[nombre]`): antes del merge se actualiza con `develop` (ya con el fetch integrado), para que la librería pueda consumir los datos de `ApiService` y los modelos POO, y para resolver posibles conflictos en `index.html` y `js/script.js` dentro de su propia rama.
3. **Testing** (`feature/tester-qa-js-testing-suite`): se integra después de las dos features porque sus suites (`api.spec.js`, `library.spec.js` y las actualizaciones de `script.spec.js`/`models.spec.js`) prueban el código ya mergeado. Además, el plan del Tester exige correr **Lighthouse en tres momentos: baseline (antes de los merges), post-fetch y post-librería, en ese orden**, para poder atribuir cada variación de Performance, Accesibilidad, Buenas Prácticas y SEO a una sola feature. Si la librería se mergeara antes que el fetch, o ambas juntas, no se podría aislar el impacto de cada una.
4. **Coordinación** (`feature/coord-devops-segundo-parcial`): va última porque cierra el MOMENTO 2 de este spec y el `changelog.md` con los links de las PRs anteriores, que recién existen y están mergeadas en ese punto.

Después de cada merge se corre la suite completa (`npm test`) sobre `develop` para detectar regresiones antes de integrar la PR siguiente.

#### 2.3. Criterio de aprobación de PRs

Una PR se aprueba y se mergea solo si cumple **todos** los puntos siguientes:

- [ ] El spec del rol se commiteó **antes** que el código (se verifica en el historial de commits de la rama).
- [ ] Tiene una issue asociada, referenciada con `Closes #N`.
- [ ] La descripción completa el template de PR del repositorio.
- [ ] `changelog.md` está actualizado con la entrada del rol, con links a la PR y a la issue.
- [ ] La rama está actualizada con `develop` y no tiene conflictos.
- [ ] Tiene revisión con IA y no quedan Request Changes pendientes.
- [ ] El código no tiene `console.log` innecesarios ni código comentado.
- [ ] Las funciones nuevas tienen JSDoc.

**Aprobación cruzada:** las PRs de la Coordinadora/DevOps y del Tester QA/JS (ambas de quien suscribe) las aprueba otro integrante del grupo. Nadie mergea una PR que aprobó solo para sí mismo.

---

### 3. Plan de la Fase 2: corrección post-entrega

**Plazo:** hasta el **30/11/2026 a las 22:00**.

Una vez entregado el Segundo Parcial, el docente revisa la PR de `release/segundo-parcial` y marca Request Changes (RC). La Fase 2 se organiza así:

1. **Una issue por cada Request Change:** cada RC del docente se carga como una issue propia en el tablero "PlanIT - Segundo Parcial", con el número de RC en el título, el link al comentario del docente y la etiqueta de prioridad.
2. **Asignación por rol:** cada issue se asigna al integrante del rol dueño del archivo o de la funcionalidad afectada. Los RC transversales (changelog, README, release, GitHub Pages) quedan a cargo de la Coordinadora. Si un RC se reasigna, se deja registrado en la issue y en el MOMENTO 2 el motivo y la fecha.
3. **Prioridades:**

   | Prioridad | Criterio | Ejemplos |
   | --- | --- | --- |
   | **Crítico** | Bloquea el funcionamiento de la aplicación o la entrega. | Error de sintaxis que rompe `script.js`, GitHub Pages caído, suite que no corre. |
   | **Alto** | Afecta un requisito obligatorio de la consigna. | Falta de manejo de errores en `fetch`, librería no integrada, casos de prueba faltantes. |
   | **Medio** | Documentación o calidad de código. | Spec incompleto, changelog sin links, JSDoc faltante. |
   | **Bajo** | Estilo. | Formato, nombres, consistencia visual. |

   El orden de prioridad se aplica **dentro de cada rol**: cada integrante resuelve sus propios RC de mayor a menor prioridad y no empieza uno de prioridad menor mientras tenga abierto uno de prioridad mayor. Los distintos roles trabajan **en paralelo**, de modo que un RC crítico de un rol no frena las correcciones de los demás. La Coordinadora sigue el avance en el tablero y, si un RC de un rol depende de otro (por ejemplo, un test que requiere un fix en `apiService.js`), coordina el orden de merge entre ambas ramas `fix/`.
4. **Ramas `fix/`:** cada RC (o grupo de RC relacionados) se resuelve en una rama `fix/<rol>-rc<N>-<descripcion>`, creada desde `release/segundo-parcial`, con su propia PR que cierra la issue (`Closes #N`) y el mismo criterio de aprobación de la sección 2.3.
5. **Changelog:** cada corrección agrega una entrada bajo `### Fixed` en `changelog.md`, con el número de RC y el link a la PR.
6. **Notificación en Slack:** al terminar cada ronda de correcciones se avisa en el canal de Slack de la materia con ✅, indicando los RC resueltos y los links a las PRs, para que el docente pueda revisar de nuevo.
7. **Cierre tras el LGTM del docente:**
   1. Merge de `release/segundo-parcial` a `master`, notificado en Slack con :pr-merged:.
   2. Creación del tag `v2.0-segundo-parcial` y publicación de la GitHub Release correspondiente.
   3. **Backport final** de `release/segundo-parcial` a `develop` (rama `backport/release-segundo-parcial`), para que ambas queden alineadas.

---

### 4. Herramientas

- **Claude / GitHub Copilot Agent Mode — code reviews asistidos.** Se usan para revisar las PRs de cada rol con el diff completo y la consigna como contexto. Permiten detectar inconsistencias con la arquitectura de datos asíncrona (uso de `fetch` y promesas, manejo de errores HTTP y de red, separación entre `ApiService` y el controlador), problemas en la integración de la librería externa (carga, inicialización, dependencia de los modelos POO y de los datos del fetch) y huecos en la suite de testing (casos faltantes, `fetch` sin mockear, tests no deterministas). Las observaciones de la IA **no se cargan directamente**: cada una se valida manualmente contra el repositorio y la consigna, y solo las confirmadas se cargan como Request Changes inline sobre las líneas del diff. Se mantiene el criterio de la AO4, donde se comprobó que una revisión automática sin verificación puede omitir archivos o señalar falsos positivos.
- **GitHub Projects — tablero "PlanIT - Segundo Parcial".** Se usa para administrar las issues del parcial (features, bugs reportados por el Tester y RC de la Fase 2) en columnas Kanban, con responsable, prioridad y vínculo a su PR. Da a todo el grupo una vista única del estado de la entrega y deja trazado quién resolvió cada tarea.

---

### 5. Gestión de permisos

El repositorio pertenece a la cuenta personal de Carola Benvenuto (@carolabenvenuto-uces), por lo que algunas configuraciones solo puede hacerlas ella como owner. Las realiza **la owner a pedido de la Coordinadora**:

- **GitHub Pages:** publicado desde `develop` durante el desarrollo y cambiado a `release/segundo-parcial` para la entrega. La Coordinadora pide el cambio y verifica el sitio publicado.
- **GitHub Projects:** creación y configuración del tablero "PlanIT - Segundo Parcial" y permisos de los integrantes.

Cada pedido y su verificación se registran en el MOMENTO 2 (sección de obstáculos) si generan demoras.

---

### 6. Avance realizado

Al momento de commitear este spec ya se completaron las siguientes tareas:

- **Correcciones de la AO4 cerradas:** la revisión docente de la AO4 recibió LGTM; `release/cuarta-entrega` se mergeó a `master` y se hizo el backport a `develop` (PR [#137](https://github.com/carolabenvenuto-uces/planit/pull/137)). El Segundo Parcial parte de un `develop` alineado con `master`.
- **Tablero Kanban "PlanIT - Segundo Parcial"** creado en GitHub Projects.
- **Issues [#139](https://github.com/carolabenvenuto-uces/planit/issues/139) a [#146](https://github.com/carolabenvenuto-uces/planit/issues/146)** cargadas en el tablero.

---

### 7. Criterios de Aceptación (Checklist)

- [ ] `spec-coord-devops-segundo-parcial.md` creado y commiteado en `docs/03-specs/segundo-parcial/` antes de cualquier otra tarea de coordinación.
- [ ] PR de `feature/dev-async-fetch-api` revisada y mergeada (1°).
- [ ] PR de `feature/dev-libreria-externa-[nombre]` revisada y mergeada (2°), tras actualizarse con `develop`.
- [ ] PR de `feature/tester-qa-js-testing-suite` revisada por otro integrante y mergeada (3°).
- [ ] PR de `feature/coord-devops-segundo-parcial` revisada por otro integrante y mergeada (4°).
- [ ] Mínimo 4 PRs revisadas con asistencia de IA, con Request Changes cargados inline en las líneas del diff.
- [ ] Suite completa en verde en `develop` después de cada merge.
- [ ] Issues del parcial administradas en GitHub Projects (tablero "PlanIT - Segundo Parcial").
- [ ] `changelog.md` actualizado con la contribución de cada integrante y los links a PRs e issues.
- [ ] `release/segundo-parcial` creada desde `develop` y GitHub Pages activo y verificado en esa rama.
- [ ] PR de entrega publicada en Slack y enlaces subidos al campus por todos los integrantes.
- [ ] Correcciones de la Fase 2 resueltas en ramas `fix/` (una issue por RC) y mergeadas.
- [ ] LGTM del docente y release `v2.0-segundo-parcial` (tag + GitHub Release) publicados antes del 30/11/2026 a las 22:00.
- [ ] Backport final de `release/segundo-parcial` a `develop` realizado.

---

## MOMENTO 2: Evidencia de Cierre (AL FINALIZAR)

> Sección a completar al cierre de las tareas de coordinación y de la Fase 2.
>
> Sección completada al cierre de la Fase 1 (27/11/2026). La sección 3 (Fase 2) queda con la estructura lista y se completa durante la corrección docente, hasta el 30/11/2026 a las 22:00.
>
> Todas las horas son de Argentina (UTC-3). Las fechas, estados y autores de PRs, reviews e issues se tomaron de la API pública de GitHub del repositorio el 27/11/2026.

### 1. PRs integradas y orden real de merge

| Orden | PR | Rama → destino | Autor/a | Issue | Reviews de la Coordinadora | Merge |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | [#147](https://github.com/carolabenvenuto-uces/planit/pull/147) | `feature/dev-async-fetch-api` → `develop` | @carolabenvenuto-uces | [#138](https://github.com/carolabenvenuto-uces/planit/issues/138) | Cambios requeridos (25/11 22:35) → Aprobada (26/11 12:09) | 26/11 12:12, por la autora (`6aae3d8`) |
| 2 | [#149](https://github.com/carolabenvenuto-uces/planit/pull/149) | `feature/dev-libreria-externa-chartjs` → `develop` | @FacundoGuiraldes | [#148](https://github.com/carolabenvenuto-uces/planit/issues/148) | Cambios requeridos (27/11 07:21) → Cambios requeridos (27/11 17:36) → Comentario de revisión final (27/11 18:59) → Aprobada (27/11 19:01) | 27/11 19:42, por la Coordinadora (`c8d7338`) |
| 3 | [#152](https://github.com/carolabenvenuto-uces/planit/pull/152) | `feature/tester-qa-js-testing-suite` → `develop` | @ValeriaMSilva | [#139](https://github.com/carolabenvenuto-uces/planit/issues/139) | — (la revisa otro integrante: aprobación cruzada, sección 2.3) | Abierta. Cambios requeridos de @carolabenvenuto-uces (27/11 20:27). [COMPLETAR: fecha y hora del merge] |
| 4 | [#153](https://github.com/carolabenvenuto-uces/planit/pull/153) | `feature/coord-devops-segundo-parcial` → `develop` | @ValeriaMSilva | [#146](https://github.com/carolabenvenuto-uces/planit/issues/146) | — (aprobación cruzada) | [COMPLETAR: revisor/a, fecha y hora del merge] |
| 5 | [COMPLETAR: número de PR de release] | `release/segundo-parcial` → `master` | @ValeriaMSilva | — | Revisión docente (Fase 2) | Después del LGTM del docente |

**El orden real respetó el plan de la sección 2.2:** fetch → librería → testing → coordinación. La #149 se actualizó con `develop` después del merge de la #147 (el primer commit de la rama, `fce9b83`, tiene como padre `6aae3d8`), como se pidió en la review de la #147.

**Criterios efectivamente aplicados para aprobar.** Además de los de la sección 2.3, en cada review se exigió:

- `npm test` con **0 failures y exit code 0** en la rama (no alcanza con "0 failures" en el navegador: ver B1 de la #147).
- **Sin regresión en Lighthouse** según el criterio de `spec-tester-qa-segundo-parcial.md` (ninguna categoría cae y ni LCP, ni TBT, ni CLS cambian de calificación). Se aplicó en B1 de la #149.
- Que la rama no pise archivos de otros roles, salvo con OK explícito del rol dueño, registrado en la review.

Verificación en esta rama (`feature/coord-devops-segundo-parcial`, actualizada con `develop` en `33519da`): `npm test` → **330 specs, 0 failures, exit 0** (semilla 63947, 27/11/2026).

---

### 2. Code reviews asistidos con IA

#### 2.0. Herramienta efectivamente usada: Claude Code

El MOMENTO 1 (sección 4) planificó "Claude / GitHub Copilot Agent Mode". Todas las reviews se hicieron con **Claude Code** (agente de Anthropic, extensión de VS Code), que la consigna admite como "otra IA". Se eligió porque:

- **Ejecuta, no solo lee el diff.** Corre `npm test`, levanta el sitio por HTTP bajo `/planit/` (como GitHub Pages), lo prueba con Playwright simulando la API con `page.route` (404, 500, offline, timeout, JSON malformado, HTML inyectado) y mide con Lighthouse. Así cada Request Change se carga con evidencia reproducible: B1 de la #147 (exit 1 por `fetch` en `file://`) y B1 de la #149 (CLS 0,124) **no se ven leyendo el diff**, solo ejecutando.
- **Trabaja sobre el repositorio completo.** Cruza el diff con los specs de todos los roles, los modelos (`js/models/`) y las otras ramas abiertas (`git merge-tree`), y detecta desacoples de contrato entre PRs (por ejemplo, `resumirCatalogo()` devuelve un objeto sin prototipo y la librería no podía usar `hasOwnProperty`).
- **Respeta reglas de solo lectura.** Todos los prompts le prohíben modificar archivos, commitear, mergear o comentar en GitHub. La publicación de cada review la hizo la Coordinadora, después de leerla.

Se mantuvo el criterio de la AO4: ninguna observación de la IA se publicó sin validarla. Cada prompt exige "todo lo que afirmes tiene que salir de algo que leíste o ejecutaste" y citar archivo y línea.

#### 2.1. Prompts exactos y archivos del diff adjuntados

Para cada review se registra el prompt exacto usado (en bloque de código) y la lista de archivos del diff que se adjuntaron como contexto.

Claude Code no recibe archivos adjuntos: lee el repositorio y el diff directamente. Por eso, en cada review se listan **los archivos del diff que el agente leyó**, tal como figuran en la propia review publicada, y los archivos de otros roles que se usaron para cruzar contratos.

Los prompts se copiaron textualmente del historial local de Claude Code (archivos `.jsonl` de las sesiones del proyecto). Se usaron 5 prompts principales, uno por review, y en la primera review de la #147 hubo 4 mensajes de seguimiento hasta llegar al formato final.

##### Review 1 — PR #147, primera revisión (25/11/2026)

- **Commit revisado:** `925dac2` contra `develop` (`fe2a056`).
- **Archivos del diff (12, +532/-28):** `js/api/apiService.js`, `js/script.js`, `api/proveedores.json`, `index.html`, `js/test/script.spec.js`, `js/test/test-runner.html`, `docs/03-specs/segundo-parcial/spec-dev-async-fetch.md`, `changelog.md`, `docs/03-specs/segundo-parcial/evidencia-fetch-catalogo.png` y las 3 imágenes `docs/01-mockup/actividad-obligatoria-2/catalogo-*-450w.jpg`.
- **Contexto de otros roles:** `spec-tester-qa-segundo-parcial.md` (casos API-01 a API-14 y REG-01 a REG-04), `js/models/Validador.js`, `js/models/Proveedor.js` y `js/models/CatalogoProveedores.js`. Ramas cruzadas con `git merge-tree`: `feature/tester-qa-js-testing-suite` (`106e0f0`) y `feature/coord-devops-segundo-parcial` (`00f4693`).

Prompt inicial (22:02):

```text
Soy la coordinadora del proyecto y tengo que revisar la rama `feature/dev-async-fetch-api`, que terminó una integrante del equipo, antes de aprobar el merge.
No modifiques archivos ni hagas commits: es solo una revisión. Si algo no se puede verificar, decímelo; no lo supongas.

## Contexto
- Tarea que se le asignó: [ej: "implementar el consumo asíncrono de la API X con manejo de errores"]
- Su rol en el equipo: [ej: "backend – integración con APIs"]
- Otros roles e integrantes: [ej: "Ana – frontend/UI; Juan – base de datos; yo – coordinación y diagramas"]
- Rama base: [develop / main]
- Si hay specs, README, CONTRIBUTING o docs de tareas en el repo (por ejemplo spec-*.md), leelos primero para tomar el alcance asignado y las convenciones del equipo.

## Qué revisar
1. **Cumplimiento de la tarea.** Compará `git diff [base]...feature/dev-async-fetch-api` con lo que se le asignó:
   - Qué está completo, qué falta y qué agregó que no se le pidió.

2. **Respeto de roles.** Clasificá cada archivo modificado como DENTRO o FUERA de su rol y señalá todo lo que pise el trabajo de otro integrante:
   - Archivos o módulos de otro rol, o código escrito por otra persona (verificalo con `git log`/`git blame` en la base)
   - Contratos compartidos: interfaces, DTOs, modelos, endpoints, firmas públicas, renombres
   - Configuración global: appsettings/.env, inyección de dependencias, Program/Startup, routing
   - Dependencias: paquetes agregados, quitados o con versión cambiada
   - Base de datos (migraciones, esquema), CI/CD, scripts de build, .gitignore
   - Archivos borrados o movidos, o reformateo masivo de archivos ajenos
   Para cada caso, indicá a quién afecta y si hace falta avisarle o pedirle su visto bueno.

3. **Integración.**
   - ¿Tiene conflictos con la base? Verificalo sin mergear de verdad (por ejemplo con `git merge-tree`).
   - ¿Compila? ¿Pasan los tests existentes? Si hay suite de tests, corréla.
   - ¿Rompe algo que otros estén usando?

4. **Calidad básica de lo suyo** (sin entrar en detalles de estilo):
   - async/await bien usado: sin `.Result`, sin `.Wait()`, sin promesas sin `await`
   - Manejo de errores y timeouts al llamar a la API
   - Sin URLs, claves ni secretos hardcodeados
   - Tests de lo nuevo, si corresponde

5. **Convenciones del equipo:** nombre de la rama, mensajes de commit, estructura de carpetas y nombres, según lo que encuentres documentado o lo que ya se usa en el repo.

## Formato de respuesta
1. **Decisión sugerida:** Aprobar / Aprobar con cambios / No aprobar todavía, con 2–3 líneas de justificación.
2. **Cumplimiento de la tarea:** hecho / faltante / extra.
3. **Tabla "Cambios que pisan otros roles":** Archivo | Qué cambió | Afecta a | Severidad (Bloqueante / Consultar / Menor) | Acción sugerida
4. **Riesgos de integración:** conflictos, build, tests.
5. **Problemas de calidad**, solo los importantes: Archivo:línea | Problema | Sugerencia
6. **Mensaje para la integrante:** devolución lista para pegar en el PR o en el chat del equipo, en tono constructivo, reconociendo lo que está bien y con pedidos de cambio concretos.
7. **Avisos para otros integrantes:** si algún cambio los afecta, un mensaje corto para cada uno.
```

Seguimientos sobre el primer informe (22:07 y 22:08):

```text
pero detalla en el infrome que etsa correcto, que  cambios se requieren que bloquean el aprove
```

```text
quiero el informe completo para ponerlo en la pr de caro
```

Prompt principal con el que se generó la review (22:13):

```text
Soy la coordinadora del proyecto y tengo que revisar la PR de Caro, rama `feature/dev-async-fetch-api`, contra `develop`.
Quiero una revisión completa y verificada empíricamente, con el mismo nivel de detalle que la revisión que Facundo hizo de la PR #104 (Dev Eventos + DOM).

REGLAS
- NO modifiques archivos, NO hagas commits, NO mergees, NO comentes en GitHub. Solo leé, ejecutá y probá.
- Nada de suposiciones: todo lo que afirmes tiene que estar respaldado por algo que leíste o ejecutaste. Si algo no se pudo verificar, decilo explícitamente.
- Citá archivo y línea aproximada en cada hallazgo.

PASO 1 – Contexto
1. Con `gh pr list` y `gh pr view`, identificá el número de la PR de esta rama y las demás PRs abiertas (en especial las que todavía no están mergeadas a develop, como la #108 de storage.js si sigue abierta).
2. Leé ENTERO el spec del rol de Caro (spec-dev-async-fetch-api.md o el que corresponda), incluida la sección AL CERRAR: el prompt que usó, los ajustes manuales y su tabla de verificación.
3. Leé también los specs de los otros roles que tocan lo mismo que ella (Dev Eventos + DOM, storage, modelos, Tester QA), para saber qué contratos ofrece o consume cada uno.

PASO 2 – Lectura del diff
1. `git diff develop...feature/dev-async-fetch-api --stat` y después el diff completo, archivo por archivo.
2. Clasificá cada archivo: DENTRO de su rol o FUERA de su rol. Si es FUERA, indicá de quién es, usando `git log`/`git blame` en develop y los specs.

PASO 3 – Verificaciones estáticas (informá el comando y el resultado de cada una)
- Separación de capas: que no haya fetch fuera de la capa de servicios/API que define su spec, ni accesos a localStorage/sessionStorage fuera de js/utils/storage.js, ni lógica de negocio/validación/aritmética fuera de js/models/.
- Que no queden prompt(, alert( ni confirm(.
- Que no haya innerHTML con datos que vengan de la API; deben usarse textContent / createElement / DocumentFragment.
- async/await: que no haya promesas sin await ni sin catch, que cada fetch chequee response.ok, que haya manejo de errores de red y de JSON inválido, timeout/cancelación (AbortController) si el spec lo pide, y que no queden URLs ni claves hardcodeadas fuera de la configuración que defina el spec.
- Que los IDs, nombres de funciones y la forma de los datos coincidan 1 a 1 con el contrato de su spec y con lo que consumen script.js y los modelos.

PASO 4 – Verificación empírica con Playwright
1. Levantá el proyecto con un servidor local (no con file://, porque fetch no funciona así; por ejemplo `npx serve` o `python -m http.server`).
2. Con Playwright, probá de punta a punta cada flujo que su spec dice que cubre, contra los modelos reales ya mergeados y contra storage.js (si la #108 no está en develop, traela localmente solo para probar, sin commitear).
3. Casos obligatorios, usando page.route para simular la API:
   - respuesta OK con datos normales
   - respuesta vacía ([] / sin resultados) → estado vacío con mensaje correcto
   - error 404 y error 500 → mensaje de error visible, la app no se rompe
   - fallo de red / offline → aviso al usuario
   - respuesta lenta → estado de carga visible y botones deshabilitados si corresponde
   - JSON malformado
   - dato con HTML inyectado (ej: "<b>Hacker</b>") → 0 etiquetas <b> en el DOM
   - doble clic o llamadas repetidas → que no se dupliquen requests ni renders
   - recarga de la página → que lo que deba persistir se restaure
4. Revisá la consola del navegador: no puede haber errores no manejados (Uncaught / Unhandled promise rejection).
5. Corré la suite de tests completa. Separá los fallos preexistentes (por ejemplo los specs viejos de AO3 que son tarea del Tester QA, Issue #106) de los fallos NUEVOS causados por esta rama. Dame los números (X de Y).

PASO 5 – Coordinación entre PRs
Buscá desacoples de contrato entre el código de Caro y las otras PRs abiertas o ya mergeadas. Por ejemplo: funciones que ella espera que lancen excepción y en realidad devuelven false/null, nombres o formatos de datos distintos, o IDs del DOM que otro rol cambió. Para cada uno explicá:
- qué asume su código y qué hace realmente el otro, citando las dos partes
- el impacto real (caso borde o caso normal)
- una propuesta concreta con código de ejemplo
- en qué orden conviene mergear las PRs

PASO 6 – Informe
Escribilo en español, en markdown y listo para pegar como review en GitHub, con exactamente esta estructura:

## Revisión PR #<n> - Dev Async / Fetch API
**Revisión completa:** qué leíste y qué ejecutaste (spec, diff con cantidad de líneas, búsquedas, Playwright, contra qué PRs/archivos).

### Lo que cumple
Cada punto con la evidencia concreta: qué probaste, con qué entrada y qué resultado obtuviste.

### Cambios bloqueantes para el código de esta PR
Si no hay, escribí "Ninguno."

### Cambios que pisan otros roles
Tabla: Archivo | Qué cambió | Rol/persona afectada | Severidad (Bloqueante / Consultar / Menor) | Acción sugerida. Si no hay, decilo.

### Punto(s) de coordinación entre PRs (no son bugs de Caro)
Con la propuesta concreta y el código de ejemplo.

### Mejoras no bloqueantes

### Pendiente de otros roles (no es responsabilidad de Caro)

### Veredicto
Aprobado / Aprobado con cambios / Cambios requeridos, con la justificación y el orden de merge recomendado.

Tono: constructivo y directo, reconociendo lo que está bien hecho, como en la revisión de Facundo.

Al final, FUERA del informe, agregá una sección "Para la coordinadora" con:
- los mensajes cortos para cada integrante afectado por algún cambio
- lo que no pudiste verificar y por qué
```

Pedido de reescritura con el formato final, que es el que se publicó (22:25):

```text
El informe no tiene el formato que te pedí. Quiero que lo reescribas completo, con el mismo formato y nivel de detalle que la revisión de Facundo de la PR #104. Mostralo ENTERO acá en el chat, no solo un resumen, y guardalo también en C:\Users\valer\OneDrive\Escritorio\review-pr-147.md (fuera del repo).

Usá exactamente esta estructura, en prosa y viñetas, sin tablas salvo donde lo indico:

Revision PR #147 - Dev Async / Fetch API
Revision completa: un párrafo con todo lo que leíste y ejecutaste (spec, diff con cantidad de líneas, búsquedas estáticas, Playwright con cuántos escenarios, contra qué archivos/PRs).

Lo que cumple
Una viñeta por punto, cada una con la evidencia concreta: qué probaste, con qué entrada y qué pasó. Por ejemplo: "error 500 -> mensaje X visible en #id, sin Uncaught en consola". Incluí los 13 escenarios de Playwright, las verificaciones estáticas, los contratos con los modelos y el spec (sección AL CERRAR).

Cambios bloqueantes para el codigo de esta PR
Solo lo que sea un error real del código de Caro. El JSDoc mal ubicado de construirCatalogo (js/script.js:933) NO es bloqueante: movelo a mejoras.

Punto de coordinacion (no es un bug de Caro)
El exit 1 de npm test: explicá que los 330 specs pasan, que el problema es que test-runner.html abre con file:// y que test-runner.html es del rol Tester, no de Caro. Explicá qué asume cada parte, el impacto, la propuesta con el código del stub y quién lo aplica (el rol Tester en su rama, o Caro con OK explícito del Tester).

Mejoras no bloqueantes
JSDoc, imagen del modal en DPR 2 (610 px vs 450). Para el spinner + Uncaught cuando falla el fallback y para el catálogo vacío que muestra el mensaje de error: fijate en el spec de Caro si están cubiertos. Si el spec los exige, pasalos a bloqueantes y citá la sección del spec.

Pendiente de otros roles (no es responsabilidad de Caro)
Tester: api.spec.js, REG-03, Test Case 12, comentario desactualizado en test-runner.html:18-20. Owner del repo: GitHub Pages desde develop. Facundo: actualizar su rama después del merge (async, bloque de resumen en #contenedor-catalogo, objeto sin prototipo).

Veredicto
Aprobado / Aprobado con cambios / Cambios requeridos, con un párrafo de justificación y el orden de merge recomendado.

Cerrá con una línea indicando quién mergea, como hizo Facundo.

Tono: el de un compañero, directo y reconociendo lo que está bien. Sin tildes, igual que la review de Facundo, para que se pegue bien en GitHub.
```

##### Review 2 — PR #147, re-revisión (26/11/2026, 11:53)

- **Commits revisados:** `6bd925b`, `daa5093`, `9675f4b` y `d891316`, sobre `925dac2`.
- **Archivos del diff:** `js/test/test-runner.html` (+58), `js/script.js` (+28/-3), `js/api/apiService.js` (+5/-4) y `docs/03-specs/segundo-parcial/spec-dev-async-fetch.md` (+18).
- **Contexto de otros roles:** `js/test/run-jasmine.js`, `index.html` y `js/utils/storage.js`; `git merge-tree` contra `develop`, `feature/tester-qa-js-testing-suite` y `feature/coord-devops-segundo-parcial`.

```text
Soy la coordinadora y tengo que hacer la segunda revision de la PR #147 (rama `feature/dev-async-fetch-api`), que es de Caro.
En la primera revision (sobre el commit 925dac2) puse "Cambios requeridos" con un solo bloqueante, B1, y Caro ya subio la correccion.

REGLAS
- NO modifiques archivos, NO hagas commits, NO mergees, NO comentes en GitHub. Solo lee, ejecuta y proba.
- Todo lo que afirmes tiene que estar respaldado por algo que leiste o ejecutaste. Si algo no se pudo verificar, decilo explicitamente.
- Cita archivo y linea en cada hallazgo.

CONTEXTO: EL BLOQUEANTE B1
`npm test` terminaba con exit 1 (en develop termina con 0), aunque pasaban los 330 specs: habia 100 errores de consola porque js/test/run-jasmine.js abre test-runner.html con file:// y ahi fetch no funciona.
Se le pidio agregar un stub de fetch en js/test/test-runner.html, justo antes de <script src="../api/apiService.js">, que responda api/proveedores.json con un fixture y deje pasar el resto de las URLs.
Le di OK, como responsable del rol Tester, para tocar test-runner.html SOLO para ese stub.

Criterios para aprobar:
1. `npm test` termina con exit 0: 330 specs (o mas, si agrego), 0 failures y 0 errores de consola.
2. En archivos del rol Tester (js/test/*) el unico cambio nuevo es el stub.
3. El stub no afecta la app real: index.html no lo carga y el E2E sigue igual.

PASO 1 - Que cambio
1. `git fetch` y `git log --oneline 925dac2..feature/dev-async-fetch-api`: lista los commits nuevos con autor, fecha y mensaje.
2. `git diff 925dac2..feature/dev-async-fetch-api --stat` y despues el diff completo, archivo por archivo.
3. Fijate si develop avanzo desde fe2a056. Si avanzo, verifica con `git merge-tree` que no haya conflictos contra develop, contra feature/tester-qa-js-testing-suite ni contra feature/coord-devops-segundo-parcial.
4. Si `gh` esta disponible, revisa el estado de la PR #147, los checks y los comentarios nuevos de Caro. Si no esta, decilo y segui.

PASO 2 - Verificar B1 a fondo
- Corre `npm test` en la rama y en develop, y mostra el resumen y el exit code de cada uno.
- Conta los errores de consola del runner: tienen que ser 0.
- Revisa el stub linea por linea:
  - que este ANTES de apiService.js;
  - que el fixture tenga datos reales y no el comentario placeholder "/* mismo contenido que api/proveedores.json */". Compara el fixture con api/proveedores.json campo por campo y marca las diferencias;
  - que solo intercepte api/proveedores.json y que el resto pase a fetch original;
  - que no rompa spyOn(window, "fetch"): escribi un spec temporal FUERA del repo (o en una copia) que lo pise y confirma que funciona. Despues borralo.
- Confirma con grep que index.html y js/script.js no tengan nada del stub.
- Confirma que en js/test/ no haya otros cambios ademas del stub. Si los hay, listalos como "pisa rol Tester".

PASO 3 - Regresiones
- Repeti las verificaciones estaticas de la primera revision sobre los archivos que cambiaron: fetch fuera de apiService.js, localStorage/sessionStorage fuera de storage.js, prompt/alert/confirm, innerHTML/insertAdjacentHTML/outerHTML/document.write, URLs/claves, .then/.catch/new Promise, console.log y codigo comentado.
- Servi la rama por HTTP bajo /planit/ y corre con Playwright al menos estos escenarios: OK, 500, offline, timeout, JSON malformado, HTML inyectado y recarga. Si algun archivo de codigo de la app cambio, corre los 13 escenarios completos. Reporta cantidad de requests, que se ve en pantalla y si hay Uncaught o unhandledrejection.

PASO 4 - Mejoras no bloqueantes
De la lista de la primera revision, indica cuales aplico y verifica que esten bien hechas:
JSDoc de construirCatalogo (script.js:933), imagen del modal en DPR 2, .catch en las llamadas a construirCatalogo (spinner + Uncaught), texto propio para catalogo vacio, sanitizarTexto con <script>, validacion duplicada con Proveedor, precioPromedio sin usar, timeout total de 16 s, presentacion duplicada y linea en blanco en script.js:923.
Si aplico alguna, verifica que no haya introducido un bug nuevo.

PASO 5 - Informe
Escribilo en espanol, sin tildes, en markdown y listo para pegar como review en GitHub, con esta estructura:

## Re-revision PR #147 - Dev Async / Fetch API
**Que revise:** commits nuevos (hash, mensaje), diff (archivos, +/-), comandos ejecutados y escenarios de Playwright.

### B1 - npm test con exit 0
Estado: Resuelto / No resuelto. Evidencia de cada criterio (salida de npm test, exit code, errores de consola, revision del stub y del fixture, prueba de spyOn).

### Cambios nuevos fuera de B1
Cada cambio, de quien es el archivo y si corresponde. Si toca archivos de otro rol fuera de lo autorizado, marcalo.

### Regresiones
"Ninguna", o el detalle con evidencia.

### Mejoras aplicadas
Cuales aplico y como quedaron.

### Mejoras pendientes (no bloqueantes)
Las que no aplico, en una linea cada una.

### Veredicto
Aprobado / Cambios requeridos, con justificacion. Si se aprueba, repeti el orden de merge recomendado: #147, libreria externa (actualizada con develop), testing, coordinacion, con Lighthouse TC12 entre el primer y el segundo merge.

Cerra con una linea que diga quien mergea (la autora, como hicimos con la #102 y la #104) y un reconocimiento corto para Caro.

Al final, FUERA del informe, agrega "Para la coordinadora" con:
- lo que no pudiste verificar y por que
- si algo cambio para Facundo o para el rol Tester respecto de la primera revision, con un mensaje corto para cada uno
```

##### Review 3 — PR #149, primera revisión (27/11/2026, 06:57)

- **Commit revisado:** `1954590` contra `develop` (`6aae3d8`).
- **Archivos del diff (9):** `js/charts/graficoService.js` (+34), `js/script.js` (+100/-1), `index.html` (+27), `js/test/test-runner.html` (+13), `docs/03-specs/segundo-parcial/spec-dev-libreria-externa.md` (+140), `docs/06-librerias/libreria-doc.md` (+79), `changelog.md` (+1) y las 2 capturas de `docs/06-librerias/screenshots/`.
- **Contexto de otros roles:** `spec-dev-async-fetch.md`, `spec-tester-qa-segundo-parcial.md`, `spec-dev-eventos-dom.md`, `js/api/apiService.js` y `js/utils/storage.js`.

```text
Soy la coordinadora del proyecto (y tambien tengo el rol Tester QA/JS). Tengo que revisar la PR de Facundo, rama `feature/dev-libreria-externa-chartjs`, contra `develop`.
Quiero una revision completa y verificada empiricamente, con el mismo nivel de detalle que la revision de la PR #147 (Dev Async / Fetch API).

REGLAS
- NO modifiques archivos del repo, NO hagas commits, NO mergees, NO comentes en GitHub. Solo lee, ejecuta y proba. Los scripts o pruebas temporales van fuera del repo y se borran al final.
- Todo lo que afirmes tiene que salir de algo que leiste o ejecutaste. Si algo no se pudo verificar, decilo explicitamente.
- Cita archivo y linea en cada hallazgo.
- Usa el MCP de GitHub para ver la PR y el MCP de Playwright para las pruebas E2E, si estan disponibles. Si no estan, decilo y usa la terminal.

PASO 1 - Contexto
1. Identifica el numero de la PR de esta rama, su descripcion (template, "Closes #...", labels, checks) y las issues asignadas a Facundo.
2. Lee ENTERO el spec de su rol (Librerias Externas / Chart.js, en docs/03-specs/segundo-parcial/), incluida la seccion de cierre (MOMENTO 2 / AL CERRAR): prompts usados, ajustes manuales y tabla de verificacion.
3. Lee tambien los specs con los que se cruza:
   - spec-dev-async-fetch.md (Caro): contrato de ApiService, en especial resumirCatalogo() y precioPromedio.
   - spec-tester-qa-segundo-parcial.md (rama feature/tester-qa-js-testing-suite): criterios de Lighthouse y de regresion.
   - el spec de Dev Eventos + DOM y los modelos de js/models/.

PASO 2 - Lectura del diff
1. `git fetch` y `git diff develop...feature/dev-libreria-externa-chartjs --stat`. Despues el diff completo, archivo por archivo.
2. Clasifica cada archivo como DENTRO o FUERA de su rol. Si es FUERA, indica de quien es (usa git log/blame en develop y los specs).
3. Marca especialmente si toca: js/api/apiService.js (Caro), js/models/, js/utils/storage.js, js/test/* o test-runner.html (rol Tester), package.json, CI, .gitignore, index.html fuera de lo necesario, o si borra o mueve archivos.

PASO 3 - Verificaciones especificas de una libreria externa (Chart.js)
- Carga de la libreria:
  - si viene de un CDN: version fija (no "latest"), atributos integrity (SRI) y crossorigin, y defer o carga diferida;
  - si viene en local: en que carpeta esta, si es la version minificada y si respeta la licencia (MIT, con el aviso conservado);
  - que se cargue antes de que se use y solo una vez.
- Fallback: que pasa si Chart.js no carga (CDN caido o bloqueado). Tiene que haber un chequeo tipo `typeof Chart === "undefined"`, un aviso amigable y la app tiene que seguir funcionando, sin ReferenceError ni Uncaught.
- Separacion de capas: el codigo del grafico solo presenta. Los datos tienen que salir de los modelos o de ApiService (por ejemplo resumirCatalogo / precioPromedio / Presupuesto), sin recalcular reglas de negocio ni duplicar validaciones. Tampoco puede haber fetch fuera de apiService.js ni storage fuera de storage.js.
- Contrato con la #147:
  - construirCatalogo() es async: si la usa, tiene que hacer await;
  - resumirCatalogo() devuelve un objeto sin prototipo: se recorre con Object.keys/Object.entries, nunca con hasOwnProperty;
  - #contenedor-catalogo tiene como primer hijo el bloque de resumen o de aviso;
  - el grafico tiene que funcionar tanto con datos de la API como con el fallback (DATOS_SEMILLA).
- Ciclo de vida del grafico: cuando cambian los datos (filtro de catalogo, Reintentar, recalculo de presupuesto, etc.) se usa chart.update() o chart.destroy() antes de crear otro. No puede aparecer "Canvas is already in use" ni acumularse instancias.
- Accesibilidad: <canvas> con role="img" y aria-label descriptivo, o una alternativa textual o tabla con los mismos datos. Colores con contraste suficiente que no dependan solo del color.
- Layout: el contenedor del grafico tiene alto reservado (maintainAspectRatio / alto fijo en CSS) para no generar CLS.
- Seguridad: sin innerHTML con datos (tampoco en tooltips o leyendas HTML personalizadas). Los labels que vengan de la API tienen que pasar por los datos ya sanitizados.
- Generales: sin prompt/alert/confirm, sin console.log, sin codigo comentado, sin URLs o claves hardcodeadas fuera de la carga de la libreria, async/await sin promesas sueltas y JSDoc en las funciones nuevas.

PASO 4 - Tests
- Corre `npm test` en la rama y en develop, 3 veces cada uno. Informa specs, failures, errores de consola y exit code.
- OJO: test-runner.html abre con file:// y termina con exit 1 ante cualquier console.error. Si script.js usa Chart y el runner no carga Chart.js, puede pasar lo mismo que con el B1 de la #147. Si pasa, explica la causa y propone la solucion, aclarando que test-runner.html es del rol Tester.
- Indica si agrego tests para su codigo y si corresponde que los agregue el o el rol Tester segun los specs.

PASO 5 - Verificacion empirica con Playwright
Servi el proyecto por HTTP bajo /planit/ (para imitar GitHub Pages) y proba en Chromium:
1. Carga normal: el grafico se renderiza, con que tipo, que datos, que labels y que valores. Compara los valores con lo que devuelven los modelos o ApiService.
2. Chart.js bloqueado (page.route abortando el CDN o el archivo local): aviso, app funcionando y 0 Uncaught.
3. API del catalogo en 500 / offline: el grafico usa los datos del fallback o muestra un estado coherente.
4. Catalogo vacio o JSON malformado.
5. Cambios de datos: filtrar el catalogo, Reintentar, recalcular presupuesto, cambiar el descuento. El grafico se actualiza sin duplicarse (conta las instancias de Chart y los <canvas>).
6. Datos con HTML inyectado (ej: "<b>Hacker</b>" como nombre o categoria): no se ejecuta y no aparece como HTML en tooltips ni leyendas.
7. Responsive: 1280x800 y 375x812. El grafico entra en pantalla y no rompe el layout.
8. Recarga: lo que tenga que persistir se restaura, y el grafico se reconstruye.
9. Consola en todos los escenarios: 0 pageerror y 0 unhandledrejection.

PASO 6 - Lighthouse (regresion contra el TC12)
- Con el criterio del spec del Tester: solo Desktop (--preset=desktop), 3 corridas y la mediana.
- Corre Lighthouse sobre develop y sobre la rama, servidas localmente en las mismas condiciones bajo /planit/.
- Referencia del TC12 en Pages: Performance 96, Accessibility 97, Best Practices 92, SEO 100, LCP 1,14 s, CLS 0,071, TBT 0 ms.
- Hay regresion si una categoria cae 5 puntos o mas, o si LCP, TBT o CLS cambian de calificacion. El LCP ya estaba cerca del limite: indica cuanto suma la libreria (peso transferido y tiempo).

PASO 7 - Integracion
- git merge-tree contra develop y contra feature/tester-qa-js-testing-suite: conflictos.
- Cuantos commits esta atras de develop.
- Orden de commits: el spec tiene que estar commiteado antes que el codigo.
- Changelog con la entrada y el link a la PR/issue, con el mismo formato que las anteriores.

PASO 8 - Informe
Escribilo en espanol, sin tildes, en markdown y listo para pegar como review en GitHub, con exactamente esta estructura:

## Revision PR #<n> - Libreria Externa / Chart.js
**Revision completa:** que leiste y que ejecutaste (specs, diff con archivos y +/-, busquedas, npm test, Playwright con cuantos escenarios, Lighthouse, contra que ramas).

### Lo que cumple
Cada punto con evidencia concreta: que probaste, con que entrada y que resultado obtuviste.

### Cambios bloqueantes para el codigo de esta PR
Si no hay, escribi "Ninguno."

### Cambios que pisan otros roles
Tabla: Archivo | Que cambio | Rol/persona afectada | Severidad (Bloqueante / Consultar / Menor) | Accion sugerida. Si no hay, decilo.

### Punto(s) de coordinacion entre PRs/roles (no son bugs de Facundo)
Que asume cada parte, el impacto, la propuesta con codigo y quien la aplica.

### Mejoras no bloqueantes

### Pendiente de otros roles (no es responsabilidad de Facundo)

### Veredicto
Aprobado / Aprobado con cambios / Cambios requeridos, con la justificacion y el orden de merge recomendado.

Cerra con una linea sobre quien mergea (el autor, como en las PRs anteriores) y un reconocimiento corto para Facundo.

Al final, FUERA del informe, agrega "Para la coordinadora" con:
- lo que no pudiste verificar y por que
- mensajes cortos para cada integrante afectado (Caro, el rol Tester, el owner del repo)
- borradores de issues para lo que corresponda a otros roles (titulo, descripcion, criterio de aceptacion, rol)
```

##### Review 4 — PR #149, re-revisión (27/11/2026, 17:16)

- **Commit revisado:** `1004123`.
- **Archivos del diff:** `js/script.js` (+59/-17), `index.html` (+19/-4), `js/test/test-runner.html` (+12/-4), `spec-dev-libreria-externa.md` (+25/-6), `docs/06-librerias/libreria-doc.md` (+25/-17) y las 2 capturas.
- **Contexto de otros roles:** `spec-tester-qa-segundo-parcial.md` (criterio de regresión de Lighthouse), `spec-dev-eventos-dom.md`, `js/api/apiService.js` y `js/utils/storage.js`.

```text
Soy la coordinadora (y tambien tengo el rol Tester QA/JS). Tengo que hacer la re-review de la PR #149 de Facundo (rama `feature/dev-libreria-externa-chartjs`, Libreria Externa / Chart.js).
En la primera revision puse "Cambios requeridos" con 5 bloqueantes (B1 a B5). Facundo dice que los resolvio en el commit 1004123. OJO: la review se publico cortada y el solo vio completo el detalle de B1; B2 a B5 los interpreto. Verifica cada uno contra lo que se pidio de verdad (abajo), no contra su descripcion. Si lo resolvio distinto de lo propuesto pero cumple el objetivo, dalo por resuelto.

REGLAS
- NO modifiques archivos del repo, NO hagas commits, NO mergees, NO comentes en GitHub. Solo lee, ejecuta y proba.
- Todo lo que afirmes tiene que salir de algo que leiste o ejecutaste. Si algo no se pudo verificar, decilo.
- Cita archivo y linea en cada hallazgo.
- Guarda scripts y resultados crudos en C:\Users\valer\OneDrive\Escritorio\rereview-chartjs\ (fuera del repo, no en la carpeta temporal).

LO QUE SE PIDIO EN CADA BLOQUEANTE
- B1: contenedor con alto fijo y `maintainAspectRatio: false` en los dos graficos. Antes: dona de 686x686 a 1280 px, seccion Presupuesto de 1315 px y CLS 0,124 (develop: 0,071), es decir, regresion segun spec-tester-qa-segundo-parcial.md:148. La correccion propuesta (280 px / 240 px) dio CLS 0,062. El uso 220 px / 180 px.
- B2: si la cantidad o el descuento son invalidos (recalcularPresupuesto hacia return antes de actualizarGraficoPresupuesto), el grafico no puede mostrar datos viejos.
- B3: cuando no hay grafico (Chart.js bloqueado, catalogo en fallback, cantidades en 0, filtro sin resultados) se oculta el canvas con role="img" y se muestra un aviso. Propuesta: pintarGrafico() + <p id="...-aviso">. En fallback, el texto "El grafico estara disponible cuando se cargue el catalogo actualizado."
- B4: sin aritmetica de negocio en js/script.js (Regla 1, spec-dev-eventos-dom.md:253 y :312). Antes sumaba subtotales por categoria en el controlador (script.js:842-845). Ahora dice que usa `resultado.subtotales` del modelo.
- B5: cargar dist/chart.umd.js de Chart.js 4.4.7 (no chart.umd.min.js, que jsDelivr genera al vuelo) con integrity sha384 + crossorigin="anonymous" + defer, en index.html y en js/test/test-runner.html. El hash verificado en la primera revision fue: sha384-zYPBGXwO4633CABX/5Spf6emCKUJCfoOkhOMYyxMsatqQZPnDblmmOewfjsIVWCM . Facundo calculo el suyo sobre el paquete npm.

PASO 1 - Que cambio
1. `git fetch` y `git log --oneline` de los commits nuevos desde la primera revision (autor, fecha, mensaje). Despues `git diff <commit revisado antes>..feature/dev-libreria-externa-chartjs --stat` y el diff completo, archivo por archivo.
2. Si develop avanzo, verifica con git merge-tree que no haya conflictos contra develop ni contra feature/tester-qa-js-testing-suite.
3. Clasifica cada archivo nuevo o modificado como DENTRO o FUERA de su rol. Fijate en especial si toco js/models/ (por ejemplo, para agregar `subtotales`): si lo hizo, es rol Dev POO y hay que marcarlo. Si `subtotales` ya existia en develop, citalo.
4. Lee la PR #149 por la API publica de GitHub (comentarios nuevos y estado).

PASO 2 - Verificar cada bloqueante
- B1: medi con Playwright el tamano de los dos graficos y el alto de la seccion Presupuesto en 375, 1280 y 1920 px. Confirma que la dona se lea bien a 220 px (leyenda incluida, sin cortes). Lighthouse Desktop, 3 corridas en develop y 3 en la rama, servidas localmente bajo /planit/: mediana de CLS, LCP, TBT y los 4 puntajes. Aplica el criterio de regresion del spec del Tester.
- B2: cantidad -1, cantidad vacia, descuento 150 y descuento -5. El grafico no puede mostrar los datos anteriores. Despues de corregir el valor, vuelve con los datos correctos. Verifica tambien el caso de "catalogo recargando" que agrego el.
- B3: Chart.js bloqueado, API 500/offline (fallback), todas las cantidades en 0 y filtro "zzzz". En cada caso: canvas oculto (no visible ni anunciado), aviso visible con texto coherente, sin huecos en blanco, y que al volver a tener datos el grafico reaparezca y el aviso se oculte.
- B4: grep en js/script.js de operaciones aritmeticas sobre datos de negocio (+, -, *, /, reduce, acumuladores) en las funciones de graficos. Confirma de donde salen los datos de la dona y que coincidan con el modelo: [420000, 70000, 48000, 32000, 10000], y con Catering en 10 -> 35000. Explica que pasaria con dos items de la misma categoria.
- B5: confirma URL, version, integrity, crossorigin y defer en los dos archivos. Descarga el archivo que sirve jsDelivr, calcula su sha384 y compara con el integrity. En el navegador (Playwright, servido por HTTP): Chart carga, `typeof Chart !== "undefined"` y 0 errores "Failed to find a valid digest". Proba tambien con un hash alterado para confirmar que el navegador lo bloquea.

PASO 3 - Regresiones
- Repeti las busquedas estaticas (console.log, alert/prompt/confirm, innerHTML, fetch( fuera de apiService.js, storage fuera de storage.js, hasOwnProperty, URLs, codigo comentado) y JSDoc en las funciones nuevas.
- Repeti los 16 escenarios de Playwright de la primera revision: datos correctos, filtros, ciclo de vida (Chart.instances y <canvas> no se acumulan, sin "Canvas is already in use"), Chart.js bloqueado, API 500/offline/vacia/JSON malformado, XSS por API y por localStorage, recarga, responsive sin scroll horizontal y consola con 0 pageerror y 0 unhandledrejection.
- `npm test` 3 veces en la rama y 3 en develop: specs, failures, errores de consola y exit code. Con Chart.js bloqueado, informa tambien el exit code (el runner sin red es tarea del rol Tester, no lo cuentes como bloqueante).

PASO 4 - Spec y documentacion
- Revisa el MOMENTO 2 actualizado y libreria-doc.md: que describan lo que hace el codigo (nombre chart.umd.js, altos reales, que la dona no refleja el descuento), que el uso de Claude quede registrado con el prompt y que las mejoras no bloqueantes queden anotadas.
- Revisa que las 2 capturas actualizadas coincidan con la app actual.

PASO 5 - Informe
En espanol, sin tildes, en markdown y listo para pegar como review en GitHub. NO uses tablas dentro de listas (se rompen al pegar); si necesitas una tabla, que quede suelta.

## Re-revision PR #149 - Libreria Externa / Chart.js
**Que revise:** commits nuevos (hash, mensaje), diff (archivos, +/-), comandos, escenarios de Playwright y corridas de Lighthouse.

### Estado de los bloqueantes
B1 a B5: **Resuelto / Resuelto parcialmente / No resuelto**, con evidencia concreta (medidas, valores, consola, salida de comandos).

### Cambios nuevos fuera de los bloqueantes
Cada cambio, de quien es el archivo y si corresponde.

### Regresiones
"Ninguna", o el detalle con evidencia.

### Mejoras no bloqueantes
Las que siguen pendientes, en una linea cada una.

### Veredicto
Aprobado / Cambios requeridos, con justificacion. Si se aprueba: orden de merge (#149, despues feature/tester-qa-js-testing-suite actualizada con develop y library.spec.js, y despues el TC13 sobre Pages).

Cerra con una linea que diga que mergea el autor y un reconocimiento corto para Facundo.

Mostra el informe COMPLETO en el chat y guardalo tambien en C:\Users\valer\OneDrive\Escritorio\re-review-pr-149.md.

Al final, FUERA del informe, agrega "Para la coordinadora" con: lo que no pudiste verificar y por que, si algo cambio para Caro o para el rol Tester, y mensajes cortos para cada uno.
```

##### Review 5 — PR #149, revisión final (27/11/2026, 18:55)

- **Commit revisado:** `eb42cd8` (diff `1004123..eb42cd8`: 2 archivos, +12/-2).
- **Archivos del diff:** `docs/03-specs/segundo-parcial/spec-dev-libreria-externa.md` (+3/-2) y `docs/06-librerias/libreria-doc.md` (+9).
- **Contexto (cruce con el código):** `js/script.js`, `index.html` y `js/test/test-runner.html`; el `chart.umd.js` de jsDelivr (sha384) y el `LICENSE.md` de `chartjs/Chart.js` en `master` y en el tag `v4.4.7`.

```text
Soy la coordinadora. Tengo que hacer la tercera revision de la PR #149 de Facundo (rama `feature/dev-libreria-externa-chartjs`). En la re-review anterior B1 a B5 quedaron resueltos y puse "Cambios requeridos" solo por B6 (documentacion). Facundo dice que lo resolvio en eb42cd8. Esta revision se limita a B6.

REGLAS
- NO modifiques archivos, NO hagas commits, NO mergees, NO comentes en GitHub.
- Todo lo que afirmes tiene que salir de algo que leiste o ejecutaste. Cita archivo y linea.

LO QUE SE PIDIO EN B6
1. spec-dev-libreria-externa.md, linea 111: decia "no se encontraron bugs durante la integracion" y contradecia la seccion 5, que documenta B1-B5. Tiene que reflejar lo que paso (los 5 problemas, donde estan documentados y el commit 1004123).
2. libreria-doc.md tiene que tener:
   - Licencia: Chart.js 4.4.7, MIT, link a la licencia oficial y la aclaracion de que el banner MIT se conserva en el archivo del CDN.
   - Limitaciones y fallback: Chart.js no disponible (aviso en #aviso-grafico-*), dona con subtotales sin descuento, categorias repetidas como porciones separadas y catalogo sin grafico en modo fallback.
Criterio: el spec sin contradicciones y libreria-doc.md con las dos secciones, sin tocar codigo.

PASOS
1. `git fetch`, `git log --oneline 1004123..feature/dev-libreria-externa-chartjs` y `git diff 1004123..feature/dev-libreria-externa-chartjs --stat`. Confirma que SOLO cambiaron archivos de documentacion de su rol. Si cambio algun .js, .html o .css, o un archivo de otro rol, marcalo.
2. Lee el diff completo de los dos archivos y verifica cada punto de B6.
3. Verifica que lo que dice la documentacion coincida con el codigo actual: los textos de los avisos de #aviso-grafico-* en js/script.js, la version y la URL de Chart.js en index.html, y los altos 220/180 px.
4. Verifica que el link de la licencia apunte al repositorio oficial de Chart.js (chartjs/Chart.js) y a la version o rama correcta.
5. Facundo dice que reordeno el bloque B6 dentro de la seccion 5 del spec: confirma que solo movio texto y que no borro informacion.
6. Lee todo el spec una vez mas buscando otras contradicciones (por ejemplo, chart.umd.min.js, los altos viejos o que la dona refleja el descuento).
7. Corre `npm test` una vez: 330 specs, 0 failures, exit 0.
8. Fijate si develop avanzo y, si avanzo, corre git merge-tree para confirmar que no hay conflictos.

INFORME
En espanol, sin tildes, en markdown, listo para pegar como review en GitHub, corto y SIN tablas:

## Revision final PR #149 - Libreria Externa / Chart.js
**Que revise:** commit, archivos del diff y comandos.

### B6 - Estado
Resuelto / No resuelto, con evidencia de cada punto (cita las lineas nuevas).

### Otros cambios
"Ninguno", o el detalle.

### Veredicto
Aprobado / Cambios requeridos. Si se aprueba: "Los 6 bloqueantes (B1-B6) estan resueltos". Orden de merge: #149, despues feature/tester-qa-js-testing-suite actualizada con develop y con library.spec.js, y despues el TC13 sobre Pages. Que mergea el autor y un reconocimiento corto para Facundo.

Mostra el informe COMPLETO en el chat y guardalo en C:\Users\valer\OneDrive\Escritorio\review-final-pr-149.md.
```

#### 2.2. Resumen de cada review

Para cada PR: qué se validó, qué Request Changes se cargaron y en qué archivos y líneas del diff.

> **Sobre las líneas del diff:** los Request Changes se cargaron **en el cuerpo de cada review**, citando archivo y línea; **no se cargaron como comentarios inline** sobre el diff (la API de GitHub devuelve 0 comentarios de review en las PRs #147 y #149). Ver la sección 4, obstáculo 6.

##### PR #147 — Review 1: Cambios requeridos ([enlace](https://github.com/carolabenvenuto-uces/planit/pull/147#pullrequestreview-6067377822), 25/11 22:35)

**Qué se validó:**

- 13 escenarios E2E con Playwright, simulando la API con `page.route`: respuesta OK, respuesta vacía (`{proveedores: []}` y `[]`), 404, 500, offline (1 reintento), respuesta lenta (spinner y controles deshabilitados), timeout, JSON malformado, HTML inyectado (0 etiquetas y 0 atributos `on*` en el DOM), doble clic en Reintentar (1 sola request), cargas concurrentes (gana la más reciente, `versionCargaCatalogo`) y recarga de la página. 0 `pageerror` y 0 `unhandledrejection`.
- Búsquedas estáticas: el único `fetch` está en `js/api/apiService.js`; 0 accesos a storage fuera de `js/utils/storage.js`; 0 `prompt`/`alert`/`confirm`; 0 `innerHTML` con datos; 0 URLs o claves hardcodeadas; todo con async/await.
- `fetchData` (`apiService.js:13-41`): chequea `respuesta.ok` (línea 36), separa errores de red, HTTP y JSON inválido, y usa `AbortController` (línea 23).
- Contratos con `Validador`, `Proveedor` y `CatalogoProveedores`: sin desacoples. Spec commiteado antes que el código (`b2da80c` contra `caebdcc`). Changelog con links a #147 y #138.

**Request Changes:**

| Id | Hallazgo | Archivo y línea |
| --- | --- | --- |
| B1 | `npm test` termina con **exit 1** (en `develop`, exit 0) aunque pasan los 330 specs: 100 errores de consola, porque `run-jasmine.js` abre el runner con `file://` y ahí `fetch` no funciona (67 × "URL scheme \"file\" is not supported"). Corrección pedida: stub de `fetch` en el runner, antes de `apiService.js`, con OK del rol Tester. | `js/test/test-runner.html` (~132), `js/api/apiService.js`, `js/test/run-jasmine.js` |

**Mejoras no bloqueantes:** JSDoc de `construirCatalogo` mal ubicado (`js/script.js:933`), imagen del modal con DPR 2 (`js/script.js:1174` y `:1454`), spinner que queda girando si falla el fallback (`js/script.js:915`, `:976`, `:1064`), `sanitizarTexto` deja visible el contenido de un `<script>` (`apiService.js:94-98`), validación duplicada con `Proveedor` (`apiService.js:80-87`), `precioPromedio` sin uso (`apiService.js:151-153`), timeout total de 16 s (`apiService.js:15` y `:23`), presentación duplicada (`js/script.js:118-145`) y línea en blanco (`js/script.js:923`).

##### PR #147 — Review 2: Aprobada ([enlace](https://github.com/carolabenvenuto-uces/planit/pull/147#pullrequestreview-6076500591), 26/11 12:09)

- **B1 resuelto:** `npm test` con exit 0, 330 specs, 0 failures y 0 errores de consola en 5 de 5 corridas. El stub está antes de `apiService.js`, con un fixture idéntico a `api/proveedores.json`, no llega a la app y `spyOn(window, "fetch")` lo puede pisar.
- **6 mejoras aplicadas:** JSDoc (`js/script.js:941-946`), imagen original en el modal (`obtenerImagenModal`, `js/script.js:1121-1130`), `.catch` en la carga (`iniciarCargaCatalogo`, `js/script.js:927-936`), sanitización de `<script>`/`<style>`, timeout de 5 s por intento (10,3 s hasta el fallback) y línea en blanco.
- Sin regresiones en los 13 escenarios E2E.
- **Pendiente menor:** el spinner sigue girando si también falla el fallback (`js/script.js:933-935`). Después se registró como issue [#151](https://github.com/carolabenvenuto-uces/planit/issues/151).

##### PR #149 — Review 3: Cambios requeridos ([enlace](https://github.com/carolabenvenuto-uces/planit/pull/149#pullrequestreview-6086662536), 27/11 07:21; detalle completo en el [comentario del 27/11 17:14](https://github.com/carolabenvenuto-uces/planit/pull/149))

**Qué se validó:** contrato con la #147 (recorre el resumen con `Object.keys`/`values`/`entries`, `js/script.js:1113`, `:1151`, `:1154`), ciclo de vida (`GraficoService.renderizar()` destruye antes de crear, `js/charts/graficoService.js:15-21`), Chart.js bloqueado sin errores (`graficoService.js:16`), versión fija 4.4.7 con `defer` y una sola carga (`index.html:462`), `role="img"` y `aria-label` en los canvas (`index.html:158`, `:240`), `Closes #148`, changelog y spec commiteado antes que el código (`fce9b83` antes de `5ce2484`).

**Request Changes:**

| Id | Hallazgo | Archivo y línea |
| --- | --- | --- |
| B1 | La dona no tiene alto reservado: `responsive: true` sin `maintainAspectRatio: false`; la dona mide 686×686 a 1280 px y el **CLS pasa de 0,071 a 0,124** ("necesita mejoras"): regresión según el spec del Tester. | `js/script.js:853-856`, `index.html:158` |
| B2 | El gráfico de presupuesto muestra datos viejos cuando la cantidad o el descuento son inválidos: `recalcularPresupuesto` hace `return` antes de actualizar el gráfico. | `js/script.js:803-806`, `:823-827`, `:831` |
| B3 | Sin datos no se avisa nada y queda un canvas vacío con `role="img"`: `renderizar()` devuelve `null` en silencio. | `js/charts/graficoService.js:16`, `js/script.js:1108` |
| B4 | El controlador hace aritmética de negocio (suma subtotales por categoría), contra la Regla 1 de la arquitectura. | `js/script.js:842-845` |
| B5 | Chart.js se carga sin SRI ni `crossorigin`, desde `chart.umd.min.js`, que no existe en el paquete 4.4.7 (jsDelivr lo genera al vuelo). | `index.html:462`, `js/test/test-runner.html:194` |

**Coordinación entre roles:** gráfico del catálogo en modo fallback (criterio de `spec-dev-async-fetch.md:158-160`), dependencia del runner de los CDN (la resuelve el rol Tester con `js/test/vendor/`) y, opcional, `subtotalesPorCategoria()` en el modelo `Presupuesto`.

##### PR #149 — Review 4: Cambios requeridos ([enlace](https://github.com/carolabenvenuto-uces/planit/pull/149#pullrequestreview-6093130376), 27/11 17:36)

- **B1 resuelto:** contenedores de alto fijo (`index.html:161`, 220 px, e `index.html:248`, 180 px) y `maintainAspectRatio: false` (`js/script.js:887` y `:1200`). CLS de 0,124 a **0,061** ("bueno"), sin regresión.
- **B2 resuelto:** `bloquearResultadoPresupuesto()` destruye el gráfico y muestra un aviso (`js/script.js:905-913`); al recargar el catálogo aparece "Cargando el gráfico del catálogo…" (`js/script.js:1018`).
- **B3 resuelto:** `pintarGrafico()` (`js/script.js:851`) oculta el canvas y muestra `#aviso-grafico-*` (`index.html:163` y `:250`, `role="status"`).
- **B4 resuelto:** la dona usa `resultado.subtotales` del modelo (`js/script.js:882-883`).
- **B5 resuelto:** `chart.umd.js` con `integrity` sha384 y `crossorigin` en `index.html` y en `js/test/test-runner.html:200-202`.
- `npm test`: 330 specs, 0 failures, exit 0 en 3 corridas.

**Request Change nuevo:**

| Id | Hallazgo | Archivo y línea |
| --- | --- | --- |
| B6 | La documentación del rol se contradice: el spec dice "no se encontraron bugs durante la integración" y su sección 5 documenta B1-B5; `libreria-doc.md` no tiene licencia ni limitaciones (ya pedido en la review 3). | `spec-dev-libreria-externa.md:111`, `docs/06-librerias/libreria-doc.md` |

##### PR #149 — Review 5: Aprobada ([comentario de revisión final](https://github.com/carolabenvenuto-uces/planit/pull/149#pullrequestreview-6093745381), 27/11 18:59; [aprobación](https://github.com/carolabenvenuto-uces/planit/pull/149#pullrequestreview-6093765822), 27/11 19:01)

- **B6 resuelto** en `eb42cd8`: `spec-dev-libreria-externa.md:111` nombra los 5 problemas y el commit `1004123`; B6 agregado en `:127`.
- `libreria-doc.md:66-67` (Licencia): Chart.js 4.4.7, MIT, link al `LICENSE.md` oficial (idéntico en `master` y en `v4.4.7`) y banner MIT conservado; el sha384 coincide con el `integrity` de `index.html:476`.
- `libreria-doc.md:69-73` (Limitaciones y fallback): los 4 casos coinciden con el código (`js/script.js:838`, `:857`, `:882-883`, `:1147-1148`).
- Sin cambios de código ni de otros roles; `npm test` 330/0, exit 0; sin conflictos con `develop` ni con la rama del Tester.
- No bloqueante: `spec-dev-libreria-externa.md:35` (MOMENTO 1) todavía dice que el gasto por categoría se "calcula en js/script.js".

##### PR #152 (Tester QA/JS) — revisión cruzada

La PR del rol Tester (de quien suscribe) la revisó @carolabenvenuto-uces el 27/11 a las 20:27 con **Cambios requeridos** ([enlace](https://github.com/carolabenvenuto-uces/planit/pull/152#pullrequestreview-6094252589)): falta la entrada en `changelog.md`, los dos `testing-doc.md` sin actualizar, MOMENTO 2 incompleto, MOMENTO 1 modificado después de los tests (`7ece489`), issues faltantes y veredicto de Best Practices contradictorio con el umbral ≥ 95. [COMPLETAR: resolución, re-revisión y aprobación]

**Total:** 5 reviews con IA sobre 2 PRs de otros roles (#147 y #149), con 3 rondas de Request Changes (B1 en la #147; B1-B5 y B6 en la #149), todas resueltas antes del merge. [COMPLETAR: reviews con IA sobre las PRs #152 y de coordinación, si las revisora usa IA, para llegar al mínimo de 4 PRs de la rúbrica]

---

### 3. Detalle de la Fase 2 (Request Changes del docente)

Tabla con cada Request Change, su issue, prioridad, rol asignado, rama/PR de corrección y estado. Las reasignaciones se registran con su justificación y fecha.

> Se completa a partir de la revisión docente de la PR de release. Plazo: 30/11/2026, 22:00.

**Flujo aplicado a cada RC** (sección 3 del MOMENTO 1): RC del docente → issue con prioridad, asignada al rol dueño → rama `fix/<rol>-rc<N>-<descripcion>` desde `release/segundo-parcial` → PR contra `release/segundo-parcial` con `Closes #N` → entrada en `### Fixed` del `changelog.md` → ✅ (`:white_check_mark:`) en el hilo de Slack → nueva revisión, hasta el LGTM → merge a `master` con `:pr-merged:` → release `v2.0-segundo-parcial` → backport a `develop`.

#### 3.1. Request Changes recibidos

| RC | Descripción (resumen del comentario docente) | Archivo / línea | Prioridad | Rol asignado | Issue | Rama `fix/` | PR | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RC1 | | | | | | | | |

#### 3.2. Reasignaciones

| Fecha | RC | De | A | Justificación |
| --- | --- | --- | --- | --- |
| — | — | — | — | Sin reasignaciones hasta el momento. |

#### 3.3. Rondas de corrección y notificaciones en Slack

| Ronda | Fecha | RC resueltos | PRs | Notificación ✅ en Slack |
| --- | --- | --- | --- | --- |
| 1 | | | | |

#### 3.4. Cierre

| Paso | Evidencia | Fecha |
| --- | --- | --- |
| LGTM y approve del docente en GitHub | | |
| Merge `release/segundo-parcial` → `master` (`:pr-merged:`) | | |
| Tag y GitHub Release `v2.0-segundo-parcial` | | |
| Backport `backport/release-segundo-parcial` → `develop` (`:pr-merged:` "BACKPORT completado") | | |

---

### 4. Obstáculos encontrados y cómo se resolvieron

1. **La primera review de la #149 se publicó cortada.** El informe se pegó en GitHub como HTML desde la vista previa del editor (el cuerpo publicado empieza con `<html><body><!--StartFragment-->`) y se perdió el texto desde la mitad de B1 hasta la tabla de roles. Facundo corrigió B2-B5 interpretándolos a partir del veredicto y las referencias sueltas, y lo avisó en la PR (27/11 15:12). **Resolución:** se publicó el detalle completo de B1-B5 como comentario (27/11 17:14) y la re-review verificó cada bloqueante contra lo que se había pedido de verdad, no contra la descripción del commit. Los 5 estaban resueltos. La re-review también se pegó como HTML, pero se publicó completa (incluye B6 y el veredicto), y la revisión final se publicó como texto plano.
2. **Sin GitHub CLI (`gh`) en el equipo de la Coordinadora.** El prompt de la primera review de la #147 pedía `gh pr list`/`gh pr view`, y `gh` no está instalado. **Resolución:** el estado de PRs, reviews e issues se leyó con la API REST pública de GitHub (`curl`, solo lectura) y con `git fetch`/`git log` sobre el remoto. La API sin autenticación no permite leer la configuración de GitHub Pages ni los GitHub Projects (ver obstáculo 5).
3. **El test runner dependía de los CDN y de la red.** Con `file://`, el `fetch` de la #147 dejaba `npm test` en exit 1 (B1 de la #147, resuelto con un stub de `fetch` en `test-runner.html`). Con Chart.js bloqueado, el runner daba 330/0 pero exit 1 por un `console.error` del navegador (punto de coordinación de la #149). **Resolución:** el rol Tester incorporó copias locales con hash verificado en `js/test/vendor/` (PR #152).
4. **El primer informe de la #147 no tenía el formato pedido.** La IA devolvió un resumen y no el informe completo para publicar. **Resolución:** se pidió reescribirlo con la estructura exacta de la review de la #104 (prompts de seguimiento en la sección 2.1). A partir de la #149, el prompt ya incluye la estructura del informe.
5. **Permisos de owner.** El repositorio es de la cuenta personal de @carolabenvenuto-uces: el cambio de rama de GitHub Pages y el tablero de GitHub Projects dependen de ella (sección 5 del MOMENTO 1). [COMPLETAR: confirmar si hubo demoras con el cambio de Pages a `release/segundo-parcial` y dejar el link del tablero "PlanIT - Segundo Parcial"]
6. **Request Changes sin comentarios inline.** El plan (sección 4) y la rúbrica piden cargar los Request Changes como comentarios inline en el diff, pero se publicaron en el cuerpo de la review citando archivo y línea; la API de GitHub devuelve 0 comentarios de review en #147 y #149. [COMPLETAR: si se agregan los comentarios inline sobre las líneas citadas en la sección 2.2, registrar fecha y enlaces]
7. **Integración comprimida al final del plazo.** La #149 se mergeó el 27/11 a las 19:42, después de tres rondas de review, y la #152 recibió Cambios requeridos a las 20:27 del día de la entrega. **Resolución:** las rondas de review de la #149 se hicieron el mismo día (07:21, 17:36 y 19:01) y se priorizaron los entregables obligatorios de la consigna. [COMPLETAR: cómo se cerró la #152]
8. **Issues verificadas pero abiertas.** [#141](https://github.com/carolabenvenuto-uces/planit/issues/141), [#143](https://github.com/carolabenvenuto-uces/planit/issues/143) y [#144](https://github.com/carolabenvenuto-uces/planit/issues/144) se resolvieron en la #147 (`80bfb5c`) y la review de la #147 lo verificó, pero siguen abiertas porque la PR no las cerraba con `Closes`. [COMPLETAR: cerrarlas con el comentario de verificación]

---

### 5. Checklist de cierre

Estado de los criterios de aceptación de la consigna (sección 4.4) y del MOMENTO 1 al 27/11/2026, con la evidencia correspondiente.

**Fase 1 — Desarrollo**

- [x] `spec-coord-devops-segundo-parcial.md` (MOMENTO 1) commiteado antes de cualquier tarea de coordinación: `00f4693`, 25/11 15:28; la primera review con IA es del 25/11 22:35.
- [x] Correcciones de la AO4 aplicadas en `release/cuarta-entrega` mediante PRs `fix/` ([#116](https://github.com/carolabenvenuto-uces/planit/pull/116) a [#136](https://github.com/carolabenvenuto-uces/planit/pull/136)), documentadas en `[Fixed]` del `changelog.md`, LGTM y merge a `master` ([#115](https://github.com/carolabenvenuto-uces/planit/pull/115), 25/11 09:32).
- [x] Backport de la AO4 a `develop`: [#137](https://github.com/carolabenvenuto-uces/planit/pull/137) (`backport/release-cuarta-entrega`), 25/11 09:54.
- [x] PR #147 revisada con IA y mergeada en 1.er lugar (26/11 12:12).
- [x] PR #149 revisada con IA, actualizada con `develop` y mergeada en 2.° lugar (27/11 19:42).
- [ ] PR #152 (Tester) revisada por otro integrante y mergeada en 3.er lugar. Hoy: Cambios requeridos.
- [ ] PR de coordinación revisada por otro integrante y mergeada en 4.° lugar.
- [ ] Mínimo de 4 PRs revisadas con IA y Request Changes inline en el diff. Hoy: 5 reviews con IA sobre 2 PRs (#147 y #149), con los Request Changes en el cuerpo de la review (ver obstáculo 6).
- [x] Suite en verde en `develop` después de cada merge: 330 specs, 0 failures, exit 0 (reviews 2 y 5, y esta rama después del merge de la #149).
- [ ] Issues del parcial administradas en el tablero "PlanIT - Segundo Parcial". [COMPLETAR: link al tablero]
- [x] `changelog.md` con la contribución de cada integrante y los links a PRs e issues (entradas de #147, #149, #152 y esta PR).
- [x] `.github/PULL_REQUEST_TEMPLATE/feature-template.md` y `release-template.md` actualizados para el Segundo Parcial.
- [x] `README.md` actualizado: funcionalidades, instalación y uso, enlaces a la documentación, tecnologías y librerías.
- [ ] `release/segundo-parcial` creada desde `develop`.
- [ ] GitHub Pages publicando desde `release/segundo-parcial` y verificado. Hoy el sitio responde 200 y sirve el contenido de `develop` posterior a la #149 (Chart.js 4.4.7 con SRI y `api/proveedores.json`).
- [ ] PR de release publicada en Slack (#2026-2do-cuat-pw1) y enlace subido al campus por los 3 integrantes antes del 27/11 a las 23:55.

**Fase 2 — Corrección (hasta el 30/11/2026, 22:00)**

- [ ] Todos los Request Changes del docente analizados, con una issue por corrección, asignada y priorizada.
- [ ] Correcciones aplicadas sobre `release/segundo-parcial` mediante PRs `fix/`, documentadas en `[Fixed]`.
- [ ] Notificación ✅ en Slack después de cada ronda.
- [ ] LGTM y approve del docente en GitHub.
- [ ] Merge de `release/segundo-parcial` a `master`, notificado con `:pr-merged:`.
- [ ] Tag y GitHub Release `v2.0-segundo-parcial` publicados.
- [ ] Backport de `release/segundo-parcial` a `develop`, notificado en Slack.
