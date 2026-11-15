/** Ítem de un presupuesto. */
class ItemContratado {
    #categoria;
    #descripcion;
    #cantidad;
    #precioUnitario;

    /**
     * @param {string} categoria Categoría del ítem.
     * @param {string} descripcion Descripción del ítem.
     * @param {number|string} cantidad Cantidad no negativa.
     * @param {number|string} precioUnitario Precio unitario no negativo.
     * @throws {Error} Si algún dato es inválido.
     */
    constructor(categoria, descripcion, cantidad, precioUnitario) {
        const cantidadNumerica = Validador.convertirANumero(cantidad);
        const precioNumerico = Validador.convertirANumero(precioUnitario);
        if (!Validador.esTextoNoVacio(categoria) || !Validador.esTextoNoVacio(descripcion)) {
            throw new Error("La categoría y la descripción del ítem son obligatorias.");
        }
        if (!Number.isFinite(cantidadNumerica) || cantidadNumerica < 0 ||
            !Number.isFinite(precioNumerico) || precioNumerico < 0) {
            throw new Error("La cantidad y el precio unitario deben ser números no negativos.");
        }
        this.#categoria = categoria.trim();
        this.#descripcion = descripcion.trim();
        this.#cantidad = cantidadNumerica;
        this.#precioUnitario = precioNumerico;
    }

    /** @returns {string} Categoría del ítem. */
    get categoria() { return this.#categoria; }
    /** @returns {string} Descripción del ítem. */
    get descripcion() { return this.#descripcion; }
    /** @returns {number} Cantidad contratada. */
    get cantidad() { return this.#cantidad; }
    /** @returns {number} Precio por unidad. */
    get precioUnitario() { return this.#precioUnitario; }

    /** @returns {number} Producto de cantidad y precio unitario. */
    calcularSubtotal() { return this.#cantidad * this.#precioUnitario; }

    /** @returns {Object} Representación plana del ítem. */
    toJSON() {
        return { categoria: this.#categoria, descripcion: this.#descripcion, cantidad: this.#cantidad, precioUnitario: this.#precioUnitario };
    }

    /**
     * Reconstruye un ítem desde un objeto plano.
     * @param {Object} json Datos del ítem.
     * @returns {ItemContratado} Ítem reconstruido.
     * @throws {Error} Si los datos son inválidos.
     */
    static fromJSON(json) {
        if (!json || typeof json !== "object" || Array.isArray(json)) throw new Error("Los datos del ítem son inválidos.");
        return new ItemContratado(json.categoria, json.descripcion, json.cantidad, json.precioUnitario);
    }
}