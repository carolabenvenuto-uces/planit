# Especificación Técnica (Spec) - Desarrollador JS POO (Lógica de Negocio)

- **Proyecto:** PlanIT - Plataforma All-in-One de Organización & Experiencias
- **Entrega:** Actividad Obligatoria N° 4
- **Rol:** Desarrollador JS POO (Lógica de Negocio)
- **Responsable:** Carola Benvenuto (@carolabenvenuto-uces)
- **Rama:** `feature/dev-poo-logica-negocio`
- **Issue principal:** [#101](https://github.com/carolabenvenuto-uces/planit/issues/101)
- **Fecha:** 15 de noviembre de 2026

---

## MOMENTO 1: Planificación Previa (ANTES de comenzar)

### 1. Qué se va a hacer
Refactorización de la lógica de negocio de PlanIT con Programación Orientada a Objetos: las funciones del antiguo `js/script.js` (Actividad Obligatoria N° 3) se migran a clases del dominio en `js/models/`, un archivo por clase. Cada clase tiene un constructor con parámetros, propiedades encapsuladas, validaciones internas, métodos de negocio y métodos de serialización `toJSON()` / `fromJSON()` para su persistencia.

Las clases no manipulan el DOM, no manejan eventos y no llaman a `prompt()` ni `alert()`: reciben datos por parámetro y devuelven resultados, o lanzan un `Error` cuando los datos son inválidos. De esa forma, `js/script.js` queda como controlador (rol Eventos + DOM) y las clases pueden testearse de forma aislada (rol Tester QA).

La arquitectura se documenta con un diagrama de clases UML en PlantUML. Las clases se generan con **GitHub Copilot en modo Agente**, con los diagramas de actividades, `index.html` y este spec como contexto, y luego se revisan y ajustan manualmente.

### 2. Insumos y coordinación
- **Diagramas de actividades** (`docs/05-diagramas/01-diagrama-de-actividades/`): los 4 flujos que las clases deben reflejar.
- **`js/script.js` de la AO3:** funciones de negocio a migrar y datos de ejemplo del mockup.
- **`index.html`:** referencia visual del dominio (secciones de evento, presupuesto, catálogo e invitados).
- **Desarrollador JS Eventos + DOM:** usa la interfaz pública de las clases desde el controlador.
- **Desarrollador JS Storage:** persiste las instancias mediante `toJSON()` / `fromJSON()`.
- **Tester QA:** escribe `js/test/models.spec.js` contra las clases.

### 3. Entidades del dominio

| Clase | Archivo | Propiedades | Métodos principales |
| --- | --- | --- | --- |
| `Validador` | `js/models/Validador.js` | — (solo métodos estáticos) | `static esTextoNoVacio(valor)`, `static convertirANumero(valor)`, `static normalizarTexto(texto)` |
| `ItemContratado` | `js/models/ItemContratado.js` | `categoria`, `descripcion`, `cantidad`, `precioUnitario` | `calcularSubtotal()`, `toJSON()`, `static fromJSON(json)` |
| `Presupuesto` | `js/models/Presupuesto.js` | `items` (`ItemContratado[]`) | `agregarItem(item)`, `eliminarItem(indice)`, `calcularTotal()`, `aplicarDescuento(porcentaje)`, `superaLimite(limite)`, `toJSON()`, `static fromJSON(json)` |
| `Invitado` | `js/models/Invitado.js` | `nombre`, `estado` | `static ESTADOS`, `static validar(nombre, estado)`, `esConfirmado()`, `cambiarEstado(estado)`, `toJSON()`, `static fromJSON(json)` |
| `ListaInvitados` | `js/models/ListaInvitados.js` | `invitados` (`Invitado[]`) | `agregar(nombre, estado)`, `eliminar(nombre)`, `contarAsistencia()`, `toJSON()`, `static fromJSON(json)` |
| `Evento` | `js/models/Evento.js` | `nombre`, `tipo`, `presupuestoEstimado`, `presupuesto` (`Presupuesto`), `invitados` (`ListaInvitados`) | `static TIPOS`, `static validarDatos(nombre, tipo, presupuesto)`, `superaPresupuesto(porcentajeDescuento)`, `toJSON()`, `static fromJSON(json)` |
| `Proveedor` | `js/models/Proveedor.js` | `nombre`, `categoria`, `precio`, `unidad` | `coincideCon(criterio)`, `toJSON()`, `static fromJSON(json)` |
| `CatalogoProveedores` | `js/models/CatalogoProveedores.js` | `proveedores` (`Proveedor[]`) | `agregarProveedor(proveedor)`, `buscar(criterio)`, `toJSON()`, `static fromJSON(json)` |

### 4. Relaciones entre clases
- **Composición** `Evento` ◆── 1 `Presupuesto`: el presupuesto se crea con el evento y no existe sin él.
- **Composición** `Evento` ◆── 1 `ListaInvitados`: la lista de invitados pertenece a un único evento.
- **Composición** `Presupuesto` ◆── 0..* `ItemContratado`: los ítems contratados forman parte del presupuesto.
- **Composición** `ListaInvitados` ◆── 0..* `Invitado`: los invitados se registran dentro de la lista.
- **Agregación** `CatalogoProveedores` ◇── 0..* `Proveedor`: los proveedores existen de forma independiente al catálogo.
- **Dependencia** de las clases del dominio hacia `Validador`, para las validaciones compartidas.

### 5. Migración desde `js/script.js` (AO3)

| Flujo | Función actual | Destino en POO |
| --- | --- | --- |
| 1. Crear evento | `validarDatosEvento`, `obtenerErroresEvento`, `obtenerTipoEvento` | `Evento.validarDatos()` y validaciones del constructor |
| 1. Crear evento | `crearEvento` | `new Evento(...)` |
| 1. Crear evento | `agregarEvento` | Responsabilidad del controlador o de Storage (colección de eventos) |
| 2. Calcular presupuesto | `calcularSubtotalItem` | `ItemContratado.calcularSubtotal()` |
| 2. Calcular presupuesto | `calcularTotalItems`, `aplicarDescuento`, `superaPresupuesto` | `Presupuesto.calcularTotal()`, `aplicarDescuento()`, `superaLimite()` |
| 3. Buscar en catálogo | `Proveedor` (función constructora), `coincideCon` | `class Proveedor` con `coincideCon()` |
| 3. Buscar en catálogo | `buscarEnCatalogo` | `CatalogoProveedores.buscar()` |
| 4. Gestionar invitados | `validarInvitado`, `obtenerEstadoInvitado` | `Invitado.validar()` y validaciones del constructor |
| 4. Gestionar invitados | `agregarInvitado`, `contarAsistencia` | `ListaInvitados.agregar()`, `contarAsistencia()` |
| Auxiliares | `esTextoNoVacio`, `convertirANumero`, `normalizarTexto` | Métodos estáticos de `Validador` |

Las funciones de interacción (`flujo*()`, `iniciarMenuPrincipal()`, `quiereReintentar()`, `describirIngreso()`) no se migran a las clases: se reemplazan por el controlador con eventos y DOM (rol Eventos + DOM). Las funciones de formato para mostrar resultados (`formatearMoneda`, `formatearListaProveedores`) también quedan del lado del controlador, porque pertenecen a la presentación.

### 6. Decisiones de arquitectura
- **Encapsulamiento:** las propiedades se guardan en campos privados (`#nombre`, `#items`, etc.) y se exponen mediante getters. Las modificaciones se hacen con métodos que validan los datos (por ejemplo, `cambiarEstado()` o `agregarItem()`), nunca asignando la propiedad directamente.
- **Validaciones internas:** los constructores y los métodos validan sus datos y lanzan un `Error` con un mensaje descriptivo si son inválidos. Los métodos estáticos `validar*()` devuelven la lista de errores sin lanzar excepciones, para que el controlador pueda mostrar feedback en tiempo real sin crear la instancia.
- **Separación de responsabilidades:** ninguna clase accede al DOM, registra eventos ni usa `prompt()`, `alert()` o `console.log()`. Las colecciones de datos de ejemplo del mockup no se definen dentro de las clases: las instancia el controlador o se cargan desde Storage.
- **Serialización:** cada clase persistible implementa `toJSON()` (objeto plano, incluyendo los objetos anidados) y `static fromJSON(json)` (reconstruye la instancia y sus objetos anidados). Así, `Evento.fromJSON()` reconstruye también su `Presupuesto` y su `ListaInvitados`.
- **Inmutabilidad hacia afuera:** los getters de colecciones devuelven copias de los arrays, para que el código externo no pueda modificar el estado interno sin pasar por los métodos de la clase.
- **Carga de los archivos:** se propone usar scripts clásicos (las clases quedan disponibles globalmente), cargados en orden de dependencia en `index.html` y en `js/test/test-runner.html`: `Validador`, `ItemContratado`, `Presupuesto`, `Invitado`, `ListaInvitados`, `Evento`, `Proveedor`, `CatalogoProveedores` y, por último, `script.js`. Esto mantiene la compatibilidad con el test runner actual y permite abrir el sitio sin servidor. La decisión final se confirma con el Desarrollador JS Eventos + DOM y el Tester QA; si se adoptan módulos ES6, se documenta en el MOMENTO 2.
- **Ubicación del diagrama de clases:** la consigna menciona `docs/04-diagramas/02-diagrama-de-clases/` en las tareas del rol y `docs/05-diagramas/02-diagrama-de-clases/` en la estructura del proyecto. Se usa `docs/05-diagramas/02-diagrama-de-clases/`, porque es la carpeta donde ya están los diagramas de actividades del repositorio.

### 7. Herramientas a utilizar
- **GitHub Copilot en modo Agente**, con los 4 archivos `.puml` de los diagramas de actividades, `index.html` y este `spec-dev-poo.md` adjuntos como contexto, para generar las clases de `js/models/`. Se eligió porque las clases tienen que reflejar los flujos ya modelados, y adjuntar los diagramas y este spec le da a la IA el contrato de diseño completo.
- **PlantUML** (extensión de VS Code) para el diagrama de clases, exportado en `.puml` y `.png`.

### 8. Criterios de Aceptación (Checklist)
- [ ] `spec-dev-poo.md` commiteado antes que cualquier archivo en `js/models/`.
- [ ] Al menos 3 clases implementadas en `js/models/`, un archivo por clase con nombre en PascalCase.
- [ ] Constructores con parámetros relevantes y validaciones internas que lanzan `Error` ante datos inválidos.
- [ ] Propiedades encapsuladas con campos privados y getters.
- [ ] Métodos de negocio que migran la lógica de los 4 flujos de la AO3.
- [ ] Relaciones de composición y agregación implementadas según la sección 4.
- [ ] Métodos `toJSON()` y `fromJSON()` implementados en las clases persistibles.
- [ ] Sin manipulación del DOM, eventos, `prompt()`, `alert()` ni `console.log()` en las clases.
- [ ] Constructores y métodos documentados con JSDoc.
- [ ] Diagrama de clases en PlantUML exportado en `.puml` y `.png`, con relaciones y multiplicidades.
- [ ] `diagrama-clases-doc.md` con la descripción de cada clase, sus relaciones y las decisiones de diseño.
- [ ] `index.html` referencia los archivos de `js/models/` en orden de dependencia.
- [ ] Prompt de Copilot Agent documentado en el MOMENTO 2.

---

## MOMENTO 2: Evidencia de Cierre (AL FINALIZAR)

### 1. Prompt utilizado
- **Herramienta:** GitHub Copilot en modo Agente (sesión Local de VS Code).
- **Archivos adjuntos como contexto:** los 4 diagramas de actividades (`actividad-flujo-1-crear-evento.puml`, `actividad-flujo-2-calcular-presupuesto.puml`, `actividad-flujo-3-buscar-catalogo.puml` y `actividad-flujo-4-gestionar-invitados.puml`), `index.html`, este `spec-dev-poo.md` y `js/script.js`. Se agregó `js/script.js` al contexto previsto en el MOMENTO 1 para que la lógica migrada respetara exactamente los resultados de la AO3.

```text
Actuá como Desarrollador JS POO (Lógica de Negocio) para la Actividad Obligatoria N.° 4 del proyecto PlanIT.

Con los diagramas de actividades adjuntos (#file:docs/05-diagramas/01-diagrama-de-actividades/actividad-flujo-1-crear-evento.puml, #file:docs/05-diagramas/01-diagrama-de-actividades/actividad-flujo-2-calcular-presupuesto.puml, #file:docs/05-diagramas/01-diagrama-de-actividades/actividad-flujo-3-buscar-catalogo.puml, #file:docs/05-diagramas/01-diagrama-de-actividades/actividad-flujo-4-gestionar-invitados.puml), #file:index.html, #file:docs/03-specs/actividad-obligatoria-4/spec-dev-poo.md y #file:js/script.js como contexto, generá las clases del dominio en la carpeta js/models/, un archivo por clase, siguiendo exactamente las secciones 3, 4, 5 y 6 del spec.

Requisitos:
1. Crear estas 8 clases, cada una en su archivo con nombre en PascalCase: Validador, ItemContratado, Presupuesto, Invitado, ListaInvitados, Evento, Proveedor y CatalogoProveedores, con las propiedades y métodos definidos en la sección 3 del spec.
2. Implementar las relaciones de la sección 4: Evento compone un Presupuesto y una ListaInvitados; Presupuesto compone ItemContratado; ListaInvitados compone Invitado; CatalogoProveedores agrega Proveedor.
3. Migrar la lógica de negocio de js/script.js según la tabla de la sección 5, respetando los mismos resultados: por ejemplo, el total de los ítems del mockup debe dar 580000, aplicarDescuento debe aceptar porcentajes de 0 a 100 y superaLimite debe usar mayor estricto.
4. Encapsular las propiedades con campos privados (#) y exponerlas con getters. Los getters de colecciones deben devolver copias de los arrays.
5. Validar los datos en los constructores y en los métodos, lanzando Error con mensajes descriptivos en español. Los métodos estáticos validar*() deben devolver un array de errores sin lanzar excepciones.
6. Implementar toJSON() y static fromJSON(json) en las clases persistibles, incluyendo la reconstrucción de los objetos anidados (por ejemplo, Evento.fromJSON reconstruye su Presupuesto y su ListaInvitados).
7. Documentar cada clase, constructor y método con JSDoc. Usar camelCase para métodos y propiedades, y PascalCase para clases.
8. Las clases no deben manipular el DOM, registrar eventos ni usar prompt(), alert() ni console.log(). Tampoco deben incluir los datos de ejemplo del mockup.
9. Usar scripts clásicos (sin import/export), para que las clases queden disponibles globalmente al cargarlas en orden en index.html y en js/test/test-runner.html.
10. No modificar js/script.js, index.html ni ningún archivo fuera de js/models/.

Al terminar, listá los archivos creados y explicá brevemente cualquier decisión que no esté definida en el spec.
```

**Output generado por Copilot (resumen):** creó los 8 archivos de `js/models/` (commit `b41d685`) sin modificar otros archivos. Como Node no estaba disponible en el entorno, verificó las clases en el navegador con Playwright: total de los ítems del mockup (580000), descuentos de 0, 10 y 100 %, rechazo de descuentos inválidos, comparación estricta con el límite, copias de las colecciones, reconstrucción anidada con `fromJSON()` y búsqueda en el catálogo, con todas las comprobaciones correctas. Además, informó que `js/script.js` ya declara una función constructora `Proveedor`, por lo que cargar ambos archivos produce un error de redeclaración, y no lo resolvió porque el prompt indicaba no modificar otros archivos.

### 2. Fragmento generado y ajustes manuales

**Fragmento generado por Copilot** (`js/models/Evento.js`, commit `b41d685`):

```javascript
    superaPresupuesto(porcentajeDescuento) {
        return this.#presupuesto.aplicarDescuento(porcentajeDescuento) > this.#presupuestoEstimado;
    }

    static fromJSON(json) {
        if (!json || typeof json !== "object" || Array.isArray(json)) throw new Error("Los datos del evento son inválidos.");
        const evento = new Evento(json.nombre, json.tipo, json.presupuestoEstimado);
        evento.#presupuesto = Presupuesto.fromJSON(json.presupuesto);
        evento.#invitados = ListaInvitados.fromJSON(json.invitados);
        return evento;
    }
```

**Ajustes manuales** (commits `47a592e` y `85c07b1`):

| Archivo | Ajuste | Justificación |
| --- | --- | --- |
| `Validador.js` | Se agregó `static buscarOpcion(opciones, valor)` y se quitó el constructor vacío. | `Evento` e `Invitado` repetían cuatro veces la misma búsqueda de opciones normalizadas; centralizarla evita duplicar código. La clase solo tiene métodos estáticos y no se instancia. |
| `Evento.js` | `superaPresupuesto(porcentajeDescuento = 0)` toma 0 como descuento por defecto. | Sin parámetro, el método lanzaba un error; ahora puede usarse para comparar el total sin descuento, como en la AO3. |
| `Evento.js` | `fromJSON()` crea vacíos el presupuesto y la lista de invitados si no vienen en los datos. | Hace más robusta la reconstrucción de eventos guardados en Storage con datos parciales. |
| `Invitado.js` | `cambiarEstado()` valida solo el estado nuevo con `buscarOpcion()`. | La versión generada volvía a validar el nombre, que no cambia. |
| Las 8 clases | JSDoc de cada clase con su responsabilidad y sus relaciones, descripción en los constructores de `ItemContratado` y `Proveedor`, y líneas largas divididas en `Evento.js`. | Mejora la documentación que pide la consigna y la legibilidad del código. |

Después de los ajustes, se volvieron a ejecutar las 8 clases en el navegador con las comprobaciones de los 4 flujos, y además se verificaron `superaPresupuesto()` sin parámetro, `fromJSON()` sin componentes, `cambiarEstado()` y `buscarOpcion()`: todas las comprobaciones fueron correctas.

### 3. Decisiones finales
- **Arquitectura final:** se mantuvieron las 8 clases y las relaciones planificadas en el MOMENTO 1, sin cambios de diseño. La única incorporación fue el método `Validador.buscarOpcion()`, agregado en los ajustes manuales para no repetir la búsqueda de opciones normalizadas en `Evento` e `Invitado`. El diagrama de clases y su documentación están en [`docs/05-diagramas/02-diagrama-de-clases/`](../../05-diagramas/02-diagrama-de-clases/diagrama-clases-doc.md).
- **Carga de los archivos:** se confirmaron los scripts clásicos (sin `import`/`export`), cargados en orden de dependencia antes de `js/script.js`, con `defer` en `index.html` y sin `defer` en `js/test/test-runner.html`. Así, el test runner existente sigue funcionando sin cambios en su estructura.
- **Integración con el controlador existente:** Copilot detectó que `js/script.js` (AO3) declaraba una función constructora `Proveedor`, que colisionaba con la clase nueva. La solución se coordinó en la issue [#101](https://github.com/carolabenvenuto-uces/planit/issues/101): el Coordinador / Tester QA la validó ejecutando los 82 tests existentes con las clases nuevas (82 specs, 0 fallas) y sugirió agregar `<meta charset="UTF-8">` en el test runner, para que los acentos de `normalizarTexto()` no dependan del navegador. En el commit `2e889d1` se quitó de `js/script.js` solo esa función y su método `coincideCon`, ya que la clase nueva tiene el mismo constructor y el mismo método, y se agregaron las referencias a `js/models/` en `index.html` y en el test runner. Se avisó a la Desarrolladora JS Eventos + DOM, responsable de `js/script.js`, que el resto de las funciones del archivo quedan para su refactor como controlador.
- **Interfaz pública para el controlador (Eventos + DOM):** `Evento.validarDatos()` e `Invitado.validar()` devuelven la lista de errores sin lanzar excepciones, por lo que pueden usarse para la validación en tiempo real de los formularios. Los resultados de los flujos se obtienen con `Presupuesto.calcularTotal()`, `Presupuesto.aplicarDescuento()`, `Evento.superaPresupuesto()`, `CatalogoProveedores.buscar()` y `ListaInvitados.contarAsistencia()`.
- **Facilidades para Storage:** cada clase persistible expone `toJSON()` y `static fromJSON(json)`. `Evento` funciona como raíz: `JSON.stringify(evento)` serializa también su presupuesto y su lista de invitados, y `Evento.fromJSON()` reconstruye todo el árbol de objetos, tolerando datos guardados sin esos componentes. `CatalogoProveedores` se serializa de la misma forma.
- **Facilidades para el Tester QA:** las clases no dependen del DOM ni de datos globales, por lo que pueden instanciarse de forma aislada en `js/test/models.spec.js`. Las validaciones lanzan `Error` con mensajes descriptivos, testeables con `toThrow()`, y los getters de colecciones devuelven copias, lo que permite verificar el encapsulamiento.

### 4. Criterios de Aceptación al cierre
- [x] `spec-dev-poo.md` commiteado antes que cualquier archivo en `js/models/` (`14f8239` antes de `b41d685`).
- [x] 8 clases implementadas en `js/models/`, un archivo por clase con nombre en PascalCase.
- [x] Constructores con parámetros relevantes y validaciones internas que lanzan `Error` ante datos inválidos.
- [x] Propiedades encapsuladas con campos privados y getters.
- [x] Métodos de negocio que migran la lógica de los 4 flujos de la AO3.
- [x] Relaciones de composición y agregación implementadas según la sección 4.
- [x] Métodos `toJSON()` y `fromJSON()` implementados en las clases persistibles.
- [x] Sin manipulación del DOM, eventos, `prompt()`, `alert()` ni `console.log()` en las clases.
- [x] Constructores y métodos documentados con JSDoc.
- [x] Diagrama de clases en PlantUML exportado en `.puml` y `.png`, con relaciones y multiplicidades.
- [x] `diagrama-clases-doc.md` con la descripción de cada clase, sus relaciones y las decisiones de diseño.
- [x] `index.html` referencia los archivos de `js/models/` en orden de dependencia.
- [x] Prompt de Copilot Agent documentado en el MOMENTO 2.
- [x] **RC12:** el diagrama de clases incluye todos los getters públicos de la interfaz real de `js/models/` (20 getters, incluidos los estáticos `TIPOS` y `ESTADOS`), con la convención de la sección 5.

### 5. Corrección RC12: getters públicos en el diagrama de clases

**Observación del docente:** "El diagrama no representa todos los getters públicos que forman parte de la interfaz real de las clases. Incorporarlos o documentar una exclusión compatible con la consigna."

**Decisión:** se incorporaron los getters al diagrama, en lugar de documentar una exclusión. Para el controlador (`js/script.js`) y para el Tester QA, los getters son la única forma de leer el estado de las clases, así que forman parte de su contrato.

#### 5.1 Auditoría de la interfaz real

Se revisaron las 8 clases de `js/models/` y se comparó cada `get` declarado con `docs/05-diagramas/02-diagrama-de-clases/diagrama-clases.puml`. Antes de la corrección, el diagrama mostraba los atributos privados, pero no los getters que los exponen. `TIPOS` y `ESTADOS` figuraban como atributos estáticos, aunque en el código son getters estáticos.

| Clase | Getters públicos incorporados | Tipo de retorno | Qué devuelve |
| --- | --- | --- | --- |
| `Evento` | `{static} get TIPOS()` | `string[]` | Array nuevo en cada llamada |
| | `get nombre()`, `get tipo()` | `string` | Valor primitivo |
| | `get presupuestoEstimado()` | `number` | Valor primitivo |
| | `get presupuesto()` | `Presupuesto` | El componente (composición) |
| | `get invitados()` | `ListaInvitados` | El componente (composición) |
| `Presupuesto` | `get items()` | `ItemContratado[]` | Copia (`this.#items.slice()`) |
| `ItemContratado` | `get categoria()`, `get descripcion()` | `string` | Valor primitivo |
| | `get cantidad()`, `get precioUnitario()` | `number` | Valor primitivo |
| `ListaInvitados` | `get invitados()` | `Invitado[]` | Copia (`this.#invitados.slice()`) |
| `Invitado` | `{static} get ESTADOS()` | `string[]` | Array nuevo en cada llamada |
| | `get nombre()`, `get estado()` | `string` | Valor primitivo |
| `CatalogoProveedores` | `get proveedores()` | `Proveedor[]` | Copia (`this.#proveedores.slice()`) |
| `Proveedor` | `get nombre()`, `get categoria()`, `get unidad()` | `string` | Valor primitivo |
| | `get precio()` | `number` | Valor primitivo |
| `Validador` | — (solo métodos estáticos) | — | — |

Ninguna clase declara setters. Tampoco existen getters de identificador, fecha, total ni subtotal (`id`, `fecha`, `total`, `subtotal`). Por eso no se agregaron al diagrama: los montos se obtienen con los métodos `calcularTotal()`, `aplicarDescuento()` y `calcularSubtotal()`, que ya figuraban. Agregar al diagrama miembros que no están en el código volvería a desincronizarlo.

#### 5.2 Convención UML aplicada a los getters

| Elemento en JavaScript | Notación en el diagrama | Ejemplo |
| --- | --- | --- |
| Campo privado `#campo` | `- campo : Tipo` (visibilidad privada) | `- nombre : string` |
| Getter de instancia `get campo() { … }` | `+ get campo() : Tipo` (visibilidad pública, prefijo `get`, paréntesis vacíos y tipo de retorno) | `+ get nombre() : string` |
| Getter estático `static get X() { … }` | `{static} + get X() : Tipo` (PlantUML lo muestra subrayado) | `{static} + get TIPOS() : string[]` |

- **Nomenclatura:** el getter conserva el mismo nombre que el campo privado que expone, igual que en el código (`#items` → `get items()`).
- **Orden dentro de cada clase:** atributos privados, constructor, getters (primero los estáticos), métodos de negocio y, al final, `toJSON()` / `fromJSON()`.
- **Atributo y getter juntos:** se muestran ambos porque representan cosas distintas: el campo `#privado` es el estado encapsulado y el getter es la interfaz pública de solo lectura.
- **Notas de encapsulamiento:** una nota general aclara que no hay setters y que el estado cambia con métodos que validan. Las notas de `Presupuesto`, `ListaInvitados` y `CatalogoProveedores` indican que sus getters de colección devuelven copias con `slice()`. La nota de `Evento` aclara que `presupuesto` e `invitados` devuelven el componente (por la composición, sus cambios pasan por `agregarItem()`, `agregar()`, etc.) y que `TIPOS`/`ESTADOS` devuelven un array nuevo en cada llamada.

#### 5.3 Sincronización y verificación

- Se actualizaron `diagrama-clases.puml`, la imagen `diagrama-clases.png` (reexportada desde el `.puml` con el `plantuml.jar` de la extensión de VS Code) y la sección *Decisiones de diseño* de `diagrama-clases-doc.md`.
- `java -jar plantuml.jar -checkonly diagrama-clases.puml` no informa errores de sintaxis, y la imagen exportada muestra las 8 clases con sus getters, relaciones, multiplicidades y notas.
- Las clases de `js/models/` no se modificaron: la corrección alinea el diagrama con el código y no al revés.
- **Regla de mantenimiento:** si se agrega, quita o renombra un getter en `js/models/`, hay que actualizar en el mismo cambio el `.puml`, el `.png` y la tabla 5.1.
