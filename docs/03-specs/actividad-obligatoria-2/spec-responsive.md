# Especificación Técnica (Spec) - Especialista en Responsive Design

- **Proyecto:** PlanIT - Plataforma All-in-One de Organización & Experiencias
- **Entrega:** Actividad Obligatoria N°2
- **Rol:** Especialista en Responsive Design
- **Responsable:** Carola Benvenuto (@carolabenvenuto-uces)
- **Rama:** `feature/responsive-design-add-responsive-styles`

---

## 1. Qué se va a hacer
Implementación de la estrategia de diseño adaptativo (Responsive Design) mediante la creación del archivo `css/responsive.css`. Se utilizarán Media Queries organizadas para adaptar la interfaz a dispositivos Desktop, Tablet y Mobile, garantizando una navegación fluida y sin desbordamientos horizontales.

### Breakpoints Definidos y Justificación
- **Mobile Small/Medium (`max-width: 576px` y `max-width: 768px`):** Justificado para smartphones en orientación vertical (iPhone, Samsung Galaxy). Permite transformar la barra de navegación en un diseño apilado y reducir la tipografía para mantener legibilidad.
- **Tablet (`max-width: 992px`):** Justificado para tablets (iPad, Galaxy Tab) e híbridos. Permite colapsar el Cockpit Operativo de 2 columnas paralelas a una disposición vertical continua.
- **Desktop (`min-width: 993px`):** Layout base completo ya maquetado en `styles.css` y `components.css`.

### Enfoque de Layout por Sección
- **Navegación / Header:** Combinación de **Flexbox** horizontal en Desktop que se transforma en Flexbox vertical (`flex-direction: column`) o scrollable en resoluciones móviles.
- **Sección Hero:** **Flexbox** con centrado de textos y ajuste fluido de padding y escala de títulos (`h1`).
- **Catálogo de Experiencias:** **CSS Grid** adaptativo. Se redefine `grid-template-columns` a una sola columna (`1fr`) en Mobile para que las tarjetas ocupen el ancho total.
- **Cockpit Operativo (Formulario + Tabla):** Transición de **CSS Grid de 2 columnas** (`1fr 1.35fr`) a una única columna vertical en Tablet/Mobile (`grid-template-columns: 1fr`).
- **Tablas de Datos (Presupuesto e Invitados):** Uso de **overflow horizontal en contenedor Flex/Block** (`overflow-x: auto`) para garantizar que la tabla no rompa el viewport en teléfonos pequeños.
- **Sección Cómo Funciona:** **CSS Grid** de tarjetas de pasos pasando a disposición vertical apilada.

---

## 2. Por qué se hace
Para garantizar la usabilidad de la plataforma en cualquier dispositivo, respetando la fidelidad del mockup de Figma. Se busca prevenir el *horizontal scrolling*, optimizar las áreas táctiles de botones e inputs en pantallas pequeñas y asegurar una lectura cómoda de las tablas de datos.

---

## 3. Criterios de Aceptación (Checklist)

### Entregable de este PR
- [x] Especificación técnica `spec-responsive.md` commiteada en el repositorio antes que el archivo `css/responsive.css`.
- [x] Breakpoints definidos y documentados (mobile, tablet, desktop).
- [x] Layout adaptativo implementado con Flexbox y CSS Grid según la sección.
- [x] Todas las secciones del mockup se adaptan correctamente en los tres breakpoints.
- [x] No hay overflow horizontal en ningún dispositivo.
- [x] Pruebas de integración realizadas con el Desarrollador Frontend en localhost y GitHub Pages.

---

## 4. Uso de Figma MCP y GitHub Copilot (Proceso con IA)

* **Modelo de IA utilizado:** GitHub Copilot (Modo Agente / Chat) con servidor MCP de Figma.
* **Archivos adjuntos como contexto:**
  - `docs/03-specs/actividad-obligatoria-2/spec-responsive.md`
  - `css/styles.css`
  - `css/components.css`
  - `01-mockup/actividad-obligatoria-2/diseño-con-estilos.png`
* **Prompt exacto utilizado:**
  > *"Actúa como Especialista en Responsive Design. Tomando como contexto la especificación docs/03-specs/actividad-obligatoria-2/spec-responsive.md, las hojas de estilo existentes css/styles.css y css/components.css, y la imagen del mockup 01-mockup/actividad-obligatoria-2/diseño-con-estilos.png: Genera el archivo css/responsive.css organizando las Media Queries por breakpoints (Tablet max-width: 992px, Mobile max-width: 768px, Mobile Small max-width: 576px) en base al maquetado y diseño visual de PlanIT. Requerimientos técnicos: 1. Reestructurar el cockpit (.cockpit-container) de 2 columnas a 1 columna apilada en Tablet y Mobile. 2. Adaptar la grilla del catálogo (.cards-grid) y la lista de pasos (.pasos-list) a 1 columna en Mobile. 3. Adaptar la cabecera header y navegación nav para evitar desbordamientos en pantallas pequeñas. 4. Agregar contenedor con overflow-x: auto en las tablas para asegurar un scroll horizontal fluido sin romper el viewport. 5. Hacer botones (.btn-primary, .btn-submit) full-width en Mobile Small para facilitar la interacción táctil. 6. Incluir comentarios explicativos detallados en cada bloque de media query."*
* **Resultado obtenido:** 
  Generación completa de `css/responsive.css` agrupado en 3 bloques de `@media screen`. Adaptó las grillas a 1 columna apilada y formateó las tablas con `-webkit-overflow-scrolling: touch` para garantizar desplazamiento táctil sin afectar el viewport global.
* **Ajustes manuales realizados:**
  1. Forzado de `font-size: 1rem` en campos de texto/selects para el breakpoint Mobile Small (`max-width: 576px`), evitando el auto-zoom forzado que aplican los navegadores móviles en iOS/Safari al enfocar inputs.
  2. Ajuste explícito de `min-width: 580px` (en tablet) y `520px` (en mobile) para los elementos `table`, asegurando que el contenido financiero permanezca legible sin comprimir columnas.
* **Decisiones finales de breakpoints con justificación:**
  Se mantuvieron los cortes en `992px`, `768px` y `576px` por alineación con la escala estándar de Bootstrap/Tailwind y la compatibilidad probada con resoluciones táctiles habituales.