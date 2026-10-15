# Test Case 9 (TC9) — Validación del Componente Iframe Multimedia

## Objetivo

Verificar que el componente `<iframe>` integrado en la sección `#taller-video` mantenga la relación de aspecto 16:9 mediante el helper `.ratio.ratio-16x9` de Bootstrap 5.3, no genere overflow horizontal en viewports de iPhone 14 Pro, Samsung Galaxy S23 e iPad Air, y muestre el reproductor sin Error 153.

## Ejecución

- **Fecha:** 07/10/2026
- **Estado:** ✅ PASS — Validación completada con éxito sin errores en pantalla.
- **Página:** http://localhost:3000/index.html
- **Herramienta:** Playwright MCP con Chromium

### Prompt utilizado

```text
Usando Playwright MCP con el servidor local en http://localhost:3000/index.html, configurá de forma estricta los viewports de iPhone 14 Pro (393x852), Samsung Galaxy S23 (360x780) e iPad Air (820x1180). Para cada viewport navegá a #taller-video, verificá el helper .ratio.ratio-16x9, el src youtube-nocookie.com y el title descriptivo; esperá a que aparezcan la miniatura y el control Play, confirmá que no se vea Error 153 y comprobá que no haya overflow horizontal. Guardá una captura del panel en cada viewport.
```

## Resultados

| Dispositivo | Viewport | Title accesible | Reproductor sin Error 153 | Proporción 16:9 | Overflow | Resultado |
| --- | --- | --- | --- | --- | --- | --- |
| iPhone 14 Pro | 393 × 852 | ✅ Descriptivo | ✅ Cargado sin error 153 | ✅ 16:9 OK | ✅ Sin overflow | ✅ PASS |
| Samsung Galaxy S23 | 360 × 780 | ✅ Descriptivo | ✅ Cargado sin error 153 | ✅ 16:9 OK | ✅ Sin overflow | ✅ PASS |
| iPad Air | 820 × 1180 | ✅ Descriptivo | ✅ Cargado sin error 153 | ✅ 16:9 OK | ✅ Sin overflow | ✅ PASS |

## Capturas de Evidencia

Las capturas de verificación en cada viewport se encuentran almacenadas en `docs/04-testing/capturas/tc-9/`:

- **[TC9 — iPhone 14 Pro](capturas/tc-9/tc9-youtube-nocookie-iphone-14-pro.png)** (393 × 852 px)
- **[TC9 — Samsung Galaxy S23](capturas/tc-9/tc9-youtube-nocookie-samsung-galaxy-s23.png)** (360 × 780 px)
- **[TC9 — iPad Air](capturas/tc-9/tc9-youtube-nocookie-ipad-air.png)** (820 × 1180 px)

## Conclusión

Resultado: ✅ PASS. El componente <iframe> carga correctamente desde el dominio youtube-nocookie.com con la política de referer strict-origin-when-cross-origin, eliminando el Error 153. Mantiene la proporción fluida 16:9 sin generar desbordamientos horizontales en ninguno de los dispositivos evaluados.

## Issues / Hallazgos Relacionados

- **[#47](https://github.com/carolabenvenuto-uces/planit/issues/47)** — Integración y validación de componentes HTML avanzados.
- **[#64](https://github.com/carolabenvenuto-uces/planit/issues/64)** — Error 153 en el iframe; corrección aplicada, evidencia manual pendiente.
