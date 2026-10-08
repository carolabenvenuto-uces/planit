# Test Case 10 (TC10) — Validación del Componente Details / Summary (FAQ)

## Objetivo

Verificar la correcta funcionalidad, accesibilidad e interacción semántica del componente `<details>` y `<summary>` en la sección `#faq-section` a lo largo de los viewports de iPhone 14 Pro, Samsung Galaxy S23 e iPad Air, garantizando la conmutación de apertura/cierre sin uso de JavaScript.

## Ejecución

- **Fecha:** 07/10/2026
- **Estado probado:** commit HEAD (`feature/dev-comp-html-avanzados-add-components`)
- **Página:** http://localhost:3000/index.html
- **Herramienta:** Playwright MCP con Chromium

### Prompt utilizado

```text
Usando Playwright MCP con el servidor local en http://localhost:3000/index.html, configurá los viewports de iPhone 14 Pro (393x852), Samsung Galaxy S23 (360x780) e iPad Air (820x1180). Navegá a #faq-section, comprobá que cada <details> inicie colapsado, activá su <summary> con Tab+Enter y Tab+Espacio para verificar la conmutación de open, el foco visible, la diferencia de estilos abierto/cerrado y la legibilidad a 360 px.
```

## Resultados

| Dispositivo | Viewport | Estado Inicial | Interacción Click / Key | Estilo Abierto (`open`) | Overflow | Resultado |
| --- | --- | --- | --- | --- | --- | --- |
| iPhone 14 Pro | 393 × 852 | ✅ Colapsado | ✅ Enter / Espacio | ✅ Fondo y borde abierto distintos; indicador +/− | ✅ Sin overflow | ✅ PASS |
| Samsung Galaxy S23 | 360 × 780 | ✅ Colapsado | ✅ Enter / Espacio | ✅ Fondo y borde abierto distintos; indicador +/− | ✅ Sin overflow | ✅ PASS |
| iPad Air | 820 × 1180 | ✅ Colapsado | ✅ Enter / Espacio | ✅ Fondo y borde abierto distintos; indicador +/− | ✅ Sin overflow | ✅ PASS |

### Verificación de Accesibilidad e Interacción

- **Acceso por Teclado:** Cada ítem `<summary>` es nativamente enfocable mediante la tecla Tab y responde a la activación por Enter o Espacio.
- **Foco Visible:** El anillo `:focus-visible` índigo aparece al llegar al `<summary>` con Tab.
- **Estados:** Cerrado usa fondo muted y borde neutral con indicador `+`; abierto usa fondo de superficie, borde primario `var(--color-primary)` e indicador `−`. El estado abierto se diferencia sin depender solo del color.

## Capturas de Evidencia

Las capturas con los viewports correspondientes se encuentran en `docs/04-testing/capturas/tc-10/`:

- **[TC10 — iPhone 14 Pro](capturas/tc-10/tc10-faq-iphone-14-pro.png)** (393 × 852 px)
- **[TC10 — Samsung Galaxy S23](capturas/tc-10/tc10-faq-samsung-galaxy-s23.png)** (360 × 780 px)
- **[TC10 — iPad Air](capturas/tc-10/tc10-faq-ipad-air.png)** (820 × 1180 px)

## Conclusión

**Resultado: ✅ PASS.** El componente desplegable de Preguntas Frecuentes opera correctamente de forma nativa en todos los dispositivos testeados.

## Issues / Hallazgos Relacionados

- **[#47](https://github.com/carolabenvenuto-uces/planit/issues/47)** — Integración y validación de componentes HTML avanzados.
- **[#66](https://github.com/carolabenvenuto-uces/planit/issues/66)** — Foco visible y estado visual abierto/cerrado del FAQ.
