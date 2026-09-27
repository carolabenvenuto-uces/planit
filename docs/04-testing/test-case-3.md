# Test Case 3 — Performance y Carga

- **Herramienta:** MCP de Playwright (`mcp__playwright__*`) con
  Chromium, usando la Performance API del navegador
- **Métricas obligatorias:**
  - DOMContentLoaded
  - Load completo
  - DOM Interactive
  - Listado de recursos con tamaño y tiempo de descarga

---

## Momento 1 — Testing (rama develop, post-fix de Issues #25-#28)

- **Rama testeada:** `develop`, actualizada tras el merge de la PR #32
- **Prompt utilizado:**

\`\`\`
Usá el MCP de Playwright (mcp__playwright__*) para testear
http://localhost:3000 evaluando performance con la Performance API.
Necesito: DOMContentLoaded, Load completo, DOM Interactive, y listado
de recursos con tamaño y duración.

Verificá también si el peso total bajó respecto a la medición anterior
(antes del fix del Issue #28), considerando que ahora el lazy-loading
está aplicado a 3 de las 4 imágenes placeholder.

Sacá una captura y guardala en docs/04-testing/capturas/tc-3/momento-1/.
Confirmame con ls -la.
\`\`\`

- **Resultados:**

  | Métrica | Valor |
  |---|---|
  | DOM Interactive | 55 ms |
  | DOMContentLoaded | 55 ms |
  | Load completo | 89 ms |
  | Response End (HTML) | 8 ms |

  | Recurso | Tamaño | Duración |
  |---|---|---|
  | HTML (documento) | 13.4 KB | — |
  | styles.css | 8.8 KB | 0 ms |
  | components.css | 19.4 KB | 10.7 ms |
  | responsive.css | 7.3 KB | 10.7 ms |
  | diseño-inicial.png (mockup) | 235.0 KB | 0 ms |
  | Google Fonts (CSS + 3 .woff2) | ~97 KB | 0 ms |

  Peso total estimado: ~354 KB. La imagen del mockup sigue
  representando ~66% del peso total de la página.

  🔴 **El peso NO bajó tras el fix del Issue #28, y no podía bajar con
  ese fix.** Verificado con la Performance API: solo aparece **una**
  entrada de red para la imagen (no cuatro), aunque hay 4 `<img>`
  apuntando al mismo archivo — el navegador deduplica y descarga el
  recurso una sola vez por URL, sin importar cuántos `<img>` lo
  referencien ni si son `eager` o `lazy`. Además, el logo del header
  (el único de los 4 usos que **no** recibió `loading="lazy"`) sigue
  siendo `eager` y aparece primero en el DOM — fuerza la descarga
  completa de los 235 KB apenas carga la página, antes de que el
  lazy-loading de las 3 tarjetas pueda tener efecto. **En la práctica,
  marcar las otras 3 instancias como lazy es un no-op de performance.**

- **Capturas:** `capturas/tc-3/momento-1/`

![Performance Chrome 1920x1080](capturas/tc-3/momento-1/chrome-1920x1080-performance.png)

- **Issues generados:** [#33 — Logo y tarjetas de Plancitos siguen usando el mockup como placeholder (Issue #28 solo agregó lazy-loading)](https://github.com/carolabenvenuto-uces/planit/issues/33)

  Este issue documenta que el fix del Issue #28 fue parcial: revisando
  el diff exacto del PR #32 (vía MCP de GitHub), el único cambio
  aplicado fue agregar `loading="lazy"` a las 3 tarjetas — el `src`
  sigue siendo el mismo mockup en los 4 usos, y el logo del header ni
  siquiera recibió el cambio. El problema de fondo (contenido
  placeholder en producción) sigue sin resolver, y este análisis de
  performance confirma que el fix aplicado no tiene ningún impacto real
  en bytes transferidos ni tiempo de carga.

  *Evidencia de uso de MCP: métricas obtenidas con*
  *`mcp__playwright__browser_evaluate` (Performance API) y captura con*
  *`mcp__playwright__browser_take_screenshot`. El Issue #33 se creó con*
  *el servidor `github` MCP, consultando también el Issue #28 y el diff*
  *del PR #32 vía las mismas herramientas.*

---

## Nota metodológica

Re-ejecutado el 25/09 sobre `develop` con MCP real, reemplazando la
medición del 21/09 (Playwright directo, sobre la rama pre-fix de
Carola). Las métricas de tiempo mejoraron levemente respecto a la
medición original (160.8ms → 89ms de load), pero esto es más atribuible
a variabilidad de caché/timing entre corridas que a una mejora real de
performance — el análisis de recursos confirma que el peso transferido
no cambió de forma significativa.