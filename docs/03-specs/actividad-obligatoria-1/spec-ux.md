# Especificación Técnica (Spec) - Documentador / Diseñador UX

- **Proyecto:** PlanIT - Plataforma All-in-One de Organización & Experiencias
- **Entrega:** Actividad Obligatoria N°1
- **Rol:** Documentador / Diseñador UX
- **Responsable:** Valeria Silva (@ValeriaMSilva)
- **Rama:** `feature/doc-ux-add-readme-and-mockup`

---

## 1. Qué se va a hacer
Planificación de la interfaz de usuario (UI), estructuración del concepto de la Landing Page de PlanIT mediante mockup visual en Figma, y redacción de la especificación técnica de la experiencia de usuario (UX). Se definirá la jerarquía visual de la pantalla inicial y los componentes clave del "Cockpit Operativo".

---

## 2. Por qué se hace
Para proveer un marco conceptual y estético antes de codificar la página base en HTML5, minimizando cambios de alcance y garantizando una experiencia de usuario accesible, limpia y unificada.

---

## 3. Criterios de Aceptación (Checklist)

### Entregables del Rol
- [x] Mockup o prototipo visual creado en Figma representando la interfaz de PlanIT.
- [x] Imagen/captura del mockup subida a la ruta `docs/01-mockup/actividad-obligatoria-1/diseño-inicial.png`.
- [x] Archivo `README.md` redactado con la descripción del proyecto, datos del equipo, tecnologías utilizadas y enlace público al archivo de Figma.

### Especificaciones Técnicas del Mockup
- [x] **Validación de formato:** Imagen exportada localmente en formato PNG de alta calidad.
- [x] **Resolución optimizada:** Captura con resolución nítida para la lectura de tipografías y tablas.
- [x] **Layout de pantalla única:** Presentación clara del panel del "Cockpit" que incluye el formulario de alta y la tabla de presupuesto.
- [x] **Comportamiento sticky:** Definición teórica del panel financiero flotante que acompaña el recorrido visual en desktop.

---

## 4. Diseño asistido por IA e iteraciones de UI

### 4.A Concepto sugerido por la IA
Tomando el `plan.md` como contexto de diseño, se le solicitó a la IA (GitHub Copilot Agent) recomendaciones de layout para lograr un portal interactivo de organización de eventos. La IA sugirió una estructura centralizada basada en una landing de conversión inmediata.

### 4.B Elementos Incorporados
- **Cockpit Unificado:** La sección interactiva que combina la entrada del formulario y la respuesta inmediata de los cálculos del presupuesto en la misma pantalla.
- **Grilla de Tarjetas (Grid Layout):** El catálogo de "plancitos" recreativos maquetado en bloques independientes con imágenes relativas y precios fijos.

### 4.C Elementos Descartados y Justificación
- **Descarte de navegación por pestañas (Tabs):** Se analizó la alternativa de dividir el Cockpit en dos pestañas ("Cargar Datos" y "Presupuesto Calculado"). Sin embargo, se descartó en favor de un diseño de doble columna visible en pantalla completa (scroll vertical unificado). Esta decisión se tomó para:
  1. **Priorizar la accesibilidad (a11y):** Los lectores de pantalla de usuarios con discapacidad visual conservan mucho mejor la referencia estructural en un flujo lineal continuo sin necesidad de gestionar focos dinámicos de pestañas.
  2. **Mantener una semántica limpia en HTML5:** Permite construir un prototipo funcional robusto para la Entrega 1 utilizando solo maquetación semántica sin depender de lógica dinámica obligatoria en JavaScript, la cual será incorporada formalmente en la Entrega 3.

### 4.D Nota sobre Responsividad (Diseño Líquido)
El mockup visual actual ha sido diseñado tomando como referencia una resolución de pantalla de escritorio (Desktop). La adaptabilidad para dispositivos móviles (Responsive Design) será abordada en la **Entrega 2** del proyecto mediante la aplicación de hojas de estilo (CSS) con Flexbox y Media Queries, donde las columnas de visualización se apilarán verticalmente de manera fluida.

---

## 5. Validación de Enlaces y Figma
Se confirma que el enlace al prototipo de Figma incorporado en el `README.md` ha sido configurado como **público (acceso permitido para cualquier usuario sin requerir inicio de sesión en Figma)** y apunta directamente al frame final del Cockpit.
