# Especificación Técnica (Spec) - Desarrollador JS Eventos + DOM

- **Proyecto:** PlanIT - Plataforma All-in-One de Organización & Experiencias
- **Materia:** Programación Web I (UCES)
- **Entrega:** Actividad Obligatoria N° 4
- **Rol:** Desarrollador JS Eventos + DOM
- **Responsable:** Valeria Silva (@ValeriaMSilva)
- **Rama:** `feature/dev-eventos-dom`
- **Archivo a refactorizar:** `js/script.js`
- **Fecha:** 16 de noviembre de 2026

---

## ANTES DE LA IMPLEMENTACIÓN

### 1. Objetivo y alcance

#### 1.1 Justificación del rol
En la Actividad Obligatoria N° 3, `js/script.js` concentró en un solo archivo tres capas: datos, lógica de negocio (funciones puras) e interacción con el usuario mediante un menú `while` + `switch` basado en `prompt()` y `alert()`. Ese modelo de interacción bloquea el hilo principal del navegador, no aprovecha los formularios ya maquetados en `index.html` y no permite validación progresiva ni feedback contextual.

El rol **Desarrollador JS Eventos + DOM** se encarga de reemplazar esa capa de interacción por una **interfaz dirigida por eventos**: los 4 flujos de PlanIT pasan a ejecutarse desde formularios, controles y contenedores reales del documento, escuchando eventos del navegador (`submit`, `input`, `change`, `blur`, `click`) y actualizando el DOM en respuesta.

#### 1.2 Eliminación total de pop-ups (Regla 2)
- Queda **100 % prohibido** el uso de `prompt()`, `alert()` y `confirm()` en todo el código de la aplicación (incluye `js/script.js` y `js/models/`).
- Se elimina el menú principal `iniciarMenuPrincipal()` y su disparador `iniciarMenuAlTerminarCarga()`, junto con las funciones de interacción `flujoCrearEvento()`, `flujoCalcularPresupuesto()`, `flujoBuscarEnCatalogo()` y `flujoGestionarInvitados()` en su versión basada en pop-ups.
- Se eliminan las funciones auxiliares que existen solo para interpretar respuestas de `prompt()`: `quiereReintentar(respuesta)` y `describirIngreso(valor)`.
- Toda entrada de datos se realiza mediante **formularios e inputs**; toda salida (confirmaciones, errores, resultados) se renderiza en **el DOM** (mensajes inline, contenedores de resultado, `toast` de Bootstrap ya existente `#toastConfirmacion`, clases `.invalid-feedback`).
- Verificación automatizable: `grep -nE "prompt\(|alert\(|confirm\(" js/` debe devolver **0 coincidencias**.

#### 1.3 `js/script.js` como controlador (Regla 1)
`js/script.js` pasa a ser **exclusivamente el controlador / orquestador de UI y eventos**. Su responsabilidad se limita a:

| Responsabilidad de `js/script.js` | Ejemplo |
| --- | --- |
| Obtener referencias a nodos del DOM | `document.querySelector("#form-evento")` |
| Registrar listeners | `formEvento.addEventListener("submit", manejarSubmitEvento)` |
| Leer valores de los controles | `inputNombre.value.trim()` |
| Delegar validación, cálculo y persistencia | `Evento.validar(datos)`, `presupuesto.calcularPresupuestoTotal()`, `storage.guardarEvento(evento)` |
| Renderizar el resultado devuelto por el modelo | crear nodos, actualizar `textContent`, alternar clases CSS |
| Gestionar estado visual | `is-valid` / `is-invalid`, `disabled` en botones, `aria-invalid` |

Queda **0 % de lógica de negocio o cálculos** en `js/script.js`. Todo lo siguiente se traslada a `js/models/`:

| Función actual en `js/script.js` (AO3) | Destino en AO4 |
| --- | --- |
| `Proveedor` + `Proveedor.prototype.coincideCon()` | `js/models/Proveedor.js` |
| `obtenerTipoEvento()`, `obtenerErroresEvento()`, `validarDatosEvento()`, `crearEvento()`, `agregarEvento()` | `js/models/Evento.js` |
| `calcularSubtotalItem()`, `calcularTotalItems()`, `aplicarDescuento()`, `superaPresupuesto()`, `obtenerPresupuestoEstimado()` | `js/models/Presupuesto.js` (expone `calcularPresupuestoTotal()`) |
| `buscarEnCatalogo()`, `formatearListaProveedores()` | `js/models/Catalogo.js` |
| `obtenerEstadoInvitado()`, `validarInvitado()`, `agregarInvitado()`, `contarAsistencia()` | `js/models/Invitado.js` / `js/models/ListaInvitados.js` |
| `normalizarTexto()`, `convertirANumero()`, `esTextoNoVacio()`, `formatearMoneda()` | `js/models/utils.js` |
| Lectura/escritura de colecciones (`eventos`, `invitados`) | `js/models/storage.js` (envoltorio de `localStorage` con `try/catch`) |

> **Criterio de frontera:** si una línea de `js/script.js` contiene un operador aritmético sobre datos de negocio (`+`, `*`, `-`, `/`, `%`), una regla de validación (rangos, listas permitidas, longitudes mínimas) o un acceso directo a `localStorage`, está en la capa equivocada y debe moverse a `js/models/`.

#### 1.4 Fuera de alcance
- Definición de las reglas de negocio en sí (son responsabilidad de `js/models/`; este rol solo las **invoca**).
- Rediseño visual del layout o de los componentes Bootstrap existentes (modal `#modalDetalleServicio`, carrusel, acordeón FAQ).
- Escritura de los tests unitarios de los modelos (rol Tester). Este rol sí garantiza que el controlador no rompa las firmas acordadas.

#### 1.5 Dependencias con el HTML
Los identificadores de esta spec son el **contrato** entre `index.html` y `js/script.js`. Los IDs actuales de la maqueta deben alinearse:

| ID actual en `index.html` | ID contractual AO4 |
| --- | --- |
| `#event-form` | `#form-evento` |
| `#busqueda-catalogo` (form `.catalog-search` sin ID) | `#buscar-catalogo` + `#categoria-catalogo` |
| Sección `#presupuesto` (sin formulario) | `#form-presupuesto` + `#desglose-presupuesto` |
| Sección `#invitados` (tabla estática) | `#form-invitado` + `#lista-invitados` |
| Grilla de tarjetas del catálogo | `#contenedor-catalogo` |

Los scripts se cargan al final del `<body>` con `defer` o como `type="module"`, en este orden: Bootstrap → `js/models/*.js` → `js/script.js`.

---

### 2. Mapeo de eventos y controles para los 4 flujos de PlanIT

#### Flujo 1: Crear evento

| Elemento | Selector | Tipo | Evento(s) | Handler |
| --- | --- | --- | --- | --- |
| Formulario | `#form-evento` | `<form novalidate>` | `submit` | `manejarSubmitEvento(e)` |
| Nombre | `#nombre-evento` | `input[type=text]` | `input`, `blur` | `validarCampoEvento(e)` |
| Fecha | `#fecha-evento` | `input[type=date]` | `change`, `blur` | `validarCampoEvento(e)` |
| Tipo | `#tipo-evento` | `select` | `change` | `validarCampoEvento(e)` |
| Presupuesto estimado | `#presupuesto-estimado` | `input[type=number]` | `input`, `blur` | `validarCampoEvento(e)` |
| Ubicación | `#ubicacion` | `input[type=text]` | `input`, `blur` | `validarCampoEvento(e)` |
| Botón guardar | `#btn-guardar-evento` | `button[type=submit]` | — (habilitado/deshabilitado) | `actualizarEstadoBoton(form, btn)` |
| Confirmación | `#confirmacion-evento` | `div[role=status][aria-live=polite]` | — | `renderConfirmacionEvento(evento)` |

**Secuencia del handler `manejarSubmitEvento(e)`:**
1. `e.preventDefault()` para evitar la recarga de la página y el envío por `action="#"`.
2. Leer los valores con `new FormData(e.currentTarget)` y construir un objeto plano `datos = { nombre, fecha, tipo, presupuesto, ubicacion }` (solo lectura; sin conversiones numéricas en el controlador).
3. Invocar `Evento.obtenerErrores(datos)` (modelo). Retorna un objeto `{ campo: mensaje }` vacío si es válido.
4. Si hay errores: marcar cada control con `is-invalid`, escribir el mensaje en su `.invalid-feedback`, poner `aria-invalid="true"` y llevar el foco (`.focus()`) al primer campo inválido. **Fin del flujo** (reemplaza el ciclo de reintento con `prompt()`).
5. Si es válido: `const evento = new Evento(datos)` (modelo) → `storage.guardarEvento(evento)` (persistencia).
6. `renderConfirmacionEvento(evento)`: inyectar en `#confirmacion-evento` un bloque con nombre, tipo, fecha y presupuesto formateado por el modelo (`evento.presupuestoFormateado()` o `utils.formatearMoneda()`), y/o mostrar `#toastConfirmacion` con `bootstrap.Toast.getOrCreateInstance(...).show()`.
7. `e.currentTarget.reset()`, limpiar clases `is-valid` / `is-invalid` y recalcular el estado del botón.
8. Disparar la actualización de vistas dependientes: el presupuesto estimado del Flujo 2 toma el del último evento guardado.

#### Flujo 2: Calcular presupuesto

| Elemento | Selector | Tipo | Evento(s) | Handler |
| --- | --- | --- | --- | --- |
| Formulario | `#form-presupuesto` | `<form novalidate>` | `submit` | `manejarSubmitPresupuesto(e)` |
| Cantidades de ítems | `#form-presupuesto [data-item-id] .input-cantidad` | `input[type=number]` | `input` (delegado en el form) | `manejarCambioPresupuesto(e)` |
| Descuento (%) | `#descuento-presupuesto` | `input[type=number] min=0 max=100` | `input`, `blur` | `manejarCambioPresupuesto(e)` |
| Selección de ítems | `#form-presupuesto input[type=checkbox][data-item-id]` | `checkbox` | `change` (delegado) | `manejarCambioPresupuesto(e)` |
| Botón calcular | `#btn-calcular-presupuesto` | `button[type=submit]` | `click` → `submit` | — |
| Desglose | `#desglose-presupuesto` | `tbody` / `ul` | — | `renderDesglosePresupuesto(resultado)` |
| Total | `#total-presupuesto` | `output` | — | `renderDesglosePresupuesto(resultado)` |
| Alerta de exceso | `#alerta-presupuesto` | `div.alert[role=alert]` | — | `renderAlertaPresupuesto(resultado)` |

**Secuencia:**
1. `submit` → `e.preventDefault()`. Los eventos `input` / `change` sobre el formulario ejecutan el mismo recálculo (cálculo en vivo); se aplica un *debounce* de ~250 ms solo si el recálculo resulta costoso.
2. El controlador recolecta los valores crudos (`{ itemId, cantidad, incluido }` y `descuento`) sin convertirlos ni operar sobre ellos.
3. Invoca **`presupuesto.calcularPresupuestoTotal({ items, descuento, presupuestoEstimado })`** del modelo `Presupuesto`. El `presupuestoEstimado` se obtiene de `storage.obtenerUltimoEvento()`; si no existe, el modelo aplica su valor por defecto (`PRESUPUESTO_EJEMPLO = 700000`).
4. Contrato de retorno esperado del modelo (el controlador solo lo lee):
   ```js
   {
     subtotales: [{ categoria, descripcion, cantidad, precioUnitario, subtotal }],
     subtotal,          // suma de ítems
     descuento,         // porcentaje aplicado
     montoDescuento,
     total,             // total final
     presupuestoEstimado,
     excedido,          // boolean
     disponible,        // presupuestoEstimado - total (calculado en el modelo)
     errores            // { descuento: "..." } si el porcentaje es inválido
   }
   ```
5. Si `errores` no está vacío: marcar `#descuento-presupuesto` con `is-invalid`, deshabilitar `#btn-calcular-presupuesto` y no renderizar el total.
6. `renderDesglosePresupuesto(resultado)`: vaciar `#desglose-presupuesto` (`replaceChildren()`), crear una fila por subtotal con `document.createElement` + `textContent` (nunca `innerHTML` con datos variables), y escribir `subtotal`, `montoDescuento` y `total` ya formateados.
7. `renderAlertaPresupuesto(resultado)`: alternar `alert-danger` / `alert-success` en `#alerta-presupuesto` según `resultado.excedido` y escribir el mensaje.

#### Flujo 3: Buscar en catálogo

| Elemento | Selector | Tipo | Evento(s) | Handler |
| --- | --- | --- | --- | --- |
| Formulario de búsqueda | `form.catalog-search` | `<form role=search>` | `submit` | `e.preventDefault()` (la búsqueda es en vivo) |
| Texto | `#buscar-catalogo` | `input[type=search]` | `input` (tiempo real), `search` (limpiar con ✕) | `manejarFiltroCatalogo()` |
| Categoría | `#categoria-catalogo` | `select` (`Todas`, `Catering`, `Decoración`, `Sonido`, …) | `change` | `manejarFiltroCatalogo()` |
| Resultados | `#contenedor-catalogo` | `div.row` | `click` (delegado) | `manejarClickCatalogo(e)` |
| Contador | `#contador-catalogo` | `p[aria-live=polite]` | — | `renderCatalogo(resultados)` |

**Secuencia:**
1. Cada `input` en `#buscar-catalogo` o `change` en `#categoria-catalogo` ejecuta `manejarFiltroCatalogo()`.
2. El controlador lee `{ texto, categoria }` y llama a `catalogo.buscar({ texto, categoria })` (modelo). La normalización (minúsculas, tildes, espacios) y la coincidencia por nombre/categoría (`Proveedor.prototype.coincideCon`) viven en el modelo.
3. `renderCatalogo(resultados)`:
   - `contenedor.replaceChildren()`.
   - Por cada proveedor: clonar un `<template id="tpl-tarjeta-proveedor">` o crear la tarjeta con `createElement`, asignando `textContent` a nombre, categoría y precio formateado, y `dataset.proveedorId` a la tarjeta.
   - Insertar con un `DocumentFragment` para un solo reflow.
   - Si `resultados.length === 0`: renderizar un estado vacío (`"Sin coincidencias para “texto”"`) dentro de `#contenedor-catalogo` — reemplaza el `alert()` de la AO3.
   - Actualizar `#contador-catalogo` con la cantidad.
4. `manejarClickCatalogo(e)`: delegación con `e.target.closest("[data-accion]")` para acciones como `ver-detalle` (abre `#modalDetalleServicio`) o `agregar` (muestra `#toastConfirmacion`).
5. Render inicial en `configurarEventos()`: se muestra el catálogo completo (`texto = ""`, `categoria = "Todas"`).

#### Flujo 4: Gestionar invitados

| Elemento | Selector | Tipo | Evento(s) | Handler |
| --- | --- | --- | --- | --- |
| Formulario | `#form-invitado` | `<form novalidate>` | `submit` | `manejarSubmitInvitado(e)` |
| Nombre | `#nombre-invitado` | `input[type=text]` | `input`, `blur` | `validarCampoInvitado(e)` |
| Estado | `#estado-invitado` | `select` (`Confirmado`, `Pendiente`) | `change` | `validarCampoInvitado(e)` |
| Botón agregar | `#btn-agregar-invitado` | `button[type=submit]` | — (habilitado/deshabilitado) | `actualizarEstadoBoton(form, btn)` |
| Lista / tabla | `#lista-invitados` | `tbody` | `click` (**delegado**) | `manejarAccionInvitado(e)` |
| Métricas | `#metricas-invitados` | `dl` / `div[aria-live=polite]` | — | `renderMetricasInvitados(metricas)` |

**Secuencia de alta (`submit`):**
1. `e.preventDefault()`.
2. Leer `{ nombre, estado }`; llamar a `ListaInvitados.validar(datos)` (modelo). Si es inválido, feedback visual con `is-invalid` y foco en el primer error.
3. Si es válido: `listaInvitados.agregar(new Invitado(datos))` → `storage.guardarInvitados(listaInvitados.obtenerTodos())`.
4. `renderInvitados(listaInvitados.obtenerTodos())` y `renderMetricasInvitados(listaInvitados.contarAsistencia())`.
5. `form.reset()` + limpieza de clases + foco de vuelta en `#nombre-invitado` para carga rápida.

**Secuencia de acciones sobre filas (delegación):**
1. Un **único** listener `click` sobre `#lista-invitados` (no un listener por botón).
2. `const boton = e.target.closest("button[data-accion]"); if (!boton || !e.currentTarget.contains(boton)) return;`
3. `const id = boton.closest("tr").dataset.invitadoId;`
4. `switch (boton.dataset.accion)`:
   - `"confirmar"` → `listaInvitados.cambiarEstado(id, "Confirmado")`.
   - `"pendiente"` → `listaInvitados.cambiarEstado(id, "Pendiente")`.
   - `"eliminar"` → `listaInvitados.eliminar(id)` (sin `confirm()`; la confirmación, si se requiere, es un botón inline “¿Eliminar? Sí / No” en la propia fila).
5. Persistir con `storage.guardarInvitados(...)`, re-renderizar la fila afectada (o la lista completa) y actualizar `#metricas-invitados`.
6. Cada fila se genera con `data-invitado-id`, el nombre con `textContent`, un badge de estado (`badge text-bg-success` / `text-bg-warning`) y botones con `data-accion` y `aria-label` descriptivo (p. ej. `"Eliminar a Sofía Rodríguez"`).

---

### 3. Patrón homogéneo y arquitectura

#### 3.1 Punto de entrada único
```js
document.addEventListener("DOMContentLoaded", configurarEventos);

function configurarEventos() {
    const ui = obtenerReferenciasUI();   // cachea todos los nodos una sola vez
    if (!verificarReferencias(ui)) return; // si falta un nodo, se omite ese flujo sin romper los demás

    configurarFlujoEvento(ui);
    configurarFlujoPresupuesto(ui);
    configurarFlujoCatalogo(ui);
    configurarFlujoInvitados(ui);

    renderEstadoInicial(ui);             // catálogo completo, invitados y presupuesto desde storage
}
```
- No hay código ejecutable a nivel global salvo el registro de `DOMContentLoaded`.
- `obtenerReferenciasUI()` devuelve un objeto con todas las referencias (`ui.formEvento`, `ui.listaInvitados`, …), evitando `querySelector` repetidos dentro de los handlers.
- Cada `configurarFlujoX(ui)` solo registra listeners; los handlers son funciones con nombre (no anónimas) para facilitar lectura, depuración y eventual `removeEventListener`.

#### 3.2 `addEventListener` estandarizado
- **Siempre** `elemento.addEventListener(tipo, handler)`; prohibidos los atributos inline (`onclick=""`, `onsubmit=""`) y las propiedades `elemento.onclick = …`.
- Convención de nombres: `manejar<Accion><Contexto>` para handlers (`manejarSubmitEvento`), `render<Vista>` para funciones que escriben en el DOM, `validarCampo<Contexto>` para validación en vivo.
- Todo `submit` comienza con `e.preventDefault()`.
- Uso de `e.currentTarget` (el elemento que tiene el listener) y `e.target` (el que originó el evento) según corresponda; nunca `this`.

#### 3.3 Delegación de eventos para elementos dinámicos
- Los elementos que se crean o destruyen en tiempo de ejecución (filas de `#lista-invitados`, tarjetas de `#contenedor-catalogo`, filas de `#desglose-presupuesto`) **no** reciben listeners propios.
- Se registra un único listener en el contenedor estable y se resuelve el destino con `e.target.closest("[data-accion]")`.
- Las acciones se identifican con atributos `data-accion` y los registros con `data-*-id`; el controlador nunca depende del texto visible para decidir qué hacer.

#### 3.4 Validación en tiempo real con feedback visual
- Los formularios usan `novalidate` para que la validación nativa no muestre burbujas del navegador; la validación la decide el **modelo**.
- Eventos:
  - `input`: valida mientras se escribe, pero solo marca error si el campo ya fue “tocado” (`dataset.tocado = "true"` tras el primer `blur`), para no mostrar errores prematuros.
  - `blur`: marca el campo como tocado y valida.
  - `change`: para `select`, `date` y `checkbox`.
- Feedback (función única reutilizable `marcarCampo(input, mensajeError)`):
  - Válido → `classList.add("is-valid")`, `classList.remove("is-invalid")`, `aria-invalid="false"`.
  - Inválido → `classList.add("is-invalid")`, `classList.remove("is-valid")`, `aria-invalid="true"`, mensaje en el `.invalid-feedback` hermano (vinculado con `aria-describedby`).
- Deshabilitación condicional: `actualizarEstadoBoton(form, boton)` pone `boton.disabled = true` mientras exista algún campo requerido inválido o vacío según el modelo; se recalcula en cada `input` / `change` del formulario.

#### 3.5 Separación estricta presentación / negocio / persistencia

```
┌─────────────────────┐   valores crudos    ┌──────────────────────┐   objetos      ┌──────────────────────┐
│  index.html (vista) │ ──── eventos ─────▶ │ js/script.js         │ ─────────────▶ │ js/models/*.js       │
│  forms, contenedores│                     │ (controlador)        │                │ (reglas y cálculos)  │
│                     │ ◀── render DOM ──── │ lee, delega, pinta   │ ◀── resultado ─│                      │
└─────────────────────┘                     └──────────┬───────────┘                └──────────┬───────────┘
                                                       │ guardar / obtener                     │
                                                       ▼                                       │
                                            ┌──────────────────────┐                           │
                                            │ js/models/storage.js │ ◀─────────────────────────┘
                                            │ (localStorage + JSON)│
                                            └──────────────────────┘
```

| Capa | Puede | No puede |
| --- | --- | --- |
| `js/script.js` | Usar `document`, `addEventListener`, `classList`, `textContent`, `createElement`; llamar a modelos y a `storage` | Calcular, validar reglas, acceder a `localStorage`, usar `prompt` / `alert` / `confirm` |
| `js/models/*.js` | Validar, calcular, transformar, formatear | Acceder a `document` / `window` del DOM, usar `prompt` / `alert` / `console.log` de flujo |
| `js/models/storage.js` | `localStorage.getItem/setItem` con `JSON` y `try/catch` | Contener reglas de negocio |

- Renderizado seguro: los datos ingresados por el usuario se insertan siempre con `textContent` o `createElement`; `innerHTML` solo se admite con plantillas estáticas sin datos variables.
- Las funciones `render*` reciben datos ya calculados y formateados; no deciden reglas (por ejemplo, reciben `excedido: true`, no comparan montos).

---

### 4. Criterios de Aceptación

#### Eliminación de pop-ups
- [ ] `grep -nE "prompt\(|alert\(|confirm\(" js/` devuelve 0 coincidencias.
- [ ] Se eliminaron `iniciarMenuPrincipal()`, `iniciarMenuAlTerminarCarga()`, `quiereReintentar()` y `describirIngreso()`.
- [ ] Todo mensaje al usuario (éxito, error, sin resultados, presupuesto excedido) se muestra en el DOM o en `#toastConfirmacion`.

#### Flujo 1: Crear evento
- [ ] `#form-evento` dispara `submit` con `preventDefault()` y la página no se recarga.
- [ ] Datos inválidos marcan los campos con `is-invalid`, muestran el mensaje en `.invalid-feedback` y enfocan el primer error.
- [ ] Datos válidos crean un `Evento` (modelo), se persisten vía `storage` y se renderiza la confirmación en `#confirmacion-evento`.
- [ ] Tras guardar, el formulario se resetea y el presupuesto estimado del Flujo 2 se actualiza.

#### Flujo 2: Calcular presupuesto
- [ ] Cambios en cantidades, ítems o descuento recalculan el total en vivo sin recargar.
- [ ] El total proviene exclusivamente de `calcularPresupuestoTotal()` del modelo.
- [ ] `#desglose-presupuesto` muestra una fila por ítem con su subtotal y se muestran subtotal, descuento y total formateados.
- [ ] `#alerta-presupuesto` refleja correctamente presupuesto excedido / disponible.
- [ ] Un descuento fuera de 0–100 marca el campo como inválido y deshabilita `#btn-calcular-presupuesto`.

#### Flujo 3: Buscar en catálogo
- [ ] Escribir en `#buscar-catalogo` filtra las tarjetas en tiempo real (evento `input`).
- [ ] Cambiar `#categoria-catalogo` filtra por categoría y se combina con el texto.
- [ ] `#contenedor-catalogo` se re-renderiza dinámicamente y muestra un estado vacío si no hay coincidencias.
- [ ] La búsqueda es insensible a mayúsculas y tildes (resuelto en el modelo).

#### Flujo 4: Gestionar invitados
- [ ] `#form-invitado` agrega un invitado, lo persiste y lo renderiza en `#lista-invitados` sin recargar.
- [ ] Los botones confirmar / pendiente / eliminar de cada fila funcionan, incluso en filas agregadas después de la carga.
- [ ] Las métricas de confirmados y pendientes se actualizan tras cada alta, cambio o baja.
- [ ] Al recargar la página, los invitados persistidos se restauran desde `storage`.

#### Validación en tiempo real
- [ ] Los campos se validan en `input` / `blur` / `change` y alternan `is-valid` / `is-invalid`.
- [ ] No se muestran errores en campos aún no tocados.
- [ ] Los botones de envío se deshabilitan mientras el formulario sea inválido.
- [ ] Los campos inválidos exponen `aria-invalid="true"` y su mensaje mediante `aria-describedby`.

#### Manipulación dinámica del DOM
- [ ] Tarjetas, filas y desgloses se crean con `createElement` / `<template>` y `textContent`.
- [ ] No se usa `innerHTML` con datos ingresados por el usuario.
- [ ] Los contenedores se vacían con `replaceChildren()` antes de re-renderizar.

#### Delegación de eventos
- [ ] `#lista-invitados` y `#contenedor-catalogo` tienen un único listener `click` cada uno.
- [ ] Las acciones se resuelven con `e.target.closest("[data-accion]")` y atributos `data-*`.
- [ ] No existen atributos `on*` inline en `index.html` ni asignaciones `elemento.onX =`.

#### Patrón y desacoplamiento de reglas de negocio
- [ ] `js/script.js` solo contiene `document.addEventListener("DOMContentLoaded", configurarEventos)` a nivel global.
- [ ] `js/script.js` no contiene operaciones aritméticas sobre datos de negocio, reglas de validación ni accesos a `localStorage`.
- [ ] Toda la lógica de negocio vive en `js/models/` y los tests Jasmine existentes siguen pasando contra los modelos.
- [ ] Los IDs de `index.html` coinciden con el contrato de la sección 1.5.

#### Documentación
- [ ] Me comprometo a completar la sección **AL CERRAR** de esta spec al finalizar la implementación, registrando: cambios realizados, desvíos respecto de este plan, evidencia de verificación (capturas, resultado del `grep` de pop-ups y de los tests) y enlace a la PR hacia `develop`.
