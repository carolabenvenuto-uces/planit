\# 📋 Especificación Técnica: Migración Frontend a Bootstrap v5.3

**Proyecto:** Cockpit Operativo PlanIT — Primer Parcial  
**Rol:** Desarrollador Frontend / Bootstrap  
**Rama:** `feature/dev-frontend-bootstrap-update-migration`  
**Ubicación:** `docs/03-specs/primer-parcial/spec-frontend-bootstrap.md`

---

## 1. 🎯 Objetivos de la Migración

- Integrar la librería Bootstrap v5.3 mediante los CDN oficiales de jsDelivr (`bootstrap.min.css` y `bootstrap.bundle.min.js`) en `index.html`.
- Migrar las secciones principales del sitio (Header, Catálogo de Servicios / Cockpit Operativo y Footer) al sistema de contenedores, filas y columnas de Bootstrap (`container`, `row`, `col-*`) para optimizar la adaptabilidad en dispositivos móviles.
- Crear y vincular el archivo `css/bootstrap-overrides.css` para centralizar la personalización de estilos, paleta de colores y componentes, garantizando la convivencia armónica con los estilos existentes (`styles.css`, `components.css` y `responsive.css`).
- Asegurar un diseño completamente responsivo libre de desbordamiento horizontal (`overflow`) en todos los viewports.

---

## 2. 📐 Planificación de Instalación y Secciones a Migrar

### 2.1. Instalación y CDN

- Inclusión del `<link />` CSS de Bootstrap v5.3 en el `<head>` de `index.html`.
- Inclusión del script JavaScript `bootstrap.bundle.min.js` de Bootstrap v5.3 antes del cierre de `</body>`.
- Utilización de los CDN oficiales de jsDelivr con versión explícita y atributos `integrity` y `crossorigin` cuando sean proporcionados por el CDN.
- Carga de `bootstrap-overrides.css` después de las hojas de estilo de Bootstrap para asegurar la prioridad de las personalizaciones.
- Mantener el orden de carga documentado: Bootstrap, estilos base del proyecto, componentes, responsive y overrides.

### 2.2. Header y navegación

- Envolver el encabezado en un `.container` o `.container-fluid`, según corresponda al diseño visual aprobado.
- Organizar logo, navegación y acciones mediante `.row` y columnas responsivas.
- Implementar la navegación con los componentes `navbar`, `navbar-expand-lg`, `navbar-toggler`, `navbar-collapse` y `navbar-nav`.
- Configurar el botón de navegación móvil con atributos accesibles (`type`, `data-bs-toggle`, `data-bs-target`, `aria-controls`, `aria-expanded` y `aria-label`).
- Conservar los enlaces, textos, estados activos y destinos definidos por el proyecto.
- Evitar anchos fijos que generen desplazamiento horizontal en resoluciones pequeñas.

### 2.3. Catálogo de Servicios / Cockpit Operativo

- Ubicar el contenido principal dentro de un `.container`.
- Utilizar `.row` y columnas responsivas para distribuir las tarjetas o módulos operativos.
- Configurar una grilla adaptable: `.col-12` en dispositivos móviles y `.col-md-4` (3 columnas por fila) desde tablets y escritorios.
- Migrar cada servicio a un componente visual consistente basado en `.card`, conservando iconos, títulos, descripciones, enlaces y acciones existentes.
- Aplicar utilidades de Bootstrap para espaciado, alineación, tipografía, colores y estados sin duplicar reglas innecesarias.
- Garantizar alturas visualmente consistentes sin ocultar contenido ni forzar desbordamientos.
- Mantener la semántica HTML, el orden de lectura y la accesibilidad del contenido.

### 2.4. Footer

- Envolver el pie de página en un `.container` y organizar sus bloques mediante `.row` y `.col-*`.
- Adaptar enlaces, datos de contacto, redes sociales y créditos a una distribución vertical en pantallas pequeñas.
- Conservar la información funcional y la identidad visual existente.
- Verificar que los enlaces sean utilizables mediante teclado y tengan contraste suficiente.

---

## 3. 🎨 Personalización mediante `bootstrap-overrides.css`

### 3.1. Responsabilidad del archivo

El archivo `css/bootstrap-overrides.css` será el punto central para sobrescribir variables y estilos de Bootstrap sin modificar la librería ni concentrar nuevas reglas en `index.html`. Toda personalización específica del proyecto deberá incorporarse allí, salvo estilos estrictamente propios de un componente ya definido en las hojas existentes.

### 3.2. Variables y paleta

- Definir, cuando resulte conveniente, variables CSS para colores primarios, secundarios, fondos, textos, bordes, estados y sombras.
- Mantener la paleta visual actual de PlanIT y evitar cambios de identidad no solicitados.
- Priorizar variables de Bootstrap (`--bs-primary`, `--bs-body-bg`, `--bs-body-color`, entre otras) cuando permitan una integración limpia.
- Verificar contraste de texto y controles en estados normal, hover, focus, active y disabled.

### 3.3. Componentes y utilidades

- Ajustar botones, tarjetas, navbar, formularios, enlaces y alertas para respetar el diseño existente.
- Evitar el uso generalizado de `!important`; solo podrá utilizarse cuando exista un conflicto documentado con una regla heredada.
- No sobrescribir globalmente etiquetas HTML si una clase de componente resuelve el requisito.
- Utilizar breakpoints coherentes con Bootstrap v5.3 y documentar excepciones.

---

## 4. 🧪 Registro de Evidencias

- **Prompt exacto utilizado con Figma MCP:**

```text
Usando el servidor Figma MCP y el spec docs/03-specs/primer-parcial/spec-frontend-bootstrap.md como contexto, realizá la migración de index.html a la grilla de Bootstrap v5.3 y generá css/bootstrap-overrides.css a partir del siguiente mockup de Figma: https://www.figma.com/design/iUmUArxu59WUYlBl2zR3xq/Wireframe?node-id=2078-2
```

- **Resultado obtenido:** Migración completada exitosamente en `index.html` con inclusión de Bootstrap v5.3.3 por CDN de jsDelivr. Estructuración del layout principal en columnas `col-lg-8` (contenido) y `col-lg-4` (lateral), y catálogo en grilla `col-12` en mobile y `col-md-4` en tablet. Creación y vinculación del archivo `css/bootstrap-overrides.css` mapeando la paleta de PlanIT a variables de Bootstrap (`--bs-*`).

- **Ajustes manuales realizados:**
	- **Header / Navbar:** eliminación de las reglas legacy `.site-header nav a` en `components.css` y `responsive.css` para resolver conflictos de especificidad y restaurar los estilos del logo y el contraste del botón `Nuevo Evento`.
	- **Grilla del Catálogo:** separación de las clases de columna Bootstrap (`col-12 col-md-4`) en un `<div>` wrapper exterior que envuelve a cada `<article>`, junto con la eliminación de `gap: 8px`, para corregir el colapso 2+1 y el padding del gutter en las imágenes.
	- **Reboot de Bootstrap:** incorporación de reglas de neutralización en `bootstrap-overrides.css` para restablecer `padding-left: 0` y `margin-bottom: 0` en `.task-list` y `.resumen-lista`.
	- Verificación de responsividad ejecutada con Playwright MCP en Chromium (Test Case 6), con resultado **PASS** para iPhone 14 Pro (393×852), Samsung Galaxy S23 (360×780) e iPad Air (820×1180), sin desbordamiento horizontal y con despliegue correcto de la navbar colapsable.

## 5. 📱 Requisitos de Responsividad

- El layout deberá funcionar como mínimo en 320 px, 375 px, 768 px, 992 px, 1200 px y resoluciones superiores.
- No deberá existir desplazamiento horizontal provocado por contenedores, imágenes, tablas, textos, botones o componentes.
- Aplicar `img-fluid` a imágenes responsivas y controlar dimensiones mediante CSS sin deformarlas.
- Permitir el quiebre de textos largos, URLs y etiquetas cuando sea necesario.
- Utilizar `overflow-x: hidden` únicamente como protección complementaria, nunca para ocultar un defecto estructural del layout.
- Revisar márgenes, paddings, gaps y tamaños tipográficos en los breakpoints principales.
- Garantizar que la navegación móvil sea operable sin depender de hover.

---

## 6. ♿ Accesibilidad y Calidad Semántica

- Mantener una estructura de encabezados jerárquica y un único contenido principal identificable.
- Usar elementos semánticos (`header`, `nav`, `main`, `section`, `article` y `footer`) cuando correspondan.
- Proporcionar textos alternativos descriptivos para imágenes informativas y `alt=""` para imágenes decorativas.
- Asegurar foco visible y navegación completa mediante teclado.
- Asociar etiquetas y controles de formulario correctamente.
- Mantener nombres accesibles en botones de icono y controles colapsables.
- No comunicar información exclusivamente mediante color.

---

## 7. 🗂️ Archivos y Alcance de la Implementación

### Archivos a modificar o crear

- `index.html`: inclusión de CDN, vínculo de hojas de estilo y migración del marcado principal.
- `css/bootstrap-overrides.css`: creación de las personalizaciones de Bootstrap v5.3.
- `styles.css`, `components.css` y `responsive.css`: solo ajustes mínimos necesarios para eliminar conflictos con la migración.

### Fuera de alcance

- Cambios en la lógica de negocio, APIs, persistencia o backend.
- Reemplazo de contenidos, imágenes o textos no relacionado con la migración.
- Incorporación de frameworks adicionales.
- Rediseño visual integral del producto.

---

## 8. ✅ Criterios de Aceptación

- Bootstrap v5.3 se carga correctamente desde jsDelivr y no se incluyen copias locales innecesarias.
- `bootstrap-overrides.css` existe, está vinculado y sus reglas tienen prioridad sobre las reglas base de Bootstrap cuando corresponde.
- Header, catálogo/cockpit y footer utilizan contenedores, filas y columnas de Bootstrap.
- La navegación colapsa y se expande correctamente en dispositivos móviles.
- Las tarjetas y columnas se reorganizan sin superposiciones ni contenido cortado.
- No se detecta overflow horizontal en los viewports definidos.
- Se conservan la funcionalidad, los enlaces, los contenidos y la identidad visual existentes.
- La consola del navegador no presenta errores JavaScript, recursos faltantes ni errores de carga de estilos.
- El resultado supera una revisión visual en desktop, tablet y mobile.
- La navegación por teclado y los estados de foco son funcionales.

---

## 9. 🧪 Plan de Verificación y Pruebas

1. Validar el HTML y comprobar que los recursos CDN respondan correctamente.
2. Abrir `index.html` en un navegador actualizado y revisar la consola.
3. Probar el menú responsive en cada breakpoint relevante.
4. Redimensionar la ventana desde 320 px hasta desktop y comprobar la ausencia de scroll horizontal.
5. Verificar cada tarjeta, botón, enlace, imagen y sección del catálogo.
6. Revisar contraste, foco, orden de tabulación y etiquetas accesibles.
7. Probar Chrome, Firefox y Edge en sus versiones actuales.
8. Comparar el resultado con el diseño y los estilos existentes para detectar regresiones.

---

## 10. 📦 Entregables

- `index.html` actualizado con Bootstrap v5.3 y la estructura responsiva migrada.
- `css/bootstrap-overrides.css` creado y documentado mediante comentarios breves cuando sea necesario.
- Ajustes compatibles en las hojas de estilo existentes.
- Evidencia de pruebas responsive, revisión visual y ausencia de errores en consola.
- Cambios entregados en la rama `feature/dev-frontend-bootstrap-update-migration`.

---

## 11. 📝 Consideraciones de Implementación

- Bootstrap deberá utilizarse como apoyo estructural y no como motivo para eliminar estilos de negocio o componentes existentes sin justificación.
- Las clases utilitarias deben preferirse frente a reglas CSS repetitivas cuando expresen claramente la intención.
- Las reglas nuevas deben ser específicas, mantenibles y compatibles con la cascada actual.
- Cualquier excepción al sistema de grilla, a los breakpoints o al orden de carga deberá quedar documentada en el código o en esta especificación.
- La migración se considerará finalizada únicamente cuando cumpla simultáneamente los objetivos técnicos, visuales, responsive y de accesibilidad indicados.
