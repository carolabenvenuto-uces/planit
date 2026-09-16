# Especificación Técnica (Spec) - Desarrollador Frontend/CSS

- **Proyecto:** PlanIT - Plataforma All-in-One de Organización & Experiencias
- **Entrega:** Actividad Obligatoria N°2
- **Rol:** Desarrollador Frontend/CSS
- **Responsable:** Carola Benvenuto (@carolabenvenuto-uces)
- **Rama:** `feature/dev-frontend-css-add-styles`

---

## 1. Qué se va a hacer
Creación y organización de las hojas de estilo CSS (`css/styles.css` y `css/components.css`) para aplicar el diseño visual completo al sitio web PlanIT (`index.html`). El maquetado y estilizado traducirá fielmente el [Mockup de Diseño Actualizado](../../../01-mockup/actividad-obligatoria-2/diseño-con-estilos.png) y el archivo de Figma del proyecto, respetando la paleta de colores, la jerarquía tipográfica, el Box Model y las interacciones visuales.

El desarrollo se realizó utilizando el servidor MCP de Figma junto con GitHub Copilot en modo Agente para la extracción limpia de reglas y variables CSS, realizando los refinamientos manuales necesarios.

---

## 2. Por qué se hace
Para transformar la estructura HTML5 semántica en una interfaz gráfica atractiva, coherente y escalable. La separación en archivos por responsabilidad (`styles.css` para variables, reset y layout base, y `components.css` para elementos interactivos y tarjetas) permite una mejor especificidad y reutilización de estilos, preparando la base sobre la cual se aplicará el diseño responsive.

---

## 3. Criterios de Aceptación (Checklist)

### Entregable de este PR
- [x] Especificación técnica `spec-frontend.md` commiteada en el repositorio antes que los archivos CSS.
- [x] Creación de `css/styles.css` incluyendo variables CSS en `:root` (colores, fuentes, espaciados), reset global, tipografía base y estructura de layout.
- [x] Creación de `css/components.css` con estilos para tarjetas, botones, formularios, tablas, navegación y estados interactivos (`:hover`, `:focus`).
- [x] Aplicación correcta de especificidad, herencia y control explícito del Box Model (`margin`, `padding`, `border`, `box-sizing`).
- [x] Diferenciación clara de elementos en línea y en bloque mediante CSS.
- [x] Comentarios explicativos integrados en el código CSS detallando las decisiones de diseño tomadas.
- [x] Pruebas de integración iniciales coordinadas con el rol de Responsive Design en entorno local.

---

## 4. Uso de Figma MCP (Proceso con IA)

* **Modelo de IA utilizado:** GitHub Copilot (Modo Agente / Chat) con servidor MCP de Figma.
* **Prompt exacto utilizado:**
  > *"Actúa como Desarrollador Frontend/CSS. Usando el servidor MCP de Figma ("Figma PLANIT"), conectate al diseño de Dev Mode mediante el enlace: https://www.figma.com/design/iUmUArxu59WUYlBl2zR3xq/Wireframe?node-id=0-1&m=dev&t=TPR53fmUQiqi2Gll-1
    Tomando como contexto la especificación docs/03-specs/actividad-obligatoria-2/spec-frontend.md:
    1. Genera el archivo css/styles.css con variables CSS en :root, reset global, tipografía del body y layout estructurado base.
    2. Genera el archivo css/components.css con estilos de componentes UI (botones, cards, navbar, tabla y formularios), control de Box Model, estados interactivos (:hover, :focus, :active), diferenciación inline/block y comentarios explicativos."*
* **Resultado obtenido:** 
  Generación completa de `css/styles.css` con tokens en `:root` para colores de marca, escala tipográfica, espaciados y reset universal, junto con `css/components.css` que estiliza la cabecera sticky con backdrop blur, botones interactivos con gradiente y elevación, catálogo de experiencias con efecto lift, cockpit de eventos en doble columna, controles de formulario con focus-ring accesible y tablas formateadas con zebra striping.
* **Ajustes manuales realizados:**
  1. Enlace directo de ambas hojas de estilo en la etiqueta `<head>` de `index.html`.
  2. Solución de errores de sintaxis marcados por el linter (llaves y selectores mal cerrados) utilizando Copilot inline chat (`/fix`).
  3. Incorporación de transiciones con curvas cubic-bezier para suavizar los estados de hover en tarjetas y botones.
  4. Integración de pseudo-elementos (`::before` y `::after`) para numeradores dinámicos de pasos y subrayados decorativos de sección.