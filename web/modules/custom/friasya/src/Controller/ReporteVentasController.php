<?php

namespace Drupal\friasya\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\node\Entity\Node;
use Symfony\Component\HttpFoundation\Request;

class ReporteVentasController extends ControllerBase {

  public function view(Request $request) {
    $fecha_param = $request->query->get('fecha');
    $fecha = $fecha_param ? strtotime($fecha_param) : strtotime('now');

    if ($fecha_param && strlen($fecha_param) === 7) {
      // Vista mensual
      $start = strtotime($fecha_param . '-01');
      $end = strtotime('+1 month', $start);
    } else {
      // Vista semanal según la fecha proporcionada
      $start = strtotime('monday this week', $fecha);
      $end = strtotime('sunday this week +1 day', $fecha);
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

    foreach ($transacciones as $trans) {
      $producto = $trans->get('field_productos')->entity;
      $cantidad = $trans->get('field_cantidad')->value;
      $valor = $trans->get('field_valor')->value;

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
    }

    return [
      '#theme' => 'reporte_ventas',
      '#productos' => $productos,
      '#fecha' => date('Y-m-d', $start),
      '#attached' => ['library' => ['friasya/weekly_report']],
    ];
  }
}

