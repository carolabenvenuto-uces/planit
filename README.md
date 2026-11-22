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
- JavaScript orientado a objetos (clases del dominio en `js/models/`: `Evento`, `Presupuesto`, `ItemContratado`, `Invitado`, `ListaInvitados`, `Proveedor`, `CatalogoProveedores`, `Validador`) con un controlador de UI y eventos en `js/script.js` (sin `prompt()`/`alert()`: toda la entrada es por formularios y toda la salida se muestra en el DOM)
- Persistencia con `localStorage`/`sessionStorage` encapsulada en `js/utils/storage.js` (objeto global `Almacenamiento`)
- Jasmine 5.10 (testing unitario en navegador vía CDN)
- PlantUML (diagramas de actividades y de clases)
- Git & GitHub (GitFlow, GitHub Projects y GitHub Pages)
- Playwright MCP y GitHub MCP (testing automatizado y registro de issues)

🚀 **Sitio publicado (GitHub Pages):** [carolabenvenuto-uces.github.io/planit](https://carolabenvenuto-uces.github.io/planit/) — al momento de este commit, todavía sirve `release/tercera-entrega` (AO3); se republica desde `release/cuarta-entrega` al cerrar la coordinación de la AO4 (ver `spec-devops.md`, MOMENTO 2).

✨ **Funcionalidades**
- Formulario de alta y personalización de eventos, con validación en vivo y persistencia.
- Calculadora y tabla dinámica de presupuesto integrado, con alerta de presupuesto excedido.
- Gestor de invitados con control de estados de confirmación y persistencia entre sesiones.
- Catálogo interactivo y buscador con filtros de proveedores y plancitos por texto y por categoría.

> En la Actividad Obligatoria N°4, los 4 flujos de la AO3 se reimplementan sobre un modelo de dominio orientado a objetos (`js/models/`) e interactividad real por DOM y eventos en `js/script.js`, con persistencia entre sesiones delegada en `js/utils/storage.js`. Se eliminan `prompt()`/`alert()`/`console.log()` como mecanismo de entrada/salida.

---

🎯 **Objetivo del entregable**

- **Actividad Obligatoria N°4 (actual):** Reemplazar la lógica de negocio procedural de la AO3 por un modelo de dominio orientado a objetos (8 clases en `js/models/`, con `toJSON()`/`fromJSON()` para serialización) y por un controlador de UI y eventos real en `js/script.js` que manipula el DOM a partir de formularios, sin ventanas emergentes (`prompt()`/`alert()`/`confirm()`). Se agrega persistencia entre sesiones con `localStorage`/`sessionStorage` (`js/utils/storage.js`). Por ser un grupo de 3 integrantes, el rol Coordinador/DevOps absorbe también las tareas de Tester QA y de Desarrollador JS Storage.
- **Actividad Obligatoria N°3:** Integrar la lógica de negocio del simulador en JavaScript mediante algoritmos, funciones, arrays y objetos. Se implementan 4 flujos de trabajo (crear evento, calcular presupuesto, buscar en catálogo y gestionar invitados) con el patrón entrada → proceso → salida, navegables desde un menú con `prompt()`, modelados previamente en diagramas de actividades con PlantUML y validados con tests automatizados en Jasmine, ejecutados en navegador con Playwright MCP.
- **Primer Parcial:** Migrar el sitio a Bootstrap 5 (CDN jsDelivr) usando el sistema de columnas para mejorar la responsividad móvil, centralizar la identidad visual en `css/bootstrap-overrides.css`, incorporar al menos dos componentes avanzados de Bootstrap y dos componentes avanzados de HTML (`<iframe>` con helper `ratio` y `<details>/<summary>`), y validarlos con test cases automatizados (6 a 10) mediante Playwright MCP, registrando los hallazgos como issues con GitHub MCP.
- **Actividad Obligatoria N°2:** Incorporar estilos visuales con CSS organizados por responsabilidad (`styles.css`, `components.css` y `responsive.css`) a partir del mockup actualizado en Figma, implementar un diseño responsive mobile-first con Flexbox/Grid y Media Queries sin overflow horizontal, y validar el sitio mediante 5 test cases automatizados con Playwright MCP, registrando los hallazgos como issues con GitHub MCP.
- **Actividad Obligatoria N°1:** Establecer la estructura base y el maquetado inicial en HTML5 semántico de la plataforma. Este entregable sienta las bases organizativas del repositorio bajo la metodología Spec-Driven Development (SDD), incluyendo la especificación maestra (`plan.md`), la documentación de prompts de IA, el diseño del mockup y las reglas de integración del equipo.

---

🧪 **Cómo probar la Actividad Obligatoria N°4**

- **Simulador:** abrir `index.html` (o el sitio publicado). Los 4 flujos (Mi Evento, Presupuesto, Catálogo e Invitados) se usan directamente desde los formularios de cada sección; los resultados se muestran en el propio DOM (avisos, badges, tablas), sin ventanas emergentes. Los cambios persisten entre sesiones vía `localStorage`/`sessionStorage`.
- **Tests:** abrir [`js/test/test-runner.html`](js/test/test-runner.html) en el navegador, o ejecutar `node js/test/run-jasmine.js` desde la raíz del proyecto. Las instrucciones completas están en la [documentación de testing JavaScript](js/test/testing-doc.md).

---

📁 **Documentación**

**Actividad Obligatoria N°4**
- 🧩 [Diagrama de Clases (índice, PlantUML y PNG)](docs/05-diagramas/02-diagrama-de-clases/diagrama-clases-doc.md)
- 💻 [Clases del dominio (`js/models/`)](js/models/) | [Controlador de UI y eventos (`js/script.js`)](js/script.js)
- 📝 Specs por rol: [Coordinación / DevOps](docs/03-specs/actividad-obligatoria-4/spec-devops.md) · [Desarrolladora JS POO](docs/03-specs/actividad-obligatoria-4/spec-dev-poo.md) · [Desarrolladora JS Eventos + DOM](docs/03-specs/actividad-obligatoria-4/spec-dev-eventos-dom.md) · [Desarrollador JS Storage](docs/03-specs/actividad-obligatoria-4/spec-dev-storage.md) · [Tester QA](docs/03-specs/actividad-obligatoria-4/spec-tester-qa.md)
- 📦 [Documentación de `js/utils/storage.js` (API, estrategia de storage por clave)](docs/06-storage/storage-doc.md) (PR [#108](https://github.com/carolabenvenuto-uces/planit/pull/108))
- 🧪 [Documentación de Testing JavaScript (Jasmine) para la AO4](js/test/testing-doc.md) | [Test runner](js/test/test-runner.html) | [Suites: `models.spec.js`](js/test/models.spec.js) · [`storage.spec.js`](js/test/storage.spec.js) · [`script.spec.js`](js/test/script.spec.js) (PR [#110](https://github.com/carolabenvenuto-uces/planit/pull/110))

**Actividad Obligatoria N°3**
- 🔀 [Diagramas de Actividades (índice, PlantUML y PNG)](docs/05-diagramas/01-diagrama-de-actividades/diagramas-doc.md)
- 💻 Lógica de negocio: `js/script.js` tenía los 4 flujos con `prompt()`/`alert()` (ver historial de git); en la AO4 se reemplaza por completo por el modelo de dominio en `js/models/` y el controlador de UI/eventos en `js/script.js` actual.
- 🧪 `js/test/testing-doc.md`/`script.spec.js` de la AO3 (43 specs con Playwright MCP) quedan en el historial de git: en la AO4 se reemplazan íntegramente por la suite documentada más arriba (ver nota al inicio de [`testing-doc.md`](js/test/testing-doc.md)).
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
| Carola Benvenuto | 158686 | @carolabenvenuto-uces | Desarrolladora JS POO - Lógica de Negocio |
| Valeria Silva | 156612 | @ValeriaMSilva | Desarrolladora JS Eventos + DOM |
| Facundo Guiraldes | 114797 | @FacundoGuiraldes | Coordinador / DevOps, Tester QA y Desarrollador JS Storage |

> Grupo de 3 integrantes: según la consigna, el Coordinador / DevOps asume también las tareas de Tester QA y de Desarrollador JS Storage, con una rama `feature/` independiente por rol (`feature/coord-devops-cuarta-entrega`, `feature/tester-qa-specs` y `feature/dev-storage`).