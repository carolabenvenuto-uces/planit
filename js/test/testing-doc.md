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
2. El runner carga, en orden: el bundle de Bootstrap 5.3.3 (misma URL e integridad que `index.html`, necesario para los specs de integración RC14/RC15), `js/models/*.js`, `js/utils/storage.js`, `js/script.js` (código a testear), y luego `models.spec.js`, `storage.spec.js`, `script.spec.js` (las 3 suites). `script.js` arranca automáticamente al cargar la página (`DOMContentLoaded`) contra el fixture de DOM embebido en el propio `test-runner.html`; cada test de `script.spec.js` restaura ese fixture a un estado conocido en su `beforeEach` (función `restaurarEstadoInicial()`), así el orden aleatorio de Jasmine no afecta el resultado.
3. Verificar resultados en la interfaz de Jasmine (verde = pasando, rojo = fallando).

### Ejecución reproducible por línea de comandos

> **Corrección RC20.** La versión anterior de esta sección indicaba `node js/test/run-jasmine.js`, pero no era reproducible desde un checkout limpio: el repositorio no tenía `package.json` ni lockfile (ambos estaban excluidos en `.gitignore`), así que la dependencia `playwright` que el script importa no quedaba declarada en ningún lado. Ahora se versionan `package.json` (con `playwright` fijado en `1.64.1` como `devDependency` y los scripts de npm) y `package-lock.json` (con la URL y el hash de integridad `sha512` de cada paquete), y se quitaron ambos del `.gitignore`.

**Requisitos previos:** Git y Node.js 20 o superior (incluye npm). No hace falta instalar nada de forma global.

**Procedimiento desde un checkout limpio:**

1. Clonar el repositorio y entrar a la carpeta:
   ```
   git clone https://github.com/carolabenvenuto-uces/planit.git
   cd planit
   ```
2. Instalar las dependencias exactas del lockfile (instalación determinista; `npm ci` falla si `package.json` y `package-lock.json` no coinciden, en vez de resolver versiones nuevas):
   ```
   npm ci
   ```
3. Descargar el navegador Chromium que usa Playwright (paso único por máquina; los binarios no son un paquete npm y por eso no los cubre el lockfile):
   ```
   npm run test:install-browsers
   ```
   En Linux sin las librerías de sistema de Chromium, usar `npx playwright install --with-deps chromium`.
4. Ejecutar la suite de Jasmine por consola:
   ```
   npm test
   ```
   Salida esperada (la semilla cambia en cada corrida porque Jasmine aleatoriza el orden):
   ```
   111 specs, 0 failures, randomized with seed 12345
   ```

**Scripts disponibles en `package.json`:**

| Script | Comando | Para qué sirve |
|---|---|---|
| `npm test` | `node js/test/run-jasmine.js` | Corre la suite en Chromium headless e imprime el resumen. Código de salida `0` si todo pasa, `1` si hay fallas. |
| `npm run test:browser` | `node js/test/open-runner.js` | Abre `test-runner.html` en un Chromium con ventana visible para inspeccionar el reporter HTML de Jasmine. Equivale a abrir el archivo a mano (ver "Pasos para Ejecutar"). |
| `npm run test:install-browsers` | `playwright install chromium` | Descarga el Chromium de la versión de Playwright fijada en el lockfile. |
| `npm run test:screenshots` | `node js/test/take-screenshots.js` | Regenera las capturas de evidencia (ver abajo). |

`run-jasmine.js` (commiteado desde la corrección de AO3, RC13, PR #99) abre `test-runner.html` en Chromium headless con Playwright, espera el resumen de Jasmine y lo imprime. Termina con código de salida `1` si hay specs fallidos o si se registró algún `console.error`/`pageerror` durante la corrida (por eso los tests que ejercitan una ruta de error esperada de `Almacenamiento`, que loguea con `console.error` por diseño, usan `spyOn(console, "error")`).

### Capturas de pantalla (evidencia visual)
```
npm run test:screenshots
```
Genera 4 PNG en `js/test/screenshots/` (`ao4-general.png`, `ao4-models.png`, `ao4-storage.png`, `ao4-script.png`) abriendo `test-runner.html` con la librería `playwright` (la misma que usa `run-jasmine.js`) y recortando el elemento `.jasmine-suite` correspondiente a cada suite.

### Prueba interactiva con el servidor oficial `@playwright/mcp` (RC27)

La evidencia de Playwright MCP se generó en una sesión real contra el servidor oficial **`@playwright/mcp`** 0.0.86, arrancado con:

```
npx -y @playwright/mcp@latest --headless --browser chromium --output-dir .
```

Un cliente MCP (`js/test/mcp-evidence/mcp-session.mjs`, hecho con el SDK oficial `@modelcontextprotocol/sdk` sobre stdio) levanta `index.html` en `http://localhost:5500` y ejecuta 18 `tools/call` con los nombres canónicos del servidor: `browser_navigate`, `browser_snapshot`, `browser_click` (sobre `.btn-sumar-evento` y `.btn-ver-detalle`), `browser_wait_for`, `browser_evaluate`, `browser_take_screenshot`, `browser_console_messages` y `browser_close`. Verifica el Toast al sumar un servicio desde una tarjeta, el Modal de detalle completado con los `data-service-*` y el Toast al sumar desde el Modal.

**Resultado: `PASS`, 6/6 aserciones** (23/11/2026). Todo queda en `js/test/mcp-evidence/`: log JSON completo con cada request y response, 3 capturas tomadas por el servidor, snapshots `.yml` y log de consola. La tabla de llamadas con entradas y salidas está en `docs/03-specs/actividad-obligatoria-4/spec-tester-qa.md`, sección 3.1.

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
| `storage.spec.js` — RC7: serialización fallida (`RC7-01` a `RC7-10`) | 10 |
| `storage.spec.js` — RC7: aislamiento entre storages (`RC7-11` a `RC7-13`) | 3 |
| `storage.spec.js` — RC7: ruteo efectivo a `sessionStorage` (`RC7-14` a `RC7-17`) | 4 |
| `storage.spec.js` — RC7: limpieza sin residuos (`RC7-18` a `RC7-21`) | 4 |
| `script.spec.js` — Integración de controlador contra DOM (incluye 3 regresiones) | 21 |
| `script.spec.js` — Integración Controlador y UI: Modal (RC14), Toast con y sin Bootstrap (RC15), carga nueva (RC16) | 13 |
| **Total** | **124** |

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

- **Sin cobertura automatizada de código (Istanbul/nyc):** igual que en la AO3, la cobertura se estima revisando manualmente qué comportamiento ejercita cada test.
- **Requiere conexión a internet** para cargar Jasmine (y, si se agregara en el futuro, Bootstrap) desde CDN.
- **El Modal de detalle de servicio y el Toast de confirmación** (migrados de `js/componentes-bootstrap.js` a `js/script.js` en PR #109, Issue #68) **no están en el fixture de `script.spec.js`**: `configurarComponentesBootstrap()` los omite sin error si no existen en el DOM, así que su ausencia no rompe la suite. Se decidió no agregarlos a la suite automatizada porque dependen del bundle de Bootstrap (animaciones de modal/toast con temporización propia, difícil de testear de forma determinística en Jasmine sin agregar esperas artificiales) y porque ya se verificaron manualmente con Playwright antes de abrir la PR #109 (ver esa PR para la evidencia: completado de datos del Modal desde `data-service-*`, Toast con el servicio correcto desde el Modal y desde una tarjeta directa). Esos mismos tres comportamientos quedan cubiertos por la sesión con el servidor `@playwright/mcp` (ver "Prueba interactiva con el servidor oficial `@playwright/mcp`"), que se corre aparte de `run-jasmine.js`. Dentro de la suite Jasmine siguen siendo deuda de testing documentada.
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

**Última actualización:** 23/11/2026: evidencia de la sesión con el servidor oficial `@playwright/mcp` (corrección RC27). Versión anterior: 22/11/2026, reescritura completa para la AO4.
**Tester QA (AO4):** Facundo Guiraldes (@FacundoGuiraldes).
**Colaboración con:** Desarrolladora JS POO - Carola Benvenuto (@carolabenvenuto-uces) · Desarrolladora JS Eventos + DOM - Valeria Silva (@ValeriaMSilva).
**Versión AO3 (funciones `flujo*()` basadas en `prompt()`/`alert()`):** disponible en el historial de git de este archivo.
