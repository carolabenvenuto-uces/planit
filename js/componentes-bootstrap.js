const modalDetalle = document.getElementById('modalDetalleServicio');
const toastConfirmacionElement = document.getElementById('toastConfirmacion');
const toastConfirmacion = bootstrap.Toast.getOrCreateInstance(toastConfirmacionElement);
const toastConfirmacionMensaje = document.getElementById('toastConfirmacionMensaje');
const toastConfirmacionServicio = document.getElementById('toastConfirmacionServicio');
const modalSumarEvento = modalDetalle.querySelector('.btn-sumar-evento');

modalDetalle.addEventListener('show.bs.modal', (event) => {
    const trigger = event.relatedTarget;
    if (!trigger) return;

    document.getElementById('modalDetalleServicioTitulo').textContent = trigger.dataset.serviceTitle;
    document.getElementById('modalDetalleServicioImagen').src = trigger.dataset.serviceImage;
    document.getElementById('modalDetalleServicioImagen').alt = trigger.dataset.serviceAlt;
    document.getElementById('modalDetalleServicioDescripcion').textContent = trigger.dataset.serviceDescription;
    document.getElementById('modalDetalleServicioCapacidad').textContent = trigger.dataset.serviceCapacidad;
    document.getElementById('modalDetalleServicioDuracion').textContent = trigger.dataset.serviceDuracion;
    document.getElementById('modalDetalleServicioIncluye').textContent = trigger.dataset.serviceIncluye;
    document.getElementById('modalDetalleServicioPrecio').textContent = trigger.dataset.servicePrice;
    modalSumarEvento.dataset.serviceTitle = trigger.dataset.serviceTitle;
    modalSumarEvento.dataset.servicePrice = trigger.dataset.servicePrice;
});

document.querySelectorAll('.btn-sumar-evento').forEach((button) => {
    button.addEventListener('click', () => {
        const title = button.dataset.serviceTitle;
        const price = button.dataset.servicePrice;
        toastConfirmacionElement.dataset.serviceTitle = title;
        toastConfirmacionElement.dataset.servicePrice = price;
        toastConfirmacionServicio.textContent = `${title} · ${price}`;
        toastConfirmacionMensaje.textContent = 'Experiencia agregada a tu evento';
        toastConfirmacion.show();
    });
});
