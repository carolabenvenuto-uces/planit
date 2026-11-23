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

    /*
     * RC6 — Resiliencia ante fallas del storage.
     *
     * Contrato bajo prueba (cabecera de js/utils/storage.js): ninguna operación de
     * Almacenamiento lanza; las lecturas devuelven null / [] y las escrituras o
     * borrados devuelven false, para que el controlador siga funcionando en memoria.
     *
     * Técnica de aislamiento (nada toca el storage real de otras specs):
     *   - spyOnProperty(window, "localStorage" | "sessionStorage", "get") para simular
     *     storage ausente (null/undefined), inaccesible (el getter lanza) o un doble
     *     de prueba con fallas puntuales.
     *   - spyOn / spyOnProperty sobre Storage.prototype con un callFake que falla solo
     *     para la instancia elegida (local o session) y delega en el método original
     *     para la otra, así se prueba cada storage por separado.
     *   - Jasmine restaura todos los espías al terminar cada spec; además el afterEach
     *     de este bloque borra las claves sembradas usando referencias capturadas
     *     ANTES de cualquier espía (storages y métodos originales), para que la
     *     limpieza no dependa de los mocks activos.
     *   - console.error se espía en el beforeEach: Almacenamiento loguea por diseño
     *     cada falla y run-jasmine.js trata cualquier console.error sin mockear como
     *     error de la corrida.
     *
     * Nota de ruteo: CLAVES_SESSION está vacío (ver storage.js), así que guardar() y
     * cargar() siempre usan localStorage; eliminar() y listar() recorren ambos
     * storages. Por eso sessionStorage se cubre en ausencia/inaccesibilidad, borrado
     * y listado, y en lectura se verifica que una falla suya no afecte a cargar().
     */
    describe("RC6 — Resiliencia ante storage ausente, inaccesible o con errores", function () {
        const STORAGES = ["localStorage", "sessionStorage"];
        const REAL = { localStorage: window.localStorage, sessionStorage: window.sessionStorage };
        const ORIGINAL = {
            getItem: Storage.prototype.getItem,
            setItem: Storage.prototype.setItem,
            removeItem: Storage.prototype.removeItem,
            key: Storage.prototype.key,
            length: Object.getOwnPropertyDescriptor(Storage.prototype, "length").get
        };

        function sembrar(nombreStorage, clave, valor) {
            ORIGINAL.setItem.call(REAL[nombreStorage], clave, JSON.stringify(valor));
        }

        function leerCrudo(nombreStorage, clave) {
            return ORIGINAL.getItem.call(REAL[nombreStorage], clave);
        }

        function otroStorage(nombreStorage) {
            return nombreStorage === "localStorage" ? "sessionStorage" : "localStorage";
        }

        // DOMException con nombre estándar: el navegador asigna el código legacy
        // ("SecurityError" -> 18, "QuotaExceededError" -> 22).
        function crearSecurityError() {
            return new DOMException("The operation is insecure.", "SecurityError");
        }

        // Errores legacy cuyo name/code no se pueden fabricar con el constructor de
        // DOMException (code es de solo lectura y vale 0 para nombres no estándar).
        function crearErrorLegacy(nombre, codigo, extra) {
            const error = new Error(`${nombre} (code ${codigo})`);
            error.name = nombre;
            error.code = codigo;
            return Object.assign(error, extra || {});
        }

        // Hace fallar un método de Storage.prototype solo para la instancia indicada;
        // para la otra delega en el método real.
        function fallarMetodoEn(metodo, nombreStorage, error) {
            const original = ORIGINAL[metodo];
            return spyOn(Storage.prototype, metodo).and.callFake(function () {
                if (this === REAL[nombreStorage]) throw error;
                return original.apply(this, arguments);
            });
        }

        beforeEach(function () {
            spyOn(console, "error");
        });

        afterEach(function () {
            for (const nombre of STORAGES) {
                const storage = REAL[nombre];
                const claves = [];
                for (let i = 0; i < ORIGINAL.length.call(storage); i++) {
                    const clave = ORIGINAL.key.call(storage, i);
                    if (clave !== null && clave.startsWith(PREFIJO_TEST)) claves.push(clave);
                }
                claves.forEach(function (clave) { ORIGINAL.removeItem.call(storage, clave); });
            }
        });

        describe("Storage ausente o inaccesible", function () {
            STORAGES.forEach(function (nombre) {
                const otro = otroStorage(nombre);
                const escenarios = [
                    { id: "RC6-01", descripcion: `window.${nombre} es null`, simular: function (spy) { spy.and.returnValue(null); } },
                    { id: "RC6-02", descripcion: `window.${nombre} es undefined`, simular: function (spy) { spy.and.returnValue(undefined); } },
                    { id: "RC6-03", descripcion: `acceder a window.${nombre} lanza SecurityError (incógnito estricto / iframe cruzado)`, simular: function (spy) { spy.and.throwError(crearSecurityError()); } }
                ];

                escenarios.forEach(function (escenario) {
                    describe(`[${escenario.id}] ${escenario.descripcion}`, function () {
                        beforeEach(function () {
                            sembrar(otro, PREFIJO_TEST + "sobreviviente", "ok");
                            escenario.simular(spyOnProperty(window, nombre, "get"));
                        });

                        it("ninguna operación de Almacenamiento debería lanzar", function () {
                            expect(function () {
                                Almacenamiento.guardar(PREFIJO_TEST + "x", 1);
                                Almacenamiento.cargar(PREFIJO_TEST + "x");
                                Almacenamiento.obtener(PREFIJO_TEST + "x");
                                Almacenamiento.actualizar(PREFIJO_TEST + "x", 2);
                                Almacenamiento.eliminar(PREFIJO_TEST + "x");
                                Almacenamiento.listar(PREFIJO_TEST);
                                Almacenamiento.limpiar(PREFIJO_TEST);
                            }).not.toThrow();
                        });

                        it("eliminar() debería devolver false (no puede garantizar el borrado) y seguir con el otro storage", function () {
                            expect(Almacenamiento.eliminar(PREFIJO_TEST + "sobreviviente")).toBe(false);
                            expect(leerCrudo(otro, PREFIJO_TEST + "sobreviviente")).toBeNull();
                            expect(console.error).toHaveBeenCalled();
                        });

                        it(`listar() debería devolver igual las claves de ${otro}`, function () {
                            expect(Almacenamiento.listar(PREFIJO_TEST)).toEqual([PREFIJO_TEST + "sobreviviente"]);
                        });

                        if (nombre === "localStorage") {
                            it("guardar() debería devolver false y cargar() null (degradación a memoria)", function () {
                                expect(Almacenamiento.guardar(PREFIJO_TEST + "x", { a: 1 })).toBe(false);
                                expect(Almacenamiento.cargar(PREFIJO_TEST + "x")).toBeNull();
                                expect(console.error).toHaveBeenCalled();
                            });
                        } else {
                            it("guardar()/cargar() deberían seguir funcionando sobre localStorage (la falla queda aislada)", function () {
                                expect(Almacenamiento.guardar(PREFIJO_TEST + "x", { a: 1 })).toBe(true);
                                expect(Almacenamiento.cargar(PREFIJO_TEST + "x")).toEqual({ a: 1 });
                            });
                        }
                    });
                });
            });

            it("[RC6-04] sin ningún storage disponible, todas las operaciones degradan a valores seguros", function () {
                spyOnProperty(window, "localStorage", "get").and.throwError(crearSecurityError());
                spyOnProperty(window, "sessionStorage", "get").and.returnValue(null);

                expect(Almacenamiento.guardar(PREFIJO_TEST + "x", 1)).toBe(false);
                expect(Almacenamiento.actualizar(PREFIJO_TEST + "x", 1)).toBe(false);
                expect(Almacenamiento.cargar(PREFIJO_TEST + "x")).toBeNull();
                expect(Almacenamiento.obtener(PREFIJO_TEST + "x")).toBeNull();
                expect(Almacenamiento.eliminar(PREFIJO_TEST + "x")).toBe(false);
                expect(Almacenamiento.listar(PREFIJO_TEST)).toEqual([]);
                expect(function () { Almacenamiento.limpiar(PREFIJO_TEST); }).not.toThrow();
            });
        });

        describe("SecurityError en operaciones individuales", function () {
            it("[RC6-05] el SecurityError simulado debería ser el estándar W3C (name \"SecurityError\", code 18)", function () {
                const error = crearSecurityError();
                expect(error instanceof DOMException).toBe(true);
                expect(error.name).toBe("SecurityError");
                expect(error.code).toBe(18);
                expect(error.code).toBe(DOMException.SECURITY_ERR);
            });

            it("[RC6-06] guardar() debería devolver false si setItem lanza SecurityError, logueando el error original", function () {
                const error = crearSecurityError();
                fallarMetodoEn("setItem", "localStorage", error);

                expect(Almacenamiento.guardar(PREFIJO_TEST + "seguridad", "x")).toBe(false);
                expect(console.error).toHaveBeenCalledWith(jasmine.any(String), error);
            });

            it("[RC6-07] cargar() debería devolver null si getItem lanza SecurityError", function () {
                sembrar("localStorage", PREFIJO_TEST + "seguridad", "x");
                fallarMetodoEn("getItem", "localStorage", crearSecurityError());

                expect(Almacenamiento.cargar(PREFIJO_TEST + "seguridad")).toBeNull();
                expect(console.error).toHaveBeenCalled();
            });

            STORAGES.forEach(function (nombre) {
                it(`[RC6-08] eliminar() debería devolver false si removeItem lanza SecurityError en ${nombre}`, function () {
                    fallarMetodoEn("removeItem", nombre, crearSecurityError());

                    expect(Almacenamiento.eliminar(PREFIJO_TEST + "seguridad")).toBe(false);
                });
            });

            it("[RC6-09] un SecurityError legacy (name \"SECURITY_ERR\", code 18, sin DOMException) también debería capturarse", function () {
                const legacy = crearErrorLegacy("SECURITY_ERR", 18);
                spyOn(Storage.prototype, "setItem").and.callFake(function () { throw legacy; });

                expect(Almacenamiento.guardar(PREFIJO_TEST + "legacy", 1)).toBe(false);
                expect(console.error).toHaveBeenCalledWith(jasmine.any(String), legacy);
            });
        });

        describe("Errores de lectura (getItem)", function () {
            it("[RC6-10] cargar()/obtener() deberían devolver null si getItem lanza un error genérico", function () {
                sembrar("localStorage", PREFIJO_TEST + "lectura", "valor");
                fallarMetodoEn("getItem", "localStorage", new Error("Fallo de I/O simulado"));

                expect(function () { Almacenamiento.cargar(PREFIJO_TEST + "lectura"); }).not.toThrow();
                expect(Almacenamiento.cargar(PREFIJO_TEST + "lectura")).toBeNull();
                expect(Almacenamiento.obtener(PREFIJO_TEST + "lectura")).toBeNull();
            });

            it("[RC6-11] una falla de getItem en sessionStorage no debería afectar a cargar() (ruteo a localStorage)", function () {
                sembrar("localStorage", PREFIJO_TEST + "lectura", "valor");
                fallarMetodoEn("getItem", "sessionStorage", crearSecurityError());

                expect(Almacenamiento.cargar(PREFIJO_TEST + "lectura")).toBe("valor");
            });

            [
                { crudo: "{esto no es JSON", motivo: "objeto truncado" },
                { crudo: "[1, 2", motivo: "array truncado" },
                { crudo: "undefined", motivo: "literal undefined (no es JSON)" },
                { crudo: "NaN", motivo: "NaN (no es JSON)" },
                { crudo: "'comillas simples'", motivo: "string con comillas simples" },
                { crudo: "", motivo: "string vacío" }
            ].forEach(function (caso) {
                it(`[RC6-12] cargar() debería devolver null ante dato no deserializable: ${caso.motivo}`, function () {
                    ORIGINAL.setItem.call(REAL.localStorage, PREFIJO_TEST + "corrupto", caso.crudo);

                    expect(function () { Almacenamiento.cargar(PREFIJO_TEST + "corrupto"); }).not.toThrow();
                    expect(Almacenamiento.cargar(PREFIJO_TEST + "corrupto")).toBeNull();
                    expect(console.error).toHaveBeenCalled();
                });
            });
        });

        describe("Errores de borrado (removeItem / clear)", function () {
            STORAGES.forEach(function (nombre) {
                const otro = otroStorage(nombre);

                it(`[RC6-13] eliminar() debería devolver false si removeItem falla en ${nombre}, pero igual borrar de ${otro}`, function () {
                    const clave = PREFIJO_TEST + "borrado-parcial";
                    sembrar(nombre, clave, "queda");
                    sembrar(otro, clave, "se-borra");
                    fallarMetodoEn("removeItem", nombre, new Error("Fallo de borrado simulado"));

                    expect(Almacenamiento.eliminar(clave)).toBe(false);
                    expect(leerCrudo(otro, clave)).toBeNull();
                    expect(leerCrudo(nombre, clave)).not.toBeNull();
                });

                it(`[RC6-14] limpiar() debería devolver false sin lanzar si removeItem falla en ${nombre}`, function () {
                    sembrar(nombre, PREFIJO_TEST + "a", 1);
                    sembrar(otro, PREFIJO_TEST + "b", 2);
                    fallarMetodoEn("removeItem", nombre, crearSecurityError());

                    let resultado;
                    expect(function () { resultado = Almacenamiento.limpiar(PREFIJO_TEST); }).not.toThrow();
                    expect(resultado).toBe(false);
                    expect(leerCrudo(otro, PREFIJO_TEST + "b")).toBeNull();
                });
            });

            it("[RC6-15] limpiar() no debería depender de Storage.clear(): si clear() lanza, limpia igual y respeta otros prefijos", function () {
                const clear = spyOn(Storage.prototype, "clear").and.throwError(new Error("clear() no disponible"));
                sembrar("localStorage", PREFIJO_TEST + "a", 1);
                sembrar("sessionStorage", PREFIJO_TEST + "b", 2);
                ORIGINAL.setItem.call(REAL.localStorage, "planit:rc6-ajena", "\"intacta\"");

                expect(Almacenamiento.limpiar(PREFIJO_TEST)).toBe(true);
                expect(clear).not.toHaveBeenCalled();
                expect(Almacenamiento.listar(PREFIJO_TEST)).toEqual([]);
                expect(leerCrudo("localStorage", "planit:rc6-ajena")).toBe("\"intacta\"");

                ORIGINAL.removeItem.call(REAL.localStorage, "planit:rc6-ajena");
            });
        });

        describe("Errores de listado (key / length)", function () {
            STORAGES.forEach(function (nombre) {
                const otro = otroStorage(nombre);

                it(`[RC6-16] listar() debería devolver las claves de ${otro} si leer ${nombre}.length lanza`, function () {
                    sembrar(nombre, PREFIJO_TEST + "inaccesible", 1);
                    sembrar(otro, PREFIJO_TEST + "visible", 2);
                    spyOnProperty(Storage.prototype, "length", "get").and.callFake(function () {
                        if (this === REAL[nombre]) throw crearSecurityError();
                        return ORIGINAL.length.call(this);
                    });

                    expect(Almacenamiento.listar(PREFIJO_TEST)).toEqual([PREFIJO_TEST + "visible"]);
                    expect(console.error).toHaveBeenCalled();
                });

                it(`[RC6-17] listar() debería devolver las claves de ${otro} si ${nombre}.key() lanza`, function () {
                    sembrar(nombre, PREFIJO_TEST + "inaccesible", 1);
                    sembrar(otro, PREFIJO_TEST + "visible", 2);
                    fallarMetodoEn("key", nombre, new Error("Fallo de iteración simulado"));

                    expect(Almacenamiento.listar(PREFIJO_TEST)).toEqual([PREFIJO_TEST + "visible"]);
                    expect(console.error).toHaveBeenCalled();
                });
            });

            it("[RC6-18] listar() debería devolver [] sin lanzar si key() falla en ambos storages", function () {
                sembrar("localStorage", PREFIJO_TEST + "a", 1);
                sembrar("sessionStorage", PREFIJO_TEST + "b", 2);
                spyOn(Storage.prototype, "key").and.throwError(new Error("Fallo de iteración simulado"));

                expect(function () { Almacenamiento.listar(PREFIJO_TEST); }).not.toThrow();
                expect(Almacenamiento.listar(PREFIJO_TEST)).toEqual([]);
            });
        });

        describe("Códigos alternativos de cuota excedida", function () {
            const VARIANTES_CUOTA = [
                {
                    id: "RC6-19",
                    navegador: "estándar W3C / Chromium / Firefox actual",
                    crear: function () { return new DOMException("Quota exceeded", "QuotaExceededError"); },
                    name: "QuotaExceededError",
                    code: 22
                },
                {
                    id: "RC6-20",
                    navegador: "Firefox legacy (Gecko < 66)",
                    crear: function () { return crearErrorLegacy("NS_ERROR_DOM_QUOTA_REACHED", 1014); },
                    name: "NS_ERROR_DOM_QUOTA_REACHED",
                    code: 1014
                },
                {
                    id: "RC6-21",
                    navegador: "WebKit/Safari legacy (incluye Safari privado: cuota 0)",
                    crear: function () { return crearErrorLegacy("QUOTA_EXCEEDED_ERR", 22); },
                    name: "QUOTA_EXCEEDED_ERR",
                    code: 22
                },
                {
                    id: "RC6-22",
                    navegador: "Internet Explorer / Edge legacy (E_OUTOFMEMORY, number -2147024882)",
                    crear: function () { return crearErrorLegacy("Error", 0, { number: -2147024882 }); },
                    name: "Error",
                    code: 0
                }
            ];

            VARIANTES_CUOTA.forEach(function (variante) {
                describe(`[${variante.id}] ${variante.navegador}`, function () {
                    it(`el error simulado debería tener name "${variante.name}" y code ${variante.code}`, function () {
                        const error = variante.crear();
                        expect(error.name).toBe(variante.name);
                        expect(error.code).toBe(variante.code);
                    });

                    it("guardar()/actualizar() deberían devolver false sin lanzar y loguear el error original", function () {
                        const error = variante.crear();
                        spyOn(Storage.prototype, "setItem").and.callFake(function () { throw error; });

                        expect(function () { Almacenamiento.guardar(PREFIJO_TEST + "cuota", { a: 1 }); }).not.toThrow();
                        expect(Almacenamiento.guardar(PREFIJO_TEST + "cuota", { a: 1 })).toBe(false);
                        expect(Almacenamiento.actualizar(PREFIJO_TEST + "cuota", { a: 1 })).toBe(false);
                        expect(console.error).toHaveBeenCalledWith(jasmine.any(String), error);
                    });

                    it("el valor previo de la clave debería quedar intacto (sin escritura parcial)", function () {
                        sembrar("localStorage", PREFIJO_TEST + "cuota", "previo");
                        const error = variante.crear();
                        spyOn(Storage.prototype, "setItem").and.callFake(function () { throw error; });

                        Almacenamiento.guardar(PREFIJO_TEST + "cuota", "nuevo");

                        expect(Almacenamiento.cargar(PREFIJO_TEST + "cuota")).toBe("previo");
                    });
                });
            });

            STORAGES.forEach(function (nombre) {
                it(`[RC6-23] la cuota excedida en ${nombre} no debería impedir leer, listar ni borrar`, function () {
                    sembrar(nombre, PREFIJO_TEST + "lleno", "dato");
                    fallarMetodoEn("setItem", nombre, new DOMException("Quota exceeded", "QuotaExceededError"));

                    expect(Almacenamiento.listar(PREFIJO_TEST)).toEqual([PREFIJO_TEST + "lleno"]);
                    if (nombre === "localStorage") {
                        expect(Almacenamiento.cargar(PREFIJO_TEST + "lleno")).toBe("dato");
                    }
                    expect(Almacenamiento.eliminar(PREFIJO_TEST + "lleno")).toBe(true);
                    expect(leerCrudo(nombre, PREFIJO_TEST + "lleno")).toBeNull();
                });
            });
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
});
