# 📐 Especificación del Arquitecto de Diagramas de Actividades (AO3)

**Rol:** Arquitecto de Diagramas de Actividades  
**Integrante:** Valeria Silva  
**Matrícula:** 156612  
**Fecha de inicio:** 20/10/2026  
**Estado:** Finalizado (Fase AT CLOSE)  

---

## 🟢 FASE INITIAL (BEFORE)

### 1. Identificación de los 4 Flujos Principales
De acuerdo con las funcionalidades planificadas en `plan.md` y la estructura visual definida en el `mockup` e `index.html` del proyecto, se modelarán los siguientes 4 flujos principales siguiendo el patrón *entrada → proceso → salida*:

1. **Flujo 1: Navegación por el Menú Principal y Selección de Opción**
   - **Descripción:** Captura la opción seleccionada por el usuario en el menú interactivo (`prompt`) y la redirige al flujo de trabajo correspondiente.
   - **Actores involucrados:** Usuario y Sistema.
   - **Estructuras lógicas:** Condicional múltiple (`if-else` / `switch`) para evaluar la opción elegida y ciclo de repetición (`while`) para reiterar el menú en caso de opción inválida o hasta seleccionar salir.

2. **Flujo 2: Ingreso y Validación de Datos de Entrada**
   - **Descripción:** Solicita datos al usuario mediante `prompt()`, valida que no estén vacíos y que correspondan al tipo de dato esperado (números/rango válido).
   - **Actores involucrados:** Usuario y Sistema.
   - **Estructuras lógicas:** Ciclo `while` o `repeat` que re-solicita el dato mientras sea inválido y decisiones condicionales `if-else` para mostrar mensajes de error específicos.

3. **Flujo 3: Procesamiento y Cálculo de la Lógica de Negocio**
   - **Descripción:** Procesa los datos validados mediante algoritmos condicionales y operaciones matemáticas/colecciones (arrays/objetos) para calcular el resultado final.
   - **Actores involucrados:** Sistema.
   - **Estructuras lógicas:** Evaluaciones condicionales `if / else if / else` para aplicar reglas o descuentos según la lógica del dominio.

4. **Flujo 4: Generación y Presentación de Resultados**
   - **Descripción:** Formatea la información calculada y genera la salida visual correspondiente para el usuario a través de `alert()` o `console.log()`.
   - **Actores involucrados:** Sistema y Usuario.
   - **Estructuras lógicas:** Estructuras secuenciales y condicionales para determinar si se muestra un resultado exitoso o una notificación de advertencia.

---

### 2. Análisis y Decisión sobre Swimlanes (Particiones)
- **Criterio de aplicación:** Se utilizarán *swimlanes* (carriles) con la sintaxis `|Usuario|` y `|Sistema|` en aquellos flujos donde exista una interacción directa de entrada/salida entre la persona y la aplicación.
- **Justificación:** Los Flujos 1, 2 y 4 involucran capturar datos o mostrar alertas en pantalla, por lo que separar visualmente las acciones que realiza el **Usuario** (ingresar datos, confirmar opciones) de las responsabilidades del **Sistema** (validar inputs, procesar algoritmos, renderizar respuestas) aclara los límites de responsabilidad y facilita la comprensión del Desarrollador JavaScript.

---

### 3. Checklist de Criterios de Aceptación
- [x] **4 Diagramas completos:** Cada diagrama incluye inicio (`start`), fin (`stop`), actividades (`:Actividad;`), decisiones (`if-then-else`) y ciclos/bucles (`while`/`repeat`).
- [x] **Uso de Swimlanes:** Separación explícita de carriles `|Usuario|` y `|Sistema|` en flujos con interacción.
- [x] **Sintaxis PlantUML válida:** Todos los archivos `.puml` compilan sin errores de sintaxis.
- [x] **Exportación de artefactos:** Generación y presencia de las parejas de archivos `.puml` (fuente editable) y `.png` (imagen exportada) para los 4 flujos en `docs/05-diagramas/01-diagrama-de-actividades/`.
- [x] **Documentación general:** Creación de `docs/05-diagramas/01-diagrama-de-actividades/diagramas-doc.md` con el índice, descripciones e imágenes embebidas.
- [x] **Coherencia de diseño:** Verificación conjunta con el Desarrollador JavaScript de que la lógica modelada coincida con las funciones de `js/script.js`.

---

## 🔴 FASE FINAL (AT CLOSE)

### 1. Registro de Prompts y Contexto para GitHub Copilot Agent
* **Contextos adjuntados:** `plan.md`, `index.html`, `mockup/`
* **Prompt principal enviado:**
  ```text
  Como Arquitecto de Diagramas de Actividades para la AO3 de PlanIT, genera el código fuente en PlantUML (.puml) para los 4 flujos principales del sistema siguiendo el patrón entrada -> proceso -> salida y alineados con el dominio de la aplicación:
  1. Crear Evento en PlanIT (solicitud de datos, validación iterativa y almacenamiento).
  2. Calcular Presupuesto del Evento (recorrido de colección de ítems, aplicación de descuentos y verificación de tope).
  3. Buscar en Catálogo de Proveedores (filtrado de colección según categoría o texto buscado).
  4. Gestionar Lista de Invitados (registro y contabilización iterativa de confirmados y pendientes).
  Asegúrate de incluir nodos start, stop, swimlanes (|Usuario| y |Sistema|), decisiones condicionales y ciclos de repetición con recorrido explícito de colecciones.
  ```

---

### 2. Extracto de Código Generado y Correcciones Manuales
* **Extracto de código base generado:**
  ```plantuml
  @startuml
  |Usuario|
  start
  :Ingresar opción;
  |Sistema|
  if (¿Es válida?) then (sí)
    stop
  else (no)
    :Mostrar error;
  endif
  @enduml
  ```
* **Ajustes y Correcciones Manuales Aplicadas:**
  - **Sintaxis en ciclos `repeat`:** Se corrigió el bloqueo de compilación en PlantUML sustituyendo los nodos `stop` internos en bifurcaciones secundarias por la instrucción `break`, garantizando la correcta renderización de los caminos de salida.
  - **Delimitación de Swimlanes:** Se movieron todas las operaciones internas, algoritmos y logs técnicos (`console.log()`) al carril `|Sistema|`, reservando el carril `|Usuario|` exclusivamente para la interacción de interfaz (`prompt()` y `alert()`).
  - **Inclusión de bucles en colecciones:** Se agregaron bucles iterativos `repeat...repeat while` para recorrer arreglos de datos en los flujos de cálculo, búsqueda y gestión.

---

### 3. Trazabilidad del Rediseño y Decisiones Finales
1. **Paso de Flujos Genéricos a Flujos de Negocio de PlanIT:** Inicialmente se modelaron 4 etapas conceptuales abstractas (Menú, Validación, Cálculo y Resultados). Durante la revisión previa al desarrollo de JavaScript y Testing, el equipo decidió re-alinear la arquitectura directamente a las 4 funcionalidades reales del proyecto PlanIT:
   - *Flujo 1:* `actividad-flujo-1-crear-evento.puml`
   - *Flujo 2:* `actividad-flujo-2-calcular-presupuesto.puml`
   - *Flujo 3:* `actividad-flujo-3-buscar-catalogo.puml`
   - *Flujo 4:* `actividad-flujo-4-gestionar-invitados.puml`
2. **Justificación Técnica:** Este ajuste garantiza coherencia absoluta entre los diagramas (que actúan como contrato de implementación), el código funcional en `js/script.js` y las suites de pruebas automatizadas con Jasmine en `script.spec.js`.
3. **Sincronización de Artefactos:** Se verificó la consistencia cruzada entre los 4 archivos `.puml` editables, las 4 imágenes `.png` exportadas y las secciones de Precondición, Postcondición, Entrada y Salida documentadas en `diagramas-doc.md`.

---

### 4. Checklist Final de Verificación (Completado)
- [x] **4 Diagramas completos:** Diagramas de actividades en PlantUML con `start`, `stop`, decisiones, ciclos y swimlanes.
- [x] **Sintaxis PlantUML válida:** Archivos `.puml` compilan e imágenes `.png` exportadas correctamente.
- [x] **Estructura de archivos:** Artefactos organizados en `docs/05-diagramas/01-diagrama-de-actividades/`.
- [x] **Documentación navegable:** Archivo `diagramas-doc.md` creado con índice, descripciones e imágenes embebidas.
- [x] **Spec-Driven Development:** Fase BEFORE preservada como evidencia histórica y Fase AT CLOSE completada con la trazabilidad del rediseño y Copilot Agent.