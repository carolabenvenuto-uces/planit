# Especificación Técnica (Spec) - Documentador / QA Tester

- **Proyecto:** PlanIT - Plataforma All-in-One de Organización & Experiencias
- **Entrega:** Actividad Obligatoria N°2
- **Rol:** Documentador / QA Tester
- **Responsable:** @FacundoGuiraldes
- **Rama:** `feature/doc-qa-tester-add-test-case-1`

---

## 1. Qué se va a hacer
Ejecución de un plan de testing automatizado sobre la plataforma PlanIT en
dos momentos: pre-merge (sobre las ramas `feature/` de Frontend/CSS y
Responsive Design antes de integrarse a `develop`) y post-merge (sobre
`develop` ya con todos los estilos integrados). Se utilizará Playwright MCP
para ejecutar los tests contra `http://localhost:3000` con Live Preview, y
GitHub MCP para registrar cada hallazgo relevante como issue de tipo bug,
todo desde Agent Mode.

## 2. Por qué se hace
Para garantizar que los estilos CSS y el diseño responsive implementados
por el equipo cumplan con los requerimientos funcionales definidos en
`plan.md`, detectar problemas de integración que solo aparecen cuando los
distintos aportes (CSS base, componentes, responsive) se combinan, y dejar
evidencia documentada y trazable de cada hallazgo antes de que el
Coordinador arme la release.

## 3. Herramientas a utilizar
- **Playwright MCP** (`@playwright/mcp`): permite controlar un navegador
  real para ejecutar tests automatizados contra la URL local del proyecto,
  cubriendo compatibilidad, responsive, performance, accesibilidad y
  estructura HTML semántica.
- **GitHub MCP** (`@modelcontextprotocol/server-github`): permite crear
  issues de tipo bug directamente desde el chat del agente, sin necesidad
  de ir manualmente a GitHub, agilizando el registro de hallazgos.

## 4. Criterios de Aceptación (Checklist)

### Momento 1 — Testing pre-merge
- [ ] 5 test cases ejecutados con Playwright MCP contra las ramas `feature/`
  de Frontend/CSS y Responsive Design (vía Live Preview en localhost:3000)
  — **pendiente de resolución con Coordinación: la ejecución se realizó
  con Playwright directo, no MCP, por una limitación técnica del canal
  "chrome" en este entorno. Ver aclaración en cada test case.**
- [x] Al menos un issue bug creado con GitHub MCP por cada hallazgo relevante
- [ ] Responsables notificados sobre los bugs encontrados antes del merge

### Momento 2 — Testing post-merge a develop
- [ ] 5 test cases re-ejecutados con Playwright MCP contra `develop` ya
  integrado — **misma salvedad que Momento 1: ejecutado con Playwright
  directo.**
- [x] Issues creados por cada nuevo hallazgo detectado en la integración
  (persistencia de los 5 issues de Momento 1, sin hallazgos nuevos)
- [ ] Coordinador notificado antes de la creación de la release

### Documentación
- [x] Los 5 test cases documentados en `docs/04-testing/` con prompt
  utilizado, hallazgos, capturas de pantalla y links a issues
- [x] `testing-doc.md` como índice central con resumen de issues por momento
- [x] `changelog.md` actualizado con la contribución de este rol

---

## Test cases planificados

| # | Archivo | Qué cubre |
|---|---|---|
| 1 | test-case-1.md | Compatibilidad en navegadores desktop (Chrome, Firefox, Safari, Edge) |
| 2 | test-case-2.md | Responsive en dispositivos móviles (iPhone, Samsung Galaxy, iPad) |
| 3 | test-case-3.md | Performance y carga (Performance API del navegador) |
| 4 | test-case-4.md | Accesibilidad web (axe-core) |
| 5 | test-case-5.md | Validación de estructura HTML semántica y CSS (W3C) |