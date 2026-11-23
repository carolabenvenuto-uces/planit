# Documentación de Testing - Suite Jasmine (Actividad Obligatoria N° 4)

> Reemplaza íntegramente a la versión de la AO3: con el controlador de eventos/DOM (PR #104), las clases de dominio (PR #102) y la capa de persistencia (PR #108) ya integradas en `develop`, la suite de testing se reorganiza en 3 archivos. El contenido anterior (specs de las funciones `flujo*()`/`prompt()`/`alert()` de la AO3) queda disponible en el historial de git; las funciones que testeaba ya no existen en `js/script.js`.

## Índice
1. [Qué cambió respecto de la AO3](#qué-cambió-respecto-de-la-ao3)
2. [Ejecución de Tests](#ejecución-de-tests)
3. [Suites de Tests](#suites-de-tests)
4. [Métricas de Cobertura](#métricas-de-cobertura)
5. [Cobertura de líneas y ramas de los modelos (RC4 y RC5)](#cobertura-de-líneas-y-ramas-de-los-modelos-rc4-y-rc5)
6. [Alcance y Limitaciones](#alcance-y-limitaciones)
7. [Issues Conocidos](#issues-conocidos)

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

### Evidencia E2E con agente (corrección RC2)
El 23/11/2026, GitHub Copilot en Modo Agente (VS Code) ejecutó de forma interactiva los 4 flujos sobre `http://localhost:5500/index.html` con sus herramientas de navegador integradas (`openBrowserPage`, `typeInPage`, `readPage`, `clickElement`, `runPlaywrightCode`, `screenshotPage`), en 22 invocaciones:

| Captura | Flujo | Resultado |
|---|---|---|
| `01-crear-evento.png` | Crear evento ("Conferencia Tech 2026", 2027-06-15, $150.000) | ✅ Aprobado |
| `02-presupuesto.png` | Presupuesto (Catering 120 → 100; subtotal $580.000 → $510.000) | ✅ Aprobado |
| `03-catalogo.png` | Catálogo (filtro "Catering", 1 proveedor, "Sumar al Evento") | ✅ Aprobado |
| `04-invitados.png` | Invitados (2 altas, en el DOM y en `planit:evento` de `localStorage`) | ✅ Aprobado |

No se dispararon `alert()` ni `confirm()`, y la consola no registró errores de la aplicación (solo advertencias de terceros del reproductor de YouTube). **Salvedad:** esas herramientas son las integradas de Copilot, no las del servidor `@playwright/mcp` registrado en `.vscode/mcp.json`. El prompt, la secuencia completa de herramientas y la verificación están en `docs/03-specs/actividad-obligatoria-4/spec-tester-qa.md`, sección 3.1.

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

**71 specs base** (AO4 original).

#### Suite ampliada RC5: `describe("RC5 - Límites y ramas independientes")`

En respuesta a la observación RC5 del docente se agregó al final de `models.spec.js` un bloque de **101 specs**. Cada uno tiene un identificador `RC5-<CLASE>-<NN>` que se usa en la [matriz de trazabilidad de ramas](#matriz-de-trazabilidad-de-ramas). Criterios aplicados en todo el bloque:

- **Una rama por spec:** cada condición de un `if`, cada operando de un `||`/`&&` y cada parámetro por defecto se ejercita por separado, con el resto de los datos válidos. Así el error observado se debe a esa condición y no a otra que falla antes.
- **Mensajes exactos:** se usa `toThrowError(mensaje)` con el texto literal del modelo (constante `MSG` del bloque), no un `toThrowError()` genérico. Esto distingue, por ejemplo, un `fromJSON` que falla por la raíz de uno que falla por un atributo interno.
- **Sin efectos parciales:** después de una operación rechazada se verifica que el estado no cambió (largo de la colección, estado previo del invitado).

| Grupo | Specs | Qué agrega |
|---|---|---|
| `Validador` (`RC5-VAL-01..09`) | 9 | Tipos no texto (`0`, `false`, `{}`, `[]`, `NaN`), espacios en blanco y tabulaciones, `NaN`/`Infinity` como `number`, notación científica, decimales con coma (`"3,5"` → `NaN`), separador de miles, `boolean`/`array` sin coerción implícita, `normalizarTexto(null)`, `buscarOpcion` sin coincidencias parciales. |
| `ItemContratado` (`RC5-IC-01..16`) | 16 | Límite inferior inclusivo (cantidad y precio `0`), decimales, `-0.01` en cada campo por separado, `NaN`/`Infinity`/`null`/`undefined`/`true`/`[5]`/`""` en cantidad y precio, textos inválidos campo por campo, prioridad de mensajes, recorte de espacios, `Number.MAX_SAFE_INTEGER`, desborde a `Infinity` (comportamiento actual documentado), `fromJSON` con raíz `0`/`""`/`false`/función, con objeto vacío, claves nulas, faltantes o corrompidas y claves extra. |
| `Presupuesto` (`RC5-PRE-01..19`) | 19 | `agregarItem` con objeto plano con forma de ítem u otra clase. **Índices inválidos de `eliminarItem`** (`"0"`, `0.5`, `1.5`, `NaN`, `±Infinity`, `null`, `undefined`, `true`, `-1` con ítems, `=== length`), último índice válido e índice intermedio (orden preservado). Decimales en el total, descuento sobre presupuesto vacío, descuento decimal o en texto, redondeo a 2 decimales, `-0.01`/`100.01`, límite `0`, límite decimal. `fromJSON` con raíz, `items` faltante/nulo/no array, `items: []` y un ítem anidado nulo o corrompido. |
| `Invitado` (`RC5-INV-01..11`) | 11 | **Estados `true`/`false` explícitos de `esConfirmado()`**, transición completa Pendiente → Confirmado → Pendiente, idempotencia, que un cambio inválido no altere el estado previo, `validar()` con un error por dato, unión de mensajes, nombre de tipo inválido, recorte de espacios, `fromJSON` parcial (falta `nombre` o `estado`), claves nulas y estado persistido en minúsculas. |
| `ListaInvitados` (`RC5-LI-01..10`) | 10 | Alta inválida sin efecto parcial, `eliminar` con tipo inválido o lista vacía, duplicados (solo se elimina la 1ª coincidencia), sin coincidencias parciales, **ramas `if`/`else` de `contarAsistencia` por separado** y después de una transición de estado. `fromJSON` con raíz o `invitados` inválidos, lista vacía e invitado anidado nulo, parcial o vacío. |
| `Evento` (`RC5-EV-01..19`) | 19 | `validarDatos` con **un solo dato inválido por vez** (nombre, tipo, presupuesto), presupuesto `NaN`/`Infinity`/`0`/`"0"`/`-0.01`/`true`, mínimo positivo `0.01`, `"1e6"`, tipos sin tildes. `superaPresupuesto` con presupuesto vacío, **total exactamente igual al estimado (`>` estricto → `false`)**, un centavo por encima, descuento del 100%, descuento inválido propagado y `undefined` explícito (valor por defecto). `fromJSON` con solo `presupuesto` o solo `invitados` (ramas independientes), **clave nula frente a clave ausente**, componentes anidados malformados y presupuesto guardado como texto. |
| `Proveedor` (`RC5-PRV-01..10`) | 10 | Nombre, categoría y unidad inválidos por separado, precio `0` y decimal, precio `-0.01`/`NaN`/`Infinity`/`null`/`"3,5"`, prioridad de mensajes, recorte de espacios, **coincidencia solo por nombre o solo por categoría** (cada operando del `\|\|`), criterio en blanco o numérico, `fromJSON` parcial o corrompido. |
| `CatalogoProveedores` (`RC5-CAT-01..07`) | 7 | `agregarProveedor` con objeto plano u otra clase sin modificar el catálogo, criterio de búsqueda inválido, catálogo vacío, varias coincidencias en orden de alta, `fromJSON` con raíz o `proveedores` inválidos, lista vacía y proveedor anidado nulo, parcial o corrompido. |
| **Total RC5** | **101** | |

**Total de `models.spec.js`: 172 specs** (71 base + 101 RC5).

### `storage.spec.js` — Persistencia (PR #108)

| Grupo | Qué cubre |
|---|---|
| `guardar`/`cargar` | Ida y vuelta con valores simples y objetos; clave inexistente devuelve `null`; `guardar(clave, undefined)` devuelve `false` sin dejar la clave leíble; JSON corrupto en `cargar()` devuelve `null` sin lanzar; sobrescritura de un valor existente; **storage lleno** (`setItem` lanza `QuotaExceededError`) devuelve `false` sin lanzar (sugerido en la review de Carola a PR #110). |
| `obtener`/`actualizar` | Alias de `cargar`/`guardar`. |
| `eliminar` | Borra una clave existente; devuelve `true` aunque no exista; borra de **ambos** storages aunque la clave esté sembrada en los dos (regla agregada en la review de PR #108). |
| `listar` | Filtra por prefijo (con y sin el default `"planit:"`); vacío sin coincidencias. |
| `limpiar` | Borra todas las claves de un prefijo y lo refleja en el `boolean` devuelto; no afecta otros prefijos. |
| Integración con `js/models/` | Un `Evento` completo (con `Presupuesto` e invitados) sobrevive un ciclo `guardar(evento.toJSON())` → `Evento.fromJSON(cargar(...))`. |
| **RC6 — Resiliencia ante fallas del storage** | Storage ausente, inaccesible o con errores en `localStorage` y `sessionStorage`; detalle abajo. |

**82 specs** (19 de CRUD + 63 de RC6).

#### RC6 — Resiliencia ante storage ausente, inaccesible o con errores

Agregado para atender la observación del docente: *"RC6 — Agregar pruebas para storage ausente o inaccesible y errores de lectura, borrado y listado en localStorage y sessionStorage, incluyendo SecurityError y códigos alternativos de cuota."* El identificador de cada caso aparece entre corchetes en el título del spec. La tabla completa, con el resultado esperado de cada caso, está en `docs/03-specs/actividad-obligatoria-4/spec-tester-qa.md`, sección 6.2.

| IDs | Grupo | Qué simula | Specs |
|---|---|---|---|
| RC6-01 a RC6-04 | Storage ausente o inaccesible | `window.localStorage`/`sessionStorage` es `null`, es `undefined` o su getter lanza `SecurityError`; RC6-04: ninguno de los dos disponible. | 25 |
| RC6-05 a RC6-09 | `SecurityError` | `DOMException` estándar (code 18) lanzada por `setItem`, `getItem` y `removeItem` en cada storage; variante legacy `SECURITY_ERR`. | 6 |
| RC6-10 a RC6-12 | Errores de lectura | `getItem` que lanza; falla aislada en `sessionStorage`; 6 formatos de dato no deserializable. | 8 |
| RC6-13 a RC6-15 | Errores de borrado | `removeItem` que falla en un storage (`eliminar()` y `limpiar()` siguen con el otro); `clear()` que lanza no afecta a `limpiar()`. | 5 |
| RC6-16 a RC6-18 | Errores de listado | Leer `length` lanza; `key()` lanza en uno o en ambos storages. | 5 |
| RC6-19 a RC6-23 | Códigos alternativos de cuota | `QuotaExceededError`/22, `NS_ERROR_DOM_QUOTA_REACHED`/1014 (Firefox legacy), `QUOTA_EXCEEDED_ERR`/22 (WebKit/Safari legacy), IE `E_OUTOFMEMORY` (`number` −2147024882); un storage lleno no impide leer, listar ni borrar. | 14 |

**Cómo se aísla cada spec:**
- `spyOnProperty(window, "<storage>", "get")` simula un storage ausente (devuelve `null`/`undefined`) o inaccesible (el getter lanza).
- Los espías sobre `Storage.prototype` usan un `callFake` que lanza solo cuando `this` es el storage elegido y delega en el método original para el otro. No se espían métodos sobre la instancia (`spyOn(localStorage, "getItem")`), porque asignar una propiedad a un `Storage` puede guardarla como un ítem más del storage.
- Jasmine restaura todos los espías al terminar cada spec. El `afterEach` del bloque borra las claves `planit:test-*` con los storages y métodos reales, capturados antes de instalar cualquier espía.
- `console.error` se espía en el `beforeEach`, porque cada falla se loguea a propósito.

#### Justificación técnica del manejo de excepciones de almacenamiento

- **Una sola estrategia para todas las fallas:** `Almacenamiento` no clasifica el error por `name`/`code`; ante cualquier excepción devuelve un valor seguro (`false`/`null`/`[]`) y loguea el error original. No hace falta distinguirlos, porque la reacción es siempre la misma: seguir en memoria y avisar. Tampoco hay un criterio portable para reconocer una falla de cuota (cada navegador usa un nombre o código distinto, ver RC6-19 a RC6-22). Así, la compatibilidad con varios navegadores no depende de una lista de códigos que mantener.
- **`SecurityError` puede saltar en el getter:** en incógnito estricto, con cookies bloqueadas o en iframes de otro origen, lanza la simple lectura de `window.localStorage`, no solo `getItem`/`setItem`. Por eso el acceso a la propiedad también va dentro del `try`.
- **Degradación elegante:** si falta un storage, se sigue con el otro. `eliminar()` devuelve `false` porque no puede garantizar el borrado completo, y el controlador usa ese `boolean` para avisarle al usuario (issue #111).
- **Sin escrituras parciales:** si `setItem` lanza, el valor previo de la clave queda intacto.

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

Con la corrección **RC6** se agregaron 63 specs a `storage.spec.js`. Sin Node.js en la máquina donde se hizo la corrección, la suite se ejecutó con el mismo `test-runner.html` en Microsoft Edge headless (Chromium: `msedge --headless=new --virtual-time-budget=20000 --dump-dom`), 5 veces con semillas distintas:

```
174 specs, 0 failures, randomized with seed 29568
174 specs, 0 failures, randomized with seed 52775
174 specs, 0 failures, randomized with seed 40154
174 specs, 0 failures, randomized with seed 55507
174 specs, 0 failures, randomized with seed 53786
```

Los únicos mensajes de consola fueron avisos de Tracking Prevention de Edge sobre los recursos de Jasmine en el CDN; ninguno vino de la aplicación ni de los tests. Queda pendiente repetir la corrida con `node js/test/run-jasmine.js`, el runner oficial del proyecto.

| Métrica | Valor |
|---|---|
| Total de Tests | 174 |
| Tests Pasando | 174 ✅ |
| Tests Fallando | 0 ❌ |
| Porcentaje de Éxito | 100% |
| `models.spec.js` | 71 specs |
| `storage.spec.js` | 82 specs (19 + 63 de RC6) |
| `script.spec.js` | 21 specs |

**Ampliación RC5 (corrección docente):** se agregaron 101 specs a `models.spec.js`. La suite queda en **212 specs** (172 + 19 + 21). El conteo es estático y se puede reproducir con `grep -c '^\s*it("' js/test/*.spec.js`.

**Resultado de la corrida de la suite ampliada (23/11/2026):** se ejecutó en el navegador, abriendo el runner HTML de Jasmine (`js/test/test-runner.html`) servido con Live Server (`http://localhost:5500/js/test/test-runner.html`):

```
212 specs, 0 failures
```

Los 101 specs nuevos de RC5 pasaron sin fallas, y los 111 anteriores siguen pasando. Esta corrida se hizo en el navegador y no con `node js/test/run-jasmine.js`, porque el entorno donde se redactó la corrección no tiene Node.js instalado. Se usó el mismo runner HTML que abre `run-jasmine.js` y la misma versión de Jasmine (5.10.0, desde CDN).

### Cobertura por Tipo de Test
Conteo exacto (no aproximado) de `it()` por categoría, uno por uno:

| Tipo | Cantidad |
|---|---|
| `models.spec.js` — Happy path / métodos de negocio | 42 |
| `models.spec.js` — Validación de errores (`toThrowError`) | 14 |
| `models.spec.js` — Serialización (`toJSON`/`fromJSON`) | 15 |
| `models.spec.js` — RC5: límites y ramas independientes (`RC5-*`) | 101 |
| `storage.spec.js` — CRUD y manejo de errores de `Almacenamiento` | 19 |
| `storage.spec.js` — RC6: resiliencia ante storage ausente/inaccesible, `SecurityError`, errores de lectura/borrado/listado y cuota multi-navegador | 63 |
| `script.spec.js` — Integración de controlador contra DOM (incluye 3 regresiones) | 21 |
| **Total** | **174** |

### Un obstáculo real durante la escritura de `script.spec.js`

La primera versión de la suite tenía 4 specs que fallaban de forma **intermitente** según la semilla aleatoria de Jasmine (no siempre con la misma). La causa: un test de "Flujo 1" deja a propósito el formulario inválido para verificar que `btnGuardarEvento` se deshabilita; `restaurarEstadoInicial()` reconstruía el modelo y el DOM en cada `beforeEach`, pero no reseteaba explícitamente el `.disabled` de los 3 botones de submit (`btnGuardarEvento`, `btnCalcularPresupuesto`, `btnAgregarInvitado`). Si ese test corría antes de otro que necesitaba hacer click en el mismo botón, el `.click()` siguiente no disparaba nada (botón deshabilitado) y el test fallaba con mensajes que, a primera vista, parecían un bug del controlador. Se diagnosticó con scripts de Playwright ad hoc que biseccionaron `restaurarEstadoInicial()` paso por paso, y se corrigió agregando el reset explícito de los 3 `.disabled`. No era un bug de `js/script.js`: era un descuido del fixture de testing. Se deja documentado porque es exactamente el tipo de falla que un `beforeEach` incompleto puede esconder.


## Cobertura de líneas y ramas de los modelos (RC4 y RC5)

> **RC4 (docente):** "La cantidad de specs verdes no acredita cobertura de líneas y ramas. Agregar un reporte reproducible o justificar explícitamente las ramas excluidas."

La cantidad de specs en verde no dice qué líneas ni qué ramas se ejecutaron. Esta sección reemplaza esa métrica por tres cosas: (1) un inventario de **todas** las ramas de `js/models/*.js`, (2) para cada rama, el spec que la ejerce, y (3) un procedimiento que cualquiera puede repetir para verificarlo con una herramienta, sin depender de este documento.

### Metodología

1. **Inventario de ramas.** Se recorrió cada método de las 8 clases y se registró como rama independiente cada uno de estos puntos de decisión:
   - cada resultado (`true`/`false`) de un `if` y de su `else` implícito (el `throw` o el `return` anticipado frente a la continuación);
   - **cada operando** de un `||` o `&&`, porque los dos cortocircuitan. Por ejemplo, `!json || typeof json !== "object" || Array.isArray(json)` aporta 3 ramas de rechazo más la de aceptación, y cada una necesita una entrada que la active **sola**: `null` activa solo el 1er operando, `"texto"` solo el 2º y `[]` solo el 3º;
   - cada parámetro por defecto (`porcentajeDescuento = 0`): valor omitido o `undefined` frente a valor provisto;
   - las comparaciones de límite (`<`, `<=`, `>`, `>=`), probadas **en el límite exacto y a un paso de él**: `0` y `-0.01`, `100` y `100.01`, `length - 1` y `length`, total igual al estimado y un centavo por encima;
   - los callbacks con decisión interna (`reduce` de `contarAsistencia`, `findIndex` de `eliminar`, `filter` de `buscar`): colección vacía (el callback no se ejecuta), coincidencia y no coincidencia.
   - El código no tiene operadores ternarios (`?:`) ni `?.`/`??` (se verificó con `grep -nE '\?[^.]|\?\?' js/models/*.js`, que no devuelve ninguna coincidencia), así que no aportan ramas.
2. **Asignación.** Para cada rama se busca un spec que la active con el resto de los datos válidos. Si la única forma de activarla era un spec que también activaba otra rama antes, se escribió un spec RC5 nuevo. Ejemplo real: el spec base de `Proveedor.coincideCon("SONIDO")` coincide por **nombre** ("DJ Lucas & **Sonido**") y nunca llegaba a evaluar el operando de categoría del `||`; `RC5-PRV-07` lo cubre por separado.
3. **Cobertura de líneas.** Se deduce de la de ramas: todas las líneas de `js/models/*.js` están dentro de un método, y la matriz cubre todos los caminos de entrada y salida de cada método (incluidos los `throw`). Los getters y `toJSON()` sin decisiones se ejecutan en los specs de *round-trip* `fromJSON(toJSON())` y en los que leen propiedades.
4. **Verificación reproducible con herramienta.** Ver [Reporte reproducible](#reporte-reproducible-de-cobertura-chrome-devtools).

Convención de la matriz: **base** = spec de la suite original (se cita su `describe` y el comienzo del título); **RC5-xxx** = spec nuevo del bloque `RC5 - Límites y ramas independientes`.

### Matriz de trazabilidad de ramas

#### `Validador`

| Método | Rama | Cubierta por |
|---|---|---|
| `esTextoNoVacio` | `typeof !== "string"` → `false` | base `esTextoNoVacio › …false…` (`null`, `undefined`, `123`); RC5-VAL-01 |
| | string en blanco → `false` | base (`""`, `"   "`); RC5-VAL-02 (`"\t\n"`) |
| | string con contenido → `true` | base (`"Hola"`); RC5-VAL-02 (un carácter) |
| `convertirANumero` | `typeof === "number"` → se devuelve tal cual | base (`42`); RC5-VAL-03 (`NaN`, `Infinity`, negativo, decimal) |
| | string no vacío → `Number(trim)` (válido) | base (`"42"`, `"  42  "`); RC5-VAL-04 (`"3.5"`, `"1e3"`, `"-7"`) |
| | string no vacío → `Number(trim)` (da `NaN`) | base (`"abc"`); RC5-VAL-05 (`"3,5"`, `"1 000"`, `"12abc"`) |
| | string en blanco → cae a `NaN` | base (`""`); RC5-VAL-05 (`"   "`) |
| | otro tipo → `NaN` | base (`null`, `undefined`); RC5-VAL-06 (`true`, `false`, `[]`, `[5]`, `{}`) |
| `normalizarTexto` | sin ramas (una sola línea) | base `normalizarTexto`; RC5-VAL-07 (`null`, número, mayúsculas con tilde y `Ñ`) |
| `buscarOpcion` | valor no texto o en blanco → `undefined` | base (`""`, `null`); RC5-VAL-08 (`1`, `undefined`, `"   "`) |
| | `find` encuentra la opción | base (`"confirmado"`, `"PENDIENTE"`); RC5-VAL-08 (con espacios) |
| | `find` no encuentra → `undefined` | base (`"Declinado"`); RC5-VAL-09 (coincidencia parcial) |

#### `ItemContratado`

| Método | Rama | Cubierta por |
|---|---|---|
| `constructor` | `!esTextoNoVacio(categoria)` | base `…categoría o descripción vacía`; RC5-IC-08 |
| | `!esTextoNoVacio(descripcion)` (categoría válida) | base; RC5-IC-08 |
| | `!Number.isFinite(cantidad)` | base (`"abc"`); RC5-IC-05, RC5-IC-07 |
| | `cantidad < 0` | base (`-1`); RC5-IC-03 (`-0.01`) |
| | `!Number.isFinite(precio)` (cantidad válida) | RC5-IC-06, RC5-IC-07 |
| | `precio < 0` (cantidad válida) | base (`-100`); RC5-IC-04 (`-0.01`) |
| | todos válidos (límite inferior `0` incluido) | base `…ítem válido…`; RC5-IC-01, RC5-IC-02, RC5-IC-10, RC5-IC-11 |
| | orden de evaluación: textos antes que números | RC5-IC-09 |
| `calcularSubtotal` | sin ramas | base; RC5-IC-01, RC5-IC-02, RC5-IC-12 (desborde) |
| `fromJSON` | `!json` | base (`null`); RC5-IC-13 (`0`, `""`, `false`, `undefined`) |
| | `typeof json !== "object"` | RC5-IC-13 (`"item"`, `42`, función) |
| | `Array.isArray(json)` | base (`[]`) |
| | objeto → delega en el constructor (falla) | RC5-IC-14, RC5-IC-15 |
| | objeto → delega en el constructor (ok) | base *round-trip*; RC5-IC-16 |

#### `Presupuesto`

| Método | Rama | Cubierta por |
|---|---|---|
| `agregarItem` | no es `ItemContratado` → `throw` | base (objeto plano); RC5-PRE-01 (`null`, `undefined`, objeto con `calcularSubtotal`, `Proveedor`) |
| | es `ItemContratado` → se agrega | base `agregarItem debería acumular…` |
| `eliminarItem` | `!Number.isInteger(indice)` | RC5-PRE-02 (`"0"`, `0.5`, `1.5`), RC5-PRE-03 (`NaN`, `±Infinity`, `null`, `undefined`, `true`) |
| | `indice < 0` | base (`-1` con lista vacía); RC5-PRE-04 (`-1` con ítems) |
| | `indice >= length` | base (`0` con lista vacía); RC5-PRE-05 (`=== length`) |
| | índice válido → `splice` | base (índice `0`); RC5-PRE-06 (`length - 1`), RC5-PRE-07 (intermedio) |
| `calcularTotal` | `reduce` sobre colección vacía / con ítems | base `debería empezar vacío`, `…acumular el total…`; RC5-PRE-08 (decimales) |
| `aplicarDescuento` | `!Number.isFinite(descuento)` | base (`"abc"`, `null`); RC5-PRE-13 (`NaN`, `Infinity`, `undefined`, `""`, `true`, `[]`) |
| | `descuento < 0` | base (`-1`); RC5-PRE-12 (`-0.01`) |
| | `descuento > 100` | base (`101`); RC5-PRE-12 (`100.01`) |
| | rango válido (límites `0` y `100` inclusive) | base (`0`, `10`, `100`); RC5-PRE-09, RC5-PRE-10, RC5-PRE-11 (redondeo) |
| `superaLimite` | `!Number.isFinite(monto)` | base (`"abc"`); RC5-PRE-16 |
| | `monto < 0` | base (`-1`); RC5-PRE-16 (`-0.01`) |
| | `total > monto` → `true` | base (`99999`); RC5-PRE-14, RC5-PRE-15 |
| | `total > monto` → `false` (igual o menor) | base (`100000`, `100001`); RC5-PRE-14 (`0` con total `0`), RC5-PRE-15 |
| `fromJSON` | `!json` | base (`null`); RC5-PRE-17 (`undefined`, `0`) |
| | `typeof json !== "object"` | RC5-PRE-17 (`"items"`) |
| | `!Array.isArray(json.items)` | base (`"no-es-array"`); RC5-PRE-17 (`[]`, `{}`, `items: null`, `items: {}`) |
| | `items` vacío / con ítems | RC5-PRE-18; base *round-trip* |
| | ítem anidado inválido (propaga el error) | RC5-PRE-19 |

#### `Invitado`

| Método | Rama | Cubierta por |
|---|---|---|
| `validar` | nombre inválido | base (constructor con `""`, `null`); RC5-INV-05, RC5-INV-07 |
| | estado inválido | base (`"Declinado"`); RC5-INV-05 |
| | ambos inválidos (dos mensajes) | RC5-INV-05, RC5-INV-06 |
| | ambos válidos → `[]` | RC5-INV-05 |
| `constructor` | `errores.length > 0` → `throw` / `=== 0` → crea | base; RC5-INV-06, RC5-INV-08 |
| `esConfirmado` | `true` | base `…invitado válido…` |
| | `false` | RC5-INV-01, RC5-INV-02 |
| `cambiarEstado` | estado inválido → `throw` (sin modificar) | base (`"Declinado"`); RC5-INV-04 |
| | estado válido → cambia | base (Pendiente → Confirmado); RC5-INV-02 (ida y vuelta), RC5-INV-03 (mismo estado) |
| `fromJSON` | `!json` | base (`null`); RC5-INV-09 (`undefined`, `0`) |
| | `typeof json !== "object"` | RC5-INV-09 (`"Ana"`, `42`) |
| | `Array.isArray(json)` | base (`[]`) |
| | objeto → constructor (falla / ok) | RC5-INV-10 / base *round-trip*, RC5-INV-11 |

#### `ListaInvitados`

| Método | Rama | Cubierta por |
|---|---|---|
| `agregar` | datos inválidos (propaga, sin efecto parcial) / válidos | base; RC5-LI-01 |
| `eliminar` | nombre no texto o en blanco → `throw` | base (`""`); RC5-LI-02 (`null`, `undefined`, `0`, `"   "`) |
| | `indice === -1` → `false` | base (`"Inexistente"`); RC5-LI-03 (lista vacía), RC5-LI-05 (parcial) |
| | coincidencia → `splice` y `true` | base (`"jose perez"`); RC5-LI-04 (solo la 1ª de dos duplicados) |
| `contarAsistencia` | colección vacía (callback no se ejecuta) | base `debería empezar vacía` |
| | `if (esConfirmado())` | RC5-LI-06 (solo confirmados) |
| | `else` | RC5-LI-06 (solo pendientes) |
| | ambas ramas en la misma corrida | base (2 + 1); RC5-LI-07 (después de una transición) |
| `fromJSON` | `!json` / `typeof` / `!Array.isArray(json.invitados)` | base (`null`, `"no-es-array"`); RC5-LI-08 |
| | `invitados` vacío / con elementos | RC5-LI-09; base *round-trip* |
| | invitado anidado inválido | RC5-LI-10 |

#### `Evento`

| Método | Rama | Cubierta por |
|---|---|---|
| `validarDatos` | nombre inválido (solo) | RC5-EV-01 |
| | tipo inválido (solo) | RC5-EV-02 |
| | `!Number.isFinite(monto)` (solo) | RC5-EV-03 (`NaN`, `Infinity`, `"abc"`, `""`, `null`, `undefined`, `true`) |
| | `monto <= 0` (solo) | base (`"0"`, `"-100"`); RC5-EV-03 (`0`, `"0"`, `-0.01`) |
| | los tres inválidos | base (`"", "congreso", "-1"`); RC5-EV-06 |
| | todo válido → `[]` | base; RC5-EV-04 (`0.01`, `"1e6"`, tipos sin tilde) |
| `constructor` | `errores.length > 0` / `=== 0` | base; RC5-EV-05, RC5-EV-06 |
| `superaPresupuesto` | parámetro omitido → valor por defecto `0` | base (sin argumento); RC5-EV-07 |
| | `undefined` explícito → valor por defecto | RC5-EV-12 |
| | parámetro provisto | base (`0`, `50`); RC5-EV-10 (`100`, `"100"`) |
| | `total > estimado` → `true` | base; RC5-EV-09 (un centavo por encima) |
| | `total > estimado` → `false` | base (50%); RC5-EV-07 (vacío), RC5-EV-08 (igual), RC5-EV-10 |
| | descuento inválido → `throw` propagado | RC5-EV-11 |
| `fromJSON` | `!json` / `typeof` / `Array.isArray` | base (`null`, `[]`); RC5-EV-13 |
| | datos básicos inválidos → `throw` del constructor | RC5-EV-14 |
| | `json.presupuesto !== undefined` → `true` | base *round-trip*; RC5-EV-15 |
| | `json.presupuesto !== undefined` → `false` | base `…si faltan en el JSON`; RC5-EV-16 |
| | `json.invitados !== undefined` → `true` | base *round-trip*; RC5-EV-16 |
| | `json.invitados !== undefined` → `false` | base `…si faltan en el JSON`; RC5-EV-15 |
| | clave presente pero `null` (no es "ausente") | RC5-EV-17 |
| | componente anidado malformado | RC5-EV-18 |
| | presupuesto estimado como texto | RC5-EV-19 |

#### `Proveedor`

| Método | Rama | Cubierta por |
|---|---|---|
| `constructor` | `!esTextoNoVacio(nombre)` | base (`""`); RC5-PRV-01 |
| | `!esTextoNoVacio(categoria)` | base (`""`); RC5-PRV-01 |
| | `!esTextoNoVacio(unidad)` | base (`""`); RC5-PRV-01 |
| | `!Number.isFinite(precio)` | RC5-PRV-03 |
| | `precio < 0` | base (`-1`); RC5-PRV-03 (`-0.01`) |
| | todo válido (precio `0` incluido) | base; RC5-PRV-02, RC5-PRV-05 |
| | orden: textos antes que precio | RC5-PRV-04 |
| `coincideCon` | criterio no texto o en blanco → `false` | base (`""`, `null`); RC5-PRV-08 (`"   "`, `undefined`, `70000`) |
| | nombre coincide (1er operando del `\|\|`) | base (`"dj lucas"`, `"SONIDO"`); RC5-PRV-06 |
| | nombre no coincide, categoría sí (2º operando) | RC5-PRV-07 |
| | ninguno coincide | base (`"inexistente"`) |
| `fromJSON` | `!json` / `typeof` / `Array.isArray` | base (`null`, `[]`); RC5-PRV-09 |
| | objeto → constructor (falla / ok) | RC5-PRV-10 / base *round-trip* |

#### `CatalogoProveedores`

| Método | Rama | Cubierta por |
|---|---|---|
| `agregarProveedor` | no es `Proveedor` → `throw` | base (objeto plano); RC5-CAT-01 |
| | es `Proveedor` → se agrega | base |
| `buscar` | criterio inválido → `throw` | base (`""`, `null`); RC5-CAT-02 |
| | `filter`: colección vacía / 0 / 1 / varias coincidencias | RC5-CAT-03 / base / base / RC5-CAT-04 |
| `fromJSON` | `!json` / `typeof` / `!Array.isArray(json.proveedores)` | base (`null`, `"no-es-array"`); RC5-CAT-05 |
| | `proveedores` vacío / con elementos | RC5-CAT-06; base *round-trip* |
| | proveedor anidado inválido | RC5-CAT-07 |

**Resultado del inventario:** todas las ramas de `js/models/*.js` tienen al menos un spec asignado. **No hay ramas excluidas.**

### Ramas excluidas y casos no cubiertos a propósito

No se excluye ninguna rama de los modelos. Quedan fuera tres situaciones que **no son ramas sin cubrir**, y se justifican acá para que no parezcan un vacío:

1. **`throw` de `agregarItem`/`agregarProveedor` cuando se llaman desde `fromJSON`.** En `Presupuesto.fromJSON` y `CatalogoProveedores.fromJSON`, el elemento que se agrega sale de `ItemContratado.fromJSON`/`Proveedor.fromJSON`, que siempre devuelven una instancia válida o lanzan antes. Por ese camino la salvaguarda `instanceof` no puede activarse. Es código defensivo inalcanzable **desde `fromJSON`**, pero la misma rama sí se cubre llamando al método directamente (RC5-PRE-01, RC5-CAT-01). La matriz cuenta la rama una sola vez porque es la misma línea.
2. **`Validador.buscarOpcion(opciones, …)` con un `opciones` que no es array.** No es una rama del código: el método no valida `opciones` porque solo se llama con las constantes estáticas `Evento.TIPOS` e `Invitado.ESTADOS`. Pasar otra cosa queda fuera del contrato de la API interna y no se prueba.
3. **Desborde numérico (`Number.MAX_VALUE * 2`).** El constructor de `ItemContratado` acepta cualquier valor finito, así que un producto puede dar `Infinity`. No es una rama faltante (no hay ningún `if` que lo controle); RC5-IC-12 deja **documentado el comportamiento actual**. Si se decide acotar cantidades o precios, corresponde a una mejora del modelo (Dev POO), no a la suite.

### Reporte reproducible de cobertura (Chrome DevTools)

La matriz anterior se armó a mano. Para verificarla con una herramienta, sin instalar nada (el proyecto no tiene `package.json`), se usa la cobertura por bloques de V8 que trae Chrome/Edge:

1. Abrir `js/test/test-runner.html` en Chrome o Edge (o con `npx http-server -p 8080`, ver [Ejecución de Tests](#ejecución-de-tests)).
2. `F12` → menú `⋮` → *More tools* → **Coverage**. En el selector de tipo elegir **Per block** (no *Per function*: este último no distingue ramas dentro de un método).
3. Hacer clic en el botón de recargar del panel Coverage. Jasmine vuelve a correr la suite completa con la instrumentación activa.
4. Filtrar la tabla por `models/`. Para cada uno de los 8 archivos se ve el porcentaje de bytes sin usar; al abrir un archivo, el margen marca en **rojo** los bloques que nunca se ejecutaron y en **azul** los ejecutados.
5. **Criterio de aceptación:** ningún bloque en rojo dentro de `js/models/*.js`. Un bloque rojo es una rama que no aparece en la matriz y se debe registrar como hallazgo.
6. Exportar el reporte con el botón **Export** del panel (JSON) y guardarlo como evidencia junto a las capturas de `js/test/screenshots/`.

Para comprobar que cada spec ataca la rama que dice la matriz se puede hacer una **mutación manual**: invertir o eliminar una condición (por ejemplo, cambiar `indice >= this.#items.length` por `indice > this.#items.length` en `Presupuesto.eliminarItem`) y volver a correr la suite. El spec indicado en la matriz (en este caso, RC5-PRE-05) tiene que fallar. Después se revierte el cambio.

**Resultado de la verificación (23/11/2026):** se aplicó el procedimiento con la pestaña Coverage de DevTools sobre el runner servido con Live Server, durante la misma corrida de 212 specs. Se confirmó la **cobertura total de ramas** de las 8 clases de `js/models/` (`Validador`, `ItemContratado`, `Presupuesto`, `Invitado`, `ListaInvitados`, `Evento`, `Proveedor`, `CatalogoProveedores`), sin bloques sin ejecutar. Coincide con la matriz de trazabilidad: 0 ramas excluidas.

---

## Alcance y Limitaciones

- **Sin instrumentación de cobertura en la línea de comandos (Istanbul/nyc):** el proyecto no tiene `package.json` ni dependencias de build. La cobertura de líneas y ramas de `js/models/*.js` se acredita con la [matriz de trazabilidad](#matriz-de-trazabilidad-de-ramas) y se verifica con el [reporte de Chrome DevTools](#reporte-reproducible-de-cobertura-chrome-devtools), que tampoco requiere instalar nada (RC4). Para `storage.js` y `script.js` la cobertura sigue estimándose por comportamiento, como en la AO3.
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

### Hallazgo de la corrección RC6

Los specs RC6-03 encontraron un bug real en `js/utils/storage.js`. `eliminar()` y `listar()` leían `window.localStorage`/`window.sessionStorage` **fuera** del `try`, así que si el getter lanzaba `SecurityError` (incógnito estricto o iframe cruzado), la excepción llegaba al llamador, a pesar de que el contrato dice que ninguna operación lanza. Se corrigió leyendo `window[nombre]` dentro del `try` (`NOMBRES_STORAGE`). Al volver a poner el acceso fuera del `try` (verificación por mutación), la suite da 9 fallas; con el fix, 0. Detalle en `spec-tester-qa.md`, sección 6.4.

**Limitación observada, sin cambio de contrato:** si **ningún** storage se puede listar (por ejemplo, `key()` lanza en los dos), `listar()` devuelve `[]` y `limpiar()` devuelve `true`, porque no encontró nada para borrar, aunque en realidad no pudo inspeccionar el storage. RC6-04 y RC6-18 verifican solo que no lance, sin fijar este comportamiento, para no consolidarlo en la suite.


**Última actualización:** 23/11/2026 — corrección RC6 (resiliencia del storage ante fallas).
**Versión anterior:** 22/11/2026 — reescritura completa para la AO4.
**Tester QA (AO4):** Facundo Guiraldes (@FacundoGuiraldes).
**Colaboración con:** Desarrolladora JS POO - Carola Benvenuto (@carolabenvenuto-uces) · Desarrolladora JS Eventos + DOM - Valeria Silva (@ValeriaMSilva).
**Versión AO3 (funciones `flujo*()` basadas en `prompt()`/`alert()`):** disponible en el historial de git de este archivo.
