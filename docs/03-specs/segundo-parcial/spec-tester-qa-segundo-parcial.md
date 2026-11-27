# Especificación Técnica (Spec) - Tester QA/JS - Testing Avanzado

- **Proyecto:** PlanIT - Plataforma All-in-One de Organización & Experiencias
- **Entrega:** Segundo Parcial
- **Rol:** Tester QA/JS - Testing Avanzado (en conjunto con Coordinador/DevOps)
- **Responsable:** Valeria Silva (@ValeriaMSilva)
- **Rama:** `feature/tester-qa-js-testing-suite`
- **Issue principal:** [#139](https://github.com/carolabenvenuto-uces/planit/issues/139)
- **Fecha:** 25 de noviembre de 2026

---

## MOMENTO 1: Planificación Previa (ANTES de escribir cualquier test o correr Lighthouse)

### 1. Información general

#### 1.1. Contexto del Segundo Parcial

El Segundo Parcial incorpora a PlanIT dos capacidades nuevas sobre la arquitectura consolidada en la Actividad Obligatoria N° 4 (clases de dominio en `js/models/`, controlador en `js/script.js`, capa de almacenamiento en `js/utils/storage.js` y fachada de persistencia en `js/services/ServicioPersistenciaEvento.js`):

1. **Consumo asíncrono de datos** mediante `fetch` y promesas, encapsulado en `js/api/apiService.js` (rama `feature/dev-async-fetch-api`).
2. **Integración de una librería externa** de JavaScript. [Librería a definir]

Este spec define, **antes** de que exista cualquier test nuevo y antes de la primera auditoría, qué se va a probar, con qué criterios y en qué momentos. Se commitea primero para que la planificación quede trazable en el historial de git, con el mismo criterio de las entregas anteriores (ver `docs/03-specs/actividad-obligatoria-4/spec-tester-qa.md`).

#### 1.2. Composición del grupo y asignación de roles

El grupo de este parcial está conformado por **3 integrantes**. Por ese motivo, quien suscribe asume **dos roles en simultáneo**:

- **Tester QA/JS - Testing Avanzado:** diseño y ejecución de la suite de Jasmine para la API y la librería, actualización de las suites existentes y auditorías de Lighthouse.
- **Coordinador/DevOps:** gestión de ramas, revisión y orden de merge de las PR, coordinación de la publicación en GitHub Pages con la owner del repositorio y registro en `changelog.md`.

La acumulación de roles tiene una consecuencia directa sobre este plan: el orden de los merges (que decide Coordinación) define los momentos de las auditorías de Lighthouse (sección 3). Para evitar que una misma persona apruebe su propio trabajo sin control cruzado, las PR de testing de esta rama se someten a la revisión de al menos un compañero antes del merge.

#### 1.3. Punto de partida

- `develop` es idéntica a `master` tras el backport de la AO4 (PR #137, commit `fe2a056`). Ninguna feature del Segundo Parcial está mergeada todavía.
- La suite actual se ejecuta con `npm test` (`node js/test/run-jasmine.js`), que carga `js/test/test-runner.html` en un Chromium headless mediante Playwright. El runner incluye cuatro suites: `models.spec.js`, `storage.spec.js`, `servicio-persistencia.spec.js` y `script.spec.js`, todas en verde al cierre de la AO4 (ver `js/test/testing-doc.md`).
- El diseño preliminar del servicio de datos está documentado en `docs/03-specs/segundo-parcial/spec-dev-async-fetch.md` (rama `feature/dev-async-fetch-api`, aún sin mergear). Los nombres de funciones y la estructura de datos que se mencionan en ese documento se toman como **referencia tentativa**; los casos de este spec se redactarán en su versión definitiva una vez mergeada la implementación.

---

### 2. Plan de testing funcional con Jasmine

#### 2.1. Criterios generales

- **Aislamiento de la red:** `fetch` se mockea en todos los casos con `spyOn(window, "fetch")`, devolviendo promesas resueltas o rechazadas construidas en el propio test (`Promise.resolve(new Response(...))` o `Promise.reject(new TypeError(...))`). Ningún test depende de la red, de GitHub Pages ni de la disponibilidad de un servidor, de modo que la suite es determinista y reproducible por línea de comandos.
- **Asincronía:** los casos usan `async/await` en el cuerpo del `it()` (soportado de forma nativa por Jasmine 5.x), sin `done()` ni temporizadores reales.
- **Fixture de DOM:** los casos de integración con el DOM montan un *sandbox* con los mismos `id`/`data-*` que `index.html` y lo retiran en `afterEach`, igual que los specs de integración RC14–RC16 de la AO4. Así no se altera el fixture compartido de `test-runner.html` ni el orden aleatorio de Jasmine afecta el resultado.
- **Carga en el runner:** `js/api/apiService.js`, la librería externa y los nuevos archivos de spec se agregan a `js/test/test-runner.html` respetando el orden de dependencias (modelos → servicios → API → librería → controlador → specs).
- **Convención de nombres:** cada `it()` comienza con su ID (por ejemplo, `API-03: ...`), para que la tabla de este spec y el reporte de Jasmine se puedan cruzar directamente.

#### 2.2. `js/test/api.spec.js` — tests de `ApiService` (`js/api/apiService.js`)

Cubre el servicio de datos de forma unitaria (sin DOM) y su integración con el controlador (con DOM). Los nombres de las funciones son tentativos y se confirmarán contra la implementación mergeada. [API a definir]

- **Respuesta exitosa:** `fetch` devuelve un `Response` con `ok: true` y el JSON esperado; el servicio devuelve los datos parseados y validados.
- **Error HTTP:** `fetch` devuelve un `Response` con `status` 404 o 500; el servicio lanza un `Error` que identifica el código de estado, sin intentar parsear el cuerpo como datos válidos.
- **Error de red:** `fetch` rechaza la promesa (`TypeError: Failed to fetch`); el servicio aplica la política de reintento definida por la implementación y, si persiste, propaga el error.
- **Procesamiento con funciones de orden superior:** con un conjunto de datos conocido, se verifica el resultado de la transformación (`map`), del filtrado (`filter`) y de la agregación (`reduce`).
- **Integración con el DOM:** se verifica que el controlador refleje los estados `loading`, `success` y `error` en la sección correspondiente, incluido el *fallback* cuando la carga falla.

#### 2.3. `js/test/library.spec.js` — tests de la librería externa

La librería todavía no fue elegida por el equipo. [Librería a definir] Los casos se plantean de forma genérica, con independencia de la librería concreta, y se instanciarán cuando se defina:

- **Inicialización:** la librería está disponible en el ámbito global (o en el módulo que corresponda) y se inicializa sin errores sobre su contenedor.
- **Configuración:** las opciones que define el proyecto (idioma, formato, tema, accesibilidad, etc.) quedan aplicadas tal como se especificaron.
- **Funcionalidad principal integrada:** el caso de uso principal funciona con datos reales del dominio de PlanIT.
- **Manejo de errores:** ante datos inválidos, contenedor inexistente o librería no cargada (por ejemplo, falla del CDN), la aplicación degrada sin lanzar excepciones no controladas, con el mismo criterio que RC15 aplicó a Bootstrap.
- **Interacción con otras partes del sistema:** la librería consume datos de los modelos POO o de `ApiService`, y sus acciones se reflejan correctamente en el controlador y, si corresponde, en la persistencia.

#### 2.4. Actualización de `script.spec.js` y `models.spec.js`

Si las PR del parcial modifican las clases POO o el controlador, las suites existentes se actualizan en la misma ronda de testing:

- **`models.spec.js`:** casos nuevos para cualquier método, validación o cambio de `toJSON()`/`fromJSON()` que se agregue a `Proveedor`, `CatalogoProveedores` u otra clase. Los casos existentes que dejen de corresponder se retiran o se ajustan, documentando el motivo.
- **`script.spec.js`:** si el catálogo deja de construirse desde el marcado (`construirCatalogoDesdeMarcado`) para cargarse vía `ApiService`, los casos del Flujo 3 se adaptan para que el catálogo provenga de un `fetch` mockeado, y se verifica que la búsqueda y el filtro por categoría sigan funcionando sobre los datos recibidos.
- **Regresión:** la suite completa (incluidas `storage.spec.js` y `servicio-persistencia.spec.js`) debe seguir en verde después de cada merge.

#### 2.5. Tabla de casos de prueba

| ID | Archivo | Descripción | Tipo | Resultado esperado |
|---|---|---|---|---|
| API-01 | `api.spec.js` | Carga de datos con respuesta `200` y JSON válido (`fetch` mockeado). [API a definir] | Éxito | Se devuelven los datos parseados; `fetch` se invoca una vez con la URL esperada. |
| API-02 | `api.spec.js` | Respuesta con registros incompletos o inválidos mezclados con registros válidos. | Error | Se descartan solo los registros inválidos; los válidos se devuelven sin alteraciones. |
| API-03 | `api.spec.js` | Respuesta HTTP `404`. | Error | Se lanza un `Error` cuyo mensaje incluye el código `404`. |
| API-04 | `api.spec.js` | Respuesta HTTP `500`. | Error | Se lanza un `Error` cuyo mensaje incluye el código `500`. |
| API-05 | `api.spec.js` | `fetch` rechazado (error de red). | Error | Se aplica la política de reintento y luego se propaga el error; el número de llamadas a `fetch` coincide con lo especificado. |
| API-06 | `api.spec.js` | Respuesta `200` con un cuerpo que no es JSON válido o con estructura inesperada. | Error | Se lanza un `Error` de formato, distinguible de un error HTTP o de red. |
| API-07 | `api.spec.js` | Transformación de los datos con `map` en instancias de las clases POO. | Éxito | Cada elemento resultante es instancia de la clase esperada (por ejemplo, `Proveedor`) y conserva sus valores. |
| API-08 | `api.spec.js` | Filtrado con `filter` por un criterio conocido (por ejemplo, categoría o precio máximo). | Éxito | Se devuelven exactamente los elementos que cumplen el criterio. |
| API-09 | `api.spec.js` | Filtrado con `filter` sin coincidencias. | Éxito | Se devuelve un arreglo vacío, sin lanzar errores. |
| API-10 | `api.spec.js` | Agregación con `reduce` sobre un conjunto conocido (totales, conteos o rangos). | Éxito | El resultado coincide con el valor calculado a mano. |
| API-11 | `api.spec.js` | Agregación con `reduce` sobre un arreglo vacío. | Éxito | Se devuelve el valor inicial definido, sin `NaN` ni excepciones. |
| API-12 | `api.spec.js` | Estado `loading` en el DOM mientras la promesa de `fetch` está pendiente. | Éxito | Se muestra el indicador de carga, anunciado de forma accesible (`aria-live`), y los controles dependientes quedan deshabilitados. |
| API-13 | `api.spec.js` | Estado `success` en el DOM tras una respuesta válida. | Éxito | Se renderizan los datos recibidos y desaparece el indicador de carga. |
| API-14 | `api.spec.js` | Estado `error` en el DOM tras una falla HTTP o de red. | Error | Se muestra un mensaje amigable sin detalles técnicos, junto con la acción de reintento y el *fallback* definido. |
| LIB-01 | `library.spec.js` | Inicialización de la librería sobre su contenedor. [Librería a definir] | Éxito | La librería está disponible y se inicializa sin errores. |
| LIB-02 | `library.spec.js` | Configuración aplicada según lo especificado por el proyecto. | Éxito | Las opciones configuradas se reflejan en la instancia o en el DOM generado. |
| LIB-03 | `library.spec.js` | Funcionalidad principal con datos del dominio de PlanIT. | Éxito | El resultado visible o el valor devuelto coincide con el esperado. |
| LIB-04 | `library.spec.js` | Datos de entrada inválidos o contenedor inexistente. | Error | La aplicación no lanza excepciones no controladas y muestra o registra el error de forma controlada. |
| LIB-05 | `library.spec.js` | Librería no cargada (falla del CDN simulada). | Error | La funcionalidad degrada sin romper el resto de la página. |
| LIB-06 | `library.spec.js` | Interacción con los modelos POO, `ApiService` o el controlador. | Éxito | Los cambios producidos por la librería se reflejan correctamente en el resto del sistema. |
| REG-01 | `models.spec.js` | Métodos o validaciones nuevos en las clases POO (si los hay). | Éxito / Error | Se cumple el contrato del método; las entradas inválidas lanzan `Error`. |
| REG-02 | `models.spec.js` | Serialización `fromJSON(toJSON())` de las clases modificadas. | Éxito | Se reconstruye un objeto equivalente al original. |
| REG-03 | `script.spec.js` | Flujo 3 (búsqueda en catálogo) alimentado por `ApiService` con `fetch` mockeado. | Éxito | La búsqueda por texto y el filtro por categoría funcionan sobre los datos recibidos. |
| REG-04 | Suite completa | Ejecución de `npm test` después de cada merge del parcial. | Éxito | 0 fallas; las suites previas de la AO4 siguen en verde. |

---

### 3. Plan de auditorías Lighthouse

#### 3.1. Momentos de ejecución

Las auditorías se ejecutan en tres momentos, ligados al orden de merge que define Coordinación. Cada una se documenta en un test case propio dentro de `docs/04-testing/`, con el mismo formato de los Test Cases 1 a 10.

| Test Case | Momento | Estado auditado | Archivo de evidencia |
|---|---|---|---|
| **11 – Baseline** | Antes de mergear cualquier feature del parcial. | GitHub Pages publicando desde `master` (idéntica a `develop` tras el backport de la AO4). | `docs/04-testing/test-case-11-lighthouse-baseline.md` |
| **12 – Post-fetch** | Después del merge de `feature/dev-async-fetch-api`. | GitHub Pages publicando desde `develop`, con `ApiService` integrado. | `docs/04-testing/test-case-12-lighthouse-post-fetch.md` |
| **13 – Post-librería** | Después del merge de la rama de la librería externa. [Librería a definir] Se compara contra el Test Case 12 (post-fetch). | GitHub Pages publicando desde `develop`, con todas las features del parcial integradas. | `docs/04-testing/test-case-13-lighthouse-post-library.md` |

Las tres auditorías se ejecutan sobre la misma URL pública de GitHub Pages ([carolabenvenuto-uces.github.io/planit](https://carolabenvenuto-uces.github.io/planit/)), de modo que el entorno de red y de servidor es idéntico en los tres momentos y las métricas resultan comparables:

- **Test Case 11:** Pages publica desde `master`, que es idéntica a `develop` tras el backport de la AO4; por lo tanto, la auditoría refleja el estado de partida del parcial.
- **Test Cases 12 y 13:** antes del primer merge del parcial, Pages se reconfigura para publicar desde `develop`. Esta configuración la realiza la owner del repositorio, Carola Benvenuto (@carolabenvenuto-uces), porque requiere permisos de administración. Después de cada merge, se espera a que el *workflow* de GitHub Pages finalice la republicación y se verifica que el sitio sirva el commit esperado antes de auditar.

En cada test case se registran la URL auditada, la rama de publicación, el commit (SHA) desplegado y la fecha de ejecución.

#### 3.2. Condiciones de ejecución

Para que los tres momentos sean comparables entre sí, se fijan las mismas condiciones en todas las corridas:

- **Herramienta:** Lighthouse CLI (`npx lighthouse`), en modo *Navigation*, sobre Chrome headless con un perfil limpio y sin extensiones. La invocación es la misma en los tres test cases:
  ```text
  npx lighthouse https://carolabenvenuto-uces.github.io/planit/ --preset=desktop --only-categories=performance,accessibility,best-practices,seo --output=html --output=json
  ```
- **Modo:** solo **Desktop** (`--preset=desktop`, con la emulación de pantalla y la limitación de red y CPU que ese preset define).
- **Categorías:** Performance, Accessibility, Best Practices y SEO.
- **Repeticiones:** 3 corridas consecutivas; se informa la **mediana** de cada categoría y de cada métrica, para reducir la variabilidad propia de Performance. La corrida cuyo puntaje de Performance coincide con la mediana se toma como **corrida mediana** y sus reportes se conservan como evidencia.
- **Métricas registradas:** puntaje de cada categoría, *First Contentful Paint* (FCP), *Largest Contentful Paint* (LCP), *Total Blocking Time* (TBT), *Cumulative Layout Shift* (CLS) y *Speed Index*.
- **Evidencia:** reportes HTML y JSON de la corrida mediana y capturas PNG del resumen y de cada categoría, guardados en `docs/04-testing/screenshots/` con el prefijo del momento (`lighthouse-baseline-*`, `lighthouse-post-fetch-*` y `lighthouse-post-library-*`).

#### 3.3. Criterios de comparación y regresión

- El Test Case 11 fija la **línea base**. Los Test Cases 12 y 13 se comparan contra ella y contra el momento inmediatamente anterior.
- Se considera **regresión** una caída de 5 puntos o más en cualquier categoría, o un empeoramiento de LCP, TBT o CLS que cambie su calificación en Lighthouse (de "buena" a "necesita mejoras", o de "necesita mejoras" a "deficiente").
- Toda regresión se reporta como issue en GitHub con las métricas antes/después, el commit que la introduce y la PR asociada, y se asigna al rol responsable.
- Riesgos a observar específicamente:
  - **Post-fetch:** desplazamientos de diseño (CLS) cuando el contenido cargado de forma asíncrona reemplaza al indicador de carga; peticiones que bloqueen el renderizado.
  - **Post-librería:** peso adicional de la librería externa (JavaScript y CSS) y su impacto en TBT y LCP; avisos de Best Practices por recursos de terceros; contraste y nombres accesibles en los componentes que genere la librería.

---

### 4. Herramientas a utilizar

- **Jasmine 5.10** (ya cargado en `js/test/test-runner.html`) para las suites funcionales, con `spyOn(window, "fetch")` para simular la red.
- **Playwright** mediante `npm test` (`js/test/run-jasmine.js`), para ejecutar la suite completa en Chromium headless de forma reproducible por línea de comandos.
- **Lighthouse CLI** (`npx lighthouse --preset=desktop`) para las auditorías de los Test Cases 11, 12 y 13, y **Playwright** para capturar los reportes HTML generados.
- **Claude (Anthropic)** como asistente para generar borradores de los specs de Jasmine, con este documento, `js/api/apiService.js` y los modelos como contexto. Cada fragmento generado se contrasta manualmente contra la implementación antes de commitearse, con el mismo criterio adoptado en la AO4.

---

### 5. Criterios de Aceptación (Checklist)

- [ ] `spec-tester-qa-segundo-parcial.md` commiteado antes que cualquier test nuevo y antes de la primera auditoría.
- [ ] Test Case 11 (baseline) ejecutado y documentado antes del merge de cualquier feature del parcial.
- [ ] `js/test/api.spec.js` con casos de éxito, error HTTP, error de red, procesamiento con `map`/`filter`/`reduce` e integración con el DOM, sin dependencia de la red.
- [ ] `js/test/library.spec.js` con casos de inicialización, configuración, funcionalidad principal, manejo de errores e interacción con el sistema.
- [ ] `script.spec.js` y `models.spec.js` actualizados si cambian el controlador o las clases POO.
- [ ] `js/test/test-runner.html` actualizado con los nuevos scripts y specs.
- [ ] Suite completa ejecutada con `npm test`, con 0 fallas y el resultado documentado.
- [ ] Test Case 12 (post-fetch) ejecutado y documentado después del merge de `feature/dev-async-fetch-api`.
- [ ] Test Case 13 (post-librería) ejecutado y documentado después del merge de la librería.
- [ ] `js/test/testing-doc.md` y `docs/04-testing/testing-doc.md` actualizados con las suites y auditorías nuevas.
- [ ] Bugs y regresiones reportados como issues en GitHub (comportamiento esperado vs. obtenido, pasos para reproducir y caso que falla), asignados al rol correspondiente.
- [ ] Contribución registrada en `changelog.md` con enlaces a la PR y a la issue.

---

## MOMENTO 2: Evidencia de Cierre (AL CERRAR la tarea)

### 1. Prompt utilizado y ajustes manuales

#### 1.1. `api.spec.js`, REG-03 y evidencia del Test Case 12

El borrador de `js/test/api.spec.js`, la adaptación del Flujo 3 de `js/test/script.spec.js` (REG-03), las capturas y el documento del Test Case 12 y los borradores de issues se generaron con **Claude Code (modelo Claude Opus 5.5, Anthropic)** en VS Code, sobre la rama `feature/tester-qa-js-testing-suite` actualizada con `develop` (PR #147 incluida). Claude tuvo como contexto este spec, `spec-dev-async-fetch.md`, `js/api/apiService.js`, `js/script.js`, los modelos `Proveedor` y `CatalogoProveedores`, `js/test/test-runner.html`, `js/test/script.spec.js`, el Test Case 11 y los resultados crudos de las tres corridas de Lighthouse del Test Case 12.

**Prompt principal:**

```text
Soy la Tester QA/JS (y coordinadora) del proyecto. Estoy en mi rama `feature/tester-qa-js-testing-suite`, que ya actualice con develop (tiene la #147, el fetch de Caro). La #149 (Chart.js) todavia no se mergeo: no dependas de ella.

REGLAS
- Podes crear y modificar archivos del repo, pero SOLO de mi rol: js/test/ y docs/04-testing/, y mi spec docs/03-specs/segundo-parcial/spec-tester-qa-segundo-parcial.md.
- NO hagas NINGUNA operacion de git que escriba: nada de commit, push, merge, stash, add, switch, checkout, reset ni rebase. Solo podes leer (git status, log, diff, show, fetch). Los commits los hago yo.
- NO toques archivos de otros roles: js/script.js, js/api/, js/models/, js/utils/, js/charts/, index.html, css/ ni specs ajenos. Si para un test hace falta cambiar codigo de la app, no lo cambies: anotalo como issue.
- En js/test/test-runner.html solo podes agregar la etiqueta <script> de los specs nuevos, junto a los otros specs. NO toques el stub de fetch ni las lineas que cargan librerias (Chart.js/Bootstrap): la #149 cambia esas lineas y no quiero conflictos.
- Todo lo que afirmes tiene que salir de algo que leiste o ejecutaste.

TAREA 1 - Evidencia del TC12
1. Lee la seccion 3 de mi spec (que evidencia pide el TC12 y con que nombres) y el documento del test-case-11 en docs/04-testing/ (formato a copiar).
2. Los resultados estan en C:\Users\valer\OneDrive\Escritorio\TC12\: reportes HTML y JSON lighthouse-post-fetch-run-1 a run-3, resumen-tc12.md, verificacion-pages.txt y lighthouse-log.txt. La corrida mediana es la run-3.
3. Genera las capturas PNG que pide el spec a partir del HTML de la run-3 (Playwright: vista de los 4 puntajes, Metrics y lo que pida el spec).
4. Copia a docs/04-testing/screenshots/ las PNG y los reportes que pida el spec, con el prefijo lighthouse-post-fetch-*.
5. Crea el documento del TC12 en docs/04-testing/, con el mismo formato que el TC11. Datos:
   - Lighthouse 13.6.0, Chrome headless/incognito, Desktop, 3 corridas, mediana = run-3, URL de Pages, develop en 6aae3d8 (merge de la #147).
   - Mediana: Performance 96, Accessibility 97, Best Practices 92, SEO 100, LCP 1,14 s, CLS 0,071, TBT 0 ms, FCP 0,80 s, SI 1,07 s.
   - Contra el TC11: sin regresion (ninguna categoria cae 5 puntos o mas y LCP/TBT/CLS no cambian de calificacion). SEO sube de 91 a 100 (#141).
   - Veredicto: PASA CON OBSERVACIONES. Best Practices 92 igual que en el TC11 (favicon 404 en la raiz del dominio y cookies del iframe de YouTube); LCP en "buena" pero cerca del limite, a re-medir en el TC13; el CLS viene del tfoot de la tabla de presupuesto (0,068) y de header-actions (0,002), no del catalogo; Accessibility con color-contrast.

TAREA 2 - api.spec.js y REG-03
1. Lee de mi spec los casos API-01 a API-14 y REG-03 (entrada, accion y resultado esperado). Lee spec-dev-async-fetch.md y js/api/apiService.js para conocer el contrato real: fetchData, obtenerProveedores, validarProveedor, sanitizarTexto, aCatalogo, filtrarPorCategoria, filtrarPorPrecioMaximo y resumirCatalogo; timeout de 5000 ms con AbortController; reintento solo ante error de red; errores HTTP/red/JSON distinguibles; fallback a DATOS_SEMILLA.
2. Crea js/test/api.spec.js con API-01 a API-14, un `it` por caso, con el ID en el nombre ("API-01: ...").
   - Mockea con `spyOn(window, "fetch")`: test-runner.html tiene un stub de fetch para api/proveedores.json y spyOn lo pisa.
   - Usa async/await. Para el timeout no esperes 5 segundos reales: usa jasmine.clock() o una promesa que no resuelve con la senal de abort, segun lo que permita apiService.js. Si no se puede, explicamelo.
   - Cubri: respuesta OK, 404/500 sin reintento, error de red con 1 reintento, JSON invalido, estructura invalida, proveedores invalidos descartados, sanitizacion (incluidos bloques <script>/<style>), resumirCatalogo sin prototipo y los filtros, ajustado a lo que diga exactamente cada caso del spec.
3. REG-03: adapta el Flujo 3 de js/test/script.spec.js para que el catalogo venga de un fetch mockeado. Cambia solo lo necesario.
4. Agrega `<script src="api.spec.js"></script>` en test-runner.html junto a los otros specs, y nada mas en ese archivo.
5. Corre `npm test` 3 veces: specs, failures, errores de consola y exit code. Tiene que dar 0 failures y exit 0. Si un caso no se puede cumplir porque la app se comporta distinto, dejalo con pending("...") explicando por que.
6. Actualiza en mi spec el estado de API-01 a API-14 y REG-03, si tiene una tabla de estado, y registra en la seccion correspondiente que use Claude y con que prompt, igual que hicieron los otros roles.

TAREA 3 - Issues
1. Lee las issues abiertas de carolabenvenuto-uces/planit (con gh si esta autenticado o con la API publica, solo lectura). Ya existen al menos #140, #142 y #145 (color-contrast y 404 del favicon).
2. Arma borradores SOLO de lo que no tenga issue. Candidatas:
   - CLS del tfoot de la tabla de presupuesto (0,068 en el TC12).
   - Spinner del catalogo que queda girando si falla el fallback (mejora pendiente de la #147, rol Dev Async).
   - Validacion duplicada entre validarProveedor y el constructor de Proveedor (#147, opcional).
   - Lo que encuentres al escribir api.spec.js.
   Si algo ya tiene issue, propone un comentario para esa issue en lugar de una nueva.
3. Para cada borrador: titulo, descripcion con evidencia, criterio de aceptacion, rol responsable segun los specs y labels sugeridos.
4. Guardalos en C:\Users\valer\OneDrive\Escritorio\issues-borradores.md (fuera del repo). NO crees ninguna issue.

AL FINAL
- Mostrame `git status` y `git diff --stat` para que vea todo lo que cambio.
- Resultado de npm test, casos API que quedaron pending y por que, y la lista de issues propuestas.
- Proponeme 2 mensajes de commit (uno para el TC12 y otro para api.spec.js + REG-03), con que archivos va cada uno, para que los haga yo.
```

**Ajustes y decisiones sobre el borrador:**
- **Nombres de la API confirmados.** Los nombres tentativos de la sección 2.2 se reemplazaron por los de la implementación mergeada (`fetchData`, `obtenerProveedores`, `validarProveedor`, `sanitizarTexto`, `aCatalogo`, `filtrarPorCategoria`, `filtrarPorPrecioMaximo` y `resumirCatalogo`). No hizo falta modificar código de la aplicación ni dejar casos en `pending`.
- **Un `it` por caso.** Las verificaciones que la consigna pedía cubrir y que no tienen un ID propio en la tabla 2.5 se ubicaron dentro del caso más cercano: la sanitización (incluidos los bloques `<script>`/`<style>`) en API-02, el timeout en API-05, la estructura inválida y el catálogo sin proveedores válidos en API-06, y el objeto sin prototipo de `resumirCatalogo` en API-11.
- **Timeout sin esperas reales.** `fetchData` programa el abort con `setTimeout(…, 5000)`, así que API-05 instala `jasmine.clock()` y usa un `fetch` simulado que solo se rechaza cuando llega la señal de abort. Con `tick(4999)` se comprueba que todavía no abortó; con `tick(1)`, que aborta y reintenta; y con otro `tick(5000)`, que propaga el error de red tras dos llamadas.
- **Sandbox de DOM sin `id`.** La sección 2.1 prevé un sandbox "con los mismos `id`/`data-*` que `index.html`". Como el fixture de `test-runner.html` ya tiene `#contenedor-catalogo`, `#buscar-catalogo`, etc., repetirlos duplicaría `id` en la página. `construirCatalogo(ui)` recibe las referencias por parámetro, así que API-12 a API-14 le pasan un objeto `ui` armado con nodos del sandbox marcados con `data-ui`. En `afterEach` se retira el sandbox y se vuelve a cargar el catálogo del fixture con el stub, para no dejar `estadoApp` con datos de `api.spec.js`.
- **Errores de consola esperados.** API-14 espía `console.error` (el controlador registra ahí el detalle técnico del fallo) y verifica que se llame; así el caso de error no deja errores reales en la consola, que `run-jasmine.js` cuenta como falla. API-02 y API-07 espían `console.warn` para verificar los descartes.
- **REG-03 con los mismos proveedores.** El `beforeEach` del Flujo 3 espía `fetch` con los mismos tres proveedores del fixture, para que los seis casos existentes no cambien sus expectativas; el primer caso comprueba además que el catálogo vino de ese `fetch` (`toHaveBeenCalledOnceWith`) y que no se usó el fallback.
- **`test-runner.html`.** El único cambio es la línea `<script src="api.spec.js"></script>` después de `script.spec.js`. No se tocaron el stub de `fetch` ni las líneas de Bootstrap.

### 2. Resultados de ejecución de la suite Jasmine

#### 2.1. Ejecución de `npm test` con `api.spec.js` y REG-03

Antes de los cambios, la suite daba **330 specs, 0 failures** (exit 0). Con `api.spec.js` y REG-03 se ejecutó `npm test` tres veces, con orden aleatorio:

| Ejecución | Semilla | Specs | Failures | Errores de consola | Exit code |
|---|---|---|---|---|---|
| 1 | 99406 | 344 | 0 | 0 | 0 |
| 2 | 10592 | 344 | 0 | 0 | 0 |
| 3 | 75674 | 344 | 0 | 0 | 0 |

Los 14 specs nuevos son API-01 a API-14. REG-03 no suma specs: adapta los seis del Flujo 3.

#### 2.2. Estado de los casos

| ID | Estado | Observación |
|---|---|---|
| API-01 | ✅ Pasa | `obtenerProveedores()` devuelve los 3 proveedores; `fetch` se llama una vez con `api/proveedores.json` y una señal de `AbortController`. |
| API-02 | ✅ Pasa | Se descartan 12 registros inválidos (incluidos un nombre que solo tiene un bloque `<script>` y una categoría que solo tiene un bloque `<style>`), con un `console.warn` por cada uno; los 3 válidos se devuelven sin cambios. |
| API-03 | ✅ Pasa | `Error` con "404" y una sola llamada a `fetch` (sin reintento). |
| API-04 | ✅ Pasa | `Error` con "500" y una sola llamada a `fetch` (sin reintento). |
| API-05 | ✅ Pasa | Error de red: 2 llamadas y luego "Error de red al obtener…". Si el segundo intento responde, la carga se recupera. Timeout de 5 s simulado con `jasmine.clock()`: aborta, reintenta y propaga el error. |
| API-06 | ✅ Pasa | Cuerpo no JSON: "JSON inválido en…"; estructura inesperada: "La estructura del catálogo de proveedores es inválida."; sin proveedores válidos: "El catálogo no contiene proveedores válidos.". Ninguno se confunde con un error HTTP o de red ni se reintenta. |
| API-07 | ✅ Pasa | `aCatalogo()` devuelve un `CatalogoProveedores` con instancias de `Proveedor` que conservan sus valores. |
| API-08 | ✅ Pasa | Filtros por categoría (sin mayúsculas ni tildes) y por precio máximo inclusivo. |
| API-09 | ✅ Pasa | Sin coincidencias, los filtros devuelven `[]` sin lanzar errores. |
| API-10 | ✅ Pasa | `resumirCatalogo()` coincide con el cálculo a mano (cantidad, promedio, mínimo y máximo por categoría). |
| API-11 | ✅ Pasa | Con `[]` devuelve el valor inicial: un objeto sin prototipo y sin claves. |
| API-12 | ✅ Pasa | Con `fetch` pendiente: indicador con `role="status"`, `aria-live="polite"` y spinner; búsqueda y filtro deshabilitados. |
| API-13 | ✅ Pasa | Se renderizan los proveedores recibidos y el resumen por categoría, desaparece el indicador de carga y el filtro de categoría se arma con los datos recibidos. |
| API-14 | ✅ Pasa | Tras HTTP 500 o error de red: aviso amigable sin detalles técnicos, botón "Reintentar" y fallback con los 3 proveedores de `DATOS_SEMILLA`; "Reintentar" vuelve a cargar el catálogo. |
| REG-03 | ✅ Pasa | Los seis casos del Flujo 3 (búsqueda por texto, filtro por categoría y combinaciones) pasan con el catálogo cargado desde un `fetch` mockeado. |

Ningún caso quedó en `pending`.

### 3. Resultados de las auditorías Lighthouse (Test Cases 11, 12 y 13)
*(A completar al cierre.)*

### 4. Bugs y regresiones reportados
*(A completar al cierre.)*

### 5. Checklist de cierre
*(A completar al cierre.)*
