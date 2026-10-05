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
Actualización del mockup en Figma para reflejar la migración del proyecto a Bootstrap (grilla de 12 columnas, breakpoints y componentes avanzados), exportación del diseño a `docs/01-mockup/disenio-bootstrap.png` y actualización de `README.md` con el enlace al archivo de Figma. Coordinación de la integración de las ramas `feature/` hacia `develop`, realización de al menos 4 Code Reviews asistidos con GitHub Copilot Agent Mode (cargando Request Changes en las líneas del diff), administración de las issues del equipo en un tablero Kanban de GitHub Projects, mantenimiento de `changelog.md`, preparación de la rama `release/primer-parcial`, publicación en GitHub Pages, limpieza de ramas y versionado con el tag `v1.1-primer-parcial`.

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
- **Componentes avanzados de Bootstrap:** _a confirmar con el Especialista en Componentes Bootstrap (@ValeriaMSilva)_.
- **Componentes HTML avanzados:** `<iframe>` con helper `ratio ratio-16x9` y bloque `<details>/<summary>` de preguntas frecuentes, según `spec-html-avanzados.md` (Issue [#47](https://github.com/carolabenvenuto-uces/planit/issues/47)).
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
- [ ] `spec-devops.md` creado y commiteado en `docs/03-specs/primer-parcial/` antes de cualquier otro cambio.
- [x] Request Changes de la Actividad N°2 resueltos mediante ramas `fix/` con PR y entrada `[Fixed]` en `changelog.md`.
- [x] Backport de `release/actividad-obligatoria-2` → `develop` realizado post-merge (PR #46).
- [ ] Mockup de Figma actualizado con la grilla de Bootstrap y los componentes avanzados elegidos.
- [ ] Imagen exportada en `docs/01-mockup/disenio-bootstrap.png`.
- [ ] Enlace al archivo de Figma actualizado en `README.md`.
- [ ] Tablero Kanban en GitHub Projects con todas las issues del equipo.
- [ ] Al menos 4 Code Reviews asistidos con Copilot Agent Mode, con Request Changes en las líneas del diff.
- [ ] Todas las PRs con al menos una revisión aprobada antes del merge.
- [ ] `changelog.md` actualizado con las contribuciones de todo el equipo.
- [ ] Rama `release/primer-parcial` creada desde `develop` una vez integradas todas las features.
- [ ] GitHub Pages publicando `release/primer-parcial` con el sitio accesible.
- [ ] PR `release/primer-parcial` → `master` creada con el template de release y publicada en Slack.
- [ ] Solo las ramas `master`, `develop` y `release/primer-parcial` presentes al momento de la entrega.
- [ ] Tag `v1.1-primer-parcial` y release de GitHub creados post-merge a `master`.

---

## MOMENTO 2: Evidencia de Cierre (AL FINALIZAR)
*(Esta sección se completará al cerrar la tarea).*

### Prompts de Code Review utilizados en Copilot Agent Mode
*(Pendiente).*

### Decisiones del Mockup (componentes Bootstrap incluidos y por qué)
*(Pendiente).*

### Obstáculos Encontrados y Resolución
*(Pendiente).*
