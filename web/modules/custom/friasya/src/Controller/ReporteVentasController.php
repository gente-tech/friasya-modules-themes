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
    $tabla_horizontal = [];
    $totales_por_metodo = [];
    $domicilios_por_metodo = [];
    $total_domicilios = 0;

    // Cargar términos de la taxonomía "metodos_de_pago"
    $term_ids = \Drupal::entityQuery('taxonomy_term')
      ->accessCheck(TRUE)
      ->condition('vid', 'metodos_de_pago')
      ->execute();

    $metodos = Term::loadMultiple($term_ids);
    $metodo_labels = [];

    foreach ($metodos as $term) {
      $metodo_labels[$term->id()] = $term->label();
    }

    foreach ($transacciones as $trans) {
      // Filtrar solo tipo ingreso
      $tipo_term = $trans->get('field_tipo')->entity;
      $tipo_label = $tipo_term?->label();
      if (strtolower($tipo_label) !== 'ingreso') {
        continue;
      }

      $producto = $trans->get('field_productos')->entity;
      $cantidad = $trans->get('field_cantidad')->value;
      $valor = (int) $trans->get('field_valor')->value;
      $domicilio = (int) $trans->get('field_domicilio')->value;
      $total_domicilios += $domicilio;

      $metodo_term = $trans->get('field_metodo_de_pago')->entity;
      $metodo_id = $metodo_term?->id();
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

      if ($metodo_id && !isset($metodo_labels[$metodo_id])) {
        $metodo_labels[$metodo_id] = $metodo_label ?? 'Desconocido';
      }

      if ($metodo_id) {
        $metodos_pago[$metodo_id] = ($metodos_pago[$metodo_id] ?? 0) + $valor;
        $totales_por_metodo[$metodo_id] = ($totales_por_metodo[$metodo_id] ?? 0) + $valor;
        $domicilios_por_metodo[$metodo_id] = ($domicilios_por_metodo[$metodo_id] ?? 0) + $domicilio;
      }

      $row = [];
      foreach ($metodo_labels as $id => $label) {
        $row[$id] = ['valor' => 0, 'domicilios' => 0];
      }

      if ($metodo_id) {
        $row[$metodo_id] = [
          'valor' => $valor,
          'domicilios' => $domicilio,
        ];
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
      '#domicilios_por_metodo' => $domicilios_por_metodo,
      '#total_domicilios' => $total_domicilios,
      '#attached' => ['library' => ['friasya/weekly_report']],
      '#cache' => ['max-age' => 0],
    ];
  }
}
