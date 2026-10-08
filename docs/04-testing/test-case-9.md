# Test Case 9 (TC9) — Validación del Componente Iframe Multimedia

## Objetivo

Verificar que el componente `<iframe>` integrado en la sección `#taller-video` mantenga la relación de aspecto 16:9 mediante el helper `.ratio.ratio-16x9` de Bootstrap 5.3, no genere overflow horizontal en viewports de iPhone 14 Pro, Samsung Galaxy S23 e iPad Air, y muestre el reproductor sin Error 153.

## Ejecución

- **Fecha:** 07/10/2026
- **Estado:** Corrección del iframe aplicada; evidencia final pendiente de captura manual.
- **Página:** http://localhost:3000/index.html
- **Herramienta:** Playwright MCP con Chromium

### Prompt utilizado

```text
Usando Playwright MCP con el servidor local en http://localhost:3000/index.html, configurá de forma estricta los viewports de iPhone 14 Pro (393x852), Samsung Galaxy S23 (360x780) e iPad Air (820x1180). Para cada viewport navegá a #taller-video, verificá el helper .ratio.ratio-16x9, el src youtube-nocookie.com y el title descriptivo; esperá a que aparezcan la miniatura y el control Play, confirmá que no se vea Error 153 y comprobá que no haya overflow horizontal. Guardá una captura del panel en cada viewport.
```

## Resultados

| Dispositivo | Viewport | Title accesible | Reproductor sin Error 153 | Proporción 16:9 | Overflow | Resultado |
| --- | --- | --- | --- | --- | --- | --- |
| iPhone 14 Pro | 393 × 852 | ✅ Descriptivo en código | ⏳ Pendiente de evidencia | ⏳ Pendiente | ⏳ Pendiente | ⏳ Pendiente |
| Samsung Galaxy S23 | 360 × 780 | ✅ Descriptivo en código | ⏳ Pendiente de evidencia | ⏳ Pendiente | ⏳ Pendiente | ⏳ Pendiente |
| iPad Air | 820 × 1180 | ✅ Descriptivo en código | ⏳ Pendiente de evidencia | ⏳ Pendiente | ⏳ Pendiente | ⏳ Pendiente |

## Capturas de Evidencia

No hay capturas válidas en el repositorio todavía. Tomar manualmente cada captura cuando el video esté cargando/reproduciéndose y confirmar que no aparezca Error 153; guardar los archivos en `docs/04-testing/capturas/tc-9/` con estos nombres:

- iPhone 14 Pro (393 × 852 px): `capturas/tc-9/tc9-youtube-nocookie-iphone-14-pro.png`
- Samsung Galaxy S23 (360 × 780 px): `capturas/tc-9/tc9-youtube-nocookie-samsung-galaxy-s23.png`
- iPad Air (820 × 1180 px): `capturas/tc-9/tc9-youtube-nocookie-ipad-air.png`

## Conclusión

**Estado: ⏳ Pendiente de evidencia.** El código usa `youtube-nocookie.com` y una política de referer explícita, pero TC9 no se marca PASS hasta revisar las tres capturas manuales con el video cargando y sin Error 153.

## Issues / Hallazgos Relacionados

- **[#47](https://github.com/carolabenvenuto-uces/planit/issues/47)** — Integración y validación de componentes HTML avanzados.
- **[#64](https://github.com/carolabenvenuto-uces/planit/issues/64)** — Error 153 en el iframe; corrección aplicada, evidencia manual pendiente.
