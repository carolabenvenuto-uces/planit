# Documentación de Testing - Suite Jasmine (Actividad Obligatoria N° 4)

> Reemplaza íntegramente a la versión de la AO3: con el controlador de eventos/DOM (PR #104), las clases de dominio (PR #102) y la capa de persistencia (PR #108) ya integradas en `develop`, la suite de testing se reorganiza en 3 archivos. El contenido anterior (specs de las funciones `flujo*()`/`prompt()`/`alert()` de la AO3) queda disponible en el historial de git; las funciones que testeaba ya no existen en `js/script.js`.

## Índice
1. [Qué cambió respecto de la AO3](#qué-cambió-respecto-de-la-ao3)
2. [Ejecución de Tests](#ejecución-de-tests)
3. [Suites de Tests](#suites-de-tests)
4. [Métricas de Cobertura](#métricas-de-cobertura)
5. [Alcance y Limitaciones](#alcance-y-limitaciones)
6. [Issues Conocidos](#issues-conocidos)

---

## Qué cambió respecto de la AO3

La AO3 testeaba funciones puras globales (`validarDatosEvento`, `calcularTotalItems`, `buscarEnCatalogo`, etc.) y los flujos de menú basados en `prompt()`/`alert()` (`flujoCrearEvento()`, `iniciarMenuPrincipal()`, etc.). La AO4 reemplaza esa arquitectura por completo:

- La lógica de negocio migra a 8 clases en `js/models/` (PR #102): `Validador`, `ItemContratado`, `Presupuesto`, `Invitado`, `ListaInvitados`, `Evento`, `Proveedor`, `CatalogoProveedores`.
- `js/script.js` deja de tener lógica de negocio propia: pasa a ser un controlador de UI y eventos que delega en los modelos y manipula el DOM (PR #104). Ya no existen `prompt()`/`alert()` ni las funciones `flujo*()`.
- La persistencia se delega en `js/utils/storage.js` (PR #108).

Como consecuencia, la suite se divide en 3 archivos con responsabilidades distintas, en vez de un único `script.spec.js` con todo:

| Archivo | Qué cubre | Cómo lo prueba |
|---|---|---|
| `js/test/models.spec.js` | Las 8 clases de dominio: constructores, validaciones, métodos de negocio, `toJSON()`/`fromJSON()`. | Tests unitarios puros, sin DOM: se instancian las clases directamente. |
| `js/test/storage.spec.js` | El CRUD de `Almacenamiento` (`js/utils/storage.js`). | Tests unitarios contra `localStorage`/`sessionStorage` reales del navegador (Chromium headless vía Playwright), con limpieza de claves de prueba en `afterEach`. |
| `js/test/script.spec.js` | El controlador: los 4 flujos de UI (crear evento, calcular presupuesto, buscar en catálogo, gestionar invitados) contra un fixture de DOM. | Tests de integración: se simulan interacciones reales (cambiar inputs, clicks) sobre un fragmento de HTML con los mismos `id`/`data-*` que `index.html`, y se verifica el DOM resultante. |

---

## Ejecución de Tests

### Pasos para Ejecutar
1. Abrir `js/test/test-runner.html` en el navegador (doble clic o arrastrándolo). Si el navegador bloquea archivos locales, levantar un servidor desde la raíz del repositorio con `npx http-server -p 8080` y abrir `http://localhost:8080/js/test/test-runner.html`.
2. El runner carga, en orden: el bundle de Bootstrap 5.3.3 (misma URL e integridad que `index.html`, necesario para los specs de integración RC14/RC15), `js/models/*.js`, `js/utils/storage.js`, `js/script.js` (código a testear), y luego `models.spec.js`, `storage.spec.js`, `script.spec.js` (las 3 suites). `script.js` arranca automáticamente al cargar la página (`DOMContentLoaded`) contra el fixture de DOM embebido en el propio `test-runner.html`; cada test de `script.spec.js` restaura ese fixture a un estado conocido en su `beforeEach` (función `restaurarEstadoInicial()`), así el orden aleatorio de Jasmine no afecta el resultado.
3. Verificar resultados en la interfaz de Jasmine (verde = pasando, rojo = fallando).

### Ejecución reproducible por línea de comandos
```
node js/test/run-jasmine.js
```
Script ya commiteado desde la corrección de AO3 (RC13, PR #99): abre `test-runner.html` en Chromium headless con Playwright, espera el resumen de Jasmine y lo imprime. Termina con código de salida `1` si hay specs fallidos o si se registró algún `console.error`/`pageerror` durante la corrida (por eso los tests que ejercitan una ruta de error esperada de `Almacenamiento`, que loguea con `console.error` por diseño, usan `spyOn(console, "error")`).

### Capturas de pantalla (evidencia visual)
```
node js/test/take-screenshots.js
```
Genera 4 PNG en `js/test/screenshots/` (`ao4-general.png`, `ao4-models.png`, `ao4-storage.png`, `ao4-script.png`) abriendo `test-runner.html` con la librería `playwright` (la misma que usa `run-jasmine.js`) y recortando el elemento `.jasmine-suite` correspondiente a cada suite. **No se usó el servidor Playwright MCP** para generarlas (no estaba conectado en la sesión donde se escribió esta suite): el resultado visual es equivalente porque usa el mismo navegador Chromium y el mismo reporter HTML de Jasmine, pero queda documentada la salvedad porque la consigna pide puntualmente el MCP.

---

## Suites de Tests

### `models.spec.js` — Clases del dominio (PR #102)

Un `describe` por clase, con esta estructura repetida donde aplica: constructor con datos válidos, constructor con datos inválidos (`toThrowError`), métodos propios, y `fromJSON(toJSON())` reconstruye un objeto equivalente.

| Clase | Qué se prueba además del patrón general |
|---|---|
| `Validador` | `esTextoNoVacio`, `convertirANumero`, `normalizarTexto` (sin mayúsculas ni tildes), `buscarOpcion` (case/tilde-insensitive). |
| `ItemContratado` | `calcularSubtotal()`, validación de cantidad/precio no negativos. |
| `Presupuesto` | `agregarItem`/`eliminarItem`, `calcularTotal()`, `aplicarDescuento()` (0/10/100%, fuera de 0-100 lanza), `superaLimite()`, que `items` devuelva una copia. |
| `Invitado` | `esConfirmado()`, `cambiarEstado()` con estado válido/inválido. |
| `ListaInvitados` | `agregar` permite nombres duplicados (el modelo no fuerza unicidad — ver Suite 4 de `script.spec.js`), `eliminar` por nombre (primera coincidencia), `contarAsistencia()`. |
| `Evento` | Tipo normalizado, `validarDatos()` estático, `superaPresupuesto()` con y sin descuento, `fromJSON` reconstruye `presupuesto` e `invitados` anidados. |
| `Proveedor` | `coincideCon()` por nombre o categoría, case/tilde-insensitive. |
| `CatalogoProveedores` | `buscar()` por nombre o categoría, que no modifique el catálogo original. |

**71 specs.**

### `storage.spec.js` — Persistencia (PR #108)

| Grupo | Qué cubre |
|---|---|
| `guardar`/`cargar` | Ida y vuelta con valores simples y objetos; clave inexistente devuelve `null`; `guardar(clave, undefined)` devuelve `false` sin dejar la clave leíble; JSON corrupto en `cargar()` devuelve `null` sin lanzar; sobrescritura de un valor existente; **storage lleno** (`setItem` lanza `QuotaExceededError`) devuelve `false` sin lanzar (sugerido en la review de Carola a PR #110). |
| `obtener`/`actualizar` | Alias de `cargar`/`guardar`. |
| `eliminar` | Borra una clave existente; devuelve `true` aunque no exista; borra de **ambos** storages aunque la clave esté sembrada en los dos (regla agregada en la review de PR #108). |
| `listar` | Filtra por prefijo (con y sin el default `"planit:"`); vacío sin coincidencias. |
| `limpiar` | Borra todas las claves de un prefijo y lo refleja en el `boolean` devuelto; no afecta otros prefijos. |
| Integración con `js/models/` | Un `Evento` completo (con `Presupuesto` e invitados) sobrevive un ciclo `guardar(evento.toJSON())` → `Evento.fromJSON(cargar(...))`. |

**19 specs.**

### `script.spec.js` — Controlador de UI y eventos (PR #104)

Fixture de DOM en `test-runner.html`: subconjunto de `index.html` con los mismos `id`/`data-*` que lee `obtenerReferenciasUI()`, con los 3 proveedores y los 5 ítems de presupuesto reales del mockup. El Modal de detalle y el Toast de confirmación no están en el fixture base: los specs RC14/RC15 los montan en un sandbox propio (ver "Integración - Controlador y UI" más abajo).

| Flujo | Casos cubiertos |
|---|---|
| 1. Crear evento | Validación en vivo (nombre vacío deshabilita "Guardar"); guardado válido (confirmación + persistencia real en `Almacenamiento`); **regresión**: avisa al usuario cuando el guardado falla, en vez de reportar éxito igual (bug corregido en PR #104, ronda 1); guardado inválido (no persiste, muestra error); el presupuesto estimado nuevo recalcula en vivo la alerta del Flujo 2. |
| 2. Calcular presupuesto | Total sin descuento y alerta "dentro del presupuesto"; descuento del 10%; alerta de excedido; cantidad negativa bloquea el resultado y se recupera al corregirla; descuento fuera de 0-100 bloquea el resultado. |
| 3. Buscar en catálogo | Sin filtro (3 proveedores); filtro por texto; filtro por categoría (valor exacto de la opción); **regresión**: un proveedor cuyo nombre contiene el texto de otra categoría no aparece al filtrar por esa categoría (bug corregido en PR #104, ronda 3); combinación de texto + categoría; aviso de sin coincidencias. |
| 4. Gestionar invitados | Alta válida (feedback + métricas); botón deshabilitado con nombre vacío; métricas tras eliminar; **regresión**: dos invitados con el mismo nombre se distinguen por posición al eliminar, no se mezclan (bug corregido en PR #104, ronda 2); persistencia tras agregar. |

**21 specs.** Los tres casos marcados "regresión" reproducen exactamente los 3 bugs que se encontraron y corrigieron durante el code review de PR #104, ahora reportados y cerrados como issues de GitHub: [#111](https://github.com/carolabenvenuto-uces/planit/issues/111), [#112](https://github.com/carolabenvenuto-uces/planit/issues/112), [#113](https://github.com/carolabenvenuto-uces/planit/issues/113). Quedan en la suite para que una futura regresión los vuelva a detectar automáticamente.

#### Integración - Controlador y UI (RC14, RC15, RC16)

Bloque `describe("Integración - Controlador y UI (RC14, RC15, RC16)")` agregado para atender las observaciones docentes RC14 a RC16. Cada `it()` lleva su identificador al inicio del nombre (`INT-RC14-01`, etc.), que es el que se usa en la matriz y en el reporter de Jasmine.

| ID | Observación | Escenario | Disparo | Verificación |
|---|---|---|---|---|
| INT-RC14-01 | RC14 | Datos del servicio en el Modal | `show.bs.modal` con `relatedTarget` = "Ver detalle" de Flores Pilar | Título, descripción, capacidad, duración, incluye y precio iguales a los `data-service-*` del disparador; `src` y `alt` de la imagen (alt no vacío). |
| INT-RC14-02 | RC14 | Evento sin disparador | `show.bs.modal` sin `relatedTarget` | El Modal y el botón "Sumar al Evento" no se modifican. |
| INT-RC14-03 | RC14 | Accesibilidad y foco (Bootstrap real) | clic en "Ver detalle" (data-api de Bootstrap) → `shown.bs.modal` → `hide()` → `hidden.bs.modal` | `role="dialog"`, `aria-modal="true"`, sin `aria-hidden` mientras está abierto; `aria-labelledby` apunta al título con el servicio; foco dentro del Modal; al cerrar vuelve `aria-hidden="true"` y el foco regresa al disparador. |
| INT-RC14-04 | RC14 | Propagación al botón del Modal | dos `show.bs.modal` seguidos (Gourmet → Flores) | El `.btn-sumar-evento` del Modal tiene título y precio del último proveedor abierto, sin arrastrar datos del anterior. |
| INT-RC14-05 | RC14 | Propagación de punta a punta | abrir con Bootstrap real → clic en "Sumar al Evento" del Modal | El Toast muestra "Gourmet Finger Food · $3.500 / pax" y el Modal se cierra (`data-bs-dismiss`). |
| INT-RC15-01 | RC15 | Bootstrap presente, tarjetas | clic en cada uno de los 3 `.btn-sumar-evento` de las tarjetas | `bootstrap.Toast.getOrCreateInstance(#toastConfirmacion)` y `Toast.prototype.show` invocados (1, 2, 3 veces); texto del servicio y mensaje de éxito; clase `show`. |
| INT-RC15-02 | RC15 | Bootstrap presente, Modal | `show.bs.modal` (DJ Lucas) → clic en el `.btn-sumar-evento` del Modal | `Toast.show` invocado una vez con "DJ Lucas & Sonido · $8.000 / hora". |
| INT-RC15-03 | RC15 | Bootstrap ausente, tarjetas | `window.bootstrap = undefined` **antes** de montar los componentes → clic en cada botón | Sin errores en `window` ni `console.error`; Toast con clase `show`, texto correcto y `role="status"`/`aria-live="polite"`; se oculta al vencer `data-bs-delay` (4000 ms, con `jasmine.clock()`). |
| INT-RC15-04 | RC15 | Bootstrap ausente, Modal | `show.bs.modal` (Flores Pilar) → clic en el botón del Modal | Sin errores; Toast degradado con "Flores Pilar · $70.000 / base". |
| INT-RC15-05 | RC15 | Bootstrap ausente, clics seguidos | clic → 3000 ms → otro clic → 3000 ms → 1000 ms | El segundo clic reinicia el temporizador: sigue visible a los 6000 ms y se oculta recién a los 7000 ms. |
| INT-RC16-01 | RC16 | Ciclo de vida completo | ver detalle abajo | El DOM reconstruido refleja lo persistido (ver detalle abajo). |
| INT-RC16-02 | RC16 | Control: carga nueva sin datos | storage vacío → reinicio → `DOMContentLoaded` | Se muestran los datos del marcado (3 invitados, total $580.000): confirma que lo que restaura INT-RC16-01 sale del storage y no del fixture. |
| INT-RC16-03 | RC16 | Carga nueva con datos inválidos | `planit:evento` con un tipo inexistente → reinicio → `DOMContentLoaded` | Sin errores; aviso "datos dañados" visible y la app cae en los datos de ejemplo. |

**Ciclo de vida de INT-RC16-01** (los 5 pasos pedidos por RC16):

1. **Modificar desde la UI:** alta de "Lucía Fernández" como Confirmado por el formulario, cantidad de Catering a 150 (evento `input`) y ubicación nueva guardada con "Guardar Cambios".
2. **Verificar lo grabado:** se lee `localStorage` en crudo con `JSON.parse(localStorage.getItem(...))`, sin pasar por `Almacenamiento`, para no validar el módulo con sí mismo: cantidad 150 en el ítem Catering, la invitada en `invitados.invitados` y la ubicación en `planit:detalles-evento`.
3. **Reiniciar memoria y DOM:** `reiniciarMemoriaYDOM()` pone `estadoApp.evento`/`catalogo` en `null`, vacía `tarjetasCatalogo` y reemplaza los 11 nodos del fixture por nodos nuevos parseados desde su `outerHTML` original, capturado cuando se carga `script.spec.js` (antes de `DOMContentLoaded`). Antes de seguir se comprueba que no queda rastro: cantidad 120, sin la fila de Lucía, ubicación original y total vacío.
4. **Arranque:** `document.dispatchEvent(new Event("DOMContentLoaded"))`, el mismo disparador que usa `index.html` (no se llama a funciones internas a mano).
5. **Verificar la reconstrucción:** instancia de `Evento` nueva (no la anterior); input de Catering en 150, subtotal "$525.000", subtotal general y total "$685.000", alerta "dentro del presupuesto"; fila de Lucía con badge "Confirmado" (`badge-confirmado`) y acción "Marcar pendiente"; métricas "Confirmados: 3"/"Pendientes: 1"; ubicación restaurada.

**Por qué hace falta el ciclo completo y no alcanzan los round trips de `storage.spec.js`:** el round trip unitario (`guardar(evento.toJSON())` → `Evento.fromJSON(cargar())`) prueba que el **dato** sobrevive, pero no que la **aplicación** lo use al arrancar. Un fallo en `cargarEventoInicial()`, en `sincronizarCantidadesPresupuesto()`, en `sincronizarFormularioEvento()` (la ruta de `planit:detalles-evento`) o en el render inicial pasaría inadvertido: el storage tendría los datos correctos y el usuario igual vería el mockup. Por eso el test descarta todo lo que vive en memoria y en el DOM, y solo deja el storage como fuente posible. INT-RC16-02 es el control negativo: sin storage la misma rutina muestra el fixture, así que lo que restaura INT-RC16-01 sale del storage y no de valores que hayan quedado en el DOM.

**Por qué se prueba Bootstrap ausente (RC15):** Bootstrap se carga desde un CDN externo; si el CDN cae, se bloquea o la red lo filtra, el resto de la app (que es JS propio) sigue funcionando y el botón "Sumar al Evento" no debe quedar mudo ni romper con un `ReferenceError`. Antes de este cambio `configurarToastConfirmacion()` hacía `return` si `bootstrap` no existía al iniciar, así que el clic no daba ningún feedback. Ahora los listeners se registran siempre y `mostrarToast()` (en `js/script.js`) consulta Bootstrap **en cada clic**: si está, usa `bootstrap.Toast`; si no, aplica la clase `show` del CSS de Bootstrap y oculta el Toast después del mismo `data-bs-delay`. El contenedor ya es `role="status"` + `aria-live="polite"`, así que el mensaje se anuncia a lectores de pantalla en ambos casos. INT-RC15-03 quita `window.bootstrap` **antes** de montar los componentes, para cubrir también el caso de que Bootstrap no esté desde el arranque.

**Aislamiento:** el sandbox de RC14/RC15 se monta en `beforeEach` y se desmonta en un `afterEach` asíncrono. Ahí espera 50 ms a que terminen las transiciones en cola, después hace `dispose()` de las instancias de Modal y Toast y limpia `.modal-backdrop` y los estilos que Bootstrap pone en `<body>`. `window.bootstrap` se guarda en `beforeEach` y se restaura siempre en `afterEach`. En los specs de "Bootstrap ausente", un listener en el sandbox corta la propagación de los clics hacia `document`. Así los handlers *data-api* que el bundle ya registró (`data-bs-dismiss`, `data-bs-toggle`), que no dependen de `window.bootstrap`, no se ejecutan, y el escenario equivale de verdad a "Bootstrap no cargó".

**Falla de la primera corrida en navegador (23/11/2026) y corrección:** al abrir `test-runner.html` aparecieron 2 errores `TypeError: Cannot read properties of null (reading 'classList') at bootstrap.bundle.min.js`, atribuidos a los dos `describe` de RC15.
- **Lo que no era:** el `#toastConfirmacion` existe en el sandbox con el mismo `id`, clases y atributos que `index.html`.
- **Causa:** `Toast.show()` deja en cola un callback de fin de transición que Bootstrap emula con un `setTimeout` de ~5 ms, porque el runner no carga su CSS. Ese callback hace `this._element.classList.remove("showing")`. El `afterEach` llamaba a `dispose()` en el mismo tick, y `dispose()` pone `_element` en `null`. Unos milisegundos después el callback fallaba, y Jasmine le atribuía el error a la suite que estuviera corriendo en ese momento.
- **Corrección:** el desmontaje espera esas transiciones antes de llamar a `dispose()`. Como defensa adicional, `mostrarToast()` en `js/script.js` sale sin hacer nada si recibe un elemento nulo.
- **Por qué no se agregó el Toast al fixture base de `test-runner.html`:** `configurarEventos()` registraría listeners sobre ese Toast al cargar la página y habría `id` duplicados con el sandbox. Las rutas de imagen del sandbox apuntan a `../../docs/...` (relativas a `js/test/`), porque con `./docs/...` la imagen daría 404 y `run-jasmine.js` lo contaría como `console.error`. Los nodos que RC16 reemplaza quedan con sus listeners registrados por el `DOMContentLoaded` del propio test, así que los specs que corren después siguen funcionando igual con `restaurarEstadoInicial()`.

**Fuera de alcance de INT-RC14-01:** la observación menciona "categoría" y "badge" del servicio, pero el Modal de `index.html` no tiene esos campos (solo título, imagen, descripción, capacidad, duración, incluye, precio y el texto fijo "Proveedor verificado"), y el handler de `show.bs.modal` no los inyecta. El test verifica todos los campos que existen. Agregar categoría/badge al Modal sería un cambio de UI que le corresponde al rol Eventos + DOM, no a la suite.

---

## Métricas de Cobertura

### Resumen General
Corrida con `node js/test/run-jasmine.js`, repetida 8 veces con semillas aleatorias distintas para descartar dependencia de orden entre specs (cada spec de `script.spec.js` restaura el fixture completo en su `beforeEach`):

```
109 specs, 0 failures, randomized with seed 58036
109 specs, 0 failures, randomized with seed 92556
109 specs, 0 failures, randomized with seed 03931
109 specs, 0 failures, randomized with seed 17454
109 specs, 0 failures, randomized with seed 71884
109 specs, 0 failures, randomized with seed 31994
109 specs, 0 failures, randomized with seed 45025
109 specs, 0 failures, randomized with seed 30476
```

0 errores o advertencias de consola sin mockear en las 8 corridas (código de salida `0`).

Tras la review de Carola a PR #110 se agregaron 2 specs (storage lleno en `storage.spec.js`, y la regresión del bug de `escribirEnAlmacenamiento` en `script.spec.js`), reverificado 3 veces más:

```
111 specs, 0 failures, randomized with seed 95988
111 specs, 0 failures, randomized with seed 03252
111 specs, 0 failures, randomized with seed 47556
```

| Métrica | Valor |
|---|---|
**Corrida con la integración RC14–RC16 (23/11/2026):** el bloque de integración agrega **13 specs** a `script.spec.js` (5 de RC14, 5 de RC15 y 3 de RC16), y la suite pasa a **124 specs** (71 + 19 + 34). Se ejecutó en el navegador abriendo `js/test/test-runner.html` con Live Server (reporter HTML de Jasmine):

```
124 specs, 0 failures
```

Antes de esa corrida hubo una primera ejecución con 2 errores en RC15, ya corregidos (ver "Falla de la primera corrida en navegador" en la sección de `script.spec.js`).

| Métrica | Valor |
|---|---|
| Total de Tests | 124 |
| Tests Pasando | 124 ✅ |
| Tests Fallando | 0 ❌ |
| Porcentaje de Éxito | 100% |
| `models.spec.js` | 71 specs |
| `storage.spec.js` | 19 specs |
| `script.spec.js` | 34 specs (21 de los 4 flujos + 13 de integración RC14–RC16) |

La tabla anterior a esta actualización (111 specs, 0 fallas, 11 corridas con `run-jasmine.js`) queda como registro de la suite previa a RC14–RC16.

### Cobertura por Tipo de Test
Conteo exacto (no aproximado) de `it()` por categoría, uno por uno:

| Tipo | Cantidad |
|---|---|
| `models.spec.js` — Happy path / métodos de negocio | 42 |
| `models.spec.js` — Validación de errores (`toThrowError`) | 14 |
| `models.spec.js` — Serialización (`toJSON`/`fromJSON`) | 15 |
| `storage.spec.js` — CRUD y manejo de errores de `Almacenamiento` | 19 |
| `script.spec.js` — Integración de controlador contra DOM (incluye 3 regresiones) | 21 |
| `script.spec.js` — Integración Controlador y UI: Modal (RC14), Toast con y sin Bootstrap (RC15), carga nueva (RC16) | 13 |
| **Total** | **124** |

### Un obstáculo real durante la escritura de `script.spec.js`

La primera versión de la suite tenía 4 specs que fallaban de forma **intermitente** según la semilla aleatoria de Jasmine (no siempre con la misma). La causa: un test de "Flujo 1" deja a propósito el formulario inválido para verificar que `btnGuardarEvento` se deshabilita; `restaurarEstadoInicial()` reconstruía el modelo y el DOM en cada `beforeEach`, pero no reseteaba explícitamente el `.disabled` de los 3 botones de submit (`btnGuardarEvento`, `btnCalcularPresupuesto`, `btnAgregarInvitado`). Si ese test corría antes de otro que necesitaba hacer click en el mismo botón, el `.click()` siguiente no disparaba nada (botón deshabilitado) y el test fallaba con mensajes que, a primera vista, parecían un bug del controlador. Se diagnosticó con scripts de Playwright ad hoc que biseccionaron `restaurarEstadoInicial()` paso por paso, y se corrigió agregando el reset explícito de los 3 `.disabled`. No era un bug de `js/script.js`: era un descuido del fixture de testing. Se deja documentado porque es exactamente el tipo de falla que un `beforeEach` incompleto puede esconder.

---

## Alcance y Limitaciones

- **Sin cobertura automatizada de código (Istanbul/nyc):** igual que en la AO3, la cobertura se estima revisando manualmente qué comportamiento ejercita cada test.
- **Requiere conexión a internet** para cargar Jasmine y Bootstrap desde CDN. Sin Bootstrap, los specs de "Bootstrap presente" (INT-RC14-03/05, INT-RC15-01/02) fallan; los de "Bootstrap ausente" no dependen del CDN.
- **El Modal de detalle de servicio y el Toast de confirmación** (migrados a `js/script.js` en PR #109, Issue #68) ya no son deuda de testing: los cubre el bloque "Integración - Controlador y UI (RC14, RC15, RC16)". Hasta esta actualización se habían verificado solo a mano con Playwright (PR #109), con el argumento de que las animaciones de Bootstrap eran difíciles de testear de forma determinística. Se resolvió esperando los eventos propios de Bootstrap (`shown.bs.modal`/`hidden.bs.modal`) en vez de usar esperas fijas, y con `jasmine.clock()` para el temporizador del Toast degradado.
- **El catálogo del fixture tiene 3 proveedores fijos** (los del mockup real). El caso de un catálogo extendido con nombres que colisionan entre categorías se prueba agregando un 4° proveedor hipotético dentro del test de regresión correspondiente, no como parte del fixture base.
- Los tests son síncronos salvo INT-RC14-03 e INT-RC14-05, que son `async` porque esperan las transiciones del Modal de Bootstrap (`shown.bs.modal`/`hidden.bs.modal`). Ni los modelos ni el controlador son asíncronos.

---

## Issues Conocidos

No se encontraron bugs nuevos durante esta ronda de testing (modelos, storage y controlador). Los 3 bugs reales encontrados durante el ciclo de la AO4 se detectaron y corrigieron **antes** de esta etapa, durante el code review de PR #104 (documentados con su reproducción en `docs/03-specs/actividad-obligatoria-4/spec-devops.md`, MOMENTO 2), y quedaron formalmente reportados como issues de GitHub (cerradas, referenciando su commit de fix) a pedido de la review de Carola a PR #110:

1. [#111](https://github.com/carolabenvenuto-uces/planit/issues/111) — Desacople de contrato entre `escribirEnAlmacenamiento()` y `Almacenamiento.guardar()` (ronda 1, commit `fb04e75`) — cubierto ahora por una regresión en Suite 1.
2. [#112](https://github.com/carolabenvenuto-uces/planit/issues/112) — Mezcla de invitados con nombre duplicado al eliminar/cambiar estado (ronda 2, commit `5479820`) — cubierto ahora por una regresión en Suite 4.
3. [#113](https://github.com/carolabenvenuto-uces/planit/issues/113) — El filtro de categoría del catálogo reutilizaba el matcher de texto libre (ronda 3, commit `64f3ccc`) — cubierto ahora por una regresión en Suite 3.

Un 4° hallazgo (el ruteo de `planit:detalles-evento` a `sessionStorage` en vez de `localStorage`) se encontró y corrigió en `feature/dev-storage` antes del merge de PR #108 (ver `docs/03-specs/actividad-obligatoria-4/spec-dev-storage.md`, MOMENTO 2); no se reporta como issue de GitHub porque se corrigió en la misma rama antes de integrarse.

Hallazgos al escribir los specs de RC14–RC16 (23/11/2026):

5. **Toast sin feedback si Bootstrap no está cargado:** `configurarToastConfirmacion()` hacía `return` si `bootstrap` no existía al iniciar, así que "Sumar al Evento" no daba ningún feedback. Se corrigió en `js/script.js` con la degradación descrita arriba (`mostrarToast()`); lo cubren INT-RC15-03 a 05.
6. **El Modal no muestra categoría ni badge del servicio** (lo menciona RC14): no es un bug del controlador sino un campo que no existe en el marcado. Queda reportado al rol Eventos + DOM.

---

**Última actualización:** 23/11/2026 — integración RC14–RC16 (Modal, Toast con y sin Bootstrap, carga nueva de la página). Anterior: 22/11/2026, reescritura completa para la AO4.
**Tester QA (AO4):** Facundo Guiraldes (@FacundoGuiraldes).
**Colaboración con:** Desarrolladora JS POO - Carola Benvenuto (@carolabenvenuto-uces) · Desarrolladora JS Eventos + DOM - Valeria Silva (@ValeriaMSilva).
**Versión AO3 (funciones `flujo*()` basadas en `prompt()`/`alert()`):** disponible en el historial de git de este archivo.
