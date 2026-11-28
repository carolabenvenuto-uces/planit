/*
 * Suite de ApiService (js/api/apiService.js) — casos API-01 a API-14 de
 * docs/03-specs/segundo-parcial/spec-tester-qa-segundo-parcial.md (sección 2.5).
 *
 * - La red se simula siempre con spyOn(window, "fetch"), que pisa el stub de
 *   test-runner.html solo durante el spec; Jasmine restaura el stub al terminar.
 * - Cada llamada al spy devuelve un Response nuevo: el cuerpo de un Response
 *   solo se puede leer una vez.
 * - El timeout de 5 s de fetchData se prueba con jasmine.clock() y un fetch que
 *   solo se rechaza cuando llega la señal de abort, sin esperar 5 s reales.
 * - Los casos de DOM (API-12 a API-14) llaman a construirCatalogo() con un objeto
 *   ui que apunta a un sandbox propio. El sandbox no repite los id del fixture
 *   (#contenedor-catalogo, #buscar-catalogo, etc.), para no duplicar id en la
 *   página: construirCatalogo() recibe las referencias por parámetro y no las
 *   busca por id. En afterEach se retira el sandbox y se vuelve a cargar el
 *   catálogo del fixture con el stub, para no dejar estadoApp con datos de esta suite.
 */

/** Respuesta del mock de fetch: un Response nuevo por llamada. */
function respuestaApi(cuerpo, status) {
    return new Response(typeof cuerpo === "string" ? cuerpo : JSON.stringify(cuerpo), {
        status: status || 200,
        headers: { "Content-Type": "application/json" }
    });
}

/** Proveedores válidos y distintos de los del stub y de DATOS_SEMILLA. */
function proveedoresApi() {
    return [
        {
            nombre: "Salón Las Acacias",
            categoria: "Salón",
            precio: 250000,
            unidad: "evento",
            descripcion: "Salón con parque para 150 personas.",
            capacidad: "Hasta 150 personas",
            zona: "Escobar"
        },
        {
            nombre: "Fotos Bruma",
            categoria: "Fotografía",
            precio: 32000,
            unidad: "evento",
            descripcion: "Cobertura completa y álbum digital.",
            capacidad: "1 evento por fecha",
            zona: "CABA"
        },
        {
            nombre: "Catering Norte",
            categoria: "Catering",
            precio: 4200,
            unidad: "pax",
            descripcion: "Menú de pasos con opciones vegetarianas.",
            capacidad: "Hasta 300 pax",
            zona: "Zona Norte GBA"
        }
    ];
}

/** Campos que devuelve obtenerProveedores() para un registro sin datos de presentación. */
function comoProveedorSanitizado(dato) {
    return {
        nombre: dato.nombre,
        categoria: dato.categoria,
        precio: dato.precio,
        unidad: dato.unidad,
        imagen: dato.imagen || "",
        alt: dato.alt || "",
        descripcion: dato.descripcion || "",
        capacidad: dato.capacidad || "",
        zona: dato.zona || "",
        duracion: dato.duracion || "",
        incluye: dato.incluye || ""
    };
}

/** Espera (con temporizadores reales) a que se cumpla una condición. */
async function esperarHasta(condicion, descripcion) {
    for (let intento = 0; intento < 100; intento++) {
        if (condicion()) return;
        await new Promise((resolver) => setTimeout(resolver, 0));
    }
    throw new Error("No se cumplió la condición: " + descripcion);
}

/** Vacía la cola de microtareas sin usar temporizadores (compatible con jasmine.clock()). */
async function esperarMicrotareasHasta(condicion, descripcion) {
    for (let intento = 0; intento < 100; intento++) {
        if (condicion()) return;
        await Promise.resolve();
    }
    throw new Error("No se cumplió la condición: " + descripcion);
}

describe("api.spec.js - ApiService", function () {

    describe("Carga de datos (fetchData y obtenerProveedores)", function () {
        beforeEach(function () {
            spyOn(console, "warn");
        });

        it("API-01: devuelve los proveedores parseados ante un 200 con JSON válido e invoca fetch una vez con la URL esperada", async function () {
            const fetchSpy = spyOn(window, "fetch").and.callFake(() =>
                Promise.resolve(respuestaApi({ version: 1, proveedores: proveedoresApi() })));

            const proveedores = await ApiService.obtenerProveedores();

            expect(proveedores).toEqual(proveedoresApi().map(comoProveedorSanitizado));
            expect(fetchSpy).toHaveBeenCalledTimes(1);
            expect(fetchSpy).toHaveBeenCalledWith("api/proveedores.json",
                jasmine.objectContaining({ signal: jasmine.any(AbortSignal) }));
            expect(console.warn).not.toHaveBeenCalled();
        });

        it("API-02: descarta solo los registros inválidos (incluidos los que quedan vacíos al quitar <script>/<style>) y devuelve los válidos sin alteraciones", async function () {
            const validos = proveedoresApi();
            const invalidos = [
                null,
                "Gourmet Finger Food",
                ["Flores Pilar", "Decoración", 70000, "base"],
                { categoria: "Sonido", precio: 8000, unidad: "hora" },                     // sin nombre
                { nombre: "   ", categoria: "Sonido", precio: 8000, unidad: "hora" },     // nombre en blanco
                { nombre: "DJ Sin Categoría", precio: 8000, unidad: "hora" },             // sin categoría
                { nombre: "DJ Sin Unidad", categoria: "Sonido", precio: 8000 },           // sin unidad
                { nombre: "DJ Gratis?", categoria: "Sonido", precio: -1, unidad: "hora" },// precio negativo
                { nombre: "DJ Caro", categoria: "Sonido", precio: "mucho", unidad: "hora" },
                { nombre: "DJ Nulo", categoria: "Sonido", precio: null, unidad: "hora" },
                { nombre: "<script>alert('xss')</script>", categoria: "Sonido", precio: 8000, unidad: "hora" },
                { nombre: "DJ Estilado", categoria: "<style>body{display:none}</style>", precio: 8000, unidad: "hora" }
            ];
            spyOn(window, "fetch").and.callFake(() => Promise.resolve(respuestaApi({
                version: 1,
                proveedores: [invalidos[0], validos[0], ...invalidos.slice(1, 7), validos[1], ...invalidos.slice(7), validos[2]]
            })));

            const proveedores = await ApiService.obtenerProveedores();

            expect(proveedores).toEqual(validos.map(comoProveedorSanitizado));
            expect(console.warn).toHaveBeenCalledTimes(invalidos.length);
            // Sanitización de los textos de un registro válido (sanitizarTexto).
            expect(ApiService.sanitizarTexto("  <b>Flores</b>\u0007Pilar<script>alert(1)</script><style>.x{}</style> ")).toBe("Flores Pilar");
            expect(ApiService.sanitizarTexto("<SCRIPT type=\"text/javascript\">\nrobar()\n</SCRIPT>DJ")).toBe("DJ");
            expect(ApiService.sanitizarTexto(42)).toBe("");
        });

        it("API-03: ante un HTTP 404 lanza un Error que incluye 404, sin reintentar", async function () {
            const fetchSpy = spyOn(window, "fetch").and.callFake(() => Promise.resolve(respuestaApi("Not Found", 404)));

            await expectAsync(ApiService.obtenerProveedores()).toBeRejectedWithError(Error, /404/);
            expect(fetchSpy).toHaveBeenCalledTimes(1);
        });

        it("API-04: ante un HTTP 500 lanza un Error que incluye 500, sin reintentar", async function () {
            const fetchSpy = spyOn(window, "fetch").and.callFake(() => Promise.resolve(respuestaApi("Internal Server Error", 500)));

            await expectAsync(ApiService.obtenerProveedores()).toBeRejectedWithError(Error, /500/);
            expect(fetchSpy).toHaveBeenCalledTimes(1);
        });

        it("API-05: ante un error de red (incluido el timeout de 5 s) reintenta una sola vez y luego propaga el error", async function () {
            const fetchSpy = spyOn(window, "fetch");

            // a) fetch rechazado dos veces: 2 llamadas y error de red.
            fetchSpy.and.callFake(() => Promise.reject(new TypeError("Failed to fetch")));
            await expectAsync(ApiService.obtenerProveedores())
                .toBeRejectedWithError(Error, /^Error de red al obtener api\/proveedores\.json: Failed to fetch$/);
            expect(fetchSpy).toHaveBeenCalledTimes(2);

            // b) el reintento recupera la carga si el segundo intento responde bien.
            fetchSpy.calls.reset();
            let llamadas = 0;
            fetchSpy.and.callFake(() => ++llamadas === 1
                ? Promise.reject(new TypeError("Failed to fetch"))
                : Promise.resolve(respuestaApi({ version: 1, proveedores: proveedoresApi() })));
            const recuperados = await ApiService.obtenerProveedores();
            expect(recuperados.length).toBe(3);
            expect(fetchSpy).toHaveBeenCalledTimes(2);

            // c) timeout: fetch no responde y solo se rechaza con la señal de abort.
            fetchSpy.calls.reset();
            fetchSpy.and.callFake((url, opciones) => new Promise((resolver, rechazar) => {
                opciones.signal.addEventListener("abort", () => rechazar(opciones.signal.reason), { once: true });
            }));
            jasmine.clock().install();
            try {
                const carga = ApiService.obtenerProveedores();
                let resultado;
                carga.then(() => { resultado = "resuelta"; }, (error) => { resultado = error; });

                expect(fetchSpy).toHaveBeenCalledTimes(1);
                jasmine.clock().tick(4999);
                for (let i = 0; i < 20; i++) await Promise.resolve();
                expect(resultado).toBeUndefined();
                expect(fetchSpy).toHaveBeenCalledTimes(1);
                expect(fetchSpy.calls.argsFor(0)[1].signal.aborted).toBe(false);

                jasmine.clock().tick(1);
                expect(fetchSpy.calls.argsFor(0)[1].signal.aborted).toBe(true);
                await esperarMicrotareasHasta(() => fetchSpy.calls.count() === 2, "segundo intento tras el timeout");

                jasmine.clock().tick(5000);
                await esperarMicrotareasHasta(() => resultado !== undefined, "rechazo tras el segundo timeout");
                expect(resultado).toEqual(jasmine.any(Error));
                expect(resultado.message).toMatch(/^Error de red al obtener api\/proveedores\.json: /);
                expect(fetchSpy).toHaveBeenCalledTimes(2);
            } finally {
                jasmine.clock().uninstall();
            }
        });

        it("API-06: ante un 200 con cuerpo que no es JSON o con estructura inesperada lanza un Error de formato, distinguible de HTTP y de red", async function () {
            const fetchSpy = spyOn(window, "fetch");
            const noEsHttpNiRed = (error) => !/HTTP error|Error de red/.test(error.message);

            fetchSpy.and.callFake(() => Promise.resolve(respuestaApi("<!DOCTYPE html><html>404</html>")));
            await expectAsync(ApiService.obtenerProveedores())
                .toBeRejectedWithError(Error, /^JSON inválido en api\/proveedores\.json: /);
            await ApiService.obtenerProveedores().catch((error) => expect(noEsHttpNiRed(error)).toBe(true));

            const estructurasInvalidas = [
                null,
                [],
                { proveedores: proveedoresApi() },                         // sin version
                { version: 2, proveedores: proveedoresApi() },             // versión no soportada
                { version: 1, proveedores: "Gourmet Finger Food" },        // proveedores no es un arreglo
                { version: 1 }
            ];
            for (const cuerpo of estructurasInvalidas) {
                fetchSpy.and.callFake(() => Promise.resolve(respuestaApi(cuerpo)));
                await expectAsync(ApiService.obtenerProveedores())
                    .withContext(JSON.stringify(cuerpo))
                    .toBeRejectedWithError(Error, "La estructura del catálogo de proveedores es inválida.");
            }

            // Estructura correcta pero sin ningún proveedor válido: también es un error de formato.
            fetchSpy.and.callFake(() => Promise.resolve(respuestaApi({ version: 1, proveedores: [{ nombre: "Sin datos" }] })));
            await expectAsync(ApiService.obtenerProveedores())
                .toBeRejectedWithError(Error, "El catálogo no contiene proveedores válidos.");

            // Ninguno de estos errores se reintenta: una llamada por carga.
            expect(fetchSpy).toHaveBeenCalledTimes(2 + estructurasInvalidas.length + 1);
        });
    });

    describe("Procesamiento con map, filter y reduce", function () {
        let catalogo;

        beforeEach(function () {
            catalogo = ApiService.aCatalogo(proveedoresApi().map(comoProveedorSanitizado));
        });

        it("API-07: aCatalogo convierte cada registro con map en una instancia de Proveedor dentro de un CatalogoProveedores, conservando sus valores", function () {
            expect(catalogo).toEqual(jasmine.any(CatalogoProveedores));
            expect(catalogo.proveedores.length).toBe(3);
            catalogo.proveedores.forEach((proveedor, indice) => {
                const dato = proveedoresApi()[indice];
                expect(proveedor).toEqual(jasmine.any(Proveedor));
                expect(proveedor.toJSON()).toEqual({
                    nombre: dato.nombre, categoria: dato.categoria, precio: dato.precio, unidad: dato.unidad
                });
            });

            // Un registro que el constructor de Proveedor rechaza se descarta sin cortar la conversión.
            spyOn(console, "warn");
            const conInvalido = ApiService.aCatalogo([
                { nombre: "Fotos Bruma", categoria: "Fotografía", precio: 32000, unidad: "evento" },
                { nombre: "Precio negativo", categoria: "Sonido", precio: -5, unidad: "hora" }
            ]);
            expect(conInvalido.proveedores.map((proveedor) => proveedor.nombre)).toEqual(["Fotos Bruma"]);
            expect(console.warn).toHaveBeenCalledTimes(1);
            expect(() => ApiService.aCatalogo(null)).toThrowError("La lista de proveedores es inválida.");
        });

        it("API-08: filter por categoría (sin distinguir mayúsculas ni tildes) y por precio máximo inclusivo devuelve exactamente los que cumplen el criterio", function () {
            const lista = catalogo.proveedores;

            expect(ApiService.filtrarPorCategoria(lista, "Fotografía").map((p) => p.nombre)).toEqual(["Fotos Bruma"]);
            expect(ApiService.filtrarPorCategoria(lista, "  SALON ").map((p) => p.nombre)).toEqual(["Salón Las Acacias"]);
            expect(ApiService.filtrarPorPrecioMaximo(lista, 32000).map((p) => p.nombre)).toEqual(["Fotos Bruma", "Catering Norte"]);
            expect(ApiService.filtrarPorPrecioMaximo(lista, 4200).map((p) => p.nombre)).toEqual(["Catering Norte"]);
            // filter devuelve un arreglo nuevo y no modifica el original.
            expect(lista.length).toBe(3);
        });

        it("API-09: filter sin coincidencias devuelve un arreglo vacío sin lanzar errores", function () {
            const lista = catalogo.proveedores;

            expect(() => ApiService.filtrarPorCategoria(lista, "Transporte")).not.toThrow();
            expect(ApiService.filtrarPorCategoria(lista, "Transporte")).toEqual([]);
            expect(ApiService.filtrarPorPrecioMaximo(lista, 4199)).toEqual([]);
            expect(ApiService.filtrarPorCategoria([], "Catering")).toEqual([]);
            expect(ApiService.filtrarPorPrecioMaximo([], 100000)).toEqual([]);
        });

        it("API-10: resumirCatalogo con reduce calcula cantidad, promedio, mínimo y máximo por categoría como el cálculo a mano", function () {
            const lista = catalogo.proveedores.concat([
                new Proveedor("Catering Sur", "Catering", 3000, "pax"),
                new Proveedor("Catering Oeste", "Catering", 5400, "pax")
            ]);

            const resumen = ApiService.resumirCatalogo(lista);

            // Catering: 4200, 3000 y 5400 -> 3 proveedores, promedio (4200 + 3000 + 5400) / 3 = 4200.
            expect(Object.keys(resumen).sort()).toEqual(["Catering", "Fotografía", "Salón"]);
            expect(resumen.Catering).toEqual({ cantidad: 3, precioPromedio: 4200, precioMinimo: 3000, precioMaximo: 5400 });
            expect(resumen["Fotografía"]).toEqual({ cantidad: 1, precioPromedio: 32000, precioMinimo: 32000, precioMaximo: 32000 });
            expect(resumen["Salón"]).toEqual({ cantidad: 1, precioPromedio: 250000, precioMinimo: 250000, precioMaximo: 250000 });
        });

        it("API-11: resumirCatalogo sobre un arreglo vacío devuelve el valor inicial (objeto sin prototipo y sin claves), sin NaN ni excepciones", function () {
            let resumen;
            expect(() => { resumen = ApiService.resumirCatalogo([]); }).not.toThrow();

            expect(Object.getPrototypeOf(resumen)).toBeNull();
            expect(Object.keys(resumen)).toEqual([]);
            expect(Object.values(resumen).some((valor) => Number.isNaN(valor))).toBe(false);
            // Sin prototipo: "toString" o "constructor" no aparecen como categorías heredadas.
            expect("toString" in resumen).toBe(false);
            expect("constructor" in resumen).toBe(false);
        });
    });

    describe("Integración con el DOM (construirCatalogo en un sandbox)", function () {
        let sandbox;
        let uiSandbox;

        beforeEach(function () {
            sandbox = document.createElement("section");
            sandbox.setAttribute("data-sandbox", "api-spec");
            sandbox.hidden = true;
            sandbox.innerHTML =
                '<div data-ui="aviso-app" hidden></div>' +
                '<form data-ui="form-catalogo" action="#">' +
                '  <input data-ui="buscar-catalogo" type="search">' +
                '  <select data-ui="categoria-catalogo"><option value="" selected>Todas</option></select>' +
                "</form>" +
                '<p data-ui="contador-catalogo"></p>' +
                '<p data-ui="catalogo-vacio" hidden></p>' +
                '<div data-ui="contenedor-catalogo"></div>';
            document.body.appendChild(sandbox);
            const nodo = (clave) => sandbox.querySelector('[data-ui="' + clave + '"]');
            uiSandbox = {
                avisoApp: nodo("aviso-app"),
                formCatalogo: nodo("form-catalogo"),
                buscarCatalogo: nodo("buscar-catalogo"),
                categoriaCatalogo: nodo("categoria-catalogo"),
                contadorCatalogo: nodo("contador-catalogo"),
                catalogoVacio: nodo("catalogo-vacio"),
                contenedorCatalogo: nodo("contenedor-catalogo")
            };
        });

        afterEach(async function () {
            sandbox.remove();
            // Vuelve a cargar el catálogo del fixture con el stub de test-runner.html.
            if (jasmine.isSpy(window.fetch)) window.fetch.and.callThrough();
            await construirCatalogo(obtenerReferenciasUI());
        });

        const nombresEnTarjetas = () => Array.from(
            uiSandbox.contenedorCatalogo.querySelectorAll("[data-proveedor]"),
            (tarjeta) => tarjeta.dataset.nombre
        );

        it("API-12: mientras fetch está pendiente muestra el indicador de carga con aria-live y deshabilita búsqueda y filtro", async function () {
            let responder;
            const fetchSpy = spyOn(window, "fetch").and.callFake(() => new Promise((resolver) => { responder = resolver; }));

            const carga = construirCatalogo(uiSandbox);

            expect(fetchSpy).toHaveBeenCalledTimes(1);
            const indicador = uiSandbox.contenedorCatalogo.querySelector('[role="status"]');
            expect(indicador).not.toBeNull();
            expect(indicador.getAttribute("aria-live")).toBe("polite");
            expect(indicador.querySelector(".spinner-border")).not.toBeNull();
            expect(indicador.querySelector(".spinner-border").getAttribute("aria-hidden")).toBe("true");
            expect(indicador.textContent.trim()).toBe("Cargando proveedores…");
            expect(uiSandbox.buscarCatalogo.disabled).toBe(true);
            expect(uiSandbox.categoriaCatalogo.disabled).toBe(true);
            expect(nombresEnTarjetas()).toEqual([]);

            responder(respuestaApi({ version: 1, proveedores: proveedoresApi() }));
            await carga;

            expect(uiSandbox.buscarCatalogo.disabled).toBe(false);
            expect(uiSandbox.categoriaCatalogo.disabled).toBe(false);
        });

        it("API-13: tras una respuesta válida renderiza los proveedores recibidos, el resumen por categoría y quita el indicador de carga", async function () {
            spyOn(window, "fetch").and.callFake(() => Promise.resolve(respuestaApi({ version: 1, proveedores: proveedoresApi() })));

            await construirCatalogo(uiSandbox);

            expect(uiSandbox.contenedorCatalogo.querySelector(".spinner-border")).toBeNull();
            expect(uiSandbox.contenedorCatalogo.textContent).not.toContain("Cargando proveedores");
            expect(nombresEnTarjetas()).toEqual(["Salón Las Acacias", "Fotos Bruma", "Catering Norte"]);
            expect(uiSandbox.contadorCatalogo.textContent).toBe("3 proveedores encontrados");
            expect(uiSandbox.contenedorCatalogo.textContent).toContain("Salón con parque para 150 personas.");
            expect(uiSandbox.contenedorCatalogo.querySelector(".alert-warning")).toBeNull();
            const resumen = uiSandbox.contenedorCatalogo.querySelector(".col-12.small.text-muted");
            expect(resumen).not.toBeNull();
            expect(resumen.textContent).toContain("Catering: 1 proveedor");
            // Las opciones del filtro salen de las categorías recibidas.
            expect(Array.from(uiSandbox.categoriaCatalogo.options, (opcion) => opcion.value))
                .toEqual(["", "Salón", "Fotografía", "Catering"]);
            expect(estadoApp.errorCatalogo).toBe(false);
        });

        it("API-14: tras una falla HTTP o de red muestra un mensaje amigable sin detalles técnicos, el botón Reintentar y el fallback de DATOS_SEMILLA", async function () {
            spyOn(console, "error");
            const fetchSpy = spyOn(window, "fetch");
            const nombresSemilla = DATOS_SEMILLA.catalogo.proveedores.map((proveedor) => proveedor.nombre);
            const escenarios = [
                { nombre: "HTTP 500", llamadas: 1, simular: () => Promise.resolve(respuestaApi("Internal Server Error", 500)) },
                { nombre: "error de red", llamadas: 2, simular: () => Promise.reject(new TypeError("Failed to fetch")) }
            ];

            for (const escenario of escenarios) {
                fetchSpy.calls.reset();
                console.error.calls.reset();
                fetchSpy.and.callFake(escenario.simular);

                await construirCatalogo(uiSandbox);

                const aviso = uiSandbox.contenedorCatalogo.querySelector(".alert-warning");
                expect(aviso).withContext(escenario.nombre).not.toBeNull();
                expect(aviso.textContent).withContext(escenario.nombre)
                    .toContain("No pudimos cargar el catálogo actualizado. Te mostramos la versión guardada.");
                expect(aviso.textContent).withContext(escenario.nombre).not.toMatch(/HTTP|status|500|Failed|fetch|Error/i);
                expect(aviso.querySelector("button").textContent).withContext(escenario.nombre).toBe("Reintentar");
                expect(nombresEnTarjetas()).withContext(escenario.nombre).toEqual(nombresSemilla);
                expect(uiSandbox.contenedorCatalogo.querySelector(".spinner-border")).withContext(escenario.nombre).toBeNull();
                expect(uiSandbox.buscarCatalogo.disabled).withContext(escenario.nombre).toBe(false);
                expect(fetchSpy).withContext(escenario.nombre).toHaveBeenCalledTimes(escenario.llamadas);
                // El detalle técnico queda en la consola, no en la UI.
                expect(console.error).withContext(escenario.nombre)
                    .toHaveBeenCalledWith("No se pudo cargar el catálogo actualizado:", jasmine.any(Error));
            }

            // Reintentar vuelve a pedir el catálogo y, si responde bien, reemplaza el fallback.
            fetchSpy.calls.reset();
            fetchSpy.and.callFake(() => Promise.resolve(respuestaApi({ version: 1, proveedores: proveedoresApi() })));
            uiSandbox.contenedorCatalogo.querySelector(".alert-warning button").click();
            await esperarHasta(() => nombresEnTarjetas()[0] === "Salón Las Acacias", "catálogo cargado tras Reintentar");

            expect(fetchSpy).toHaveBeenCalledTimes(1);
            expect(uiSandbox.contenedorCatalogo.querySelector(".alert-warning")).toBeNull();
            expect(estadoApp.errorCatalogo).toBe(false);
        });
    });
});
