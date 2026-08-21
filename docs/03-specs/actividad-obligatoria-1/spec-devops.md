# Especificación Técnica (Spec) - Coordinador / DevOps

- **Proyecto:** PlanIT - Plataforma All-in-One de Organización & Experiencias
- **Entrega:** Actividad Obligatoria N°1
- **Rol:** Coordinador / DevOps
- **Responsable:** @carolabenvenuto-uces
- **Rama:** `feature/coordinador-setup-repo-and-pages`

---

## 1. Qué se va a hacer
Inicialización del repositorio en GitHub, creación y configuración de las ramas `master` y `develop` con reglas de protección, armado de la estructura base de carpetas y archivos iniciales, generación del Spec Maestro (`plan.md`) usando GitHub Copilot en modo Agente, automatización de plantillas para Pull Requests, despliegue en GitHub Pages y administración de Code Reviews asistidas con IA bajo la metodología SDD.

---

## 2. Por qué se hace
Para establecer las bases organizativas del proyecto, garantizar la calidad y coherencia del código mediante el Spec Maestro (`plan.md`) y asegurar un flujo de trabajo colaborativo GitFlow auditado mediante Pull Requests y revisiones.

---

## 3. Criterios de Aceptación (Checklist)

### Entregable de este PR (Setup e Infraestructura Base)
- [x] Repositorio creado con ramas `master` y `develop` protegidas contra push directo y con al menos 1 revisor requerido.
- [x] Commit inicial con estructura de carpetas completa y archivos base (`index.html`, `README.md`, `changelog.md`).
- [x] Plantillas de PR agregadas en `.github/PULL_REQUEST_TEMPLATE/` (`feature-template.md` y `release-template.md`).
- [x] Archivo `plan.md` generado en la raíz usando GitHub Copilot en modo Agente con los requerimientos funcionales del simulador.
- [x] Archivo `spec-devops.md` creado y commiteado en el historial de Git.
- [x] Issue propia creada en GitHub (#3) y vinculada en esta PR (#4).

---

### Compromisos y Responsabilidades del Rol (Fases Posteriores)
*Estas tareas se ejecutarán durante la dinámica del grupo y se auditarán en las revisiones de código y en el PR de release:*

- Administrar y realizar un mínimo de 4 Code Reviews asistidos con IA en las PRs de los compañeros.
- Validar que cada PR cumpla con el `plan.md` y con el `spec-[rol].md` correspondiente.
- Crear la rama `release/actividad-obligatoria-1` post-merges y desplegar el sitio en GitHub Pages.
- Publicar la PR final de release hacia `master` en Slack y Campus Virtual.