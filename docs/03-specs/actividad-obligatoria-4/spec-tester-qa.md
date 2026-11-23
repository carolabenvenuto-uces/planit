# Especificación Técnica (Spec) - Tester QA

- **Proyecto:** PlanIT - Plataforma All-in-One de Organización & Experiencias
- **Entrega:** Actividad Obligatoria N° 4
- **Rol:** Tester QA
- **Responsable:** Facundo Guiraldes (@FacundoGuiraldes)
- **Rama:** `feature/tester-qa-specs`
- **Issue principal:** [#106](https://github.com/carolabenvenuto-uces/planit/issues/106)
- **Fecha:** 18 de noviembre de 2026

---

## MOMENTO 1: Planificación Previa (ANTES de escribir cualquier test)

### 1. Punto de partida

La suite actual (`js/test/script.spec.js`) quedó con 82 `it()` tras la corrección de la AO3 (RC8–RC13, PR #94 a #99), testeando la lógica de negocio que en ese momento vivía en `js/script.js`. Con la AO4 esa lógica se migra a `js/models/` (PR #102) y `js/script.js` pasa a ser un controlador puro (PR #104). Por lo tanto gran parte de `script.spec.js` deja de tener sentido tal cual está escrita: hay que decidir, test por test, cuáles migran a `models.spec.js` (porque ahora prueban un método de una clase) y cuáles se reescriben como pruebas de integración del controlador contra el DOM.

El runner de Playwright (`js/test/run-jasmine.js`) ya está commiteado en el repo desde esa misma corrección y sirve sin cambios para esta entrega: carga `js/test/test-runner.html` en un Chromium headless y vuelca el resumen de Jasmine.

### 2. Plan de Testing

| Archivo | Qué cubre | Casos previstos |
|---|---|---|
| `js/test/models.spec.js` | Constructores, métodos de negocio, validaciones y `toJSON()`/`fromJSON()` de `Validador`, `ItemContratado`, `Presupuesto`, `Invitado`, `ListaInvitados`, `Evento`, `Proveedor`, `CatalogoProveedores` (PR #102). | Happy path de cada constructor; validaciones que deben lanzar `Error` (cantidad/precio negativo, nombre vacío, estado/tipo inválido); serialización ida y vuelta (`fromJSON(x.toJSON())` debe reconstruir un objeto equivalente). |
| `js/test/storage.spec.js` | CRUD de `js/utils/storage.js` (`Almacenamiento.guardar/cargar/obtener/actualizar/eliminar/listar/limpiar`, spec-dev-storage.md). | Guardar y recuperar un valor; `cargar()` de una clave inexistente devuelve `null`; manejo de JSON corrupto sin lanzar excepción hacia el llamador; `limpiar()` no afecta claves de otro prefijo. |
| `js/test/script.spec.js` (refactor) | Lo que siga siendo responsabilidad del controlador una vez mergeadas las PR #102 y #104: que delega en los modelos y no duplica lógica de negocio. | Se revisa caso por caso contra el `js/script.js` final; los tests de validación pura de negocio se retiran de aquí porque pasan a `models.spec.js`. |

### 3. Herramientas a Utilizar

- **Copilot Agent Mode** para generar un primer borrador de `models.spec.js` y `storage.spec.js`, adjuntando `js/models/*.js`, `js/utils/storage.js` y `js/script.js` como contexto.
- **Playwright** (`js/test/run-jasmine.js`, ya commiteado) para ejecutar `test-runner.html` en un navegador real y verificar PASS/FAIL. No se usa el MCP `@playwright/mcp` de forma interactiva porque el script ya resuelve lo mismo de forma reproducible por línea de comandos (`node js/test/run-jasmine.js`), con el mismo criterio ya aplicado en la corrección de AO3.

### 4. Criterios de Aceptación (Checklist)

- [ ] `spec-tester-qa.md` commiteado antes que cualquier archivo spec de testing.
- [ ] `js/test/models.spec.js` con tests de constructores, métodos, validaciones y serialización de las 8 clases.
- [ ] `js/test/storage.spec.js` con tests de CRUD y manejo de errores.
- [ ] `js/test/script.spec.js` refactorizado contra la arquitectura final (POO + controlador).
- [ ] Las tres suites ejecutadas con `node js/test/run-jasmine.js`, 0 fallas, resultado documentado.
- [ ] `js/test/testing-doc.md` actualizado con la nueva estructura, instrucciones por módulo y métricas de cobertura.
- [ ] Bugs encontrados reportados como issues en GitHub (título, comportamiento esperado vs. obtenido, pasos para reproducir, test case que falla) y asignados al rol correspondiente.

---

## MOMENTO 2: Evidencia de Cierre (AL CERRAR la tarea)

### 1. Prompt utilizado

- **Herramienta:** Claude (Anthropic), con acceso de lectura al repositorio (diffs, commits, archivos completos) y la consigna de la AO4 como contexto. Este criterio es consistente con el adoptado en el cierre de la AO3 (ver `docs/03-specs/actividad-obligatoria-3/spec-devops.md`, sección de obstáculos): las revisiones/generaciones con GitHub Copilot Agent Mode resultaron incompletas en esa entrega (no analizaba todos los archivos del diff ni detectaba discrepancias con la consigna), mientras que con Claude sí se detectaron los casos reales. Cada fragmento generado se contrasta manualmente contra `js/models/*.js`, `js/utils/storage.js` y `js/script.js` antes de commitearse.
- **Contexto provisto:** este `spec-tester-qa.md` (MOMENTO 1), `js/models/*.js`, `js/utils/storage.js` y `js/script.js` ya mergeados a `develop`.
- **Prompt:**
  ```text
  Implementá el plan de testing del MOMENTO 1 de spec-tester-qa.md para la AO4. js/test/script.spec.js actual
  testea funciones de la AO3 (validarDatosEvento, flujoCrearEvento, etc.) que ya no existen: hay que reemplazarlo
  por completo, no parchearlo. Dividí la suite en js/test/models.spec.js (unitarios de las 8 clases de
  js/models/: constructores, validaciones que lanzan Error, métodos de negocio, fromJSON(toJSON())),
  js/test/storage.spec.js (CRUD de Almacenamiento, incluyendo las rutas de error) y js/test/script.spec.js
  (integración del controlador contra un fixture de DOM en test-runner.html con los mismos id/data-* que
  index.html, cubriendo los 4 flujos). Agregá en script.spec.js una regresión específica para cada uno de los
  bugs ya corregidos durante el code review de PR #104 (nombres duplicados de invitados, conflation de
  categoría/nombre en el catálogo). Corré la suite completa varias veces con node js/test/run-jasmine.js para
  descartar dependencia de orden entre specs, y documentá el resultado en testing-doc.md.
  ```

### 2. Fragmento generado y ajustes manuales

**Fragmento generado** (`js/test/script.spec.js`, extracto literal y contiguo de las primeras líneas de `restaurarEstadoInicial()`; la función completa sigue reconstruyendo `estadoApp.evento` con sus ítems de presupuesto y sus invitados directamente en memoria, y termina llamando a `recalcularPresupuesto(ui)`, `renderInvitados(ui)` y `filtrarCatalogo(ui)` antes de devolver `ui` — ver el archivo commiteado para el cuerpo completo):

```javascript
function restaurarEstadoInicial() {
    const ui = obtenerReferenciasUI();

    Almacenamiento.limpiar("planit:");

    ui.nombreEvento.value = "Casamiento de Sofi & Mateo";
    ui.fechaEvento.value = "2026-11-14";
    ui.tipoEvento.value = "boda";
    ui.presupuestoEstimado.value = "700000";
    ui.ubicacion.value = "Quinta El Ombú, Pilar, Buenos Aires";
    ui.descuentoPresupuesto.value = "0";
    ui.buscarCatalogo.value = "";
    ui.categoriaCatalogo.value = "";
    ui.nombreInvitado.value = "";
    ui.estadoInvitado.value = "Pendiente";

    Object.entries(FIXTURE_CANTIDADES).forEach(function ([id, valor]) {
        document.getElementById(id).value = valor;
    });
```

**Ajuste manual:** la primera versión generada no reseteaba `ui.btnGuardarEvento.disabled`, `ui.btnCalcularPresupuesto.disabled` ni `ui.btnAgregarInvitado.disabled` dentro de `restaurarEstadoInicial()`. Esto causaba **4 fallas intermitentes** (dependientes de la semilla aleatoria de Jasmine): un test que invalida el formulario a propósito deja el botón correspondiente deshabilitado, y si corría antes de otro test que necesitaba hacer click en ese mismo botón, el `.click()` no disparaba nada. Se diagnosticó biseccionando `restaurarEstadoInicial()` paso por paso con scripts de Playwright ad hoc hasta aislar la causa, y se corrigió agregando el reset explícito de los 3 `.disabled`. Documentado en detalle en `testing-doc.md` ("Un obstáculo real durante la escritura de `script.spec.js`").

**Otro ajuste manual:** un test de filtro de categoría intentaba poner el `<select>` de categoría en un valor con minúsculas/sin tilde ("decoración") para probar que el filtro no distingue mayúsculas. Eso no tiene sentido para un `<select>`: el navegador solo puede tomar el valor exacto de una de sus `<option>`, así que asignar un valor que no matchea ninguna deja el `<select>` en `""` (sin seleccionar nada) en vez de lanzar un error. Se corrigió el test para usar el valor exacto de la opción ("Decoración").

### 3. Resultados de ejecución

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

`node js/test/run-jasmine.js` termina con código de salida `0` en las 8 corridas (0 specs fallidos y 0 `console.error`/`pageerror` sin mockear).

Tras la revisión de Carola (PR #110) se agregaron 2 specs más: un test de `storage.spec.js` para el caso de storage lleno (`guardar()` debería devolver `false` si el storage está lleno, sin lanzar) y una regresión en `script.spec.js` para el bug de `escribirEnAlmacenamiento` (issue #111). La suite quedó en **111 specs** (71 + 19 + 21), reverificada 3 veces más con 0 fallas:

```
111 specs, 0 failures, randomized with seed 95988
111 specs, 0 failures, randomized with seed 03252
111 specs, 0 failures, randomized with seed 47556
```

Detalle completo de las 3 suites (71 + 19 + 21 specs) en `js/test/testing-doc.md`.

**Capturas de pantalla** (generadas con la librería Playwright vía `node js/test/take-screenshots.js`, ver nota sobre Playwright MCP más abajo) en `js/test/screenshots/`:
- `ao4-general.png`: vista completa del test runner, banner de resultado global (`111 specs, 0 failures`) y árbol completo de las 3 suites.
- `ao4-models.png`: detalle de `models.spec.js`.
- `ao4-storage.png`: detalle de `storage.spec.js` (incluye el test de storage lleno agregado en esta ronda).
- `ao4-script.png`: detalle de `script.spec.js`.

**Nota sobre Playwright MCP:** no tuve el servidor Playwright MCP conectado en la sesión donde se escribió esta suite. Las capturas se generaron igual con Playwright, pero vía la librería `playwright` (la misma que ya usa `run-jasmine.js`, commiteada como devDependency desde la corrección de la AO3) en un script dedicado (`js/test/take-screenshots.js`), no con el servidor MCP interactivo. El resultado visual es equivalente (mismo navegador Chromium, misma página, mismo reporter HTML de Jasmine); la salvedad queda documentada acá para que quede claro que no se usó el MCP en sí.

### 3.1. Corrección RC2: evidencia E2E mediante agente con automatización de navegador

> **Observación del docente (RC2):** "La evidencia de capturas refiere a Playwright como librería Node, pero la consigna exige ejecución mediante Playwright MCP; documentar el servidor MCP, prompt, ejecución y resultado."

Las capturas `ao4-*.png` descritas arriba se conservan como evidencia histórica de la suite Jasmine, pero no atienden la RC2 porque se generaron con un script Node. Para la corrección, un agente de IA ejecutó de forma interactiva los 4 flujos E2E sobre la aplicación PlanIT (`index.html`), sin scripts propios del repositorio, y tomó las capturas `01`–`04`.

**Estado:** ✅ Ejecutado el 23/11/2026 sobre la rama `fix/qa-rc2-playwright-mcp-evidence` (base `473b959`), servida con Live Server en `http://localhost:5500`.

#### a) Cliente, servidor y herramientas utilizadas (aclaración metodológica)

- **Cliente:** GitHub Copilot en Modo Agente, en VS Code.
- **Herramientas efectivamente invocadas:** las herramientas de navegador integradas del agente de Copilot en VS Code: `openBrowserPage`, `typeInPage`, `readPage`, `clickElement`, `screenshotPage` y `runPlaywrightCode`. Esta última ejecuta código Playwright sobre la página abierta por el agente.
- **Servidor configurado en el repositorio:** `.vscode/mcp.json` registra el servidor oficial `@playwright/mcp`, cuyas herramientas se denominan `browser_navigate`, `browser_type`, `browser_click`, `browser_take_screenshot`, etc.

  ```json
  "playwright": {
    "command": "npx",
    "args": ["-y", "@playwright/mcp@latest"]
  }
  ```

- **Salvedad:** los nombres de las herramientas invocadas no corresponden a los de `@playwright/mcp`. Es decir, la corrida **no** se hizo a través de ese servidor, sino de las herramientas de navegador integradas de Copilot. Se deja asentado para que la evidencia no se presente como algo distinto de lo que fue. Respecto de la observación original, la diferencia sustantiva sí se atiende: la ejecución ya no es un script Node escrito por el equipo, sino una sesión interactiva de un agente sobre la aplicación real, con el prompt, la secuencia de herramientas y el resultado documentados.

#### b) Prompt provisto al agente

```text
Navega a http://localhost:5500/index.html usando las herramientas de Playwright MCP. Ejecuta y captura los
siguientes 4 flujos de prueba E2E de la Actividad Obligatoria 4:
1. Flujo Crear Evento: Completa el formulario de evento con nombre "Conferencia Tech 2026", fecha futura
   válida, presupuesto 150000 y presiona Guardar. Captura la pantalla mostrando el evento creado y
   renderizado en el DOM.
2. Flujo Presupuesto: Modifica los gastos/costos en el módulo de presupuesto y verifica que el cálculo
   dinámico y el balance se actualicen en pantalla sin alertas nativas. Captura la pantalla.
3. Flujo Catálogo de Proveedores: Aplica el filtro por categoría "Catering" y selecciona un proveedor para
   agregarlo al evento. Captura la pantalla con los elementos filtrados.
4. Flujo Gestión de Invitados: Agrega dos invitados con nombre y correo válidos. Verifica que aparezcan en
   la lista del DOM y que persistan en localStorage. Captura la pantalla final.
Asegúrate de no disparar alert() nativos y confirma que la consola del navegador esté limpia de errores.
Guarda las capturas en js/test/screenshots/.
```

El formulario de invitados no tiene campo de correo (solo `#nombre-invitado` y `#estado-invitado`), así que el agente cargó nombre y estado de asistencia.

#### c) Flujo de ejecución (herramientas invocadas por el agente)

| # | Herramienta | Acción |
|---|---|---|
| 1 | `openBrowserPage` | Abrió `http://localhost:5500/index.html`. |
| 2 | `typeInPage` | Completó el nombre del evento ("Conferencia Tech 2026"). |
| 3 | `typeInPage` | Completó la fecha (`2027-06-15`). |
| 4 | `readPage` | Identificó el selector del presupuesto estimado. |
| 5 | `typeInPage` | Estableció el presupuesto en `150000`. |
| 6 | `clickElement` | Presionó "Guardar Cambios". |
| 7 | `screenshotPage` | Capturó el evento creado (`01-crear-evento.png`). |
| 8 | `typeInPage` | Redujo la cantidad de Catering a 100 unidades. |
| 9 | `clickElement` | Presionó "Calcular presupuesto". |
| 10 | `readPage` | Verificó el nuevo subtotal y el balance. |
| 11 | `screenshotPage` | Capturó el presupuesto (`02-presupuesto.png`). |
| 12 | `runPlaywrightCode` | Seleccionó "Catering" en `#categoria-catalogo`. |
| 13 | `clickElement` | Hizo clic en "Sumar al Evento". |
| 14 | `screenshotPage` | Capturó el catálogo (`03-catalogo.png`). |
| 15 | `typeInPage` | Completó el invitado pendiente. |
| 16 | `clickElement` | Agregó el invitado pendiente. |
| 17 | `typeInPage` | Completó el invitado confirmado. |
| 18 | `runPlaywrightCode` | Seleccionó "Confirmado" en `#estado-invitado`. |
| 19 | `clickElement` | Agregó el invitado confirmado. |
| 20 | `runPlaywrightCode` | Verificó los invitados en el DOM. |
| 21 | `runPlaywrightCode` | Verificó `planit:evento` en `localStorage`. |
| 22 | `screenshotPage` | Capturó la lista de invitados (`04-invitados.png`). |

Las capturas `02` y `03` de la primera corrida no reflejaban su flujo: en la `03` el filtro estaba en "Todas", con 3 proveedores, y en la `02` no se veían los importes. Se descartaron y se volvieron a tomar con el estado correspondiente en pantalla.

#### d) Resultado y verificación

| Captura (`js/test/screenshots/`) | Flujo | Verificación | Resultado |
|---|---|---|---|
| `01-crear-evento.png` | Crear evento | Confirmación visible: "Evento guardado. Conferencia Tech 2026 · boda · 2027-06-15 · Quinta El Ombú, Pilar, Buenos Aires · Presupuesto estimado: $150.000". | ✅ Aprobado |
| `02-presupuesto.png` | Calcular presupuesto | Cantidad de Catering modificada de 120 a 100. Según la lectura `readPage` del agente (paso 10), el subtotal se recalculó de $580.000 a $510.000 (20 × $3.500 = $70.000). La captura muestra la cantidad modificada y la alerta dinámica en el DOM ("El total supera el presupuesto estimado de $150.000"). En el ancho móvil la tabla tiene scroll horizontal y la columna de importes queda fuera del recorte, por lo que el valor de $510.000 se respalda en la lectura del agente y no en la imagen. | ✅ Aprobado |
| `03-catalogo.png` | Catálogo | Selector en "Catering", "1 proveedor encontrado" y tarjeta de "Gourmet Finger Food"; proveedor sumado al evento con "Sumar al Evento". | ✅ Aprobado |
| `04-invitados.png` | Invitados | "Invitado Pendiente QA" (Pendiente) e "Invitado Confirmado QA" (Confirmado) renderizados en la tabla; métricas actualizadas (Confirmados: 4, Pendientes: 3); persistencia verificada en `planit:evento` de `localStorage` (paso 21). | ✅ Aprobado |

- **Diálogos nativos:** no se dispararon `alert()` ni `confirm()` durante la corrida, lo que es consistente con que `js/script.js` no los invoca. Toda la retroalimentación se muestra en el DOM (`#confirmacion-evento`, alerta de presupuesto, `#feedback-invitados`).
- **Consola del navegador:** sin errores JavaScript de la aplicación. Solo hubo advertencias de terceros, del reproductor embebido de YouTube.

### 4. Bugs reportados

No se encontraron bugs nuevos en esta etapa: los 3 bugs reales de la AO4 fueron encontrados y corregidos **antes**, durante el code review de PR #104 (ver `spec-devops.md`, MOMENTO 2), no durante la escritura de esta suite. Siguiendo el pedido de Carola en la review de PR #110, se los reportó formalmente como issues de GitHub (no quedaban documentados más que en los comentarios del code review), cada una con comportamiento esperado vs. obtenido, pasos para reproducir, el test de regresión como test case que falla, etiqueta `bug` y asignada a @ValeriaMSilva (Dev Eventos+DOM, dueña del código de `js/script.js` donde viven los 3):

| Issue | Bug | Commit de fix | Test de regresión |
|---|---|---|---|
| [#111](https://github.com/carolabenvenuto-uces/planit/issues/111) | `escribirEnAlmacenamiento` no reportaba fallos reales de guardado | `fb04e75` | Flujo 1, "debería avisar al usuario cuando el guardado falla" |
| [#112](https://github.com/carolabenvenuto-uces/planit/issues/112) | Acciones de invitados ambiguas con nombres duplicados | `5479820` | Flujo 4, "debería distinguir por posición entre dos invitados con el mismo nombre al eliminar" |
| [#113](https://github.com/carolabenvenuto-uces/planit/issues/113) | Filtro de categoría del catálogo matcheaba por nombre | `64f3ccc` | Flujo 3, "no debería incluir un proveedor cuyo NOMBRE contiene el texto de otra categoría al filtrar por categoría" |

Las 3 issues están cerradas, referenciando su commit de fix.

### 4.1. Corrección RC7 (revisión docente): serialización extrema, aislamiento y limpieza

**Observación del docente:** *"RC7 — Agregar casos de serialización fallida, ciclos, BigInt, toJSON que lanza, aislamiento entre storages, ruteo efectivo a sessionStorage y limpieza sin residuos."*

Se agregó a `js/test/storage.spec.js` el bloque `describe("Serialización extrema, aislamiento y ciclo de vida de almacenamiento (RC7)")` con **21 specs** (`RC7-01` a `RC7-21`; el identificador va al inicio del título de cada `it()`, así queda visible en el reporter de Jasmine). No se modificó `js/utils/storage.js`: todos los casos pasan contra el contrato ya mergeado en PR #108.

**Matriz de casos RC7:**

| ID | Grupo | Caso | Resultado esperado (contrato) |
|---|---|---|---|
| RC7-01 | Serialización fallida | Ciclo directo (`obj.self = obj`) | `guardar()` → `false`, no lanza, `console.error` con `TypeError`, la clave no queda en ningún storage |
| RC7-02 | Serialización fallida | Ciclo indirecto (`a → b → c → a`) | `false` + `TypeError`; `cargar()` → `null` |
| RC7-03 | Serialización fallida | Ciclo a través de un array (`lista.push(lista)`) | `false` + `TypeError`; sin escritura |
| RC7-04 | Serialización fallida | Ciclo sobre una clave con valor válido previo | `false`; el valor previo se conserva intacto |
| RC7-05 | BigInt | `BigInt` en la raíz | `false`, no lanza, `console.error` con `TypeError` |
| RC7-06 | BigInt | `BigInt` anidado (objeto > array > BigInt) | `false`; sin residuos en `localStorage` ni `sessionStorage` |
| RC7-07 | `toJSON()` disruptivo | `toJSON()` lanza un error propio (`ErrorDeSerializacion`) | `false`, no lanza; `console.error` recibe **esa misma instancia** de error |
| RC7-08 | `toJSON()` disruptivo | `toJSON()` lanza (`RangeError`) en un objeto anidado | `false`; el valor previo de la clave se conserva |
| RC7-09 | Serialización fallida | `actualizar()` (alias) con un ciclo | Mismo manejo seguro que `guardar()` |
| RC7-10 | Resiliencia | Escritura válida después de una fallida | `true`; el módulo no queda en un estado inconsistente |
| RC7-11 | Aislamiento | Clave homónima sembrada en `sessionStorage` + `guardar()` | Escribe solo en `localStorage`; el valor de `sessionStorage` queda intacto |
| RC7-12 | Aislamiento | Valor presente solo en `sessionStorage` | `cargar()` → `null` (no hay *fallback* cruzado) |
| RC7-13 | Aislamiento | Serie de `guardar`/`actualizar`/`cargar`/`obtener` | Snapshot completo de `sessionStorage` idéntico antes y después |
| RC7-14 | Ruteo | `guardar()`/`actualizar()`, incluida `planit:detalles-evento` | Todo `setItem` se invoca sobre `window.localStorage` (regresión del 4° hallazgo de PR #108) |
| RC7-15 | Ruteo | `eliminar()` de una clave que solo existe en `sessionStorage` | `removeItem` se invoca sobre `window.sessionStorage` (y sobre `localStorage`); la clave desaparece |
| RC7-16 | Ruteo | `listar()` con una clave solo en `sessionStorage` | La clave aparece en el resultado |
| RC7-17 | Ruteo | `removeItem` falla solo en `sessionStorage` | `eliminar()` → `false`, no lanza, igual borra de `localStorage` |
| RC7-18 | Limpieza | 25 claves del prefijo repartidas en ambos storages (algunas en los dos) | `limpiar()` → `true`; 0 claves del prefijo en ambos storages |
| RC7-19 | Limpieza | Claves de terceros y claves parecidas (`otra-app:sesion`, `planit:test`, `xplanit:test-a`, `PLANIT:TEST-a`, `planit:testa`) | Intactas, con su valor exacto, en ambos storages |
| RC7-20 | Limpieza | Segunda llamada a `limpiar()` | `true` y ningún cambio (idempotente) |
| RC7-21 | Limpieza | Una entrada no se puede borrar de `sessionStorage` | `limpiar()` → `false` (el residuo se reporta, no se oculta) |

**Justificación técnica de la cobertura:**

- **Fallos de serialización:** `JSON.stringify` lanza `TypeError` ante estructuras cíclicas (sin importar si el ciclo es directo, indirecto o pasa por un array) y ante cualquier `BigInt` (no hay representación JSON estándar). Si `toJSON()` lanza, `JSON.stringify` propaga **el error original**, no un `TypeError`. Por eso RC7-07 verifica la instancia exacta y RC7-08 usa un `RangeError`: se prueba que `guardar()` captura cualquier error de serialización y no solo `TypeError`. En `storage.js` la serialización ocurre dentro del `try` y **antes** de `setItem`, así que un fallo nunca deja una escritura parcial. RC7-04 y RC7-08 lo verifican conservando el valor previo.
- **Aislamiento y ruteo:** `resolverStorage()` enruta a `sessionStorage` solo las claves que estén en `CLAVES_SESSION`. Hoy ese conjunto está vacío a propósito (ver el 4° hallazgo de `spec-dev-storage.md`) y el módulo **no expone un parámetro ni una bandera** para elegir el storage. Por lo tanto, el ruteo "efectivo" hacia `window.sessionStorage` se verifica donde realmente existe: en `eliminar()`, `listar()` y `limpiar()`, que recorren ambos storages (RC7-15 a RC7-18, verificando con `calls.all()[i].object` sobre qué instancia de `Storage` se invocó cada método). Además, RC7-14 fija que las escrituras van **estrictamente** a `localStorage`. Si en el futuro se agrega una clave a `CLAVES_SESSION`, RC7-14 obliga a actualizar el spec de forma explícita.
- **Limpieza sin residuos:** RC7-18 usa 25 claves para detectar el error típico de borrar mientras se itera por índice (que saltea entradas). En ese caso quedarían claves huérfanas y la aserción final contra un recorrido nativo de ambos storages fallaría. RC7-19 compara snapshots completos `{clave: valor}` de todo lo que está fuera del prefijo, así que cualquier efecto colateral sobre claves ajenas se detecta.
- **Idempotencia de la suite:** el bloque captura `Storage.prototype.setItem/removeItem` nativos antes de cualquier `spyOn`. Su `afterEach` neutraliza los spies que hayan quedado lanzando (`and.callThrough()`), borra con los métodos nativos todas las claves de `planit:test-` de ambos storages y restaura a su valor previo cada clave externa sembrada (terceros y `planit:detalles-evento`). `console.error` se espía en el `beforeEach` del bloque, porque las rutas de error loguean por diseño.

**Resultado de ejecución:** la suite pasa de 111 a **132 specs** (71 + 40 + 21). En esta máquina no había Node.js instalado, así que no se pudo usar `node js/test/run-jasmine.js`. Se ejecutó `js/test/test-runner.html` con Chrome headless (`--headless=new --virtual-time-budget=20000 --dump-dom`), leyendo el banner de Jasmine del DOM resultante, con 6 semillas distintas:

```
132 specs, 0 failures, randomized with seed 44244
132 specs, 0 failures, randomized with seed 11111
132 specs, 0 failures, randomized with seed 22222
132 specs, 0 failures, randomized with seed 33333
132 specs, 0 failures, randomized with seed 44444
132 specs, 0 failures, randomized with seed 55555
```

Salvedad: este método no captura `console.error` ni `pageerror` como sí lo hace `run-jasmine.js`. Antes de mergear conviene correr `node js/test/run-jasmine.js` una vez para confirmar el código de salida `0`.

**Hallazgo durante RC7 (pendiente de reportar como issue):** los valores que `JSON.stringify` convierte en `undefined` **sin lanzar** (una función, un `Symbol` o un objeto cuyo `toJSON()` devuelve `undefined`) hacen que `guardar()` devuelva `true`. En ese caso, `setItem` guarda el texto literal `"undefined"` y el siguiente `cargar()` devuelve `null`. Se verificó en Chrome con un script ad hoc:

```
funcion: guardar=true crudo=undefined cargar=null
symbol: guardar=true crudo=undefined cargar=null
toJSON-undefined: guardar=true crudo=undefined cargar=null
```

Esto contradice el contrato que ya se testea para `guardar(clave, undefined)` (devuelve `false`). No se agregó como spec porque fallaría, y corregirlo es un cambio de `js/utils/storage.js`, fuera del alcance de RC7. La corrección sugerida es verificar `typeof JSON.stringify(valor) !== "string"` antes de `setItem` y devolver `false`. Corresponde reportarlo como issue (`bug`) al rol de Storage, con este caso como test que falla.

### 5. Checklist de cierre

- [x] `spec-tester-qa.md` commiteado antes que cualquier archivo spec de testing.
- [x] `js/test/models.spec.js` con tests de constructores, métodos, validaciones y serialización de las 8 clases (71 specs).
- [x] `js/test/storage.spec.js` con tests de CRUD y manejo de errores (19 specs).
- [x] `js/test/script.spec.js` refactorizado contra la arquitectura final (POO + controlador), con fixture de DOM propio en `test-runner.html` (21 specs).
- [x] Las tres suites ejecutadas con `node js/test/run-jasmine.js`, 0 fallas, resultado documentado (11 corridas con semillas distintas).
- [x] `js/test/testing-doc.md` actualizado con la nueva estructura, instrucciones por módulo y métricas de cobertura.
- [x] Bugs encontrados reportados como issues en GitHub — los 3 bugs de PR #104 están reportados como issues (#111, #112, #113), cerradas referenciando sus commits de fix.
- [x] **RC14**: integración del Modal de detalle: `show.bs.modal` con `relatedTarget`, datos completos del servicio, ARIA y foco con Bootstrap real, y propagación al botón "Sumar al Evento" del Modal (INT-RC14-01 a 05, sección 6).
- [x] **RC15**: integración de cada `.btn-sumar-evento` (3 tarjetas + Modal) con Bootstrap presente (`bootstrap.Toast` invocado) y ausente (degradación sin errores), más la degradación agregada en `js/script.js` (INT-RC15-01 a 05, sección 6).
- [x] **RC16**: persistencia y restauración en una carga nueva de la página (reinicio de memoria y DOM + `DOMContentLoaded`), con control negativo y caso de datos inválidos (INT-RC16-01 a 03, sección 6).
- [x] Suite ampliada ejecutada y resultado registrado en la sección 6.4: **124 specs, 0 failures**, en el navegador con `js/test/test-runner.html` sobre Live Server.

### 6. Integración Controlador y UI (observaciones docentes RC14, RC15 y RC16)

Observaciones atendidas:

- **RC14:** "Falta una integración que dispare `show.bs.modal` y verifique foco, datos completos del servicio y propagación al botón de sumar."
- **RC15:** "Falta una integración para cada botón `btn-sumar-evento`, verificando el Toast con Bootstrap presente y ausente."
- **RC16:** "Falta probar persistencia y restauración desde una carga nueva de la página; los round trips unitarios de Storage no reemplazan esta integración."

Se agregó a `js/test/script.spec.js` el bloque `describe("Integración - Controlador y UI (RC14, RC15, RC16)")`, con 13 specs nombrados con un identificador trazable.

#### 6.1. Matriz de casos de integración

| ID | Obs. | Caso | Resultado esperado |
|---|---|---|---|
| INT-RC14-01 | RC14 | `show.bs.modal` con `relatedTarget` (Flores Pilar) | Título, descripción, capacidad, duración, incluye, precio, `src` y `alt` de la imagen iguales a los `data-service-*` del disparador. |
| INT-RC14-02 | RC14 | `show.bs.modal` sin `relatedTarget` | El Modal y su botón "Sumar al Evento" no cambian. |
| INT-RC14-03 | RC14 | Apertura real con "Ver detalle" (Bootstrap) | `role="dialog"`, `aria-modal="true"`, sin `aria-hidden`, `aria-labelledby` con el servicio; foco dentro del Modal; al cerrar, `aria-hidden="true"` y el foco vuelve al disparador. |
| INT-RC14-04 | RC14 | Dos aperturas seguidas (Gourmet → Flores) | El botón del Modal tiene título y precio del último proveedor, sin datos del anterior. |
| INT-RC14-05 | RC14 | Abrir → "Sumar al Evento" del Modal | El Toast muestra el proveedor abierto y el Modal se cierra. |
| INT-RC15-01 | RC15 | Bootstrap presente, 3 botones de tarjeta | `bootstrap.Toast.getOrCreateInstance` y `show()` invocados en cada clic; texto y clase `show` correctos. |
| INT-RC15-02 | RC15 | Bootstrap presente, botón del Modal | `show()` invocado con el servicio del Modal. |
| INT-RC15-03 | RC15 | Bootstrap ausente desde el arranque, 3 botones de tarjeta | Sin errores (`window` ni `console.error`); Toast visible con clase `show`, texto correcto, `role="status"`/`aria-live`; se oculta tras `data-bs-delay`. |
| INT-RC15-04 | RC15 | Bootstrap ausente, botón del Modal | Sin errores; Toast degradado con el servicio del Modal. |
| INT-RC15-05 | RC15 | Bootstrap ausente, dos clics seguidos | El segundo clic reinicia el temporizador del Toast. |
| INT-RC16-01 | RC16 | Ciclo de vida completo (5 pasos) | Lo modificado en la UI se graba, se descarta de memoria y DOM, y se reconstruye fielmente al volver a disparar `DOMContentLoaded`. |
| INT-RC16-02 | RC16 | Control: carga nueva con storage vacío | Se muestran los datos del marcado (total $580.000, 3 invitados). |
| INT-RC16-03 | RC16 | Carga nueva con `planit:evento` inválido | Sin errores; aviso de datos dañados y caída a los datos de ejemplo. |

El detalle de disparos y aserciones de cada caso está en `js/test/testing-doc.md`, sección "Integración - Controlador y UI (RC14, RC15, RC16)".

#### 6.2. Justificación técnica: ciclo de vida completo (RC16)

Los round trips de `storage.spec.js` prueban que un `Evento` sobrevive `guardar(toJSON())` → `fromJSON(cargar())`, pero no que la **aplicación** use esos datos al arrancar. Entre el storage y lo que ve el usuario están `cargarEventoInicial()`, `sincronizarFormularioEvento()` (fecha y ubicación desde `planit:detalles-evento`), `sincronizarCantidadesPresupuesto()` y el render inicial de cada flujo; un error en cualquiera de ellos deja el storage correcto y la pantalla mostrando el mockup.

Por eso INT-RC16-01 separa explícitamente **memoria** de **persistencia**:

1. Modifica el estado solo a través de la UI (alta de invitado, cantidad de Catering, ubicación guardada).
2. Verifica el storage leyendo `localStorage` en crudo, no con `Almacenamiento`, para no validar el módulo consigo mismo.
3. Descarta todo lo que no es storage: `estadoApp` queda en `null` y los nodos del fixture se reemplazan por nodos nuevos, parseados del marcado original capturado antes de `DOMContentLoaded` (sin listeners ni valores modificados). Antes de continuar se comprueba que no queda rastro del cambio en el DOM.
4. Arranca la app con el mismo disparador que `index.html` (`DOMContentLoaded`).
5. Verifica que el DOM reconstruido refleje lo persistido: subtotal de Catering $525.000, total $685.000, invitada con badge "Confirmado" y métricas 3/1, ubicación restaurada, y una instancia de `Evento` distinta de la anterior.

INT-RC16-02 es el control negativo: la misma rutina, con storage vacío, muestra el marcado. Así se demuestra que lo que restaura INT-RC16-01 sale del storage. INT-RC16-03 cubre la rama de datos dañados de `cargarEventoInicial()`.

#### 6.3. Justificación técnica: resiliencia ante la ausencia de Bootstrap (RC15)

Bootstrap llega desde un CDN externo y es la única dependencia de terceros que usa `js/script.js` en tiempo de ejecución. Al escribir INT-RC15-03 apareció un hallazgo real: `configurarToastConfirmacion()` hacía `return` si `bootstrap` no existía al iniciar, así que sin Bootstrap el botón "Sumar al Evento" no daba ningún feedback. Se corrigió en `js/script.js`:

- los listeners de `.btn-sumar-evento` se registran siempre;
- la nueva función `mostrarToast()` consulta Bootstrap **en cada clic**: si existe, usa `bootstrap.Toast.getOrCreateInstance(...).show()`; si no, aplica la clase `show` del CSS de Bootstrap y quita el Toast al vencer el mismo `data-bs-delay`;
- el Toast ya es `role="status"` + `aria-live="polite"`, así que el mensaje se anuncia en ambos casos.

Los specs de "ausente" quitan `window.bootstrap` **antes** de montar los componentes (el caso más exigente: Bootstrap nunca cargó), escuchan errores en `window` y espían `console.error`, y usan `jasmine.clock()` para verificar el ocultamiento sin esperas reales. Los de "presente" cargan el mismo bundle 5.3.3 que `index.html` en `test-runner.html` y esperan los eventos `shown.bs.modal`/`hidden.bs.modal` en vez de usar tiempos fijos, que era el motivo por el que el Modal y el Toast se habían dejado fuera de la suite en PR #109.

**Fuera de alcance de RC14:** la observación menciona "categoría" y "badge" en el Modal, pero el Modal de `index.html` no tiene esos campos. Se verifican todos los campos que sí existen, y la falta queda reportada al rol Eventos + DOM.

#### 6.4. Resultados de ejecución

**Primera corrida (navegador, `test-runner.html`, 23/11/2026): 2 errores en RC15.** `TypeError: Cannot read properties of null (reading 'classList') at bootstrap.bundle.min.js`, atribuido a los `describe` "Bootstrap presente" y "Bootstrap ausente (degradación)".

- **Diagnóstico:** no faltaba el Toast en el DOM (el sandbox tiene `#toastConfirmacion` igual que `index.html`). `Toast.show()` deja en cola un callback de fin de transición (~5 ms, emulado con `setTimeout` porque el runner no carga el CSS de Bootstrap). El `afterEach` hacía `dispose()` en el mismo tick, `_element` quedaba en `null` y el callback fallaba al ejecutarse durante la suite siguiente.
- **Corrección en `js/test/script.spec.js`:** el `afterEach` pasa a ser asíncrono y espera a que terminen las transiciones antes de hacer `dispose()`. `window.bootstrap` se guarda y se restaura en `beforeEach`/`afterEach`. En "Bootstrap ausente", los clics del sandbox ya no llegan a `document`, para que los handlers *data-api* que el bundle ya registró no se ejecuten.
- **Corrección en `js/script.js`:** como defensa adicional, `mostrarToast()` sale sin hacer nada si recibe un elemento nulo.

**Segunda corrida (navegador, `js/test/test-runner.html` sobre Live Server, 23/11/2026): en verde.**

```
124 specs, 0 failures
```

Suite completa: 71 (`models.spec.js`) + 19 (`storage.spec.js`) + 34 (`script.spec.js`, de los cuales 13 son INT-RC14-01 a INT-RC16-03). Pasan todos los specs de integración de RC14, RC15 y RC16, y también los 111 anteriores, así que el bloque nuevo no rompió ninguno de los specs existentes.
