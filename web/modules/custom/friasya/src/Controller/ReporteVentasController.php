<?php

namespace Drupal\friasya\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\node\Entity\Node;
use Drupal\taxonomy\Entity\Term;
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

    $nids = \Drupal::entityQuery('node')
      ->accessCheck(TRUE)
      ->condition('type', 'transacion')
      ->condition('created', $start, '>=')
      ->condition('created', $end, '<')
      ->execute();

    $transacciones = Node::loadMultiple($nids);
    $productos = [];
    $metodos_pago = [];

    // Carga los términos del vocabulario "metodos_de_pago"
    $metodos = Term::loadMultiple(
      \Drupal::entityQuery('taxonomy_term')
        ->condition('vid', 'metodos_de_pago')
        ->execute()
    );

    $metodo_labels = [];
    foreach ($metodos as $term) {
      $metodo_labels[$term->id()] = $term->label();
    }

    $tabla_horizontal = [];
    $totales_por_metodo = [];

    foreach ($transacciones as $trans) {
      $producto = $trans->get('field_productos')->entity;
      $cantidad = $trans->get('field_cantidad')->value;
      $valor = (int) $trans->get('field_valor')->value;
      $metodo_term = $trans->get('field_metodo_de_pago')->entity;
      $metodo_label = $metodo_term?->label();

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
        $productos[$nombre]['facturacion'] += $valor;
      }

      if ($metodo_label) {
        if (!isset($metodos_pago[$metodo_label])) {
          $metodos_pago[$metodo_label] = 0;
        }
        $metodos_pago[$metodo_label] += $valor;
      }

      // Construcción de fila horizontal
      $row = [];
      foreach ($metodo_labels as $id => $label) {
        $row[$label] = 0;
      }
      if ($metodo_label) {
        $row[$metodo_label] = $valor;
        $totales_por_metodo[$metodo_label] = ($totales_por_metodo[$metodo_label] ?? 0) + $valor;
      }
      $tabla_horizontal[] = $row;
    }

    return [
      '#theme' => 'reporte_ventas',
      '#productos' => $productos,
      '#fecha' => date('Y-m-d', $start),
      '#metodo_labels' => $metodo_labels,
      '#tabla_horizontal' => $tabla_horizontal,
      '#totales_por_metodo' => $totales_por_metodo,
      '#attached' => ['library' => ['friasya/weekly_report']],
      '#cache' => ['max-age' => 0],
    ];
  }
}

