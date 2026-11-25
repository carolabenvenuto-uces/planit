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

    describe("actualizarDatos", function () {
        it("debería actualizar nombre, tipo y presupuesto conservando ítems e invitados", function () {
            const evento = new Evento("Original", "boda", 500000);
            evento.presupuesto.agregarItem(new ItemContratado("Catering", "Finger food", 10, 3500));
            evento.invitados.agregar("Juan Pérez", "Confirmado");

            const resultado = evento.actualizarDatos("  Nuevo  ", "CUMPLEAÑOS", "800000");

            expect(resultado).toBe(evento);
            expect(evento.nombre).toBe("Nuevo");
            expect(evento.tipo).toBe("cumpleaños");
            expect(evento.presupuestoEstimado).toBe(800000);
            expect(evento.presupuesto.items.length).toBe(1);
            expect(evento.invitados.invitados.length).toBe(1);
        });

        it("debería lanzar y dejar el evento intacto si algún dato es inválido", function () {
            const evento = new Evento("Original", "boda", 500000);

            expect(function () { evento.actualizarDatos("Nuevo", "congreso", 800000); }).toThrowError(/tipo/);
            expect(evento.nombre).toBe("Original");
            expect(evento.tipo).toBe("boda");
            expect(evento.presupuestoEstimado).toBe(500000);
        });
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

/*
 * RC5 (corrección docente AO4): límites y ramas independientes.
 * Cada spec lleva un identificador (RC5-XXX-NN) que se usa en la matriz de trazabilidad
 * de ramas de js/test/testing-doc.md y de spec-tester-qa.md (RC4). Cada condición de un
 * if/else, de un operador lógico (|| / &&) o de un parámetro por defecto se ejercita por
 * separado, con los demás datos válidos, para que el error observado se deba a esa rama
 * y no a otra. Los mensajes de error se comparan de forma exacta.
 */
describe("RC5 - Límites y ramas independientes", function () {

    const MSG = {
        itemTextos: "La categoría y la descripción del ítem son obligatorias.",
        itemNumeros: "La cantidad y el precio unitario deben ser números no negativos.",
        itemJson: "Los datos del ítem son inválidos.",
        presItem: "El ítem debe ser un ItemContratado válido.",
        presIndice: "El índice del ítem es inválido.",
        presDescuento: "El porcentaje de descuento debe ser un número entre 0 y 100.",
        presLimite: "El límite debe ser un número no negativo.",
        presJson: "Los datos del presupuesto son inválidos.",
        invNombre: "El nombre del invitado no puede estar vacío.",
        invEstado: "El estado debe ser: Confirmado o Pendiente.",
        invJson: "Los datos del invitado son inválidos.",
        listaJson: "Los datos de la lista de invitados son inválidos.",
        evNombre: "El nombre del evento no puede estar vacío.",
        evTipo: "El tipo debe ser: cumpleaños, boda, salida casual.",
        evPresupuesto: "El presupuesto debe ser un número mayor a 0.",
        evJson: "Los datos del evento son inválidos.",
        provTextos: "El nombre, la categoría y la unidad del proveedor son obligatorios.",
        provPrecio: "El precio debe ser un número no negativo.",
        provJson: "Los datos del proveedor son inválidos.",
        catProveedor: "El proveedor debe ser una instancia válida de Proveedor.",
        catCriterio: "El criterio de búsqueda no puede estar vacío.",
        catJson: "Los datos del catálogo de proveedores son inválidos."
    };

    describe("Validador", function () {
        it("RC5-VAL-01: esTextoNoVacio devuelve false con tipos no texto (0, false, true, objeto, array, NaN)", function () {
            [0, false, true, {}, [], ["Hola"], NaN].forEach(function (valor) {
                expect(Validador.esTextoNoVacio(valor)).toBe(false);
            });
        });

        it("RC5-VAL-02: esTextoNoVacio devuelve false con tabulaciones y saltos de línea, true con un solo carácter", function () {
            expect(Validador.esTextoNoVacio("\t\n  ")).toBe(false);
            expect(Validador.esTextoNoVacio("a")).toBe(true);
        });

        it("RC5-VAL-03: convertirANumero devuelve tal cual cualquier number, incluidos NaN, Infinity y decimales", function () {
            expect(Validador.convertirANumero(NaN)).toBeNaN();
            expect(Validador.convertirANumero(Infinity)).toBe(Infinity);
            expect(Validador.convertirANumero(-5)).toBe(-5);
            expect(Validador.convertirANumero(0.5)).toBe(0.5);
        });

        it("RC5-VAL-04: convertirANumero acepta decimales con punto y notación científica en texto", function () {
            expect(Validador.convertirANumero("3.5")).toBe(3.5);
            expect(Validador.convertirANumero("1e3")).toBe(1000);
            expect(Validador.convertirANumero("-7")).toBe(-7);
        });

        it("RC5-VAL-05: convertirANumero devuelve NaN con decimales con coma, separador de miles o texto mixto", function () {
            expect(Validador.convertirANumero("3,5")).toBeNaN();
            expect(Validador.convertirANumero("1 000")).toBeNaN();
            expect(Validador.convertirANumero("12abc")).toBeNaN();
            expect(Validador.convertirANumero("   ")).toBeNaN();
        });

        it("RC5-VAL-06: convertirANumero devuelve NaN con boolean, array u objeto (no usa la coerción implícita de JS)", function () {
            expect(Validador.convertirANumero(true)).toBeNaN();
            expect(Validador.convertirANumero(false)).toBeNaN();
            expect(Validador.convertirANumero([])).toBeNaN();
            expect(Validador.convertirANumero([5])).toBeNaN();
            expect(Validador.convertirANumero({})).toBeNaN();
        });

        it("RC5-VAL-07: normalizarTexto convierte a texto valores que no son string", function () {
            expect(Validador.normalizarTexto(null)).toBe("null");
            expect(Validador.normalizarTexto(123)).toBe("123");
            expect(Validador.normalizarTexto("  ÁÉÍÓÚ Ñ ")).toBe("aeiou n");
        });

        it("RC5-VAL-08: buscarOpcion recorta espacios del valor y devuelve undefined con tipos no texto", function () {
            const opciones = ["Confirmado", "Pendiente"];
            expect(Validador.buscarOpcion(opciones, "  pendiente  ")).toBe("Pendiente");
            expect(Validador.buscarOpcion(opciones, 1)).toBeUndefined();
            expect(Validador.buscarOpcion(opciones, undefined)).toBeUndefined();
            expect(Validador.buscarOpcion(opciones, "   ")).toBeUndefined();
        });

        it("RC5-VAL-09: buscarOpcion no acepta coincidencias parciales", function () {
            expect(Validador.buscarOpcion(["Confirmado", "Pendiente"], "Confirm")).toBeUndefined();
        });
    });

    describe("ItemContratado", function () {
        it("RC5-IC-01: acepta cantidad 0 y precio 0 (límite inferior inclusivo) con subtotal 0", function () {
            expect(new ItemContratado("Catering", "Prueba", 0, 3500).calcularSubtotal()).toBe(0);
            expect(new ItemContratado("Catering", "Prueba", 10, 0).calcularSubtotal()).toBe(0);
            expect(new ItemContratado("Catering", "Prueba", "0", "0").calcularSubtotal()).toBe(0);
        });

        it("RC5-IC-02: acepta cantidades y precios decimales", function () {
            const item = new ItemContratado("Catering", "Prueba", 2.5, "1000.5");
            expect(item.cantidad).toBe(2.5);
            expect(item.precioUnitario).toBe(1000.5);
            expect(item.calcularSubtotal()).toBeCloseTo(2501.25, 10);
        });

        it("RC5-IC-03: rechaza cantidad apenas negativa (-0.01) aunque el precio sea válido", function () {
            expect(function () { new ItemContratado("Catering", "Prueba", -0.01, 100); }).toThrowError(MSG.itemNumeros);
        });

        it("RC5-IC-04: rechaza precio apenas negativo (-0.01) aunque la cantidad sea válida", function () {
            expect(function () { new ItemContratado("Catering", "Prueba", 1, -0.01); }).toThrowError(MSG.itemNumeros);
        });

        it("RC5-IC-05: rechaza cantidad no finita (NaN, Infinity) con precio válido", function () {
            expect(function () { new ItemContratado("Catering", "Prueba", NaN, 100); }).toThrowError(MSG.itemNumeros);
            expect(function () { new ItemContratado("Catering", "Prueba", Infinity, 100); }).toThrowError(MSG.itemNumeros);
        });

        it("RC5-IC-06: rechaza precio no finito (NaN, Infinity, texto) con cantidad válida", function () {
            expect(function () { new ItemContratado("Catering", "Prueba", 1, NaN); }).toThrowError(MSG.itemNumeros);
            expect(function () { new ItemContratado("Catering", "Prueba", 1, Infinity); }).toThrowError(MSG.itemNumeros);
            expect(function () { new ItemContratado("Catering", "Prueba", 1, "abc"); }).toThrowError(MSG.itemNumeros);
        });

        it("RC5-IC-07: rechaza cantidad o precio de tipo inválido (null, undefined, boolean, array, decimal con coma)", function () {
            [null, undefined, true, [5], "3,5", ""].forEach(function (valor) {
                expect(function () { new ItemContratado("Catering", "Prueba", valor, 100); }).toThrowError(MSG.itemNumeros);
                expect(function () { new ItemContratado("Catering", "Prueba", 1, valor); }).toThrowError(MSG.itemNumeros);
            });
        });

        it("RC5-IC-08: rechaza categoría o descripción de tipo inválido o en blanco, cada una por separado", function () {
            [null, undefined, 123, "   ", {}].forEach(function (valor) {
                expect(function () { new ItemContratado(valor, "Prueba", 1, 100); }).toThrowError(MSG.itemTextos);
                expect(function () { new ItemContratado("Catering", valor, 1, 100); }).toThrowError(MSG.itemTextos);
            });
        });

        it("RC5-IC-09: valida los textos antes que los números (prioridad de mensajes)", function () {
            expect(function () { new ItemContratado("", "Prueba", -1, -1); }).toThrowError(MSG.itemTextos);
        });

        it("RC5-IC-10: recorta espacios de categoría y descripción", function () {
            const item = new ItemContratado("  Catering  ", "  Finger food ", " 2 ", " 10 ");
            expect(item.categoria).toBe("Catering");
            expect(item.descripcion).toBe("Finger food");
            expect(item.calcularSubtotal()).toBe(20);
        });

        it("RC5-IC-11: acepta límites superiores seguros (Number.MAX_SAFE_INTEGER)", function () {
            const item = new ItemContratado("Catering", "Prueba", Number.MAX_SAFE_INTEGER, 1);
            expect(item.calcularSubtotal()).toBe(Number.MAX_SAFE_INTEGER);
        });

        it("RC5-IC-12: documenta el comportamiento actual ante desborde: valores finitos extremos dan subtotal Infinity", function () {
            const item = new ItemContratado("Catering", "Prueba", Number.MAX_VALUE, 2);
            expect(item.calcularSubtotal()).toBe(Infinity);
        });

        it("RC5-IC-13: fromJSON rechaza raíces no objeto (0, '', false, texto, número, función)", function () {
            [0, "", false, "item", 42, function () {}].forEach(function (valor) {
                expect(function () { ItemContratado.fromJSON(valor); }).toThrowError(MSG.itemJson);
            });
            expect(function () { ItemContratado.fromJSON(undefined); }).toThrowError(MSG.itemJson);
        });

        it("RC5-IC-14: fromJSON rechaza un objeto vacío o con textos faltantes/nulos", function () {
            expect(function () { ItemContratado.fromJSON({}); }).toThrowError(MSG.itemTextos);
            expect(function () { ItemContratado.fromJSON({ categoria: null, descripcion: "DJ", cantidad: 1, precioUnitario: 1 }); }).toThrowError(MSG.itemTextos);
            expect(function () { ItemContratado.fromJSON({ categoria: "Sonido", cantidad: 1, precioUnitario: 1 }); }).toThrowError(MSG.itemTextos);
        });

        it("RC5-IC-15: fromJSON rechaza cantidad o precio faltante, nulo o corrompido", function () {
            expect(function () { ItemContratado.fromJSON({ categoria: "Sonido", descripcion: "DJ", precioUnitario: 1 }); }).toThrowError(MSG.itemNumeros);
            expect(function () { ItemContratado.fromJSON({ categoria: "Sonido", descripcion: "DJ", cantidad: 1, precioUnitario: null }); }).toThrowError(MSG.itemNumeros);
            expect(function () { ItemContratado.fromJSON({ categoria: "Sonido", descripcion: "DJ", cantidad: "dos", precioUnitario: 1 }); }).toThrowError(MSG.itemNumeros);
        });

        it("RC5-IC-16: fromJSON ignora claves extra y convierte números serializados como texto", function () {
            const item = ItemContratado.fromJSON({ categoria: "Sonido", descripcion: "DJ", cantidad: "6", precioUnitario: "8000", extra: "x" });
            expect(item.calcularSubtotal()).toBe(48000);
            expect(item.toJSON()).toEqual({ categoria: "Sonido", descripcion: "DJ", cantidad: 6, precioUnitario: 8000 });
        });
    });

    describe("Presupuesto", function () {
        let presupuesto;

        beforeEach(function () {
            presupuesto = new Presupuesto();
        });

        function cargarTres() {
            presupuesto.agregarItem(new ItemContratado("Catering", "A", 1, 100));
            presupuesto.agregarItem(new ItemContratado("Sonido", "B", 1, 200));
            presupuesto.agregarItem(new ItemContratado("Fotografía", "C", 1, 300));
        }

        it("RC5-PRE-01: agregarItem rechaza null, undefined, objetos planos con forma de ítem y otras clases del dominio", function () {
            const falsos = [null, undefined, { categoria: "Catering", descripcion: "A", cantidad: 1, precioUnitario: 1, calcularSubtotal: function () { return 1; } }, new Proveedor("X", "Y", 1, "u")];
            falsos.forEach(function (valor) {
                expect(function () { presupuesto.agregarItem(valor); }).toThrowError(MSG.presItem);
            });
            expect(presupuesto.items.length).toBe(0);
        });

        it("RC5-PRE-02: eliminarItem rechaza índices no enteros aunque el valor numérico sea válido ('0', 0.5, 1.5)", function () {
            cargarTres();
            ["0", 0.5, 1.5].forEach(function (indice) {
                expect(function () { presupuesto.eliminarItem(indice); }).toThrowError(MSG.presIndice);
            });
            expect(presupuesto.items.length).toBe(3);
        });

        it("RC5-PRE-03: eliminarItem rechaza índices no numéricos o no finitos (NaN, Infinity, null, undefined, true)", function () {
            cargarTres();
            [NaN, Infinity, -Infinity, null, undefined, true].forEach(function (indice) {
                expect(function () { presupuesto.eliminarItem(indice); }).toThrowError(MSG.presIndice);
            });
            expect(presupuesto.items.length).toBe(3);
        });

        it("RC5-PRE-04: eliminarItem rechaza el índice negativo -1 con ítems cargados", function () {
            cargarTres();
            expect(function () { presupuesto.eliminarItem(-1); }).toThrowError(MSG.presIndice);
            expect(presupuesto.items.length).toBe(3);
        });

        it("RC5-PRE-05: eliminarItem rechaza índice === length (primer índice fuera de rango)", function () {
            cargarTres();
            expect(function () { presupuesto.eliminarItem(3); }).toThrowError(MSG.presIndice);
            expect(presupuesto.items.length).toBe(3);
        });

        it("RC5-PRE-06: eliminarItem acepta el último índice válido (length - 1)", function () {
            cargarTres();
            const eliminado = presupuesto.eliminarItem(2);
            expect(eliminado.categoria).toBe("Fotografía");
            expect(presupuesto.items.map(function (i) { return i.categoria; })).toEqual(["Catering", "Sonido"]);
        });

        it("RC5-PRE-07: eliminarItem quita un ítem intermedio y conserva el orden del resto", function () {
            cargarTres();
            presupuesto.eliminarItem(1);
            expect(presupuesto.items.map(function (i) { return i.categoria; })).toEqual(["Catering", "Fotografía"]);
            expect(presupuesto.calcularTotal()).toBe(400);
        });

        it("RC5-PRE-08: calcularTotal suma decimales sin perder precisión significativa", function () {
            presupuesto.agregarItem(new ItemContratado("A", "A", 3, 0.1));
            presupuesto.agregarItem(new ItemContratado("B", "B", 1, 0.2));
            expect(presupuesto.calcularTotal()).toBeCloseTo(0.5, 10);
        });

        it("RC5-PRE-09: aplicarDescuento sobre un presupuesto vacío devuelve 0", function () {
            expect(presupuesto.aplicarDescuento(50)).toBe(0);
        });

        it("RC5-PRE-10: aplicarDescuento acepta decimales y texto numérico", function () {
            presupuesto.agregarItem(new ItemContratado("Catering", "A", 1, 100000));
            expect(presupuesto.aplicarDescuento(12.5)).toBe(87500);
            expect(presupuesto.aplicarDescuento("10")).toBe(90000);
        });

        it("RC5-PRE-11: aplicarDescuento redondea el resultado a dos decimales", function () {
            presupuesto.agregarItem(new ItemContratado("Catering", "A", 1, 99.99));
            expect(presupuesto.aplicarDescuento(10)).toBe(89.99);
            expect(presupuesto.aplicarDescuento(33)).toBe(66.99);
        });

        it("RC5-PRE-12: aplicarDescuento rechaza valores apenas fuera de rango (-0.01 y 100.01)", function () {
            presupuesto.agregarItem(new ItemContratado("Catering", "A", 1, 100));
            expect(function () { presupuesto.aplicarDescuento(-0.01); }).toThrowError(MSG.presDescuento);
            expect(function () { presupuesto.aplicarDescuento(100.01); }).toThrowError(MSG.presDescuento);
        });

        it("RC5-PRE-13: aplicarDescuento rechaza no finitos y tipos inválidos (NaN, Infinity, undefined, '', true, [])", function () {
            [NaN, Infinity, undefined, "", true, []].forEach(function (valor) {
                expect(function () { presupuesto.aplicarDescuento(valor); }).toThrowError(MSG.presDescuento);
            });
        });

        it("RC5-PRE-14: superaLimite con límite 0: false si el total es 0, true si es mayor", function () {
            expect(presupuesto.superaLimite(0)).toBe(false);
            presupuesto.agregarItem(new ItemContratado("Catering", "A", 1, 0.01));
            expect(presupuesto.superaLimite(0)).toBe(true);
        });

        it("RC5-PRE-15: superaLimite acepta límite decimal y texto numérico", function () {
            presupuesto.agregarItem(new ItemContratado("Catering", "A", 1, 100000));
            expect(presupuesto.superaLimite(99999.99)).toBe(true);
            expect(presupuesto.superaLimite("100000")).toBe(false);
        });

        it("RC5-PRE-16: superaLimite rechaza -0.01, NaN, Infinity, null, undefined y boolean", function () {
            [-0.01, NaN, Infinity, null, undefined, false].forEach(function (valor) {
                expect(function () { presupuesto.superaLimite(valor); }).toThrowError(MSG.presLimite);
            });
        });

        it("RC5-PRE-17: fromJSON rechaza raíces no objeto, arrays y objetos sin 'items' o con 'items' nulo", function () {
            [undefined, 0, "items", [], {}, { items: null }, { items: {} }].forEach(function (valor) {
                expect(function () { Presupuesto.fromJSON(valor); }).toThrowError(MSG.presJson);
            });
        });

        it("RC5-PRE-18: fromJSON con 'items' vacío reconstruye un presupuesto vacío", function () {
            const reconstruido = Presupuesto.fromJSON({ items: [] });
            expect(reconstruido.items).toEqual([]);
            expect(reconstruido.calcularTotal()).toBe(0);
        });

        it("RC5-PRE-19: fromJSON rechaza la reconstrucción si un ítem anidado es nulo o está corrompido", function () {
            const valido = { categoria: "Catering", descripcion: "A", cantidad: 1, precioUnitario: 100 };
            expect(function () { Presupuesto.fromJSON({ items: [valido, null] }); }).toThrowError(MSG.itemJson);
            expect(function () { Presupuesto.fromJSON({ items: [valido, { categoria: "Sonido", descripcion: "B", cantidad: -1, precioUnitario: 1 }] }); }).toThrowError(MSG.itemNumeros);
        });
    });

    describe("Invitado", function () {
        it("RC5-INV-01: esConfirmado devuelve false explícito para un invitado Pendiente", function () {
            expect(new Invitado("Ana", "Pendiente").esConfirmado()).toBe(false);
        });

        it("RC5-INV-02: transición completa Pendiente -> Confirmado -> Pendiente", function () {
            const invitado = new Invitado("Ana", "Pendiente");
            invitado.cambiarEstado("confirmado");
            expect(invitado.estado).toBe("Confirmado");
            expect(invitado.esConfirmado()).toBe(true);
            invitado.cambiarEstado("PENDIENTE");
            expect(invitado.estado).toBe("Pendiente");
            expect(invitado.esConfirmado()).toBe(false);
        });

        it("RC5-INV-03: cambiarEstado al mismo estado es idempotente", function () {
            const invitado = new Invitado("Ana", "Confirmado");
            invitado.cambiarEstado("Confirmado");
            expect(invitado.estado).toBe("Confirmado");
            expect(invitado.esConfirmado()).toBe(true);
        });

        it("RC5-INV-04: cambiarEstado con un estado inválido no modifica el estado previo", function () {
            const invitado = new Invitado("Ana", "Confirmado");
            [null, undefined, "", "   ", 1, true, "Declinado"].forEach(function (valor) {
                expect(function () { invitado.cambiarEstado(valor); }).toThrowError(MSG.invEstado);
            });
            expect(invitado.estado).toBe("Confirmado");
            expect(invitado.esConfirmado()).toBe(true);
        });

        it("RC5-INV-05: validar devuelve [] con datos válidos y un error por cada dato inválido, de forma independiente", function () {
            expect(Invitado.validar("Ana", "Pendiente")).toEqual([]);
            expect(Invitado.validar("", "Pendiente")).toEqual([MSG.invNombre]);
            expect(Invitado.validar("Ana", "Declinado")).toEqual([MSG.invEstado]);
            expect(Invitado.validar(null, undefined)).toEqual([MSG.invNombre, MSG.invEstado]);
        });

        it("RC5-INV-06: el constructor une ambos mensajes cuando nombre y estado son inválidos", function () {
            expect(function () { new Invitado("  ", 5); }).toThrowError(MSG.invNombre + " " + MSG.invEstado);
        });

        it("RC5-INV-07: el constructor rechaza nombre de tipo inválido (número, objeto, array)", function () {
            [123, {}, ["Ana"]].forEach(function (valor) {
                expect(function () { new Invitado(valor, "Pendiente"); }).toThrowError(MSG.invNombre);
            });
        });

        it("RC5-INV-08: el constructor recorta el nombre y normaliza un estado con espacios", function () {
            const invitado = new Invitado("  Ana Gómez  ", "  pendiente ");
            expect(invitado.nombre).toBe("Ana Gómez");
            expect(invitado.estado).toBe("Pendiente");
        });

        it("RC5-INV-09: fromJSON rechaza raíces no objeto (undefined, 0, texto, número)", function () {
            [undefined, 0, "Ana", 42].forEach(function (valor) {
                expect(function () { Invitado.fromJSON(valor); }).toThrowError(MSG.invJson);
            });
        });

        it("RC5-INV-10: fromJSON rechaza reconstrucciones parciales o con claves nulas/corrompidas", function () {
            expect(function () { Invitado.fromJSON({}); }).toThrowError(MSG.invNombre + " " + MSG.invEstado);
            expect(function () { Invitado.fromJSON({ nombre: "Ana" }); }).toThrowError(MSG.invEstado);
            expect(function () { Invitado.fromJSON({ estado: "Pendiente" }); }).toThrowError(MSG.invNombre);
            expect(function () { Invitado.fromJSON({ nombre: null, estado: "Pendiente" }); }).toThrowError(MSG.invNombre);
            expect(function () { Invitado.fromJSON({ nombre: "Ana", estado: true }); }).toThrowError(MSG.invEstado);
        });

        it("RC5-INV-11: fromJSON normaliza el estado persistido en minúsculas", function () {
            expect(Invitado.fromJSON({ nombre: "Ana", estado: "confirmado" }).estado).toBe("Confirmado");
        });
    });

    describe("ListaInvitados", function () {
        let lista;

        beforeEach(function () {
            lista = new ListaInvitados();
        });

        it("RC5-LI-01: agregar con datos inválidos no deja invitados a medio agregar", function () {
            lista.agregar("Ana", "Pendiente");
            expect(function () { lista.agregar(null, "Pendiente"); }).toThrowError(MSG.invNombre);
            expect(function () { lista.agregar("Beto", null); }).toThrowError(MSG.invEstado);
            expect(lista.invitados.length).toBe(1);
        });

        it("RC5-LI-02: eliminar rechaza nombres de tipo inválido o en blanco (null, undefined, número, espacios)", function () {
            lista.agregar("Ana", "Pendiente");
            [null, undefined, 0, "   "].forEach(function (valor) {
                expect(function () { lista.eliminar(valor); }).toThrowError(MSG.invNombre);
            });
            expect(lista.invitados.length).toBe(1);
        });

        it("RC5-LI-03: eliminar sobre una lista vacía devuelve false", function () {
            expect(lista.eliminar("Ana")).toBe(false);
        });

        it("RC5-LI-04: eliminar con nombres duplicados quita solo la primera coincidencia", function () {
            lista.agregar("Ana", "Pendiente");
            lista.agregar("Ana", "Confirmado");

            expect(lista.eliminar("ANA")).toBe(true);
            expect(lista.invitados.length).toBe(1);
            expect(lista.invitados[0].estado).toBe("Confirmado");
        });

        it("RC5-LI-05: eliminar no hace coincidencias parciales", function () {
            lista.agregar("Ana María", "Pendiente");
            expect(lista.eliminar("Ana")).toBe(false);
            expect(lista.invitados.length).toBe(1);
        });

        it("RC5-LI-06: contarAsistencia cubre por separado la rama solo-confirmados y la rama solo-pendientes", function () {
            lista.agregar("Uno", "Confirmado");
            lista.agregar("Dos", "Confirmado");
            expect(lista.contarAsistencia()).toEqual({ confirmados: 2, pendientes: 0 });

            const otra = new ListaInvitados();
            otra.agregar("Tres", "Pendiente");
            expect(otra.contarAsistencia()).toEqual({ confirmados: 0, pendientes: 1 });
        });

        it("RC5-LI-07: contarAsistencia refleja una transición de estado de un invitado de la lista", function () {
            lista.agregar("Uno", "Pendiente");
            expect(lista.contarAsistencia()).toEqual({ confirmados: 0, pendientes: 1 });

            lista.invitados[0].cambiarEstado("Confirmado");
            expect(lista.contarAsistencia()).toEqual({ confirmados: 1, pendientes: 0 });
        });

        it("RC5-LI-08: fromJSON rechaza raíces no objeto, arrays y 'invitados' faltante, nulo o no array", function () {
            [undefined, 0, "lista", [], {}, { invitados: null }, { invitados: {} }].forEach(function (valor) {
                expect(function () { ListaInvitados.fromJSON(valor); }).toThrowError(MSG.listaJson);
            });
        });

        it("RC5-LI-09: fromJSON con 'invitados' vacío reconstruye una lista vacía", function () {
            const reconstruida = ListaInvitados.fromJSON({ invitados: [] });
            expect(reconstruida.invitados).toEqual([]);
            expect(reconstruida.contarAsistencia()).toEqual({ confirmados: 0, pendientes: 0 });
        });

        it("RC5-LI-10: fromJSON rechaza la reconstrucción si un invitado anidado es nulo, parcial o corrompido", function () {
            const valido = { nombre: "Ana", estado: "Pendiente" };
            expect(function () { ListaInvitados.fromJSON({ invitados: [valido, null] }); }).toThrowError(MSG.invJson);
            expect(function () { ListaInvitados.fromJSON({ invitados: [valido, { nombre: "Beto" }] }); }).toThrowError(MSG.invEstado);
            expect(function () { ListaInvitados.fromJSON({ invitados: [valido, { nombre: "", estado: "Pendiente" }] }); }).toThrowError(MSG.invNombre);
        });
    });

    describe("Evento", function () {
        it("RC5-EV-01: validarDatos detecta solo el nombre inválido cuando tipo y presupuesto son válidos", function () {
            [null, undefined, "", "   ", 123].forEach(function (nombre) {
                expect(Evento.validarDatos(nombre, "boda", 1000)).toEqual([MSG.evNombre]);
            });
        });

        it("RC5-EV-02: validarDatos detecta solo el tipo inválido cuando nombre y presupuesto son válidos", function () {
            [null, undefined, "", "congreso", 1, "bod"].forEach(function (tipo) {
                expect(Evento.validarDatos("Evento", tipo, 1000)).toEqual([MSG.evTipo]);
            });
        });

        it("RC5-EV-03: validarDatos detecta solo el presupuesto inválido (no finito, no numérico, 0 o negativo)", function () {
            [NaN, Infinity, "abc", "", null, undefined, true, 0, "0", -0.01].forEach(function (monto) {
                expect(Evento.validarDatos("Evento", "boda", monto)).toEqual([MSG.evPresupuesto]);
            });
        });

        it("RC5-EV-04: validarDatos acepta el mínimo positivo 0.01, notación científica y los 3 tipos sin tildes ni mayúsculas", function () {
            expect(Evento.validarDatos("Evento", "boda", 0.01)).toEqual([]);
            expect(Evento.validarDatos("Evento", "boda", "1e6")).toEqual([]);
            expect(Evento.validarDatos("Evento", "cumpleanos", 1)).toEqual([]);
            expect(Evento.validarDatos("Evento", "SALIDA CASUAL", 1)).toEqual([]);
        });

        it("RC5-EV-05: el constructor normaliza el tipo, recorta el nombre y convierte el presupuesto", function () {
            const evento = new Evento("  Cumple de Juli  ", "CUMPLEANOS", "0.01");
            expect(evento.nombre).toBe("Cumple de Juli");
            expect(evento.tipo).toBe("cumpleaños");
            expect(evento.presupuestoEstimado).toBe(0.01);
        });

        it("RC5-EV-06: el constructor une todos los mensajes en un solo Error", function () {
            expect(function () { new Evento("", "congreso", 0); })
                .toThrowError(MSG.evNombre + " " + MSG.evTipo + " " + MSG.evPresupuesto);
        });

        describe("superaPresupuesto", function () {
            let evento;

            beforeEach(function () {
                evento = new Evento("Evento", "boda", 150000);
            });

            it("RC5-EV-07: devuelve false con presupuesto vacío", function () {
                expect(evento.superaPresupuesto()).toBe(false);
            });

            it("RC5-EV-08: devuelve false cuando el total es exactamente igual al presupuesto estimado (comparación estricta)", function () {
                evento.presupuesto.agregarItem(new ItemContratado("Catering", "A", 1, 150000));
                expect(evento.superaPresupuesto(0)).toBe(false);
            });

            it("RC5-EV-09: devuelve true cuando el total supera el estimado por un centavo", function () {
                evento.presupuesto.agregarItem(new ItemContratado("Catering", "A", 1, 150000.01));
                expect(evento.superaPresupuesto(0)).toBe(true);
            });

            it("RC5-EV-10: con descuento del 100% nunca supera el presupuesto", function () {
                evento.presupuesto.agregarItem(new ItemContratado("Catering", "A", 1, 999999));
                expect(evento.superaPresupuesto(100)).toBe(false);
                expect(evento.superaPresupuesto("100")).toBe(false);
            });

            it("RC5-EV-11: propaga el error de un descuento inválido", function () {
                [-1, 101, "abc", null, NaN].forEach(function (valor) {
                    expect(function () { evento.superaPresupuesto(valor); }).toThrowError(MSG.presDescuento);
                });
            });

            it("RC5-EV-12: undefined explícito usa el valor por defecto 0", function () {
                evento.presupuesto.agregarItem(new ItemContratado("Catering", "A", 1, 150001));
                expect(evento.superaPresupuesto(undefined)).toBe(true);
            });
        });

        it("RC5-EV-13: fromJSON rechaza raíces no objeto (undefined, 0, texto, número)", function () {
            [undefined, 0, "evento", 42].forEach(function (valor) {
                expect(function () { Evento.fromJSON(valor); }).toThrowError(MSG.evJson);
            });
        });

        it("RC5-EV-14: fromJSON rechaza datos básicos faltantes o corrompidos con el mensaje de validación", function () {
            expect(function () { Evento.fromJSON({}); })
                .toThrowError(MSG.evNombre + " " + MSG.evTipo + " " + MSG.evPresupuesto);
            expect(function () { Evento.fromJSON({ nombre: "Evento", tipo: "congreso", presupuestoEstimado: 1000 }); }).toThrowError(MSG.evTipo);
            expect(function () { Evento.fromJSON({ nombre: "Evento", tipo: "boda", presupuestoEstimado: "mil" }); }).toThrowError(MSG.evPresupuesto);
        });

        it("RC5-EV-15: fromJSON reconstruye solo el presupuesto cuando faltan los invitados (rama independiente)", function () {
            const evento = Evento.fromJSON({
                nombre: "Evento", tipo: "boda", presupuestoEstimado: 1000,
                presupuesto: { items: [{ categoria: "Catering", descripcion: "A", cantidad: 2, precioUnitario: 100 }] }
            });
            expect(evento.presupuesto.calcularTotal()).toBe(200);
            expect(evento.invitados.invitados).toEqual([]);
        });

        it("RC5-EV-16: fromJSON reconstruye solo los invitados cuando falta el presupuesto (rama independiente)", function () {
            const evento = Evento.fromJSON({
                nombre: "Evento", tipo: "boda", presupuestoEstimado: 1000,
                invitados: { invitados: [{ nombre: "Ana", estado: "Confirmado" }] }
            });
            expect(evento.presupuesto.items).toEqual([]);
            expect(evento.invitados.contarAsistencia()).toEqual({ confirmados: 1, pendientes: 0 });
        });

        it("RC5-EV-17: fromJSON distingue clave ausente de clave nula: 'presupuesto: null' o 'invitados: null' lanzan error", function () {
            const base = { nombre: "Evento", tipo: "boda", presupuestoEstimado: 1000 };
            expect(function () { Evento.fromJSON(Object.assign({}, base, { presupuesto: null })); }).toThrowError(MSG.presJson);
            expect(function () { Evento.fromJSON(Object.assign({}, base, { invitados: null })); }).toThrowError(MSG.listaJson);
        });

        it("RC5-EV-18: fromJSON rechaza componentes anidados malformados", function () {
            const base = { nombre: "Evento", tipo: "boda", presupuestoEstimado: 1000 };
            expect(function () { Evento.fromJSON(Object.assign({}, base, { presupuesto: { items: "x" } })); }).toThrowError(MSG.presJson);
            expect(function () { Evento.fromJSON(Object.assign({}, base, { invitados: [] })); }).toThrowError(MSG.listaJson);
            expect(function () {
                Evento.fromJSON(Object.assign({}, base, { presupuesto: { items: [{ categoria: "Catering", descripcion: "A", cantidad: 1, precioUnitario: -5 }] } }));
            }).toThrowError(MSG.itemNumeros);
        });

        it("RC5-EV-19: fromJSON convierte el presupuesto estimado guardado como texto y normaliza el tipo", function () {
            const evento = Evento.fromJSON({ nombre: "Evento", tipo: "Boda", presupuestoEstimado: "50000" });
            expect(evento.presupuestoEstimado).toBe(50000);
            expect(evento.tipo).toBe("boda");
        });
    });

    describe("Proveedor", function () {
        it("RC5-PRV-01: rechaza nombre, categoría o unidad de tipo inválido, cada uno por separado", function () {
            [null, undefined, 1, "   ", {}].forEach(function (valor) {
                expect(function () { new Proveedor(valor, "Sonido", 100, "hora"); }).toThrowError(MSG.provTextos);
                expect(function () { new Proveedor("DJ", valor, 100, "hora"); }).toThrowError(MSG.provTextos);
                expect(function () { new Proveedor("DJ", "Sonido", 100, valor); }).toThrowError(MSG.provTextos);
            });
        });

        it("RC5-PRV-02: acepta precio 0 (límite inferior inclusivo) y decimales", function () {
            expect(new Proveedor("DJ", "Sonido", 0, "hora").precio).toBe(0);
            expect(new Proveedor("DJ", "Sonido", "8000.50", "hora").precio).toBe(8000.5);
        });

        it("RC5-PRV-03: rechaza precio negativo mínimo, no finito o de tipo inválido", function () {
            [-0.01, NaN, Infinity, "abc", "", null, undefined, true, "3,5"].forEach(function (valor) {
                expect(function () { new Proveedor("DJ", "Sonido", valor, "hora"); }).toThrowError(MSG.provPrecio);
            });
        });

        it("RC5-PRV-04: valida los textos antes que el precio (prioridad de mensajes)", function () {
            expect(function () { new Proveedor("", "Sonido", -1, "hora"); }).toThrowError(MSG.provTextos);
        });

        it("RC5-PRV-05: recorta espacios en los textos", function () {
            const proveedor = new Proveedor("  DJ  ", " Sonido ", " 10 ", " hora ");
            expect(proveedor.toJSON()).toEqual({ nombre: "DJ", categoria: "Sonido", precio: 10, unidad: "hora" });
        });

        describe("coincideCon", function () {
            let proveedor;

            beforeEach(function () {
                proveedor = new Proveedor("Flores Pilar", "Decoración", 70000, "base");
            });

            it("RC5-PRV-06: coincide solo por nombre (rama izquierda del ||)", function () {
                expect(proveedor.coincideCon("pilar")).toBe(true);
            });

            it("RC5-PRV-07: coincide solo por categoría (rama derecha del ||), sin tilde", function () {
                expect(proveedor.coincideCon("decoracion")).toBe(true);
            });

            it("RC5-PRV-08: recorta espacios del criterio y devuelve false con criterio en blanco o no texto", function () {
                expect(proveedor.coincideCon("  flores  ")).toBe(true);
                expect(proveedor.coincideCon("   ")).toBe(false);
                expect(proveedor.coincideCon(undefined)).toBe(false);
                expect(proveedor.coincideCon(70000)).toBe(false);
            });
        });

        it("RC5-PRV-09: fromJSON rechaza raíces no objeto (undefined, 0, texto, número)", function () {
            [undefined, 0, "proveedor", 42].forEach(function (valor) {
                expect(function () { Proveedor.fromJSON(valor); }).toThrowError(MSG.provJson);
            });
        });

        it("RC5-PRV-10: fromJSON rechaza reconstrucciones parciales o con atributos nulos/corrompidos", function () {
            expect(function () { Proveedor.fromJSON({}); }).toThrowError(MSG.provTextos);
            expect(function () { Proveedor.fromJSON({ nombre: "DJ", categoria: "Sonido", precio: 100 }); }).toThrowError(MSG.provTextos);
            expect(function () { Proveedor.fromJSON({ nombre: "DJ", categoria: "Sonido", precio: null, unidad: "hora" }); }).toThrowError(MSG.provPrecio);
            expect(function () { Proveedor.fromJSON({ nombre: "DJ", categoria: "Sonido", precio: "caro", unidad: "hora" }); }).toThrowError(MSG.provPrecio);
        });
    });

    describe("CatalogoProveedores", function () {
        let catalogo;

        beforeEach(function () {
            catalogo = new CatalogoProveedores();
        });

        it("RC5-CAT-01: agregarProveedor rechaza null, undefined, objetos planos y otras clases del dominio sin modificar el catálogo", function () {
            [null, undefined, { nombre: "DJ", categoria: "Sonido", precio: 1, unidad: "hora" }, new ItemContratado("A", "B", 1, 1)].forEach(function (valor) {
                expect(function () { catalogo.agregarProveedor(valor); }).toThrowError(MSG.catProveedor);
            });
            expect(catalogo.proveedores.length).toBe(0);
        });

        it("RC5-CAT-02: buscar rechaza criterios en blanco o de tipo inválido", function () {
            ["   ", undefined, 123, {}].forEach(function (valor) {
                expect(function () { catalogo.buscar(valor); }).toThrowError(MSG.catCriterio);
            });
        });

        it("RC5-CAT-03: buscar sobre un catálogo vacío devuelve un array vacío", function () {
            expect(catalogo.buscar("Sonido")).toEqual([]);
        });

        it("RC5-CAT-04: buscar devuelve todas las coincidencias, en el orden de alta", function () {
            catalogo.agregarProveedor(new Proveedor("Gourmet A", "Catering", 1, "pax"));
            catalogo.agregarProveedor(new Proveedor("DJ", "Sonido", 1, "hora"));
            catalogo.agregarProveedor(new Proveedor("Gourmet B", "Catering", 1, "pax"));

            const resultados = catalogo.buscar("catering");
            expect(resultados.map(function (p) { return p.nombre; })).toEqual(["Gourmet A", "Gourmet B"]);
        });

        it("RC5-CAT-05: fromJSON rechaza raíces no objeto, arrays y 'proveedores' faltante, nulo o no array", function () {
            [undefined, 0, "catalogo", [], {}, { proveedores: null }, { proveedores: {} }].forEach(function (valor) {
                expect(function () { CatalogoProveedores.fromJSON(valor); }).toThrowError(MSG.catJson);
            });
        });

        it("RC5-CAT-06: fromJSON con 'proveedores' vacío reconstruye un catálogo vacío", function () {
            expect(CatalogoProveedores.fromJSON({ proveedores: [] }).proveedores).toEqual([]);
        });

        it("RC5-CAT-07: fromJSON rechaza la reconstrucción si un proveedor anidado es nulo, parcial o corrompido", function () {
            const valido = { nombre: "DJ", categoria: "Sonido", precio: 1, unidad: "hora" };
            expect(function () { CatalogoProveedores.fromJSON({ proveedores: [valido, null] }); }).toThrowError(MSG.provJson);
            expect(function () { CatalogoProveedores.fromJSON({ proveedores: [valido, { nombre: "X" }] }); }).toThrowError(MSG.provTextos);
            expect(function () { CatalogoProveedores.fromJSON({ proveedores: [valido, { nombre: "X", categoria: "Y", precio: -1, unidad: "u" }] }); }).toThrowError(MSG.provPrecio);
        });
    });
});

});
