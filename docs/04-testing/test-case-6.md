# Test Case 6 (TC6) — Migración y Validación Responsive Bootstrap 5.3

## Objetivo

Verificar que `index.html` no genere desplazamiento horizontal en los viewports de iPhone 14 Pro, Samsung Galaxy S23 e iPad Air, y comprobar que la navegación responsive de Bootstrap 5.3 funcione en esos tamaños.

## Ejecución

- **Fecha:** 07/10/2026
- **Estado probado:** working tree de la migración Bootstrap 5.3
- **Página:** `http://localhost:3000/index.html`
- **Herramienta:** Playwright MCP con Chromium
- **Criterio de overflow:** `document.documentElement.scrollWidth <= document.documentElement.clientWidth` y la misma comprobación para `document.body`.
- **Criterio de navegación:** el botón `.navbar-toggler` debe estar visible, el menú debe iniciar colapsado y abrirse al hacer click, con `aria-expanded="true"` y la clase `.show`.
- **Condición adicional:** la medición se realizó sin `overflow-x: hidden`; `overflow-x` computado quedó en `visible` para `html` y `body`.

### Prompt utilizado

```text
Usando Playwright MCP, probá index.html en las resoluciones de iPhone 14 Pro,
Samsung Galaxy S23 e iPad Air. Para cada viewport medí clientWidth y
scrollWidth de html y body para detectar overflow horizontal. Verificá también
que el navbar colapsado pueda abrirse con el botón toggler. Devolvé los
resultados por dispositivo.
```

## Resultados

| Dispositivo | Viewport | Ancho útil HTML | `scrollWidth` HTML | Ancho útil BODY | `scrollWidth` BODY | Overflow horizontal | Navbar | Catálogo |
|---|---:|---:|---:|---:|---:|---|---|---|
| iPhone 14 Pro | 393 × 852 | 378 px | 378 px | 378 px | 378 px | ✅ No | ✅ Colapsado y abre | ✅ 1 columna |
| Samsung Galaxy S23 | 360 × 780 | 345 px | 345 px | 345 px | 345 px | ✅ No | ✅ Colapsado y abre | ✅ 1 columna |
| iPad Air | 820 × 1180 | 805 px | 805 px | 805 px | 805 px | ✅ No | ✅ Colapsado y abre | ✅ 3 columnas (3 por fila) |

La diferencia de 15 px entre el viewport nominal y el ancho útil corresponde a la barra de desplazamiento vertical del navegador; no representa overflow horizontal. En todos los casos `scrollWidth` coincide con `clientWidth` de forma natural, con `overflow-x: visible`.

### Capturas

Las siguientes capturas de página completa fueron tomadas con Playwright MCP sobre
`http://localhost:3000/index.html`, una por cada viewport requerido:

- [iPhone 14 Pro — 393 × 852](./capturas/tc6-iphone14pro.png)
- [Samsung Galaxy S23 — 360 × 780](./capturas/tc6-galaxys23.png)
- [iPad Air — 820 × 1180](./capturas/tc6-ipadair.png)

### Verificación del navbar

- Bootstrap se cargó correctamente (`window.bootstrap` disponible).
- En los tres dispositivos el botón `.navbar-toggler` fue visible.
- El menú inició cerrado con `aria-expanded="false"`.
- Después del click, el menú quedó visible con `aria-expanded="true"` y la clase `.show`.

### Medidas adicionales observadas

- iPhone 14 Pro: contenido principal de 378 px; tarjetas de catálogo de 321 px.
- Samsung Galaxy S23: contenido principal de 345 px; tarjetas de catálogo de 287 px.
- iPad Air: contenido principal de 781 px; tarjetas de catálogo de 230 px, tres por fila según `col-md-4`. El layout principal sigue apilado porque el breakpoint `col-lg-8`/`col-lg-4` todavía no aplica a 820 px.

La tabla de presupuesto conserva su ancho intrínseco dentro de `.table-wrapper`, que funciona como contenedor desplazable local. Ese contenido no aumenta el `scrollWidth` del documento ni genera desborde horizontal global.

## Conclusión

**Resultado: ✅ PASS.** No se detectó overflow horizontal en ninguno de los tres dispositivos. La navegación colapsable de Bootstrap funcionó correctamente y la grilla del catálogo se adaptó sin desbordamientos.

## Issues / Hallazgos Relacionados

Los siguientes hallazgos de la revisión de la migración fueron registrados
bajo el [Issue #51](https://github.com/carolabenvenuto-uces/planit/issues/51)
y sus correcciones quedaron integradas en la [PR #54](https://github.com/carolabenvenuto-uces/planit/pull/54):

- **Especificidad del header/nav:** `.site-header nav a` imponía tamaño,
  color y padding incorrectos sobre el logo y la acción `Nuevo Evento`.
- **Grilla del catálogo 2+1:** `gap` y `grid-template-columns` en
  `.cards-grid` competían con `row` y `col-md-4` de Bootstrap.
- **Padding del gutter en tarjetas:** mezclar `.card` y `.col-*` en el
  mismo elemento desplazaba la imagen dentro del borde de la tarjeta.
- **Reboot en listas:** Bootstrap agregaba padding y margen no deseados a
  `.task-list` y `.resumen-lista`.

## Limitaciones

La ejecución MCP se realizó con Chromium, que es el único motor expuesto por el servidor disponible. Los nombres de dispositivos representan sus resoluciones CSS; no se ejecutó un motor WebKit o una emulación específica de Safari.

- **Issues relacionados:** [#51](https://github.com/carolabenvenuto-uces/planit/issues/51)
