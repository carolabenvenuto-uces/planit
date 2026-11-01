/**
 * Lógica de componentes interactivos de Bootstrap (Modal y Toast)
 * Deuda Técnica #68 - AO3
 */
document.addEventListener('DOMContentLoaded', () => {
    const modalDetalle = document.getElementById('modalDetalleServicio');
    const toastConfirmacionElement = document.getElementById('toastConfirmacion');

    // Inicialización del Modal de detalle de servicio
    if (modalDetalle) {
        const modalSumarEvento = modalDetalle.querySelector('.btn-sumar-evento');

        modalDetalle.addEventListener('show.bs.modal', (event) => {
            const trigger = event.relatedTarget;
            if (!trigger) return;

            document.getElementById('modalDetalleServicioTitulo').textContent = trigger.dataset.serviceTitle || '';
            document.getElementById('modalDetalleServicioImagen').src = trigger.dataset.serviceImage || '';
            document.getElementById('modalDetalleServicioImagen').alt = trigger.dataset.serviceAlt || '';
            document.getElementById('modalDetalleServicioDescripcion').textContent = trigger.dataset.serviceDescription || '';
            document.getElementById('modalDetalleServicioCapacidad').textContent = trigger.dataset.serviceCapacidad || '';
            document.getElementById('modalDetalleServicioDuracion').textContent = trigger.dataset.serviceDuracion || '';
            document.getElementById('modalDetalleServicioIncluye').textContent = trigger.dataset.serviceIncluye || '';
            document.getElementById('modalDetalleServicioPrecio').textContent = trigger.dataset.servicePrice || '';

            if (modalSumarEvento) {
                modalSumarEvento.dataset.serviceTitle = trigger.dataset.serviceTitle || '';
                modalSumarEvento.dataset.servicePrice = trigger.dataset.servicePrice || '';
            }
        });
    }

    // Inicialización del Toast de confirmación
    if (toastConfirmacionElement && typeof bootstrap !== 'undefined') {
        const toastConfirmacion = bootstrap.Toast.getOrCreateInstance(toastConfirmacionElement);
        const toastConfirmacionMensaje = document.getElementById('toastConfirmacionMensaje');
        const toastConfirmacionServicio = document.getElementById('toastConfirmacionServicio');

        document.querySelectorAll('.btn-sumar-evento').forEach((button) => {
            button.addEventListener('click', () => {
                const title = button.dataset.serviceTitle || 'Servicio';
                const price = button.dataset.servicePrice || '';

                toastConfirmacionElement.dataset.serviceTitle = title;
                toastConfirmacionElement.dataset.servicePrice = price;

                if (toastConfirmacionServicio) {
                    toastConfirmacionServicio.textContent = `${title} · ${price}`;
                }
                if (toastConfirmacionMensaje) {
                    toastConfirmacionMensaje.textContent = 'Experiencia agregada a tu evento';
                }

                toastConfirmacion.show();
            });
        });
    }
});