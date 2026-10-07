# Test Case 8 — Componente Bootstrap Toast de confirmación

## Objetivo

Verificar con Playwright MCP la activación, el mensaje exacto, la posición responsive y el auto-hide del Toast `#toastConfirmacion` desde una tarjeta del catálogo y desde el botón `Sumar al Evento` del Modal.

## Ejecución

- **Fecha:** 06/10/2026
- **Rama:** `feature/dev-comp-bootstrap-modal-toast`
- **Página:** `http://localhost:3000/index.html`
- **Herramienta:** Playwright MCP con Chromium
- **Viewports:** iPhone 14 Pro (`393 × 852`), Samsung Galaxy S23 (`360 × 780`) e iPad Air (`820 × 1180`)
- **Criterios adicionales:** Bootstrap cargado, ausencia de overflow horizontal, ausencia de errores de consola y Toast dentro del viewport.

### Prompt utilizado

```text
Usando Playwright MCP contra http://localhost:3000/index.html, probá el Toast
#toastConfirmacion en iPhone 14 Pro (393x852), Samsung Galaxy S23 (360x780)
e iPad Air (820x1180). Activá el Toast desde una tarjeta y desde el botón
"Sumar al Evento" del Modal. Verificá que el mensaje sea exactamente
"Experiencia agregada a tu evento", que permanezca dentro del viewport mobile,
que no tape contenido crítico, que no genere overflow y que se oculte después
del delay configurado. Tomá capturas del Toast visible y devolvé resultados
PASS/FAIL con evidencia concreta.
```

## Resultados por dispositivo

| Dispositivo | Viewport | Toast | Estado |
|---|---:|---|---|
| iPhone 14 Pro | 393 × 852 | Nombre/precio, `· ahora`, mensaje exacto, dentro del viewport, sin solapamiento crítico y auto-hide PASS | ✅ PASS |
| Samsung Galaxy S23 | 360 × 780 | Nombre/precio, `· ahora`, mensaje exacto, dentro del viewport, sin solapamiento crítico y auto-hide PASS | ✅ PASS |
| iPad Air | 820 × 1180 | Nombre/precio, `· ahora`, mensaje exacto, dentro del viewport y auto-hide PASS | ✅ PASS |

## Resultados

| Verificación | Resultado | Evidencia |
|---|---|---|
| Bootstrap JS cargado | ✅ PASS | `window.bootstrap` disponible |
| Toast desde tarjeta | ✅ PASS | Se mostró al activar `Sumar al Evento` |
| Toast desde Modal | ✅ PASS | El botón del Modal heredó los datos del servicio y mostró el Toast |
| Contenido del Toast | ✅ PASS | Muestra `Gourmet Finger Food · $3.500 / pax`, marca `· ahora` y `Experiencia agregada a tu evento` |
| Posición mobile | ✅ PASS | El Toast permaneció dentro del viewport y no se superpuso con header o Modal |
| Overflow horizontal | ✅ PASS | `html.scrollWidth` y `body.scrollWidth` no superaron sus anchos útiles |
| Auto-hide | ✅ PASS | `data-bs-delay="4000"`; se ocultó después de 4500 ms |
| Errores de consola | ✅ PASS | No se registraron `pageerror` ni mensajes `console.error` |

## Criterios funcionales comprobados

- Los botones `.btn-sumar-evento` leen `dataset.serviceTitle` y `dataset.servicePrice` antes de mostrar el Toast.
- El cuerpo muestra el nombre y precio del servicio, junto con el texto exacto `Experiencia agregada a tu evento`.
- La instancia se muestra mediante `bootstrap.Toast.getOrCreateInstance(...).show()`.
- El Toast incluye botón de cierre y auto-hide configurado.
- En mobile no bloquea el header ni el Modal y no provoca overflow horizontal.

## Capturas

- [Toast — iPhone 14 Pro](capturas/tc-8/tc8-toast-iphone-14-pro.png)
- [Toast — Samsung Galaxy S23](capturas/tc-8/tc8-toast-samsung-galaxy-s23.png)
- [Toast — iPad Air](capturas/tc-8/tc8-toast-ipad-air.png)

## Issues / Hallazgos relacionados

- **[Issue #58 — Corrección del texto del Toast](https://github.com/carolabenvenuto-uces/planit/issues/58):** discrepancia previa entre `¡Experiencia agregada a tu evento exitosamente!` y el texto exacto exigido por el spec. Corregido en `index.html` y verificado como **✅ PASS**.

## Conclusión

**Resultado: ✅ PASS.** El Toast cumple el mensaje exacto del spec, funciona desde tarjeta y Modal, se adapta a los tres viewports y se oculta automáticamente sin generar overflow.
