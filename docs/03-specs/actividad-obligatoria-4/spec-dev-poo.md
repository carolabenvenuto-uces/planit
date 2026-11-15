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
*(A completar al cierre.)*

### 2. Fragmento generado y ajustes manuales
*(A completar al cierre.)*

### 3. Decisiones finales
*(A completar al cierre.)*

### 4. Criterios de Aceptación al cierre
*(A completar al cierre.)*