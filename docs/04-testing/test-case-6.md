# Test Case 6 (TC6) — Migración y Validación Responsive Bootstrap 5.3

## Objetivo

Verificar que index.html no genere desplazamiento horizontal (overflow horizontal) en los viewports de iPhone 14 Pro, Samsung Galaxy S23 e iPad Air, y comprobar que la navegación responsive de Bootstrap 5.3 y la grilla del catálogo funcionen correctamente en esos tamaños sobre el commit HEAD.

## Ejecución

- **Fecha:** 07/10/2026
- **Estado probado:** commit HEAD (feature/dev-frontend-bootstrap-update-migration)
- **Página:** http://localhost:3000/index.html
- **Herramienta:** Playwright MCP con Chromium
- **Criterio de overflow:** document.documentElement.scrollWidth <= document.documentElement.clientWidth y la misma comprobación para document.body (scrollWidth == clientWidth).
- **Criterio de navegación:** El botón .navbar-toggler debe estar visible, el menú debe iniciar colapsado por defecto y abrirse al hacer clic, activando aria-expanded="true" y la clase .show.

### Prompt utilizado

Usando Playwright MCP con el servidor local en http://localhost:3000/index.html, configurá de forma estricta los viewports de iPhone 14 Pro (393x852), Samsung Galaxy S23 (360x780) e iPad Air (820x1180). Para cada viewport medí clientWidth y scrollWidth de html y body para detectar overflow horizontal, verificá el ancho del elemento main y de las tarjetas del catálogo, y comprobá que la navbar colapsada inicie cerrada y pueda abrirse con el botón toggler.