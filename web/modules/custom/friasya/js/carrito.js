(function ($, Drupal, once) {
  Drupal.behaviors.friasyaWeeklyReport = {
    attach: function (context, settings) {
      let carrito = {};

      // Mostrar alerta de agregado
      function mostrarAlerta(mensaje) {
        const alerta = $('<div class="alerta-carrito">' + mensaje + '</div>').appendTo('body');
        setTimeout(() => {
          alerta.fadeOut(500, function () {
            $(this).remove();
          });
        }, 3000);
      }

      // Agregar producto al carrito
      once('productosClick', '.producto-btn', context).forEach(function (element) {
        $(element).on('click', function () {
          const $item = $(this).closest('.producto-item');
          const nid = $(this).data('nid');
          const nombre = $item.find('.producto-title').text();
          const precio = parseFloat($(this).data('precio')) || 0;
          const cantidad = parseInt($item.find('.producto-cantidad').val()) || 0;

          if (cantidad > 0) {
            carrito[nid] = { nombre, precio, cantidad };
            mostrarAlerta('✔ Producto agregado al carrito');
            actualizarCarrito();
          }
        });
      });

      // Mostrar precios al cambiar cantidad
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

      // Crear y agregar popup al body
      const popupHTML = `
        <div id="popup-carrito" style="display:none;">
          <div class="popup-contenido">
            <h2>Resumen del Pedido</h2>
            <ul id="lista-carrito"></ul>
            <p id="total-carrito">Total: $0</p>
            <button id="confirmar-pedido">Confirmar pedido</button>
            <button id="cerrar-popup">Cerrar</button>
          </div>
        </div>
        <button id="ver-carrito-btn">🛒 Ver Carrito</button>
      `;
      $('body').append(popupHTML);

      // Evento botón ver carrito
      once('abrirCarrito', '#ver-carrito-btn', context).forEach(function (element) {
        $(element).on('click', function () {
          actualizarCarrito();
          $('#popup-carrito').fadeIn();
        });
      });

      // Cerrar popup
      once('cerrarPopup', '#cerrar-popup', context).forEach(function (element) {
        $(element).on('click', function () {
          $('#popup-carrito').fadeOut();
        });
      });

      // Confirmar pedido y abrir WhatsApp
      once('confirmarPedido', '#confirmar-pedido', context).forEach(function (element) {
        $(element).on('click', function () {
          const mensaje = construirMensajeWhatsApp();
          const url = 'https://wa.me/573044318866?text=' + encodeURIComponent(mensaje);
          window.open(url, '_blank');
        });
      });

      function actualizarCarrito() {
        const $lista = $('#lista-carrito');
        $lista.empty();

        let total = 0;
        Object.values(carrito).forEach(item => {
          const subtotal = item.precio * item.cantidad;
          total += subtotal;
          $lista.append(`<li>${item.nombre} x ${item.cantidad} = $${subtotal.toLocaleString()}</li>`);
        });

        $('#total-carrito').text('Total: $' + total.toLocaleString());
      }

      function construirMensajeWhatsApp() {
        let mensaje = "🛒 *Hola! Deseo hacer el siguiente pedido:*\n\n📦 *Productos:*\n";
        Object.values(carrito).forEach(item => {
          const subtotal = item.precio * item.cantidad;
          mensaje += `• ${item.nombre} — ${item.cantidad} unds — 💰 $${subtotal.toLocaleString()}\n`;
        });
        const total = Object.values(carrito).reduce((sum, i) => sum + i.precio * i.cantidad, 0);
        mensaje += `\n🧾 *Total a pagar:* $${total.toLocaleString()}\n\n¡Gracias! 😊`;
        return mensaje;
      }


    }
  };
})(jQuery, Drupal, once);
