# Especificación Técnica (Spec) - Coordinador / DevOps

- **Proyecto:** PlanIT - Plataforma All-in-One de Organización & Experiencias
- **Entrega:** Primer Parcial
- **Rol:** Coordinador / DevOps
- **Responsable:** @FacundoGuiraldes
- **Rama:** feature/coord-devops-update-figma-and-readme
- **Issue principal:** [#49](https://github.com/carolabenvenuto-uces/planit/issues/49)
- **Fecha:** 5 de octubre de 2026

---

## MOMENTO 1: Planificación Previa (ANTES de comenzar)

### 1. Qué se va a hacer
Actualización del mockup en Figma para reflejar la migración del proyecto a Bootstrap (grilla de 12 columnas, breakpoints y componentes avanzados), exportación del diseño a `docs/01-mockup/disenio-bootstrap.png` y actualización de `README.md` con el enlace al archivo de Figma. Coordinación de la integración de las ramas `feature/` hacia `develop`, realización de al menos 4 Code Reviews asistidos con GitHub Copilot Agent Mode (cargando Request Changes en las líneas del diff), administración de las issues del equipo en un tablero Kanban de GitHub Projects, mantenimiento de `changelog.md`, preparación de la rama `release/primer-parcial`, publicación en GitHub Pages, limpieza de ramas y versionado con el tag estándar `v1.0.0`, cuya creación queda pendiente del LGTM docente.

### 2. Correcciones de la Actividad Obligatoria N°2
Los Request Changes marcados por el docente en la PR [#35](https://github.com/carolabenvenuto-uces/planit/pull/35) se resolvieron con ramas `fix/` creadas desde `release/actividad-obligatoria-2`, cada una con su PR y su entrada bajo `[Fixed]` en `changelog.md`:

| Request Change | Rama | PR |
| --- | --- | --- |
| RC1 | `fix/devops-rc1-changelog` | [#36](https://github.com/carolabenvenuto-uces/planit/pull/36) |
| RC3 | `fix/devops-rc3-github-pages` | [#37](https://github.com/carolabenvenuto-uces/planit/pull/37) |
| RC8 | `fix/devops-rc8-verificacion-integracion` | [#38](https://github.com/carolabenvenuto-uces/planit/pull/38) |
| RC5, RC6 | `fix/qa-rc5-rc6-orden-testing` | [#39](https://github.com/carolabenvenuto-uces/planit/pull/39) |
| RC7 | `fix/qa-rc7-test-cases-momentos` | [#40](https://github.com/carolabenvenuto-uces/planit/pull/40) |
| RC14, RC16 | `fix/changelog-rc14-rc16` | [#41](https://github.com/carolabenvenuto-uces/planit/pull/41) |
| RC15 | `fix/qa-rc15-testing-doc-estados` | [#42](https://github.com/carolabenvenuto-uces/planit/pull/42) |
| RC9 - RC13 | `fix/frontend-rc9-rc13-alinear-mockup` | [#43](https://github.com/carolabenvenuto-uces/planit/pull/43) |
| RC17 - RC30 | `fix/changelog-rc17-rc30-titulos-literales` | [#44](https://github.com/carolabenvenuto-uces/planit/pull/44) |
| RC31 | `fix/frontend-rc31-assets-catalogo` | [#45](https://github.com/carolabenvenuto-uces/planit/pull/45) |

- La PR [#35](https://github.com/carolabenvenuto-uces/planit/pull/35) fue aprobada por el docente y mergeada a `master`.
- El backport `backport/release-actividad-obligatoria-2` → `develop` se integró en la PR [#46](https://github.com/carolabenvenuto-uces/planit/pull/46), estableciendo la base del Primer Parcial.
- No quedan Request Changes pendientes de la Actividad N°2 al inicio del parcial.

### 3. Cambios a incorporar en el mockup de Figma
- **Grilla Bootstrap:** contenedor, sistema de 12 columnas y gutters, mostrando la distribución de las secciones (`#mi-evento`, `#presupuesto`, `#invitados`, `#catalogo` y el `aside` de resumen/tareas) en los breakpoints `xs` (< 576 px), `md` (≥ 768 px) y `lg` (≥ 992 px).
- **Componentes avanzados de Bootstrap** (confirmados con el Especialista en Componentes Bootstrap, @ValeriaMSilva): **Modal** con la ficha técnica de cada servicio del catálogo y **Toast** de confirmación ("Experiencia agregada a tu evento") al presionar "Sumar al Evento". Se descartó un Accordion para las preguntas frecuentes porque esa sección ya corresponde al componente `<details>/<summary>` del Desarrollador de Componentes HTML Avanzados.
- **Navbar colapsable:** en tablet y mobile (< 992 px) el menú se colapsa en un botón `navbar-toggler` (☰), como parte de la migración del Desarrollador Frontend/Bootstrap.
- **Componentes HTML avanzados:** `<iframe>` con helper `ratio ratio-16x9` (sección "Taller en Acción: Cerámica & Chardonnay") y bloque `<details>/<summary>` de preguntas frecuentes, ambos en la columna principal debajo del catálogo, según `spec-html-avanzados.md` (Issue [#47](https://github.com/carolabenvenuto-uces/planit/issues/47)).
- **Paleta y tipografía:** mapeo de los design tokens de la Actividad N°2 a las variables de Bootstrap (`primary`, `secondary`, neutros, `font-family` y escala tipográfica), base para `css/bootstrap-overrides.css`.
- **Estados de interacción:** `hover`, `focus` y `active` coherentes con Bootstrap para botones, enlaces y componentes.
- **Export:** `docs/01-mockup/disenio-bootstrap.png` y enlace al archivo de Figma actualizado en `README.md`, compartido con el Desarrollador Frontend/Bootstrap antes de que comience a usar Figma MCP.

### 4. Organización del equipo (grupo de 3 integrantes)
| Integrante | Rol | Rama |
| --- | --- | --- |
| @FacundoGuiraldes | Coordinador / DevOps | `feature/coord-devops-update-figma-and-readme` |
| @ValeriaMSilva | Desarrollador Frontend/Bootstrap | `feature/dev-frontend-bootstrap-migration` |
| @ValeriaMSilva | Especialista en Componentes Bootstrap | `feature/esp-componentes-bootstrap-add-components` |
| @carolabenvenuto-uces | Desarrollador de Componentes HTML Avanzados | `feature/dev-comp-html-avanzados-add-components` |

Por tratarse de un grupo de 3 integrantes, el Desarrollador Frontend/Bootstrap asume también las tareas del Especialista en Componentes Bootstrap, utilizando una rama `feature/` independiente por rol.

**Tablero Kanban:** [PlanIT - Primer Parcial](https://github.com/users/carolabenvenuto-uces/projects/1), vinculado al repositorio y administrado por el Coordinador / DevOps con rol Admin. El proyecto pertenece a la cuenta dueña del repositorio porque GitHub solo permite vincular a un repositorio proyectos del mismo propietario. Workflows activos: *Auto-add to project* (`is:issue is:open` sobre `planit`) e *Item closed* (mueve la tarjeta a Done).

**Orden de integración planificado en `develop`:** (1) Coordinador / DevOps (mockup y README), (2) Frontend/Bootstrap, (3) Componentes Bootstrap, (4) Componentes HTML Avanzados, (5) ramas `fix/` de los hallazgos de testing.

### 5. Criterios de Aceptación (Checklist)
- [x] `spec-devops.md` creado y commiteado en `docs/03-specs/primer-parcial/` antes de cualquier otro cambio.
- [x] Request Changes de la Actividad N°2 resueltos mediante ramas `fix/` con PR y entrada `[Fixed]` en `changelog.md`.
- [x] Backport de `release/actividad-obligatoria-2` → `develop` realizado post-merge (PR [#46](https://github.com/carolabenvenuto-uces/planit/pull/46)).
- [x] Mockup de Figma actualizado con la grilla de Bootstrap y los componentes avanzados elegidos.
- [x] Imagen exportada en `docs/01-mockup/disenio-bootstrap.png`.
- [x] Enlace al archivo de Figma actualizado en `README.md`.
- [x] Tablero Kanban en GitHub Projects con todas las issues del equipo.
- [x] Al menos 4 Code Reviews asistidos con IA, con Request Changes en las líneas del diff (realizados con Claude Code / IA Agent Mode; ver Momento 2).
- [x] Todas las PRs de features aprobadas y mergeadas en `develop` (PRs [#50](https://github.com/carolabenvenuto-uces/planit/pull/50), [#52](https://github.com/carolabenvenuto-uces/planit/pull/52), [#54](https://github.com/carolabenvenuto-uces/planit/pull/54) y [#48](https://github.com/carolabenvenuto-uces/planit/pull/48)).
- [x] `changelog.md` actualizado con las contribuciones y correcciones de todo el equipo.
- [x] Rama `release/primer-parcial` creada desde `develop` con todas las features e integraciones de correcciones aplicadas.
- [ ] **[Pendiente Post-LGTM Docente]** Publicación y verificación en GitHub Pages sobre la rama de release[cite: 17, 19].
- [x] PR `release/primer-parcial` → `master` creada con el template de release y publicada en Slack.
- [x] Limpieza de ramas innecesarias completada (solo presentes las ramas autorizadas en el repositorio)[cite: 17, 19].
- [ ] **[Pendiente Post-LGTM Docente]** Creación del Tag estándar `v1.0.0` y publicación del GitHub Release oficial una vez aprobado el merge final a `master` y recibido el LGTM docente (RC2)[cite: 17, 19].

---

## MOMENTO 2: Evidencia de Cierre (AL FINALIZAR)

### 1. Code Reviews asistidos con IA

Las revisiones se hicieron con **Claude Code** como asistente de IA, en lugar de Copilot Agent Mode. El asistente leyó cada PR (commits, diff, issues y archivos de la rama) con la CLI de GitHub, la comparó contra la consigna y el mockup, y renderizó la rama con Playwright en los anchos de los dispositivos obligatorios. Los Request Changes se cargaron en las líneas del diff desde la cuenta del Coordinador.

| # | PR | Rol revisado | Fecha (ART) | Veredicto | Comentarios en el diff | Enlace |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | #52 | Frontend/Bootstrap | 06/10 19:03 | 🔁 Request changes | 14 | [Review 1](https://github.com/carolabenvenuto-uces/planit/pull/52#pullrequestreview-5435056491) |
| 2 | #54 | Componentes Bootstrap | 06/10 19:10 | 🔁 Request changes | 20 | [Review 1](https://github.com/carolabenvenuto-uces/planit/pull/54#pullrequestreview-5435107603) |
| 3 | #52 | Frontend/Bootstrap | 06/10 23:05 | 🔁 Request changes | 9 | [Review 2](https://github.com/carolabenvenuto-uces/planit/pull/52#pullrequestreview-5436774359) |
| 4 | #54 | Componentes Bootstrap | 06/10 23:08 | 🔁 Request changes | 9 | [Review 2](https://github.com/carolabenvenuto-uces/planit/pull/54#pullrequestreview-5436797395) |
| 5 | #52 | Frontend/Bootstrap | 07/10 09:24 | 🔁 Request changes | 6 | [Review 3](https://github.com/carolabenvenuto-uces/planit/pull/52#pullrequestreview-5442209632) |
| 6 | #54 | Componentes Bootstrap | 07/10 09:33 | 🔁 Request changes | 11 | [Review 3](https://github.com/carolabenvenuto-uces/planit/pull/54#pullrequestreview-5442315723) |
| 7 | #54 | Componentes Bootstrap | 07/10 12:30 | 🔁 Request changes | 5 | [Review 4](https://github.com/carolabenvenuto-uces/planit/pull/54#pullrequestreview-5444547530) |
| 8 | #52 | Frontend/Bootstrap | 07/10 12:34 | 🔁 Request changes | 10 | [Review 4](https://github.com/carolabenvenuto-uces/planit/pull/52#pullrequestreview-5444597014) |
| 9 | #52 | Frontend/Bootstrap | 07/10 13:50 | 🔁 Request changes | 6 | [Review 5](https://github.com/carolabenvenuto-uces/planit/pull/52#pullrequestreview-5445535732) |
| 10 | #54 | Componentes Bootstrap | 07/10 14:02 | 🔁 Request changes | 4 | [Review 5](https://github.com/carolabenvenuto-uces/planit/pull/54#pullrequestreview-5445598043) |
| 11 | #54 | Componentes Bootstrap | 07/10 14:02 | 💬 Comentario | 1 | [Review 6](https://github.com/carolabenvenuto-uces/planit/pull/54#pullrequestreview-5445599989) |
| 12 | #54 | Componentes Bootstrap | 07/10 14:02 | 💬 Comentario | 1 | [Review 7](https://github.com/carolabenvenuto-uces/planit/pull/54#pullrequestreview-5445600426) |
| 13 | #54 | Componentes Bootstrap | 07/10 15:05 | ✅ Aprobada | 3 | [Review 8](https://github.com/carolabenvenuto-uces/planit/pull/54#pullrequestreview-5446359979) |
| 14 | #52 | Frontend/Bootstrap | 07/10 15:11 | 🔁 Request changes | 6 | [Review 6](https://github.com/carolabenvenuto-uces/planit/pull/52#pullrequestreview-5446421361) |
| 15 | #52 | Frontend/Bootstrap | 07/10 17:02 | 🔁 Request changes | 2 | [Review 7](https://github.com/carolabenvenuto-uces/planit/pull/52#pullrequestreview-5447664442) |
| 16 | #52 | Frontend/Bootstrap | 07/10 19:00 | ✅ Aprobada | 0 | [Review 8](https://github.com/carolabenvenuto-uces/planit/pull/52#pullrequestreview-5448903441) |
| 17 | #48 | Componentes HTML Avanzados | 07/10 22:18 | 🔁 Request changes | 20 | [Review 1](https://github.com/carolabenvenuto-uces/planit/pull/48#pullrequestreview-5450285276) |
| 18 | #48 | Componentes HTML Avanzados | 07/10 22:55 | 🔁 Request changes | 17 | [Review 2](https://github.com/carolabenvenuto-uces/planit/pull/48#pullrequestreview-5450510538) |
| 19 | #48 | Componentes HTML Avanzados | 08/10 11:20 | ✅ Aprobada | 0 | Review 3 |

**Resumen:** 19 reviews en total con 144+ comentarios en las líneas del diff. La totalidad de las Pull Requests de desarrollo (`#50`, `#52`, `#54` y `#48`) han sido evaluadas, corregidas, aprobadas y mergeadas exitosamente a la rama `develop`.

---

### 2. Regularización de Trazabilidad y Manejo de Ramas (RC4 y RC5)

En atención a las observaciones del docente sobre la gestión de git y nomenclaturas:

* **Naming de ramas de componentes (RC4):** Se aclaró y unificó la fundamentación en `changelog.md` y notas de release sobre la utilización del prefijo `feature/dev-comp-*`. Dicho prefijo fue seleccionado intencionalmente por el equipo para agrupar bajo una misma convención semántica todas las funcionalidades asociadas al desarrollo de componentes de interfaz (`dev-comp-bootstrap-*` y `dev-comp-html-*`).
* **Manejo de hallazgos e Issues #55–#58 (RC5):** Los hallazgos identificados durante el proceso de Code Review sobre la PR [#54](https://github.com/carolabenvenuto-uces/planit/pull/54) (Issues [#55](https://github.com/carolabenvenuto-uces/planit/issues/55), [#56](https://github.com/carolabenvenuto-uces/planit/issues/56), [#57](https://github.com/carolabenvenuto-uces/planit/issues/57) y [#58](https://github.com/carolabenvenuto-uces/planit/issues/58)) fueron resueltos e integrados directamente dentro de las iteraciones de la misma PR antes de su aprobación final. Para cumplir de manera estricta con la rúbrica de trazabilidad, se registró en la sección `[Fixed]` de la release la correspondencia directa entre cada Issue, sus commits asociados y la PR contenedora.

---

### 3. Decisiones del Mockup

Página de Figma "Primer Parcial - Bootstrap": [enlace](https://www.figma.com/design/iUmUArxu59WUYlBl2zR3xq/Wireframe?node-id=2078-2) · Export: [`disenio-bootstrap.png`](../../01-mockup/disenio-bootstrap.png).

**Grilla:**
- Tres frames con la guía de 12 columnas y gutter de 24 px (`--bs-gutter-x: 1.5rem`):
  - **Desktop (1440 px):** márgenes de 60 px, que equivalen al `.container` de 1320 px en xxl.
  - **Tablet (768 px):** márgenes de 24 px, `.container` de 720 px.
  - **Mobile (393 px):** márgenes de 12 px, el ancho del iPhone 14 Pro, que es dispositivo obligatorio de testing.
- **Desktop:** el contenido se reorganizó en `.col-lg-8` (Mi Evento, Presupuesto, Invitados, Catálogo, Video y FAQ) y `.col-lg-4` (Resumen financiero, Tareas y Alerta). En la AO2 ocupaba un bloque angosto de unos 770 px que no coincidía con ninguna columna.
- **Tablet y mobile:** las dos columnas se apilan. El catálogo pasa de `col-md-4` (3 por fila) a `col-12` (1 por fila).

**Componentes:**
- **Navbar colapsable (`.navbar-expand-lg` + `.navbar-toggler` ☰):** al llevar el header a 720 px, el logo, los 4 links, la campana, el avatar y "Nuevo Evento" no entraban. Por eso debajo de 992 px el menú se colapsa, y en mobile "Nuevo Evento" pasa adentro del menú.
- **Modal (`.modal .modal-lg`) — Ficha técnica:** muestra el detalle de cada servicio del catálogo (imagen, precio, capacidad, duración, qué incluye y proveedor) sin salir del dashboard. "Sumar al Evento" queda disponible en el pie. Se dibujó como superposición en los frames "Desktop / Mobile - Modal y Toast".
- **Toast (`.toast`):** da una confirmación que no bloquea la pantalla al presionar "Sumar al Evento", con nombre y precio del servicio. Se ubica abajo a la derecha (`.toast-container .bottom-0 .end-0`). Complementa al modal sin interrumpir el flujo.
- **Componentes HTML (rol de Carola):** se ubicaron en la columna ancha, debajo del Catálogo, porque así el iframe aprovecha el ratio 16:9:
  - `<iframe>` con `.ratio .ratio-16x9` ("Taller en Acción: Cerámica & Chardonnay");
  - `<details>/<summary>` con 4 preguntas frecuentes.
- **Accordion descartado:** la primera propuesta del rol de Componentes Bootstrap era usarlo para el FAQ, lo que habría duplicado el componente `details/summary` de Carola y superpuesto los dos roles.

**Guía de estilos - Bootstrap** (frame propio en Figma):
- Mapeo de los design tokens de `styles.css` a variables de Bootstrap (`--bs-primary` #4F46E5, `--bs-success`, `--bs-warning`, `--bs-danger`, sus `*-bg-subtle`, `--bs-body-bg`, `--bs-border-color`, entre otras).
- Tipografía Inter con su escala.
- Estados de interacción: botón normal, hover, active, focus con anillo de 0.25rem, disabled y outline; inputs con foco; badges.
- Tabla de breakpoints.

Es la referencia para `css/bootstrap-overrides.css`.

---

### 4. Obstáculos Encontrados y Resolución

| Obstáculo | Resolución |
| --- | --- |
| La rama `feature/coord-devops-update-figma-and-readme` existía desde la AO1 (0 commits propios y 94 de atraso respecto de `develop`). | Se eliminó y se volvió a crear desde `develop` actualizado, para que el spec fuera el primer commit. |
| Acceso de solo lectura al archivo de Figma (no permitía crear páginas). | Se solicitó permiso de edición a la propietaria, que lo aprobó, y el mockup siguió en el mismo archivo de las entregas anteriores. |
| El tablero Kanban creado en la cuenta del Coordinador no se podía vincular al repositorio (GitHub solo vincula proyectos del mismo propietario). | La dueña del repositorio creó el proyecto y otorgó rol Admin al Coordinador. Se activaron los workflows *Auto-add* e *Item closed* y se eliminó el tablero duplicado. |
| En Figma, al pasar el diseño a 768 y 393 px, el contenido se cortaba: el auto layout conservaba anchos fijos de desktop y el header tenía padding horizontal. | Se ajustaron los anchos de `planit-dashboard`, `dashboard-body`, `header-container` y `footer-container` en cada frame, las columnas pasaron a "Llenar contenedor" y el flujo de las filas a vertical. |
| Los componentes importados como SVG entraban escalados (1108 px en lugar de 872). | Se reescalaron con la herramienta Escala (K) al ancho de cada columna (872, 720 y 369 px). |
| El link del video propuesto para el iframe (`dQw4w9WgXcQ`) era el videoclip "Never Gonna Give You Up" y no un taller de cerámica. | Se avisó al rol de Componentes HTML para reemplazarlo por un video pertinente antes de implementar. |
| Superposición de roles: Accordion de Bootstrap para el mismo FAQ de `details/summary`. | Se acordó reemplazarlo por un Toast de confirmación, que complementa al Modal. |
| La PR #54 instalaba Bootstrap de nuevo, igual que la #52, y luego, al integrar la #52, borró su entrada del changelog. | Se pidió integrar la #52 en la rama de la #54 (una sola carga de Bootstrap) y conservar ambas entradas del changelog. Orden de merge: #50 → #52 → #54 → #48. |
| Gestión de deuda técnica en script de componentes Bootstrap (RC8). | Se decidió conservar el archivo `js/componentes-bootstrap.js` y mantener la Issue #68 abierta para su tratamiento y refactorización JavaScript durante la AO3. |