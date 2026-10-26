# Especificación Técnica (Spec) - Desarrollador JavaScript

- **Proyecto:** PlanIT - Plataforma All-in-One de Organización & Experiencias
- **Entrega:** Actividad Obligatoria N° 3
- **Rol:** Desarrollador JavaScript
- **Responsable:** Facundo Guiraldes (@FacundoGuiraldes)
- **Rama:** `feature/dev-javascript-logica-negocio`
- **Issue principal:** [#72](https://github.com/carolabenvenuto-uces/planit/issues/72)
- **Fecha:** 25 de octubre de 2026

---

## MOMENTO 1: Planificación Previa (ANTES de comenzar)

### 1. Qué se va a hacer
Implementación de la lógica de negocio de PlanIT en JavaScript puro dentro de `js/script.js`: los 4 flujos principales del simulador, cada uno con el patrón **entrada → proceso → salida**, navegables desde un menú principal con `prompt()` y con salidas mediante `alert()` y `console.log()`. El archivo se referencia desde `index.html`. Esta entrega no utiliza manipulación del DOM ni eventos.

El código se genera con **GitHub Copilot en modo Agente** a partir de los diagramas de actividades del Arquitecto de Diagramas, que funcionan como contrato de implementación, y se ajusta manualmente para garantizar su testabilidad con Jasmine.

### 2. Insumos y coordinación
- **Diagramas de actividades** (@ValeriaMSilva, PR [#78](https://github.com/carolabenvenuto-uces/planit/pull/78)): los 4 archivos `.puml` de `docs/05-diagramas/01-diagrama-de-actividades/`. El código debe reflejar sus actividades, decisiones y ciclos.
- **`plan.md`** (@carolabenvenuto-uces, PR [#75](https://github.com/carolabenvenuto-uces/planit/pull/75)): flujos de negocio, reglas de validación y reglas técnicas de la AO3.
- **Testing** (@carolabenvenuto-uces, PR [#79](https://github.com/carolabenvenuto-uces/planit/pull/79)): las firmas de las funciones se acordaron con el rol de Tester en la issue [#72](https://github.com/carolabenvenuto-uces/planit/issues/72), a partir de los casos planificados en `js/test/testing-doc.md`.

### 3. Los 4 flujos a implementar

| Flujo | Entrada (`prompt()`) | Proceso | Salida |
| --- | --- | --- | --- |
| 1. Crear evento | Nombre, tipo y presupuesto estimado | Valida los datos; si son inválidos, informa el error y pregunta si se desea reintentar (ciclo de reintento). Con datos válidos crea el objeto evento y lo agrega a la colección de eventos. | `alert()` con la confirmación o con el aviso de cancelación; `console.log()` con el evento registrado |
| 2. Calcular presupuesto | Porcentaje de descuento (0 a 100) | Recorre los ítems contratados con un ciclo y suma sus subtotales, aplica el descuento y compara el total con el presupuesto estimado del evento | `alert()` con el total y el aviso de presupuesto excedido o disponible; `console.log()` con el desglose |
| 3. Buscar en catálogo | Texto o categoría | Recorre el catálogo de proveedores y filtra por coincidencia de nombre o categoría, sin distinguir mayúsculas de minúsculas | `alert()` con la lista de coincidencias o "sin coincidencias"; `console.log()` con la cantidad encontrada |
| 4. Gestionar invitados | Nombre y estado (Confirmado o Pendiente) | Registra al invitado en la colección y la recorre con un ciclo contando confirmados y pendientes | `alert()` con las métricas de asistencia; `console.log()` con las estadísticas |

**Menú principal:** un ciclo `while` muestra con `prompt()` las opciones `1` a `4` (un flujo por opción) y `0` para salir. Un `switch` deriva cada opción a su flujo. Una opción inexistente muestra un `alert()` de error y vuelve a mostrar el menú. Cancelar el `prompt()` (`null`) cierra el menú.

### 4. Datos del proyecto (arrays y objetos)
Los datos de ejemplo se toman del mockup aprobado y de `index.html`:

- `TIPOS_EVENTO`: `["cumpleaños", "boda", "salida casual"]`.
- `ESTADOS_INVITADO`: `["Confirmado", "Pendiente"]`.
- `eventos`: colección de eventos creados en el Flujo 1 (inicia vacía).
- `itemsContratados`: los 5 ítems de la sección Presupuesto (Catering, Decoración, Sonido, Fotografía y Transporte), con categoría, descripción, cantidad y precio unitario. Su total es $580.000.
- `catalogoProveedores`: Gourmet Finger Food (Catering), Flores Pilar (Decoración) y DJ Lucas & Sonido (Sonido). Cada proveedor es un objeto con el método `coincideCon(criterio)`, que usa la búsqueda del Flujo 3.
- `invitados`: invitados de ejemplo de la sección Invitados, con las propiedades `nombre` y `estado`.

El límite del Flujo 2 es el presupuesto estimado del último evento creado. Si todavía no se creó ninguno, se usa el presupuesto de ejemplo del mockup ($700.000).

### 5. Decisiones de arquitectura para la testabilidad
El código se organiza en tres capas dentro de `js/script.js`:

1. **Datos:** constantes y colecciones del punto 4.
2. **Lógica de negocio (funciones puras):** reciben los datos por parámetro y retornan un valor. No llaman a `prompt()` ni a `alert()` ni modifican variables externas; las funciones que "agregan" a una colección retornan un array nuevo. Son las funciones que se testean con Jasmine.
3. **Interacción con el usuario:** una función por flujo (`flujoCrearEvento()`, `flujoCalcularPresupuesto()`, `flujoBuscarEnCatalogo()`, `flujoGestionarInvitados()`) y el menú `iniciarMenuPrincipal()`. Solo estas funciones usan `prompt()`, `alert()` y `console.log()`, y delegan los cálculos y las validaciones en la capa de negocio.

**Firmas acordadas con el Tester** (issue [#72](https://github.com/carolabenvenuto-uces/planit/issues/72)):

| Flujo | Función de negocio | Retorno |
| --- | --- | --- |
| 1. Crear evento | `validarDatosEvento(nombre, tipo, presupuesto)` | `true` / `false` |
| 1. Crear evento | `crearEvento(nombre, tipo, presupuesto)` | objeto evento `{ nombre, tipo, presupuesto }` |
| 1. Crear evento | `agregarEvento(eventos, evento)` | array nuevo con el evento agregado |
| 2. Calcular presupuesto | `calcularTotalItems(items)` | número (suma de los subtotales) |
| 2. Calcular presupuesto | `aplicarDescuento(total, porcentaje)` | número con el descuento aplicado |
| 2. Calcular presupuesto | `superaPresupuesto(total, presupuestoEstimado)` | `true` / `false` |
| 3. Buscar en catálogo | `buscarEnCatalogo(catalogo, criterio)` | array con los proveedores que coinciden |
| 4. Gestionar invitados | `validarInvitado(nombre, estado)` | `true` / `false` |
| 4. Gestionar invitados | `agregarInvitado(invitados, nombre, estado)` | array nuevo con el invitado agregado |
| 4. Gestionar invitados | `contarAsistencia(invitados)` | `{ confirmados, pendientes }` |

**Criterio de manejo de errores:**
- Las funciones `validar*` devuelven `true` o `false` y aceptan el texto crudo que devuelve `prompt()` (por ejemplo, `"abc"` como presupuesto se rechaza).
- `aplicarDescuento` (porcentaje fuera de 0 a 100 o no numérico), `buscarEnCatalogo` (criterio vacío) y `agregarInvitado` (nombre vacío o estado inválido) lanzan un `Error`, para verificarlo con `expect(...).toThrow()`.
- Un total igual al presupuesto estimado no se considera excedido (`superaPresupuesto` usa `>`).

**Exposición y arranque:**
- Todas las funciones se declaran en el ámbito global, sin IIFE, para que `js/test/test-runner.html` pueda acceder a ellas.
- El menú no debe bloquear el runner de tests. Al final de `script.js` se arranca solo cuando Jasmine no está cargado: `if (typeof jasmine === "undefined") { iniciarMenuPrincipal(); }`. En `index.html` el menú se ejecuta al abrir la página; en `test-runner.html` no, porque Jasmine se carga antes que `script.js`. Así todo el código JavaScript queda en `js/script.js` y no se usan eventos.
- `index.html` referencia el archivo con `<script src="js/script.js" defer></script>`.

**Convenciones:** camelCase para variables y funciones, MAYÚSCULAS para constantes de configuración, nombres descriptivos en español coherentes con los diagramas y comentarios JSDoc en las funciones de negocio.

### 6. Herramientas a utilizar
- **GitHub Copilot en modo Agente (VS Code):** se le adjuntan como contexto los 4 archivos `.puml` y este `spec-dev-javascript.md` para generar `js/script.js`.
  - *Justificación:* los diagramas definen las actividades, decisiones y ciclos de cada flujo, y este spec fija las firmas y la separación en capas. Con ambos como contexto, Copilot puede generar una primera versión alineada al contrato, que luego se revisa contra los `.puml` y `plan.md`.
- **Consola del navegador:** para verificar manualmente el menú, los 4 flujos y los mensajes de `console.log()` antes de abrir la PR.

### 7. Criterios de Aceptación (Checklist)
- [ ] `spec-dev-javascript.md` commiteado antes que `js/script.js`.
- [ ] 4 flujos completos con validación de entrada y patrón entrada → proceso → salida.
- [ ] Menú principal con `prompt()` que permite elegir entre los 4 flujos.
- [ ] Funciones con nombres descriptivos, parámetros y valores de retorno explícitos.
- [ ] Lógica de negocio separada de la UI: las funciones de negocio no llaman a `prompt()` ni `alert()` directamente.
- [ ] Funciones expuestas para testing (no encapsuladas en IIFE).
- [ ] Uso de condicionales, ciclos, arrays y objetos acordes a cada flujo.
- [ ] Sin manipulación del DOM ni eventos.
- [ ] Código que refleja los `.puml` del Arquitecto de Diagramas.
- [ ] JSDoc en las funciones de negocio y convenciones camelCase/PascalCase.
- [ ] `index.html` referencia correctamente `js/script.js`.
- [ ] Prompt exacto, fragmento generado y ajustes manuales documentados en este spec.
- [ ] Registro de la PR en `changelog.md`.

---

## MOMENTO 2: Evidencia de Cierre (AL FINALIZAR)

> *Nota: esta sección se completará después de generar y ajustar `js/script.js`.*

### 1. Prompt utilizado en Copilot Agent
*(A completar: prompt exacto en bloque de código y archivos adjuntados como contexto.)*

### 2. Fragmento generado por Copilot y ajustes manuales
*(A completar: fragmento de al menos un flujo y los ajustes realizados para mejorar la testabilidad.)*

### 3. Decisiones finales
*(A completar: estructura final del código y cómo facilita el trabajo del Tester.)*
