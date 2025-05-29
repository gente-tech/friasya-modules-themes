(function ($, Drupal, once) {
  Drupal.behaviors.friasyaWeeklyReport = {
    attach: function (context, settings) {

      // FUNCIONALIDAD 1: Click en botón de producto
      once('productosClick', '.producto-btn', context).forEach(function (element) {
        $(element).on('click', function () {
          const nid = $(this).data('nid');
          const cantidad = $(this).closest('.producto-item').find('.producto-cantidad').val();
          alert('Producto NID ' + nid + ' - Cantidad: ' + cantidad);
        });
      });

      // FUNCIONALIDAD 2: Cálculo en inputs de costo unitario (tabla de reporte)
      once('calculoReporte', '.costo-input', context).forEach(function (element) {
        $(element).on('input', function () {
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

          actualizarTotales();
        });
      });

      // FUNCIONALIDAD 3: Calcular total en tarjetas de producto (productos_disponibles)
      once('productosCantidad', '.producto-cantidad', context).forEach(function (element) {
        $(element).on('input', function () {
          const $item = $(this).closest('.producto-item');
          const cantidad = parseInt($(this).val()) || 0;
          const $btn = $item.find('.producto-btn');
          const precioUnitario = parseFloat($btn.data('precio')) || 0;
          const total = cantidad * precioUnitario;

          $item.find('.precio-unitario').text('Precio: $' + precioUnitario.toLocaleString());
          $item.find('.precio-total').text('Total: $' + total.toLocaleString());
          $btn.text('Agregar (' + cantidad + ') - Total: $' + total.toLocaleString());
        });
      });

      // Ejecutar al cargar para inicializar totales si hay datos precargados
      actualizarTotales();
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
})(jQuery, Drupal, once);






