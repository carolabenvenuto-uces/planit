/**
 * Representa a un invitado de un evento y su estado de asistencia.
 * Forma parte de una ListaInvitados (composición).
 */
class Invitado {
    #nombre;
    #estado;

    /** @returns {string[]} Estados de asistencia permitidos. */
    static get ESTADOS() { return ["Confirmado", "Pendiente"]; }

    /**
     * Crea un invitado con su estado de asistencia.
     * @param {string} nombre Nombre del invitado.
     * @param {string} estado Estado de asistencia (se acepta sin mayúsculas).
     * @throws {Error} Si los datos son inválidos.
     */
    constructor(nombre, estado) {
        const errores = Invitado.validar(nombre, estado);
        if (errores.length) throw new Error(errores.join(" "));
        this.#nombre = nombre.trim();
        this.#estado = Validador.buscarOpcion(Invitado.ESTADOS, estado);
    }

    /** @returns {string} Nombre del invitado. */
    get nombre() { return this.#nombre; }
    /** @returns {string} Estado de asistencia. */
    get estado() { return this.#estado; }

    /**
     * Valida los datos sin crear un invitado, para dar feedback en tiempo real.
     * @param {*} nombre Nombre a validar.
     * @param {*} estado Estado a validar.
     * @returns {string[]} Errores encontrados (vacío si los datos son válidos).
     */
    static validar(nombre, estado) {
        const errores = [];
        if (!Validador.esTextoNoVacio(nombre)) {
            errores.push("El nombre del invitado no puede estar vacío.");
        }
        if (Validador.buscarOpcion(Invitado.ESTADOS, estado) === undefined) {
            errores.push("El estado debe ser: " + Invitado.ESTADOS.join(" o ") + ".");
        }
        return errores;
    }

    /** @returns {boolean} Si el invitado confirmó su asistencia. */
    esConfirmado() { return this.#estado === "Confirmado"; }

    /**
     * Cambia el estado de asistencia.
     * @param {string} estado Nuevo estado.
     * @throws {Error} Si el estado es inválido.
     */
    cambiarEstado(estado) {
        const nuevoEstado = Validador.buscarOpcion(Invitado.ESTADOS, estado);
        if (nuevoEstado === undefined) {
            throw new Error("El estado debe ser: " + Invitado.ESTADOS.join(" o ") + ".");
        }
        this.#estado = nuevoEstado;
    }

    /** @returns {Object} Datos planos del invitado. */
    toJSON() { return { nombre: this.#nombre, estado: this.#estado }; }

    /**
     * Reconstruye un invitado desde un objeto plano.
     * @param {Object} json Datos del invitado.
     * @returns {Invitado} Invitado reconstruido.
     * @throws {Error} Si los datos son inválidos.
     */
    static fromJSON(json) {
        if (!json || typeof json !== "object" || Array.isArray(json)) {
            throw new Error("Los datos del invitado son inválidos.");
        }
        return new Invitado(json.nombre, json.estado);
    }
}
