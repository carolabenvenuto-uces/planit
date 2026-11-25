/**
 * Representa un evento social de PlanIT (cumpleaños, boda o salida casual).
 * Compone un Presupuesto con los ítems contratados y una ListaInvitados:
 * ambos se crean con el evento y no existen fuera de él.
 */
class Evento {
    #nombre;
    #tipo;
    #presupuestoEstimado;
    #presupuesto;
    #invitados;

    /** @returns {string[]} Tipos de evento permitidos. */
    static get TIPOS() { return ["cumpleaños", "boda", "salida casual"]; }

    /**
     * Crea un evento con su presupuesto y su lista de invitados vacíos.
     * @param {string} nombre Nombre del evento.
     * @param {string} tipo Tipo del evento (se acepta sin tildes ni mayúsculas).
     * @param {number|string} presupuestoEstimado Presupuesto mayor a cero.
     * @throws {Error} Si los datos son inválidos.
     */
    constructor(nombre, tipo, presupuestoEstimado) {
        const errores = Evento.validarDatos(nombre, tipo, presupuestoEstimado);
        if (errores.length) throw new Error(errores.join(" "));
        this.#nombre = nombre.trim();
        this.#tipo = Validador.buscarOpcion(Evento.TIPOS, tipo);
        this.#presupuestoEstimado = Validador.convertirANumero(presupuestoEstimado);
        this.#presupuesto = new Presupuesto();
        this.#invitados = new ListaInvitados();
    }

    /** @returns {string} Nombre del evento. */
    get nombre() { return this.#nombre; }
    /** @returns {string} Tipo del evento. */
    get tipo() { return this.#tipo; }
    /** @returns {number} Presupuesto estimado (límite del evento). */
    get presupuestoEstimado() { return this.#presupuestoEstimado; }
    /** @returns {Presupuesto} Presupuesto del evento. */
    get presupuesto() { return this.#presupuesto; }
    /** @returns {ListaInvitados} Lista de invitados del evento. */
    get invitados() { return this.#invitados; }

    /**
     * Valida los datos básicos sin crear un evento, para dar feedback en tiempo real.
     * @param {*} nombre Nombre del evento.
     * @param {*} tipo Tipo del evento.
     * @param {*} presupuesto Presupuesto estimado.
     * @returns {string[]} Errores encontrados (vacío si los datos son válidos).
     */
    static validarDatos(nombre, tipo, presupuesto) {
        const errores = [];
        if (!Validador.esTextoNoVacio(nombre)) {
            errores.push("El nombre del evento no puede estar vacío.");
        }
        if (Validador.buscarOpcion(Evento.TIPOS, tipo) === undefined) {
            errores.push("El tipo debe ser: " + Evento.TIPOS.join(", ") + ".");
        }
        const monto = Validador.convertirANumero(presupuesto);
        if (!Number.isFinite(monto) || monto <= 0) {
            errores.push("El presupuesto debe ser un número mayor a 0.");
        }
        return errores;
    }

    /**
     * Actualiza los datos básicos conservando presupuesto e invitados. Valida todo
     * antes de modificar: si algo es inválido, el evento queda intacto.
     * @param {string} nombre Nombre del evento.
     * @param {string} tipo Tipo del evento.
     * @param {number|string} presupuestoEstimado Presupuesto mayor a cero.
     * @returns {Evento} El mismo evento, actualizado.
     * @throws {Error} Si los datos son inválidos.
     */
    actualizarDatos(nombre, tipo, presupuestoEstimado) {
        const errores = Evento.validarDatos(nombre, tipo, presupuestoEstimado);
        if (errores.length) throw new Error(errores.join(" "));
        this.#nombre = nombre.trim();
        this.#tipo = Validador.buscarOpcion(Evento.TIPOS, tipo);
        this.#presupuestoEstimado = Validador.convertirANumero(presupuestoEstimado);
        return this;
    }

    /**
     * Indica si el total del presupuesto, con el descuento aplicado, supera el presupuesto estimado.
     * @param {number|string} [porcentajeDescuento=0] Descuento entre 0 y 100.
     * @returns {boolean} Si el total supera estrictamente el presupuesto estimado.
     * @throws {Error} Si el descuento es inválido.
     */
    superaPresupuesto(porcentajeDescuento = 0) {
        return this.#presupuesto.aplicarDescuento(porcentajeDescuento) > this.#presupuestoEstimado;
    }

    /** @returns {Object} Datos planos del evento y sus componentes. */
    toJSON() {
        return {
            nombre: this.#nombre,
            tipo: this.#tipo,
            presupuestoEstimado: this.#presupuestoEstimado,
            presupuesto: this.#presupuesto.toJSON(),
            invitados: this.#invitados.toJSON()
        };
    }

    /**
     * Reconstruye el evento y sus componentes. Si faltan el presupuesto o los invitados,
     * se crean vacíos.
     * @param {Object} json Datos del evento.
     * @returns {Evento} Evento reconstruido.
     * @throws {Error} Si los datos son inválidos.
     */
    static fromJSON(json) {
        if (!json || typeof json !== "object" || Array.isArray(json)) {
            throw new Error("Los datos del evento son inválidos.");
        }
        const evento = new Evento(json.nombre, json.tipo, json.presupuestoEstimado);
        if (json.presupuesto !== undefined) evento.#presupuesto = Presupuesto.fromJSON(json.presupuesto);
        if (json.invitados !== undefined) evento.#invitados = ListaInvitados.fromJSON(json.invitados);
        return evento;
    }
}
