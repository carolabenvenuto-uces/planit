# Test Case 2 — Responsive en dispositivos móviles

- **Herramienta:** Playwright (librería directa, mismo enfoque que
  Test Case 1) — WebKit para dispositivos iOS (motor real de Safari),
  Chromium para Android (motor real de Chrome), con emulación completa
  de viewport, deviceScaleFactor, touch y user-agent de cada dispositivo
- **Dispositivos obligatorios:**
  - iPhone 14 Pro — 390×844
  - Samsung Galaxy S23 — 412×915
  - iPad Air — 820×1180

---

## Momento 1 — Testing pre-merge (rama feature/)

- **Rama testeada:** `feature/responsive-design-add-responsive-styles`
  (último commit antes del merge a `develop` vía PR #24)
- **Prompt utilizado:**

\`\`\`
Usando Playwright directamente (no MCP, mismo enfoque que usaste en el
Test Case 1), testeá http://localhost:3000 contra los 3 dispositivos
obligatorios del Test Case 2 (responsive en dispositivos móviles), usando
viewport emulation: iPhone 14 Pro 390×844, Samsung Galaxy S23 412×915,
iPad Air 820×1180.

Para cada uno: navegá a la página, sacá una captura de pantalla completa,
y reportá cualquier problema de responsive (elementos desbordados,
overlap, texto cortado, botones inaccesibles, scroll horizontal). Guardá
las capturas.
\`\`\`

- **Resultados:**
  - Sin errores de consola/JS, sin imágenes rotas, sin scroll horizontal
    a nivel de página en ninguno de los 3 dispositivos.
  - 🟡 **Tablas desbordan su contenedor en iPhone 14 Pro y Galaxy S23:**
    las tablas de "Planilla de Presupuesto Estimado" y "Gestión de
    Invitados" (ancho fijo ~520px) cortan las columnas TOTAL ($) y parte
    de CANTIDAD/ESTADO DE CONFIRMACIÓN en viewports de 390px/412px. El
    contenido no se pierde (hay `overflow-x: auto`), pero no hay
    indicador visual de que existe más contenido para scrollear. No
    ocurre en iPad Air (820px).
  - 🟡 **Links de footer con tap target chico:** "Repositorio Oficial en
    GitHub", "Especificación UX" y "Especificación Frontend" miden ~17px
    de alto, por debajo del mínimo recomendado de 24px (WCAG 2.5.8).
    Impacto bajo, links secundarios.
  - Sin otros hallazgos: no hay overlaps ni texto cortado visible (el
    único elemento "clipped" detectado automáticamente fue un `<label>`
    intencionalmente oculto para accesibilidad — `sr-only`, no es bug).
- **Capturas:** `capturas/tc-2/momento-1/`

![iPhone 14 Pro 390x844](capturas/tc-2/momento-1/iphone-14-pro-390x844.png)
![Samsung Galaxy S23 412x915](capturas/tc-2/momento-1/galaxy-s23-412x915.png)
![iPad Air 820x1180](capturas/tc-2/momento-1/ipad-air-820x1180.png)

- **Issues generados:**
  - [#26 — Tablas desbordan sin indicador de scroll en mobile](https://github.com/carolabenvenuto-uces/planit/issues/26)
  - [#27 — Links de footer con área de toque menor al mínimo WCAG](https://github.com/carolabenvenuto-uces/planit/issues/27)

---

## Momento 2 — Testing post-merge (rama develop)

- **Prompt utilizado:**

\`\`\`
(pendiente)
\`\`\`

- **Resultados:** _(pendiente)_
- **Capturas:** `capturas/tc-2/momento-2/`
- **Issues generados:** _(pendiente)_