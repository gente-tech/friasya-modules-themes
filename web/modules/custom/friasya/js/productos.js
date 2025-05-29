(function ($, Drupal) {
  Drupal.behaviors.productosDisponibles = {
    attach: function (context, settings) {
      $('.producto-btn', context).once('productosClick').on('click', function () {
        const nid = $(this).data('nid');
        const cantidad = $(this).siblings('.producto-cantidad').val();
        alert('Producto NID ' + nid + ' - Cantidad: ' + cantidad);
      });
    }
  };
})(jQuery, Drupal);

(function ($) {
  $(document).ready(function () {
    $('.costo-input').on('input', function () {
      const row = $(this).closest('tr');
      const precio = parseInt($(this).data('precio'));
      const cantidad = parseInt($(this).data('cantidad'));
      const costo = parseInt($(this).val());

      if (!isNaN(precio) && !isNaN(costo) && !isNaN(cantidad)) {
        const ganancia = (precio - costo) * cantidad;
        const reinversion = ganancia / 2;

        row.find('.ganancia').text('$' + ganancia.toLocaleString());
        row.find('.reinversion').text('$' + reinversion.toLocaleString());
      }
    });
  });
})(jQuery);

