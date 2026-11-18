/*
 * PlanIT - Controlador de UI y eventos (Actividad Obligatoria N.° 4)
 *
 * Rol: Desarrollador JS Eventos + DOM.
 * Spec: docs/03-specs/actividad-obligatoria-4/spec-dev-eventos-dom.md
 *
 * Este archivo es EXCLUSIVAMENTE un controlador/orquestador:
 *   - obtiene referencias del DOM y registra listeners;
 *   - lee los valores crudos de los controles;
 *   - delega validaciones, cálculos y reglas en las clases de js/models/;
 *   - delega la persistencia en js/utils/storage.js;
 *   - renderiza en el DOM lo que devuelven los modelos.
 *
 * Reglas:
 *   1. Sin lógica de negocio ni cálculos: los totales, descuentos, conteos y
 *      validaciones salen de los modelos (Evento, Presupuesto, ItemContratado,
 *      ListaInvitados, Invitado, CatalogoProveedores, Proveedor, Validador).
 *   2. Sin ventanas emergentes (prompt, alert ni confirm): toda entrada es por formularios y toda
 *      salida se muestra en el DOM.
 *
 * Dependencias (cargadas antes que este archivo, ver index.html):
 *   js/models/*.js  -> clases del dominio (PR #102, rama feature/dev-poo-logica-negocio).
 *   js/utils/storage.js -> objeto global `Almacenamiento` con el contrato:
 *       Almacenamiento.guardar(clave, valor)  // serializa y guarda; lanza Error si falla
 *       Almacenamiento.cargar(clave)          // devuelve el valor deserializado o null
 *   Si el almacenamiento no está disponible, la app funciona en memoria y lo avisa.
 */

/* ==========================================================================
   1. CONFIGURACIÓN Y ESTADO DEL CONTROLADOR
   ========================================================================== */

/** Claves usadas en el almacenamiento persistente. */
const CLAVES_STORAGE = {
    evento: "planit:evento",
    detallesEvento: "planit:detalles-evento"
};

/**
 * Relaciona cada campo del formulario con el inicio del mensaje de error que
 * devuelve el modelo. Permite mostrar cada error de Evento.validarDatos() e
 * Invitado.validar() debajo del campo correspondiente.
 */
const MAPA_ERRORES_EVENTO = {
    "nombre-evento": "El nombre",
    "tipo-evento": "El tipo",
    "presupuesto-estimado": "El presupuesto"
};

const MAPA_ERRORES_INVITADO = {
    "nombre-invitado": "El nombre",
    "estado-invitado": "El estado"
};

/** Formateador de moneda (presentación, no cálculo). */
const FORMATEADOR_NUMERO = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 });

/**
 * Estado que el controlador mantiene en memoria. No contiene reglas: solo guarda
 * las instancias de los modelos que se están mostrando.
 */
const estadoApp = {
    evento: null,            // Instancia de Evento (incluye Presupuesto y ListaInvitados)
    catalogo: null,          // Instancia de CatalogoProveedores
    tarjetasCatalogo: new Map() // Proveedor -> nodo de la tarjeta en el DOM
};
/** Catálogo de proveedores del mockup aprobado. */
const catalogoProveedores = [
    new Proveedor("Gourmet Finger Food", "Catering", 3500, "pax"),
    new Proveedor("Flores Pilar", "Decoración", 70000, "base"),
    new Proveedor("DJ Lucas & Sonido", "Sonido", 8000, "hora")
];

/** Invitados de ejemplo de la sección Invitados del mockup. */
let invitados = [
    { nombre: "Sofía Rodríguez", estado: "Confirmado" },
    { nombre: "Mateo González", estado: "Confirmado" },
    { nombre: "Valentina Benítez", estado: "Pendiente" },
    { nombre: "Bautista Martínez", estado: "Confirmado" },
    { nombre: "Santiago Díaz", estado: "Pendiente" }
];

/** Eventos creados en el Flujo 1 (inicia vacía). */
let eventos = [];

/* ==========================================================================
   2. PUNTO DE ENTRADA
   ========================================================================== */

document.addEventListener("DOMContentLoaded", configurarEventos);

/**
 * Función orquestadora: obtiene las referencias del DOM, carga el estado inicial
 * y registra los listeners de los 4 flujos. Cada flujo se configura solo si sus
 * nodos existen, así una sección ausente no rompe a las demás.
 */
function configurarEventos() {
    const ui = obtenerReferenciasUI();

    const modelosFaltantes = obtenerModelosFaltantes();
    if (modelosFaltantes.length > 0) {
        renderAvisoGlobal(ui, "No se pudo iniciar PlanIT: faltan los modelos " +
            modelosFaltantes.join(", ") + ".");
        return;
    }

    if (!almacenamientoDisponible()) {
        renderAvisoGlobal(ui, "Los cambios no se guardarán al recargar la página: " +
            "el almacenamiento no está disponible.");
    }

    estadoApp.evento = cargarEventoInicial(ui);
    if (!estadoApp.evento) {
        return;
    }

    sincronizarFormularioEvento(ui);
    sincronizarCantidadesPresupuesto(ui);

    configurarFlujoEvento(ui);
    configurarFlujoPresupuesto(ui);
    configurarFlujoCatalogo(ui);
    configurarFlujoInvitados(ui);
}

/**
 * Cachea todas las referencias del DOM una sola vez.
 * @returns {Object} Referencias a formularios, campos y contenedores.
 */
function obtenerReferenciasUI() {
    const porId = (id) => document.getElementById(id);
    const formPresupuesto = porId("form-presupuesto");

    return {
        avisoApp: porId("aviso-app"),

        // Flujo 1: Crear evento
        formEvento: porId("form-evento"),
        nombreEvento: porId("nombre-evento"),
        fechaEvento: porId("fecha-evento"),
        tipoEvento: porId("tipo-evento"),
        presupuestoEstimado: porId("presupuesto-estimado"),
        ubicacion: porId("ubicacion"),
        btnGuardarEvento: porId("btn-guardar-evento"),
        confirmacionEvento: porId("confirmacion-evento"),

        // Flujo 2: Calcular presupuesto
        formPresupuesto,
        filasPresupuesto: formPresupuesto
            ? Array.from(formPresupuesto.querySelectorAll("tr[data-item]"))
            : [],
        descuentoPresupuesto: porId("descuento-presupuesto"),
        subtotalPresupuesto: porId("subtotal-presupuesto"),
        totalPresupuesto: porId("total-presupuesto"),
        btnCalcularPresupuesto: porId("btn-calcular-presupuesto"),
        alertaPresupuesto: porId("alerta-presupuesto"),

        // Flujo 3: Buscar en catálogo
        formCatalogo: porId("form-catalogo"),
        buscarCatalogo: porId("buscar-catalogo"),
        categoriaCatalogo: porId("categoria-catalogo"),
        contenedorCatalogo: porId("contenedor-catalogo"),
        contadorCatalogo: porId("contador-catalogo"),
        catalogoVacio: porId("catalogo-vacio"),

        // Flujo 4: Gestionar invitados
        formInvitado: porId("form-invitado"),
        nombreInvitado: porId("nombre-invitado"),
        estadoInvitado: porId("estado-invitado"),
        btnAgregarInvitado: porId("btn-agregar-invitado"),
        listaInvitados: porId("lista-invitados"),
        metricasInvitados: porId("metricas-invitados"),
        feedbackInvitados: porId("feedback-invitados")
    };
}

/**
 * Verifica que las clases del dominio estén cargadas. Las clases declaradas en
 * scripts clásicos no se cuelgan de `window`, por eso se consulta con `typeof`.
 * @returns {string[]} Nombres de los modelos que no están disponibles.
 */
function obtenerModelosFaltantes() {
    const modelos = [
        ["Validador", typeof Validador],
        ["ItemContratado", typeof ItemContratado],
        ["Presupuesto", typeof Presupuesto],
        ["Invitado", typeof Invitado],
        ["ListaInvitados", typeof ListaInvitados],
        ["Evento", typeof Evento],
        ["Proveedor", typeof Proveedor],
        ["CatalogoProveedores", typeof CatalogoProveedores]
    ];
    return modelos.filter(([, tipo]) => tipo !== "function").map(([nombre]) => nombre);
}

/* ==========================================================================
   3. PERSISTENCIA (delegada en js/utils/storage.js)
   ========================================================================== */

/** @returns {boolean} true si el módulo de almacenamiento está cargado. */
function almacenamientoDisponible() {
    return typeof Almacenamiento !== "undefined" &&
        typeof Almacenamiento.guardar === "function" &&
        typeof Almacenamiento.cargar === "function";
}

/**
 * Lee una clave del almacenamiento sin propagar errores.
 * @param {string} clave - Clave a leer.
 * @returns {*} Valor guardado o null si no existe o no se pudo leer.
 */
function leerDelAlmacenamiento(clave) {
    if (!almacenamientoDisponible()) return null;
    try {
        return Almacenamiento.cargar(clave);
    } catch (error) {
        return null;
    }
}

/**
 * Guarda una clave en el almacenamiento. Si falla, lo informa en el DOM.
 * @param {Object} ui - Referencias del DOM.
 * @param {string} clave - Clave a guardar.
 * @param {*} valor - Valor serializable.
 * @returns {boolean} true si se guardó.
 */
function escribirEnAlmacenamiento(ui, clave, valor) {
    if (!almacenamientoDisponible()) return false;
    try {
        Almacenamiento.guardar(clave, valor);
        return true;
    } catch (error) {
        renderAvisoGlobal(ui, "No se pudieron guardar los cambios: " + error.message);
        return false;
    }
}

/** Persiste el evento actual (con su presupuesto e invitados). */
function persistirEvento(ui) {
    return escribirEnAlmacenamiento(ui, CLAVES_STORAGE.evento, estadoApp.evento.toJSON());
}

/**
 * Recupera el evento guardado o, si no hay, lo arma con los datos de ejemplo que
 * ya están en el marcado (formulario, tabla de presupuesto y tabla de invitados).
 * @param {Object} ui - Referencias del DOM.
 * @returns {Evento|null} Evento listo para usar o null si no se pudo crear.
 */
function cargarEventoInicial(ui) {
    const guardado = leerDelAlmacenamiento(CLAVES_STORAGE.evento);
    if (guardado) {
        try {
            return Evento.fromJSON(guardado);
        } catch (error) {
            renderAvisoGlobal(ui, "Los datos guardados estaban dañados; se cargaron los datos de ejemplo.");
        }
    }

    try {
        return crearEventoDesdeMarcado(ui);
    } catch (error) {
        renderAvisoGlobal(ui, "No se pudo cargar el evento de ejemplo: " + error.message);
        return null;
    }
}

/**
 * Construye el evento inicial a partir del HTML. No calcula nada: solo pasa los
 * valores del marcado a los constructores de los modelos.
 * @param {Object} ui - Referencias del DOM.
 * @returns {Evento} Evento con ítems e invitados de ejemplo.
 */
function crearEventoDesdeMarcado(ui) {
    if (!ui.formEvento) {
        throw new Error("no se encontró el formulario #form-evento.");
    }
    const datos = leerDatosEvento(ui);
    const evento = new Evento(datos.nombre, datos.tipo, datos.presupuesto);

    ui.filasPresupuesto.forEach((fila) => {
        evento.presupuesto.agregarItem(crearItemDesdeFila(fila));
    });

    if (ui.listaInvitados) {
        ui.listaInvitados.querySelectorAll("tr[data-nombre]").forEach((fila) => {
            evento.invitados.agregar(fila.dataset.nombre, fila.dataset.estado);
        });
    }
    return evento;
}

/* ==========================================================================
   4. HELPERS DE VALIDACIÓN VISUAL Y FEEDBACK (reutilizables)
   ========================================================================== */

/**
 * Marca un campo como válido o inválido con las clases de Bootstrap y escribe el
 * mensaje en su `.invalid-feedback` (id `<id-del-campo>-error`).
 * @param {HTMLElement} campo - Input o select.
 * @param {string} [mensaje] - Mensaje de error; vacío o undefined = válido.
 */
function marcarCampo(campo, mensaje) {
    const invalido = Boolean(mensaje);
    campo.classList.toggle("is-invalid", invalido);
    campo.classList.toggle("is-valid", !invalido);
    campo.setAttribute("aria-invalid", String(invalido));

    const feedback = document.getElementById(campo.id + "-error");
    if (feedback) {
        feedback.textContent = invalido ? mensaje : "";
    }
}

/** Quita el estado visual de validación de un campo. */
function limpiarCampo(campo) {
    campo.classList.remove("is-valid", "is-invalid");
    campo.removeAttribute("aria-invalid");
    delete campo.dataset.tocado;

    const feedback = document.getElementById(campo.id + "-error");
    if (feedback) {
        feedback.textContent = "";
    }
}

/**
 * Convierte la lista de mensajes de un modelo en un objeto { idCampo: mensaje }.
 * @param {string[]} mensajes - Errores devueltos por el modelo.
 * @param {Object} mapa - { idCampo: inicioDelMensaje }.
 * @returns {Object} Errores agrupados por campo.
 */
function agruparErroresPorCampo(mensajes, mapa) {
    const errores = {};
    mensajes.forEach((mensaje) => {
        const idCampo = Object.keys(mapa).find((id) => mensaje.startsWith(mapa[id]));
        if (idCampo) {
            errores[idCampo] = mensaje;
        }
    });
    return errores;
}

/** @returns {boolean} true si el objeto de errores tiene al menos una entrada. */
function hayErrores(errores) {
    return Object.keys(errores).length > 0;
}

/**
 * Registra validación en tiempo real sobre un conjunto de campos. Cualquier
 * interacción marca el campo como "tocado"; solo los campos tocados muestran
 * errores, para no marcar en rojo lo que el usuario todavía no completó.
 * @param {HTMLElement[]} campos - Campos a escuchar.
 * @param {Function} validar - Función que valida el formulario completo.
 */
function registrarValidacionEnVivo(campos, validar) {
    const marcarYValidar = (evento) => {
        evento.currentTarget.dataset.tocado = "true";
        validar();
    };

    campos.forEach((campo) => {
        const tipoEvento = campo.tagName === "SELECT" || campo.type === "date" ? "change" : "input";
        campo.addEventListener(tipoEvento, marcarYValidar);
        campo.addEventListener("blur", marcarYValidar);
    });
}

/**
 * Muestra un mensaje en un contenedor de feedback (alert de Bootstrap).
 * @param {HTMLElement|null} contenedor - Nodo donde se muestra el mensaje.
 * @param {"exito"|"error"|"aviso"} tipo - Tipo de mensaje.
 * @param {string|Node} contenido - Texto o nodo a mostrar.
 */
function renderMensaje(contenedor, tipo, contenido) {
    if (!contenedor) return;
    const clases = { exito: "alert-success", error: "alert-danger", aviso: "alert-warning" };

    contenedor.classList.remove("alert-success", "alert-danger", "alert-warning");
    contenedor.classList.add("alert", clases[tipo]);
    contenedor.replaceChildren(typeof contenido === "string"
        ? document.createTextNode(contenido)
        : contenido);
    contenedor.hidden = false;
}

/** Muestra un aviso general de la aplicación (errores de carga o de guardado). */
function renderAvisoGlobal(ui, mensaje) {
    renderMensaje(ui.avisoApp, "aviso", mensaje);
}

/**
 * Formatea un monto para mostrarlo. Es presentación: no redondea ni opera.
 * @param {number} monto - Monto devuelto por un modelo.
 * @returns {string} Monto con formato "$1.234,5".
 */
function formatearMonto(monto) {
    return "$" + FORMATEADOR_NUMERO.format(monto);
}

/**
 * Crea un elemento con clase y texto opcionales.
 * @param {string} etiqueta - Nombre de la etiqueta.
 * @param {Object} [opciones] - { clase, texto, atributos }.
 * @returns {HTMLElement} Elemento creado.
 */
function crearElemento(etiqueta, { clase, texto, atributos } = {}) {
    const elemento = document.createElement(etiqueta);
    if (clase) elemento.className = clase;
    if (texto !== undefined) elemento.textContent = texto;
    if (atributos) {
        Object.entries(atributos).forEach(([nombre, valor]) => elemento.setAttribute(nombre, valor));
    }
    return elemento;
}

/* ==========================================================================
   5. FLUJO 1: CREAR EVENTO
   ========================================================================== */

/** Registra los listeners del formulario #form-evento. */
function configurarFlujoEvento(ui) {
    if (!ui.formEvento) return;

    const campos = obtenerCamposEvento(ui);
    registrarValidacionEnVivo(campos, () => validarFormularioEvento(ui));
    ui.formEvento.addEventListener("submit", (evento) => manejarSubmitEvento(evento, ui));
}

/** @returns {HTMLElement[]} Campos del formulario de evento. */
function obtenerCamposEvento(ui) {
    return [ui.nombreEvento, ui.fechaEvento, ui.tipoEvento, ui.presupuestoEstimado, ui.ubicacion]
        .filter(Boolean);
}

/**
 * Lee los valores crudos del formulario (sin convertirlos ni validarlos).
 * @returns {{nombre: string, fecha: string, tipo: string, presupuesto: string, ubicacion: string}}
 */
function leerDatosEvento(ui) {
    return {
        nombre: ui.nombreEvento ? ui.nombreEvento.value : "",
        fecha: ui.fechaEvento ? ui.fechaEvento.value : "",
        tipo: ui.tipoEvento ? ui.tipoEvento.value : "",
        presupuesto: ui.presupuestoEstimado ? ui.presupuestoEstimado.value : "",
        ubicacion: ui.ubicacion ? ui.ubicacion.value : ""
    };
}

/**
 * Obtiene los errores del formulario delegando en el modelo. Fecha y ubicación
 * no forman parte de Evento, por eso solo se verifica que estén completas con
 * Validador.esTextoNoVacio().
 * @returns {Object} { idCampo: mensaje }.
 */
function obtenerErroresEvento(datos) {
    const errores = agruparErroresPorCampo(
        Evento.validarDatos(datos.nombre, datos.tipo, datos.presupuesto),
        MAPA_ERRORES_EVENTO
    );
    if (!Validador.esTextoNoVacio(datos.fecha)) {
        errores["fecha-evento"] = "Seleccioná la fecha del evento.";
    }
    if (!Validador.esTextoNoVacio(datos.ubicacion)) {
        errores.ubicacion = "Ingresá la ubicación del evento.";
    }
    return errores;
}

/**
 * Valida el formulario completo, pinta los campos tocados (o todos, si se fuerza)
 * y habilita o deshabilita el botón de guardar.
 * @param {Object} ui - Referencias del DOM.
 * @param {boolean} [forzar=false] - true para marcar también los campos no tocados.
 * @returns {Object} Errores encontrados.
 */
function validarFormularioEvento(ui, forzar = false) {
    const errores = obtenerErroresEvento(leerDatosEvento(ui));

    obtenerCamposEvento(ui).forEach((campo) => {
        if (forzar || campo.dataset.tocado === "true") {
            marcarCampo(campo, errores[campo.id]);
        }
    });

    if (ui.btnGuardarEvento) {
        ui.btnGuardarEvento.disabled = hayErrores(errores);
    }
    return errores;
}

/**
 * Submit del formulario de evento: valida, crea la instancia del modelo
 * (conservando presupuesto e invitados ya cargados), persiste y confirma.
 */
function manejarSubmitEvento(evento, ui) {
    evento.preventDefault();

    const errores = validarFormularioEvento(ui, true);
    if (hayErrores(errores)) {
        const primerCampoInvalido = obtenerCamposEvento(ui).find((campo) => errores[campo.id]);
        if (primerCampoInvalido) primerCampoInvalido.focus();
        renderMensaje(ui.confirmacionEvento, "error", "Revisá los campos marcados antes de guardar.");
        return;
    }

    const datos = leerDatosEvento(ui);
    try {
        // fromJSON valida de nuevo en el modelo y reconstruye presupuesto e invitados.
        estadoApp.evento = Evento.fromJSON({
            ...estadoApp.evento.toJSON(),
            nombre: datos.nombre,
            tipo: datos.tipo,
            presupuestoEstimado: datos.presupuesto
        });
    } catch (error) {
        renderMensaje(ui.confirmacionEvento, "error", error.message);
        return;
    }

    const guardado = persistirEvento(ui) &&
        escribirEnAlmacenamiento(ui, CLAVES_STORAGE.detallesEvento, {
            fecha: datos.fecha,
            ubicacion: datos.ubicacion
        });

    renderConfirmacionEvento(ui, estadoApp.evento, datos, guardado);
    obtenerCamposEvento(ui).forEach(limpiarCampo);

    // El presupuesto estimado cambió: se recalcula el Flujo 2 con el nuevo límite.
    recalcularPresupuesto(ui);
}

/** Renderiza la confirmación del evento guardado. */
function renderConfirmacionEvento(ui, evento, datos, guardado) {
    const contenido = document.createDocumentFragment();
    contenido.append(
        crearElemento("strong", { texto: guardado ? "Evento guardado. " : "Evento actualizado (sin guardar en el navegador). " }),
        document.createTextNode(
            evento.nombre + " · " + evento.tipo + " · " + datos.fecha + " · " +
            datos.ubicacion + " · Presupuesto estimado: " + formatearMonto(evento.presupuestoEstimado)
        )
    );
    renderMensaje(ui.confirmacionEvento, "exito", contenido);
}

/** Copia los datos del evento cargado a los campos del formulario. */
function sincronizarFormularioEvento(ui) {
    if (!ui.formEvento) return;
    const evento = estadoApp.evento;
    const detalles = leerDelAlmacenamiento(CLAVES_STORAGE.detallesEvento);

    ui.nombreEvento.value = evento.nombre;
    ui.tipoEvento.value = evento.tipo;
    ui.presupuestoEstimado.value = evento.presupuestoEstimado;
    if (detalles) {
        ui.fechaEvento.value = detalles.fecha || ui.fechaEvento.value;
        ui.ubicacion.value = detalles.ubicacion || ui.ubicacion.value;
    }
}

/* ==========================================================================
   6. FLUJO 2: CALCULAR PRESUPUESTO
   ========================================================================== */

/** Registra los listeners del formulario #form-presupuesto. */
function configurarFlujoPresupuesto(ui) {
    if (!ui.formPresupuesto) return;

    // Un solo listener delegado recalcula ante cualquier cambio de cantidad o descuento.
    ui.formPresupuesto.addEventListener("input", (evento) => {
        if (evento.target.matches(".input-cantidad, #descuento-presupuesto")) {
            recalcularPresupuesto(ui);
        }
    });
    ui.formPresupuesto.addEventListener("submit", (evento) => {
        evento.preventDefault();
        recalcularPresupuesto(ui);
    });

    recalcularPresupuesto(ui);
}

/**
 * Crea un ItemContratado con los datos de una fila de la tabla. El constructor
 * del modelo valida la cantidad y lanza un Error si es inválida.
 * @param {HTMLTableRowElement} fila - Fila con data-categoria, data-descripcion y data-precio-unitario.
 * @returns {ItemContratado}
 */
function crearItemDesdeFila(fila) {
    const inputCantidad = fila.querySelector(".input-cantidad");
    return new ItemContratado(
        fila.dataset.categoria,
        fila.dataset.descripcion,
        inputCantidad ? inputCantidad.value : "",
        fila.dataset.precioUnitario
    );
}

/** Copia las cantidades guardadas en el evento a los inputs de la tabla. */
function sincronizarCantidadesPresupuesto(ui) {
    const items = estadoApp.evento.presupuesto.items;
    if (items.length !== ui.filasPresupuesto.length) return;

    ui.filasPresupuesto.forEach((fila, indice) => {
        const inputCantidad = fila.querySelector(".input-cantidad");
        if (inputCantidad) inputCantidad.value = items[indice].cantidad;
    });
}

/**
 * Orquesta el cálculo del presupuesto:
 *   1. arma los ItemContratado desde la tabla (el modelo valida cada cantidad);
 *   2. reemplaza los ítems del Presupuesto del evento;
 *   3. pide al modelo el total, el total con descuento y si se supera el límite;
 *   4. renderiza el desglose y persiste.
 */
function recalcularPresupuesto(ui) {
    if (!ui.formPresupuesto) return;
    const evento = estadoApp.evento;

    // 1. Ítems desde la tabla, marcando las cantidades inválidas.
    let cantidadesValidas = true;
    const items = ui.filasPresupuesto.map((fila) => {
        const inputCantidad = fila.querySelector(".input-cantidad");
        try {
            const item = crearItemDesdeFila(fila);
            if (inputCantidad) marcarCampo(inputCantidad, "");
            return item;
        } catch (error) {
            if (inputCantidad) marcarCampo(inputCantidad, error.message);
            cantidadesValidas = false;
            return null;
        }
    });

    if (!cantidadesValidas) {
        bloquearResultadoPresupuesto(ui, "Corregí las cantidades marcadas para ver el total.");
        return;
    }

    // 2. Reemplazo de los ítems del presupuesto del evento.
    reemplazarItemsPresupuesto(evento.presupuesto, items);

    // 3. Cálculos delegados en el modelo.
    const descuento = ui.descuentoPresupuesto ? ui.descuentoPresupuesto.value : "0";
    let resultado;
    try {
        resultado = {
            subtotales: evento.presupuesto.items.map((item) => item.calcularSubtotal()),
            subtotal: evento.presupuesto.calcularTotal(),
            total: evento.presupuesto.aplicarDescuento(descuento),
            excedido: evento.superaPresupuesto(descuento),
            presupuestoEstimado: evento.presupuestoEstimado
        };
        if (ui.descuentoPresupuesto) marcarCampo(ui.descuentoPresupuesto, "");
    } catch (error) {
        if (ui.descuentoPresupuesto) marcarCampo(ui.descuentoPresupuesto, error.message);
        bloquearResultadoPresupuesto(ui, "Corregí el descuento para ver el total.");
        return;
    }

    // 4. Render y persistencia.
    renderDesglosePresupuesto(ui, resultado);
    persistirEvento(ui);
}

/**
 * Vacía el Presupuesto del evento y le agrega los ítems nuevos, usando solo los
 * métodos públicos del modelo (eliminarItem / agregarItem).
 */
function reemplazarItemsPresupuesto(presupuesto, items) {
    while (presupuesto.items.length > 0) {
        presupuesto.eliminarItem(0);
    }
    items.forEach((item) => presupuesto.agregarItem(item));
}

/** Deshabilita el botón y muestra el motivo cuando hay datos inválidos. */
function bloquearResultadoPresupuesto(ui, mensaje) {
    if (ui.btnCalcularPresupuesto) ui.btnCalcularPresupuesto.disabled = true;
    if (ui.totalPresupuesto) ui.totalPresupuesto.textContent = "—";
    renderMensaje(ui.alertaPresupuesto, "error", mensaje);
}

/** Escribe subtotales, total y alerta de límite con los valores del modelo. */
function renderDesglosePresupuesto(ui, resultado) {
    ui.filasPresupuesto.forEach((fila, indice) => {
        const celdaSubtotal = fila.querySelector("[data-subtotal]");
        if (celdaSubtotal) celdaSubtotal.textContent = formatearMonto(resultado.subtotales[indice]);
    });

    if (ui.subtotalPresupuesto) ui.subtotalPresupuesto.textContent = formatearMonto(resultado.subtotal);
    if (ui.totalPresupuesto) ui.totalPresupuesto.textContent = formatearMonto(resultado.total);
    if (ui.btnCalcularPresupuesto) ui.btnCalcularPresupuesto.disabled = false;

    const limite = formatearMonto(resultado.presupuestoEstimado);
    if (resultado.excedido) {
        renderMensaje(ui.alertaPresupuesto, "error",
            "El total supera el presupuesto estimado de " + limite + ".");
    } else {
        renderMensaje(ui.alertaPresupuesto, "exito",
            "El total está dentro del presupuesto estimado de " + limite + ".");
    }
}

/* ==========================================================================
   7. FLUJO 3: BUSCAR EN CATÁLOGO
   ========================================================================== */

/**
 * Arma el CatalogoProveedores a partir de las tarjetas del HTML y registra el
 * filtrado en tiempo real.
 */
function configurarFlujoCatalogo(ui) {
    if (!ui.contenedorCatalogo || !ui.buscarCatalogo) return;

    construirCatalogoDesdeMarcado(ui);

    // La búsqueda es en vivo: el submit (tecla Enter) no debe recargar la página.
    if (ui.formCatalogo) {
        ui.formCatalogo.addEventListener("submit", (evento) => evento.preventDefault());
    }
    ui.buscarCatalogo.addEventListener("input", () => filtrarCatalogo(ui));
    if (ui.categoriaCatalogo) {
        ui.categoriaCatalogo.addEventListener("change", () => filtrarCatalogo(ui));
    }

    filtrarCatalogo(ui);
}

/**
 * Crea un Proveedor por cada tarjeta con data-proveedor y guarda la relación
 * proveedor -> tarjeta para mostrar u ocultar cada una sin recrearla (así se
 * conservan las imágenes y los disparadores del modal y del toast).
 */
function construirCatalogoDesdeMarcado(ui) {
    estadoApp.catalogo = new CatalogoProveedores();
    estadoApp.tarjetasCatalogo.clear();

    ui.contenedorCatalogo.querySelectorAll("[data-proveedor]").forEach((tarjeta) => {
        try {
            const proveedor = estadoApp.catalogo.agregarProveedor(new Proveedor(
                tarjeta.dataset.nombre,
                tarjeta.dataset.categoria,
                tarjeta.dataset.precio,
                tarjeta.dataset.unidad
            ));
            estadoApp.tarjetasCatalogo.set(proveedor, tarjeta);
        } catch (error) {
            // Una tarjeta con datos incompletos queda fuera del filtrado pero visible.
            tarjeta.dataset.errorModelo = error.message;
        }
    });
}

/**
 * Obtiene los proveedores que coinciden con el texto y la categoría. La
 * coincidencia la resuelve el modelo (buscar() y coincideCon()).
 * @returns {Proveedor[]} Proveedores a mostrar.
 */
function obtenerResultadosCatalogo(texto, categoria) {
    let resultados = Validador.esTextoNoVacio(texto)
        ? estadoApp.catalogo.buscar(texto)
        : estadoApp.catalogo.proveedores;

    if (Validador.esTextoNoVacio(categoria)) {
        resultados = resultados.filter((proveedor) => proveedor.coincideCon(categoria));
    }
    return resultados;
}

/** Handler del filtrado: lee los controles, consulta al modelo y renderiza. */
function filtrarCatalogo(ui) {
    const texto = ui.buscarCatalogo.value;
    const categoria = ui.categoriaCatalogo ? ui.categoriaCatalogo.value : "";

    try {
        renderCatalogo(ui, obtenerResultadosCatalogo(texto, categoria), texto);
    } catch (error) {
        renderAvisoGlobal(ui, "No se pudo filtrar el catálogo: " + error.message);
    }
}

/** Muestra las tarjetas que coinciden, actualiza el contador y el estado vacío. */
function renderCatalogo(ui, resultados, texto) {
    estadoApp.tarjetasCatalogo.forEach((tarjeta, proveedor) => {
        tarjeta.hidden = !resultados.includes(proveedor);
    });

    if (ui.contadorCatalogo) {
        ui.contadorCatalogo.textContent = resultados.length === 1
            ? "1 proveedor encontrado"
            : resultados.length + " proveedores encontrados";
    }

    if (ui.catalogoVacio) {
        ui.catalogoVacio.hidden = resultados.length > 0;
        ui.catalogoVacio.textContent = Validador.esTextoNoVacio(texto)
            ? "Sin coincidencias para “" + texto.trim() + "”."
            : "No hay proveedores en esta categoría.";
    }
}

/* ==========================================================================
   8. FLUJO 4: GESTIONAR INVITADOS
   ========================================================================== */

/** Registra el alta por formulario y la delegación de eventos sobre la tabla. */
function configurarFlujoInvitados(ui) {
    if (!ui.formInvitado || !ui.listaInvitados) return;

    const campos = [ui.nombreInvitado, ui.estadoInvitado].filter(Boolean);
    registrarValidacionEnVivo(campos, () => validarFormularioInvitado(ui));
    ui.formInvitado.addEventListener("submit", (evento) => manejarSubmitInvitado(evento, ui));

    // Delegación: un único listener atiende los botones de todas las filas,
    // incluidas las que se agregan después de la carga.
    ui.listaInvitados.addEventListener("click", (evento) => manejarAccionInvitado(evento, ui));

    validarFormularioInvitado(ui);
    renderInvitados(ui);
}

/** @returns {{nombre: string, estado: string}} Valores crudos del formulario. */
function leerDatosInvitado(ui) {
    return {
        nombre: ui.nombreInvitado ? ui.nombreInvitado.value : "",
        estado: ui.estadoInvitado ? ui.estadoInvitado.value : ""
    };
}

/** Valida en vivo con Invitado.validar() y habilita o deshabilita el botón. */
function validarFormularioInvitado(ui, forzar = false) {
    const datos = leerDatosInvitado(ui);
    const errores = agruparErroresPorCampo(Invitado.validar(datos.nombre, datos.estado), MAPA_ERRORES_INVITADO);

    [ui.nombreInvitado, ui.estadoInvitado].filter(Boolean).forEach((campo) => {
        if (forzar || campo.dataset.tocado === "true") {
            marcarCampo(campo, errores[campo.id]);
        }
    });

    if (ui.btnAgregarInvitado) {
        ui.btnAgregarInvitado.disabled = hayErrores(errores);
    }
    return errores;
}

/** Alta de invitado: valida, agrega al modelo, persiste y re-renderiza. */
function manejarSubmitInvitado(evento, ui) {
    evento.preventDefault();

    const errores = validarFormularioInvitado(ui, true);
    if (hayErrores(errores)) {
        const primerCampoInvalido = [ui.nombreInvitado, ui.estadoInvitado].find((campo) => campo && errores[campo.id]);
        if (primerCampoInvalido) primerCampoInvalido.focus();
        return;
    }

    const datos = leerDatosInvitado(ui);
    let invitado;
    try {
        invitado = estadoApp.evento.invitados.agregar(datos.nombre, datos.estado);
    } catch (error) {
        renderMensaje(ui.feedbackInvitados, "error", error.message);
        return;
    }

    persistirEvento(ui);
    renderInvitados(ui);
    renderMensaje(ui.feedbackInvitados, "exito", "Se agregó a " + invitado.nombre + " como " + invitado.estado + ".");

    ui.formInvitado.reset();
    [ui.nombreInvitado, ui.estadoInvitado].filter(Boolean).forEach(limpiarCampo);
    validarFormularioInvitado(ui);
    ui.nombreInvitado.focus();
}

/**
 * Handler delegado de la tabla de invitados. Identifica la acción por
 * data-accion y al invitado por el data-nombre de la fila.
 */
function manejarAccionInvitado(evento, ui) {
    const boton = evento.target.closest("button[data-accion]");
    if (!boton || !ui.listaInvitados.contains(boton)) return;

    const fila = boton.closest("tr[data-nombre]");
    if (!fila) return;
    const nombre = fila.dataset.nombre;
    const lista = estadoApp.evento.invitados;

    try {
        switch (boton.dataset.accion) {
            case "confirmar":
                buscarInvitado(lista, nombre).cambiarEstado("Confirmado");
                renderMensaje(ui.feedbackInvitados, "exito", nombre + " confirmó su asistencia.");
                break;
            case "pendiente":
                buscarInvitado(lista, nombre).cambiarEstado("Pendiente");
                renderMensaje(ui.feedbackInvitados, "exito", nombre + " volvió a estado pendiente.");
                break;
            case "eliminar":
                if (!lista.eliminar(nombre)) {
                    throw new Error("No se encontró a " + nombre + " en la lista.");
                }
                renderMensaje(ui.feedbackInvitados, "exito", "Se eliminó a " + nombre + " de la lista.");
                break;
            default:
                return;
        }
    } catch (error) {
        renderMensaje(ui.feedbackInvitados, "error", error.message);
        return;
    }

    persistirEvento(ui);
    renderInvitados(ui);
    enfocarFilaInvitado(ui, nombre);
}

/**
 * Devuelve la instancia del invitado mostrada en la fila. El nombre del
 * data-nombre sale del propio modelo, por eso la comparación es exacta.
 * @returns {Invitado}
 */
function buscarInvitado(lista, nombre) {
    const invitado = lista.invitados.find((item) => item.nombre === nombre);
    if (!invitado) {
        throw new Error("No se encontró a " + nombre + " en la lista.");
    }
    return invitado;
}

/** Re-renderiza la tabla de invitados y las métricas de asistencia. */
function renderInvitados(ui) {
    const lista = estadoApp.evento.invitados;
    const fragmento = document.createDocumentFragment();

    lista.invitados.forEach((invitado) => fragmento.append(crearFilaInvitado(invitado)));

    if (lista.invitados.length === 0) {
        const filaVacia = crearElemento("tr");
        filaVacia.append(crearElemento("td", {
            clase: "center",
            texto: "Todavía no hay invitados cargados.",
            atributos: { colspan: "3" }
        }));
        fragmento.append(filaVacia);
    }

    ui.listaInvitados.replaceChildren(fragmento);
    renderMetricasInvitados(ui, lista);
}

/**
 * Crea la fila de un invitado con su badge de estado y sus botones de acción.
 * Se usa textContent para que ningún dato ingresado se interprete como HTML.
 * @returns {HTMLTableRowElement}
 */
function crearFilaInvitado(invitado) {
    const fila = crearElemento("tr");
    fila.dataset.nombre = invitado.nombre;

    const celdaNombre = crearElemento("th", { texto: invitado.nombre, atributos: { scope: "row" } });

    const celdaEstado = crearElemento("td", { clase: "center" });
    celdaEstado.append(crearElemento("span", {
        clase: "badge " + (invitado.esConfirmado() ? "badge-confirmado" : "badge-pendiente"),
        texto: invitado.estado
    }));

    const celdaAcciones = crearElemento("td", { clase: "center" });
    const grupo = crearElemento("div", { clase: "d-inline-flex gap-2" });
    grupo.append(
        invitado.esConfirmado()
            ? crearBotonAccion("pendiente", "Marcar pendiente", "btn-outline-secondary", invitado.nombre)
            : crearBotonAccion("confirmar", "Confirmar", "btn-outline-success", invitado.nombre),
        crearBotonAccion("eliminar", "Eliminar", "btn-outline-danger", invitado.nombre)
    );
    celdaAcciones.append(grupo);

    fila.append(celdaNombre, celdaEstado, celdaAcciones);
    return fila;
}

/** Crea un botón de acción para la delegación de eventos. */
function crearBotonAccion(accion, texto, variante, nombre) {
    return crearElemento("button", {
        clase: "btn btn-sm " + variante,
        texto,
        atributos: {
            type: "button",
            "data-accion": accion,
            "aria-label": texto + ": " + nombre
        }
    });
}

/** Muestra las métricas que devuelve ListaInvitados.contarAsistencia(). */
function renderMetricasInvitados(ui, lista) {
    if (!ui.metricasInvitados) return;
    const metricas = lista.contarAsistencia();

    ui.metricasInvitados.replaceChildren(
        crearElemento("span", { clase: "badge badge-confirmado", texto: "Confirmados: " + metricas.confirmados }),
        document.createTextNode(" "),
        crearElemento("span", { clase: "badge badge-pendiente", texto: "Pendientes: " + metricas.pendientes })
    );
}

/** Devuelve el foco a la fila modificada (o al formulario si se eliminó). */
function enfocarFilaInvitado(ui, nombre) {
    const fila = Array.from(ui.listaInvitados.querySelectorAll("tr[data-nombre]"))
        .find((item) => item.dataset.nombre === nombre);
    const destino = fila ? fila.querySelector("button[data-accion]") : ui.nombreInvitado;
    if (destino) destino.focus();
}
