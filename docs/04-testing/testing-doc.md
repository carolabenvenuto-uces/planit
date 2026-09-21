# Índice de Testing — Actividad Obligatoria N°2

Este archivo centraliza el estado de los 5 test cases ejecutados sobre
PlanIT, cubriendo compatibilidad, responsive, performance, accesibilidad
y estructura HTML semántica.

## Test cases

| # | Archivo | Qué cubre | Momento 1 | Momento 2 |
|---|---|---|---|---|
| 1 | [test-case-1.md](test-case-1.md) | Compatibilidad navegadores desktop | ✅ 1 bug (#25) | ✅ Persiste (#25) |
| 2 | [test-case-2.md](test-case-2.md) | Responsive dispositivos móviles | ✅ 2 bugs (#26, #27) | ✅ Persisten (#26, #27) |
| 3 | [test-case-3.md](test-case-3.md) | Performance y carga | ✅ 1 hallazgo (#28) | ✅ Persiste (#28) |
| 4 | [test-case-4.md](test-case-4.md) | Accesibilidad web | ✅ Sin issues | ✅ Sin issues |
| 5 | [test-case-5.md](test-case-5.md) | Estructura HTML semántica y CSS | ✅ 1 mejora (#29) | ✅ Persiste (#29) |

## Resumen de issues por momento

### Momento 1 — Testing pre-merge
Ejecutado sobre `feature/responsive-design-add-responsive-styles`
(último commit antes del merge a `develop`, PR #24). 5 issues creados:

- [#25](https://github.com/carolabenvenuto-uces/planit/issues/25) — Contraste roto en `<select>` con Safari/WebKit
- [#26](https://github.com/carolabenvenuto-uces/planit/issues/26) — Tablas desbordan sin indicador de scroll en mobile
- [#27](https://github.com/carolabenvenuto-uces/planit/issues/27) — Links de footer con área de toque menor al mínimo WCAG
- [#28](https://github.com/carolabenvenuto-uces/planit/issues/28) — Imagen de mockup reutilizada sin optimizar
- [#29](https://github.com/carolabenvenuto-uces/planit/issues/29) — Modernizar 2 propiedades CSS legacy

**Nota metodológica:** el testing del Momento 1 se ejecutó de forma
diferida (después de que las PRs de Carola ya estaban mergeadas a
`develop`), sobre el último commit de cada rama `feature/` antes de su
merge — preservando así el espíritu de "testing pre-integración" aunque
el timing real fue posterior.

### Momento 2 — Testing post-merge a develop
Ejecutado sobre `develop` ya con todas las features integradas. Los 5
issues de Momento 1 fueron re-verificados: **los 5 siguen presentes,
sin corregir todavía.** No se detectaron hallazgos nuevos.

**Estado para el Coordinador:** los issues #25 a #29 deben resolverse
antes de que se cree la rama `release/actividad-obligatoria-2`, según
el criterio de "Momento 2 — Testing post-merge a develop" de la
consigna ("Los issues generados aquí deben resolverse antes de que el
Coordinador cree la release").