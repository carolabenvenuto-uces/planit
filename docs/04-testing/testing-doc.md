# Índice de Testing — Actividad Obligatoria N°2

Este archivo centraliza el estado de los 5 test cases ejecutados sobre
PlanIT, cubriendo compatibilidad, responsive, performance, accesibilidad
y estructura HTML semántica.

## Test cases

| # | Archivo | Qué cubre | Resultado (MCP real, sobre develop) |
|---|---|---|---|
| 1 | [test-case-1.md](test-case-1.md) | Compatibilidad navegadores desktop | ✅ Fix de #25 verificado en código |
| 2 | [test-case-2.md](test-case-2.md) | Responsive dispositivos móviles | ✅ #27 confirmado; #26 verificado en CSS |
| 3 | [test-case-3.md](test-case-3.md) | Performance y carga | 🔴 Fix de #28 confirmado ineficaz → nuevo Issue #33 |
| 4 | [test-case-4.md](test-case-4.md) | Accesibilidad web | ✅ Sin violaciones |
| 5 | [test-case-5.md](test-case-5.md) | Estructura HTML semántica y CSS | ✅ 1 de 2 avisos de #29 corregido |

## Historial de ejecuciones

### Ronda 1 — Playwright directo, 21/09/2026
Ejecutada sobre `feature/responsive-design-add-responsive-styles`
(estado pre-merge de Carola) y luego repetida sobre `develop`
post-merge, usando la librería de Playwright directamente porque el
servidor MCP fallaba al conectar (canal "chrome" no instalado en este
entorno). Se crearon 5 issues (#25-#29) documentando bugs y mejoras
encontrados.

**Nota metodológica sobre el timing:** esta ronda se ejecutó de forma
diferida, después de que las PRs de Carola ya estaban mergeadas a
`develop` — no representa estrictamente una validación pre-merge en
tiempo real, aunque se usó el último commit de cada rama antes de su
merge para aproximarla. Esta excepción fue señalada como punto
bloqueante en la revisión de PR #31 por Coordinación (@ValeriaMSilva),
pendiente de resolución formal.

### Ronda 2 — MCP real, 25/09/2026
Tras corregir la configuración del servidor MCP de Playwright
(agregando el flag `--browser chromium`), se confirmó su conexión real
y se re-ejecutaron los 5 test cases sobre `develop`, ya con el fix de
Carola (PR #32, que cierra los Issues #25 a #28) integrado.

**Limitación descubierta y documentada:** el servidor MCP disponible
en este entorno solo expone herramientas para un único motor de
renderizado (Chromium). A diferencia de la librería completa de
Playwright (usada en la Ronda 1), no hay forma de cambiar a Firefox,
WebKit o Edge real vía MCP — solo se puede variar el tamaño de
viewport. Esto significa que la Ronda 2 cumple el requisito de "usar
Playwright MCP", pero pierde la cobertura cross-engine real que sí
tenía la Ronda 1.

**Resultado de la verificación:**
- Issues #25, #27: confirmados resueltos (#27 visualmente, #25 a nivel
  de código, sin poder confirmar en WebKit real por la limitación de
  motor)
- Issue #26: fix verificado en CSS, no confirmable visualmente por
  limitación del entorno headless (scrollbars overlay en Linux)
- Issue #28: **fix confirmado ineficaz** — el análisis de performance
  demostró que `loading="lazy"` en 3 de 4 imágenes no tiene ningún
  impacto real, porque el logo (que no recibió el fix) fuerza la
  descarga igual. Se creó el [Issue #33](https://github.com/carolabenvenuto-uces/planit/issues/33)
  documentando este hallazgo con evidencia del diff real del PR #32.
- Issue #29: 1 de 2 avisos corregido (`clip-path`), el otro
  intencionalmente sin cambios según la propia sugerencia del issue.
  Se sugiere cerrarlo.

## Resumen de issues

- [#25](https://github.com/carolabenvenuto-uces/planit/issues/25) — Contraste roto en `<select>` con Safari/WebKit — **cerrado** (verificado en código, Ronda 2)
- [#26](https://github.com/carolabenvenuto-uces/planit/issues/26) — Tablas desbordan sin indicador de scroll en mobile — **cerrado** (verificado en código, Ronda 2)
- [#27](https://github.com/carolabenvenuto-uces/planit/issues/27) — Links de footer con área de toque menor al mínimo WCAG — **cerrado, confirmado visualmente**
- [#28](https://github.com/carolabenvenuto-uces/planit/issues/28) — Imagen de mockup reutilizada sin optimizar — **cerrado, pero fix ineficaz** (ver #33)
- [#29](https://github.com/carolabenvenuto-uces/planit/issues/29) — Modernizar 2 propiedades CSS legacy — **abierto**, 1 de 2 avisos corregido, se sugiere cerrar
- [#33](https://github.com/carolabenvenuto-uces/planit/issues/33) — Logo y tarjetas siguen usando el mockup como placeholder — **abierto**, nuevo hallazgo de la Ronda 2

## Puntos pendientes de Coordinación

Según la revisión de la PR #31 (@ValeriaMSilva), quedan 2 puntos que
requieren decisión de Coordinación, no corrección técnica de QA:

1. **Uso de MCP vs Playwright directo:** resuelto en la Ronda 2 — se
   logró conectar el MCP real, aunque con la limitación de motor único
   documentada arriba.
2. **Momento 1 diferido:** sigue siendo una limitación de timing real
   (no técnica) — el testing de la Ronda 1 se ejecutó después del
   merge de las ramas de Carola. Se solicita a Coordinación confirmar
   si esta excepción metodológica se acepta, dado que no es posible
   retroactivamente ejecutar un test "pre-merge" sobre una rama que ya
   fue integrada.