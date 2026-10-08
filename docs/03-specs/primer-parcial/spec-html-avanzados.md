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
   - **Propósito:** Mostrar un video explicativo/promocional dentro de la sección de la experiencia *Cerámica & Chardonnay* o en la sección "¿Cómo funciona?".
   - **Justificación:** Enriquece la experiencia visual de los usuarios con contenido interactivo multimedia.
   - **Integración con Bootstrap:** Se utilizará el helper nativo `ratio ratio-16x9` de Bootstrap para garantizar la adaptación responsiva completa sin desbordamientos en pantallas pequeñas.

2. **`<details>` y `<summary>` (Preguntas Frecuentes / Preguntas de Eventos):**
   - **Propósito:** Implementar una sección interactiva desplegable de "Preguntas Frecuentes (FAQ)" en el footer o en la sección de Cockpit de eventos.
   - **Justificación:** Permite organizar información secundaria sin recargar visualmente la interfaz inicial, mejorando la accesibilidad y la navegación progresiva sin necesidad de JavaScript pesado.
   - **Integración con Bootstrap:** Se personalizará visualmente con clases utilitarias de Bootstrap y overrides CSS para mantener la coherencia con los botones e identidades cromáticas de PlanIT.

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
- [ ] La especificación está commiteada en `docs/03-specs/primer-parcial/spec-html-avanzados.md` antes de escribir código HTML.
- [ ] Los 2 componentes HTML avanzados están integrados semánticamente e integrados con las utilidades/helpers de Bootstrap.
- [ ] Se mantienen las reglas de diseño y coherencia visual con `css/styles.css`, `css/components.css` e `index.html`.
- [ ] Se ejecutaron los tests con Playwright MCP en los 3 dispositivos obligatorios.
- [ ] Cualquier hallazgo/bug fue registrado mediante GitHub MCP y resuelto a través de ramas `fix/`.
- [ ] Los archivos `test-case-9.md` y `test-case-10.md` están documentados con evidencia.

---

## MOMENTO 2 — Evidencia de Cierre e Integración

### 1. Resumen del Desarrollo
- Se incorporó el componente `<iframe>` multimedia con la URL del taller de cerámica artesanal (`https://www.youtube.com/embed/5vi0UQDYNCw`), envuelto en el helper responsivo `.ratio.ratio-16x9` de Bootstrap en la sección `#taller-video`.
- Se maquetó la sección `#faq-section` de Preguntas Frecuentes utilizando la estructura semántica nativa `<details>` y `<summary>`, con estilos personalizados `.custom-faq-item` en `css/components.css`.
- Ambos componentes quedaron ubicados al final de la columna principal `col-lg-8`, respetando la grilla de 12 columnas aprobada en el Figma.

### 2. Evidencia de Testing Automatizado
- **Test Case 9 (TC9):** Validación responsiva y de accesibilidad para `<iframe>`. Estado: `PASS`.
- **Test Case 10 (TC10):** Validación de conmutación del atributo `open` y navegación por teclado en `<details>/<summary>`. Estado: `PASS`.

### 3. Trazabilidad
- **PR:** [#48](https://github.com/carolabenvenuto-uces/planit/pull/48)
- **Issue:** [#47](https://github.com/carolabenvenuto-uces/planit/issues/47)
- **Branch:** `feature/dev-comp-html-avanzados-add-components`