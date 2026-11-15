/** Utilidades de validación compartidas por el dominio. */
class Validador {
    /** Crea un validador sin estado. */
    constructor() {}

    /**
     * Indica si el valor es un texto con contenido.
     * @param {*} valor Valor a validar.
     * @returns {boolean} Si contiene texto.
     */
    static esTextoNoVacio(valor) {
        return typeof valor === "string" && valor.trim() !== "";
    }

    /**
     * Convierte números o textos numéricos a número.
     * @param {*} valor Valor a convertir.
     * @returns {number} Número convertido o NaN.
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
}