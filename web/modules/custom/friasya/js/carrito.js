(function ($, Drupal, once) {
  Drupal.behaviors.friasyaWeeklyReport = {
    attach: function (context, settings) {

      let carrito = {};

      // FUNCIONALIDAD 1: Click en botón de producto
      once('productosClick', '.producto-btn', context).forEach(function (element) {
        $(element).on('click', function () {
          const $item = $(this).closest('.producto-item');
          const nid = $(this).data('nid');
          const nombre = $item.find('.producto-title').text();
          const precio = parseFloat($(this).data('precio')) || 0;
          const cantidad = parseInt($item.find('.producto-cantidad').val()) || 0;

          if (cantidad > 0) {
            carrito[nid] = { nombre, precio, cantidad };
            mostrarMensajeTemporal('✅ Producto agregado al carrito');
            actualizarCarrito();
          }
        });
      });

      // FUNCIONALIDAD 2: Cálculo en inputs de costo unitario
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

      // FUNCIONALIDAD 3: Actualizar totales en tarjetas de producto
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

      // Crear popup solo si no existe
      if ($('#popup-carrito').length === 0 && $('#abrir-carrito').length === 0) {
        const popupHtml = `
          <div id="popup-carrito" style="display:none; position:fixed; top:10%; left:50%; transform:translateX(-50%); background:#fff; padding:20px; border:1px solid #ccc; z-index:9999; max-width:400px; box-shadow: 0 0 20px rgba(0,0,0,0.2); border-radius: 10px;">
            <h3 style="margin-top:0;">🛒 Resumen del Pedido</h3>
            <ul id="lista-carrito" style="list-style:none; padding:0; margin:0 0 10px 0;"></ul>
            <p style="font-weight:bold; color:green;">Total: <span id="carrito-total">$0</span></p>
            <button id="confirmar-pedido" style="background:green; color:white; padding:8px 12px; border:none; border-radius:5px;">Confirmar pedido</button>
            <button id="cerrar-popup" style="margin-left:10px; background:#ccc; border:none; padding:8px 12px; border-radius:5px;">Cerrar</button>
          </div>
          <button id="abrir-carrito" style="position:fixed; bottom:20px; right:20px; z-index:9999; background:#0074d9; color:#fff; border:none; padding:10px 20px; border-radius:5px;">🛒 Ver carrito</button>
        `;
        $('body').append(popupHtml);
      }

      // Eventos popup
      $('body').on('click', '#abrir-carrito', function () {
        actualizarCarrito();
        $('#popup-carrito').fadeIn();
      });

      $('body').on('click', '#cerrar-popup', function () {
        $('#popup-carrito').fadeOut();
      });

      $('body').on('click', '#confirmar-pedido', function () {
        const mensaje = construirMensajeWhatsApp();
        const url = 'https://wa.me/573044318866?text=' + encodeURIComponent(mensaje);
        window.open(url, '_blank');
      });

      function actualizarCarrito() {
        const $lista = $('#lista-carrito');
        $lista.empty();

        let total = 0;
        Object.values(carrito).forEach(item => {
          const subtotal = item.precio * item.cantidad;
          total += subtotal;
          $lista.append(`
            <li style="border-left:4px solid orange; padding:6px 10px; margin:4px 0; background:#f9f9f9;">
              ${item.nombre} x ${item.cantidad} = $${subtotal.toLocaleString()}
            </li>
          `);
        });

        $('#carrito-total').text('$' + total.toLocaleString());
      }

      function construirMensajeWhatsApp() {
        let mensaje = "🛒 *Hola! Deseo hacer el siguiente pedido:*\n\n📦 *Productos:*\n";
        Object.values(carrito).forEach(item => {
          const subtotal = item.precio * item.cantidad;
          mensaje += `• ${item.nombre} — ${item.cantidad} unds — 💰 $${subtotal.toLocaleString()}\n`;
        });
        const total = Object.values(carrito).reduce((sum, i) => sum + i.precio * i.cantidad, 0);
        mensaje += `\n🧾 *Total a pagar:* $${total.toLocaleString()}\n+domicilio\n\n¡Gracias! 😊`;
        return mensaje;
      }


      function mostrarMensajeTemporal(texto) {
        const msg = $('<div class="mensaje-agregado">' + texto + '</div>');
        $('body').append(msg);
        setTimeout(() => msg.fadeOut(500, () => msg.remove()), 2000);
      }

      // Inicializar totales en tabla si existen
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

