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
