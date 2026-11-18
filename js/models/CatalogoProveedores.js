/**
 * Representa el catálogo de proveedores de PlanIT. Agrega 0..* Proveedor, que existen
 * por fuera del catálogo, y permite buscarlos por nombre o categoría.
 */
class CatalogoProveedores {
    #proveedores;

    /** Crea un catálogo vacío. */
    constructor() { this.#proveedores = []; }

    /** @returns {Proveedor[]} Copia de los proveedores. */
    get proveedores() { return this.#proveedores.slice(); }

    /**
     * Agrega un proveedor existente.
     * @param {Proveedor} proveedor Proveedor a agregar.
     * @returns {Proveedor} Proveedor agregado.
     * @throws {Error} Si el proveedor es inválido.
     */
    agregarProveedor(proveedor) {
        if (!(proveedor instanceof Proveedor)) throw new Error("El proveedor debe ser una instancia válida de Proveedor.");
        this.#proveedores.push(proveedor);
        return proveedor;
    }

    /**
     * Busca proveedores por nombre o categoría.
     * @param {string} criterio Texto a buscar.
     * @returns {Proveedor[]} Coincidencias.
     * @throws {Error} Si el criterio está vacío.
     */
    buscar(criterio) {
        if (!Validador.esTextoNoVacio(criterio)) throw new Error("El criterio de búsqueda no puede estar vacío.");
        return this.#proveedores.filter((proveedor) => proveedor.coincideCon(criterio));
    }

    /** @returns {Object} Datos planos del catálogo. */
    toJSON() { return { proveedores: this.#proveedores.map((proveedor) => proveedor.toJSON()) }; }

    /**
     * Reconstruye el catálogo y sus proveedores.
     * @param {Object} json Datos del catálogo.
     * @returns {CatalogoProveedores} Catálogo reconstruido.
     * @throws {Error} Si los datos son inválidos.
     */
    static fromJSON(json) {
        if (!json || typeof json !== "object" || !Array.isArray(json.proveedores)) throw new Error("Los datos del catálogo de proveedores son inválidos.");
        const catalogo = new CatalogoProveedores();
        json.proveedores.forEach((proveedor) => catalogo.agregarProveedor(Proveedor.fromJSON(proveedor)));
        return catalogo;
    }
}