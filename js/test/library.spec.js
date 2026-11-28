/*
 * Suite de la librería externa: Chart.js 4.4.7, encapsulada en GraficoService
 * (js/charts/graficoService.js) y usada por el controlador (js/script.js) con
 * pintarGrafico(), actualizarGraficoPresupuesto() y actualizarGraficoCatalogo().
 * Casos LIB-01 a LIB-06 de docs/03-specs/segundo-parcial/spec-tester-qa-segundo-parcial.md
 * (sección 2.5), un it() por caso.
 *
 * - Los casos de integración usan los canvas del fixture de test-runner.html
 *   (#grafico-presupuesto, #grafico-catalogo) y sus avisos (#aviso-grafico-*), con
 *   las referencias de obtenerReferenciasUI(). Antes y después de cada spec se
 *   vuelve al estado inicial con restaurarEstadoInicial() (script.spec.js, que el
 *   runner carga antes), así el orden aleatorio de Jasmine no afecta el resultado
 *   y ninguna otra suite hereda un gráfico oculto o un catálogo en fallback.
 * - Los casos unitarios de GraficoService dibujan en un canvas propio, dentro de un
 *   sandbox que se retira en afterEach. Ese canvas tiene un id que no existe en el
 *   fixture (GraficoService guarda cada gráfico por canvas.id), así no se duplican id.
 * - Para contar gráficos por canvas se usa el registro de Chart.js (Chart.instances),
 *   no el estado interno de GraficoService.
 * - La red sigue simulada: el catálogo sale del stub de fetch de test-runner.html o de
 *   un spyOn(window, "fetch") del propio spec.
 */

describe("library.spec.js - Chart.js 4.4.7 y GraficoService", function () {
    const MENSAJES_AVISO = Object.freeze({
        presupuestoSinGasto: "Todavía no hay gasto para mostrar en el gráfico.",
        presupuestoInvalido: "El gráfico se muestra cuando las cantidades y el descuento son válidos.",
        catalogoFiltroVacio: "No hay proveedores para graficar con este filtro.",
        catalogoFallback: "El gráfico estará disponible cuando se cargue el catálogo actualizado.",
        catalogoCargando: "Cargando el gráfico del catálogo…",
        chartNoDisponible: "El gráfico no está disponible: no se pudo cargar la librería Chart.js."
    });

    let ui;
    let sandbox;

    beforeEach(async function () {
        ui = await restaurarEstadoInicial();
    });

    afterEach(async function () {
        if (sandbox) {
            GraficoService.destruir(sandbox.querySelector("canvas"));
            sandbox.remove();
            sandbox = null;
        }
        // El fetch espiado ya fue restaurado por Jasmine: el catálogo vuelve a salir del stub.
        await restaurarEstadoInicial();
    });

    /** Canvas propio dentro de un contenedor de alto fijo, como [data-grafico-contenedor]. */
    function montarCanvasSandbox() {
        sandbox = document.createElement("div");
        sandbox.setAttribute("data-sandbox", "library-spec");
        sandbox.style.position = "relative";
        sandbox.style.height = "200px";
        const canvas = document.createElement("canvas");
        canvas.id = "library-spec-canvas";
        sandbox.append(canvas);
        document.body.append(sandbox);
        return canvas;
    }

    /** Configuración mínima de Chart.js para los casos unitarios de GraficoService. */
    function configBarras(datos) {
        return {
            type: "bar",
            data: { labels: datos.map((_, indice) => "Serie " + indice), datasets: [{ label: "Prueba", data: datos }] },
            options: { animation: false }
        };
    }

    /** Gráficos vivos de Chart.js sobre un canvas (Chart.instances es el registro global de la librería). */
    function instanciasEn(canvas) {
        return Object.values(Chart.instances).filter((grafico) => grafico.canvas === canvas);
    }

    /** Inputs de cantidad que generó renderFilasPresupuesto(), en el orden de los ítems del modelo. */
    function inputsCantidad() {
        return Array.from(ui.cuerpoPresupuesto.querySelectorAll(".input-cantidad"));
    }

    /** Escribe en un input y dispara "input" con bubbles, como el usuario (el form delega el evento). */
    function escribir(input, valor) {
        input.value = valor;
        input.dispatchEvent(new Event("input", { bubbles: true }));
    }

    /** Subtotales que calcula el modelo para el estado actual del presupuesto. */
    function subtotalesDelModelo() {
        return estadoApp.evento.presupuesto.items.map((item) => item.calcularSubtotal());
    }

    /** El gráfico está visible: canvas sin hidden, aviso oculto y vacío, una sola instancia. */
    function expectGraficoVisible(canvas, aviso) {
        expect(canvas.hidden).withContext("canvas visible").toBe(false);
        expect(aviso.hidden).withContext("aviso oculto").toBe(true);
        expect(aviso.textContent).withContext("aviso sin texto").toBe("");
        expect(instanciasEn(canvas).length).withContext("una sola instancia en el canvas").toBe(1);
    }

    /** No hay gráfico: canvas oculto, ninguna instancia y aviso visible con el motivo. */
    function expectAvisoVisible(canvas, aviso, mensaje) {
        expect(canvas.hidden).withContext("canvas oculto").toBe(true);
        expect(aviso.hidden).withContext("aviso visible").toBe(false);
        expect(aviso.textContent).toBe(mensaje);
        expect(instanciasEn(canvas).length).withContext("sin instancias en el canvas").toBe(0);
    }

    it("LIB-01: Chart.js 4.4.7 está disponible y GraficoService.renderizar() inicializa un gráfico sobre su canvas; destruir() lo libera", function () {
        expect(typeof Chart).toBe("function");
        expect(Chart.version).toBe("4.4.7");

        // Al iniciar la app, cada canvas del fixture ya tiene su gráfico.
        expect(Chart.getChart(ui.graficoPresupuesto)).toBeDefined();
        expect(Chart.getChart(ui.graficoCatalogo)).toBeDefined();

        const canvas = montarCanvasSandbox();
        let grafico;
        expect(function () { grafico = GraficoService.renderizar(canvas, configBarras([3, 1, 2])); }).not.toThrow();
        expect(grafico instanceof Chart).toBe(true);
        expect(grafico.canvas).toBe(canvas);
        expect(Chart.getChart(canvas)).toBe(grafico);

        // destruir(): llama a destroy() de Chart.js y libera el canvas.
        spyOn(grafico, "destroy").and.callThrough();
        GraficoService.destruir(canvas);
        expect(grafico.destroy).toHaveBeenCalledTimes(1);
        expect(Chart.getChart(canvas)).toBeUndefined();
        expect(instanciasEn(canvas).length).toBe(0);

        // Es seguro repetirlo o llamarlo sin canvas.
        expect(function () { GraficoService.destruir(canvas); }).not.toThrow();
        expect(function () { GraficoService.destruir(null); }).not.toThrow();
        expect(grafico.destroy).toHaveBeenCalledTimes(1);

        // Liberado el canvas, se puede volver a crear un gráfico sin "Canvas is already in use".
        expect(function () { GraficoService.renderizar(canvas, configBarras([5])); }).not.toThrow();
        expect(instanciasEn(canvas).length).toBe(1);
    });

    it("LIB-02: los gráficos de Presupuesto y Catálogo aplican la configuración del proyecto (tipo, títulos, escala y alto reservado)", function () {
        const dona = Chart.getChart(ui.graficoPresupuesto);
        expect(dona.config.type).toBe("doughnut");
        expect(dona.data.labels).toEqual(estadoApp.evento.presupuesto.items.map((item) => item.categoria));
        expect(dona.data.labels).toEqual(["Catering", "Decoración", "Sonido", "Fotografía", "Transporte"]);
        expect(dona.options.responsive).toBe(true);
        expect(dona.options.maintainAspectRatio).toBe(false);
        expect(dona.options.plugins.title.display).toBe(true);
        expect(dona.options.plugins.title.text).toBe("Gasto por categoría");

        const barras = Chart.getChart(ui.graficoCatalogo);
        expect(barras.config.type).toBe("bar");
        expect(barras.data.datasets.length).toBe(1);
        expect(barras.data.datasets[0].label).toBe("Proveedores");
        expect(barras.options.responsive).toBe(true);
        expect(barras.options.maintainAspectRatio).toBe(false);
        expect(barras.options.scales.y.beginAtZero).toBe(true);
        expect(barras.options.scales.y.ticks.precision).toBe(0);
        expect(barras.options.plugins.title.display).toBe(true);
        expect(barras.options.plugins.title.text).toBe("Proveedores por categoría");

        // Reflejo en el DOM: con maintainAspectRatio: false cada gráfico ocupa el alto fijo de
        // su [data-grafico-contenedor] (220 px la dona, 180 px las barras), sin proporción propia.
        expect(ui.graficoPresupuesto.closest("[data-grafico-contenedor]")).not.toBeNull();
        expect(ui.graficoCatalogo.closest("[data-grafico-contenedor]")).not.toBeNull();
        expect(dona.height).toBe(220);
        expect(barras.height).toBe(180);
        expectGraficoVisible(ui.graficoPresupuesto, ui.avisoGraficoPresupuesto);
        expectGraficoVisible(ui.graficoCatalogo, ui.avisoGraficoCatalogo);
    });

    it("LIB-03: la dona grafica los subtotales del modelo y se redibuja al cambiar las cantidades sin acumular instancias en el canvas", function () {
        const canvas = ui.graficoPresupuesto;
        expect(subtotalesDelModelo()).toEqual([420000, 70000, 48000, 32000, 10000]);
        const inicial = Chart.getChart(canvas);
        expect(inicial.data.datasets[0].data).toEqual(subtotalesDelModelo());
        spyOn(inicial, "destroy").and.callThrough();

        // Cambio de cantidad en vivo (Catering 120 → 100): datos nuevos del modelo.
        escribir(inputsCantidad()[0], "100");
        const segunda = Chart.getChart(canvas);
        expect(segunda).not.toBe(inicial);
        expect(inicial.destroy).toHaveBeenCalledTimes(1);
        expect(subtotalesDelModelo()).toEqual([350000, 70000, 48000, 32000, 10000]);
        expect(segunda.data.datasets[0].data).toEqual(subtotalesDelModelo());
        expect(instanciasEn(canvas)).toEqual([segunda]);

        // Varios recálculos seguidos: siempre una sola instancia viva en el canvas.
        ["90", "80", "70", "60", "50"].forEach((valor) => escribir(inputsCantidad()[2], valor));
        expect(instanciasEn(canvas).length).toBe(1);
        expect(Chart.getChart(canvas).data.datasets[0].data).toEqual(subtotalesDelModelo());
        expect(Chart.getChart(canvas).data.datasets[0].data[2]).toBe(50 * 8000);

        // El descuento solo afecta el total: la dona sigue con los subtotales sin descuento.
        escribir(ui.descuentoPresupuesto, "10");
        expect(Chart.getChart(canvas).data.datasets[0].data).toEqual(subtotalesDelModelo());
        expect(instanciasEn(canvas).length).toBe(1);

        // Lo mismo con GraficoService directo: renderizar() destruye el gráfico anterior del canvas.
        const propio = montarCanvasSandbox();
        const primero = GraficoService.renderizar(propio, configBarras([1, 2]));
        spyOn(primero, "destroy").and.callThrough();
        const segundo = GraficoService.renderizar(propio, configBarras([3, 4]));
        expect(primero.destroy).toHaveBeenCalledTimes(1);
        expect(instanciasEn(propio)).toEqual([segundo]);
        expect(segundo.data.datasets[0].data).toEqual([3, 4]);
    });

    it("LIB-04: con datos inválidos, gasto en cero o sin canvas no lanza excepciones: oculta el gráfico, muestra el aviso y lo recupera al volver a tener datos", function () {
        const canvas = ui.graficoPresupuesto;
        const aviso = ui.avisoGraficoPresupuesto;

        // Sin canvas / sin referencias: ninguna función lanza.
        expect(GraficoService.renderizar(null, configBarras([1]))).toBeNull();
        expect(GraficoService.renderizar(undefined, configBarras([1]))).toBeNull();
        expect(function () { pintarGrafico(null, null, configBarras([1]), true, "x"); }).not.toThrow();
        expect(function () { actualizarGraficoPresupuesto({}, { subtotales: [1], subtotal: 1 }); }).not.toThrow();
        expect(function () { actualizarGraficoCatalogo({}, { Catering: { cantidad: 1 } }); }).not.toThrow();

        // Cálculo inválido (cantidad negativa): el total pasa a "—" y la dona no queda con datos viejos.
        expect(function () { escribir(inputsCantidad()[0], "-5"); }).not.toThrow();
        expect(ui.totalPresupuesto.textContent).toBe("—");
        expectAvisoVisible(canvas, aviso, MENSAJES_AVISO.presupuestoInvalido);

        escribir(inputsCantidad()[0], "120");
        expectGraficoVisible(canvas, aviso);
        expect(Chart.getChart(canvas).data.datasets[0].data).toEqual(subtotalesDelModelo());

        // Descuento inválido (fuera de 0–100): mismo aviso.
        expect(function () { escribir(ui.descuentoPresupuesto, "150"); }).not.toThrow();
        expectAvisoVisible(canvas, aviso, MENSAJES_AVISO.presupuestoInvalido);
        escribir(ui.descuentoPresupuesto, "0");
        expectGraficoVisible(canvas, aviso);

        // Gasto en cero: no hay nada que graficar.
        inputsCantidad().forEach((input) => escribir(input, "0"));
        expect(estadoApp.evento.presupuesto.calcularTotal()).toBe(0);
        expectAvisoVisible(canvas, aviso, MENSAJES_AVISO.presupuestoSinGasto);

        // Vuelve a haber gasto: reaparece el gráfico y se oculta el aviso.
        escribir(inputsCantidad()[3], "1");
        expectGraficoVisible(canvas, aviso);
        expect(Chart.getChart(canvas).data.datasets[0].data).toEqual([0, 0, 0, 32000, 0]);
    });

    it("LIB-05: sin Chart.js (falla del CDN simulada) renderizar() devuelve null sin lanzar y la app muestra el aviso sin romper el resto de la página", async function () {
        const canvasPropio = montarCanvasSandbox();
        const chartOriginal = window.Chart;
        // Estado de una carga en la que Chart.js nunca llegó: sin gráficos previos en los canvas.
        GraficoService.destruir(ui.graficoPresupuesto);
        GraficoService.destruir(ui.graficoCatalogo);
        try {
            delete window.Chart;
            expect(typeof Chart).toBe("undefined");

            let resultado;
            expect(function () { resultado = GraficoService.renderizar(canvasPropio, configBarras([1])); }).not.toThrow();
            expect(resultado).toBeNull();

            // Presupuesto: el cálculo sigue funcionando y el gráfico se reemplaza por el aviso.
            expect(function () { escribir(inputsCantidad()[0], "100"); }).not.toThrow();
            // 100 × 3.500 + 70.000 + 6 × 8.000 + 32.000 + 2 × 5.000 = 510.000
            expect(estadoApp.evento.presupuesto.calcularTotal()).toBe(510000);
            expect(ui.totalPresupuesto.textContent).toBe(formatearMonto(510000));
            expect(ui.btnCalcularPresupuesto.disabled).toBe(false);
            expect(ui.graficoPresupuesto.hidden).toBe(true);
            expect(ui.avisoGraficoPresupuesto.hidden).toBe(false);
            expect(ui.avisoGraficoPresupuesto.textContent).toBe(MENSAJES_AVISO.chartNoDisponible);

            // Catálogo: la búsqueda y las tarjetas siguen funcionando; el gráfico, con aviso.
            escribir(ui.buscarCatalogo, "flores");
            expect(ui.contadorCatalogo.textContent).toBe("1 proveedor encontrado");
            expect(ui.graficoCatalogo.hidden).toBe(true);
            expect(ui.avisoGraficoCatalogo.hidden).toBe(false);
            expect(ui.avisoGraficoCatalogo.textContent).toBe(MENSAJES_AVISO.chartNoDisponible);
            expect(ui.avisoApp.hidden).toBe(true);
        } finally {
            window.Chart = chartOriginal;
        }

        // Con Chart.js de nuevo disponible, el próximo recálculo vuelve a dibujar.
        escribir(inputsCantidad()[0], "120");
        expectGraficoVisible(ui.graficoPresupuesto, ui.avisoGraficoPresupuesto);
        escribir(ui.buscarCatalogo, "");
        expectGraficoVisible(ui.graficoCatalogo, ui.avisoGraficoCatalogo);
    });

    it("LIB-06: el gráfico de barras recibe exactamente el resumen de ApiService.resumirCatalogo() y sigue al catálogo en filtros, carga y fallback", async function () {
        const canvas = ui.graficoCatalogo;
        const aviso = ui.avisoGraficoCatalogo;
        spyOn(ApiService, "resumirCatalogo").and.callThrough();

        // Datos de las barras = salida de resumirCatalogo() para los proveedores mostrados.
        filtrarCatalogo(ui);
        let llamada = ApiService.resumirCatalogo.calls.mostRecent();
        expect(llamada.args[0]).toEqual(estadoApp.catalogo.proveedores);
        let resumen = llamada.returnValue;
        let barras = Chart.getChart(canvas);
        expect(barras.data.labels).toEqual(Object.keys(resumen));
        expect(barras.data.datasets[0].data).toEqual(Object.values(resumen).map((datos) => datos.cantidad));
        expect(barras.data.labels).toEqual(["Catering", "Decoración", "Sonido"]);
        expect(barras.data.datasets[0].data).toEqual([1, 1, 1]);
        expect(ApiService.resumirCatalogo).toHaveBeenCalledTimes(1);

        // Filtro por categoría: el gráfico se actualiza con el resumen filtrado.
        ui.categoriaCatalogo.value = "Catering";
        ui.categoriaCatalogo.dispatchEvent(new Event("change", { bubbles: true }));
        llamada = ApiService.resumirCatalogo.calls.mostRecent();
        resumen = llamada.returnValue;
        barras = Chart.getChart(canvas);
        expect(llamada.args[0].map((proveedor) => proveedor.nombre)).toEqual(["Gourmet Finger Food"]);
        expect(barras.data.labels).toEqual(Object.keys(resumen));
        expect(barras.data.labels).toEqual(["Catering"]);
        expect(barras.data.datasets[0].data).toEqual([1]);
        expectGraficoVisible(canvas, aviso);

        // Filtro sin resultados: sin gráfico y con aviso; al limpiarlo, el gráfico vuelve.
        ui.categoriaCatalogo.value = "";
        escribir(ui.buscarCatalogo, "zzz");
        expect(ui.catalogoVacio.hidden).toBe(false);
        expectAvisoVisible(canvas, aviso, MENSAJES_AVISO.catalogoFiltroVacio);
        escribir(ui.buscarCatalogo, "");
        expectGraficoVisible(canvas, aviso);
        expect(Chart.getChart(canvas).data.datasets[0].data).toEqual([1, 1, 1]);

        // Carga en curso (Reintentar): no queda el gráfico de la carga anterior.
        spyOn(console, "error");
        const fetchSpy = spyOn(window, "fetch");
        let responder;
        fetchSpy.and.callFake(() => new Promise((resolver) => { responder = resolver; }));
        const carga = construirCatalogo(ui);
        expectAvisoVisible(canvas, aviso, MENSAJES_AVISO.catalogoCargando);
        responder(new Response("Internal Server Error", { status: 500 }));
        await carga;

        // Fallback a DATOS_SEMILLA: no se grafica a partir de datos de respaldo.
        expect(estadoApp.errorCatalogo).toBe(true);
        expect(console.error).toHaveBeenCalled();
        expectAvisoVisible(canvas, aviso, MENSAJES_AVISO.catalogoFallback);
        escribir(ui.buscarCatalogo, "dj");
        expectAvisoVisible(canvas, aviso, MENSAJES_AVISO.catalogoFallback);
        escribir(ui.buscarCatalogo, "");

        // Recuperación: una carga exitosa vuelve a mostrar el gráfico con el resumen nuevo.
        fetchSpy.and.callThrough();
        await construirCatalogo(ui);
        expect(estadoApp.errorCatalogo).toBe(false);
        expectGraficoVisible(canvas, aviso);
        resumen = ApiService.resumirCatalogo.calls.mostRecent().returnValue;
        expect(Chart.getChart(canvas).data.labels).toEqual(Object.keys(resumen));
        expect(Chart.getChart(canvas).data.datasets[0].data).toEqual(Object.values(resumen).map((datos) => datos.cantidad));
    });
});
