# Especificación Técnica: Componentes Bootstrap v5.3

**Proyecto:** Cockpit Operativo PlanIT — Primer Parcial  
**Rol:** Especialista en Componentes Bootstrap  
**Rama:** `feature/dev-comp-bootstrap-modal-toast`  
**Ubicación:** `docs/03-specs/primer-parcial/spec-componentes-bootstrap.md`

## 1. Objetivo y Alcance

### Objetivo

Planificar la incorporación de los componentes interactivos Modal y Toast de Bootstrap v5.3 en el catálogo del Cockpit Operativo PlanIT, manteniendo la identidad visual existente y utilizando el bundle JavaScript oficial de Bootstrap.

### Alcance

- Incorporar un Modal para consultar la ficha técnica y la vista previa detallada de cada servicio del catálogo.
- Incorporar un Toast para confirmar de forma interactiva que un servicio fue agregado al evento.
- Mantener la compatibilidad con la grilla responsive, la paleta de PlanIT y los estilos existentes.
- Garantizar que ambos componentes sean utilizables con mouse, teclado y tecnologías de asistencia.
- No modificar la lógica de persistencia ni implementar una API: la interacción se limitará al estado de la interfaz.

## 2. Definición Técnica de Componentes

### 2.1. Modal de Bootstrap v5.3

**Uso funcional:** ficha técnica y vista previa detallada del servicio al hacer clic en un ítem del catálogo.

**Estructura prevista:**

- Un disparador por servicio del catálogo, asociado mediante `data-bs-toggle="modal"` y `data-bs-target="#serviceModal"`.
- Un contenedor raíz con las clases `modal fade`, atributo `id="serviceModal"`, `tabindex="-1"`, `aria-labelledby` y `aria-hidden="true"`.
- Estructura interna basada en `modal-dialog`, `modal-content`, `modal-header`, `modal-body` y `modal-footer`.
- Botón de cierre con las clases `btn-close`, `data-bs-dismiss="modal"`, `aria-label="Cerrar"` y foco accesible.
- Título del servicio dentro de `modal-title`, identificado por el `aria-labelledby` del modal.
- Imagen responsiva del servicio con `img-fluid` y texto alternativo descriptivo.
- Descripción completa del servicio, categoría o alcance, y precio correspondiente.
- Botón `Sumar al Evento` en el pie del modal, con `data-bs-dismiss="modal"` después de ejecutar la confirmación.
- Uso de atributos `data-*` o una fuente de datos equivalente para completar el contenido del modal según el servicio seleccionado, sin duplicar modales innecesariamente.

**Comportamiento esperado:**

- El modal se abre al seleccionar un servicio del catálogo.
- Bootstrap administra el foco, el backdrop y el cierre mediante `btn-close`, tecla `Escape` y click fuera del contenido cuando corresponda.
- El contenido no debe generar overflow horizontal en mobile, tablet ni desktop.
- La imagen debe conservar su proporción y adaptarse al ancho disponible.

### 2.2. Toast de Bootstrap v5.3

**Uso funcional:** notificación emergente e interactiva de confirmación al presionar `Sumar al Evento`.

**Estructura prevista:**

- Un contenedor global `toast-container position-fixed bottom-0 end-0` para ubicar las notificaciones en la esquina inferior derecha.
- Un elemento con las clases `toast`, `role="alert"`, `aria-live="assertive"` y `aria-atomic="true"`.
- Encabezado del toast con la identidad PlanIT y botón de cierre mediante `btn-close` y `data-bs-dismiss="toast"`.
- Mensaje visible exacto: **“Experiencia agregada a tu evento”**.
- Configuración de temporizador y auto-hide mediante Bootstrap, con duración documentada en la implementación.
- Botón de cierre disponible para descartar el toast manualmente antes de que finalice el temporizador.
- Separación visual suficiente respecto de los bordes de la pantalla y adaptación a viewports pequeños.

**Comportamiento esperado:**

- Al activar `Sumar al Evento`, el toast se muestra sin recargar la página.
- El toast permanece visible durante el intervalo configurado y luego se oculta automáticamente.
- El usuario puede cerrarlo manualmente mediante el botón de cierre.
- La notificación no debe bloquear la navegación ni ocultar controles importantes del catálogo.
- El mensaje debe ser anunciado por tecnologías de asistencia mediante los atributos ARIA definidos.

### 2.3. Integración visual y técnica

- Utilizar Bootstrap v5.3 desde el CDN y `bootstrap.bundle.min.js`, que incluye Popper para los componentes interactivos.
- Mantener la carga de `css/bootstrap-overrides.css` después de Bootstrap y de los estilos base del proyecto.
- Reutilizar las variables de color, tipografía, bordes y sombras de PlanIT mediante las variables CSS existentes y los overrides de Bootstrap.
- Evitar estilos inline salvo la configuración dinámica estrictamente necesaria para el contenido del componente.
- Mantener nombres accesibles, foco visible y orden de tabulación coherente.

## 3. Criterios de Aceptación

### Modal

- [ ] Cada ítem o acción del catálogo permite abrir la ficha técnica del servicio correspondiente.
- [ ] El modal contiene botón `btn-close`, título, imagen, descripción completa, precio y botón `Sumar al Evento`.
- [ ] El modal puede cerrarse con el botón de cierre, la tecla `Escape` y el comportamiento estándar de Bootstrap configurado.
- [ ] El contenido se adapta correctamente a 320 px, 375 px, 768 px, 992 px y resoluciones superiores.
- [ ] El foco se gestiona correctamente y el modal tiene una relación válida entre `aria-labelledby` y su título.

### Toast

- [ ] Al presionar `Sumar al Evento` se muestra un Toast sin recargar la página.
- [ ] El Toast usa `toast-container position-fixed bottom-0 end-0`.
- [ ] El mensaje visible es exactamente “Experiencia agregada a tu evento”.
- [ ] Tiene auto-hide con temporizador configurado y botón de cierre manual.
- [ ] Sus atributos `role`, `aria-live` y `aria-atomic` permiten anunciar la confirmación.
- [ ] No genera overflow horizontal ni tapa de forma permanente controles del catálogo.

### Integración y calidad

- [ ] Bootstrap v5.3 y su bundle JavaScript cargan sin errores ni recursos faltantes.
- [ ] Modal y Toast respetan la paleta y la tipografía de PlanIT mediante los overrides existentes.
- [ ] La consola del navegador no presenta errores JavaScript al abrir, cerrar o reutilizar los componentes.
- [ ] La interacción funciona con mouse y teclado.
- [ ] Se ejecutan pruebas responsive y se documentan los resultados.

## 4. Registro de Evidencias

- **Prompt utilizado:** _Pendiente de completar post-implementación._
- **Evidencia del Modal:** _Pendiente de completar post-implementación._
- **Evidencia del Toast:** _Pendiente de completar post-implementación._
- **Pruebas responsive:** _Pendiente de completar post-implementación._
- **Verificación de consola y accesibilidad:** _Pendiente de completar post-implementación._
- **Capturas o enlaces de evidencia:** _Pendiente de completar post-implementación._
- **Issues encontrados y ramas de corrección:** _Pendiente de completar post-implementación._
