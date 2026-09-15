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

### Entregable de este PR (MOMENTO 1)
- [x] Especificación técnica `spec-responsive.md` commiteada en el repositorio antes que el archivo `css/responsive.css`.
- [ ] Breakpoints definidos y documentados (mobile, tablet, desktop).
- [ ] Layout adaptativo implementado con Flexbox y CSS Grid según la sección.
- [ ] Todas las secciones del mockup se adaptan correctamente en los tres breakpoints.
- [ ] No hay overflow horizontal en ningún dispositivo.
- [ ] Pruebas de integración realizadas con el Desarrollador Frontend en localhost y GitHub Pages.

---

## 4. Uso de Figma MCP y GitHub Copilot (Proceso con IA - MOMENTO 2)

* **Modelo de IA utilizado:** GitHub Copilot (Modo Agente / Chat) con servidor MCP de Figma.
* **Prompt exacto utilizado:**
  > *(Pendiente de completar al generar responsive.css)*
* **Resultado obtenido:** 
  > *(Pendiente de completar al finalizar)*
* **Ajustes manuales realizados:**
  > *(Pendiente de completar al finalizar)*
* **Decisiones finales de breakpoints con justificación:**
  > *(Pendiente de completar al finalizar)*