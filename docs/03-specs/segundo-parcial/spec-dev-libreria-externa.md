# Especificación Técnica (Spec) - Desarrollador JS Librerías Externas

- **Proyecto:** PlanIT - Plataforma All-in-One de Organización & Experiencias
- **Entrega:** Segundo Parcial
- **Rol:** Desarrollador JS Librerías Externas
- **Responsable:** Facundo Guiraldes (@FacundoGuiraldes)
- **Rama:** `feature/dev-libreria-externa-chartjs`
- **Issue principal:** [#148](https://github.com/carolabenvenuto-uces/planit/issues/148)
- **Fecha:** 26 de noviembre de 2026

---

## MOMENTO 1: Planificación Previa (ANTES de integrar la librería)

### 1. Necesidad específica que justifica la librería
Dos secciones de la app ya calculan datos agregados y hoy solo los muestran como texto plano:

- **Presupuesto:** el modelo (`Presupuesto`/`ItemContratado`) calcula subtotales por ítem, pero no hay ninguna vista agregada por categoría.
- **Catálogo:** `ApiService.resumirCatalogo()` (PR #147, Dev Async Fetch) ya agrupa los proveedores por categoría con cantidad y rango de precio mediante un `reduce`, pero el resultado se renderiza como párrafos de texto (`js/script.js`, `renderCatalogo()`).

Ninguna de las dos tiene representación visual. No se resuelve con código propio porque dibujar gráficos interactivos y accesibles (leyenda, tooltips, animación, responsive) a mano es exactamente el tipo de problema ya resuelto por una librería de visualización.

### 2. Librería seleccionada
**Chart.js 4.4.7**, vía CDN (jsDelivr): `https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js`.

| Alternativa descartada | Motivo |
| --- | --- |
| SweetAlert2 / Toastify | El proyecto ya resuelve confirmaciones y avisos con el Modal y el Toast de Bootstrap (PR #109); agregar otra librería para lo mismo duplicaría funcionalidad existente. |
| JustValidate | La validación de formularios ya está resuelta por `Validador` y los modelos de `js/models/`, con su propia suite de tests; una librería de validación pisaría ese trabajo. |
| AOS (Animate on Scroll) | Puramente decorativa: no consume datos de ningún otro rol, así que no demuestra integración con la arquitectura (POO / Async Fetch). |

**Método de integración:** CDN, build UMD (`chart.umd.min.js`), sin bundler ni ES modules — mismo criterio que Bootstrap y Chart.js en el resto del proyecto (scripts clásicos).

### 3. Puntos de integración (mínimo 2 requeridos por la consigna)
1. **Presupuesto** (`index.html`, sección `#presupuesto`): gráfico de dona con el gasto por categoría, calculado en `js/script.js` a partir de `estadoApp.evento.presupuesto.items`.
2. **Catálogo** (`index.html`, sección `#catalogo`): gráfico de barras con la cantidad de proveedores por categoría, consumiendo **directamente** la salida de `ApiService.resumirCatalogo()` (Dev Async Fetch) — sin duplicar ese `reduce`.

En ambos casos el gráfico **complementa** la tabla/texto existente, no lo reemplaza: sigue habiendo una alternativa textual accesible para quien no pueda leer el gráfico.

### 4. Decisiones de arquitectura
- **Módulo wrapper dedicado:** `js/charts/graficoService.js`, objeto global `GraficoService` (mismo patrón que `ApiService` y `ServicioPersistenciaEvento`). No conoce el dominio: recibe un `<canvas>` y una configuración de Chart.js ya armada por el controlador, y se limita a crear/actualizar/destruir instancias de `Chart`.
- **Gestión del ciclo de vida:** antes de crear un gráfico nuevo en un canvas, se destruye la instancia anterior (`chart.destroy()`) para evitar el error típico de Chart.js *"Canvas is already in use"* al recalcular.
- **Consistencia visual:** se usa la paleta por defecto de Chart.js (no se fuerzan colores a mano) para no competir con la identidad de Bootstrap ya definida en `bootstrap-overrides.css`; los títulos de cada gráfico usan el mismo texto que ya describe cada bloque.
- **Carga:** `js/charts/graficoService.js` se carga como script clásico, después de `js/api/apiService.js` y antes de `js/script.js`, igual en `index.html` y en `js/test/test-runner.html`.

### 5. Criterios de Aceptación (Checklist)
- [ ] `spec-dev-libreria-externa.md` commiteado antes que el código de integración.
- [ ] Chart.js integrado vía CDN y funcionando.
- [ ] Implementado en los 2 puntos de la aplicación (Presupuesto y Catálogo).
- [ ] `docs/06-librerias/libreria-doc.md` completo, con capturas.
- [ ] Coordinación con Dev Async Fetch (consumir `resumirCatalogo()` sin duplicarlo) e issues respondidas.
- [ ] Casos de test coordinados con el Tester QA/JS.
- [ ] Contribución registrada en `changelog.md` con links a la PR y a la issue.

### 6. Coordinación con el Tester QA/JS
Casos propuestos para `js/test/library.spec.js`:
1. **Inicialización:** `GraficoService.renderizar(canvas, config)` crea una instancia de `Chart` en el canvas indicado.
2. **Configuración:** el gráfico de Presupuesto recibe `type: "doughnut"` con una categoría por `label`; el de Catálogo, `type: "bar"`.
3. **Funcionalidad principal:** al recalcular el presupuesto o refiltrar el catálogo, el gráfico se actualiza (no se acumulan instancias — `destroy()` se llama antes de crear la siguiente).
4. **Manejo de errores:** `GraficoService.renderizar()` devuelve `null` sin lanzar si no hay `canvas`, o si `Chart` no está definido (CDN caído).
5. **Interacción con otras partes del sistema:** el gráfico de Catálogo recibe exactamente el objeto que devuelve `ApiService.resumirCatalogo()`, sin transformarlo.

---

## MOMENTO 2: Evidencia de Cierre (AL FINALIZAR)

### 1. Prompt utilizado y ajustes manuales
Implementación hecha en la misma sesión de coordinación de la AO4/Segundo Parcial, con Claude (Anthropic) como asistente — mismo criterio ya documentado para el resto del proyecto (ver `spec-devops.md`, sección de obstáculos, y la nota de la sección 8 de `spec-dev-async-fetch.md` sobre por qué se usa un asistente de IA con acceso de lectura al repo en vez de Copilot Agent Mode en este flujo). Contexto provisto: este spec, `js/script.js`, `js/api/apiService.js`, `index.html`, `js/test/test-runner.html`.

**Ajustes manuales y decisiones:**
- **Reuso del resumen ya calculado.** La primera versión de `renderCatalogo()` llamaba a `ApiService.resumirCatalogo(resultados)` dos veces (una para el texto, otra para el gráfico). Se guardó el resultado en una variable (`resumenPorCategoria`) y se reusa en ambos lugares, para no ejecutar el `reduce` dos veces por cada filtrado.
- **Limpieza del gráfico en el estado de error del catálogo.** Si `ApiService.obtenerProveedores()` falla y se usa el fallback (`DATOS_SEMILLA`), `renderCatalogo()` no recalcula el resumen por categoría; se agregó `GraficoService.destruir(ui.graficoCatalogo)` en esa rama para no dejar en pantalla un gráfico con datos de una carga anterior.
- **`destroy()` antes de recrear.** Sin este paso, Chart.js lanza `"Canvas is already in use. Chart with ID '…' must be destroyed before the canvas with ID '…' can be reused."` cada vez que se recalcula el presupuesto o se refiltra el catálogo. `GraficoService.renderizar()` llama a `destruir()` internamente antes de cada `new Chart(...)`.
- **Accesibilidad.** Los `<canvas>` tienen `role="img"` y `aria-label` describiendo el gráfico, porque Chart.js no genera ninguna alternativa textual por sí solo; el texto/tabla existente al lado de cada gráfico queda como la alternativa accesible real.

### 2. Fragmento de integración final
`js/charts/graficoService.js` completo (sin cambios respecto de la versión commiteada):

```javascript
var GraficoService = {
    _graficos: Object.create(null),

    renderizar(canvas, config) {
        if (!canvas || typeof Chart === "undefined") return null;
        this.destruir(canvas);
        const grafico = new Chart(canvas, config);
        this._graficos[canvas.id] = grafico;
        return grafico;
    },

    destruir(canvas) {
        if (!canvas) return;
        const existente = this._graficos[canvas.id];
        if (!existente) return;
        existente.destroy();
        delete this._graficos[canvas.id];
    }
};
```

Hooks en `js/script.js`: `actualizarGraficoPresupuesto(ui)` se llama al final de `recalcularPresupuesto(ui)`; `actualizarGraficoCatalogo(ui, resumenPorCategoria)` se llama desde `renderCatalogo()`, en la misma rama que ya arma el texto del resumen.

### 3. Resumen de los 2 puntos de integración
1. **Presupuesto:** gráfico de dona (`#grafico-presupuesto`) con el gasto por categoría del evento activo. Se actualiza en vivo al cambiar cantidades o el descuento. Mejora la experiencia porque permite ver de un vistazo qué categoría concentra el gasto, algo que la tabla (ordenada por categoría, no por monto) no transmite de forma inmediata.
2. **Catálogo:** gráfico de barras (`#grafico-catalogo`) con la cantidad de proveedores por categoría, sobre el resultado filtrado vigente (se actualiza al buscar por texto o cambiar la categoría). Mejora la experiencia dando una lectura rápida de cuántas opciones hay por categoría antes de scrollear las tarjetas.

Capturas con datos reales (servidor local, catálogo cargado desde `api/proveedores.json`): [`grafico-presupuesto.png`](../../06-librerias/screenshots/grafico-presupuesto.png), [`grafico-catalogo.png`](../../06-librerias/screenshots/grafico-catalogo.png). Verificado con `node js/test/run-jasmine.js`: **330 specs, 0 failures**, sin errores nuevos de consola, en 3 corridas con semillas distintas.

### 4. Coordinación con Dev Async Fetch e issues respondidas
- El gráfico de Catálogo consume `ApiService.resumirCatalogo()` tal cual la expone la PR #147, sin tocar ese archivo ni duplicar el `reduce` — coordinación explícita con @carolabenvenuto-uces, confirmada por lectura del código antes de integrar.
- No se abrieron issues nuevas; no se encontraron bugs durante la integración.

### 5. Criterios de Aceptación al cierre
- [x] `spec-dev-libreria-externa.md` commiteado antes que el código de integración.
- [x] Chart.js integrado vía CDN y funcionando.
- [x] Implementado en los 2 puntos de la aplicación (Presupuesto y Catálogo).
- [x] `docs/06-librerias/libreria-doc.md` completo, con capturas.
- [x] Coordinación con Dev Async Fetch (consumir `resumirCatalogo()` sin duplicarlo).
- [ ] Casos de test coordinados con el Tester QA/JS — queda a cargo de @ValeriaMSilva (`js/test/library.spec.js`, issue #139), con los 5 casos propuestos en la sección 6 de MOMENTO 1.
- [x] Contribución registrada en `changelog.md` con links a la PR y a la issue.
