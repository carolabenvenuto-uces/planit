# Comparativa de Modelos de IA

## Tarea comparada
Revisión/auditoría de código del proyecto PlanIT, evaluando calidad
técnica (semántica HTML5, buenas prácticas, cumplimiento de
especificaciones) sobre trabajo real del equipo.

## Modelos comparados
- **Claude** (Claude Agent en VS Code) — usado en `prompts-1.md`
- **Gemini Flash** (gemini.google.com) — usado en `prompts-4.md`

## Diferencias en el enfoque

| Aspecto | Claude | Gemini Flash |
|---|---|---|
| Acceso al repositorio | Directo (modo agente: corrió `git diff`, `git log`, `gh api`) | Ninguno — se le pegó el código manualmente |
| Método de prompting | Role prompting | Chain-of-thought |
| Alcance de la revisión | Code review completa de una PR (requerimientos, consistencia, riesgos, configuración técnica) | Análisis técnico enfocado (semántica, accesibilidad, preparación CSS/JS) |
| Verificación de evidencia | Verificó afirmaciones contra el diff real (ej. detectó que `index.html` decía tener contenido pero estaba vacío) | Analizó únicamente el código pegado, sin poder contrastar contra el historial del repositorio |
| Publicación del resultado | Publicó directamente el comentario en GitHub (con confirmación previa) | Solo generó el análisis en el chat; la publicación fue manual |
| Formato de respuesta | Comentario estructurado en bloques (Aprobado / A modificar / A perfeccionar) | Respuesta en pasos numerados siguiendo la consigna (1 a 4) |

## Resultado de cada uno

**Claude** detectó inconsistencias entre lo que la documentación de la PR afirmaba y lo que realmente existía en el repositorio (por ejemplo, un README con links rotos a archivos inexistentes, y un checklist que decía que `index.html` tenía contenido cuando en realidad estaba vacío). Esto fue posible porque Claude pudo ejecutar comandos reales y comparar contra el estado real del código, no solo leer lo que se le mostraba.

**Gemini** detectó problemas de calidad más específicos del código en sí: uso incorrecto de la etiqueta `<article>` en dos bloques que no eran contenido autocontenido, un atributo `alt` redundante, falta de `scope="col"` en una tabla, y estilos inline pendientes de migrar a CSS. Su análisis fue más profundo a nivel de detalle técnico del HTML, pero limitado al fragmento de código que se le pegó — no pudo verificar nada contra el historial de commits ni contra otros archivos del proyecto.

## Cuál fue más útil, y por qué

Depende de la tarea:

- Para **revisar una Pull Request completa** (evaluar si cumple con la documentación, si hay contradicciones entre lo que promete y lo que entrega, y publicar la revisión directamente en GitHub), **Claude fue más útil**. Su capacidad de ejecutar comandos y verificar el estado real del repositorio detectó problemas que un análisis de solo lectura no hubiera encontrado — por ejemplo, la discrepancia entre `index.html` y lo que decía el checklist habría pasado desapercibida sin poder correr `git diff`.

- Para **auditar la calidad de un archivo de código puntual** (semántica HTML5, accesibilidad, buenas prácticas), **Gemini fue igual de útil y más simple de usar**, ya que no requiere una integración con el repositorio — alcanza con copiar y pegar el código. Su nivel de detalle en accesibilidad y semántica fue comparable al de una revisión manual cuidadosa.

## Conclusión

Ambos modelos son sólidos para tareas de revisión de código, pero cumplen mejor roles distintos dentro del flujo de trabajo del equipo: **Claude en modo agente es preferible cuando la revisión necesita contexto del repositorio completo** (historial de commits, consistencia entre archivos, verificación de PRs), mientras que **Gemini es una opción más rápida y liviana para auditorías puntuales de un archivo específico**, sin necesidad de configurar ninguna integración. Para este proyecto, el flujo ideal fue usar Claude para las revisiones formales de PR y Gemini como segunda opinión de calidad de código sobre trabajo ya mergeado.