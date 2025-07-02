$(function(){
  let deleteIndex = null;
  const deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));

  // Recupera el array de citas guardado o un array vacío
  let citas = JSON.parse(localStorage.getItem('citas')) || [];

  /**
   * Convierte una cita a un timestamp para comparar.
   * Espera cita.fechaRaw = "dd-mm-yy" y cita.hora = "HH:MM"
   */
  function citaToTimestamp(cita) {
    const [d, m, a] = cita.fechaRaw.split('-').map(n => parseInt(n, 10));
    const [hh, mm] = cita.hora.split(':').map(n => parseInt(n, 10));
    // Mes en Date es 0-based:
    return new Date(a, m - 1, d, hh, mm).getTime();
  }

  // Función para renderizar la tabla
  function renderTabla() {
    const $tbody = $('#tablaCitas tbody');
    $tbody.empty(); // Limpiamos filas anteriores

    // Iteramos sobre cada cita y creamos una fila
    citas.forEach((cita, index) => {
      const $tr = $(`
        <tr>
          <td>${cita.fecha}</td>
          <td>${cita.hora}</td>
          <td>${cita.nombre}</td>
          <td>${cita.contacto}</td>
          <td>
            <button class="btn btn-sm btn-danger borrar" data-index="${index}">
              Borrar
            </button>
          </td>
        </tr>
      `);
      $tbody.append($tr);
    });
  }

  $('#tablaCitas').on('click', '.borrar', function(){
    // Captura el índice y abre el modal
    deleteIndex = $(this).data('index');
    deleteModal.show();
  });

  $('#sortRecentBtn').on('click', function(){
    // Orden ascendente por timestamp: la cita más próxima primero
    citas.sort((a, b) => citaToTimestamp(a) - citaToTimestamp(b));
    renderTabla();
  });


  // 4) Primera llamada para mostrar la tabla al cargar la página
  renderTabla();

  // Maneja clic en “Salir”
  $('#exitBtn').on('click', function(){
    const exitConfirmModal = new bootstrap.Modal(document.getElementById('exitConfirmModal'));
    exitConfirmModal.show();
    $('#confirmExitBtn').on('click', function(){
      exitConfirmModal.hide();
      window.location.href = 'index.html';
    })
  });




  $('#confirmDeleteBtn').on('click', function(){
    // Si hay un índice, borramos y re-renderizamos
    if (deleteIndex !== null) {
      citas.splice(deleteIndex, 1);
      localStorage.setItem('citas', JSON.stringify(citas));
      renderTabla();
      deleteIndex = null;
    }
    deleteModal.hide();
    const borradoExitosoModal = new bootstrap.Modal(document.getElementById('borradoExitosoModal'));
    borradoExitosoModal.show();
    $('#ok-Btn').on('click', function() {
      borradoExitosoModal.hide();
  })
  });
});
