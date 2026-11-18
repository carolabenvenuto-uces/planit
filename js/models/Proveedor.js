/**
 * Representa un proveedor de servicios del catálogo (catering, decoración, sonido, etc.).
 * Existe de forma independiente al catálogo que lo agrupa (agregación).
 */
class Proveedor {
    #nombre;
    #categoria;
    #precio;
    #unidad;

    /**
     * Crea un proveedor con su nombre, categoría, precio y unidad de cobro.
     * @param {string} nombre Nombre comercial.
     * @param {string} categoria Categoría del servicio.
     * @param {number|string} precio Precio no negativo.
     * @param {string} unidad Unidad del precio.
     * @throws {Error} Si los datos son inválidos.
     */
    constructor(nombre, categoria, precio, unidad) {
        if (!Validador.esTextoNoVacio(nombre) || !Validador.esTextoNoVacio(categoria) || !Validador.esTextoNoVacio(unidad)) {
            throw new Error("El nombre, la categoría y la unidad del proveedor son obligatorios.");
        }
        const precioNumerico = Validador.convertirANumero(precio);
        if (!Number.isFinite(precioNumerico) || precioNumerico < 0) throw new Error("El precio debe ser un número no negativo.");
        this.#nombre = nombre.trim();
        this.#categoria = categoria.trim();
        this.#precio = precioNumerico;
        this.#unidad = unidad.trim();
    }

    /** @returns {string} Nombre comercial. */
    get nombre() { return this.#nombre; }
    /** @returns {string} Categoría del proveedor. */
    get categoria() { return this.#categoria; }
    /** @returns {number} Precio del servicio. */
    get precio() { return this.#precio; }
    /** @returns {string} Unidad del precio. */
    get unidad() { return this.#unidad; }

    /**
     * Busca el criterio en el nombre o la categoría, sin distinguir tildes ni mayúsculas.
     * @param {string} criterio Texto a buscar.
     * @returns {boolean} Si existe una coincidencia.
     */
    coincideCon(criterio) {
        if (!Validador.esTextoNoVacio(criterio)) return false;
        const busqueda = Validador.normalizarTexto(criterio);
        return Validador.normalizarTexto(this.#nombre).includes(busqueda) || Validador.normalizarTexto(this.#categoria).includes(busqueda);
    }

    /** @returns {Object} Datos planos del proveedor. */
    toJSON() { return { nombre: this.#nombre, categoria: this.#categoria, precio: this.#precio, unidad: this.#unidad }; }

    /**
     * Reconstruye un proveedor.
     * @param {Object} json Datos del proveedor.
     * @returns {Proveedor} Proveedor reconstruido.
     * @throws {Error} Si los datos son inválidos.
     */
    static fromJSON(json) {
        if (!json || typeof json !== "object" || Array.isArray(json)) throw new Error("Los datos del proveedor son inválidos.");
        return new Proveedor(json.nombre, json.categoria, json.precio, json.unidad);
    }
}