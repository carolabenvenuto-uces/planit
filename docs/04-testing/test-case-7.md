# Test Case 7 — Componente Bootstrap Modal de ficha técnica

## Objetivo

Verificar con Playwright MCP la apertura, carga de contenido y cierre del Modal de ficha técnica `#modalDetalleServicio`, incluyendo sus interacciones de accesibilidad.

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
en los viewports de iPhone 14 Pro (393x852), Samsung Galaxy S23 (360x780) e
iPad Air (820x1180). Verificá la apertura del Modal #modalDetalleServicio,
la carga de título, imagen, descripción, capacidad, duración, incluye,
proveedor verificado y precio, su cierre con Escape, backdrop y btn-close, el
retorno de foco al botón disparador, la ausencia de overflow horizontal y los
errores de consola. Devolvé resultados PASS/FAIL con evidencia concreta.
```

## Resultados por dispositivo

| Dispositivo | Viewport | Modal | Estado |
|---|---:|---|---|
| iPhone 14 Pro | 393 × 852 | Apertura, cierres, retorno de foco y captura PASS | ✅ PASS |
| Samsung Galaxy S23 | 360 × 780 | Apertura, cierres, retorno de foco y captura PASS | ✅ PASS |
| iPad Air | 820 × 1180 | Apertura, cierres, retorno de foco y captura PASS | ✅ PASS |

## Resultados

| Verificación | Resultado | Evidencia |
|---|---|---|
| Bootstrap JS cargado | ✅ PASS | `window.bootstrap` disponible |
| Apertura del Modal | ✅ PASS | `#modalDetalleServicio` quedó visible al activar `Ver detalle` |
| Contenido del Modal | ✅ PASS | Título `Gourmet Finger Food`, imagen, descripción, capacidad `Hasta 200 pax`, duración `4 horas`, incluye y proveedor verificado presentes |
| Cierre del Modal | ✅ PASS | `btn-close` ocultó correctamente el Modal |
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

## Criterios funcionales comprobados

- Cada acción `Ver detalle` utiliza `data-bs-toggle="modal"` y `data-bs-target="#modalDetalleServicio"`.
- La información del servicio, incluidos capacidad, duración e incluye, se completa dinámicamente desde los atributos `data-service-*` del disparador.
- El Modal responde a `Escape`, backdrop y botón de cierre, y devuelve el foco al botón `Ver detalle` que lo abrió.
- El Modal funciona sin alterar la grilla responsive.

## Conclusión

**Resultado: ✅ PASS.** El Modal de ficha técnica cumple el flujo funcional previsto y no presenta errores de consola ni desbordamiento horizontal en los viewports probados.

## Capturas

- [Modal — iPhone 14 Pro](capturas/tc-7/tc7-modal-iphone-14-pro.png)
- [Modal — Samsung Galaxy S23](capturas/tc-7/tc7-modal-samsung-galaxy-s23.png)
- [Modal — iPad Air](capturas/tc-7/tc7-modal-ipad-air.png)

## Issues / Hallazgos

Los siguientes bugs fueron registrados durante la revisión del Modal y quedaron
resueltos mediante commits de la [PR #54](https://github.com/carolabenvenuto-uces/planit/pull/54):

- **[Bug #55 — Atributo `src=""` vacío en la imagen del Modal](https://github.com/carolabenvenuto-uces/planit/issues/55):** el atributo vacío incumplía la validación W3C y podía provocar una solicitud HTTP innecesaria. **Estado: ✅ Resuelto/Cerrado** mediante [`93d2192`](https://github.com/carolabenvenuto-uces/planit/commit/93d2192cfd40f0689d00e9e2dd98d09adb8d110f), que lo removió del HTML y mantuvo la carga dinámica.
- **[Bug #56 — Falta de lista estructurada de detalles](https://github.com/carolabenvenuto-uces/planit/issues/56):** el Modal no mostraba inicialmente Capacidad, Duración, Incluye ni el badge de Proveedor verificado. **Estado: ✅ Resuelto/Cerrado** mediante [`6631763`](https://github.com/carolabenvenuto-uces/planit/commit/66317631df7a5665d2de08daf17e60b7f08a01ac), que incorporó los detalles dinámicos del servicio.
- **[Bug #57 — Botón de cierre sin variante outline](https://github.com/carolabenvenuto-uces/planit/issues/57):** el botón `Cerrar` no utilizaba `btn-outline-secondary` como establecía la guía visual. **Estado: ✅ Resuelto/Cerrado** mediante [`3aefbe1`](https://github.com/carolabenvenuto-uces/planit/commit/3aefbe1f0af5a1c075d44e72544bc0ce10c085b3), que completó los ajustes del Modal y la evidencia de TC7.
