# Especificación Técnica (Spec) - Documentador / UX

- **Proyecto:** PlanIT - Plataforma All-in-One de Organización & Experiencias
- **Entrega:** Actividad Obligatoria N°1
- **Rol:** Documentador / UX
- **Responsable:** @ValeriaMSilva
- **Rama:** `feature/doc-ux-add-readme-and-mockup`

---

## 1. Qué se va a hacer
Definición del concepto visual del producto PlanIT, diseño del prototipo/mockup interactivo en Figma, exportación de capturas de pantalla para la carpeta de documentación y redacción de la portada principal en el archivo `README.md`.

---

## 2. Por qué se hace
Para establecer la identidad visual, jerarquía de información y guía estética del simulador, facilitando la interpretación del proyecto a usuarios externos y sirviendo de referencia al maquetador Frontend.

---

## 3. Criterios de Aceptación (Checklist)

### Entregable de este PR
- [ ] Mockup o prototipo visual creado en Figma representando la interfaz de PlanIT.
- [ ] Imagen/captura del mockup subida a `docs/01-mockup/actividad-obligatoria-1/diseño-inicial.png`.
- [ ] Archivo `README.md` redactado con la descripción del proyecto, datos del equipo, tecnologías utilizadas y enlace al archivo de Figma.

---

## 4. Proceso de Diseño Asistido por IA (Requisito de Cátedra)
*   **Asistente de IA:** GitHub Copilot en modo Agente (Claude-3.5-Sonnet).
*   **Contexto provisto:** Archivo de requerimientos `plan.md` oficial de la Coordinadora.

### A. Qué se le pidió a la IA (Prompt):
> *"Actúa como Diseñador UX Senior. Tomando como contexto el archivo 'plan.md' de PlanIT que armó mi coordinadora, recomiéndame una distribución de layout, estructura de secciones y jerarquía visual idónea para una pantalla única (desktop) que maximice la usabilidad al gestionar el evento, el presupuesto, los invitados y el catálogo de plancitos."*

### B. Qué sugirió la IA (Layout "Cockpit Operativo"):
1.  **Layout de Doble Columna en Escritorio:** Columna principal izquierda (8 cols) para el flujo de trabajo activo de creación/edición, y panel lateral derecho fijo (4 cols, sticky) para mostrar el resumen financiero (presupuesto y saldo) y estado del evento.
2.  **Estructura de Secciones recomendada:**
    *   *Mi Evento:* Formulario compacto (Nombre, Fecha, Tipo, Presupuesto, Ubicación).
    *   *Presupuesto:* Tabla con categorías, tipo, cantidad, unitario, subtotal y KPIs de consumo.
    *   *Invitados:* Tabla con filtros de asistencia (Todos, Confirmados, Pendientes).
    *   *Catálogo:* Grid de 3 columnas de tarjetas ("plancitos") con barra de búsqueda superior.

### C. Qué se decidió usar:
*   **Se adopta el layout de "Cockpit Operativo" de doble columna:** Excelente para que el usuario complete campos a la izquierda y observe de forma inmediata el impacto en su presupuesto y confirmaciones a la derecha sin perder el foco.
*   **Se adopta el Panel Derecho Sticky:** Los KPIs financieros de presupuesto total y saldo disponible se mantendrán fijos al hacer scroll.

### D. Qué se descartó:
*   **Se descartó la navegación por pestañas (tabs):** Se prefiere un flujo de scroll vertical continuo y secciones semánticas nativas visibles para garantizar que el maquetado inicial en HTML5 sea lo más accesible posible mediante teclado.