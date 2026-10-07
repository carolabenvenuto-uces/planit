# Test Case 7 (TC7) — Modal de Ficha Técnica (Bootstrap 5.3)

## Objetivo

Verificar el renderizado, la administración de foco, la accesibilidad (atributos ARIA, cierre con tecla ESC y clic en backdrop) y la adaptabilidad responsive del Modal de Ficha Técnica en la página `index.html`.

## Ejecución

- **Fecha de ejecución inicial:** 06/10/2026
- **Re-verificación:** 07/10/2026 sobre commit HEAD tras refactor del script.
- **Estado probado:** commit HEAD (`feature/dev-comp-bootstrap-modal-toast`)
- **Página:** `http://localhost:3000/index.html`
- **Herramienta:** Playwright MCP con Chromium
- **Viewports probados:** iPhone 14 Pro (393 × 852 px), Samsung Galaxy S23 (360 × 780 px) e iPad Air (820 × 1180 px).
- **Criterio de accesibilidad:** Atributos `role="dialog"`, `aria-modal="true"`, foco capturado de forma correcta al abrir, retorno de foco al elemento disparador al cerrar y soporte de cierre mediante tecla ESC y botón `.btn-close`.
- **Criterio de overflow:** Ausencia de desplazamiento horizontal en la ventana modal y en el cuerpo del documento (`scrollWidth == clientWidth`).

### Prompt utilizado

```text
Usando Playwright MCP con el servidor local en http://localhost:3000/index.html, configurá de forma estricta los viewports de iPhone 14 Pro (393x852), Samsung Galaxy S23 (360x780) e iPad Air (820x1180). Para cada viewport abrí el Modal de Ficha Técnica, verificá los atributos ARIA (role="dialog", aria-modal="true"), comprobá que el foco se posicione correctamente en el modal, verificá la ausencia de overflow horizontal y comprobá el cierre mediante el botón de cierre y la tecla ESC.

```

## Resultados

| Dispositivo        | Viewport   | Atributos ARIA | Administración de Foco | Overflow Modal | Cierre (ESC / Botón) | Resultado |
| ------------------ | ---------- | -------------- | ---------------------- | -------------- | -------------------- | --------- |
| iPhone 14 Pro      | 393 × 852  | ✅ Correcto     | ✅ Capturado en Modal   | ✅ Sin overflow | ✅ Funcional          | ✅ PASS    |
| Samsung Galaxy S23 | 360 × 780  | ✅ Correcto     | ✅ Capturado en Modal   | ✅ Sin overflow | ✅ Funcional          | ✅ PASS    |
| iPad Air           | 820 × 1180 | ✅ Correcto     | ✅ Capturado en Modal   | ✅ Sin overflow | ✅ Funcional          | ✅ PASS    |

### Verificación de Accesibilidad e Interacción

* **Atributos ARIA:** Al abrirse el modal se activan correctamente `role="dialog"` y `aria-modal="true"`, junto con la vinculación a `aria-labelledby`.
* **Gestión de Foco:** El foco se traslada al contenedor del modal al abrirse y regresa al botón disparador al cerrarse.
* **Mecanismos de Cierre:** Se confirmó el correcto funcionamiento al hacer clic en el botón `.btn-close`, en el fondo transparente (backdrop) y al presionar la tecla `ESC`.

## Capturas de Evidencia

Las capturas correspondientes a la ejecución se encuentran almacenadas en `docs/04-testing/capturas/tc-7/`:

* `tc7-iphone14pro-modal.png` (393 × 852 px)
* `tc7-galaxys23-modal.png` (360 × 780 px)
* `tc7-ipadair-modal.png` (820 × 1180 px)

## Conclusión

**Resultado: ✅ PASS.** El componente Modal cumple con las pautas de accesibilidad WCAG y la especificación de Bootstrap v5.3\. No presenta desbordamientos horizontales en ninguno de los viewports evaluados.

## Issues / Hallazgos Relacionados

-**[#55](https://github.com/carolabenvenuto-uces/planit/issues/55)**— [Componentes/Modal] Atributo `src=""` vacío en el modal de ficha técnica (Corregido y verificado). 
-**[#56](https://github.com/carolabenvenuto-uces/planit/issues/56)**— [Componentes/Modal] Formato y estructura de la lista de detalles del producto (Corregido y verificado). 
-**[#57](https://github.com/carolabenvenuto-uces/planit/issues/57)**— [Componentes/Modal] Ajuste del botón "Cerrar" a variante outline (Corregido y verificado en commit `e6b9d49`). 
-**[#58](https://github.com/carolabenvenuto-uces/planit/issues/58)** — [Componentes/Toast] Corrección del texto descriptivo del toast (Corregido y verificado en commit `bcef92d`).

## Limitaciones

Las pruebas fueron ejecutadas con el servidor Playwright MCP sobre el motor Chromium.