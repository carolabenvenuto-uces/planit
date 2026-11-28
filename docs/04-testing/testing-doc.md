# Informe de Testing — PWI 2026 (Segundo Parcial)

Este archivo centraliza el estado de los 13 test cases ejecutados sobre PlanIT, cubriendo compatibilidad, responsive, performance, accesibilidad, estructura HTML semántica, componentes Bootstrap y HTML avanzados, y auditorías Lighthouse (Test Cases 11, 12 y 13, del Segundo Parcial).

## Test cases

| # | Archivo | Qué cubre | Resultado (MCP real, sobre develop) |
|---|---|---|---|
| 1 | [test-case-1.md](test-case-1.md) | Compatibilidad navegadores desktop | ✅ Fix de #25 verificado en código |
| 2 | [test-case-2.md](test-case-2.md) | Responsive dispositivos móviles | ✅ #27 confirmado; #26 verificado en CSS |
| 3 | [test-case-3.md](test-case-3.md) | Performance y carga | 🔴 Fix de #28 confirmado ineficaz → nuevo Issue #33 |
| 4 | [test-case-4.md](test-case-4.md) | Accesibilidad web | ✅ Sin violaciones |
| 5 | [test-case-5.md](test-case-5.md) | Estructura HTML semántica y CSS | ✅ 1 de 2 avisos de #29 corregido |
| 6 | [test-case-6.md](test-case-6.md) | Migración y validación responsive Bootstrap 5.3 | ✅ Sin overflow · #59-#62 (#63 pend.) |
| 7 | [test-case-7.md](test-case-7.md) | Modal Bootstrap: contenido, accesibilidad e interacción | ✅ PASS en 3 dispositivos; capturas enlazadas |
| 8 | [test-case-8.md](test-case-8.md) | Toast Bootstrap: mensaje exacto, responsive y auto-hide | ✅ PASS en 3 dispositivos; capturas enlazadas |
| 9 | [test-case-9.md](test-case-9.md) | Componente Iframe Multimedia (Taller Video) | ⏳ Evidencia manual pendiente en 3 dispositivos |
| 10 | [test-case-10.md](test-case-10.md) | Componente Details/Summary (FAQ Eventos) | ✅ PASS en 3 dispositivos (iPhone 14 Pro, Galaxy S23, iPad Air) |
| 11 | [test-case-11-lighthouse-baseline.md](test-case-11-lighthouse-baseline.md) | Lighthouse baseline del Segundo Parcial (Desktop, mediana de 3 corridas sobre GitHub Pages) | ⚠️ 95 / 97 / 92 / 91 (Perf. / Acc. / BP / SEO): Best Practices y SEO por debajo de 95 |
| 12 | [test-case-12-lighthouse-post-fetch.md](test-case-12-lighthouse-post-fetch.md) | Lighthouse post-fetch: `develop` @ `6aae3d8`, con el catálogo cargado por `ApiService` (PR #147). Desktop, mediana de 3 corridas | ❌ NO PASA en Best Practices – sin regresión: 96 / 97 / 92 / 100. Best Practices 92 contra un umbral de 95, por el favicon ([#142](https://github.com/carolabenvenuto-uces/planit/issues/142)) y las cookies del iframe de YouTube ([#156](https://github.com/carolabenvenuto-uces/planit/issues/156)). Verifica [#141](https://github.com/carolabenvenuto-uces/planit/issues/141), [#143](https://github.com/carolabenvenuto-uces/planit/issues/143) y [#144](https://github.com/carolabenvenuto-uces/planit/issues/144) |
| 13 | [test-case-13-lighthouse-post-library.md](test-case-13-lighthouse-post-library.md) | Lighthouse post-librería: `develop` @ `c8d7338`, con Chart.js 4.4.7 y `GraficoService` (PR #149). Desktop, mediana de 3 corridas | ❌ NO PASA en Best Practices – sin regresión: 96 / 97 / 92 / 100, iguales al TC12. Mismas causas: [#142](https://github.com/carolabenvenuto-uces/planit/issues/142) y [#156](https://github.com/carolabenvenuto-uces/planit/issues/156) |

## Historial de ejecuciones

### Ronda 1 — Playwright directo, 21/09/2026
Ejecutada sobre `feature/responsive-design-add-responsive-styles` (estado pre-merge de Carola) y luego repetida sobre `develop` post-merge, usando la librería de Playwright directamente porque el servidor MCP fallaba al conectar (canal "chrome" no instalado en este entorno). Se crearon 5 issues (#25-#29) documentando bugs y mejoras encontrados.

**Nota metodológica sobre el timing:** esta ronda se ejecutó de forma diferida, después de que las PRs de Carola ya estaban mergeadas a `develop` — no representa strictly una validación pre-merge en tiempo real, aunque se usó el último commit de cada rama antes de su merge para aproximarla. Esta excepción fue señalada como punto bloqueante en la revisión de PR #31 por Coordinación (@ValeriaMSilva), pendiente de resolución formal.

### Ronda 2 — MCP real, 25/09/2026
Tras corregir la configuración del servidor MCP de Playwright (agregando el flag `--browser chromium`), se confirmó su conexión real y se re-ejecutaron los 5 test cases sobre `develop`, ya con el fix de Carola (PR #32, que cierra los Issues #25 a #28) integrado.

**Limitación descubierta y documentada:** el servidor MCP disponible en este entorno solo expone herramientas para un único motor de renderizado (Chromium). A diferencia de la librería completa de Playwright (usada en la Ronda 1), no hay forma de cambiar a Firefox, WebKit o Edge real vía MCP — solo se puede variar el tamaño de viewport. Esto significa que la Ronda 2 cumple el requisito de "usar Playwright MCP", pero pierde la cobertura cross-engine real que sí tenía la Ronda 1.

**Resultado de la verificación:**
- Issues #25, #27: confirmados resueltos (#27 visualmente, #25 a nivel de código, sin poder confirmar en WebKit real por la limitación de motor)
- Issue #26: fix verificado en CSS, no confirmable visualmente por limitación del entorno headless (scrollbars overlay en Linux)
- Issue #28: **fix confirmado ineficaz** — el análisis de performance demostró que `loading="lazy"` en 3 de 4 imágenes no tiene ningún impacto real, porque el logo (que no recibió el fix) fuerza la descarga igual. Se creó el [Issue #33](https://github.com/carolabenvenuto-uces/planit/issues/33) documentando este hallazgo con evidencia del diff real del PR #32.
- Issue #29: 1 de 2 avisos corregido (`clip-path`), el otro intencionalmente sin cambios según la propia sugerencia del issue. Se sugiere cerrarlo.

### Ronda 3 — Lighthouse del Segundo Parcial, 25 a 27/11/2026
Tres auditorías con Lighthouse CLI 13.6.0 en modo Desktop sobre GitHub Pages, cada una con la mediana de 3 corridas: línea base antes de los merges (TC11), después del fetch (TC12, PR #147) y después de Chart.js (TC13, PR #149). El plan, el umbral de 95 por categoría y el criterio de regresión están en [`spec-tester-qa-segundo-parcial.md`](../03-specs/segundo-parcial/spec-tester-qa-segundo-parcial.md) (MOMENTO 1, sección 3, y MOMENTO 2, sección 3).

**Resultado:** ninguna regresión en todo el parcial, pero **Best Practices queda en 92 en los tres momentos**, por debajo del umbral de 95. Por eso el veredicto del TC12 y del TC13 es **NO PASA en Best Practices – sin regresión**. Las dos causas son el 404 de `favicon.ico` ([#142](https://github.com/carolabenvenuto-uces/planit/issues/142)) y el aviso de cookies del iframe de YouTube ([#156](https://github.com/carolabenvenuto-uces/planit/issues/156)); corregir cualquiera de las dos lleva la categoría a 96. Las issues abiertas en esta ronda y su estado están en la sección 4 del MOMENTO 2 del spec.

## Resumen de issues

- [#25](https://github.com/carolabenvenuto-uces/planit/issues/25) — Contraste roto en `<select>` con Safari/WebKit — **cerrado** (verificado en código, Ronda 2)
- [#26](https://github.com/carolabenvenuto-uces/planit/issues/26) — Tablas desbordan sin indicador de scroll en mobile — **cerrado** (verificado en código, Ronda 2)
- [#27](https://github.com/carolabenvenuto-uces/planit/issues/27) — Links de footer con área de toque menor al mínimo WCAG — **cerrado, confirmado visualmente**
- [#28](https://github.com/carolabenvenuto-uces/planit/issues/28) — Imagen de mockup reutilizada sin optimizar — **cerrado, pero fix ineficaz** (ver #33)
- [#29](https://github.com/carolabenvenuto-uces/planit/issues/29) — Modernizar 2 propiedades CSS legacy — **cerrado** (25/09/2026), resuelto con la [PR #32](https://github.com/carolabenvenuto-uces/planit/pull/32); 1 de 2 avisos corregido, el otro sin cambios intencionalmente
- [#33](https://github.com/carolabenvenuto-uces/planit/issues/33) — Logo y tarjetas siguen usando el mockup como placeholder — **cerrado** (27/09/2026), resuelto con la [PR #34](https://github.com/carolabenvenuto-uces/planit/pull/34); hallazgo de la Ronda 2

## Puntos pendientes de Coordinación

Según la revisión de la PR #31 (@ValeriaMSilva), quedan 2 puntos que requieren decisión de Coordinación, no corrección técnica de QA:

1. **Uso de MCP vs Playwright directo:** resuelto en la Ronda 2 — se logró conectar el MCP real, aunque con la limitación de motor único documentada arriba.
2. **Momento 1 diferido:** sigue siendo una limitación de timing real (no técnica) — el testing de la Ronda 1 se ejecutó después del merge de las ramas de Carola. Se solicita a Coordinación confirmar si esta excepción metodológica se acepta, dado que no es posible retroactivamente ejecutar un test "pre-merge" sobre una rama que ya fue integrada.
