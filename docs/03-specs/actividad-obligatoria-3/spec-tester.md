# Especificación Técnica (Spec) - Tester JavaScript / QA Engineer

- **Proyecto:** PlanIT - Plataforma All-in-One de Organización & Experiencias
- **Entrega:** Actividad Obligatoria N° 3
- **Rol:** Tester JavaScript / QA Engineer
- **Responsable:** Carola Benvenuto (@carolabenvenuto-uces)
- **Rama:** `feature/tester-javascript-jasmine`
- **Issue principal:** [#76](https://github.com/carolabenvenuto-uces/planit/issues/76)
- **Fecha:** 19 de octubre de 2026

---

## MOMENTO 1: Planificación Previa (ANTES de comenzar)

### 1. Plan de Testing y Cobertura
Se diseñará e implementará una suite de testing automatizado ejecutable en navegador utilizando la librería **Jasmine 5.x** para validar la lógica de negocio, manipulación del DOM, algoritmos de cálculo y gestión del estado alojados en `js/script.js`.

Se estructurarán **4 suites de tests** principales en `js/test/script.spec.js` (mínimo 3 test cases por suite) abarcando los siguientes flujos del dashboard de PlanIT:

* **Flujo 1: Presupuesto y Cálculos Financieros (`#presupuesto`)**
  * *Función/Módulo:* Cálculos de totales, desglose de costos y formateo de moneda.
  * *Casos:* Happy path con valores positivos, valores en cero, rechazo de montos negativos o no numéricos.
* **Flujo 2: Gestión e Interacción con el Catálogo (`#catalogo`)**
  * *Función/Módulo:* Adición, filtrado y búsqueda de experiencias/servicios.
  * *Casos:* Selección e incorporación de ítems al evento, filtrado por categorías, búsqueda de textos inexistentes o strings vacíos.
* **Flujo 3: Lista de Tareas e Invitados (`#invitados` y Tareas)**
  * *Función/Módulo:* Mutación de arrays y objetos de la lista de tareas y confirmaciones de asistencia.
  * *Casos:* Agregar y eliminar tareas/invitados, cambio de estado (completado/pendiente), manejo de estructuras vacías o duplicados.
* **Flujo 4: Validación de Formularios y Datos de Entrada**
  * *Función/Módulo:* Validaciones de inputs y tipos de datos.
  * *Casos:* Entradas válidas, cadenas vacías, inyección de caracteres inválidos, valores `null` o `undefined`.

### 2. Herramientas a Utilizar y Justificación
* **GitHub Copilot en Modo Agente:** Se utilizará para generar la estructura de los test cases en `js/test/script.spec.js` utilizando `js/script.js` como contexto.
  * *Justificación:* Acelera la escritura de assertions limpias y exhaustivas garantizando la cobertura de happy paths y edge cases.
* **Playwright MCP (`@playwright/mcp`):** Servidor MCP oficial de Microsoft integrado en VS Code (`.vscode/mcp.json`).
  * *Justificación:* Permite al agente controlar un navegador Chromium en tiempo real, abrir `js/test/test-runner.html`, ejecutar la suite de Jasmine y capturar screenshots automáticas del resultado PASS/FAIL para evidencia.

### 3. Criterios de Aceptación (Checklist)
- [x] `spec-tester.md` creado y commiteado en `docs/03-specs/actividad-obligatoria-3/` antes de la creación de `script.spec.js`.
- [ ] Runner `js/test/test-runner.html` configurado con Jasmine CDN y scripts cargados.
- [ ] 4 suites de tests desarrolladas en `js/test/script.spec.js` (mínimo 3 tests por suite).
- [ ] Tests ejecutados en navegador real mediante Playwright MCP con todas las suites en PASS.
- [ ] Capturas de pantalla (screenshots) del test runner agregadas a la documentación.
- [ ] Bugs/Desvíos detectados reportados como Issues en GitHub con código del test que falla.
- [ ] Documentación técnica completa en `js/test/testing-doc.md`.

---

## MOMENTO 2: Evidencia de Cierre (AL FINALIZAR)

> El checklist del MOMENTO 1 se conserva sin modificar como registro del plan inicial. El cumplimiento de cada criterio se registra en el checklist final de esta sección.

### 0. Realineación respecto del plan inicial
El MOMENTO 1 se redactó el 19/10, antes de que el equipo acordara los flujos definitivos, y se conserva como evidencia histórica. Su única modificación fue la corrección del número de la issue principal (de #75, que corresponde a la PR de coordinación, a #76) en el commit `5ef9101`. Las diferencias con lo implementado son:

- **Flujos:** las 4 suites se alinearon con los flujos de negocio modelados por la Arquitecta de Diagramas e implementados en `js/script.js`: **Crear evento**, **Calcular presupuesto**, **Buscar en catálogo** y **Gestionar invitados**. No se testean tareas ni una suite separada de validación de formularios: las validaciones se prueban dentro de cada flujo.
- **Sin DOM:** el plan mencionaba manipulación del DOM y secciones del sitio (`#presupuesto`, `#catalogo`, `#invitados`). La AO3 no usa DOM ni eventos, así que los tests cubren solo la lógica de negocio pura de `js/script.js`.
- **Criterio de ejecución:** el criterio "todas las suites en PASS" se reemplazó por "resultados PASS/FAIL capturados", porque el objetivo del testing es registrar los resultados reales y reportar los bugs que aparezcan.

### 1. Prompts Utilizados en Copilot Agent

**Prompt 1: generación de `js/test/script.spec.js`**
- **Herramienta:** GitHub Copilot en Modo Agente.
- **Archivos adjuntos como contexto:** `js/script.js` y `js/test/testing-doc.md` (con los 27 casos planificados por suite).

```text
Actuá como Tester JavaScript / QA Engineer para la Actividad Obligatoria N.° 3 del proyecto PlanIT.

Con #file:js/script.js y #file:js/test/testing-doc.md como contexto, generá el archivo js/test/script.spec.js con Jasmine 5.10 para ejecutarse en el navegador desde js/test/test-runner.html.

Requisitos:
1. Cuatro suites principales con describe(), una por flujo y con estos nombres exactos: "Flujo 1: Crear evento", "Flujo 2: Calcular presupuesto", "Flujo 3: Buscar en catálogo" y "Flujo 4: Gestionar invitados". Dentro de cada una, un describe() anidado por función testeada.
2. Implementá todos los casos de prueba de la sección "Suites de Tests" de testing-doc.md (27 casos), uno o más it() por caso, con descripciones en español que empiecen con "debería".
3. Testeá solo las funciones de negocio puras de script.js (validarDatosEvento, crearEvento, agregarEvento, calcularTotalItems, aplicarDescuento, superaPresupuesto, buscarEnCatalogo, el método coincideCon de los proveedores, validarInvitado, agregarInvitado y contarAsistencia). No llames a funciones flujo*, iniciarMenuPrincipal, prompt() ni alert().
4. Usá los datos reales de script.js (itemsContratados, catalogoProveedores, invitados, PRESUPUESTO_EJEMPLO) y creá arrays locales dentro de cada it() cuando necesites datos propios.
5. Verificá que agregarEvento, agregarInvitado y buscarEnCatalogo no modifiquen el array original (comparando largo y contenido antes y después).
6. Usá las assertions adecuadas: toBe, toEqual, toBeTruthy/toBeFalsy, toContain y toThrow (envolviendo la llamada en una función).
7. No modifiques js/script.js ni js/test/test-runner.html.

Respetá exactamente las firmas, los retornos y el manejo de errores definidos en script.js. Si algún caso de testing-doc.md no coincide con el comportamiento documentado en el JSDoc, indicámelo en lugar de forzar el test.
```

**Output generado por Copilot (resumen):** creó `js/test/script.spec.js` con las 4 suites con los nombres exactos y un `describe()` anidado por función, cubriendo los 27 casos de `testing-doc.md` en 32 `it()`. Informó que dividió en varias specs los casos 5 y 7 de la Suite 1, el caso 5 de la Suite 2 y los casos 5 y 6 de la Suite 4; al revisar el archivo se verificó que el caso 5 de la Suite 1 quedó en un único `it()`, por lo que la cuenta es 27 + 1 + 2 + 2 = 32. También informó que no encontró discrepancias entre `testing-doc.md` y el JSDoc de `script.js`, que usó los datos reales del archivo, que verificó la inmutabilidad de los arrays y que no modificó `script.js` ni `test-runner.html`.

**Prompt 2: primera ejecución con Playwright MCP (28/10)**
- **Herramienta:** GitHub Copilot en Modo Agente + Playwright MCP (`@playwright/mcp`). Se reutilizó la configuración de `.vscode/mcp.json` incorporada al repositorio en la Actividad Obligatoria N.° 2, por lo que ese archivo no forma parte del diff de esta PR.

```text
Usá Playwright MCP para abrir js/test/test-runner.html en el navegador (si no puede abrir rutas file://, levantá un servidor con npx http-server -p 8080 desde la raíz del repo y abrí http://localhost:8080/js/test/test-runner.html).

1. Esperá a que Jasmine termine de ejecutar todas las suites.
2. Guardá un screenshot de la página completa en js/test/screenshots/tests-passing.png.
3. Mostrá la lista de specs con sus resultados y guardá otro screenshot en js/test/screenshots/suite-detail.png.
4. Informame la cantidad total de specs, cuántas pasaron y cuántas fallaron, con el nombre y el mensaje de error de cada spec fallida, y los errores de consola si los hay.
```

**Output generado por Copilot (resumen):** levantó `http-server` en el puerto 8080, instaló el navegador de Playwright, abrió el runner, leyó los resultados de Jasmine y la consola, y guardó los dos screenshots. Informó: 32 specs, 0 fallas, seed 88986, 0,137 s, y 0 errores y 0 advertencias en la consola.

**Prompt 3: re-ejecución con Playwright MCP tras la review de la PR #79 (30/10)**
- **Herramienta:** GitHub Copilot en Modo Agente (sesión Local) + Playwright MCP.

```text
Usá exclusivamente las herramientas de Playwright MCP (browser_navigate, browser_take_screenshot, browser_evaluate, etc.); el servidor playwright está iniciado. Si no están disponibles, detenete y avisame: no uses Playwright por línea de comandos ni scripts de Node. Levantá un servidor con npx http-server -p 8080 desde la raíz del repo y abrí http://localhost:8080/js/test/test-runner.html. 1) Esperá a que Jasmine termine y guardá un screenshot de página completa en js/test/screenshots/tests-passing.png, reemplazando el anterior. 2) Para cada flujo, abrí el runner filtrado con ?spec=Flujo%201 (y 2, 3, 4) y guardá un screenshot de página completa en js/test/screenshots/flujo-1-crear-evento.png, flujo-2-calcular-presupuesto.png, flujo-3-buscar-catalogo.png y flujo-4-gestionar-invitados.png. 3) Informame total de specs, pasadas, fallidas, seed, duración, specs por flujo, errores de consola y qué herramientas de Playwright MCP usaste. No modifiques ningún archivo .js ni .html.
```

**Output generado por Copilot (resumen):** usó las herramientas `browser_navigate`, `browser_evaluate`, `browser_take_screenshot` y `browser_console_messages` de Playwright MCP. Guardó la captura general y una por flujo. Informó: 43 specs, 43 pasadas, 0 fallidas, seed 91363, 0,418 s; por flujo, 11, 13, 9 y 10 specs; 0 errores y 0 advertencias en la consola. No modificó archivos `.js` ni `.html`.

### 2. Resultados de Ejecución y Métricas
* **Total de Suites:** 4
* **Total de Tests (Specs):** 43 (11 en la Suite 1, 13 en la Suite 2, 9 en la Suite 3 y 10 en la Suite 4)
* **Tests Exitosos (PASS):** 43
* **Tests Fallidos (FAIL):** 0
* **Bugs Reportados:** 0. No se detectaron fallas, por lo que no se abrieron issues de bugs.
* **Cobertura estimada:** 100% (75/75 líneas ejecutables) de las funciones incluidas en el plan de testing; antes de la review era del 94% (68/72). El detalle está en [`js/test/testing-doc.md`](../../../js/test/testing-doc.md).

### 3. Evidencia Gráfica (Screenshots de Playwright MCP)

**Ejecución completa:** 43 specs, 0 fallas.

![Tests Exitosos](../../../js/test/screenshots/tests-passing.png)

**Detalle por flujo:**

![Flujo 1: Crear evento](../../../js/test/screenshots/flujo-1-crear-evento.png)

![Flujo 2: Calcular presupuesto](../../../js/test/screenshots/flujo-2-calcular-presupuesto.png)

![Flujo 3: Buscar en catálogo](../../../js/test/screenshots/flujo-3-buscar-catalogo.png)

![Flujo 4: Gestionar invitados](../../../js/test/screenshots/flujo-4-gestionar-invitados.png)

### 4. Ajustes Manuales y Coordinación con el Desarrollador JavaScript

**Ajustes manuales sobre el output de Copilot:** en una primera revisión, el `script.spec.js` se contrastó caso por caso con `js/script.js` y todos los resultados esperados coincidían con el comportamiento real de las funciones. A partir de la review de la PR [#79](https://github.com/carolabenvenuto-uces/planit/pull/79) realizada por el Desarrollador JavaScript, se hicieron estos ajustes manuales:
- Se agregaron 8 tests con `null`/`undefined`, tipos incorrectos y valores muy grandes en los 4 flujos (`validarDatosEvento`, `aplicarDescuento`, `buscarEnCatalogo`, `coincideCon`, `validarInvitado` y `agregarInvitado`), porque el output inicial no cubría esos casos que pide la consigna.
- Se agregaron 2 tests para `obtenerPresupuestoEstimado()`, una función pura del Flujo 2 que había quedado fuera del plan.
- La assertion del caso "total menor al presupuesto" se separó en su propio `it()`, porque estaba dentro del test del caso "igual".
- La verificación de que el catálogo no se modifica pasó de una copia superficial (`slice()`) a una comparación profunda con `JSON.stringify()`. No se usó `JSON.parse()` + `toEqual()` porque los proveedores son instancias de `Proveedor`, y `toEqual` de Jasmine también compara el constructor.
- Se quitó una assertion `toBeTruthy()` redundante en la Suite 1 y se corrigió la redacción de "debería no modificar" por "no debería modificar".
- Se descartó la carpeta `.playwright-mcp` que generó Playwright MCP, que no forma parte de la entrega.

Con esos cambios, la suite pasó de 32 a 43 tests y la cobertura estimada, del 94% al 100% de las funciones del plan.

**Coordinación con el Desarrollador JavaScript** (issue [#72](https://github.com/carolabenvenuto-uces/planit/issues/72) y review de la PR #79):
- Se acordaron los nombres, parámetros y retornos de las funciones de negocio antes de implementar el código, y se documentaron en `spec-dev-javascript.md`.
- Se definió el manejo de errores: las funciones `validar*` devuelven `true`/`false`, y `aplicarDescuento`, `buscarEnCatalogo` y `agregarInvitado` lanzan un `Error`, lo que permite testearlas con `toThrow()`.
- Se pidió que el menú no se iniciara al cargar `script.js` en el runner, para que los `prompt()` no bloquearan la ejecución. El Desarrollador lo resolvió con `if (typeof jasmine === "undefined")`.
- Se acordó que `agregarEvento` y `agregarInvitado` devolvieran un array nuevo, lo que permitió verificar su inmutabilidad.
- `plan.md` define solo los estados de invitado Confirmado y Pendiente; el estado "Declinado" que aparece en el mockup se usó en los tests como ejemplo de estado inválido.
- En la review de la PR #79, el Desarrollador verificó los tests contra `script.js` y propuso los casos con `null`/`undefined`, tipos incorrectos y valores muy grandes que se incorporaron como ajustes.

### 5. Obstáculos y Resolución
| Obstáculo | Resolución |
| --- | --- |
| vscode.dev no puede ejecutar servidores MCP como Playwright, porque no ejecuta comandos como `npx`. | La generación y la ejecución de los tests se realizaron en GitHub Codespaces. |
| La rama de testing no tenía `js/script.js` porque se creó antes del merge de la PR del Desarrollador. | Se integró `develop` en la rama antes de generar los tests. |
| El Codespace se cerró durante la sesión y se perdió el chat de Copilot antes de commitear `script.spec.js`. | Se reabrió el mismo Codespace, se recuperó el archivo, que seguía en disco, y se commiteó de inmediato. La respuesta de Copilot se había guardado aparte. |
| Playwright MCP no encontraba un navegador instalado en el Codespace. | Copilot instaló el navegador de Playwright y repitió la ejecución. |
| En la re-ejecución del 30/10, el chat de Copilot estaba en modo de sesión "Copilot" (CLI), que no accede a los servidores MCP del workspace, y el servidor `playwright` estaba detenido. Copilot ejecutó los tests con Playwright por línea de comandos en lugar de Playwright MCP. | Se descartó esa corrida: sus capturas se reemplazaron. Se cambió el chat a una sesión "Local", se inició el servidor `playwright` desde "MCP: List Servers" y se repitió la ejecución con las herramientas de Playwright MCP (Prompt 3). |

### 6. Checklist Final de Cierre
- [x] `spec-tester.md` creado y commiteado antes de `script.spec.js`.
- [x] Runner `js/test/test-runner.html` configurado con Jasmine 5.10 por CDN, cargando `../script.js` y `script.spec.js`.
- [x] 4 suites de tests en `js/test/script.spec.js`, con 9 a 13 tests por suite (43 en total).
- [x] Tests ejecutados en un navegador real mediante Playwright MCP, con resultados PASS/FAIL capturados (ejecución final del 30/10/2026).
- [x] Screenshots del test runner agregados a la documentación: uno general y uno por flujo.
- [x] Bugs reportados como issues: no se detectaron fallas (0 issues).
- [x] Documentación técnica completa en `js/test/testing-doc.md`.