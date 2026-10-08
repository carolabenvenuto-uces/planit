# Test Case 9 (TC9) — Iframe Multimedia Responsivo (<iframe>)

## Objetivo

Verificar el renderizado correcto, la proporción de aspecto responsiva 16:9 (ratio ratio-16x9), la integración en la columna principal (col-lg-8) y la accesibilidad del componente HTML avanzado <iframe> para el video promocional del taller interactivo en la página index.html.

## Ejecución

- **Fecha de ejecución inicial:** 07/10/2026
- **Estado probado:** commit HEAD (feature/dev-comp-html-avanzados-add-components)
- **Página:** http://localhost:3000/index.html
- **Herramienta:** Playwright MCP con Chromium
- **Viewports probados:** iPhone 14 Pro (393 × 852 px), Samsung Galaxy S23 (360 × 780 px) e iPad Air (820 × 1180 px).
- **Criterio de accesibilidad:** Presencia del atributo title descriptivo en el <iframe> para lectura por tecnologías asistivas.
- **Criterio de comportamiento:** Proporción 16:9 fluida sin desbordamiento ni deformación en los diferentes breakpoints.
- **Criterio de overflow:** Ausencia de desplazamiento horizontal en el viewport (scrollWidth == clientWidth).

### Prompt utilizado

Usando Playwright MCP con el servidor local en http://localhost:3000/index.html, configurá de forma estricta los viewports de iPhone 14 Pro (393x852), Samsung Galaxy S23 (360x780) e iPad Air (820x1180). Para cada viewport navegá a la sección #taller-video, verificá la visibilidad del contenedor ratio-16x9, comprobá que el atributo src apunte al video promocional del taller de cerámica, validá el atributo title accesible y verificá que no se produzca desbordamiento horizontal.

## Resultados

| Dispositivo | Viewport | Atributos ARIA / Title | Activación / Visibilidad | Proporción 16:9 / Adaptación | Overflow | Resultado |
| --- | --- | --- | --- | --- | --- | --- |
| iPhone 14 Pro | 393 × 852 | ✅ Correcto | ✅ Visible en sección | ✅ Proporcional fluida | ✅ Sin overflow | ✅ PASS |
| Samsung Galaxy S23 | 360 × 780 | ✅ Correcto | ✅ Visible en sección | ✅ Proporcional fluida | ✅ Sin overflow | ✅ PASS |
| iPad Air | 820 × 1180 | ✅ Correcto | ✅ Visible en sección | ✅ Proporcional fluida | ✅ Sin overflow | ✅ PASS |

### Verificación de Accesibilidad e Interacción

- **Atributos ARIA / Title:** El reproductor incluye title="Taller en Acción: Cerámica y Chardonnay - PlanIT", garantizando la descripción clara del contenido para lectores de pantalla.
- **Estilos y Borde:** Integrado mediante la clase helper de Bootstrap .ratio.ratio-16x9 con bordes redondeados (rounded-3) y sombra sutil (shadow-sm).
- **Comportamiento:** Mantiene el aspecto 16:9 sin barras negras indeseadas ni distorsión visual en pantallas pequeñas o tablets.

## Capturas de Evidencia

Las capturas correspondientes a la ejecución se encuentran almacenadas en docs/04-testing/capturas/tc-9/:

- **[Iframe — iPhone 14 Pro](capturas/tc-9/tc9-iframe-iphone-14-pro.png)** (393 × 852 px)
- **[Iframe — Samsung Galaxy S23](capturas/tc-9/tc9-iframe-samsung-galaxy-s23.png)** (360 × 780 px)
- **[Iframe — iPad Air](capturas/tc-9/tc9-iframe-ipad-air.png)** (820 × 1180 px)

## Conclusión

**Resultado: ✅ PASS.** El componente <iframe> multimedia responde de manera fluida en la grilla col-lg-8 y cumple con todos los estándares de accesibilidad y diseño responsivo exigidos.

## Issues / Hallazgos Relacionados

- **[#47](https://github.com/carolabenvenuto-uces/planit/issues/47)** — Integración y validación de componentes HTML avanzados.

## Limitaciones

Las pruebas fueron ejecutadas con el servidor Playwright MCP sobre el motor Chromium.