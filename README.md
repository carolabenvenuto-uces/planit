# 🌐 PlanIT - Plataforma All-in-One de Organización & Experiencias

🎓 **Datos Académicos**
- **Carrera:** Tecnicatura Universitaria en Programación de Sistemas
- **Materia:** Programación Web I
- **Universidad:** UCES (Universidad de Ciencias Empresariales y Sociales)
- **Cuatrimestre/Año:** 2° Cuatrimestre / 2026

---

📖 **Descripción**

PlanIT es un portal web pensado para centralizar y simplificar la organización de eventos sociales de cualquier escala. Permite a los usuarios armar un evento desde cero o elegir paquetes de experiencias empaquetadas ("plancitos" como talleres de cerámica con vino, catas de gin o shows de magia privados), combinándolos con proveedores tradicionales como catering, DJ y ambientación.

🎯 **Objetivo del Proyecto**
Reducir la fragmentación al planificar reuniones y festejos. Busca ofrecer un simulador visual interactivo que permita gestionar el presupuesto, controlar la lista de invitados y contratar servicios o experiencias listas para disfrutar desde un único lugar.

💻 **Tecnologías Utilizadas**
- HTML5 Semántico
- CSS3 (variables, Flexbox, Grid y Media Queries: `styles.css`, `components.css`, `responsive.css`)
- JavaScript (Planificado para entregas futuras)
- Git & GitHub (GitFlow y GitHub Pages)
- Playwright MCP y GitHub MCP (testing automatizado y registro de issues)

🚀 **Sitio publicado (GitHub Pages):** [carolabenvenuto-uces.github.io/planit](https://carolabenvenuto-uces.github.io/planit/) — publicado desde la rama `release/actividad-obligatoria-2`.

✨ **Funcionalidades Previstas**
- Formulario de alta y personalización de eventos.
- Calculadora y tabla dinámica de presupuesto integrado.
- Gestor de invitados con control de estados de confirmación.
- Catálogo interactivo y buscador con filtros de proveedores y plancitos.

---

🎯 **Objetivo del entregable**

- **Primer Parcial (actual):** Migrar el sitio a Bootstrap 5 (CDN jsDelivr) usando el sistema de columnas para mejorar la responsividad móvil, centralizar la identidad visual en `css/bootstrap-overrides.css`, incorporar al menos dos componentes avanzados de Bootstrap y dos componentes avanzados de HTML (`<iframe>` con helper `ratio` y `<details>/<summary>`), y validarlos con test cases automatizados (6 a 10) mediante Playwright MCP, registrando los hallazgos como issues con GitHub MCP.
- **Actividad Obligatoria N°2:** Incorporar estilos visuales con CSS organizados por responsabilidad (`styles.css`, `components.css` y `responsive.css`) a partir del mockup actualizado en Figma, implementar un diseño responsive mobile-first con Flexbox/Grid y Media Queries sin overflow horizontal, y validar el sitio mediante 5 test cases automatizados con Playwright MCP, registrando los hallazgos como issues con GitHub MCP.
- **Actividad Obligatoria N°1:** Establecer la estructura base y el maquetado inicial en HTML5 semántico de la plataforma. Este entregable sienta las bases organizativas del repositorio bajo la metodología Spec-Driven Development (SDD), incluyendo la especificación maestra (`plan.md`), la documentación de prompts de IA, el diseño del mockup y las reglas de integración del equipo.

---

📁 **Documentación**

- 🖼️ [Mockup en alta resolución (PNG)](docs/01-mockup/actividad-obligatoria-1/diseño-inicial.png) | [Ver diseño interactivo en Figma](https://www.figma.com/design/iUmUArxu59WUYlBl2zR3xq/Wireframe?node-id=0-1&t=73bOfqtaFMhw7ipm-1) 
- 🖼️ [Mockup con Estilos (PNG Local)](docs/01-mockup/actividad-obligatoria-2/diseño-con-estilos.png) | [Archivo de Figma](https://www.figma.com/design/iUmUArxu59WUYlBl2zR3xq/Wireframe?node-id=2010-4&amp;t=Ck1r6ZQCICdGpTRy-0)
- 🖼️ [Mockup con Bootstrap (PNG Local)](docs/01-mockup/disenio-bootstrap.png) | [Archivo de Figma — página "Primer Parcial - Bootstrap"](https://www.figma.com/design/iUmUArxu59WUYlBl2zR3xq/Wireframe?node-id=2078-2) (grilla de 12 columnas en desktop, tablet y mobile, y guía de estilos Bootstrap)
- 📋 [Tablero Kanban del Primer Parcial (GitHub Projects)](https://github.com/users/carolabenvenuto-uces/projects/1)
- 📝 [Especificación Técnica de UX (Spec-UX)](docs/03-specs/actividad-obligatoria-1/spec-ux.md)
- 📂 [Índice de Prompts de IA](docs/02-prompts/prompts.md)
- 🧪 [Índice de Testing (test cases y resumen de issues)](docs/04-testing/testing-doc.md)
- 📜 [Changelog del Proyecto](changelog.md)
- 📋 [Spec Maestro (Plan de Requerimientos)](plan.md)

---

👥 **Integrantes del Grupo**

| Nombre completo | N° de Matrícula | Usuario GitHub | Rol en esta entrega |
| --- | --- | --- | --- |
| Carola Benvenuto | 158686 | @carolabenvenuto-uces | Desarrollador de Componentes HTML Avanzados |
| Valeria Silva | 156612 | @ValeriaMSilva | Desarrollador Frontend/Bootstrap y Especialista en Componentes Bootstrap |
| Facundo Guiraldes | 114797 | @FacundoGuiraldes | Coordinador / DevOps |

> Grupo de 3 integrantes: según la consigna, el Desarrollador Frontend/Bootstrap asume también las tareas del Especialista en Componentes Bootstrap, con una rama `feature/` independiente por rol.