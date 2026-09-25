# Test Case 5 — Validación de estructura HTML semántica y CSS

- **Herramientas:**
  - MCP de Playwright (`mcp__playwright__*`) para inspección de
    estructura semántica
  - Nu Html Checker (validator.w3.org/nu) para validación HTML
  - Jigsaw CSS Validator (jigsaw.w3.org/css-validator) para validación CSS
- **Criterios obligatorios:**
  - Estructura HTML semántica: jerarquía de headings, landmarks, etiquetas de formulario asociadas
  - Validación HTML vía API del W3C
  - Validación CSS vía API del W3C (styles.css, components.css, responsive.css por separado)

---

## Momento 1 — Testing (rama develop, post-fix de Issues #25-#28)

- **Rama testeada:** `develop`, actualizada tras el merge de la PR #32
- **Prompt utilizado:**

\`\`\`
Usá el MCP de Playwright (mcp__playwright__*) para evaluar
http://localhost:3000 en dos partes: 1) Estructura HTML semántica
(jerarquía de headings, landmarks, asociación label-control). 2)
Validá el HTML completo y los 3 archivos CSS contra las APIs del W3C.

Verificá especialmente si los 2 avisos del Issue #29 (background-clip:
text línea 53, y clip: rect() línea 243 de components.css) siguen
presentes o fueron corregidos.

Sacá una captura y guardala en docs/04-testing/capturas/tc-5/momento-1/.
Confirmame con ls -la.
\`\`\`

- **Resultados de cada validador:**

  **Parte 1 — Estructura HTML semántica**
  - Jerarquía de headings: un único `h1`, seguido de `h2` → `h3` en
    orden correcto en cada sección, sin saltos de nivel. 10 headings en
    total, todos secuenciales.
  - Landmarks: exactamente 1 `header`, 1 `nav`, 1 `main`, 1 `footer`,
    sin duplicados. 5 `section`, todas con heading propio.
  - 🟡 **Observación menor (no bloqueante):** ninguna `section` tiene
    `aria-label`/`aria-labelledby`, por lo que no se exponen como
    landmarks "region" nombrados ante lectores de pantalla. No es
    violación de axe-core, es una mejora posible.
  - Asociación label-control: 7 de 7 controles del formulario tienen
    `<label for="...">` correctamente vinculado. 100% de cobertura.

  **Parte 2 — Validación W3C**

  | Archivo | Errores | Warnings |
  |---|---|---|
  | index.html (Nu Html Checker) | 0 | 0 |
  | styles.css | 0 | 6 |
  | components.css | 0 | 149 |
  | responsive.css | 0 | 43 |

  Cero errores en los 4 archivos. Los warnings son casi en su totalidad
  ruido esperable ("CSS variables are currently not statically
  checked" repetido por cada `var(--...)`, y avisos de vendor
  extensions intencionales).

  🟢 **Issue #29 — verificación específica:**
  - `background-clip: text` (línea 53): **sigue presente**, marcado
    "deprecated" por el validador. Esperado — el propio issue indicaba
    que se puede dejar así (soportado en todos los navegadores
    actuales, riesgo real bajo).
  - `clip: rect(0,0,0,0)`: **ya NO está.** Fue reemplazado por
    `clip-path: inset(50%)` en `.sr-only` (línea 244 actual). El
    validador ya no reporta ese warning. **Fix aplicado correctamente.**

  **Conclusión:** de los 2 avisos del Issue #29, 1 fue corregido según
  la sugerencia (`clip-path`) y el otro se dejó intencionalmente sin
  cambios (también según la sugerencia del propio issue). El estado
  real coincide con lo esperado — el issue en GitHub sigue figurando
  como abierto pese a que el trabajo recomendado ya está hecho; se
  sugiere cerrarlo o dejarlo documentado como resuelto parcialmente por
  diseño.

- **Capturas:** `capturas/tc-5/momento-1/`

![Estructura semántica Chrome 1920x1080](capturas/tc-5/momento-1/chrome-1920x1080-semantic.png)

- **Issues generados:** Ninguno nuevo. Se sugiere a Coordinación cerrar
  el [Issue #29](https://github.com/carolabenvenuto-uces/planit/issues/29)
  como resuelto (parcialmente por diseño, según su propia sugerencia
  original).

  *Evidencia de uso de MCP: estructura evaluada con*
  *`mcp__playwright__browser_evaluate`, captura con*
  *`mcp__playwright__browser_take_screenshot`. Validación W3C realizada*
  *vía consultas HTTP directas a las APIs públicas del validador.*

---

## Nota metodológica

Re-ejecutado el 25/09 sobre `develop` con MCP real, reemplazando la
ejecución del 21/09. Resultado consistente: 0 errores en ambas
mediciones, con el hallazgo adicional en esta corrida de que 1 de los
2 avisos del Issue #29 ya fue corregido.