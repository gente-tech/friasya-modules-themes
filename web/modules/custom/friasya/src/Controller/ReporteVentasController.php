<?php

namespace Drupal\friasya\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\node\Entity\Node;
use Symfony\Component\HttpFoundation\Request;

class ReporteVentasController extends ControllerBase {

  public function view(Request $request) {
    $fecha_param = $request->query->get('fecha');
    $fecha = $fecha_param ? strtotime($fecha_param) : strtotime('now');

    if ($fecha_param && preg_match('/^\d{4}$/', $fecha_param)) {
      $start = strtotime($fecha_param . '-01-01');
      $end = strtotime('+1 year', $start);
    } elseif ($fecha_param && preg_match('/^\d{4}-\d{2}$/', $fecha_param)) {
      $start = strtotime($fecha_param . '-01');
      $end = strtotime('+1 month', $start);
    } else {
      $start = strtotime('monday this week', $fecha);
      $end = strtotime('next monday', $fecha);
    }

    \Drupal::logger('reporte_ventas')->notice('Fechas: @start - @end', [
      '@start' => date('Y-m-d H:i:s', $start),
      '@end' => date('Y-m-d H:i:s', $end),
    ]);

    $nids = \Drupal::entityQuery('node')
      ->accessCheck(TRUE)
      ->condition('type', 'transacion')
      ->condition('created', $start, '>=')
      ->condition('created', $end, '<')
      ->execute();

    $transacciones = Node::loadMultiple($nids);
    $productos = [];
    $metodos_pago = [];

    foreach ($transacciones as $trans) {
      $producto = $trans->get('field_productos')->entity;
      $cantidad = $trans->get('field_cantidad')->value;
      $valor = $trans->get('field_valor')->value;
      $metodo = $trans->get('field_metodo_de_pago')->entity?->label();

      if ($producto) {
        $nombre = $producto->label();
        $precio = $producto->get('field_precio')->value;

        if (!isset($productos[$nombre])) {
          $productos[$nombre] = [
            'cantidad' => 0,
            'facturacion' => 0,
            'precio' => $precio,
          ];
        }

        $productos[$nombre]['cantidad'] += (int) $cantidad;
        $productos[$nombre]['facturacion'] += (int) $valor;
      }

      if ($metodo) {
        if (!isset($metodos_pago[$metodo])) {
          $metodos_pago[$metodo] = 0;
        }
        $metodos_pago[$metodo] += (int) $valor;
      }
    }

    return [
      '#theme' => 'reporte_ventas',
      '#productos' => $productos,
      '#fecha' => date('Y-m-d', $start),
      '#metodos_pago' => $metodos_pago,
      '#attached' => ['library' => ['friasya/weekly_report']],
      '#cache' => ['max-age' => 0],
    ];
  }
}
