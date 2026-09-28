# Especificación Técnica (Spec) - Coordinador / DevOps

- **Proyecto:** PlanIT - Plataforma All-in-One de Organización & Experiencias
- **Entrega:** Actividad Obligatoria N°2
- **Rol:** Coordinador / DevOps
- **Responsable:** @ValeriaMSilva
- **Rama:** feature/coord-devops-update-figma-and-readme

---

## 1. Qué se va a hacer
Resolución de Request Changes de la Actividad Obligatoria N°1 mediante ramas fix/ y ejecución del backport hacia develop. Actualización del mockup en Figma incorporando la paleta de colores definitiva (primarios, secundarios, neutros), jerarquía tipográfica (h1-h6, body), espaciados (padding/margin) y estados de interacción (hover, focus, disabled). Exportación de la imagen del diseño a docs/01-mockup/actividad-obligatoria-2/diseño-con-estilos.png. Sincronización de plan.md y actualización de README.md con los enlaces al mockup exportado y al archivo de Figma. Coordinación de la integración de ramas feature/ hacia develop, administración de al menos 4 Code Reviews asistidos con IA mediante GitHub Copilot Agent Mode cargando Request Changes en el diff, preparación de la rama release/actividad-obligatoria-2 y despliegue del sitio en GitHub Pages.

---

```
## 2. Criterios de Aceptación (Checklist)

- [x] spec-devops.md creado y commiteado en docs/03-specs/actividad-obligatoria-2/ antes de realizar otros cambios.
- [x] Backport de la Actividad N°1 aprobado e integrado en develop.
- [x] Mockup en Figma actualizado con colores, fuentes, espaciados y estados de interacción (hover/focus).
- [x] Imagen exportada en docs/01-mockup/actividad-obligatoria-2/diseño-con-estilos.png.
- [x] Enlace al archivo Figma y al mockup exportado actualizados en README.md.
- [x] Archivo plan.md actualizado con los objetivos de la Actividad N°2.
- [x] Al menos 4 Code Reviews asistidos con Copilot Agent Mode realizados sobre las PRs del equipo.
- [x] Registro de contribuciones y PRs actualizado en changelog.md (PR #20 e Issue #19 registradas).
- [x] Rama release/actividad-obligatoria-2 creada desde develop y GitHub Pages habilitado.

```

---

## 3. Evidencia de Cierre (A completar al finalizar las revisiones de PRs)

### Prompts de Code Review utilizados en Copilot Agent Mode

#### PR #31 — Frontend / Responsive
```text
Revisa la PR #31 de Frontend/Responsive. Analiza el diff completo y verifica responsive design, accesibilidad, consistencia visual con el mockup y ausencia de regresiones. Señala hallazgos concretos con archivo y línea, y emite un veredicto final de aprobación o Request Changes.
```
**Veredicto:** Aprobada.

#### PR #32 — QA
```text
Revisa la PR #32 de QA. Analiza el diff completo y verifica cobertura, reproducibilidad, claridad de los casos y compatibilidad con el entorno del proyecto. Señala hallazgos concretos con archivo y línea, y emite un veredicto final de aprobación o Request Changes.
```
**Veredicto:** Aprobada.

#### PR #34 — Assets #33
```text
Revisa la PR #34, asociada al issue #33 de Assets. Analiza el diff completo y verifica que los recursos estén versionados localmente, que las rutas sean correctas, que no existan dependencias externas innecesarias y que se mantenga la consistencia con la documentación. Señala hallazgos concretos y emite un veredicto final de aprobación o Request Changes.
```
**Veredicto:** Aprobada.

#### Revisión integral de integración
```text
Audita la integración de las PRs del equipo para la Actividad Obligatoria N°2. Comprueba la coherencia entre documentación, mockup, assets, responsive y QA; revisa posibles regresiones y valida que el estado sea apto para release. Indica hallazgos con archivo y línea y emite un veredicto final.
```
**Veredicto:** Aprobada.

### Sistema de Diseño / Mockup (Figma)
- Se actualizaron en Figma la paleta de colores, la jerarquía tipográfica, los espaciados y los estados de interacción.
- Se exportó el activo vectorial local `logo-planit.svg` en `docs/01-mockup/actividad-obligatoria-2/` (menos de 1 KB).
- Se eliminó la dependencia externa de `placehold.co`, reemplazándola por el activo local.

### Decisiones de Diseño en el Mockup
- **Paleta de Colores:** Se definieron variables para colores primarios, secundarios y neutros.
- **Tipografía:** Se definió la jerarquía `h1`-`h6` y `body`.
- **Espaciados:** Se definieron escalas consistentes de `padding` y `margin`.
- **Estados:** Se documentaron los estados `hover`, `focus` y `disabled`.

### Decisiones de Coordinación y Obstáculos Resueltos
- Se aprobó formalmente la excepción del Momento 1 diferido en QA, evaluado sobre el commit pre-merge.
- Se otorgó aval técnico explícito al QA Tester para utilizar Playwright directo por las restricciones del canal `chrome` local.
- Se gestionó la rama `release/actividad-obligatoria-2`, se realizó el despliegue en GitHub Pages y se abrió la PR hacia `master`.

### Obstáculos Encontrados y Soluciones
- La restricción del canal `chrome` local se resolvió autorizando Playwright directo para las pruebas de QA.
- La dependencia de `placehold.co` se resolvió mediante el uso del activo local `logo-planit.svg`.
- El Momento 1 diferido de QA quedó documentado y aprobado sobre el commit pre-merge.
