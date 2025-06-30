// Definición manual para Datepicker en español
$.datepicker.regional['es'] = {
  closeText: 'Cerrar',
  prevText: '< Ant',
  nextText: 'Sig >',
  currentText: 'Hoy',
  monthNames: [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
  ],
  monthNamesShort: [
    'ene','feb','mar','abr','may','jun','jul',
    'ago','sep','oct','nov','dic'
  ],
  dayNames: [
    'domingo','lunes','martes','miércoles',
    'jueves','viernes','sábado'
  ],
  dayNamesShort: [
    'dom','lun','mar','mié','jue','vie','sáb'
  ],
  dayNamesMin: ['D','L','M','X','J','V','S'],
  weekHeader: 'Sm',
  dateFormat: 'dd-mm-yy',
  firstDay: 1,
  isRTL: false,
  showMonthAfterYear: false,
  yearSuffix: ''
};

// Convierte "dd-mm-aaaa" en "DíaSemana, dd-mm-aaaa"
function formatFechaConDia(fechaStr) {
  const [d, m, a] = fechaStr.split('-').map(n => parseInt(n, 10));
  const dateObj = new Date(a, m - 1, d);
  const diaSemana = dateObj.toLocaleDateString('es-ES', { weekday: 'long' });
  return diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1) + ', ' + fechaStr;
}

$(function(){
  // Horas disponibles
  const timesList = [
    '09:00','09:30','10:00','10:30'
  ];

  let selectedRawFecha = null;

  // Actualiza el <select> de horas sacando las que ya están reservadas
  function updateHorasDisabled(fechaRaw) {
    const citas = JSON.parse(localStorage.getItem('citas')) || [];
    const ocupadas = citas.filter(c => c.fechaRaw === fechaRaw).map(c => c.hora);
    const disponibles = timesList.filter(h => !ocupadas.includes(h));
    const $hora = $('#hora').empty();
    if (disponibles.length) {
      disponibles.forEach(h => $('<option>').val(h).text(h).appendTo($hora));
    } else {
      $('<option>').text('No hay turnos disponibles').prop('disabled', true).appendTo($hora);
    }
  }

  // Configuración en español
  $.datepicker.setDefaults($.datepicker.regional['es']);

  // Inicializa el calendario (datepicker)
  const $dp = $('#datepicker').datepicker({
    minDate: 0,
    dateFormat: 'dd-mm-yy',
    defaultDate: new Date(),
    beforeShowDay: function(date) {
      const hoy = new Date(); hoy.setHours(0,0,0,0);
      const d = new Date(date); d.setHours(0,0,0,0);
      const dateStr = $.datepicker.formatDate('dd-mm-yy', date);
      const citas = JSON.parse(localStorage.getItem('citas')) || [];
      const count = citas.filter(c => c.fechaRaw === dateStr).length;
      const isDomingo = date.getDay() === 0;

      // Hoy: resaltado pero no seleccionable si es domingo
      if (d.getTime() === hoy.getTime()) {
        return [ !isDomingo, 'ui-datepicker-current-day', 'Hoy' ];
      }
      // Fecha completa
      if (count >= timesList.length) {
        return [false, 'fully-booked', 'Fecha completa'];
      }
      // Domingo normal
      if (isDomingo) {
        return [false, '', 'No disponible'];
      }
      return [true, '', ''];
    },
    onSelect: function(fecha) {
      selectedRawFecha = fecha;
      $('#fechaSeleccionada').text(formatFechaConDia(fecha));
      updateHorasDisabled(fecha);
    }
  });

  // Refresca para aplicar clases de beforeShowDay
  $dp.datepicker('refresh');

  // Modal de confirmación
  const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
  let pendingCita = null;

  // Envío del formulario: abre modal
  $('#reservaForm').on('submit', function(e) {
    e.preventDefault();
    pendingCita = {
      fechaRaw: selectedRawFecha,
      fechaConDia: formatFechaConDia(selectedRawFecha),
      hora: $('#hora').val(),
      nombre: $('#nombre').val(),
      contacto: $('#contacto').val()
    };
    $('#confFecha').text(pendingCita.fechaConDia);
    $('#confHora').text(pendingCita.hora);
    $('#confNombre').text(pendingCita.nombre);
    $('#confContacto').text(pendingCita.contacto);
    confirmModal.show();
  });

  // Confirmar reserva
  $('#confirmBtn').on('click', function() {
    pendingCita.fecha = pendingCita.fechaConDia;
    const citas = JSON.parse(localStorage.getItem('citas')) || [];
    citas.push(pendingCita);
    localStorage.setItem('citas', JSON.stringify(citas));
    confirmModal.hide();
    const exitoTurnoModal = new bootstrap.Modal(document.getElementById('exitoTurnoModal'));
    exitoTurnoModal.show();
    $('#okBtn').on('click', function() {
      exitoTurnoModal.hide();
      // Programa la selección de hoy
      $dp.datepicker('setDate', new Date());
      // Refresca el calendario
      $dp.datepicker('refresh');
      // Limpia el formulario y el span
      $('#reservaForm')[0].reset();
      $('#fechaSeleccionada').text('–');
      //No se resetea la hora
      pendingCita = null;
    })
  });

  //Boton de Reservas
  $('#reservasBtn').on('click', function(){
    window.location.href = 'reservas.html';
  });


  // Botón Administrar
  //  Modal de login de administrador
  const adminLoginModal = new bootstrap.Modal(document.getElementById('adminLoginModal'));
  $('#adminBtn').on('click', function(){
    // Limpia campo y errores
    $('#adminPassword').val('');
    $('#adminLoginError').addClass('d-none');
    adminLoginModal.show();
  });

  // Manejo del submit del formulario de login
  $('#adminLoginForm').on('submit', function(e){
    e.preventDefault();
    const pwd = $('#adminPassword').val();
    if (pwd === 'barber123') {
      adminLoginModal.hide();
      window.location.href = 'admin.html';
    } else {
      $('#adminLoginError').removeClass('d-none');
      $('#adminPassword').focus().select();
    }
  });

// Cuando se muestre el modal, ponemos la imagen correcta
var imageModalEl = document.getElementById('imageModal');
imageModalEl.addEventListener('show.bs.modal', function (event) {
  var trigger = event.relatedTarget;              // el <a> que disparó el modal
  var src = trigger.getAttribute('data-bs-src');  // obtenemos la ruta de la imagen
  var modalImg = imageModalEl.querySelector('#modalImage');
  modalImg.src = src;                              // seteamos el src en el <img> del modal
});

});