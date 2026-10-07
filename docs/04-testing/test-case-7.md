# Test Case 7 — Componentes Bootstrap Modal y Toast

## Objetivo

Verificar con Playwright MCP la apertura, carga de contenido y cierre del Modal de ficha técnica `#modalDetalleServicio`, además de la activación, mensaje y auto-hide del Toast de confirmación `#toastConfirmacion`.

## Ejecución

- **Fecha:** 06/10/2026
- **Rama:** `feature/dev-comp-bootstrap-modal-toast`
- **Página:** `http://localhost:3000/index.html`
- **Herramienta:** Playwright MCP con Chromium
- **Viewport principal:** iPhone 14 Pro, `393 × 852`
- **Criterios adicionales:** ausencia de overflow horizontal, carga de Bootstrap y ausencia de errores de consola.

### Prompt utilizado

```text
Usando Playwright MCP contra http://localhost:3000/index.html, probá la página
en un viewport de iPhone 14 Pro (393x852). Verificá que cada tarjeta del
catálogo tenga los botones "Ver detalle" y "Sumar al Evento". Probá la
apertura del Modal #modalDetalleServicio, la carga de título, imagen,
descripción, capacidad, duración, incluye, proveedor verificado y precio, su
cierre con btn-close, y la activación del Toast #toastConfirmacion desde una
tarjeta y desde el botón "Sumar al Evento" del Modal. Verificá también el
auto-hide, la ausencia de overflow horizontal y los errores de consola.
Devolvé resultados PASS/FAIL con evidencia concreta.
```

## Resultados

| Verificación | Resultado | Evidencia |
|---|---|---|
| Bootstrap JS cargado | ✅ PASS | `window.bootstrap` disponible |
| Tarjetas del catálogo | ✅ PASS | 3 tarjetas, 3 botones `Ver detalle` y 3 botones `Sumar al Evento` con `data-service-title` y `data-service-price` |
| Apertura del Modal | ✅ PASS | `#modalDetalleServicio` quedó visible al activar `Ver detalle` |
| Contenido del Modal | ✅ PASS | Título `Gourmet Finger Food`, imagen, descripción, capacidad `Hasta 200 pax`, duración `4 horas`, incluye y proveedor verificado presentes |
| Cierre del Modal | ✅ PASS | `btn-close` ocultó correctamente el Modal |
| Toast desde tarjeta | ✅ PASS | `#toastConfirmacion` visible tras activar `Sumar al Evento` |
| Toast desde Modal | ✅ PASS | El botón del footer cerró el Modal y mostró el Toast con los datos del servicio |
| Mensaje del Toast | ✅ PASS | `¡Gourmet Finger Food agregado a tu evento por $3.500 / pax!` |
| Auto-hide | ✅ PASS | `data-bs-delay="4000"`; se ocultó tras 5200 ms |
| Overflow horizontal | ✅ PASS | `html.scrollWidth` y `body.scrollWidth` no superaron sus anchos útiles |
| Errores de consola | ✅ PASS | No se registraron `pageerror` ni mensajes `console.error` |

## Criterios funcionales comprobados

- Cada acción `Ver detalle` utiliza `data-bs-toggle="modal"` y `data-bs-target="#modalDetalleServicio"`.
- La información del servicio, incluidos capacidad, duración e incluye, se completa dinámicamente desde los atributos `data-service-*` del disparador.
- Los botones `Sumar al Evento` de las tarjetas y del Modal leen `dataset.serviceTitle` y `dataset.servicePrice` y actualizan el Toast antes de invocar `bootstrap.Toast.getOrCreateInstance(...).show()`.
- El Toast tiene botón de cierre y auto-hide configurado.
- El Modal y el Toast funcionan sin alterar la grilla responsive.

## Conclusión

**Resultado: ✅ PASS.** Los componentes Modal y Toast cumplen el flujo funcional previsto y no presentan errores de consola ni desbordamiento horizontal en el viewport probado.

- **Issues generados:** Ninguno.
- **Capturas:** No se generaron archivos de captura; la evidencia se obtuvo mediante aserciones Playwright MCP y mediciones del DOM.
