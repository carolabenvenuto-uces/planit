# Especificación Técnica (Spec) - Coordinador / DevOps

- **Proyecto:** PlanIT - Plataforma All-in-One de Organización & Experiencias
- **Entrega:** Actividad Obligatoria N° 3
- **Rol:** Coordinador / DevOps
- **Responsable:** Carola Benvenuto (@carolabenvenuto-uces)
- **Rama:** `feature/coord-devops-tercera-entrega`
- **Issue principal:** [#74](https://github.com/carolabenvenuto-uces/planit/issues/74)
- **Fecha:** 19 de octubre de 2026

---

## MOMENTO 1: Planificación Previa (ANTES de comenzar)

### 1. Qué se va a hacer
Coordinación integral de la Actividad Obligatoria N° 3 (AO3) aplicando metodología Spec-Driven Development y flujo Gitflow estricto sobre `develop`. Se ejecutará el backport final desde `master` hacia `develop` para trasladar todas las correcciones aprobadas del Primer Parcial (`v1.1-primer-parcial`) y establecer la base limpia de trabajo. 

Se gestionará el tablero Kanban en GitHub Projects creando y asignando las issues del equipo. Se realizarán al menos 4 Code Reviews asistidas mediante **GitHub Copilot Agent Mode**, registrando observaciones con `CHANGES_REQUESTED` directamente en las líneas del diff sobre las PRs de `feature/`. Finalmente, se actualizará el archivo `README.md`, el historial en `changelog.md`, la navegación entre índices en `docs/`, se creará la rama `release/tercera-entrega`, se verificará el despliegue en GitHub Pages, se ejecutará la limpieza de ramas secundarias y se publicará la versión oficial bajo el tag `v1.1-tercera-entrega`.

### 2. Correcciones del Primer Parcial y Backport
Las observaciones planteadas por el docente (RC1 a RC17) durante la revisión del Primer Parcial fueron resueltas mediante ramas `fix/` mergeadas sobre `release/primer-parcial`, que luego se integró a `master` y se versionó con el tag `v1.1-primer-parcial`.

| Estado / Tarea | Rama | PR |
| --- | --- | --- |
| Resolución de RC1 a RC9 (primera revisión) | `fix/ao3-rc-cierre-release-primer-parcial` → `release/primer-parcial` | [#69](https://github.com/carolabenvenuto-uces/planit/pull/69) |
| Resolución de RC10 a RC17 (segunda revisión) | `fix/pr67-segunda-revision` → `release/primer-parcial` | [#70](https://github.com/carolabenvenuto-uces/planit/pull/70) |
| Release del Primer Parcial integrada a `master` | `release/primer-parcial` → `master` | [#67](https://github.com/carolabenvenuto-uces/planit/pull/67) |
| Backport de correcciones hacia `develop` | `backport/release-primer-parcial` → `develop` | [#73](https://github.com/carolabenvenuto-uces/planit/pull/73) |

- La rama `master` cuenta con la versión oficial y el tag `v1.1-primer-parcial`, publicado como GitHub Release.
- La PR de backport ([#73](https://github.com/carolabenvenuto-uces/planit/pull/73)) fue mergeada a `develop`, estableciendo la base de trabajo para el inicio de la AO3.

### 3. Plan de Coordinación, Orden de Integración y Criterios de Aprobación
El desarrollo de la AO3 se gestionará mediante el flujo **Gitflow** con la rama base `develop`. La integración de las ramas de trabajo se realizará en el siguiente orden secuencial de dependencias:

1. **Backport Base:** Consolidación de correcciones del Primer Parcial en `develop` (Completado - PR [#73](https://github.com/carolabenvenuto-uces/planit/pull/73)).
2. **Spec DevOps (Momento 1):** Commit inicial del plan de coordinación en `docs/03-specs/actividad-obligatoria-3/spec-devops.md` en la rama `feature/coord-devops-tercera-entrega`.
3. **Deuda Técnica (Issue #68):** Tratamiento y reestructuración de la lógica de componentes JS (`js/componentes-bootstrap.js`).
4. **Features AO3:** Integración paulatina de las nuevas funcionalidades desarrolladas por el equipo mediante ramas `feature/`.
5. **Release & Cierre:** Creación de `release/tercera-entrega` para validación final, despliegue en GitHub Pages, etiquetado `v1.1-tercera-entrega` y merge final a `master`.

**Criterios de Aprobación para PRs:**
- Formulario de PR completado con checklist y referencias directas a las Issues vinculadas.
- Código verificado sin errores sintácticos, manteniendo semántica HTML5, accesibilidad ARIA y responsividad.
- Al menos un ciclo de revisión con **GitHub Copilot Agent Mode** registrando observaciones en el diff si corresponden.
- Aprobación formal (`Approve`) por parte de la Coordinadora previo al merge a `develop`.
- Registro obligatorio de los cambios en `changelog.md`.

### 4. Herramientas a Utilizar: Justificación de Copilot Agent Mode
Se utilizará **GitHub Copilot Agent Mode** para la auditoría de código y revisiones de Pull Requests.

- **Justificación:** Permite realizar análisis estáticos de código contextualizados en el diff de cada PR. La herramienta evalúa automáticamente el cumplimiento de las guías de estilo, semántica HTML, estructura CSS responsiva, accesibilidad WCAG/ARIA y buenas prácticas de JavaScript, automatizando la detección temprana de desvíos y garantizando que ningún cambio se integre a `develop` sin cumplir los estándares exigidos por la cátedra.

### 5. Criterios de Aceptación (Checklist)
- [x] `spec-devops.md` creado y commiteado en `docs/03-specs/actividad-obligatoria-3/` antes de cualquier otra tarea de coordinación de la AO3.
- [x] Correcciones del Primer Parcial aplicadas y documentadas con entradas `[Fixed]` en `changelog.md`.
- [x] Backport desde `master` (o `release/primer-parcial`) hacia `develop` realizado exitosamente.
- [ ] Tablero Kanban en GitHub Projects administrado con las issues de la AO3 asignadas.
- [ ] Al menos 4 Code Reviews asistidas con IA (Copilot Agent Mode) documentadas con observaciones `CHANGES_REQUESTED` cargadas en las líneas del diff.
- [ ] Deuda técnica (Issue #68) abordada y reorganizada según las necesidades de la AO3.
- [ ] `plan.md` y `README.md` actualizados con la información de la tercera entrega y sus enlaces correspondientes.
- [ ] Rama `release/tercera-entrega` creada a partir de `develop`.
- [ ] GitHub Pages activo y actualizado verificando el correcto despliegue de la AO3.
- [ ] Limpieza de ramas efectuada en el remoto (solo visibles: `master`, `develop` y `release/tercera-entrega`).
- [ ] Tag estándar `v1.1-tercera-entrega` publicado junto a la GitHub Release oficial.
- [ ] Registro completo en `changelog.md` y navegación verificada entre todos los índices de `docs/`.

---

## MOMENTO 2: Evidencia de Cierre (AL FINALIZAR)

### 1. Code Reviews Asistidos con IA

> **Cambio de herramienta respecto del plan inicial:** el BEFORE planificó las code reviews con GitHub Copilot Agent Mode. Las tres primeras revisiones de la PR #78 (21/10, 22/10 y 23/10) se realizaron con Copilot, pero resultaron incompletas: Copilot no analizaba todos los archivos de la PR ni revisaba su contenido en profundidad. Llegó a aprobar la PR en la primera revisión y omitió errores que luego detectó el Desarrollador JavaScript. A partir de ese resultado, las revisiones siguientes se realizan con **Claude (Anthropic)**, con acceso de lectura al repositorio (commits, diff, archivos y versiones anteriores) y con la consigna de la actividad como contexto. Cada resultado se contrasta manualmente con la consigna, la rúbrica y `plan.md` antes de publicarse en GitHub. Este criterio es consistente con el aplicado en la coordinación del Primer Parcial (ver `docs/03-specs/primer-parcial/spec-devops.md`).

#### Prompt 1 — Reviews de la PR #78 con Copilot (21/10, 22/10 y 23/10)
- **Herramienta:** GitHub Copilot Agent Mode
- **Utilizado en:** revisión inicial (21/10, resultado: Approve), Review 1 (22/10) y Review 2 (23/10) <!-- confirmar si en alguna se usó otro prompt -->
- **Contexto:** la propia PR #78 (descripción, commits y diff), junto con el texto de la consigna del rol Arquitecto de Diagramas de Actividades. No se adjuntaron archivos individuales: se indicó a Copilot revisar dentro de la PR los artefactos del rol mencionados en el prompt y, además, el `changelog.md`.

```text
Actúa como un Auditor Senior de Software y Tech Lead para la Actividad Obligatoria N° 3 del proyecto PlanIT.
Realiza una revisión estricta y detallada (Code Review) de la Pull Request de Valeria (Arquitecto de Diagramas de Actividades) contra la rama `develop`.

Evalúa minuciosamente los siguientes puntos de la consigna y rúbrica oficial:

1. ORDEN DE COMMITS Y HISTORIAL (Requisito Bloqueante):
- Verifica en el historial si `docs/03-specs/actividad-obligatoria-3/spec-arq-diagramas.md` fue commiteado ANTES de la creación de cualquier archivo `.puml`, `.png` o `.md`.

2. ESTRUCTURA Y ARCHIVOS PERMITIDOS (Límites del Rol):
- Confirma que la PR contenga ÚNICAMENTE los artefactos de su rol:
  * `docs/03-specs/actividad-obligatoria-3/spec-arq-diagramas.md`
  * `docs/05-diagramas/01-diagrama-de-actividades/diagramas-doc.md`
  * Los 4 archivos `.puml` y sus correspondientes 4 imágenes `.png` para los flujos principales.
- Asegúrate de que NO haya modificado archivos fuera de su alcance (como `js/script.js`, `index.html`, `css/`, etc.).

3. ESTRUCTURA DE LA SPEC (`spec-arq-diagramas.md`):
- Sección BEFORE (Momento 1): ¿Identifica los 4 flujos principales, justifica las swimlanes (Usuario/Sistema) e incluye el checklist de criterios de aceptación?
- Sección AT CLOSE (Momento 2): ¿Incluye el prompt exacto utilizado en Copilot Agent Mode (en bloque de código) mencionando los contextos adjuntos (`plan.md`, `index.html`, mockup), el fragmento `.puml` generado y la documentación de los ajustes manuales de sintaxis/diseño?

4. CALIDAD TÉCNICA Y SINTAXIS DE LOS DIAGRAMAS PLANTUML (.puml y .png):
- ¿Son exactamente 4 diagramas completos con inicio (`start`), fin (`stop`), actividades (`:actividad;`), decisiones (`if-then-else`) y ciclos (`while`/`repeat`)?
- ¿Se utilizan particiones/swimlanes (`|Usuario|` y `|Sistema|`) en los flujos donde interactúa el usuario con la plataforma?
- ¿Existe coherencia lógica entre la modelación de los diagramas y lo planificado en `plan.md`?
- ¿Están correctamente exportados tanto en formato `.puml` como `.png` de alta resolución?

5. DOCUMENTACIÓN DE INTEGRACIÓN (`diagramas-doc.md`):
- ¿Incluye un índice claro de los 4 diagramas, descripciones breves, imágenes `.png` embebidas, enlaces a los archivos `.puml` editables e instrucciones para editarlos (plantumleditor.com o VS Code)?

Proporciona el reporte formateado en Markdown indicando:
- Estado General: [Aprobado ✅ / Requiere Cambios ⚠️]
- Check de Criterios de Evaluación
- Puntos Fuertes Detectados
- Observaciones o Errores Específicos (con referencia a archivos/líneas si aplica)
- Veredicto y recomendaciones para el merge a `develop`.
```

#### Prompt 2 — Review de la PR #78 con Claude (25/10)
- **Herramienta:** Claude (Anthropic)
- **Utilizado en:** Review 3 (25/10)
- **Contexto:** consigna completa de la Actividad Obligatoria N.° 3 (PDF) y acceso de lectura a la PR #78: descripción, 12 commits, diff, archivos `.puml`/`.png`, `diagramas-doc.md`, `spec-arq-diagramas.md`, `changelog.md` y versiones anteriores del spec (`0b469a4` y `4141471`).

```text
Te envio el archivo de la actividad N3 como contexto. En mi caso, Carola, me toco el rol doble: coordinador y tester javascript.
En este caso, desde mi rol de coordinador, debo hacerle una code review a Valeria, la ARQUITECTA DE DIAGRAMAS DE ACTIVIDADES. Ya hicimos algunas revisiones junto a mi compañero Facundo, el DESARROLLADOR JAVASCRIPT (quien me ayudo a sumar ciertas correcciones, ya que utilizando Copilot me auditaba mal). Y Valeria ya hizo todo lo que le pedimos. Podras ayudarme a revisar todo su trabajo y confirmar que cumpla totalmente con sus consignas y puntos de puntaje, y con las reglas del equipo en general, el orden de roles, el flujo de github y demas.
```

- **Prompt reformulado (plantilla para las reviews siguientes):** a partir de esta review, el pedido se estandarizó en el siguiente formato, utilizado en las revisiones posteriores:

```text
Actuá como revisor técnico de la Actividad Obligatoria N.° 3 de Programación Web I (UCES) para el proyecto PlanIT. Adjunto la consigna completa de la actividad como contexto.

Desde el rol de Coordinadora/DevOps, realizá una code review completa de la PR #<número> de <integrante> (rol: <rol>) contra la rama develop.

Verificá:
1. Cumplimiento de todas las tareas, entregables y puntos de la rúbrica del rol.
2. Orden de commits: el spec del rol debe estar commiteado antes que los demás artefactos.
3. Contenido de cada archivo de la PR (no solo el diff general), incluidas las versiones anteriores del spec si fueron modificadas.
4. Coherencia con plan.md, el mockup y los entregables de los demás roles.
5. Reglas del equipo: branch model, nomenclatura de ramas, issue vinculada, template de PR y registro en changelog.md con el título literal de la PR.
6. Que las observaciones de revisiones anteriores (propias y de otros integrantes) estén resueltas.

Entregá el resultado separando lo que cumple, los cambios bloqueantes (con archivo y línea) y las mejoras no bloqueantes, con un veredicto final: Aprobado o Requiere cambios.
```

- **Ajustes manuales:** se verificó cada observación contra el repositorio y se publicó como Request changes, separando 5 puntos bloqueantes de las mejoras menores. 

#### Prompts 3 y 4 — Reviews de la PR de Desarrollo JavaScript
*(A completar al revisar la PR de `feature/dev-javascript-logica-negocio`.)*

---

#### Resumen de Reviews y Observaciones (`CHANGES_REQUESTED`)

La revisión inicial de la PR #78 (21/10) se realizó con Copilot Agent Mode y emitió un veredicto de **Aprobado** con sugerencias no bloqueantes ([review de aprobación](https://github.com/carolabenvenuto-uces/planit/pull/78#pullrequestreview-5607393544)). Al contrastar ese resultado manualmente con la consigna, se detectó que la aprobación no correspondía: los 4 diagramas modelaban flujos genéricos (menú, validación, cálculo, resultados) en lugar de flujos de negocio de PlanIT. Por ese motivo, las revisiones siguientes pasaron a solicitar cambios.

| # | PR | Rol Revisado | Herramienta | Veredicto | Resumen de Validación y Líneas del Diff con Observaciones | Enlace |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | [#78](https://github.com/carolabenvenuto-uces/planit/pull/78) | Arquitecto de Diagramas | Copilot Agent Mode | 🔁 Request changes | Commit `0c62114`. Se validaron la estructura de la spec y la documentación. **Bloqueante:** los 4 flujos eran genéricos y se solicitó remodelarlos como flujos de negocio de PlanIT (crear evento, calcular presupuesto, buscar en catálogo, gestionar invitados). También se pidió: ciclo explícito de recorrido de colección en el flujo de cálculo, `console.log()` en el carril `\|Sistema\|`, regeneración de los `.png`, actualización de `diagramas-doc.md` y preservar el BEFORE documentando el rediseño en AT CLOSE. Comentario general de la review. | [Review 1](https://github.com/carolabenvenuto-uces/planit/pull/78#pullrequestreview-5616494502) |
| 2 | [#78](https://github.com/carolabenvenuto-uces/planit/pull/78) | Arquitecto de Diagramas | Copilot Agent Mode | 🔁 Request changes | Commit `64e23c9`. Se validaron la realineación a los 4 flujos de negocio, las estructuras de control, los carriles y la sincronización `.puml`/`.png`/`diagramas-doc.md`. Se cargaron 11 observaciones (RC-ARQ-01 a RC-ARQ-10 y RC-ARQ-12) sobre `actividad-flujo-1-menu.puml`, `actividad-flujo-2-validacion.puml`, `actividad-flujo-3-calculo.puml`, `actividad-flujo-4-resultados.puml`, `diagramas-doc.md` y `spec-arq-diagramas.md`, todas ancladas a nivel de archivo (línea 1). **Pendiente:** completar AT CLOSE y actualizar la descripción de la PR. La review omitió la sobrescritura del BEFORE y el error de lógica del Flujo 1, detectados después por el Desarrollador JavaScript. | [Review 2](https://github.com/carolabenvenuto-uces/planit/pull/78#pullrequestreview-5616570038) |
| 3 | [#78](https://github.com/carolabenvenuto-uces/planit/pull/78) | Arquitecto de Diagramas | Claude | 🔁 Request changes | Commit `38e7448`. Se validaron las correcciones de la review del Desarrollador JavaScript: BEFORE restaurado, AT CLOSE cerrado, checkbox de coherencia sin tildar y validaciones con `while` en los flujos 2 a 4. **Bloqueantes:** restaurar los contextos adjuntos en AT CLOSE; reemplazar el extracto genérico por un fragmento real de Copilot; en `actividad-flujo-1-crear-evento.puml`, modelar la decisión de reintento del usuario y ubicar las decisiones en `\|Sistema\|`; corregir la ruta `js/test/script.spec.js` y validar las firmas de la tabla de trazabilidad en `diagramas-doc.md`; usar el título literal de la PR en `changelog.md`. | [Review 3](https://github.com/carolabenvenuto-uces/planit/pull/78#pullrequestreview-5643481877) |
| 4 | # | Desarrollador JavaScript | Claude | 🔁 Request changes | *(A completar al cierre)* | [Review 4]() |

### 2. Obstáculos Encontrados y Resolución

| Obstáculo | Resolución |
| --- | --- |
| Las revisiones de la PR #78 realizadas con Copilot Agent Mode (21/10, 22/10 y 23/10) resultaron incompletas: Copilot no analizaba todos los archivos de la PR ni revisaba su contenido en profundidad. Aprobó la PR en la primera revisión pese a que los flujos no cumplían la consigna; en la tercera omitió la sobrescritura del BEFORE en `spec-arq-diagramas.md` y un error de lógica en el Flujo 1 (creación del evento con datos inválidos); y sus observaciones quedaron ancladas en la línea 1 de cada archivo, no en las líneas afectadas. | El Desarrollador JavaScript (@FacundoGuiraldes) realizó una revisión complementaria que detectó los puntos omitidos. A partir de allí, las code reviews se realizan con Claude, con acceso a todos los archivos, commits y versiones anteriores de la PR, y cada resultado se contrasta manualmente con la consigna, la rúbrica y `plan.md` antes de publicarse. |
| El commit inicial de `spec-devops.md` (`1baf4a8`, 19/10) quedó registrado después del merge del backport ([#73](https://github.com/carolabenvenuto-uces/planit/pull/73)). | Las correcciones del Primer Parcial y el backport correspondían al cierre de esa entrega. La coordinación propia de la AO3 (Kanban, reviews, documentación y release) comenzó a partir del commit del spec. |
| La deuda técnica de la issue [#68](https://github.com/carolabenvenuto-uces/planit/issues/68) implicó modificar `js/componentes-bootstrap.js` agregando `DOMContentLoaded`, mientras que la consigna de la AO3 indica no utilizar DOM ni eventos. | El archivo proviene de entregas anteriores y la modificación se limitó a guardias de existencia para evitar errores en consola. La lógica nueva de la AO3 se implementa exclusivamente en `js/script.js`, sin DOM ni eventos. |
| Al generar `spec-devops.md` con IA, quedaron pegados texto del chat y una copia duplicada del spec dentro de MOMENTO 2, además de referencias incorrectas a issues y PRs. | Se corrigieron el texto pegado y las referencias (issue #74; PRs #67, #69, #70 y #73) en los commits `53fa2f8` y `1e40957`. |
