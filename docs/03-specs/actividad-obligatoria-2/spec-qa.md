# Especificación Técnica (Spec) - Documentador / QA Tester

- **Proyecto:** PlanIT - Plataforma All-in-One de Organización & Experiencias
- **Entrega:** Actividad Obligatoria N°2
- **Rol:** Documentador / QA Tester
- **Responsable:** @FacundoGuiraldes
- **Rama:** `feature/doc-qa-tester-add-test-case-1`

---

## 1. Qué se va a hacer
Ejecución de un plan de testing automatizado sobre la plataforma PlanIT en
dos momentos: pre-merge (sobre las ramas `feature/` de Frontend/CSS y
Responsive Design antes de integrarse a `develop`) y post-merge (sobre
`develop` ya con todos los estilos integrados). Se utilizará Playwright MCP
para ejecutar los tests contra `http://localhost:3000` con Live Preview, y
GitHub MCP para registrar cada hallazgo relevante como issue de tipo bug,
todo desde Agent Mode.

## 2. Por qué se hace
Para garantizar que los estilos CSS y el diseño responsive implementados
por el equipo cumplan con los requerimientos funcionales definidos en
`plan.md`, detectar problemas de integración que solo aparecen cuando los
distintos aportes (CSS base, componentes, responsive) se combinan, y dejar
evidencia documentada y trazable de cada hallazgo antes de que el
Coordinador arme la release.

## 3. Herramientas a utilizar
- **Playwright MCP** (`@playwright/mcp`): permite controlar un navegador
  real para ejecutar tests automatizados contra la URL local del proyecto,
  cubriendo compatibilidad, responsive, performance, accesibilidad y
  estructura HTML semántica.
- **GitHub MCP** (`@modelcontextprotocol/server-github`): permite crear
  issues de tipo bug directamente desde el chat del agente, sin necesidad
  de ir manualmente a GitHub, agilizando el registro de hallazgos.

## 4. Criterios de Aceptación (Checklist)

### Momento 1 — Testing pre-merge
- [x] 5 test cases ejecutados con Playwright MCP contra el último commit
  de las ramas `feature/` de Frontend/CSS y Responsive Design (vía
  `localhost:3000`). **Nota:** ejecutado de forma diferida — ver sección
  5 para la justificación formal de esta excepción metodológica.
- [x] Al menos un issue bug creado con GitHub MCP por cada hallazgo relevante
- [ ] Responsables notificados sobre los bugs encontrados antes del merge
  — no aplicable en los términos originales, dado que el testing se
  ejecutó después del merge (ver sección 5). Los responsables fueron
  notificados apenas se detectaron los hallazgos, aunque no antes del
  merge como exige el criterio original.

### Momento 2 — Testing post-merge a develop
- [x] 5 test cases re-ejecutados con Playwright MCP contra `develop` ya
  integrado
- [x] Issues creados por cada nuevo hallazgo detectado en la integración
  (persistencia de los 5 issues de Momento 1, más el nuevo Issue #33
  detectado en esta ronda)
- [x] Coordinador notificado antes de la creación de la release (ver
  comentarios en PR #31)

### Documentación
- [x] Los 5 test cases documentados en `docs/04-testing/` con prompt
  utilizado, hallazgos, capturas de pantalla y links a issues
- [x] `testing-doc.md` como índice central con resumen de issues por momento
- [x] `changelog.md` actualizado con la contribución de este rol

---

## Test cases planificados

| # | Archivo | Qué cubre |
|---|---|---|
| 1 | test-case-1.md | Compatibilidad en navegadores desktop (Chrome, Firefox, Safari, Edge) |
| 2 | test-case-2.md | Responsive en dispositivos móviles (iPhone, Samsung Galaxy, iPad) |
| 3 | test-case-3.md | Performance y carga (Performance API del navegador) |
| 4 | test-case-4.md | Accesibilidad web (axe-core) |
| 5 | test-case-5.md | Validación de estructura HTML semántica y CSS (W3C) |

---

## 5. Justificación formal de la excepción metodológica — Momento 1 diferido

**Qué pasó:** el testing del Momento 1 (pre-merge) se ejecutó después
de que las ramas `feature/dev-frontend-css-add-styles` y
`feature/responsive-design-add-responsive-styles` ya habían sido
mergeadas a `develop` (PR #24), en vez de antes de la integración como
exige estrictamente la consigna.

**Por qué pasó:** un error de coordinación en el timing del equipo
llevó a que el testing arrancara tarde respecto al avance del resto de
los roles. Para cuando se comenzó la ejecución, las ramas ya estaban
integradas.

**Cómo se mitigó:** en vez de testear directamente sobre `develop` (lo
que hubiera sido únicamente un Momento 2 sin punto de comparación), se
identificó el último commit de cada rama `feature/` antes de su merge
(hash verificable en el historial de git) y se ejecutó el testing
contra ese estado exacto, preservando así la comparación entre
"pre-integración" y "post-integración" que es el objetivo real del
Momento 1 y Momento 2 — aunque el *timing* de la ejecución fue
posterior al merge real.

**Por qué se considera una aproximación válida:**
- El código evaluado es exactamente el mismo que existía antes del
  merge (mismo hash de commit), no una versión distinta o reconstruida
- Permite la comparación real de "qué bugs existían antes de integrar
  vs. cuáles persisten después", que es el valor que aporta tener dos
  momentos separados
- La alternativa (repetir el testing en tiempo real) es técnicamente
  imposible una vez que una rama ya fue mergeada — no existe forma de
  "deshacer" la integración para recrear el escenario pre-merge sin
  alterar el estado real del proyecto

**Qué se pierde con esta aproximación:** la detección temprana de bugs
*antes* de que lleguen a `develop`, que es el propósito preventivo real
del testing pre-merge. En este caso, los bugs se detectaron
simultáneamente en ambos momentos, cuando ya estaban en `develop`.

**Solicitud a Coordinación:** se solicita la aceptación de esta
excepción metodológica para esta entrega puntual, dado que no existe
alternativa técnica para revertirla. Para futuras entregas, el equipo
debe coordinar que el testing arranque en cuanto exista una rama
`feature/` con código real, sin esperar señales adicionales.

**Responsable de esta decisión:** @ValeriaMSilva (Coordinador/DevOps),
según lo indicado en su revisión de la PR #31.