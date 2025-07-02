$(function () {
  $(document).ready(function () {
    $("#telefono")
      .css("cursor", "pointer")
      .hover(
        function () {
          $(this).css("text-decoration", "underline");
        },
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