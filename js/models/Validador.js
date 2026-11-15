/**
 * Reúne validaciones y normalizaciones compartidas por las clases del dominio.
 * Solo expone métodos estáticos: no se instancia.
 */
class Validador {
    /**
     * Indica si el valor es un texto con contenido.
     * @param {*} valor Valor a validar.
     * @returns {boolean} Si contiene texto distinto de espacios.
     */
    static esTextoNoVacio(valor) {
        return typeof valor === "string" && valor.trim() !== "";
    }

    /**
     * Convierte números o textos numéricos a número.
     * @param {*} valor Valor a convertir.
     * @returns {number} Número convertido o NaN si no es convertible.
     */
    static convertirANumero(valor) {
        if (typeof valor === "number") return valor;
        if (typeof valor === "string" && valor.trim() !== "") return Number(valor.trim());
        return NaN;
    }

    /**
     * Normaliza un valor para compararlo sin mayúsculas ni tildes.
     * @param {*} texto Valor a normalizar.
     * @returns {string} Texto normalizado.
     */
    static normalizarTexto(texto) {
        return String(texto).trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    /**
     * Busca, sin distinguir mayúsculas ni tildes, la opción que coincide con el valor.
     * @param {string[]} opciones Opciones permitidas.
     * @param {*} valor Valor ingresado.
     * @returns {string|undefined} Opción con su escritura oficial, o undefined si no coincide.
     */
    static buscarOpcion(opciones, valor) {
        if (!Validador.esTextoNoVacio(valor)) return undefined;
        const buscado = Validador.normalizarTexto(valor);
        return opciones.find((opcion) => Validador.normalizarTexto(opcion) === buscado);
    }
}
