$(function(){
  let deleteIndex = null;
  const deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));

  // 1) Recuperar el array de citas guardado (o un array vacío)
  let citas = JSON.parse(localStorage.getItem('citas')) || [];

  // 2) Función para renderizar la tabla
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


  // 4) Primera llamada para mostrar la tabla al cargar la página
  renderTabla();

  // Maneja clic en “Salir”
  $('#exitBtn').on('click', function(){
    if (confirm('¿Estás seguro que deseas salir del panel?')) {
      window.location.href = 'index.html';
    }
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
  });

});
