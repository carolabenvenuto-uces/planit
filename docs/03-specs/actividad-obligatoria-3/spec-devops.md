# Especificación Técnica (Spec) - Coordinador / DevOps

- **Proyecto:** PlanIT - Plataforma All-in-One de Organización & Experiencias
- **Entrega:** Actividad Obligatoria N° 3
- **Rol:** Coordinador / DevOps
- **Responsable:** Carola Benvenuto (@carolabenvenuto-uces)
- **Rama:** `feature/coord-devops-tercera-entrega`
- **Issue principal:** [#71](https://github.com/carolabenvenuto-uces/planit/issues/71)
- **Fecha:** 19 de octubre de 2026

---

## MOMENTO 1: Planificación Previa (ANTES de comenzar)

### 1. Qué se va a hacer
Coordinación integral de la Actividad Obligatoria N° 3 (AO3) aplicando metodología Spec-Driven Development y flujo Gitflow estricto sobre `develop`. Se ejecutará el backport final desde `master` hacia `develop` para trasladar todas las correcciones aprobadas del Primer Parcial (`v1.1-primer-parcial`) y establecer la base limpia de trabajo. 

Se gestionará el tablero Kanban en GitHub Projects creando y asignando las issues del equipo. Se realizarán al menos 4 Code Reviews asistidas mediante **GitHub Copilot Agent Mode**, registrando observaciones con `CHANGES_REQUESTED` directamente en las líneas del diff sobre las PRs de `feature/`. Finalmente, se actualizará el archivo `README.md`, el historial en `changelog.md`, la navegación entre índices en `docs/`, se creará la rama `release/tercera-entrega`, se verificará el despliegue en GitHub Pages, se ejecutará la limpieza de ramas secundarias y se publicará la versión oficial bajo el tag `v1.1-tercera-entrega`.

### 2. Correcciones del Primer Parcial y Backport
Las observaciones planteadas por el docente (RC10 a RC17) durante la revisión del Primer Parcial fueron resueltas mediante ramas `fix/` y consolidadas en la release `v1.1-primer-parcial` mergeada a `master`.

| Estado / Tarea | Rama | PR |
| --- | --- | --- |
| Resoluciones RC10 a RC17 (Primer Parcial) | `fix/devops-rc10-rc17-primer-parcial` | [#70](https://github.com/carolabenvenuto-uces/planit/pull/70) |
| Integration Release v1.1 | `release/v1.1-primer-parcial` | [#70](https://github.com/carolabenvenuto-uces/planit/pull/70) |
| Backport de correcciones hacia `develop` | `backport/release-primer-parcial` | [#72](https://github.com/carolabenvenuto-uces/planit/pull/72) |

- La rama `master` cuenta con la versión oficial y tag originario `v1.1-primer-parcial`.
- La PR de backport ([#72](https://github.com/carolabenvenuto-uces/planit/pull/72)) fue mergeada a `develop`, estableciendo la base limpia e impecable para el inicio de la AO3.

### 3. Plan de Coordinación, Orden de Integración y Criterios de Aprobación
El desarrollo de la AO3 se gestionará mediante el flujo **Gitflow** con la rama base `develop`. La integración de las ramas de trabajo se realizará en el siguiente orden secuencial de dependencias:

1. **Backport Base:** Consolidação de correcciones del Primer Parcial en `develop` (Completado - PR [#72](https://github.com/carolabenvenuto-uces/planit/pull/72)).
2. **Spec DevOps (Momento 1):** Commit inicial del plan de coordinación en `docs/03-specs/actividad-obligatoria-3/spec-devops.md` en la rama `feature/coord-devops-tercera-entrega`.
3. **Deuda Técnica (Issue #68):** Tratamiento y reestructuración de la lógica de componentes JS (`js/componentes-bootstrap.js`).
4. **Features AO3:** Integración paulatina de las nuevas funcionalidades desarrolladas por el equipo mediante ramas `feature/`.
5. **Release & Cierre:** Creación de `release/tercera-entrega` para validación final, despliegue en GitHub Pages, etiquetado `v1.1-tercera-entrega` y merge final a `master`.

**Criterios de Aprobación para PRs:**
- Formulario de PR completado con checklist y referencias directas a las Issues vinculadas.
- Código verificado sin errores sintácticos, manteniendo semántica HTML5, accesibilidad ARIA y responsividad.
- Al menos un ciclo de revisión con **GitHub Copilot Agent Mode** registrando observaciones en el diff si corresponden.
- Aprobación formal (`Approve`) por parte de la Coordinadora previo al merge a `develop`.
- Registro obligatorio de los cambios en `changelog.md`.

### 4. Herramientas a Utilizar: Justificación de Copilot Agent Mode
Se utilizará **GitHub Copilot Agent Mode** para la auditoría de código y revisiones de Pull Requests.

- **Justificación:** Permite realizar análisis estáticos de código contextualizados en el diff de cada PR. La herramienta evalúa automáticamente el cumplimiento de las guías de estilo, semántica HTML, estructura CSS responsiva, accesibilidad WCAG/ARIA y buenas prácticas de JavaScript, automatizando la detección temprana de desvíos y garantizando que ningún cambio se integre a `develop` sin cumplir los estándares exigidos por la cátedra.

### 5. Criterios de Aceptación (Checklist)
- [x] `spec-devops.md` creado y commiteado en `docs/03-specs/actividad-obligatoria-3/` antes de cualquier otra tarea de coordinación de la AO3.
- [x] Correcciones del Primer Parcial aplicadas y documentadas con entradas `[Fixed]` en `changelog.md`.
- [x] Backport desde `master` (o `release/primer-parcial`) hacia `develop` realizado exitosamente.
- [ ] Tablero Kanban en GitHub Projects administrado con las issues de la AO3 asignadas.
- [ ] Al menos 4 Code Reviews asistidas con IA (Copilot Agent Mode) documentadas con observaciones `CHANGES_REQUESTED` cargadas en las líneas del diff.
- [ ] Deuda técnica (Issue #68) abordada y reorganizada según las necesidades de la AO3.
- [ ] `plan.md` y `README.md` actualizados con la información de la tercera entrega y sus enlaces correspondientes.
- [ ] Rama `release/tercera-entrega` creada a partir de `develop`.
- [ ] GitHub Pages activo y actualizado verificando el correcto despliegue de la AO3.
- [ ] Limpieza de ramas efectuada en el remoto (solo visibles: `master`, `develop` y `release/tercera-entrega`).
- [ ] Tag estándar `v1.1-tercera-entrega` publicado junto a la GitHub Release oficial.
- [ ] Registro completo en `changelog.md` y navegación verificada entre todos los índices de `docs/`.

---

## MOMENTO 2: Evidencia de Cierre (AL FINALIZAR)

> *Nota: Esta sección se completará al finalizar todas las revisiones, integraciones y la publicación de la release de la AO3.*

### 1. Code Reviews Asistidos con Copilot Agent Mode

#### Prompts Utilizados y Contexto Adjunto


Acá tenés el documento completo para `docs/03-specs/actividad-obligatoria-3/spec-devops.md`, adaptado rigurosamente al formato exacto utilizado en el Primer Parcial y cumpliendo con cada uno de los puntos requeridos para la Actividad Obligatoria N° 3.

```markdown
# Especificación Técnica (Spec) - Coordinador / DevOps

- **Proyecto:** PlanIT - Plataforma All-in-One de Organización & Experiencias
- **Entrega:** Actividad Obligatoria N° 3
- **Rol:** Coordinador / DevOps
- **Responsable:** Carola Benvenuto (@carolabenvenuto-uces)
- **Rama:** `feature/coord-devops-tercera-entrega`
- **Issue principal:** [#71](https://github.com/carolabenvenuto-uces/planit/issues/71)
- **Fecha:** 19 de octubre de 2026

---

## MOMENTO 1: Planificación Previa (ANTES de comenzar)

### 1. Qué se va a hacer
Coordinación integral de la Actividad Obligatoria N° 3 (AO3) aplicando metodología Spec-Driven Development y flujo Gitflow estricto sobre `develop`. Se ejecutará el backport final desde `master` hacia `develop` para trasladar todas las correcciones aprobadas del Primer Parcial (`v1.1-primer-parcial`) y establecer la base limpia de trabajo. 

Se gestionará el tablero Kanban en GitHub Projects creando y asignando las issues del equipo. Se realizarán al menos 4 Code Reviews asistidas mediante **GitHub Copilot Agent Mode**, registrando observaciones con `CHANGES_REQUESTED` directamente en las líneas del diff sobre las PRs de `feature/`. Finalmente, se actualizará el archivo `README.md`, el historial en `changelog.md`, la navegación entre índices en `docs/`, se creará la rama `release/tercera-entrega`, se verificará el despliegue en GitHub Pages, se ejecutará la limpieza de ramas secundarias y se publicará la versión oficial bajo el tag `v1.1-tercera-entrega`.

### 2. Correcciones del Primer Parcial y Backport
Las observaciones planteadas por el docente (RC10 a RC17) durante la revisión del Primer Parcial fueron resueltas mediante ramas `fix/` y consolidadas en la release `v1.1-primer-parcial` mergeada a `master`.

| Estado / Tarea | Rama | PR |
| --- | --- | --- |
| Resoluciones RC10 a RC17 (Primer Parcial) | `fix/devops-rc10-rc17-primer-parcial` | [#70](https://github.com/carolabenvenuto-uces/planit/pull/70) |
| Integration Release v1.1 | `release/v1.1-primer-parcial` | [#70](https://github.com/carolabenvenuto-uces/planit/pull/70) |
| Backport de correcciones hacia `develop` | `backport/release-primer-parcial` | [#72](https://github.com/carolabenvenuto-uces/planit/pull/72) |

- La rama `master` cuenta con la versión oficial y tag originario `v1.1-primer-parcial`.
- La PR de backport ([#72](https://github.com/carolabenvenuto-uces/planit/pull/72)) fue mergeada a `develop`, estableciendo la base limpia e impecable para el inicio de la AO3.

### 3. Plan de Coordinación, Orden de Integración y Criterios de Aprobación
El desarrollo de la AO3 se gestionará mediante el flujo **Gitflow** con la rama base `develop`. La integración de las ramas de trabajo se realizará en el siguiente orden secuencial de dependencias:

1. **Backport Base:** Consolidação de correcciones del Primer Parcial en `develop` (Completado - PR [#72](https://github.com/carolabenvenuto-uces/planit/pull/72)).
2. **Spec DevOps (Momento 1):** Commit inicial del plan de coordinación en `docs/03-specs/actividad-obligatoria-3/spec-devops.md` en la rama `feature/coord-devops-tercera-entrega`.
3. **Deuda Técnica (Issue #68):** Tratamiento y reestructuración de la lógica de componentes JS (`js/componentes-bootstrap.js`).
4. **Features AO3:** Integración paulatina de las nuevas funcionalidades desarrolladas por el equipo mediante ramas `feature/`.
5. **Release & Cierre:** Creación de `release/tercera-entrega` para validación final, despliegue en GitHub Pages, etiquetado `v1.1-tercera-entrega` y merge final a `master`.

**Criterios de Aprobación para PRs:**
- Formulario de PR completado con checklist y referencias directas a las Issues vinculadas.
- Código verificado sin errores sintácticos, manteniendo semántica HTML5, accesibilidad ARIA y responsividad.
- Al menos un ciclo de revisión con **GitHub Copilot Agent Mode** registrando observaciones en el diff si corresponden.
- Aprobación formal (`Approve`) por parte de la Coordinadora previo al merge a `develop`.
- Registro obligatorio de los cambios en `changelog.md`.

### 4. Herramientas a Utilizar: Justificación de Copilot Agent Mode
Se utilizará **GitHub Copilot Agent Mode** para la auditoría de código y revisiones de Pull Requests.

- **Justificación:** Permite realizar análisis estáticos de código contextualizados en el diff de cada PR. La herramienta evalúa automáticamente el cumplimiento de las guías de estilo, semántica HTML, estructura CSS responsiva, accesibilidad WCAG/ARIA y buenas prácticas de JavaScript, automatizando la detección temprana de desvíos y garantizando que ningún cambio se integre a `develop` sin cumplir los estándares exigidos por la cátedra.

### 5. Criterios de Aceptación (Checklist)
- [x] `spec-devops.md` creado y commiteado en `docs/03-specs/actividad-obligatoria-3/` antes de cualquier otra tarea de coordinación de la AO3.
- [x] Correcciones del Primer Parcial aplicadas y documentadas con entradas `[Fixed]` en `changelog.md`.
- [x] Backport desde `master` (o `release/primer-parcial`) hacia `develop` realizado exitosamente.
- [ ] Tablero Kanban en GitHub Projects administrado con las issues de la AO3 asignadas.
- [ ] Al menos 4 Code Reviews asistidas con IA (Copilot Agent Mode) documentadas con observaciones `CHANGES_REQUESTED` cargadas en las líneas del diff.
- [ ] Deuda técnica (Issue #68) abordada y reorganizada según las necesidades de la AO3.
- [ ] `plan.md` y `README.md` actualizados con la información de la tercera entrega y sus enlaces correspondientes.
- [ ] Rama `release/tercera-entrega` creada a partir de `develop`.
- [ ] GitHub Pages activo y actualizado verificando el correcto despliegue de la AO3.
- [ ] Limpieza de ramas efectuada en el remoto (solo visibles: `master`, `develop` y `release/tercera-entrega`).
- [ ] Tag estándar `v1.1-tercera-entrega` publicado junto a la GitHub Release oficial.
- [ ] Registro completo en `changelog.md` y navegación verificada entre todos los índices de `docs/`.

---

## MOMENTO 2: Evidencia de Cierre (AL FINALIZAR)

> *Nota: Esta sección se completará al finalizar todas las revisiones, integraciones y la publicación de la release de la AO3.*

### 1. Code Reviews Asistidos con Copilot Agent Mode

#### Prompts Utilizados y Contexto Adjunto

```

(A completar al cierre: Incluir bloques de código con los prompts exactos ejecutados en Copilot Agent Mode para cada Code Review, indicando expresamente los archivos del diff adjuntados como contexto).

```

#### Resumen de Reviews y Observaciones (`CHANGES_REQUESTED`)
| # | PR | Rol Revisado | Veredicto | Resumen de Validación y Lineas del Diff con Observaciones | Enlace |
| --- | --- | --- | --- | --- | --- |
| 1 | # | | 🔁 Request changes | *(A completar al cierre)* | [Review 1]() |
| 2 | # | | 🔁 Request changes | *(A completar al cierre)* | [Review 2]() |
| 3 | # | | 🔁 Request changes | *(A completar al cierre)* | [Review 3]() |
| 4 | # | | 🔁 Request changes | *(A completar al cierre)* | [Review 4]() |

### 2. Obstáculos Encontrados y Resolución

| Obstáculo | Resolución |
| --- | --- |
| *(A completar al cierre)* | *(A completar al cierre)* |

```