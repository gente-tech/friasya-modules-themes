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
  function actualizarTotales() {
    let totalFacturacion = 0;
    let totalGanancia = 0;
    let totalReinversion = 0;

    $('table.ventas-reporte tbody tr').each(function () {
      const fact = $(this).find('.facturacion').text().replace(/[^0-9]/g, '') || '0';
      const gan = $(this).find('.ganancia').text().replace(/[^0-9]/g, '') || '0';
      const reinv = $(this).find('.reinversion').text().replace(/[^0-9]/g, '') || '0';

      totalFacturacion += parseInt(fact);
      totalGanancia += parseInt(gan);
      totalReinversion += parseInt(reinv);
    });

    $('.total-facturacion').text('$' + totalFacturacion.toLocaleString());
    $('.total-ganancia').text('$' + totalGanancia.toLocaleString());
    $('.total-reinversion').text('$' + totalReinversion.toLocaleString());
  }

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

      // Actualizar totales después de cada input
      actualizarTotales();
    });

    // Ejecutar una vez al cargar por si hay datos prellenados
    actualizarTotales();
  });
})(jQuery, Drupal);




