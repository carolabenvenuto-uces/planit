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
2. El runner carga, en orden: `js/models/*.js`, `js/utils/storage.js`, `js/script.js` (código a testear), y luego `models.spec.js`, `storage.spec.js`, `script.spec.js` (las 3 suites). `script.js` arranca automáticamente al cargar la página (`DOMContentLoaded`) contra el fixture de DOM embebido en el propio `test-runner.html`; cada test de `script.spec.js` restaura ese fixture a un estado conocido en su `beforeEach` (función `restaurarEstadoInicial()`), así el orden aleatorio de Jasmine no afecta el resultado.
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
| **RC7** — Serialización fallida | Ciclos directos, indirectos y a través de arrays; `BigInt` en la raíz y anidado; `toJSON()` que lanza (en la raíz y anidado); alias `actualizar()`; resiliencia después de un fallo (`RC7-01` a `RC7-10`). |
| **RC7** — Aislamiento | `localStorage` y `sessionStorage` no se contaminan entre sí; sin *fallback* cruzado en `cargar()` (`RC7-11` a `RC7-13`). |
| **RC7** — Ruteo | Escrituras estrictamente a `localStorage` (incluida `planit:detalles-evento`); `eliminar()` y `listar()` alcanzan `window.sessionStorage`; fallo aislado en `sessionStorage` (`RC7-14` a `RC7-17`). |
| **RC7** — Limpieza sin residuos | 25 claves repartidas en ambos storages; claves de terceros y claves parecidas al prefijo intactas; idempotencia; residuo reportado con `false` (`RC7-18` a `RC7-21`). |

**40 specs** (19 originales + 21 de RC7). Matriz completa en [Casos RC7](#casos-rc7-serialización-extrema-aislamiento-y-limpieza).

### Casos RC7: serialización extrema, aislamiento y limpieza

Corrección de la observación docente RC7: *"Agregar casos de serialización fallida, ciclos, BigInt, toJSON que lanza, aislamiento entre storages, ruteo efectivo a sessionStorage y limpieza sin residuos."* Los casos están en el bloque `describe("Serialización extrema, aislamiento y ciclo de vida de almacenamiento (RC7)")` de `storage.spec.js`. Cada `it()` empieza con su ID, así el ID se puede buscar en el reporter de Jasmine.

| ID | Caso | Verificación |
|---|---|---|
| RC7-01 | Ciclo directo (`obj.self = obj`) | `false`, no lanza, `console.error` con `TypeError`, la clave no queda en ningún storage |
| RC7-02 | Ciclo indirecto (`a → b → c → a`) | `false`, `TypeError`, `cargar()` → `null` |
| RC7-03 | Ciclo a través de un array | `false`, `TypeError`, sin escritura |
| RC7-04 | Ciclo sobre una clave con valor previo | `false`; el valor previo se conserva |
| RC7-05 | `BigInt` en la raíz | `false`, no lanza, `TypeError` |
| RC7-06 | `BigInt` anidado | `false`; sin residuos en ninguno de los dos storages |
| RC7-07 | `toJSON()` lanza un error propio | `false`, no lanza; `console.error` recibe la misma instancia de error |
| RC7-08 | `toJSON()` lanza `RangeError` en un objeto anidado | `false`; el valor previo se conserva |
| RC7-09 | `actualizar()` con un ciclo | Mismo manejo que `guardar()` |
| RC7-10 | Escritura válida después de una fallida | `true`, y se lee bien |
| RC7-11 | Clave homónima en `sessionStorage` + `guardar()` | Solo cambia `localStorage`; `sessionStorage` queda intacto |
| RC7-12 | Valor solo en `sessionStorage` | `cargar()` → `null` |
| RC7-13 | Serie de `guardar`/`actualizar`/`cargar`/`obtener` | Snapshot completo de `sessionStorage` idéntico antes y después |
| RC7-14 | Ruteo de `guardar()`/`actualizar()` (incluida `planit:detalles-evento`) | Todo `setItem` sobre `window.localStorage` |
| RC7-15 | `eliminar()` de una clave solo en `sessionStorage` | `removeItem` invocado sobre `window.sessionStorage`; la clave desaparece |
| RC7-16 | `listar()` con una clave solo en `sessionStorage` | Se incluye en el resultado |
| RC7-17 | `removeItem` falla solo en `sessionStorage` | `eliminar()` → `false`, no lanza, borra igual de `localStorage` |
| RC7-18 | 25 claves del prefijo en ambos storages | `limpiar()` → `true`; 0 claves del prefijo (recorrido nativo) |
| RC7-19 | Terceros y claves parecidas (`otra-app:sesion`, `planit:test`, `xplanit:test-a`, `PLANIT:TEST-a`, `planit:testa`) | Intactas con su valor exacto; snapshots de claves ajenas idénticos |
| RC7-20 | `limpiar()` dos veces | `true` y sin cambios (idempotente) |
| RC7-21 | Una entrada no se puede borrar de `sessionStorage` | `limpiar()` → `false` (el residuo se reporta) |

**Por qué estos casos:**

- **`TypeError` en `JSON.stringify`:** los ciclos (directos, indirectos o a través de arrays) y los `BigInt` hacen que `JSON.stringify` lance `TypeError`. Un `toJSON()` que lanza, en cambio, propaga **su propio error**: por eso RC7-07 verifica la instancia exacta y RC7-08 usa `RangeError`, para probar que `guardar()` captura cualquier error de serialización y no solo `TypeError`. Como `storage.js` serializa antes de llamar a `setItem`, un fallo nunca deja una escritura parcial (RC7-04 y RC7-08 lo verifican conservando el valor previo).
- **Aislamiento y ruteo:** `Almacenamiento` no expone un parámetro ni una bandera para elegir el storage. Enruta a `sessionStorage` solo las claves de `CLAVES_SESSION`, que hoy está vacío a propósito: `planit:detalles-evento` se movió a `localStorage` antes del merge de PR #108. Por eso el ruteo efectivo hacia `window.sessionStorage` se verifica en las operaciones que efectivamente lo usan (`eliminar`, `listar`, `limpiar`), comprobando con `spy.calls.all()[i].object` sobre qué instancia se invocó cada método. RC7-14 fija que las escrituras van estrictamente a `localStorage`.
- **Limpieza sin residuos:** RC7-18 detecta el error clásico de borrar mientras se recorre por índice. RC7-19 compara snapshots `{clave: valor}` completos de todo lo que está fuera del prefijo.
- **Idempotencia:** el bloque guarda `Storage.prototype.setItem/removeItem` nativos antes de cualquier `spyOn`. Su `afterEach` neutraliza los spies que hayan quedado lanzando, borra con los métodos nativos todas las claves `planit:test-` de ambos storages y restaura cada clave externa sembrada (terceros y `planit:detalles-evento`) a su valor previo.

### `script.spec.js` — Controlador de UI y eventos (PR #104)

Fixture de DOM en `test-runner.html`: subconjunto de `index.html` con los mismos `id`/`data-*` que lee `obtenerReferenciasUI()`, con los 3 proveedores y los 5 ítems de presupuesto reales del mockup. No incluye el Modal de detalle ni el Toast de confirmación (ver "Alcance y Limitaciones").

| Flujo | Casos cubiertos |
|---|---|
| 1. Crear evento | Validación en vivo (nombre vacío deshabilita "Guardar"); guardado válido (confirmación + persistencia real en `Almacenamiento`); **regresión**: avisa al usuario cuando el guardado falla, en vez de reportar éxito igual (bug corregido en PR #104, ronda 1); guardado inválido (no persiste, muestra error); el presupuesto estimado nuevo recalcula en vivo la alerta del Flujo 2. |
| 2. Calcular presupuesto | Total sin descuento y alerta "dentro del presupuesto"; descuento del 10%; alerta de excedido; cantidad negativa bloquea el resultado y se recupera al corregirla; descuento fuera de 0-100 bloquea el resultado. |
| 3. Buscar en catálogo | Sin filtro (3 proveedores); filtro por texto; filtro por categoría (valor exacto de la opción); **regresión**: un proveedor cuyo nombre contiene el texto de otra categoría no aparece al filtrar por esa categoría (bug corregido en PR #104, ronda 3); combinación de texto + categoría; aviso de sin coincidencias. |
| 4. Gestionar invitados | Alta válida (feedback + métricas); botón deshabilitado con nombre vacío; métricas tras eliminar; **regresión**: dos invitados con el mismo nombre se distinguen por posición al eliminar, no se mezclan (bug corregido en PR #104, ronda 2); persistencia tras agregar. |

**21 specs.** Los tres casos marcados "regresión" reproducen exactamente los 3 bugs que se encontraron y corrigieron durante el code review de PR #104, ahora reportados y cerrados como issues de GitHub: [#111](https://github.com/carolabenvenuto-uces/planit/issues/111), [#112](https://github.com/carolabenvenuto-uces/planit/issues/112), [#113](https://github.com/carolabenvenuto-uces/planit/issues/113). Quedan en la suite para que una futura regresión los vuelva a detectar automáticamente.

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

Con la corrección RC7 se agregaron 21 specs a `storage.spec.js`. En la máquina donde se hizo la corrección no había Node.js, así que `test-runner.html` se ejecutó con Chrome headless (`--headless=new --virtual-time-budget=20000 --dump-dom`, leyendo el banner de Jasmine del DOM), con 6 semillas:

```
132 specs, 0 failures, randomized with seed 44244
132 specs, 0 failures, randomized with seed 11111
132 specs, 0 failures, randomized with seed 22222
132 specs, 0 failures, randomized with seed 33333
132 specs, 0 failures, randomized with seed 44444
132 specs, 0 failures, randomized with seed 55555
```

Este método no captura `console.error`/`pageerror` como `run-jasmine.js`: queda pendiente una corrida con `node js/test/run-jasmine.js` para confirmar el código de salida `0`.

| Métrica | Valor |
|---|---|
| Total de Tests | 132 |
| Tests Pasando | 132 ✅ |
| Tests Fallando | 0 ❌ |
| Porcentaje de Éxito | 100% |
| `models.spec.js` | 71 specs |
| `storage.spec.js` | 40 specs (19 + 21 de RC7) |
| `script.spec.js` | 21 specs |

### Cobertura por Tipo de Test
Conteo exacto (no aproximado) de `it()` por categoría, uno por uno:

| Tipo | Cantidad |
|---|---|
| `models.spec.js` — Happy path / métodos de negocio | 42 |
| `models.spec.js` — Validación de errores (`toThrowError`) | 14 |
| `models.spec.js` — Serialización (`toJSON`/`fromJSON`) | 15 |
| `storage.spec.js` — CRUD y manejo de errores de `Almacenamiento` | 19 |
| `storage.spec.js` — RC7: serialización fallida (`RC7-01` a `RC7-10`) | 10 |
| `storage.spec.js` — RC7: aislamiento entre storages (`RC7-11` a `RC7-13`) | 3 |
| `storage.spec.js` — RC7: ruteo efectivo a `sessionStorage` (`RC7-14` a `RC7-17`) | 4 |
| `storage.spec.js` — RC7: limpieza sin residuos (`RC7-18` a `RC7-21`) | 4 |
| `script.spec.js` — Integración de controlador contra DOM (incluye 3 regresiones) | 21 |
| **Total** | **132** |

### Un obstáculo real durante la escritura de `script.spec.js`

La primera versión de la suite tenía 4 specs que fallaban de forma **intermitente** según la semilla aleatoria de Jasmine (no siempre con la misma). La causa: un test de "Flujo 1" deja a propósito el formulario inválido para verificar que `btnGuardarEvento` se deshabilita; `restaurarEstadoInicial()` reconstruía el modelo y el DOM en cada `beforeEach`, pero no reseteaba explícitamente el `.disabled` de los 3 botones de submit (`btnGuardarEvento`, `btnCalcularPresupuesto`, `btnAgregarInvitado`). Si ese test corría antes de otro que necesitaba hacer click en el mismo botón, el `.click()` siguiente no disparaba nada (botón deshabilitado) y el test fallaba con mensajes que, a primera vista, parecían un bug del controlador. Se diagnosticó con scripts de Playwright ad hoc que biseccionaron `restaurarEstadoInicial()` paso por paso, y se corrigió agregando el reset explícito de los 3 `.disabled`. No era un bug de `js/script.js`: era un descuido del fixture de testing. Se deja documentado porque es exactamente el tipo de falla que un `beforeEach` incompleto puede esconder.

---

## Alcance y Limitaciones

- **Sin cobertura automatizada de código (Istanbul/nyc):** igual que en la AO3, la cobertura se estima revisando manualmente qué comportamiento ejercita cada test.
- **Requiere conexión a internet** para cargar Jasmine (y, si se agregara en el futuro, Bootstrap) desde CDN.
- **El Modal de detalle de servicio y el Toast de confirmación** (migrados de `js/componentes-bootstrap.js` a `js/script.js` en PR #109, Issue #68) **no están en el fixture de `script.spec.js`**: `configurarComponentesBootstrap()` los omite sin error si no existen en el DOM, así que su ausencia no rompe la suite. Se decidió no agregarlos a la suite automatizada porque dependen del bundle de Bootstrap (animaciones de modal/toast con temporización propia, difícil de testear de forma determinística en Jasmine sin agregar esperas artificiales) y porque ya se verificaron manualmente con Playwright antes de abrir la PR #109 (ver esa PR para la evidencia: completado de datos del Modal desde `data-service-*`, Toast con el servicio correcto desde el Modal y desde una tarjeta directa). Queda como deuda de testing documentada, no como un vacío silencioso.
- **El catálogo del fixture tiene 3 proveedores fijos** (los del mockup real). El caso de un catálogo extendido con nombres que colisionan entre categorías se prueba agregando un 4° proveedor hipotético dentro del test de regresión correspondiente, no como parte del fixture base.
- Tests síncronos únicamente (sin `Promise`/`async`-`await`); no hace falta por ahora porque ni los modelos ni el controlador son asíncronos.

---

## Issues Conocidos

No se encontraron bugs nuevos durante esta ronda de testing (modelos, storage y controlador). Los 3 bugs reales encontrados durante el ciclo de la AO4 se detectaron y corrigieron **antes** de esta etapa, durante el code review de PR #104 (documentados con su reproducción en `docs/03-specs/actividad-obligatoria-4/spec-devops.md`, MOMENTO 2), y quedaron formalmente reportados como issues de GitHub (cerradas, referenciando su commit de fix) a pedido de la review de Carola a PR #110:

1. [#111](https://github.com/carolabenvenuto-uces/planit/issues/111) — Desacople de contrato entre `escribirEnAlmacenamiento()` y `Almacenamiento.guardar()` (ronda 1, commit `fb04e75`) — cubierto ahora por una regresión en Suite 1.
2. [#112](https://github.com/carolabenvenuto-uces/planit/issues/112) — Mezcla de invitados con nombre duplicado al eliminar/cambiar estado (ronda 2, commit `5479820`) — cubierto ahora por una regresión en Suite 4.
3. [#113](https://github.com/carolabenvenuto-uces/planit/issues/113) — El filtro de categoría del catálogo reutilizaba el matcher de texto libre (ronda 3, commit `64f3ccc`) — cubierto ahora por una regresión en Suite 3.

Un 4° hallazgo (el ruteo de `planit:detalles-evento` a `sessionStorage` en vez de `localStorage`) se encontró y corrigió en `feature/dev-storage` antes del merge de PR #108 (ver `docs/03-specs/actividad-obligatoria-4/spec-dev-storage.md`, MOMENTO 2); no se reporta como issue de GitHub porque se corrigió en la misma rama antes de integrarse.

**Hallazgo de la corrección RC7 (pendiente de reportar como issue):** `Almacenamiento.guardar()` devuelve `true` cuando el valor es algo que `JSON.stringify` convierte en `undefined` **sin lanzar** (una función, un `Symbol` o un objeto cuyo `toJSON()` devuelve `undefined`). En ese caso `setItem` guarda el texto literal `"undefined"` y el siguiente `cargar()` devuelve `null`. Se verificó en Chrome (`guardar=true crudo=undefined cargar=null` en los tres casos). Contradice el contrato ya testeado de `guardar(clave, undefined)` → `false`. No se agregó como spec porque fallaría y la corrección es de `js/utils/storage.js`, fuera del alcance de RC7. Corrección sugerida: devolver `false` si `typeof JSON.stringify(valor) !== "string"`.

---

**Última actualización:** 23/11/2026 — corrección RC7 (21 specs de serialización extrema, aislamiento y limpieza en `storage.spec.js`).
**Reescritura completa para la AO4:** 22/11/2026.
**Tester QA (AO4):** Facundo Guiraldes (@FacundoGuiraldes).
**Colaboración con:** Desarrolladora JS POO - Carola Benvenuto (@carolabenvenuto-uces) · Desarrolladora JS Eventos + DOM - Valeria Silva (@ValeriaMSilva).
**Versión AO3 (funciones `flujo*()` basadas en `prompt()`/`alert()`):** disponible en el historial de git de este archivo.
