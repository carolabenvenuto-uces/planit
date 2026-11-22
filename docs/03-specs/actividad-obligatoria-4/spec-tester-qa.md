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
