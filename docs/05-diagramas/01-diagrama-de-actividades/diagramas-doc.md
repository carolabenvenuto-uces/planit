# 📊 Documentación de Diagramas de Actividades (PlanIT - AO3)

## 📌 Índice de Diagramas
1. [Flujo 1: Crear Evento en PlanIT](#flujo-1-crear-evento-en-planit)
2. [Flujo 2: Calcular Presupuesto del Evento](#flujo-2-calcular-presupuesto-del-evento)
3. [Flujo 3: Buscar en Catálogo de Proveedores](#flujo-3-buscar-en-catálogo-de-proveedores)
4. [Flujo 4: Gestionar Lista de Invitados](#flujo-4-gestionar-lista-de-invitados)

---

## 🛠️ Instrucciones de Edición y Visualización
* **Editor Web Online:** Copiar el código del archivo `.puml` y pegarlo en PlantUML Editor.
* **Exportación:** Exportar las imágenes en formato PNG a la carpeta del proyecto.

---

## 📐 Detalle de los Flujos de Negocio

### Flujo 1: Crear Evento en PlanIT
- **Descripción:** Captura los datos iniciales de un evento, valida restricciones de entrada mediante bucle interactivo e instancia el objeto en la colección.
- **Precondición:** Menú principal activo.
- **Postcondición:** Objeto de evento almacenado en la colección del sistema.
- **Entrada Principal:** Nombre, tipo y presupuesto (`prompt()`).
- **Salida Principal:** Mensaje de confirmación (`alert()`) y log (`console.log()`).
- **Archivo editable:** [`actividad-flujo-1-crear-evento.puml`](./actividad-flujo-1-crear-evento.puml)
- **Diagrama visual:** ![Flujo 1: Crear Evento](./actividad-flujo-1-crear-evento.png)

---

### Flujo 2: Calcular Presupuesto del Evento
- **Descripción:** Recorre la colección de servicios contratados, aplica descuentos condicionales y verifica el límite de presupuesto.
- **Precondición:** Existencia de ítems cargados en el evento.
- **Postcondición:** Presupuesto recalculado y verificado.
- **Entrada Principal:** Porcentaje de descuento promocional (`prompt()`).
- **Salida Principal:** Resumen presupuestario o alerta de sobrepaso (`alert()`).
- **Archivo editable:** [`actividad-flujo-2-calcular-presupuesto.puml`](./actividad-flujo-2-calcular-presupuesto.puml)
- **Diagrama visual:** ![Flujo 2: Calcular Presupuesto](./actividad-flujo-2-calcular-presupuesto.png)

---

### Flujo 3: Buscar en Catálogo de Proveedores
- **Descripción:** Filtra la colección del catálogo comparando criterios de búsqueda ingresados por el usuario.
- **Precondición:** Catálogo con proveedores disponibles.
- **Postcondición:** Colección filtrada según criterio.
- **Entrada Principal:** Texto o categoría buscada (`prompt()`).
- **Salida Principal:** Lista de coincidencias o advertencia de búsqueda vacía (`alert()`).
- **Archivo editable:** [`actividad-flujo-3-buscar-catalogo.puml`](./actividad-flujo-3-buscar-catalogo.puml)
- **Diagrama visual:** ![Flujo 3: Buscar Catálogo](./actividad-flujo-3-buscar-catalogo.png)

---

### Flujo 4: Gestionar Lista de Invitados
- **Descripción:** Registra invitados y recorre la colección para contabilizar asistencias confirmadas y pendientes.
- **Precondición:** Selección de gestión de lista desde la aplicación.
- **Postcondición:** Colección de invitados actualizada con estadísticas calculadas.
- **Entrada Principal:** Nombre y estado de confirmación (`prompt()`).
- **Salida Principal:** Totales de asistencia (`alert()`) y métricas en consola (`console.log()`).
- **Archivo editable:** [`actividad-flujo-4-gestionar-invitados.puml`](./actividad-flujo-4-gestionar-invitados.puml)
- **Diagrama visual:** ![Flujo 4: Gestionar Invitados](./actividad-flujo-4-gestionar-invitados.png)