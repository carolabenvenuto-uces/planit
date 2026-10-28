/*
 * PlanIT - Lógica de negocio (Actividad Obligatoria N.° 3)
 *
 * Implementa los 4 flujos modelados en docs/05-diagramas/01-diagrama-de-actividades/:
 *   1. Crear evento
 *   2. Calcular presupuesto
 *   3. Buscar en catálogo
 *   4. Gestionar invitados
 *
 * El archivo se organiza en tres capas (ver spec-dev-javascript.md):
 *   - Datos: constantes y colecciones tomadas del mockup aprobado.
 *   - Lógica de negocio: funciones puras, sin prompt(), alert() ni console.log().
 *     Son las funciones que se testean con Jasmine.
 *   - Interacción con el usuario: un flujo por opción del menú y el menú principal.
 *
 * Esta entrega no manipula el DOM ni usa eventos.
 */

/* ==========================================================================
   1. DATOS
   ========================================================================== */

/** Tipos de evento permitidos al crear un evento. */
const TIPOS_EVENTO = ["cumpleaños", "boda", "salida casual"];

/** Estados de asistencia permitidos para un invitado. */
const ESTADOS_INVITADO = ["Confirmado", "Pendiente"];

/** Presupuesto estimado del mockup, usado si todavía no se creó ningún evento. */
const PRESUPUESTO_EJEMPLO = 700000;

/** Ítems contratados de la sección Presupuesto del mockup (total: $580.000). */
const itemsContratados = [
    { categoria: "Catering", descripcion: "Finger food premium y barra libre", cantidad: 120, precioUnitario: 3500 },
    { categoria: "Decoración", descripcion: "Arreglos florales y ambientación luces", cantidad: 1, precioUnitario: 70000 },
    { categoria: "Sonido", descripcion: "DJ set completo y sonido de pista", cantidad: 6, precioUnitario: 8000 },
    { categoria: "Fotografía", descripcion: "Cobertura de evento y álbum digital", cantidad: 1, precioUnitario: 32000 },
    { categoria: "Transporte", descripcion: "Traslado de materiales y coordinación", cantidad: 2, precioUnitario: 5000 }
];

/**
 * Crea un proveedor del catálogo.
 * @constructor
 * @param {string} nombre - Nombre comercial del proveedor.
 * @param {string} categoria - Categoría del servicio (Catering, Decoración, Sonido...).
 * @param {number} precio - Precio del servicio.
 * @param {string} unidad - Unidad del precio (pax, base, hora).
 */
function Proveedor(nombre, categoria, precio, unidad) {
    this.nombre = nombre;
    this.categoria = categoria;
    this.precio = precio;
    this.unidad = unidad;
}

/**
 * Indica si el proveedor coincide con un criterio de búsqueda por nombre o categoría,
 * sin distinguir mayúsculas, minúsculas ni tildes.
 * @param {string} criterio - Texto buscado.
 * @returns {boolean} true si el nombre o la categoría contienen el criterio.
 */
Proveedor.prototype.coincideCon = function (criterio) {
    if (typeof criterio !== "string" || criterio.trim() === "") {
        return false;
    }
    const busqueda = normalizarTexto(criterio);
    return normalizarTexto(this.nombre).includes(busqueda) ||
        normalizarTexto(this.categoria).includes(busqueda);
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
   2. LÓGICA DE NEGOCIO (funciones puras)
   ========================================================================== */

/* ---------- Utilidades ---------- */

/**
 * Normaliza un texto para compararlo: minúsculas, sin espacios en los extremos y sin tildes.
 * @param {string} texto - Texto a normalizar.
 * @returns {string} Texto normalizado.
 */
function normalizarTexto(texto) {
    return String(texto).trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/**
 * Convierte el valor ingresado por el usuario a número.
 * Acepta números y textos numéricos; cualquier otro valor da NaN.
 * @param {number|string} valor - Valor a convertir (por ejemplo, el texto de prompt()).
 * @returns {number} El número, o NaN si el valor no es numérico.
 */
function convertirANumero(valor) {
    if (typeof valor === "number") {
        return valor;
    }
    if (typeof valor === "string" && valor.trim() !== "") {
        return Number(valor.trim());
    }
    return NaN;
}

/**
 * Indica si un valor es un texto con contenido (no vacío ni solo espacios).
 * @param {*} valor - Valor a evaluar.
 * @returns {boolean} true si es un texto con contenido.
 */
function esTextoNoVacio(valor) {
    return typeof valor === "string" && valor.trim() !== "";
}

/**
 * Da formato de moneda argentina a un monto.
 * @param {number} monto - Monto a formatear.
 * @returns {string} Monto con formato, por ejemplo "$580.000".
 */
function formatearMoneda(monto) {
    return "$" + monto.toLocaleString("es-AR");
}

/* ---------- Flujo 1: Crear evento ---------- */

/**
 * Busca el tipo de evento permitido que coincide con el texto ingresado.
 * @param {string} tipo - Tipo ingresado por el usuario.
 * @returns {string|null} El tipo tal como figura en TIPOS_EVENTO, o null si no es válido.
 */
function obtenerTipoEvento(tipo) {
    if (!esTextoNoVacio(tipo)) {
        return null;
    }
    for (let i = 0; i < TIPOS_EVENTO.length; i++) {
        if (normalizarTexto(TIPOS_EVENTO[i]) === normalizarTexto(tipo)) {
            return TIPOS_EVENTO[i];
        }
    }
    return null;
}

/**
 * Lista los errores de validación de los datos de un evento.
 * @param {string} nombre - Nombre del evento.
 * @param {string} tipo - Tipo de evento.
 * @param {number|string} presupuesto - Presupuesto estimado.
 * @returns {string[]} Mensajes de error; un array vacío si los datos son válidos.
 */
function obtenerErroresEvento(nombre, tipo, presupuesto) {
    const errores = [];
    if (!esTextoNoVacio(nombre)) {
        errores.push("El nombre del evento no puede estar vacío.");
    }
    if (obtenerTipoEvento(tipo) === null) {
        errores.push("El tipo debe ser: " + TIPOS_EVENTO.join(", ") + ".");
    }
    const monto = convertirANumero(presupuesto);
    if (!Number.isFinite(monto) || monto <= 0) {
        errores.push("El presupuesto debe ser un número mayor a 0.");
    }
    return errores;
}

/**
 * Valida los datos de un evento: nombre no vacío, tipo permitido y presupuesto mayor a 0.
 * Acepta el texto crudo que devuelve prompt().
 * @param {string} nombre - Nombre del evento.
 * @param {string} tipo - Tipo de evento.
 * @param {number|string} presupuesto - Presupuesto estimado.
 * @returns {boolean} true si los datos son válidos.
 */
function validarDatosEvento(nombre, tipo, presupuesto) {
    return obtenerErroresEvento(nombre, tipo, presupuesto).length === 0;
}

/**
 * Crea el objeto evento a partir de datos ya validados con validarDatosEvento().
 * @param {string} nombre - Nombre del evento.
 * @param {string} tipo - Tipo de evento.
 * @param {number|string} presupuesto - Presupuesto estimado.
 * @returns {{nombre: string, tipo: string, presupuesto: number}} El evento creado.
 */
function crearEvento(nombre, tipo, presupuesto) {
    return {
        nombre: nombre.trim(),
        tipo: obtenerTipoEvento(tipo),
        presupuesto: convertirANumero(presupuesto)
    };
}

/**
 * Agrega un evento a la colección sin modificar el array original.
 * @param {Object[]} listaEventos - Colección de eventos.
 * @param {Object} evento - Evento a agregar.
 * @returns {Object[]} Un array nuevo con el evento agregado al final.
 */
function agregarEvento(listaEventos, evento) {
    return listaEventos.concat([evento]);
}

/**
 * Indica si la respuesta del usuario confirma que quiere reintentar.
 * @param {string|null} respuesta - Respuesta ingresada en prompt().
 * @returns {boolean} true si la respuesta es "s" o "si".
 */
function quiereReintentar(respuesta) {
    if (!esTextoNoVacio(respuesta)) {
        return false;
    }
    const texto = normalizarTexto(respuesta);
    return texto === "s" || texto === "si";
}

/**
 * Describe un valor ingresado con prompt() para mostrarlo en un mensaje de error.
 * @param {string|null} valor - Valor ingresado.
 * @returns {string} "(cancelado)", "(vacío)" o el valor entre comillas.
 */
function describirIngreso(valor) {
    if (valor === null) {
        return "(cancelado)";
    }
    if (valor.trim() === "") {
        return "(vacío)";
    }
    return "\"" + valor + "\"";
}

/* ---------- Flujo 2: Calcular presupuesto ---------- */

/**
 * Calcula el subtotal de un ítem contratado.
 * @param {{cantidad: number, precioUnitario: number}} item - Ítem contratado.
 * @returns {number} Cantidad por precio unitario.
 */
function calcularSubtotalItem(item) {
    return item.cantidad * item.precioUnitario;
}

/**
 * Recorre los ítems contratados y suma sus subtotales.
 * @param {Object[]} items - Ítems contratados.
 * @returns {number} Total de los ítems; 0 si la colección está vacía.
 */
function calcularTotalItems(items) {
    let total = 0;
    let indice = 0;
    while (indice < items.length) {
        total += calcularSubtotalItem(items[indice]);
        indice++;
    }
    return total;
}

/**
 * Aplica un porcentaje de descuento a un total.
 * @param {number} total - Total sin descuento.
 * @param {number|string} porcentaje - Descuento entre 0 y 100 (acepta el texto de prompt()).
 * @returns {number} Total con el descuento aplicado, redondeado a 2 decimales.
 * @throws {Error} Si el porcentaje no es numérico o está fuera del rango 0 a 100.
 */
function aplicarDescuento(total, porcentaje) {
    const descuento = convertirANumero(porcentaje);
    if (!Number.isFinite(descuento) || descuento < 0 || descuento > 100) {
        throw new Error("El porcentaje de descuento debe ser un número entre 0 y 100.");
    }
    return Math.round(total * (100 - descuento)) / 100;
}

/**
 * Indica si un total supera el presupuesto estimado del evento.
 * Un total igual al presupuesto no se considera excedido.
 * @param {number} total - Total a comparar.
 * @param {number} presupuestoEstimado - Presupuesto estimado del evento.
 * @returns {boolean} true si el total es mayor al presupuesto estimado.
 */
function superaPresupuesto(total, presupuestoEstimado) {
    return total > presupuestoEstimado;
}

/**
 * Obtiene el presupuesto estimado del último evento creado.
 * @param {Object[]} listaEventos - Colección de eventos.
 * @returns {number} El presupuesto del último evento, o PRESUPUESTO_EJEMPLO si no hay eventos.
 */
function obtenerPresupuestoEstimado(listaEventos) {
    if (listaEventos.length === 0) {
        return PRESUPUESTO_EJEMPLO;
    }
    return listaEventos[listaEventos.length - 1].presupuesto;
}

/* ---------- Flujo 3: Buscar en catálogo ---------- */

/**
 * Recorre el catálogo y filtra los proveedores que coinciden por nombre o categoría.
 * No modifica el catálogo original.
 * @param {Proveedor[]} catalogo - Catálogo de proveedores.
 * @param {string} criterio - Texto o categoría buscada.
 * @returns {Proveedor[]} Proveedores que coinciden; un array vacío si no hay coincidencias.
 * @throws {Error} Si el criterio de búsqueda está vacío.
 */
function buscarEnCatalogo(catalogo, criterio) {
    if (!esTextoNoVacio(criterio)) {
        throw new Error("El criterio de búsqueda no puede estar vacío.");
    }
    const resultados = [];
    let indice = 0;
    while (indice < catalogo.length) {
        if (catalogo[indice].coincideCon(criterio)) {
            resultados.push(catalogo[indice]);
        }
        indice++;
    }
    return resultados;
}

/**
 * Arma el listado de proveedores para mostrarlo al usuario.
 * @param {Proveedor[]} proveedores - Proveedores a listar.
 * @returns {string} Una línea por proveedor con nombre, categoría y precio.
 */
function formatearListaProveedores(proveedores) {
    const lineas = [];
    for (let i = 0; i < proveedores.length; i++) {
        const proveedor = proveedores[i];
        lineas.push("- " + proveedor.nombre + " (" + proveedor.categoria + "): " +
            formatearMoneda(proveedor.precio) + " / " + proveedor.unidad);
    }
    return lineas.join("\n");
}

/* ---------- Flujo 4: Gestionar invitados ---------- */

/**
 * Busca el estado de asistencia permitido que coincide con el texto ingresado.
 * @param {string} estado - Estado ingresado por el usuario.
 * @returns {string|null} "Confirmado" o "Pendiente", o null si no es válido.
 */
function obtenerEstadoInvitado(estado) {
    if (!esTextoNoVacio(estado)) {
        return null;
    }
    for (let i = 0; i < ESTADOS_INVITADO.length; i++) {
        if (normalizarTexto(ESTADOS_INVITADO[i]) === normalizarTexto(estado)) {
            return ESTADOS_INVITADO[i];
        }
    }
    return null;
}

/**
 * Valida los datos de un invitado: nombre no vacío y estado "Confirmado" o "Pendiente"
 * (sin distinguir mayúsculas de minúsculas).
 * @param {string} nombre - Nombre del invitado.
 * @param {string} estado - Estado de asistencia.
 * @returns {boolean} true si los datos son válidos.
 */
function validarInvitado(nombre, estado) {
    return esTextoNoVacio(nombre) && obtenerEstadoInvitado(estado) !== null;
}

/**
 * Agrega un invitado a la lista sin modificar el array original.
 * @param {Object[]} listaInvitados - Lista de invitados.
 * @param {string} nombre - Nombre del invitado.
 * @param {string} estado - Estado de asistencia.
 * @returns {{nombre: string, estado: string}[]} Un array nuevo con el invitado agregado.
 * @throws {Error} Si el nombre está vacío o el estado no es válido.
 */
function agregarInvitado(listaInvitados, nombre, estado) {
    if (!validarInvitado(nombre, estado)) {
        throw new Error("El invitado necesita un nombre y un estado: " + ESTADOS_INVITADO.join(" o ") + ".");
    }
    return listaInvitados.concat([{ nombre: nombre.trim(), estado: obtenerEstadoInvitado(estado) }]);
}

/**
 * Recorre la lista de invitados y cuenta confirmados y pendientes.
 * @param {{estado: string}[]} listaInvitados - Lista de invitados.
 * @returns {{confirmados: number, pendientes: number}} Métricas de asistencia.
 */
function contarAsistencia(listaInvitados) {
    const metricas = { confirmados: 0, pendientes: 0 };
    let indice = 0;
    while (indice < listaInvitados.length) {
        if (listaInvitados[indice].estado === "Confirmado") {
            metricas.confirmados++;
        } else {
            metricas.pendientes++;
        }
        indice++;
    }
    return metricas;
}

/* ==========================================================================
   3. INTERACCIÓN CON EL USUARIO (prompt, alert y console.log)
   ========================================================================== */

/**
 * Flujo 1: pide los datos del evento, permite reintentar si son inválidos
 * y registra el evento en la colección.
 * @returns {Object|null} El evento creado, o null si se canceló.
 */
function flujoCrearEvento() {
    let nombre;
    let tipo;
    let presupuesto;
    let errores;
    let reintentar = false;

    do {
        // Si el usuario cancela un dato, no se piden los siguientes.
        nombre = prompt("Crear evento (paso 1 de 3)\nIngrese el NOMBRE del evento (ej.: Cumple de Sofía):");
        tipo = nombre === null ? null :
            prompt("Crear evento (paso 2 de 3)\nIngrese el TIPO de evento (" + TIPOS_EVENTO.join(", ") + "):");
        presupuesto = tipo === null ? null :
            prompt("Crear evento (paso 3 de 3)\nIngrese el PRESUPUESTO estimado (número mayor a 0):");

        errores = obtenerErroresEvento(nombre, tipo, presupuesto);
        if (errores.length > 0) {
            alert("Datos inválidos:\n" + errores.join("\n") + "\n\nDatos ingresados:\n" +
                "Nombre: " + describirIngreso(nombre) + "\n" +
                "Tipo: " + describirIngreso(tipo) + "\n" +
                "Presupuesto: " + describirIngreso(presupuesto));
            reintentar = quiereReintentar(prompt("¿Desea reintentar? (s/n)"));
        }
    } while (errores.length > 0 && reintentar);

    if (errores.length > 0) {
        alert("Se canceló la creación del evento.");
        return null;
    }

    const evento = crearEvento(nombre, tipo, presupuesto);
    eventos = agregarEvento(eventos, evento);
    console.log("Evento registrado:", evento, "| Total de eventos:", eventos.length);
    alert("Evento creado con éxito:\n" +
        "Nombre: " + evento.nombre + "\n" +
        "Tipo: " + evento.tipo + "\n" +
        "Presupuesto estimado: " + formatearMoneda(evento.presupuesto));
    return evento;
}

/**
 * Flujo 2: suma los ítems contratados, aplica el descuento ingresado
 * y compara el total con el presupuesto estimado del evento.
 * @returns {number|null} El total final, o null si el descuento fue inválido.
 */
function flujoCalcularPresupuesto() {
    const subtotal = calcularTotalItems(itemsContratados);
    const porcentaje = prompt("Subtotal de los ítems contratados: " + formatearMoneda(subtotal) +
        "\nIngrese el porcentaje de descuento (0 a 100):");

    let totalFinal;
    try {
        totalFinal = aplicarDescuento(subtotal, porcentaje);
    } catch (error) {
        alert(error.message);
        return null;
    }

    const presupuestoEstimado = obtenerPresupuestoEstimado(eventos);
    console.log("Desglose del presupuesto:");
    for (let i = 0; i < itemsContratados.length; i++) {
        const item = itemsContratados[i];
        console.log("  " + item.categoria + ": " + formatearMoneda(calcularSubtotalItem(item)));
    }
    console.log("  Subtotal: " + formatearMoneda(subtotal) + " | Descuento: " + porcentaje +
        "% | Total final: " + formatearMoneda(totalFinal) +
        " | Presupuesto estimado: " + formatearMoneda(presupuestoEstimado));

    if (superaPresupuesto(totalFinal, presupuestoEstimado)) {
        alert("Atención: el total de " + formatearMoneda(totalFinal) + " supera el presupuesto estimado de " +
            formatearMoneda(presupuestoEstimado) + " por " + formatearMoneda(totalFinal - presupuestoEstimado) + ".");
    } else {
        alert("Total final: " + formatearMoneda(totalFinal) + ".\nPresupuesto disponible: " +
            formatearMoneda(presupuestoEstimado - totalFinal) + ".");
    }
    return totalFinal;
}

/**
 * Flujo 3: pide un texto o categoría y muestra los proveedores que coinciden.
 * @returns {Proveedor[]|null} Los proveedores encontrados, o null si la búsqueda estaba vacía.
 */
function flujoBuscarEnCatalogo() {
    const criterio = prompt("Buscar proveedor por nombre o categoría:");

    let resultados;
    try {
        resultados = buscarEnCatalogo(catalogoProveedores, criterio);
    } catch (error) {
        alert(error.message);
        return null;
    }

    console.log("Búsqueda \"" + criterio + "\": " + resultados.length + " coincidencia(s).");
    if (resultados.length === 0) {
        alert("Sin coincidencias para \"" + criterio + "\".");
    } else {
        alert("Proveedores encontrados:\n" + formatearListaProveedores(resultados));
    }
    return resultados;
}

/**
 * Flujo 4: registra un invitado y muestra las métricas de asistencia.
 * @returns {{confirmados: number, pendientes: number}|null} Las métricas, o null si los datos fueron inválidos.
 */
function flujoGestionarInvitados() {
    const nombre = prompt("Nombre del invitado:");
    const estado = prompt("Estado de asistencia (" + ESTADOS_INVITADO.join(" o ") + "):");

    if (!validarInvitado(nombre, estado)) {
        alert("Faltan datos: ingrese un nombre y un estado válido (" + ESTADOS_INVITADO.join(" o ") + ").");
        return null;
    }

    invitados = agregarInvitado(invitados, nombre, estado);
    const metricas = contarAsistencia(invitados);
    console.log("Invitados:", invitados.length, "| Confirmados:", metricas.confirmados,
        "| Pendientes:", metricas.pendientes);
    alert("Invitado agregado.\nConfirmados: " + metricas.confirmados + "\nPendientes: " + metricas.pendientes);
    return metricas;
}

/**
 * Menú principal: permite elegir entre los 4 flujos hasta que el usuario sale
 * con la opción 0 o cancela el prompt().
 */
function iniciarMenuPrincipal() {
    const textoMenu = "PlanIT - Menú principal\n" +
        "1. Crear evento\n" +
        "2. Calcular presupuesto\n" +
        "3. Buscar en catálogo\n" +
        "4. Gestionar invitados\n" +
        "0. Salir";
    let continuar = true;

    while (continuar) {
        const opcion = prompt(textoMenu);
        if (opcion === null) {
            break;
        }
        switch (opcion.trim()) {
            case "1":
                flujoCrearEvento();
                break;
            case "2":
                flujoCalcularPresupuesto();
                break;
            case "3":
                flujoBuscarEnCatalogo();
                break;
            case "4":
                flujoGestionarInvitados();
                break;
            case "0":
                continuar = false;
                break;
            default:
                alert("Opción inválida. Ingrese un número del 0 al 4.");
        }
    }
    alert("¡Gracias por usar PlanIT!");
}

/**
 * Inicia el menú cuando la página terminó de cargar.
 * Si el menú arranca mientras la página todavía carga recursos (Bootstrap, imágenes, iframe),
 * el navegador cierra solo el prompt() que esté abierto y devuelve null. Por eso se consulta
 * document.readyState cada 100 ms, sin modificar el DOM ni usar eventos.
 */
function iniciarMenuAlTerminarCarga() {
    if (document.readyState === "complete") {
        iniciarMenuPrincipal();
    } else {
        setTimeout(iniciarMenuAlTerminarCarga, 100);
    }
}

// El menú no se ejecuta en js/test/test-runner.html: Jasmine se carga antes que este archivo.
if (typeof jasmine === "undefined") {
    iniciarMenuAlTerminarCarga();
}
