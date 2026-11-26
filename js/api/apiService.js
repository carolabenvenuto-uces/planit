/**
 * Acceso y procesamiento de datos del catálogo, sin dependencias del DOM.
 */
var ApiService = {
    /**
     * Obtiene y parsea un recurso JSON. Aborta cada solicitud a los 5 segundos
     * y reintenta una vez si fetch falla, incluso por timeout.
     * @param {string} url Dirección del recurso.
     * @param {Object} [opciones] Opciones de fetch; se respeta su señal de cancelación.
     * @returns {Promise<*>} Datos recibidos.
     * @throws {Error} Si falla la red, la respuesta HTTP o el JSON.
     */
    async fetchData(url, opciones) {
        let respuesta;
        for (let intento = 0; intento < 2; intento++) {
            const controlador = new AbortController();
            const signal = opciones && opciones.signal;
            const cancelar = () => controlador.abort(signal.reason);
            if (signal) {
                if (signal.aborted) cancelar();
                else signal.addEventListener("abort", cancelar, { once: true });
            }
            const timeout = setTimeout(() => controlador.abort(), 5000);
            try {
                respuesta = await fetch(url, { ...opciones, signal: controlador.signal });
                break;
            } catch (error) {
                if (intento === 1) {
                    throw new Error("Error de red al obtener " + url + ": " + error.message);
                }
            } finally {
                clearTimeout(timeout);
                if (signal) signal.removeEventListener("abort", cancelar);
            }
        }
        if (!respuesta.ok) throw new Error("HTTP error! status: " + respuesta.status);
        try {
            return await respuesta.json();
        } catch (error) {
            throw new Error("JSON inválido en " + url + ": " + error.message);
        }
    },

    /**
     * Obtiene, valida y sanitiza los proveedores.
     * @returns {Promise<Object[]>} Proveedores válidos.
     * @throws {Error} Si falla la carga o el catálogo no contiene proveedores válidos.
     */
    async obtenerProveedores() {
        const datos = await this.fetchData("api/proveedores.json");
        if (!datos || datos.version !== 1 || !Array.isArray(datos.proveedores)) {
            throw new Error("La estructura del catálogo de proveedores es inválida.");
        }
        const proveedores = datos.proveedores.filter((dato) => {
            if (this.validarProveedor(dato)) return true;
            console.warn("Se descartó un proveedor inválido:", dato);
            return false;
        }).map((dato) => ({
            nombre: this.sanitizarTexto(dato.nombre),
            categoria: this.sanitizarTexto(dato.categoria),
            precio: Validador.convertirANumero(dato.precio),
            unidad: this.sanitizarTexto(dato.unidad),
            imagen: this.sanitizarTexto(dato.imagen),
            alt: this.sanitizarTexto(dato.alt),
            descripcion: this.sanitizarTexto(dato.descripcion),
            capacidad: this.sanitizarTexto(dato.capacidad),
            zona: this.sanitizarTexto(dato.zona),
            duracion: this.sanitizarTexto(dato.duracion),
            incluye: this.sanitizarTexto(dato.incluye)
        }));
        if (proveedores.length === 0) {
            throw new Error("El catálogo no contiene proveedores válidos.");
        }
        return proveedores;
    },

    /**
     * Comprueba los campos obligatorios del modelo.
     * @param {*} dato Registro a validar.
     * @returns {boolean} Si puede convertirse en proveedor.
     */
    validarProveedor(dato) {
        if (!dato || typeof dato !== "object" || Array.isArray(dato)) return false;
        const precio = Validador.convertirANumero(dato.precio);
        return Boolean(this.sanitizarTexto(dato.nombre) && this.sanitizarTexto(dato.categoria) &&
            this.sanitizarTexto(dato.unidad) && Number.isFinite(precio) && precio >= 0);
    },

    /**
     * Limpia bloques de script y style completos, etiquetas, caracteres de control
     * y espacios de un texto.
     * @param {*} texto Valor recibido.
     * @returns {string} Texto limpio o vacío si no es texto.
     */
    sanitizarTexto(texto) {
        return typeof texto === "string"
            ? texto.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "").replace(/<[^>]*>/g, "").replace(/[\u0000-\u001f\u007f]/g, " ").trim()
            : "";
    },

    /**
     * Convierte registros en instancias del dominio.
     * @param {Object[]} datos Proveedores sanitizados.
     * @returns {CatalogoProveedores} Catálogo construido.
     */
    aCatalogo(datos) {
        if (!Array.isArray(datos)) throw new Error("La lista de proveedores es inválida.");
        const catalogo = new CatalogoProveedores();
        datos.map((dato) => {
            try {
                return new Proveedor(dato.nombre, dato.categoria, dato.precio, dato.unidad);
            } catch (error) {
                console.warn("Se descartó un proveedor inválido:", error);
                return null;
            }
        }).filter(Boolean).forEach((proveedor) => catalogo.agregarProveedor(proveedor));
        return catalogo;
    },

    /**
     * Filtra por categoría sin distinguir mayúsculas ni tildes.
     * @param {Proveedor[]} lista Proveedores.
     * @param {string} categoria Categoría buscada.
     * @returns {Proveedor[]} Coincidencias.
     */
    filtrarPorCategoria(lista, categoria) {
        const buscada = Validador.normalizarTexto(categoria);
        return lista.filter((proveedor) => Validador.normalizarTexto(proveedor.categoria) === buscada);
    },

    /**
     * Filtra por precio máximo inclusivo.
     * @param {Proveedor[]} lista Proveedores.
     * @param {number} max Precio máximo.
     * @returns {Proveedor[]} Coincidencias.
     */
    filtrarPorPrecioMaximo(lista, max) {
        return lista.filter((proveedor) => proveedor.precio <= max);
    },

    /**
     * Resume cantidad y precios por categoría.
     * @param {Proveedor[]} lista Proveedores.
     * @returns {Object} Resúmenes por categoría.
     */
    resumirCatalogo(lista) {
        return lista.reduce((resumen, proveedor) => {
            const anterior = resumen[proveedor.categoria];
            const cantidad = anterior ? anterior.cantidad + 1 : 1;
            resumen[proveedor.categoria] = {
                cantidad,
                precioPromedio: anterior
                    ? anterior.precioPromedio + (proveedor.precio - anterior.precioPromedio) / cantidad
                    : proveedor.precio,
                precioMinimo: anterior ? Math.min(anterior.precioMinimo, proveedor.precio) : proveedor.precio,
                precioMaximo: anterior ? Math.max(anterior.precioMaximo, proveedor.precio) : proveedor.precio
            };
            return resumen;
        }, Object.create(null));
    }
};
