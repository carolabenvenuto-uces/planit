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
*(A completar al cierre.)*

### 2. Resultados de ejecución de la suite Jasmine
*(A completar al cierre.)*

### 3. Resultados de las auditorías Lighthouse (Test Cases 11, 12 y 13)
*(A completar al cierre.)*

### 4. Bugs y regresiones reportados
*(A completar al cierre.)*

### 5. Checklist de cierre
*(A completar al cierre.)*
