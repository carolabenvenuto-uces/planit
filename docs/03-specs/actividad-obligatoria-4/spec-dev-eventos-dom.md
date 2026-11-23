# Especificación Técnica (Spec) - Desarrollador JS Eventos + DOM

- **Proyecto:** PlanIT - Plataforma All-in-One de Organización & Experiencias
- **Materia:** Programación Web I (UCES)
- **Entrega:** Actividad Obligatoria N° 4
- **Rol:** Desarrollador JS Eventos + DOM
- **Responsable:** Valeria Silva (@ValeriaMSilva)
- **Rama:** `feature/dev-eventos-dom`
- **Issue principal:** [#103](https://github.com/carolabenvenuto-uces/planit/issues/103)
- **Pull Request:** [#104](https://github.com/carolabenvenuto-uces/planit/pull/104) hacia `develop`
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

---

## AL CERRAR LA IMPLEMENTACIÓN

### 1. Prompt utilizado en modo Agente

**Contexto adjuntado al agente:**
- `docs/03-specs/actividad-obligatoria-4/spec-dev-eventos-dom.md` (sección *ANTES DE LA IMPLEMENTACIÓN*).
- Las clases del dominio de `js/models/` (`Validador.js`, `ItemContratado.js`, `Presupuesto.js`, `Invitado.js`, `ListaInvitados.js`, `Evento.js`, `Proveedor.js`, `CatalogoProveedores.js`), tomadas de la rama `feature/dev-poo-logica-negocio` (PR #102).
- `index.html` y el `js/script.js` de la AO3 como punto de partida del refactor.

```text
Escribe el código completo de js/script.js y los ajustes necesarios para index.html para la aplicación PlanIT (Actividad Obligatoria N°4 - Programación Web I). Rol: Desarrollador JS Eventos + DOM. Restricciones estrictas: 1. Cero uso de prompt() y alert(). 2. Cero lógica de negocio o cálculos matemáticos en script.js. Script.js es estrictamente un controlador/orquestador. 3. Asume que existen las clases del dominio en js/models/ (Evento, Invitado, etc.) y las utilidades en js/utils/storage.js. 4. Código limpio, modular, con comentarios explicativos y manejo de errores. Requerimientos técnicos a implementar en js/script.js: - Escucha centralizada de DOMContentLoaded. - Función orquestadora configurarEventos(). - Implementación de los 4 flujos: 1. Crear evento: submit con preventDefault(), validación de campos, instanciación del modelo, guardado en storage y renderizado de feedback visual. 2. Calcular presupuesto: captura de entradas, llamada al método de cálculo de la clase correspondiente y renderizado del desglose en el DOM. 3. Buscar en catálogo: filtrado en tiempo real con evento 'input' y actualización reactiva de las tarjetas en el DOM. 4. Gestionar invitados: alta mediante formulario, renderizado dinámico de la lista/tabla y delegación de eventos para botones de eliminación/confirmación de asistencia. - Validación en tiempo real (eventos 'input'/'blur') agregando/removiendo clases 'is-valid' / 'is-invalid' y mensajes de error. - Delegación de eventos para elementos dinámicos. Entrega el código de js/script.js y luego el fragmento de index.html con los IDs y clases correspondientes.
```

### 2. Fragmento representativo del código generado

Alta de invitados (Flujo 4). El listener `submit` valida con el modelo, actualiza el modelo, persiste y vuelve a renderizar la tabla. Se registra en `configurarFlujoInvitados()` junto con el listener delegado de la tabla:

```js
// configurarFlujoInvitados(ui)
registrarValidacionEnVivo(campos, () => validarFormularioInvitado(ui));
ui.formInvitado.addEventListener("submit", (evento) => manejarSubmitInvitado(evento, ui));
// Delegación: un único listener atiende los botones de todas las filas,
// incluidas las que se agregan después de la carga.
ui.listaInvitados.addEventListener("click", (evento) => manejarAccionInvitado(evento, ui));

/** Alta de invitado: valida, agrega al modelo, persiste y re-renderiza. */
function manejarSubmitInvitado(evento, ui) {
    evento.preventDefault();

    const errores = validarFormularioInvitado(ui, true);
    if (hayErrores(errores)) {
        const primerCampoInvalido = [ui.nombreInvitado, ui.estadoInvitado].find((campo) => campo && errores[campo.id]);
        if (primerCampoInvalido) primerCampoInvalido.focus();
        return;
    }

    const datos = leerDatosInvitado(ui);
    let invitado;
    try {
        invitado = estadoApp.evento.invitados.agregar(datos.nombre, datos.estado);
    } catch (error) {
        renderMensaje(ui.feedbackInvitados, "error", error.message);
        return;
    }

    persistirEvento(ui);
    renderInvitados(ui);
    renderMensaje(ui.feedbackInvitados, "exito", "Se agregó a " + invitado.nombre + " como " + invitado.estado + ".");

    ui.formInvitado.reset();
    [ui.nombreInvitado, ui.estadoInvitado].filter(Boolean).forEach(limpiarCampo);
    validarFormularioInvitado(ui);
    ui.nombreInvitado.focus();
}
```

`validarFormularioInvitado()` obtiene los errores de `Invitado.validar(nombre, estado)`, alterna `is-valid` / `is-invalid` en los campos tocados y deshabilita `#btn-agregar-invitado` mientras haya errores. `renderInvitados()` arma las filas con `createElement` y `textContent` dentro de un `DocumentFragment` y las vuelca en `#lista-invitados` con `replaceChildren()`.

### 3. Ajustes manuales y justificación técnica

La sección *ANTES* se escribió sin conocer la API final de las clases de POO. Al integrar el código con las clases reales del PR #102 se hicieron estos ajustes:

| # | Planificado en *ANTES* | Implementado | Justificación |
| --- | --- | --- | --- |
| 1 | `presupuesto.calcularPresupuestoTotal({ items, descuento, presupuestoEstimado })`, que devuelve un objeto de desglose | `item.calcularSubtotal()`, `presupuesto.calcularTotal()`, `presupuesto.aplicarDescuento(descuento)` y `evento.superaPresupuesto(descuento)` | `calcularPresupuestoTotal()` no existe en `Presupuesto`. Con los métodos reales, todos los montos y la comparación con el límite siguen en el modelo; el controlador solo arma el objeto `resultado` para renderizarlo. Los ítems de la tabla reemplazan a los del `Presupuesto` del evento mediante `eliminarItem()` / `agregarItem()`. Una cantidad inválida se detecta por el `Error` que lanza el constructor de `ItemContratado`. |
| 2 | Tabla de invitados con email y mesa, y el estado "Declinado" del mockup | Columnas **Nombre / Estado / Acciones**; solo los estados `Confirmado` y `Pendiente` | `Invitado` solo tiene `nombre` y `estado`, e `Invitado.ESTADOS` es `["Confirmado", "Pendiente"]`. Un invitado nuevo no tendría email ni mesa, y "Declinado" haría fallar la carga. Se quitó a Camila Herrera (Declinado) de los datos de ejemplo. El cambio de estado usa `Invitado.cambiarEstado()` y la baja usa `ListaInvitados.eliminar(nombre)`. |
| 3 | `select#tipo-evento` con los valores `cumpleanos`, `boda`, `salida-casual` y `corporativo` | `value` = `cumpleaños`, `boda` y `salida casual`; se quitó **Corporativo** | `Evento.TIPOS` es `["cumpleaños", "boda", "salida casual"]`. `Validador.buscarOpcion()` no considera iguales `salida-casual` y `salida casual`, y `corporativo` no existe en el modelo, así que esas dos opciones nunca pasarían la validación. |
| 4 | Volver a crear las tarjetas de `#contenedor-catalogo` con `createElement` y delegar el `click` | Cada tarjeta del HTML se convierte en un `Proveedor` (a partir de sus `data-*`) y se muestra u oculta con el atributo `hidden` | Volver a crear las tarjetas haría perder los listeners de `.btn-sumar-evento` que registra `js/componentes-bootstrap.js` y los disparadores `data-bs-toggle="modal"`, y obligaría a descargar de nuevo las imágenes. Al ocultarlas, el modal `#modalDetalleServicio` y el toast `#toastConfirmacion` siguen funcionando. El filtrado lo resuelven `CatalogoProveedores.buscar()` y `Proveedor.coincideCon()`. Con el texto vacío se usa `catalogo.proveedores`, porque `buscar()` lanza un error si el criterio está vacío. Se agregaron el contador `#contador-catalogo` y el mensaje sin resultados `#catalogo-vacio`. |
| 5 | — | Guarda defensiva `obtenerModelosFaltantes()` en `configurarEventos()` | Las clases todavía no están en `develop`. Si falta alguna, se muestra un aviso en `#aviso-app` y no se registran los flujos, en lugar de fallar con un `ReferenceError`. Se comprueba con `typeof` porque las clases declaradas en scripts clásicos no se agregan a `window`. |
| 6 | Persistencia en `js/models/storage.js` | Contrato asumido para **`js/utils/storage.js`**: un objeto global `Almacenamiento` con `guardar(clave, valor)` y `cargar(clave)` (devuelve `null` si no hay dato) | El archivo todavía no existe. Si `Almacenamiento` no está cargado, la app funciona en memoria y lo avisa en `#aviso-app`. Los errores de lectura y escritura se capturan con `try/catch`. Claves: `planit:evento` (`Evento.toJSON()`, que incluye presupuesto e invitados) y `planit:detalles-evento`. |
| 7 | — | La adaptación de `js/test/script.spec.js` le corresponde al rol **Tester QA** | La suite prueba funciones de la AO3 que ya no están en `script.js` (`validarDatosEvento`, `calcularTotalItems`, etc.). Los tests tienen que pasar a probar las clases de `js/models/`. |

**Otros ajustes respecto del plan:**
- **Errores por campo:** `Evento.validarDatos()` e `Invitado.validar()` devuelven una lista de mensajes sin indicar a qué campo corresponde cada uno. El controlador los asigna según el comienzo del mensaje (`"El nombre"`, `"El tipo"`, `"El presupuesto"`, `"El estado"`). Si cambia el texto del mensaje, la asignación se rompe. Se propone que el rol POO devuelva los errores agrupados por campo.
- **Fecha y ubicación:** `Evento` no tiene estas propiedades. Se validan como obligatorias con `Validador.esTextoNoVacio()` y se guardan aparte en `planit:detalles-evento`.
- **Formulario `#form-evento`:** no se vacía al guardar, porque es el formulario de edición del evento actual y tiene que seguir mostrando sus datos. Al guardar se conservan el presupuesto y los invitados con `Evento.fromJSON({ ...anterior.toJSON(), nombre, tipo, presupuestoEstimado })`. *(Reemplazado en RC22 por `Evento.actualizarDatos()`; ver sección 6.)*
- **Confirmación del Flujo 1:** se muestra dentro de la página, en `#confirmacion-evento`, y no en el toast.
- **Eliminar invitado:** no pide confirmación (no se usa `confirm()`); el resultado se informa en `#feedback-invitados`.
- **Resumen Financiero (barra lateral):** queda estático. Mostrar el saldo requiere una resta, que por la Regla 1 tiene que hacerse en el modelo. Se propone un método como `Presupuesto.calcularSaldo(limite)`.
- **CSS:** en `css/components.css` se agregaron los bordes de `is-valid` / `is-invalid` para los campos de `.form-group` (Bootstrap solo estiliza `.form-control`) y el ancho de los inputs de cantidad.

### 4. Verificación

Se abrió `index.html` en Chrome headless con los modelos del PR #102 y un `storage.js` provisorio sobre `localStorage` que cumple el contrato del ajuste 6:

| Prueba | Resultado |
| --- | --- |
| Carga inicial | 5 invitados (3 confirmados y 2 pendientes); total de $580.000, dentro del presupuesto de $700.000; 3 proveedores |
| Búsqueda "flores" / búsqueda "zzz" / categoría Sonido | 1 tarjeta / mensaje "Sin coincidencias para “zzz”." / 1 tarjeta |
| Descuento de 10 % / de 150 % | Total de $522.000 / campo inválido con el mensaje del modelo y botón deshabilitado |
| Cantidad de catering -1 / 200 | Campo inválido y total "—" / subtotal de $700.000, total de $860.000 y alerta de presupuesto superado |
| Nombre de evento vacío + submit | `is-invalid`, mensaje del modelo, botón deshabilitado y foco en `#nombre-evento` |
| Evento válido con presupuesto de $1.000.000 | Confirmación y alerta recalculada con el nuevo límite |
| Alta de un invitado con `<b>` en el nombre | Se muestra como texto (0 etiquetas `<b>` en el DOM) |
| Confirmar / eliminar desde la tabla | Métricas actualizadas y foco devuelto a la fila |
| Recarga de la página | Se restauran el nombre, el tipo, el presupuesto, las cantidades y los invitados |
| `grep -nE "prompt\(\|alert\(\|confirm\(" js/script.js` | 0 coincidencias |

### 5. Criterios de Aceptación (cierre)

#### Eliminación de pop-ups
- [x] `js/script.js` no contiene `prompt()`, `alert()` ni `confirm()`.
- [x] Se eliminaron `iniciarMenuPrincipal()`, `iniciarMenuAlTerminarCarga()`, `quiereReintentar()` y `describirIngreso()`.
- [x] Todos los mensajes al usuario se muestran en el DOM (`#aviso-app`, `#confirmacion-evento`, `#alerta-presupuesto`, `#catalogo-vacio`, `#feedback-invitados`).

#### Flujo 1: Crear evento
- [x] `#form-evento` usa `submit` con `preventDefault()` y la página no se recarga.
- [x] Los campos con datos inválidos se marcan con `is-invalid`, muestran el mensaje en `.invalid-feedback` y el foco va al primer error.
- [x] Con datos válidos se crea un `Evento`, se persiste con `Almacenamiento` y se confirma en `#confirmacion-evento`.
- [x] El Flujo 2 usa el nuevo presupuesto estimado.

#### Flujo 2: Calcular presupuesto
- [x] Los cambios de cantidad y de descuento recalculan en vivo mediante un listener `input` delegado en `#form-presupuesto`.
- [x] Todos los montos salen de `ItemContratado` y `Presupuesto`, y el exceso sale de `Evento.superaPresupuesto()`.
- [x] Se muestran el subtotal de cada fila, el subtotal general y el total con descuento.
- [x] `#alerta-presupuesto` indica si se supera o no el presupuesto estimado.
- [x] Un descuento fuera de 0–100 o una cantidad inválida marcan el campo y deshabilitan `#btn-calcular-presupuesto`.

#### Flujo 3: Buscar en catálogo
- [x] `#buscar-catalogo` filtra en tiempo real con el evento `input`.
- [x] `#categoria-catalogo` filtra por categoría y se combina con el texto.
- [x] Las tarjetas se muestran u ocultan, se actualiza `#contador-catalogo` y, si no hay coincidencias, aparece `#catalogo-vacio`.
- [x] La búsqueda no distingue mayúsculas ni tildes (lo resuelve `Validador.normalizarTexto()`).

#### Flujo 4: Gestionar invitados
- [x] `#form-invitado` agrega un invitado, lo persiste y lo muestra en `#lista-invitados` sin recargar.
- [x] Los botones Confirmar, Marcar pendiente y Eliminar funcionan también en las filas agregadas después de la carga.
- [x] Las métricas de `ListaInvitados.contarAsistencia()` se actualizan después de cada cambio.
- [x] Al recargar, los invitados se restauran desde el almacenamiento.

#### Validación en tiempo real
- [x] Los campos se validan en `input` / `change` / `blur` y alternan `is-valid` / `is-invalid`.
- [x] Los campos no tocados no muestran errores.
- [x] Los botones de envío se deshabilitan mientras haya errores.
- [x] Los campos inválidos tienen `aria-invalid="true"` y su mensaje está vinculado con `aria-describedby`.

#### Manipulación dinámica del DOM
- [x] Las filas de invitados y los mensajes se crean con `createElement` y `textContent`.
- [x] No se usa `innerHTML`.
- [x] `#lista-invitados` se vacía y se reconstruye con `replaceChildren()` y un `DocumentFragment`.

#### Delegación de eventos
- [x] `#lista-invitados` tiene un único listener `click`, que identifica la acción con `closest("button[data-accion]")`.
- [x] `#form-presupuesto` tiene un único listener `input` para todas las cantidades y el descuento.
- [x] No hay atributos `on*` inline ni asignaciones `elemento.onX =`.

#### Patrón y desacoplamiento de reglas de negocio
- [x] A nivel global solo se ejecuta `document.addEventListener("DOMContentLoaded", configurarEventos)`; el resto son declaraciones de constantes y funciones.
- [x] `js/script.js` no tiene reglas de validación propias, cálculos de montos ni accesos directos a `localStorage`.
- [x] `configurarEventos()` avisa en la interfaz si faltan las clases del dominio o el almacenamiento.
- [x] Los IDs de `index.html` coinciden con los que usa `js/script.js`.
- [x] **RC22:** `js/script.js` no conoce `Almacenamiento`, ni las claves de storage, ni el ciclo `toJSON()` / `fromJSON()`. Toda la persistencia pasa por la fachada `ServicioPersistenciaEvento` (ver sección 6).

#### Documentación
- [x] Esta sección AL CERRAR registra el prompt, el fragmento de código, los ajustes y la verificación.

#### Pendientes de otros roles (bloquean la integración en `develop`)
- [x] Mergear el PR #102 (`js/models/`) en `develop` (integrado en esta rama con el merge `c3fa07e`).
- [ ] Crear `js/utils/storage.js` con el contrato `Almacenamiento.guardar` / `Almacenamiento.cargar`.
- [ ] Adaptar `js/test/script.spec.js` y `js/test/test-runner.html` a las clases de `js/models/` (rol Tester QA).
- [ ] Agregar al modelo un método para el saldo disponible y conectar el Resumen Financiero.

### 6. Corrección RC22: desacoplamiento controlador–persistencia (Facade / Service Layer)

**Observación del docente:** *"RC22 — El controlador conoce directamente Almacenamiento y sus operaciones. Retirar claves, cargar/guardar y serialización/hidratación del controlador; usar una fachada o servicio de dominio."*

**Problema.** `js/script.js` tenía cuatro responsabilidades de persistencia que no le corresponden a un controlador:

| Acoplamiento previo en `js/script.js` | Dónde estaba |
| --- | --- |
| Claves de storage (`CLAVES_STORAGE = { evento: "planit:evento", detallesEvento: "planit:detalles-evento" }`) | Sección 1 |
| Llamadas directas al módulo de bajo nivel (`Almacenamiento.guardar`, `Almacenamiento.cargar`) y su chequeo de disponibilidad | `almacenamientoDisponible()`, `leerDelAlmacenamiento()`, `escribirEnAlmacenamiento()` |
| Serialización manual (`estadoApp.evento.toJSON()`) | `persistirEvento()` |
| Hidratación manual (`Evento.fromJSON(guardado)` y `Evento.fromJSON({ ...evento.toJSON(), nombre, tipo, presupuestoEstimado })`) | `cargarEventoInicial()`, `manejarSubmitEvento()` |

**Solución.** Se incorporó una capa de servicio entre el controlador y el adaptador de storage:

```
index.html ──eventos──▶ js/script.js ──instancias del dominio──▶ js/services/ServicioPersistenciaEvento.js ──datos planos──▶ js/utils/storage.js ──▶ localStorage
 (vista)                (controlador)   guardar / cargar /          (fachada: claves + toJSON/fromJSON)          guardar / cargar /     (Almacenamiento)
                                        estaDisponible / limpiar                                              eliminar
```

- **`js/services/ServicioPersistenciaEvento.js`** (nuevo) es el **único** componente que:
  - conoce el objeto global `Almacenamiento` (se recibe por constructor, por defecto el global; en los tests se inyecta un doble en memoria);
  - conoce las claves `planit:evento` y `planit:detalles-evento` (campo estático privado `#CLAVES`, no accesible desde afuera);
  - serializa (`evento.toJSON()`) e hidrata (`Evento.fromJSON()`), y normaliza los detalles de agenda.
- **Interfaz declarativa** que consume el controlador:

  | Método | Devuelve | Comportamiento |
  | --- | --- | --- |
  | `estaDisponible()` | `boolean` | `true` si el adaptador cumple el contrato `guardar` / `cargar` / `eliminar`. |
  | `guardar(evento, [detalles])` | `boolean` | Persiste el `Evento` (con presupuesto e invitados) y, si se indican, `{ fecha, ubicacion }`. Rechaza con `TypeError` lo que no sea un `Evento`. |
  | `guardarEvento(evento)` / `guardarDetalles(detalles)` | `boolean` | Variantes granulares de `guardar()`. |
  | `cargar([crearSemilla])` | `{ evento, detalles, origen, datosDanados }` | Devuelve instancias ya hidratadas. Si no hay evento guardado o está dañado, usa la fábrica `crearSemilla` (los datos de ejemplo del marcado) y lo informa con `origen: "semilla"` / `datosDanados: true`. |
  | `limpiar()` | `boolean` | Borra todo el estado persistido por la fachada. |

  Ninguna operación lanza por fallas del storage: las escrituras devuelven `false` y las lecturas se comportan como "no hay estado guardado", así la app sigue funcionando en memoria.
- **`Evento.actualizarDatos(nombre, tipo, presupuestoEstimado)`** (nuevo método del modelo): reemplaza el `Evento.fromJSON({ ...evento.toJSON(), ... })` que hacía el submit del Flujo 1. Valida todo antes de modificar (si algo es inválido, lanza y el evento queda intacto) y conserva presupuesto e invitados. Así, "actualizar los datos del evento" es una operación de dominio y no un truco de serialización en el controlador.
- **`js/script.js`** quedó así:
  - `configurarEventos()` crea `estadoApp.persistencia = new ServicioPersistenciaEvento()` y usa `estaDisponible()` para el aviso de "funciona en memoria".
  - `cargarEstadoInicial(ui)` llama a `persistencia.cargar(() => crearEventoDesdeMarcado(ui))` y solo decide qué aviso mostrar.
  - `persistirEvento(ui, [detalles])` llama a `persistencia.guardar(estadoApp.evento, detalles)` y solo informa el resultado en `#aviso-app`.
  - `sincronizarFormularioEvento(ui, detalles)` recibe los detalles ya recuperados en lugar de leer el storage.
  - Se eliminaron `CLAVES_STORAGE`, `almacenamientoDisponible()`, `leerDelAlmacenamiento()`, `escribirEnAlmacenamiento()` y `cargarEventoInicial()`.
  - `obtenerModelosFaltantes()` incluye `ServicioPersistenciaEvento` entre las dependencias obligatorias.
- **Orden de carga** en `index.html` y `js/test/test-runner.html`: `js/models/*.js` → `js/utils/storage.js` → `js/services/ServicioPersistenciaEvento.js` → `js/script.js`.
- **Fuera de alcance:** `CatalogoProveedores` no se persiste. El catálogo se arma desde las tarjetas estáticas del marcado en cada carga y el usuario no lo modifica. Si en el futuro se persiste, la fachada es el lugar para agregar `guardarCatalogo()` / `CatalogoProveedores.fromJSON()` sin tocar el controlador.
- **Las claves y el formato JSON no cambian**, así que el estado que los usuarios ya tienen guardado se sigue leyendo sin migración.

**Tests (`js/test/`).**

| Archivo | Cambio |
| --- | --- |
| `servicio-persistencia.spec.js` (nuevo, 17 specs) | Prueba la fachada aislada con un doble en memoria de `Almacenamiento`: disponibilidad, ciclo `toJSON`/`fromJSON` con presupuesto e invitados, detalles de agenda, rechazo de algo que no es un `Evento`, fallas y excepciones del storage, semilla (uso, no uso, datos dañados, error propagado), detalles inválidos y `limpiar()`. |
| `script.spec.js` | Los specs que leían `Almacenamiento.cargar(CLAVES_STORAGE.evento)` o espiaban `Almacenamiento.guardar` ahora usan `estadoApp.persistencia` (la misma fachada que usa el controlador). Se agregaron 2 specs: el submit delega en `persistencia.guardar(evento, { fecha, ubicacion })` y la actualización conserva presupuesto e invitados. |
| `models.spec.js` | 2 specs nuevos para `Evento.actualizarDatos()` (actualización que conserva componentes; error sin modificar el evento). |
| `storage.spec.js` | Sin cambios: sigue probando el adaptador de bajo nivel `Almacenamiento`. |

**Verificación.**

| Prueba | Resultado |
| --- | --- |
| `js/test/test-runner.html` en Chrome headless, 3 corridas con semillas aleatorias distintas | **132 specs, 0 failures** en las 3 (antes de RC22: 111 specs) |
| `index.html` en Chrome headless | Sin aviso en `#aviso-app`; total de $580.000 y 5 invitados renderizados, igual que antes del cambio |
| `grep -nE "Almacenamiento\|CLAVES_STORAGE\|toJSON\(\|fromJSON\(" js/script.js` | 0 coincidencias |
