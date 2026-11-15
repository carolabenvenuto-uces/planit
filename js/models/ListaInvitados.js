/**
 * Representa la lista de invitados de un evento. Compone 0..* Invitado
 * y calcula la asistencia confirmada y pendiente.
 */
class ListaInvitados {
    #invitados;

    /** Crea una lista vacía. */
    constructor() { this.#invitados = []; }

    /** @returns {Invitado[]} Copia de los invitados. */
    get invitados() { return this.#invitados.slice(); }

    /**
     * Crea y agrega un invitado.
     * @param {string} nombre Nombre del invitado.
     * @param {string} estado Estado de asistencia.
     * @returns {Invitado} Invitado agregado.
     * @throws {Error} Si los datos son inválidos.
     */
    agregar(nombre, estado) {
        const invitado = new Invitado(nombre, estado);
        this.#invitados.push(invitado);
        return invitado;
    }

    /**
     * Elimina el primer invitado cuyo nombre coincide sin mayúsculas ni tildes.
     * @param {string} nombre Nombre del invitado.
     * @returns {boolean} Si se eliminó un invitado.
     * @throws {Error} Si el nombre es inválido.
     */
    eliminar(nombre) {
        if (!Validador.esTextoNoVacio(nombre)) throw new Error("El nombre del invitado no puede estar vacío.");
        const indice = this.#invitados.findIndex((invitado) => Validador.normalizarTexto(invitado.nombre) === Validador.normalizarTexto(nombre));
        if (indice === -1) return false;
        this.#invitados.splice(indice, 1);
        return true;
    }

    /** @returns {{confirmados: number, pendientes: number}} Totales por estado. */
    contarAsistencia() {
        return this.#invitados.reduce((totales, invitado) => {
            if (invitado.esConfirmado()) totales.confirmados++;
            else totales.pendientes++;
            return totales;
        }, { confirmados: 0, pendientes: 0 });
    }

    /** @returns {Object} Datos planos de la lista. */
    toJSON() { return { invitados: this.#invitados.map((invitado) => invitado.toJSON()) }; }

    /**
     * Reconstruye la lista y sus invitados.
     * @param {Object} json Datos de la lista.
     * @returns {ListaInvitados} Lista reconstruida.
     * @throws {Error} Si los datos son inválidos.
     */
    static fromJSON(json) {
        if (!json || typeof json !== "object" || !Array.isArray(json.invitados)) throw new Error("Los datos de la lista de invitados son inválidos.");
        const lista = new ListaInvitados();
        json.invitados.forEach((datos) => {
            const invitado = Invitado.fromJSON(datos);
            lista.#invitados.push(invitado);
        });
        return lista;
    }
}