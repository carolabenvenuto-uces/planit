/**
 * PlanIT - Fachada de persistencia del dominio (RC22, Actividad Obligatoria N.° 4).
 *
 * Patrón Facade / Service Layer: es el ÚNICO punto del sistema que conoce
 *   - el módulo de bajo nivel `Almacenamiento` (js/utils/storage.js);
 *   - las claves con las que se guarda el estado ("planit:...");
 *   - el ciclo de serialización (toJSON) e hidratación (Evento.fromJSON).
 *
 * El controlador (js/script.js) solo trabaja con instancias del dominio y con
 * esta interfaz declarativa:
 *   estaDisponible()                -> boolean
 *   guardar(evento, [detalles])     -> boolean
 *   guardarEvento(evento)           -> boolean
 *   guardarDetalles(detalles)       -> boolean
 *   cargar([crearSemilla])          -> { evento, detalles, origen, datosDanados }
 *   limpiar()                       -> boolean
 *
 * Ninguna operación lanza por fallas del storage: las escrituras devuelven false
 * y las lecturas se comportan como "no hay estado guardado", para que la app
 * pueda seguir funcionando en memoria.
 */
class ServicioPersistenciaEvento {
    /** Claves de almacenamiento: privadas, nadie fuera de la fachada las conoce. */
    static #CLAVES = Object.freeze({
        evento: "planit:evento",
        detalles: "planit:detalles-evento"
    });

    /** Origen del evento devuelto por cargar(). */
    static get ORIGENES() {
        return Object.freeze({ almacenamiento: "almacenamiento", semilla: "semilla", ninguno: "ninguno" });
    }

    #almacenamiento;

    /**
     * @param {Object} [almacenamiento] Adaptador con guardar/cargar/eliminar.
     *   Por defecto usa el objeto global `Almacenamiento`; se puede inyectar un
     *   doble de prueba en los tests.
     */
    constructor(almacenamiento) {
        this.#almacenamiento = almacenamiento !== undefined
            ? almacenamiento
            : (typeof Almacenamiento !== "undefined" ? Almacenamiento : null);
    }

    /** @returns {boolean} true si hay un almacenamiento utilizable. */
    estaDisponible() {
        const almacenamiento = this.#almacenamiento;
        return Boolean(almacenamiento) &&
            typeof almacenamiento.guardar === "function" &&
            typeof almacenamiento.cargar === "function" &&
            typeof almacenamiento.eliminar === "function";
    }

    /**
     * Persiste el evento (con su presupuesto e invitados) y, si se indican, sus
     * detalles de agenda (fecha y ubicación).
     * @param {Evento} evento Instancia del dominio.
     * @param {{fecha: string, ubicacion: string}} [detalles]
     * @returns {boolean} true si todo se guardó.
     */
    guardar(evento, detalles) {
        const eventoGuardado = this.guardarEvento(evento);
        if (!eventoGuardado || detalles === undefined) return eventoGuardado;
        return this.guardarDetalles(detalles);
    }

    /**
     * Serializa y persiste el evento.
     * @param {Evento} evento Instancia del dominio.
     * @returns {boolean} true si se guardó.
     */
    guardarEvento(evento) {
        if (!(evento instanceof Evento)) {
            throw new TypeError("Solo se puede persistir una instancia de Evento.");
        }
        return this.#escribir(ServicioPersistenciaEvento.#CLAVES.evento, evento.toJSON());
    }

    /**
     * Persiste fecha y ubicación del evento.
     * @param {{fecha: string, ubicacion: string}} detalles
     * @returns {boolean} true si se guardó.
     */
    guardarDetalles(detalles) {
        return this.#escribir(ServicioPersistenciaEvento.#CLAVES.detalles, {
            fecha: detalles && detalles.fecha !== undefined ? String(detalles.fecha) : "",
            ubicacion: detalles && detalles.ubicacion !== undefined ? String(detalles.ubicacion) : ""
        });
    }

    /**
     * Recupera el estado persistido ya hidratado como instancias del dominio.
     * Si no hay evento guardado (o estaba dañado) y se pasa `crearSemilla`, se usa
     * esa fábrica para obtener el evento inicial. Los errores de la semilla se
     * propagan al llamador.
     * @param {function(): Evento} [crearSemilla] Fábrica del evento de ejemplo.
     * @returns {{evento: (Evento|null), detalles: ({fecha: string, ubicacion: string}|null),
     *            origen: string, datosDanados: boolean}}
     */
    cargar(crearSemilla) {
        const { ORIGENES } = ServicioPersistenciaEvento;
        let evento = null;
        let origen = ORIGENES.ninguno;
        let datosDanados = false;

        const crudo = this.#leer(ServicioPersistenciaEvento.#CLAVES.evento);
        if (crudo !== null) {
            try {
                evento = Evento.fromJSON(crudo);
                origen = ORIGENES.almacenamiento;
            } catch (error) {
                datosDanados = true;
            }
        }

        if (evento === null && typeof crearSemilla === "function") {
            evento = crearSemilla();
            origen = ORIGENES.semilla;
        }

        return { evento, detalles: this.#hidratarDetalles(), origen, datosDanados };
    }

    /**
     * Borra todo el estado persistido por la fachada.
     * @returns {boolean} true si se borró (o no había nada).
     */
    limpiar() {
        if (!this.estaDisponible()) return false;
        return Object.values(ServicioPersistenciaEvento.#CLAVES)
            .map((clave) => this.#almacenamiento.eliminar(clave))
            .every(Boolean);
    }

    /** @returns {{fecha: string, ubicacion: string}|null} */
    #hidratarDetalles() {
        const crudo = this.#leer(ServicioPersistenciaEvento.#CLAVES.detalles);
        if (!crudo || typeof crudo !== "object" || Array.isArray(crudo)) return null;
        return {
            fecha: typeof crudo.fecha === "string" ? crudo.fecha : "",
            ubicacion: typeof crudo.ubicacion === "string" ? crudo.ubicacion : ""
        };
    }

    #leer(clave) {
        if (!this.estaDisponible()) return null;
        try {
            const valor = this.#almacenamiento.cargar(clave);
            return valor === undefined ? null : valor;
        } catch (error) {
            return null;
        }
    }

    #escribir(clave, valor) {
        if (!this.estaDisponible()) return false;
        try {
            return this.#almacenamiento.guardar(clave, valor) === true;
        } catch (error) {
            return false;
        }
    }
}
