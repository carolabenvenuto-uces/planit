# Test Case 10 (TC10) — Desplegables de Preguntas Frecuentes (<details>/<summary>)

## Objetivo

Verificar la interacción nativa de apertura y cierre, el cambio de estado de los indicadores visuales, la accesibilidad por teclado y la adaptación responsiva de la sección Preguntas Frecuentes (FAQ) en index.html.

## Ejecución

- **Fecha de ejecución inicial:** 07/10/2026
- **Estado probado:** commit HEAD (feature/dev-comp-html-avanzados-add-components)
- **Página:** http://localhost:3000/index.html
- **Herramienta:** Playwright MCP con Chromium
- **Viewports probados:** iPhone 14 Pro (393 × 852 px), Samsung Galaxy S23 (360 × 780 px) e iPad Air (820 × 1180 px).
- **Criterio de accesibilidad:** Navegación nativa por teclado mediante Tab, Enter y Espacio sin requerir scripts adicionales.
- **Criterio de comportamiento:** Despliegue de respuesta al hacer clic en <summary>, conmutación del atributo open y actualización del pseudoelemento visual (➕ / ➖).
- **Criterio de overflow:** Ausencia de desbordamiento horizontal durante la expansión de los paneles (scrollWidth == clientWidth).

### Prompt utilizado

Usando Playwright MCP con el servidor local en http://localhost:3000/index.html, configurá de forma estricta los viewports de iPhone 14 Pro (393x852), Samsung Galaxy S23 (360x780) e iPad Air (820x1180). Para cada viewport interactuá con los elementos <summary> de la sección #faq-section, verificá la conmutación del atributo open en <details>, comprobá la visibilidad de las respuestas y asegurate de que no haya desbordamiento horizontal.

## Resultados

| Dispositivo | Viewport | Navegación Teclado | Interacción Clic / Despliegue | Atributo open / Estilos | Overflow | Resultado |
| --- | --- | --- | --- | --- | --- | --- |
| iPhone 14 Pro | 393 × 852 | ✅ Correcto | ✅ Expande / Contrae | ✅ Conmuta correctamente | ✅ Sin overflow | ✅ PASS |
| Samsung Galaxy S23 | 360 × 780 | ✅ Correcto | ✅ Expande / Contrae | ✅ Conmuta correctamente | ✅ Sin overflow | ✅ PASS |
| iPad Air | 820 × 1180 | ✅ Correcto | ✅ Expande / Contrae | ✅ Conmuta correctamente | ✅ Sin overflow | ✅ PASS |

### Verificación de Accesibilidad e Interacción

- **Acceso por Teclado:** Cada ítem <summary> es nativamente enfocable mediante la tecla Tab y responde a la activación por Enter o Espacio.
- **Estilos y Transición:** Estilos aplicados mediante .custom-faq-item[open] que destacan el borde en azul primario (#0d6efd) y conmutan el ícono ➕ a ➖.
- **Comportamiento:** La expansión del contenido ajusta dinámicamente la altura del panel sin romper el layout ni empujar elementos fuera del viewport.

## Capturas de Evidencia

Las capturas correspondientes a la ejecución se encuentran almacenadas en docs/04-testing/capturas/tc-10/:

- **[FAQ — iPhone 14 Pro](capturas/tc-10/tc10-faq-iphone-14-pro.png)** (393 × 852 px)
- **[FAQ — Samsung Galaxy S23](capturas/tc-10/tc10-faq-samsung-galaxy-s23.png)** (360 × 780 px)
- **[FAQ — iPad Air](capturas/tc-10/tc10-faq-ipad-air.png)** (820 × 1180 px)

## Conclusión

**Resultado: ✅ PASS.** Los componentes <details> y <summary> funcionan según los estándares de HTML5 y accesibilidad nativa, respondiendo correctamente en todos los dispositivos evaluados.

## Issues / Hallazgos Relacionados

- **[#47](https://github.com/carolabenvenuto-uces/planit/issues/47)** — Integración y validación de componentes HTML avanzados.

## Limitaciones

Las pruebas fueron ejecutadas con el servidor Playwright MCP sobre el motor Chromium.