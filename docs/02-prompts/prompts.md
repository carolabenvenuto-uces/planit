# Índice de Prompts de IA

Este archivo indexa los prompts utilizados por el equipo a lo largo del
proyecto, documentados con el formato completo (modelo, método, prompt
exacto, resultado esperado, resultado obtenido y correcciones manuales).

## Prompts documentados

| # | Archivo | Integrante | Modelo | Método |
|---|---|---|---|---|
| 1 | [prompts-1.md](prompts-1.md) | Facundo Guiraldes | Claude | Role prompting |
| 2 | [prompts-2.md](prompts-2.md) | Valeria Silva | GitHub Copilot | Zero-shot instruccional |
| 3 | [prompts-3.md](prompts-3.md) | Facundo Guiraldes | ChatGPT | Few-shot |
| 4 | [prompts-4.md](prompts-4.md) | Facundo Guiraldes | Gemini Flash | Chain-of-thought |
| 5 | [prompts-5.md](prompts-5.md) | Carola Benvenuto | GitHub Copilot (Auto) | Role prompting / instruccional |

## Comparativa de modelos

Ver [comparativa-modelos.md](comparativa-modelos.md) para el análisis
comparativo entre Claude y Gemini aplicados a tareas de revisión de código
del proyecto.

## Decisiones metodológicas (SDD)

Ver [sdd-decisions.md](sdd-decisions.md) para la investigación y decisiones
sobre Spec-Driven Development adoptadas por el equipo.


## Aclaraciones metodológicas

**Sobre la cantidad de integrantes:** El equipo está formado por 3
integrantes (Facundo Guiraldes, Valeria Silva, Carola Benvenuto), no 4. Por
la nota de la consigna para grupos de 3, Valeria asume el doble rol de
Desarrollador Frontend y Documentador/UX. Dado que se requieren 5 prompts
y el equipo tiene 3 personas, el Especialista en IA aportó 3 de los 5
prompts (además del propio, documentó una segunda opinión sobre trabajo
de sus compañeras usando otros dos modelos), lo cual es consistente con
la carga de trabajo distinta que tiene este rol respecto a los demás.

**Sobre la diversidad de modelos:** Se logró utilizar 4 modelos
genuinamente distintos (Claude, ChatGPT, Gemini Flash, GitHub Copilot). El
prompt 5 (Carola) también usó GitHub Copilot, en modo "Auto" — donde
Copilot selecciona el modelo de fondo automáticamente sin mostrarlo al
usuario. No se contó con acceso a un 5to modelo pago (como Cursor) para
evitar esta repetición, y se priorizó documentar esto con honestidad
(ver nota metodológica en `prompts-5.md`) antes que atribuir un modelo no
verificado.