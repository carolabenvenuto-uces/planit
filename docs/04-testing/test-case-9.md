# Test Case 9 (TC9) — Validación del Componente Iframe Multimedia

## Objetivo

Verificar que el componente `<iframe>` integrado en la sección `#taller-video` mantenga la relación de aspecto 16:9 mediante el helper `.ratio.ratio-16x9` de Bootstrap 5.3, no genere overflow horizontal en viewports de iPhone 14 Pro, Samsung Galaxy S23 e iPad Air, y cargue correctamente el reproductor promocional.

## Ejecución

- **Fecha:** 07/10/2026
- **Estado probado:** commit HEAD (`feature/dev-comp-html-avanzados-add-components`)
- **Página:** http://localhost:3000/index.html
- **Herramienta:** Playwright MCP con Chromium

### Prompt utilizado

```text
Usando Playwright MCP con el servidor local en http://localhost:3000/index.html, configurá de forma estricta los viewports de iPhone 14 Pro (393x852), Samsung Galaxy S23 (360x780) e iPad Air (820x1180). Para cada viewport navegá a la sección #taller-video, verificá la visibilidad del contenedor ratio-16x9, comprobá que el atributo src apunte al video promocional del taller de cerámica, validá el atributo title accesible y verificá que no se produzca desbordamiento horizontal.

## Resultados

| Dispositivo | Viewport | Atributos ARIA / Title | Activación / Visibilidad | Proporción 16:9 / Adaptación | Overflow | Resultado |
| --- | --- | --- | --- | --- | --- | --- |
| iPhone 14 Pro | 393 × 852 | ✅ Correcto | ✅ Visible en sección | ✅ Proporcional fluida | ✅ Sin overflow | ✅ PASS |
| Samsung Galaxy S23 | 360 × 780 | ✅ Correcto | ✅ Visible en sección | ✅ Proporcional fluida | ✅ Sin overflow | ✅ PASS |
| iPad Air | 820 × 1180 | ✅ Correcto | ✅ Visible en sección | ✅ Proporcional fluida | ✅ Sin overflow | ✅ PASS |

## Capturas de Evidencia

Las capturas con los viewports correspondientes se encuentran en `docs/04-testing/capturas/tc-9/`:

- **[TC9 — iPhone 14 Pro](capturas/tc-9/tc9-iframe-iphone-14-pro.png)** (393 × 852 px)
- **[TC9 — Samsung Galaxy S23](capturas/tc-9/tc9-iframe-samsung-galaxy-s23.png)** (360 × 780 px)
- **[TC9 — iPad Air](capturas/tc-9/tc9-iframe-ipad-air.png)** (820 × 1180 px)

## Conclusión

**Resultado: ✅ PASS.** El componente `<iframe>` se escala correctamente en todos los rangos de pantalla probados respetando el aspecto 16:9 de Bootstrap sin provocar desbordamiento.

## Issues / Hallazgos Relacionados

- **[#47](https://github.com/carolabenvenuto-uces/planit/issues/47)** — Integración y validación de componentes HTML avanzados.
- **[Bug / Error 153]** — Error de reproducción en YouTube Embed resuelto mediante migración a `youtube-nocookie.com` y `referrerpolicy="strict-origin-when-cross-origin"`.