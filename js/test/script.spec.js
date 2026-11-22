/*
 * Suite de integración del controlador (js/script.js) contra el fixture de DOM
 * de test-runner.html. Las funciones del controlador (obtenerReferenciasUI,
 * recalcularPresupuesto, renderInvitados, filtrarCatalogo, etc.) son accesibles
 * acá como globales porque script.js es un script clásico, no un módulo: todas
 * las declaraciones de nivel superior comparten el mismo scope global que esta
 * suite, igual que ya ocurría en la versión AO3 de este archivo.
 *
 * configurarEventos() ya corrió una vez (vía DOMContentLoaded) antes de que
 * Jasmine empiece a ejecutar specs. Como todas las specs de este archivo
 * comparten una única carga de página, cada test restaura el estado inicial
 * exacto del fixture en beforeEach (restaurarEstadoInicial), para no depender
 * del orden real de ejecución (Jasmine randomiza el orden de los specs).
 */

const FIXTURE_CANTIDADES = {
    "cantidad-catering": "120",
    "cantidad-decoracion": "1",
    "cantidad-sonido": "6",
    "cantidad-fotografia": "1",
    "cantidad-transporte": "2"
};

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

    estadoApp.evento = new Evento("Casamiento de Sofi & Mateo", "boda", "700000");
    [
        ["Catering", "Finger food premium y barra libre", 120, 3500],
        ["Decoración", "Arreglos florales y ambientación luces", 1, 70000],
        ["Sonido", "DJ set completo y sonido de pista", 6, 8000],
        ["Fotografía", "Cobertura de evento y álbum digital", 1, 32000],
        ["Transporte", "Traslado de materiales y coordinación", 2, 5000]
    ].forEach(function ([categoria, descripcion, cantidad, precio]) {
        estadoApp.evento.presupuesto.agregarItem(new ItemContratado(categoria, descripcion, cantidad, precio));
    });
    estadoApp.evento.invitados.agregar("Sofía Rodríguez", "Confirmado");
    estadoApp.evento.invitados.agregar("Mateo González", "Confirmado");
    estadoApp.evento.invitados.agregar("Valentina Benítez", "Pendiente");

    [ui.nombreEvento, ui.fechaEvento, ui.tipoEvento, ui.presupuestoEstimado, ui.ubicacion,
        ui.descuentoPresupuesto, ui.nombreInvitado, ui.estadoInvitado]
        .filter(Boolean).forEach(limpiarCampo);
    document.querySelectorAll(".input-cantidad").forEach(limpiarCampo);

    ui.confirmacionEvento.hidden = true;
    ui.confirmacionEvento.textContent = "";
    ui.avisoApp.hidden = true;
    ui.feedbackInvitados.hidden = true;

    // Un test anterior puede haber dejado estos botones deshabilitados (p. ej. tras
    // invalidar un formulario a propósito). Sin este reset, un click() posterior en
    // el mismo botón no dispara submit y el test que lo sigue falla de forma
    // intermitente según el orden aleatorio de Jasmine.
    ui.btnGuardarEvento.disabled = false;
    ui.btnCalcularPresupuesto.disabled = false;
    ui.btnAgregarInvitado.disabled = false;

    construirCatalogoDesdeMarcado(ui);
    recalcularPresupuesto(ui);
    renderInvitados(ui);
    filtrarCatalogo(ui);

    return ui;
}

/** Dispara un evento nativo sobre un elemento (bubbles: true, como un evento real de usuario). */
function emitir(elemento, tipoEvento) {
    elemento.dispatchEvent(new Event(tipoEvento, { bubbles: true }));
}

/** Simula que el usuario completa un campo y lo abandona (dispara input/change + blur). */
function tocarYValidar(elemento, valor) {
    elemento.value = valor;
    emitir(elemento, elemento.tagName === "SELECT" ? "change" : "input");
    emitir(elemento, "blur");
}

let ui;

beforeEach(function () {
    ui = restaurarEstadoInicial();
});

describe("Flujo 1: Crear evento", function () {
    it("debería marcar el nombre como inválido y deshabilitar 'Guardar' cuando queda vacío", function () {
        tocarYValidar(ui.nombreEvento, "");

        expect(ui.nombreEvento.classList.contains("is-invalid")).toBe(true);
        expect(document.getElementById("nombre-evento-error").textContent).not.toBe("");
        expect(ui.btnGuardarEvento.disabled).toBe(true);
    });

    it("debería guardar el evento con datos válidos, confirmar y persistir en Almacenamiento", function () {
        ui.nombreEvento.value = "Cumple de Lola";

        ui.btnGuardarEvento.click();

        expect(ui.confirmacionEvento.hidden).toBe(false);
        expect(ui.confirmacionEvento.textContent).toContain("Cumple de Lola");
        expect(estadoApp.evento.nombre).toBe("Cumple de Lola");

        const guardado = Almacenamiento.cargar(CLAVES_STORAGE.evento);
        expect(guardado.nombre).toBe("Cumple de Lola");
    });

    it("no debería guardar ni actualizar el evento si los datos son inválidos", function () {
        ui.nombreEvento.value = "";

        ui.btnGuardarEvento.click();

        expect(ui.confirmacionEvento.hidden).toBe(false);
        expect(ui.confirmacionEvento.textContent).toContain("Revisá los campos marcados");
        expect(estadoApp.evento.nombre).toBe("Casamiento de Sofi & Mateo");
    });

    it("debería recalcular el Flujo 2 al guardar un presupuesto estimado menor al total contratado", function () {
        ui.presupuestoEstimado.value = "1000";

        ui.btnGuardarEvento.click();

        expect(ui.alertaPresupuesto.textContent).toContain("supera");
    });
});

describe("Flujo 2: Calcular presupuesto", function () {
    it("debería calcular el total sin descuento y marcarlo dentro del presupuesto estimado", function () {
        expect(ui.totalPresupuesto.textContent).toBe("$580.000");
        expect(ui.alertaPresupuesto.textContent).toContain("dentro del presupuesto");
    });

    it("debería aplicar un descuento del 10% sobre el total", function () {
        tocarYValidar(ui.descuentoPresupuesto, "10");

        expect(ui.totalPresupuesto.textContent).toBe("$522.000");
    });

    it("debería mostrar la alerta de excedido cuando el total supera el presupuesto estimado", function () {
        tocarYValidar(document.getElementById("cantidad-catering"), "200");

        expect(ui.alertaPresupuesto.textContent).toContain("supera");
    });

    it("debería bloquear el resultado con una cantidad negativa y recuperarlo al corregirla", function () {
        const inputCantidad = document.getElementById("cantidad-catering");

        tocarYValidar(inputCantidad, "-5");
        expect(ui.totalPresupuesto.textContent).toBe("—");
        expect(ui.btnCalcularPresupuesto.disabled).toBe(true);
        expect(inputCantidad.classList.contains("is-invalid")).toBe(true);

        tocarYValidar(inputCantidad, "120");
        expect(ui.totalPresupuesto.textContent).toBe("$580.000");
        expect(ui.btnCalcularPresupuesto.disabled).toBe(false);
    });

    it("debería bloquear el resultado con un descuento fuera de 0-100", function () {
        tocarYValidar(ui.descuentoPresupuesto, "150");

        expect(ui.totalPresupuesto.textContent).toBe("—");
        expect(ui.descuentoPresupuesto.classList.contains("is-invalid")).toBe(true);
    });
});

describe("Flujo 3: Buscar en catálogo", function () {
    it("debería mostrar los 3 proveedores del catálogo sin ningún filtro", function () {
        expect(ui.contadorCatalogo.textContent).toBe("3 proveedores encontrados");
    });

    it("debería filtrar por texto (nombre)", function () {
        tocarYValidar(ui.buscarCatalogo, "flores");

        expect(ui.contadorCatalogo.textContent).toBe("1 proveedor encontrado");
    });

    it("debería filtrar por categoría usando el valor exacto de la opción seleccionada", function () {
        tocarYValidar(ui.categoriaCatalogo, "Decoración");

        expect(ui.contadorCatalogo.textContent).toBe("1 proveedor encontrado");
    });

    it("no debería incluir un proveedor cuyo NOMBRE contiene el texto de otra categoría al filtrar por categoría (regresión del bug corregido en PR #104, ronda 3)", function () {
        estadoApp.catalogo.agregarProveedor(new Proveedor("Catering Beats Sonido Móvil", "Sonido", 9000, "hora"));

        tocarYValidar(ui.categoriaCatalogo, "Catering");

        expect(ui.contadorCatalogo.textContent).toBe("1 proveedor encontrado");
    });

    it("debería combinar texto y categoría", function () {
        tocarYValidar(ui.buscarCatalogo, "lucas");
        tocarYValidar(ui.categoriaCatalogo, "Sonido");
        expect(ui.contadorCatalogo.textContent).toBe("1 proveedor encontrado");

        tocarYValidar(ui.categoriaCatalogo, "Decoración");
        expect(ui.contadorCatalogo.textContent).toBe("0 proveedores encontrados");
        expect(ui.catalogoVacio.hidden).toBe(false);
    });

    it("debería mostrar el aviso de sin coincidencias con un texto que no matchea nada", function () {
        tocarYValidar(ui.buscarCatalogo, "zzz");

        expect(ui.catalogoVacio.hidden).toBe(false);
        expect(ui.catalogoVacio.textContent).toContain("zzz");
    });
});

describe("Flujo 4: Gestionar invitados", function () {
    it("debería agregar un invitado válido, mostrar el feedback y actualizar las métricas", function () {
        tocarYValidar(ui.nombreInvitado, "Juan Pérez");
        ui.estadoInvitado.value = "Confirmado";

        ui.btnAgregarInvitado.click();

        expect(ui.feedbackInvitados.hidden).toBe(false);
        expect(ui.feedbackInvitados.textContent).toContain("Juan Pérez");
        expect(ui.metricasInvitados.textContent).toContain("Confirmados: 3");
        expect(ui.metricasInvitados.textContent).toContain("Pendientes: 1");
    });

    it("no debería habilitar 'Agregar invitado' con el nombre vacío", function () {
        tocarYValidar(ui.nombreInvitado, "");

        expect(ui.btnAgregarInvitado.disabled).toBe(true);
    });

    it("debería recalcular las métricas al eliminar un invitado", function () {
        const fila = ui.listaInvitados.querySelector('tr[data-nombre="Sofía Rodríguez"]');
        fila.querySelector("button[data-accion='eliminar']").click();

        expect(ui.metricasInvitados.textContent).toContain("Confirmados: 1");
        expect(ui.metricasInvitados.textContent).toContain("Pendientes: 1");
    });

    it("debería distinguir por posición entre dos invitados con el mismo nombre al eliminar (regresión del bug corregido en PR #104, ronda 2)", function () {
        tocarYValidar(ui.nombreInvitado, "Juan Perez");
        ui.estadoInvitado.value = "Pendiente";
        ui.btnAgregarInvitado.click();

        tocarYValidar(ui.nombreInvitado, "Juan Perez");
        ui.estadoInvitado.value = "Confirmado";
        ui.btnAgregarInvitado.click();

        const filas = Array.from(ui.listaInvitados.querySelectorAll('tr[data-nombre="Juan Perez"]'));
        expect(filas.length).toBe(2);

        const filaConfirmada = filas.find(function (fila) {
            return fila.querySelector("button[data-accion='pendiente']") !== null;
        });
        filaConfirmada.querySelector("button[data-accion='eliminar']").click();

        const restantes = Array.from(ui.listaInvitados.querySelectorAll('tr[data-nombre="Juan Perez"]'));
        expect(restantes.length).toBe(1);
        expect(restantes[0].querySelector("button[data-accion='confirmar']")).not.toBeNull();
    });

    it("debería persistir la lista de invitados en Almacenamiento al agregar uno nuevo", function () {
        tocarYValidar(ui.nombreInvitado, "Nueva Persona");
        ui.estadoInvitado.value = "Pendiente";

        ui.btnAgregarInvitado.click();

        const guardado = Almacenamiento.cargar(CLAVES_STORAGE.evento);
        expect(guardado.invitados.invitados.some(function (i) { return i.nombre === "Nueva Persona"; })).toBe(true);
    });
});
