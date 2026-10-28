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

> **Cambio de herramienta respecto del plan inicial:** el BEFORE planificó generar `js/script.js` con GitHub Copilot Agent Mode. Con la conformidad del docente, el código se generó con **Claude Code** (Anthropic), el asistente de IA en modo agente para VS Code que el equipo ya utilizó en el Primer Parcial y en las code reviews de esta entrega. El flujo de trabajo de la consigna se mantuvo: los `.puml` del Arquitecto y este spec se usaron como contexto y contrato de implementación, y el resultado se revisó y ajustó manualmente.

### 1. Prompt utilizado
- **Herramienta:** Claude Code (modo agente en VS Code).
- **Contexto adjuntado:**
  - `docs/05-diagramas/01-diagrama-de-actividades/actividad-flujo-1-crear-evento.puml`
  - `docs/05-diagramas/01-diagrama-de-actividades/actividad-flujo-2-calcular-presupuesto.puml`
  - `docs/05-diagramas/01-diagrama-de-actividades/actividad-flujo-3-buscar-catalogo.puml`
  - `docs/05-diagramas/01-diagrama-de-actividades/actividad-flujo-4-gestionar-invitados.puml`
  - `docs/03-specs/actividad-obligatoria-3/spec-dev-javascript.md`
  - `index.html`, como fuente de los datos del mockup (ítems de presupuesto, proveedores e invitados).
- **Momento:** después de integrar `develop` en la rama (`237e170`), con los `.puml` aprobados en la PR [#78](https://github.com/carolabenvenuto-uces/planit/pull/78).

```text
Actuá como Desarrollador JavaScript del proyecto PlanIT (Actividad Obligatoria N.° 3).
Adjunto los 4 diagramas de actividades (.puml), que son el contrato de implementación, y mi spec-dev-javascript.md.

Generá js/script.js cumpliendo:
1. Los 4 flujos tal como están modelados en los .puml (actividades, decisiones if/else, ciclos while/repeat), incluido el ciclo de reintento del Flujo 1.
2. Las firmas, retornos y criterio de errores de la tabla del spec (sección 5), con esos nombres exactos.
3. Separación en 3 capas: datos, funciones de negocio puras (sin prompt/alert/console.log, sin modificar variables externas, los agregar* retornan un array nuevo) y funciones de interacción flujoCrearEvento, flujoCalcularPresupuesto, flujoBuscarEnCatalogo, flujoGestionarInvitados e iniciarMenuPrincipal.
4. Los datos del spec (sección 4): TIPOS_EVENTO, ESTADOS_INVITADO, eventos, itemsContratados (total 580000), catalogoProveedores con el método coincideCon(criterio) e invitados de ejemplo.
5. Menú con while + switch (opciones 1 a 4 y 0 para salir; cancelar el prompt cierra el menú).
6. Funciones globales, sin IIFE, sin DOM y sin eventos. Al final del archivo: if (typeof jasmine === "undefined") { iniciarMenuPrincipal(); }
7. Validación del estado de invitado sin distinguir mayúsculas, guardándolo como "Confirmado" o "Pendiente".
8. camelCase, nombres en español y JSDoc en las funciones de negocio.

Además, agregá en index.html, después del script de componentes-bootstrap.js: <script src="js/script.js" defer></script>
```

### 2. Fragmento generado y ajustes manuales
La primera versión generada cumplía las firmas acordadas y la separación en capas. Este es el Flujo 1 y el arranque del menú tal como se generaron:

```javascript
    do {
        nombre = prompt("Nombre del evento:");
        tipo = prompt("Tipo de evento (" + TIPOS_EVENTO.join(", ") + "):");
        presupuesto = prompt("Presupuesto estimado (número mayor a 0):");

        errores = obtenerErroresEvento(nombre, tipo, presupuesto);
        if (errores.length > 0) {
            alert("Datos inválidos:\n" + errores.join("\n"));
            reintentar = quiereReintentar(prompt("¿Desea reintentar? (s/n)"));
        }
    } while (errores.length > 0 && reintentar);

// ...

// El menú no se ejecuta en js/test/test-runner.html: Jasmine se carga antes que este archivo.
if (typeof jasmine === "undefined") {
    iniciarMenuPrincipal();
}
```

Al probarlo en el navegador surgieron dos problemas, que se corrigieron manualmente:

| Problema detectado | Ajuste manual |
| --- | --- |
| Al elegir la opción 1, el navegador cerraba solo el `prompt()` del nombre y el flujo informaba "falta nombre" sin haberlo pedido. Se reprodujo en Chrome y Edge con el protocolo de DevTools: el diálogo se abría y se cerraba a los 20 ms con `result: false`. La causa era que el menú arrancaba mientras la página todavía cargaba recursos (Bootstrap, imágenes, iframe de YouTube), y al avanzar la carga el navegador descartaba el diálogo abierto. | Se agregó `iniciarMenuAlTerminarCarga()`, que consulta `document.readyState` cada 100 ms con `setTimeout` y abre el menú recién cuando vale `"complete"`. Solo lee ese valor: no modifica el DOM ni usa eventos, como pide la consigna. El control de `typeof jasmine` se mantiene para no bloquear `test-runner.html`. |
| Los mensajes no indicaban qué dato se estaba pidiendo ni qué se había ingresado, y si el usuario cancelaba el nombre, el flujo igual pedía el tipo y el presupuesto. | Cada `prompt()` del Flujo 1 indica el paso y el dato ("paso 1 de 3: NOMBRE"). Cancelar un dato saltea los siguientes y lleva a la pregunta de reintento, y el `alert()` de error muestra lo que llegó de cada dato mediante `describirIngreso()` (`(vacío)`, `(cancelado)` o el valor). |

Versión final del Flujo 1 y del arranque:

```javascript
    do {
        // Si el usuario cancela un dato, no se piden los siguientes.
        nombre = prompt("Crear evento (paso 1 de 3)\nIngrese el NOMBRE del evento (ej.: Cumple de Sofía):");
        tipo = nombre === null ? null :
            prompt("Crear evento (paso 2 de 3)\nIngrese el TIPO de evento (" + TIPOS_EVENTO.join(", ") + "):");
        presupuesto = tipo === null ? null :
            prompt("Crear evento (paso 3 de 3)\nIngrese el PRESUPUESTO estimado (número mayor a 0):");
        // ...validación, alert con los datos ingresados y pregunta de reintento
    } while (errores.length > 0 && reintentar);

// ...

function iniciarMenuAlTerminarCarga() {
    if (document.readyState === "complete") {
        iniciarMenuPrincipal();
    } else {
        setTimeout(iniciarMenuAlTerminarCarga, 100);
    }
}

if (typeof jasmine === "undefined") {
    iniciarMenuAlTerminarCarga();
}
```

**Verificación antes de abrir la PR:**
- Los casos planificados por el Tester en `js/test/testing-doc.md` se ejecutaron con aserciones en Node.js contra las funciones de negocio (31 verificaciones, todas correctas), incluidos el total de $580.000, el descuento del 10 % sobre $100.000, el rechazo de "Declinado" y la inmutabilidad de los arrays.
- Se recorrieron el menú y los 4 flujos en Chrome y Edge, incluidos datos inválidos, reintento, cancelación, búsqueda vacía y sin coincidencias.
- Con Jasmine cargado, el menú no se ejecuta.

### 3. Decisiones finales
- **Estructura en 3 capas** dentro de `js/script.js`: datos, funciones de negocio puras e interacción con el usuario. El Tester solo necesita las funciones de negocio, que reciben todo por parámetro y retornan un valor.
- **Firmas idénticas a las acordadas** en la issue [#72](https://github.com/carolabenvenuto-uces/planit/issues/72) y en la tabla de trazabilidad de `diagramas-doc.md`. Se agregaron funciones auxiliares que no cambian el contrato: `obtenerErroresEvento`, `obtenerTipoEvento`, `obtenerEstadoInvitado`, `quiereReintentar`, `calcularSubtotalItem`, `obtenerPresupuestoEstimado`, `formatearListaProveedores`, `formatearMoneda`, `normalizarTexto`, `convertirANumero`, `esTextoNoVacio` y `describirIngreso`.
- **Criterio de errores uniforme:** las `validar*` devuelven `true`/`false` y aceptan el texto crudo de `prompt()`. `aplicarDescuento`, `buscarEnCatalogo` y `agregarInvitado` lanzan `Error`, testeable con `toThrow()`.
- **Objetos con métodos:** los proveedores se crean con el constructor `Proveedor` (PascalCase) y comparten el método `coincideCon(criterio)` por prototipo, que utiliza la búsqueda del Flujo 3.
- **Ciclos coherentes con los diagramas:** `calcularTotalItems`, `buscarEnCatalogo` y `contarAsistencia` recorren las colecciones con `while`, como los `while … endwhile` de los flujos 2, 3 y 4. El Flujo 1 usa `do … while` para el `repeat` de reintento, y el menú, `while` + `switch`.
- **Búsqueda y validaciones sin distinguir mayúsculas ni tildes:** "dj lucas" encuentra "DJ Lucas & Sonido", "decoracion" encuentra "Decoración" y "cumpleanos" se acepta como "cumpleaños".
- **Arranque del menú:** se ejecuta en `index.html` cuando la página terminó de cargar y nunca en `test-runner.html`.

### 4. Criterios de Aceptación al cierre
- [x] `spec-dev-javascript.md` commiteado antes que `js/script.js` (`9c9ac06`).
- [x] 4 flujos completos con validación de entrada y patrón entrada → proceso → salida.
- [x] Menú principal con `prompt()` que permite elegir entre los 4 flujos.
- [x] Funciones con nombres descriptivos, parámetros y valores de retorno explícitos.
- [x] Lógica de negocio separada de la UI: las funciones de negocio no llaman a `prompt()` ni `alert()` directamente.
- [x] Funciones expuestas para testing (no encapsuladas en IIFE).
- [x] Uso de condicionales, ciclos, arrays y objetos acordes a cada flujo.
- [x] Sin manipulación del DOM ni eventos.
- [x] Código que refleja los `.puml` del Arquitecto de Diagramas.
- [x] JSDoc en las funciones de negocio y convenciones camelCase/PascalCase.
- [x] `index.html` referencia correctamente `js/script.js`.
- [x] Prompt exacto, fragmento generado y ajustes manuales documentados en este spec.
- [x] Registro de la PR en `changelog.md`.
