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
 *   - delega la persistencia en la fachada ServicioPersistenciaEvento (RC22);
 *   - renderiza en el DOM lo que devuelven los modelos.
 *
 * Renderizado 100% dinámico (RC9, RC10, RC11): index.html solo aporta los puntos
 * de montaje vacíos (#desglose-presupuesto, #contenedor-catalogo, #lista-invitados).
 * Las filas de presupuesto, las tarjetas del catálogo y las filas de invitados se
 * construyen acá con createElement/textContent a partir de las instancias de
 * Presupuesto/ItemContratado, CatalogoProveedores/Proveedor y ListaInvitados/Invitado,
 * recuperadas de storage o reconstruidas con fromJSON() desde DATOS_SEMILLA.
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
 *   js/services/ServicioPersistenciaEvento.js -> fachada de persistencia (RC22).
 *       El controlador NO conoce el módulo de storage, ni las claves, ni el ciclo
 *       toJSON/fromJSON: solo llama a guardar(), cargar(), estaDisponible() y
 *       recibe/entrega instancias del dominio.
 *   Si el almacenamiento no está disponible, la app funciona en memoria y lo avisa.
 */

/* ==========================================================================
   1. CONFIGURACIÓN Y ESTADO DEL CONTROLADOR
   ========================================================================== */

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
 * Datos semilla del dominio, usados solo cuando no hay estado persistido.
 * Tienen exactamente la forma que producen los toJSON() de los modelos, así que
 * se convierten en instancias con Presupuesto.fromJSON(), ListaInvitados.fromJSON()
 * (vía Evento.fromJSON) y CatalogoProveedores.fromJSON(), que además los validan.
 * Reemplazan a las filas y tarjetas que antes vivían hardcodeadas en index.html
 * (observaciones RC9, RC10 y RC11 del docente).
 */
const DATOS_SEMILLA = Object.freeze({
    presupuesto: {
        items: [
            { categoria: "Catering", descripcion: "Finger food premium y barra libre", cantidad: 120, precioUnitario: 3500 },
            { categoria: "Decoración", descripcion: "Arreglos florales y ambientación luces", cantidad: 1, precioUnitario: 70000 },
            { categoria: "Sonido", descripcion: "DJ set completo y sonido de pista", cantidad: 6, precioUnitario: 8000 },
            { categoria: "Fotografía", descripcion: "Cobertura de evento y álbum digital", cantidad: 1, precioUnitario: 32000 },
            { categoria: "Transporte", descripcion: "Traslado de materiales y coordinación", cantidad: 2, precioUnitario: 5000 }
        ]
    },
    invitados: {
        invitados: [
            { nombre: "Sofía Rodríguez", estado: "Confirmado" },
            { nombre: "Mateo González", estado: "Confirmado" },
            { nombre: "Valentina Benítez", estado: "Pendiente" },
            { nombre: "Bautista Martínez", estado: "Confirmado" },
            { nombre: "Santiago Díaz", estado: "Pendiente" }
        ]
    },
    catalogo: {
        proveedores: [
            { nombre: "Gourmet Finger Food", categoria: "Catering", precio: 3500, unidad: "pax" },
            { nombre: "Flores Pilar", categoria: "Decoración", precio: 70000, unidad: "base" },
            { nombre: "DJ Lucas & Sonido", categoria: "Sonido", precio: 8000, unidad: "hora" }
        ]
    }
});

/**
 * Metadatos de presentación de cada ítem del presupuesto, por categoría.
 * ItemContratado no modela la unidad de medida ni el tipo de gasto: son textos
 * de la vista, por eso viven en el controlador y no en el modelo.
 */
const PRESENTACION_ITEMS = Object.freeze({
    "Catering": { tipo: "Proveedor", unidad: "pax" },
    "Decoración": { tipo: "Proveedor", unidad: "global" },
    "Sonido": { tipo: "Proveedor", unidad: "horas" },
    "Fotografía": { tipo: "Proveedor", unidad: "global" },
    "Transporte": { tipo: "Proveedor", unidad: "viajes" }
});

/**
 * Metadatos de presentación de cada proveedor, por nombre (imagen, textos del
 * modal). Proveedor modela nombre, categoría, precio y unidad; lo demás es vista.
 * Un proveedor sin entrada acá se renderiza igual, sin imagen ni descripción.
 */
// La ruta se resuelve relativa a este archivo (js/script.js) y no a la página que
// lo carga: así sirve igual desde index.html (raíz) y desde js/test/test-runner.html.
const RUTA_IMAGENES_CATALOGO = document.currentScript && document.currentScript.src
    ? new URL("../docs/01-mockup/actividad-obligatoria-2/", document.currentScript.src).href
    : "./docs/01-mockup/actividad-obligatoria-2/";
const PRESENTACION_PROVEEDORES = Object.freeze({
    "Gourmet Finger Food": {
        imagen: RUTA_IMAGENES_CATALOGO + "catalogo-gourmet-finger-food.jpg",
        alt: "Mesa de catering con bandejas de mini sándwiches y bocados en varios niveles",
        descripcion: "Selección premium fría y caliente para recepción. Variedad para todos los gustos.",
        capacidad: "Hasta 200 pax",
        zona: "Zona Norte GBA",
        duracion: "4 horas",
        incluye: "Finger food frío y caliente, montaje y reposición"
    },
    "Flores Pilar": {
        imagen: RUTA_IMAGENES_CATALOGO + "catalogo-flores-pilar.jpg",
        alt: "Centro de mesa con rosas y peonías rosadas sobre una mesa de salón de eventos",
        descripcion: "Centros de mesa personalizados y ramo para novias con flores naturales de estación.",
        capacidad: "1 evento por fecha",
        zona: "Pilar",
        duracion: "1 jornada de montaje",
        incluye: "Centros de mesa personalizados y ramo para novias"
    },
    "DJ Lucas & Sonido": {
        imagen: RUTA_IMAGENES_CATALOGO + "catalogo-dj-lucas-sonido.jpg",
        alt: "DJ con auriculares mezclando en una consola frente a una pista iluminada",
        descripcion: "Equipamiento de audio completo de alta fidelidad, iluminación robótica y pista de baile.",
        capacidad: "Hasta 300 personas",
        zona: "CABA y GBA",
        duracion: "6 horas",
        incluye: "DJ, sonido de alta fidelidad e iluminación robótica"
    }
});

/**
 * Estado que el controlador mantiene en memoria. No contiene reglas: solo guarda
 * las instancias de los modelos que se están mostrando.
 */
const estadoApp = {
    evento: null,            // Instancia de Evento (incluye Presupuesto y ListaInvitados)
    catalogo: null,          // Instancia de CatalogoProveedores
    tarjetasCatalogo: new Map(), // Proveedor -> nodo de la tarjeta en el DOM
    persistencia: null       // Instancia de ServicioPersistenciaEvento (fachada)
};

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

    // Independiente de los modelos de dominio: Modal de detalle y Toast son
    // componentes de UI del mockup, no de los 4 flujos (ver Issue #68).
    configurarComponentesBootstrap();

    const modelosFaltantes = obtenerModelosFaltantes();
    if (modelosFaltantes.length > 0) {
        renderAvisoGlobal(ui, "No se pudo iniciar PlanIT: faltan los modelos " +
            modelosFaltantes.join(", ") + ".");
        return;
    }

    estadoApp.persistencia = new ServicioPersistenciaEvento();
    if (!estadoApp.persistencia.estaDisponible()) {
        renderAvisoGlobal(ui, "Los cambios no se guardarán al recargar la página: " +
            "el almacenamiento no está disponible.");
    }

    const estadoInicial = cargarEstadoInicial(ui);
    if (!estadoInicial) {
        return;
    }
    estadoApp.evento = estadoInicial.evento;

    sincronizarFormularioEvento(ui, estadoInicial.detalles);
    renderFilasPresupuesto(ui);

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
        formPresupuesto: porId("form-presupuesto"),
        cuerpoPresupuesto: porId("desglose-presupuesto"), // punto de montaje de las filas
        descuentoPresupuesto: porId("descuento-presupuesto"),
        subtotalPresupuesto: porId("subtotal-presupuesto"),
        totalPresupuesto: porId("total-presupuesto"),
        btnCalcularPresupuesto: porId("btn-calcular-presupuesto"),
        alertaPresupuesto: porId("alerta-presupuesto"),

        // Resumen Financiero (barra lateral), sincronizado con el Flujo 2
        resumenPresupuestoTotal: porId("resumen-presupuesto-total"),
        resumenGastado: porId("resumen-gastado"),
        resumenLimite: porId("resumen-limite"),
        resumenAlerta: porId("resumen-alerta"),
        resumenAlertaTexto: porId("resumen-alerta-texto"),

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
        ["CatalogoProveedores", typeof CatalogoProveedores],
        ["ServicioPersistenciaEvento", typeof ServicioPersistenciaEvento]
    ];
    return modelos.filter(([, tipo]) => tipo !== "function").map(([nombre]) => nombre);
}

/* ==========================================================================
   3. PERSISTENCIA (delegada en la fachada ServicioPersistenciaEvento, RC22)
   ========================================================================== */

/**
 * Pide a la fachada que persista el evento actual (y opcionalmente sus detalles
 * de agenda). El controlador solo se ocupa de informar el resultado en el DOM.
 * @param {Object} ui - Referencias del DOM.
 * @param {{fecha: string, ubicacion: string}} [detalles] - Fecha y ubicación.
 * @returns {boolean} true si se guardó.
 */
function persistirEvento(ui, detalles) {
    const persistencia = estadoApp.persistencia;
    if (!persistencia || !persistencia.estaDisponible()) return false;
    const guardado = persistencia.guardar(estadoApp.evento, detalles);
    if (!guardado) renderAvisoGlobal(ui, "No se pudieron guardar los cambios.");
    return guardado;
}

/**
 * Pide a la fachada el estado guardado ya hidratado. Si no hay evento guardado,
 * la fachada usa como semilla el evento armado con los datos de ejemplo del
 * marcado (formulario, tabla de presupuesto y tabla de invitados).
 * @param {Object} ui - Referencias del DOM.
 * @returns {{evento: Evento, detalles: Object|null}|null} Estado listo o null si no se pudo crear.
 */
function cargarEstadoInicial(ui) {
    try {
        const estado = estadoApp.persistencia.cargar(() => crearEventoInicial(ui));
        if (estado.datosDanados) {
            renderAvisoGlobal(ui, "Los datos guardados estaban dañados; se cargaron los datos de ejemplo.");
        }
        return estado;
    } catch (error) {
        renderAvisoGlobal(ui, "No se pudo cargar el evento de ejemplo: " + error.message);
        return null;
    }
}

/**
 * Construye el evento inicial: los datos generales salen del formulario y el
 * presupuesto y los invitados salen de DATOS_SEMILLA. Evento.fromJSON()
 * reconstruye y valida Presupuesto/ItemContratado y ListaInvitados/Invitado.
 * @param {Object} ui - Referencias del DOM.
 * @returns {Evento} Evento con ítems e invitados de ejemplo.
 */
function crearEventoInicial(ui) {
    if (!ui.formEvento) {
        throw new Error("no se encontró el formulario #form-evento.");
    }
    const datos = leerDatosEvento(ui);
    return Evento.fromJSON({
        nombre: datos.nombre,
        tipo: datos.tipo,
        presupuestoEstimado: datos.presupuesto,
        presupuesto: DATOS_SEMILLA.presupuesto,
        invitados: DATOS_SEMILLA.invitados
    });
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
        // El modelo valida y actualiza conservando presupuesto e invitados.
        estadoApp.evento.actualizarDatos(datos.nombre, datos.tipo, datos.presupuesto);
    } catch (error) {
        renderMensaje(ui.confirmacionEvento, "error", error.message);
        return;
    }

    const guardado = persistirEvento(ui, { fecha: datos.fecha, ubicacion: datos.ubicacion });

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

/**
 * Copia los datos del evento cargado a los campos del formulario.
 * @param {Object} ui - Referencias del DOM.
 * @param {{fecha: string, ubicacion: string}|null} [detalles] - Detalles recuperados por la fachada.
 */
function sincronizarFormularioEvento(ui, detalles) {
    if (!ui.formEvento) return;
    const evento = estadoApp.evento;

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
    if (!ui.formPresupuesto || !ui.cuerpoPresupuesto) return;

    // Delegación: un solo listener en el <form> atiende los inputs de cantidad que
    // renderFilasPresupuesto() crea dinámicamente y el input de descuento del <tfoot>.
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
 * RC9: proyecta las instancias de ItemContratado del Presupuesto del evento en
 * el <tbody id="desglose-presupuesto">. Cada fila se crea con createElement y
 * textContent (categoría, concepto, tipo, input de cantidad, precio unitario y
 * subtotal calculado por el modelo). Si no hay ítems, muestra una fila de
 * estado vacío.
 * @param {Object} ui - Referencias del DOM.
 */
function renderFilasPresupuesto(ui) {
    if (!ui.cuerpoPresupuesto) return;
    const items = estadoApp.evento.presupuesto.items;
    const idsUsados = new Set();
    const fragmento = document.createDocumentFragment();

    items.forEach((item, indice) => {
        fragmento.append(crearFilaPresupuesto(item, indice, generarIdCantidad(item, idsUsados)));
    });

    if (items.length === 0) {
        const filaVacia = crearElemento("tr");
        filaVacia.append(crearElemento("td", {
            clase: "center",
            texto: "Todavía no hay ítems en el presupuesto.",
            atributos: { colspan: "6" }
        }));
        fragmento.append(filaVacia);
    }

    ui.cuerpoPresupuesto.replaceChildren(fragmento);
}

/**
 * Genera un id estable y único para el input de cantidad a partir de la
 * categoría (p. ej. "Decoración" -> "cantidad-decoracion"). Es presentación:
 * solo sirve para asociar el input con su mensaje de error (aria-describedby).
 * @param {ItemContratado} item - Ítem de la fila.
 * @param {Set<string>} idsUsados - Ids ya asignados en este render.
 * @returns {string} Id del input.
 */
function generarIdCantidad(item, idsUsados) {
    const slug = Validador.normalizarTexto(item.categoria).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const base = "cantidad-" + (slug || "item");
    let id = base;
    for (let sufijo = 2; idsUsados.has(id); sufijo++) {
        id = base + "-" + sufijo;
    }
    idsUsados.add(id);
    return id;
}

/**
 * Crea la fila <tr> de un ItemContratado. Los textos se asignan con textContent
 * para que ningún dato se interprete como HTML.
 * @param {ItemContratado} item - Instancia del modelo.
 * @param {number} indice - Posición del ítem en Presupuesto.items.
 * @param {string} idCantidad - Id del input de cantidad.
 * @returns {HTMLTableRowElement}
 */
function crearFilaPresupuesto(item, indice, idCantidad) {
    const presentacion = PRESENTACION_ITEMS[item.categoria] || {};
    const unidad = presentacion.unidad || "";
    const idError = idCantidad + "-error";

    const fila = crearElemento("tr", { atributos: { "data-item": "", "data-indice": String(indice) } });

    const celdaCategoria = crearElemento("th", { texto: item.categoria, atributos: { scope: "row" } });
    const celdaConcepto = crearElemento("td", { texto: item.descripcion });
    const celdaTipo = crearElemento("td", { texto: presentacion.tipo || "Proveedor" });

    const celdaCantidad = crearElemento("td", { clase: "num" });
    const inputCantidad = crearElemento("input", {
        clase: "form-control form-control-sm input-cantidad",
        atributos: {
            type: "number",
            id: idCantidad,
            min: "0",
            step: "1",
            "aria-label": "Cantidad de " + item.categoria + (unidad ? " (" + unidad + ")" : ""),
            "aria-describedby": idError
        }
    });
    inputCantidad.value = String(item.cantidad);
    celdaCantidad.append(inputCantidad);
    if (unidad) celdaCantidad.append(document.createTextNode(" " + unidad));
    celdaCantidad.append(crearElemento("span", { clase: "invalid-feedback", atributos: { id: idError } }));

    const celdaPrecio = crearElemento("td", { clase: "num", texto: formatearMonto(item.precioUnitario) });
    const celdaSubtotal = crearElemento("td", {
        clase: "num subtotal",
        texto: formatearMonto(item.calcularSubtotal()),
        atributos: { "data-subtotal": "" }
    });

    fila.append(celdaCategoria, celdaConcepto, celdaTipo, celdaCantidad, celdaPrecio, celdaSubtotal);
    return fila;
}

/**
 * Proyecta en los inputs de cantidad las cantidades del Presupuesto del evento
 * cargado (de storage o de la semilla). Si las filas del DOM no se corresponden
 * con los ítems del modelo, las regenera desde el modelo; si se corresponden,
 * solo copia cada cantidad, para que una carga nueva muestre lo persistido y no
 * el valor inicial del marcado.
 * @param {Object} ui - Referencias del DOM.
 */
function sincronizarCantidadesPresupuesto(ui) {
    if (!ui.cuerpoPresupuesto) return;
    const items = estadoApp.evento.presupuesto.items;
    const filas = obtenerFilasPresupuesto(ui);

    if (filas.length !== items.length) {
        renderFilasPresupuesto(ui);
        return;
    }

    filas.forEach((fila, indice) => {
        const inputCantidad = fila.querySelector(".input-cantidad");
        if (inputCantidad) inputCantidad.value = String(items[indice].cantidad);
    });
}

/** @returns {HTMLTableRowElement[]} Filas de ítems generadas en el punto de montaje. */
function obtenerFilasPresupuesto(ui) {
    return ui.cuerpoPresupuesto
        ? Array.from(ui.cuerpoPresupuesto.querySelectorAll("tr[data-item]"))
        : [];
}

/**
 * Crea un ItemContratado nuevo a partir del ítem del modelo y la cantidad que
 * escribió el usuario. Categoría, descripción y precio salen del modelo (no del
 * HTML); el constructor valida la cantidad y lanza un Error si es inválida.
 * @param {ItemContratado} itemBase - Ítem actual del Presupuesto.
 * @param {string} cantidad - Valor crudo del input.
 * @returns {ItemContratado}
 */
function crearItemConCantidad(itemBase, cantidad) {
    return new ItemContratado(itemBase.categoria, itemBase.descripcion, cantidad, itemBase.precioUnitario);
}

/**
 * Orquesta el cálculo del presupuesto:
 *   1. arma los ItemContratado con los datos del modelo y la cantidad de cada
 *      input generado (el modelo valida cada cantidad);
 *   2. reemplaza los ítems del Presupuesto del evento;
 *   3. pide al modelo el total, el total con descuento y si se supera el límite;
 *   4. renderiza el desglose y persiste.
 */
function recalcularPresupuesto(ui) {
    if (!ui.formPresupuesto || !ui.cuerpoPresupuesto) return;
    const evento = estadoApp.evento;
    const itemsBase = evento.presupuesto.items;

    // Si el modelo cambió de forma (p. ej. se reemplazó el evento), se re-proyecta.
    if (obtenerFilasPresupuesto(ui).length !== itemsBase.length) {
        renderFilasPresupuesto(ui);
    }

    // 1. Ítems desde el modelo + cantidades de los inputs, marcando las inválidas.
    let cantidadesValidas = true;
    const items = obtenerFilasPresupuesto(ui).map((fila, indice) => {
        const inputCantidad = fila.querySelector(".input-cantidad");
        try {
            const item = crearItemConCantidad(itemsBase[indice], inputCantidad ? inputCantidad.value : "");
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
    renderResumenFinanciero(ui, null);
    renderMensaje(ui.alertaPresupuesto, "error", mensaje);
}

/**
 * Sincroniza el Resumen Financiero de la barra lateral con el modelo. El
 * presupuesto total y el límite salen de evento.presupuestoEstimado y el gastado
 * es el total con descuento de Presupuesto.aplicarDescuento() (el mismo que
 * #total-presupuesto). Con datos inválidos el gastado se muestra como "—".
 * La alerta lateral (#resumen-alerta) usa el booleano `excedido` que devuelve
 * Evento.superaPresupuesto(); con datos inválidos se oculta.
 * El saldo y el porcentaje utilizado (#resumen-saldo, #resumen-porcentaje,
 * #resumen-progreso) quedan en "—" / ocultos: requieren una resta y una
 * división que, por la Regla 1, deben venir de un método del modelo que todavía
 * no existe (p. ej. Presupuesto.calcularSaldo(limite)).
 * @param {Object} ui - Referencias del DOM.
 * @param {Object|null} resultado - Resultado del cálculo, o null si es inválido.
 */
function renderResumenFinanciero(ui, resultado) {
    const limite = formatearMonto(estadoApp.evento.presupuestoEstimado);
    if (ui.resumenPresupuestoTotal) ui.resumenPresupuestoTotal.textContent = limite;
    if (ui.resumenLimite) ui.resumenLimite.textContent = "Límite: " + limite;
    if (ui.resumenGastado) ui.resumenGastado.textContent = resultado ? formatearMonto(resultado.total) : "—";

    if (ui.resumenAlerta && ui.resumenAlertaTexto) {
        ui.resumenAlerta.hidden = !resultado;
        ui.resumenAlertaTexto.textContent = !resultado ? "" : resultado.excedido
            ? "Atención: el gasto estimado supera tu límite de presupuesto de " + limite + "."
            : "El gasto estimado está dentro de tu límite de presupuesto de " + limite + ".";
    }
}

/**
 * Escribe subtotales, total y alerta de límite con los valores del modelo.
 * Actualiza las celdas de las filas ya generadas (no las recrea) para no
 * perder el foco del input mientras el usuario escribe.
 */
function renderDesglosePresupuesto(ui, resultado) {
    obtenerFilasPresupuesto(ui).forEach((fila, indice) => {
        const celdaSubtotal = fila.querySelector("[data-subtotal]");
        if (celdaSubtotal) celdaSubtotal.textContent = formatearMonto(resultado.subtotales[indice]);
    });

    if (ui.subtotalPresupuesto) ui.subtotalPresupuesto.textContent = formatearMonto(resultado.subtotal);
    if (ui.totalPresupuesto) ui.totalPresupuesto.textContent = formatearMonto(resultado.total);
    if (ui.btnCalcularPresupuesto) ui.btnCalcularPresupuesto.disabled = false;
    renderResumenFinanciero(ui, resultado);

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
 * Arma el CatalogoProveedores desde el modelo (DATOS_SEMILLA), genera las
 * opciones del filtro y registra el filtrado en tiempo real.
 */
function configurarFlujoCatalogo(ui) {
    if (!ui.contenedorCatalogo || !ui.buscarCatalogo) return;

    construirCatalogo(ui);

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
 * RC10: crea el CatalogoProveedores con CatalogoProveedores.fromJSON(), que
 * reconstruye y valida cada Proveedor. El HTML ya no aporta tarjetas: el
 * catálogo proviene del modelo y las tarjetas se generan en renderCatalogo().
 * @param {Object} ui - Referencias del DOM.
 */
function construirCatalogo(ui) {
    estadoApp.tarjetasCatalogo.clear();
    try {
        estadoApp.catalogo = CatalogoProveedores.fromJSON(DATOS_SEMILLA.catalogo);
    } catch (error) {
        estadoApp.catalogo = new CatalogoProveedores();
        renderAvisoGlobal(ui, "No se pudo cargar el catálogo de proveedores: " + error.message);
    }
    renderOpcionesCategoria(ui);
}

/**
 * Genera las opciones del <select> de categoría a partir de las categorías de
 * los Proveedor del catálogo (sin repetir, sin distinguir mayúsculas ni tildes).
 * Conserva la opción "Todas" (value="") del HTML y la selección vigente.
 * @param {Object} ui - Referencias del DOM.
 */
function renderOpcionesCategoria(ui) {
    if (!ui.categoriaCatalogo) return;
    const seleccionActual = ui.categoriaCatalogo.value;

    const categorias = [];
    estadoApp.catalogo.proveedores.forEach((proveedor) => {
        const yaIncluida = Validador.buscarOpcion(categorias, proveedor.categoria) !== undefined;
        if (!yaIncluida) categorias.push(proveedor.categoria);
    });

    const opcionTodas = ui.categoriaCatalogo.querySelector('option[value=""]') ||
        crearElemento("option", { texto: "Todas", atributos: { value: "" } });
    const opciones = categorias.map((categoria) =>
        crearElemento("option", { texto: categoria, atributos: { value: categoria } }));

    ui.categoriaCatalogo.replaceChildren(opcionTodas, ...opciones);
    ui.categoriaCatalogo.value = categorias.includes(seleccionActual) ? seleccionActual : "";
}

/**
 * Obtiene los proveedores que coinciden con el texto y la categoría. El texto
 * libre usa buscar()/coincideCon() (nombre o categoría); el selector de
 * categoría compara de forma exacta contra proveedor.categoria, sin
 * mayúsculas ni tildes. Una categoría vacía o "todas" no filtra.
 * @returns {Proveedor[]} Proveedores a mostrar.
 */
function obtenerResultadosCatalogo(texto, categoria) {
    let resultados = Validador.esTextoNoVacio(texto)
        ? estadoApp.catalogo.buscar(texto)
        : estadoApp.catalogo.proveedores;

    const categoriaBuscada = Validador.esTextoNoVacio(categoria) ? Validador.normalizarTexto(categoria) : "";
    if (categoriaBuscada !== "" && categoriaBuscada !== "todas") {
        resultados = resultados.filter(
            (proveedor) => Validador.normalizarTexto(proveedor.categoria) === categoriaBuscada
        );
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

/**
 * RC10: proyecta en #contenedor-catalogo las tarjetas de los Proveedor que
 * devolvió el modelo, en el mismo orden, y actualiza los estados derivados
 * (contador de resultados y mensaje de catálogo vacío).
 */
function renderCatalogo(ui, resultados, texto) {
    ui.contenedorCatalogo.replaceChildren(...resultados.map(obtenerTarjetaProveedor));

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

/**
 * Devuelve la tarjeta de un proveedor, creándola la primera vez. La caché evita
 * reconstruir imágenes y botones en cada tecla del buscador.
 * @param {Proveedor} proveedor - Instancia del modelo.
 * @returns {HTMLElement} Columna con la tarjeta.
 */
function obtenerTarjetaProveedor(proveedor) {
    if (!estadoApp.tarjetasCatalogo.has(proveedor)) {
        estadoApp.tarjetasCatalogo.set(proveedor, crearTarjetaProveedor(proveedor));
    }
    return estadoApp.tarjetasCatalogo.get(proveedor);
}

/**
 * Crea la tarjeta completa de un Proveedor: imagen, insignia de categoría,
 * nombre, descripción, metadatos, precio por unidad y botones "Ver detalle"
 * (abre el Modal vía data-bs-toggle) y "Sumar al Evento" (Toast delegado).
 * Todo texto se asigna con textContent/setAttribute, nunca con innerHTML.
 * @param {Proveedor} proveedor - Instancia del modelo.
 * @returns {HTMLElement} Columna de la grilla con la tarjeta.
 */
function crearTarjetaProveedor(proveedor) {
    const info = PRESENTACION_PROVEEDORES[proveedor.nombre] || {};
    const precio = formatearMonto(proveedor.precio) + " / " + proveedor.unidad;
    const detalles = [proveedor.categoria, info.capacidad, info.zona].filter(Boolean).join(" · ");

    const columna = crearElemento("div", {
        clase: "col-12 col-md-4",
        atributos: {
            "data-proveedor": "",
            "data-nombre": proveedor.nombre,
            "data-categoria": proveedor.categoria
        }
    });
    const tarjeta = crearElemento("article", { clase: "card" });

    if (info.imagen) {
        tarjeta.append(crearElemento("img", {
            atributos: { src: info.imagen, alt: info.alt || "", width: "1344", height: "655", loading: "lazy" }
        }));
    }

    const cuerpo = crearElemento("div", { clase: "card-body" });
    cuerpo.append(
        crearElemento("span", { clase: "badge text-bg-light border align-self-start mb-2", texto: proveedor.categoria }),
        crearElemento("h3", { texto: proveedor.nombre })
    );
    if (info.descripcion) cuerpo.append(crearElemento("p", { texto: info.descripcion }));
    cuerpo.append(
        crearElemento("p", { clase: "card-meta", texto: detalles }),
        crearElemento("p", { clase: "card-price", texto: precio })
    );

    const botonSumarEvento = crearElemento("button", {
        clase: "btn btn-primary btn-sumar-evento",
        texto: "Sumar al Evento",
        atributos: {
            type: "button",
            "aria-label": "Sumar " + proveedor.nombre + " al evento",
            "data-service-title": proveedor.nombre,
            "data-service-price": precio
        }
    });
    vincularBotonSumarEvento(botonSumarEvento);

    const acciones = crearElemento("div", { clase: "card-actions d-grid gap-2 mt-2" });
    acciones.append(
        crearElemento("button", {
            clase: "btn btn-outline-primary btn-ver-detalle",
            texto: "Ver detalle",
            atributos: {
                type: "button",
                "aria-label": "Ver detalle de " + proveedor.nombre,
                "data-bs-toggle": "modal",
                "data-bs-target": "#modalDetalleServicio",
                "data-service-title": proveedor.nombre,
                "data-service-image": info.imagen || "",
                "data-service-alt": info.alt || "",
                "data-service-description": info.descripcion || "",
                "data-service-details": detalles,
                "data-service-capacidad": info.capacidad || "",
                "data-service-duracion": info.duracion || "",
                "data-service-incluye": info.incluye || "",
                "data-service-price": precio
            }
        }),
        botonSumarEvento
    );

    cuerpo.append(acciones);
    tarjeta.append(cuerpo);
    columna.append(tarjeta);
    return columna;
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
 * data-accion y al invitado por el data-indice de la fila, de modo que
 * dos invitados con el mismo nombre se distinguen sin ambigüedad.
 */
function manejarAccionInvitado(evento, ui) {
    const boton = evento.target.closest("button[data-accion]");
    if (!boton || !ui.listaInvitados.contains(boton)) return;

    const fila = boton.closest("tr[data-indice]");
    if (!fila) return;
    const indice = parseInt(fila.dataset.indice, 10);
    const lista = estadoApp.evento.invitados;
    const accion = boton.dataset.accion;
    let nombre;

    try {
        const invitado = buscarInvitado(lista, indice);
        nombre = invitado.nombre;
        switch (accion) {
            case "confirmar":
                invitado.cambiarEstado("Confirmado");
                renderMensaje(ui.feedbackInvitados, "exito", nombre + " confirmó su asistencia.");
                break;
            case "pendiente":
                invitado.cambiarEstado("Pendiente");
                renderMensaje(ui.feedbackInvitados, "exito", nombre + " volvió a estado pendiente.");
                break;
            case "eliminar":
                eliminarInvitadoPorIndice(lista, indice);
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
    enfocarFilaInvitado(ui, accion === "eliminar" ? null : indice);
}

/**
 * Devuelve la instancia del invitado mostrada en la fila según su posición
 * en la lista (el data-indice sale del propio render del modelo).
 * @returns {Invitado}
 */
function buscarInvitado(lista, indice) {
    const invitado = Number.isInteger(indice) ? lista.invitados[indice] : undefined;
    if (!invitado) {
        throw new Error("No se encontró al invitado seleccionado en la lista.");
    }
    return invitado;
}

/**
 * Elimina exactamente al invitado de la posición indicada. ListaInvitados solo
 * expone eliminar(nombre), que borra la primera coincidencia; por eso se vacía
 * la lista y se reconstruye en el mismo orden omitiendo esa posición.
 */
function eliminarInvitadoPorIndice(lista, indice) {
    const actuales = lista.invitados;
    actuales.forEach((invitado) => lista.eliminar(invitado.nombre));
    actuales.forEach((invitado, posicion) => {
        if (posicion !== indice) lista.agregar(invitado.nombre, invitado.estado);
    });
}

/**
 * RC11: construye la tabla de invitados exclusivamente desde ListaInvitados
 * (recuperada de storage o creada con DATOS_SEMILLA en crearEventoInicial()).
 * El <tbody id="lista-invitados"> llega vacío del HTML; cada fila trae nombre,
 * badge de estado, botón para alternar estado y botón para eliminar. Si la lista
 * está vacía, se muestra una fila de estado vacío. También actualiza las métricas.
 */
function renderInvitados(ui) {
    const lista = estadoApp.evento.invitados;
    const fragmento = document.createDocumentFragment();

    lista.invitados.forEach((invitado, indice) => fragmento.append(crearFilaInvitado(invitado, indice)));

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
function crearFilaInvitado(invitado, indice) {
    const fila = crearElemento("tr");
    fila.dataset.nombre = invitado.nombre;
    fila.dataset.indice = String(indice);

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
function enfocarFilaInvitado(ui, indice) {
    const fila = indice === null ? null : ui.listaInvitados.querySelector('tr[data-indice="' + indice + '"]');
    const destino = fila ? fila.querySelector("button[data-accion]") : ui.nombreInvitado;
    if (destino) destino.focus();
}

/* ==========================================================================
   9. COMPONENTES BOOTSTRAP: MODAL DE DETALLE Y TOAST DE CONFIRMACIÓN
   (migrado desde js/componentes-bootstrap.js, deuda técnica Issue #68:
   js/script.js pasa a ser el controlador único de eventos y DOM de la app)
   ========================================================================== */

/** Registra el Modal de detalle de servicio y el Toast de confirmación del catálogo. */
function configurarComponentesBootstrap() {
    configurarModalDetalleServicio();
    configurarToastConfirmacion();
}

/** Completa el Modal con los datos del `data-service-*` de la tarjeta que lo abrió. */
function configurarModalDetalleServicio() {
    const modalDetalle = document.getElementById("modalDetalleServicio");
    if (!modalDetalle) return;

    const modalSumarEvento = modalDetalle.querySelector(".btn-sumar-evento");

    modalDetalle.addEventListener("show.bs.modal", (evento) => {
        const trigger = evento.relatedTarget;
        if (!trigger) return;

        document.getElementById("modalDetalleServicioTitulo").textContent = trigger.dataset.serviceTitle || "";
        document.getElementById("modalDetalleServicioImagen").src = trigger.dataset.serviceImage || "";
        document.getElementById("modalDetalleServicioImagen").alt = trigger.dataset.serviceAlt || "";
        document.getElementById("modalDetalleServicioDescripcion").textContent = trigger.dataset.serviceDescription || "";
        document.getElementById("modalDetalleServicioCapacidad").textContent = trigger.dataset.serviceCapacidad || "";
        document.getElementById("modalDetalleServicioDuracion").textContent = trigger.dataset.serviceDuracion || "";
        document.getElementById("modalDetalleServicioIncluye").textContent = trigger.dataset.serviceIncluye || "";
        document.getElementById("modalDetalleServicioPrecio").textContent = trigger.dataset.servicePrice || "";

        if (modalSumarEvento) {
            modalSumarEvento.dataset.serviceTitle = trigger.dataset.serviceTitle || "";
            modalSumarEvento.dataset.servicePrice = trigger.dataset.servicePrice || "";
        }
    });
}

/**
 * Muestra el Toast de confirmación al hacer clic en cualquier botón "Sumar al Evento".
 * Los listeners se registran aunque el JS de Bootstrap no esté cargado: la
 * disponibilidad de Bootstrap se consulta en cada clic (ver mostrarToast).
 */
function configurarToastConfirmacion() {
    document.querySelectorAll(".btn-sumar-evento").forEach(vincularBotonSumarEvento);
}

/** Botones que ya tienen su listener de "Sumar al Evento" (evita registrarlo dos veces). */
const botonesSumarEventoVinculados = new WeakSet();

/**
 * Registra el listener del Toast directamente en el botón. No se delega en `document`
 * para que funcione aunque un ancestro corte la propagación del clic. Las tarjetas
 * del catálogo, que se crean dinámicamente, se vinculan al renderizarse.
 * @param {HTMLElement} boton - Botón `.btn-sumar-evento`.
 */
function vincularBotonSumarEvento(boton) {
    if (!boton || botonesSumarEventoVinculados.has(boton)) return;
    botonesSumarEventoVinculados.add(boton);

    document.querySelectorAll(".btn-sumar-evento").forEach((boton) => {
        boton.addEventListener("click", () => {
            const titulo = boton.dataset.serviceTitle || "Servicio";
            const precio = boton.dataset.servicePrice || "";

            toastConfirmacionElement.dataset.serviceTitle = titulo;
            toastConfirmacionElement.dataset.servicePrice = precio;

            if (toastConfirmacionServicio) {
                toastConfirmacionServicio.textContent = precio ? titulo + " · " + precio : titulo;
            }
            if (toastConfirmacionMensaje) {
                toastConfirmacionMensaje.textContent = "Experiencia agregada a tu evento";
            }

        if (toastConfirmacionServicio) toastConfirmacionServicio.textContent = titulo + " · " + precio;
        if (toastConfirmacionMensaje) toastConfirmacionMensaje.textContent = "Experiencia agregada a tu evento";

        mostrarToast(toastConfirmacionElement);
    });
}

/**
 * Muestra un Toast con Bootstrap si su JS está cargado. Si no lo está (CDN caído
 * o bloqueado), degrada a la clase `show` del CSS de Bootstrap y lo oculta solo
 * después del mismo `data-bs-delay`, para que el usuario reciba el feedback igual
 * y sin errores de consola. El contenedor ya es role="status" + aria-live, así
 * que el mensaje se anuncia en ambos casos.
 * @param {HTMLElement} elemento - Nodo `.toast`.
 */
function mostrarToast(elemento) {
    if (!elemento) return;

    if (typeof bootstrap !== "undefined" && bootstrap && bootstrap.Toast) {
        bootstrap.Toast.getOrCreateInstance(elemento).show();
        return;
    }

    clearTimeout(Number(elemento.dataset.temporizadorToast));
    elemento.classList.remove("hide");
    elemento.classList.add("show");
    const demora = parseInt(elemento.dataset.bsDelay, 10) || 5000;
    elemento.dataset.temporizadorToast = String(setTimeout(() => {
        elemento.classList.remove("show");
    }, demora));
}
