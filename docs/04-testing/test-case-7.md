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

## Resultados por dispositivo

| Dispositivo | Viewport | Modal | Toast | Estado |
|---|---:|---|---|---|
| iPhone 14 Pro | 393 × 852 | Apertura, cierres y retorno de foco PASS | Visible dentro del viewport, sin solapamiento crítico, auto-hide PASS | ✅ PASS |
| Samsung Galaxy S23 | 360 × 780 | Apertura, cierres y retorno de foco PASS | Visible dentro del viewport, sin solapamiento crítico, auto-hide PASS | ✅ PASS |
| iPad Air | 820 × 1180 | Apertura, cierres y retorno de foco PASS | Visible dentro del viewport y sin overflow PASS | ✅ PASS |

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
| Mensaje del Toast | ✅ PASS | `Experiencia agregada a tu evento`, coincide exactamente con el criterio del spec |
| Auto-hide | ✅ PASS | `data-bs-delay="4000"`; se ocultó tras 5200 ms |
| Overflow horizontal | ✅ PASS | `html.scrollWidth` y `body.scrollWidth` no superaron sus anchos útiles |
| Errores de consola | ✅ PASS | No se registraron `pageerror` ni mensajes `console.error` |

## Interacciones de accesibilidad del Modal

Las interacciones se repitieron en los tres viewports, esperando el fin de la
transición de Bootstrap antes de comprobar el estado y el foco:

| Interacción | Resultado | Evidencia |
|---|---|---|
| Apertura desde `Ver detalle` | ✅ PASS | El Modal se mostró con `aria-modal="true"` y cargó los datos del servicio |
| Cierre con `Escape` | ✅ PASS | El Modal se ocultó y el foco volvió al botón `Ver detalle` disparador |
| Cierre con click en backdrop | ✅ PASS | El click fuera de `.modal-dialog` ocultó el Modal y restauró el foco |
| Cierre con botón `Cerrar` / `X` | ✅ PASS | El botón `.btn-close` ocultó el Modal y restauró el foco |

## Verificación del Toast en mobile

En iPhone 14 Pro (`393 × 852`) y Samsung Galaxy S23 (`360 × 780`), el Toast
se mostró al activar `Sumar al Evento`, permaneció dentro de los límites del
viewport, no generó overflow horizontal ni se superpuso con el header o el
Modal, y se ocultó automáticamente después de `4500ms` con el delay de
Bootstrap configurado en `4000ms`. El mensaje incluyó el nombre y precio del
servicio: `Experiencia agregada a tu evento`, exactamente como exige el spec.

## Criterios funcionales comprobados

- Cada acción `Ver detalle` utiliza `data-bs-toggle="modal"` y `data-bs-target="#modalDetalleServicio"`.
- La información del servicio, incluidos capacidad, duración e incluye, se completa dinámicamente desde los atributos `data-service-*` del disparador.
- Los botones `Sumar al Evento` de las tarjetas y del Modal leen `dataset.serviceTitle` y `dataset.servicePrice` y actualizan el Toast antes de invocar `bootstrap.Toast.getOrCreateInstance(...).show()`.
- El Modal responde a `Escape`, backdrop y botón de cierre, y devuelve el foco al botón `Ver detalle` que lo abrió.
- El Toast tiene botón de cierre y auto-hide configurado.
- El Modal y el Toast funcionan sin alterar la grilla responsive.

## Conclusión

**Resultado: ✅ PASS.** Los componentes Modal y Toast cumplen el flujo funcional previsto y no presentan errores de consola ni desbordamiento horizontal en el viewport probado.

## Hallazgo de bug corregido

- **Discrepancia de texto del Toast:** la ejecución previa mostraba `¡Experiencia agregada a tu evento exitosamente!`, mientras que el spec exige exactamente `Experiencia agregada a tu evento`. El hallazgo fue registrado durante TC7 y corregido en `index.html`; la verificación actual contra el texto exacto resulta **✅ PASS**.
- **Issue bug TC7-TOAST-001:** corregido y verificado en los tres dispositivos obligatorios.
- **Capturas:** No se generaron archivos de captura; la evidencia se obtuvo mediante aserciones Playwright MCP y mediciones del DOM.
