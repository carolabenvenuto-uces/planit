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

### 5. Checklist de cierre

- [x] `spec-tester-qa.md` commiteado antes que cualquier archivo spec de testing.
- [x] `js/test/models.spec.js` con tests de constructores, métodos, validaciones y serialización de las 8 clases (71 specs).
- [x] `js/test/storage.spec.js` con tests de CRUD y manejo de errores (19 specs).
- [x] `js/test/script.spec.js` refactorizado contra la arquitectura final (POO + controlador), con fixture de DOM propio en `test-runner.html` (21 specs).
- [x] Las tres suites ejecutadas con `node js/test/run-jasmine.js`, 0 fallas, resultado documentado (11 corridas con semillas distintas).
- [x] `js/test/testing-doc.md` actualizado con la nueva estructura, instrucciones por módulo y métricas de cobertura.
- [x] Bugs encontrados reportados como issues en GitHub — los 3 bugs de PR #104 están reportados como issues (#111, #112, #113), cerradas referenciando sus commits de fix.
- [x] Prueba interactiva con el servidor oficial `@playwright/mcp` (RC27): 18 `tools/call` (`browser_navigate`, `browser_snapshot`, `browser_click`, `browser_wait_for`, `browser_evaluate`, `browser_take_screenshot`, `browser_console_messages`, `browser_close`) sobre el Toast y el Modal, 6/6 aserciones PASS, evidencia en `js/test/mcp-evidence/` (sección 3.1).
