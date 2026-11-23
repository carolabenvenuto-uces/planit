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

### 5. Checklist de cierre

- [x] `spec-tester-qa.md` commiteado antes que cualquier archivo spec de testing.
- [x] `js/test/models.spec.js` con tests de constructores, métodos, validaciones y serialización de las 8 clases (71 specs).
- [x] `js/test/storage.spec.js` con tests de CRUD y manejo de errores (19 specs).
- [x] `js/test/script.spec.js` refactorizado contra la arquitectura final (POO + controlador), con fixture de DOM propio en `test-runner.html` (21 specs).
- [x] Las tres suites ejecutadas con `node js/test/run-jasmine.js`, 0 fallas, resultado documentado (11 corridas con semillas distintas).
- [x] `js/test/testing-doc.md` actualizado con la nueva estructura, instrucciones por módulo y métricas de cobertura.
- [x] Bugs encontrados reportados como issues en GitHub — los 3 bugs de PR #104 están reportados como issues (#111, #112, #113), cerradas referenciando sus commits de fix.
- [x] **RC6:** `js/test/storage.spec.js` cubre storage ausente o inaccesible y errores de lectura, borrado y listado en `localStorage` y `sessionStorage`, incluyendo `SecurityError` y códigos alternativos de cuota (63 specs nuevos, `RC6-01` a `RC6-23`; ver sección 6).

## Corrección RC6 — Resiliencia del almacenamiento ante fallas

### 6.1 Observación del docente

> "RC6 — Agregar pruebas para storage ausente o inaccesible y errores de lectura, borrado y listado en localStorage y sessionStorage, incluyendo SecurityError y códigos alternativos de cuota."

Antes de esta corrección, `storage.spec.js` solo probaba dos rutas de error: JSON corrupto en `cargar()` y `QuotaExceededError` estándar en `guardar()`. No cubría storage ausente, `SecurityError`, fallas de `removeItem`/`key`/`length`, ni las variantes de cuota de otros navegadores.

### 6.2 Casos de prueba agregados

Bloque nuevo `describe("RC6 — Resiliencia ante storage ausente, inaccesible o con errores")` en `js/test/storage.spec.js`. El identificador de cada caso aparece entre corchetes en el título del `describe`/`it`, así se lo puede buscar en el reporter de Jasmine.

| ID | Escenario | Storage | Resultado esperado | Specs |
|---|---|---|---|---|
| RC6-01 | `window.<storage>` es `null` | local y session | Ninguna operación lanza; `eliminar()` → `false` pero borra igual del otro storage; `listar()` devuelve las claves del otro storage; si falta `localStorage`, `guardar()` → `false` y `cargar()` → `null`; si falta `sessionStorage`, `guardar()`/`cargar()` siguen funcionando. | 8 |
| RC6-02 | `window.<storage>` es `undefined` | local y session | Igual que RC6-01. | 8 |
| RC6-03 | El getter de `window.<storage>` lanza `SecurityError` (incógnito estricto, iframe cruzado) | local y session | Igual que RC6-01. | 8 |
| RC6-04 | No hay ningún storage disponible | ambos | Todas las operaciones devuelven valores seguros (`false` / `null` / `[]`), sin lanzar. | 1 |
| RC6-05 | El `SecurityError` simulado es el estándar | — | `DOMException`, `name: "SecurityError"`, `code: 18` (`DOMException.SECURITY_ERR`). | 1 |
| RC6-06 | `setItem` lanza `SecurityError` | local | `guardar()` → `false`; `console.error` recibe el error original. | 1 |
| RC6-07 | `getItem` lanza `SecurityError` | local | `cargar()` → `null`. | 1 |
| RC6-08 | `removeItem` lanza `SecurityError` | local y session | `eliminar()` → `false`. | 2 |
| RC6-09 | `SecurityError` legacy (`name: "SECURITY_ERR"`, `code: 18`, no es `DOMException`) | local | `guardar()` → `false`. | 1 |
| RC6-10 | `getItem` lanza un error genérico | local | `cargar()`/`obtener()` → `null`, sin lanzar. | 1 |
| RC6-11 | `getItem` falla solo en `sessionStorage` | session | `cargar()` no se ve afectado (lee de `localStorage`). | 1 |
| RC6-12 | Dato no deserializable: objeto truncado, array truncado, `undefined`, `NaN`, comillas simples, string vacío | local | `cargar()` → `null`, sin lanzar. | 6 |
| RC6-13 | `removeItem` falla en un storage | local y session | `eliminar()` → `false`, pero igual borra del otro storage. | 2 |
| RC6-14 | `removeItem` falla durante `limpiar()` | local y session | `limpiar()` → `false`, sin lanzar, y limpia el otro storage. | 2 |
| RC6-15 | `Storage.clear()` lanza | ambos | `limpiar()` no usa `clear()`: limpia igual y no toca claves de otro prefijo. | 1 |
| RC6-16 | Leer `length` lanza | local y session | `listar()` devuelve las claves del otro storage. | 2 |
| RC6-17 | `key()` lanza | local y session | `listar()` devuelve las claves del otro storage. | 2 |
| RC6-18 | `key()` lanza en ambos | ambos | `listar()` → `[]`, sin lanzar. | 1 |
| RC6-19 | `QuotaExceededError` (`DOMException`, code 22): W3C, Chromium y Firefox actual | local | Por cada variante de cuota (RC6-19 a RC6-22): (a) el error simulado tiene el `name`/`code` esperado; (b) `guardar()`/`actualizar()` → `false` sin lanzar y loguean el error original; (c) el valor previo de la clave queda intacto. | 3 |
| RC6-20 | `NS_ERROR_DOM_QUOTA_REACHED`, code 1014 (Firefox legacy) | local | Ídem. | 3 |
| RC6-21 | `QUOTA_EXCEEDED_ERR`, code 22 (WebKit/Safari legacy, incluido el modo privado con cuota 0) | local | Ídem. | 3 |
| RC6-22 | IE/Edge legacy: `Error` genérico con `number: -2147024882` (`E_OUTOFMEMORY`) | local | Ídem. | 3 |
| RC6-23 | Un storage lleno (todo `setItem` lanza) | local y session | Leer, listar y borrar siguen funcionando. | 2 |
| | | | **Total** | **63** |

**Aislamiento entre specs:** cada falla se simula con `spyOnProperty(window, "localStorage" | "sessionStorage", "get")` o con espías sobre `Storage.prototype`. Para los espías de prototipo, un `callFake` lanza solo cuando `this` es el storage elegido y delega en el método original para el otro; así cada storage se prueba por separado. Jasmine restaura todos los espías al terminar cada spec. Además, el `afterEach` del bloque borra las claves `planit:test-*` usando los storages y métodos reales, capturados **antes** de instalar cualquier espía, para que la limpieza no dependa de los mocks. `console.error` se espía en el `beforeEach` porque `Almacenamiento` loguea cada falla a propósito y `run-jasmine.js` falla si encuentra un `console.error` sin mockear.

**Nota de ruteo:** `CLAVES_SESSION` está vacío, así que `guardar()` y `cargar()` siempre usan `localStorage`; `eliminar()` y `listar()` recorren ambos storages. Por eso `sessionStorage` se cubre en ausencia/inaccesibilidad, borrado y listado. En lectura y escritura se verifica que una falla suya no afecte a `cargar()`/`guardar()` (RC6-01 a RC6-03 y RC6-11).

### 6.3 Justificación técnica del manejo de excepciones

- **Captura uniforme en vez de clasificar el error.** `Almacenamiento` envuelve cada acceso al storage en `try/catch` y ante **cualquier** excepción devuelve un valor seguro (`false` en escrituras y borrados, `null` en lecturas, `[]` en listados). No inspecciona `name` ni `code`. No hace falta, porque la respuesta es la misma para todas las fallas: seguir en memoria y avisar. Además, no existe un único criterio portable para reconocer una falla de cuota: el estándar usa `QuotaExceededError`/22, Firefox legacy `NS_ERROR_DOM_QUOTA_REACHED`/1014, WebKit legacy `QUOTA_EXCEEDED_ERR`/22 e IE un `Error` con `number` −2147024882. RC6-19 a RC6-22 prueban que esta estrategia cubre las cuatro variantes sin una lista de códigos que mantener.
- **SecurityError puede saltar en el getter, no solo en los métodos.** En modo incógnito estricto, con cookies de terceros bloqueadas o en un iframe de otro origen, el navegador lanza `SecurityError` (code 18) al **leer** la propiedad `window.localStorage`, antes de cualquier `getItem`/`setItem`. Por eso el acceso a la propiedad tiene que estar dentro del `try`.
- **Degradación elegante.** Cuando un storage no está disponible, el otro sigue funcionando: `eliminar()` y `listar()` siguen con el storage restante. `eliminar()` devuelve `false` porque no puede garantizar que la clave se haya borrado de todos lados. El controlador (`escribirEnAlmacenamiento`, issue #111) usa ese `boolean` para avisarle al usuario en vez de reportar un falso éxito.
- **Sin escrituras parciales.** Si `setItem` lanza, el valor anterior de la clave queda intacto (RC6-19 a RC6-22, caso c). El usuario pierde solo el último cambio, no el dato guardado.

### 6.4 Bug encontrado y corregido

Los tests RC6-03 (getter que lanza `SecurityError`) **fallaban** contra el `js/utils/storage.js` mergeado. `eliminar()` y `listar()` armaban el array `[window.localStorage, window.sessionStorage]` **fuera** del `try`, así que la excepción del getter llegaba al llamador y rompía el contrato de "ninguna operación lanza". `guardar()`/`cargar()` no tenían el problema, porque `resolverStorage()` ya se llamaba dentro del `try`.

**Fix mínimo** en `js/utils/storage.js`: los dos bucles recorren `NOMBRES_STORAGE = ["localStorage", "sessionStorage"]` y leen `window[nombre]` dentro del `try`. No cambia el contrato público ni el comportamiento cuando el storage funciona.

**Verificación por mutación:** al volver a poner el acceso fuera del `try`, la suite pasa de 0 a **9 fallas** (todas en el bloque RC6-03). Con el fix, 0 fallas.

### 6.5 Resultados de ejecución

En esta máquina no hay Node.js, así que no se pudo usar `node js/test/run-jasmine.js`. La suite se ejecutó con el mismo `test-runner.html` en **Microsoft Edge headless** (Chromium), con `msedge --headless=new --virtual-time-budget=20000 --dump-dom` y logging de consola habilitado:

```
174 specs, 0 failures, randomized with seed 29568
174 specs, 0 failures, randomized with seed 52775
174 specs, 0 failures, randomized with seed 40154
174 specs, 0 failures, randomized with seed 55507
174 specs, 0 failures, randomized with seed 53786
```

Total: 71 (`models.spec.js`) + **82** (`storage.spec.js`: 19 anteriores + 63 de RC6) + 21 (`script.spec.js`). En las 5 corridas, los únicos mensajes de consola fueron avisos de Tracking Prevention de Edge sobre los recursos de Jasmine en el CDN; ninguno vino de la aplicación ni de los tests. Queda pendiente repetir la corrida con `node js/test/run-jasmine.js` en un entorno con Node.js y Playwright, para que la evidencia quede con el runner oficial del proyecto.

### 6.6 Checklist de cierre RC6

- [x] Storage ausente (`null`/`undefined`) e inaccesible (getter que lanza) en `localStorage` y `sessionStorage` (RC6-01 a RC6-04).
- [x] `SecurityError` estándar (`DOMException`, code 18) y legacy, en getter, `setItem`, `getItem` y `removeItem` (RC6-03, RC6-05 a RC6-09).
- [x] Errores de lectura (`getItem` que lanza) y datos no deserializables (RC6-07, RC6-10 a RC6-12).
- [x] Errores de borrado (`removeItem` y `clear`) (RC6-08, RC6-13 a RC6-15).
- [x] Errores de listado (`key` y `length`) (RC6-16 a RC6-18).
- [x] Códigos alternativos de cuota: `QuotaExceededError`/22, `NS_ERROR_DOM_QUOTA_REACHED`/1014, `QUOTA_EXCEEDED_ERR`/22 e IE `E_OUTOFMEMORY` (RC6-19 a RC6-23).
- [x] Espías restaurados después de cada spec y limpieza en `afterEach` con referencias reales, sin contaminar otras suites (5 corridas con semillas aleatorias distintas, 0 fallas).
- [x] Bug de `SecurityError` en `eliminar()`/`listar()` corregido en `js/utils/storage.js` (sección 6.4).
- [x] `js/test/testing-doc.md` actualizado con los casos, la justificación técnica y las métricas nuevas.
