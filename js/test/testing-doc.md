# Documentación de Testing - Suite Jasmine

## Índice
1. [Ejecución de Tests](#ejecución-de-tests)
2. [Suites de Tests](#suites-de-tests)
3. [Métricas de Cobertura](#métricas-de-cobertura)
4. [Capturas de Pantalla](#capturas-de-pantalla)
5. [Issues Conocidos](#issues-conocidos)

---

## Ejecución de Tests

### Pasos para Ejecutar
1. Abrir `js/test/test-runner.html` en el navegador (doble clic o arrastrándolo al navegador). Si el navegador bloquea archivos locales, levantar un servidor desde la raíz del repositorio con `npx http-server -p 8080` y abrir `http://localhost:8080/js/test/test-runner.html`.
2. Los tests se ejecutan automáticamente: el runner carga Jasmine 5.10.0 desde cdnjs, luego `../script.js` (código a testear) y por último `script.spec.js` (suites de tests).
3. Verificar resultados en la interfaz de Jasmine.

**Ejecución asistida con Playwright MCP:** desde VS Code, con el servidor `playwright` configurado en `.vscode/mcp.json`, se le pide a GitHub Copilot Agent Mode que abra `js/test/test-runner.html`, ejecute las suites y capture screenshots de los resultados.

### Interpretación de Resultados
- **Verde**: Tests pasando ✅
- **Rojo**: Tests fallando ❌
- **Amarillo**: Tests pendientes ⚠️

---

## Suites de Tests

Cada suite corresponde a uno de los 4 flujos de negocio modelados en `docs/05-diagramas/01-diagrama-de-actividades/` e implementados en `js/script.js`. Las firmas de las funciones se acordaron con el Desarrollador JavaScript en la issue [#72](https://github.com/carolabenvenuto-uces/planit/issues/72) y están documentadas en `docs/03-specs/actividad-obligatoria-3/spec-dev-javascript.md`. Solo se testean las funciones de negocio (puras); las funciones de interacción (`flujo*()` e `iniciarMenuPrincipal()`) quedan fuera porque usan `prompt()` y `alert()`.

### Suite 1: Crear evento

**Funciones Testeadas:**
- `validarDatosEvento(nombre, tipo, presupuesto)` - Valida nombre no vacío, tipo permitido y presupuesto mayor a 0; devuelve `true` / `false`.
- `crearEvento(nombre, tipo, presupuesto)` - Crea el objeto evento `{ nombre, tipo, presupuesto }`.
- `agregarEvento(eventos, evento)` - Devuelve un array nuevo con el evento agregado, sin modificar el original.

**Casos de Prueba:**
| # | Descripción | Tipo |
|---|-------------|------|
| 1 | `validarDatosEvento` acepta nombre, tipo "boda" y presupuesto "50000" (texto crudo de `prompt()`) | Happy Path |
| 2 | `crearEvento` devuelve un objeto con las propiedades `nombre`, `tipo` y `presupuesto` | Operaciones Arrays/Objetos |
| 3 | `agregarEvento` devuelve un array nuevo que contiene el evento y no modifica el array original | Operaciones Arrays/Objetos |
| 4 | `validarDatosEvento` rechaza un nombre vacío o solo con espacios | Validación de Errores |
| 5 | `validarDatosEvento` rechaza un tipo fuera de la lista permitida (ej. "congreso") | Validación de Errores |
| 6 | `validarDatosEvento` rechaza un presupuesto de 0 | Caso Borde |
| 7 | `validarDatosEvento` rechaza un presupuesto negativo o no numérico ("abc") | Validación de Errores |

---

### Suite 2: Calcular presupuesto

**Funciones Testeadas:**
- `calcularTotalItems(items)` - Recorre los ítems contratados y suma sus subtotales.
- `aplicarDescuento(total, porcentaje)` - Aplica un descuento de 0 a 100; lanza un `Error` con un porcentaje inválido.
- `superaPresupuesto(total, presupuestoEstimado)` - Indica si el total supera el presupuesto estimado (usa `>`).

**Casos de Prueba:**
| # | Descripción | Tipo |
|---|-------------|------|
| 1 | `calcularTotalItems(itemsContratados)` devuelve 580000 | Happy Path |
| 2 | `calcularTotalItems` con un array vacío devuelve 0 | Caso Borde |
| 3 | `aplicarDescuento(100000, 10)` devuelve 90000 | Happy Path |
| 4 | `aplicarDescuento` con 0% deja el total sin cambios y con 100% devuelve 0 | Caso Borde |
| 5 | `aplicarDescuento` lanza un error con porcentaje negativo, mayor a 100 o no numérico | Validación de Errores |
| 6 | `superaPresupuesto` devuelve `true` cuando el total es mayor al presupuesto estimado | Happy Path |
| 7 | `superaPresupuesto` devuelve `false` cuando el total es igual al presupuesto estimado | Caso Borde |

---

### Suite 3: Buscar en catálogo

**Funciones Testeadas:**
- `buscarEnCatalogo(catalogo, criterio)` - Filtra los proveedores por nombre o categoría sin distinguir mayúsculas de minúsculas; lanza un `Error` con criterio vacío.
- `coincideCon(criterio)` - Método de cada proveedor de `catalogoProveedores` utilizado por la búsqueda.

**Casos de Prueba:**
| # | Descripción | Tipo |
|---|-------------|------|
| 1 | Buscar "Flores Pilar" en `catalogoProveedores` devuelve un array con ese proveedor | Happy Path |
| 2 | Buscar por la categoría "Catering" devuelve los proveedores de esa categoría | Operaciones Arrays/Objetos |
| 3 | La búsqueda no distingue mayúsculas de minúsculas ("dj lucas" encuentra "DJ Lucas & Sonido") | Caso Borde |
| 4 | Una búsqueda sin coincidencias devuelve un array vacío | Caso Borde |
| 5 | `buscarEnCatalogo` lanza un error con criterio vacío | Validación de Errores |
| 6 | El catálogo original no se modifica después de buscar | Operaciones Arrays/Objetos |
| 7 | Cada proveedor del catálogo tiene el método `coincideCon` y devuelve `true` con su propio nombre | Operaciones Arrays/Objetos |

---

### Suite 4: Gestionar invitados

**Funciones Testeadas:**
- `validarInvitado(nombre, estado)` - Valida nombre no vacío y estado "Confirmado" o "Pendiente"; devuelve `true` / `false`.
- `agregarInvitado(invitados, nombre, estado)` - Devuelve un array nuevo con el invitado agregado; lanza un `Error` con datos inválidos.
- `contarAsistencia(invitados)` - Recorre la lista y devuelve `{ confirmados, pendientes }`.

**Casos de Prueba:**
| # | Descripción | Tipo |
|---|-------------|------|
| 1 | `validarInvitado` acepta un nombre válido con estado "Confirmado" o "Pendiente" | Happy Path |
| 2 | `agregarInvitado` devuelve un array nuevo con el invitado como objeto `{ nombre, estado }` y no modifica el array original | Operaciones Arrays/Objetos |
| 3 | `contarAsistencia` con 3 confirmados y 2 pendientes devuelve `{ confirmados: 3, pendientes: 2 }` | Happy Path |
| 4 | `contarAsistencia` con una lista vacía devuelve `{ confirmados: 0, pendientes: 0 }` | Caso Borde |
| 5 | `validarInvitado` devuelve `false` y `agregarInvitado` lanza un error con nombre vacío | Validación de Errores |
| 6 | `validarInvitado` devuelve `false` y `agregarInvitado` lanza un error con un estado inválido (ej. "Declinado") | Validación de Errores |

---

## Métricas de Cobertura

### Resumen General
| Métrica | Valor |
|---------|-------|
| Total de Tests | _(a completar)_ |
| Tests Pasando | _(a completar)_ ✅ |
| Tests Fallando | _(a completar)_ ❌ |
| Porcentaje de Éxito | _(a completar)_ |

### Cobertura por Tipo de Test
| Tipo | Cantidad | Porcentaje |
|------|----------|------------|
| Happy Path | _(a completar)_ | _(a completar)_ |
| Casos Borde | _(a completar)_ | _(a completar)_ |
| Validación de Errores | _(a completar)_ | _(a completar)_ |
| Operaciones Arrays/Objetos | _(a completar)_ | _(a completar)_ |

### Análisis de Cobertura de Código
**Metodología:** Se revisó manualmente cada función del código fuente y se verificó qué líneas son ejecutadas por los tests implementados.

| Función | Líneas Totales | Tests | Líneas Cubiertas | Cobertura |
|---------|----------------|-------|------------------|-----------|
| _(a completar)_ | | | | |

**Cobertura Total Estimada:** _(a completar)_

#### Líneas NO Cubiertas
- _(a completar)_

---

## Capturas de Pantalla

### Tests Pasando
![Tests Exitosos](./screenshots/tests-passing.png)
*Todos los tests ejecutándose correctamente* _(captura a completar)_

### Vista Detallada de Suites
![Suite Detalle](./screenshots/suite-detail.png)
*Expansión de una suite mostrando tests individuales* _(captura a completar)_

---

## Issues Conocidos

_(A completar con los bugs detectados durante la ejecución, reportados como issues en GitHub.)_

---

## Limitaciones del Testing
- Tests síncronos únicamente (sin Promises/async-await).
- Sin cobertura automatizada de código: la cobertura se estima de forma manual.
- Requiere conexión a internet para cargar Jasmine desde el CDN.
- No incluye tests de integración con DOM, ya que la AO3 no utiliza manipulación del DOM ni eventos.
- Las funciones que interactúan con el usuario mediante `prompt()` y `alert()` no se testean: los tests cubren solo la lógica de negocio pura.

---

**Última Actualización:** _(a completar)_  
**Tester/QA Engineer:** Carola Benvenuto (@carolabenvenuto-uces)  
**Colaboración con:** Desarrollador JavaScript - Facundo Guiraldes (@FacundoGuiraldes)