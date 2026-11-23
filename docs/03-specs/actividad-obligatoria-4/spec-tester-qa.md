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

**Capturas de pantalla del test runner** (generadas con la librería Playwright vía `node js/test/take-screenshots.js`; la evidencia del servidor `@playwright/mcp` está en la sección 3.1) en `js/test/screenshots/`:
- `ao4-general.png`: vista completa del test runner, banner de resultado global (`111 specs, 0 failures`) y árbol completo de las 3 suites.
- `ao4-models.png`: detalle de `models.spec.js`.
- `ao4-storage.png`: detalle de `storage.spec.js` (incluye el test de storage lleno agregado en esta ronda).
- `ao4-script.png`: detalle de `script.spec.js`.

### 3.1 Evidencia con el servidor oficial `@playwright/mcp` (corrección RC27)

**Contexto de la corrección.** La versión anterior de este documento declaraba que las capturas se habían hecho con la librería `playwright` y no con el servidor MCP. El docente observó (RC27) que eso no cumple el requisito de Playwright MCP. Para atenderlo, se ejecutó una sesión de prueba real contra el servidor oficial **`@playwright/mcp`**, hablando el protocolo MCP (JSON-RPC 2.0 por stdio). Se registraron todas las llamadas `tools/call` con su entrada y su salida. La sesión se corrió el **23/11/2026**, durante esta corrección. Las capturas del test runner de Jasmine de la sección 3 siguen siendo las de `take-screenshots.js`; la evidencia de esta sección es aparte y se suma a esas capturas, no las reemplaza.

Toda la evidencia queda en [`js/test/mcp-evidence/`](../../../js/test/mcp-evidence/):

| Archivo | Qué es |
|---|---|
| `mcp-session-log.json` | Log completo de la sesión: comando de arranque del servidor, `serverInfo`, las 25 herramientas listadas, cada `tools/call` (request JSON-RPC, duración y response textual completa) y las aserciones con el veredicto. |
| `mcp-session.mjs` | Cliente MCP que ejecutó la sesión (SDK oficial `@modelcontextprotocol/sdk`, `StdioClientTransport`), con el servidor estático en `:5500` equivalente a Live Server. |
| `mcp-01-toast.png`, `mcp-02-modal.png`, `mcp-03-toast-desde-modal.png` | Capturas tomadas por el propio servidor MCP con `browser_take_screenshot`. |
| `page-*.yml` | Snapshots de accesibilidad que el servidor guardó tras cada acción (son los archivos que referencian las responses del log). |
| `console-*.log` | Log de consola del navegador que capturó el servidor. |

#### Configuración del MCP Server

Comando con el que se arrancó el servidor. Es el que registra el campo `mcpServerLaunch` del log; el cliente lo lanza como subproceso stdio:

```bash
npx -y @playwright/mcp@latest --headless --browser chromium --output-dir .
```

- Versión resuelta: `@playwright/mcp` **0.0.86** (`npx @playwright/mcp@latest --version`). El `serverInfo` que devuelve el handshake MCP es `{"name":"Playwright","version":"1.66.0-alpha-2026-11-18"}`.
- Navegador del servidor: hubo que instalarlo una vez con `npx @playwright/mcp install-browser chrome-for-testing`. En la primera corrida, el servidor respondió a `browser_navigate` con el error `Browser "chrome-for-testing" is not installed`.
- Configuración equivalente para conectar el mismo servidor a un cliente MCP interactivo (VS Code `.vscode/mcp.json` o `claude_desktop_config.json`, bajo `"mcpServers"`). No fue la que usó esta sesión; se incluye como referencia:

  ```json
  {
    "servers": {
      "playwright": {
        "command": "npx",
        "args": ["-y", "@playwright/mcp@latest"]
      }
    }
  }
  ```

#### Secuencia de llamadas (`tools/call`)

Sesión del 23/11/2026, de `22:29:42.605Z` a `22:29:55.553Z` (UTC), contra `http://localhost:5500/index.html`. Los nombres de herramienta son los canónicos que expone el servidor en `tools/list`. Las salidas de esta tabla son extractos literales de las responses del log.

| # | Herramienta | Entrada (`arguments`) | Salida registrada (extracto) | ms |
|---|---|---|---|---|
| 1 | `browser_navigate` | `{"url":"http://localhost:5500/index.html"}` | `await page.goto('http://localhost:5500/index.html');` · `Page Title: PlanIT - Plataforma All-in-One de Organización & Experiencias` | 3908 |
| 2 | `browser_snapshot` | `{"target":"#contenedor-catalogo"}` | Árbol YAML con las 3 tarjetas; 3 × `button "Sumar al Evento"` | 27 |
| 3 | `browser_click` | `{"element":"Boton 'Sumar al Evento' de Gourmet Finger Food","target":".btn-sumar-evento[data-service-title=\"Gourmet Finger Food\"]"}` | `await page.locator('.btn-sumar-evento[data-service-title="Gourmet Finger Food"]').click();` | 1126 |
| 4 | `browser_wait_for` | `{"text":"Gourmet Finger Food · $3.500 / pax","time":10}` | `Waited for Gourmet Finger Food · $3.500 / pax` | 57 |
| 5 | `browser_snapshot` | `{"target":"#toastConfirmacion"}` | `- status [ref=e310]` … `paragraph [ref=e316]: Gourmet Finger Food · $3.500 / pax` · `paragraph [ref=e317]: Experiencia agregada a tu evento` | 16 |
| 6 | `browser_evaluate` | `{"element":"Toast de confirmacion","target":"#toastConfirmacion","function":"(el) => ({ visible: el.classList.contains('show'), … })"}` | `{"visible":true,"servicio":"Gourmet Finger Food · $3.500 / pax","mensaje":"Experiencia agregada a tu evento","dataTitle":"Gourmet Finger Food","dataPrice":"$3.500 / pax"}` | 537 |
| 7 | `browser_take_screenshot` | `{"type":"png","filename":"mcp-01-toast.png","scale":"css"}` | `[Screenshot of viewport](./mcp-01-toast.png)` | 112 |
| 8 | `browser_click` | `{"element":"Boton 'Ver detalle' de Flores Pilar","target":".btn-ver-detalle[data-service-title=\"Flores Pilar\"]"}` | `await page.locator('.btn-ver-detalle[data-service-title="Flores Pilar"]').click();` | 1090 |
| 9 | `browser_wait_for` | `{"text":"1 jornada de montaje","time":10}` | `Waited for 1 jornada de montaje` | 48 |
| 10 | `browser_snapshot` | `{"target":"#modalDetalleServicio"}` | `- dialog "Flores Pilar" [active] [ref=e318]` … `text: 1 jornada de montaje` · `paragraph [ref=e337]: $70.000 / base` | 11 |
| 11 | `browser_evaluate` | `{"element":"Modal de detalle de servicio","target":"#modalDetalleServicio","function":"(el) => ({ abierto: el.classList.contains('show'), … })"}` | `{"abierto":true,"titulo":"Flores Pilar","capacidad":"1 evento por fecha","duracion":"1 jornada de montaje","precio":"$70.000 / base","sumarDataTitle":"Flores Pilar"}` | 1033 |
| 12 | `browser_take_screenshot` | `{"type":"png","filename":"mcp-02-modal.png","scale":"css"}` | `[Screenshot of viewport](./mcp-02-modal.png)` | 121 |
| 13 | `browser_click` | `{"element":"Boton 'Sumar al Evento' dentro del Modal","target":"#modalDetalleServicio .btn-sumar-evento"}` | `await page.locator('#modalDetalleServicio .btn-sumar-evento').click();` | 886 |
| 14 | `browser_wait_for` | `{"text":"Flores Pilar · $70.000 / base","time":10}` | `Waited for Flores Pilar · $70.000 / base` | 45 |
| 15 | `browser_evaluate` | `{"function":"() => ({ modalAbierto: …, toastVisible: …, toastServicio: … })"}` | `{"modalAbierto":false,"toastVisible":true,"toastServicio":"Flores Pilar · $70.000 / base"}` | 515 |
| 16 | `browser_take_screenshot` | `{"type":"png","filename":"mcp-03-toast-desde-modal.png","scale":"css"}` | `[Screenshot of viewport](./mcp-03-toast-desde-modal.png)` | 440 |
| 17 | `browser_console_messages` | `{"level":"error"}` | Único error: `404 (Not Found) @ http://localhost:5500/favicon.ico` (el proyecto no tiene favicon; no es un error de la app) | 5 |
| 18 | `browser_close` | `{}` | `await browser.close();` · `No open tabs. Navigate to a URL to create one.` | 340 |

Ejemplo de un request JSON-RPC completo tal como figura en el log (paso 3):

```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "browser_click",
    "arguments": {
      "element": "Boton 'Sumar al Evento' de Gourmet Finger Food",
      "target": ".btn-sumar-evento[data-service-title=\"Gourmet Finger Food\"]"
    }
  }
}
```

Las cadenas `function` de los pasos 6, 11 y 15 aparecen abreviadas con `…` en la tabla; el texto completo está en `mcp-session-log.json`.

#### Aserciones y conclusión

| # | Qué se verificó | Resultado |
|---|---|---|
| 1 | El snapshot del catálogo lista 3 botones "Sumar al Evento" | PASS |
| 2 | El snapshot del Toast contiene el servicio y "Experiencia agregada a tu evento" | PASS |
| 3 | El Toast está visible (`.show`) y su `data-service-*` es el de Gourmet Finger Food | PASS |
| 4 | El snapshot del Modal muestra `dialog "Flores Pilar"` con `$70.000 / base` | PASS |
| 5 | El Modal está abierto y se completó con los `data-service-*` de Flores Pilar (título, capacidad, duración, precio y el botón "Sumar al Evento" interno) | PASS |
| 6 | "Sumar al Evento" desde el Modal cierra el Modal y muestra el Toast con Flores Pilar | PASS |

**Veredicto registrado en el log: `"verdict": "PASS"` (6/6 aserciones, 18 `tools/call` sin `isError`).** Los dos flujos de Bootstrap (Toast desde una tarjeta y Modal → Toast) funcionan en un navegador real manejado por el servidor oficial `@playwright/mcp`. Son justamente los dos componentes que la suite Jasmine no cubre (ver "Alcance y Limitaciones" en `testing-doc.md`).

**Alcance de esta evidencia.** El cliente MCP fue un script (`mcp-session.mjs`), no un agente de IA conversacional: la secuencia de herramientas está fijada en el código y las aserciones se evalúan sobre las responses reales del servidor. El servidor, el protocolo y los nombres de herramienta son los mismos que usa cualquier cliente MCP (Copilot, Claude, etc.). Para reproducir la sesión, desde una carpeta con `@modelcontextprotocol/sdk` instalado (`npm i @modelcontextprotocol/sdk@1`):

```bash
node mcp-session.mjs <raíz-del-repo> <raíz-del-repo>/js/test/mcp-evidence
```

#### Trazabilidad de la observación RC27

| Requisito / observación | Evidencia | Estado |
|---|---|---|
| RC27: usar el servidor oficial `@playwright/mcp` o declarar el criterio incumplido | Sección 3.1 + `js/test/mcp-evidence/mcp-session-log.json` (`mcpServerLaunch`, `serverInfo`, `toolsListed`) | Cumplido |
| Secuencia de herramientas MCP canónicas con entradas y salidas | Tabla de la sección 3.1 + `calls[]` del log | Cumplido |
| Validación de Toast y Modal en navegador real | Aserciones 2 a 6 + `mcp-01-toast.png`, `mcp-02-modal.png`, `mcp-03-toast-desde-modal.png` | Cumplido (6/6 PASS) |

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
- [x] **(RC28)** Suite completa verificada en un checkout limpio (`npm ci` + `npm test`): `330 specs, 0 failures`, código de salida `0`. Están resueltos el `SyntaxError: Unexpected token ')'` de `js/script.js` y las 37 fallas (ver secciones 7 y 8).

> Los conteos de los ítems anteriores (71, 19 y 21 specs; 11 corridas) corresponden al cierre original de la AO4. La distribución vigente es `models.spec.js` 174 + `storage.spec.js` 103 + `servicio-persistencia.spec.js` 17 + `script.spec.js` 36 = **330 specs**.

### 6. Ejecución reproducible por línea de comandos (corrección RC20)

**Observación del docente (RC20):** "La ejecución documentada no es reproducible desde un checkout limpio: faltan package.json, lockfile y dependencia Playwright."

**Causa:** `run-jasmine.js` y `take-screenshots.js` hacen `require("playwright")`, pero el repositorio no declaraba esa dependencia en ningún archivo versionado. `package.json` y `package-lock.json` existían solo en la máquina local de quien corrió la suite porque estaban listados en `.gitignore`. Un clon limpio fallaba con `Cannot find module 'playwright'`, y las afirmaciones previas de esta spec ("commiteada como devDependency") no se correspondían con el contenido real del repositorio.

**Cambios realizados:**
- `package.json` en la raíz: metadata del proyecto (`"name": "planit"`, `"version": "1.0.0"`, `"private": true`, `"type": "commonjs"` porque los scripts de test usan `require`), `"engines": { "node": ">=20" }` (mínimo que exige Playwright 1.64), `playwright` fijado en la versión exacta `1.64.1` como `devDependency` (sin `^`, para que una edición manual del lockfile no habilite otra versión) y los scripts `test`, `test:browser`, `test:install-browsers` y `test:screenshots`.
- `package-lock.json` (formato `lockfileVersion: 3`): fija `playwright@1.64.1` y su única dependencia transitiva `playwright-core@1.64.1`, cada una con su URL de descarga del registro npm y su hash de integridad `sha512`, de modo que `npm ci` instala exactamente el mismo árbol en cualquier entorno.
- `.gitignore`: se quitaron las entradas `package.json` y `package-lock.json` (se mantiene `node_modules/`).
- `js/test/open-runner.js`: script nuevo detrás de `npm run test:browser`, que abre `test-runner.html` en un Chromium con ventana visible.
- `js/test/testing-doc.md`: la sección "Ejecución reproducible por línea de comandos" pasa a documentar el procedimiento completo desde un checkout limpio.

**Procedimiento desde un checkout limpio** (requisitos: Git y Node.js 20 o superior):

```
git clone https://github.com/carolabenvenuto-uces/planit.git
cd planit
npm ci
npm run test:install-browsers
npm test
```

| Paso | Qué hace |
|---|---|
| `npm ci` | Instala `playwright` y `playwright-core` exactamente como figuran en `package-lock.json`. Falla si `package.json` y el lockfile no coinciden, en vez de resolver versiones nuevas. |
| `npm run test:install-browsers` | Ejecuta `playwright install chromium`: descarga el Chromium que corresponde a Playwright 1.64.1. Es un paso aparte porque los binarios del navegador no son un paquete npm y el lockfile no los cubre. En Linux sin librerías de sistema: `npx playwright install --with-deps chromium`. |
| `npm test` | Ejecuta `node js/test/run-jasmine.js`: imprime `330 specs, 0 failures, randomized with seed <n>` (conteo vigente desde RC24–RC26, ver sección 7) y termina con código `0` (o `1` si hay specs fallidos o errores de consola sin mockear). |

`npm run test:browser` abre el mismo runner con ventana visible; abrir `js/test/test-runner.html` directamente en un navegador sigue siendo válido y no requiere Node.

**Criterio de aceptación de RC20:**
- [x] `package.json` versionado con la dependencia `playwright` y los scripts `test` y `test:browser`.
- [x] `package-lock.json` versionado, coherente con `package.json` (mismas versiones en la raíz del lockfile y en `devDependencies`).
- [x] `package.json` y `package-lock.json` fuera de `.gitignore`.
- [x] Procedimiento paso a paso desde `git clone` documentado aquí y en `js/test/testing-doc.md`.
- [x] Verificado en un checkout limpio con `npm ci` y `npm test` (RC28, 23/11/2026). Se copió el proyecto a un directorio vacío, sin `node_modules/` ni `.git/`. `npm ci` terminó con exit `0` (instaló `playwright@1.64.1` y `playwright-core@1.64.1` desde el lockfile) y `npm test` dio `330 specs, 0 failures` con código de salida `0` en 3 corridas con semillas distintas. Ver sección 8.

  *Historial:* hasta RC28 este ítem estaba sin marcar. Al principio no había Node.js en la máquina, y la corrida de RC24–RC26 (sección 7) se hizo en un working copy, no en un checkout limpio. La primera verificación del docente en checkout limpio dio `330 specs, 37 failures` y `pageerror: Unexpected token ')'`. La resolución está en las secciones 7 y 8.

### 7. Ejecución de las suites de integración: Modal, Toast y Persistencia (corrección RC24, RC25, RC26)

**Observaciones del docente (síntesis):**
- **RC24:** acreditar con una ejecución real que los specs de integración del **Modal** de detalle de proveedor pasan.
- **RC25:** ídem para los specs de integración del **Toast** de confirmación (con Bootstrap presente y ausente).
- **RC26:** ídem para los specs de integración de **persistencia** y restauración en una carga nueva de la página.

El criterio en los tres casos: `npm test` en verde, 0 fallas, código de salida `0`.

**Correspondencia con la suite:** los tres grupos son los `describe` del bloque `"Integración - Controlador y UI (RC14, RC15, RC16)"` de `js/test/script.spec.js`. Los identificadores de los specs se conservan para no romper la trazabilidad con `testing-doc.md`:

| Observación | `describe` | Specs |
|---|---|---|
| RC24 (Modal) | `RC14: Modal de detalle de proveedor (show.bs.modal)` | INT-RC14-01 a INT-RC14-05 |
| RC25 (Toast) | `RC15: Toast de 'Sumar al Evento'` con Bootstrap presente / ausente | INT-RC15-01 a INT-RC15-05 |
| RC26 (Persistencia) | `RC16: Persistencia y restauración en una carga nueva de la página` | INT-RC16-01 a INT-RC16-03 |

**Estado inicial (antes de la corrección):** la evidencia previa de RC14–RC16 (`124 specs, 0 failures`) se había obtenido en el navegador con Live Server, sin código de salida ni captura de `console.error`/`pageerror`. Al correr `npm test` sobre la rama, después de los merges de RC20 y RC22, el resultado fue:

```
330 specs, 37 failures, randomized with seed 01419
Errores de consola: [ "pageerror: Unexpected token ')'" ]
```

Código de salida `1`. Fallaban los 36 specs de `script.spec.js`, entre ellos los 13 de integración. `models.spec.js`, `storage.spec.js` y `servicio-persistencia.spec.js` pasaban, pero la corrida global no quedaba en verde.

**Diagnóstico.** Se hizo con scripts de Playwright ad hoc, fuera del repositorio, que registraban `pageerror`, `requestfailed` y las navegaciones del frame principal, y después leían los mensajes de cada spec fallido del reporter HTML:

1. `node --check js/script.js` → `SyntaxError` en `configurarToastConfirmacion()`: un `});` sobrante, resto de un merge, que impedía cargar el controlador.
2. Una vez corregido eso, la suite no terminaba en 15 s y aparecían ~1.800 `ERR_FILE_NOT_FOUND`. El runner se **recargaba en bucle** (49 navegaciones a `test-runner.html?` en 8 s): `configurarEventos()` lanzaba `ReferenceError: sincronizarCantidadesPresupuesto is not defined` (y `cargarEstadoInicial()` llamaba a `crearEventoDesdeMarcado`, también inexistente), así que los formularios quedaban sin el `preventDefault` del submit.
3. Imágenes del catálogo pedidas en `js/test/docs/...` (404 → `console.error`).
4. Fallas puntuales de los specs RC16 y de INT-RC14-05 (`CLAVES_STORAGE is not defined`, `ui.filasPresupuesto` indefinido, cantidad de invitados semilla y `dataset.serviceTitle` del Toast sin asignar).

**Cambios realizados:**

| Archivo | Cambio | Motivo |
|---|---|---|
| `js/script.js` → `configurarToastConfirmacion()` | Se quita el `});` sobrante y el listener vuelve a registrarse **por botón** `.btn-sumar-evento`. Se reponen `toastConfirmacionServicio.textContent = "<servicio> · <precio>"`, el mensaje "Experiencia agregada a tu evento" y `dataset.serviceTitle/servicePrice` del Toast. | RC24/RC25. Los specs de "Bootstrap ausente" cortan la propagación hacia `document`, y `montarComponentesBootstrap()` reconfigura los componentes en cada spec. Con delegación en `document` el clic no llegaba en esos specs y, en los demás, se acumulaban listeners (`Toast.show` se llamaba más de una vez). |
| `js/script.js` → `sincronizarCantidadesPresupuesto(ui)` (repuesta) | Copia al input de cada fila la cantidad del Presupuesto cargado. Si las filas del DOM no se corresponden con los ítems del modelo, las regenera con `renderFilasPresupuesto()`. | RC26. Sin esta función el arranque lanzaba. Además, `recalcularPresupuesto()` solo re-renderiza cuando cambia la cantidad de filas, así que sin la sincronización una carga nueva mostraría la cantidad del marcado (120) y no la persistida (150). |
| `js/script.js` → `cargarEstadoInicial()` | `crearEventoDesdeMarcado(ui)` → `crearEventoInicial(ui)`. | RC26. La función real es `crearEventoInicial`; la otra no existía. |
| `js/script.js` → `RUTA_IMAGENES_CATALOGO` | Se resuelve relativa a `js/script.js` (`new URL("../docs/...", document.currentScript.src)`). Si `currentScript` no está disponible, se usa `./docs/...` como antes. | Las tarjetas que renderiza el controlador pedían la imagen relativa a la página. En el runner (`js/test/`) daba 404, y `run-jasmine.js` lo cuenta como error. En `index.html` resuelve a la misma ruta que antes. |
| `js/test/script.spec.js` | Constante `CLAVES_STORAGE_CRUDAS` con las claves literales (`planit:evento`, `planit:detalles-evento`) en lugar de `CLAVES_STORAGE`. | RC26. RC22 hizo privadas las claves en la fachada. Los specs leen y siembran `localStorage` en crudo a propósito, para no validar el módulo consigo mismo. |
| `js/test/script.spec.js` → INT-RC16-01 | La fila de Catering se busca con `#cantidad-catering` → `closest("tr")`, verificando que pertenezca a `obtenerFilasPresupuesto(ui)`. | RC26. `obtenerReferenciasUI()` ya no expone `filasPresupuesto` (RC9), y las filas generadas no tienen `data-categoria`. |
| `js/test/script.spec.js` → INT-RC16-02 | Se compara contra `DATOS_SEMILLA` (5 invitados: 3 confirmados, 2 pendientes) en lugar de "3 invitados del marcado". | RC26. Desde RC9–RC11 los datos de ejemplo salen de `DATOS_SEMILLA`. El spec sigue funcionando como control negativo, porque el fixture tiene 3 invitados y un resto en memoria se detectaría. |

Las aserciones de los specs del Modal (RC24) y del Toast (RC25) **no se modificaron**: pasaron en cuanto el controlador volvió a cargar y se repuso el comportamiento del Toast.

**Evidencia ejecutable (23/11/2026).** Windows 11, Node.js v26.13.1, npm 11.20.0, Playwright 1.64.1 (Chromium headless). `npm test` desde la raíz del repositorio, 10 corridas consecutivas, con el código de salida tomado de `$?`:

```
330 specs, 0 failures, randomized with seed 67178 | exit=0
330 specs, 0 failures, randomized with seed 03453 | exit=0
330 specs, 0 failures, randomized with seed 23947 | exit=0
330 specs, 0 failures, randomized with seed 24502 | exit=0
330 specs, 0 failures, randomized with seed 17683 | exit=0
330 specs, 0 failures, randomized with seed 70659 | exit=0
330 specs, 0 failures, randomized with seed 11862 | exit=0
330 specs, 0 failures, randomized with seed 42904 | exit=0
330 specs, 0 failures, randomized with seed 50613 | exit=0
330 specs, 0 failures, randomized with seed 99216 | exit=0
```

Ninguna de las 10 corridas imprimió `Specs fallidos` ni `Errores de consola`.

**Desglose de los 330 specs** (reporter de Jasmine): `models.spec.js` 174 · `storage.spec.js` 103 · `servicio-persistencia.spec.js` 17 · `script.spec.js` 36.

**Estado de cada spec de integración** (reporter HTML, corrida `330 specs, 0 failures, randomized with seed 92187`):

| Observación | Spec | Estado |
|---|---|---|
| RC24 | INT-RC14-01 — datos del servicio en el Modal (`show.bs.modal` con `relatedTarget`) | ✅ passed |
| RC24 | INT-RC14-02 — `show.bs.modal` sin disparador no modifica el Modal | ✅ passed |
| RC24 | INT-RC14-03 — ARIA y foco con Bootstrap real (apertura y cierre) | ✅ passed |
| RC24 | INT-RC14-04 — el botón del Modal recibe el último proveedor abierto | ✅ passed |
| RC24 | INT-RC14-05 — Modal → "Sumar al Evento" → Toast, y cierre del Modal | ✅ passed |
| RC25 | INT-RC15-01 — Toast de Bootstrap desde las 3 tarjetas | ✅ passed |
| RC25 | INT-RC15-02 — Toast de Bootstrap desde el Modal | ✅ passed |
| RC25 | INT-RC15-03 — Toast degradado sin Bootstrap (clase `show`, `data-bs-delay`) | ✅ passed |
| RC25 | INT-RC15-04 — Toast degradado desde el Modal | ✅ passed |
| RC25 | INT-RC15-05 — un segundo clic reinicia el temporizador | ✅ passed |
| RC26 | INT-RC16-01 — cambios desde la UI → storage → reinicio de memoria y DOM → `DOMContentLoaded` → reconstrucción | ✅ passed |
| RC26 | INT-RC16-02 — control: sin storage se muestran los datos semilla | ✅ passed |
| RC26 | INT-RC16-03 — storage dañado: aviso y caída a la semilla, sin lanzar | ✅ passed |

Esta corrida también cierra la salvedad de la sección 4.1 (RC7): queda confirmado con `run-jasmine.js` el código de salida `0` que la corrida con Chrome headless no podía acreditar.

Detalle completo, con la tabla de causas, en `js/test/testing-doc.md`, sección "Ejecución verificada de las suites de integración (RC24, RC25, RC26)".

**Criterio de aceptación de RC24, RC25 y RC26:**
- [x] `npm test` ejecutado por línea de comandos (Playwright + Chromium headless), no solo en el navegador.
- [x] Resultado `330 specs, 0 failures` con código de salida `0`, en 10 corridas con semillas aleatorias distintas.
- [x] Sin `console.error` ni `pageerror` sin mockear en ninguna corrida.
- [x] **RC24:** INT-RC14-01 a INT-RC14-05 (Modal) en verde.
- [x] **RC25:** INT-RC15-01 a INT-RC15-05 (Toast, con y sin Bootstrap) en verde.
- [x] **RC26:** INT-RC16-01 a INT-RC16-03 (Persistencia y carga nueva) en verde.
- [x] Causas de las fallas diagnosticadas, corregidas y documentadas aquí y en `js/test/testing-doc.md`.
- [x] `js/test/testing-doc.md` actualizado con la evidencia ejecutable y el checklist correspondiente.

### 8. Verificación sobre checkout limpio (corrección RC28)

**Observación del docente (RC28):** *"npm ci ya funciona, pero la verificación real del checkout limpio produjo 330 specs, 37 failures y pageerror: Unexpected token ')'. La documentación todavía afirma 111 specs, 0 failures y deja el checklist de ejecución sin verificar. Corregir el código/suite y actualizar el resultado documentado con una corrida reproducible exitosa."*

**Código y suite.** El `SyntaxError: Unexpected token ')'` (un `});` sobrante en `configurarToastConfirmacion()`, cerca de la línea 1390 de `js/script.js`) y las 37 fallas se corrigieron con los cambios de la sección 7. Para RC28 se volvió a verificar cada uno en el código:

- `node --check js/script.js` termina sin errores.
- El Toast usa **listeners directos por botón** `.btn-sumar-evento`.
- Las **funciones faltantes** están repuestas: `sincronizarCantidadesPresupuesto(ui)` existe y el arranque llama a `crearEventoInicial(ui)`.
- Las imágenes usan **rutas relativas** a `js/script.js` (`RUTA_IMAGENES_CATALOGO` con `document.currentScript.src`).
- Los specs RC16 usan `CLAVES_STORAGE_CRUDAS` y `DATOS_SEMILLA`.

**Corrida reproducible (23/11/2026).** Windows 11, Node.js v26.13.1, npm 11.20.0, Playwright 1.64.1.

1. Checkout limpio, con el proyecto copiado a un directorio vacío sin `node_modules/` ni `.git/`: `npm ci` (exit `0`) y luego `npm test` 3 veces:
   ```
   330 specs, 0 failures, randomized with seed 88268 | exit=0
   330 specs, 0 failures, randomized with seed 53521 | exit=0
   330 specs, 0 failures, randomized with seed 01753 | exit=0
   ```
2. Working copy del repositorio: `npm test` 10 veces más. Las 10 corridas dieron `330 specs, 0 failures` con exit `0` (semillas 56751, 19238, 59239, 09448, 17951, 77036, 03448, 80995, 78955 y 96716).

Ninguna corrida registró `Specs fallidos` ni `Errores de consola`. Las semillas cambian, pero el resultado es siempre el mismo.

**Documentación.** En `js/test/testing-doc.md`, la tabla de métricas, que seguía mostrando 124 specs como total, pasa a la distribución vigente (174 + 103 + 17 + 36 = **330**). Los conteos de 109, 111, 124, 132 y 212 specs quedan marcados como históricos, y se agrega la sección "Verificación sobre checkout limpio (RC28)" con su checklist. En esta spec se marca el ítem de clon limpio de RC20 (sección 6) y se agrega el ítem RC28 al checklist de cierre (sección 5).

**Criterio de aceptación de RC28:**
- [x] `js/script.js` compila (`node --check`): el `SyntaxError: Unexpected token ')'` está resuelto.
- [x] Las 37 fallas están resueltas: listeners directos, funciones faltantes, rutas relativas y specs RC16 actualizados.
- [x] Checkout limpio verificado: `npm ci` + `npm test` → `330 specs, 0 failures`, código de salida `0`, en corridas repetidas con semillas distintas.
- [x] `testing-doc.md` y esta spec documentan 330 specs como conteo vigente, sin afirmar 111 specs como estado actual.
