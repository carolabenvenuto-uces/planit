/**
 * Capa de abstracción de almacenamiento persistente para PlanIT.
 * Expone el objeto global `Almacenamiento`, consumido por js/script.js.
 *
 * Contrato principal (ya asumido por la capa de controlador):
 *   - Almacenamiento.guardar(clave, valor) -> boolean
 *   - Almacenamiento.cargar(clave)         -> valor deserializado | null
 *
 * Todas las operaciones son tolerantes a fallos: si localStorage/sessionStorage
 * no está disponible (modo privado, cuota excedida, entorno sin DOM, etc.)
 * ninguna función lanza; las de lectura devuelven null y las de escritura
 * devuelven false, para que el controlador pueda seguir funcionando en memoria.
 */
const Almacenamiento = (function () {
    const PREFIJO = "planit:";

    // planit:detalles-evento guarda fecha y ubicación reales del evento (no estado
    // efímero de la UI), por eso debe sobrevivir entre sesiones igual que el resto:
    // no va en este Set.
    const CLAVES_SESSION = new Set();

    function resolverStorage(clave) {
        return CLAVES_SESSION.has(clave) ? window.sessionStorage : window.localStorage;
    }

    function guardar(clave, valor) {
        try {
            const storage = resolverStorage(clave);
            storage.setItem(clave, JSON.stringify(valor));
            return true;
        } catch (error) {
            console.error(`Almacenamiento: no se pudo guardar la clave "${clave}".`, error);
            return false;
        }
    }

    function cargar(clave) {
        try {
            const storage = resolverStorage(clave);
            const valorCrudo = storage.getItem(clave);
            if (valorCrudo === null) return null;
            return JSON.parse(valorCrudo);
        } catch (error) {
            console.error(`Almacenamiento: no se pudo cargar la clave "${clave}".`, error);
            return null;
        }
    }

    function obtener(clave) {
        return cargar(clave);
    }

    function actualizar(clave, valor) {
        return guardar(clave, valor);
    }

    function eliminar(clave) {
        try {
            resolverStorage(clave).removeItem(clave);
            return true;
        } catch (error) {
            console.error(`Almacenamiento: no se pudo eliminar la clave "${clave}".`, error);
            return false;
        }
    }

    function listar(prefijo = PREFIJO) {
        const claves = [];
        try {
            for (const storage of [window.localStorage, window.sessionStorage]) {
                for (let i = 0; i < storage.length; i++) {
                    const clave = storage.key(i);
                    if (clave !== null && clave.startsWith(prefijo)) {
                        claves.push(clave);
                    }
                }
            }
        } catch (error) {
            console.error("Almacenamiento: no se pudo listar las claves.", error);
        }
        return claves;
    }

    function limpiar(prefijo = PREFIJO) {
        try {
            for (const clave of listar(prefijo)) {
                eliminar(clave);
            }
            return true;
        } catch (error) {
            console.error("Almacenamiento: no se pudo limpiar el almacenamiento.", error);
            return false;
        }
    }

    return { guardar, cargar, obtener, actualizar, eliminar, listar, limpiar };
})();
