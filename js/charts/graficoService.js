/**
 * Crea, actualiza y destruye los gráficos de Chart.js de la aplicación.
 * No conoce el dominio (Presupuesto, Proveedor, etc.): solo recibe un <canvas>
 * y una configuración de Chart.js ya armada por el controlador (js/script.js).
 */
var GraficoService = {
    _graficos: Object.create(null),

    /**
     * Crea el gráfico de un canvas, o lo reemplaza si ya existía.
     * @param {HTMLCanvasElement} canvas - Elemento destino.
     * @param {Object} config - Configuración de Chart.js (type, data, options).
     * @returns {Chart|null} Instancia creada, o null si no hay canvas o Chart.js no cargó.
     */
    renderizar(canvas, config) {
        if (!canvas || typeof Chart === "undefined") return null;
        this.destruir(canvas);
        const grafico = new Chart(canvas, config);
        this._graficos[canvas.id] = grafico;
        return grafico;
    },

    /**
     * Destruye el gráfico asociado a un canvas, si existe.
     * @param {HTMLCanvasElement} canvas - Elemento a liberar.
     */
    destruir(canvas) {
        if (!canvas) return;
        const existente = this._graficos[canvas.id];
        if (!existente) return;
        existente.destroy();
        delete this._graficos[canvas.id];
    }
};
