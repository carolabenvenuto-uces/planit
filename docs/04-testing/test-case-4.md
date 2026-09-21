# Test Case 4 — Accesibilidad Web

- **Herramienta:** Playwright (librería directa) con Chromium, inyectando
  axe-core v4.10.2 (`page.addScriptTag` + `axe.run()`) con reglas WCAG
  2.1 A/AA (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`)
- **Criterios obligatorios:**
  - Violaciones WCAG 2.1 por nivel de impacto (critical, serious, moderate, minor)
  - Elementos afectados
  - Regla axe correspondiente

---

## Momento 1 — Testing pre-merge (rama feature/)

- **Rama testeada:** `feature/responsive-design-add-responsive-styles`
  (último commit antes del merge a `develop` vía PR #24)
- **Prompt utilizado:**

\`\`\`
Usando Playwright directamente (mismo enfoque que los test cases
anteriores), testeá http://localhost:3000 inyectando axe-core para
evaluar accesibilidad web (WCAG 2.1). Necesito todas las violaciones
encontradas, categorizadas por nivel de impacto (critical, serious,
moderate, minor), los elementos afectados por cada violación, y la
regla axe correspondiente a cada una.

Sacá una captura de pantalla de la página, guardala en
docs/04-testing/capturas/tc-4/momento-1/ y confirmame con ls -la.
\`\`\`

- **Resultados:**
  - **Violaciones encontradas: 0.** 29 reglas WCAG 2.1 A/AA pasaron
    correctamente. Sin hallazgos critical, serious, moderate ni minor.
  - 🟡 **1 ítem "incomplete" (no es violación, requiere revisión manual):**

    | Regla axe | Elementos afectados | Motivo |
    |---|---|---|
    | color-contrast | `.logo-container > span` ("PlanIT"), `h1` (título hero), `.hero-section > p`, `.btn-primary` ("Crear mi primer evento"), `.btn-submit` ("Guardar Evento en Cockpit") | axe no puede calcular el contraste automáticamente porque el fondo usa un gradiente CSS |

    Por inspección visual de las capturas de test cases anteriores el
    contraste se ve bien (texto blanco sobre fondo oscuro/gradiente
    púrpura), pero se recomienda verificar con una herramienta de
    contraste manual (ej. color picker de DevTools) sobre los puntos más
    claros del gradiente antes de darlo por cerrado formalmente.

- **Capturas:** `capturas/tc-4/momento-1/`

![Accesibilidad Chrome 1920x1080](capturas/tc-4/momento-1/chrome-1920x1080-a11y.png)

- **Issues generados:** Ninguno — no hubo violaciones automáticas
  confirmadas. El ítem de contraste con gradiente queda documentado como
  pendiente de verificación manual, no como bug.

---

## Momento 2 — Testing post-merge (rama develop)

- **Prompt utilizado:**

\`\`\`
(pendiente)
\`\`\`

- **Resultados:** _(pendiente)_
- **Capturas:** `capturas/tc-4/momento-2/`
- **Issues generados:** _(pendiente)_
