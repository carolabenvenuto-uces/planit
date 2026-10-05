# Test Case 5 — Validación de estructura HTML semántica y CSS

> **Estructura por momento (corrección RC7):** cada momento indica el estado probado, el prompt, los resultados, las capturas y los issues. El Momento 1 se ejecutó de forma diferida, después del merge (ver [spec-qa.md §5](../03-specs/actividad-obligatoria-2/spec-qa.md)). Los resultados y capturas del 21/09, que habían sido reemplazados por la re-ejecución del 25/09, se restauraron desde el historial de git (commit `d0078e7`).

---

## Momento 1 — Testing pre-merge (diferido, rama feature/)

- **Estado probado:** `feature/responsive-design-add-responsive-styles` @ `1bd2f00` (último commit antes del merge de la PR #24; incluye el trabajo de `feature/dev-frontend-css-add-styles`) — ejecutado el 21/09/2026
- **Herramientas:**
  - Playwright (librería directa) para inspección de estructura semántica
  - Nu Html Checker (validator.w3.org/nu) para validación HTML
  - Jigsaw CSS Validator (jigsaw.w3.org/css-validator) para validación CSS
- **Criterios obligatorios:**
  - Estructura HTML semántica: jerarquía de headings, landmarks, etiquetas de formulario asociadas
  - Validación HTML vía API del W3C
  - Validación CSS vía API del W3C (styles.css, components.css, responsive.css por separado)
- **Prompt utilizado:**

\`\`\`
Usando Playwright directamente (mismo enfoque que los test cases
anteriores), evaluá http://localhost:3000 en dos partes: 1) Estructura
HTML semántica (jerarquía de headings, landmarks, asociación
label-control). 2) Validación W3C del HTML completo y de
css/styles.css, css/components.css y css/responsive.css contra las
APIs del W3C. Sacá una captura y confirmame con ls -la.
\`\`\`

- **Resultados de cada validador:**

  **Parte 1 — Estructura HTML semántica**
  - Jerarquía de headings: correcta. `h1` único → `h2` (4 secciones) →
    `h3` (subsecciones/tarjetas), sin saltos de nivel.
  - Landmarks: `header`(1), `nav`(1), `main`(1), `footer`(1), más
    `section`(5) y `article`(3) de apoyo. Sin duplicados ni anidamiento
    incorrecto.
  - Asociación label↔control: los 7 controles de formulario tienen
    `<label for="...">` correctamente vinculado por `id`.
  - **Conclusión: sin hallazgos**, estructura semántica correcta en los
    3 ejes evaluados.

  **Parte 2 — Validación W3C**
  - **HTML (Nu Html Checker):** 0 errores, 0 warnings. HTML completamente válido.
  - **CSS (Jigsaw):** 0 errores en los 3 archivos.

    | Archivo | Errores | Warnings |
    |---|---|---|
    | css/styles.css | 0 | 6 |
    | css/components.css | 0 | 148 |
    | css/responsive.css | 0 | 32 |

    De los 186 warnings totales, casi todos son ruido esperable: 176
    son el aviso genérico de que las variables CSS (`var(--x)`) no se
    verifican estáticamente; 6 son avisos de vendor extensions
    (prefijos `-webkit-`/`-moz-` intencionales); 1 es un `@import` no
    verificado en modo de carga directa.

  🟡 **2 avisos concretos que valen mejora** (ambos en `components.css`):
  - Línea 53: `background-clip: text` — marcado como deprecated por el
    validador (no reconoce el spec moderno; soportado en todos los
    navegadores actuales, riesgo real bajo).
  - Línea 243: `clip: rect(0, 0, 0, 0)` dentro de la clase `sr-only` —
    propiedad legacy, se recomienda `clip-path: inset(50%)`.

- **Capturas:** `capturas/tc-5/momento-1/`

![Estructura semántica Chrome 1920x1080](capturas/tc-5/momento-1/chrome-1920x1080-semantic.png)

- **Issues generados:**
  - [#29 — Modernizar 2 propiedades CSS legacy detectadas por validador W3C](https://github.com/carolabenvenuto-uces/planit/issues/29)

---

## Momento 2 — Testing post-merge (rama develop)

### Ejecución 1 — develop post-merge, antes de los fixes

- **Estado probado:** `develop` @ `8393d33` (merge de la PR #24) — 21/09/2026
- **Herramienta:** la misma que en Momento 1.
- **Prompt utilizado:**

\`\`\`
Repetí el Test Case 5 (estructura semántica + validación W3C) contra
http://localhost:3000, esta vez sobre la rama develop (post-merge).
Mismo enfoque: estructura HTML y validación W3C. Verificá especialmente
si los 2 avisos del Issue #29 siguen presentes. Guardá la captura y
confirmame con ls -la.
\`\`\`

- **Resultados de cada validador:**

  **Parte 1 — Estructura HTML semántica:** idéntica a Momento 1, sin
  issues. Jerarquía de headings correcta, landmarks completos (1
  header, 1 nav, 1 main, 1 footer, 5 section, 3 article), y los 7
  controles de formulario con label asociado.

  **Parte 2 — Validación W3C:** mismos resultados exactos que Momento 1.
  - HTML: 0 errores, 0 warnings.
  - CSS: 0 errores en los 3 archivos (mismos conteos de warnings:
    styles.css 6, components.css 148, responsive.css 32 — dominados
    por el aviso genérico de CSS variables).

  🟡 **Los 2 avisos del Issue #29 siguen presentes, sin corregir**, en
  las mismas líneas exactas de `components.css`:
  - Línea 53: `background-clip: text` — "The value 'text' is deprecated".
  - Línea 243: `clip: rect(0, 0, 0, 0)` — "The property 'clip' is
    deprecated" (dentro de `sr-only`).

  Sin cambios respecto a Momento 1 — consistente con que el issue
  quedó abierto como mejora de baja prioridad, no bloqueante.

- **Capturas:** `capturas/tc-5/momento-2/`

![Estructura semántica Chrome 1920x1080](capturas/tc-5/momento-2/chrome-1920x1080-semantic.png)

- **Issues generados:** Ninguno nuevo — persiste el Issue #29 ya
  creado en Momento 1, todavía sin resolver.

### Ejecución 2 — develop post-fix, con Playwright MCP

- **Estado probado:** `develop` @ `1fc8d6b` (merge de la PR #32, `fix/qa-bugfixes-ui-responsive`) — 25/09/2026
- **Herramientas:**
  - MCP de Playwright (`mcp__playwright__*`) para inspección de
    estructura semántica
  - Nu Html Checker (validator.w3.org/nu) para validación HTML
  - Jigsaw CSS Validator (jigsaw.w3.org/css-validator) para validación CSS
- **Criterios obligatorios:**
  - Estructura HTML semántica: jerarquía de headings, landmarks, etiquetas de formulario asociadas
  - Validación HTML vía API del W3C
  - Validación CSS vía API del W3C (styles.css, components.css, responsive.css por separado)
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

- **Capturas:** `capturas/tc-5/momento-2/` (archivos `post-fix-*`)

![Estructura semántica Chrome 1920x1080](capturas/tc-5/momento-2/post-fix-chrome-1920x1080-semantic.png)

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
