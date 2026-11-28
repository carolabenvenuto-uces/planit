
# 🚀 PULL REQUEST FINAL – Release Segundo Parcial

> **Título de la PR:** `[GRUPO N°X][Segundo Parcial] Entrega de la actividad`
> **Rama:** `release/segundo-parcial` → `master`

---

## 📌 Datos de la Entrega

- **Grupo N°:** 
- **Materia:** Programación Web I
- **Profesor:** Lic. Matías Velasquez
- **Cuatrimestre/Año:** 2º Cuatrimestre / 2026
- **Entrega:** Segundo Parcial
- **Rama de release:** `release/segundo-parcial` (creada desde `develop` el <!-- fecha -->)
- **Enlace a GitHub Pages (publicado desde `release/segundo-parcial`):** https://<!-- usuario -->.github.io/<!-- repositorio -->/

---

## 👥 Integrantes y Roles

| Integrante | Usuario GitHub | Rol en el Segundo Parcial |
| --- | --- | --- |
| <!-- Nombre y Apellido --> | @<!-- usuario --> | Coordinador/a / DevOps – Gestión y Resolución de Correcciones |
| <!-- Nombre y Apellido --> | @<!-- usuario --> | Desarrollador/a JS Asíncrono – Fetch & APIs |
| <!-- Nombre y Apellido --> | @<!-- usuario --> | Desarrollador/a JS Librerías Externas |
| <!-- Nombre y Apellido --> | @<!-- usuario --> | Tester QA/JS – Testing Avanzado |

_(Si el grupo tiene 3 integrantes, indicar qué rol absorbe el Coordinador/DevOps.)_

---

## 🔀 Pull Requests integradas en `develop`

| Orden | PR | Rama | Rol | Issue |
| --- | --- | --- | --- | --- |
| 1 | #<!-- n --> | `feature/dev-async-fetch-api` | Dev JS Asíncrono | #<!-- n --> |
| 2 | #<!-- n --> | `feature/dev-libreria-externa-<nombre>` | Dev JS Librerías Externas | #<!-- n --> |
| 3 | #<!-- n --> | `feature/tester-qa-js-testing-suite` | Tester QA/JS | #<!-- n --> |
| 4 | #<!-- n --> | `feature/coord-devops-segundo-parcial` | Coordinador/a / DevOps | #<!-- n --> |

**Correcciones de la Actividad N°4:** PRs `fix/` contra `release/<rama-ao4>`: #<!-- n --> a #<!-- n -->. Backport a `develop`: #<!-- n -->.

---

## 📦 Resumen de la Release (extracto de `changelog.md`)

_(Copiar la sección `[Release Segundo Parcial]` de `changelog.md`.)_

---

## ✅ Checklist de la entrega

- [ ] Correcciones de la Actividad N°4 aplicadas mediante PRs `fix/`, documentadas en `[Fixed]` del `changelog.md`, mergeadas a `master` y con backport a `develop`.
- [ ] Specs de los 4 roles en `docs/03-specs/segundo-parcial/`, commiteados antes del código (MOMENTO 1) y completados al cierre (MOMENTO 2).
- [ ] `js/api/apiService.js` con `fetch`, `async`/`await`, manejo de errores y estados de carga.
- [ ] Librería externa integrada y documentada en `docs/06-librerias/libreria-doc.md` con capturas.
- [ ] Suites `api.spec.js` y `library.spec.js` en `js/test/`, con la suite completa en verde.
- [ ] Test Cases 11, 12 y 13 (Lighthouse baseline, post-fetch y post-librería) con capturas en `docs/04-testing/screenshots/`.
- [ ] Mínimo 4 PRs revisadas con IA, con Request Changes inline en el diff y prompts documentados en `spec-coord-devops-segundo-parcial.md`.
- [ ] `README.md` actualizado (funcionalidades, instalación/uso, enlaces a la documentación, tecnologías y librerías).
- [ ] `changelog.md` con todas las contribuciones y enlaces a PRs e issues.
- [ ] Issues administradas en GitHub Projects (Kanban).
- [ ] GitHub Pages activo y verificado desde `release/segundo-parcial`.
- [ ] Link de esta PR publicado en Slack (#2026-2do-cuat-pw1) y subido al campus por **todos** los integrantes.

---

## 🛠️ Request Changes y correcciones (Fase 2)

_(Completar a medida que el docente marque Request Changes. Cada RC se resuelve con una PR `fix/` contra `release/segundo-parcial` y se registra en `[Fixed]` del `changelog.md`.)_

| RC | Descripción | Prioridad | Rol asignado | Issue | PR `fix/` | Estado |
| --- | --- | --- | --- | --- | --- | --- |
| RC1 | | | | | | |

**Reasignaciones por incidencias o baja participación:** _(Registrar fecha, RC, de quién a quién y justificación. Si no hubo, indicar "Sin reasignaciones".)_

---

## ⚠ IMPORTANTE

🚫 NO realizar merge a `master` hasta contar con la aprobación formal y el `:lgtm:` del docente en Slack/GitHub.
✅ Después del merge: notificar con `:pr-merged:`, crear el tag y la release `v2.0-segundo-parcial` y hacer el backport `backport/release-segundo-parcial` → `develop`.
