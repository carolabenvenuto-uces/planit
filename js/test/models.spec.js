describe("models.spec.js", function () {

describe("Validador", function () {
    describe("esTextoNoVacio", function () {
        it("debería devolver true con un texto con contenido", function () {
            expect(Validador.esTextoNoVacio("Hola")).toBe(true);
        });

        it("debería devolver false con texto vacío, solo espacios, null, undefined o no-texto", function () {
            expect(Validador.esTextoNoVacio("")).toBe(false);
            expect(Validador.esTextoNoVacio("   ")).toBe(false);
            expect(Validador.esTextoNoVacio(null)).toBe(false);
            expect(Validador.esTextoNoVacio(undefined)).toBe(false);
            expect(Validador.esTextoNoVacio(123)).toBe(false);
        });
    });

    describe("convertirANumero", function () {
        it("debería devolver el mismo número si ya es number", function () {
            expect(Validador.convertirANumero(42)).toBe(42);
        });

        it("debería convertir un texto numérico", function () {
            expect(Validador.convertirANumero("42")).toBe(42);
            expect(Validador.convertirANumero("  42  ")).toBe(42);
        });

        it("debería devolver NaN con texto no numérico, vacío, null o undefined", function () {
            expect(Validador.convertirANumero("abc")).toBeNaN();
            expect(Validador.convertirANumero("")).toBeNaN();
            expect(Validador.convertirANumero(null)).toBeNaN();
            expect(Validador.convertirANumero(undefined)).toBeNaN();
        });
    });

    describe("normalizarTexto", function () {
        it("debería pasar a minúsculas y quitar tildes", function () {
            expect(Validador.normalizarTexto("Decoración")).toBe("decoracion");
            expect(Validador.normalizarTexto("  CATERING  ")).toBe("catering");
        });
    });

    describe("buscarOpcion", function () {
        const opciones = ["Confirmado", "Pendiente"];

        it("debería encontrar la opción sin distinguir mayúsculas ni tildes", function () {
            expect(Validador.buscarOpcion(opciones, "confirmado")).toBe("Confirmado");
            expect(Validador.buscarOpcion(opciones, "PENDIENTE")).toBe("Pendiente");
        });

        it("debería devolver undefined si no hay coincidencia o el valor está vacío", function () {
            expect(Validador.buscarOpcion(opciones, "Declinado")).toBeUndefined();
            expect(Validador.buscarOpcion(opciones, "")).toBeUndefined();
            expect(Validador.buscarOpcion(opciones, null)).toBeUndefined();
        });
    });
});

describe("ItemContratado", function () {
    it("debería crear un ítem válido y calcular su subtotal", function () {
        const item = new ItemContratado("Catering", "Finger food", 120, 3500);

        expect(item.categoria).toBe("Catering");
        expect(item.descripcion).toBe("Finger food");
        expect(item.cantidad).toBe(120);
        expect(item.precioUnitario).toBe(3500);
        expect(item.calcularSubtotal()).toBe(420000);
    });

    it("debería aceptar cantidad y precio como texto numérico", function () {
        const item = new ItemContratado("Sonido", "DJ", "6", "8000");
        expect(item.calcularSubtotal()).toBe(48000);
    });

    it("debería lanzar un error con categoría o descripción vacía", function () {
        expect(function () { new ItemContratado("", "Finger food", 1, 100); }).toThrowError();
        expect(function () { new ItemContratado("Catering", "", 1, 100); }).toThrowError();
    });

    it("debería lanzar un error con cantidad o precio negativo o no numérico", function () {
        expect(function () { new ItemContratado("Catering", "Finger food", -1, 100); }).toThrowError();
        expect(function () { new ItemContratado("Catering", "Finger food", 1, -100); }).toThrowError();
        expect(function () { new ItemContratado("Catering", "Finger food", "abc", 100); }).toThrowError();
    });

    it("debería reconstruirse igual a sí mismo con fromJSON(toJSON())", function () {
        const original = new ItemContratado("Transporte", "Traslado", 2, 5000);
        const reconstruido = ItemContratado.fromJSON(original.toJSON());

        expect(reconstruido.categoria).toBe(original.categoria);
        expect(reconstruido.descripcion).toBe(original.descripcion);
        expect(reconstruido.cantidad).toBe(original.cantidad);
        expect(reconstruido.precioUnitario).toBe(original.precioUnitario);
    });

    it("fromJSON debería lanzar un error con datos inválidos", function () {
        expect(function () { ItemContratado.fromJSON(null); }).toThrowError();
        expect(function () { ItemContratado.fromJSON([]); }).toThrowError();
    });
});

describe("Presupuesto", function () {
    let presupuesto;

    beforeEach(function () {
        presupuesto = new Presupuesto();
    });

    it("debería empezar vacío", function () {
        expect(presupuesto.items).toEqual([]);
        expect(presupuesto.calcularTotal()).toBe(0);
    });

    it("agregarItem debería acumular el total de los ítems", function () {
        presupuesto.agregarItem(new ItemContratado("Catering", "Finger food", 120, 3500));
        presupuesto.agregarItem(new ItemContratado("Sonido", "DJ", 6, 8000));

        expect(presupuesto.items.length).toBe(2);
        expect(presupuesto.calcularTotal()).toBe(468000);
    });

    it("agregarItem debería lanzar un error si no es un ItemContratado", function () {
        expect(function () { presupuesto.agregarItem({ categoria: "Catering" }); }).toThrowError();
    });

    it("eliminarItem debería quitar el ítem en el índice indicado", function () {
        const item1 = presupuesto.agregarItem(new ItemContratado("Catering", "Finger food", 120, 3500));
        presupuesto.agregarItem(new ItemContratado("Sonido", "DJ", 6, 8000));

        const eliminado = presupuesto.eliminarItem(0);

        expect(eliminado).toBe(item1);
        expect(presupuesto.items.length).toBe(1);
        expect(presupuesto.items[0].categoria).toBe("Sonido");
    });

    it("eliminarItem debería lanzar un error con un índice fuera de rango", function () {
        expect(function () { presupuesto.eliminarItem(0); }).toThrowError();
        expect(function () { presupuesto.eliminarItem(-1); }).toThrowError();
    });

    it("items debería devolver una copia: modificarla no afecta al presupuesto", function () {
        presupuesto.agregarItem(new ItemContratado("Catering", "Finger food", 120, 3500));
        const copia = presupuesto.items;
        copia.pop();

        expect(presupuesto.items.length).toBe(1);
    });

    describe("aplicarDescuento", function () {
        beforeEach(function () {
            presupuesto.agregarItem(new ItemContratado("Catering", "Finger food", 1, 100000));
        });

        it("debería aplicar el porcentaje correctamente", function () {
            expect(presupuesto.aplicarDescuento(10)).toBe(90000);
            expect(presupuesto.aplicarDescuento(0)).toBe(100000);
            expect(presupuesto.aplicarDescuento(100)).toBe(0);
        });

        it("debería lanzar un error con un porcentaje fuera de 0-100 o no numérico", function () {
            expect(function () { presupuesto.aplicarDescuento(-1); }).toThrowError();
            expect(function () { presupuesto.aplicarDescuento(101); }).toThrowError();
            expect(function () { presupuesto.aplicarDescuento("abc"); }).toThrowError();
            expect(function () { presupuesto.aplicarDescuento(null); }).toThrowError();
        });
    });

    describe("superaLimite", function () {
        beforeEach(function () {
            presupuesto.agregarItem(new ItemContratado("Catering", "Finger food", 1, 100000));
        });

        it("debería devolver true/false según corresponda", function () {
            expect(presupuesto.superaLimite(99999)).toBe(true);
            expect(presupuesto.superaLimite(100000)).toBe(false);
            expect(presupuesto.superaLimite(100001)).toBe(false);
        });

        it("debería lanzar un error con un límite inválido", function () {
            expect(function () { presupuesto.superaLimite(-1); }).toThrowError();
            expect(function () { presupuesto.superaLimite("abc"); }).toThrowError();
        });
    });

    it("debería reconstruirse igual a sí mismo con fromJSON(toJSON())", function () {
        presupuesto.agregarItem(new ItemContratado("Catering", "Finger food", 120, 3500));
        presupuesto.agregarItem(new ItemContratado("Sonido", "DJ", 6, 8000));

        const reconstruido = Presupuesto.fromJSON(presupuesto.toJSON());

        expect(reconstruido.calcularTotal()).toBe(presupuesto.calcularTotal());
        expect(reconstruido.items.length).toBe(presupuesto.items.length);
    });

    it("fromJSON debería lanzar un error con datos inválidos", function () {
        expect(function () { Presupuesto.fromJSON(null); }).toThrowError();
        expect(function () { Presupuesto.fromJSON({ items: "no-es-array" }); }).toThrowError();
    });
});

describe("Invitado", function () {
    it("debería crear un invitado válido con estado normalizado", function () {
        const invitado = new Invitado("Juan Pérez", "confirmado");

        expect(invitado.nombre).toBe("Juan Pérez");
        expect(invitado.estado).toBe("Confirmado");
        expect(invitado.esConfirmado()).toBe(true);
    });

    it("debería lanzar un error con nombre vacío o estado inválido", function () {
        expect(function () { new Invitado("", "Confirmado"); }).toThrowError();
        expect(function () { new Invitado("Juan Pérez", "Declinado"); }).toThrowError();
        expect(function () { new Invitado(null, "Confirmado"); }).toThrowError();
    });

    it("cambiarEstado debería actualizar el estado con una opción válida", function () {
        const invitado = new Invitado("Juan Pérez", "Pendiente");
        invitado.cambiarEstado("Confirmado");

        expect(invitado.estado).toBe("Confirmado");
        expect(invitado.esConfirmado()).toBe(true);
    });

    it("cambiarEstado debería lanzar un error con un estado inválido", function () {
        const invitado = new Invitado("Juan Pérez", "Pendiente");
        expect(function () { invitado.cambiarEstado("Declinado"); }).toThrowError();
    });

    it("debería reconstruirse igual a sí mismo con fromJSON(toJSON())", function () {
        const original = new Invitado("Ana Gómez", "Pendiente");
        const reconstruido = Invitado.fromJSON(original.toJSON());

        expect(reconstruido.nombre).toBe(original.nombre);
        expect(reconstruido.estado).toBe(original.estado);
    });

    it("fromJSON debería lanzar un error con datos inválidos", function () {
        expect(function () { Invitado.fromJSON(null); }).toThrowError();
        expect(function () { Invitado.fromJSON([]); }).toThrowError();
    });
});

describe("ListaInvitados", function () {
    let lista;

    beforeEach(function () {
        lista = new ListaInvitados();
    });

    it("debería empezar vacía", function () {
        expect(lista.invitados).toEqual([]);
        expect(lista.contarAsistencia()).toEqual({ confirmados: 0, pendientes: 0 });
    });

    it("agregar debería crear y agregar un Invitado", function () {
        const invitado = lista.agregar("Juan Pérez", "Confirmado");

        expect(invitado instanceof Invitado).toBe(true);
        expect(lista.invitados.length).toBe(1);
        expect(lista.invitados[0].nombre).toBe("Juan Pérez");
    });

    it("agregar debería permitir nombres duplicados (sin unicidad forzada por el modelo)", function () {
        lista.agregar("Juan Pérez", "Pendiente");
        lista.agregar("Juan Pérez", "Confirmado");

        expect(lista.invitados.length).toBe(2);
    });

    it("agregar debería lanzar un error con datos inválidos", function () {
        expect(function () { lista.agregar("", "Confirmado"); }).toThrowError();
        expect(function () { lista.agregar("Juan Pérez", "Declinado"); }).toThrowError();
    });

    it("eliminar debería quitar la primera coincidencia por nombre (sin distinguir mayúsculas ni tildes) y devolver true", function () {
        lista.agregar("José Pérez", "Pendiente");

        expect(lista.eliminar("jose perez")).toBe(true);
        expect(lista.invitados.length).toBe(0);
    });

    it("eliminar debería devolver false si el nombre no existe", function () {
        lista.agregar("Ana Gómez", "Confirmado");
        expect(lista.eliminar("Inexistente")).toBe(false);
        expect(lista.invitados.length).toBe(1);
    });

    it("eliminar debería lanzar un error con un nombre vacío", function () {
        expect(function () { lista.eliminar(""); }).toThrowError();
    });

    it("contarAsistencia debería contar correctamente confirmados y pendientes", function () {
        lista.agregar("Uno", "Confirmado");
        lista.agregar("Dos", "Confirmado");
        lista.agregar("Tres", "Pendiente");

        expect(lista.contarAsistencia()).toEqual({ confirmados: 2, pendientes: 1 });
    });

    it("invitados debería devolver una copia: modificarla no afecta a la lista", function () {
        lista.agregar("Uno", "Confirmado");
        const copia = lista.invitados;
        copia.pop();

        expect(lista.invitados.length).toBe(1);
    });

    it("debería reconstruirse igual a sí misma con fromJSON(toJSON())", function () {
        lista.agregar("Uno", "Confirmado");
        lista.agregar("Dos", "Pendiente");

        const reconstruida = ListaInvitados.fromJSON(lista.toJSON());

        expect(reconstruida.invitados.length).toBe(2);
        expect(reconstruida.contarAsistencia()).toEqual(lista.contarAsistencia());
    });

    it("fromJSON debería lanzar un error con datos inválidos", function () {
        expect(function () { ListaInvitados.fromJSON(null); }).toThrowError();
        expect(function () { ListaInvitados.fromJSON({ invitados: "no-es-array" }); }).toThrowError();
    });
});

describe("Evento", function () {
    it("debería crear un evento válido con tipo normalizado y componentes vacíos", function () {
        const evento = new Evento("Casamiento de Sofi & Mateo", "BODA", "700000");

        expect(evento.nombre).toBe("Casamiento de Sofi & Mateo");
        expect(evento.tipo).toBe("boda");
        expect(evento.presupuestoEstimado).toBe(700000);
        expect(evento.presupuesto instanceof Presupuesto).toBe(true);
        expect(evento.invitados instanceof ListaInvitados).toBe(true);
        expect(evento.presupuesto.items).toEqual([]);
        expect(evento.invitados.invitados).toEqual([]);
    });

    describe("validarDatos", function () {
        it("debería devolver un array vacío con datos válidos", function () {
            expect(Evento.validarDatos("Evento", "boda", "50000")).toEqual([]);
        });

        it("debería acumular un mensaje por cada dato inválido", function () {
            const errores = Evento.validarDatos("", "congreso", "-1");
            expect(errores.length).toBe(3);
        });

        it("debería rechazar un presupuesto 0 o negativo", function () {
            expect(Evento.validarDatos("Evento", "boda", "0").length).toBeGreaterThan(0);
            expect(Evento.validarDatos("Evento", "boda", "-100").length).toBeGreaterThan(0);
        });
    });

    it("el constructor debería lanzar un error con datos inválidos", function () {
        expect(function () { new Evento("", "boda", "50000"); }).toThrowError();
        expect(function () { new Evento("Evento", "congreso", "50000"); }).toThrowError();
        expect(function () { new Evento("Evento", "boda", "0"); }).toThrowError();
    });

    describe("superaPresupuesto", function () {
        let evento;

        beforeEach(function () {
            evento = new Evento("Evento", "boda", "100000");
            evento.presupuesto.agregarItem(new ItemContratado("Catering", "Finger food", 1, 150000));
        });

        it("debería devolver true cuando el total (con descuento) supera el presupuesto estimado", function () {
            expect(evento.superaPresupuesto(0)).toBe(true);
        });

        it("debería devolver false cuando el descuento lo deja por debajo del presupuesto estimado", function () {
            expect(evento.superaPresupuesto(50)).toBe(false);
        });

        it("debería usar 0% de descuento por defecto si no se pasa el parámetro", function () {
            expect(evento.superaPresupuesto()).toBe(true);
        });
    });

    it("debería reconstruirse igual a sí mismo con fromJSON(toJSON()), incluyendo presupuesto e invitados", function () {
        const original = new Evento("Casamiento de Sofi & Mateo", "boda", "700000");
        original.presupuesto.agregarItem(new ItemContratado("Catering", "Finger food", 120, 3500));
        original.invitados.agregar("Juan Pérez", "Confirmado");

        const reconstruido = Evento.fromJSON(original.toJSON());

        expect(reconstruido.nombre).toBe(original.nombre);
        expect(reconstruido.tipo).toBe(original.tipo);
        expect(reconstruido.presupuestoEstimado).toBe(original.presupuestoEstimado);
        expect(reconstruido.presupuesto.calcularTotal()).toBe(original.presupuesto.calcularTotal());
        expect(reconstruido.invitados.invitados.length).toBe(1);
        expect(reconstruido.invitados.invitados[0].nombre).toBe("Juan Pérez");
    });

    it("fromJSON debería crear presupuesto e invitados vacíos si faltan en el JSON", function () {
        const evento = Evento.fromJSON({ nombre: "Evento", tipo: "boda", presupuestoEstimado: 50000 });

        expect(evento.presupuesto.items).toEqual([]);
        expect(evento.invitados.invitados).toEqual([]);
    });

    it("fromJSON debería lanzar un error con datos inválidos", function () {
        expect(function () { Evento.fromJSON(null); }).toThrowError();
        expect(function () { Evento.fromJSON([]); }).toThrowError();
    });
});

describe("Proveedor", function () {
    it("debería crear un proveedor válido", function () {
        const proveedor = new Proveedor("Flores Pilar", "Decoración", "70000", "base");

        expect(proveedor.nombre).toBe("Flores Pilar");
        expect(proveedor.categoria).toBe("Decoración");
        expect(proveedor.precio).toBe(70000);
        expect(proveedor.unidad).toBe("base");
    });

    it("debería lanzar un error con datos obligatorios vacíos o precio inválido", function () {
        expect(function () { new Proveedor("", "Decoración", 70000, "base"); }).toThrowError();
        expect(function () { new Proveedor("Flores Pilar", "", 70000, "base"); }).toThrowError();
        expect(function () { new Proveedor("Flores Pilar", "Decoración", 70000, ""); }).toThrowError();
        expect(function () { new Proveedor("Flores Pilar", "Decoración", -1, "base"); }).toThrowError();
    });

    describe("coincideCon", function () {
        let proveedor;

        beforeEach(function () {
            proveedor = new Proveedor("DJ Lucas & Sonido", "Sonido", 8000, "hora");
        });

        it("debería coincidir por nombre o categoría, sin distinguir mayúsculas ni tildes", function () {
            expect(proveedor.coincideCon("dj lucas")).toBe(true);
            expect(proveedor.coincideCon("SONIDO")).toBe(true);
        });

        it("debería devolver false sin coincidencia, con criterio vacío o no-texto", function () {
            expect(proveedor.coincideCon("inexistente")).toBe(false);
            expect(proveedor.coincideCon("")).toBe(false);
            expect(proveedor.coincideCon(null)).toBe(false);
        });
    });

    it("debería reconstruirse igual a sí mismo con fromJSON(toJSON())", function () {
        const original = new Proveedor("Flores Pilar", "Decoración", 70000, "base");
        const reconstruido = Proveedor.fromJSON(original.toJSON());

        expect(reconstruido.nombre).toBe(original.nombre);
        expect(reconstruido.categoria).toBe(original.categoria);
        expect(reconstruido.precio).toBe(original.precio);
        expect(reconstruido.unidad).toBe(original.unidad);
    });

    it("fromJSON debería lanzar un error con datos inválidos", function () {
        expect(function () { Proveedor.fromJSON(null); }).toThrowError();
        expect(function () { Proveedor.fromJSON([]); }).toThrowError();
    });
});

describe("CatalogoProveedores", function () {
    let catalogo;

    beforeEach(function () {
        catalogo = new CatalogoProveedores();
    });

    it("debería empezar vacío", function () {
        expect(catalogo.proveedores).toEqual([]);
    });

    it("agregarProveedor debería agregar y devolver el proveedor", function () {
        const proveedor = new Proveedor("Flores Pilar", "Decoración", 70000, "base");
        const agregado = catalogo.agregarProveedor(proveedor);

        expect(agregado).toBe(proveedor);
        expect(catalogo.proveedores.length).toBe(1);
    });

    it("agregarProveedor debería lanzar un error si no es un Proveedor", function () {
        expect(function () { catalogo.agregarProveedor({ nombre: "Falso" }); }).toThrowError();
    });

    describe("buscar", function () {
        beforeEach(function () {
            catalogo.agregarProveedor(new Proveedor("Gourmet Finger Food", "Catering", 3500, "pax"));
            catalogo.agregarProveedor(new Proveedor("Flores Pilar", "Decoración", 70000, "base"));
            catalogo.agregarProveedor(new Proveedor("DJ Lucas & Sonido", "Sonido", 8000, "hora"));
        });

        it("debería devolver los proveedores que coinciden por nombre", function () {
            const resultados = catalogo.buscar("Flores Pilar");
            expect(resultados.length).toBe(1);
            expect(resultados[0].nombre).toBe("Flores Pilar");
        });

        it("debería devolver los proveedores que coinciden por categoría", function () {
            const resultados = catalogo.buscar("Catering");
            expect(resultados.length).toBe(1);
            expect(resultados[0].categoria).toBe("Catering");
        });

        it("debería devolver un array vacío sin coincidencias", function () {
            expect(catalogo.buscar("inexistente")).toEqual([]);
        });

        it("debería lanzar un error con un criterio vacío", function () {
            expect(function () { catalogo.buscar(""); }).toThrowError();
            expect(function () { catalogo.buscar(null); }).toThrowError();
        });

        it("no debería modificar el catálogo original al buscar", function () {
            const largoAntes = catalogo.proveedores.length;
            catalogo.buscar("Sonido");
            expect(catalogo.proveedores.length).toBe(largoAntes);
        });
    });

    it("proveedores debería devolver una copia: modificarla no afecta al catálogo", function () {
        catalogo.agregarProveedor(new Proveedor("Flores Pilar", "Decoración", 70000, "base"));
        const copia = catalogo.proveedores;
        copia.pop();

        expect(catalogo.proveedores.length).toBe(1);
    });

    it("debería reconstruirse igual a sí mismo con fromJSON(toJSON())", function () {
        catalogo.agregarProveedor(new Proveedor("Flores Pilar", "Decoración", 70000, "base"));
        catalogo.agregarProveedor(new Proveedor("DJ Lucas & Sonido", "Sonido", 8000, "hora"));

        const reconstruido = CatalogoProveedores.fromJSON(catalogo.toJSON());

        expect(reconstruido.proveedores.length).toBe(2);
        expect(reconstruido.proveedores[0].nombre).toBe("Flores Pilar");
    });

    it("fromJSON debería lanzar un error con datos inválidos", function () {
        expect(function () { CatalogoProveedores.fromJSON(null); }).toThrowError();
        expect(function () { CatalogoProveedores.fromJSON({ proveedores: "no-es-array" }); }).toThrowError();
    });
});

});
