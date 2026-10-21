# 📐 Especificación del Arquitecto de Diagramas de Actividades (AO3)

**Rol:** Arquitecto de Diagramas de Actividades  
**Integrante:** Valeria Silva  
**Fecha de inicio:** 20/10/2026  
**Estado:** En Progreso (Fase BEFORE)  

---

## 🟢 FASE INICIAL (BEFORE)

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
- [ ] **4 Diagramas completos:** Cada diagrama incluye inicio (`start`), fin (`stop`), actividades (`:Actividad;`), decisiones (`if-then-else`) y ciclos/bucles (`while`/`repeat`).
- [ ] **Uso de Swimlanes:** Separación explícita de carriles `|Usuario|` y `|Sistema|` en flujos con interacción.
- [ ] **Sintaxis PlantUML válida:** Todos los archivos `.puml` compilan sin errores de sintaxis.
- [ ] **Exportación de artefactos:** Generación y presencia de las parejas de archivos `.puml` (fuente editable) y `.png` (imagen exportada) para los 4 flujos en `docs/05-diagramas/01-diagrama-de-actividades/`.
- [ ] **Documentación general:** Creación de `docs/05-diagramas/01-diagrama-de-actividades/diagramas-doc.md` con el índice, descripciones e imágenes embebidas.
- [ ] **Coherencia de diseño:** Verificación conjunta con el Desarrollador JavaScript de que la lógica modelada coincida con las funciones de `js/script.js`.

---

## 🔴 FASE FINAL (AT CLOSE)
*(Esta sección se completará al finalizar el modelado con la evidencia de GitHub Copilot Agent)*

- [ ] **Prompts de Copilot Agent Mode:** Prompts exactos utilizados especificando contextos adjuntos (`plan.md`, `index.html`, mockup).
- [ ] **Extracto `.puml` y Correcciones Manuales:** Fragmentos del código generado y detalle de ajustes manuales aplicados.
- [ ] **Decisiones de Diseño Finales:** Explicación técnica de la estructura final de los diagramas.