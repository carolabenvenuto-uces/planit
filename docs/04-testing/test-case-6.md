# Test Case 6 (TC6) — Migración y Validación Responsive Bootstrap 5.3

## Objetivo

Verificar que `index.html` no genere desplazamiento horizontal (overflow horizontal) en los viewports de iPhone 14 Pro, Samsung Galaxy S23 e iPad Air, y comprobar que la navegación responsive de Bootstrap 5.3 y la grilla del catálogo funcionen correctamente en esos tamaños sobre el commit HEAD.

## Ejecución

- **Fecha:** 07/10/2026
- **Estado probado:** commit HEAD (`feature/dev-frontend-bootstrap-update-migration`)
- **Página:** `http://localhost:3000/index.html`
- **Herramienta:** Playwright MCP con Chromium
- **Criterio de overflow:** `document.documentElement.scrollWidth &lt;= document.documentElement.clientWidth` y la misma comprobación para `document.body` (`scrollWidth == clientWidth`).
- **Criterio de navegación:** El botón `.navbar-toggler` debe estar visible, el menú debe iniciar colapsado por defecto y abrirse al hacer clic, activando `aria-expanded="true"` y la clase `.show`.

### Prompt utilizado

```text
Usando Playwright MCP con el servidor local en http://localhost:3000/index.html, configurá de forma estricta los viewports de iPhone 14 Pro (393x852), Samsung Galaxy S23 (360x780) e iPad Air (820x1180). Para cada viewport medí clientWidth y scrollWidth de html y body para detectar overflow horizontal, verificá el ancho del elemento main y de las tarjetas del catálogo, y comprobá que la navbar colapsada inicie cerrada y pueda abrirse con el botón toggler.

```

## Resultados

| Dispositivo        | Viewport   | Ancho útil HTML | `scrollWidth` HTML | Ancho útil BODY | `scrollWidth` BODY | Overflow horizontal | Navbar             | Catálogo     |
| ------------------ | ---------- | --------------- | ------------------ | --------------- | ------------------ | ------------------- | ------------------ | ------------ |
| iPhone 14 Pro      | 393 × 852  | 393 px          | 393 px             | 393 px          | 393 px             | ✅ No                | ✅ Colapsado y abre | ✅ 1 columna  |
| Samsung Galaxy S23 | 360 × 780  | 360 px          | 360 px             | 360 px          | 360 px             | ✅ No                | ✅ Colapsado y abre | ✅ 1 columna  |
| iPad Air           | 820 × 1180 | 820 px          | 820 px             | 820 px          | 820 px             | ✅ No                | ✅ Colapsado y abre | ✅ 3 columnas |

En todos los casos `scrollWidth` coincide con `clientWidth` de forma genuina sin desbordamientos.

### Verificación del navbar

* Bootstrap se cargó correctamente (`window.bootstrap` disponible).
* En los tres dispositivos el botón `.navbar-toggler` fue visible.
* El menú inició cerrado con `aria-expanded="false"`.
* Después del clic, el menú quedó visible con `aria-expanded="true"` y la clase `.show`.

### Medidas adicionales observadas (Commit HEAD)

* **iPhone 14 Pro:** contenido principal `main` de 393 px (100%); tarjetas de catálogo de 335 px (1 columna).
* **Samsung Galaxy S23:** contenido principal `main` de 360 px (100%); tarjetas de catálogo de 302 px (1 columna).
* **iPad Air:** contenido principal `.container` limitado a 696 px; tarjetas de catálogo de 202 px, tres por fila según `col-md-4`.

## Capturas de Evidencia

Las imágenes con viewports exactos se encuentran guardadas en `docs/04-testing/capturas/`:

* `tc6-iphone14pro.png` (393 × 852 px)
* `tc6-galaxys23.png` (360 × 780 px)
* `tc6-ipadair.png` (820 × 1180 px)

## Conclusión

**Resultado: ✅ PASS.** No se detectó overflow horizontal en ninguno de los tres dispositivos. La navegación colapsable de Bootstrap funcionó correctamente y la grilla del catálogo se adaptó sin desbordamientos a 3 columnas en iPad Air y 1 columna en mobile.

## Issues / Hallazgos Relacionados (PR #52)

Los siguientes hallazgos de la revisión de la migración fueron registrados y corregidos para esta PR:

* [#59](https://www.google.com/url?sa=E&amp;q=https%3A%2F%2Fgithub.com%2Fcarolabenvenuto-uces%2Fplanit%2Fissues%2F59) — [CSS/Header] Conflicto de especificidad en `.site-header nav a` sobreescribe estilos de Bootstrap (Corregido en commit `a15ba34`).
* [#60](https://www.google.com/url?sa=E&amp;q=https%3A%2F%2Fgithub.com%2Fcarolabenvenuto-uces%2Fplanit%2Fissues%2F60) — [CSS/Grid] Colapso erróneo 2+1 en el catálogo por interacción con `gap` legacy (Corregido en commit `9ed63d9`).
* [#61](https://www.google.com/url?sa=E&amp;q=https%3A%2F%2Fgithub.com%2Fcarolabenvenuto-uces%2Fplanit%2Fissues%2F61) — [HTML/Grid] Mezcla de clases `.card` y `.col-*` en el mismo elemento HTML (Corregido en commit `edb4ec5`).
* [#62](https://www.google.com/url?sa=E&amp;q=https%3A%2F%2Fgithub.com%2Fcarolabenvenuto-uces%2Fplanit%2Fissues%2F62) — [CSS/Reboot] Falta de neutralización de paddings y márgenes en `.task-list` y `.resumen-lista` (Corregido en commit `3c97df9`).
* [#63](https://www.google.com/url?sa=E&amp;q=https%3A%2F%2Fgithub.com%2Fcarolabenvenuto-uces%2Fplanit%2Fissues%2F63) — [CSS/Responsive] Desfase en los breakpoints de media queries en `responsive.css` (Pendiente de corrección para la rama `fix/` posterior al merge).

## Limitaciones

La ejecución MCP se realizó con Chromium, que es el único motor expuesto por el servidor disponible. Los nombres de dispositivos representan sus resoluciones CSS; no se ejecutó un motor WebKit o una emulación específica de Safari.

