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
 *
 * El bloque "Integración - Controlador y UI (RC14, RC15, RC16)" al final del
 * archivo agrega:
 *   - RC14/RC15: un sandbox con el Modal de detalle, el Toast y los botones de
 *     las tarjetas copiados de index.html, montado y desmontado en cada spec;
 *   - RC16: una "carga nueva" de la página: se descarta el estado en memoria, se
 *     reemplazan los nodos del fixture por su marcado original (capturado abajo,
 *     antes de DOMContentLoaded) y se vuelve a disparar DOMContentLoaded.
 */

/*
 * Marcado original de los nodos del fixture que lee el controlador. Este archivo
 * se ejecuta antes de DOMContentLoaded (scripts clásicos al final del <body>), así
 * que outerHTML todavía no tiene ningún cambio hecho por configurarEventos().
 */
const IDS_FIXTURE_RECARGABLES = [
    "aviso-app", "form-evento", "form-presupuesto", "form-catalogo", "contador-catalogo",
    "catalogo-vacio", "contenedor-catalogo", "form-invitado", "feedback-invitados",
    "metricas-invitados", "lista-invitados"
];
const MARCADO_INICIAL_FIXTURE = new Map(
    IDS_FIXTURE_RECARGABLES.map(function (id) { return [id, document.getElementById(id).outerHTML]; })
);

/**
 * Paso 3 del ciclo de vida de RC16: descarta las instancias en memoria y
 * reemplaza cada nodo del fixture por uno nuevo, parseado desde su marcado
 * original. Los nodos nuevos no tienen listeners ni valores modificados: el DOM
 * queda como en una carga limpia, antes de que corra configurarEventos().
 */
function reiniciarMemoriaYDOM() {
    estadoApp.evento = null;
    estadoApp.catalogo = null;
    estadoApp.tarjetasCatalogo.clear();

    MARCADO_INICIAL_FIXTURE.forEach(function (marcado, id) {
        const plantilla = document.createElement("template");
        plantilla.innerHTML = marcado;
        document.getElementById(id).replaceWith(plantilla.content.firstElementChild);
    });
}

/**
 * Modal de detalle, Toast y botones de las 3 tarjetas, copiados de index.html. Única
 * diferencia: data-service-image apunta a ../../docs/ porque el runner vive en js/test/
 * (con ./docs/ la imagen daría 404 y run-jasmine.js lo contaría como console.error).
 */
const MARCADO_COMPONENTES_BOOTSTRAP = `
    <div class="tarjetas-sandbox">
        <button type="button" class="btn btn-outline-primary btn-ver-detalle" data-bs-toggle="modal" data-bs-target="#modalDetalleServicio" data-service-title="Gourmet Finger Food" data-service-image="../../docs/01-mockup/actividad-obligatoria-2/catalogo-gourmet-finger-food.jpg" data-service-alt="Mesa de catering con bandejas de mini sándwiches y bocados en varios niveles" data-service-description="Selección premium fría y caliente para recepción. Variedad para todos los gustos." data-service-capacidad="Hasta 200 pax" data-service-duracion="4 horas" data-service-incluye="Finger food frío y caliente, montaje y reposición" data-service-price="$3.500 / pax">Ver detalle</button>
        <button type="button" class="btn btn-primary btn-sumar-evento" data-service-title="Gourmet Finger Food" data-service-price="$3.500 / pax">Sumar al Evento</button>
        <button type="button" class="btn btn-outline-primary btn-ver-detalle" data-bs-toggle="modal" data-bs-target="#modalDetalleServicio" data-service-title="Flores Pilar" data-service-image="../../docs/01-mockup/actividad-obligatoria-2/catalogo-flores-pilar.jpg" data-service-alt="Centro de mesa con rosas y peonías rosadas sobre una mesa de salón de eventos" data-service-description="Centros de mesa personalizados y ramo para novias con flores naturales de estación." data-service-capacidad="1 evento por fecha" data-service-duracion="1 jornada de montaje" data-service-incluye="Centros de mesa personalizados y ramo para novias" data-service-price="$70.000 / base">Ver detalle</button>
        <button type="button" class="btn btn-primary btn-sumar-evento" data-service-title="Flores Pilar" data-service-price="$70.000 / base">Sumar al Evento</button>
        <button type="button" class="btn btn-outline-primary btn-ver-detalle" data-bs-toggle="modal" data-bs-target="#modalDetalleServicio" data-service-title="DJ Lucas &amp; Sonido" data-service-image="../../docs/01-mockup/actividad-obligatoria-2/catalogo-dj-lucas-sonido.jpg" data-service-alt="DJ con auriculares mezclando en una consola frente a una pista iluminada" data-service-description="Equipamiento de audio completo de alta fidelidad, iluminación robótica y pista de baile." data-service-capacidad="Hasta 300 personas" data-service-duracion="6 horas" data-service-incluye="DJ, sonido de alta fidelidad e iluminación robótica" data-service-price="$8.000 / hora">Ver detalle</button>
        <button type="button" class="btn btn-primary btn-sumar-evento" data-service-title="DJ Lucas &amp; Sonido" data-service-price="$8.000 / hora">Sumar al Evento</button>
    </div>
    <div class="modal fade" id="modalDetalleServicio" tabindex="-1" aria-labelledby="modalDetalleServicioTitulo" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title" id="modalDetalleServicioTitulo">Detalle del servicio</h2>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                </div>
                <div class="modal-body">
                    <img id="modalDetalleServicioImagen" class="img-fluid rounded" alt="">
                    <p id="modalDetalleServicioDescripcion"></p>
                    <ul class="list-unstyled small mb-0" aria-label="Detalles del servicio">
                        <li><strong>Capacidad:</strong> <span id="modalDetalleServicioCapacidad"></span></li>
                        <li><strong>Duración:</strong> <span id="modalDetalleServicioDuracion"></span></li>
                        <li><strong>Incluye:</strong> <span id="modalDetalleServicioIncluye"></span></li>
                        <li><span>Proveedor verificado</span></li>
                    </ul>
                    <p id="modalDetalleServicioPrecio" class="fw-bold"></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary btn-sumar-evento" data-bs-dismiss="modal" data-service-title="" data-service-price="">Sumar al Evento</button>
                </div>
            </div>
        </div>
    </div>
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
        <div id="toastConfirmacion" class="toast" role="status" aria-live="polite" aria-atomic="true" data-bs-delay="4000">
            <div class="toast-header">
                <strong class="me-auto">PlanIT</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Cerrar"></button>
            </div>
            <div class="toast-body">
                <p id="toastConfirmacionServicio" class="mb-1"></p>
                <p id="toastConfirmacionMensaje" class="mb-0">Experiencia agregada a tu evento</p>
            </div>
        </div>
    </div>`;

/**
 * Monta el sandbox de componentes Bootstrap y registra sus listeners con la misma
 * función que usa configurarEventos() en index.html.
 */
function montarComponentesBootstrap() {
    const sandbox = document.createElement("div");
    sandbox.id = "sandbox-componentes-bootstrap";
    sandbox.innerHTML = MARCADO_COMPONENTES_BOOTSTRAP;
    document.body.append(sandbox);
    configurarComponentesBootstrap();
    return sandbox;
}

/**
 * Margen para que terminen las transiciones que Bootstrap deja en cola. Sin su CSS
 * de transición, Bootstrap las emula con un setTimeout de ~5 ms (duración 0 + 5 ms
 * de padding). 50 ms vence siempre después de todas ellas.
 */
const MARGEN_TRANSICIONES_BOOTSTRAP_MS = 50;

/**
 * Libera instancias de Bootstrap, restos de backdrop y el sandbox.
 *
 * Primero espera a que terminen las transiciones en cola. Toast.show() programa
 * un callback que hace `this._element.classList.remove("showing")`; si dispose()
 * corre antes (pone `_element` en null), ese callback falla más tarde con
 * "Cannot read properties of null (reading 'classList')" y Jasmine se lo
 * atribuye a la suite que esté corriendo en ese momento.
 */
async function desmontarComponentesBootstrap(sandbox) {
    if (typeof bootstrap !== "undefined" && bootstrap) {
        const modal = document.getElementById("modalDetalleServicio");
        const toast = document.getElementById("toastConfirmacion");
        const instanciaModal = modal && bootstrap.Modal.getInstance(modal);
        const instanciaToast = toast && bootstrap.Toast.getInstance(toast);

        if (instanciaModal || instanciaToast) {
            await new Promise(function (resolve) { setTimeout(resolve, MARGEN_TRANSICIONES_BOOTSTRAP_MS); });
        }
        if (instanciaModal) instanciaModal.dispose();
        if (instanciaToast) instanciaToast.dispose();
    }
    document.querySelectorAll(".modal-backdrop").forEach(function (nodo) { nodo.remove(); });
    document.body.classList.remove("modal-open");
    document.body.style.removeProperty("overflow");
    document.body.style.removeProperty("padding-right");
    sandbox.remove();
}

/** Promesa que se resuelve la próxima vez que `elemento` emite `tipo`. */
function esperarEvento(elemento, tipo) {
    return new Promise(function (resolve) {
        elemento.addEventListener(tipo, resolve, { once: true });
    });
}

/**
 * Dispara `show.bs.modal` sobre el Modal tal como lo hace Bootstrap (evento
 * cancelable con `relatedTarget` = botón que lo abrió), sin depender de su JS.
 */
function dispararShowModal(modal, disparador) {
    const evento = new Event("show.bs.modal", { bubbles: true, cancelable: true });
    evento.relatedTarget = disparador;
    modal.dispatchEvent(evento);
}

/** Ejecuta `accion` y devuelve los errores no capturados que llegaron a window. */
function capturarErroresNoControlados(accion) {
    const errores = [];
    const registrar = function (evento) { errores.push(evento.message); };
    window.addEventListener("error", registrar);
    try {
        accion();
    } finally {
        window.removeEventListener("error", registrar);
    }
    return errores;
}

const FIXTURE_CANTIDADES = {
    "cantidad-catering": "120",
    "cantidad-decoracion": "1",
    "cantidad-sonido": "6",
    "cantidad-fotografia": "1",
    "cantidad-transporte": "2"
};

function restaurarEstadoInicial() {
    const ui = obtenerReferenciasUI();

    // RC22: el estado persistido se limpia a través de la fachada, igual que lo usa el controlador.
    estadoApp.persistencia.limpiar();

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

    construirCatalogo(ui);
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

describe("script.spec.js", function () {

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

    it("debería guardar el evento con datos válidos, confirmar y persistir vía la fachada de persistencia", function () {
        ui.nombreEvento.value = "Cumple de Lola";

        ui.btnGuardarEvento.click();

        expect(ui.confirmacionEvento.hidden).toBe(false);
        expect(ui.confirmacionEvento.textContent).toContain("Cumple de Lola");
        expect(estadoApp.evento.nombre).toBe("Cumple de Lola");

        const guardado = estadoApp.persistencia.cargar();
        expect(guardado.evento.nombre).toBe("Cumple de Lola");
        expect(guardado.detalles).toEqual({
            fecha: "2026-11-14",
            ubicacion: "Quinta El Ombú, Pilar, Buenos Aires"
        });
    });

    it("debería delegar el guardado en la fachada con la instancia del dominio y los detalles (RC22)", function () {
        spyOn(estadoApp.persistencia, "guardar").and.callThrough();

        ui.btnGuardarEvento.click();

        expect(estadoApp.persistencia.guardar).toHaveBeenCalledWith(estadoApp.evento, {
            fecha: "2026-11-14",
            ubicacion: "Quinta El Ombú, Pilar, Buenos Aires"
        });
    });

    it("debería conservar presupuesto e invitados al actualizar los datos del evento", function () {
        const itemsAntes = estadoApp.evento.presupuesto.items.length;
        const invitadosAntes = estadoApp.evento.invitados.invitados.length;
        ui.nombreEvento.value = "Cumple de Lola";

        ui.btnGuardarEvento.click();

        expect(estadoApp.evento.presupuesto.items.length).toBe(itemsAntes);
        expect(estadoApp.evento.invitados.invitados.length).toBe(invitadosAntes);
    });

    it("debería avisar al usuario cuando el guardado falla (regresión del bug corregido en PR #104, ronda 1)", function () {
        spyOn(estadoApp.persistencia, "guardar").and.returnValue(false);

        ui.nombreEvento.value = "Cumple de Lola";
        ui.btnGuardarEvento.click();

        expect(ui.avisoApp.hidden).toBe(false);
        expect(ui.avisoApp.textContent).toContain("No se pudieron guardar los cambios");
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

    it("debería persistir la lista de invitados vía la fachada al agregar uno nuevo", function () {
        tocarYValidar(ui.nombreInvitado, "Nueva Persona");
        ui.estadoInvitado.value = "Pendiente";

        ui.btnAgregarInvitado.click();

        const guardado = estadoApp.persistencia.cargar().evento;
        expect(guardado.invitados.invitados.some(function (i) { return i.nombre === "Nueva Persona"; })).toBe(true);
    });
});

describe("Integración - Controlador y UI (RC14, RC15, RC16)", function () {
    let sandbox = null;
    let bootstrapOriginal;

    /** id del nodo del Modal -> clave de data-service-* del disparador. */
    const CAMPOS_MODAL = {
        modalDetalleServicioTitulo: "serviceTitle",
        modalDetalleServicioDescripcion: "serviceDescription",
        modalDetalleServicioCapacidad: "serviceCapacidad",
        modalDetalleServicioDuracion: "serviceDuracion",
        modalDetalleServicioIncluye: "serviceIncluye",
        modalDetalleServicioPrecio: "servicePrice"
    };

    function disparadoresDetalle() {
        return Array.from(sandbox.querySelectorAll(".tarjetas-sandbox .btn-ver-detalle"));
    }

    function botonesSumarTarjetas() {
        return Array.from(sandbox.querySelectorAll(".tarjetas-sandbox .btn-sumar-evento"));
    }

    function botonSumarModal() {
        return document.querySelector("#modalDetalleServicio .btn-sumar-evento");
    }

    function toast() {
        return document.getElementById("toastConfirmacion");
    }

    beforeEach(function () {
        // Referencia temporal: los specs de "Bootstrap ausente" ponen window.bootstrap
        // en undefined, y siempre se restaura en afterEach aunque el spec falle.
        bootstrapOriginal = window.bootstrap;
    });

    // async: espera a que terminen las transiciones de Bootstrap antes de dispose()
    // (ver desmontarComponentesBootstrap). Jasmine corre antes el afterEach interno,
    // que desinstala jasmine.clock(), así que este setTimeout es real.
    afterEach(async function () {
        window.bootstrap = bootstrapOriginal;
        if (sandbox) {
            await desmontarComponentesBootstrap(sandbox);
            sandbox = null;
        }
    });

    describe("RC14: Modal de detalle de proveedor (show.bs.modal)", function () {
        let modal;

        beforeEach(function () {
            sandbox = montarComponentesBootstrap();
            modal = document.getElementById("modalDetalleServicio");
        });

        it("INT-RC14-01: show.bs.modal con relatedTarget debería inyectar todos los datos del servicio en el Modal", function () {
            const disparador = disparadoresDetalle()[1]; // Flores Pilar

            dispararShowModal(modal, disparador);

            Object.entries(CAMPOS_MODAL).forEach(function ([id, clave]) {
                expect(document.getElementById(id).textContent).toBe(disparador.dataset[clave]);
            });
            expect(document.getElementById("modalDetalleServicioTitulo").textContent).toBe("Flores Pilar");
            expect(document.getElementById("modalDetalleServicioPrecio").textContent).toBe("$70.000 / base");
            const imagen = document.getElementById("modalDetalleServicioImagen");
            expect(imagen.getAttribute("src")).toBe(disparador.dataset.serviceImage);
            expect(imagen.alt).toBe(disparador.dataset.serviceAlt);
            expect(imagen.alt).not.toBe("");
        });

        it("INT-RC14-02: show.bs.modal sin relatedTarget no debería modificar el contenido del Modal", function () {
            dispararShowModal(modal, null);

            expect(document.getElementById("modalDetalleServicioTitulo").textContent).toBe("Detalle del servicio");
            expect(botonSumarModal().dataset.serviceTitle).toBe("");
        });

        it("INT-RC14-03: abrir con 'Ver detalle' (Bootstrap real) debería exponer roles ARIA, mover el foco al diálogo y devolverlo al disparador al cerrar", async function () {
            const disparador = disparadoresDetalle()[2]; // DJ Lucas & Sonido
            expect(modal.getAttribute("aria-hidden")).toBe("true");

            disparador.focus();
            const mostrado = esperarEvento(modal, "shown.bs.modal");
            disparador.click();
            await mostrado;

            expect(modal.getAttribute("role")).toBe("dialog");
            expect(modal.getAttribute("aria-modal")).toBe("true");
            expect(modal.hasAttribute("aria-hidden")).toBe(false);
            expect(document.getElementById(modal.getAttribute("aria-labelledby")).textContent).toBe("DJ Lucas & Sonido");
            expect(modal.contains(document.activeElement)).toBe(true);

            const oculto = esperarEvento(modal, "hidden.bs.modal");
            bootstrap.Modal.getInstance(modal).hide();
            await oculto;

            expect(modal.getAttribute("aria-hidden")).toBe("true");
            expect(document.activeElement).toBe(disparador);
        });

        it("INT-RC14-04: el botón 'Sumar al Evento' del Modal debería recibir los datos del último proveedor abierto, sin arrastrar los anteriores", function () {
            const [gourmet, flores] = disparadoresDetalle();

            dispararShowModal(modal, gourmet);
            expect(botonSumarModal().dataset.serviceTitle).toBe("Gourmet Finger Food");
            expect(botonSumarModal().dataset.servicePrice).toBe("$3.500 / pax");

            dispararShowModal(modal, flores);
            expect(botonSumarModal().dataset.serviceTitle).toBe("Flores Pilar");
            expect(botonSumarModal().dataset.servicePrice).toBe("$70.000 / base");
        });

        it("INT-RC14-05: abrir el Modal y pulsar 'Sumar al Evento' debería propagar el proveedor al Toast y cerrar el Modal", async function () {
            const disparador = disparadoresDetalle()[0]; // Gourmet Finger Food

            const mostrado = esperarEvento(modal, "shown.bs.modal");
            disparador.click();
            await mostrado;

            const oculto = esperarEvento(modal, "hidden.bs.modal");
            botonSumarModal().click();

            expect(document.getElementById("toastConfirmacionServicio").textContent).toBe("Gourmet Finger Food · $3.500 / pax");
            expect(toast().dataset.serviceTitle).toBe("Gourmet Finger Food");
            expect(toast().classList.contains("show")).toBe(true);

            await oculto;
            expect(modal.classList.contains("show")).toBe(false);
        });
    });

    describe("RC15: Toast de 'Sumar al Evento' con Bootstrap presente", function () {
        beforeEach(function () {
            sandbox = montarComponentesBootstrap();
            spyOn(bootstrap.Toast, "getOrCreateInstance").and.callThrough();
            spyOn(bootstrap.Toast.prototype, "show").and.callThrough();
        });

        it("INT-RC15-01: cada botón .btn-sumar-evento de las tarjetas debería mostrar el Toast de Bootstrap con su servicio", function () {
            const botones = botonesSumarTarjetas();
            expect(botones.length).toBe(3);

            botones.forEach(function (boton, posicion) {
                boton.click();

                expect(bootstrap.Toast.getOrCreateInstance).toHaveBeenCalledWith(toast());
                expect(bootstrap.Toast.prototype.show).toHaveBeenCalledTimes(posicion + 1);
                expect(document.getElementById("toastConfirmacionServicio").textContent)
                    .toBe(boton.dataset.serviceTitle + " · " + boton.dataset.servicePrice);
                expect(document.getElementById("toastConfirmacionMensaje").textContent).toBe("Experiencia agregada a tu evento");
                expect(toast().classList.contains("show")).toBe(true);
            });
        });

        it("INT-RC15-02: el botón .btn-sumar-evento del Modal debería mostrar el Toast de Bootstrap con el servicio abierto", function () {
            dispararShowModal(document.getElementById("modalDetalleServicio"), disparadoresDetalle()[2]);

            botonSumarModal().click();

            expect(bootstrap.Toast.prototype.show).toHaveBeenCalledTimes(1);
            expect(document.getElementById("toastConfirmacionServicio").textContent).toBe("DJ Lucas & Sonido · $8.000 / hora");
            expect(toast().classList.contains("show")).toBe(true);
        });
    });

    describe("RC15: Toast de 'Sumar al Evento' con Bootstrap ausente (degradación)", function () {
        beforeEach(function () {
            // Simula que el bundle de Bootstrap no cargó (CDN caído o bloqueado) desde el inicio.
            window.bootstrap = undefined;
            jasmine.clock().install();
            sandbox = montarComponentesBootstrap();
            // window.bootstrap = undefined no desactiva los handlers que el bundle ya
            // registró en `document` (data-api: data-bs-dismiss, data-bs-toggle), que
            // usan referencias internas. Para que el escenario sea "Bootstrap no cargó"
            // de verdad, los clics del sandbox no llegan a `document`; los listeners
            // propios de script.js están en cada botón y se ejecutan igual.
            sandbox.addEventListener("click", function (evento) { evento.stopPropagation(); });
            spyOn(console, "error");
        });

        afterEach(function () {
            jasmine.clock().uninstall();
        });

        it("INT-RC15-03: cada botón .btn-sumar-evento de las tarjetas debería mostrar el Toast con la clase 'show' del CSS, sin errores, y ocultarlo tras data-bs-delay", function () {
            expect(typeof bootstrap).toBe("undefined");

            botonesSumarTarjetas().forEach(function (boton) {
                const errores = capturarErroresNoControlados(function () { boton.click(); });

                expect(errores).toEqual([]);
                expect(toast().classList.contains("show")).toBe(true);
                expect(document.getElementById("toastConfirmacionServicio").textContent)
                    .toBe(boton.dataset.serviceTitle + " · " + boton.dataset.servicePrice);
                expect(toast().getAttribute("role")).toBe("status");
                expect(toast().getAttribute("aria-live")).toBe("polite");

                jasmine.clock().tick(4000);
                expect(toast().classList.contains("show")).toBe(false);
            });
            expect(console.error).not.toHaveBeenCalled();
        });

        it("INT-RC15-04: el botón .btn-sumar-evento del Modal debería mostrar el Toast degradado con el servicio abierto", function () {
            dispararShowModal(document.getElementById("modalDetalleServicio"), disparadoresDetalle()[1]);

            const errores = capturarErroresNoControlados(function () { botonSumarModal().click(); });

            expect(errores).toEqual([]);
            expect(toast().classList.contains("show")).toBe(true);
            expect(document.getElementById("toastConfirmacionServicio").textContent).toBe("Flores Pilar · $70.000 / base");
            expect(console.error).not.toHaveBeenCalled();
        });

        it("INT-RC15-05: un segundo clic antes de que venza la demora debería reiniciar el temporizador del Toast degradado", function () {
            const [primero, segundo] = botonesSumarTarjetas();

            primero.click();
            jasmine.clock().tick(3000);
            segundo.click();
            jasmine.clock().tick(3000);

            expect(toast().classList.contains("show")).toBe(true);
            expect(document.getElementById("toastConfirmacionServicio").textContent).toContain("Flores Pilar");

            jasmine.clock().tick(1000);
            expect(toast().classList.contains("show")).toBe(false);
        });
    });

    describe("RC16: Persistencia y restauración en una carga nueva de la página", function () {
        // RC22: las claves son privadas de ServicioPersistenciaEvento. Estos specs leen y
        // escriben el storage en crudo (caja negra), así que declaran las claves esperadas.
        const CLAVES_STORAGE = Object.freeze({
            evento: "planit:evento",
            detallesEvento: "planit:detalles-evento"
        });

        it("INT-RC16-01: los cambios hechos en el DOM deberían persistirse y reconstruirse tras reiniciar memoria y DOM y volver a disparar DOMContentLoaded", function () {
            // 1. Modificar el estado desde la UI (mismos eventos que un usuario real).
            tocarYValidar(ui.nombreInvitado, "Lucía Fernández");
            ui.estadoInvitado.value = "Confirmado";
            ui.btnAgregarInvitado.click();
            tocarYValidar(document.getElementById("cantidad-catering"), "150");
            ui.ubicacion.value = "Estancia La Candelaria, Lobos";
            ui.btnGuardarEvento.click();

            // 2. Verificar lo grabado leyendo el storage en crudo (sin pasar por Almacenamiento).
            const eventoCrudo = JSON.parse(localStorage.getItem(CLAVES_STORAGE.evento));
            const catering = eventoCrudo.presupuesto.items.find(function (item) { return item.categoria === "Catering"; });
            expect(Number(catering.cantidad)).toBe(150);
            expect(eventoCrudo.invitados.invitados).toContain({ nombre: "Lucía Fernández", estado: "Confirmado" });
            expect(JSON.parse(localStorage.getItem(CLAVES_STORAGE.detallesEvento)).ubicacion)
                .toBe("Estancia La Candelaria, Lobos");

            // 3. Reiniciar memoria y DOM: nada de lo anterior debe quedar fuera del storage.
            const eventoAnterior = estadoApp.evento;
            reiniciarMemoriaYDOM();
            let uiNueva = obtenerReferenciasUI();

            expect(estadoApp.evento).toBeNull();
            expect(uiNueva.listaInvitados.querySelector('tr[data-nombre="Lucía Fernández"]')).toBeNull();
            expect(document.getElementById("cantidad-catering").value).toBe("120");
            expect(uiNueva.ubicacion.value).toBe("Quinta El Ombú, Pilar, Buenos Aires");
            expect(uiNueva.totalPresupuesto.textContent).toBe("");

            // 4. Rutina de arranque, igual que en una carga real de index.html.
            document.dispatchEvent(new Event("DOMContentLoaded"));
            uiNueva = obtenerReferenciasUI();

            // 5. El DOM se reconstruye desde lo persistido.
            expect(estadoApp.evento).not.toBe(eventoAnterior);
            expect(estadoApp.evento instanceof Evento).toBe(true);
            expect(uiNueva.avisoApp.hidden).toBe(true);

            // RC9-RC11: las filas se renderizan dinámicamente; se ubica la de Catering por su input.
            const filaCatering = document.getElementById("cantidad-catering").closest("tr[data-item]");
            expect(obtenerFilasPresupuesto(uiNueva)).toContain(filaCatering);
            expect(filaCatering.querySelector(".input-cantidad").value).toBe("150");
            expect(filaCatering.querySelector("[data-subtotal]").textContent).toBe("$525.000");
            expect(uiNueva.subtotalPresupuesto.textContent).toBe("$685.000");
            expect(uiNueva.totalPresupuesto.textContent).toBe("$685.000");
            expect(uiNueva.alertaPresupuesto.textContent).toContain("dentro del presupuesto");

            const filaLucia = uiNueva.listaInvitados.querySelector('tr[data-nombre="Lucía Fernández"]');
            expect(filaLucia).not.toBeNull();
            const badge = filaLucia.querySelector(".badge");
            expect(badge.textContent).toBe("Confirmado");
            expect(badge.classList.contains("badge-confirmado")).toBe(true);
            expect(filaLucia.querySelector("button[data-accion='pendiente']")).not.toBeNull();
            expect(uiNueva.metricasInvitados.textContent).toContain("Confirmados: 3");
            expect(uiNueva.metricasInvitados.textContent).toContain("Pendientes: 1");

            expect(uiNueva.ubicacion.value).toBe("Estancia La Candelaria, Lobos");
            expect(uiNueva.nombreEvento.value).toBe("Casamiento de Sofi & Mateo");
        });

        it("INT-RC16-02: sin datos persistidos, una carga nueva debería mostrar los datos de ejemplo del marcado (control)", function () {
            Almacenamiento.limpiar("planit:");

            reiniciarMemoriaYDOM();
            document.dispatchEvent(new Event("DOMContentLoaded"));
            const uiNueva = obtenerReferenciasUI();

            // RC9-RC11: los datos de ejemplo ya no vienen del marcado sino de DATOS_SEMILLA.
            expect(estadoApp.evento.invitados.invitados.length).toBe(DATOS_SEMILLA.invitados.invitados.length);
            expect(document.getElementById("cantidad-catering").value).toBe("120");
            expect(uiNueva.totalPresupuesto.textContent).toBe("$580.000");
            expect(uiNueva.metricasInvitados.textContent).toContain("Confirmados: 3");
            expect(uiNueva.metricasInvitados.textContent).toContain("Pendientes: 2");
        });

        it("INT-RC16-03: con un evento persistido inválido, una carga nueva debería avisar y caer en los datos de ejemplo sin lanzar", function () {
            localStorage.setItem(CLAVES_STORAGE.evento, JSON.stringify({ nombre: "X", tipo: "tipo-inexistente", presupuestoEstimado: 1000 }));

            reiniciarMemoriaYDOM();
            const errores = capturarErroresNoControlados(function () {
                document.dispatchEvent(new Event("DOMContentLoaded"));
            });
            const uiNueva = obtenerReferenciasUI();

            expect(errores).toEqual([]);
            expect(uiNueva.avisoApp.hidden).toBe(false);
            expect(uiNueva.avisoApp.textContent).toContain("dañados");
            expect(estadoApp.evento.nombre).toBe("Casamiento de Sofi & Mateo");
            expect(uiNueva.totalPresupuesto.textContent).toBe("$580.000");
        });
    });
});

});
