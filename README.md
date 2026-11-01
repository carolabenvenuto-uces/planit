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
- Bootstrap 5 (CDN jsDelivr) con identidad visual centralizada en `bootstrap-overrides.css`
- JavaScript (lógica de negocio con `prompt()`, `alert()` y `console.log()`, sin manipulación del DOM en esta etapa)
- Jasmine 5.10 (testing unitario en navegador vía CDN)
- PlantUML (diagramas de actividades)
- Git & GitHub (GitFlow, GitHub Projects y GitHub Pages)
- Playwright MCP y GitHub MCP (testing automatizado y registro de issues)

🚀 **Sitio publicado (GitHub Pages):** [carolabenvenuto-uces.github.io/planit](https://carolabenvenuto-uces.github.io/planit/) — publicado desde la rama `release/tercera-entrega`.

✨ **Funcionalidades Previstas**
- Formulario de alta y personalización de eventos.
- Calculadora y tabla dinámica de presupuesto integrado.
- Gestor de invitados con control de estados de confirmación.
- Catálogo interactivo y buscador con filtros de proveedores y plancitos.

> En la Actividad Obligatoria N°3, estas funcionalidades se implementan como lógica de negocio en `js/script.js` (crear evento, calcular presupuesto, buscar en catálogo y gestionar invitados). Su integración con la interfaz mediante DOM y eventos queda para las próximas entregas.

---

🎯 **Objetivo del entregable**

- **Actividad Obligatoria N°3 (actual):** Integrar la lógica de negocio del simulador en JavaScript mediante algoritmos, funciones, arrays y objetos. Se implementan 4 flujos de trabajo (crear evento, calcular presupuesto, buscar en catálogo y gestionar invitados) con el patrón entrada → proceso → salida, navegables desde un menú con `prompt()`, modelados previamente en diagramas de actividades con PlantUML y validados con tests automatizados en Jasmine, ejecutados en navegador con Playwright MCP.
- **Primer Parcial:** Migrar el sitio a Bootstrap 5 (CDN jsDelivr) usando el sistema de columnas para mejorar la responsividad móvil, centralizar la identidad visual en `css/bootstrap-overrides.css`, incorporar al menos dos componentes avanzados de Bootstrap y dos componentes avanzados de HTML (`<iframe>` con helper `ratio` y `<details>/<summary>`), y validarlos con test cases automatizados (6 a 10) mediante Playwright MCP, registrando los hallazgos como issues con GitHub MCP.
- **Actividad Obligatoria N°2:** Incorporar estilos visuales con CSS organizados por responsabilidad (`styles.css`, `components.css` y `responsive.css`) a partir del mockup actualizado en Figma, implementar un diseño responsive mobile-first con Flexbox/Grid y Media Queries sin overflow horizontal, y validar el sitio mediante 5 test cases automatizados con Playwright MCP, registrando los hallazgos como issues con GitHub MCP.
- **Actividad Obligatoria N°1:** Establecer la estructura base y el maquetado inicial en HTML5 semántico de la plataforma. Este entregable sienta las bases organizativas del repositorio bajo la metodología Spec-Driven Development (SDD), incluyendo la especificación maestra (`plan.md`), la documentación de prompts de IA, el diseño del mockup y las reglas de integración del equipo.

---

🧪 **Cómo probar la Actividad Obligatoria N°3**

- **Simulador:** abrir `index.html` (o el sitio publicado). Al cargar la página se muestra el menú principal con `prompt()` para elegir uno de los 4 flujos; los resultados se muestran con `alert()` y en la consola del navegador (F12 → Consola).
- **Tests:** abrir [`js/test/test-runner.html`](js/test/test-runner.html) en el navegador. Las suites de Jasmine se ejecutan automáticamente y el menú no se inicia en el runner. Las instrucciones completas están en la [documentación de testing JavaScript](js/test/testing-doc.md).

---

📁 **Documentación**

**Actividad Obligatoria N°3**
- 🔀 [Diagramas de Actividades (índice, PlantUML y PNG)](docs/05-diagramas/01-diagrama-de-actividades/diagramas-doc.md)
- 💻 [Lógica de negocio (`js/script.js`)](js/script.js)
- 🧪 [Documentación de Testing JavaScript (Jasmine)](js/test/testing-doc.md) | [Test runner](js/test/test-runner.html) | [Suites de tests](js/test/script.spec.js)
- 📝 Specs por rol: [Coordinación / DevOps](docs/03-specs/actividad-obligatoria-3/spec-devops.md) · [Arquitecto de Diagramas](docs/03-specs/actividad-obligatoria-3/spec-arq-diagramas.md) · [Desarrollador JavaScript](docs/03-specs/actividad-obligatoria-3/spec-dev-javascript.md) · [Tester JavaScript / QA](docs/03-specs/actividad-obligatoria-3/spec-tester.md)
- 📋 [Tablero Kanban de la Actividad Obligatoria N°3 (GitHub Projects)](https://github.com/users/carolabenvenuto-uces/projects/2)

**Entregas anteriores y documentación general**
- 🖼️ [Mockup en alta resolución (PNG)](docs/01-mockup/actividad-obligatoria-1/diseño-inicial.png) | [Ver diseño interactivo en Figma](https://www.figma.com/design/iUmUArxu59WUYlBl2zR3xq/Wireframe?node-id=0-1&t=73bOfqtaFMhw7ipm-1) 
- 🖼️ [Mockup con Estilos (PNG Local)](docs/01-mockup/actividad-obligatoria-2/diseño-con-estilos.png) | [Archivo de Figma](https://www.figma.com/design/iUmUArxu59WUYlBl2zR3xq/Wireframe?node-id=2010-4&amp;t=Ck1r6ZQCICdGpTRy-0)
- 🖼️ [Mockup con Bootstrap (PNG Local)](docs/01-mockup/disenio-bootstrap.png) | [Archivo de Figma — página "Primer Parcial - Bootstrap"](https://www.figma.com/design/iUmUArxu59WUYlBl2zR3xq/Wireframe?node-id=2078-2) (grilla de 12 columnas en desktop, tablet y mobile, y guía de estilos Bootstrap)
- 📋 [Tablero Kanban del Primer Parcial (GitHub Projects)](https://github.com/users/carolabenvenuto-uces/projects/1)
- 📝 [Especificación Técnica de UX (Spec-UX)](docs/03-specs/actividad-obligatoria-1/spec-ux.md)
- 📂 [Índice de Prompts de IA](docs/02-prompts/prompts.md)
- 🧪 [Índice de Testing HTML/CSS (test cases y resumen de issues)](docs/04-testing/testing-doc.md)
- 📜 [Changelog del Proyecto](changelog.md)
- 📋 [Spec Maestro (Plan de Requerimientos)](plan.md)

---

👥 **Integrantes del Grupo**

| Nombre completo | N° de Matrícula | Usuario GitHub | Rol en esta entrega |
| --- | --- | --- | --- |
| Carola Benvenuto | 158686 | @carolabenvenuto-uces | Coordinadora / DevOps y Tester JavaScript / QA Engineer |
| Valeria Silva | 156612 | @ValeriaMSilva | Arquitecta de Diagramas de Actividades |
| Facundo Guiraldes | 114797 | @FacundoGuiraldes | Desarrollador JavaScript |

> Grupo de 3 integrantes: según la consigna, la Coordinadora / DevOps asume también las tareas del Tester JavaScript / QA Engineer, con una rama `feature/` independiente por rol (`feature/coord-devops-tercera-entrega` y `feature/tester-javascript-jasmine`).