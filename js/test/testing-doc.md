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

### Cobertura por Tipo de Test
Conteo exacto (no aproximado) de `it()` por categoría, uno por uno:

| Tipo | Cantidad |
|---|---|
| `models.spec.js` — Happy path / métodos de negocio | 42 |
| `models.spec.js` — Validación de errores (`toThrowError`) | 14 |
| `models.spec.js` — Serialización (`toJSON`/`fromJSON`) | 15 |
| `storage.spec.js` — CRUD y manejo de errores de `Almacenamiento` | 19 |
| `storage.spec.js` — RC6: resiliencia ante storage ausente/inaccesible, `SecurityError`, errores de lectura/borrado/listado y cuota multi-navegador | 63 |
| `script.spec.js` — Integración de controlador contra DOM (incluye 3 regresiones) | 21 |
| **Total** | **174** |

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

### Hallazgo de la corrección RC6

Los specs RC6-03 encontraron un bug real en `js/utils/storage.js`. `eliminar()` y `listar()` leían `window.localStorage`/`window.sessionStorage` **fuera** del `try`, así que si el getter lanzaba `SecurityError` (incógnito estricto o iframe cruzado), la excepción llegaba al llamador, a pesar de que el contrato dice que ninguna operación lanza. Se corrigió leyendo `window[nombre]` dentro del `try` (`NOMBRES_STORAGE`). Al volver a poner el acceso fuera del `try` (verificación por mutación), la suite da 9 fallas; con el fix, 0. Detalle en `spec-tester-qa.md`, sección 6.4.

**Limitación observada, sin cambio de contrato:** si **ningún** storage se puede listar (por ejemplo, `key()` lanza en los dos), `listar()` devuelve `[]` y `limpiar()` devuelve `true`, porque no encontró nada para borrar, aunque en realidad no pudo inspeccionar el storage. RC6-04 y RC6-18 verifican solo que no lance, sin fijar este comportamiento, para no consolidarlo en la suite.

---

**Última actualización:** 23/11/2026 — corrección RC6 (resiliencia del storage ante fallas).
**Versión anterior:** 22/11/2026 — reescritura completa para la AO4.
**Tester QA (AO4):** Facundo Guiraldes (@FacundoGuiraldes).
**Colaboración con:** Desarrolladora JS POO - Carola Benvenuto (@carolabenvenuto-uces) · Desarrolladora JS Eventos + DOM - Valeria Silva (@ValeriaMSilva).
**Versión AO3 (funciones `flujo*()` basadas en `prompt()`/`alert()`):** disponible en el historial de git de este archivo.
