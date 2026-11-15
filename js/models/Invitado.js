/** Invitado y su estado de asistencia. */
class Invitado {
    #nombre;
    #estado;

    /** @returns {string[]} Estados permitidos. */
    static get ESTADOS() { return ["Confirmado", "Pendiente"]; }

    /**
     * @param {string} nombre Nombre del invitado.
     * @param {string} estado Estado de asistencia.
     * @throws {Error} Si los datos son inválidos.
     */
    constructor(nombre, estado) {
        const errores = Invitado.validar(nombre, estado);
        if (errores.length) throw new Error(errores.join(" "));
        this.#nombre = nombre.trim();
        this.#estado = Invitado.ESTADOS.find((opcion) => Validador.normalizarTexto(opcion) === Validador.normalizarTexto(estado));
    }

    /** @returns {string} Nombre del invitado. */
    get nombre() { return this.#nombre; }
    /** @returns {string} Estado de asistencia. */
    get estado() { return this.#estado; }

    /**
     * Valida los datos sin crear un invitado.
     * @param {*} nombre Nombre a validar.
     * @param {*} estado Estado a validar.
     * @returns {string[]} Errores encontrados.
     */
    static validar(nombre, estado) {
        const errores = [];
        if (!Validador.esTextoNoVacio(nombre)) errores.push("El nombre del invitado no puede estar vacío.");
        if (!Validador.esTextoNoVacio(estado) || !Invitado.ESTADOS.some((opcion) => Validador.normalizarTexto(opcion) === Validador.normalizarTexto(estado))) {
            errores.push("El estado debe ser: " + Invitado.ESTADOS.join(" o ") + ".");
        }
        return errores;
    }

    /** @returns {boolean} Si el invitado confirmó. */
    esConfirmado() { return this.#estado === "Confirmado"; }

    /**
     * Cambia el estado de asistencia.
     * @param {string} estado Nuevo estado.
     * @throws {Error} Si el estado es inválido.
     */
    cambiarEstado(estado) {
        const errores = Invitado.validar(this.#nombre, estado);
        if (errores.length) throw new Error(errores.join(" "));
        this.#estado = Invitado.ESTADOS.find((opcion) => Validador.normalizarTexto(opcion) === Validador.normalizarTexto(estado));
    }

    /** @returns {Object} Datos planos del invitado. */
    toJSON() { return { nombre: this.#nombre, estado: this.#estado }; }

    /**
     * Reconstruye un invitado.
     * @param {Object} json Datos del invitado.
     * @returns {Invitado} Invitado reconstruido.
     * @throws {Error} Si los datos son inválidos.
     */
    static fromJSON(json) {
        if (!json || typeof json !== "object" || Array.isArray(json)) throw new Error("Los datos del invitado son inválidos.");
        return new Invitado(json.nombre, json.estado);
    }
}