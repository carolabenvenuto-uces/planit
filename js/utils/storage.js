/**
 * Capa de abstracción de almacenamiento persistente para PlanIT.
 * Expone el objeto global `Almacenamiento`. Desde RC22 su único consumidor es la
 * fachada js/services/ServicioPersistenciaEvento.js (el controlador no lo usa).
 *
 * Contrato principal:
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
        if (valor === undefined) {
            console.error(`Almacenamiento: no se puede guardar "undefined" en la clave "${clave}".`);
            return false;
        }
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

    // Borra de ambos storages (no solo del que hoy le asigna resolverStorage): si una
    // clave quedó en el storage "equivocado" por un cambio de ruteo anterior (ver
    // CLAVES_SESSION), eliminar() igual la limpia por completo.
    function eliminar(clave) {
        let exito = true;
        for (const storage of [window.localStorage, window.sessionStorage]) {
            try {
                storage.removeItem(clave);
            } catch (error) {
                console.error(`Almacenamiento: no se pudo eliminar la clave "${clave}".`, error);
                exito = false;
            }
        }
        return exito;
    }

    function listar(prefijo = PREFIJO) {
        const claves = [];
        for (const storage of [window.localStorage, window.sessionStorage]) {
            try {
                for (let i = 0; i < storage.length; i++) {
                    const clave = storage.key(i);
                    if (clave !== null && clave.startsWith(prefijo)) {
                        claves.push(clave);
                    }
                }
            } catch (error) {
                console.error("Almacenamiento: no se pudo listar las claves.", error);
            }
        }
        return claves;
    }

    function limpiar(prefijo = PREFIJO) {
        return listar(prefijo).map(eliminar).every(Boolean);
    }

    return { guardar, cargar, obtener, actualizar, eliminar, listar, limpiar };
})();
