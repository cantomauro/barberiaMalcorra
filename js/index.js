$(function () {
  $(document).ready(function () {
    $("#telefono")
      .css("cursor", "pointer")
      .hover(
        // función para cuando pase el mouse
        function () {
          $(this).css("text-decoration", "underline");
        },
        // función para cuando sale el mouse
        function () {
          $(this).css("text-decoration", "none");
        }
      );

    $("#email")
      .css("cursor", "pointer")
      .hover(
        function () {
          $(this).css("text-decoration", "underline");
        },
        function () {
          $(this).css("text-decoration", "none");
        }
      );
  });

  $('.acordeon-titulo').on('click', function () {
    const $titulo = $(this);
    const $cuerpo = $titulo.next('.acordeon-cuerpo');

    $('.acordeon-titulo').not($titulo).removeClass('active');
    $('.acordeon-cuerpo').not($cuerpo).removeClass('active');

    $titulo.toggleClass('active');
    $cuerpo.toggleClass('active');
  });

  $('.corte-item').on('click', function () {
    const $img = $(this).find('.corte-img');
    const src = $img.attr('src');
    const alt = $img.attr('alt');

    $('#modalImage').attr('src', src).attr('alt', alt);
    const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
    imageModal.show();
  });

  $('#contactoForm').on('submit', function (e) {
    const formData = {
      nombre: $('#nombre').val(),
      apellido: $('#apellido').val(),
      email: $('#email').val(),
      mensaje: $('#mensaje').val()
    };

    // validamos que no haya campos vacíos
    if (!formData.nombre || !formData.apellido || !formData.email || !formData.mensaje) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    alert('¡Gracias por tu mensaje! Te responderemos pronto.');

    this.reset();
  });

  $('#telefono').on('click', function () {
    window.location.href = 'tel:+59894488668';
  })

  $('#email').on('click', function () {
    window.location.href = 'mailto: consultas@malcorra.com'
  })
});



//----------------------------------------------------

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

// de "dd-mm-aaaa" a "DíaSemana, dd-mm-aaaa"
function formatFechaConDia(fechaStr) {
  const [d, m, a] = fechaStr.split('-').map(n => parseInt(n, 10));
  const dateObj = new Date(a, m - 1, d);
  const diaSemana = dateObj.toLocaleDateString('es-ES', { weekday: 'long' });
  return diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1) + ', ' + fechaStr;
}

//----------------------------------------------------

$(function(){
  // horas disponibles
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

  // Envío del formulario: validar y mostrar modal
  $('#reservaForm').on('submit', function(e) {
    e.preventDefault();

    // Validar que se haya seleccionado una fecha
    if (!selectedRawFecha) {
      alert('Por favor selecciona una fecha');
      return;
    }

    // Validar que se haya seleccionado una hora
    const horaSeleccionada = $('#hora').val();
    if (!horaSeleccionada) {
      alert('Por favor selecciona una hora');
      return;
    }

    // Validar nombre
    const nombreIngresado = $('#nombre').val().trim();
    if (!nombreIngresado) {
      alert('Por favor ingresa tu nombre');
      return;
    }

    // Validar contacto
    const contactoIngresado = $('#contacto').val().trim();
    if (!contactoIngresado) {
      alert('Por favor ingresa tu teléfono o email');
      return;
    }

    // Crear objeto de cita pendiente
    pendingCita = {
      fechaRaw: selectedRawFecha,
      fechaConDia: formatFechaConDia(selectedRawFecha),
      hora: horaSeleccionada,
      nombre: nombreIngresado,
      contacto: contactoIngresado
    };

    // Mostrar datos en el modal
    $('#confFecha').text(pendingCita.fechaConDia);
    $('#confHora').text(pendingCita.hora);
    $('#confNombre').text(pendingCita.nombre);
    $('#confContacto').text(pendingCita.contacto);

    // Mostrar modal
    confirmModal.show();
  });

  // Confirmar reserva
  $('#confirmBtn').on('click', function() {
    if (!pendingCita) {
      alert('Error: No hay datos de cita para confirmar');
      return;
    }

    // Agregar la fecha formateada al objeto
    pendingCita.fecha = pendingCita.fechaConDia;

    // Guardar en localStorage
    const citas = JSON.parse(localStorage.getItem('citas')) || [];
    citas.push(pendingCita);
    localStorage.setItem('citas', JSON.stringify(citas));

    // Cerrar modal de confirmación
    confirmModal.hide();

    // Mostrar modal de éxito
    const exitoTurnoModal = new bootstrap.Modal(document.getElementById('exitoTurnoModal'));
    exitoTurnoModal.show();

    // Limpiar datos después de confirmar
    $('#okBtn').off('click').on('click', function() {
      exitoTurnoModal.hide();
      // Programa la selección de hoy
      $dp.datepicker('setDate', new Date());
      // Refresca el calendario
      $dp.datepicker('refresh');
      // Limpia el formulario y el span
      $('#reservaForm')[0].reset();
      $('#fechaSeleccionada').text('–');
      // Resetear variables
      selectedRawFecha = null;
      pendingCita = null;
      // Limpiar select de horas
      $('#hora').empty().append('<option value="" disabled selected>Seleccioná una hora</option>');
    });
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
  if (imageModalEl) {
    imageModalEl.addEventListener('show.bs.modal', function (event) {
      var trigger = event.relatedTarget;              // el <a> que disparó el modal
      var src = trigger.getAttribute('data-bs-src');  // obtenemos la ruta de la imagen
      var modalImg = imageModalEl.querySelector('#modalImage');
      modalImg.src = src;                              // seteamos el src en el <img> del modal
    });
  }
});
