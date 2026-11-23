/*
 * Suite de la fachada de persistencia (RC22): js/services/ServicioPersistenciaEvento.js.
 *
 * Se inyecta un doble en memoria con el mismo contrato que `Almacenamiento`
 * (guardar/cargar/eliminar) para probar la fachada aislada del storage real,
 * más una prueba de integración con el `Almacenamiento` verdadero.
 */

function crearAlmacenamientoEnMemoria() {
    const datos = new Map();
    return {
        datos,
        guardar(clave, valor) {
            if (valor === undefined) return false;
            datos.set(clave, JSON.stringify(valor));
            return true;
        },
        cargar(clave) {
            return datos.has(clave) ? JSON.parse(datos.get(clave)) : null;
        },
        eliminar(clave) {
            datos.delete(clave);
            return true;
        }
    };
}

function crearEventoDePrueba() {
    const evento = new Evento("Evento de prueba", "boda", 500000);
    evento.presupuesto.agregarItem(new ItemContratado("Catering", "Finger food", 10, 3500));
    evento.invitados.agregar("Juan Pérez", "Confirmado");
    return evento;
}

describe("ServicioPersistenciaEvento (fachada de persistencia, RC22)", function () {
    let almacenamiento;
    let servicio;

    beforeEach(function () {
        almacenamiento = crearAlmacenamientoEnMemoria();
        servicio = new ServicioPersistenciaEvento(almacenamiento);
    });

    describe("estaDisponible", function () {
        it("debería ser true con un almacenamiento que cumple el contrato", function () {
            expect(servicio.estaDisponible()).toBe(true);
        });

        it("debería ser false sin almacenamiento o con uno incompleto", function () {
            expect(new ServicioPersistenciaEvento(null).estaDisponible()).toBe(false);
            expect(new ServicioPersistenciaEvento({ guardar() {} }).estaDisponible()).toBe(false);
        });

        it("debería usar el Almacenamiento global por defecto", function () {
            expect(new ServicioPersistenciaEvento().estaDisponible()).toBe(true);
        });
    });

    describe("guardar / cargar (ciclo de serialización e hidratación)", function () {
        it("debería devolver una instancia de Evento hidratada con presupuesto e invitados", function () {
            expect(servicio.guardar(crearEventoDePrueba())).toBe(true);

            const { evento, origen, datosDanados } = servicio.cargar();

            expect(evento instanceof Evento).toBe(true);
            expect(evento.nombre).toBe("Evento de prueba");
            expect(evento.presupuesto.calcularTotal()).toBe(35000);
            expect(evento.invitados.invitados.length).toBe(1);
            expect(origen).toBe(ServicioPersistenciaEvento.ORIGENES.almacenamiento);
            expect(datosDanados).toBe(false);
        });

        it("debería guardar y recuperar los detalles de agenda junto con el evento", function () {
            servicio.guardar(crearEventoDePrueba(), { fecha: "2026-12-01", ubicacion: "Pilar" });

            expect(servicio.cargar().detalles).toEqual({ fecha: "2026-12-01", ubicacion: "Pilar" });
        });

        it("debería serializar con toJSON: el storage solo recibe datos planos", function () {
            servicio.guardarEvento(crearEventoDePrueba());

            const claves = Array.from(almacenamiento.datos.keys());
            expect(claves.length).toBe(1);
            expect(claves[0].startsWith("planit:")).toBe(true);
            expect(JSON.parse(almacenamiento.datos.get(claves[0])).nombre).toBe("Evento de prueba");
        });

        it("debería rechazar algo que no sea un Evento", function () {
            expect(function () { servicio.guardarEvento({ nombre: "x" }); }).toThrowError(TypeError);
        });

        it("debería devolver false si el storage subyacente falla o lanza", function () {
            spyOn(almacenamiento, "guardar").and.returnValue(false);
            expect(servicio.guardar(crearEventoDePrueba())).toBe(false);

            almacenamiento.guardar.and.throwError("cuota excedida");
            expect(servicio.guardar(crearEventoDePrueba())).toBe(false);
        });

        it("debería devolver false sin almacenamiento disponible", function () {
            expect(new ServicioPersistenciaEvento(null).guardar(crearEventoDePrueba())).toBe(false);
        });
    });

    describe("cargar sin estado persistido (semillas)", function () {
        it("debería devolver evento null y origen 'ninguno' si no hay datos ni semilla", function () {
            const estado = servicio.cargar();

            expect(estado.evento).toBeNull();
            expect(estado.detalles).toBeNull();
            expect(estado.origen).toBe(ServicioPersistenciaEvento.ORIGENES.ninguno);
        });

        it("debería usar la fábrica de semilla si no hay evento guardado", function () {
            const semilla = jasmine.createSpy("semilla").and.callFake(crearEventoDePrueba);

            const estado = servicio.cargar(semilla);

            expect(semilla).toHaveBeenCalledTimes(1);
            expect(estado.evento.nombre).toBe("Evento de prueba");
            expect(estado.origen).toBe(ServicioPersistenciaEvento.ORIGENES.semilla);
        });

        it("no debería invocar la semilla si hay un evento guardado", function () {
            servicio.guardar(crearEventoDePrueba());
            const semilla = jasmine.createSpy("semilla");

            servicio.cargar(semilla);

            expect(semilla).not.toHaveBeenCalled();
        });

        it("debería marcar datosDanados y usar la semilla si el evento guardado es inválido", function () {
            almacenamiento.datos.set("planit:evento", JSON.stringify({ nombre: "", tipo: "congreso" }));

            const estado = servicio.cargar(crearEventoDePrueba);

            expect(estado.datosDanados).toBe(true);
            expect(estado.origen).toBe(ServicioPersistenciaEvento.ORIGENES.semilla);
            expect(estado.evento.nombre).toBe("Evento de prueba");
        });

        it("debería propagar el error si la semilla no se puede crear", function () {
            expect(function () {
                servicio.cargar(function () { throw new Error("sin marcado"); });
            }).toThrowError("sin marcado");
        });

        it("debería ignorar detalles con formato inválido", function () {
            almacenamiento.datos.set("planit:detalles-evento", JSON.stringify(["no", "objeto"]));

            expect(servicio.cargar().detalles).toBeNull();
        });
    });

    describe("limpiar", function () {
        it("debería borrar todo el estado persistido por la fachada", function () {
            servicio.guardar(crearEventoDePrueba(), { fecha: "2026-12-01", ubicacion: "Pilar" });

            expect(servicio.limpiar()).toBe(true);
            expect(almacenamiento.datos.size).toBe(0);
            expect(servicio.cargar().evento).toBeNull();
        });

        it("debería devolver false sin almacenamiento disponible", function () {
            expect(new ServicioPersistenciaEvento(null).limpiar()).toBe(false);
        });
    });
});
