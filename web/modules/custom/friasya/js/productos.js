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
  $(document).ready(function () {
    $('.costo-input').on('input', function () {
      const $row = $(this).closest('tr');
      const precio = parseFloat($(this).data('precio'));
      const cantidad = parseInt($(this).data('cantidad'));
      const costo = parseFloat($(this).val());

      if (!isNaN(precio) && !isNaN(costo) && !isNaN(cantidad)) {
        const facturacion = precio * cantidad;
        const ganancia = (precio - costo) * cantidad;
        const reinversion = costo * cantidad;

        $row.find('.facturacion').text('$' + facturacion.toLocaleString());
        $row.find('.ganancia').text('$' + ganancia.toLocaleString());
        $row.find('.reinversion').text('$' + reinversion.toLocaleString());
      } else {
        $row.find('.facturacion, .ganancia, .reinversion').text('$0');
      }
    });
  });
})(jQuery, Drupal);


