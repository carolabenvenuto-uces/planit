# Test Case 4 — Accesibilidad Web

- **Herramienta:** MCP de Playwright (`mcp__playwright__*`) con
  Chromium, inyectando axe-core 4.9.1 con reglas WCAG 2.1 A/AA
- **Criterios obligatorios:**
  - Violaciones WCAG 2.1 por nivel de impacto (critical, serious, moderate, minor)
  - Elementos afectados
  - Regla axe correspondiente

---

## Momento 1 — Testing (rama develop, post-fix de Issues #25-#28)

- **Rama testeada:** `develop`, actualizada tras el merge de la PR #32
- **Prompt utilizado:**

\`\`\`
Usá el MCP de Playwright (mcp__playwright__*) para inyectar axe-core en
http://localhost:3000 y evaluar accesibilidad WCAG 2.1 A/AA. Necesito:
violaciones por nivel de impacto, elementos afectados, y regla axe
correspondiente.

Sacá una captura y guardala en docs/04-testing/capturas/tc-4/momento-1/.
Confirmame con ls -la.
\`\`\`

- **Resultados:**

  | Categoría | Cantidad |
  |---|---|
  | Violations (fallos confirmados) | 0 |
  | Passes | 29 |
  | Incomplete (revisión manual) | 1 regla, 5 elementos |
  | Inapplicable | 33 |

  **Cero violaciones automáticas** de ningún nivel de impacto
  (critical/serious/moderate/minor) en las reglas WCAG 2.1 A/AA
  evaluadas.

  El único ítem "incomplete": `color-contrast` (impacto serious) en 5
  elementos: `.logo-container > span`, `h1`, `.hero-section > p`,
  `.btn-primary`, `.btn-submit`. Motivo: los 5 tienen fondo con
  gradiente (no color sólido), algo que axe no resuelve
  automáticamente — no es un fallo, requiere verificación manual.

  **Verificación manual realizada** (peor extremo de cada gradiente):

  | Elemento | Contraste | Resultado |
  |---|---|---|
  | Logo "PlanIT" (gradiente violeta→coral) | ~6.5–6.9:1 | ✅ Pasa |
  | h1 (gradiente radial sutil 15%) | >15:1 | ✅ Pasa ampliamente |
  | .hero-section > p | Muy alto | ✅ Pasa ampliamente |
  | .btn-primary / .btn-submit (gradiente violeta) | ~4.86:1 | ✅ Pasa AA (mínimo 4.5:1, margen ajustado) |

  **Conclusión:** sin violaciones reales de contraste. Los botones son
  el caso más ajustado (~4.86:1 contra el mínimo de 4.5:1) — vale
  tenerlo en el radar si en el futuro se oscurece ese extremo del
  gradiente, pero hoy cumple.

- **Capturas:** `capturas/tc-4/momento-1/`

![Accesibilidad Chrome 1920x1080](capturas/tc-4/momento-1/chrome-1920x1080-a11y.png)

- **Issues generados:** Ninguno — 0 violaciones confirmadas, contraste
  verificado manualmente sin hallazgos.

  *Evidencia de uso de MCP: axe-core inyectado y ejecutado vía*
  *`mcp__playwright__browser_evaluate`, captura con*
  *`mcp__playwright__browser_take_screenshot`.*

---

## Nota metodológica

Re-ejecutado el 25/09 sobre `develop` con MCP real, reemplazando la
ejecución del 21/09 (Playwright directo, rama pre-fix). Resultado
consistente con la medición anterior: sin violaciones en ninguna de
las dos corridas.