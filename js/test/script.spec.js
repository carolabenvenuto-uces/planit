describe("Flujo 1: Crear evento", function () {
    describe("validarDatosEvento", function () {
        it("debería aceptar nombre, tipo 'boda' y presupuesto '50000' como texto crudo de prompt()", function () {
            expect(validarDatosEvento("Boda de Ana", "boda", "50000")).toBe(true);
        });

        it("debería rechazar un nombre vacío o solo con espacios", function () {
            expect(validarDatosEvento("", "boda", "50000")).toBe(false);
            expect(validarDatosEvento(" ", "boda", "50000")).toBeFalsy();
        });

        it("debería rechazar un tipo fuera de la lista permitida", function () {
            expect(validarDatosEvento("Evento", "congreso", "50000")).toBe(false);
        });

        it("debería rechazar un presupuesto de 0", function () {
            expect(validarDatosEvento("Evento", "boda", 0)).toBe(false);
            expect(validarDatosEvento("Evento", "boda", "0")).toBe(false);
        });

        it("debería rechazar un presupuesto negativo", function () {
            expect(validarDatosEvento("Evento", "boda", -100)).toBe(false);
        });

        it("debería rechazar un presupuesto no numérico", function () {
            expect(validarDatosEvento("Evento", "boda", "abc")).toBe(false);
        });

        it("debería rechazar datos null o undefined (prompt() cancelado)", function () {
            expect(validarDatosEvento(null, null, null)).toBe(false);
            expect(validarDatosEvento("Evento", "boda", undefined)).toBe(false);
        });

        it("debería rechazar un nombre que no es texto", function () {
            expect(validarDatosEvento(123, "boda", "50000")).toBe(false);
        });

        it("debería rechazar un presupuesto infinito y aceptar uno muy grande pero finito", function () {
            expect(validarDatosEvento("Evento", "boda", "1e309")).toBe(false);
            expect(validarDatosEvento("Evento", "boda", Number.MAX_SAFE_INTEGER)).toBe(true);
        });
    });

    describe("crearEvento", function () {
        it("debería devolver un objeto con las propiedades nombre, tipo y presupuesto", function () {
            const evento = crearEvento(" Cumple de Sofía ", "Cumpleaños", "50000");

            expect(evento).toEqual({ nombre: "Cumple de Sofía", tipo: "cumpleaños", presupuesto: 50000 });
            expect(Object.keys(evento)).toContain("nombre");
            expect(Object.keys(evento)).toContain("tipo");
            expect(Object.keys(evento)).toContain("presupuesto");
        });
    });

    describe("agregarEvento", function () {
        it("debería devolver un array nuevo que contiene el evento sin modificar el original", function () {
            const original = [{ nombre: "Uno", tipo: "boda", presupuesto: 1000 }];
            const copiaAntes = JSON.parse(JSON.stringify(original));
            const nuevo = { nombre: "Dos", tipo: "salida casual", presupuesto: 2000 };

            const resultado = agregarEvento(original, nuevo);

            expect(resultado).not.toBe(original);
            expect(resultado.length).toBe(2);
            expect(resultado).toContain(nuevo);
            expect(original.length).toBe(1);
            expect(original).toEqual(copiaAntes);
        });
    });
});

describe("Flujo 2: Calcular presupuesto", function () {
    describe("calcularTotalItems", function () {
        it("debería devolver 580000 para itemsContratados", function () {
            expect(calcularTotalItems(itemsContratados)).toBe(580000);
        });

        it("debería devolver 0 con un array vacío", function () {
            expect(calcularTotalItems([])).toBe(0);
        });
    });

    describe("aplicarDescuento", function () {
        it("debería devolver 90000 al aplicar 10% a 100000", function () {
            expect(aplicarDescuento(100000, 10)).toBe(90000);
        });

        it("debería dejar el total sin cambios con 0% y devolver 0 con 100%", function () {
            expect(aplicarDescuento(100000, 0)).toBe(100000);
            expect(aplicarDescuento(100000, 100)).toBe(0);
        });

        it("debería lanzar un error con un porcentaje negativo", function () {
            expect(function () { aplicarDescuento(100000, -5); }).toThrow();
        });

        it("debería lanzar un error con un porcentaje mayor a 100", function () {
            expect(function () { aplicarDescuento(100000, 101); }).toThrow();
        });

        it("debería lanzar un error con un porcentaje no numérico", function () {
            expect(function () { aplicarDescuento(100000, "abc"); }).toThrow();
        });

        it("debería lanzar un error con un porcentaje null o undefined", function () {
            expect(function () { aplicarDescuento(100000, null); }).toThrow();
            expect(function () { aplicarDescuento(100000, undefined); }).toThrow();
        });
    });

    describe("superaPresupuesto", function () {
        it("debería devolver true cuando el total es mayor al presupuesto estimado", function () {
            expect(superaPresupuesto(PRESUPUESTO_EJEMPLO + 1, PRESUPUESTO_EJEMPLO)).toBe(true);
        });

        it("debería devolver false cuando el total es igual al presupuesto estimado", function () {
            expect(superaPresupuesto(PRESUPUESTO_EJEMPLO, PRESUPUESTO_EJEMPLO)).toBe(false);
        });

        it("debería devolver false cuando el total es menor al presupuesto estimado", function () {
            expect(superaPresupuesto(580000, PRESUPUESTO_EJEMPLO)).toBeFalsy();
        });
    });

    describe("obtenerPresupuestoEstimado", function () {
        it("debería devolver PRESUPUESTO_EJEMPLO cuando no hay eventos creados", function () {
            expect(obtenerPresupuestoEstimado([])).toBe(PRESUPUESTO_EJEMPLO);
        });

        it("debería devolver el presupuesto del último evento creado", function () {
            const listaEventos = [
                { nombre: "Uno", tipo: "boda", presupuesto: 300000 },
                { nombre: "Dos", tipo: "cumpleaños", presupuesto: 450000 }
            ];

            expect(obtenerPresupuestoEstimado(listaEventos)).toBe(450000);
        });
    });
});

describe("Flujo 3: Buscar en catálogo", function () {
    describe("buscarEnCatalogo", function () {
        it("debería devolver un array con 'Flores Pilar' al buscar ese nombre", function () {
            const resultados = buscarEnCatalogo(catalogoProveedores, "Flores Pilar");

            expect(resultados.length).toBe(1);
            expect(resultados[0].nombre).toBe("Flores Pilar");
        });

        it("debería devolver los proveedores de la categoría 'Catering'", function () {
            const resultados = buscarEnCatalogo(catalogoProveedores, "Catering");

            expect(resultados.length).toBe(1);
            expect(resultados).toContain(catalogoProveedores[0]);
            expect(resultados[0].categoria).toBe("Catering");
        });

        it("debería encontrar 'DJ Lucas & Sonido' sin distinguir mayúsculas de minúsculas", function () {
            const resultados = buscarEnCatalogo(catalogoProveedores, "dj lucas");

            expect(resultados.length).toBe(1);
            expect(resultados[0].nombre).toBe("DJ Lucas & Sonido");
        });

        it("debería devolver un array vacío cuando no hay coincidencias", function () {
            expect(buscarEnCatalogo(catalogoProveedores, "inexistente")).toEqual([]);
        });

        it("debería lanzar un error con un criterio vacío", function () {
            expect(function () { buscarEnCatalogo(catalogoProveedores, ""); }).toThrow();
            expect(function () { buscarEnCatalogo(catalogoProveedores, " "); }).toThrow();
        });

        it("debería lanzar un error con un criterio null o undefined", function () {
            expect(function () { buscarEnCatalogo(catalogoProveedores, null); }).toThrow();
            expect(function () { buscarEnCatalogo(catalogoProveedores, undefined); }).toThrow();
        });

        it("no debería modificar el catálogo original después de buscar", function () {
            const largoAntes = catalogoProveedores.length;
            const fotoAntes = JSON.stringify(catalogoProveedores);

            buscarEnCatalogo(catalogoProveedores, "Sonido");

            expect(catalogoProveedores.length).toBe(largoAntes);
            expect(JSON.stringify(catalogoProveedores)).toBe(fotoAntes);
        });
    });

    describe("coincideCon", function () {
        it("debería existir en cada proveedor y devolver true con su propio nombre", function () {
            catalogoProveedores.forEach(function (proveedor) {
                expect(typeof proveedor.coincideCon).toBe("function");
                expect(proveedor.coincideCon(proveedor.nombre)).toBe(true);
            });
        });

        it("debería devolver false con un criterio que no es texto", function () {
            expect(catalogoProveedores[0].coincideCon(null)).toBe(false);
        });
    });
});

describe("Flujo 4: Gestionar invitados", function () {
    describe("validarInvitado", function () {
        it("debería aceptar un nombre válido con estado 'Confirmado' o 'Pendiente'", function () {
            expect(validarInvitado("Lucía Pérez", "Confirmado")).toBe(true);
            expect(validarInvitado("Lucía Pérez", "Pendiente")).toBeTruthy();
        });

        it("debería devolver false con un nombre vacío", function () {
            expect(validarInvitado("", "Confirmado")).toBe(false);
            expect(validarInvitado(" ", "Pendiente")).toBeFalsy();
        });

        it("debería devolver false con un estado inválido", function () {
            expect(validarInvitado("Lucía Pérez", "Declinado")).toBe(false);
        });

        it("debería devolver false con nombre o estado null/undefined", function () {
            expect(validarInvitado("Lucía Pérez", null)).toBe(false);
            expect(validarInvitado(undefined, "Confirmado")).toBe(false);
        });
    });

    describe("agregarInvitado", function () {
        it("debería devolver un array nuevo con el invitado como objeto sin modificar el original", function () {
            const original = [{ nombre: "Ana", estado: "Confirmado" }];
            const copiaAntes = JSON.parse(JSON.stringify(original));

            const resultado = agregarInvitado(original, "Lucía Pérez", "Pendiente");

            expect(resultado).not.toBe(original);
            expect(resultado.length).toBe(2);
            expect(resultado[1]).toEqual({ nombre: "Lucía Pérez", estado: "Pendiente" });
            expect(original.length).toBe(1);
            expect(original).toEqual(copiaAntes);
        });

        it("debería lanzar un error con un nombre vacío", function () {
            expect(function () { agregarInvitado([], "", "Confirmado"); }).toThrow();
        });

        it("debería lanzar un error con un estado inválido", function () {
            expect(function () { agregarInvitado([], "Lucía Pérez", "Declinado"); }).toThrow();
        });

        it("debería lanzar un error con un nombre null", function () {
            expect(function () { agregarInvitado([], null, "Confirmado"); }).toThrow();
        });
    });

    describe("contarAsistencia", function () {
        it("debería devolver { confirmados: 3, pendientes: 2 } con los invitados de ejemplo", function () {
            expect(contarAsistencia(invitados)).toEqual({ confirmados: 3, pendientes: 2 });
        });

        it("debería devolver { confirmados: 0, pendientes: 0 } con una lista vacía", function () {
            expect(contarAsistencia([])).toEqual({ confirmados: 0, pendientes: 0 });
        });
    });
});