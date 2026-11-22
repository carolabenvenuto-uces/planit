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
});
