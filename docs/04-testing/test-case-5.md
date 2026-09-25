# Test Case 5 — Validación de estructura HTML semántica y CSS

- **Herramientas:**
  - Playwright (librería directa) para inspección de estructura semántica
  - Nu Html Checker (validator.w3.org/nu) para validación HTML
  - Jigsaw CSS Validator (jigsaw.w3.org/css-validator) para validación CSS
- **Criterios obligatorios:**
  - Estructura HTML semántica: jerarquía de headings, landmarks, etiquetas de formulario asociadas
  - Validación HTML vía API del W3C
  - Validación CSS vía API del W3C (styles.css, components.css, responsive.css por separado)

---

## Momento 1 — Testing pre-merge (rama feature/)

- **Rama testeada:** `feature/responsive-design-add-responsive-styles`
  (último commit antes del merge a `develop` vía PR #24)
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

  *Evidencia de uso de GitHub MCP: el issue se creó con el servidor*
  *`github` (verificado "✓ Connected" vía `/mcp` antes de iniciar el*
  *testing), indicándole al agente explícitamente "Usando el MCP de*
  *GitHub, creá un issue en carolabenvenuto-uces/planit...", sin pasar*
  *por la interfaz web de GitHub.*

---

## Momento 2 — Testing post-merge (rama develop)

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