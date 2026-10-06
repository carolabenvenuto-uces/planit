# Test Case 7 — Componentes Bootstrap Modal y Toast

## Objetivo

Verificar con Playwright MCP la apertura, carga de contenido y cierre del Modal de ficha técnica `#modalDetalleServicio`, además de la activación, mensaje y auto-hide del Toast de confirmación `#toastConfirmacion`.

## Ejecución

- **Fecha:** 06/10/2026
- **Rama:** `feature/dev-comp-bootstrap-modal-toast`
- **Página:** `file:///C:/Users/valer/OneDrive/Escritorio/planit/index.html`
- **Herramienta:** Playwright MCP con Chromium
- **Viewport principal:** iPhone 14 Pro, `393 × 852`
- **Criterios adicionales:** ausencia de overflow horizontal, carga de Bootstrap y ausencia de errores de consola.

### Prompt utilizado

```text
Usando Playwright MCP, probá index.html en un viewport de iPhone 14 Pro
(393x852). Verificá que cada tarjeta del catálogo tenga los botones "Ver
 detalle" y "Sumar al evento". Probá la apertura del Modal
#modalDetalleServicio, la carga de título, imagen, descripción y precio, su
cierre con btn-close, y la activación del Toast #toastConfirmacion desde una
tarjeta y desde el botón "Sumar al evento" del Modal. Verificá también el
auto-hide, la ausencia de overflow horizontal y los errores de consola.
Devolvé resultados PASS/FAIL con evidencia concreta.
```

## Resultados

| Verificación | Resultado | Evidencia |
|---|---|---|
| Bootstrap JS cargado | ✅ PASS | `window.bootstrap` disponible |
| Tarjetas del catálogo | ✅ PASS | 3 tarjetas, 3 botones `Ver detalle` y 3 botones `Sumar al evento` |
| Apertura del Modal | ✅ PASS | `#modalDetalleServicio` quedó visible al activar `Ver detalle` |
| Contenido del Modal | ✅ PASS | Título `Gourmet Finger Food`, imagen cargada, descripción y precio presentes |
| Cierre del Modal | ✅ PASS | `btn-close` ocultó correctamente el Modal |
| Toast desde tarjeta | ✅ PASS | `#toastConfirmacion` visible tras activar `Sumar al evento` |
| Toast desde Modal | ✅ PASS | El botón del footer cerró el Modal y mostró el Toast |
| Mensaje del Toast | ✅ PASS | `¡Experiencia agregada a tu evento exitosamente!` |
| Auto-hide | ✅ PASS | `data-bs-delay="4000"`; se ocultó después del temporizador |
| Overflow horizontal | ✅ PASS | `html.scrollWidth` y `body.scrollWidth` no superaron sus anchos útiles |
| Errores de consola | ✅ PASS | No se registraron `pageerror` ni mensajes `console.error` |

## Criterios funcionales comprobados

- Cada acción `Ver detalle` utiliza `data-bs-toggle="modal"` y `data-bs-target="#modalDetalleServicio"`.
- La información del servicio se completa dinámicamente desde los atributos `data-service-*` del disparador.
- Los botones `Sumar al evento` de las tarjetas y del Modal invocan la instancia Bootstrap mediante `bootstrap.Toast.getOrCreateInstance(...).show()`.
- El Toast tiene botón de cierre y auto-hide configurado.
- El Modal y el Toast funcionan sin alterar la grilla responsive.

## Conclusión

**Resultado: ✅ PASS.** Los componentes Modal y Toast cumplen el flujo funcional previsto y no presentan errores de consola ni desbordamiento horizontal en el viewport probado.

- **Issues generados:** Ninguno.
- **Capturas:** No se generaron archivos de captura; la evidencia se obtuvo mediante aserciones Playwright MCP y mediciones del DOM.
