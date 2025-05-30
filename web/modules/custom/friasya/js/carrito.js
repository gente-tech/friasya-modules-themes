(function ($, Drupal, once) {
  Drupal.behaviors.friasyaWeeklyReport = {
    attach: function (context, settings) {
      let carrito = {};

      // Agregar productos al carrito
      once('productosClick', '.producto-btn', context).forEach(function (element) {
        $(element).on('click', function () {
          const $item = $(this).closest('.producto-item');
          const nid = $(this).data('nid');
          const nombre = $item.find('.producto-title').text();
          const precio = parseFloat($(this).data('precio')) || 0;
          const cantidad = parseInt($item.find('.producto-cantidad').val()) || 0;

          if (cantidad > 0) {
            carrito[nid] = { nombre, precio, cantidad };
            actualizarPopupCarrito();
          }
        });
      });

      // Calcular totales en tabla de reporte
      once('calculoReporte', '.costo-input', context).forEach(function (element) {
        $(element).on('input', function () {
          const $row = $(this).closest('tr');
          const precio = parseFloat($(this).data('precio'));
          const cantidad = parseInt($(this).data('cantidad'));
          const costo = parseFloat($(this).val());

          if (!isNaN(precio) && !isNaN(costo) && !isNaN(cantidad)) {
            $row.find('.facturacion').text('$' + (precio * cantidad).toLocaleString());
            $row.find('.ganancia').text('$' + ((precio - costo) * cantidad).toLocaleString());
            $row.find('.reinversion').text('$' + (costo * cantidad).toLocaleString());
          } else {
            $row.find('.facturacion, .ganancia, .reinversion').text('$0');
          }

          actualizarTotales();
        });
      });

      // Actualizar totales en las tarjetas de producto
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

      // Botones del popup
      $('#ver-carrito-btn').on('click', function () {
        $('#popup-carrito').show();
      });

      $('#cerrar-popup').on('click', function () {
        $('#popup-carrito').hide();
      });

      $('#confirmar-pedido').on('click', function () {
        const mensaje = construirMensajeWhatsApp();
        const url = 'https://wa.me/573044318866?text=' + encodeURIComponent(mensaje);
        window.open(url, '_blank');
      });

      function actualizarPopupCarrito() {
        const $lista = $('#lista-carrito');
        $lista.empty();
        let total = 0;

        Object.values(carrito).forEach(item => {
          const subtotal = item.precio * item.cantidad;
          total += subtotal;
          $lista.append(`<li><span class="carrito-producto">${item.nombre} x ${item.cantidad} = $${subtotal.toLocaleString()}</span></li>`);
        });

        $('#total-carrito').text('Total: $' + total.toLocaleString());
      }

      function construirMensajeWhatsApp() {
        let mensaje = "Hola, deseo confirmar el siguiente pedido:%0A";
        Object.values(carrito).forEach(item => {
          mensaje += `- ${item.nombre} x ${item.cantidad} = $${(item.precio * item.cantidad).toLocaleString()}%0A`;
        });
        const total = Object.values(carrito).reduce((sum, i) => sum + i.precio * i.cantidad, 0);
        mensaje += `%0ATotal: $${total.toLocaleString()}`;
        return mensaje;
      }

      function actualizarTotales() {
        let totalFacturacion = 0;
        let totalGanancia = 0;
        let totalReinversion = 0;

        $('table.ventas-reporte tbody tr').each(function () {
          totalFacturacion += parseInt($(this).find('.facturacion').text().replace(/[^0-9]/g, '') || '0');
          totalGanancia += parseInt($(this).find('.ganancia').text().replace(/[^0-9]/g, '') || '0');
          totalReinversion += parseInt($(this).find('.reinversion').text().replace(/[^0-9]/g, '') || '0');
        });

        $('.total-facturacion').text('$' + totalFacturacion.toLocaleString());
        $('.total-ganancia').text('$' + totalGanancia.toLocaleString());
        $('.total-reinversion').text('$' + totalReinversion.toLocaleString());
      }

      // Inicialización
      actualizarTotales();
    }
  };
})(jQuery, Drupal, once);

