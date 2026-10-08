# Especificación Técnica: Desarrollador de Componentes HTML Avanzados

**Rol:** Desarrollador de Componentes HTML Avanzados  
**Estudiante:** Carola Benvenuto (@carolabenvenuto-uces)  
**Rama asignada:** `feature/dev-comp-html-avanzados-add-components`  
**Issue principal:** #47  
**Fecha:** 5 de octubre de 2026  

---

## MOMENTO 1: Planificación Previa (ANTES de la implementación)

### 1. Componentes HTML Avanzados Seleccionados y Justificación
Se seleccionaron los siguientes dos componentes HTML avanzados para integrarse en la plataforma PlanIT de forma coherente con la maquetación y diseño de Bootstrap:

1. **`<iframe>` (Video promocional / Taller interactivo):**
   - **Propósito:** Mostrar un video explicativo/promocional dentro de la sección del taller *Cerámica & Chardonnay* (`#taller-video`).
   - **Justificación:** Enriquece la experiencia visual de los usuarios con contenido interactivo multimedia.
   - **Integración con Bootstrap:** Se utilizará el helper nativo `ratio ratio-16x9` de Bootstrap para garantizar la adaptación responsiva completa sin desbordamientos en pantallas pequeñas.

2. **`<details>` y `<summary>` (Preguntas Frecuentes / Preguntas de Eventos):**
   - **Propósito:** Implementar una sección interactiva desplegable de "Preguntas Frecuentes (FAQ)" al final de la columna principal `col-lg-8`.
   - **Justificación:** Permite organizar información secundaria sin recargar visualmente la interfaz inicial, mejorando la accesibilidad y la navegación progresiva sin necesidad de JavaScript pesado.
   - **Integración con Bootstrap:** Se personalizará visualmente con clases utilitarias de Bootstrap y overrides CSS para mantener la coherencia con la identidad cromática y los paneles de PlanIT.

---

### 2. Plan de Testing Automatizado con Playwright MCP
Se utilizará `@playwright/mcp` ejecutando tests sobre `http://localhost:3000` para validar la correcta integración, dimensiones y usabilidad de ambos componentes.

#### Dispositivos Obligatorios a Testear:
- **iPhone 14 Pro** (iOS Safari - 393 × 852 px)
- **Samsung Galaxy S23** (Chrome Android - 360 × 780 px)
- **iPad Air** (iOS Safari - 820 × 1180 px)

#### Casos de Prueba Planeados:
- **Test Case 9 (`docs/04-testing/test-case-9.md`):** Validación responsiva del componente `<iframe>` con helper `ratio` de Bootstrap en los 3 dispositivos, verificando ausencia de overflow horizontal y adaptación fluida.
- **Test Case 10 (`docs/04-testing/test-case-10.md`):** Validación interactiva y de accesibilidad del componente `<details>/<summary>` en los 3 dispositivos, comprobando estados expandido/colapsado y áreas táctiles.

---

### 3. Criterios de Aceptación
- [x] La especificación está commiteada en `docs/03-specs/primer-parcial/spec-html-avanzados.md` antes de escribir código HTML.
- [x] Los 2 componentes HTML avanzados están integrados semánticamente e integrados con las utilidades/helpers de Bootstrap.
- [x] Se mantienen las reglas de diseño y coherencia visual con `css/styles.css`, `css/components.css` e `index.html`.
- [x] Se ejecutaron los tests con Playwright MCP en los 3 dispositivos obligatorios.
- [x] Cualquier hallazgo/bug fue registrado mediante GitHub MCP y resuelto a través de ramas `fix/`.
- [x] Los archivos `test-case-9.md` y `test-case-10.md` están documentados con evidencia.

---

## MOMENTO 2 — Evidencia de Cierre e Integración

### 1. Resumen del Desarrollo
- Se incorporó el componente `<iframe>` multimedia con la URL no-cookie del taller de cerámica artesanal (`https://www.youtube-nocookie.com/embed/5vi0UQDYNCw`), envuelto en el helper responsivo `.ratio.ratio-16x9` de Bootstrap en la sección `#taller-video`. Se configuró `referrerpolicy="strict-origin-when-cross-origin"`, `loading="lazy"` y un título descriptivo.
- Se maquetó la sección `#faq-section` de Preguntas Frecuentes utilizando la estructura semántica nativa `<details>` y `<summary>`, con estilos personalizados `.custom-faq-item` en `css/components.css` y foco accesible `:focus-visible`.
- Ambos componentes quedaron ubicados al final de la columna principal `col-lg-8`, respetando la clase `.panel` de 16 px de separación y la grilla de 12 columnas.

### 2. Evidencia de Testing Automatizado & Prompts MCP

#### Prompt Utilizado para TC9 (Iframe Video):
Usando Playwright MCP con el servidor local en http://localhost:3000/index.html, configurá los viewports de iPhone 14 Pro (393x852), Samsung Galaxy S23 (360x780) e iPad Air (820x1180). Verificá que el iframe contenido en #taller-video mantenga la relación de aspecto 16:9 mediante la clase .ratio-16x9, no genere overflow horizontal y cargue sin errores de reproducción.

#### Prompt Utilizado para TC10 (FAQ Details/Summary):
Usando Playwright MCP con el servidor local en http://localhost:3000/index.html, configurá los viewports de iPhone 14 Pro (393x852), Samsung Galaxy S23 (360x780) e iPad Air (820x1180). Navegá hasta la sección #faq-section, comprobá que los elementos <details> inicien colapsados, interactuá haciendo clic sobre cada <summary> para validar la apertura/cierre y conmutación del atributo 'open', y verificá la legibilidad del texto en 360 px.

#### Resultados de las Pruebas:
- **Test Case 9 (TC9):** Validación responsiva y de accesibilidad para `<iframe>`. Estado: `PASS`.
- **Test Case 10 (TC10):** Validación de conmutación del atributo `open` y navegación por teclado en `<details>/<summary>`. Estado: `PASS`.

### 3. Ajustes Manuales y Resumen de Hallazgos
- **Ajustes manuales:** Se normalizaron las clases de los contenedores `#taller-video` y `#faq-section` a la clase nativa `.panel` para evitar márgenes descompensados de 64 px. Se sustituyeron los emojis de conmutación por un chevron CSS nativo y se agregaron estilos de foco accesible `:focus-visible`.
- **Hallazgos/Bugs registrados:** 
  1. *Error 153 en iframe por políticas de referer:* Solucionado utilizando el dominio `youtube-nocookie.com` y `referrerpolicy="strict-origin-when-cross-origin"`.
  2. *Defecto gráfico en SVG de Catálogo:* Restaurado el path completo del icono en `index.html`.
  3. *Indicador de foco en summary:* Implementado anillo de enfoque visible utilizando variables de diseño globales (`--color-primary`).

### 4. Trazabilidad
- **PR:** [#48](https://github.com/carolabenvenuto-uces/planit/pull/48)
- **Issue:** [#47](https://github.com/carolabenvenuto-uces/planit/issues/47)
- **Branch:** `feature/dev-comp-html-avanzados-add-components`