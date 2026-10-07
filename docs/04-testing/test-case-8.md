# Test Case 8 (TC8) — Toast de Confirmación (Bootstrap 5.3)

## Objetivo

Verificar la activación, visibilidad, temporización (auto-ocultado / desvanecimiento), comportamiento responsive y atributos de accesibilidad del componente Toast de confirmación en la página `index.html`.

## Ejecución

- **Fecha de ejecución inicial:** 06/10/2026
- **Re-verificación:** 07/10/2026 sobre commit HEAD tras refactor del script.
- **Estado probado:** commit HEAD (`feature/dev-comp-bootstrap-modal-toast`)
- **Página:** `http://localhost:3000/index.html`
- **Herramienta:** Playwright MCP con Chromium
- **Viewports probados:** iPhone 14 Pro (393 × 852 px), Samsung Galaxy S23 (360 × 780 px) e iPad Air (820 × 1180 px).
- **Criterio de accesibilidad:** Atributos `role="status"` y `aria-live="polite"` activos para lectores de pantalla durante el disparo de la notificación.
- **Criterio de comportamiento:** Despliegue correcto sobre la esquina o zona de notificación, visibilidad temporal y cierre manual vía `.btn-close` o automático tras temporizador.
- **Criterio de overflow:** Ausencia de desplazamiento horizontal en el viewport durante la aparición del Toast (`scrollWidth == clientWidth`).

### Prompt utilizado

```text
Usando Playwright MCP con el servidor local en http://localhost:3000/index.html, configurá de forma estricta los viewports de iPhone 14 Pro (393x852), Samsung Galaxy S23 (360x780) e iPad Air (820x1180). Para cada viewport dispará la acción que activa el Toast de confirmación, verificá la presencia del elemento toast con sus atributos de accesibilidad (role="status", aria-live="polite"), comprobá la temporización de visibilidad y cierre, y verificá que no se produzca desbordamiento horizontal.

```

## Resultados

| Dispositivo        | Viewport   | Atributos ARIA | Activación / Visibilidad | Temporización / Cierre        | Overflow       | Resultado |
| ------------------ | ---------- | -------------- | ------------------------ | ----------------------------- | -------------- | --------- |
| iPhone 14 Pro      | 393 × 852  | ✅ Correcto     | ✅ Visible al disparar    | ✅ Ocultado automático / Botón | ✅ Sin overflow | ✅ PASS    |
| Samsung Galaxy S23 | 360 × 780  | ✅ Correcto     | ✅ Visible al disparar    | ✅ Ocultado automático / Botón | ✅ Sin overflow | ✅ PASS    |
| iPad Air           | 820 × 1180 | ✅ Correcto     | ✅ Visible al disparar    | ✅ Ocultado automático / Botón | ✅ Sin overflow | ✅ PASS    |

### Verificación de Accesibilidad e Interacción

* **Atributos ARIA:** El contenedor Toast incluye `role="status"` y `aria-live="polite"`, permitiendo que las asistencias tecnológicas anuncien la confirmación sin interrumpir al usuario.
* **Estilos y Borde:** Mantiene un radio de borde consistente mediante `var(--radius-sm)` (6 px) integrado con los estilos de sobreescritura de Bootstrap.
* **Comportamiento y Cierre:** El componente aparece fluidamente al ejecutar la acción de confirmación, permite el cierre manual inmediato mediante el botón `.btn-close` y se oculta automáticamente tras el tiempo estipulado.

## Capturas de Evidencia

Las capturas correspondientes a la ejecución se encuentran almacenadas en `docs/04-testing/capturas/tc-8/`:

* `tc8-iphone14pro-toast.png` (393 × 852 px)
* `tc8-galaxys23-toast.png` (360 × 780 px)
* `tc8-ipadair-toast.png` (820 × 1180 px)

## Conclusión

**Resultado: ✅ PASS.** El componente Toast funciona de manera fluida y accesible en todos los dispositivos probados, cumpliendo con la especificación de Bootstrap v5.3 y sin generar desbordamiento en la interfaz.

## Issues / Hallazgos Relacionados

* [#53](https://www.google.com/url?sa=E&amp;q=https%3A%2F%2Fgithub.com%2Fcarolabenvenuto-uces%2Fplanit%2Fissues%2F53) — [Componentes Bootstrap] Modal de ficha técnica y Toast de confirmación.

## Limitaciones

Las pruebas fueron ejecutadas con el servidor Playwright MCP sobre el motor Chromium.

