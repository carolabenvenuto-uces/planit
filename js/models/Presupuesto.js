/** Presupuesto compuesto por ítems contratados. */
class Presupuesto {
    #items;

    /** Crea un presupuesto vacío. */
    constructor() { this.#items = []; }

    /** @returns {ItemContratado[]} Copia de los ítems. */
    get items() { return this.#items.slice(); }

    /**
     * Agrega un ítem al presupuesto.
     * @param {ItemContratado} item Ítem a agregar.
     * @returns {ItemContratado} Ítem agregado.
     * @throws {Error} Si el ítem no es válido.
     */
    agregarItem(item) {
        if (!(item instanceof ItemContratado)) throw new Error("El ítem debe ser un ItemContratado válido.");
        this.#items.push(item);
        return item;
    }

    /**
     * Elimina el ítem ubicado en el índice indicado.
     * @param {number} indice Índice del ítem.
     * @returns {ItemContratado} Ítem eliminado.
     * @throws {Error} Si el índice es inválido.
     */
    eliminarItem(indice) {
        if (!Number.isInteger(indice) || indice < 0 || indice >= this.#items.length) {
            throw new Error("El índice del ítem es inválido.");
        }
        return this.#items.splice(indice, 1)[0];
    }

    /** @returns {number} Suma de los subtotales. */
    calcularTotal() { return this.#items.reduce((total, item) => total + item.calcularSubtotal(), 0); }

    /**
     * Calcula el total con descuento, redondeado a dos decimales.
     * @param {number|string} porcentaje Descuento entre 0 y 100.
     * @returns {number} Total descontado.
     * @throws {Error} Si el porcentaje es inválido.
     */
    aplicarDescuento(porcentaje) {
        const descuento = Validador.convertirANumero(porcentaje);
        if (!Number.isFinite(descuento) || descuento < 0 || descuento > 100) {
            throw new Error("El porcentaje de descuento debe ser un número entre 0 y 100.");
        }
        return Math.round(this.calcularTotal() * (100 - descuento)) / 100;
    }

    /**
     * Compara el total sin descuento con un límite.
     * @param {number|string} limite Límite no negativo.
     * @returns {boolean} Si el total supera estrictamente el límite.
     * @throws {Error} Si el límite es inválido.
     */
    superaLimite(limite) {
        const monto = Validador.convertirANumero(limite);
        if (!Number.isFinite(monto) || monto < 0) throw new Error("El límite debe ser un número no negativo.");
        return this.calcularTotal() > monto;
    }

    /** @returns {Object} Datos planos del presupuesto y sus ítems. */
    toJSON() { return { items: this.#items.map((item) => item.toJSON()) }; }

    /**
     * Reconstruye el presupuesto y sus ítems.
     * @param {Object} json Datos del presupuesto.
     * @returns {Presupuesto} Presupuesto reconstruido.
     * @throws {Error} Si los datos son inválidos.
     */
    static fromJSON(json) {
        if (!json || typeof json !== "object" || !Array.isArray(json.items)) throw new Error("Los datos del presupuesto son inválidos.");
        const presupuesto = new Presupuesto();
        json.items.forEach((item) => presupuesto.agregarItem(ItemContratado.fromJSON(item)));
        return presupuesto;
    }
}