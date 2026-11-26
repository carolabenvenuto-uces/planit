# Documentación de Librería Externa - Chart.js

## Información General
- **Nombre:** Chart.js
- **Versión:** 4.4.7
- **Repositorio:** https://github.com/chartjs/Chart.js
- **Documentación oficial:** https://www.chartjs.org/docs/latest/

## Propósito y Justificación
El Presupuesto y el Catálogo ya calculan datos agregados (subtotales por categoría en el modelo `Presupuesto`, y cantidad/rango de precio por categoría en `ApiService.resumirCatalogo()`), pero ambos se mostraban solo como texto plano. Chart.js permite visualizar esos datos existentes como gráficos interactivos (leyenda, tooltips, animación, responsive) sin tener que dibujar esa capa a mano. No duplica ninguna funcionalidad ya resuelta en el proyecto: no hay ningún gráfico implementado con código propio.

## Instalación e Integración
### Método utilizado: CDN
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js" defer></script>
```
Se usa el build UMD (`chart.umd.min.js`), cargado como script clásico, igual que Bootstrap. Un módulo wrapper propio, `js/charts/graficoService.js`, encapsula la creación/actualización/destrucción de instancias de `Chart` (ver `docs/03-specs/segundo-parcial/spec-dev-libreria-externa.md`).

## Uso en el Proyecto

### Caso de Uso 1: Gasto por categoría (sección Presupuesto)
Gráfico de dona que se recalcula cada vez que cambian las cantidades o el descuento del presupuesto, a partir de `estadoApp.evento.presupuesto.items`.

```javascript
function actualizarGraficoPresupuesto(ui) {
    if (!ui.graficoPresupuesto) return;
    const porCategoria = estadoApp.evento.presupuesto.items.reduce((acumulado, item) => {
        acumulado[item.categoria] = (acumulado[item.categoria] || 0) + item.calcularSubtotal();
        return acumulado;
    }, Object.create(null));

    GraficoService.renderizar(ui.graficoPresupuesto, {
        type: "doughnut",
        data: { labels: Object.keys(porCategoria), datasets: [{ data: Object.values(porCategoria) }] },
        options: { responsive: true, plugins: { title: { display: true, text: "Gasto por categoría" } } }
    });
}
```

### Caso de Uso 2: Proveedores por categoría (sección Catálogo)
Gráfico de barras que consume directamente la salida de `ApiService.resumirCatalogo()` (rol Dev Async Fetch), sin duplicar ese cálculo, y se actualiza con cada búsqueda o cambio de filtro.

```javascript
function actualizarGraficoCatalogo(ui, resumenPorCategoria) {
    if (!ui.graficoCatalogo) return;
    GraficoService.renderizar(ui.graficoCatalogo, {
        type: "bar",
        data: {
            labels: Object.keys(resumenPorCategoria),
            datasets: [{ label: "Proveedores", data: Object.values(resumenPorCategoria).map((d) => d.cantidad) }]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
            plugins: { title: { display: true, text: "Proveedores por categoría" } } }
    });
}
```

## Capturas de Pantalla
![Gasto por categoría](./screenshots/grafico-presupuesto.png)
![Proveedores por categoría](./screenshots/grafico-catalogo.png)

Ambas capturas tomadas con datos reales, sirviendo la app desde un servidor local (para que `fetch` del catálogo funcione) y con `node js/test/run-jasmine.js` en verde (330 specs, 0 failures) en el mismo estado del código.
