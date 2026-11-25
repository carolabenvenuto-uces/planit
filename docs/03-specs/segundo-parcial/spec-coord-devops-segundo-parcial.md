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

### 1. PRs integradas y orden real de merge

_Pendiente._

### 2. Code reviews asistidos con IA

#### 2.1. Prompts exactos y archivos del diff adjuntados

Para cada review se registra el prompt exacto usado (en bloque de código) y la lista de archivos del diff que se adjuntaron como contexto.

_Pendiente._

#### 2.2. Resumen de cada review

Para cada PR: qué se validó, qué Request Changes se cargaron y en qué archivos y líneas del diff.

_Pendiente._

### 3. Detalle de la Fase 2 (Request Changes del docente)

Tabla con cada Request Change, su issue, prioridad, rol asignado, rama/PR de corrección y estado. Las reasignaciones se registran con su justificación y fecha.

_Pendiente._

### 4. Obstáculos encontrados y cómo se resolvieron

_Pendiente._

### 5. Checklist de cierre

_Pendiente._
