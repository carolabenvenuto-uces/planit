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

### 0. Realineación respecto del plan inicial
El MOMENTO 1 se redactó el 19/10, antes de que el equipo acordara los flujos definitivos, y se conserva sin cambios como evidencia histórica. Las diferencias con lo implementado son:

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

**Output generado por Copilot (resumen):** creó `js/test/script.spec.js` con las 4 suites con los nombres exactos y un `describe()` anidado por función, cubriendo los 27 casos de `testing-doc.md` en 32 `it()`. Algunos casos se dividieron en varias specs, una por situación (casos 5 y 7 de la Suite 1, caso 5 de la Suite 2, y casos 5 y 6 de la Suite 4). Informó que no encontró discrepancias entre `testing-doc.md` y el JSDoc de `script.js`, que usó los datos reales del archivo, que verificó la inmutabilidad de los arrays y que no modificó `script.js` ni `test-runner.html`.

**Prompt 2: ejecución con Playwright MCP**
- **Herramienta:** GitHub Copilot en Modo Agente + Playwright MCP (`@playwright/mcp`, configurado en `.vscode/mcp.json`).

```text
Usá Playwright MCP para abrir js/test/test-runner.html en el navegador (si no puede abrir rutas file://, levantá un servidor con npx http-server -p 8080 desde la raíz del repo y abrí http://localhost:8080/js/test/test-runner.html).

1. Esperá a que Jasmine termine de ejecutar todas las suites.
2. Guardá un screenshot de la página completa en js/test/screenshots/tests-passing.png.
3. Mostrá la lista de specs con sus resultados y guardá otro screenshot en js/test/screenshots/suite-detail.png.
4. Informame la cantidad total de specs, cuántas pasaron y cuántas fallaron, con el nombre y el mensaje de error de cada spec fallida, y los errores de consola si los hay.
```

**Output generado por Copilot (resumen):** levantó `http-server` en el puerto 8080, instaló el navegador de Playwright porque no estaba disponible en el entorno, abrió el runner, leyó los resultados de Jasmine y la consola, y guardó los dos screenshots. Informó: 32 specs, 0 fallas, ejecución en 0,137 s con seed 88986, y 0 errores y 0 advertencias en la consola.

### 2. Resultados de Ejecución y Métricas
* **Total de Suites:** 4
* **Total de Tests (Specs):** 32 (8 en la Suite 1, 9 en la Suite 2, 7 en la Suite 3 y 8 en la Suite 4)
* **Tests Exitosos (PASS):** 32
* **Tests Fallidos (FAIL):** 0
* **Bugs Reportados:** 0. No se detectaron fallas, por lo que no se abrieron issues de bugs.
* **Cobertura estimada:** 94% de la capa de lógica de negocio (68/72 líneas ejecutables). El detalle y las líneas no cubiertas están en [`js/test/testing-doc.md`](../../../js/test/testing-doc.md).

### 3. Evidencia Gráfica (Screenshots de Playwright MCP)

**Ejecución completa:** 32 specs, 0 fallas.

![Tests Exitosos](../../../js/test/screenshots/tests-passing.png)

**Detalle de las suites:**

![Suite Detalle](../../../js/test/screenshots/suite-detail.png)

### 4. Ajustes Manuales y Coordinación con el Desarrollador JavaScript

**Ajustes manuales sobre el output de Copilot:** el `script.spec.js` se revisó caso por caso contra el código de `js/script.js` y no requirió cambios: todos los resultados esperados coincidían con el comportamiento real de las funciones. Se descartó la carpeta `.playwright-mcp` que generó Playwright MCP, que no forma parte de la entrega.

**Coordinación con el Desarrollador JavaScript** (issue [#72](https://github.com/carolabenvenuto-uces/planit/issues/72)):
- Se acordaron los nombres, parámetros y retornos de las funciones de negocio antes de implementar el código, y se documentaron en `spec-dev-javascript.md`.
- Se definió el manejo de errores: las funciones `validar*` devuelven `true`/`false`, y `aplicarDescuento`, `buscarEnCatalogo` y `agregarInvitado` lanzan un `Error`, lo que permite testearlas con `toThrow()`.
- Se pidió que el menú no se iniciara al cargar `script.js` en el runner, para que los `prompt()` no bloquearan la ejecución. El Desarrollador lo resolvió con `if (typeof jasmine === "undefined")`.
- Se acordó que `agregarEvento` y `agregarInvitado` devolvieran un array nuevo, lo que permitió verificar su inmutabilidad.
- Se documentó en `plan.md` la exclusión del estado "Declinado" del mockup, y se usó como ejemplo de estado inválido en los tests.

### 5. Obstáculos y Resolución
| Obstáculo | Resolución |
| --- | --- |
| vscode.dev no puede ejecutar servidores MCP como Playwright, porque no ejecuta comandos como `npx`. | La generación y la ejecución de los tests se realizaron en GitHub Codespaces. |
| La rama de testing no tenía `js/script.js` porque se creó antes del merge de la PR del Desarrollador. | Se integró `develop` en la rama antes de generar los tests. |
| El Codespace se cerró durante la sesión y se perdió el chat de Copilot antes de commitear `script.spec.js`. | Se reabrió el mismo Codespace, se recuperó el archivo, que seguía en disco, y se commiteó de inmediato. La respuesta de Copilot se había guardado aparte. |
| Playwright MCP no encontraba un navegador instalado en el Codespace. | Copilot instaló el navegador de Playwright y repitió la ejecución. |

### 6. Checklist Final de Cierre
- [x] `spec-tester.md` creado y commiteado antes de `script.spec.js`.
- [x] Runner `js/test/test-runner.html` configurado con Jasmine 5.10 por CDN, cargando `../script.js` y `script.spec.js`.
- [x] 4 suites de tests en `js/test/script.spec.js`, con 7 a 9 tests por suite (32 en total).
- [x] Tests ejecutados en un navegador real mediante Playwright MCP, con resultados PASS/FAIL capturados.
- [x] Screenshots del test runner agregados a la documentación.
- [x] Bugs reportados como issues: no se detectaron fallas (0 issues).
- [x] Documentación técnica completa en `js/test/testing-doc.md`.