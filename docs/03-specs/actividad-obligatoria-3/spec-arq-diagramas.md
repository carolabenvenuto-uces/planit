# 📐 Especificación del Arquitecto de Diagramas de Actividades (AO3)

**Rol:** Arquitecto de Diagramas de Actividades  
**Integrante:** Valeria Silva  
**Matrícula:** 156612  
**Fecha de inicio:** 20/10/2026  
**Estado:** Finalizado (Fase AT CLOSE)  

---

## 🟢 FASE INICIAL (BEFORE)

### 1. Identificación de los 4 Flujos Principales
De acuerdo con las funcionalidades planificadas en `plan.md` y la estructura visual definida en el `mockup` e `index.html` del proyecto, se modelarán los siguientes 4 flujos principales siguiendo el patrón *entrada → proceso → salida*:

1. **Flujo 1: Crear Evento en PlanIT**
   - **Descripción:** Captura los datos iniciales de un evento, valida restricciones de entrada mediante bucle interactivo e instancia el objeto en la colección.
   - **Actores involucrados:** Usuario y Sistema.
   - **Estructuras lógicas:** Ciclo de repetición (`repeat`), condiciones de validación (`if-else`) e instanciación de objetos.

2. **Flujo 2: Calcular Presupuesto del Evento**
   - **Descripción:** Recorre la colección de servicios contratados, aplica descuentos condicionales y verifica el límite de presupuesto.
   - **Actores involucrados:** Usuario y Sistema.
   - **Estructuras lógicas:** Bucle de recorrido de colecciones (`repeat...repeat while`), cálculos aritméticos y evaluaciones condicionales.

3. **Flujo 3: Buscar en Catálogo de Proveedores**
   - **Descripción:** Filtra la colección del catálogo comparando criterios de búsqueda ingresados por el usuario.
   - **Actores involucrados:** Usuario y Sistema.
   - **Estructuras lógicas:** Bucle de filtrado iterativo sobre arrays/colecciones y condiciones de coincidencia.

4. **Flujo 4: Gestionar Lista de Invitados**
   - **Descripción:** Registra invitados y recorre la colección para contabilizar asistencias confirmadas y pendientes.
   - **Actores involucrados:** Usuario y Sistema.
   - **Estructuras lógicas:** Bucle de conteo acumulativo, condicionales de estado y presentación de métricas.

---

### 2. Análisis y Decisión sobre Swimlanes (Particiones)
- **Criterio de aplicación:** Se utilizarán *swimlanes* (carriles) con la sintaxis `|Usuario|` y `|Sistema|` en aquellos flujos donde exista una interacción directa de entrada/salida entre la persona y la aplicación.
- **Justificación:** Separar visualmente las acciones que realiza el **Usuario** (`prompt()` / `alert()`) de las responsabilidades del **Sistema** (validaciones, algoritmos, registros en consola) aclara los límites de responsabilidad y facilita la comprensión del Desarrollador JavaScript.

---

### 3. Checklist de Criterios de Aceptación
- [x] **4 Diagramas completos:** Cada diagrama incluye inicio (`start`), fin (`stop`), actividades (`:Actividad;`), decisiones (`if-then-else`) y ciclos/bucles (`repeat`).
- [x] **Uso de Swimlanes:** Separación explícita de carriles `|Usuario|` y `|Sistema|` en flujos con interacción.
- [x] **Sintaxis PlantUML válida:** Todos los archivos `.puml` compilan sin errores de sintaxis.
- [x] **Exportación de artefactos:** Generación y presencia de las parejas de archivos `.puml` (fuente editable) y `.png` (imagen exportada) para los 4 flujos en `docs/05-diagramas/01-diagrama-de-actividades/`.
- [x] **Documentación general:** Creación de `docs/05-diagramas/01-diagrama-de-actividades/diagramas-doc.md` con el índice, descripciones e imágenes embebidas.
- [x] **Coherencia de diseño:** Verificación conjunta con el Desarrollador JavaScript de que la lógica modelada coincida con las funciones de `js/script.js`.

---

## 🔴 FASE FINAL (AT CLOSE)

### 1. Registro de Prompts y Contexto para GitHub Copilot Agent
- **Contextos adjuntados:** `plan.md`, `index.html`, `mockup/`
- **Prompt principal enviado:**
  ```text
  Como Arquitecto de Diagramas de Actividades para la AO3, genera el código fuente en PlantUML (.puml) para los 4 flujos principales de la aplicación siguiendo la estructura de plan.md e index.html:
  1. Crear Evento en PlanIT
  2. Calcular Presupuesto del Evento
  3. Buscar en Catálogo de Proveedores
  4. Gestionar Lista de Invitados
  Asegúrate di incluir start, stop, swimlanes (|Usuario| y |Sistema|), decisiones condicionales y bucles de repetición con recorrido de colecciones.