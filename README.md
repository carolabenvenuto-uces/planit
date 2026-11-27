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
- JavaScript asíncrono (Segundo Parcial): `fetch` con `async`/`await`, `AbortController` (timeout de 5 s por intento) y un reintento ante errores de red, encapsulado en `js/api/apiService.js` (objeto global `ApiService`) y alimentado por el JSON estático `api/proveedores.json`
- Jasmine 5.10 (testing unitario en navegador vía CDN)
- PlantUML (diagramas de actividades y de clases)
- Git & GitHub (GitFlow, GitHub Projects y GitHub Pages)
- Playwright (testing automatizado en navegador headless) y la API de GitHub (registro de issues, code reviews, Projects); en la AO4 ambos se usaron como librería/REST/GraphQL, no como servidores MCP interactivos (ver `spec-tester-qa.md` y `spec-devops.md`, sección de obstáculos)
- Lighthouse (auditorías de Performance, Accesibilidad, Buenas Prácticas y SEO en tres momentos del Segundo Parcial)

📚 **Librerías externas y versiones**

| Librería | Versión | Uso en PlanIT | Carga |
| --- | --- | --- | --- |
| [Bootstrap](https://getbootstrap.com/) | 5.3.3 | Grilla, navbar colapsable, Modal de ficha técnica, Toast de confirmación e identidad visual vía `bootstrap-overrides.css` | CDN jsDelivr con `integrity` (SRI) y `crossorigin`; copia local en `js/test/vendor/` para el runner |
| [Chart.js](https://www.chartjs.org/) | 4.4.7 (licencia MIT) | Gráfico de dona del presupuesto y de barras del catálogo (`js/charts/graficoService.js`) | CDN jsDelivr (`dist/chart.umd.js`) con `integrity` (SRI), `crossorigin` y `defer`; copia local en `js/test/vendor/` para el runner |
| [Jasmine](https://jasmine.github.io/) | 5.10.0 | Framework de testing unitario del runner `js/test/test-runner.html` | Copia local en `js/test/vendor/` (PR [#152](https://github.com/carolabenvenuto-uces/planit/pull/152); antes, CDN cdnjs) |
| [Playwright](https://playwright.dev/) | 1.64.1 (`devDependencies`) | Ejecuta el runner de Jasmine en Chromium headless (`npm test`) | npm |

🚀 **Sitio publicado (GitHub Pages):** [carolabenvenuto-uces.github.io/planit](https://carolabenvenuto-uces.github.io/planit/) — para la entrega del Segundo Parcial se publica desde la rama `release/segundo-parcial` (ver [`spec-coord-devops-segundo-parcial.md`](docs/03-specs/segundo-parcial/spec-coord-devops-segundo-parcial.md), MOMENTO 2).

✨ **Funcionalidades del Segundo Parcial**
- **Catálogo de proveedores asíncrono:** el catálogo se carga con `fetch` desde `api/proveedores.json`, con spinner y controles deshabilitados mientras carga, mensajes amigables ante errores HTTP, de red, timeout o JSON inválido, botón **Reintentar** y un **fallback** con los datos semilla para que el catálogo nunca quede vacío. Los datos recibidos se validan y sanitizan antes de convertirlos en objetos del modelo (`Proveedor`, `CatalogoProveedores`) y se renderizan sin `innerHTML`.
- **Gráficos con Chart.js:** una dona con el gasto por ítem del presupuesto (subtotales sin descuento) y un gráfico de barras con la cantidad de proveedores por categoría del catálogo. Cada gráfico tiene alto reservado (sin saltos de layout), se recrea al cambiar los datos y, si no hay datos o Chart.js no carga, se oculta y muestra un aviso accesible.
- **Suite de testing ampliada:** `api.spec.js` (fetch, errores, reintento, timeout y métodos de array) y `library.spec.js` (inicialización, configuración y errores de la librería), además de las suites de la AO4, ejecutables sin red con copias locales de las librerías en `js/test/vendor/` (PR [#152](https://github.com/carolabenvenuto-uces/planit/pull/152)).
- **Auditorías Lighthouse en tres momentos:** baseline, post-fetch y post-librería (Test Cases 11, 12 y 13), con issues para cada hallazgo.

✨ **Funcionalidades (desde la AO4)**
- Formulario de alta y personalización de eventos, con validación en vivo y persistencia.
- Calculadora y tabla dinámica de presupuesto integrado, con alerta de presupuesto excedido.
- Gestor de invitados con control de estados de confirmación y persistencia entre sesiones.
- Catálogo interactivo y buscador con filtros de proveedores y plancitos por texto y por categoría.

> En la Actividad Obligatoria N°4, los 4 flujos de la AO3 se reimplementan sobre un modelo de dominio orientado a objetos (`js/models/`) e interactividad real por DOM y eventos en `js/script.js`, con persistencia entre sesiones delegada en `js/utils/storage.js`. Se eliminan `prompt()`/`alert()`/`console.log()` como mecanismo de entrada/salida.

---

🎯 **Objetivo del entregable**

- **Segundo Parcial (actual):** Incorporar una arquitectura de datos asíncrona (consumo con `fetch` y `async`/`await` de un JSON de proveedores, con manejo de estados de carga y error, reintento, timeout y fallback), integrar una librería externa (Chart.js) que consume los modelos POO y los datos del fetch, y ampliar la suite de testing con pruebas de la API y de la librería más auditorías Lighthouse antes y después de cada integración. Además, se aplican las correcciones de la Actividad N°4 y se realiza su backport a `develop`. Por ser un grupo de 3 integrantes, la Coordinadora/DevOps asume también el rol de Tester QA/JS.
- **Actividad Obligatoria N°4:** Reemplazar la lógica de negocio procedural de la AO3 por un modelo de dominio orientado a objetos (8 clases en `js/models/`, con `toJSON()`/`fromJSON()` para serialización) y por un controlador de UI y eventos real en `js/script.js` que manipula el DOM a partir de formularios, sin ventanas emergentes (`prompt()`/`alert()`/`confirm()`). Se agrega persistencia entre sesiones con `localStorage`/`sessionStorage` (`js/utils/storage.js`). Por ser un grupo de 3 integrantes, el rol Coordinador/DevOps absorbe también las tareas de Tester QA y de Desarrollador JS Storage.
- **Actividad Obligatoria N°3:** Integrar la lógica de negocio del simulador en JavaScript mediante algoritmos, funciones, arrays y objetos. Se implementan 4 flujos de trabajo (crear evento, calcular presupuesto, buscar en catálogo y gestionar invitados) con el patrón entrada → proceso → salida, navegables desde un menú con `prompt()`, modelados previamente en diagramas de actividades con PlantUML y validados con tests automatizados en Jasmine, ejecutados en navegador con Playwright MCP.
- **Primer Parcial:** Migrar el sitio a Bootstrap 5 (CDN jsDelivr) usando el sistema de columnas para mejorar la responsividad móvil, centralizar la identidad visual en `css/bootstrap-overrides.css`, incorporar al menos dos componentes avanzados de Bootstrap y dos componentes avanzados de HTML (`<iframe>` con helper `ratio` y `<details>/<summary>`), y validarlos con test cases automatizados (6 a 10) mediante Playwright MCP, registrando los hallazgos como issues con GitHub MCP.
- **Actividad Obligatoria N°2:** Incorporar estilos visuales con CSS organizados por responsabilidad (`styles.css`, `components.css` y `responsive.css`) a partir del mockup actualizado en Figma, implementar un diseño responsive mobile-first con Flexbox/Grid y Media Queries sin overflow horizontal, y validar el sitio mediante 5 test cases automatizados con Playwright MCP, registrando los hallazgos como issues con GitHub MCP.
- **Actividad Obligatoria N°1:** Establecer la estructura base y el maquetado inicial en HTML5 semántico de la plataforma. Este entregable sienta las bases organizativas del repositorio bajo la metodología Spec-Driven Development (SDD), incluyendo la especificación maestra (`plan.md`), la documentación de prompts de IA, el diseño del mockup y las reglas de integración del equipo.

---

⚙️ **Instalación y uso (Segundo Parcial)**

Requisitos: un navegador actual y, para correr los tests desde la terminal, [Node.js](https://nodejs.org/) 20 o superior.

1. **Ver el sitio publicado:** abrir [carolabenvenuto-uces.github.io/planit](https://carolabenvenuto-uces.github.io/planit/). No requiere instalación.
2. **Correrlo en local:** clonar el repositorio y servirlo con un servidor HTTP local. **No abrir `index.html` con doble clic (`file://`)**, porque el navegador bloquea `fetch` sobre archivos locales y el catálogo pasaría al modo fallback.

   ```bash
   git clone https://github.com/carolabenvenuto-uces/planit.git
   cd planit
   npx serve .            # o: python -m http.server 8080
   ```

   Luego abrir la URL que indique el servidor (por ejemplo `http://localhost:3000` o `http://localhost:8080`).
3. **Usar el simulador:** completar el formulario de **Mi Evento**, cargar ítems en **Presupuesto** (la dona se actualiza al calcular), buscar y filtrar en **Catálogo** (el gráfico de barras refleja las categorías cargadas por `fetch`) y gestionar la lista de **Invitados**. Los datos del evento persisten entre sesiones con `localStorage`/`sessionStorage`.
4. **Correr los tests:**

   ```bash
   npm install                          # instala Playwright (devDependencies)
   npm run test:install-browsers        # solo la primera vez: descarga Chromium
   npm test                             # ejecuta el runner de Jasmine en Chromium headless
   ```

   El comando termina con exit code 0 solo si no hay specs fallidos ni errores de consola. También se puede abrir [`js/test/test-runner.html`](js/test/test-runner.html) desde un servidor local, o ejecutar `npm run test:browser`. Detalle en la [documentación de testing JavaScript](js/test/testing-doc.md).

🧪 **Cómo probar la Actividad Obligatoria N°4**

- **Simulador:** abrir `index.html` (o el sitio publicado). Los 4 flujos (Mi Evento, Presupuesto, Catálogo e Invitados) se usan directamente desde los formularios de cada sección; los resultados se muestran en el propio DOM (avisos, badges, tablas), sin ventanas emergentes. Los cambios persisten entre sesiones vía `localStorage`/`sessionStorage`.
- **Tests:** abrir [`js/test/test-runner.html`](js/test/test-runner.html) en el navegador, o ejecutar `node js/test/run-jasmine.js` desde la raíz del proyecto. Las instrucciones completas están en la [documentación de testing JavaScript](js/test/testing-doc.md).

---

📁 **Documentación**

**Segundo Parcial**
- 📝 Specs por rol: [Coordinadora / DevOps](docs/03-specs/segundo-parcial/spec-coord-devops-segundo-parcial.md) · [Desarrolladora JS Asíncrono - Fetch & APIs](docs/03-specs/segundo-parcial/spec-dev-async-fetch.md) · [Desarrollador JS Librerías Externas](docs/03-specs/segundo-parcial/spec-dev-libreria-externa.md) · [Tester QA/JS - Testing Avanzado](docs/03-specs/segundo-parcial/spec-tester-qa-segundo-parcial.md) (PR [#152](https://github.com/carolabenvenuto-uces/planit/pull/152))
- 🌐 [Servicio de API (`js/api/apiService.js`)](js/api/apiService.js) | [Datos de proveedores (`api/proveedores.json`)](api/proveedores.json) | [Evidencia del fetch del catálogo](docs/03-specs/segundo-parcial/evidencia-fetch-catalogo.png) (PR [#147](https://github.com/carolabenvenuto-uces/planit/pull/147))
- 📊 [Documentación de la librería externa Chart.js (`libreria-doc.md`)](docs/06-librerias/libreria-doc.md) | [Capturas](docs/06-librerias/screenshots/) | [Servicio de gráficos (`js/charts/graficoService.js`)](js/charts/graficoService.js) (PR [#149](https://github.com/carolabenvenuto-uces/planit/pull/149))
- 🧪 Testing JavaScript: [documentación](js/test/testing-doc.md) · [test runner](js/test/test-runner.html) · suites [`api.spec.js`](js/test/api.spec.js) · [`library.spec.js`](js/test/library.spec.js) · [`script.spec.js`](js/test/script.spec.js) · [`models.spec.js`](js/test/models.spec.js) · [`storage.spec.js`](js/test/storage.spec.js) · [`servicio-persistencia.spec.js`](js/test/servicio-persistencia.spec.js) (PR [#152](https://github.com/carolabenvenuto-uces/planit/pull/152))
- 🔦 Auditorías Lighthouse: [Test Case 11 - Baseline](docs/04-testing/test-case-11-lighthouse-baseline.md) · [Test Case 12 - Post-fetch](docs/04-testing/test-case-12-lighthouse-post-fetch.md) · [Test Case 13 - Post-librería](docs/04-testing/test-case-13-lighthouse-post-library.md) · [capturas y reportes](docs/04-testing/screenshots/) (PR [#152](https://github.com/carolabenvenuto-uces/planit/pull/152))
- 🧪 [Índice de Testing (Test Cases 1 a 13)](docs/04-testing/testing-doc.md)
- 📦 [Documentación de Storage (`storage-doc.md`)](docs/06-storage/storage-doc.md)
- 🧩 Diagramas: [Diagramas de Actividades](docs/05-diagramas/01-diagrama-de-actividades/diagramas-doc.md) · [Diagrama de Clases](docs/05-diagramas/02-diagrama-de-clases/diagrama-clases-doc.md)
- 📋 Tablero Kanban del Segundo Parcial (GitHub Projects): [COMPLETAR: link al tablero "PlanIT - Segundo Parcial"]
- 🔀 Plantillas de Pull Request: [feature](.github/PULL_REQUEST_TEMPLATE/feature-template.md) · [release](.github/PULL_REQUEST_TEMPLATE/release-template.md)

**Actividad Obligatoria N°4**
- 🧩 [Diagrama de Clases (índice, PlantUML y PNG)](docs/05-diagramas/02-diagrama-de-clases/diagrama-clases-doc.md)
- 💻 [Clases del dominio (`js/models/`)](js/models/) | [Controlador de UI y eventos (`js/script.js`)](js/script.js)
- 📝 Specs por rol: [Coordinación / DevOps](docs/03-specs/actividad-obligatoria-4/spec-devops.md) · [Desarrolladora JS POO](docs/03-specs/actividad-obligatoria-4/spec-dev-poo.md) · [Desarrolladora JS Eventos + DOM](docs/03-specs/actividad-obligatoria-4/spec-dev-eventos-dom.md) · [Desarrollador JS Storage](docs/03-specs/actividad-obligatoria-4/spec-dev-storage.md) · [Tester QA](docs/03-specs/actividad-obligatoria-4/spec-tester-qa.md)
- 📦 [Documentación de `js/utils/storage.js` (API, estrategia de storage por clave)](docs/06-storage/storage-doc.md) (PR [#108](https://github.com/carolabenvenuto-uces/planit/pull/108))
- 🧪 [Documentación de Testing JavaScript (Jasmine) para la AO4](js/test/testing-doc.md) | [Test runner](js/test/test-runner.html) | [Suites: `models.spec.js`](js/test/models.spec.js) · [`storage.spec.js`](js/test/storage.spec.js) · [`script.spec.js`](js/test/script.spec.js) (PR [#110](https://github.com/carolabenvenuto-uces/planit/pull/110))
- 📋 [Tablero Kanban de la Actividad Obligatoria N°4 (GitHub Projects)](https://github.com/users/FacundoGuiraldes/projects/3)

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

**Grupo N°2**

| Nombre completo | N° de Matrícula | Usuario GitHub | Rol en el Segundo Parcial | Rol en la AO4 |
| --- | --- | --- | --- | --- |
| Carola Benvenuto | 158686 | @carolabenvenuto-uces | Desarrolladora JS Asíncrono - Fetch & APIs | Desarrolladora JS POO - Lógica de Negocio |
| Valeria Silva | 156612 | @ValeriaMSilva | Coordinadora / DevOps + Tester QA/JS - Testing Avanzado | Desarrolladora JS Eventos + DOM |
| Facundo Guiraldes | 114797 | @FacundoGuiraldes | Desarrollador JS Librerías Externas | Coordinador / DevOps, Tester QA y Desarrollador JS Storage |

> Grupo de 3 integrantes. En el Segundo Parcial la Coordinadora / DevOps asume también el rol de Tester QA/JS, con una rama `feature/` independiente por rol (`feature/coord-devops-segundo-parcial` y `feature/tester-qa-js-testing-suite`). En la AO4, el Coordinador / DevOps asumió las tareas de Tester QA y de Desarrollador JS Storage (`feature/coord-devops-cuarta-entrega`, `feature/tester-qa-specs` y `feature/dev-storage`).