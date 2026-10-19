# Especificación Técnica (Spec) - Tester JavaScript / QA Engineer

- **Proyecto:** PlanIT - Plataforma All-in-One de Organización & Experiencias
- **Entrega:** Actividad Obligatoria N° 3
- **Rol:** Tester JavaScript / QA Engineer
- **Responsable:** Carola Benvenuto (@carolabenvenuto-uces)
- **Rama:** `feature/tester-javascript-jasmine`
- **Issue principal:** [#75](https://github.com/carolabenvenuto-uces/planit/issues/75)
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

> *Nota: Esta sección se completará tras la generación, ejecución y captura de evidencia de los tests.*

### 1. Prompts Utilizados en Copilot Agent
```javascript
// (A completar al cierre: Bloque de código con el prompt exacto y archivos adjuntos)

---

### Parte 2 (Desde Resultados hasta el final)

```markdown
### 2. Resultados de Ejecución y Métricas
* **Total de Suites:** 4
* **Total de Tests (Specs):** 
* **Tests Exitosos (PASS):** 
* **Tests Fallidos (FAIL):** 
* **Bugs Reportados:** 

### 3. Evidencia Gráfica (Screenshots de Playwright MCP)
*(A completar al cierre con las capturas obtenidas)*