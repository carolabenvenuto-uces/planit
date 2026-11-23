describe("Almacenamiento", function () {
    const PREFIJO_TEST = "planit:test-";

    afterEach(function () {
        Almacenamiento.limpiar(PREFIJO_TEST);
    });

    describe("guardar / cargar", function () {
        it("debería guardar y recuperar un valor serializable", function () {
            expect(Almacenamiento.guardar(PREFIJO_TEST + "numero", 42)).toBe(true);
            expect(Almacenamiento.cargar(PREFIJO_TEST + "numero")).toBe(42);
        });

        it("debería guardar y recuperar un objeto complejo", function () {
            const valor = { nombre: "Evento", items: [1, 2, 3], activo: true };
            Almacenamiento.guardar(PREFIJO_TEST + "objeto", valor);

            expect(Almacenamiento.cargar(PREFIJO_TEST + "objeto")).toEqual(valor);
        });

        it("cargar() de una clave inexistente debería devolver null", function () {
            expect(Almacenamiento.cargar(PREFIJO_TEST + "no-existe")).toBeNull();
        });

        it("guardar() con undefined debería devolver false y no dejar la clave leíble", function () {
            spyOn(console, "error");

            expect(Almacenamiento.guardar(PREFIJO_TEST + "undefined", undefined)).toBe(false);
            expect(Almacenamiento.cargar(PREFIJO_TEST + "undefined")).toBeNull();
        });

        it("cargar() debería devolver null ante JSON corrupto en vez de lanzar", function () {
            spyOn(console, "error");
            const clave = PREFIJO_TEST + "corrupto";
            localStorage.setItem(clave, "{esto no es JSON válido");

            expect(function () { Almacenamiento.cargar(clave); }).not.toThrow();
            expect(Almacenamiento.cargar(clave)).toBeNull();

            localStorage.removeItem(clave);
        });

        it("guardar() debería sobrescribir un valor existente", function () {
            Almacenamiento.guardar(PREFIJO_TEST + "valor", "uno");
            Almacenamiento.guardar(PREFIJO_TEST + "valor", "dos");

            expect(Almacenamiento.cargar(PREFIJO_TEST + "valor")).toBe("dos");
        });

        it("guardar() debería devolver false si el storage está lleno, sin lanzar", function () {
            spyOn(Storage.prototype, "setItem").and.throwError(new DOMException("Quota exceeded", "QuotaExceededError"));
            spyOn(console, "error");

            expect(Almacenamiento.guardar(PREFIJO_TEST + "storage-lleno", { a: 1 })).toBe(false);
            expect(console.error).toHaveBeenCalled();
        });
    });

    describe("obtener / actualizar (alias)", function () {
        it("obtener debería comportarse igual que cargar", function () {
            Almacenamiento.guardar(PREFIJO_TEST + "alias", "valor");
            expect(Almacenamiento.obtener(PREFIJO_TEST + "alias")).toBe("valor");
            expect(Almacenamiento.obtener(PREFIJO_TEST + "inexistente")).toBeNull();
        });

        it("actualizar debería comportarse igual que guardar", function () {
            expect(Almacenamiento.actualizar(PREFIJO_TEST + "alias2", "nuevo")).toBe(true);
            expect(Almacenamiento.cargar(PREFIJO_TEST + "alias2")).toBe("nuevo");
        });
    });

    describe("eliminar", function () {
        it("debería borrar una clave existente y devolver true", function () {
            Almacenamiento.guardar(PREFIJO_TEST + "borrar", "x");
            expect(Almacenamiento.eliminar(PREFIJO_TEST + "borrar")).toBe(true);
            expect(Almacenamiento.cargar(PREFIJO_TEST + "borrar")).toBeNull();
        });

        it("debería devolver true aunque la clave no exista (no es un error)", function () {
            expect(Almacenamiento.eliminar(PREFIJO_TEST + "no-existe")).toBe(true);
        });

        it("debería borrar la clave de ambos storages (local y session), aunque esté sembrada en los dos", function () {
            const clave = PREFIJO_TEST + "huerfana";
            localStorage.setItem(clave, JSON.stringify("en-local"));
            sessionStorage.setItem(clave, JSON.stringify("en-session"));

            expect(Almacenamiento.eliminar(clave)).toBe(true);
            expect(localStorage.getItem(clave)).toBeNull();
            expect(sessionStorage.getItem(clave)).toBeNull();
        });
    });

    describe("listar", function () {
        beforeEach(function () {
            Almacenamiento.guardar(PREFIJO_TEST + "a", 1);
            Almacenamiento.guardar(PREFIJO_TEST + "b", 2);
            Almacenamiento.guardar("planit:otro-prefijo-no-test", 3);
        });

        afterEach(function () {
            Almacenamiento.eliminar("planit:otro-prefijo-no-test");
        });

        it("debería devolver solo las claves que empiezan con el prefijo dado", function () {
            const claves = Almacenamiento.listar(PREFIJO_TEST);

            expect(claves).toContain(PREFIJO_TEST + "a");
            expect(claves).toContain(PREFIJO_TEST + "b");
            expect(claves).not.toContain("planit:otro-prefijo-no-test");
        });

        it("debería usar 'planit:' como prefijo por defecto", function () {
            const claves = Almacenamiento.listar();
            expect(claves).toContain(PREFIJO_TEST + "a");
            expect(claves).toContain("planit:otro-prefijo-no-test");
        });

        it("debería devolver un array vacío si no hay coincidencias", function () {
            expect(Almacenamiento.listar("planit:prefijo-inexistente-")).toEqual([]);
        });
    });

    describe("limpiar", function () {
        it("debería borrar todas las claves del prefijo y devolver true", function () {
            Almacenamiento.guardar(PREFIJO_TEST + "a", 1);
            Almacenamiento.guardar(PREFIJO_TEST + "b", 2);

            expect(Almacenamiento.limpiar(PREFIJO_TEST)).toBe(true);
            expect(Almacenamiento.listar(PREFIJO_TEST)).toEqual([]);
        });

        it("no debería afectar claves de otro prefijo", function () {
            Almacenamiento.guardar(PREFIJO_TEST + "a", 1);
            Almacenamiento.guardar("planit:otro-prefijo-limpiar", "intacto");

            Almacenamiento.limpiar(PREFIJO_TEST);

            expect(Almacenamiento.cargar("planit:otro-prefijo-limpiar")).toBe("intacto");
            Almacenamiento.eliminar("planit:otro-prefijo-limpiar");
        });

        it("debería devolver true con un prefijo sin coincidencias (nada para borrar)", function () {
            expect(Almacenamiento.limpiar("planit:prefijo-inexistente-")).toBe(true);
        });
    });

    describe("Integración con js/models/ (serialización de un Evento completo)", function () {
        it("debería guardar y reconstruir un Evento con presupuesto e invitados vía toJSON/fromJSON", function () {
            const evento = new Evento("Evento de prueba", "boda", 500000);
            evento.presupuesto.agregarItem(new ItemContratado("Catering", "Finger food", 10, 3500));
            evento.invitados.agregar("Juan Pérez", "Confirmado");

            Almacenamiento.guardar(PREFIJO_TEST + "evento", evento.toJSON());
            const recuperado = Evento.fromJSON(Almacenamiento.cargar(PREFIJO_TEST + "evento"));

            expect(recuperado.nombre).toBe("Evento de prueba");
            expect(recuperado.presupuesto.calcularTotal()).toBe(35000);
            expect(recuperado.invitados.invitados.length).toBe(1);
        });
    });

    /*
     * RC7 (observación docente): serialización fallida, ciclos, BigInt, toJSON que lanza,
     * aislamiento entre storages, ruteo efectivo a sessionStorage y limpieza sin residuos.
     * Matriz de casos RC7-01 a RC7-21 documentada en js/test/testing-doc.md y en
     * docs/03-specs/actividad-obligatoria-4/spec-tester-qa.md.
     */
    describe("Serialización extrema, aislamiento y ciclo de vida de almacenamiento (RC7)", function () {
        // Referencias nativas capturadas ANTES de cualquier spyOn: permiten (a) que un
        // callFake delegue en el comportamiento real y (b) que el afterEach limpie aunque
        // un spec haya dejado Storage.prototype.removeItem configurado para lanzar.
        const removeItemNativo = Storage.prototype.removeItem;
        const setItemNativo = Storage.prototype.setItem;

        // Claves fuera de PREFIJO_TEST que un spec siembra a propósito (claves "de terceros"
        // o reales de la app). El afterEach las restaura a su valor previo o las borra.
        let respaldosExternos;

        function sembrarExterna(storage, clave, valorCrudo) {
            if (!respaldosExternos.some(function (r) { return r.storage === storage && r.clave === clave; })) {
                respaldosExternos.push({ storage: storage, clave: clave, previo: storage.getItem(clave) });
            }
            if (valorCrudo !== undefined) setItemNativo.call(storage, clave, valorCrudo);
        }

        function clavesConPrefijo(storage, prefijo) {
            const claves = [];
            for (let i = 0; i < storage.length; i++) {
                const clave = storage.key(i);
                if (clave !== null && clave.startsWith(prefijo)) claves.push(clave);
            }
            return claves;
        }

        function clavesAjenas(storage, prefijo) {
            const snapshot = {};
            for (let i = 0; i < storage.length; i++) {
                const clave = storage.key(i);
                if (clave !== null && !(prefijo && clave.startsWith(prefijo))) snapshot[clave] = storage.getItem(clave);
            }
            return snapshot;
        }

        beforeEach(function () {
            respaldosExternos = [];
            spyOn(console, "error");
        });

        afterEach(function () {
            // Un spec puede haber dejado removeItem/setItem lanzando: se neutraliza el spy
            // antes de que el afterEach externo llame a Almacenamiento.limpiar().
            [Storage.prototype.removeItem, Storage.prototype.setItem].forEach(function (metodo) {
                if (jasmine.isSpy(metodo)) metodo.and.callThrough();
            });

            [window.localStorage, window.sessionStorage].forEach(function (storage) {
                clavesConPrefijo(storage, PREFIJO_TEST).forEach(function (clave) {
                    removeItemNativo.call(storage, clave);
                });
            });

            respaldosExternos.forEach(function (r) {
                if (r.previo === null) removeItemNativo.call(r.storage, r.clave);
                else setItemNativo.call(r.storage, r.clave, r.previo);
            });
        });

        describe("Serialización fallida: ciclos, BigInt y toJSON() que lanza", function () {
            it("RC7-01: guardar() con un ciclo directo (obj.self = obj) devuelve false sin lanzar y loguea el TypeError", function () {
                const clave = PREFIJO_TEST + "ciclo-directo";
                const nodo = { nombre: "nodo" };
                nodo.self = nodo;

                let resultado;
                expect(function () { resultado = Almacenamiento.guardar(clave, nodo); }).not.toThrow();
                expect(resultado).toBe(false);
                expect(console.error).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(TypeError));
                expect(localStorage.getItem(clave)).toBeNull();
                expect(sessionStorage.getItem(clave)).toBeNull();
            });

            it("RC7-02: guardar() con un ciclo indirecto (a -> b -> c -> a) devuelve false y no deja la clave escrita", function () {
                const clave = PREFIJO_TEST + "ciclo-indirecto";
                const a = { id: "a" };
                const b = { id: "b" };
                const c = { id: "c" };
                a.siguiente = b;
                b.siguiente = c;
                c.siguiente = a;

                expect(Almacenamiento.guardar(clave, { raiz: a })).toBe(false);
                expect(console.error).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(TypeError));
                expect(Almacenamiento.cargar(clave)).toBeNull();
            });

            it("RC7-03: guardar() con un ciclo que pasa por un array (lista.push(lista)) devuelve false", function () {
                const clave = PREFIJO_TEST + "ciclo-array";
                const lista = [1, 2];
                lista.push(lista);

                expect(Almacenamiento.guardar(clave, { lista: lista })).toBe(false);
                expect(console.error).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(TypeError));
                expect(localStorage.getItem(clave)).toBeNull();
            });

            it("RC7-04: un guardado fallido por ciclo no pisa el valor válido previo de la misma clave", function () {
                const clave = PREFIJO_TEST + "ciclo-preserva";
                expect(Almacenamiento.guardar(clave, { version: 1 })).toBe(true);

                const ciclico = { version: 2 };
                ciclico.yo = ciclico;

                expect(Almacenamiento.guardar(clave, ciclico)).toBe(false);
                expect(Almacenamiento.cargar(clave)).toEqual({ version: 1 });
            });

            it("RC7-05: guardar() con un BigInt en la raíz devuelve false y loguea el TypeError de JSON.stringify", function () {
                const clave = PREFIJO_TEST + "bigint-raiz";

                let resultado;
                expect(function () { resultado = Almacenamiento.guardar(clave, BigInt(10)); }).not.toThrow();
                expect(resultado).toBe(false);
                expect(console.error).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(TypeError));
                expect(localStorage.getItem(clave)).toBeNull();
            });

            it("RC7-06: guardar() con un BigInt anidado (objeto > array > BigInt) devuelve false sin residuos", function () {
                const clave = PREFIJO_TEST + "bigint-anidado";
                const valor = { presupuesto: { montos: [1000, BigInt("9007199254740993")] } };

                expect(Almacenamiento.guardar(clave, valor)).toBe(false);
                expect(console.error).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(TypeError));
                expect(localStorage.getItem(clave)).toBeNull();
                expect(sessionStorage.getItem(clave)).toBeNull();
            });

            it("RC7-07: guardar() con un toJSON() que lanza un error propio devuelve false y loguea ese mismo error", function () {
                class ErrorDeSerializacion extends Error {}
                const errorEsperado = new ErrorDeSerializacion("toJSON roto a propósito");
                const clave = PREFIJO_TEST + "tojson-lanza";
                const valor = { toJSON: function () { throw errorEsperado; } };

                let resultado;
                expect(function () { resultado = Almacenamiento.guardar(clave, valor); }).not.toThrow();
                expect(resultado).toBe(false);
                expect(console.error).toHaveBeenCalledWith(jasmine.any(String), errorEsperado);
                expect(localStorage.getItem(clave)).toBeNull();
            });

            it("RC7-08: un toJSON() que lanza en un objeto anidado no corrompe el valor previo de la clave", function () {
                const clave = PREFIJO_TEST + "tojson-anidado";
                expect(Almacenamiento.guardar(clave, ["original"])).toBe(true);

                const valor = { items: [{ ok: true }, { toJSON: function () { throw new RangeError("fallo anidado"); } }] };

                expect(Almacenamiento.guardar(clave, valor)).toBe(false);
                expect(console.error).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(RangeError));
                expect(Almacenamiento.cargar(clave)).toEqual(["original"]);
            });

            it("RC7-09: actualizar() (alias de guardar) hereda el mismo manejo seguro ante un ciclo", function () {
                const clave = PREFIJO_TEST + "actualizar-ciclo";
                const ciclico = {};
                ciclico.ref = ciclico;

                let resultado;
                expect(function () { resultado = Almacenamiento.actualizar(clave, ciclico); }).not.toThrow();
                expect(resultado).toBe(false);
                expect(localStorage.getItem(clave)).toBeNull();
            });

            it("RC7-10: tras una serialización fallida el módulo sigue operativo para la siguiente escritura", function () {
                const claveFallida = PREFIJO_TEST + "fallo-previo";
                const claveSana = PREFIJO_TEST + "escritura-posterior";

                expect(Almacenamiento.guardar(claveFallida, { n: BigInt(1) })).toBe(false);
                expect(Almacenamiento.guardar(claveSana, { n: 1 })).toBe(true);
                expect(Almacenamiento.cargar(claveSana)).toEqual({ n: 1 });
            });
        });

        describe("Aislamiento efectivo entre localStorage y sessionStorage", function () {
            it("RC7-11: guardar() en localStorage no crea ni modifica una clave homónima sembrada en sessionStorage", function () {
                const clave = PREFIJO_TEST + "homonima";
                setItemNativo.call(sessionStorage, clave, JSON.stringify("valor-de-session"));

                expect(Almacenamiento.guardar(clave, "valor-de-local")).toBe(true);

                expect(localStorage.getItem(clave)).toBe(JSON.stringify("valor-de-local"));
                expect(sessionStorage.getItem(clave)).toBe(JSON.stringify("valor-de-session"));
                expect(Almacenamiento.cargar(clave)).toBe("valor-de-local");
            });

            it("RC7-12: un valor presente solo en sessionStorage no se filtra a cargar() (sin fallback cruzado)", function () {
                const clave = PREFIJO_TEST + "solo-session";
                setItemNativo.call(sessionStorage, clave, JSON.stringify({ origen: "session" }));

                expect(localStorage.getItem(clave)).toBeNull();
                expect(Almacenamiento.cargar(clave)).toBeNull();
            });

            it("RC7-13: una serie de guardar/actualizar/cargar no altera ninguna entrada de sessionStorage", function () {
                const antes = clavesAjenas(sessionStorage);

                Almacenamiento.guardar(PREFIJO_TEST + "serie-1", 1);
                Almacenamiento.actualizar(PREFIJO_TEST + "serie-1", 2);
                Almacenamiento.guardar(PREFIJO_TEST + "serie-2", { a: [1, 2] });
                Almacenamiento.cargar(PREFIJO_TEST + "serie-1");
                Almacenamiento.obtener(PREFIJO_TEST + "serie-2");

                expect(clavesAjenas(sessionStorage)).toEqual(antes);
            });
        });

        describe("Ruteo efectivo hacia window.sessionStorage", function () {
            it("RC7-14: guardar() escribe exclusivamente sobre window.localStorage, incluida planit:detalles-evento", function () {
                // planit:detalles-evento es la clave cuyo ruteo a sessionStorage se corrigió antes
                // del merge de PR #108: se fija acá como regresión del ruteo estricto.
                sembrarExterna(localStorage, "planit:detalles-evento");
                sembrarExterna(sessionStorage, "planit:detalles-evento");
                const spySetItem = spyOn(Storage.prototype, "setItem").and.callThrough();

                Almacenamiento.guardar(PREFIJO_TEST + "ruteo", "x");
                Almacenamiento.actualizar("planit:detalles-evento", { fecha: "2026-11-14", ubicacion: "Pilar" });

                expect(spySetItem.calls.count()).toBe(2);
                spySetItem.calls.all().forEach(function (llamada) {
                    expect(llamada.object).toBe(window.localStorage);
                    expect(llamada.object).not.toBe(window.sessionStorage);
                });
            });

            it("RC7-15: eliminar() invoca removeItem sobre window.sessionStorage y borra una clave que solo existe allí", function () {
                const clave = PREFIJO_TEST + "eliminar-session";
                setItemNativo.call(sessionStorage, clave, JSON.stringify("solo-en-session"));
                const spyRemove = spyOn(Storage.prototype, "removeItem").and.callThrough();

                expect(Almacenamiento.eliminar(clave)).toBe(true);

                const destinos = spyRemove.calls.all().map(function (llamada) { return llamada.object; });
                expect(destinos).toContain(window.sessionStorage);
                expect(destinos).toContain(window.localStorage);
                expect(sessionStorage.getItem(clave)).toBeNull();
            });

            it("RC7-16: listar() recorre window.sessionStorage e incluye claves que solo existen allí", function () {
                const clave = PREFIJO_TEST + "listar-session";
                setItemNativo.call(sessionStorage, clave, JSON.stringify(1));

                expect(localStorage.getItem(clave)).toBeNull();
                expect(Almacenamiento.listar(PREFIJO_TEST)).toContain(clave);
            });

            it("RC7-17: si removeItem falla solo en sessionStorage, eliminar() devuelve false sin lanzar y aun así borra de localStorage", function () {
                const clave = PREFIJO_TEST + "fallo-session";
                setItemNativo.call(localStorage, clave, JSON.stringify("local"));
                setItemNativo.call(sessionStorage, clave, JSON.stringify("session"));
                spyOn(Storage.prototype, "removeItem").and.callFake(function (k) {
                    if (this === window.sessionStorage) throw new DOMException("bloqueado", "SecurityError");
                    return removeItemNativo.call(this, k);
                });

                let resultado;
                expect(function () { resultado = Almacenamiento.eliminar(clave); }).not.toThrow();
                expect(resultado).toBe(false);
                expect(localStorage.getItem(clave)).toBeNull();
                expect(sessionStorage.getItem(clave)).toBe(JSON.stringify("session"));
                expect(console.error).toHaveBeenCalled();
            });
        });

        describe("Limpieza sin residuos", function () {
            it("RC7-18: limpiar() borra todas las entradas del prefijo repartidas en ambos storages, sin huérfanos", function () {
                for (let i = 0; i < 25; i++) {
                    const clave = PREFIJO_TEST + "masivo-" + i;
                    if (i % 3 !== 1) setItemNativo.call(localStorage, clave, JSON.stringify(i));
                    if (i % 3 !== 0) setItemNativo.call(sessionStorage, clave, JSON.stringify(i));
                }
                expect(Almacenamiento.listar(PREFIJO_TEST).length).toBeGreaterThan(25);

                expect(Almacenamiento.limpiar(PREFIJO_TEST)).toBe(true);

                expect(clavesConPrefijo(localStorage, PREFIJO_TEST)).toEqual([]);
                expect(clavesConPrefijo(sessionStorage, PREFIJO_TEST)).toEqual([]);
                expect(Almacenamiento.listar(PREFIJO_TEST)).toEqual([]);
            });

            it("RC7-19: limpiar() no toca claves de terceros ni claves que solo se parecen al prefijo", function () {
                const parecidas = ["otra-app:sesion", "planit:test", "xplanit:test-a", "PLANIT:TEST-a", "planit:testa"];
                parecidas.forEach(function (clave) {
                    sembrarExterna(localStorage, clave, "local-" + clave);
                    sembrarExterna(sessionStorage, clave, "session-" + clave);
                });
                Almacenamiento.guardar(PREFIJO_TEST + "propia", 1);
                setItemNativo.call(sessionStorage, PREFIJO_TEST + "propia-session", "1");
                const ajenasLocal = clavesAjenas(localStorage, PREFIJO_TEST);
                const ajenasSession = clavesAjenas(sessionStorage, PREFIJO_TEST);

                expect(Almacenamiento.limpiar(PREFIJO_TEST)).toBe(true);

                expect(clavesAjenas(localStorage, PREFIJO_TEST)).toEqual(ajenasLocal);
                expect(clavesAjenas(sessionStorage, PREFIJO_TEST)).toEqual(ajenasSession);
                parecidas.forEach(function (clave) {
                    expect(localStorage.getItem(clave)).toBe("local-" + clave);
                    expect(sessionStorage.getItem(clave)).toBe("session-" + clave);
                });
            });

            it("RC7-20: limpiar() es idempotente: una segunda llamada devuelve true y no altera nada", function () {
                Almacenamiento.guardar(PREFIJO_TEST + "idem", 1);
                expect(Almacenamiento.limpiar(PREFIJO_TEST)).toBe(true);
                const localTrasPrimera = clavesAjenas(localStorage);
                const sessionTrasPrimera = clavesAjenas(sessionStorage);

                expect(Almacenamiento.limpiar(PREFIJO_TEST)).toBe(true);

                expect(clavesAjenas(localStorage)).toEqual(localTrasPrimera);
                expect(clavesAjenas(sessionStorage)).toEqual(sessionTrasPrimera);
            });

            it("RC7-21: limpiar() devuelve false (residuo reportado) si una entrada no se pudo borrar de sessionStorage", function () {
                const clave = PREFIJO_TEST + "residuo";
                setItemNativo.call(localStorage, clave, JSON.stringify("local"));
                setItemNativo.call(sessionStorage, clave, JSON.stringify("session"));
                spyOn(Storage.prototype, "removeItem").and.callFake(function (k) {
                    if (this === window.sessionStorage) throw new DOMException("bloqueado", "SecurityError");
                    return removeItemNativo.call(this, k);
                });

                let resultado;
                expect(function () { resultado = Almacenamiento.limpiar(PREFIJO_TEST); }).not.toThrow();
                expect(resultado).toBe(false);
                expect(localStorage.getItem(clave)).toBeNull();
                expect(Almacenamiento.listar(PREFIJO_TEST)).toEqual([clave]);
            });
        });
    });
});
