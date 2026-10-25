 # PlanIT - Spec Maestro

 **Actividad Obligatoria N.° 1 - Programación Web I (UCES)**  
 **Producto:** Plataforma All-in-One de Organización & Experiencias  
 **Lema:** "Armá tu evento a medida o elegí una experiencia lista para disfrutar"

 Este documento es el **Spec Maestro** del proyecto. Define la visión, el alcance y
 los criterios técnicos de la primera entrega. Será la referencia común para el
 desarrollo guiado por especificaciones (Spec-Driven Development, SDD), para la
 elaboración de los specs por rol y para la validación de Pull Requests y Code
 Reviews.

 ## Actividad Obligatoria N.° 2 — Alcance & Objetivos

 - [x] **Coordinación / DevOps:** Setup de especificaciones (`spec-devops.md`), actualización de roles en `README.md`, integración de mockup Figma y registro en `changelog.md`.
 - [x] **Frontend / CSS:** Implementación de estilos base, paleta de colores, tipografía Inter y componentes (`styles.css`, `components.css`).
 - [x] **Responsive Design:** Diseño adaptativo mediante Media Queries (`responsive.css`).
 - [x] **Testing & QA:** Pruebas e inspección automatizada de interfaz con Playwright MCP y Copilot.

 ## Actividad Obligatoria N.° 3 — Alcance & Objetivos

La tercera entrega incorpora la **lógica de negocio en JavaScript** del simulador mediante algoritmos, funciones, arrays y objetos, sin manipulación del DOM ni eventos. La interacción se resuelve con `prompt()`, `alert()` y `console.log()`, y sienta las bases para la futura integración con la interfaz.

- [ ] **Coordinación / DevOps:** Correcciones del Primer Parcial, backport, Kanban, Code Reviews asistidos con Copilot Agent Mode, release `v1.1-tercera-entrega` y actualización de `plan.md`, `README.md` y `changelog.md`.
- [ ] **Arquitectura de Diagramas:** 4 diagramas de actividades en PlantUML (`.puml` y `.png`) en `docs/05-diagramas/01-diagrama-de-actividades/`.
- [ ] **Desarrollo JavaScript:** Implementación de los 4 flujos en `js/script.js` con un menú principal mediante `prompt()`.
- [ ] **Testing & QA:** Suite de tests con Jasmine en `js/test/`, ejecutada en browser con Playwright MCP.

### Flujos de negocio de la AO3

Cada flujo sigue el patrón **entrada → proceso → salida** y se modela previamente en su diagrama de actividades, que funciona como contrato de implementación.

| Flujo | Entrada (`prompt()`) | Proceso | Salida (`alert()` / `console.log()`) |
| --- | --- | --- | --- |
| 1. Crear evento | Nombre, tipo y presupuesto estimado | Valida los datos, crea el objeto evento y lo agrega a la colección de eventos | Confirmación o mensaje de error/cancelación |
| 2. Calcular presupuesto | Porcentaje de descuento | Recorre los ítems contratados, suma subtotales, aplica el descuento y compara con el presupuesto estimado | Total final y aviso si se excede el presupuesto |
| 3. Buscar en catálogo | Texto o categoría | Recorre el catálogo de proveedores y filtra por coincidencia de nombre o categoría | Lista de coincidencias o aviso "sin coincidencias" |
| 4. Gestionar invitados | Nombre y estado de confirmación | Registra al invitado y recorre la lista contando confirmados y pendientes | Métricas de confirmados y pendientes |

### Reglas de negocio y validación

- **Evento:** el nombre no puede estar vacío; el tipo debe ser cumpleaños, boda o salida casual; el presupuesto estimado debe ser un número mayor a 0.
- **Presupuesto:** el descuento debe ser numérico y estar entre 0 y 100; el límite de comparación es el presupuesto estimado del evento.
- **Catálogo:** el criterio de búsqueda no puede estar vacío; la búsqueda no distingue mayúsculas de minúsculas. El catálogo contiene los proveedores del mockup aprobado (Gourmet Finger Food, Flores Pilar y DJ Lucas & Sonido).
- **Invitados:** el nombre no puede estar vacío; el estado debe ser **Confirmado** o **Pendiente**, en coherencia con la sección 2.4.

### Reglas técnicas de la AO3

- Todo el código de la AO3 se define en `js/script.js`, referenciado desde `index.html`.
- **Sin manipulación del DOM ni eventos** en esta entrega.
- Las funciones de negocio son puras: reciben parámetros y retornan valores, sin llamar a `prompt()` ni `alert()`. La interacción con el usuario queda en funciones separadas.
- Las funciones se exponen en el ámbito global (no se encapsulan en una IIFE) para poder testearlas con Jasmine.
- El menú principal no se ejecuta automáticamente al cargar `script.js`, para que `js/test/test-runner.html` pueda correr los tests sin quedar bloqueado por un `prompt()`.
- Nomenclatura camelCase para variables y funciones, PascalCase para constructores y clases, y comentarios JSDoc en funciones complejas.

### Trazabilidad de la AO3

| Flujo | Diagrama | Suite de tests |
| --- | --- | --- |
| 1. Crear evento | `actividad-flujo-1-crear-evento.puml` | Flujo 1 en `js/test/script.spec.js` |
| 2. Calcular presupuesto | `actividad-flujo-2-calcular-presupuesto.puml` | Flujo 2 en `js/test/script.spec.js` |
| 3. Buscar en catálogo | `actividad-flujo-3-buscar-catalogo.puml` | Flujo 3 en `js/test/script.spec.js` |
| 4. Gestionar invitados | `actividad-flujo-4-gestionar-invitados.puml` | Flujo 4 en `js/test/script.spec.js` |

El detalle de funciones de `js/script.js` por flujo se documenta en `docs/05-diagramas/01-diagrama-de-actividades/diagramas-doc.md`.

### Criterios de Code Review para la AO3

Además de los criterios de la sección 4.2, las PRs de la AO3 se auditarán verificando:

1. Coherencia entre los diagramas de actividades, `js/script.js` y este documento.
2. Validación de todas las entradas de `prompt()` según las reglas de negocio.
3. Separación entre lógica de negocio e interacción con el usuario.
4. Uso de condicionales, ciclos, arrays y objetos acordes a cada flujo.
5. Ausencia de manipulación del DOM y de eventos en el código nuevo.
6. Tests con happy path, casos borde, errores y operaciones con arrays/objetos.

 ## 1. Visión General del Proyecto

 ### 1.1 Propuesta de valor

 PlanIT será un portal que centraliza la organización de eventos y la búsqueda de
 experiencias. La persona usuaria podrá:

 - Crear un evento desde cero, como un cumpleaños, una boda o una salida casual.
 - Definir sus datos principales, ubicación y presupuesto estimado.
 - Consultar y seleccionar proveedores tradicionales, por ejemplo catering,
	 ambientación, música o fotografía.
 - Explorar paquetes de experiencias listos para disfrutar, llamados
	 **"plancitos"**, como un taller de cerámica con vino, una cata de gin o un show
	 de magia.
 - Visualizar en un mismo lugar el presupuesto, las opciones contratadas y la
	 lista de invitados con su estado de confirmación.

 La propuesta busca reducir la fragmentación de la planificación: en lugar de
 coordinar información en múltiples canales, el usuario contará con un simulador
 visual para armar, comparar y controlar su evento.

 ### 1.2 Alcance de la primera pre-entrega

 La Entrega 1 consiste en la construcción de la **estructura HTML5 semántica y el
 maquetado inicial** de una página web navegable a nivel visual. El objetivo es
 dejar implementada una base clara para incorporar estilos CSS y comportamiento
 JavaScript en entregas posteriores.

 Incluye:

 - La estructura general del sitio y su navegación principal.
 - Un formulario estático de alta de evento con sus campos identificados.
 - Una tabla de presupuesto con datos de ejemplo y totales visibles.
 - Una lista de invitados con datos de ejemplo y estados de confirmación.
 - Un catálogo inicial de proveedores y plancitos representado con tarjetas.
 - Un campo de búsqueda y controles de filtrado preparados para una futura
	 implementación funcional.
 - Contenido de ejemplo suficiente para demostrar la intención de cada sección.

 No incluye en esta pre-entrega persistencia de datos, autenticación, pagos,
 cálculo dinámico del presupuesto, envío real de formularios, filtros funcionales
 ni integración con una API o base de datos.

 ## 2. Requerimientos Funcionales del Simulador (Entrega 1)

 La página deberá presentar las siguientes secciones. En esta etapa los datos
 pueden ser estáticos, pero la estructura debe anticipar la interacción futura.

 ### 2.1 Header y navegación principal

 El encabezado deberá identificar a PlanIT y contener una navegación principal
 mediante un elemento `<nav>`. Como mínimo, deberá permitir ubicar visualmente
 los siguientes destinos:

 - **Mi Evento:** acceso al resumen del evento, su formulario, presupuesto y
	 lista de invitados.
 - **Catálogo de Experiencias/Proveedores:** acceso al buscador y al listado de
	 servicios disponibles.

 Los enlaces deben tener textos claros, destinos identificables y un orden lógico
 para la navegación mediante teclado.

 ### 2.2 Formulario de alta de evento

 La sección "Mi Evento" deberá contener un formulario de alta con etiquetas
 asociadas a cada control. En la Entrega 1 se prioriza su estructura y no el
 procesamiento de los datos.

 Campos mínimos:

 | Campo | Tipo HTML sugerido | Requisito |
 | --- | --- | --- |
 | Nombre del evento | `text` | Identifica el evento de forma breve. |
 | Fecha | `date` | Permite seleccionar la fecha prevista. |
 | Tipo de evento | `select` | Incluye opciones como cumpleaños, boda y salida casual. |
 | Presupuesto estimado | `number` | Representa un monto monetario positivo. |
 | Ubicación | `text` o `textarea` | Registra dirección, barrio o localidad. |

 Los campos obligatorios deberán indicarse mediante `required` y contar con una
 etiqueta visible. El formulario deberá incluir un control de envío con un texto
 comprensible, aunque su acción pueda quedar simulada en esta entrega.

 ### 2.3 Tabla de presupuesto integrada

 La sección de presupuesto deberá mostrar un desglose de los gastos del evento en
 una tabla HTML. Deberá contemplar tanto proveedores tradicionales como
 experiencias o **plancitos**.

 La tabla deberá incluir, como mínimo, las columnas:

 - Categoría (por ejemplo, catering, música, ambientación o experiencia).
 - Concepto o proveedor.
 - Tipo de contratación: proveedor tradicional o plancito.
 - Cantidad o cupo contratado.
 - Precio unitario.
 - Subtotal.

 Debe existir una fila o bloque de total estimado claramente distinguible. La
 tabla usará `<caption>`, encabezados `<th>` y asociaciones apropiadas para que
 su contenido sea comprensible para tecnologías asistivas.

 ### 2.4 Lista de invitados

 La sección de invitados deberá representar la gestión básica de asistentes al
 evento. En la Entrega 1 se mostrarán registros de ejemplo en una tabla o lista
 estructurada.

 Cada registro deberá contemplar:

 - Nombre y apellido.
 - Medio de contacto, como correo electrónico o teléfono.
 - Estado de confirmación: **Confirmado** o **Pendiente**.

 El estado debe ser visible y textual, no depender únicamente del color. La
 estructura deberá quedar preparada para que en una futura entrega se puedan
 agregar, editar, eliminar y actualizar invitados mediante JavaScript.

 ### 2.5 Catálogo y buscador de experiencias y proveedores

 La sección de catálogo deberá permitir explorar visualmente servicios y
 experiencias. Incluirá un campo de búsqueda y, si corresponde al maquetado,
 controles para filtrar por categoría, tipo o ubicación. Estos controles serán
 estáticos en la Entrega 1 y deberán tener etiquetas accesibles.

 Cada opción se mostrará como una tarjeta semántica, preferentemente mediante
 `<article>`, con la siguiente información:

 - Nombre del servicio o plancito.
 - Descripción breve y categoría.
 - Precio o rango de precio.
 - Cupo o capacidad disponible.
 - Lugar o zona donde se realiza.
 - Foto representativa con atributo `alt` descriptivo.
 - Acción claramente identificada para ver el detalle o sumar la opción al
	 evento, aunque todavía no ejecute una operación real.

 El catálogo mostrará las tarjetas definidas en el mockup aprobado de la Actividad
 N°2 (`docs/01-mockup/actividad-obligatoria-2/diseño-con-estilos.png`): Gourmet
 Finger Food, Flores Pilar y DJ Lucas & Sonido. La incorporación de experiencias
 empaquetadas (por ejemplo, taller de cerámica + vino, cata de gin o show de magia)
 queda para una entrega futura, previa actualización del mockup.

 ### 2.6 Footer

 El pie de página deberá utilizar `<footer>` y podrá incluir la identificación del
 proyecto, información institucional mínima y enlaces secundarios de referencia.

 ## 3. Reglas Técnicas y Estándares HTML5

 ### 3.1 Semántica y estructura obligatoria

 La página deberá utilizar HTML5 válido y semántico. Como mínimo, la estructura
 deberá contemplar:

 - `<header>` para la identidad y el encabezado del sitio.
 - `<nav>` para los enlaces principales entre "Mi Evento" y el catálogo.
 - `<main>` para el contenido principal de la aplicación.
 - `<section>` para separar formulario, presupuesto, invitados y catálogo.
 - `<article>` para cada tarjeta independiente de proveedor o plancito.
 - `<table>` para información tabular, especialmente presupuesto e invitados.
 - `<form>` para el alta del evento y los controles de búsqueda.
 - `<footer>` para el cierre del documento.

 Además:

 - El documento deberá declarar `<!doctype html>` y configurar correctamente el
	 atributo `lang` del elemento `<html>`.
 - Deberá existir una jerarquía de encabezados coherente, comenzando con un único
	 `<h1>` y utilizando `<h2>` y `<h3>` según la profundidad de cada sección.
 - Los controles de formulario deberán tener `<label>` asociado, tipos de input
	 adecuados y atributos de validación HTML5 cuando correspondan.
 - Las imágenes deberán incluir `alt`; los enlaces y botones deberán describir su
	 acción sin depender exclusivamente de íconos o color.
 - Las tablas deberán reservarse para datos comparables y contar con encabezados.
 - El contenido deberá mantener una separación clara entre estructura HTML,
	 presentación CSS y comportamiento JavaScript.

 ### 3.2 Comentarios para futuras entregas

 El HTML deberá incluir comentarios explicativos, breves y explícitos en los
 puntos de extensión relevantes. Como mínimo, se deberá señalar:

 - Dónde se aplicarán las reglas de **CSS** futuras: layout, responsive design,
	 estilos de formularios, tablas, estados y tarjetas del catálogo.
 - Dónde se incorporará **JavaScript** futuro: validación y envío del formulario,
	 cálculo automático del presupuesto, alta y actualización de invitados,
	 búsqueda/filtros y acciones para sumar opciones al evento.

 Estos comentarios no reemplazan la separación de archivos o responsabilidades;
 sirven para hacer visible la intención de evolución del prototipo.

 ### 3.3 Calidad mínima de entrega

 Antes de solicitar revisión, el equipo deberá comprobar que:

 - El archivo se abre sin errores y la navegación interna funciona.
 - No existen etiquetas sin cerrar, ids duplicados ni controles sin etiqueta.
 - El HTML puede validarse con el validador correspondiente sin errores
	 estructurales conocidos.
 - El contenido principal es entendible sin estilos y conserva un orden lógico.
 - Los cambios se mantienen dentro del alcance de la Entrega 1.

 ## 4. Trazabilidad para Code Reviews y SDD

 ### 4.1 Documento de referencia

 Este archivo, `plan.md`, es el **Spec Maestro** y constituye la referencia contra
 la que se auditarán:

 - Las Pull Requests de implementación.
 - Los Code Reviews del equipo.
 - Los specs individuales de `docs/03-specs/actividad-obligatoria-1/spec-[rol].md`.
 - La evidencia de cumplimiento de cada requerimiento de esta entrega.

 Cada spec por rol deberá ser consistente con este documento. Si surgiera una
 contradicción, la PR deberá documentar la decisión, actualizar el spec afectado
 y obtener aprobación del Coordinador/DevOps antes de considerarse lista.

 ### 4.2 Criterios de aceptación para Pull Requests y Code Reviews

 El Coordinador/DevOps deberá verificar, como mínimo, los siguientes criterios:

 1. **Trazabilidad:** la PR identifica qué sección o requerimiento del Spec
		Maestro implementa y enlaza el spec individual relacionado, cuando exista.
 2. **Alcance:** el cambio corresponde a la pre-entrega HTML5 y no incorpora
		comportamiento, dependencias o complejidad fuera de lo solicitado sin una
		decisión documentada.
 3. **Semántica:** se utilizan los elementos HTML5 adecuados y no se reemplaza
		estructura semántica por contenedores genéricos sin justificación.
 4. **Accesibilidad básica:** existen encabezados ordenados, labels asociados,
		textos claros, `alt` en imágenes y estados que no dependen solo del color.
 5. **Integridad funcional:** están presentes el header/nav, formulario, tabla de
		presupuesto, lista de invitados, catálogo/buscador y footer.
 6. **Calidad técnica:** no hay errores estructurales conocidos, ids duplicados,
		etiquetas sin cerrar ni contenido de prueba que oculte la funcionalidad
		requerida.
 7. **Preparación evolutiva:** los puntos de futura aplicación de CSS y JavaScript
		están comentados en el código y no se mezclan responsabilidades.
 8. **Evidencia:** la PR incluye una descripción clara, capturas o evidencia de
		verificación cuando corresponda y confirma las comprobaciones realizadas.
 9. **Revisión:** la PR cuenta con la revisión del Coordinador/DevOps y resuelve
		todos los comentarios bloqueantes antes de su aprobación.

 Una PR se considerará aceptada cuando cumpla estos criterios, no contradiga el
 Spec Maestro y permita continuar la siguiente entrega sin rehacer la estructura
 base.
