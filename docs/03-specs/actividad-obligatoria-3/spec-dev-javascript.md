# Especificación Técnica: Desarrollador JavaScript

**Proyecto:** PlanIT — Plataforma de organización de eventos  
**Rol:** Desarrollador JavaScript  
**Rama:** `copilot/dev-java-script-implement-business-logic`  
**Issue:** [#72](https://github.com/carolabenvenuto-uces/planit/issues/72)  

## ANTES — Planificación previa

### Alcance y flujos

La lógica cubrirá cuatro recorridos de negocio de PlanIT. Cada uno recibe datos, los valida y procesa, y devuelve un resultado sin interactuar con la interfaz:

1. **Alta de evento:** recibe nombre, fecha, tipo, presupuesto estimado y ubicación; valida los campos requeridos y que el presupuesto sea positivo; devuelve un objeto de evento normalizado.
2. **Presupuesto:** recibe partidas y presupuesto estimado; valida categoría, concepto, tipo, cantidad y precio unitario; calcula subtotales, total, saldo y si se excede el límite.
3. **Resumen de invitados:** recibe una lista de personas con nombre, contacto y estado; valida registros y cuenta confirmados, pendientes y declinados.
4. **Búsqueda del catálogo:** recibe servicios y texto/filtros opcionales; busca sin distinguir mayúsculas y devuelve coincidencias sin modificar el catálogo.

Los flujos se basan en las secciones «Mi Evento», «Presupuesto», «Invitados» y «Catálogo» de `index.html` y en los requisitos funcionales de `plan.md`. No se encontraron archivos `.puml` en el repositorio al iniciar esta tarea; por eso, no es posible contrastar la implementación con los diagramas del Arquitecto. Si se incorporan al repositorio, deben usarse para verificar estos contratos.

### Arquitectura y menú

- Las funciones de negocio serán funciones globales, puras y documentadas; sus errores de validación serán explícitos y no usarán `prompt()`, `alert()`, el DOM ni eventos. Esto permite cargarlas desde Jasmine sin iniciar una interacción.
- `startPlanItMenu()` será la única entrada de interacción. Presentará opciones para los cuatro flujos mediante `prompt()` y mostrará los resultados con `alert()` y/o `console.log()`.
- El menú **no se ejecutará automáticamente** al cargar `js/script.js`. QA podrá cargar el archivo en `test-runner.html` sin que un diálogo bloquee los tests; para iniciar el recorrido en el navegador se invocará `startPlanItMenu()` manualmente desde la consola.
- No se conectarán formularios ni botones existentes: esa integración requeriría eventos y manipulación del DOM, fuera del alcance de AO3.

### Contratos públicos previstos

| Función | Parámetros | Retorno |
|---|---|---|
| `createEvent(eventData)` | Objeto con `name`, `date`, `type`, `estimatedBudget` y `location` | Objeto de evento validado |
| `calculateBudget(items, estimatedBudget)` | Array de partidas y presupuesto positivo | Objeto con partidas, total, saldo y estado del límite |
| `summarizeGuests(guests)` | Array de invitados (`name`, `contact`, `status`) | Conteos por estado y total |
| `searchCatalog(catalog, query, filters)` | Array de servicios, texto de búsqueda y filtros opcionales | Array nuevo con las coincidencias |
| `startPlanItMenu()` | Sin parámetros; utiliza `prompt`, `alert` y `console` del navegador | `undefined`; ejecuta el menú hasta cancelar/salir |

### Criterios de aceptación

- [ ] Esta especificación se commitea antes de `js/script.js`.
- [ ] Se implementan los cuatro recorridos con validación y patrón entrada → proceso → salida.
- [ ] Las funciones de negocio quedan separadas de la interacción y accesibles para Jasmine.
- [ ] El menú usa `prompt()` y no se inicia automáticamente.
- [ ] No se manipula el DOM ni se agregan eventos.
- [ ] Se documentan las funciones complejas con JSDoc y se usa camelCase.
- [ ] `index.html` referencia `js/script.js`.
- [ ] Se registra la contribución con enlaces a la PR y a la Issue.

