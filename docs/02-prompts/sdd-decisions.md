# Decisiones de Spec-Driven Development (SDD)

## ¿Qué es SDD?
Spec-Driven Development es una metodología de trabajo donde cada tarea se
especifica por escrito (qué se va a hacer, por qué, y cómo se sabrá que está
bien hecho) **antes** de empezar a codear o documentar. La especificación
funciona como contrato entre quien ejecuta la tarea y quien la revisa.

## ¿Por qué lo usamos en este proyecto?
- Evita que cada integrante interprete la consigna a su manera
- Da un criterio objetivo para las code reviews (se valida contra el spec,
  no contra la opinión del revisor)
- Deja evidencia escrita de las decisiones tomadas, útil para las entregas
  siguientes del proyecto

## ¿Cómo se implementa en esta entrega?
- Cada rol redacta su `spec-[rol].md` **antes** de escribir código o
  documentación
- Todos los specs se validan contra `plan.md` (el documento de
  requerimientos del Coordinador)
- Orden de escritura: primero `spec-ia.md` (define el template y la
  metodología), después el resto de los roles lo usan

## Template adoptado por el equipo

\`\`\`markdown
# Spec: [Nombre del rol]

## Qué se hará
- [ ] Tarea 1
- [ ] Tarea 2

## Por qué
[Justificación breve, ligada a plan.md]

## Criterios de aceptación
- [ ] Criterio verificable 1
- [ ] Criterio verificable 2
\`\`\`

## Justificación del diseño
Se eligió un formato mínimo con tres secciones porque cubre las tres
preguntas que exige la consigna (qué, por qué, criterios de aceptación) sin
agregar burocracia innecesaria para una primera entrega. El checklist de
criterios de aceptación permite verificar de forma binaria (cumple/no
cumple) en cada code review, evitando revisiones subjetivas.