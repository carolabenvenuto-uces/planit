# Especificación Técnica (Spec) - Desarrollador Frontend

- **Proyecto:** PlanIT - Plataforma All-in-One de Organización & Experiencias
- **Entrega:** Actividad Obligatoria N°1
- **Rol:** Desarrollador Frontend
- **Responsable:** Valeria Silva (@ValeriaMSilva)
- **Rama:** `feature/frontend-add-html-structure`

---

## 1. Qué se va a hacer
Maquetado semántico inicial de la interfaz web en HTML5 ([`index.html`](../../../../index.html)) para la plataforma PlanIT. Se incluirán los elementos de maquetación principales, tablas de presupuestos, formularios de alta de evento, galerías/listas de experiencias y comentarios explicitados para las integraciones futuras con CSS (Entrega 2) y JavaScript (Entrega 3) [6, 7].

El desarrollo se realizará traduciendo fielmente el [Mockup de Diseño Local](../../../01-mockup/actividad-obligatoria-1/diseño-inicial.png) y alineado con los requerimientos definidos en el [Spec Maestro (plan.md)](../../../../plan.md) [4].

---

## 2. Por qué se hace
Para cumplir con los requerimientos funcionales declarados en el [`plan.md`](../../../../plan.md) y proveer una estructura web semántica, accesible y bien organizada sobre la cual se aplicarán estilos y dinamismo en las entregas posteriores [1, 8].

---

## 3. Criterios de Aceptación (Checklist)

### Entregable de este PR
- [ ] Maquetado de `index.html` con estructura semántica válida (`<header>`, `<main>`, `<footer>`, `<section>`, `<article>`, `<nav>`) [8].
- [ ] Títulos jerárquicos (`<h1>` a `<h3>`) e información real de PlanIT (sin Lorem Ipsum) [8, 9].
- [ ] Galería o tarjetas de experiencias con imágenes y sus respectivos atributos `alt` descriptivos [8].
- [ ] Formulario de creación de eventos con al menos 3 campos relevantes (nombre del evento, fecha, presupuesto) [8].
- [ ] Tabla de presupuesto estimado desglosado por categorías (`<table>`, `<th>`, `<td>`) [8].
- [ ] Listas ordenadas/desordenadas para pasos de organización o características [8].
- [ ] Comentarios explicativos en el código HTML indicando la aplicación futura de CSS y JS [9].

---

## 4. Uso de Figma MCP (Proceso con IA)

Para generar la estructura HTML inicial respetando el diseño planteado, se utilizó el servidor MCP de Figma junto con GitHub Copilot en VS Code.

*   **Modelo de IA utilizado:** GitHub Copilot (Modo Agente / Chat).
*   **Prompt exacto utilizado:**
    > *"Copilot, conectate a nuestro mockup en Figma a través del servidor Figma MCP usando el link indicado en el README principal. Con ese diseño de Cockpit Operativo, generá la estructura HTML5 semántica y accesible para index.html. Asegurate de no incluir textos de relleno y de dejar notas explicativas estructuradas para el CSS y JS futuros."*
*   **Resultado obtenido:** Una estructura HTML5 semántica base que mapea de forma idéntica el diseño de dos columnas (formulario de carga de eventos a la izquierda y planilla financiera a la derecha) y el catálogo de experiencias ("plancitos").
*   **Ajustes manuales realizados:**
    1. Se enlazaron las imágenes temporales apuntando de forma relativa a la ruta física de nuestro mockup (`./docs/01-mockup/actividad-obligatoria-1/diseño-inicial.png`).
    2. Se añadieron los datos académicos de UCES y el nombre completo de Valeria Silva en la sección del pie de página (`<footer>`).
    3. Se agregaron y probaron los enlaces relativos directos a las especificaciones individuales (`spec-ux.md` y `spec-frontend.md`) en el menú del pie de página.